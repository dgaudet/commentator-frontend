/**
 * CopyButton Component
 * Reference: US-COPY-001, US-COPY-004, US-COPY-005, US-TOKEN-008
 *
 * A reusable button component for copying text to the clipboard.
 * Provides visual feedback, accessibility features, and fallback support.
 *
 * Features:
 * - Clipboard API with execCommand fallback
 * - ARIA live region for screen reader announcements
 * - Enhanced accessibility labels
 * - Feature detection for older browsers
 * - Theme-adaptive styling with design tokens
 */

import React, { useState, useCallback, useEffect, useRef } from 'react'
import { useThemeColors } from '../../hooks/useThemeColors'
import { spacing, typography, borders } from '../../theme/tokens'

export interface CopyButtonProps {
  /** The text to copy to clipboard */
  text: string
  /** Optional disabled state override */
  disabled?: boolean
  /** Callback fired when copy succeeds */
  onCopySuccess?: () => void
  /** Callback fired when copy fails */
  onCopyError?: (error: Error) => void
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  text,
  disabled = false,
  onCopySuccess,
  onCopyError,
}) => {
  const themeColors = useThemeColors()
  const [copied, setCopied] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const announcementTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const buttonStyle: React.CSSProperties = {
    padding: `${spacing.sm} ${spacing.lg}`,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: themeColors.text.secondary,
    backgroundColor: themeColors.background.primary,
    border: `${borders.width.thin} solid ${themeColors.neutral[300]}`,
    borderRadius: borders.radius.sm,
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    whiteSpace: 'nowrap' as const,
  }

  // US-COPY-005: Feature detection for Clipboard API
  const isClipboardSupported = typeof navigator !== 'undefined' && navigator.clipboard

  // Disable button if text is empty or only whitespace, or if no clipboard support
  const isTextEmpty = text.trim().length === 0
  const isDisabled = disabled || isTextEmpty || !isClipboardSupported

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (announcementTimeoutRef.current) {
        clearTimeout(announcementTimeoutRef.current)
      }
    }
  }, [])

  /**
   * US-COPY-004: Announce message to screen readers via ARIA live region
   */
  const announce = useCallback((message: string) => {
    setAnnouncement(message)

    // Clear announcement after 1 second
    announcementTimeoutRef.current = setTimeout(() => {
      setAnnouncement('')
      announcementTimeoutRef.current = null
    }, 1000)
  }, [])

  /**
   * US-COPY-005: Fallback copy method using document.execCommand
   */
  const fallbackCopy = useCallback((textToCopy: string): boolean => {
    try {
      // Create temporary textarea element
      const textarea = document.createElement('textarea')
      textarea.value = textToCopy
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)

      // Select and copy
      textarea.select()
      const success = document.execCommand('copy')

      // Cleanup
      document.body.removeChild(textarea)

      return success
    } catch (error) {
      return false
    }
  }, [])

  const handleCopy = useCallback(async () => {
    if (isDisabled) return

    const textToCopy = text.trim()

    try {
      // US-COPY-005: Try Clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(textToCopy)

        // Show success feedback
        setCopied(true)
        announce('Copied to clipboard') // US-COPY-004
        onCopySuccess?.()

        // Reset after 2 seconds
        timeoutRef.current = setTimeout(() => {
          setCopied(false)
          timeoutRef.current = null
        }, 2000)
      } else {
        // Clipboard API not available, try fallback
        throw new Error('Clipboard API not available')
      }
    } catch (error) {
      // US-COPY-005: Try fallback method
      const fallbackSuccess = fallbackCopy(textToCopy)

      if (fallbackSuccess) {
        // Show success feedback
        setCopied(true)
        announce('Copied to clipboard') // US-COPY-004
        onCopySuccess?.()

        // Reset after 2 seconds
        timeoutRef.current = setTimeout(() => {
          setCopied(false)
          timeoutRef.current = null
        }, 2000)
      } else {
        // Both methods failed
        const copyError = new Error('Unable to copy to clipboard. Please try manually selecting and copying the text.')
        announce('Failed to copy. Please try again.') // US-COPY-004
        onCopyError?.(copyError)
        setCopied(false)
      }
    }
  }, [text, isDisabled, onCopySuccess, onCopyError, announce, fallbackCopy])

  // US-COPY-005: Show "Not supported" if no clipboard capability
  if (!isClipboardSupported) {
    return (
      <button
        type="button"
        style={{
          ...buttonStyle,
          opacity: 0.5,
          cursor: 'not-allowed',
        }}
        disabled={true}
        aria-label="Copy not supported"
      >
        Not supported
      </button>
    )
  }

  return (
    <>
      <button
        type="button"
        style={{
          ...buttonStyle,
          opacity: isDisabled ? 0.5 : 1,
          backgroundColor: isDisabled ? themeColors.neutral[100] : themeColors.background.primary,
        }}
        onClick={handleCopy}
        disabled={isDisabled}
        aria-label={copied ? 'Copied to clipboard' : 'Copy to clipboard'}
        onMouseEnter={(e) => {
          if (!isDisabled) {
            e.currentTarget.style.backgroundColor = themeColors.neutral[50]
            e.currentTarget.style.borderColor = themeColors.neutral[400]
          }
        }}
        onMouseLeave={(e) => {
          if (!isDisabled) {
            e.currentTarget.style.backgroundColor = themeColors.background.primary
            e.currentTarget.style.borderColor = themeColors.neutral[300]
          }
        }}
        onFocus={(e) => {
          e.currentTarget.style.outline = `2px solid ${themeColors.border.focus}`
          e.currentTarget.style.outlineOffset = '2px'
        }}
        onBlur={(e) => {
          e.currentTarget.style.outline = 'none'
        }}
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>

      {/* US-COPY-004: ARIA live region for screen reader announcements */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
      >
        {announcement}
      </div>
    </>
  )
}
