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
}

/**
 * Request payload for updating an existing personalized comment
 * Used by: PUT /personalized-comment/:id
 */
export interface UpdatePersonalizedCommentRequest {
  /** Comment text - Required (10-500 characters) */
  comment: string
}
