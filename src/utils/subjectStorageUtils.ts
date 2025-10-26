/**
 * Utilities for persisting subject selection in browser localStorage
 * Reference: US-REFACTOR-008
 *
 * Storage Key: "commentator.selectedSubjectId"
 * Key Change: classId → subjectId, storage key renamed
 *
 * Business Rules:
 * - Store subject ID as number
 * - Return null if key missing or invalid
 * - Clear stale selections gracefully
 * - Handle localStorage unavailable (private browsing, quota exceeded)
 */

const STORAGE_KEY = 'commentator.selectedSubjectId'

/**
 * Get selected subject ID from localStorage
 * @returns {number | null} Subject ID or null if not found/invalid
 *
 * @example
 * const subjectId = getSelectedSubjectId()
 * if (subjectId !== null) {
 *   // Use the stored subject ID
 * }
 */
export function getSelectedSubjectId(): number | null {
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
 * Save selected subject ID to localStorage
 * @param {number} subjectId - ID of selected subject
 *
 * @example
 * saveSelectedSubjectId(42)
 */
export function saveSelectedSubjectId(subjectId: number): void {
  try {
    localStorage.setItem(STORAGE_KEY, subjectId.toString())
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
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.warn('Failed to clear localStorage:', error)
  }
}
