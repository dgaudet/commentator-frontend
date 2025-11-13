/**
 * FinalCommentsModal Typeahead Add Form Integration Tests
 * TDD Phase: RED - Writing failing tests first
 * Reference: US-PC-TYPEAHEAD-003
 *
 * Testing typeahead integration in Add form:
 * - TypeaheadSearch positioned below outcome comment
 * - Search functionality
 * - Auto-populate comment textarea on selection
 * - Clear search on form submit
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

const mockFinalComments: FinalComment[] = []

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

describe('US-PC-TYPEAHEAD-003: Integrate Typeahead in Add Form', () => {
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

  describe('AC1: TypeaheadSearch renders in Add form', () => {
    it('should display personalized comment search field in Add form', () => {
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

      expect(screen.getByLabelText(/Personalized Comment/i)).toBeInTheDocument()
    })

    it('should have typeahead positioned after outcome comment and before final comment textarea', () => {
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

      const outcomeCommentLabel = screen.getByLabelText(/Outcome Comment by Grade/i)
      const personalizedCommentInput = screen.getByLabelText(/Personalized Comment/i)
      const finalCommentTextarea = screen.getByLabelText(/^Comment$/i)

      // Check DOM order: Outcome Comment -> Personalized Comment -> Final Comment
      expect(outcomeCommentLabel.compareDocumentPosition(personalizedCommentInput))
        .toBe(Node.DOCUMENT_POSITION_FOLLOWING)
      expect(personalizedCommentInput.compareDocumentPosition(finalCommentTextarea))
        .toBe(Node.DOCUMENT_POSITION_FOLLOWING)
    })
  })

  describe('AC2: Search and filter personalized comments', () => {
    it('should filter personalized comments when typing in search', () => {
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
      fireEvent.change(searchInput, { target: { value: 'excellent' } })
      fireEvent.focus(searchInput)

      expect(screen.getByText('Excellent work this semester')).toBeInTheDocument()
      expect(screen.queryByText('Good effort on assignments')).not.toBeInTheDocument()
    })

    it('should show all comments when search is empty', () => {
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

      expect(screen.getByText('Excellent work this semester')).toBeInTheDocument()
      expect(screen.getByText('Good effort on assignments')).toBeInTheDocument()
      expect(screen.getByText('Needs improvement in participation')).toBeInTheDocument()
    })
  })

  describe('AC3: Select personalized comment populates textarea', () => {
    it('should populate comment textarea when personalized comment is clicked', () => {
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

      const commentOption = screen.getByText('Excellent work this semester')
      fireEvent.click(commentOption)

      const finalCommentTextarea = screen.getByLabelText(/^Comment$/i)
      expect(finalCommentTextarea).toHaveValue('Excellent work this semester')
    })

    it('should replace existing content when personalized comment is selected', () => {
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

      // Type some initial content
      const finalCommentTextarea = screen.getByLabelText(/^Comment$/i)
      fireEvent.change(finalCommentTextarea, { target: { value: 'Initial content' } })
      expect(finalCommentTextarea).toHaveValue('Initial content')

      // Select personalized comment
      const searchInput = screen.getByLabelText(/Personalized Comment/i)
      fireEvent.focus(searchInput)

      const commentOption = screen.getByText('Good effort on assignments')
      fireEvent.click(commentOption)

      // Should replace the initial content
      expect(finalCommentTextarea).toHaveValue('Good effort on assignments')
    })

    it('should clear search query after selecting personalized comment', () => {
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

      const searchInput = screen.getByLabelText(/Personalized Comment/i) as HTMLInputElement
      fireEvent.change(searchInput, { target: { value: 'excellent' } })
      fireEvent.focus(searchInput)

      const commentOption = screen.getByText('Excellent work this semester')
      fireEvent.click(commentOption)

      // Search query should be cleared
      expect(searchInput.value).toBe('')
    })
  })

  describe('AC4: Clear search on form submit', () => {
    it('should clear typeahead search query after successful form submission', async () => {
      const mockOnCreateComment = jest.fn().mockResolvedValue(undefined)

      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={mockFinalComments}
          onCreateComment={mockOnCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      // Type in search and select comment
      const searchInput = screen.getByLabelText(/Personalized Comment/i) as HTMLInputElement
      fireEvent.change(searchInput, { target: { value: 'excellent' } })
      fireEvent.focus(searchInput)

      const commentOption = screen.getByText('Excellent work this semester')
      fireEvent.click(commentOption)

      // Fill required fields and submit
      const firstNameInput = screen.getByLabelText(/First Name/i)
      const gradeInput = screen.getByRole('spinbutton', { name: /Grade/i })

      fireEvent.change(firstNameInput, { target: { value: 'John' } })
      fireEvent.change(gradeInput, { target: { value: '85' } })

      const submitButton = screen.getByRole('button', { name: /Add Final Comment/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockOnCreateComment).toHaveBeenCalled()
      })

      // Search query should remain cleared (it was cleared on selection already)
      expect(searchInput.value).toBe('')
    })
  })

  describe('AC5: Loading and error states', () => {
    it('should pass loading state to TypeaheadSearch', () => {
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

      const searchInput = screen.getByLabelText(/Personalized Comment/i)
      expect(searchInput).toBeDisabled()
    })

    it('should pass error state to TypeaheadSearch', () => {
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

      expect(screen.getByText('Failed to load personalized comments')).toBeInTheDocument()
    })

    it('should show empty message when no personalized comments available', () => {
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

      expect(screen.getByText(/No personalized comments available for this subject/i)).toBeInTheDocument()
    })
  })
})
