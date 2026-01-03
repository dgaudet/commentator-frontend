/**
 * PronounDisplay Component
 *
 * Displays pronoun information for a final comment
 * TASK-1.4: Display pronoun info in Final Comments UI
 *
 * Properties:
 * - pronounId: The ID of the selected pronoun
 * - pronouns: Array of available pronouns to look up the pronounId
 */

import { spacing, typography } from '../../theme/tokens'
import { useThemeColors } from '../../hooks/useThemeColors'
import type { Pronoun } from '../../types'

interface PronounDisplayProps {
  /** The pronounId from the final comment */
  pronounId?: string
  /** Array of pronouns to match against the pronounId */
  pronouns: Pronoun[]
}

/**
 * Component to display pronoun information in final comments
 * Shows "pronoun - possessivePronoun" format or "Not specified"
 *
 * @example
 * <PronounDisplay pronounId={comment.pronounId} pronouns={pronounsList} />
 * // Output: "they - their"
 */
export const PronounDisplay = ({ pronounId, pronouns }: PronounDisplayProps) => {
  const themeColors = useThemeColors()

  // Find the matching pronoun
  const selectedPronoun = pronounId ? pronouns.find((p) => p.id === pronounId) : null

  return (
    <div
      style={{
        fontSize: typography.fontSize.sm,
        color: themeColors.text.tertiary,
        marginBottom: spacing.md,
      }}
    >
      Pronoun:{' '}
      <span style={{ color: themeColors.text.secondary, fontWeight: typography.fontWeight.medium }}>
        {selectedPronoun ? `${selectedPronoun.pronoun} - ${selectedPronoun.possessivePronoun}` : 'Not specified'}
      </span>
    </div>
  )
}
