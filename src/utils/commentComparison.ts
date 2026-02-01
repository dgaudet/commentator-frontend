/**
 * Comment Comparison Utility
 * Handles exact-match duplicate detection with whitespace trimming
 */

/**
 * Compares two comment strings for exact duplicate
 * - Trims leading/trailing whitespace before comparison
 * - Case-sensitive comparison
 * - Preserves internal whitespace
 *
 * @param newComment - The new comment text to check
 * @param existingComment - The existing comment to compare against
 * @returns true if comments are exact matches (after trimming), false otherwise
 */
export function isDuplicateComment(
  newComment: string,
  existingComment: string,
): boolean {
  const trimmed1 = newComment.trim()
  const trimmed2 = existingComment.trim()
  return trimmed1 === trimmed2
}

/**
 * Finds a duplicate comment in a list of existing comments
 * - Uses isDuplicateComment for comparison
 * - Optionally filters by a predicate (e.g., subject ID)
 * - Returns first match or null
 *
 * @param newCommentText - The new comment text to check
 * @param existingComments - Array of existing comments to search
 * @param filterBySubject - Optional predicate to filter comments before comparison
 * @param getCommentText - Optional function to extract comment text from comment object (defaults to .text property)
 * @returns The first matching duplicate comment or null if not found
 */
export function findDuplicateComment<T>(
  newCommentText: string,
  existingComments: T[],
  filterBySubject?: (comment: T) => boolean,
  getCommentText?: (comment: T) => string,
): T | null {
  const filtered = filterBySubject
    ? existingComments.filter(filterBySubject)
    : existingComments

  // Use provided text getter or try to get 'text' property, fallback to empty string
  const textGetter =
    getCommentText ||
    ((comment: T) => {
      const commentObj = comment as Record<string, unknown>
      return (commentObj.text as string) || ''
    })

  return (
    filtered.find((comment) =>
      isDuplicateComment(newCommentText, textGetter(comment)),
    ) || null
  )
}
