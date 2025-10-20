/**
 * Class Type Definitions
 * Maps to backend API Class entity
 * Backend API Reference: http://localhost:3000/api-docs/ui
 *
 * IMPORTANT NOTES:
 * - id is number (integer), not string UUID
 * - Field names are camelCase (createdAt), not snake_case (created_at)
 * - Timestamps are ISO 8601 strings
 */

/**
 * Class entity representing an educational class
 * Returned by: GET /class, GET /class/:id, POST /class, PUT /class/:id
 */
export interface Class {
  /** Unique identifier (auto-generated integer from backend) */
  id: number
  /** Class name (e.g., "Mathematics 101") - Required, 1-100 characters */
  name: string
  /** Academic year (e.g., 2024) - Required, 2000-2099 range */
  year: number
  /** Creation timestamp (ISO 8601) - Auto-generated, immutable */
  createdAt: string
  /** Last update timestamp (ISO 8601) - Auto-updated by backend */
  updatedAt: string
}

/**
 * Request payload for creating a new class
 * Used by: POST /class
 *
 * Business Rules:
 * - Name + Year combination must be unique per teacher
 * - Name: 1-100 characters
 * - Year: 2000-2099
 */
export interface CreateClassRequest {
  /** Class name - Required */
  name: string
  /** Academic year - Required */
  year: number
}

/**
 * Request payload for updating an existing class
 * Used by: PUT /class/:id
 *
 * Note: ID is provided in URL path, not in request body
 * Business Rules:
 * - createdAt cannot be changed (immutable)
 * - updatedAt is automatically set by backend
 */
export interface UpdateClassRequest {
  /** Updated class name - Required */
  name: string
  /** Updated academic year - Required */
  year: number
}
