/**
 * FinalCommentsModal Edge Cases Tests
 * TDD Phase: RED - Writing failing tests first
 * Reference: US-FC-REFACTOR-004
 *
 * Testing edge cases and validation:
 * - Empty/whitespace comment handling
 * - Character limit when combining comments
 * - Special characters preservation
 * - Missing outcome comments
 * - Very long comments that exceed limit when combined
 */

import { render, screen, fireEvent } from '../../../test-utils'
import { FinalCommentsModal } from '../FinalCommentsModal'
import { usePersonalizedComments } from '../../../hooks/usePersonalizedComments'
import { useOutcomeComments } from '../../../hooks/useOutcomeComments'
import type { Class, FinalComment, PersonalizedComment, OutcomeComment } from '../../../types'

// Mock the hooks
jest.mock('../../../hooks/usePersonalizedComments')
jest.mock('../../../hooks/useOutcomeComments')

const mockUsePersonalizedComments = usePersonalizedComments as jest.MockedFunction<
  typeof usePersonalizedComments
>

const mockUseOutcomeComments = useOutcomeComments as jest.MockedFunction<
  typeof useOutcomeComments
>

const mockClass: Class = {
  id: '65a1b2c3d4e5f6g7h8i9j0k1',
  name: 'Mathematics 101',
  year: 2024,
  subjectId: 5,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
}

const mockFinalComments: FinalComment[] = []

const mockHandlers = {
  onCreateComment: jest.fn(),
  onUpdateComment: jest.fn(),
  onDeleteComment: jest.fn(),
}

