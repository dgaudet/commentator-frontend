/**
 * Subject Type Definitions
 * Maps to backend API Subject entity
 * Backend API Reference: http://localhost:3000/api-docs/ui
 *
 * IMPORTANT NOTES:
 * - id is string (MongoDB ObjectId format - 24 hexadecimal characters)
 * - Field names are camelCase (createdAt), not snake_case (created_at)
 * - Timestamps are ISO 8601 strings
 * - Subject entity does NOT have year field (removed in API refactoring)
 */

/**
 * Subject entity representing an educational subject
 * Returned by: GET /subject, GET /subject/:id, POST /subject, PUT /subject/:id
 */
export interface Subject {
  /** Unique identifier (MongoDB ObjectId string - 24 hex characters, e.g., "65a1b2c3d4e5f6a7b8c9d0e1") */
  id: string
  /** Subject name (e.g., "Mathematics 101") - Required, 1-100 characters */
  name: string
  /** Creation timestamp (ISO 8601) - Auto-generated, immutable */
  createdAt: string
  /** Last update timestamp (ISO 8601) - Auto-updated by backend */
  updatedAt: string
}

/**
 * Request payload for creating a new subject
 * Used by: POST /subject
 *
 * Business Rules:
 * - Name: 1-100 characters, required
 * - Name must be unique per teacher
 */
export interface CreateSubjectRequest {
  /** Subject name - Required */
  name: string
}

/**
 * Request payload for updating an existing subject
 * Used by: PUT /subject/:id
 *
 * Note: ID is provided in URL path, not in request body
 * Business Rules:
 * - createdAt cannot be changed (immutable)
 * - updatedAt is automatically set by backend
 */
export interface UpdateSubjectRequest {
  /** Updated subject name - Required */
  name: string
}
