/**
 * Final Comment Type Definitions
 * Maps to backend API FinalComment entity
 * Backend API Reference: http://localhost:3000/api-docs/ui
 *
 * User Story: US-FINAL-001, US-FINAL-002, US-FINAL-003
 *
 * IMPORTANT NOTES:
 * - id is number (integer), not string UUID
 * - Field names are camelCase (firstName, createdAt), not snake_case (first_name, created_at)
 * - Timestamps are ISO 8601 strings
 * - lastName is optional (may be undefined or omitted)
 * - comment is optional (may be undefined or omitted)
 */

/**
 * Final Comment entity representing a student's final grade and feedback for a class
 * Returned by: GET /final-comment, GET /final-comment/:id, POST /final-comment, PUT /final-comment/:id
 */
export interface FinalComment {
  /** Unique identifier (auto-generated integer from backend) */
  id: number
  /** Associated class ID - Required */
  classId: number
  /** Student first name - Required */
  firstName: string
  /** Student last name - Optional */
  lastName?: string
  /** Student grade (0-100) - Required */
  grade: number
  /** Optional qualitative feedback comment (max 1000 chars) */
  comment?: string
  /** Creation timestamp (ISO 8601) - Auto-generated, immutable */
  createdAt: string
  /** Last update timestamp (ISO 8601) - Auto-updated by backend */
  updatedAt: string
}

/**
 * Request payload for creating a new final comment
 * Used by: POST /final-comment
 */
export interface CreateFinalCommentRequest {
  /** Associated class ID - Required */
  classId: number
  /** Student first name - Required, min 1 char after trim */
  firstName: string
  /** Student last name - Optional, min 1 char if provided after trim */
  lastName?: string
  /** Student grade (0-100 inclusive) - Required */
  grade: number
  /** Optional qualitative feedback comment - Max 1000 chars */
  comment?: string
}

/**
 * Request payload for updating an existing final comment
 * Used by: PUT /final-comment/:id
 */
export interface UpdateFinalCommentRequest {
  /** Associated class ID - Required */
  classId: number
  /** Student first name - Required, min 1 char after trim */
  firstName: string
  /** Student last name - Optional, min 1 char if provided after trim */
  lastName?: string
  /** Student grade (0-100 inclusive) - Required */
  grade: number
  /** Optional qualitative feedback comment - Max 1000 chars */
  comment?: string
}
