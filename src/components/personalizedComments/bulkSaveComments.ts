/**
 * bulkSaveComments utility function
 * Story 4: Validate and Save Comments Sequentially
 *
 * Saves parsed comments to the backend via the existing API one at a time
 * Maximizes successful imports by continuing even if some fail
 */

import type { CreatePersonalizedCommentRequest } from '../../types'
import type { ParsedComment } from './parseComments'

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
}

export async function bulkSaveComments(
  subjectId: string,
  comments: ParsedComment[],
  createComment: (request: CreatePersonalizedCommentRequest) => Promise<unknown>,
  onProgress?: (current: number) => void,
): Promise<BulkSaveResult> {
  const result: BulkSaveResult = {
    successful: [],
    failed: [],
    totalAttempted: comments.length,
  }

  // Process each comment sequentially
  for (let lineNumber = 0; lineNumber < comments.length; lineNumber++) {
    const comment = comments[lineNumber]

    try {
      // Attempt to save the comment
      await createComment({
        subjectId,
        comment: comment.text,
        rating: comment.rating,
      })

      // Track successful save
      result.successful.push({
        text: comment.text,
        rating: comment.rating,
      })
    } catch (error) {
      // Track failed save with error reason
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'

      result.failed.push({
        lineNumber: lineNumber + 1, // 1-indexed for user display
        originalText: comment.text,
        reason: errorMessage,
      })
    }

    // Report progress after each comment is processed
    onProgress?.(lineNumber + 1)
  }

  return result
}
