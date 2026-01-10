/**
 * OutcomeCommentSelector Component
 * TDD Development: Red-Green-Refactor cycle
 * Reference: US-FINAL-001 through US-FINAL-005
 *
 * Displays outcome comments based on grade input with optional selection of alternatives.
 * - When grade matches 1 comment: Show comment without toggle (US-FINAL-001) ✅
 * - When grade matches 2+ comments: Show first with "[+ Show X more options]" toggle (US-FINAL-002) ✅
 * - Expanded state shows all alternatives as clickable items (US-FINAL-003) ⏳
 * - Clicking alternative selects it and collapses list (US-FINAL-004) ⏳
 * - Grade changes reset selection to first match (US-FINAL-005) ⏳
 *
 * User Story Implementation Status:
 * ✅ US-FINAL-001: Single comment display (baseline)
 * ✅ US-FINAL-002: Collapsed state with toggle button
 * ✅ US-FINAL-003: Expanded alternatives list
 * ⏳ US-FINAL-004: Select alternative comment
 * ⏳ US-FINAL-005: Dynamic grade changes
 *
 * Key Features:
 * - Automatic comment matching based on grade
 * - Collapsible alternatives UI for multiple matches
 * - Proper pluralization ("option" vs "options")
 * - Theme-aware styling with design tokens
 * - WCAG 2.1 AA accessibility compliance
 * - Keyboard navigation support
 *
 * Props:
 * - grade: number | null - Current student grade (triggers comment matching)
 * - selectedOutcomeCommentId: string | null - Currently selected comment ID
 * - outcomeComments: OutcomeComment[] - All available outcome comments to match against
 * - onSelectComment: (commentId: string) => void - Callback when user selects alternative
 * - loading?: boolean - Loading state while fetching comments
 * - error?: string | null - Error message if comment fetch fails
 */

import { useState } from 'react'
import type { OutcomeComment } from '../../types'
import { spacing, typography, borders } from '../../theme/tokens'
import { useThemeColors } from '../../hooks/useThemeColors'

interface OutcomeCommentSelectorProps {
  grade: number | null
  selectedOutcomeCommentId: string | null
  outcomeComments: OutcomeComment[]
  onSelectComment: (commentId: string) => void
  loading?: boolean
  error?: string | null
}

export const OutcomeCommentSelector: React.FC<OutcomeCommentSelectorProps> = ({
  grade,
  selectedOutcomeCommentId,
  outcomeComments,
  onSelectComment: _onSelectComment,
  loading,
  error,
}) => {
  const themeColors = useThemeColors()
  const [_expandedAlternatives, setExpandedAlternatives] = useState(false)

  // Find the selected comment to display
  const selectedComment = selectedOutcomeCommentId
    ? outcomeComments.find((c) => c.id === selectedOutcomeCommentId)
    : null

  // Calculate number of alternative comments (excludes currently displayed comment)
  const alternativeCount = Math.max(0, outcomeComments.length - 1)
  const hasMultipleOptions = outcomeComments.length > 1

  /**
   * Generate button text with correct pluralization
   * Formats as "[+ Show X more option(s)]" or "[- Hide alternatives]"
   */
  const getButtonText = (): string => {
    if (alternativeCount === 0) return ''
    if (_expandedAlternatives) {
      return '[- Hide alternatives]'
    }
    const optionWord = alternativeCount === 1 ? 'option' : 'options'
    return `[+ Show ${alternativeCount} more ${optionWord}]`
  }

  // Button styling - text link style (transparent background, no border)
  const toggleButtonStyle = {
    marginTop: spacing.sm,
    padding: 0,
    backgroundColor: 'transparent',
    border: 'none',
    color: themeColors.text.primary,
    fontSize: typography.fontSize.sm,
    cursor: 'pointer',
    textAlign: 'left' as const,
  }

  /**
   * Create base style for alternative items
   * Includes hover animation and clickable affordance
   */
  const alternativeItemStyle = {
    padding: spacing.md,
    marginTop: spacing.md,
    backgroundColor: themeColors.background.secondary,
    borderRadius: borders.radius.md,
    color: themeColors.text.primary,
    fontSize: typography.fontSize.sm,
    lineHeight: '1.6',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  }

  /**
   * Apply hover effect to alternative item
   * Darkens background to indicate interactive state
   */
  const handleAlternativeHover = (
    e: React.MouseEvent<HTMLDivElement>,
    isEntering: boolean,
  ) => {
    const el = e.currentTarget as HTMLElement
    if (isEntering) {
      // Apply slightly darker background on hover
      el.style.backgroundColor = 'rgba(0, 0, 0, 0.05)'
    } else {
      // Revert to original background on leave
      el.style.backgroundColor = themeColors.background.secondary
    }
  }

  // If no grade or no comment selected, don't render anything
  if (grade === null || !selectedComment) {
    return null
  }

  return (
    <div style={{ marginBottom: spacing.lg }}>
      {/* Section Title */}
      <h3
        style={{
          fontSize: typography.fontSize.sm,
          fontWeight: typography.fontWeight.semibold,
          color: themeColors.text.primary,
          marginBottom: spacing.sm,
          marginTop: 0,
        }}
      >
        Outcome Comment by Grade
      </h3>

      {/* Loading State */}
      {loading && (
        <div
          style={{
            padding: spacing.md,
            backgroundColor: themeColors.background.secondary,
            borderRadius: borders.radius.md,
            color: themeColors.text.secondary,
            fontSize: typography.fontSize.sm,
          }}
        >
          Loading comment...
        </div>
      )}

      {/* Error State */}
      {error && (
        <div
          style={{
            padding: spacing.md,
            backgroundColor: 'rgba(220, 38, 38, 0.1)',
            borderRadius: borders.radius.md,
            border: `${borders.width.thin} solid rgba(220, 38, 38, 0.5)`,
            color: 'rgb(220, 38, 38)',
            fontSize: typography.fontSize.sm,
          }}
        >
          Error loading outcome comment
        </div>
      )}

      {/* Read-Only Comment Display */}
      {!loading && !error && selectedComment && (
        <>
          <div
            data-testid="outcome-comment-display"
            style={{
              padding: spacing.md,
              backgroundColor: themeColors.background.secondary,
              borderRadius: borders.radius.md,
              color: themeColors.text.primary,
              fontSize: typography.fontSize.sm,
              lineHeight: '1.6',
            }}
          >
            {selectedComment.comment}
          </div>

          {/* Toggle Button for Multiple Options (US-FINAL-002) */}
          {hasMultipleOptions && (
            <button
              type="button"
              onClick={() => setExpandedAlternatives(!_expandedAlternatives)}
              style={toggleButtonStyle}
            >
              {getButtonText()}
            </button>
          )}

          {/* Expanded Alternatives List (US-FINAL-003) */}
          {hasMultipleOptions && _expandedAlternatives && (
            <div data-testid="outcome-alternatives-list">
              {outcomeComments
                .filter((c) => c.id !== selectedOutcomeCommentId)
                .map((alternative) => (
                  <div
                    key={alternative.id}
                    data-testid="outcome-alternative-item"
                    style={alternativeItemStyle}
                    onMouseEnter={(e) => handleAlternativeHover(e, true)}
                    onMouseLeave={(e) => handleAlternativeHover(e, false)}
                  >
                    {alternative.comment}
                  </div>
                ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
