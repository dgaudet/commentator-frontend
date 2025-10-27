/**
 * Outcome Comment Type Definitions
 * Maps to backend API OutcomeComment entity
 * Backend API Reference: http://localhost:3000/api-docs/ui
 *
 * IMPORTANT NOTES:
 * - id is number (integer), not string UUID
 * - Field names are camelCase (createdAt), not snake_case (created_at)
 * - Timestamps are ISO 8601 strings
 *
 * Related: TD-002 (OutcomeComment classId → subjectId Migration)
 * Change: classId → subjectId to align with Subject-based architecture
 */

/**
 * Outcome Comment entity representing a score-based comment on subject outcomes
 * Returned by: GET /outcome-comment, GET /outcome-comment/:id, POST /outcome-comment, PUT /outcome-comment/:id
 */
export interface OutcomeComment {
  /** Unique identifier (auto-generated integer from backend) */
  id: number
  /** Upper score range for this comment */
  upperRange: number
  /** Lower score range for this comment */
  lowerRange: number
  /** Comment text */
  comment: string
  /** Associated subject ID (changed from classId) */
  subjectId: number
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
  /** Upper score range for this comment - Required */
  upperRange: number
  /** Lower score range for this comment - Required */
  lowerRange: number
  /** Comment text - Required */
  comment: string
  /** Associated subject ID - Required (changed from classId) */
  subjectId: number
}

/**
 * Request payload for updating an existing outcome comment
 * Used by: PUT /outcome-comment/:id
 */
export interface UpdateOutcomeCommentRequest {
  /** Upper score range for this comment - Required */
  upperRange: number
  /** Lower score range for this comment - Required */
  lowerRange: number
  /** Comment text - Required */
  comment: string
}
