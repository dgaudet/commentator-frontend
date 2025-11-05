/**
 * ConfirmationModal Component Tests
 * TDD Phase: RED - Writing failing tests first
 * Reference: US-SUBJ-DELETE-002
 *
 * Testing confirmation dialog for delete operations
 */
import { render, screen, fireEvent } from '../../../test-utils'
import { ConfirmationModal } from '../ConfirmationModal'

describe('ConfirmationModal (US-SUBJ-DELETE-002)', () => {
  const mockOnConfirm = jest.fn()
  const mockOnCancel = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('AC1: Confirmation Dialog Display', () => {
    it('should display modal when isOpen is true', () => {
      render(
        <ConfirmationModal
          isOpen={true}
          title="Delete Subject"
          message="Are you sure you want to delete 'Mathematics 101'? This action cannot be undone."
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />,
      )

      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(screen.getByText('Delete Subject')).toBeInTheDocument()
      expect(screen.getByText(/Are you sure you want to delete/)).toBeInTheDocument()
    })

    it('should not display modal when isOpen is false', () => {
      render(
        <ConfirmationModal
          isOpen={false}
          title="Delete Subject"
          message="Are you sure?"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />,
      )

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  describe('AC2: Dialog Content and Styling', () => {
    it('should show warning message with subject name', () => {
      render(
        <ConfirmationModal
          isOpen={true}
          title="Delete Subject"
          message="Are you sure you want to delete 'Mathematics 101'? This action cannot be undone."
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />,
      )

      const message = screen.getByText(/Mathematics 101/)
      expect(message).toBeInTheDocument()
      expect(screen.getByText(/cannot be undone/)).toBeInTheDocument()
    })

    it('should render Cancel and Delete buttons', () => {
      render(
        <ConfirmationModal
          isOpen={true}
          title="Delete Subject"
          message="Are you sure?"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />,
      )

      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
    })

    it('should style Delete button with danger colors', () => {
      render(
        <ConfirmationModal
          isOpen={true}
          title="Delete"
          message="Are you sure?"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />,
      )

      const deleteButton = screen.getByRole('button', { name: /delete/i })
      // Should have danger button class
      expect(deleteButton.className).toContain('button-danger')
    })
  })

  describe('AC3: Cancel Action', () => {
    it('should call onCancel when Cancel button clicked', () => {
      render(
        <ConfirmationModal
          isOpen={true}
          title="Delete"
          message="Are you sure?"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />,
      )

      fireEvent.click(screen.getByRole('button', { name: /cancel/i }))
      expect(mockOnCancel).toHaveBeenCalledTimes(1)
      expect(mockOnConfirm).not.toHaveBeenCalled()
    })
  })

  describe('AC4: Confirm Delete Action', () => {
    it('should call onConfirm when Delete button clicked', () => {
      render(
        <ConfirmationModal
          isOpen={true}
          title="Delete"
          message="Are you sure?"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />,
      )

      fireEvent.click(screen.getByRole('button', { name: /delete/i }))
      expect(mockOnConfirm).toHaveBeenCalledTimes(1)
      expect(mockOnCancel).not.toHaveBeenCalled()
    })

    it('should show loading state on Delete button when isLoading true', () => {
      render(
        <ConfirmationModal
          isOpen={true}
          title="Delete"
          message="Are you sure?"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
          isLoading={true}
        />,
      )

      // Button text changes to "Delete..." when loading (confirmButtonText + "...")
      const deleteButton = screen.getByRole('button', { name: /delete\.\.\./i })
      expect(deleteButton).toBeDisabled()
      expect(screen.getByText(/delete\.\.\./i)).toBeInTheDocument()
    })

    it('should use custom loadingText when provided', () => {
      render(
        <ConfirmationModal
          isOpen={true}
          title="Confirm"
          message="Are you sure?"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
          confirmButtonText="Save"
          isLoading={true}
          loadingText="Saving changes..."
        />,
      )

      // Should use custom loading text instead of "Save..."
      const confirmButton = screen.getByRole('button', { name: /saving changes/i })
      expect(confirmButton).toBeDisabled()
      expect(screen.getByText(/saving changes/i)).toBeInTheDocument()
    })

    it('should derive loading text from custom confirmButtonText', () => {
      render(
        <ConfirmationModal
          isOpen={true}
          title="Confirm"
          message="Are you sure?"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
          confirmButtonText="Archive"
          isLoading={true}
        />,
      )

      // Should automatically use "Archive..." as loading text
      const confirmButton = screen.getByRole('button', { name: /archive\.\.\./i })
      expect(confirmButton).toBeDisabled()
      expect(screen.getByText(/archive\.\.\./i)).toBeInTheDocument()
    })
  })

  describe('AC7: Keyboard Accessibility', () => {
    it('should focus Cancel button by default (safe default)', () => {
      render(
        <ConfirmationModal
          isOpen={true}
          title="Delete"
          message="Are you sure?"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />,
      )

      const cancelButton = screen.getByRole('button', { name: /cancel/i })
      expect(cancelButton).toHaveFocus()
    })

    it('should restore focus to previously focused element when modal closes', () => {
      // Create a button to represent the previously focused element
      const triggerButton = document.createElement('button')
      triggerButton.textContent = 'Open Modal'
      document.body.appendChild(triggerButton)
      triggerButton.focus()

      // Verify trigger button has focus initially
      expect(document.activeElement).toBe(triggerButton)

      // Render modal in open state
      const { rerender } = render(
        <ConfirmationModal
          isOpen={true}
          title="Delete"
          message="Are you sure?"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />,
      )

      // Modal should now have focus on Cancel button
      const cancelButton = screen.getByRole('button', { name: /cancel/i })
      expect(cancelButton).toHaveFocus()

      // Close modal by re-rendering with isOpen={false}
      rerender(
        <ConfirmationModal
          isOpen={false}
          title="Delete"
          message="Are you sure?"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />,
      )

      // Focus should be restored to trigger button
      expect(document.activeElement).toBe(triggerButton)

      // Cleanup
      document.body.removeChild(triggerButton)
    })

    it('should support keyboard navigation (native button behavior)', () => {
      render(
        <ConfirmationModal
          isOpen={true}
          title="Delete"
          message="Are you sure?"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />,
      )

      const cancelButton = screen.getByRole('button', { name: /cancel/i })
      const deleteButton = screen.getByRole('button', { name: /delete/i })

      // Both are native buttons and focusable
      expect(cancelButton.tagName).toBe('BUTTON')
      expect(deleteButton.tagName).toBe('BUTTON')
    })

    it('should handle Escape key to cancel', () => {
      render(
        <ConfirmationModal
          isOpen={true}
          title="Delete"
          message="Are you sure?"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />,
      )

      const dialog = screen.getByRole('dialog')
      fireEvent.keyDown(dialog, { key: 'Escape' })

      expect(mockOnCancel).toHaveBeenCalledTimes(1)
      expect(mockOnConfirm).not.toHaveBeenCalled()
    })
  })

  describe('Accessibility Attributes', () => {
    it('should have proper ARIA attributes', () => {
      render(
        <ConfirmationModal
          isOpen={true}
          title="Delete Subject"
          message="Are you sure?"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />,
      )

      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveAttribute('aria-modal', 'true')
      expect(dialog).toHaveAttribute('aria-labelledby')
      expect(dialog).toHaveAttribute('aria-describedby')
    })
  })

  describe('Custom Children Content', () => {
    it('should render custom children content below message', () => {
      render(
        <ConfirmationModal
          isOpen={true}
          title="Delete Outcome Comment"
          message="Are you sure you want to delete this outcome comment?"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        >
          <p className="text-sm text-gray-600 mt-2">
            "This is a preview of the comment text that will be deleted..."
          </p>
        </ConfirmationModal>,
      )

      expect(screen.getByText(/This is a preview of the comment text/)).toBeInTheDocument()
    })

    it('should render children with custom warning banner', () => {
      render(
        <ConfirmationModal
          isOpen={true}
          title="Delete Class"
          message="Are you sure you want to delete this class?"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        >
          <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mt-2" data-testid="cascading-warning">
            <p className="text-sm text-yellow-800">
              ⚠️ This class has 3 final comment(s) that will also be deleted.
            </p>
          </div>
        </ConfirmationModal>,
      )

      const warning = screen.getByTestId('cascading-warning')
      expect(warning).toBeInTheDocument()
      expect(screen.getByText(/3 final comment\(s\) that will also be deleted/)).toBeInTheDocument()
    })

    it('should render message and children together', () => {
      render(
        <ConfirmationModal
          isOpen={true}
          title="Delete"
          message="Are you sure?"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        >
          <div data-testid="custom-content">Custom content</div>
        </ConfirmationModal>,
      )

      // Both message and children should be present
      expect(screen.getByText('Are you sure?')).toBeInTheDocument()
      expect(screen.getByTestId('custom-content')).toBeInTheDocument()
    })

    it('should not render anything when no children provided', () => {
      const { container } = render(
        <ConfirmationModal
          isOpen={true}
          title="Delete"
          message="Are you sure?"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />,
      )

      // Should still work without children (backward compatibility)
      expect(screen.getByText('Are you sure?')).toBeInTheDocument()
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
  })
})
