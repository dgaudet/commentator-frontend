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
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { PersonalizedCommentsModal } from '../PersonalizedCommentsModal'
import type { PersonalizedComment } from '../../../types'

describe('PersonalizedCommentsModal - Rating Selector Integration', () => {
  const mockSubject = { id: 1, name: 'Mathematics', createdAt: '', updatedAt: '' }

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

      // Rating 3 button should be selected (aria-pressed="true")
      const rating3Button = screen.getByLabelText(/rate 3 out of 5.*neutral/i)
      expect(rating3Button).toHaveAttribute('aria-pressed', 'true')
    })

    it('allows changing rating in add comment form', () => {
      render(<PersonalizedCommentsModal {...defaultProps} />)

      // Click rating 5 button
      const rating5Button = screen.getByLabelText(/rate 5 out of 5.*very positive/i)
      fireEvent.click(rating5Button)

      // Rating 5 should now be selected
      expect(rating5Button).toHaveAttribute('aria-pressed', 'true')
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
          subjectId: 1,
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
          subjectId: 1,
          comment: 'Valid comment with default rating',
          rating: 3, // Default rating
        })
      })
    })

    it('resets rating to default after successful create', async () => {
      const onCreateComment = jest.fn().mockResolvedValue(undefined)
      render(
        <PersonalizedCommentsModal {...defaultProps} onCreateComment={onCreateComment} />,
      )

      // Select rating 5
      const rating5Button = screen.getByLabelText(/rate 5 out of 5.*very positive/i)
      fireEvent.click(rating5Button)
      expect(rating5Button).toHaveAttribute('aria-pressed', 'true')

      // Submit form
      const textarea = screen.getByPlaceholderText(/enter personalized comment/i)
      fireEvent.change(textarea, { target: { value: 'Test comment' } })
      const addButton = screen.getByRole('button', { name: /add comment/i })
      fireEvent.click(addButton)

      await waitFor(() => {
        expect(onCreateComment).toHaveBeenCalled()
      })

      // Rating should reset to 3 after successful create
      await waitFor(() => {
        const rating3Button = screen.getByLabelText(/rate 3 out of 5.*neutral/i)
        expect(rating3Button).toHaveAttribute('aria-pressed', 'true')
      })
    })
  })

  describe('Edit Comment Form - Rating Selector', () => {
    it('displays rating selector in edit comment form', async () => {
      const comment: PersonalizedComment = {
        id: 1,
        subjectId: 1,
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
        id: 1,
        subjectId: 1,
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
      // There are 2 rating 4 buttons (add form + edit form), filter by aria-pressed
      await waitFor(() => {
        const rating4Buttons = screen.getAllByLabelText(/rate 4 out of 5.*positive/i)
        const selectedRating4 = rating4Buttons.find(btn => btn.getAttribute('aria-pressed') === 'true')
        expect(selectedRating4).toBeDefined()
      })
    })

    it('allows changing rating in edit form', async () => {
      const comment: PersonalizedComment = {
        id: 1,
        subjectId: 1,
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
        const selectedRating5 = rating5Buttons.find(btn => btn.getAttribute('aria-pressed') === 'true')
        expect(selectedRating5).toBeDefined()
      })
    })

    it('includes rating in onUpdateComment API call', async () => {
      const onUpdateComment = jest.fn().mockResolvedValue(undefined)
      const comment: PersonalizedComment = {
        id: 1,
        subjectId: 1,
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
        expect(onUpdateComment).toHaveBeenCalledWith(1, {
          comment: 'Existing comment',
          rating: 5,
        })
      })
    })

    it('defaults to rating 3 when editing comment with null rating', async () => {
      const comment: PersonalizedComment = {
        id: 1,
        subjectId: 1,
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
        // Both should have aria-pressed="true" (add form defaults to 3, edit form loads null as 3)
        const selectedButtons = rating3Buttons.filter(btn => btn.getAttribute('aria-pressed') === 'true')
        expect(selectedButtons.length).toBe(2) // Both add and edit forms show rating 3 selected
      })
    })
  })
})
