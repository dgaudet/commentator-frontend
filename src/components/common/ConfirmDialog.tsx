/**
 * ConfirmDialog Component
 * Modal dialog for confirming destructive actions
 * Reference: US-CLASS-005, REQ-5 (Delete Class)
 *
 * Features:
 * - Accessible modal with ARIA attributes
 * - Keyboard navigation support
 * - Customizable title, message, and button text
 * - Danger variant for destructive actions
 * - Backdrop click to cancel
 */
import React, { useEffect } from 'react'
import { Button } from './Button'

export interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'danger'
  onConfirm: () => void
  onCancel: () => void
}

/**
 * Confirmation dialog component for confirming destructive actions
 *
 * @example
 * <ConfirmDialog
 *   isOpen={showDialog}
 *   title="Delete Class"
 *   message="Are you sure you want to delete 'Math 101'? This action cannot be undone."
 *   confirmText="Delete"
 *   cancelText="Cancel"
 *   variant="danger"
 *   onConfirm={handleDelete}
 *   onCancel={handleCancel}
 * />
 */
export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  onConfirm,
  onCancel,
}) => {
  // Prevent body scroll when dialog is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Handle ESC key to close dialog
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onCancel])

  if (!isOpen) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        data-testid="dialog-overlay"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Dialog content - centered with max-height */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <h2
          id="dialog-title"
          className="text-xl font-bold text-gray-900 mb-4"
        >
          {title}
        </h2>

        <p className="text-gray-700 mb-6">{message}</p>

        <div className="flex gap-3 justify-end">
          <Button onClick={onCancel} variant="secondary">
            {cancelText}
          </Button>

          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
              variant === 'danger'
                ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
