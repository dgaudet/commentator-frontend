/**
 * Error Handling Utilities
 *
 * Provides error extraction and formatting functions for consistent error handling
 * across the application, especially for API error responses and exceptions.
 *
 * This module ensures that backend error responses are properly extracted and
 * formatted for display to users in a user-friendly manner.
 *
 * Usage:
 * ```tsx
 * try {
 *   await api.save(data)
 * } catch (err) {
 *   const errorInfo = extractErrorMessage(err)
 *   setError(errorInfo) // { error: "...", details: "..." }
 * }
 * ```
 */

/**
 * Represents a structured error with both message and details
 *
 * Used for displaying errors to users with:
 * - error: The type or category of error (e.g., "Duplicate entry")
 * - details: Detailed explanation for the user (e.g., "This student already has...")
 *
 * Example:
 * ```
 * {
 *   error: "Duplicate entry",
 *   details: "This student already has a final comment in this class"
 * }
 * ```
 */
export interface SaveError {
  /** Error type or category (short, user-friendly) */
  error: string
  /** Detailed explanation of the error (full context for user) */
  details: string
}

/**
 * Extracts error and details from various error response formats
 *
 * This function handles multiple error response patterns from different APIs
 * and sources, normalizing them into a consistent SaveError format.
 *
 * Handles these patterns:
 * 1. Structured error: `{ error: "...", details: "..." }`
 *    - Best: Full context provided by backend
 * 2. Error with message: `{ error: "..." }`
 *    - Good: Error type provided, generic details fallback
 * 3. Message only: `{ message: "..." }`
 *    - Acceptable: Message becomes details with generic error type
 * 4. String error: `"error text"`
 *    - Basic: String becomes details with generic error type
 * 5. Unknown: any other format
 *    - Fallback: Generic error message
 *
 * @param err - The error object from API response or exception
 * @returns SaveError object with error type and detailed message
 *
 * @example
 * ```tsx
 * try {
 *   await api.createComment(data)
 * } catch (err) {
 *   const errorInfo = extractErrorMessage(err)
 *   // Use errorInfo.error and errorInfo.details to display to user
 * }
 * ```
 */
export function extractErrorMessage(err: unknown): SaveError {
  // Handle structured error response with both error and details fields
  if (
    err &&
    typeof err === 'object' &&
    'error' in err &&
    'details' in err
  ) {
    const errorObj = err as Record<string, unknown>
    return {
      error: String(errorObj.error || 'Save failed'),
      details: String(errorObj.details || 'An unexpected error occurred.'),
    }
  }

  // Handle error object with just error field
  if (
    err &&
    typeof err === 'object' &&
    'error' in err
  ) {
    const errorObj = err as Record<string, unknown>
    return {
      error: String(errorObj.error || 'Save failed'),
      details: 'Please try again.',
    }
  }

  // Handle error object with message field
  if (
    err &&
    typeof err === 'object' &&
    'message' in err
  ) {
    const errorObj = err as Record<string, unknown>
    return {
      error: 'Save failed',
      details: String(errorObj.message || 'An unexpected error occurred.'),
    }
  }

  // Handle string error
  if (typeof err === 'string') {
    return {
      error: 'Save failed',
      details: err || 'An unexpected error occurred.',
    }
  }

  // Fallback for unknown error types
  return {
    error: 'Save failed',
    details: 'An unexpected error occurred. Please try again.',
  }
}
