/**
 * PlaceholderWarningsBox Component
 *
 * Displays validation warnings for malformed placeholders in comments.
 * Reusable across OutcomeCommentsModal and PersonalizedCommentsModal.
 *
 * US-PLACEHOLDER-PC-003, US-PLACEHOLDER-003
 */

import { colors, spacing, typography, borders } from '../../theme/tokens'

interface PlaceholderWarningsBoxProps {
  warnings: string[]
}

export const PlaceholderWarningsBox = ({ warnings }: PlaceholderWarningsBoxProps) => {
  if (warnings.length === 0) {
    return null
  }

  return (
    <div
      role="alert"
      aria-live="polite"
      style={{
        padding: spacing.md,
        marginTop: spacing.md,
        backgroundColor: colors.semantic.warningLight,
        border: `${borders.width.thin} solid ${colors.semantic.warning}`,
        borderRadius: borders.radius.md,
        color: colors.semantic.warning,
        fontSize: typography.fontSize.sm,
      }}
    >
      {warnings.map((warning, index) => (
        <div key={index}>{warning}</div>
      ))}
    </div>
  )
}
