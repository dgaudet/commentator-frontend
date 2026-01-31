/**
 * OutcomeCommentsModal - Duplicate Detection Integration Tests
 * Tests for US-DCP-001: Prevent Duplicate Outcome Comments
 */

import { render, screen, fireEvent, waitFor } from '../../../test-utils'
import { OutcomeCommentsModal } from '../OutcomeCommentsModal'
import type { OutcomeComment, Pronoun } from '../../../types'

describe('OutcomeCommentsModal - Duplicate Detection (US-DCP-001)', () => {
  const mockSubject = {
    id: 'math-101',
    name: 'Mathematics',
  }

  const mockOutcomeComments: OutcomeComment[] = [
    {
      id: '1',
      subjectId: 'math-101',
      comment: 'Shows strong understanding of algebra',
      upperRange: 90,
      lowerRange: 80,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
    },
    {
      id: '2',
      subjectId: 'math-101',
      comment: 'Demonstrates excellent problem-solving skills',
      upperRange: 100,
      lowerRange: 90,
      createdAt: '2024-01-15T10:01:00Z',
      updatedAt: '2024-01-15T10:01:00Z',
    },
  ]

  const defaultProps = {
    isOpen: true,
    entityData: mockSubject,
    outcomeComments: mockOutcomeComments,
    onCreateComment: jest.fn(),
    onUpdateComment: jest.fn(),
    onDeleteComment: jest.fn(),
    loading: false,
    error: null,
    pronouns: [] as Pronoun[],
    pronounsLoading: false,
    pronounsError: null,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Duplicate Detection - Main Flow', () => {
    it('should show duplicate modal when attempting to save exact duplicate comment', async () => {
      render(<OutcomeCommentsModal {...defaultProps} />)

      // Enter duplicate comment
      const commentInput = screen.getByPlaceholderText(/Enter outcome comment/i)
      fireEvent.change(commentInput, {
        target: { value: 'Shows strong understanding of algebra' },
      })

      // Fill range values
      const rangeInputs = screen.getAllByPlaceholderText(/score/i)
      fireEvent.change(rangeInputs[0], { target: { value: '80' } })
      fireEvent.change(rangeInputs[1], { target: { value: '90' } })

      // Click Save
      const saveButton = screen.getByRole('button', { name: /Add Comment/i })
      fireEvent.click(saveButton)

      // Duplicate modal should appear
      await waitFor(() => {
        expect(screen.getByText(/Duplicate Comment Detected/i)).toBeInTheDocument()
      })
    })

    it('should display existing comment in duplicate modal', async () => {
      render(<OutcomeCommentsModal {...defaultProps} />)

      const commentInput = screen.getByPlaceholderText(/Enter outcome comment/i)
      fireEvent.change(commentInput, {
        target: { value: 'Shows strong understanding of algebra' },
      })

      const rangeInputs = screen.getAllByPlaceholderText(/score/i)
      fireEvent.change(rangeInputs[0], { target: { value: '80' } })
      fireEvent.change(rangeInputs[1], { target: { value: '90' } })

      const saveButton = screen.getByRole('button', { name: /Add Comment/i })
      fireEvent.click(saveButton)

      await waitFor(() => {
        // Check for the duplicate modal by looking for its title first
        expect(screen.getByText(/Duplicate Comment Detected/i)).toBeInTheDocument()
        // Then verify the existing comment is displayed within the modal
        const existingCommentDisplay = screen.getByTestId('existing-comment-display')
        expect(existingCommentDisplay.textContent).toContain('Shows strong understanding of algebra')
      })
    })

    it('should prevent save when duplicate is detected', async () => {
      render(<OutcomeCommentsModal {...defaultProps} />)

      const commentInput = screen.getByPlaceholderText(/Enter outcome comment/i)
      fireEvent.change(commentInput, {
        target: { value: 'Shows strong understanding of algebra' },
      })

      const rangeInputs = screen.getAllByPlaceholderText(/score/i)
      fireEvent.change(rangeInputs[0], { target: { value: '80' } })
      fireEvent.change(rangeInputs[1], { target: { value: '90' } })

      const saveButton = screen.getByRole('button', { name: /Add Comment/i })
      fireEvent.click(saveButton)

      await waitFor(() => {
        expect(screen.getByText(/Duplicate Comment Detected/i)).toBeInTheDocument()
      })

      // Verify onCreateComment was NOT called
      expect(defaultProps.onCreateComment).not.toHaveBeenCalled()
    })

    it('should allow save when comment is unique', async () => {
      const onCreateComment = jest.fn().mockResolvedValue(undefined)
      render(
        <OutcomeCommentsModal
          {...defaultProps}
          onCreateComment={onCreateComment}
        />,
      )

      const commentInput = screen.getByPlaceholderText(/Enter outcome comment/i)
      fireEvent.change(commentInput, {
        target: { value: 'Unique comment text' },
      })

      const rangeInputs = screen.getAllByPlaceholderText(/score/i)
      fireEvent.change(rangeInputs[0], { target: { value: '80' } })
      fireEvent.change(rangeInputs[1], { target: { value: '90' } })

      const saveButton = screen.getByRole('button', { name: /Add Comment/i })
      fireEvent.click(saveButton)

      // No duplicate modal should appear
      await waitFor(() => {
        expect(
          screen.queryByText(/Duplicate Comment Detected/i),
        ).not.toBeInTheDocument()
      })

      // onCreateComment should be called
      expect(onCreateComment).toHaveBeenCalled()
    })
  })

  describe('Duplicate Modal - User Actions', () => {
    it('should close modal and preserve comment text when Cancel clicked', async () => {
      render(<OutcomeCommentsModal {...defaultProps} />)

      const commentInput = screen.getByPlaceholderText(/Enter outcome comment/i)
      const commentText = 'Shows strong understanding of algebra'
      fireEvent.change(commentInput, { target: { value: commentText } })

      const rangeInputs = screen.getAllByPlaceholderText(/score/i)
      fireEvent.change(rangeInputs[0], { target: { value: '80' } })
      fireEvent.change(rangeInputs[1], { target: { value: '90' } })

      const saveButton = screen.getByRole('button', { name: /Add Comment/i })
      fireEvent.click(saveButton)

      await waitFor(() => {
        expect(screen.getByText(/Duplicate Comment Detected/i)).toBeInTheDocument()
      })

      // Click Cancel in duplicate modal
      const cancelButton = screen.getByRole('button', { name: /Cancel/i })
      fireEvent.click(cancelButton)

      // Modal should close
      await waitFor(() => {
        expect(
          screen.queryByText(/Duplicate Comment Detected/i),
        ).not.toBeInTheDocument()
      })

      // Comment text should still be in input
      expect(commentInput).toHaveValue(commentText)
    })

    it('should not clear form when returning from duplicate modal', async () => {
      render(<OutcomeCommentsModal {...defaultProps} />)

      const commentInput = screen.getByPlaceholderText(/Enter outcome comment/i)
      const commentText = 'Shows strong understanding of algebra'
      fireEvent.change(commentInput, { target: { value: commentText } })

      const rangeInputs = screen.getAllByPlaceholderText(/score/i)
      fireEvent.change(rangeInputs[0], { target: { value: '85' } })
      fireEvent.change(rangeInputs[1], { target: { value: '95' } })

      const saveButton = screen.getByRole('button', { name: /Add Comment/i })
      fireEvent.click(saveButton)

      await waitFor(() => {
        expect(screen.getByText(/Duplicate Comment Detected/i)).toBeInTheDocument()
      })

      const cancelButton = screen.getByRole('button', { name: /Cancel/i })
      fireEvent.click(cancelButton)

      // Verify all form fields are preserved
      expect(commentInput).toHaveValue(commentText)
      expect(rangeInputs[0]).toHaveValue(85)
      expect(rangeInputs[1]).toHaveValue(95)
    })
  })

  describe('Duplicate Detection - Whitespace Handling', () => {
    it('should detect duplicate when new comment has trailing whitespace', async () => {
      render(<OutcomeCommentsModal {...defaultProps} />)

      const commentInput = screen.getByPlaceholderText(/Enter outcome comment/i)
      fireEvent.change(commentInput, {
        target: { value: '  Shows strong understanding of algebra  ' },
      })

      const rangeInputs = screen.getAllByPlaceholderText(/score/i)
      fireEvent.change(rangeInputs[0], { target: { value: '80' } })
      fireEvent.change(rangeInputs[1], { target: { value: '90' } })

      const saveButton = screen.getByRole('button', { name: /Add Comment/i })
      fireEvent.click(saveButton)

      await waitFor(() => {
        expect(screen.getByText(/Duplicate Comment Detected/i)).toBeInTheDocument()
      })
    })

    it('should not detect duplicate when internal whitespace differs', async () => {
      const onCreateComment = jest.fn().mockResolvedValue(undefined)
      render(
        <OutcomeCommentsModal
          {...defaultProps}
          onCreateComment={onCreateComment}
        />,
      )

      const commentInput = screen.getByPlaceholderText(/Enter outcome comment/i)
      // Note: extra spaces between words
      fireEvent.change(commentInput, {
        target: { value: 'Shows  strong  understanding  of  algebra' },
      })

      const rangeInputs = screen.getAllByPlaceholderText(/score/i)
      fireEvent.change(rangeInputs[0], { target: { value: '80' } })
      fireEvent.change(rangeInputs[1], { target: { value: '90' } })

      const saveButton = screen.getByRole('button', { name: /Add Comment/i })
      fireEvent.click(saveButton)

      // Should NOT show duplicate (internal spaces differ)
      await waitFor(() => {
        expect(
          screen.queryByText(/Duplicate Comment Detected/i),
        ).not.toBeInTheDocument()
      })

      expect(onCreateComment).toHaveBeenCalled()
    })

    it('should be case-sensitive - different case not flagged as duplicate', async () => {
      const onCreateComment = jest.fn().mockResolvedValue(undefined)
      render(
        <OutcomeCommentsModal
          {...defaultProps}
          onCreateComment={onCreateComment}
        />,
      )

      const commentInput = screen.getByPlaceholderText(/Enter outcome comment/i)
      // Different case
      fireEvent.change(commentInput, {
        target: { value: 'shows strong understanding of algebra' },
      })

      const rangeInputs = screen.getAllByPlaceholderText(/score/i)
      fireEvent.change(rangeInputs[0], { target: { value: '80' } })
      fireEvent.change(rangeInputs[1], { target: { value: '90' } })

      const saveButton = screen.getByRole('button', { name: /Add Comment/i })
      fireEvent.click(saveButton)

      // Should NOT show duplicate (case differs)
      await waitFor(() => {
        expect(
          screen.queryByText(/Duplicate Comment Detected/i),
        ).not.toBeInTheDocument()
      })

      expect(onCreateComment).toHaveBeenCalled()
    })
  })

  describe('Duplicate Detection - Edge Cases', () => {
    it('should handle empty comment list gracefully', async () => {
      const onCreateComment = jest.fn().mockResolvedValue(undefined)
      render(
        <OutcomeCommentsModal
          {...defaultProps}
          outcomeComments={[]}
          onCreateComment={onCreateComment}
        />,
      )

      const commentInput = screen.getByPlaceholderText(/Enter outcome comment/i)
      fireEvent.change(commentInput, {
        target: { value: 'Any comment' },
      })

      const rangeInputs = screen.getAllByPlaceholderText(/score/i)
      fireEvent.change(rangeInputs[0], { target: { value: '80' } })
      fireEvent.change(rangeInputs[1], { target: { value: '90' } })

      const saveButton = screen.getByRole('button', { name: /Add Comment/i })
      fireEvent.click(saveButton)

      // Should save without showing duplicate modal
      await waitFor(() => {
        expect(onCreateComment).toHaveBeenCalled()
      })
    })

    it('should detect only exact matches, not partial matches', async () => {
      const onCreateComment = jest.fn().mockResolvedValue(undefined)
      render(
        <OutcomeCommentsModal
          {...defaultProps}
          onCreateComment={onCreateComment}
        />,
      )

      const commentInput = screen.getByPlaceholderText(/Enter outcome comment/i)
      // Partial text - should NOT match
      fireEvent.change(commentInput, {
        target: { value: 'Shows strong understanding' },
      })

      const rangeInputs = screen.getAllByPlaceholderText(/score/i)
      fireEvent.change(rangeInputs[0], { target: { value: '80' } })
      fireEvent.change(rangeInputs[1], { target: { value: '90' } })

      const saveButton = screen.getByRole('button', { name: /Add Comment/i })
      fireEvent.click(saveButton)

      await waitFor(() => {
        expect(
          screen.queryByText(/Duplicate Comment Detected/i),
        ).not.toBeInTheDocument()
      })

      expect(onCreateComment).toHaveBeenCalled()
    })
  })

  describe('Duplicate Detection - Editing Comments', () => {
    it('should prevent editing a comment to match an existing one', async () => {
      const onUpdateComment = jest.fn()
      const { container } = render(<OutcomeCommentsModal {...defaultProps} onUpdateComment={onUpdateComment} />)

      // Wait for the Existing Comments section to render
      await waitFor(() => {
        expect(screen.getByText('Existing Comments')).toBeInTheDocument()
      })

      // Get initial state - there should be 2 Edit buttons (one for each comment)
      const editButtons = screen.getAllByRole('button', { name: /Edit/i })
      expect(editButtons.length).toBe(2)

      // Click Edit on the first comment
      fireEvent.click(editButtons[0])

      // After clicking Edit, verify edit mode is active by checking for the Cancel button
      await waitFor(() => {
        const cancelButtons = screen.queryAllByRole('button', { name: /Cancel/i })
        expect(cancelButtons.length).toBeGreaterThan(0)
      })

      // Now find the edit textarea using aria-label since edit mode should have specific aria-label
      let editTextarea: HTMLTextAreaElement | null = null
      await waitFor(() => {
        const textareas = container.querySelectorAll('textarea[aria-label="Edit outcome comment"]')
        editTextarea = textareas[0] as HTMLTextAreaElement | null
        expect(editTextarea).toBeTruthy()
        // Verify it has the original comment value
        expect(editTextarea?.value).toContain('Shows')
      })

      if (editTextarea) {
        // Change to match the second comment
        fireEvent.change(editTextarea, {
          target: { value: 'Demonstrates excellent problem-solving skills' },
        })

        // Click the Save button in edit mode
        const saveButtons = screen.getAllByRole('button', { name: /^Save$/i })
        expect(saveButtons.length).toBeGreaterThan(0)
        const editSaveButton = saveButtons[0]
        fireEvent.click(editSaveButton)
      }

      // Should show duplicate modal after save attempt
      await waitFor(() => {
        expect(screen.getByText(/Duplicate Comment Detected/i)).toBeInTheDocument()
      })
    })

    it('should allow editing a comment to a unique value', async () => {
      const onUpdateComment = jest.fn().mockResolvedValue(undefined)
      const { container } = render(
        <OutcomeCommentsModal
          {...defaultProps}
          onUpdateComment={onUpdateComment}
        />,
      )

      // Wait for the Existing Comments section to render
      await waitFor(() => {
        expect(screen.getByText('Existing Comments')).toBeInTheDocument()
      })

      // Find and click Edit on the first comment
      const editButtons = screen.getAllByRole('button', { name: /Edit/i })
      fireEvent.click(editButtons[0])

      // After clicking Edit, wait for the textarea with the comment value to appear
      let editTextarea: HTMLTextAreaElement | null = null
      await waitFor(() => {
        // Get all textareas from the container
        const allTextareas = container.querySelectorAll('textarea')
        // Find the one with the comment value (should be the edit textarea)
        editTextarea = Array.from(allTextareas).find((ta) => {
          return ta.value === 'Shows strong understanding of algebra'
        }) as HTMLTextAreaElement | null
        expect(editTextarea).toBeTruthy()
      })

      // Change to a unique value
      if (editTextarea) {
        fireEvent.change(editTextarea, {
          target: { value: 'Unique edited comment' },
        })

        // Save - find the Save button
        const saveButtons = screen.getAllByRole('button', { name: /Save/i })
        expect(saveButtons.length).toBeGreaterThan(0)
        fireEvent.click(saveButtons[saveButtons.length - 1])
      }

      // Should not show duplicate modal
      await waitFor(() => {
        expect(
          screen.queryByText(/Duplicate Comment Detected/i),
        ).not.toBeInTheDocument()
      })

      expect(onUpdateComment).toHaveBeenCalled()
    })
  })

  describe('Duplicate Detection - Multiline Comments', () => {
    it('should detect duplicate multiline comments', async () => {
      const multilineComment = 'Line 1\nLine 2\nLine 3'
      const mockComments: OutcomeComment[] = [
        {
          id: '1',
          subjectId: 'math-101',
          comment: multilineComment,
          upperRange: 90,
          lowerRange: 80,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
        },
      ]

      render(
        <OutcomeCommentsModal
          {...defaultProps}
          outcomeComments={mockComments}
        />,
      )

      const commentInput = screen.getByPlaceholderText(/Enter outcome comment/i)
      fireEvent.change(commentInput, { target: { value: multilineComment } })

      const rangeInputs = screen.getAllByPlaceholderText(/score/i)
      fireEvent.change(rangeInputs[0], { target: { value: '80' } })
      fireEvent.change(rangeInputs[1], { target: { value: '90' } })

      const saveButton = screen.getByRole('button', { name: /Add Comment/i })
      fireEvent.click(saveButton)

      await waitFor(() => {
        expect(screen.getByText(/Duplicate Comment Detected/i)).toBeInTheDocument()
      })
    })
  })
})
