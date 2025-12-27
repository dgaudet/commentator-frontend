/**
 * FinalCommentsModal - Outcome Comment Integration Tests
 * TDD Phase: RED - Writing failing tests first
 * Feature: Final Comment Outcome Integration (FCOI-001)
 *
 * User Stories:
 * - US-FINAL-001: Display Outcome Comment by Grade (8 pts)
 * - US-FINAL-002: Read-Only Styling (3 pts)
 * - US-FINAL-003: Loading and Error States (3 pts)
 *
 * Test Coverage: 12 unit tests for outcome comment integration
 */

import { render, screen, waitFor } from '../../../test-utils'
import { FinalCommentsModal } from '../FinalCommentsModal'
import { useOutcomeComments } from '../../../hooks/useOutcomeComments'
import { colors, spacing, typography, borders } from '../../../theme/tokens'
import type { Class, OutcomeComment } from '../../../types'

// Mock the useOutcomeComments hook
jest.mock('../../../hooks/useOutcomeComments')

const mockUseOutcomeComments = useOutcomeComments as jest.MockedFunction<typeof useOutcomeComments>

// Mock data
const mockClass: Class = {
  id: '65a1b2c3d4e5f6g7h8i9j0k1',
  name: 'Grade 10 Math',
  year: 2024,
  subjectId: '65a1b2c3d4e5f6g7h8i9j0k5',
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-02-20T14:15:00Z',
}

