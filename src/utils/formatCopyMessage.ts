/**
 * Message formatting utilities for copy operations
 * Reference: US-CP-007 - Display duplicate information in append mode
 */

import type { PersonalizedCommentCopyResult } from '../types'

/**
 * Format success message based on copy operation result
 * Handles both append mode (with duplicate detection) and overwrite mode
 *
 * @param result - Copy operation result with success count, duplicate count, and mode
 * @param targetName - Name of the target subject for display
 * @returns Formatted success message appropriate for the operation mode
 *
 * @example
 * // Append mode with duplicates
 * formatSuccessMessage(
 *   { successCount: 3, duplicateCount: 2, overwrite: false },
 *   "Spanish 102"
 * )
 * // Returns: "Successfully copied 3 comments to Spanish 102. 2 duplicates were skipped (already existed)."
 *
 * @example
 * // Overwrite mode
 * formatSuccessMessage(
 *   { successCount: 5, duplicateCount: 0, overwrite: true },
 *   "Math 101"
 * )
 * // Returns: "Successfully replaced all comments in Math 101. Copied 5 comments."
 */
export function formatSuccessMessage(result: PersonalizedCommentCopyResult, targetName: string): string {
  const { successCount, duplicateCount, overwrite } = result

  if (overwrite) {
    // Overwrite mode: simple message about total copied
    return `Successfully replaced all comments in ${targetName}. Copied ${successCount} ${successCount === 1 ? 'comment' : 'comments'}.`
  }

  // Append mode: include duplicate information
  if (duplicateCount === 0) {
    return `Successfully copied ${successCount} ${successCount === 1 ? 'comment' : 'comments'} to ${targetName}.`
  }

  return `Successfully copied ${successCount} ${successCount === 1 ? 'comment' : 'comments'} to ${targetName}. ${duplicateCount} ${duplicateCount === 1 ? 'duplicate was' : 'duplicates were'} skipped (already existed).`
}
