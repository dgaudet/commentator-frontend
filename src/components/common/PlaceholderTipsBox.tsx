/**
 * PlaceholderTipsBox Component
 *
 * Displays instructional tips for using dynamic placeholders in comments.
 * Reusable across OutcomeCommentsModal and PersonalizedCommentsModal.
 *
 * US-PLACEHOLDER-PC-001, US-PLACEHOLDER-PC-002, US-PLACEHOLDER-001
 * TASK-1.1: Add pronoun placeholder documentation to Outcome Comments
 * TASK-1.2: Add pronoun placeholder documentation to Personalized Comments
 */

import { spacing, typography, borders } from '../../theme/tokens'
import { useThemeColors } from '../../hooks/useThemeColors'

export const PlaceholderTipsBox = () => {
  const themeColors = useThemeColors()

  // Reusable code element styling
  const codeStyle = {
    padding: '2px 4px',
    backgroundColor: themeColors.background.secondary,
    borderRadius: borders.radius.sm,
    fontSize: typography.fontSize.xs,
  } as const

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
        <code style={codeStyle}>&lt;first name&gt;</code> <code style={codeStyle}>&lt;last name&gt;</code>{' '}
        <code style={codeStyle}>&lt;grade&gt;</code>
        <br />
        <code style={codeStyle}>&lt;pronoun&gt;</code> (e.g., he, she, they){' '}
        <code style={codeStyle}>&lt;possessive pronoun&gt;</code> (e.g., his, her, their)
        <br />
        <em style={{ color: themeColors.text.tertiary }}>
          Example: &quot;&lt;first name&gt; earned &lt;grade&gt; points&quot; → &quot;Alice earned 95
          points&quot;
        </em>
      </div>
    </div>
  )
}
