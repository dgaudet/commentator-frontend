/**
 * User API Service
 * Service for managing user operations with REST API
 *
 * Endpoints:
 * - POST /api/users/create - Create new user account
 */

import { apiClient } from '../apiClient'

export interface CreateUserRequest {
  firstName: string
  lastName: string
  email: string
  password: string
}

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
}

export const userService = {
  /**
   * Create a new user account
   * @param request - User data for account creation
   * @returns User object with id on success
   */
  async create(request: CreateUserRequest): Promise<User> {
    try {
      const response = await apiClient.post<User>('/api/users/create', request)
      return response.data
    } catch (error) {
      console.error('Failed to create user account:', error)
      throw new Error('Failed to create account')
    }
  },
}
