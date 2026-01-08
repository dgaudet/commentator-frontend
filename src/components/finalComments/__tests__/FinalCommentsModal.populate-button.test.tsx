/**
 * FinalCommentsModal Populate Button Integration Tests
 * TDD Phase: RED - Writing failing tests first
 * Reference: US-FC-REFACTOR-003
 *
 * Testing "Populate with Above Comments" button functionality:
 * - Button rendering and positioning
 * - Enable/disable logic based on selected comments
 * - Population logic (outcome only, personal only, both)
 * - Overwrite confirmation dialog
 * - Focus management
 */

import { render, screen, fireEvent, waitFor } from '../../../test-utils'
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

const mockPersonalizedComments: PersonalizedComment[] = [
  {
    id: '65a1b2c3d4e5f6g7h8i9j0k1',
    comment: 'Excellent work this semester',
    subjectId: 5,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
]

const mockOutcomeComments: OutcomeComment[] = [
  {
    id: '65a1b2c3d4e5f6g7h8i9j0k1',
    subjectId: 5,
    lowerRange: 90,
    upperRange: 100,
    comment: 'Demonstrates strong understanding of algebraic concepts',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
]

const mockHandlers = {
  onCreateComment: jest.fn(),
  onUpdateComment: jest.fn(),
  onDeleteComment: jest.fn(),
}

describe('US-FC-REFACTOR-003: Populate with Above Comments Button', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUsePersonalizedComments.mockReturnValue({
      personalizedComments: mockPersonalizedComments,
      loading: false,
      error: null,
      loadPersonalizedComments: jest.fn(),
      createComment: jest.fn(),
      updateComment: jest.fn(),
      deleteComment: jest.fn(),
      clearError: jest.fn(),
    })
    mockUseOutcomeComments.mockReturnValue({
      outcomeComments: mockOutcomeComments,
      loading: false,
      error: null,
      loadOutcomeComments: jest.fn(),
    })
  })

  describe('AC1: Button placement and visibility', () => {
    it('should render "Populate with Above Comments" button in Add form', () => {
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

      expect(screen.getByRole('button', { name: /Populate with Above Comments/i })).toBeInTheDocument()
    })

    it('should position button between personal comment typeahead and final comment textarea', () => {
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

      const personalCommentInput = screen.getByLabelText(/Personalized Comment \(Optional\)/i)
      const populateButton = screen.getByRole('button', { name: /Populate with Above Comments/i })
      const finalCommentTextarea = screen.getByLabelText(/^Comment$/i)

      // Check DOM order: Personalized Comment -> Populate Button -> Final Comment
      expect(personalCommentInput.compareDocumentPosition(populateButton))
        .toBe(Node.DOCUMENT_POSITION_FOLLOWING)
      expect(populateButton.compareDocumentPosition(finalCommentTextarea))
        .toBe(Node.DOCUMENT_POSITION_FOLLOWING)
    })
  })

  describe('AC2: Button enabled state logic', () => {
    it('should disable button when no comments are selected', () => {
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

      const populateButton = screen.getByRole('button', { name: /Populate with Above Comments/i })
      expect(populateButton).toBeDisabled()
    })

    it('should enable button when outcome comment is selected (grade entered)', () => {
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
      expect(populateButton).not.toBeDisabled()
    })

    it('should enable button when personal comment is selected', () => {
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

      const searchInput = screen.getByLabelText(/Personalized Comment \(Optional\)/i)
      fireEvent.focus(searchInput)

      const commentOption = screen.getByText('Excellent work this semester')
      fireEvent.click(commentOption)

      const populateButton = screen.getByRole('button', { name: /Populate with Above Comments/i })
      expect(populateButton).not.toBeDisabled()
    })
  })

  describe('AC3: Populate with outcome comment only', () => {
    it('should populate final comment with outcome comment when only outcome is selected', () => {
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

      // Select outcome comment by entering grade
      const gradeInput = screen.getByRole('spinbutton', { name: /Grade/i })
      fireEvent.change(gradeInput, { target: { value: '95' } })

      // Click populate button
      const populateButton = screen.getByRole('button', { name: /Populate with Above Comments/i })
      fireEvent.click(populateButton)

      // Verify final comment textarea contains outcome comment
      const finalCommentTextarea = screen.getByLabelText(/^Comment$/i) as HTMLTextAreaElement
      expect(finalCommentTextarea.value).toBe('Demonstrates strong understanding of algebraic concepts')
    })
  })

  describe('AC4: Populate with personal comment only', () => {
    it('should populate final comment with personal comment when only personal is selected', () => {
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

      // Select personal comment
      const searchInput = screen.getByLabelText(/Personalized Comment \(Optional\)/i)
      fireEvent.focus(searchInput)

      const commentOption = screen.getByText('Excellent work this semester')
      fireEvent.click(commentOption)

      // Click populate button
      const populateButton = screen.getByRole('button', { name: /Populate with Above Comments/i })
      fireEvent.click(populateButton)

      // Verify final comment textarea contains personal comment
      const finalCommentTextarea = screen.getByLabelText(/^Comment$/i) as HTMLTextAreaElement
      expect(finalCommentTextarea.value).toBe('Excellent work this semester')
    })
  })

  describe('AC5: Populate with both comments', () => {
    it('should populate final comment with both comments in correct order (outcome first, personal second)', () => {
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

      // Select outcome comment by entering grade
      const gradeInput = screen.getByRole('spinbutton', { name: /Grade/i })
      fireEvent.change(gradeInput, { target: { value: '95' } })

      // Select personal comment
      const searchInput = screen.getByLabelText(/Personalized Comment \(Optional\)/i)
      fireEvent.focus(searchInput)

      const commentOption = screen.getByText('Excellent work this semester')
      fireEvent.click(commentOption)

      // Click populate button
      const populateButton = screen.getByRole('button', { name: /Populate with Above Comments/i })
      fireEvent.click(populateButton)

      // Verify final comment textarea contains both comments with space separator
      const finalCommentTextarea = screen.getByLabelText(/^Comment$/i) as HTMLTextAreaElement
      expect(finalCommentTextarea.value).toBe('Demonstrates strong understanding of algebraic concepts Excellent work this semester')
    })
  })

  describe('AC6: Overwrite confirmation', () => {
    it('should show confirmation dialog when textarea already has text', async () => {
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

      // Type some text in final comment textarea
      const finalCommentTextarea = screen.getByLabelText(/^Comment$/i)
      fireEvent.change(finalCommentTextarea, { target: { value: 'Existing comment text' } })

      // Select outcome comment
      const gradeInput = screen.getByRole('spinbutton', { name: /Grade/i })
      fireEvent.change(gradeInput, { target: { value: '95' } })

      // Click populate button
      const populateButton = screen.getByRole('button', { name: /Populate with Above Comments/i })
      fireEvent.click(populateButton)

      // Verify confirmation dialog appears
      await waitFor(() => {
        expect(screen.getByText(/This will replace your current comment/i)).toBeInTheDocument()
      })
    })

    it('should not replace text when user cancels confirmation', async () => {
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

      // Type some text
      const finalCommentTextarea = screen.getByLabelText(/^Comment$/i) as HTMLTextAreaElement
      fireEvent.change(finalCommentTextarea, { target: { value: 'Existing comment text' } })

      // Select outcome comment
      const gradeInput = screen.getByRole('spinbutton', { name: /Grade/i })
      fireEvent.change(gradeInput, { target: { value: '95' } })

      // Click populate button
      const populateButton = screen.getByRole('button', { name: /Populate with Above Comments/i })
      fireEvent.click(populateButton)

      // Click Cancel in confirmation dialog
      const cancelButton = await screen.findByRole('button', { name: /Cancel/i })
      fireEvent.click(cancelButton)

      // Verify original text remains
      expect(finalCommentTextarea.value).toBe('Existing comment text')
    })

    it('should replace text when user confirms', async () => {
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

      // Type some text
      const finalCommentTextarea = screen.getByLabelText(/^Comment$/i) as HTMLTextAreaElement
      fireEvent.change(finalCommentTextarea, { target: { value: 'Existing comment text' } })

      // Select outcome comment
      const gradeInput = screen.getByRole('spinbutton', { name: /Grade/i })
      fireEvent.change(gradeInput, { target: { value: '95' } })

      // Click populate button
      const populateButton = screen.getByRole('button', { name: /Populate with Above Comments/i })
      fireEvent.click(populateButton)

      // Click Replace in confirmation dialog
      const replaceButton = await screen.findByRole('button', { name: /Replace/i })
      fireEvent.click(replaceButton)

      // Verify text was replaced
      expect(finalCommentTextarea.value).toBe('Demonstrates strong understanding of algebraic concepts')
    })

    it('should populate immediately when textarea is empty (no confirmation)', () => {
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

      // Select outcome comment
      const gradeInput = screen.getByRole('spinbutton', { name: /Grade/i })
      fireEvent.change(gradeInput, { target: { value: '95' } })

      // Click populate button
      const populateButton = screen.getByRole('button', { name: /Populate with Above Comments/i })
      fireEvent.click(populateButton)

      // Verify no confirmation dialog appears (immediate population)
      expect(screen.queryByText(/This will replace your current comment/i)).not.toBeInTheDocument()

      // Verify text was populated
      const finalCommentTextarea = screen.getByLabelText(/^Comment$/i) as HTMLTextAreaElement
      expect(finalCommentTextarea.value).toBe('Demonstrates strong understanding of algebraic concepts')
    })
  })

  describe('AC7: Focus and selection after population', () => {
    it('should set focus to final comment textarea after population', () => {
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

      // Select outcome comment
      const gradeInput = screen.getByRole('spinbutton', { name: /Grade/i })
      fireEvent.change(gradeInput, { target: { value: '95' } })

      // Click populate button
      const populateButton = screen.getByRole('button', { name: /Populate with Above Comments/i })
      fireEvent.click(populateButton)

      // Verify focus is on textarea
      const finalCommentTextarea = screen.getByLabelText(/^Comment$/i)
      expect(finalCommentTextarea).toHaveFocus()
    })
  })
})
