/**
 * BulkUploadModal Component
 * Story 1-8: Bulk Upload Personalized Comments
 *
 * Modal for uploading multiple personalized comments at once via paste-and-parse interface
 * Story 2: Modal with instructions and examples
 */

import { useState } from 'react'
import { spacing, typography, borders } from '../../theme/tokens'
import { useThemeColors } from '../../hooks/useThemeColors'
import { Button } from '../common/Button'
import { parseComments } from './parseComments'

interface BulkUploadModalProps {
  isOpen: boolean
  onClose: () => void
  subjectId: string
  onImport: (comments: Array<{ text: string; rating: number }>) => Promise<void>
}

export const BulkUploadModal = ({
  isOpen,
  onClose,
}: BulkUploadModalProps) => {
  const themeColors = useThemeColors()
  const [textareaValue, setTextareaValue] = useState('')
  const [validationError, setValidationError] = useState('')

  if (!isOpen) return null

  const handleImport = async () => {
    // Parse the comments
    const parsed = parseComments(textareaValue)

    // Validate that at least one comment was parsed
    if (parsed.length === 0) {
      setValidationError('Please paste at least one comment')
      return
    }

    // Clear validation error and call onImport
    setValidationError('')
    await onImport(parsed)

    // Clear textarea after successful import
    setTextareaValue('')
    onClose()
  }

  const exampleComments = [
    'excellent work on the assignment, 5',
    'needs more practice',
    'shows good effort, but needs revision, 4',
  ]

  return (
    <div
      role="dialog"
      aria-label="Bulk Upload Personalized Comments"
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: themeColors.background.primary,
        borderRadius: borders.radius.lg,
        padding: spacing['2xl'],
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        zIndex: 1000,
        minWidth: '600px',
        maxHeight: '90vh',
        overflowY: 'auto',
      }}
    >
      <h2
        style={{
          marginTop: 0,
          marginBottom: spacing.lg,
          fontSize: typography.fontSize.xl,
          fontWeight: typography.fontWeight.bold,
          color: themeColors.text.primary,
        }}
      >
        Bulk Upload Personalized Comments
      </h2>

      {/* Instructions */}
      <div style={{ marginBottom: spacing.lg }}>
        <h3
          style={{
            fontSize: typography.fontSize.base,
            fontWeight: typography.fontWeight.semibold,
            color: themeColors.text.primary,
            marginBottom: spacing.md,
          }}
        >
          Format Instructions
        </h3>
        <ul
          style={{
            fontSize: typography.fontSize.sm,
            color: themeColors.text.secondary,
            paddingLeft: spacing.lg,
            margin: `${spacing.sm} 0`,
            lineHeight: '1.6',
          }}
        >
          <li>Single comment per line</li>
          <li>Optional comma + rating (1-5) at end of line</li>
          <li>Default rating is 3 if omitted</li>
          <li>Commas within comment text are allowed (rating is last comma+digit)</li>
        </ul>
      </div>

      {/* Examples */}
      <div style={{ marginBottom: spacing.lg }}>
        <h3
          style={{
            fontSize: typography.fontSize.base,
            fontWeight: typography.fontWeight.semibold,
            color: themeColors.text.primary,
            marginBottom: spacing.md,
          }}
        >
          Examples
        </h3>
        <div
          style={{
            backgroundColor: themeColors.background.secondary,
            border: `${borders.width.thin} solid ${themeColors.border.default}`,
            borderRadius: borders.radius.md,
            padding: spacing.md,
            fontSize: typography.fontSize.sm,
            fontFamily: 'monospace',
            color: themeColors.text.primary,
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
          }}
        >
          {exampleComments.map((example, index) => (
            <div key={index}>{example}</div>
          ))}
        </div>
      </div>

      {/* Textarea */}
      <div style={{ marginBottom: spacing.lg }}>
        <label
          htmlFor="bulk-upload-textarea"
          style={{
            display: 'block',
            marginBottom: spacing.sm,
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.semibold,
            color: themeColors.text.primary,
          }}
        >
          Paste your comments here:
        </label>
        <textarea
          id="bulk-upload-textarea"
          value={textareaValue}
          onChange={(e) => setTextareaValue(e.target.value)}
          placeholder="Paste comments (one per line)..."
          rows={10}
          style={{
            width: '100%',
            padding: spacing.md,
            border: `${borders.width.thin} solid ${themeColors.border.default}`,
            borderRadius: borders.radius.md,
            fontSize: typography.fontSize.sm,
            fontFamily: 'monospace',
            resize: 'vertical',
            boxSizing: 'border-box',
          }}
        />
        {validationError && (
          <div
            role="alert"
            style={{
              marginTop: spacing.md,
              padding: spacing.md,
              backgroundColor: themeColors.semantic.errorLight,
              border: `${borders.width.thin} solid ${themeColors.semantic.error}`,
              borderRadius: borders.radius.md,
              color: themeColors.semantic.error,
              fontSize: typography.fontSize.sm,
            }}
          >
            {validationError}
          </div>
        )}
      </div>

      {/* Buttons */}
      <div
        style={{
          display: 'flex',
          gap: spacing.md,
          justifyContent: 'flex-end',
        }}
      >
        <Button
          onClick={onClose}
          variant="secondary"
        >
          Cancel
        </Button>
        <Button
          onClick={handleImport}
          variant="primary"
        >
          Import
        </Button>
      </div>
    </div>
  )
}
