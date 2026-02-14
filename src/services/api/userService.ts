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

export const userService = {
  /**
   * Create a new user account
   * @param request - User data for account creation (component-friendly format)
   * @returns User object on success
   *
   * Transforms between:
   * - Input: Component request with flat structure
   * - API: Nested user_metadata structure
   * - Output: Transformed response in camelCase
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
      console.error('Failed to create user account:', error)
      throw new Error('Failed to create account')
    }
  },
}
