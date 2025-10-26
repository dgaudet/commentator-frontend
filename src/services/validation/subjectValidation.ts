/**
 * Subject Validation Service
 * Provides client-side validation for subject form data
 *
 * Business Rules:
 * - Subject name: Required, 1-100 characters
 * - No year validation (Subject entity has no year field)
 *
 * API Change: Subject only has name field (year removed)
 */

export interface ValidationError {
  field: string
  message: string
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
}

const SUBJECT_NAME_MIN_LENGTH = 1
const SUBJECT_NAME_MAX_LENGTH = 100

/**
 * Validate subject name
 * Business Rules: Required, 1-100 characters
 *
 * @param name - Subject name to validate
 * @returns ValidationError if invalid, null if valid
 */
export function validateSubjectName(name: string | null | undefined): ValidationError | null {
  if (!name || name.trim().length === 0) {
    return {
      field: 'name',
      message: 'Subject name is required',
    }
  }

  if (name.length < SUBJECT_NAME_MIN_LENGTH || name.length > SUBJECT_NAME_MAX_LENGTH) {
    return {
      field: 'name',
      message: `Subject name must be between ${SUBJECT_NAME_MIN_LENGTH} and ${SUBJECT_NAME_MAX_LENGTH} characters`,
    }
  }

  return null
}

/**
 * Validate full subject form data
 * Only validates name (no year field in Subject entity)
 *
 * @param data - Form data to validate {name}
 * @returns ValidationResult with isValid flag and errors array
 */
export function validateSubjectForm(data: { name: string }): ValidationResult {
  const errors: ValidationError[] = []

  const nameError = validateSubjectName(data.name)
  if (nameError) errors.push(nameError)

  return {
    isValid: errors.length === 0,
    errors,
  }
}
