/**
 * CopyCommentsModal Component
 * TDD Development: Red-Green-Refactor cycle
 * Reference: US-CP-001, US-CP-002, US-CP-003, US-CP-004, US-CP-005
 *
 * Modal for copying personalized comments from one subject to another.
 *
 * Acceptance Criteria (US-CP-001 through US-CP-005):
 * - AC-1.1: Button visibility with correct label
 * - AC-1.2: Appropriate styling from design system
 * - AC-1.3: Keyboard and screen reader accessibility
 * - AC-1.4: Modal opens without blocking other elements
 * - AC-2.1: Source subject clearly displayed (read-only)
 * - AC-2.2: Target subject dropdown with owned subjects filter
 * - AC-2.3: Subject list population with auto-exclusion of source
 * - AC-2.4: Comment count display with dynamic updates
 * - AC-2.5: Modal layout with proper keyboard tab order
 * - AC-3.1: Radio button options (overwrite vs append)
 * - AC-3.2: Default selection (append) with changeable option
 * - AC-3.3: Clear mode explanations for each option
 * - AC-3.4: Selection behavior and persistence
 * - AC-3.5: Keyboard navigation for radio buttons
 * - AC-4.1 through AC-4.6: API integration and feedback
 * - AC-5.1 through AC-5.6: Validation and edge cases
 *
 * Props:
 * - isOpen: boolean - Modal visibility state
 * - onClose: () => void - Callback when modal should close
 * - sourceSubjectId: string - ObjectId of subject being copied FROM
 * - sourceSubjectName: string - Display name of source subject
 */

import { useState, useEffect } from 'react'
import type { Subject } from '../../types'
import { spacing, typography, borders } from '../../theme/tokens'
import { useThemeColors } from '../../hooks/useThemeColors'
import { Button } from '../common/Button'
import { personalizedCommentService } from '../../services/api/personalizedCommentService'

interface CopyCommentsModalProps {
  isOpen: boolean
  onClose: () => void
  sourceSubjectId: string
  sourceSubjectName: string
  ownedSubjects?: Subject[]
  sourceCommentCount?: number
}

