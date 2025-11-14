/**
 * CopyButton Component
 * Reference: US-COPY-001
 *
 * A reusable button component for copying text to the clipboard.
 * Provides visual feedback and handles errors gracefully.
 */

import React, { useState, useCallback, useEffect, useRef } from 'react'
import './CopyButton.css'

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
  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Disable button if text is empty or only whitespace
  const isTextEmpty = text.trim().length === 0
  const isDisabled = disabled || isTextEmpty

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handleCopy = useCallback(async () => {
    if (isDisabled) return

    try {
      const textToCopy = text.trim()
      await navigator.clipboard.writeText(textToCopy)

      // Show success feedback
      setCopied(true)
      onCopySuccess?.()

      // Reset after 2 seconds
      timeoutRef.current = setTimeout(() => {
        setCopied(false)
        timeoutRef.current = null
      }, 2000)
    } catch (error) {
      // Handle error gracefully
      onCopyError?.(error as Error)
      setCopied(false)
    }
  }, [text, isDisabled, onCopySuccess, onCopyError])

  return (
    <button
      type="button"
      className="copy-button"
      onClick={handleCopy}
      disabled={isDisabled}
      aria-label={copied ? 'Copied' : 'Copy'}
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}
