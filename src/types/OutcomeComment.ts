/**
 * Outcome Comment Type Definitions
 * Maps to backend API OutcomeComment entity
 * Backend API Reference: http://localhost:3000/api-docs/ui
 *
 * IMPORTANT NOTES:
 * - id is number (integer), not string UUID
 * - Field names are camelCase (createdAt), not snake_case (created_at)
 * - Timestamps are ISO 8601 strings
 */

/**
 * Outcome Comment entity representing a comment on class outcomes
 * Returned by: GET /outcome-comment, GET /outcome-comment/:id, POST /outcome-comment, PUT /outcome-comment/:id
 */
export interface OutcomeComment {
  /** Unique identifier (auto-generated integer from backend) */
  id: number
  /** Associated class ID */
  classId: number
  /** Comment content - Required, 1-1000 characters */
  content: string
  /** Creation timestamp (ISO 8601) - Auto-generated, immutable */
  createdAt: string
  /** Last update timestamp (ISO 8601) - Auto-updated by backend */
  updatedAt: string
}

/**
 * Request payload for creating a new outcome comment
 * Used by: POST /outcome-comment
 */
export interface CreateOutcomeCommentRequest {
  /** Associated class ID - Required */
  classId: number
  /** Comment content - Required */
  content: string
}

/**
 * Request payload for updating an existing outcome comment
 * Used by: PUT /outcome-comment/:id
 */
export interface UpdateOutcomeCommentRequest {
  /** Comment content - Required */
  content: string
}