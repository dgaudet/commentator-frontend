/**
 * Utilities for persisting class selection in browser localStorage
 * Reference: TASK-1.1, US-DROPDOWN-002
 *
 * Storage Key: "commentator.selectedClassId"
 *
 * Business Rules:
 * - Store class ID as number
 * - Return null if key missing or invalid
 * - Clear stale selections gracefully
 * - Handle localStorage unavailable (private browsing, quota exceeded)
 */

const STORAGE_KEY = 'commentator.selectedClassId'

/**
 * Get selected class ID from localStorage
 * @returns {number | null} Class ID or null if not found/invalid
 *
 * @example
 * const classId = getSelectedClassId()
 * if (classId !== null) {
 *   // Use the stored class ID
 * }
 */
export function getSelectedClassId(): number | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
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
 *
 * @example
 * saveSelectedClassId(42)
 */
export function saveSelectedClassId(classId: number): void {
  try {
    localStorage.setItem(STORAGE_KEY, classId.toString())
  } catch (error) {
    // Handle localStorage unavailable or quota exceeded
    console.warn('Failed to write to localStorage:', error)
  }
}

/**
 * Clear selected class ID from localStorage
 *
 * @example
 * clearSelectedClassId()
 */
export function clearSelectedClassId(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.warn('Failed to clear localStorage:', error)
  }
}
