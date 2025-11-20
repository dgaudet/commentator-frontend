import type { OutcomeComment } from '../types/OutcomeComment'

/**
 * Sorts outcome comments by their score range thresholds
 *
 * Sort order (descending - highest score range first):
 * 1. Primary: upperRange (descending)
 * 2. Secondary: lowerRange (descending) - for equal upperRange values
 * 3. Tertiary: createdAt (descending) - for identical ranges
 *
 * @param comments - Array of outcome comments to sort
 * @returns New sorted array (does not mutate original)
 *
 * @example
 * const comments = [
 *   { id: 1, upperRange: 70, lowerRange: 60, ... },
 *   { id: 2, upperRange: 100, lowerRange: 90, ... },
 *   { id: 3, upperRange: 80, lowerRange: 70, ... },
 * ]
 *
 * const sorted = sortOutcomeCommentsByRange(comments)
 * // Result: [id: 2 (100-90), id: 3 (80-70), id: 1 (70-60)]
 */
export function sortOutcomeCommentsByRange(comments: OutcomeComment[]): OutcomeComment[] {
  // Create a shallow copy to avoid mutating the original array
  return [...comments].sort((a, b) => {
    // Primary sort: upperRange (descending - highest first)
    if (a.upperRange !== b.upperRange) {
      return b.upperRange - a.upperRange
    }

    // Secondary sort: lowerRange (descending - highest first)
    if (a.lowerRange !== b.lowerRange) {
      return b.lowerRange - a.lowerRange
    }

    // Tertiary sort: createdAt (descending - most recent first)
    // Compare ISO 8601 strings directly (they sort lexicographically in reverse)
    return b.createdAt.localeCompare(a.createdAt)
  })
}
