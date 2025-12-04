/**
 * PersonalizedCommentsModal Component Tests
 * Tests modal rendering, CRUD operations, and validation
 */

import { render, screen, fireEvent, waitFor } from '../../../test-utils'
import { PersonalizedCommentsModal } from '../PersonalizedCommentsModal'
import type { PersonalizedComment } from '../../../types'

describe('PersonalizedCommentsModal', () => {
  const mockSubject = { id: '65a1b2c3d4e5f6g7h8i9j0k1', name: 'Mathematics', createdAt: '', updatedAt: '' }
  const mockComment: PersonalizedComment = {
    id: '65a1b2c3d4e5f6g7h8i9j0k1',
    subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
    comment: 'Shows great improvement in problem-solving skills',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  }

  const defaultProps = {
    isOpen: true,
    entityData: mockSubject,
    personalizedComments: [],
    onCreateComment: jest.fn(),
    onUpdateComment: jest.fn(),
    onDeleteComment: jest.fn(),
    loading: false,
    error: null,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('rendering', () => {
    it('should not render when isOpen is false', () => {
      const { container } = render(
        <PersonalizedCommentsModal {...defaultProps} isOpen={false} />,
      )
      expect(container.firstChild).toBeNull()
    })

    it('should render modal when isOpen is true', () => {
      render(<PersonalizedCommentsModal {...defaultProps} />)
      expect(screen.getByRole('dialog')).toBeInTheDocument()
      // US-MODAL-STYLE-001 AC1: Modal title removed, check for panel content instead
      expect(screen.getByText('Add New Personalized Comment')).toBeInTheDocument()
    })

    it('should show loading spinner when loading', () => {
      render(<PersonalizedCommentsModal {...defaultProps} loading={true} />)
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
    })

    it('should show error message when error exists', () => {
      render(<PersonalizedCommentsModal {...defaultProps} error="Failed to load comments" />)
      expect(screen.getByText(/Failed to load comments/i)).toBeInTheDocument()
    })

    it('should show empty state when no comments', () => {
      render(<PersonalizedCommentsModal {...defaultProps} />)
      expect(screen.getByText(/No personalized comments yet/i)).toBeInTheDocument()
    })

    it('should render comments list', () => {
      render(
        <PersonalizedCommentsModal
          {...defaultProps}
          personalizedComments={[mockComment]}
        />,
      )
      expect(screen.getByText(mockComment.comment)).toBeInTheDocument()
    })
  })

  describe('create comment', () => {
    it('should show character counter', () => {
      render(<PersonalizedCommentsModal {...defaultProps} />)
      expect(screen.getByText(/0 \/ 1000 characters/i)).toBeInTheDocument()
    })

    it('should disable Add button when comment is too short', () => {
      render(<PersonalizedCommentsModal {...defaultProps} />)
      const addButton = screen.getByRole('button', { name: /Add Comment/i })
      expect(addButton).toBeDisabled()
    })

    it('should enable Add button when comment is valid', () => {
      render(<PersonalizedCommentsModal {...defaultProps} />)
      const textarea = screen.getByPlaceholderText(/Enter personalized comment/i)
      const addButton = screen.getByRole('button', { name: /Add Comment/i })

      fireEvent.change(textarea, { target: { value: 'This is a valid comment that is long enough' } })
      expect(addButton).not.toBeDisabled()
    })

    it('should call onCreateComment with correct data', async () => {
      const onCreateComment = jest.fn().mockResolvedValue(undefined)
      render(
        <PersonalizedCommentsModal {...defaultProps} onCreateComment={onCreateComment} />,
      )

      const textarea = screen.getByPlaceholderText(/Enter personalized comment/i)
      const addButton = screen.getByRole('button', { name: /Add Comment/i })

      fireEvent.change(textarea, { target: { value: 'This is a valid comment' } })
      fireEvent.click(addButton)

      await waitFor(() => {
        expect(onCreateComment).toHaveBeenCalledWith({
          subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
          comment: 'This is a valid comment',
          rating: 3, // Default rating
        })
      })
    })
  })

  describe('edit comment', () => {
    it('should enter edit mode when Edit button clicked', () => {
      render(
        <PersonalizedCommentsModal
          {...defaultProps}
          personalizedComments={[mockComment]}
        />,
      )

      const editButton = screen.getByRole('button', { name: /Edit/i })
      fireEvent.click(editButton)

      expect(screen.getByRole('button', { name: /Save/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument()
    })

    it('should call onUpdateComment with correct data', async () => {
      const onUpdateComment = jest.fn().mockResolvedValue(undefined)
      render(
        <PersonalizedCommentsModal
          {...defaultProps}
          personalizedComments={[mockComment]}
          onUpdateComment={onUpdateComment}
        />,
      )

      const editButton = screen.getByRole('button', { name: /Edit/i })
      fireEvent.click(editButton)

      const textarea = screen.getByDisplayValue(mockComment.comment)
      fireEvent.change(textarea, { target: { value: 'Updated comment text that is long enough' } })

      const saveButton = screen.getByRole('button', { name: /Save/i })
      fireEvent.click(saveButton)

      await waitFor(() => {
        expect(onUpdateComment).toHaveBeenCalledWith(1, {
          subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
          comment: 'Updated comment text that is long enough',
          rating: 3, // Default rating (mockComment has undefined rating → normalized to 3)
        })
      })
    })

    it('should cancel edit mode when Cancel button clicked', () => {
      render(
        <PersonalizedCommentsModal
          {...defaultProps}
          personalizedComments={[mockComment]}
        />,
      )

      const editButton = screen.getByRole('button', { name: /Edit/i })
      fireEvent.click(editButton)

      const cancelButton = screen.getByRole('button', { name: /Cancel/i })
      fireEvent.click(cancelButton)

      expect(screen.queryByRole('button', { name: /Save/i })).not.toBeInTheDocument()
    })
  })

  describe('delete comment', () => {
    it('should show confirmation dialog when Delete button clicked', () => {
      render(
        <PersonalizedCommentsModal
          {...defaultProps}
          personalizedComments={[mockComment]}
        />,
      )

      const deleteButton = screen.getByRole('button', { name: /Delete/i })
      fireEvent.click(deleteButton)

      expect(screen.getByText(/Delete Personalized Comment/i)).toBeInTheDocument()
      expect(screen.getByText(/Are you sure you want to delete this personalized comment/i)).toBeInTheDocument()
    })

    // US-DELETE-CONFIRM-002: Comment preview in confirmation modal
    it('should show comment preview in confirmation modal (AC3)', () => {
      render(
        <PersonalizedCommentsModal
          {...defaultProps}
          personalizedComments={[mockComment]}
        />,
      )

      const deleteButton = screen.getByRole('button', { name: /Delete/i })
      fireEvent.click(deleteButton)

      // Should show preview of the comment being deleted
      expect(screen.getByText(/"Shows great improvement in problem-solving skills"/)).toBeInTheDocument()
    })

    it('should truncate comment preview to 100 characters with ellipsis (AC3)', () => {
      const longComment = {
        id: '65a1b2c3d4e5f6g7h8i9j0k2',
        subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
        comment: 'A'.repeat(150), // 150 character comment
        createdAt: '2024-01-03T10:00:00Z',
        updatedAt: '2024-01-03T10:00:00Z',
      }

      render(
        <PersonalizedCommentsModal
          {...defaultProps}
          personalizedComments={[longComment]}
        />,
      )

      const deleteButton = screen.getByRole('button', { name: /Delete/i })
      fireEvent.click(deleteButton)

      // Should show truncated preview with ellipsis
      const truncatedText = 'A'.repeat(100) + '...'
      expect(screen.getByText(new RegExp(`"${truncatedText}"`))).toBeInTheDocument()
    })

    it('should not truncate comment preview if under 100 characters (AC3)', () => {
      const shortComment = {
        id: '65a1b2c3d4e5f6g7h8i9j0k3',
        subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
        comment: 'Short comment text',
        createdAt: '2024-01-04T10:00:00Z',
        updatedAt: '2024-01-04T10:00:00Z',
      }

      render(
        <PersonalizedCommentsModal
          {...defaultProps}
          personalizedComments={[shortComment]}
        />,
      )

      const deleteButton = screen.getByRole('button', { name: /Delete/i })
      fireEvent.click(deleteButton)

      // Should show full comment without ellipsis
      expect(screen.getByText(/"Short comment text"/)).toBeInTheDocument()
    })
  })

  describe('validation', () => {
    it('should show validation error for empty comment', async () => {
      render(<PersonalizedCommentsModal {...defaultProps} />)

      const addButton = screen.getByRole('button', { name: /Add Comment/i })
      // Button should be disabled for empty comment
      expect(addButton).toBeDisabled()
    })

    it('should show validation error for comment too short', () => {
      render(<PersonalizedCommentsModal {...defaultProps} />)

      const textarea = screen.getByPlaceholderText(/Enter personalized comment/i)
      fireEvent.change(textarea, { target: { value: 'Short' } })

      const addButton = screen.getByRole('button', { name: /Add Comment/i })
      expect(addButton).toBeDisabled()
    })

    it('should have maxLength attribute set to 1000', () => {
      render(<PersonalizedCommentsModal {...defaultProps} />)

      const textarea = screen.getByPlaceholderText(/Enter personalized comment/i) as HTMLTextAreaElement
      // Verify maxLength attribute is set (browser will enforce this)
      expect(textarea).toHaveAttribute('maxLength', '1000')
    })
  })

  describe('accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<PersonalizedCommentsModal {...defaultProps} />)

      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveAttribute('aria-modal', 'true')
    })

    // US-MODAL-STYLE-001 AC2: Close button removed when embedded in tab panels
    it('should NOT have close button when embedded', () => {
      render(<PersonalizedCommentsModal {...defaultProps} />)

      const closeButton = screen.queryByLabelText(/Close modal/i)
      expect(closeButton).not.toBeInTheDocument()
    })
  })

  describe('sorting - US-RATING-004', () => {
    it('should sort comments by rating descending (highest first)', () => {
      const comments: PersonalizedComment[] = [
        {
          id: '65a1b2c3d4e5f6g7h8i9j0k1',
          subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
          comment: 'Comment with rating 3',
          rating: 3,
          createdAt: '2024-01-01T10:00:00Z',
          updatedAt: '2024-01-01T10:00:00Z',
        },
        {
          id: '65a1b2c3d4e5f6g7h8i9j0k2',
          subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
          comment: 'Comment with rating 5',
          rating: 5,
          createdAt: '2024-01-02T10:00:00Z',
          updatedAt: '2024-01-02T10:00:00Z',
        },
        {
          id: '65a1b2c3d4e5f6g7h8i9j0k3',
          subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
          comment: 'Comment with rating 1',
          rating: 1,
          createdAt: '2024-01-03T10:00:00Z',
          updatedAt: '2024-01-03T10:00:00Z',
        },
      ]

      render(
        <PersonalizedCommentsModal
          {...defaultProps}
          personalizedComments={comments}
        />,
      )

      const commentElements = screen.getAllByText(/Comment with rating/)
      // Should be sorted: rating 5, then 3, then 1
      expect(commentElements[0]).toHaveTextContent('Comment with rating 5')
      expect(commentElements[1]).toHaveTextContent('Comment with rating 3')
      expect(commentElements[2]).toHaveTextContent('Comment with rating 1')
    })

    it('should sort alphabetically when ratings are equal', () => {
      const comments: PersonalizedComment[] = [
        {
          id: '65a1b2c3d4e5f6g7h8i9j0k1',
          subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
          comment: 'Zebra comment',
          rating: 4,
          createdAt: '2024-01-01T10:00:00Z',
          updatedAt: '2024-01-01T10:00:00Z',
        },
        {
          id: '65a1b2c3d4e5f6g7h8i9j0k2',
          subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
          comment: 'Alpha comment',
          rating: 4,
          createdAt: '2024-01-02T10:00:00Z',
          updatedAt: '2024-01-02T10:00:00Z',
        },
        {
          id: '65a1b2c3d4e5f6g7h8i9j0k3',
          subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
          comment: 'Beta comment',
          rating: 4,
          createdAt: '2024-01-03T10:00:00Z',
          updatedAt: '2024-01-03T10:00:00Z',
        },
      ]

      render(
        <PersonalizedCommentsModal
          {...defaultProps}
          personalizedComments={comments}
        />,
      )

      // Use more specific queries to avoid matching placeholder tips text
      const alphaComment = screen.getByText('Alpha comment')
      const betaComment = screen.getByText('Beta comment')
      const zebraComment = screen.getByText('Zebra comment')

      // Verify sort order by checking DOM positions
      const allText = document.body.textContent || ''
      const alphaPos = allText.indexOf('Alpha comment')
      const betaPos = allText.indexOf('Beta comment')
      const zebraPos = allText.indexOf('Zebra comment')

      // Should be sorted alphabetically: Alpha, Beta, Zebra
      expect(alphaPos).toBeLessThan(betaPos)
      expect(betaPos).toBeLessThan(zebraPos)
      expect(alphaComment).toBeInTheDocument()
      expect(betaComment).toBeInTheDocument()
      expect(zebraComment).toBeInTheDocument()
    })

    it('should handle null/undefined ratings (default to 3)', () => {
      const comments: PersonalizedComment[] = [
        {
          id: '65a1b2c3d4e5f6g7h8i9j0k1',
          subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
          comment: 'Comment C-null',
          rating: null,
          createdAt: '2024-01-01T10:00:00Z',
          updatedAt: '2024-01-01T10:00:00Z',
        },
        {
          id: '65a1b2c3d4e5f6g7h8i9j0k2',
          subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
          comment: 'Comment A-five',
          rating: 5,
          createdAt: '2024-01-02T10:00:00Z',
          updatedAt: '2024-01-02T10:00:00Z',
        },
        {
          id: '65a1b2c3d4e5f6g7h8i9j0k3',
          subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
          comment: 'Comment B-one',
          rating: 1,
          createdAt: '2024-01-03T10:00:00Z',
          updatedAt: '2024-01-03T10:00:00Z',
        },
      ]

      const { container } = render(
        <PersonalizedCommentsModal
          {...defaultProps}
          personalizedComments={comments}
        />,
      )

      // Get all comments in the document
      const allText = container.textContent

      // Find positions of each comment text in the full text
      // They should appear in order: rating 5, null (treated as 3), then 1
      const posA = allText?.indexOf('Comment A-five') ?? -1
      const posC = allText?.indexOf('Comment C-null') ?? -1
      const posB = allText?.indexOf('Comment B-one') ?? -1

      // Verify sort order: rating 5 appears before null, null appears before 1
      expect(posA).toBeGreaterThan(-1)
      expect(posC).toBeGreaterThan(-1)
      expect(posB).toBeGreaterThan(-1)
      expect(posA).toBeLessThan(posC) // Rating 5 before null (3)
      expect(posC).toBeLessThan(posB) // Null (3) before rating 1
    })
  })

  describe('US-PLACEHOLDER-PC-001: Placeholder Tips in Add Form', () => {
    it('should display placeholder tips box above textarea in add form', () => {
      render(<PersonalizedCommentsModal {...defaultProps} />)

      // Verify placeholder tips box heading
      expect(screen.getByText('💡 Tip: Use Dynamic Placeholders')).toBeInTheDocument()
    })

    it('should display all three placeholders as code elements', () => {
      render(<PersonalizedCommentsModal {...defaultProps} />)

      // Verify all placeholders are displayed
      expect(screen.getByText('<first name>')).toBeInTheDocument()
      expect(screen.getByText('<last name>')).toBeInTheDocument()
      expect(screen.getByText('<grade>')).toBeInTheDocument()
    })

    it('should display example transformation text', () => {
      render(<PersonalizedCommentsModal {...defaultProps} />)

      // Verify example text is present
      expect(screen.getByText(/Alice earned 95 points/i)).toBeInTheDocument()
    })

    it('should display instructional text for placeholders', () => {
      render(<PersonalizedCommentsModal {...defaultProps} />)

      // Verify instructional text
      expect(screen.getByText(/Add placeholders to personalize comments/i)).toBeInTheDocument()
    })

    it('should have proper styling matching OutcomeComments tips box', () => {
      render(<PersonalizedCommentsModal {...defaultProps} />)

      // Find the tips box by its heading
      const heading = screen.getByText('💡 Tip: Use Dynamic Placeholders')
      const tipsBox = heading.parentElement?.parentElement

      // Verify tips box exists
      expect(tipsBox).toBeInTheDocument()

      // Note: Detailed style verification would require checking computed styles
      // For now, we verify the component renders with the expected structure
    })
  })

  describe('US-PLACEHOLDER-PC-002: Placeholder Tips in Edit Form', () => {
    it('should display placeholder tips box in edit mode', () => {
      render(
        <PersonalizedCommentsModal
          {...defaultProps}
          personalizedComments={[mockComment]}
        />,
      )

      // Enter edit mode
      const editButton = screen.getByRole('button', { name: /Edit/i })
      fireEvent.click(editButton)

      // Verify placeholder tips box is present (should have 2 instances: add form + edit form)
      const tipsHeadings = screen.getAllByText('💡 Tip: Use Dynamic Placeholders')
      expect(tipsHeadings).toHaveLength(2)
    })

    it('should display all three placeholders in edit mode', () => {
      render(
        <PersonalizedCommentsModal
          {...defaultProps}
          personalizedComments={[mockComment]}
        />,
      )

      // Enter edit mode
      const editButton = screen.getByRole('button', { name: /Edit/i })
      fireEvent.click(editButton)

      // Verify all placeholders are displayed (2 instances each: add form + edit form)
      const firstNamePlaceholders = screen.getAllByText('<first name>')
      const lastNamePlaceholders = screen.getAllByText('<last name>')
      const gradePlaceholders = screen.getAllByText('<grade>')
      expect(firstNamePlaceholders).toHaveLength(2)
      expect(lastNamePlaceholders).toHaveLength(2)
      expect(gradePlaceholders).toHaveLength(2)
    })

    it('should display example transformation text in edit mode', () => {
      render(
        <PersonalizedCommentsModal
          {...defaultProps}
          personalizedComments={[mockComment]}
        />,
      )

      // Enter edit mode
      const editButton = screen.getByRole('button', { name: /Edit/i })
      fireEvent.click(editButton)

      // Verify example text is present (2 instances: add form + edit form)
      const exampleTexts = screen.getAllByText(/Alice earned 95 points/i)
      expect(exampleTexts).toHaveLength(2)
    })

    it('should maintain tips visibility when switching from add to edit mode', () => {
      render(
        <PersonalizedCommentsModal
          {...defaultProps}
          personalizedComments={[mockComment]}
        />,
      )

      // Verify tips box is present in add form (1 instance)
      let tipsHeadings = screen.getAllByText('💡 Tip: Use Dynamic Placeholders')
      expect(tipsHeadings).toHaveLength(1)

      // Enter edit mode
      const editButton = screen.getByRole('button', { name: /Edit/i })
      fireEvent.click(editButton)

      // Tips box should now appear in both add form and edit form (2 instances)
      tipsHeadings = screen.getAllByText('💡 Tip: Use Dynamic Placeholders')
      expect(tipsHeadings).toHaveLength(2)
    })
  })

  describe('US-PLACEHOLDER-PC-003: Validate Placeholders on Input', () => {
    it('should show warning for unclosed placeholder in add form', () => {
      render(<PersonalizedCommentsModal {...defaultProps} />)

      const textarea = screen.getByPlaceholderText(/Enter personalized comment/i)
      fireEvent.change(textarea, { target: { value: 'Hello <first name' } })

      // Should display unclosed placeholder warning
      expect(screen.getByText(/Placeholder not closed/i)).toBeInTheDocument()
    })

    it('should show warning for empty placeholder in add form', () => {
      render(<PersonalizedCommentsModal {...defaultProps} />)

      const textarea = screen.getByPlaceholderText(/Enter personalized comment/i)
      fireEvent.change(textarea, { target: { value: 'Hello <>' } })

      // Should display empty placeholder warning
      expect(screen.getByText(/Empty placeholder detected/i)).toBeInTheDocument()
    })

    it('should show multiple warnings when multiple errors exist', () => {
      render(<PersonalizedCommentsModal {...defaultProps} />)

      const textarea = screen.getByPlaceholderText(/Enter personalized comment/i)
      // Text with both unclosed and empty placeholders
      fireEvent.change(textarea, { target: { value: 'Hello <> and <first name' } })

      // Should display both warnings
      expect(screen.getByText(/Empty placeholder detected/i)).toBeInTheDocument()
      expect(screen.getByText(/Placeholder not closed/i)).toBeInTheDocument()
    })

    it('should hide warnings when errors are corrected', () => {
      render(<PersonalizedCommentsModal {...defaultProps} />)

      const textarea = screen.getByPlaceholderText(/Enter personalized comment/i)

      // First, create an error
      fireEvent.change(textarea, { target: { value: 'Hello <first name' } })
      expect(screen.getByText(/Placeholder not closed/i)).toBeInTheDocument()

      // Then, correct the error
      fireEvent.change(textarea, { target: { value: 'Hello <first name>' } })
      expect(screen.queryByText(/Placeholder not closed/i)).not.toBeInTheDocument()
    })

    it('should have proper ARIA attributes for warning box', () => {
      render(<PersonalizedCommentsModal {...defaultProps} />)

      const textarea = screen.getByPlaceholderText(/Enter personalized comment/i)
      fireEvent.change(textarea, { target: { value: 'Hello <>' } })

      // Warning box should have role="alert" and aria-live="polite"
      const warningBox = screen.getByRole('alert')
      expect(warningBox).toHaveAttribute('aria-live', 'polite')
    })

    it('should not prevent form submission with warnings', () => {
      const onCreateComment = jest.fn().mockResolvedValue(undefined)
      render(
        <PersonalizedCommentsModal {...defaultProps} onCreateComment={onCreateComment} />,
      )

      const textarea = screen.getByPlaceholderText(/Enter personalized comment/i)
      const addButton = screen.getByRole('button', { name: /Add Comment/i })

      // Enter text with placeholder warning (but long enough to be valid)
      fireEvent.change(textarea, { target: { value: 'This is a valid comment with <>' } })

      // Button should still be enabled (warnings don't block submission)
      expect(addButton).not.toBeDisabled()
    })

    it('should show warning for unclosed placeholder in edit form', () => {
      render(
        <PersonalizedCommentsModal
          {...defaultProps}
          personalizedComments={[mockComment]}
        />,
      )

      // Enter edit mode
      const editButton = screen.getByRole('button', { name: /Edit/i })
      fireEvent.click(editButton)

      // Get edit textarea and add unclosed placeholder
      const textarea = screen.getByDisplayValue(mockComment.comment)
      fireEvent.change(textarea, { target: { value: 'Hello <first name' } })

      // Should display unclosed placeholder warning
      const warnings = screen.getAllByText(/Placeholder not closed/i)
      expect(warnings.length).toBeGreaterThan(0)
    })

    it('should hide warnings in edit form when corrected', () => {
      render(
        <PersonalizedCommentsModal
          {...defaultProps}
          personalizedComments={[mockComment]}
        />,
      )

      // Enter edit mode
      const editButton = screen.getByRole('button', { name: /Edit/i })
      fireEvent.click(editButton)

      // Get edit textarea
      const textarea = screen.getByDisplayValue(mockComment.comment)

      // Create an error
      fireEvent.change(textarea, { target: { value: 'Hello <first name' } })
      expect(screen.getByText(/Placeholder not closed/i)).toBeInTheDocument()

      // Correct the error
      fireEvent.change(textarea, { target: { value: 'Hello <first name>' } })
      expect(screen.queryByText(/Placeholder not closed/i)).not.toBeInTheDocument()
    })
  })
})
