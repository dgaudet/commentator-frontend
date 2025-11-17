/**
 * Character limit constants for comment fields
 *
 * These constants define validation rules for comment text across the application.
 * Centralized to avoid duplication and ensure consistency.
 */

/** Minimum character length for all comment types */
export const MIN_COMMENT_LENGTH = 10

/** Maximum character length for outcome and personalized comments */
export const MAX_COMMENT_LENGTH = 1000

/** Maximum character length for final comments */
export const MAX_FINAL_COMMENT_LENGTH = 500
