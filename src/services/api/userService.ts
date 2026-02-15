/**
 * User API Service
 * Service for managing user operations with REST API
 *
 * Endpoints:
 * - POST /api/users/create - Create new user account
 *
 * This service implements the Adapter Pattern to transform between:
 * - Component-friendly interfaces (camelCase, flat structure)
 * - Backend API contract (snake_case, nested structures)
 */

import { apiClient } from '../apiClient'

export interface CreateUserRequest {
  firstName: string
  lastName: string
  email: string
  password: string
}

/**
 * Public User interface - what components receive
 * Uses camelCase and flat structure for JavaScript conventions
 */
export interface User {
  userId: string // From API's user_id
  email: string
  createdAt: string // From API's created_at
}

/**
 * Internal API request structure - matches backend contract
 * @internal
 */
interface CreateUserApiRequest {
  email: string
  password: string
  user_metadata: {
    firstName: string
    lastName: string
  }
}

/**
 * Internal API response structure - matches backend contract
 * @internal
 */
interface UserApiResponse {
  user_id: string
  email: string
  created_at: string
}

/**
 * Map HTTP status codes and known error messages to user-friendly messages
 * Priority order:
 * 1. error.details - Most specific backend error details (highest priority)
 * 2. error.message - General backend error message
 * 3. Status code mapping - Generic user-friendly messages
 * 4. Fallback - Generic error message
 * @internal
 */
function getUserFriendlyErrorMessage(error: unknown): string {
  // Extract error.details - highest priority for user-facing details
  const errorDetails = (error && typeof error === 'object' && 'details' in error)
    ? (error as Record<string, unknown>).details
    : null

  // If details is a non-empty string, use it (most specific error from backend)
  if (errorDetails && typeof errorDetails === 'string' && errorDetails.trim()) {
    return errorDetails
  }

  // Extract error message from various error formats
  const errorMessage = (error instanceof Error) ? error.message : String(error)

  // Extract status code if available
  const status = (error && typeof error === 'object' && 'status' in error)
    ? (error as Record<string, unknown>).status
    : null

  // Map HTTP status codes to user-friendly messages
  // This takes precedence over generic error messages
  switch (status) {
    case 400:
      return 'Please check your information and try again'
    case 409:
      return 'This email is already registered. Please use a different email or try logging in'
    case 422:
      return 'Please check your information and try again'
    case 500:
      return 'An error occurred on our end. Please try again later'
    case 503:
      return 'Our service is temporarily unavailable. Please try again soon'
  }

  // If no status code match, preserve meaningful backend error messages
  // List of specific messages to preserve (helpful backend messages)
  const helpfulMessages = [
    'Email already in use',
  ]

  if (errorMessage && helpfulMessages.includes(errorMessage)) {
    return errorMessage
  }

  // Fallback to generic message if no status code or helpful message found
  return 'Failed to create account'
}

export const userService = {
  /**
   * Create a new user account
   * @param request - User data for account creation (component-friendly format)
   * @returns User object on success
   * @throws Error with user-friendly message extracted from backend or mapped from status code
   *
   * Transforms between:
   * - Input: Component request with flat structure
   * - API: Nested user_metadata structure
   * - Output: Transformed response in camelCase
   *
   * Error handling strategy:
   * 1. Attempt to use backend error message (e.g., "Email already in use")
   * 2. Map HTTP status codes to user-friendly messages
   * 3. Fall back to generic error message
   */
  async create(request: CreateUserRequest): Promise<User> {
    try {
      // Transform component request to API format
      const apiRequest: CreateUserApiRequest = {
        email: request.email,
        password: request.password,
        user_metadata: {
          firstName: request.firstName,
          lastName: request.lastName,
        },
      }

      // Call API
      const response = await apiClient.post<UserApiResponse>(
        '/api/users/create',
        apiRequest,
      )

      // Transform API response to component format
      return {
        userId: response.data.user_id,
        email: response.data.email,
        createdAt: response.data.created_at,
      }
    } catch (error) {
      // Extract user-friendly error message
      const userMessage = getUserFriendlyErrorMessage(error)
      console.error('Failed to create user account:', error)
      throw new Error(userMessage)
    }
  },
}
