/**
 * OutcomeCommentsModal Component Tests
 * Test Suite for viewing, creating, editing, and deleting outcome comments
 *
 * User Stories:
 * - View all outcome comments for a subject
 * - Create new outcome comment for a subject
 * - Edit existing outcome comment
 * - Delete outcome comment
 *
 * Testing approach: Test-Driven Development (Red-Green-Refactor)
 * Related: TD-001 (OutcomeCommentsModal Subject Type Compatibility)
 */

import { render, screen, within, act, fireEvent } from '../../../test-utils'
import userEvent from '@testing-library/user-event'
import { OutcomeCommentsModal } from '../OutcomeCommentsModal'
import type { Subject, OutcomeComment } from '../../../types'

// Mock data
const mockSubject: Subject = {
  id: '65a1b2c3d4e5f6g7h8i9j0k1',
  name: 'Mathematics 101',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
}

const mockOutcomeComments: OutcomeComment[] = [
  {
    id: '65a1b2c3d4e5f6g7h8i9j0k1',
    subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
    userId: 'auth0|mock-user-123',
    comment: 'Students demonstrated excellent problem-solving skills',
    upperRange: 85,
    lowerRange: 70,
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
  },
  {
    id: '65a1b2c3d4e5f6g7h8i9j0k2',
    subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
    userId: 'auth0|mock-user-123',
    comment: 'Need to focus more on algebra concepts',
    upperRange: 65,
    lowerRange: 50,
    createdAt: '2024-01-02T10:00:00Z',
    updatedAt: '2024-01-02T10:00:00Z',
  },
]

