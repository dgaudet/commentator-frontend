/**
 * ConfirmDialog Component Tests
 * TDD-first: Testing confirmation dialog for destructive actions
 * Reference: US-CLASS-005, REQ-5
 */
import { render, screen, fireEvent } from '../../../test-utils'
import { ConfirmDialog } from '../ConfirmDialog'

describe('ConfirmDialog', () => {
  const mockOnConfirm = jest.fn()
  const mockOnCancel = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders nothing when isOpen is false', () => {
      const { container } = render(
        <ConfirmDialog
          isOpen={false}
          title="Delete Class"
          message="Are you sure?"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />,
      )
      expect(container.firstChild).toBeNull()
    })

    it('renders dialog when isOpen is true', () => {
      render(
        <ConfirmDialog
          isOpen={true}
          title="Delete Class"
          message="Are you sure you want to delete this class?"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />,
      )

      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(screen.getByText('Delete Class')).toBeInTheDocument()
      expect(screen.getByText(/are you sure/i)).toBeInTheDocument()
    })

    it('displays custom confirm and cancel button text', () => {
      render(
        <ConfirmDialog
          isOpen={true}
          title="Delete"
          message="Confirm deletion?"
          confirmText="Yes, Delete"
          cancelText="No, Keep It"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />,
      )

      expect(screen.getByRole('button', { name: /yes, delete/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /no, keep it/i })).toBeInTheDocument()
    })

    it('uses default button text when not provided', () => {
      render(
        <ConfirmDialog
          isOpen={true}
          title="Delete"
          message="Confirm?"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />,
      )

      expect(screen.getByRole('button', { name: /confirm/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
    })
  })

  describe('User Interactions', () => {
    it('calls onConfirm when confirm button is clicked', () => {
      render(
        <ConfirmDialog
          isOpen={true}
          title="Delete"
          message="Are you sure?"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />,
      )

      const confirmButton = screen.getByRole('button', { name: /confirm/i })
      fireEvent.click(confirmButton)

      expect(mockOnConfirm).toHaveBeenCalledTimes(1)
      expect(mockOnCancel).not.toHaveBeenCalled()
    })

    it('calls onCancel when cancel button is clicked', () => {
      render(
        <ConfirmDialog
          isOpen={true}
          title="Delete"
          message="Are you sure?"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />,
      )

      const cancelButton = screen.getByRole('button', { name: /cancel/i })
      fireEvent.click(cancelButton)

      expect(mockOnCancel).toHaveBeenCalledTimes(1)
      expect(mockOnConfirm).not.toHaveBeenCalled()
    })

    it('calls onCancel when overlay/backdrop is clicked', () => {
      render(
        <ConfirmDialog
          isOpen={true}
          title="Delete"
          message="Are you sure?"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />,
      )

      const overlay = screen.getByTestId('dialog-overlay')
      fireEvent.click(overlay)

      expect(mockOnCancel).toHaveBeenCalledTimes(1)
      expect(mockOnConfirm).not.toHaveBeenCalled()
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(
        <ConfirmDialog
          isOpen={true}
          title="Delete Class"
          message="Are you sure?"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />,
      )

      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveAttribute('aria-modal', 'true')
      expect(dialog).toHaveAttribute('aria-labelledby')
    })

    it('confirm button is keyboard accessible and focusable', () => {
      render(
        <ConfirmDialog
          isOpen={true}
          title="Delete"
          message="Are you sure?"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />,
      )

      const confirmButton = screen.getByRole('button', { name: /confirm/i })
      confirmButton.focus()
      expect(confirmButton).toHaveFocus()
    })

    it('cancel button is keyboard accessible and focusable', () => {
      render(
        <ConfirmDialog
          isOpen={true}
          title="Delete"
          message="Are you sure?"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />,
      )

      const cancelButton = screen.getByRole('button', { name: /cancel/i })
      cancelButton.focus()
      expect(cancelButton).toHaveFocus()
    })
  })

  describe('Variant Styling', () => {
    it('applies danger variant styling to confirm button', () => {
      render(
        <ConfirmDialog
          isOpen={true}
          title="Delete"
          message="Are you sure?"
          variant="danger"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />,
      )

      const confirmButton = screen.getByRole('button', { name: /confirm/i })
      // Should have red/danger styling
      expect(confirmButton).toHaveClass('bg-red-600')
    })

    it('applies default variant styling when not specified', () => {
      render(
        <ConfirmDialog
          isOpen={true}
          title="Confirm"
          message="Proceed?"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />,
      )

      const confirmButton = screen.getByRole('button', { name: /confirm/i })
      // Should have primary/blue styling
      expect(confirmButton).toHaveClass('bg-blue-600')
    })
  })
})
