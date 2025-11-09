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
import { ConfirmationModal } from '../common/ConfirmationModal'
import { Tabs, Tab } from '../common/Tabs'
import { TabPanel } from '../common/TabPanel'
import { FinalCommentsModal } from '../finalComments/FinalCommentsModal'
import { modalStyles } from '../../styles/modalStyles'
import styles from '../common/ConfirmationModal.module.css'

interface ClassManagementModalProps<T extends { id: number; name: string }> {
  isOpen: boolean
  onClose: () => void
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
  onClose: _onClose,
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
        style={modalStyles.container}
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
              <div style={modalStyles.section}>
                <h3 style={modalStyles.heading}>
                  Select a Class
                </h3>
                {classes.length === 0
                  ? (
                      <div style={modalStyles.emptyState}>
                        <p style={modalStyles.emptyStateText}>No classes yet</p>
                        <p style={modalStyles.emptyStateSubtext}>
                          Add your first class below.
                        </p>
                      </div>
                    )
                  : (
                      <div style={modalStyles.formGroup}>
                        <label htmlFor="class-dropdown" style={modalStyles.label}>
                          Select a class to edit or delete:
                        </label>
                        <select
                          id="class-dropdown"
                          value={selectedClassId || ''}
                          onChange={handleClassSelect}
                          aria-label="Select a class"
                          style={modalStyles.select}
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
                        <div style={modalStyles.section}>
                          <div style={modalStyles.formGroup}>
                            <label htmlFor="class-name-input" style={modalStyles.label}>
                              Class Name <span style={modalStyles.requiredIndicator}>*</span>
                            </label>
                            <input
                              id="class-name-input"
                              type="text"
                              value={className}
                              onChange={(e) => setClassName(e.target.value)}
                              placeholder="Enter class name (e.g., Advanced Section)"
                              aria-label="Class Name"
                              maxLength={100}
                              style={modalStyles.input}
                            />
                          </div>

                          <div style={modalStyles.formGroup}>
                            <label htmlFor="class-year-input" style={modalStyles.label}>
                              Year <span style={modalStyles.requiredIndicator}>*</span>
                            </label>
                            <input
                              id="class-year-input"
                              type="number"
                              value={classYear}
                              onChange={(e) => setClassYear(Number(e.target.value))}
                              min={2000}
                              max={2099}
                              aria-label="Year"
                              style={modalStyles.input}
                            />
                          </div>

                          {validationError && (
                            <div role="alert" style={modalStyles.validationError}>
                              {validationError}
                            </div>
                          )}

                          <div style={modalStyles.buttonGroupWrap}>
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
                        {selectedClassId && onCreateFinalComment && onUpdateFinalComment && onDeleteFinalComment
                          ? (
                              <FinalCommentsModal
                                isOpen={true}
                                onClose={() => {}}
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
                              <div style={modalStyles.section}>
                                <p>Final Comments functionality not available</p>
                              </div>
                            )}
                      </TabPanel>
                    </>
                  )
                : (
                    /* Add New Class Form (when no class selected) */
                    <div style={modalStyles.section}>
                      <h3 style={modalStyles.heading}>
                        Add New Class
                      </h3>
                      <div style={modalStyles.formGroup}>
                        <label htmlFor="class-name-input" style={modalStyles.label}>
                          Class Name <span style={modalStyles.requiredIndicator}>*</span>
                        </label>
                        <input
                          id="class-name-input"
                          type="text"
                          value={className}
                          onChange={(e) => setClassName(e.target.value)}
                          placeholder="Enter class name (e.g., Advanced Section)"
                          aria-label="Class Name"
                          maxLength={100}
                          style={modalStyles.input}
                        />
                      </div>

                      <div style={modalStyles.formGroup}>
                        <label htmlFor="class-year-input" style={modalStyles.label}>
                          Year <span style={modalStyles.requiredIndicator}>*</span>
                        </label>
                        <input
                          id="class-year-input"
                          type="number"
                          value={classYear}
                          onChange={(e) => setClassYear(Number(e.target.value))}
                          min={2000}
                          max={2099}
                          aria-label="Year"
                          style={modalStyles.input}
                        />
                      </div>

                      {validationError && (
                        <div role="alert" style={modalStyles.validationError}>
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
        <p className={styles['preview-text']}>
          {deleteConfirmation.className}
        </p>

        {/* Cascading Delete Warning (US-DELETE-CONFIRM-003 AC5) */}
        {deleteConfirmation.hasFinalComments && (
          <div className={`${styles['warning-banner']} ${styles['warning-banner-yellow']}`}>
            <p>
              ⚠️ This class has {deleteConfirmation.finalCommentsCount} final comment(s) that will also be deleted.
            </p>
          </div>
        )}

        {/* Error checking final comments - show warning */}
        {deleteConfirmation.checkFailed && (
          <div className={`${styles['warning-banner']} ${styles['warning-banner-orange']}`}>
            <p>
              ⚠️ Unable to verify if this class has final comments. Deleting this class may also delete associated final comments.
            </p>
          </div>
        )}
      </ConfirmationModal>
    </>
  )
}
