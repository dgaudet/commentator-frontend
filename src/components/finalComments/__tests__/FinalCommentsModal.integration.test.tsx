/**
 * FinalCommentsModal Integration Tests
 * TDD Phase: GREEN - These tests should already pass after US-FC-REFACTOR-003 & 004
 * Reference: US-FC-REFACTOR-005
 *
 * Testing complete user workflows:
 * - End-to-end populate button workflow
 * - Interaction between outcome comments, personal comments, and final comment
 * - Form submission with populated comments
 * - Multiple populate operations in sequence
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
  subjectId: '65a1b2c3d4e5f6g7h8i9j0k5',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
}

const mockPersonalizedComments: PersonalizedComment[] = [
  {
    id: '65a1b2c3d4e5f6g7h8i9j0k1',
    comment: 'Excellent work this semester',
    subjectId: '65a1b2c3d4e5f6g7h8i9j0k5',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '65a1b2c3d4e5f6g7h8i9j0k2',
    comment: 'Good participation in class discussions',
    subjectId: '65a1b2c3d4e5f6g7h8i9j0k5',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
]

const mockOutcomeComments: OutcomeComment[] = [
  {
    id: '65a1b2c3d4e5f6g7h8i9j0k1',
    subjectId: '65a1b2c3d4e5f6g7h8i9j0k5',
    lowerRange: 90,
    upperRange: 100,
    comment: 'Demonstrates exceptional understanding of mathematical concepts',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '65a1b2c3d4e5f6g7h8i9j0k2',
    subjectId: '65a1b2c3d4e5f6g7h8i9j0k5',
    lowerRange: 80,
    upperRange: 89,
    comment: 'Shows strong grasp of fundamental principles',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
]

const mockHandlers = {
  onCreateComment: jest.fn(),
  onUpdateComment: jest.fn(),
  onDeleteComment: jest.fn(),
}

describe('US-FC-REFACTOR-005: Integration Tests', () => {
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

  describe('I1: Complete Add workflow with populate button', () => {
    it('should complete full workflow: enter grade → select personal comment → populate → submit', async () => {
      const mockOnCreateComment = jest.fn().mockResolvedValue(undefined)

      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={[]}
          onCreateComment={mockOnCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      // Step 1: Fill required field - First Name
      const firstNameInput = screen.getByLabelText(/First Name/i)
      fireEvent.change(firstNameInput, { target: { value: 'Alice' } })

      // Step 2: Enter grade (triggers outcome comment selection)
      const gradeInput = screen.getByRole('spinbutton', { name: /Grade/i })
      fireEvent.change(gradeInput, { target: { value: '95' } })

      // Verify outcome comment is displayed
      expect(screen.getByText(/Demonstrates exceptional understanding of mathematical concepts/i)).toBeInTheDocument()

      // Step 3: Select personal comment
      const searchInput = screen.getByLabelText(/Personalized Comment/i)
      fireEvent.focus(searchInput)
      const personalCommentOption = screen.getByText('Excellent work this semester')
      fireEvent.click(personalCommentOption)

      // US-RATING-006: Verify search input is cleared and comment is added to ordered list
      expect((searchInput as HTMLInputElement).value).toBe('')
      expect(screen.getByText('Excellent work this semester')).toBeInTheDocument()

      // Step 4: Click populate button
      const populateButton = screen.getByRole('button', { name: /Populate with Above Comments/i })
      expect(populateButton).not.toBeDisabled()
      fireEvent.click(populateButton)

      // Step 5: Verify final comment textarea is populated with both comments
      const finalCommentTextarea = screen.getByLabelText(/^Comment$/i) as HTMLTextAreaElement
      expect(finalCommentTextarea.value).toBe(
        'Demonstrates exceptional understanding of mathematical concepts Excellent work this semester',
      )
      expect(finalCommentTextarea).toHaveFocus()

      // Step 6: Submit the form
      const submitButton = screen.getByRole('button', { name: /Add Final Comment/i })
      fireEvent.click(submitButton)

      // Verify submission was called with correct data
      await waitFor(() => {
        expect(mockOnCreateComment).toHaveBeenCalledWith(
          expect.objectContaining({
            firstName: 'Alice',
            grade: 95,
            comment: 'Demonstrates exceptional understanding of mathematical concepts Excellent work this semester',
          }),
        )
      })
    })

    it('should handle workflow with only outcome comment (no personal comment selected)', async () => {
      const mockOnCreateComment = jest.fn().mockResolvedValue(undefined)

      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={[]}
          onCreateComment={mockOnCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      const firstNameInput = screen.getByLabelText(/First Name/i)
      fireEvent.change(firstNameInput, { target: { value: 'Bob' } })

      const gradeInput = screen.getByRole('spinbutton', { name: /Grade/i })
      fireEvent.change(gradeInput, { target: { value: '85' } })

      // Don't select personal comment, just populate with outcome only
      const populateButton = screen.getByRole('button', { name: /Populate with Above Comments/i })
      fireEvent.click(populateButton)

      const finalCommentTextarea = screen.getByLabelText(/^Comment$/i) as HTMLTextAreaElement
      expect(finalCommentTextarea.value).toBe('Shows strong grasp of fundamental principles')

      const submitButton = screen.getByRole('button', { name: /Add Final Comment/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockOnCreateComment).toHaveBeenCalledWith(
          expect.objectContaining({
            firstName: 'Bob',
            grade: 85,
            comment: 'Shows strong grasp of fundamental principles',
          }),
        )
      })
    })

    it('should handle workflow with only personal comment and grade (required fields)', async () => {
      const mockOnCreateComment = jest.fn().mockResolvedValue(undefined)

      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={[]}
          onCreateComment={mockOnCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      const firstNameInput = screen.getByLabelText(/First Name/i)
      fireEvent.change(firstNameInput, { target: { value: 'Charlie' } })

      // Note: Grade is required, so we must enter it
      const gradeInput = screen.getByRole('spinbutton', { name: /Grade/i })
      fireEvent.change(gradeInput, { target: { value: '75' } }) // Grade outside outcome range

      // Select personal comment without matching outcome comment
      const searchInput = screen.getByLabelText(/Personalized Comment/i)
      fireEvent.focus(searchInput)
      const personalCommentOption = screen.getByText('Good participation in class discussions')
      fireEvent.click(personalCommentOption)

      const populateButton = screen.getByRole('button', { name: /Populate with Above Comments/i })
      fireEvent.click(populateButton)

      const finalCommentTextarea = screen.getByLabelText(/^Comment$/i) as HTMLTextAreaElement
      expect(finalCommentTextarea.value).toBe('Good participation in class discussions')

      const submitButton = screen.getByRole('button', { name: /Add Final Comment/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockOnCreateComment).toHaveBeenCalledWith(
          expect.objectContaining({
            firstName: 'Charlie',
            grade: 75,
            comment: 'Good participation in class discussions',
          }),
        )
      })
    })
  })

  describe('I2: Complete Edit workflow with populate button', () => {
    const existingFinalComment: FinalComment = {
      id: '65a1b2c3d4e5f6g7h8i9j0k1',
      firstName: 'Alice',
      lastName: 'Smith',
      grade: 88,
      comment: 'Original comment text',
      classId: '75a1b2c3d4e5f6g7h8i9j0k1',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    }

    it('should complete full edit workflow: change grade → select personal → populate → confirm overwrite → save', async () => {
      const mockOnUpdateComment = jest.fn().mockResolvedValue(undefined)

      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={[existingFinalComment]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockOnUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      // Step 1: Click edit on existing comment
      const editButton = screen.getByRole('button', { name: /Edit final comment for Alice Smith/i })
      fireEvent.click(editButton)

      // Get all grade inputs (Add form + Edit form) - Edit form is the second one
      const gradeInputs = screen.getAllByRole('spinbutton', { name: /Grade/i })
      const editGradeInput = gradeInputs[1] // Edit form is second
      expect(editGradeInput).toHaveValue(88)

      // Get all comment textareas - Edit form is the second one
      const commentTextareas = screen.getAllByLabelText(/^Comment$/i) as HTMLTextAreaElement[]
      const editCommentTextarea = commentTextareas[1]
      expect(editCommentTextarea.value).toBe('Original comment text')

      // Step 2: Change grade to 95 (changes outcome comment)
      fireEvent.change(editGradeInput, { target: { value: '95' } })

      // Step 3: Select personal comment - Get all typeahead inputs, edit form is second
      const searchInputs = screen.getAllByLabelText(/Personalized Comment/i)
      const editSearchInput = searchInputs[1]
      fireEvent.focus(editSearchInput)
      const personalCommentOption = screen.getByText('Excellent work this semester')
      fireEvent.click(personalCommentOption)

      // Step 4: Click populate button - Get all populate buttons, edit form is second
      const populateButtons = screen.getAllByRole('button', { name: /Populate with Above Comments/i })
      const editPopulateButton = populateButtons[1]
      fireEvent.click(editPopulateButton)

      // Step 5: Confirm overwrite in dialog
      const overwriteDialog = await screen.findByText(/This will replace your current comment/i)
      expect(overwriteDialog).toBeInTheDocument()

      const replaceButton = screen.getByRole('button', { name: /Replace/i })
      fireEvent.click(replaceButton)

      // Verify comment was replaced
      expect(editCommentTextarea.value).toBe(
        'Demonstrates exceptional understanding of mathematical concepts Excellent work this semester',
      )

      // Step 6: Save changes
      const saveButton = screen.getByRole('button', { name: /^Save$/i })
      fireEvent.click(saveButton)

      await waitFor(() => {
        expect(mockOnUpdateComment).toHaveBeenCalledWith(
          '65a1b2c3d4e5f6g7h8i9j0k1',
          expect.objectContaining({
            grade: 95,
            comment: 'Demonstrates exceptional understanding of mathematical concepts Excellent work this semester',
          }),
        )
      })
    })

    it('should cancel overwrite and preserve original comment', async () => {
      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={[existingFinalComment]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      const editButton = screen.getByRole('button', { name: /Edit final comment for Alice Smith/i })
      fireEvent.click(editButton)

      // Use getAllBy to get edit form elements (second ones)
      const gradeInputs = screen.getAllByRole('spinbutton', { name: /Grade/i })
      const editGradeInput = gradeInputs[1]
      fireEvent.change(editGradeInput, { target: { value: '95' } })

      const searchInputs = screen.getAllByLabelText(/Personalized Comment/i)
      const editSearchInput = searchInputs[1]
      fireEvent.focus(editSearchInput)
      const personalCommentOption = screen.getByText('Excellent work this semester')
      fireEvent.click(personalCommentOption)

      const populateButtons = screen.getAllByRole('button', { name: /Populate with Above Comments/i })
      const editPopulateButton = populateButtons[1]
      fireEvent.click(editPopulateButton)

      // Cancel the overwrite - confirmation dialog appears, click Cancel
      await waitFor(() => {
        expect(screen.getByText(/This will replace your current comment/i)).toBeInTheDocument()
      })
      // Use data-testid for robust selector that won't break if other cancel buttons are added
      const dialogCancelButton = screen.getByTestId('confirmation-modal-cancel')
      fireEvent.click(dialogCancelButton)

      // Verify original comment is preserved
      const commentTextareas = screen.getAllByLabelText(/^Comment$/i) as HTMLTextAreaElement[]
      const editCommentTextarea = commentTextareas[1]
      expect(editCommentTextarea.value).toBe('Original comment text')
    })
  })

  describe('I3: Multiple populate operations in sequence', () => {
    it('should allow multiple populate operations with different comments', async () => {
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

      const gradeInput = screen.getByRole('spinbutton', { name: /Grade/i })
      const searchInput = screen.getByLabelText(/Personalized Comment/i)
      const populateButton = screen.getByRole('button', { name: /Populate with Above Comments/i })
      const finalCommentTextarea = screen.getByLabelText(/^Comment$/i) as HTMLTextAreaElement

      // First populate: Grade 95 + Personal comment 1
      fireEvent.change(gradeInput, { target: { value: '95' } })
      fireEvent.focus(searchInput)
      fireEvent.click(screen.getByText('Excellent work this semester'))
      fireEvent.click(populateButton)
      expect(finalCommentTextarea.value).toBe(
        'Demonstrates exceptional understanding of mathematical concepts Excellent work this semester',
      )

      // US-RATING-006: Remove first comment, then add second comment
      // Find and click remove button for first comment
      const removeButtons = screen.getAllByLabelText(/Remove:/i)
      fireEvent.click(removeButtons[0])

      // Add second personal comment
      fireEvent.change(searchInput, { target: { value: '' } })
      fireEvent.focus(searchInput)
      fireEvent.click(screen.getByText('Good participation in class discussions'))
      fireEvent.click(populateButton)

      // Confirm overwrite
      const replaceButton = await screen.findByRole('button', { name: /Replace/i })
      fireEvent.click(replaceButton)

      expect(finalCommentTextarea.value).toBe(
        'Demonstrates exceptional understanding of mathematical concepts Good participation in class discussions',
      )

      // Third populate: Change grade to 85 (different outcome comment)
      fireEvent.change(gradeInput, { target: { value: '85' } })
      fireEvent.click(populateButton)

      // Confirm overwrite again
      const replaceButton2 = await screen.findByRole('button', { name: /Replace/i })
      fireEvent.click(replaceButton2)

      expect(finalCommentTextarea.value).toBe(
        'Shows strong grasp of fundamental principles Good participation in class discussions',
      )
    })
  })

  describe('I4: Populate button state changes during workflow', () => {
    it('should enable/disable populate button dynamically as selections change', () => {
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

      const gradeInput = screen.getByRole('spinbutton', { name: /Grade/i })
      const searchInput = screen.getByLabelText(/Personalized Comment/i)
      const populateButton = screen.getByRole('button', { name: /Populate with Above Comments/i })

      // Initially disabled (no selections)
      expect(populateButton).toBeDisabled()

      // Enter grade → should enable
      fireEvent.change(gradeInput, { target: { value: '95' } })
      expect(populateButton).not.toBeDisabled()

      // Clear grade → should disable
      fireEvent.change(gradeInput, { target: { value: '' } })
      expect(populateButton).toBeDisabled()

      // Select personal comment → should enable
      fireEvent.focus(searchInput)
      fireEvent.click(screen.getByText('Excellent work this semester'))
      expect(populateButton).not.toBeDisabled()

      // Clear personal comment and ensure no grade → should disable
      // (Note: Would need clear functionality - test assumes typeahead doesn't auto-clear)
    })
  })

  describe('I5: Form reset behavior after submission', () => {
    it('should clear personal comment selection after successful Add submission', async () => {
      const mockOnCreateComment = jest.fn().mockResolvedValue(undefined)

      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={[]}
          onCreateComment={mockOnCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      // Fill form with all data
      const firstNameInput = screen.getByLabelText(/First Name/i)
      fireEvent.change(firstNameInput, { target: { value: 'David' } })

      const gradeInput = screen.getByRole('spinbutton', { name: /Grade/i })
      fireEvent.change(gradeInput, { target: { value: '95' } })

      const searchInput = screen.getByLabelText(/Personalized Comment/i)
      fireEvent.focus(searchInput)
      fireEvent.click(screen.getByText('Excellent work this semester'))

      const populateButton = screen.getByRole('button', { name: /Populate with Above Comments/i })
      fireEvent.click(populateButton)

      // Submit form
      const submitButton = screen.getByRole('button', { name: /Add Final Comment/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockOnCreateComment).toHaveBeenCalled()
      })

      // Verify form is reset (all fields cleared)
      expect(firstNameInput).toHaveValue('')
      expect(gradeInput).toHaveValue(null)
      expect((searchInput as HTMLInputElement).value).toBe('')

      // Verify populate button is disabled after reset
      expect(populateButton).toBeDisabled()
    })
  })
})
