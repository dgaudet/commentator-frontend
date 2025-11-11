/**
 * SubjectForm Component
 * Form for creating and editing subjects with client-side validation
 * Reference: US-REFACTOR-007, US-UI-001
 *
 * Key Change: Subject has no year field, so year input removed
 * Duplicate detection only checks name (not name+year combination)
 *
 * Performance: Uses useCallback for event handlers
 * UI Consistency: Uses design tokens for all styling (US-UI-001)
 */
import React, { useState, useEffect, useCallback } from 'react'
import { useSubjects } from '../../hooks/useSubjects'
import { validateSubjectForm } from '../../services/validation/subjectValidation'
import { Input } from '../common/Input'
import { Button } from '../common/Button'
import { ErrorMessage } from '../common/ErrorMessage'
import { colors, spacing, typography, borders, shadows } from '../../theme/tokens'
import type { Subject } from '../../types/Subject'

interface SubjectFormProps {
  existingSubject?: Subject
  onSuccess: (subjectItem: Subject) => void
  onCancel?: () => void // US-SUBJECT-CREATE-001: Cancel button in create mode only
}

interface FormData {
  name: string
}

interface FormErrors {
  name?: string
  duplicate?: string
  submit?: string
}

/**
 * Form component for creating and editing subjects
 * Handles validation, duplicate detection, and submission
 * User Stories: US-REFACTOR-007 (Refactor Subject Form Component)
 */
export const SubjectForm: React.FC<SubjectFormProps> = ({
  existingSubject,
  onSuccess,
  onCancel,
}) => {
  const { subjects, createSubject, updateSubject } = useSubjects()
  const [formData, setFormData] = useState<FormData>({
    name: existingSubject?.name || '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Update form when existingSubject changes
  useEffect(() => {
    if (existingSubject) {
      setFormData({
        name: existingSubject.name,
      })
    }
  }, [existingSubject])

  const isEditMode = !!existingSubject

  /**
   * Check for duplicate name (case-insensitive)
   */
  const checkDuplicate = useCallback((name: string): boolean => {
    return subjects.some(
      (s) =>
        s.name.toLowerCase() === name.toLowerCase() &&
        s.id !== existingSubject?.id,
    )
  }, [subjects, existingSubject?.id])

  /**
   * Validate form and check for duplicates
   */
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {}

    // Validate using service
    const validationResult = validateSubjectForm(formData)
    if (!validationResult.isValid) {
      validationResult.errors.forEach((error) => {
        if (error.field === 'name') {
          newErrors.name = error.message
        }
      })
    }

    // Check for duplicates (only name, no year)
    if (!newErrors.name) {
      if (checkDuplicate(formData.name)) {
        newErrors.duplicate = 'A subject with this name already exists'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData, checkDuplicate])

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form - this sets errors in state
    const isValid = validateForm()

    if (!isValid) {
      return
    }

    setIsSubmitting(true)

    try {
      let result: Subject

      if (isEditMode) {
        result = await updateSubject(existingSubject.id, formData)
      } else {
        result = await createSubject(formData)
      }

      onSuccess(result)
    } catch (error) {
      setErrors({
        submit: isEditMode ? 'Failed to update subject' : 'Failed to create subject',
      })
    } finally {
      setIsSubmitting(false)
    }
  }, [validateForm, isEditMode, updateSubject, existingSubject, formData, createSubject, onSuccess])

  /**
   * Handle input changes
   */
  const handleChange = useCallback((field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear errors for this field
    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[field as keyof FormErrors]
      delete newErrors.duplicate
      return newErrors
    })
  }, [])

  return (
    <div
      style={
        isEditMode
          ? {
              // Edit mode: Left-aligned, no card styling
              padding: '0',
              maxWidth: '500px',
            }
          : {
              // Create mode: Centered card with styling
              backgroundColor: colors.background.primary,
              borderRadius: borders.radius.md,
              boxShadow: shadows.md,
              padding: spacing['2xl'],
              maxWidth: '600px',
              margin: '0 auto',
            }
      }
    >
      <h2
        style={{
          fontSize: typography.fontSize.xl,
          fontWeight: typography.fontWeight.bold,
          color: colors.text.primary,
          marginBottom: spacing['2xl'],
        }}
      >
        {isEditMode ? 'Edit Subject' : 'Add New Subject'}
      </h2>

      {errors.submit && (
        <div style={{ marginBottom: spacing.lg }}>
          <ErrorMessage message={errors.submit} />
        </div>
      )}

      {errors.duplicate && (
        <div style={{ marginBottom: spacing.lg }}>
          <ErrorMessage message={errors.duplicate} />
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <Input
          id="subject-name"
          label="Subject Name"
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          error={errors.name}
          required
          disabled={isSubmitting}
          placeholder="e.g. Mathematics 101"
        />

        <div
          style={{
            marginTop: spacing.xl,
            ...(isEditMode
              ? {}
              : { display: 'flex', gap: spacing.lg }),
          }}
        >
          {isEditMode
            ? (
                <div style={{ width: '100%' }}>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                  >
                    Save Changes
                  </Button>
                </div>
              )
            : (
                <>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                  >
                    Create Subject
                  </Button>
                  {onCancel && (
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={onCancel}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                  )}
                </>
              )}
        </div>
      </form>
    </div>
  )
}
