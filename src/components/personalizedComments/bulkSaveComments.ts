/**
 * bulkSaveComments utility function
 * Story 2: Integrate Deduplication into Bulk Save Flow
 * Story 4: Validate and Save Comments Sequentially
 * US-1: Check Against Existing Comments
 *
 * Saves parsed comments to the backend via the existing API one at a time:
 * 1. Deduplicates comments, optionally checking against existing PersonalizedComments
 * 2. Saves only unique comments to the backend
 * 3. Tracks successful and failed imports
 * 4. Maximizes successful imports by continuing even if some fail
 */

import type { CreatePersonalizedCommentRequest, PersonalizedComment } from '../../types'
import type { ParsedComment } from './parseComments'
import { deduplicateComments } from './deduplicateComments'

export interface SuccessfulSave {
  text: string
  rating: number
}

export interface FailedSave {
  lineNumber: number
  originalText: string
  reason: string
}

export interface BulkSaveResult {
  successful: SuccessfulSave[]
  failed: FailedSave[]
  totalAttempted: number
  duplicateCount: number
}

/**
 * Save deduplicated comments to the backend sequentially
 *
 * **Workflow**:
 * 1. Deduplicates input comments (case-insensitive, whitespace-normalized)
 * 2. Optionally checks against existing PersonalizedComments (US-1 feature)
 * 3. Saves only unique comments to the API one-by-one
 * 4. Tracks successful and failed saves separately
 * 5. Continues processing even if some saves fail
 * 6. Reports duplicate count and comprehensive save results
 *
 * **Note**: `totalAttempted` reflects the original input count (before deduplication),
 * allowing callers to understand the ratio of duplicates removed.
 *
 * @param subjectId - Subject ID for the comments being saved
 * @param comments - Array of parsed comments to deduplicate and save
 * @param createComment - API function to save individual comments
 * @param onProgress - Optional callback to report progress (called after each comment processed)
 * @param existingComments - Optional array of existing PersonalizedComments to check against (US-1)
 * @returns Result object with successful saves, failed saves, duplicate count, and total attempted
 */
export async function bulkSaveComments(
  subjectId: string,
  comments: ParsedComment[],
  createComment: (request: CreatePersonalizedCommentRequest) => Promise<unknown>,
  onProgress?: (current: number) => void,
  existingComments?: PersonalizedComment[],
): Promise<BulkSaveResult> {
  // Step 1: Deduplicate comments before saving (Story 2) + check existing (US-1)
  const dedup = deduplicateComments(comments, existingComments)

  const result: BulkSaveResult = {
    successful: [],
    failed: [],
    totalAttempted: comments.length, // Original count (before dedup) for transparent reporting
    duplicateCount: dedup.duplicateCount,
  }

  // Step 2: Process only unique comments sequentially (Story 4)
  for (let lineNumber = 0; lineNumber < dedup.unique.length; lineNumber++) {
    const comment = dedup.unique[lineNumber]

    try {
      // Attempt to save the comment to the backend
      await createComment({
        subjectId,
        comment: comment.text,
        rating: comment.rating,
      })

      // Track successful save with text and rating preserved
      result.successful.push({
        text: comment.text,
        rating: comment.rating,
      })
    } catch (error) {
      // Track failed save with error reason for user feedback
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'

      result.failed.push({
        lineNumber: lineNumber + 1, // 1-indexed for user display
        originalText: comment.text,
        reason: errorMessage,
      })
    }

    // Report progress after each unique comment is processed
    onProgress?.(lineNumber + 1)
  }

  return result
}
