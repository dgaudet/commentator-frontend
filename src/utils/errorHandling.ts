/**
 * Error Handling Utilities
 *
 * Provides error extraction and formatting functions for consistent error handling
 * across the application, especially for API error responses.
 */

/**
 * Represents a structured error with both message and details
 */
export interface SaveError {
  error: string
  details: string
}

/**
 * Extracts error and details from various error response formats
 *
 * Handles multiple error response patterns:
 * - Structured format: { error: "...", details: "..." }
 * - Error with message: { error: "..." }
 * - Message only: { message: "..." }
 * - String error: "error text"
 * - Unknown: Falls back to generic message
 *
 * @param err - The error object from API response or exception
 * @returns SaveError object with error type and detailed message
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
