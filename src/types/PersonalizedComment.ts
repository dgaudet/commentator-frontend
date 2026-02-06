/**
 * Personalized Comment Type Definitions
 * Maps to backend API PersonalizedComment entity
 * Backend API Reference: http://localhost:3000/api-docs
 *
 * Simpler than OutcomeComment - no upperRange/lowerRange fields
 */

/**
 * Personalized Comment entity representing student-specific comments
 * Returned by: GET /personalized-comment, POST /personalized-comment, PUT /personalized-comment/:id
 */
export interface PersonalizedComment {
  /** Unique identifier (MongoDB ObjectId string) */
  id: string
  /** Comment text */
  comment: string
  /** Associated subject ID (MongoDB ObjectId string) - References Subject entity */
  subjectId: string
  /**
   * Comment rating (1-5 scale)
   * - 1: Very Negative (😢)
   * - 2: Negative (😟)
   * - 3: Neutral (😐)
   * - 4: Positive (🙂)
   * - 5: Very Positive (😊)
   *
   * Optional for backward compatibility - existing comments default to 3 (Neutral)
   * Backend accepts decimals but frontend uses integers only
   */
  rating?: number | null
  /** Creation timestamp (ISO 8601) - Auto-generated, immutable */
  createdAt: string
  /** Last update timestamp (ISO 8601) - Auto-updated by backend */
  updatedAt: string
}

/**
 * Request payload for creating a new personalized comment
 * Used by: POST /personalized-comment
 */
export interface CreatePersonalizedCommentRequest {
  /** Comment text - Required (10-500 characters) */
  comment: string
  /** Associated subject ID (MongoDB ObjectId string) - Required */
  subjectId: string
  /** Comment rating (1-5) - Required, must be > 0 */
  rating: number
}

/**
 * Request payload for updating an existing personalized comment
 * Used by: PUT /personalized-comment/:id
 */
export interface UpdatePersonalizedCommentRequest {
  /** Associated subject ID (MongoDB ObjectId string) - Required (immutable, but needed for backend validation) */
  subjectId: string
  /** Comment text - Required (10-500 characters) */
  comment: string
  /** Comment rating (1-5) - Required, must be > 0 */
  rating: number
}

/**
 * Result of a copy operation for personalized comments
 * Returned by: POST /personalized-comment/copy
 *
 * Provides operation summary with success count and duplicate information
 * Replaces the previous response format which returned PersonalizedComment[]
 */
export interface PersonalizedCommentCopyResult {
  /**
   * Number of comments successfully copied to the target subject
   * @example 3
   */
  successCount: number

  /**
   * Number of comments skipped due to duplication detection
   * Only relevant when overwrite=false (append mode)
   * In overwrite mode, this is always 0 because all existing comments are replaced
   * Backend uses case-sensitive text matching to detect duplicates
   * @example 2
   */
  duplicateCount: number

  /**
   * The overwrite mode that was used in this copy operation
   * true: Overwrite all existing comments in target subject
   * false: Append to existing comments (with duplicate detection)
   * @example false
   */
  overwrite: boolean
}
