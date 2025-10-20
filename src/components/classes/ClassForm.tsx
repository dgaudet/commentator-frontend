/**
 * ClassForm Component
 * Form for creating and editing classes with client-side validation
 * Reference: TASK-4.5, US-CLASS-002, US-CLASS-003, DES-3, DES-4
 */
import React, { useState, useEffect } from 'react'
import { useClasses } from '../../hooks/useClasses'
import { validateClassForm } from '../../services/validation/classValidation'
import { Input } from '../common/Input'
import { Button } from '../common/Button'
import { ErrorMessage } from '../common/ErrorMessage'
import type { Class } from '../../types/Class'

interface ClassFormProps {
  existingClass?: Class
  onSuccess: (classItem: Class) => void
  onCancel: () => void
}

interface FormData {
  name: string
  year: number
}

interface FormErrors {
  name?: string
  year?: string
  duplicate?: string
  submit?: string
}

/**
 * Form component for creating and editing classes
 * Handles validation, duplicate detection, and submission
 * User Stories: US-CLASS-002 (Add New Class), US-CLASS-003 (Edit Class)
 */
export const ClassForm: React.FC<ClassFormProps> = ({
  existingClass,
  onSuccess,
  onCancel,
}) => {
  const { classes, createClass, updateClass } = useClasses()
  const [formData, setFormData] = useState<FormData>({
    name: existingClass?.name || '',
    year: existingClass?.year || new Date().getFullYear(),
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Update form when existingClass changes
  useEffect(() => {
    if (existingClass) {
      setFormData({
        name: existingClass.name,
        year: existingClass.year,
      })
    }
  }, [existingClass])

  const isEditMode = !!existingClass

  /**
   * Check for duplicate name+year combination
   */
  const checkDuplicate = (name: string, year: number): boolean => {
    return classes.some(
      (c) =>
        c.name.toLowerCase() === name.toLowerCase() &&
        c.year === year &&
        c.id !== existingClass?.id,
    )
  }

  /**
   * Validate form and check for duplicates
   */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Validate using service
    const validationResult = validateClassForm(formData)
    if (!validationResult.isValid) {
      validationResult.errors.forEach((error) => {
        if (error.field === 'name') {
          newErrors.name = error.message
        } else if (error.field === 'year') {
          newErrors.year = error.message
        }
      })
    }

    // Check for duplicates
    if (!newErrors.name && !newErrors.year) {
      if (checkDuplicate(formData.name, formData.year)) {
        newErrors.duplicate = 'A class with this name and year already exists'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form - this sets errors in state
    const isValid = validateForm()

    if (!isValid) {
      return
    }

    setIsSubmitting(true)

    try {
      let result: Class

      if (isEditMode) {
        result = await updateClass(existingClass.id, formData)
      } else {
        result = await createClass(formData)
      }

      onSuccess(result)
    } catch (error) {
      setErrors({
        submit: isEditMode ? 'Failed to update class' : 'Failed to create class',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * Handle input changes
   */
  const handleChange = (field: keyof FormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear errors for this field
    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[field as keyof FormErrors]
      delete newErrors.duplicate
      return newErrors
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {isEditMode ? 'Edit Class' : 'Add New Class'}
      </h2>

      {errors.submit && (
        <div className="mb-4">
          <ErrorMessage message={errors.submit} />
        </div>
      )}

      {errors.duplicate && (
        <div className="mb-4">
          <ErrorMessage message={errors.duplicate} />
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <Input
          id="class-name"
          label="Class Name"
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          error={errors.name}
          required
          disabled={isSubmitting}
          placeholder="e.g. Mathematics 101"
        />

        <Input
          id="class-year"
          label="Year"
          type="number"
          value={formData.year}
          onChange={(e) => handleChange('year', parseInt(e.target.value, 10))}
          error={errors.year}
          required
          disabled={isSubmitting}
          min={2000}
          max={2099}
        />

        <div className="flex gap-3 mt-6">
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            className="flex-1"
          >
            {isEditMode ? 'Save Changes' : 'Create Class'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
