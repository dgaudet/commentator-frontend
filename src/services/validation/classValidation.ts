/**
 * Class Validation Service
 * Provides client-side validation for class form data
 * Reference: TASK-2.2, US-CLASS-002, DES-11
 *
 * Business Rules:
 * - Class name: Required, 1-100 characters
 * - Academic year: Required, 2000-2099 range
 */

export interface ValidationError {
  field: string
  message: string
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
}

const CLASS_NAME_MIN_LENGTH = 1
const CLASS_NAME_MAX_LENGTH = 100
const YEAR_MIN = 2000
const YEAR_MAX = 2099

/**
 * Validate class name
 * Business Rules: Required, 1-100 characters
 *
 * @param name - Class name to validate
 * @returns ValidationError if invalid, null if valid
 */
export function validateClassName(name: string): ValidationError | null {
  if (!name || name.trim().length === 0) {
    return {
      field: 'name',
      message: 'Class name is required',
    }
  }

  if (name.length < CLASS_NAME_MIN_LENGTH || name.length > CLASS_NAME_MAX_LENGTH) {
    return {
      field: 'name',
      message: `Class name must be between ${CLASS_NAME_MIN_LENGTH} and ${CLASS_NAME_MAX_LENGTH} characters`,
    }
  }

  return null
}

/**
 * Validate academic year
 * Business Rules: Required, 2000-2099 range
 *
 * @param year - Academic year to validate (number or string)
 * @returns ValidationError if invalid, null if valid
 */
export function validateYear(year: number | string | null | undefined): ValidationError | null {
  if (year === null || year === undefined || year === '') {
    return {
      field: 'year',
      message: 'Academic year is required',
    }
  }

  const yearNum = typeof year === 'string' ? parseInt(year, 10) : year

  if (isNaN(yearNum)) {
    return {
      field: 'year',
      message: 'Academic year must be a valid number',
    }
  }

  if (yearNum < YEAR_MIN || yearNum > YEAR_MAX) {
    return {
      field: 'year',
      message: `Academic year must be between ${YEAR_MIN} and ${YEAR_MAX}`,
    }
  }

  return null
}

/**
 * Validate full class form data
 * Combines all validation rules
 *
 * @param data - Form data to validate
 * @returns ValidationResult with isValid flag and errors array
 */
export function validateClassForm(data: { name: string; year: number }): ValidationResult {
  const errors: ValidationError[] = []

  const nameError = validateClassName(data.name)
  if (nameError) errors.push(nameError)

  const yearError = validateYear(data.year)
  if (yearError) errors.push(yearError)

  return {
    isValid: errors.length === 0,
    errors,
  }
}
