/**
 * Personalized Comment Rating Utility Functions
 * Reference: US-RATING-001, US-RATING-004, US-RATING-009
 *
 * Provides functionality for rating system in personalized comments:
 * - Default null/undefined ratings to 3 (Neutral)
 * - Map ratings to emojis and accessibility labels
 * - Sort comments by rating (highest first) with alphabetical tie-breaking
 */

import type { PersonalizedComment } from '../types/PersonalizedComment'

/**
 * Rating scale mapping (1-5)
 * 1: Very Negative (😢)
 * 2: Negative (😟)
 * 3: Neutral (😐) - DEFAULT
 * 4: Positive (🙂)
 * 5: Very Positive (😊)
 */
const RATING_EMOJIS = {
  1: '😢',
  2: '😟',
  3: '😐',
  4: '🙂',
  5: '😊',
} as const

const RATING_LABELS = {
  1: 'Very Negative',
  2: 'Negative',
  3: 'Neutral',
  4: 'Positive',
  5: 'Very Positive',
} as const

const DEFAULT_RATING = 3 // Neutral

/**
 * Gets the normalized rating value, defaulting to 3 for null/undefined.
 * Note: 0 is treated as a valid rating and is NOT normalized to 3.
 *
 * @param comment - The personalized comment object
 * @returns The rating value (returns 3 if rating is null or undefined)
 *
 * @example
 * getNormalizedRating({ rating: 5 }) // Returns: 5
 * getNormalizedRating({ rating: null }) // Returns: 3
 * getNormalizedRating({ rating: undefined }) // Returns: 3
 * getNormalizedRating({ rating: 0 }) // Returns: 0
 */
export function getNormalizedRating(comment: PersonalizedComment): number {
  if (comment.rating === null || comment.rating === undefined) {
    return DEFAULT_RATING
  }
  return comment.rating
}

/**
 * Maps a rating value to its corresponding emoji.
 * Rounds decimal ratings to nearest integer.
 * Returns neutral emoji (😐) for invalid ratings.
 *
 * @param rating - The rating value (typically 1-5)
 * @returns The emoji representing the rating
 *
 * @example
 * getRatingEmoji(1) // Returns: '😢'
 * getRatingEmoji(4.8) // Returns: '😊' (rounds to 5)
 * getRatingEmoji(-1) // Returns: '😐' (fallback)
 */
export function getRatingEmoji(rating: number): string {
  const rounded = Math.round(rating)
  return RATING_EMOJIS[rounded] || RATING_EMOJIS[DEFAULT_RATING]
}

/**
 * Maps a rating value to its accessibility label.
 * Rounds decimal ratings to nearest integer.
 * Returns "Neutral" for invalid ratings.
 *
 * @param rating - The rating value (typically 1-5)
 * @returns The label describing the rating
 *
 * @example
 * getRatingLabel(1) // Returns: 'Very Negative'
 * getRatingLabel(3.5) // Returns: 'Positive' (rounds to 4)
 * getRatingLabel(6) // Returns: 'Neutral' (fallback)
 */
export function getRatingLabel(rating: number): string {
  const rounded = Math.round(rating)
  return RATING_LABELS[rounded] || RATING_LABELS[DEFAULT_RATING]
}

/**
 * Sorts personalized comments by rating (descending) with alphabetical
 * tie-breaking by comment text.
 *
 * Sorting rules:
 * 1. Primary: Rating descending (5 → 4 → 3 → 2 → 1)
 * 2. Secondary: Comment text alphabetically (A → Z)
 * 3. null/undefined ratings are treated as 3 (Neutral)
 *
 * Note: Does not mutate the original array.
 *
 * @param comments - Array of personalized comments to sort
 * @returns New sorted array
 *
 * @example
 * sortPersonalizedCommentsByRating([
 *   { comment: 'B', rating: 3 },
 *   { comment: 'A', rating: 5 },
 *   { comment: 'C', rating: 3 }
 * ])
 * // Returns: [
 * //   { comment: 'A', rating: 5 },
 * //   { comment: 'B', rating: 3 },
 * //   { comment: 'C', rating: 3 }
 * // ]
 */
export function sortPersonalizedCommentsByRating(
  comments: PersonalizedComment[],
): PersonalizedComment[] {
  // Create shallow copy to avoid mutating original array
  return [...comments].sort((a, b) => {
    // Get normalized ratings (null/undefined → 3)
    const ratingA = getNormalizedRating(a)
    const ratingB = getNormalizedRating(b)

    // Round decimal ratings for consistent sorting
    const roundedA = Math.round(ratingA)
    const roundedB = Math.round(ratingB)

    // Primary sort: Rating descending (higher ratings first)
    if (roundedB !== roundedA) {
      return roundedB - roundedA
    }

    // Secondary sort: Comment text alphabetically (case-insensitive)
    return a.comment.localeCompare(b.comment, undefined, { sensitivity: 'base' })
  })
}