const mockOutcomeComments: OutcomeComment[] = [
  {
    id: '65a1b2c3d4e5f6g7h8i9j0k1',
    subjectId: '65a1b2c3d4e5f6g7h8i9j0k5',
    comment: 'Demonstrates strong understanding of algebraic concepts',
    upperRange: 100,
    lowerRange: 80,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '65a1b2c3d4e5f6g7h8i9j0k2',
    subjectId: '65a1b2c3d4e5f6g7h8i9j0k5',
    comment: 'Shows adequate comprehension of mathematical principles',
    upperRange: 79,
    lowerRange: 60,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '65a1b2c3d4e5f6g7h8i9j0k3',
    subjectId: '65a1b2c3d4e5f6g7h8i9j0k5',
    comment: 'Needs additional support to meet learning outcomes',
    upperRange: 59,
    lowerRange: 0,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
]

describe('FinalCommentsModal - Outcome Comment Integration', () => {
  const mockHandlers = {
    onCreateComment: jest.fn(),
    onUpdateComment: jest.fn(),
    onDeleteComment: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    // Default mock return value
    mockUseOutcomeComments.mockReturnValue({
      outcomeComments: [],
      loading: false,
      error: null,
      loadOutcomeComments: jest.fn(),
      createComment: jest.fn(),
      updateComment: jest.fn(),
      deleteComment: jest.fn(),
      clearError: jest.fn(),
    })
  })

  describe('US-FINAL-001 AC1: Load outcome comments on mount', () => {
    it('should call loadOutcomeComments with subjectId when component mounts', () => {
      const mockLoadOutcomeComments = jest.fn()
      mockUseOutcomeComments.mockReturnValue({
        outcomeComments: [],
        loading: false,
        error: null,
        loadOutcomeComments: mockLoadOutcomeComments,
        createComment: jest.fn(),
        updateComment: jest.fn(),
        deleteComment: jest.fn(),
        clearError: jest.fn(),
      })

      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={[]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      expect(mockLoadOutcomeComments).toHaveBeenCalledWith(mockClass.subjectId)
    })

    it('should not call loadOutcomeComments if entityData lacks subjectId', () => {
      const mockLoadOutcomeComments = jest.fn()
      mockUseOutcomeComments.mockReturnValue({
        outcomeComments: [],
        loading: false,
        error: null,
        loadOutcomeComments: mockLoadOutcomeComments,
        createComment: jest.fn(),
        updateComment: jest.fn(),
        deleteComment: jest.fn(),
        clearError: jest.fn(),
      })

      // Create entityData without subjectId (edge case)
      const entityDataWithoutSubjectId = {
        id: '65a1b2c3d4e5f6g7h8i9j0k1',
        name: 'Test Class',
      }

      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={entityDataWithoutSubjectId}
          finalComments={[]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      expect(mockLoadOutcomeComments).not.toHaveBeenCalled()
    })
  })

  describe('US-FINAL-001 AC2: Display matched outcome comment', () => {
    it('should display matched outcome comment when grade is entered (80-100 range)', async () => {
      mockUseOutcomeComments.mockReturnValue({
        outcomeComments: mockOutcomeComments,
        loading: false,
        error: null,
        loadOutcomeComments: jest.fn(),
        createComment: jest.fn(),
        updateComment: jest.fn(),
        deleteComment: jest.fn(),
        clearError: jest.fn(),
      })

      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={[]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      // Enter grade in the 80-100 range
      const gradeInput = document.getElementById('grade-input') as HTMLInputElement
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value',
      )?.set
      if (nativeInputValueSetter) {
        nativeInputValueSetter.call(gradeInput, '85')
      }
      const event = new Event('input', { bubbles: true })
      gradeInput.dispatchEvent(event)

      // Wait for debounce and outcome comment to appear
      await waitFor(() => {
        const outcomeCommentField = screen.getByLabelText(/outcome comment by grade/i)
        expect(outcomeCommentField).toHaveValue('Demonstrates strong understanding of algebraic concepts')
      }, { timeout: 500 })
    })

    it('should display matched outcome comment when grade is in middle range (60-79)', async () => {
      mockUseOutcomeComments.mockReturnValue({
        outcomeComments: mockOutcomeComments,
        loading: false,
        error: null,
        loadOutcomeComments: jest.fn(),
        createComment: jest.fn(),
        updateComment: jest.fn(),
        deleteComment: jest.fn(),
        clearError: jest.fn(),
      })

      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={[]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      const gradeInput = document.getElementById('grade-input') as HTMLInputElement
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value',
      )?.set
      if (nativeInputValueSetter) {
        nativeInputValueSetter.call(gradeInput, '70')
      }
      const event = new Event('input', { bubbles: true })
      gradeInput.dispatchEvent(event)

      await waitFor(() => {
        const outcomeCommentField = screen.getByLabelText(/outcome comment by grade/i)
        expect(outcomeCommentField).toHaveValue('Shows adequate comprehension of mathematical principles')
      }, { timeout: 500 })
    })

    it('should display matched outcome comment when grade is in low range (0-59)', async () => {
      mockUseOutcomeComments.mockReturnValue({
        outcomeComments: mockOutcomeComments,
        loading: false,
        error: null,
        loadOutcomeComments: jest.fn(),
        createComment: jest.fn(),
        updateComment: jest.fn(),
        deleteComment: jest.fn(),
        clearError: jest.fn(),
      })

      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={[]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      const gradeInput = document.getElementById('grade-input') as HTMLInputElement
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value',
      )?.set
      if (nativeInputValueSetter) {
        nativeInputValueSetter.call(gradeInput, '50')
      }
      const event = new Event('input', { bubbles: true })
      gradeInput.dispatchEvent(event)

      await waitFor(() => {
        const outcomeCommentField = screen.getByLabelText(/outcome comment by grade/i)
        expect(outcomeCommentField).toHaveValue('Needs additional support to meet learning outcomes')
      }, { timeout: 500 })
    })
  })

  describe('US-FINAL-001 AC3: Display empty state when no match', () => {
    it('should display empty state message when no outcome comment matches grade', async () => {
      // Return outcome comments that don't cover grade 105 (out of range)
      mockUseOutcomeComments.mockReturnValue({
        outcomeComments: mockOutcomeComments,
        loading: false,
        error: null,
        loadOutcomeComments: jest.fn(),
        createComment: jest.fn(),
        updateComment: jest.fn(),
        deleteComment: jest.fn(),
        clearError: jest.fn(),
      })

      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={[]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      // This grade is intentionally invalid (>100) to test edge case
      const gradeInput = document.getElementById('grade-input') as HTMLInputElement
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value',
      )?.set
      if (nativeInputValueSetter) {
        nativeInputValueSetter.call(gradeInput, '105')
      }
      const event = new Event('input', { bubbles: true })
      gradeInput.dispatchEvent(event)

      await waitFor(() => {
        const outcomeCommentField = screen.getByLabelText(/outcome comment by grade/i)
        expect(outcomeCommentField).toHaveValue('No outcome comment for this subject with this grade level.')
      }, { timeout: 500 })
    })

    it('should display empty state when subject has no outcome comments', async () => {
      mockUseOutcomeComments.mockReturnValue({
        outcomeComments: [],
        loading: false,
        error: null,
        loadOutcomeComments: jest.fn(),
        createComment: jest.fn(),
        updateComment: jest.fn(),
        deleteComment: jest.fn(),
        clearError: jest.fn(),
      })

      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={[]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      const gradeInput = document.getElementById('grade-input') as HTMLInputElement
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value',
      )?.set
      if (nativeInputValueSetter) {
        nativeInputValueSetter.call(gradeInput, '85')
      }
      const event = new Event('input', { bubbles: true })
      gradeInput.dispatchEvent(event)

      await waitFor(() => {
        const outcomeCommentField = screen.getByLabelText(/outcome comment by grade/i)
        expect(outcomeCommentField).toHaveValue('No outcome comment for this subject with this grade level.')
      }, { timeout: 500 })
    })
  })

  describe('US-FINAL-001 AC4: Update outcome comment when grade changes', () => {
    it('should update outcome comment when grade changes to different range', async () => {
      mockUseOutcomeComments.mockReturnValue({
        outcomeComments: mockOutcomeComments,
        loading: false,
        error: null,
        loadOutcomeComments: jest.fn(),
        createComment: jest.fn(),
        updateComment: jest.fn(),
        deleteComment: jest.fn(),
        clearError: jest.fn(),
      })

      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={[]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      const gradeInput = document.getElementById('grade-input') as HTMLInputElement
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value',
      )?.set

      // First enter grade 85 (80-100 range)
      if (nativeInputValueSetter) {
        nativeInputValueSetter.call(gradeInput, '85')
      }
      gradeInput.dispatchEvent(new Event('input', { bubbles: true }))

      await waitFor(() => {
        const outcomeCommentField = screen.getByLabelText(/outcome comment by grade/i)
        expect(outcomeCommentField).toHaveValue('Demonstrates strong understanding of algebraic concepts')
      }, { timeout: 500 })

      // Then change to grade 65 (60-79 range)
      if (nativeInputValueSetter) {
        nativeInputValueSetter.call(gradeInput, '65')
      }
      gradeInput.dispatchEvent(new Event('input', { bubbles: true }))

      await waitFor(() => {
        const outcomeCommentField = screen.getByLabelText(/outcome comment by grade/i)
        expect(outcomeCommentField).toHaveValue('Shows adequate comprehension of mathematical principles')
      }, { timeout: 500 })
    })
  })

  describe('US-FINAL-001 AC5: Clear outcome comment when grade cleared', () => {
    it('should clear outcome comment when grade input is cleared', async () => {
      mockUseOutcomeComments.mockReturnValue({
        outcomeComments: mockOutcomeComments,
        loading: false,
        error: null,
        loadOutcomeComments: jest.fn(),
        createComment: jest.fn(),
        updateComment: jest.fn(),
        deleteComment: jest.fn(),
        clearError: jest.fn(),
      })

      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={[]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      const gradeInput = document.getElementById('grade-input') as HTMLInputElement
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value',
      )?.set

      // First enter a grade
      if (nativeInputValueSetter) {
        nativeInputValueSetter.call(gradeInput, '85')
      }
      gradeInput.dispatchEvent(new Event('input', { bubbles: true }))

      await waitFor(() => {
        const outcomeCommentField = screen.getByLabelText(/outcome comment by grade/i)
        expect(outcomeCommentField).toHaveValue('Demonstrates strong understanding of algebraic concepts')
      }, { timeout: 500 })

      // Then clear the grade
      if (nativeInputValueSetter) {
        nativeInputValueSetter.call(gradeInput, '')
      }
      gradeInput.dispatchEvent(new Event('input', { bubbles: true }))

      await waitFor(() => {
        const outcomeCommentField = screen.getByLabelText(/outcome comment by grade/i)
        expect(outcomeCommentField).toHaveValue('')
      }, { timeout: 500 })
    })
  })

  describe('US-FINAL-002: Read-only styling with design tokens', () => {
    it('should render outcome comment field with read-only styling using design tokens', () => {
      mockUseOutcomeComments.mockReturnValue({
        outcomeComments: mockOutcomeComments,
        loading: false,
        error: null,
        loadOutcomeComments: jest.fn(),
        createComment: jest.fn(),
        updateComment: jest.fn(),
        deleteComment: jest.fn(),
        clearError: jest.fn(),
      })

      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={[]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      const outcomeCommentField = screen.getByLabelText(/outcome comment by grade/i)

      // Verify read-only attribute
      expect(outcomeCommentField).toHaveAttribute('readOnly')

      // Verify design token styling
      expect(outcomeCommentField).toHaveStyle({
        backgroundColor: colors.background.secondary,
        border: `${borders.width.thin} solid ${colors.border.default}`,
        borderRadius: borders.radius.md,
        padding: spacing.md,
        fontSize: typography.fontSize.base,
      })
    })

    it('should render label with correct design token styling', () => {
      mockUseOutcomeComments.mockReturnValue({
        outcomeComments: mockOutcomeComments,
        loading: false,
        error: null,
        loadOutcomeComments: jest.fn(),
        createComment: jest.fn(),
        updateComment: jest.fn(),
        deleteComment: jest.fn(),
        clearError: jest.fn(),
      })

      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={[]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      const label = screen.getByText(/outcome comment by grade/i)

      expect(label).toHaveStyle({
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.medium,
        color: colors.text.secondary,
        marginBottom: spacing.sm,
      })
    })
  })

  describe('US-FINAL-003: Loading and error states', () => {
    it('should display loading spinner when outcome comments are loading', () => {
      mockUseOutcomeComments.mockReturnValue({
        outcomeComments: [],
        loading: true,
        error: null,
        loadOutcomeComments: jest.fn(),
        createComment: jest.fn(),
        updateComment: jest.fn(),
        deleteComment: jest.fn(),
        clearError: jest.fn(),
      })

      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={[]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      // Should show loading indicator for outcome comments
      const loadingIndicators = screen.getAllByTestId('loading-spinner')
      expect(loadingIndicators.length).toBeGreaterThan(0)
    })

    it('should display error message when outcome comments fail to load', () => {
      const errorMessage = 'Failed to load outcome comments'
      mockUseOutcomeComments.mockReturnValue({
        outcomeComments: [],
        loading: false,
        error: errorMessage,
        loadOutcomeComments: jest.fn(),
        createComment: jest.fn(),
        updateComment: jest.fn(),
        deleteComment: jest.fn(),
        clearError: jest.fn(),
      })

      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={[]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      // Should display error message
      expect(screen.getByText(/failed to load outcome comment/i)).toBeInTheDocument()
    })
  })

  describe('EDIT MODE: Outcome comment integration in edit form', () => {
    const mockExistingFinalComment = {
      id: '65a1b2c3d4e5f6g7h8i9j0k1',
      classId: '75a1b2c3d4e5f6g7h8i9j0k1',
      firstName: 'John',
      lastName: 'Doe',
      grade: 85,
      comment: 'Good work',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
    }

    it('should display outcome comment in edit mode when grade is present', async () => {
      mockUseOutcomeComments.mockReturnValue({
        outcomeComments: mockOutcomeComments,
        loading: false,
        error: null,
        loadOutcomeComments: jest.fn(),
        createComment: jest.fn(),
        updateComment: jest.fn(),
        deleteComment: jest.fn(),
        clearError: jest.fn(),
      })

      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={[mockExistingFinalComment]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      // Click edit button
      const editButton = screen.getByRole('button', { name: /edit final comment for john doe/i })
      editButton.click()

      // Wait for edit form to appear
      await waitFor(() => {
        expect(screen.getByDisplayValue('John')).toBeInTheDocument()
      })

      // Wait for debounce and outcome comment to appear
      await waitFor(() => {
        const editOutcomeCommentField = screen.getByLabelText(/outcome comment by grade \(edit\)/i)
        expect(editOutcomeCommentField).toHaveValue('Demonstrates strong understanding of algebraic concepts')
      }, { timeout: 500 })
    })

    it('should update edit mode outcome comment when grade changes', async () => {
      mockUseOutcomeComments.mockReturnValue({
        outcomeComments: mockOutcomeComments,
        loading: false,
        error: null,
        loadOutcomeComments: jest.fn(),
        createComment: jest.fn(),
        updateComment: jest.fn(),
        deleteComment: jest.fn(),
        clearError: jest.fn(),
      })

      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={[mockExistingFinalComment]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      // Click edit button
      const editButton = screen.getByRole('button', { name: /edit final comment for john doe/i })
      editButton.click()

      // Wait for edit form
      await waitFor(() => {
        expect(screen.getByDisplayValue('John')).toBeInTheDocument()
      })

      // Change grade to different range
      const editGradeInput = document.getElementById('edit-grade-65a1b2c3d4e5f6g7h8i9j0k1') as HTMLInputElement
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value',
      )?.set
      if (nativeInputValueSetter) {
        nativeInputValueSetter.call(editGradeInput, '65')
      }
      editGradeInput.dispatchEvent(new Event('input', { bubbles: true }))

      // Wait for outcome comment to update
      await waitFor(() => {
        const editOutcomeCommentField = screen.getByLabelText(/outcome comment by grade \(edit\)/i)
        expect(editOutcomeCommentField).toHaveValue('Shows adequate comprehension of mathematical principles')
      }, { timeout: 500 })
    })

    it('should clear edit mode outcome comment when grade is cleared', async () => {
      mockUseOutcomeComments.mockReturnValue({
        outcomeComments: mockOutcomeComments,
        loading: false,
        error: null,
        loadOutcomeComments: jest.fn(),
        createComment: jest.fn(),
        updateComment: jest.fn(),
        deleteComment: jest.fn(),
        clearError: jest.fn(),
      })

      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={[mockExistingFinalComment]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      // Click edit button
      const editButton = screen.getByRole('button', { name: /edit final comment for john doe/i })
      editButton.click()

      // Wait for edit form
      await waitFor(() => {
        expect(screen.getByDisplayValue('John')).toBeInTheDocument()
      })

      // Clear the grade
      const editGradeInput = document.getElementById('edit-grade-65a1b2c3d4e5f6g7h8i9j0k1') as HTMLInputElement
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value',
      )?.set
      if (nativeInputValueSetter) {
        nativeInputValueSetter.call(editGradeInput, '')
      }
      editGradeInput.dispatchEvent(new Event('input', { bubbles: true }))

      // Wait for outcome comment to clear
      await waitFor(() => {
        const editOutcomeCommentField = screen.getByLabelText(/outcome comment by grade \(edit\)/i)
        expect(editOutcomeCommentField).toHaveValue('')
      }, { timeout: 500 })
    })

    it('should render edit mode outcome comment field with read-only styling', async () => {
      mockUseOutcomeComments.mockReturnValue({
        outcomeComments: mockOutcomeComments,
        loading: false,
        error: null,
        loadOutcomeComments: jest.fn(),
        createComment: jest.fn(),
        updateComment: jest.fn(),
        deleteComment: jest.fn(),
        clearError: jest.fn(),
      })

      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={[mockExistingFinalComment]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      // Click edit button
      const editButton = screen.getByRole('button', { name: /edit final comment for john doe/i })
      editButton.click()

      // Wait for edit form
      await waitFor(() => {
        expect(screen.getByDisplayValue('John')).toBeInTheDocument()
      })

      const editOutcomeCommentField = screen.getByLabelText(/outcome comment by grade \(edit\)/i)

      // Verify read-only attribute
      expect(editOutcomeCommentField).toHaveAttribute('readOnly')

      // Verify design token styling
      expect(editOutcomeCommentField).toHaveStyle({
        backgroundColor: colors.background.secondary,
        border: `${borders.width.thin} solid ${colors.border.default}`,
        borderRadius: borders.radius.md,
        padding: spacing.md,
        fontSize: typography.fontSize.base,
      })
    })
  })
})
