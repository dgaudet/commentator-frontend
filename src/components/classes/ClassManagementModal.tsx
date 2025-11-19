/**
 * ClassManagementModal Component
 *
 * Modal for viewing, creating, editing, and deleting classes for a subject.
 * Uses a dropdown selector to choose which class to edit/delete.
 *
 * Generic Type Parameter:
 * - T extends { id: number; name: string } - Supports Subject type
 *
 * User Stories:
 * - US-CLASS-001: Navigate to Class Management
 * - US-CLASS-002: View classes in dropdown
 * - US-CLASS-003: Add new class
 * - US-CLASS-004: Edit existing class
 * - US-CLASS-005: Delete class with confirmation (US-DELETE-CONFIRM-003)
 * - US-CLASS-007: Close modal
 * - US-CLASS-TABS-001: Display tab group when class selected (TDD)
 *
 * US-DELETE-CONFIRM-003 Features:
 * - Uses standardized ConfirmationModal component
 * - Async check for final comments count before opening modal
 * - Cascading delete warning banner if class has final comments
 * - Shows class name and year in confirmation modal
 * - Enhanced error handling for final comments check
 */

import { useState, useEffect, useMemo, useCallback } from 'react'
import type { Class, CreateClassRequest, UpdateClassRequest, FinalComment, CreateFinalCommentRequest, UpdateFinalCommentRequest } from '../../types'
import { LoadingSpinner } from '../common/LoadingSpinner'
import { ErrorMessage } from '../common/ErrorMessage'
import { Button } from '../common/Button'
import { Input } from '../common/Input'
import { ConfirmationModal } from '../common/ConfirmationModal'
import { Tabs, Tab } from '../common/Tabs'
import { TabPanel } from '../common/TabPanel'
import { FinalCommentsModal } from '../finalComments/FinalCommentsModal'
import { spacing, typography, borders } from '../../theme/tokens'
import { useThemeColors } from '../../hooks/useThemeColors'

interface ClassManagementModalProps<T extends { id: number; name: string }> {
  isOpen: boolean
  entityData: T
  classes: Class[]
  onCreateClass: (request: CreateClassRequest) => Promise<void>
  onUpdateClass: (id: number, request: UpdateClassRequest) => Promise<void>
  onDeleteClass: (id: number) => Promise<void>
  onViewFinalComments?: (classData: Class) => void
  checkFinalCommentsCount?: (classId: number) => Promise<number>
  loading: boolean
  error: string | null
  // US-CLASS-TABS-003: Final Comments tab props
  finalComments?: FinalComment[]
  onCreateFinalComment?: (request: CreateFinalCommentRequest) => Promise<void>
  onUpdateFinalComment?: (id: number, request: UpdateFinalCommentRequest) => Promise<void>
  onDeleteFinalComment?: (id: number) => Promise<void>
  finalCommentsLoading?: boolean
  finalCommentsError?: string | null
}

