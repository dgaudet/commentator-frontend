/**
 * PersonalizedCommentsModal - Rating Selector Integration Tests
 * TDD Phase: RED - Writing failing tests first
 * Reference: US-RATING-003 - Add Rating Selector to Forms
 *
 * Testing EmojiRatingSelector integration:
 * - Selector appears in add comment form with default rating 3
 * - Selector appears in edit comment form with existing rating
 * - Rating is included in onCreate/onUpdate API calls
 * - Rating is required field (validation)
 */
import { render, screen, fireEvent, waitFor } from '../../../test-utils'
import { PersonalizedCommentsModal } from '../PersonalizedCommentsModal'
import type { PersonalizedComment } from '../../../types'

describe('PersonalizedCommentsModal - Rating Selector Integration', () => {
  const mockSubject = { id: '65a1b2c3d4e5f6g7h8i9j0k1', name: 'Mathematics', createdAt: '', updatedAt: '' }

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

  describe('Add Comment Form - Rating Selector', () => {
    it('displays rating selector in add comment form', () => {
      render(<PersonalizedCommentsModal {...defaultProps} />)

      // Check for rating selector (look for all 5 emoji buttons)
      expect(screen.getByLabelText(/rate 1 out of 5.*very negative/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/rate 2 out of 5.*negative/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/rate 3 out of 5.*neutral/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/rate 4 out of 5.*positive/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/rate 5 out of 5.*very positive/i)).toBeInTheDocument()
    })

    it('defaults to rating 3 (Neutral) in add comment form', () => {
      render(<PersonalizedCommentsModal {...defaultProps} />)

      // Rating 3 button should be selected (aria-checked="true")
      const rating3Button = screen.getByLabelText(/rate 3 out of 5.*neutral/i)
      expect(rating3Button).toHaveAttribute('aria-checked', 'true')
    })

    it('allows changing rating in add comment form', () => {
      render(<PersonalizedCommentsModal {...defaultProps} />)

      // Click rating 5 button
      const rating5Button = screen.getByLabelText(/rate 5 out of 5.*very positive/i)
      fireEvent.click(rating5Button)

      // Rating 5 should now be selected
      expect(rating5Button).toHaveAttribute('aria-checked', 'true')
    })

    it('includes rating in onCreateComment API call', async () => {
      const onCreateComment = jest.fn().mockResolvedValue(undefined)
      render(
        <PersonalizedCommentsModal {...defaultProps} onCreateComment={onCreateComment} />,
      )

      // Enter valid comment
      const textarea = screen.getByPlaceholderText(/enter personalized comment/i)
      fireEvent.change(textarea, { target: { value: 'This is a valid comment' } })

      // Select rating 4
      const rating4Button = screen.getByLabelText(/rate 4 out of 5.*positive/i)
      fireEvent.click(rating4Button)

      // Submit form
      const addButton = screen.getByRole('button', { name: /add comment/i })
      fireEvent.click(addButton)

      await waitFor(() => {
        expect(onCreateComment).toHaveBeenCalledTimes(1)
        expect(onCreateComment).toHaveBeenCalledWith({
          subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
          comment: 'This is a valid comment',
          rating: 4,
        })
      })
    })

    it('includes default rating 3 when no rating explicitly selected', async () => {
      const onCreateComment = jest.fn().mockResolvedValue(undefined)
      render(
        <PersonalizedCommentsModal {...defaultProps} onCreateComment={onCreateComment} />,
      )

      // Enter valid comment (don't change rating, leave at default 3)
      const textarea = screen.getByPlaceholderText(/enter personalized comment/i)
      fireEvent.change(textarea, { target: { value: 'Valid comment with default rating' } })

      // Submit form
      const addButton = screen.getByRole('button', { name: /add comment/i })
      fireEvent.click(addButton)

      await waitFor(() => {
        expect(onCreateComment).toHaveBeenCalledWith({
          subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
          comment: 'Valid comment with default rating',
          rating: 3, // Default rating
        })
      })
    })

    it('DEPRECATED: clears comment text but persists rating after successful create (see Rating Persistence tests)', async () => {
      // NOTE: This test was originally about resetting rating to default after create,
      // but that behavior changed with US-RATING-PERSIST-001.
      // The new behavior is to PERSIST the rating instead of resetting it.
      // See "Rating Persistence" describe block for the new tests.
      const onCreateComment = jest.fn().mockResolvedValue(undefined)
      render(
        <PersonalizedCommentsModal {...defaultProps} onCreateComment={onCreateComment} />,
      )

      // Select rating 5
      const rating5Button = screen.getByLabelText(/rate 5 out of 5.*very positive/i)
      fireEvent.click(rating5Button)
      expect(rating5Button).toHaveAttribute('aria-checked', 'true')

      // Submit form
      const textarea = screen.getByPlaceholderText(/enter personalized comment/i)
      fireEvent.change(textarea, { target: { value: 'Test comment' } })
      const addButton = screen.getByRole('button', { name: /add comment/i })
      fireEvent.click(addButton)

      await waitFor(() => {
        expect(onCreateComment).toHaveBeenCalled()
      })

      // Rating should persist at 5 (not reset to 3) - NEW BEHAVIOR
      await waitFor(() => {
        const rating5ButtonAfter = screen.getByLabelText(/rate 5 out of 5.*very positive/i)
        expect(rating5ButtonAfter).toHaveAttribute('aria-checked', 'true')
      })

      // Comment text should be cleared for next entry
      expect(textarea).toHaveValue('')
    })
  })

  describe('Rating Persistence (US-RATING-PERSIST-001, US-RATING-PERSIST-002, US-RATING-PERSIST-003)', () => {
    it('should persist rating after successful add instead of resetting to default', async () => {
      const onCreateComment = jest.fn().mockResolvedValue(undefined)
      render(
        <PersonalizedCommentsModal {...defaultProps} onCreateComment={onCreateComment} />,
      )

      // Select rating 5
      const rating5Button = screen.getByLabelText(/rate 5 out of 5.*very positive/i)
      fireEvent.click(rating5Button)

      // Submit form
      const textarea = screen.getByPlaceholderText(/enter personalized comment/i)
      fireEvent.change(textarea, { target: { value: 'Test comment' } })
      const addButton = screen.getByRole('button', { name: /add comment/i })
      fireEvent.click(addButton)

      await waitFor(() => {
        expect(onCreateComment).toHaveBeenCalled()
      })

      // Rating should persist at 5 (not reset to 3)
      await waitFor(() => {
        const rating5ButtonAfter = screen.getByLabelText(/rate 5 out of 5.*very positive/i)
        expect(rating5ButtonAfter).toHaveAttribute('aria-checked', 'true')
      })
    })

    it('should support adding multiple comments with the same persistent rating', async () => {
      const onCreateComment = jest.fn().mockResolvedValue(undefined)
      render(
        <PersonalizedCommentsModal {...defaultProps} onCreateComment={onCreateComment} />,
      )

      // Select rating 4 and add first comment
      const rating4Button = screen.getByLabelText(/rate 4 out of 5.*positive/i)
      fireEvent.click(rating4Button)
      const textarea = screen.getByPlaceholderText(/enter personalized comment/i)
      fireEvent.change(textarea, { target: { value: 'First comment' } })
      const addButton = screen.getByRole('button', { name: /add comment/i })
      fireEvent.click(addButton)

      await waitFor(() => {
        expect(onCreateComment).toHaveBeenCalledWith(
          expect.objectContaining({ rating: 4 }),
        )
      })

      // Clear the textarea for next comment
      fireEvent.change(textarea, { target: { value: '' } })

      // Verify rating is still 4
      await waitFor(() => {
        const rating4ButtonAfter = screen.getByLabelText(/rate 4 out of 5.*positive/i)
        expect(rating4ButtonAfter).toHaveAttribute('aria-checked', 'true')
      })

      // Add second comment without changing rating
      fireEvent.change(textarea, { target: { value: 'Second comment' } })
      fireEvent.click(addButton)

      await waitFor(() => {
        expect(onCreateComment).toHaveBeenLastCalledWith(
          expect.objectContaining({ rating: 4 }),
        )
      })
    })

    it('should allow changing persisted rating by clicking a different emoji', async () => {
      const onCreateComment = jest.fn().mockResolvedValue(undefined)
      render(
        <PersonalizedCommentsModal {...defaultProps} onCreateComment={onCreateComment} />,
      )

      // Select rating 4 and add comment
      const rating4Button = screen.getByLabelText(/rate 4 out of 5.*positive/i)
      fireEvent.click(rating4Button)
      const textarea = screen.getByPlaceholderText(/enter personalized comment/i)
      fireEvent.change(textarea, { target: { value: 'First comment' } })
      const addButton = screen.getByRole('button', { name: /add comment/i })
      fireEvent.click(addButton)

      await waitFor(() => {
        expect(onCreateComment).toHaveBeenCalled()
      })

      // Change rating to 2
      const rating2Button = screen.getByLabelText(/rate 2 out of 5.*negative/i)
      fireEvent.click(rating2Button)

      await waitFor(() => {
        expect(rating2Button).toHaveAttribute('aria-checked', 'true')
      })

      // Verify rating 2 is now selected
      expect(rating2Button).toHaveAttribute('aria-checked', 'true')
    })

    it('should persist rating from edited comment when returning to add form', async () => {
      const onUpdateComment = jest.fn().mockResolvedValue(undefined)
      const comment: PersonalizedComment = {
        id: '65a1b2c3d4e5f6g7h8i9j0k1',
        subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
        comment: 'Existing comment',
        rating: 2,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
      }

      render(
        <PersonalizedCommentsModal
          {...defaultProps}
          personalizedComments={[comment]}
          onUpdateComment={onUpdateComment}
        />,
      )

      // Click Edit button
      const editButton = screen.getByRole('button', { name: /edit/i })
      fireEvent.click(editButton)

      // Change rating to 1 and save
      await waitFor(() => {
        const rating1Buttons = screen.getAllByLabelText(/rate 1 out of 5.*very negative/i)
        fireEvent.click(rating1Buttons[1]) // Click edit form rating 1
      })

      const saveButton = screen.getByRole('button', { name: /save/i })
      fireEvent.click(saveButton)

      await waitFor(() => {
        expect(onUpdateComment).toHaveBeenCalled()
      })

      // After edit completes, add form should show rating 1 (from the edited comment)
      await waitFor(() => {
        const rating1Button = screen.getByLabelText(/rate 1 out of 5.*very negative/i)
        expect(rating1Button).toHaveAttribute('aria-checked', 'true')
      })
    })

    it('should reset rating to default (3) when modal closes and reopens', async () => {
      const { rerender } = render(
        <PersonalizedCommentsModal {...defaultProps} />,
      )

      // Select rating 5
      const rating5Button = screen.getByLabelText(/rate 5 out of 5.*very positive/i)
      fireEvent.click(rating5Button)

      await waitFor(() => {
        expect(rating5Button).toHaveAttribute('aria-checked', 'true')
      })

      // Close modal
      rerender(
        <PersonalizedCommentsModal {...defaultProps} isOpen={false} />,
      )

      // Reopen modal
      rerender(
        <PersonalizedCommentsModal {...defaultProps} isOpen={true} />,
      )

      // Rating should be reset to 3
      await waitFor(() => {
        const rating3Button = screen.getByLabelText(/rate 3 out of 5.*neutral/i)
        expect(rating3Button).toHaveAttribute('aria-checked', 'true')
      })
    })
  })

  describe('Edit Comment Form - Rating Selector', () => {
    it('displays rating selector in edit comment form', async () => {
      const comment: PersonalizedComment = {
        id: '65a1b2c3d4e5f6g7h8i9j0k1',
        subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
        comment: 'Existing comment',
        rating: 4,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
      }

      render(
        <PersonalizedCommentsModal
          {...defaultProps}
          personalizedComments={[comment]}
        />,
      )

      // Click Edit button
      const editButton = screen.getByRole('button', { name: /edit/i })
      fireEvent.click(editButton)

      // Rating selector should appear (check for edit form selector specifically)
      await waitFor(() => {
        // Both add form and edit form selectors are present, so total should be 10 buttons
        expect(screen.getAllByLabelText(/rate \d out of 5/i)).toHaveLength(10)
      })
    })

    it('pre-fills existing rating in edit form', async () => {
      const comment: PersonalizedComment = {
        id: '65a1b2c3d4e5f6g7h8i9j0k1',
        subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
        comment: 'Existing comment',
        rating: 4,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
      }

      render(
        <PersonalizedCommentsModal
          {...defaultProps}
          personalizedComments={[comment]}
        />,
      )

      // Click Edit button
      const editButton = screen.getByRole('button', { name: /edit/i })
      fireEvent.click(editButton)

      // Rating 4 should be selected in edit form
      // There are 2 rating 4 buttons (add form + edit form), filter by aria-checked
      await waitFor(() => {
        const rating4Buttons = screen.getAllByLabelText(/rate 4 out of 5.*positive/i)
        const selectedRating4 = rating4Buttons.find(btn => btn.getAttribute('aria-checked') === 'true')
        expect(selectedRating4).toBeDefined()
      })
    })

    it('allows changing rating in edit form', async () => {
      const comment: PersonalizedComment = {
        id: '65a1b2c3d4e5f6g7h8i9j0k1',
        subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
        comment: 'Existing comment',
        rating: 3,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
      }

      render(
        <PersonalizedCommentsModal
          {...defaultProps}
          personalizedComments={[comment]}
        />,
      )

      // Click Edit button
      const editButton = screen.getByRole('button', { name: /edit/i })
      fireEvent.click(editButton)

      // Change rating to 5 (get all rating 5 buttons and click the second one - edit form)
      await waitFor(() => {
        const rating5Buttons = screen.getAllByLabelText(/rate 5 out of 5.*very positive/i)
        // Click the edit form rating button (second one)
        fireEvent.click(rating5Buttons[1])
        const selectedRating5 = rating5Buttons.find(btn => btn.getAttribute('aria-checked') === 'true')
        expect(selectedRating5).toBeDefined()
      })
    })

    it('includes rating in onUpdateComment API call', async () => {
      const onUpdateComment = jest.fn().mockResolvedValue(undefined)
      const comment: PersonalizedComment = {
        id: '65a1b2c3d4e5f6g7h8i9j0k1',
        subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
        comment: 'Existing comment',
        rating: 3,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
      }

      render(
        <PersonalizedCommentsModal
          {...defaultProps}
          personalizedComments={[comment]}
          onUpdateComment={onUpdateComment}
        />,
      )

      // Click Edit button
      const editButton = screen.getByRole('button', { name: /edit/i })
      fireEvent.click(editButton)

      // Change rating to 5 (get all rating 5 buttons and click the second one - edit form)
      await waitFor(() => {
        const rating5Buttons = screen.getAllByLabelText(/rate 5 out of 5.*very positive/i)
        fireEvent.click(rating5Buttons[1])
      })

      // Save changes
      const saveButton = screen.getByRole('button', { name: /save/i })
      fireEvent.click(saveButton)

      await waitFor(() => {
        expect(onUpdateComment).toHaveBeenCalledTimes(1)
        expect(onUpdateComment).toHaveBeenCalledWith('65a1b2c3d4e5f6g7h8i9j0k1', {
          subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
          comment: 'Existing comment',
          rating: 5,
        })
      })
    })

    it('defaults to rating 3 when editing comment with null rating', async () => {
      const comment: PersonalizedComment = {
        id: '65a1b2c3d4e5f6g7h8i9j0k1',
        subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
        comment: 'Legacy comment',
        rating: null,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
      }

      render(
        <PersonalizedCommentsModal
          {...defaultProps}
          personalizedComments={[comment]}
        />,
      )

      // Click Edit button
      const editButton = screen.getByRole('button', { name: /edit/i })
      fireEvent.click(editButton)

      // Rating 3 should be selected in edit form (default for null)
      // There are 2 rating 3 buttons (add form + edit form)
      await waitFor(() => {
        const rating3Buttons = screen.getAllByLabelText(/rate 3 out of 5.*neutral/i)
        // Both should have aria-checked="true" (add form defaults to 3, edit form loads null as 3)
        const selectedButtons = rating3Buttons.filter(btn => btn.getAttribute('aria-checked') === 'true')
        expect(selectedButtons.length).toBe(2) // Both add and edit forms show rating 3 selected
      })
    })
  })
})
