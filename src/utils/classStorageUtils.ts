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
 * - Store class ID as string (MongoDB ObjectId format)
 * - Return null if key missing or invalid
 * - Clear stale selections gracefully
 * - Handle localStorage unavailable (private browsing, quota exceeded)
 */

import { STORAGE_KEYS, getStorageItem, setStorageItem, removeStorageItem } from '../constants/storageKeys'

/**
 * Get selected class ID from localStorage
 * @returns {string | null} Class ID or null if not found/invalid
 * @deprecated Use getSelectedSubjectId from subjectStorageUtils instead
 *
 * @example
 * const classId = getSelectedClassId()
 * if (classId !== null) {
 *   // Use the stored class ID
 * }
 */
export function getSelectedClassId(): string | null {
  try {
    const stored = getStorageItem(STORAGE_KEYS.SELECTED_CLASS_ID)
    if (stored === null || stored === '') return null

    return stored
  } catch (error) {
    // Handle localStorage unavailable (private browsing, etc.)
    console.warn('Failed to read from localStorage:', error)
    return null
  }
}

/**
 * Save selected class ID to localStorage
 * @param {string} classId - ID of selected class
 * @deprecated Use saveSelectedSubjectId from subjectStorageUtils instead
 *
 * @example
 * saveSelectedClassId(42)
 */
export function saveSelectedClassId(classId: string): void {
  try {
    setStorageItem(STORAGE_KEYS.SELECTED_CLASS_ID, classId)
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
