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

import { spacing, typography, borders } from '../../theme/tokens'
import { useThemeColors } from '../../hooks/useThemeColors'
import { Button } from '../common/Button'

interface CopyCommentsModalProps {
  isOpen: boolean
  onClose: () => void
  sourceSubjectId: string
  sourceSubjectName: string
}

export const CopyCommentsModal: React.FC<CopyCommentsModalProps> = ({
  isOpen,
  onClose,
  _sourceSubjectId,
  sourceSubjectName,
}) => {
  const themeColors = useThemeColors()

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
              fontSize: typography.fontSize.md,
              color: themeColors.text.primary,
              fontWeight: typography.fontWeight.semibold,
              margin: 0,
            }}
          >
            {sourceSubjectName}
          </p>
        </div>

        {/* Copy To field placeholder (AC-2.2, AC-2.3) */}
        <div style={{ marginBottom: spacing.lg }}>
          <label
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
          <p
            style={{
              fontSize: typography.fontSize.sm,
              color: themeColors.text.secondary,
              margin: 0,
            }}
          >
            Target subject selection will appear here
          </p>
        </div>

        {/* Modal Footer */}
        <div
          style={{
            display: 'flex',
            gap: spacing.md,
            justifyContent: 'flex-end',
            marginTop: spacing.xl,
          }}
        >
          <Button onClick={onClose} variant="secondary">
            Cancel
          </Button>
          <Button onClick={() => {}} variant="primary" disabled>
            Copy
          </Button>
        </div>
      </div>
    </div>
  )
}
