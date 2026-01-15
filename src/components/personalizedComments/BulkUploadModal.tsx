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
import { usePronounsQuery } from '../../hooks/usePronounsQuery'
import { Button } from '../common/Button'
import { parseComments } from './parseComments'
import { replacePronounsWithPlaceholders } from '../../utils/pronouns'
import type { BulkSaveResult } from './bulkSaveComments'

interface BulkUploadModalProps {
  isOpen: boolean
  onClose: () => void
  subjectId: string
  onImport: (comments: Array<{ text: string; rating: number }>, onProgress?: (current: number) => void) => Promise<BulkSaveResult>
}

type ModalState = 'input' | 'progress' | 'results'

export const BulkUploadModal = ({
  isOpen,
  onClose,
  subjectId: _subjectId,
  onImport,
}: BulkUploadModalProps) => {
  const themeColors = useThemeColors()
  const { pronouns, loading: pronounsLoading, error: pronounsError } = usePronounsQuery()
  const [textareaValue, setTextareaValue] = useState('')
  const [validationError, setValidationError] = useState('')
  const [modalState, setModalState] = useState<ModalState>('input')
  const [currentProgress, setCurrentProgress] = useState(0)
  const [totalComments, setTotalComments] = useState(0)
  const [importResults, setImportResults] = useState<BulkSaveResult | null>(null)
  const [replacePronounsLoading, setReplacePronounsLoading] = useState(false)
  const [replacePronounsMessage, setReplacePronounsMessage] = useState<{
    type: 'success' | 'error' | 'info'
    text: string
  } | null>(null)

  if (!isOpen) return null

  const handleReplacePronounsClick = async () => {
    // Clear previous messages
    setReplacePronounsMessage(null)

    // Check if textarea is empty
    if (!textareaValue.trim()) {
      setReplacePronounsMessage({
        type: 'info',
        text: 'Please enter text first',
      })
      return
    }

    // Set loading state
    setReplacePronounsLoading(true)

    try {
      // Replace pronouns using the utility function
      const result = replacePronounsWithPlaceholders(textareaValue, pronouns)

      // Update textarea with replaced text
      setTextareaValue(result.replacedText)

      // Show success message with count
      const { pronoun: pronounCount, possessivePronoun: possessiveCount } =
        result.replacementCount
      const totalReplacements = pronounCount + possessiveCount

      if (totalReplacements === 0) {
        setReplacePronounsMessage({
          type: 'info',
          text: 'No pronouns found in text',
        })
      } else {
        setReplacePronounsMessage({
          type: 'success',
          text: `Replaced ${totalReplacements} pronouns (${pronounCount} subject, ${possessiveCount} possessive)`,
        })
      }
    } catch (error) {
      setReplacePronounsMessage({
        type: 'error',
        text: 'Failed to replace pronouns. Please try again.',
      })
    } finally {
      setReplacePronounsLoading(false)
    }
  }

  /**
   * Get message box styling based on message type
   */
  const getMessageBoxStyle = (type: string) => {
    const baseStyle = {
      marginTop: spacing.md,
      padding: spacing.md,
      borderRadius: borders.radius.md,
      fontSize: typography.fontSize.sm,
      border: `${borders.width.thin} solid`,
    }

    if (type === 'success') {
      return {
        ...baseStyle,
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderColor: '#22c55e',
        color: '#22c55e',
      }
    }

    if (type === 'error') {
      return {
        ...baseStyle,
        backgroundColor: themeColors.semantic.errorLight,
        borderColor: themeColors.semantic.error,
        color: themeColors.semantic.error,
      }
    }

    // info
    return {
      ...baseStyle,
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderColor: '#3b82f6',
      color: '#3b82f6',
    }
  }

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

    // Call onImport with progress callback to track real-time progress
    try {
      const results = await onImport(parsed, (current) => {
        setCurrentProgress(current)
      })
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
    <>
      {/* Backdrop overlay - blocks interactions with content behind modal */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 999,
        }}
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Modal dialog */}
      <div
        role="dialog"
        aria-modal="true"
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
                backgroundColor: themeColors.background.primary,
                border: `${borders.width.thin} solid ${themeColors.border.default}`,
                borderRadius: borders.radius.md,
                fontSize: typography.fontSize.sm,
                fontFamily: 'monospace',
                resize: 'vertical',
                boxSizing: 'border-box',
                color: themeColors.text.primary,
              }}
            />

            {/* Replace Pronouns Button */}
            {!pronounsError && (
              <div style={{ marginTop: spacing.md, marginBottom: spacing.md }}>
                <Button
                  onClick={handleReplacePronounsClick}
                  disabled={replacePronounsLoading || pronounsLoading || pronouns.length === 0}
                  variant="secondary"
                  title={
                    pronounsLoading
                      ? 'Loading pronouns...'
                      : pronouns.length === 0
                        ? 'No pronouns configured'
                        : 'Replace pronouns with placeholders'
                  }
                >
                  {replacePronounsLoading ? 'Replacing...' : 'Replace Pronouns with Placeholders'}
                </Button>
              </div>
            )}

            {/* Replace Pronouns Message */}
            {replacePronounsMessage && (
              <div
                role={replacePronounsMessage.type === 'error' ? 'alert' : undefined}
                style={getMessageBoxStyle(replacePronounsMessage.type)}
              >
                {replacePronounsMessage.text}
              </div>
            )}

            {/* Validation Error */}
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
              backgroundColor: themeColors.background.secondary,
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
    </>
  )
}
