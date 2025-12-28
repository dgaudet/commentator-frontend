/**
 * PlaceholderTipsBox Component
 *
 * Displays instructional tips for using dynamic placeholders in comments.
 * Reusable across OutcomeCommentsModal and PersonalizedCommentsModal.
 *
 * US-PLACEHOLDER-PC-001, US-PLACEHOLDER-PC-002, US-PLACEHOLDER-001
 */

import { spacing, typography, borders } from '../../theme/tokens'
import { useThemeColors } from '../../hooks/useThemeColors'

export const PlaceholderTipsBox = () => {
  const themeColors = useThemeColors()
  return (
    <div
      style={{
        padding: spacing.md,
        marginBottom: spacing.md,
      }}
    >
      <div
        style={{
          fontSize: typography.fontSize.sm,
          fontWeight: typography.fontWeight.semibold,
          color: themeColors.primary.dark,
          marginBottom: spacing.xs,
        }}
      >
        💡 Tip: Use Dynamic Placeholders
      </div>
      <div
        style={{
          fontSize: typography.fontSize.sm,
          color: themeColors.text.secondary,
          lineHeight: typography.lineHeight.relaxed,
        }}
      >
        Add placeholders to personalize comments for each student:
        <br />
        <code
          style={{
            padding: '2px 4px',
            backgroundColor: themeColors.background.secondary,
            borderRadius: borders.radius.sm,
            fontSize: typography.fontSize.xs,
          }}
        >
          &lt;first name&gt;
        </code>{' '}
        <code
          style={{
            padding: '2px 4px',
            backgroundColor: themeColors.background.secondary,
            borderRadius: borders.radius.sm,
            fontSize: typography.fontSize.xs,
          }}
        >
          &lt;last name&gt;
        </code>{' '}
        <code
          style={{
            padding: '2px 4px',
            backgroundColor: themeColors.background.secondary,
            borderRadius: borders.radius.sm,
            fontSize: typography.fontSize.xs,
          }}
        >
          &lt;grade&gt;
        </code>
        <br />
        <em style={{ color: themeColors.text.tertiary }}>
          Example: &quot;&lt;first name&gt; earned &lt;grade&gt; points&quot; → &quot;Alice earned 95
          points&quot;
        </em>
      </div>
    </div>
  )
}
