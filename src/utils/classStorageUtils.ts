/**
 * Utilities for persisting class selection in browser localStorage
 * Reference: TASK-1.1, US-DROPDOWN-002, TD-004 (localStorage Keys Use Different Conventions)
 *
 * Storage Key: "commentator.selectedClassId" (from STORAGE_KEYS constant)
 *
 * @deprecated This file will be removed after Class infrastructure deprecation (TD-003).
 * Use subjectStorageUtils instead for new code.
 *
 * Business Rules:
 * - Store class ID as number
 * - Return null if key missing or invalid
 * - Clear stale selections gracefully
 * - Handle localStorage unavailable (private browsing, quota exceeded)
 */

import { STORAGE_KEYS, getStorageItem, setStorageItem, removeStorageItem } from '../constants/storageKeys'

/**
 * Get selected class ID from localStorage
 * @returns {number | null} Class ID or null if not found/invalid
 * @deprecated Use getSelectedSubjectId from subjectStorageUtils instead
 *
 * @example
 * const classId = getSelectedClassId()
 * if (classId !== null) {
 *   // Use the stored class ID
 * }
 */
export function getSelectedClassId(): number | null {
  try {
    const stored = getStorageItem(STORAGE_KEYS.SELECTED_CLASS_ID)
    if (stored === null) return null

    const parsed = parseInt(stored, 10)
    return isNaN(parsed) ? null : parsed
  } catch (error) {
    // Handle localStorage unavailable (private browsing, etc.)
    console.warn('Failed to read from localStorage:', error)
    return null
  }
}

/**
 * Save selected class ID to localStorage
 * @param {number} classId - ID of selected class
 * @deprecated Use saveSelectedSubjectId from subjectStorageUtils instead
 *
 * @example
 * saveSelectedClassId(42)
 */
export function saveSelectedClassId(classId: number): void {
  try {
    setStorageItem(STORAGE_KEYS.SELECTED_CLASS_ID, classId.toString())
  } catch (error) {
    // Handle localStorage unavailable or quota exceeded
    console.warn('Failed to write to localStorage:', error)
  }
}

/**
 * Clear selected class ID from localStorage
 * @deprecated Use clearSelectedSubjectId from subjectStorageUtils instead
 *
 * @example
 * clearSelectedClassId()
 */
export function clearSelectedClassId(): void {
  try {
    removeStorageItem(STORAGE_KEYS.SELECTED_CLASS_ID)
  } catch (error) {
    console.warn('Failed to clear localStorage:', error)
  }
}
