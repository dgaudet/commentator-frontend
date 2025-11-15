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
  /** Unique identifier (auto-generated integer from backend) */
  id: number
  /** Comment text */
  comment: string
  /** Associated subject ID */
  subjectId: number
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
  /** Associated subject ID - Required */
  subjectId: number
  /** Comment rating (1-5) - Required, must be > 0 */
  rating: number
}

/**
 * Request payload for updating an existing personalized comment
 * Used by: PUT /personalized-comment/:id
 */
export interface UpdatePersonalizedCommentRequest {
  /** Comment text - Required (10-500 characters) */
  comment: string
  /** Comment rating (1-5) - Required, must be > 0 */
  rating: number
}
