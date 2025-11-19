/**
 * PlaceholderWarningsBox Component
 *
 * Displays validation warnings for malformed placeholders in comments.
 * Reusable across OutcomeCommentsModal and PersonalizedCommentsModal.
 *
 * US-PLACEHOLDER-PC-003, US-PLACEHOLDER-003
 */

import { spacing, typography, borders } from '../../theme/tokens'
import { useThemeColors } from '../../hooks/useThemeColors'

interface PlaceholderWarningsBoxProps {
  warnings: string[]
}

export const PlaceholderWarningsBox = ({ warnings }: PlaceholderWarningsBoxProps) => {
  const themeColors = useThemeColors()
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
        backgroundColor: themeColors.semantic.warningLight,
        border: `${borders.width.thin} solid ${themeColors.semantic.warning}`,
        borderRadius: borders.radius.md,
        color: themeColors.semantic.warning,
        fontSize: typography.fontSize.sm,
      }}
    >
      {warnings.map((warning) => (
        <div key={warning}>{warning}</div>
      ))}
    </div>
  )
}
