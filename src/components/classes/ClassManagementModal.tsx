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
 *
 * US-DELETE-CONFIRM-003 Features:
 * - Uses standardized ConfirmationModal component
 * - Async check for final comments count before opening modal
 * - Cascading delete warning banner if class has final comments
 * - Shows class name and year in confirmation modal
 * - Enhanced error handling for final comments check
 */

import { useState, useEffect } from 'react'
import type { Class, CreateClassRequest, UpdateClassRequest } from '../../types'
import { LoadingSpinner } from '../common/LoadingSpinner'
import { ErrorMessage } from '../common/ErrorMessage'
import { Button } from '../common/Button'
import { ConfirmationModal } from '../common/ConfirmationModal'
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
}

export const ClassManagementModal = <T extends { id: number; name: string }>({
  isOpen,
  onClose,
  entityData,
  classes,
  onCreateClass,
  onUpdateClass,
  onDeleteClass,
  onViewFinalComments,
  checkFinalCommentsCount,
  loading,
  error,
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
  const [isEditMode, setIsEditMode] = useState(false)

  // Update form when selected class changes
  useEffect(() => {
    if (selectedClassId) {
      const selectedClass = classes.find(c => c.id === selectedClassId)
      if (selectedClass) {
        setClassName(selectedClass.name)
        setClassYear(selectedClass.year)
        setIsEditMode(true)
      }
    } else {
      setClassName('')
      setClassYear(new Date().getFullYear())
      setIsEditMode(false)
    }
    setValidationError('')
  }, [selectedClassId, classes])

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
        style={{
          padding: '1.5rem',
          backgroundColor: '#FFFFFF',
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
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', marginBottom: '1rem' }}>
                  Select a Class
                </h3>
                {classes.length === 0
                  ? (
                      <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: '#F9FAFB', borderRadius: '8px', border: '1px dashed #E5E7EB' }}>
                        <p style={{ margin: 0, fontSize: '1rem', color: '#6B7280' }}>No classes yet</p>
                        <p style={{ margin: '0.5rem 0 0', fontSize: '0.875rem', color: '#9CA3AF' }}>
                          Add your first class below.
                        </p>
                      </div>
                    )
                  : (
                      <div style={{ marginBottom: '1rem' }}>
                        <label htmlFor="class-dropdown" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                          Select a class to edit or delete:
                        </label>
                        <select
                          id="class-dropdown"
                          value={selectedClassId || ''}
                          onChange={handleClassSelect}
                          aria-label="Select a class"
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            fontSize: '1rem',
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px',
                            backgroundColor: '#FFFFFF',
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

              {/* Create/Edit Class Form */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', marginBottom: '1rem' }}>
                  {isEditMode ? 'Edit Class' : 'Add New Class'}
                </h3>
                <div style={{ marginBottom: '1rem' }}>
                  <label htmlFor="class-name-input" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                    Class Name <span style={{ color: '#DC2626' }}>*</span>
                  </label>
                  <input
                    id="class-name-input"
                    type="text"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    placeholder="Enter class name (e.g., Advanced Section)"
                    aria-label="Class Name"
                    maxLength={100}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      fontSize: '1rem',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label htmlFor="class-year-input" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                    Year <span style={{ color: '#DC2626' }}>*</span>
                  </label>
                  <input
                    id="class-year-input"
                    type="number"
                    value={classYear}
                    onChange={(e) => setClassYear(Number(e.target.value))}
                    min={2000}
                    max={2099}
                    aria-label="Year"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      fontSize: '1rem',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                    }}
                  />
                </div>

                {validationError && (
                  <div role="alert" style={{ padding: '0.75rem', marginBottom: '1rem', backgroundColor: '#FEE2E2', border: '1px solid #DC2626', borderRadius: '8px', color: '#DC2626', fontSize: '0.875rem' }}>
                    {validationError}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {isEditMode
                    ? (
                        <>
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
                          {onViewFinalComments && selectedClassId && (
                            <Button
                              onClick={() => {
                                const selectedClass = classes.find(c => c.id === selectedClassId)
                                if (selectedClass) {
                                  onViewFinalComments(selectedClass)
                                }
                              }}
                              variant="secondary"
                            >
                              Final Comments
                            </Button>
                          )}
                        </>
                      )
                    : (
                        <Button
                          onClick={handleCreateClass}
                          variant="primary"
                        >
                          Add Class
                        </Button>
                      )}
                </div>
              </div>
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
