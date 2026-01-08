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
  return RATING_EMOJIS[rounded as keyof typeof RATING_EMOJIS] ?? RATING_EMOJIS[DEFAULT_RATING]
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
  return RATING_LABELS[rounded as keyof typeof RATING_LABELS] ?? RATING_LABELS[DEFAULT_RATING]
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

/**
 * Filters personalized comments by selected rating (US-FILTER-002).
 * Returns all comments sorted by rating when no rating is selected (rating = 0).
 * Returns only comments matching the selected rating when rating > 0.
 *
 * Filter rules:
 * 1. If selectedRating is 0 or falsy: return all comments (sorted by rating)
 * 2. If selectedRating > 0: return only comments with matching rating (sorted by rating)
 *
 * Note: Does not mutate the original array.
 *
 * @param comments - Array of personalized comments to filter
 * @param selectedRating - The selected rating to filter by (0 = no filter)
 * @returns Filtered and sorted array of personalized comments
 *
 * @example
 * // Filter for rating 5 only
 * filterPersonalizedCommentsByRating(
 *   [
 *     { id: '1', comment: 'Excellent', rating: 5 },
 *     { id: '2', comment: 'Good', rating: 4 },
 *     { id: '3', comment: 'Outstanding', rating: 5 }
 *   ],
 *   5
 * )
 * // Returns: [
 * //   { id: '1', comment: 'Excellent', rating: 5 },
 * //   { id: '3', comment: 'Outstanding', rating: 5 }
 * // ]
 *
 * // No filter (show all)
 * filterPersonalizedCommentsByRating(
 *   [
 *     { id: '1', comment: 'Excellent', rating: 5 },
 *     { id: '2', comment: 'Good', rating: 4 }
 *   ],
 *   0
 * )
 * // Returns all comments sorted by rating: [
 * //   { id: '1', comment: 'Excellent', rating: 5 },
 * //   { id: '2', comment: 'Good', rating: 4 }
 * // ]
 */
export function filterPersonalizedCommentsByRating(
  comments: PersonalizedComment[],
  selectedRating: number,
): PersonalizedComment[] {
  // Sort all comments by rating first
  const sorted = sortPersonalizedCommentsByRating(comments)

  // If no rating selected (0), return all sorted comments
  if (selectedRating === 0) {
    return sorted
  }

  // Filter to only comments matching the selected rating
  // Normalize comment rating to nearest integer for comparison (matches sorting behavior)
  return sorted.filter((comment) => {
    const normalizedRating = getNormalizedRating(comment)
    const roundedRating = Math.round(normalizedRating)
    return roundedRating === selectedRating
  })
}
