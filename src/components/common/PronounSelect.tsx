/**
 * PronounSelect Component
 *
 * Dropdown selector for pronouns used in Final Comments
 * TASK-1.3: Implement pronoun dropdown selector in Final Comments form
 *
 * Features:
 * - Displays pronouns in "pronoun - possessivePronoun" format
 * - Fetches pronouns from API on mount
 * - Shows loading, error, and empty states
 * - Optional field (can be empty)
 * - Keyboard accessible
 * - Design token compliant styling
 */

import { spacing, typography, borders } from '../../theme/tokens'
import { useThemeColors } from '../../hooks/useThemeColors'
import { usePronounsQuery } from '../../hooks/usePronounsQuery'
import type { Pronoun } from '../../types'
import { LoadingSpinner } from './LoadingSpinner'

interface PronounSelectProps {
  /** Currently selected pronoun ID (or empty string for unselected) */
  value: string
  /** Callback when selection changes */
  onChange: (pronounId: string) => void
  /** Unique identifier for the select element */
  id?: string
  /** Label text */
  label?: string
  /** Disabled state */
  disabled?: boolean
  /** Whether to show required indicator */
  required?: boolean
  /** ARIA label for accessibility */
  ariaLabel?: string
}

/**
 * Pronoun selector component for Final Comments form
 *
 * @example
 * const [pronounId, setPronounId] = useState('')
 *
 * return (
 *   <PronounSelect
 *     value={pronounId}
 *     onChange={setPronounId}
 *     id="pronoun-select"
 *     label="Pronoun"
 *   />
 * )
 */
export const PronounSelect = ({
  value,
  onChange,
  id = 'pronoun-select',
  label = 'Pronoun',
  disabled = false,
  required = false,
  ariaLabel,
}: PronounSelectProps) => {
  const themeColors = useThemeColors()
  const { pronouns, loading, error } = usePronounsQuery()

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value)
  }

  return (
    <div style={{ marginBottom: spacing.lg }}>
      {/* Label */}
      <label
        htmlFor={id}
        style={{
          display: 'block',
          marginBottom: spacing.sm,
          fontSize: typography.fontSize.sm,
          fontWeight: typography.fontWeight.medium,
          color: themeColors.text.secondary,
        }}
      >
        {label}
        {required && (
          <span style={{ color: themeColors.semantic.error, marginLeft: '4px' }}>*</span>
        )}
      </label>

      {/* Loading State */}
      {loading && (
        <div style={{ padding: spacing.md }}>
          <LoadingSpinner />
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div
          style={{
            padding: spacing.md,
            backgroundColor: themeColors.semantic.errorLight,
            borderRadius: borders.radius.md,
            color: themeColors.semantic.error,
            fontSize: typography.fontSize.sm,
          }}
        >
          Failed to load pronouns
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && pronouns.length === 0 && (
        <div
          style={{
            padding: spacing.md,
            backgroundColor: themeColors.background.secondary,
            borderRadius: borders.radius.md,
            color: themeColors.text.tertiary,
            fontSize: typography.fontSize.sm,
          }}
        >
          No pronouns available. Create pronouns first.
        </div>
      )}

      {/* Dropdown */}
      {!loading && !error && pronouns.length > 0 && (
        <select
          id={id}
          value={value}
          onChange={handleChange}
          disabled={Boolean(disabled || loading || error)}
          aria-label={ariaLabel || label}
          style={{
            width: '100%',
            padding: spacing.md,
            fontSize: typography.fontSize.base,
            color: themeColors.text.primary,
            backgroundColor: themeColors.background.primary,
            border: `${borders.width.thin} solid ${themeColors.border.default}`,
            borderRadius: borders.radius.md,
            outline: 'none',
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'border-color 0.15s ease, background-color 0.15s ease',
            opacity: disabled ? 0.6 : 1,
          }}
        >
          <option value="">{'Select a pronoun...'}</option>
          {pronouns.map((pronoun: Pronoun) => (
            <option key={pronoun.id} value={pronoun.id}>
              {pronoun.pronoun} - {pronoun.possessivePronoun}
            </option>
          ))}
        </select>
      )}
    </div>
  )
}
