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

    it('should style Delete button with danger colors using design tokens', () => {
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
      expect(deleteButton).toHaveClass('button-danger')
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

      // Button name changes to "Deleting..." when loading
      const deleteButton = screen.getByRole('button', { name: /deleting/i })
      expect(deleteButton).toBeDisabled()
      expect(screen.getByText(/deleting/i)).toBeInTheDocument()
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

    it('should support Tab navigation between buttons', () => {
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

      // Both should be focusable
      expect(cancelButton).toHaveAttribute('tabIndex', '0')
      expect(deleteButton).toHaveAttribute('tabIndex', '0')
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

    it('should handle Enter key on Cancel button', () => {
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
      fireEvent.keyDown(cancelButton, { key: 'Enter' })

      expect(mockOnCancel).toHaveBeenCalledTimes(1)
    })

    it('should handle Enter key on Delete button', () => {
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
      deleteButton.focus()
      fireEvent.keyDown(deleteButton, { key: 'Enter' })

      expect(mockOnConfirm).toHaveBeenCalledTimes(1)
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
})
