/**
 * DuplicateCommentModal Component Tests
 * Tests for the reusable duplicate comment detection modal
 */

import { render, screen, fireEvent } from '../../../test-utils'
import { DuplicateCommentModal } from '../DuplicateCommentModal'

describe('DuplicateCommentModal', () => {
  const defaultProps = {
    isOpen: true,
    existingComment: 'Shows strong understanding of algebra',
    commentType: 'outcome' as const,
    subjectName: 'Mathematics',
    onCancel: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render when isOpen is true', () => {
      render(<DuplicateCommentModal {...defaultProps} />)
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('should not render when isOpen is false', () => {
      render(<DuplicateCommentModal {...defaultProps} isOpen={false} />)
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('should display modal title', () => {
      render(<DuplicateCommentModal {...defaultProps} />)
      expect(
        screen.getByText(/duplicate comment detected/i),
      ).toBeInTheDocument()
    })

    it('should display existing comment text', () => {
      render(<DuplicateCommentModal {...defaultProps} />)
      expect(
        screen.getByText('Shows strong understanding of algebra'),
      ).toBeInTheDocument()
    })

    it('should display subject name in message for outcome comments', () => {
      render(<DuplicateCommentModal {...defaultProps} commentType="outcome" />)
      expect(
        screen.getByText(/Mathematics/),
      ).toBeInTheDocument()
    })

    it('should display subject name in message for personalized comments', () => {
      render(
        <DuplicateCommentModal
          {...defaultProps}
          commentType="personalized"
        />,
      )
      expect(
        screen.getByText(/Mathematics/),
      ).toBeInTheDocument()
    })

    it('should adapt message based on comment type', () => {
      const { rerender } = render(
        <DuplicateCommentModal {...defaultProps} commentType="outcome" />,
      )
      expect(
        screen.getByText(/outcome comment already exists/i),
      ).toBeInTheDocument()

      rerender(
        <DuplicateCommentModal
          {...defaultProps}
          commentType="personalized"
        />,
      )
      expect(
        screen.getByText(/personalized comment already exists/i),
      ).toBeInTheDocument()
    })

    it('should have proper semantic HTML with aria-modal', () => {
      render(<DuplicateCommentModal {...defaultProps} />)
      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveAttribute('aria-modal', 'true')
    })
  })

  describe('Cancel Button', () => {
    it('should render Cancel button', () => {
      render(<DuplicateCommentModal {...defaultProps} />)
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
    })

    it('should call onCancel when Cancel button is clicked', () => {
      const onCancel = jest.fn()
      render(
        <DuplicateCommentModal {...defaultProps} onCancel={onCancel} />,
      )
      fireEvent.click(screen.getByRole('button', { name: /cancel/i }))
      expect(onCancel).toHaveBeenCalledTimes(1)
    })

    it('should call onCancel only once per click', () => {
      const onCancel = jest.fn()
      render(
        <DuplicateCommentModal {...defaultProps} onCancel={onCancel} />,
      )
      fireEvent.click(screen.getByRole('button', { name: /cancel/i }))
      fireEvent.click(screen.getByRole('button', { name: /cancel/i }))
      expect(onCancel).toHaveBeenCalledTimes(2)
    })
  })

  describe('Accessibility', () => {
    it('should have accessible dialog role', () => {
      render(<DuplicateCommentModal {...defaultProps} />)
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('should be keyboard navigable to Cancel button', () => {
      const onCancel = jest.fn()
      render(
        <DuplicateCommentModal {...defaultProps} onCancel={onCancel} />,
      )
      const button = screen.getByRole('button', { name: /cancel/i })
      button.focus()
      expect(button).toHaveFocus()
      // Native button handles Enter key to trigger click
      fireEvent.click(button)
      expect(onCancel).toHaveBeenCalled()
    })

    it('should have descriptive aria-labelledby', () => {
      render(<DuplicateCommentModal {...defaultProps} />)
      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveAttribute('aria-labelledby')
    })

    it('should allow screen reader to announce existing comment', () => {
      render(<DuplicateCommentModal {...defaultProps} />)
      // The existing comment should be readable by screen readers
      expect(
        screen.getByText('Shows strong understanding of algebra'),
      ).toBeVisible()
    })
  })

  describe('Content Display', () => {
    it('should display guidance message', () => {
      render(<DuplicateCommentModal {...defaultProps} />)
      expect(
        screen.getByText(
          /Please edit the existing comment or enter a different comment/i,
        ),
      ).toBeInTheDocument()
    })

    it('should display existing comment in read-only format', () => {
      render(<DuplicateCommentModal {...defaultProps} />)
      const existingComment = screen.getByText(
        'Shows strong understanding of algebra',
      )
      expect(existingComment).toBeInTheDocument()
    })

    it('should handle multiline existing comments', () => {
      const multilineComment = 'Line 1\nLine 2\nLine 3'
      render(
        <DuplicateCommentModal
          {...defaultProps}
          existingComment={multilineComment}
        />,
      )
      // Verify the multiline text is displayed
      expect(screen.getByText(/Line 1/)).toBeInTheDocument()
    })

    it('should preserve whitespace in existing comment display', () => {
      const commentWithSpaces = 'Shows  strong  understanding'
      render(
        <DuplicateCommentModal
          {...defaultProps}
          existingComment={commentWithSpaces}
        />,
      )
      // Check textContent directly to verify whitespace is preserved
      const existingCommentDisplay = screen.getByTestId('existing-comment-display')
      expect(existingCommentDisplay.textContent).toContain('Shows  strong  understanding')
    })
  })

  describe('Different Comment Types', () => {
    it('should handle outcome comment type', () => {
      render(
        <DuplicateCommentModal
          {...defaultProps}
          commentType="outcome"
        />,
      )
      expect(
        screen.getByText(/outcome comment already exists/i),
      ).toBeInTheDocument()
    })

    it('should handle personalized comment type', () => {
      render(
        <DuplicateCommentModal
          {...defaultProps}
          commentType="personalized"
        />,
      )
      expect(
        screen.getByText(/personalized comment already exists/i),
      ).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle very long subject names', () => {
      const longSubjectName =
        'Very Long Subject Name That Might Wrap to Multiple Lines'
      render(
        <DuplicateCommentModal
          {...defaultProps}
          subjectName={longSubjectName}
        />,
      )
      expect(screen.getByText(new RegExp(longSubjectName))).toBeInTheDocument()
    })

    it('should handle very long existing comments', () => {
      const longComment = 'A'.repeat(500)
      render(
        <DuplicateCommentModal
          {...defaultProps}
          existingComment={longComment}
        />,
      )
      expect(screen.getByText(new RegExp(longComment))).toBeInTheDocument()
    })

    it('should handle special characters in subject name', () => {
      const specialSubject = "Student's Physics & Biology (Advanced)"
      render(
        <DuplicateCommentModal
          {...defaultProps}
          subjectName={specialSubject}
        />,
      )
      expect(
        screen.getByText(new RegExp(specialSubject.split('&')[0].trim())),
      ).toBeInTheDocument()
    })

    it('should handle special characters in existing comment', () => {
      const specialComment = 'Great work! (100%) -> Excellent! <3'
      render(
        <DuplicateCommentModal
          {...defaultProps}
          existingComment={specialComment}
        />,
      )
      expect(screen.getByText(specialComment)).toBeInTheDocument()
    })
  })
})