export const CopyCommentsModal: React.FC<CopyCommentsModalProps> = ({
  isOpen,
  onClose,
  sourceSubjectId,
  sourceSubjectName,
  ownedSubjects = [],
  sourceCommentCount = 0,
}) => {
  const themeColors = useThemeColors()
  const [selectedTargetId, setSelectedTargetId] = useState<string>('')
  // US-CP-003: Copy mode selection - default to append
  const [overwriteMode, setOverwriteMode] = useState(false)

  // US-CP-004: API integration state
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<{
    count: number
    overwrite: boolean
  } | null>(null)

  // AC-2.3: Filter out source subject and sort alphabetically
  const availableTargets = ownedSubjects
    .filter((subject) => subject.id !== sourceSubjectId)
    .sort((a, b) => a.name.localeCompare(b.name))

  // Get target subject name for success message
  const selectedTarget = ownedSubjects.find((s) => s.id === selectedTargetId)
  const targetName = selectedTarget?.name || 'Unknown Subject'

  // US-CP-005: Reset form state when modal is opened
  useEffect(() => {
    if (isOpen) {
      setSelectedTargetId('')
      setOverwriteMode(false)
      setError(null)
      setSuccess(null)
    }
  }, [isOpen])

  // US-CP-004: Handle copy action with API call
  const handleCopy = async () => {
    if (!selectedTargetId) {
      setError('Please select a target subject')
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      const copied = await personalizedCommentService.copy({
        subjectFromId: sourceSubjectId,
        subjectToId: selectedTargetId,
        overwrite: overwriteMode,
      })
      setSuccess({
        count: copied.length,
        overwrite: overwriteMode,
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to copy comments'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Copy comments to another subject"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: themeColors.background.primary,
          borderRadius: borders.radius.lg,
          padding: spacing.xl,
          maxWidth: '500px',
          width: '90%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Modal Header */}
        <h2
          style={{
            fontSize: typography.fontSize.lg,
            fontWeight: typography.fontWeight.bold,
            color: themeColors.text.primary,
            marginBottom: spacing.lg,
            marginTop: 0,
          }}
        >
          Copy Comments to Another Subject
        </h2>

        {/* Source Subject Display (AC-2.1) */}
        <div
          style={{
            marginBottom: spacing.lg,
            padding: spacing.md,
            backgroundColor: themeColors.background.secondary,
            borderRadius: borders.radius.md,
          }}
        >
          <p
            style={{
              fontSize: typography.fontSize.sm,
              color: themeColors.text.secondary,
              marginBottom: spacing.sm,
              marginTop: 0,
            }}
          >
            Copy From (Source):
          </p>
          <p
            style={{
              fontSize: typography.fontSize.base,
              color: themeColors.text.primary,
              fontWeight: typography.fontWeight.semibold,
              margin: 0,
            }}
          >
            {sourceSubjectName}
          </p>
        </div>

        {/* Copy To field (AC-2.2, AC-2.3, AC-2.4) */}
        <div style={{ marginBottom: spacing.lg }}>
          <label
            htmlFor="target-subject"
            style={{
              display: 'block',
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.semibold,
              color: themeColors.text.primary,
              marginBottom: spacing.sm,
            }}
          >
            Copy to (subjects you own):
          </label>

          {
            availableTargets.length === 0
              ? (
                  <p
                    style={{
                      fontSize: typography.fontSize.sm,
                      color: themeColors.text.secondary,
                      margin: 0,
                      padding: spacing.md,
                      backgroundColor: themeColors.background.secondary,
                      borderRadius: borders.radius.md,
                    }}
                  >
                    You don't own any other subjects to copy to
                  </p>
                )
              : (
                  <select
                    id="target-subject"
                    value={selectedTargetId}
                    onChange={(e) => setSelectedTargetId(e.target.value)}
                    aria-label="Copy to (subjects you own)"
                    style={{
                      width: '100%',
                      padding: spacing.md,
                      fontSize: typography.fontSize.sm,
                      borderRadius: borders.radius.md,
                      border: `${borders.width.thin} solid ${themeColors.border.default}`,
                      backgroundColor: themeColors.background.primary,
                      color: themeColors.text.primary,
                      cursor: 'pointer',
                    }}
                  >
                    <option value="">-- Select target subject --</option>
                    {availableTargets.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                )
            }

          {/* AC-2.4: Comment count display */}
          {sourceCommentCount > 0 && (
            <p
              style={{
                fontSize: typography.fontSize.sm,
                color: themeColors.text.secondary,
                marginTop: spacing.sm,
                margin: spacing.sm + ' 0 0 0',
              }}
            >
              {sourceCommentCount} {sourceCommentCount === 1 ? 'comment' : 'comments'} will be copied
            </p>
          )}
        </div>

        {/* US-CP-003: Copy Mode Selection (AC-3.1 through AC-3.5) */}
        <div style={{ marginBottom: spacing.lg }}>
          <fieldset
            style={{
              border: 'none',
              padding: 0,
              margin: 0,
            }}
          >
            <legend
              style={{
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.semibold,
                color: themeColors.text.primary,
                marginBottom: spacing.sm,
              }}
            >
              How should existing comments be handled?
            </legend>

            {/* Overwrite Option */}
            <div style={{ marginBottom: spacing.md }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: spacing.sm,
                  cursor: 'pointer',
                }}
              >
                <input
                  type="radio"
                  name="copy-mode"
                  value="overwrite"
                  checked={overwriteMode}
                  onChange={(e) => setOverwriteMode(e.target.checked)}
                  aria-label="Overwrite existing comments"
                />
                <div>
                  <span
                    style={{
                      fontSize: typography.fontSize.sm,
                      fontWeight: typography.fontWeight.semibold,
                      color: themeColors.text.primary,
                      display: 'block',
                    }}
                  >
                    Overwrite existing comments
                  </span>
                  <p
                    style={{
                      fontSize: typography.fontSize.sm,
                      color: themeColors.text.secondary,
                      margin: `${spacing.xs} 0 0 0`,
                    }}
                  >
                    This will replace any existing personalized comments in the target subject
                  </p>
                </div>
              </label>
            </div>

            {/* Append Option */}
            <div style={{ marginBottom: spacing.md }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: spacing.sm,
                  cursor: 'pointer',
                }}
              >
                <input
                  type="radio"
                  name="copy-mode"
                  value="append"
                  checked={!overwriteMode}
                  onChange={(e) => setOverwriteMode(!e.target.checked)}
                  aria-label="Append to existing comments"
                />
                <div>
                  <span
                    style={{
                      fontSize: typography.fontSize.sm,
                      fontWeight: typography.fontWeight.semibold,
                      color: themeColors.text.primary,
                      display: 'block',
                    }}
                  >
                    Append to existing comments
                  </span>
                  <p
                    style={{
                      fontSize: typography.fontSize.sm,
                      color: themeColors.text.secondary,
                      margin: `${spacing.xs} 0 0 0`,
                    }}
                  >
                    This will add these comments to any existing personalized comments in the target subject
                  </p>
                </div>
              </label>
            </div>
          </fieldset>
        </div>

        {/* Error State Display (AC-4.4) */}
        {error && (
          <div
            style={{
              marginBottom: spacing.lg,
              padding: spacing.md,
              backgroundColor: 'rgba(220, 38, 38, 0.1)',
              borderRadius: borders.radius.md,
              border: `${borders.width.thin} solid rgba(220, 38, 38, 0.5)`,
            }}
          >
            <p
              style={{
                fontSize: typography.fontSize.sm,
                color: 'rgb(220, 38, 38)',
                margin: 0,
              }}
            >
              Error: {error}
            </p>
          </div>
        )}

        {/* Success State Display (AC-4.3) */}
        {success && (
          <div
            style={{
              marginBottom: spacing.lg,
              padding: spacing.md,
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              borderRadius: borders.radius.md,
              border: `${borders.width.thin} solid rgba(34, 197, 94, 0.5)`,
            }}
          >
            <p
              style={{
                fontSize: typography.fontSize.sm,
                color: 'rgb(34, 197, 94)',
                margin: 0,
                marginBottom: spacing.xs,
              }}
            >
              Successfully copied {success.count} {success.count === 1 ? 'comment' : 'comments'} to {targetName}
            </p>
            <p
              style={{
                fontSize: typography.fontSize.sm,
                color: 'rgb(34, 197, 94)',
                margin: 0,
              }}
            >
              {success.overwrite ? 'Overwrote existing comments' : 'Appended to existing comments'}
            </p>
          </div>
        )}

        {/* Modal Footer */}
        <div
          style={{
            display: 'flex',
            gap: spacing.md,
            justifyContent: 'flex-end',
            marginTop: spacing.xl,
          }}
        >
          {/* Success State Buttons (AC-4.3) */}
          {success
            ? (
                <Button onClick={onClose} variant="primary">
                  Done
                </Button>
              )
            : (
                <>
                  <Button onClick={onClose} variant="secondary" disabled={isLoading}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCopy}
                    variant="primary"
                    disabled={isLoading || (!selectedTargetId && !error)}
                  >
                    {error
                      ? 'Try Again'
                      : isLoading
                        ? 'Copying...'
                        : 'Copy'}
                  </Button>
                </>
              )}
        </div>
      </div>
    </div>
  )
}
