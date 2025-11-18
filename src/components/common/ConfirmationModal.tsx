/**
 * ConfirmationModal Component
 * Displays a confirmation dialog for destructive actions
 * Reference: US-SUBJ-DELETE-002, US-DELETE-CONFIRM-*, US-TOKEN-003
 *
 * Features:
 * - Keyboard accessible (Tab, Enter, Escape)
 * - Focus management (Cancel button focused by default)
 * - Loading states for async operations
 * - Custom children content (previews, warnings)
 * - WCAG 2.1 AA compliant
 * - Theme-adaptive styling with design tokens
 */
import React, { useEffect, useRef, useId } from 'react'
import { createPortal } from 'react-dom'
import { useThemeColors } from '../../hooks/useThemeColors'
import { spacing, borders, typography, shadows } from '../../theme/tokens'

interface ConfirmationModalProps {
  isOpen: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
  isLoading?: boolean
  confirmButtonText?: string
  cancelButtonText?: string
  loadingText?: string
  children?: React.ReactNode
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
  loadingText,
  children,
}) => {
  const themeColors = useThemeColors()
  const cancelButtonRef = useRef<HTMLButtonElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const titleId = useId()
  const descriptionId = useId()

  // Compute loading text with smart default
  const computedLoadingText = loadingText || `${confirmButtonText}...`

  // Style definitions using design tokens
  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: spacing.lg,
  }

  const dialogStyle: React.CSSProperties = {
    background: themeColors.background.primary,
    border: `${borders.width.thin} solid ${themeColors.border.default}`,
    borderRadius: borders.radius.md,
    padding: spacing.xl,
    maxWidth: '28rem',
    width: '100%',
    boxShadow: shadows.lg,
    position: 'relative',
  }

  const headerStyle: React.CSSProperties = {
    marginBottom: spacing.lg,
  }

  const titleStyle: React.CSSProperties = {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.lineHeight.tight,
    color: themeColors.text.primary,
    margin: 0,
  }

  const bodyStyle: React.CSSProperties = {
    marginBottom: spacing.xl,
  }

  const messageStyle: React.CSSProperties = {
    fontSize: typography.fontSize.base,
    lineHeight: typography.lineHeight.relaxed,
    color: themeColors.text.secondary,
    margin: 0,
  }

  const footerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: spacing.md,
  }

  const cancelButtonStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: `${spacing.sm} ${spacing.lg}`,
    background: themeColors.neutral[200],
    color: themeColors.text.primary,
    border: `${borders.width.thin} solid ${themeColors.neutral[300]}`,
    borderRadius: borders.radius.sm,
    fontWeight: typography.fontWeight.medium,
    fontSize: typography.fontSize.sm,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  }

  const dangerButtonStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: `${spacing.sm} ${spacing.lg}`,
    background: themeColors.semantic.error,
    color: themeColors.text.inverse,
    border: `${borders.width.thin} solid ${themeColors.semantic.error}`,
    borderRadius: borders.radius.sm,
    fontWeight: typography.fontWeight.medium,
    fontSize: typography.fontSize.sm,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    gap: spacing.sm,
    whiteSpace: 'nowrap',
  }

  const loadingSpinnerStyle: React.CSSProperties = {
    display: 'inline-block',
    width: '14px',
    height: '14px',
    border: '2px solid currentColor',
    borderRightColor: 'transparent',
    borderRadius: '50%',
    animation: 'spin 0.6s linear infinite',
  }

  // Focus management: save previous focus, focus Cancel button on open, restore on close
  useEffect(() => {
    if (isOpen) {
      // Store currently focused element before opening modal
      previousFocusRef.current = document.activeElement as HTMLElement
      // Focus Cancel button (safe default)
      cancelButtonRef.current?.focus()
    } else if (previousFocusRef.current) {
      // Restore focus to previously focused element when modal closes
      previousFocusRef.current.focus()
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
    <>
      {/* Keyframe animation for loading spinner */}
      <style>
        {`
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
      <div style={overlayStyle} onClick={onCancel}>
        <div
          style={dialogStyle}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside dialog
        >
          <div style={headerStyle}>
            <h2 id={titleId} style={titleStyle}>
              {title}
            </h2>
          </div>

          <div style={bodyStyle}>
            <p id={descriptionId} style={messageStyle}>
              {message}
            </p>
            {children}
          </div>

          <div style={footerStyle}>
            <button
              ref={cancelButtonRef}
              type="button"
              style={cancelButtonStyle}
              onClick={onCancel}
              disabled={isLoading}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.background = themeColors.neutral[300]
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = themeColors.neutral[200]
              }}
              onFocus={(e) => {
                e.currentTarget.style.outline = `2px solid ${themeColors.border.focus}`
                e.currentTarget.style.outlineOffset = '2px'
              }}
              onBlur={(e) => {
                e.currentTarget.style.outline = 'none'
              }}
            >
              {cancelButtonText}
            </button>

            <button
              type="button"
              style={{
                ...dangerButtonStyle,
                opacity: isLoading ? 0.6 : 1,
              }}
              onClick={onConfirm}
              disabled={isLoading}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.background = themeColors.semantic.errorDark
                  e.currentTarget.style.borderColor = themeColors.semantic.errorDark
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.background = themeColors.semantic.error
                  e.currentTarget.style.borderColor = themeColors.semantic.error
                }
              }}
              onFocus={(e) => {
                e.currentTarget.style.outline = `2px solid ${themeColors.semantic.error}`
                e.currentTarget.style.outlineOffset = '2px'
              }}
              onBlur={(e) => {
                e.currentTarget.style.outline = 'none'
              }}
            >
              {isLoading
                ? (
                <>
                  <span style={loadingSpinnerStyle} aria-hidden="true"></span>
                  {computedLoadingText}
                </>
                  )
                : (
                    confirmButtonText
                  )}
            </button>
          </div>
        </div>
      </div>
    </>
  )

  // Render modal in portal to ensure it's above all other content
  return createPortal(modalContent, document.body)
}
