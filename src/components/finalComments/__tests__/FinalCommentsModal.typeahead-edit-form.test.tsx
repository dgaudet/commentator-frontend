/**
 * FinalCommentsModal Typeahead Edit Form Integration Tests
 * TDD Phase: RED - Writing failing tests first
 * Reference: US-PC-TYPEAHEAD-004
 *
 * Testing typeahead integration in Edit form:
 * - TypeaheadSearch positioned below outcome comment (edit mode)
 * - Search functionality
 * - Auto-populate comment textarea on selection
 * - Clear search on cancel and save
 */

import { render, screen, fireEvent, waitFor } from '../../../test-utils'
import { FinalCommentsModal } from '../FinalCommentsModal'
import { usePersonalizedComments } from '../../../hooks/usePersonalizedComments'
import { useOutcomeComments } from '../../../hooks/useOutcomeComments'
import type { Class, FinalComment, PersonalizedComment } from '../../../types'

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
  id: 1,
  name: 'Mathematics 101',
  year: 2024,
  subjectId: 5,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
}

const mockFinalComments: FinalComment[] = [
  {
    id: 1,
    classId: 1,
    firstName: 'John',
    lastName: 'Doe',
    grade: 85,
    comment: 'Needs improvement',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
]

const mockPersonalizedComments: PersonalizedComment[] = [
  {
    id: 1,
    comment: 'Excellent work this semester',
    subjectId: 5,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    comment: 'Good effort on assignments',
    subjectId: 5,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
  {
    id: 3,
    comment: 'Needs improvement in participation',
    subjectId: 5,
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z',
  },
]

const mockHandlers = {
  onCreateComment: jest.fn(),
  onUpdateComment: jest.fn(),
  onDeleteComment: jest.fn(),
}

describe.skip('US-PC-TYPEAHEAD-004: Integrate Typeahead in Edit Form', () => {
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
      outcomeComments: [],
      loading: false,
      error: null,
      loadOutcomeComments: jest.fn(),
    })
  })

  describe('AC1: TypeaheadSearch renders in Edit form', () => {
    it('should display personalized comment search field in Edit form', () => {
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

      // Click edit button to open edit form
      const editButton = screen.getByRole('button', { name: /Edit/i })
      fireEvent.click(editButton)

      // Should have personalized comment search in edit form
      const searchInputs = screen.getAllByLabelText(/Personalized Comment/i)
      expect(searchInputs.length).toBeGreaterThanOrEqual(2) // One in Add form, one in Edit form
    })

    it('should have typeahead positioned after outcome comment and before comment textarea in Edit form', () => {
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

      // Click edit button
      const editButton = screen.getByRole('button', { name: /Edit/i })
      fireEvent.click(editButton)

      // Get elements (need to be more specific since there are multiple)
      const outcomeCommentLabels = screen.getAllByText(/Outcome Comment by Grade/i)
      const editOutcomeLabel = outcomeCommentLabels.find(el =>
        el.textContent?.includes('Edit'),
      )
      expect(editOutcomeLabel).toBeTruthy()

      const personalizedCommentInputs = screen.getAllByLabelText(/Personalized Comment/i)
      // Edit form's typeahead should be the second one (first is in Add form)
      const editPersonalizedInput = personalizedCommentInputs[1]
      expect(editPersonalizedInput).toBeTruthy()

      // The edit textarea should have value "Needs improvement"
      const commentTextareas = screen.getAllByDisplayValue('Needs improvement')
      expect(commentTextareas.length).toBeGreaterThan(0)
    })
  })

  describe('AC2: Search and filter personalized comments in Edit form', () => {
    it('should filter personalized comments when typing in Edit form search', () => {
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

      // Click edit button
      const editButton = screen.getByRole('button', { name: /Edit/i })
      fireEvent.click(editButton)

      // Get the edit form's search input (second one)
      const searchInputs = screen.getAllByLabelText(/Personalized Comment/i)
      const editSearchInput = searchInputs[1] as HTMLInputElement

      fireEvent.change(editSearchInput, { target: { value: 'excellent' } })
      fireEvent.focus(editSearchInput)

      expect(screen.getByText('Excellent work this semester')).toBeInTheDocument()
      expect(screen.queryByText('Good effort on assignments')).not.toBeInTheDocument()
    })

    it('should show all comments when Edit form search is empty', () => {
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

      // Click edit button
      const editButton = screen.getByRole('button', { name: /Edit/i })
      fireEvent.click(editButton)

      // Get the edit form's search input
      const searchInputs = screen.getAllByLabelText(/Personalized Comment/i)
      const editSearchInput = searchInputs[1]

      fireEvent.focus(editSearchInput)

      expect(screen.getAllByText('Excellent work this semester').length).toBeGreaterThan(0)
      expect(screen.getAllByText('Good effort on assignments').length).toBeGreaterThan(0)
      expect(screen.getAllByText('Needs improvement in participation').length).toBeGreaterThan(0)
    })
  })

  describe('AC3: Select personalized comment populates Edit textarea', () => {
    it('should populate Edit comment textarea when personalized comment is clicked', async () => {
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

      // Click edit button
      const editButton = screen.getByRole('button', { name: /Edit/i })
      fireEvent.click(editButton)

      // Get the edit form's search input
      const searchInputs = screen.getAllByLabelText(/Personalized Comment/i)
      const editSearchInput = searchInputs[1]

      fireEvent.focus(editSearchInput)

      // Click on a personalized comment option (get all matches and click the second one for edit form)
      const commentOptions = screen.getAllByText('Excellent work this semester')
      // Should have at least 2 matches (one in Add form dropdown, one in Edit form dropdown)
      fireEvent.click(commentOptions[commentOptions.length - 1])

      // US-FC-REFACTOR-003: Must click populate button to populate textarea
      const populateButtons = screen.getAllByRole('button', { name: /Populate with Above Comments/i })
      const editPopulateButton = populateButtons[1] // Second button is for edit form
      fireEvent.click(editPopulateButton)

      // US-FC-REFACTOR-003: Confirm overwrite in dialog (edit form has existing content)
      const replaceButton = await screen.findByRole('button', { name: /Replace/i })
      fireEvent.click(replaceButton)

      // The edit textarea should now have the selected comment
      const commentTextareas = screen.getAllByLabelText(/^Comment$/i)
      const editTextarea = commentTextareas[1] as HTMLTextAreaElement // Second textarea is the edit form
      expect(editTextarea.value).toBe('Excellent work this semester')
    })

    it('should replace existing content when personalized comment is selected in Edit', async () => {
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

      // Click edit button
      const editButton = screen.getByRole('button', { name: /Edit/i })
      fireEvent.click(editButton)

      // Edit form should have initial value "Needs improvement"
      let editTextarea = screen.getByDisplayValue('Needs improvement') as HTMLTextAreaElement
      expect(editTextarea.value).toBe('Needs improvement')

      // Get the edit form's search input
      const searchInputs = screen.getAllByLabelText(/Personalized Comment/i)
      const editSearchInput = searchInputs[1]

      fireEvent.focus(editSearchInput)

      // Select a different personalized comment
      const commentOptions = screen.getAllByText('Good effort on assignments')
      fireEvent.click(commentOptions[commentOptions.length - 1])

      // US-FC-REFACTOR-003: Must click populate button to populate textarea
      const populateButtons = screen.getAllByRole('button', { name: /Populate with Above Comments/i })
      const editPopulateButton = populateButtons[1] // Second button is for edit form
      fireEvent.click(editPopulateButton)

      // US-FC-REFACTOR-003: Confirm overwrite in dialog
      const replaceButton = await screen.findByRole('button', { name: /Replace/i })
      fireEvent.click(replaceButton)

      // Should replace the content
      const commentTextareas = screen.getAllByLabelText(/^Comment$/i)
      editTextarea = commentTextareas[1] as HTMLTextAreaElement // Second textarea is the edit form
      expect(editTextarea.value).toBe('Good effort on assignments')
    })

    it('should display selected comment in Edit form after selection', () => {
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

      // Click edit button
      const editButton = screen.getByRole('button', { name: /Edit/i })
      fireEvent.click(editButton)

      // Get the edit form's search input
      const searchInputs = screen.getAllByLabelText(/Personalized Comment/i)
      const editSearchInput = searchInputs[1] as HTMLInputElement

      fireEvent.change(editSearchInput, { target: { value: 'excellent' } })
      fireEvent.focus(editSearchInput)

      const commentOptions = screen.getAllByText('Excellent work this semester')
      fireEvent.click(commentOptions[commentOptions.length - 1])

      // US-FC-REFACTOR-002: Selected comment should remain visible for user feedback
      expect(editSearchInput.value).toBe('Excellent work this semester')
    })
  })

  describe('AC4: Clear search on Edit cancel', () => {
    it('should clear Edit typeahead search query when cancel button is clicked', () => {
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

      // Click edit button
      const editButton = screen.getByRole('button', { name: /Edit/i })
      fireEvent.click(editButton)

      // Type in the edit search
      const searchInputs = screen.getAllByLabelText(/Personalized Comment/i)
      const editSearchInput = searchInputs[1] as HTMLInputElement

      fireEvent.change(editSearchInput, { target: { value: 'excellent' } })
      expect(editSearchInput.value).toBe('excellent')

      // Click cancel
      const cancelButton = screen.getByRole('button', { name: /Cancel/i })
      fireEvent.click(cancelButton)

      // Re-open edit form
      const editButtonAgain = screen.getByRole('button', { name: /Edit/i })
      fireEvent.click(editButtonAgain)

      // Search should be cleared
      const searchInputsAfter = screen.getAllByLabelText(/Personalized Comment/i)
      const editSearchInputAfter = searchInputsAfter[1] as HTMLInputElement
      expect(editSearchInputAfter.value).toBe('')
    })
  })

  describe('AC5: Clear search on Edit save', () => {
    it('should clear Edit typeahead search query after successful save', async () => {
      const mockOnUpdateComment = jest.fn().mockResolvedValue(undefined)

      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={mockFinalComments}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockOnUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      // Click edit button
      const editButton = screen.getByRole('button', { name: /Edit/i })
      fireEvent.click(editButton)

      // Type in search
      const searchInputs = screen.getAllByLabelText(/Personalized Comment/i)
      const editSearchInput = searchInputs[1] as HTMLInputElement

      fireEvent.change(editSearchInput, { target: { value: 'excellent' } })
      expect(editSearchInput.value).toBe('excellent')

      // Save the edit
      const saveButton = screen.getByRole('button', { name: /^Save$/i })
      fireEvent.click(saveButton)

      await waitFor(() => {
        expect(mockOnUpdateComment).toHaveBeenCalled()
      })

      // Search query should be cleared after save
      // Note: After save, edit mode exits, so we need to re-open to verify
      const editButtonAgain = screen.getByRole('button', { name: /Edit/i })
      fireEvent.click(editButtonAgain)

      const searchInputsAfter = screen.getAllByLabelText(/Personalized Comment/i)
      const editSearchInputAfter = searchInputsAfter[1] as HTMLInputElement
      expect(editSearchInputAfter.value).toBe('')
    })
  })

  describe('AC6: Loading and error states in Edit form', () => {
    it('should pass loading state to TypeaheadSearch in Edit form', () => {
      mockUsePersonalizedComments.mockReturnValue({
        personalizedComments: [],
        loading: true,
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

      // Click edit button
      const editButton = screen.getByRole('button', { name: /Edit/i })
      fireEvent.click(editButton)

      const searchInputs = screen.getAllByLabelText(/Personalized Comment/i)
      const editSearchInput = searchInputs[1]
      expect(editSearchInput).toBeDisabled()
    })

    it('should pass error state to TypeaheadSearch in Edit form', () => {
      mockUsePersonalizedComments.mockReturnValue({
        personalizedComments: [],
        loading: false,
        error: 'Failed to load personalized comments',
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

      // Click edit button
      const editButton = screen.getByRole('button', { name: /Edit/i })
      fireEvent.click(editButton)

      // Should show error message (will appear twice - once in Add form, once in Edit form)
      const errorMessages = screen.getAllByText('Failed to load personalized comments')
      expect(errorMessages.length).toBeGreaterThanOrEqual(2)
    })
  })

  describe('AC7: Clear search when modal closes', () => {
    it('should clear Edit typeahead search query when modal is closed', async () => {
      const { rerender } = render(
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

      // Click edit button
      const editButton = screen.getByRole('button', { name: /Edit/i })
      fireEvent.click(editButton)

      // Type in edit form search field
      const searchInputs = screen.getAllByLabelText(/Personalized Comment/i)
      const editSearchInput = searchInputs[1] as HTMLInputElement
      fireEvent.change(editSearchInput, { target: { value: 'needs improvement' } })
      expect(editSearchInput.value).toBe('needs improvement')

      // Close the modal
      rerender(
        <FinalCommentsModal
          isOpen={false}
          entityData={mockClass}
          finalComments={mockFinalComments}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      // Reopen the modal and enter edit mode again
      rerender(
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

      // Wait for the Edit button to be available after reopen
      const editButtonAgain = await screen.findByRole('button', { name: /Edit/i })
      fireEvent.click(editButtonAgain)

      // Search query should be cleared
      const searchInputsAfterReopen = screen.getAllByLabelText(/Personalized Comment/i)
      const editSearchInputAfterReopen = searchInputsAfterReopen[1] as HTMLInputElement
      expect(editSearchInputAfterReopen.value).toBe('')
    })
  })
})
