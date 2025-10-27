/**
 * Central registry for all localStorage keys used in the application.
 *
 * Naming Convention:
 * - All keys use the "commentator." namespace prefix
 * - Use camelCase for key names
 * - Be descriptive and specific
 *
 * Examples:
 * - commentator.selectedSubjectId
 * - commentator.theme
 * - commentator.userPreferences
 * - commentator.lastLoginDate
 *
 * Related: TD-004 (localStorage Keys Use Different Conventions)
 */

export const STORAGE_KEYS = {
  /**
   * Stores the ID of the currently selected subject.
   * Used to persist user's subject selection across page reloads.
   * Type: number (stored as string)
   */
  SELECTED_SUBJECT_ID: 'commentator.selectedSubjectId',

  /**
   * (Legacy) Stores the ID of the currently selected class.
   * Will be removed after Class infrastructure deprecation (TD-003).
   * Type: number (stored as string)
   * @deprecated Use SELECTED_SUBJECT_ID instead
   */
  SELECTED_CLASS_ID: 'commentator.selectedClassId',

  // Future keys (add as needed):
  // THEME: 'commentator.theme',
  // USER_PREFERENCES: 'commentator.userPreferences',
  // LAST_LOGIN_DATE: 'commentator.lastLoginDate',
} as const

/**
 * Type-safe localStorage wrapper for getting values.
 *
 * @param key - One of the predefined storage keys
 * @returns The stored value, or null if not found
 *
 * @example
 * const subjectId = getStorageItem(STORAGE_KEYS.SELECTED_SUBJECT_ID)
 */
export function getStorageItem(key: (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]): string | null {
  return localStorage.getItem(key)
}

/**
 * Type-safe localStorage wrapper for setting values.
 *
 * @param key - One of the predefined storage keys
 * @param value - The value to store
 *
 * @example
 * setStorageItem(STORAGE_KEYS.SELECTED_SUBJECT_ID, '123')
 */
export function setStorageItem(key: (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS], value: string): void {
  localStorage.setItem(key, value)
}

/**
 * Type-safe localStorage wrapper for removing values.
 *
 * @param key - One of the predefined storage keys
 *
 * @example
 * removeStorageItem(STORAGE_KEYS.SELECTED_SUBJECT_ID)
 */
export function removeStorageItem(key: (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]): void {
  localStorage.removeItem(key)
}

/**
 * Clear all commentator-specific localStorage keys.
 * Useful for logout or reset functionality.
 */
export function clearCommentatorStorage(): void {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key)
  })
}
