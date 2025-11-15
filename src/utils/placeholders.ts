/**
 * Placeholder Utility Functions
 * Reference: US-PLACEHOLDER-001, US-PLACEHOLDER-004, US-PLACEHOLDER-005
 *
 * Provides functionality for dynamic placeholder replacement in outcome comments.
 *
 * Supported Placeholders:
 * - <first name> → Student's firstName
 * - <last name> → Student's lastName
 * - <grade> → Student's numeric grade
 *
 * Features:
 * - Case-insensitive matching
 * - Preserves text when student data is missing
 * - Handles special characters and Unicode in names
 * - Validates placeholder format
 */

// Placeholder regex patterns (case-insensitive)
const PLACEHOLDER_PATTERNS = {
  FIRST_NAME: /<first name>/gi,
  LAST_NAME: /<last name>/gi,
  GRADE: /<grade>/gi,
} as const

// Validation regex patterns
const VALIDATION_PATTERNS = {
  // Matches unclosed placeholders at end of text (avoids false positives on comparison operators)
  UNCLOSED_PLACEHOLDER: /<[a-zA-Z ][^>]*$/,
  EMPTY_PLACEHOLDER: /<>/,
} as const

// Validation warning messages
const VALIDATION_MESSAGES = {
  UNCLOSED: '⚠️ Placeholder not closed. Example: <first name>',
  EMPTY: '⚠️ Empty placeholder detected. Use: <first name>, <last name>, <grade>',
} as const

export interface StudentData {
  firstName?: string
  lastName?: string
  grade?: number | null
}

/**
 * Checks if a string value is valid (non-empty after trimming).
 *
 * @param value - The string value to check
 * @returns True if value is defined and non-empty after trimming
 */
function isValidString(value: string | undefined): boolean {
  return Boolean(value && value.trim())
}

/**
 * Checks if a grade value is valid (not null or undefined).
 * Note: 0 is a valid grade.
 *
 * @param grade - The grade value to check
 * @returns True if grade is not null and not undefined
 */
function isValidGrade(grade: number | null | undefined): boolean {
  return grade !== undefined && grade !== null
}

/**
 * Replaces placeholders in text with student-specific data.
 *
 * @param text - The text containing placeholders
 * @param studentData - Student data to use for replacement
 * @returns Text with placeholders replaced
 *
 * @example
 * replacePlaceholders('Hello, <first name>!', { firstName: 'Alice' })
 * // Returns: 'Hello, Alice!'
 */
export function replacePlaceholders(text: string, studentData: StudentData): string {
  let result = text

  // Replace <first name> (case-insensitive)
  if (isValidString(studentData.firstName)) {
    result = result.replace(PLACEHOLDER_PATTERNS.FIRST_NAME, studentData.firstName!)
  }

  // Replace <last name> (case-insensitive)
  if (isValidString(studentData.lastName)) {
    result = result.replace(PLACEHOLDER_PATTERNS.LAST_NAME, studentData.lastName!)
  }

  // Replace <grade> (case-insensitive)
  if (isValidGrade(studentData.grade)) {
    result = result.replace(PLACEHOLDER_PATTERNS.GRADE, studentData.grade!.toString())
  }

  return result
}

/**
 * Validates placeholders in text and returns warning messages.
 *
 * @param text - The text to validate
 * @returns Array of warning messages (empty if valid)
 *
 * @example
 * validatePlaceholders('<first name')
 * // Returns: ['⚠️ Placeholder not closed. Example: <first name>']
 */
export function validatePlaceholders(text: string): string[] {
  const warnings: string[] = []

  // Check for unclosed placeholders
  if (VALIDATION_PATTERNS.UNCLOSED_PLACEHOLDER.test(text)) {
    warnings.push(VALIDATION_MESSAGES.UNCLOSED)
  }

  // Check for empty placeholders
  if (text.includes('<>')) {
    warnings.push(VALIDATION_MESSAGES.EMPTY)
  }

  return warnings
}