describe('US-FC-REFACTOR-004: Edge Cases & Validation', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUsePersonalizedComments.mockReturnValue({
      personalizedComments: [],
      loading: false,
      error: null,
      loadPersonalizedComments: jest.fn(),
      createComment: jest.fn(),
      updateComment: jest.fn(),
      deleteComment: jest.fn(),
      clearError: jest.fn(),
    })
    mockUseOutcomeComments.mockReturnValue({
      outcomeComments: [],
      loading: false,
      error: null,
      loadOutcomeComments: jest.fn(),
    })
  })

  describe('EC1: Character limit validation when combining comments', () => {
    it('should handle combined comments that exceed 1000 character limit', () => {
      // Create very long outcome and personal comments
      const longOutcomeComment: OutcomeComment = {
        id: '65a1b2c3d4e5f6g7h8i9j0k1',
        subjectId: 5,
        lowerRange: 90,
        upperRange: 100,
        comment: 'A'.repeat(600), // 600 chars
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      }

      const longPersonalComment: PersonalizedComment = {
        id: '65a1b2c3d4e5f6g7h8i9j0k1',
        comment: 'B'.repeat(500), // 500 chars
        subjectId: 5,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      }

      mockUseOutcomeComments.mockReturnValue({
        outcomeComments: [longOutcomeComment],
        loading: false,
        error: null,
        loadOutcomeComments: jest.fn(),
      })

      mockUsePersonalizedComments.mockReturnValue({
        personalizedComments: [longPersonalComment],
        loading: false,
        error: null,
        loadPersonalizedComments: jest.fn(),
        createComment: jest.fn(),
        updateComment: jest.fn(),
        deleteComment: jest.fn(),
        clearError: jest.fn(),
      })

      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={mockFinalComments}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      // Select outcome comment (enter grade)
      const gradeInput = screen.getByRole('spinbutton', { name: /Grade/i })
      fireEvent.change(gradeInput, { target: { value: '95' } })

      // Select personal comment
      const searchInput = screen.getByLabelText(/Personalized Comment/i)
      fireEvent.focus(searchInput)
      const commentOption = screen.getByText('B'.repeat(500))
      fireEvent.click(commentOption)

      // Click populate button
      const populateButton = screen.getByRole('button', { name: /Populate with Above Comments/i })
      fireEvent.click(populateButton)

      // Verify textarea is truncated to 1000 characters
      const finalCommentTextarea = screen.getByLabelText(/^Comment$/i) as HTMLTextAreaElement
      expect(finalCommentTextarea.value.length).toBeLessThanOrEqual(1000)

      // Should show a warning or truncate gracefully
      expect(finalCommentTextarea.value).toBeTruthy()
    })

    it('should handle outcome comment exactly at 1000 character limit', () => {
      const maxLengthComment: OutcomeComment = {
        id: '65a1b2c3d4e5f6g7h8i9j0k1',
        subjectId: 5,
        lowerRange: 90,
        upperRange: 100,
        comment: 'A'.repeat(1000), // Exactly 1000 chars
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      }

      mockUseOutcomeComments.mockReturnValue({
        outcomeComments: [maxLengthComment],
        loading: false,
        error: null,
        loadOutcomeComments: jest.fn(),
      })

      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={mockFinalComments}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      const gradeInput = screen.getByRole('spinbutton', { name: /Grade/i })
      fireEvent.change(gradeInput, { target: { value: '95' } })

      const populateButton = screen.getByRole('button', { name: /Populate with Above Comments/i })
      fireEvent.click(populateButton)

      const finalCommentTextarea = screen.getByLabelText(/^Comment$/i) as HTMLTextAreaElement
      expect(finalCommentTextarea.value.length).toBe(1000)
    })
  })

  describe('EC2: Special characters preservation', () => {
    it('should preserve special characters in outcome comments', () => {
      const specialCharsComment: OutcomeComment = {
        id: '65a1b2c3d4e5f6g7h8i9j0k1',
        subjectId: 5,
        lowerRange: 90,
        upperRange: 100,
        comment: "Demonstrates strong understanding! Great work @ 95%+ level. It's amazing! <script>alert('xss')</script>",
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      }

      mockUseOutcomeComments.mockReturnValue({
        outcomeComments: [specialCharsComment],
        loading: false,
        error: null,
        loadOutcomeComments: jest.fn(),
      })

      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={mockFinalComments}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      const gradeInput = screen.getByRole('spinbutton', { name: /Grade/i })
      fireEvent.change(gradeInput, { target: { value: '95' } })

      const populateButton = screen.getByRole('button', { name: /Populate with Above Comments/i })
      fireEvent.click(populateButton)

      const finalCommentTextarea = screen.getByLabelText(/^Comment$/i) as HTMLTextAreaElement
      // Should preserve special characters exactly as-is
      expect(finalCommentTextarea.value).toBe(specialCharsComment.comment)
    })

    it('should preserve unicode characters and emojis', () => {
      const unicodeComment: PersonalizedComment = {
        id: '65a1b2c3d4e5f6g7h8i9j0k1',
        comment: 'Excellent work this semester! 🎉 Keep it up! 你好',
        subjectId: 5,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      }

      mockUsePersonalizedComments.mockReturnValue({
        personalizedComments: [unicodeComment],
        loading: false,
        error: null,
        loadPersonalizedComments: jest.fn(),
        createComment: jest.fn(),
        updateComment: jest.fn(),
        deleteComment: jest.fn(),
        clearError: jest.fn(),
      })

      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={mockFinalComments}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      const searchInput = screen.getByLabelText(/Personalized Comment/i)
      fireEvent.focus(searchInput)
      const commentOption = screen.getByText(unicodeComment.comment)
      fireEvent.click(commentOption)

      const populateButton = screen.getByRole('button', { name: /Populate with Above Comments/i })
      fireEvent.click(populateButton)

      const finalCommentTextarea = screen.getByLabelText(/^Comment$/i) as HTMLTextAreaElement
      expect(finalCommentTextarea.value).toBe(unicodeComment.comment)
    })
  })

  describe('EC3: Missing outcome comments handling', () => {
    it('should handle grade outside outcome comment ranges gracefully', () => {
      const limitedOutcomeComments: OutcomeComment[] = [
        {
          id: '65a1b2c3d4e5f6g7h8i9j0k1',
          subjectId: 5,
          lowerRange: 80,
          upperRange: 100,
          comment: 'Excellent work',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      ]

      mockUseOutcomeComments.mockReturnValue({
        outcomeComments: limitedOutcomeComments,
        loading: false,
        error: null,
        loadOutcomeComments: jest.fn(),
      })

      const personalComment: PersonalizedComment = {
        id: '65a1b2c3d4e5f6g7h8i9j0k1',
        comment: 'Good effort this semester',
        subjectId: 5,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      }

      mockUsePersonalizedComments.mockReturnValue({
        personalizedComments: [personalComment],
        loading: false,
        error: null,
        loadPersonalizedComments: jest.fn(),
        createComment: jest.fn(),
        updateComment: jest.fn(),
        deleteComment: jest.fn(),
        clearError: jest.fn(),
      })

      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={mockFinalComments}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      // Enter grade outside range (70 - no matching outcome comment)
      const gradeInput = screen.getByRole('spinbutton', { name: /Grade/i })
      fireEvent.change(gradeInput, { target: { value: '70' } })

      // Select personal comment
      const searchInput = screen.getByLabelText(/Personalized Comment/i)
      fireEvent.focus(searchInput)
      const commentOption = screen.getByText('Good effort this semester')
      fireEvent.click(commentOption)

      // Populate button should still work (personal comment only)
      const populateButton = screen.getByRole('button', { name: /Populate with Above Comments/i })
      expect(populateButton).not.toBeDisabled()

      fireEvent.click(populateButton)

      // Should populate with personal comment only
      const finalCommentTextarea = screen.getByLabelText(/^Comment$/i) as HTMLTextAreaElement
      expect(finalCommentTextarea.value).toBe('Good effort this semester')
    })
  })

  describe('EC4: Empty/whitespace handling', () => {
    it('should handle whitespace-only outcome comments', () => {
      const whitespaceComment: OutcomeComment = {
        id: '65a1b2c3d4e5f6g7h8i9j0k1',
        subjectId: 5,
        lowerRange: 90,
        upperRange: 100,
        comment: '   ', // Whitespace only
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      }

      mockUseOutcomeComments.mockReturnValue({
        outcomeComments: [whitespaceComment],
        loading: false,
        error: null,
        loadOutcomeComments: jest.fn(),
      })

      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={mockFinalComments}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      const gradeInput = screen.getByRole('spinbutton', { name: /Grade/i })
      fireEvent.change(gradeInput, { target: { value: '95' } })

      // Populate button should be disabled (whitespace is not valid content)
      const populateButton = screen.getByRole('button', { name: /Populate with Above Comments/i })
      expect(populateButton).toBeDisabled()
    })

    it('should trim leading/trailing whitespace when populating', () => {
      const whitespaceComment: OutcomeComment = {
        id: '65a1b2c3d4e5f6g7h8i9j0k1',
        subjectId: 5,
        lowerRange: 90,
        upperRange: 100,
        comment: '  Excellent work  ', // Leading/trailing whitespace
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      }

      mockUseOutcomeComments.mockReturnValue({
        outcomeComments: [whitespaceComment],
        loading: false,
        error: null,
        loadOutcomeComments: jest.fn(),
      })

      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={mockFinalComments}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      const gradeInput = screen.getByRole('spinbutton', { name: /Grade/i })
      fireEvent.change(gradeInput, { target: { value: '95' } })

      const populateButton = screen.getByRole('button', { name: /Populate with Above Comments/i })
      fireEvent.click(populateButton)

      const finalCommentTextarea = screen.getByLabelText(/^Comment$/i) as HTMLTextAreaElement
      // Should trim whitespace
      expect(finalCommentTextarea.value).toBe('Excellent work')
    })
  })
})
