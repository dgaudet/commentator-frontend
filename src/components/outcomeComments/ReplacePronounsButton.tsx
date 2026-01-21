/**
 * ReplacePronounsButton Component
 *
 * Reusable button component for replacing pronouns with placeholders.
 * Consolidates the button UI and message display logic to reduce duplication
 * across OutcomeCommentsModal add and edit sections.
 *
 * Story: Code duplication reduction - extracted from OutcomeCommentsModal
 */

import React from 'react'
import { Button } from '../common/Button'
import type { ReplacePronounsMessage } from '../../hooks/useReplacePronounsButton'
import { spacing } from '../../theme/tokens'

interface ReplacePronounsButtonProps {
  /** Whether the replace operation is in progress */
  isLoading: boolean
  /** Message to display (success, error, or info) */
  message: ReplacePronounsMessage | null
  /** Handler function called when button is clicked */
  onReplace: () => void
  /** Function to get message box styling based on message type */
  getMessageBoxStyle: (type: string) => React.CSSProperties
  /** Whether the button should be disabled */
  disabled: boolean
  /** Title attribute for the button (shown on hover) */
  title: string
}

/**
 * Button component for replacing pronouns with placeholders.
 * Displays button and optional message in a flex row layout.
 *
 * @param props - Component props
 * @returns JSX element
 */
export const ReplacePronounsButton: React.FC<ReplacePronounsButtonProps> = ({
  isLoading,
  message,
  onReplace,
  getMessageBoxStyle,
  disabled,
  title,
}) => {
  return (
    <div style={{ marginTop: '-1.5rem', marginBottom: spacing.md, display: 'flex', gap: spacing.md, alignItems: 'center' }}>
      <Button
        onClick={onReplace}
        disabled={disabled}
        variant="secondary"
        title={title}
      >
        {isLoading ? 'Replacing...' : 'Replace Pronouns with Placeholders'}
      </Button>

      {/* Message displayed beside button */}
      {message && (
        <div
          role={message.type === 'error' ? 'alert' : undefined}
          style={{
            ...getMessageBoxStyle(message.type),
            marginTop: 0,
            marginBottom: 0,
            whiteSpace: 'nowrap',
          }}
        >
          {message.text}
        </div>
      )}
    </div>
  )
}
