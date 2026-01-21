/**
 * Deduplication Utility
 * Story 1: Implement Deduplication Logic
 *
 * Removes duplicate comments from bulk uploads using exact text matching
 * (case-insensitive with whitespace normalization).
 *
 * Algorithm: O(n) time complexity using Set-based deduplication
 */

import type { ParsedComment } from './parseComments'

/**
 * Result of deduplication operation
 */
export interface DeduplicationResult {
  /** Comments with duplicates removed (first occurrence preserved) */
  unique: ParsedComment[]

  /** Count of duplicate comments removed */
  duplicateCount: number

  /** Details of removed duplicates (for debugging/logging) */
  removedDuplicates: ParsedComment[]
}

/**
 * Normalize comment text for comparison
 * - Convert to lowercase for case-insensitive matching
 * - Trim leading/trailing whitespace
 * - Collapse internal whitespace to single space
 * - Replace newlines/tabs with space
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\n\r\t]/g, ' ') // Replace newlines/tabs with space
    .replace(/\s+/g, ' ') // Collapse multiple spaces to single space
    .trim() // Remove leading/trailing whitespace
}

/**
 * Deduplicate comments by exact text match (case-insensitive, whitespace-normalized)
 *
 * Removes duplicate comments from an array, preserving the first occurrence of each unique comment.
 * Duplicates are determined by comparing normalized comment text (case-insensitive, whitespace-normalized).
 * Comments with different ratings but identical text are still considered duplicates.
 *
 * **Performance**: O(n) time complexity, O(n) space complexity using Set-based deduplication
 *
 * @param comments - Array of parsed comments to deduplicate
 * @returns Object containing:
 *   - `unique`: Array of deduplicated comments (first occurrence preserved)
 *   - `duplicateCount`: Number of duplicate comments removed
 *   - `removedDuplicates`: Array of comment objects that were removed (for debugging/logging)
 *
 * @example
 * const comments = [
 *   { text: 'Great work', rating: 5 },
 *   { text: 'great work', rating: 5 }, // duplicate - different case
 *   { text: 'Excellent', rating: 4 }
 * ]
 * const result = deduplicateComments(comments)
 * // result.unique = [{ text: 'Great work', rating: 5 }, { text: 'Excellent', rating: 4 }]
 * // result.duplicateCount = 1
 * // result.removedDuplicates = [{ text: 'great work', rating: 5 }]
 */
export function deduplicateComments(comments: ParsedComment[]): DeduplicationResult {
  const seen = new Set<string>()
  const unique: ParsedComment[] = []
  const removedDuplicates: ParsedComment[] = []

  for (const comment of comments) {
    const normalized = normalizeText(comment.text)

    if (!seen.has(normalized)) {
      // First occurrence - add to unique
      seen.add(normalized)
      unique.push(comment)
    } else {
      // Duplicate - add to removed list
      removedDuplicates.push(comment)
    }
  }

  return {
    unique,
    duplicateCount: removedDuplicates.length,
    removedDuplicates,
  }
}
