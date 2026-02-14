/**
 * User Validators
 * Reference: US-UR-002, US-UR-003, US-UR-004
 *
 * Validation functions for user registration fields:
 * - First Name validation (required, max length, special characters)
 * - Last Name validation (required, max length, special characters)
 * - Email validation (required, valid format)
 * - Password validation (8+ chars, uppercase, lowercase, number)
 * - Password match validation (confirmation field)
 */

// Validation constants
const MAX_NAME_LENGTH = 100
const MIN_PASSWORD_LENGTH = 8
const MAX_PASSWORD_LENGTH = 128
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Validates first name
 * @param value - The first name to validate
 * @returns Error message if invalid, undefined if valid
 */
export function validateFirstName(value: string): string | undefined {
  const trimmed = value.trim()

  if (!trimmed) {
    return 'First name is required'
  }

  if (trimmed.length > MAX_NAME_LENGTH) {
    return 'First name must not exceed 100 characters'
  }

  return undefined
}

/**
 * Validates last name
 * @param value - The last name to validate
 * @returns Error message if invalid, undefined if valid
 */
export function validateLastName(value: string): string | undefined {
  const trimmed = value.trim()

  if (!trimmed) {
    return 'Last name is required'
  }

  if (trimmed.length > MAX_NAME_LENGTH) {
    return 'Last name must not exceed 100 characters'
  }

  return undefined
}

/**
 * Validates email address
 * Accepts basic email format: local-part@domain.extension
 * @param value - The email to validate
 * @returns Error message if invalid, undefined if valid
 */
export function validateEmail(value: string): string | undefined {
  const trimmed = value.trim()

  if (!trimmed) {
    return 'Email is required'
  }

  if (!EMAIL_REGEX.test(trimmed)) {
    return 'Please enter a valid email address'
  }

  return undefined
}

/**
 * Validates password strength
 * Requirements:
 * - 8-128 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character (!@#$%^&*)
 * @param value - The password to validate
 * @returns Error message if invalid, undefined if valid
 */
export function validatePassword(value: string): string | undefined {
  const trimmed = value.trim()

  if (!trimmed) {
    return 'Password is required'
  }

  if (trimmed.length > MAX_PASSWORD_LENGTH) {
    return 'Password must not exceed 128 characters'
  }

  const requirements: string[] = []

  if (trimmed.length < MIN_PASSWORD_LENGTH) {
    requirements.push('at least 8 characters')
  }

  if (!/[A-Z]/.test(trimmed)) {
    requirements.push('an uppercase letter')
  }

  if (!/[a-z]/.test(trimmed)) {
    requirements.push('a lowercase letter')
  }

  if (!/\d/.test(trimmed)) {
    requirements.push('a number')
  }

  if (!/[!@#$%^&*]/.test(trimmed)) {
    requirements.push('a special character (!@#$%^&*)')
  }

  if (requirements.length > 0) {
    return `Password must contain ${requirements.join(', ')}`
  }

  return undefined
}

/**
 * Validates that password and confirmation password match
 * Comparison is case-sensitive
 * @param password - The password
 * @param confirmPassword - The confirmation password
 * @returns Error message if invalid, undefined if valid
 */
export function validatePasswordMatch(
  password: string,
  confirmPassword: string,
): string | undefined {
  if (!password || !confirmPassword) {
    return 'Both password fields are required'
  }

  if (password !== confirmPassword) {
    return 'Passwords do not match'
  }

  return undefined
}
