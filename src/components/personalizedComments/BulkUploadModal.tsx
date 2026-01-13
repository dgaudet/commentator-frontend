/**
 * BulkUploadModal Component
 * Story 1-8: Bulk Upload Personalized Comments
 *
 * Modal for uploading multiple personalized comments at once via paste-and-parse interface
 * Story 2: Modal with instructions and examples
 * Story 5: Progress feedback and results display
 */

import { useState } from 'react'
import { spacing, typography, borders } from '../../theme/tokens'
import { useThemeColors } from '../../hooks/useThemeColors'
import { Button } from '../common/Button'
import { parseComments } from './parseComments'
import type { BulkSaveResult } from './bulkSaveComments'

interface BulkUploadModalProps {
  isOpen: boolean
  onClose: () => void
  subjectId: string
  onImport: (comments: Array<{ text: string; rating: number }>) => Promise<BulkSaveResult>
}

type ModalState = 'input' | 'progress' | 'results'

export const BulkUploadModal = ({
  isOpen,
  onClose,
  _subjectId,
  onImport,
}: BulkUploadModalProps) => {
  const themeColors = useThemeColors()
  const [textareaValue, setTextareaValue] = useState('')
  const [validationError, setValidationError] = useState('')
  const [modalState, setModalState] = useState<ModalState>('input')
  const [currentProgress, setCurrentProgress] = useState(0)
  const [totalComments, setTotalComments] = useState(0)
  const [importResults, setImportResults] = useState<BulkSaveResult | null>(null)

  if (!isOpen) return null

  const handleImport = async () => {
    // Parse the comments
    const parsed = parseComments(textareaValue)

    // Validate that at least one comment was parsed
    if (parsed.length === 0) {
      setValidationError('Please paste at least one comment')
      return
    }

    // Clear validation error and switch to progress state
    setValidationError('')
    setModalState('progress')
    setTotalComments(parsed.length)
    setCurrentProgress(0)

    // Call onImport with callback to track progress
    // Note: This is a simplified implementation. In Story 4-5, we'll integrate
    // the actual bulkSaveComments function that provides fine-grained progress
    try {
      const results = await onImport(parsed)
      setImportResults(results)
      setModalState('results')
    } catch (error) {
      setValidationError('Failed to import comments. Please try again.')
      setModalState('input')
    }
  }

  const handleDone = () => {
    setModalState('input')
    setTextareaValue('')
    setValidationError('')
    setImportResults(null)
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

      {/* INPUT STATE: Instructions, examples, and textarea */}
      {modalState === 'input' && (
        <>
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
        </>
      )}

      {/* PROGRESS STATE: Loading indicator */}
      {modalState === 'progress' && (
        <div style={{ textAlign: 'center', padding: spacing['2xl'] }}>
          <div
            role="progressbar"
            aria-valuenow={currentProgress}
            aria-valuemin={0}
            aria-valuemax={totalComments}
            style={{
              marginBottom: spacing.lg,
            }}
          >
            <div
              style={{
                fontSize: typography.fontSize.lg,
                fontWeight: typography.fontWeight.semibold,
                color: themeColors.text.primary,
                marginBottom: spacing.md,
              }}
            >
              Saving comment {currentProgress + 1} of {totalComments}...
            </div>
            <div
              style={{
                width: '100%',
                height: '8px',
                backgroundColor: themeColors.border.default,
                borderRadius: borders.radius.md,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  backgroundColor: themeColors.primary.main,
                  width: `${totalComments > 0 ? ((currentProgress + 1) / totalComments) * 100 : 0}%`,
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* RESULTS STATE: Import results and failed items */}
      {modalState === 'results' && importResults && (
        <>
          {/* Results Summary */}
          <div
            role="alert"
            style={{
              marginBottom: spacing.lg,
              padding: spacing.lg,
              backgroundColor:
                importResults.failed.length === 0
                  ? themeColors.semantic.successLight
                  : themeColors.semantic.warningLight,
              border: `${borders.width.thin} solid ${importResults.failed.length === 0 ? themeColors.semantic.success : themeColors.semantic.warning}`,
              borderRadius: borders.radius.md,
              color: importResults.failed.length === 0 ? themeColors.semantic.success : themeColors.semantic.warning,
            }}
          >
            <div style={{ marginBottom: spacing.sm }}>
              ✅ Successfully imported {importResults.successful.length} comment
              {importResults.successful.length !== 1 ? 's' : ''}
            </div>
            {importResults.failed.length > 0 && (
              <div>
                ⚠️ {importResults.failed.length} comment(s) failed to save
              </div>
            )}
          </div>

          {/* Failed Items Section */}
          {importResults.failed.length > 0 && (
            <div style={{ marginBottom: spacing.lg }}>
              <h3
                style={{
                  fontSize: typography.fontSize.base,
                  fontWeight: typography.fontWeight.semibold,
                  color: themeColors.semantic.warning,
                  marginBottom: spacing.md,
                }}
              >
                Failed Comments
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                {importResults.failed.map((failed) => (
                  <div
                    key={`${failed.lineNumber}-${failed.originalText}`}
                    style={{
                      padding: spacing.md,
                      border: `${borders.width.thin} solid ${themeColors.semantic.warning}`,
                      borderRadius: borders.radius.md,
                      backgroundColor: themeColors.semantic.warningLight,
                    }}
                  >
                    <div
                      style={{
                        fontWeight: typography.fontWeight.semibold,
                        color: themeColors.semantic.warning,
                        marginBottom: spacing.sm,
                      }}
                    >
                      Line {failed.lineNumber}:
                    </div>
                    <div
                      style={{
                        fontFamily: 'monospace',
                        fontSize: typography.fontSize.sm,
                        backgroundColor: themeColors.background.primary,
                        padding: spacing.sm,
                        borderRadius: borders.radius.sm,
                        marginBottom: spacing.sm,
                        color: themeColors.text.primary,
                        wordBreak: 'break-word',
                      }}
                    >
                      {failed.originalText}
                    </div>
                    <div
                      style={{
                        fontSize: typography.fontSize.sm,
                        color: themeColors.semantic.warning,
                      }}
                    >
                      Error: {failed.reason}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Done Button */}
          <div
            style={{
              display: 'flex',
              gap: spacing.md,
              justifyContent: 'flex-end',
            }}
          >
            <Button
              onClick={handleDone}
              variant="primary"
            >
              Done
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
