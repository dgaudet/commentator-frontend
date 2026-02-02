/**
 * Deduplication Utility
 * Story 1: Implement Deduplication Logic
 * US-1: Bulk Upload Duplicate Detection - Check Against Existing Comments
 *
 * Removes duplicate comments from bulk uploads using exact text matching
 * (case-insensitive with whitespace normalization).
 *
 * NEW: Can optionally check uploaded comments against existing PersonalizedComments
 * from modal state to prevent re-saving duplicates.
 *
 * Algorithm: O(n + m) time complexity where:
 * - n = number of uploaded comments
 * - m = number of existing comments (if provided, else 0)
 * Uses Set-based deduplication for O(1) average case duplicate detection
 */

import type { ParsedComment } from './parseComments'
import type { PersonalizedComment } from '../../types'

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
 * NEW (US-1): Optionally checks uploaded comments against existing PersonalizedComments.
 * This prevents re-importing comments that already exist in the modal state.
 *
 * **Algorithm Flow**:
 * 1. Normalize existing comments (if provided) into a Set
 * 2. For each uploaded comment:
 *    a. Check if it matches any existing comment
 *    b. Check if it matches any previously processed uploaded comment
 *    c. If new, add to unique list; if duplicate, add to removed list
 * 3. Return deduplicated results
 *
 * **Performance**: O(n + m) where n = uploaded comments, m = existing comments
 * Using Set-based lookups for O(1) average case duplicate detection
 *
 * @param comments - Array of parsed comments to deduplicate
 * @param existingComments - Optional array of existing PersonalizedComments to check against
 * @returns Object containing:
 *   - `unique`: Array of deduplicated comments (first occurrence preserved)
 *   - `duplicateCount`: Number of duplicate comments removed (from both uploads and existing)
 *   - `removedDuplicates`: Array of comment objects that were removed (for debugging/logging)
 *
 * @example
 * // Example 1: Dedup within upload (existing behavior)
 * const comments = [
 *   { text: 'Great work', rating: 5 },
 *   { text: 'great work', rating: 5 }, // duplicate - different case
 *   { text: 'Excellent', rating: 4 }
 * ]
 * const result = deduplicateComments(comments)
 * // result.unique = [{ text: 'Great work', rating: 5 }, { text: 'Excellent', rating: 4 }]
 * // result.duplicateCount = 1
 *
 * @example
 * // Example 2: Dedup against existing comments (new feature)
 * const uploaded = [
 *   { text: 'Great work', rating: 5 },
 *   { text: 'New comment', rating: 4 }
 * ]
 * const existing = [
 *   { id: '1', comment: 'Great work', ... }
 * ]
 * const result = deduplicateComments(uploaded, existing)
 * // result.unique = [{ text: 'New comment', rating: 4 }]
 * // result.duplicateCount = 1 (matched existing "Great work")
 */
export function deduplicateComments(
  comments: ParsedComment[],
  existingComments?: PersonalizedComment[],
): DeduplicationResult {
  const seen = new Set<string>()
  const unique: ParsedComment[] = []
  const removedDuplicates: ParsedComment[] = []

  // Step 1: Add existing comments to seen set (US-1 new feature)
  if (existingComments && existingComments.length > 0) {
    for (const existing of existingComments) {
      const normalized = normalizeText(existing.comment)
      seen.add(normalized)
    }
  }

  // Step 2: Process uploaded comments
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