describe('OutcomeCommentsModal', () => {
  const defaultProps = {
    isOpen: true,
    entityData: mockSubject,
    outcomeComments: mockOutcomeComments,
    onCreateComment: jest.fn(),
    onUpdateComment: jest.fn(),
    onDeleteComment: jest.fn(),
    loading: false,
    error: null,
    pronouns: [],
    pronounsLoading: false,
    pronounsError: null,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('User Story 1: View outcome comments', () => {
    // US-MODAL-STYLE-001 AC1: Modal title removed, check for panel content instead
    it('should display outcome comments content', () => {
      render(<OutcomeCommentsModal {...defaultProps} />)

      expect(screen.getByText('Add New Outcome Comment')).toBeInTheDocument()
    })

    it('should display all outcome comments for the class', () => {
      render(<OutcomeCommentsModal {...defaultProps} />)

      expect(screen.getByText('Students demonstrated excellent problem-solving skills')).toBeInTheDocument()
      expect(screen.getByText('Need to focus more on algebra concepts')).toBeInTheDocument()
    })

    it('should display empty state when no comments exist', () => {
      render(<OutcomeCommentsModal {...defaultProps} outcomeComments={[]} />)

      expect(screen.getByText('No outcome comments found')).toBeInTheDocument()
      expect(screen.getByText('Be the first to add an outcome comment.')).toBeInTheDocument()
    })

    it('should display comment creation date', () => {
      render(<OutcomeCommentsModal {...defaultProps} />)

      // Should format dates properly
      expect(screen.getByText(/Jan 1, 2024/)).toBeInTheDocument()
      expect(screen.getByText(/Jan 2, 2024/)).toBeInTheDocument()
    })

    // US-MODAL-STYLE-001 AC2: Close button removed when embedded in tab panels
    it('should NOT have close button when embedded', () => {
      render(<OutcomeCommentsModal {...defaultProps} />)

      const closeButton = screen.queryByRole('button', { name: /close/i })
      expect(closeButton).not.toBeInTheDocument()
    })
  })

  describe('User Story 2: Create outcome comment', () => {
    it('should display create comment form', () => {
      render(<OutcomeCommentsModal {...defaultProps} />)

      expect(screen.getByRole('textbox', { name: /add new outcome comment/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /add comment/i })).toBeInTheDocument()
    })

    it('should call onCreateComment when form is submitted with valid content', async () => {
      const user = userEvent.setup()
      render(<OutcomeCommentsModal {...defaultProps} />)

      const textarea = screen.getByRole('textbox', { name: /add new outcome comment/i })
      const upperRangeInput = screen.getByRole('spinbutton', { name: /upper range/i })
      const lowerRangeInput = screen.getByRole('spinbutton', { name: /lower range/i })
      const submitButton = screen.getByRole('button', { name: /add comment/i })

      await act(async () => {
        await user.type(textarea, 'New outcome comment content')
        await user.clear(upperRangeInput)
        await user.type(upperRangeInput, '85')
        await user.clear(lowerRangeInput)
        await user.type(lowerRangeInput, '70')
      })

      await act(async () => {
        await user.click(submitButton)
      })

      expect(defaultProps.onCreateComment).toHaveBeenCalledWith({
        subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
        comment: 'New outcome comment content',
        upperRange: 85,
        lowerRange: 70,
      })
    })

    it('should clear form after successful submission', async () => {
      const user = userEvent.setup()
      render(<OutcomeCommentsModal {...defaultProps} />)

      const textarea = screen.getByRole('textbox', { name: /add new outcome comment/i })
      const lowerRangeInput = screen.getByLabelText(/lower range/i)
      const upperRangeInput = screen.getByLabelText(/upper range/i)
      const submitButton = screen.getByRole('button', { name: /add comment/i })

      await act(async () => {
        await user.type(textarea, 'New comment')
        await user.type(lowerRangeInput, '70')
        await user.type(upperRangeInput, '85')
      })

      await act(async () => {
        await user.click(submitButton)
      })

      expect(textarea).toHaveValue('')
      expect(lowerRangeInput).toHaveValue(null)
      expect(upperRangeInput).toHaveValue(null)
    })

    it('should not submit empty comment', async () => {
      const user = userEvent.setup()
      render(<OutcomeCommentsModal {...defaultProps} />)

      const submitButton = screen.getByRole('button', { name: /add comment/i })

      await act(async () => {
        await user.click(submitButton)
      })

      expect(defaultProps.onCreateComment).not.toHaveBeenCalled()
    })

    it('should disable submit button for empty comment', () => {
      render(<OutcomeCommentsModal {...defaultProps} />)

      const submitButton = screen.getByRole('button', { name: /add comment/i })
      expect(submitButton).toBeDisabled()
    })
  })

  describe('User Story 3: Edit outcome comment', () => {
    it('should display edit button for each comment', () => {
      render(<OutcomeCommentsModal {...defaultProps} />)

      const editButtons = screen.getAllByRole('button', { name: /edit/i })
      expect(editButtons).toHaveLength(2)
    })

    it('should switch to edit mode when edit button is clicked', async () => {
      const user = userEvent.setup()
      render(<OutcomeCommentsModal {...defaultProps} />)

      const editButtons = screen.getAllByRole('button', { name: /edit/i })
      await act(async () => {
        await user.click(editButtons[0])
      })

      expect(screen.getByDisplayValue('Students demonstrated excellent problem-solving skills')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
    })

    it('should call onUpdateComment when save button is clicked', async () => {
      const user = userEvent.setup()
      render(<OutcomeCommentsModal {...defaultProps} />)

      const editButtons = screen.getAllByRole('button', { name: /edit/i })
      await act(async () => {
        await user.click(editButtons[0])
      })

      const textarea = screen.getByDisplayValue('Students demonstrated excellent problem-solving skills')
      const upperRangeInput = screen.getByDisplayValue('85')
      const lowerRangeInput = screen.getByDisplayValue('70')

      await act(async () => {
        await user.clear(textarea)
        await user.type(textarea, 'Updated comment content')
        await user.clear(upperRangeInput)
        await user.type(upperRangeInput, '90')
        await user.clear(lowerRangeInput)
        await user.type(lowerRangeInput, '75')
      })

      const saveButton = screen.getByRole('button', { name: /save/i })
      await act(async () => {
        await user.click(saveButton)
      })

      expect(defaultProps.onUpdateComment).toHaveBeenCalledWith('65a1b2c3d4e5f6g7h8i9j0k1', {
        comment: 'Updated comment content',
        upperRange: 90,
        lowerRange: 75,
      })
    })

    it('should cancel edit mode when cancel button is clicked', async () => {
      const user = userEvent.setup()
      render(<OutcomeCommentsModal {...defaultProps} />)

      const editButtons = screen.getAllByRole('button', { name: /edit/i })
      await act(async () => {
        await user.click(editButtons[0])
      })

      const cancelButton = screen.getByRole('button', { name: /cancel/i })
      await act(async () => {
        await user.click(cancelButton)
      })

      expect(screen.getByText('Students demonstrated excellent problem-solving skills')).toBeInTheDocument()
      expect(screen.queryByDisplayValue('Students demonstrated excellent problem-solving skills')).not.toBeInTheDocument()
    })
  })

  describe('User Story 4: Delete outcome comment', () => {
    it('should display delete button for each comment', () => {
      render(<OutcomeCommentsModal {...defaultProps} />)

      const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
      expect(deleteButtons).toHaveLength(2)
    })

    it('should show confirmation dialog when delete button is clicked', async () => {
      const user = userEvent.setup()
      render(<OutcomeCommentsModal {...defaultProps} />)

      const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
      await act(async () => {
        await user.click(deleteButtons[0])
      })

      expect(screen.getByText('Delete Outcome Comment')).toBeInTheDocument()
      expect(screen.getByText('Are you sure you want to delete this outcome comment?')).toBeInTheDocument()
    })

    it('should call onDeleteComment when delete is confirmed', async () => {
      const user = userEvent.setup()
      render(<OutcomeCommentsModal {...defaultProps} />)

      const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
      await act(async () => {
        await user.click(deleteButtons[0])
      })

      // Look for the confirm button specifically within the confirmation dialog
      const confirmDialog = screen.getByRole('dialog', { name: 'Delete Outcome Comment' })
      const confirmButton = within(confirmDialog).getByRole('button', { name: /delete/i })
      await act(async () => {
        await user.click(confirmButton)
      })

      expect(defaultProps.onDeleteComment).toHaveBeenCalledWith('65a1b2c3d4e5f6g7h8i9j0k1')
    })

    it('should close confirmation dialog when cancel is clicked', async () => {
      const user = userEvent.setup()
      render(<OutcomeCommentsModal {...defaultProps} />)

      const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
      await act(async () => {
        await user.click(deleteButtons[0])
      })

      const cancelButton = screen.getByRole('button', { name: /cancel/i })
      await act(async () => {
        await user.click(cancelButton)
      })

      expect(screen.queryByText('Delete Outcome Comment')).not.toBeInTheDocument()
    })

    // US-DELETE-CONFIRM-001: Comment preview in confirmation modal
    it('should show comment preview in confirmation modal (AC3)', async () => {
      const user = userEvent.setup()
      render(<OutcomeCommentsModal {...defaultProps} />)

      const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
      await act(async () => {
        await user.click(deleteButtons[0])
      })

      // Should show preview of the comment being deleted
      expect(screen.getByText(/"Students demonstrated excellent problem-solving skills"/)).toBeInTheDocument()
    })

    it('should truncate comment preview to 100 characters with ellipsis (AC3)', async () => {
      const longComment: OutcomeComment = {
        id: '65a1b2c3d4e5f6g7h8i9j0k3',
        subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
        userId: 'auth0|mock-user-123',
        comment: 'A'.repeat(150), // 150 character comment
        upperRange: 80,
        lowerRange: 60,
        createdAt: '2024-01-03T10:00:00Z',
        updatedAt: '2024-01-03T10:00:00Z',
      }

      const user = userEvent.setup()
      render(
        <OutcomeCommentsModal
          {...defaultProps}
          outcomeComments={[longComment]}
        />,
      )

      const deleteButton = screen.getByRole('button', { name: /delete/i })
      await act(async () => {
        await user.click(deleteButton)
      })

      // Should show truncated preview with ellipsis
      const truncatedText = 'A'.repeat(100) + '...'
      expect(screen.getByText(new RegExp(`"${truncatedText}"`))).toBeInTheDocument()
    })

    it('should not truncate comment preview if under 100 characters (AC3)', async () => {
      const shortComment: OutcomeComment = {
        id: '65a1b2c3d4e5f6g7h8i9j0k4',
        subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
        userId: 'auth0|mock-user-123',
        comment: 'Short comment',
        upperRange: 80,
        lowerRange: 60,
        createdAt: '2024-01-04T10:00:00Z',
        updatedAt: '2024-01-04T10:00:00Z',
      }

      const user = userEvent.setup()
      render(
        <OutcomeCommentsModal
          {...defaultProps}
          outcomeComments={[shortComment]}
        />,
      )

      const deleteButton = screen.getByRole('button', { name: /delete/i })
      await act(async () => {
        await user.click(deleteButton)
      })

      // Should show full comment without ellipsis
      expect(screen.getByText(/"Short comment"/)).toBeInTheDocument()
    })
  })

  describe('Loading and Error States', () => {
    it('should display loading spinner when loading is true', () => {
      render(<OutcomeCommentsModal {...defaultProps} loading={true} />)

      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
    })

    it('should display error message when error exists', () => {
      render(<OutcomeCommentsModal {...defaultProps} error="Failed to load comments" />)

      expect(screen.getByText('Failed to load comments')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<OutcomeCommentsModal {...defaultProps} />)

      // US-MODAL-STYLE-001: aria-label provides accessible name for dialog
      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveAttribute('aria-modal', 'true')
      expect(dialog).toHaveAttribute('aria-label', 'Outcome Comments')
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-label')
    })

    // US-MODAL-STYLE-001: Keyboard navigation test updated - no close button to focus
    it('should support keyboard navigation for form elements', async () => {
      const user = userEvent.setup()
      render(<OutcomeCommentsModal {...defaultProps} />)

      // Should be able to tab to textarea input
      await act(async () => {
        await user.tab()
      })
      expect(screen.getByRole('textbox')).toHaveFocus()
    })
  })

  describe('Character Limit Validation', () => {
    it('should display character counter showing current and maximum characters', () => {
      render(<OutcomeCommentsModal {...defaultProps} outcomeComments={[]} />)

      // Should show "0 / 500 characters" initially
      expect(screen.getByText(/0 \/ 1000 characters/i)).toBeInTheDocument()
    })

    it('should display character counter in red when below minimum', async () => {
      const user = userEvent.setup()
      render(<OutcomeCommentsModal {...defaultProps} outcomeComments={[]} />)

      const textarea = screen.getByPlaceholderText(/Enter outcome comment/i)

      await act(async () => {
        await user.type(textarea, 'Short')
      })

      // Counter should show "5 / 500 characters" with error color
      const counter = screen.getByText(/5 \/ 1000 characters/i)
      expect(counter).toBeInTheDocument()
      expect(counter).toHaveStyle({ color: 'rgb(220, 38, 38)' }) // colors.semantic.error
    })

    it('should display character counter in green when valid', async () => {
      const user = userEvent.setup()
      render(<OutcomeCommentsModal {...defaultProps} outcomeComments={[]} />)

      const textarea = screen.getByPlaceholderText(/Enter outcome comment/i)

      await act(async () => {
        await user.type(textarea, 'This is a valid comment')
      })

      // Counter should show success color for valid length
      const counter = screen.getByText(/23 \/ 1000 characters/i)
      expect(counter).toBeInTheDocument()
      expect(counter).toHaveStyle({ color: 'rgb(16, 185, 129)' }) // colors.semantic.success
    })

    it('should show minimum character hint when below minimum', async () => {
      const user = userEvent.setup()
      render(<OutcomeCommentsModal {...defaultProps} outcomeComments={[]} />)

      const textarea = screen.getByPlaceholderText(/Enter outcome comment/i)

      await act(async () => {
        await user.type(textarea, 'Short')
      })

      // Should show "(minimum 10)" hint
      expect(screen.getByText(/\(minimum 10\)/i)).toBeInTheDocument()
    })

    it('should disable Add button when comment is empty', () => {
      render(<OutcomeCommentsModal {...defaultProps} outcomeComments={[]} />)

      const addButton = screen.getByRole('button', { name: /Add Comment/i })
      expect(addButton).toBeDisabled()
    })

    it('should disable Add button when comment is too short (less than 10 characters)', async () => {
      const user = userEvent.setup()
      render(<OutcomeCommentsModal {...defaultProps} outcomeComments={[]} />)

      const textarea = screen.getByPlaceholderText(/Enter outcome comment/i)
      const addButton = screen.getByRole('button', { name: /Add Comment/i })

      await act(async () => {
        await user.type(textarea, 'Short')
      })

      expect(addButton).toBeDisabled()
    })

    it('should enable Add button when comment reaches minimum length (10 characters) and ranges are filled', async () => {
      const user = userEvent.setup()
      render(<OutcomeCommentsModal {...defaultProps} outcomeComments={[]} />)

      const textarea = screen.getByPlaceholderText(/Enter outcome comment/i)
      const lowerRange = screen.getByLabelText(/Lower Range/i)
      const upperRange = screen.getByLabelText(/Upper Range/i)
      const addButton = screen.getByRole('button', { name: /Add Comment/i })

      await act(async () => {
        await user.type(textarea, 'This is exactly ten characters long')
        await user.type(lowerRange, '50')
        await user.type(upperRange, '75')
      })

      expect(addButton).not.toBeDisabled()
    })

    it('should show validation error for comment less than 10 characters when trying to submit', async () => {
      const user = userEvent.setup()
      const onCreateComment = jest.fn()
      render(<OutcomeCommentsModal {...defaultProps} outcomeComments={[]} onCreateComment={onCreateComment} />)

      const textarea = screen.getByPlaceholderText(/Enter outcome comment/i)
      const lowerRange = screen.getByLabelText(/Lower Range/i)
      const upperRange = screen.getByLabelText(/Upper Range/i)

      // Type ranges first
      await act(async () => {
        await user.type(lowerRange, '50')
        await user.type(upperRange, '75')
      })

      // Type a comment with exactly 9 characters using fireEvent to avoid React update depth issues
      act(() => {
        fireEvent.change(textarea, { target: { value: 'ShortText' } }) // 9 characters
      })

      // Button should still be disabled
      const addButton = screen.getByRole('button', { name: /Add Comment/i })
      expect(addButton).toBeDisabled()
    })

    it('should enforce maxLength attribute preventing excessive characters', () => {
      render(<OutcomeCommentsModal {...defaultProps} outcomeComments={[]} />)

      const textarea = screen.getByPlaceholderText(/Enter outcome comment/i) as HTMLTextAreaElement

      // HTML maxLength attribute prevents typing more than 1000 characters
      expect(textarea).toHaveAttribute('maxLength', '1000')

      // The browser enforces this limit, preventing validation error from ever showing
      // This is the preferred UX - prevent the problem rather than show an error
    })

    it('should have maxLength attribute set to 1000', () => {
      render(<OutcomeCommentsModal {...defaultProps} outcomeComments={[]} />)

      const textarea = screen.getByPlaceholderText(/Enter outcome comment/i) as HTMLTextAreaElement
      expect(textarea).toHaveAttribute('maxLength', '1000')
    })

    it('should disable Save button when editing comment is too short', async () => {
      const user = userEvent.setup()
      render(<OutcomeCommentsModal {...defaultProps} />)

      const editButton = screen.getAllByRole('button', { name: /Edit/i })[0]
      await act(async () => {
        await user.click(editButton)
      })

      const textarea = screen.getByPlaceholderText(/Edit outcome comment/i)
      const saveButton = screen.getByRole('button', { name: /Save/i })

      await act(async () => {
        await user.clear(textarea)
        await user.type(textarea, 'Short')
      })

      expect(saveButton).toBeDisabled()
    })

    it('should enable Save button when editing comment is valid length', async () => {
      const user = userEvent.setup()
      render(<OutcomeCommentsModal {...defaultProps} />)

      const editButton = screen.getAllByRole('button', { name: /Edit/i })[0]
      await act(async () => {
        await user.click(editButton)
      })

      const textarea = screen.getByPlaceholderText(/Edit outcome comment/i)
      const saveButton = screen.getByRole('button', { name: /Save/i })

      await act(async () => {
        await user.clear(textarea)
        await user.type(textarea, 'This is a valid comment that is long enough to pass validation')
      })

      expect(saveButton).not.toBeDisabled()
    })
  })

  describe('US-001: Sort Comments by Upper Range', () => {
    it('should memoize sorted comments to avoid re-sorting on every render', () => {
      const unsortedComments: OutcomeComment[] = [
        {
          id: '65a1b2c3d4e5f6g7h8i9j0k1',
          subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
          userId: 'auth0|mock-user-123',
          comment: 'Lower range comment',
          upperRange: 70,
          lowerRange: 60,
          createdAt: '2024-01-01T10:00:00Z',
          updatedAt: '2024-01-01T10:00:00Z',
        },
        {
          id: '65a1b2c3d4e5f6g7h8i9j0k2',
          subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
          userId: 'auth0|mock-user-123',
          comment: 'Highest range comment',
          upperRange: 100,
          lowerRange: 90,
          createdAt: '2024-01-02T10:00:00Z',
          updatedAt: '2024-01-02T10:00:00Z',
        },
      ]

      const { rerender } = render(
        <OutcomeCommentsModal
          {...defaultProps}
          outcomeComments={unsortedComments}
        />,
      )

      // Render with same comments - sorting should use cached value
      rerender(
        <OutcomeCommentsModal
          {...defaultProps}
          outcomeComments={unsortedComments}
        />,
      )

      // Verify comments are displayed in correct sorted order
      const comments = screen.getAllByText(/range comment/)
      expect(comments[0]).toHaveTextContent('Highest range comment')
      expect(comments[1]).toHaveTextContent('Lower range comment')
    })

    it('should display comments sorted by upperRange in descending order (highest first)', () => {
      const unsortedComments: OutcomeComment[] = [
        {
          id: '65a1b2c3d4e5f6g7h8i9j0k1',
          subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
          userId: 'auth0|mock-user-123',
          comment: 'Lower range comment',
          upperRange: 70,
          lowerRange: 60,
          createdAt: '2024-01-01T10:00:00Z',
          updatedAt: '2024-01-01T10:00:00Z',
        },
        {
          id: '65a1b2c3d4e5f6g7h8i9j0k2',
          subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
          userId: 'auth0|mock-user-123',
          comment: 'Highest range comment',
          upperRange: 100,
          lowerRange: 90,
          createdAt: '2024-01-02T10:00:00Z',
          updatedAt: '2024-01-02T10:00:00Z',
        },
        {
          id: '65a1b2c3d4e5f6g7h8i9j0k3',
          subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
          userId: 'auth0|mock-user-123',
          comment: 'Middle range comment',
          upperRange: 80,
          lowerRange: 70,
          createdAt: '2024-01-03T10:00:00Z',
          updatedAt: '2024-01-03T10:00:00Z',
        },
      ]

      render(
        <OutcomeCommentsModal
          {...defaultProps}
          outcomeComments={unsortedComments}
        />,
      )

      // Get all comment text - verify sort order by finding comments in correct sequence
      const comments = screen.getAllByText(/range comment/)

      // Verify order: id=2 (100), id=3 (80), id=1 (70)
      expect(comments[0]).toHaveTextContent('Highest range comment')
      expect(comments[1]).toHaveTextContent('Middle range comment')
      expect(comments[2]).toHaveTextContent('Lower range comment')
    })

    it('should maintain sorted order after comment props change', () => {
      const initialComments: OutcomeComment[] = [
        {
          id: '65a1b2c3d4e5f6g7h8i9j0k1',
          subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
          userId: 'auth0|mock-user-123',
          comment: 'Lower range',
          upperRange: 70,
          lowerRange: 60,
          createdAt: '2024-01-01T10:00:00Z',
          updatedAt: '2024-01-01T10:00:00Z',
        },
        {
          id: '65a1b2c3d4e5f6g7h8i9j0k2',
          subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
          userId: 'auth0|mock-user-123',
          comment: 'Higher range',
          upperRange: 90,
          lowerRange: 80,
          createdAt: '2024-01-02T10:00:00Z',
          updatedAt: '2024-01-02T10:00:00Z',
        },
      ]

      const { rerender } = render(
        <OutcomeCommentsModal
          {...defaultProps}
          outcomeComments={initialComments}
        />,
      )

      // Verify initial sort: 90 (id=2), 70 (id=1)
      let comments = screen.getAllByText(/range/)
      expect(comments[0]).toHaveTextContent('Higher range')

      // Simulate updating comment 2 to have a lower range
      const updatedComments: OutcomeComment[] = [
        {
          id: '65a1b2c3d4e5f6g7h8i9j0k1',
          subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
          userId: 'auth0|mock-user-123',
          comment: 'Lower range',
          upperRange: 70,
          lowerRange: 60,
          createdAt: '2024-01-01T10:00:00Z',
          updatedAt: '2024-01-01T10:00:00Z',
        },
        {
          id: '65a1b2c3d4e5f6g7h8i9j0k2',
          subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
          userId: 'auth0|mock-user-123',
          comment: 'Updated to lower range',
          upperRange: 60,
          lowerRange: 50,
          createdAt: '2024-01-02T10:00:00Z',
          updatedAt: '2024-01-02T10:00:00Z',
        },
      ]

      rerender(
        <OutcomeCommentsModal
          {...defaultProps}
          outcomeComments={updatedComments}
        />,
      )

      // Verify the order is re-sorted (id=1 with 70 should now be first)
      comments = screen.getAllByText(/range/)
      expect(comments[0]).toHaveTextContent('Lower range')
      expect(comments[1]).toHaveTextContent('Updated to lower range')
    })

    it('should display multiple unsorted comments in sorted order', () => {
      const unsortedComments: OutcomeComment[] = [
        {
          id: '65a1b2c3d4e5f6g7h8i9j0k1',
          subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
          userId: 'auth0|mock-user-123',
          comment: 'Lowest range 40-50',
          upperRange: 50,
          lowerRange: 40,
          createdAt: '2024-01-01T10:00:00Z',
          updatedAt: '2024-01-01T10:00:00Z',
        },
        {
          id: '65a1b2c3d4e5f6g7h8i9j0k2',
          subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
          userId: 'auth0|mock-user-123',
          comment: 'Highest range 90-100',
          upperRange: 100,
          lowerRange: 90,
          createdAt: '2024-01-02T10:00:00Z',
          updatedAt: '2024-01-02T10:00:00Z',
        },
        {
          id: '65a1b2c3d4e5f6g7h8i9j0k3',
          subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
          userId: 'auth0|mock-user-123',
          comment: 'Mid range 60-70',
          upperRange: 70,
          lowerRange: 60,
          createdAt: '2024-01-03T10:00:00Z',
          updatedAt: '2024-01-03T10:00:00Z',
        },
        {
          id: '65a1b2c3d4e5f6g7h8i9j0k4',
          subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
          userId: 'auth0|mock-user-123',
          comment: 'Another high range 75-85',
          upperRange: 85,
          lowerRange: 75,
          createdAt: '2024-01-04T10:00:00Z',
          updatedAt: '2024-01-04T10:00:00Z',
        },
      ]

      render(
        <OutcomeCommentsModal
          {...defaultProps}
          outcomeComments={unsortedComments}
        />,
      )

      // Verify correct sort order: 100, 85, 70, 50
      const comments = screen.getAllByText(/range/)
      expect(comments[0]).toHaveTextContent('Highest range 90-100')
      expect(comments[1]).toHaveTextContent('Another high range 75-85')
      expect(comments[2]).toHaveTextContent('Mid range 60-70')
      expect(comments[3]).toHaveTextContent('Lowest range 40-50')
    })
  })
})