export const ClassManagementModal = <T extends { id: number; name: string }>({
  isOpen,
  entityData,
  classes,
  onCreateClass,
  onUpdateClass,
  onDeleteClass,
  onViewFinalComments,
  checkFinalCommentsCount,
  loading,
  error,
  // US-CLASS-TABS-003: Final Comments tab props
  finalComments = [],
  onCreateFinalComment,
  onUpdateFinalComment,
  onDeleteFinalComment,
  finalCommentsLoading = false,
  finalCommentsError = null,
}: ClassManagementModalProps<T>) => {
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null)
  const [className, setClassName] = useState('')
  const [classYear, setClassYear] = useState(new Date().getFullYear())
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean
    classId: number | null
    className: string
    hasFinalComments: boolean
    finalCommentsCount: number
    checkFailed: boolean
  }>({
    isOpen: false,
    classId: null,
    className: '',
    hasFinalComments: false,
    finalCommentsCount: 0,
    checkFailed: false,
  })
  const [validationError, setValidationError] = useState('')
  const themeColors = useThemeColors()

  // US-CLASS-TABS-001: Tab group state management (TDD GREEN phase)
  // Track active tab state - default to 'edit-class'
  const [activeClassTab, setActiveClassTab] = useState<string>('edit-class')

  // Build tabs array for class management (only when class is selected)
  const classTabs = useMemo<Tab[]>(() => {
    if (!selectedClassId) return []

    const tabs: Tab[] = [
      { id: 'edit-class', label: 'Edit Class' },
    ]

    // Only show Final Comments tab if callback is provided
    if (onViewFinalComments) {
      tabs.push({ id: 'final-comments', label: 'Final Comments' })
    }

    return tabs
  }, [selectedClassId, onViewFinalComments])

  // Handle tab change
  const handleClassTabChange = useCallback((tabId: string) => {
    setActiveClassTab(tabId)

    // Trigger data loading for Final Comments tab
    if (tabId === 'final-comments' && selectedClassId && onViewFinalComments) {
      const selectedClass = classes.find(c => c.id === selectedClassId)
      if (selectedClass) {
        onViewFinalComments(selectedClass)
      }
    }
  }, [selectedClassId, onViewFinalComments, classes])

  // Update form when selected class changes
  useEffect(() => {
    if (selectedClassId) {
      const selectedClass = classes.find(c => c.id === selectedClassId)
      if (selectedClass) {
        setClassName(selectedClass.name)
        setClassYear(selectedClass.year)
      }
    } else {
      setClassName('')
      setClassYear(new Date().getFullYear())
    }
    setValidationError('')
  }, [selectedClassId, classes])

  // US-CLASS-TABS-001: Reset active tab to 'edit-class' when different class selected
  useEffect(() => {
    if (selectedClassId) {
      setActiveClassTab('edit-class')
    }
  }, [selectedClassId])

  if (!isOpen) return null

  const validateClass = (name: string, year: number): string | null => {
    const trimmed = name.trim()
    if (!trimmed) {
      return 'Class name is required'
    }
    if (trimmed.length > 100) {
      return 'Class name must be 100 characters or less'
    }
    if (year < 2000 || year > 2099) {
      return 'Year must be between 2000 and 2099'
    }
    return null
  }

  const handleCreateClass = async () => {
    const error = validateClass(className, classYear)
    if (error) {
      setValidationError(error)
      return
    }

    setValidationError('')
    try {
      await onCreateClass({
        subjectId: entityData.id,
        name: className.trim(),
        year: classYear,
      })
      setClassName('')
      setClassYear(new Date().getFullYear())
      setSelectedClassId(null)
    } catch (err) {
      // Error handled by parent component
    }
  }

  const handleUpdateClass = async () => {
    if (!selectedClassId) return

    const error = validateClass(className, classYear)
    if (error) {
      setValidationError(error)
      return
    }

    setValidationError('')
    try {
      await onUpdateClass(selectedClassId, {
        name: className.trim(),
        year: classYear,
      })
    } catch (err) {
      // Error handled by parent component
    }
  }

  const handleDeleteStart = async () => {
    if (selectedClassId) {
      const selectedClass = classes.find(c => c.id === selectedClassId)
      if (!selectedClass) return

      let finalCommentsCount = 0
      let checkFailed = false

      if (checkFinalCommentsCount) {
        try {
          // Check for final comments (US-DELETE-CONFIRM-003 AC1)
          finalCommentsCount = await checkFinalCommentsCount(selectedClassId)
        } catch (err) {
          // If check fails, still allow delete but warn user
          checkFailed = true
        }
      }

      setDeleteConfirmation({
        isOpen: true,
        classId: selectedClass.id,
        className: `${selectedClass.name} ${selectedClass.year}`,
        hasFinalComments: finalCommentsCount > 0,
        finalCommentsCount,
        checkFailed,
      })
    }
  }

  const handleDeleteConfirm = async () => {
    if (deleteConfirmation.classId) {
      try {
        await onDeleteClass(deleteConfirmation.classId)
        setDeleteConfirmation({
          isOpen: false,
          classId: null,
          className: '',
          hasFinalComments: false,
          finalCommentsCount: 0,
          checkFailed: false,
        })
        setSelectedClassId(null)
        setClassName('')
        setClassYear(new Date().getFullYear())
      } catch (err) {
        // Error handled by parent component
      }
    }
  }

  const handleDeleteCancel = () => {
    setDeleteConfirmation({
      isOpen: false,
      classId: null,
      className: '',
      hasFinalComments: false,
      finalCommentsCount: 0,
      checkFailed: false,
    })
  }

  const handleClassSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    if (value === '') {
      setSelectedClassId(null)
    } else {
      setSelectedClassId(Number(value))
    }
  }

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Class Management"
        style={{
          padding: spacing.xl,
          backgroundColor: themeColors.background.primary,
        }}
      >
          {loading && (
            <div className="loading-container">
              <LoadingSpinner data-testid="loading-spinner" />
            </div>
          )}

          {error && (
            <ErrorMessage message={error} />
          )}

          {!loading && !error && (
            <>
              {/* Class Dropdown Selector */}
              <div style={{ marginBottom: spacing['2xl'] }}>
                <h3
                  style={{
                    fontSize: typography.fontSize.lg,
                    fontWeight: typography.fontWeight.semibold,
                    color: themeColors.text.primary,
                    marginBottom: spacing.lg,
                  }}
                >
                  Select a Class
                </h3>
                {classes.length === 0
                  ? (
                      <div
                        style={{
                          textAlign: 'center',
                          padding: spacing['2xl'],
                          backgroundColor: themeColors.background.secondary,
                          borderRadius: borders.radius.md,
                          border: `${borders.width.thin} dashed ${themeColors.border.default}`,
                        }}
                      >
                        <p
                          style={{
                            margin: 0,
                            fontSize: typography.fontSize.base,
                            color: themeColors.text.tertiary,
                          }}
                        >
                          No classes yet
                        </p>
                        <p
                          style={{
                            margin: `${spacing.sm} 0 0`,
                            fontSize: typography.fontSize.sm,
                            color: themeColors.text.disabled,
                          }}
                        >
                          Add your first class below.
                        </p>
                      </div>
                    )
                  : (
                      <div style={{ marginBottom: spacing.lg }}>
                        <label
                          htmlFor="class-dropdown"
                          style={{
                            display: 'block',
                            marginBottom: spacing.sm,
                            fontSize: typography.fontSize.sm,
                            fontWeight: typography.fontWeight.medium,
                            color: themeColors.text.secondary,
                          }}
                        >
                          Select a class to edit or delete:
                        </label>
                        <select
                          id="class-dropdown"
                          value={selectedClassId || ''}
                          onChange={handleClassSelect}
                          aria-label="Select a class"
                          style={{
                            width: '100%',
                            padding: spacing.md,
                            fontSize: typography.fontSize.base,
                            border: `${borders.width.thin} solid ${themeColors.border.default}`,
                            borderRadius: borders.radius.md,
                            backgroundColor: themeColors.background.primary,
                            cursor: 'pointer',
                          }}
                        >
                          <option value="">-- Select a class --</option>
                          {classes.map((cls) => (
                            <option key={cls.id} value={cls.id}>
                              {cls.name} ({cls.year})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
              </div>

              {/* US-CLASS-TABS-001: Tab Group (when class selected) or Add New Class Form */}
              {selectedClassId && classTabs.length > 0
                ? (
                    /* Tab Group for Edit Class and Final Comments */
                    <>
                      <Tabs
                        tabs={classTabs}
                        defaultTab={activeClassTab}
                        onChange={handleClassTabChange}
                      />

                      {/* Edit Class Tab Panel */}
                      <TabPanel id="edit-class" activeTabId={activeClassTab} tabId="edit-class">
                        <div style={{ marginBottom: spacing['2xl'] }}>
                          <Input
                            id="class-name-input"
                            label="Class Name"
                            required
                            type="text"
                            value={className}
                            onChange={(e) => setClassName(e.target.value)}
                            placeholder="Enter class name (e.g., Advanced Section)"
                            maxLength={100}
                            error={validationError && !className.trim()}
                          />

                          <Input
                            id="class-year-input"
                            label="Year"
                            required
                            type="number"
                            value={classYear}
                            onChange={(e) => setClassYear(Number(e.target.value))}
                            min={2000}
                            max={2099}
                            error={validationError && (classYear < 2000 || classYear > 2099)}
                          />

                          {validationError && (
                            <div
                              role="alert"
                              style={{
                                padding: spacing.md,
                                marginBottom: spacing.lg,
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

                          <div
                            style={{
                              display: 'flex',
                              gap: spacing.sm,
                              flexWrap: 'wrap',
                            }}
                          >
                            <Button
                              onClick={handleUpdateClass}
                              variant="primary"
                            >
                              Update Class
                            </Button>
                            <Button
                              onClick={handleDeleteStart}
                              variant="danger"
                            >
                              Delete Class
                            </Button>
                          </div>
                        </div>
                      </TabPanel>

                      {/* Final Comments Tab Panel - US-CLASS-TABS-003 */}
                      <TabPanel id="final-comments" activeTabId={activeClassTab} tabId="final-comments">
                        {onCreateFinalComment && onUpdateFinalComment && onDeleteFinalComment
                          ? (
                              <FinalCommentsModal
                                isOpen={true}
                                entityData={classes.find(c => c.id === selectedClassId)!}
                                finalComments={finalComments}
                                onCreateComment={onCreateFinalComment}
                                onUpdateComment={onUpdateFinalComment}
                                onDeleteComment={onDeleteFinalComment}
                                loading={finalCommentsLoading}
                                error={finalCommentsError}
                                embedded={true}
                              />
                            )
                          : (
                              <div style={{ marginBottom: spacing['2xl'] }}>
                                <p>Final Comments functionality not available</p>
                              </div>
                            )}
                      </TabPanel>
                    </>
                  )
                : (
                    /* Add New Class Form (when no class selected) */
                    <div style={{ marginBottom: spacing['2xl'] }}>
                      <h3
                        style={{
                          fontSize: typography.fontSize.lg,
                          fontWeight: typography.fontWeight.semibold,
                          color: themeColors.text.primary,
                          marginBottom: spacing.lg,
                        }}
                      >
                        Add New Class
                      </h3>
                      <Input
                        id="class-name-input"
                        label="Class Name"
                        required
                        type="text"
                        value={className}
                        onChange={(e) => setClassName(e.target.value)}
                        placeholder="Enter class name (e.g., Advanced Section)"
                        maxLength={100}
                        error={validationError && !className.trim()}
                      />

                      <Input
                        id="class-year-input"
                        label="Year"
                        required
                        type="number"
                        value={classYear}
                        onChange={(e) => setClassYear(Number(e.target.value))}
                        min={2000}
                        max={2099}
                        error={validationError && (classYear < 2000 || classYear > 2099)}
                      />

                      {validationError && (
                        <div
                          role="alert"
                          style={{
                            padding: spacing.md,
                            marginBottom: spacing.lg,
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

                      <Button
                        onClick={handleCreateClass}
                        variant="primary"
                      >
                        Add Class
                      </Button>
                    </div>
                  )}
            </>
          )}
      </div>

      {/* Delete Confirmation Modal (US-DELETE-CONFIRM-003) */}
      <ConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        title="Delete Class"
        message="Are you sure you want to delete this class?"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        confirmButtonText="Delete"
        cancelButtonText="Cancel"
      >
        {/* US-TOKEN-011: Class name preview (migrated from styles['preview-text']) */}
        <p
          style={{
            fontSize: typography.fontSize.base,
            fontWeight: typography.fontWeight.medium,
            color: themeColors.text.primary,
            marginBottom: spacing.md,
            padding: spacing.md,
            backgroundColor: themeColors.background.secondary,
            borderRadius: borders.radius.sm,
          }}
        >
          {deleteConfirmation.className}
        </p>

        {/* Cascading Delete Warning (US-DELETE-CONFIRM-003 AC5) - migrated from styles['warning-banner'] + styles['warning-banner-yellow'] */}
        {deleteConfirmation.hasFinalComments && (
          <div
            style={{
              padding: spacing.md,
              marginTop: spacing.md,
              backgroundColor: '#FEF3C7',
              borderLeft: '4px solid #F59E0B',
              borderRadius: borders.radius.sm,
              color: '#92400E',
            }}
          >
            <p style={{ margin: 0 }}>
              ⚠️ This class has {deleteConfirmation.finalCommentsCount} final comment(s) that will also be deleted.
            </p>
          </div>
        )}

        {/* Error checking final comments - show warning - migrated from styles['warning-banner'] + styles['warning-banner-orange'] */}
        {deleteConfirmation.checkFailed && (
          <div
            style={{
              padding: spacing.md,
              marginTop: spacing.md,
              backgroundColor: '#FEED7D',
              borderLeft: '4px solid #F59E0B',
              borderRadius: borders.radius.sm,
              color: '#92400E',
            }}
          >
            <p style={{ margin: 0 }}>
              ⚠️ Unable to verify if this class has final comments. Deleting this class may also delete associated final comments.
            </p>
          </div>
        )}
      </ConfirmationModal>
    </>
  )
}
