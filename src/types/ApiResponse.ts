/**
 * API Response Type Definitions
 * Generic types for backend API responses
 */

/**
 * Generic API response wrapper
 * Used for wrapping successful API responses
 *
 * @template T - The type of data being returned
 *
 * @example
 * // Single class response
 * const response: ApiResponse<Class> = {
 *   data: { id: 1, name: 'Math', year: 2024, ... }
 * }
 *
 * @example
 * // Array of classes response
 * const response: ApiResponse<Class[]> = {
 *   data: [{ id: 1, ... }, { id: 2, ... }]
 * }
 */
export interface ApiResponse<T> {
  /** The response data */
  data: T
  /** Optional success message */
  message?: string
}

/**
 * API error response structure
 * Returned when API requests fail
 *
 * Common status codes:
 * - 400: Bad Request (validation errors)
 * - 404: Not Found
 * - 409: Conflict (duplicate data)
 * - 500: Internal Server Error
 *
 * @example
 * // Simple error
 * const error: ApiError = {
 *   error: 'NotFound',
 *   message: 'Class not found',
 *   statusCode: 404
 * }
 *
 * @example
 * // Validation error with details
 * const error: ApiError = {
 *   error: 'ValidationFailed',
 *   message: 'Invalid input',
 *   statusCode: 400,
 *   details: {
 *     name: ['Name is required'],
 *     year: ['Year must be between 2000-2099']
 *   }
 * }
 */
export interface ApiError {
  /** Error type/code */
  error: string
  /** Human-readable error message */
  message: string
  /** HTTP status code */
  statusCode: number
  /**
   * Optional detailed error information
   * Can be:
   * - string: Simple error description
   * - Record<string, string[]>: Field-level validation errors
   */
  details?: Record<string, string[]> | string
}
