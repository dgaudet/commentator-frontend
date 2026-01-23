/**
 * Placeholder Utility Functions
 * Reference: US-PLACEHOLDER-001, US-PLACEHOLDER-004, US-PLACEHOLDER-005
 * TASK-1.1, TASK-1.2, TASK-1.3, TASK-1.4: Pronoun support
 *
 * Provides functionality for dynamic placeholder replacement in outcome comments.
 *
 * Supported Placeholders:
 * - <first name> → Student's firstName
 * - <last name> → Student's lastName
 * - <grade> → Student's numeric grade
 * - <pronoun> → Student's pronoun (e.g., he, she, they)
 * - <possessive pronoun> → Student's possessive pronoun (e.g., his, her, their)
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
  PRONOUN: /<pronoun>/gi,
  POSSESSIVE_PRONOUN: /<possessive pronoun>/gi,
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
  EMPTY: '⚠️ Empty placeholder detected. Use: <first name>, <last name>, <grade>, <pronoun>, <possessive pronoun>',
} as const

export interface StudentData {
  firstName?: string
  lastName?: string
  grade?: number | null
  pronoun?: string
  possessivePronoun?: string
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
 * Checks if a position in the text is at the start of a sentence.
 *
 * A position is at sentence start if:
 * - It's at the very beginning of the text (position === 0), OR
 * - It's immediately after a sentence-ending punctuation mark (., !, ?)
 *   with optional whitespace (spaces, tabs, newlines) between them
 *
 * This function is used for smart pronoun capitalization during placeholder
 * replacement. For example:
 * - "she is smart" → "She is smart" (at text start)
 * - "She is smart. she helps others" → "She is smart. She helps others" (after period)
 * - "You all participated! they contributed" → "You all participated! They contributed" (after exclamation)
 *
 * Implementation Notes:
 * - Whitespace between punctuation and placeholder is ignored
 * - Single periods are treated as sentence enders
 * - Ellipsis (...) is treated as a sentence ender
 * - Skips backward through whitespace to find the preceding non-whitespace character
 *
 * @param text - The text to check
 * @param position - The position of the placeholder in the text
 * @returns True if position is at the start of text or after sentence-ending punctuation
 */
function isAtSentenceStart(text: string, position: number): boolean {
  // Check if at the beginning of text
  if (position === 0) {
    return true
  }

  // Look backwards from position to find first non-whitespace character
  let i = position - 1
  while (i >= 0 && /\s/.test(text[i])) {
    i--
  }

  // If only whitespace before position, treat as sentence start
  if (i < 0) {
    return true
  }

  // Check if the character at i is a sentence ender
  const char = text[i]
  if (char === '.' || char === '!' || char === '?') {
    // All sentence enders trigger capitalization
    // Single periods, ellipsis, and other punctuation all work
    return true
  }

  return false
}

/**
 * Capitalizes the first character of a string using toUpperCase().
 *
 * Since toUpperCase() is idempotent (applying it to an already-uppercase character
 * returns the same character), this preserves any existing capitalization decisions
 * made by the template author.
 *
 * Examples:
 * - "they" → "They" (lowercase t is uppercased)
 * - "he" → "He" (lowercase h is uppercased)
 * - "She" → "She" (S is already uppercase, toUpperCase() returns S)
 * - "THEY" → "THEY" (T is already uppercase, toUpperCase() returns T)
 *
 * @param str - The string to capitalize
 * @returns String with first character uppercased (preserves existing uppercase)
 */
function capitalizeFirstChar(str: string): string {
  if (!str || str.length === 0) {
    return str
  }
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Replaces pronoun placeholders with smart capitalization based on position.
 *
 * Uses regex replace() with a callback function to examine each match position
 * and conditionally capitalize based on whether it appears at sentence start.
 *
 * Algorithm:
 * 1. Find each placeholder match using the provided regex pattern
 * 2. For each match, check if it's at sentence start using isAtSentenceStart()
 * 3. If at sentence start: capitalize the replacement using capitalizeFirstChar()
 * 4. If mid-sentence: use replacement as-is (preserve lowercase)
 *
 * This ensures grammatically correct text after placeholder replacement:
 * - "She is bright. <pronoun> excels" → "She is bright. They excels"
 * - "is <pronoun> helping?" → "is they helping?"
 *
 * @param text - The text containing placeholder(s)
 * @param pattern - The regex pattern to match (e.g., /<pronoun>/gi)
 * @param replacement - The pronoun value to use as replacement
 * @returns Text with all placeholders replaced and capitalization applied
 */
function replacePronounWithCapitalization(text: string, pattern: RegExp, replacement: string): string {
  return text.replace(pattern, (_match, offset) => {
    // Check if this match is at the start of a sentence
    if (isAtSentenceStart(text, offset)) {
      // Capitalize the first letter if it's lowercase
      return capitalizeFirstChar(replacement)
    }
    // Mid-sentence: return the pronoun as-is
    return replacement
  })
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
 *
 * @example
 * replacePlaceholders('<pronoun> uses <possessive pronoun> time well', { pronoun: 'she', possessivePronoun: 'her' })
 * // Returns: 'She uses her time well'
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

  // Replace <pronoun> with smart capitalization
  if (isValidString(studentData.pronoun)) {
    result = replacePronounWithCapitalization(result, PLACEHOLDER_PATTERNS.PRONOUN, studentData.pronoun!)
  }

  // Replace <possessive pronoun> with smart capitalization
  if (isValidString(studentData.possessivePronoun)) {
    result = replacePronounWithCapitalization(result, PLACEHOLDER_PATTERNS.POSSESSIVE_PRONOUN, studentData.possessivePronoun!)
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
