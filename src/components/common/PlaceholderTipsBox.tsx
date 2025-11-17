/**
 * PlaceholderTipsBox Component
 *
 * Displays instructional tips for using dynamic placeholders in comments.
 * Reusable across OutcomeCommentsModal and PersonalizedCommentsModal.
 *
 * US-PLACEHOLDER-PC-001, US-PLACEHOLDER-PC-002, US-PLACEHOLDER-001
 */

import { colors, spacing, typography, borders } from '../../theme/tokens'

export const PlaceholderTipsBox = () => {
  return (
    <div
      style={{
        padding: spacing.md,
        marginBottom: spacing.md,
        backgroundColor: colors.primary[50],
        border: `${borders.width.thin} solid ${colors.primary[200]}`,
        borderRadius: borders.radius.md,
      }}
    >
      <div
        style={{
          fontSize: typography.fontSize.sm,
          fontWeight: typography.fontWeight.semibold,
          color: colors.primary[700],
          marginBottom: spacing.xs,
        }}
      >
        💡 Tip: Use Dynamic Placeholders
      </div>
      <div
        style={{
          fontSize: typography.fontSize.sm,
          color: colors.text.secondary,
          lineHeight: typography.lineHeight.relaxed,
        }}
      >
        Add placeholders to personalize comments for each student:
        <br />
        <code
          style={{
            padding: '2px 4px',
            backgroundColor: colors.background.secondary,
            borderRadius: borders.radius.sm,
            fontSize: typography.fontSize.xs,
          }}
        >
          &lt;first name&gt;
        </code>{' '}
        <code
          style={{
            padding: '2px 4px',
            backgroundColor: colors.background.secondary,
            borderRadius: borders.radius.sm,
            fontSize: typography.fontSize.xs,
          }}
        >
          &lt;last name&gt;
        </code>{' '}
        <code
          style={{
            padding: '2px 4px',
            backgroundColor: colors.background.secondary,
            borderRadius: borders.radius.sm,
            fontSize: typography.fontSize.xs,
          }}
        >
          &lt;grade&gt;
        </code>
        <br />
        <em style={{ color: colors.text.tertiary }}>
          Example: &quot;&lt;first name&gt; earned &lt;grade&gt; points&quot; → &quot;Alice earned 95
          points&quot;
        </em>
      </div>
    </div>
  )
}
