/**
 * ConfirmationModal Component
 * Displays a confirmation dialog for destructive actions
 * Reference: US-SUBJ-DELETE-002
 *
 * Features:
 * - Keyboard accessible (Tab, Enter, Escape)
 * - Focus management (Cancel button focused by default)
 * - Loading states for async operations
 * - WCAG 2.1 AA compliant
 */
import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import styles from './ConfirmationModal.module.css'

interface ConfirmationModalProps {
  isOpen: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
  isLoading?: boolean
  confirmButtonText?: string
  cancelButtonText?: string
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  isLoading = false,
  confirmButtonText = 'Delete',
  cancelButtonText = 'Cancel',
}) => {
  const cancelButtonRef = useRef<HTMLButtonElement>(null)
  const titleId = 'modal-title'
  const descriptionId = 'modal-description'

  // Focus Cancel button when modal opens (safe default)
  useEffect(() => {
    if (isOpen && cancelButtonRef.current) {
      cancelButtonRef.current.focus()
    }
  }, [isOpen])

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onCancel])

  if (!isOpen) {
    return null
  }

  const modalContent = (
    <div className={styles['modal-overlay']} onClick={onCancel}>
      <div
        className={styles['modal-dialog']}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside dialog
      >
        <div className={styles['modal-header']}>
          <h2 id={titleId} className={styles['modal-title']}>
            {title}
          </h2>
        </div>

        <div className={styles['modal-body']}>
          <p id={descriptionId} className={styles['modal-message']}>
            {message}
          </p>
        </div>

        <div className={styles['modal-footer']}>
          <button
            ref={cancelButtonRef}
            type="button"
            className={styles['button-cancel']}
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelButtonText}
          </button>

          <button
            type="button"
            className={styles['button-danger']}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading
              ? (
              <>
                <span className={styles['button-loading']} aria-hidden="true"></span>
                Deleting...
              </>
                )
              : (
                  confirmButtonText
                )}
          </button>
        </div>
      </div>
    </div>
  )

  // Render modal in portal to ensure it's above all other content
  return createPortal(modalContent, document.body)
}
