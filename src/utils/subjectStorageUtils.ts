/**
 * Utilities for persisting subject selection in browser localStorage
 * Reference: US-REFACTOR-008, TD-004 (localStorage Keys Use Different Conventions)
 *
 * Storage Key: "commentator.selectedSubjectId" (from STORAGE_KEYS constant)
 * Key Change: classId → subjectId, storage key renamed
 *
 * Business Rules:
 * - Store subject ID as string (MongoDB ObjectId format)
 * - Return null if key missing or invalid
 * - Clear stale selections gracefully
 * - Handle localStorage unavailable (private browsing, quota exceeded)
 */

import { STORAGE_KEYS, getStorageItem, setStorageItem, removeStorageItem } from '../constants/storageKeys'

/**
 * Get selected subject ID from localStorage
 * @returns {string | null} Subject ID or null if not found/invalid
 *
 * @example
 * const subjectId = getSelectedSubjectId()
 * if (subjectId !== null) {
 *   // Use the stored subject ID
 * }
 */
export function getSelectedSubjectId(): string | null {
  try {
    const stored = getStorageItem(STORAGE_KEYS.SELECTED_SUBJECT_ID)
    if (stored === null || stored === '') return null

    return stored
  } catch (error) {
    // Handle localStorage unavailable (private browsing, etc.)
    console.warn('Failed to read from localStorage:', error)
    return null
  }
}

/**
 * Save selected subject ID to localStorage
 * @param {string} subjectId - ID of selected subject
 *
 * @example
 * saveSelectedSubjectId('65a1b2c3d4e5f6g7h8i9j0k1')
 */
export function saveSelectedSubjectId(subjectId: string): void {
  try {
    setStorageItem(STORAGE_KEYS.SELECTED_SUBJECT_ID, subjectId)
  } catch (error) {
    // Handle localStorage unavailable or quota exceeded
    console.warn('Failed to write to localStorage:', error)
  }
}

/**
 * Clear selected subject ID from localStorage
 *
 * @example
 * clearSelectedSubjectId()
 */
export function clearSelectedSubjectId(): void {
  try {
    removeStorageItem(STORAGE_KEYS.SELECTED_SUBJECT_ID)
  } catch (error) {
    console.warn('Failed to clear localStorage:', error)
  }
}
