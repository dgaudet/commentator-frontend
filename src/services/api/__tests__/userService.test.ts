/**
 * User Service Tests
 * Tests for user API operations (create)
 * Reference: US-UR-005
 */

import { userService } from '../userService'
import { apiClient } from '../../apiClient'

jest.mock('../../apiClient')

describe('userService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('create', () => {
    it('should transform request and call apiClient.post with nested user_metadata', async () => {
      const createRequest = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'Password123',
      }

      const apiResponse = {
        user_id: '123',
        email: 'john@example.com',
        created_at: '2026-02-14T10:00:00Z',
      }

      ;(apiClient.post as jest.Mock).mockResolvedValue({
        data: apiResponse,
      })

      const result = await userService.create(createRequest)

      // Verify request was transformed to API format with nested user_metadata
      expect(apiClient.post).toHaveBeenCalledWith('/api/users/create', {
        email: 'john@example.com',
        password: 'Password123',
        user_metadata: {
          firstName: 'John',
          lastName: 'Doe',
        },
      })

      // Verify response was transformed to camelCase
      expect(result).toEqual({
        userId: '123',
        email: 'john@example.com',
        createdAt: '2026-02-14T10:00:00Z',
      })
    })

    it('should preserve backend error message (e.g., duplicate email)', async () => {
      const createRequest = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'Password123!',
      }

      const apiError = new Error('Email already in use')
      ;(apiClient.post as jest.Mock).mockRejectedValue(apiError)

      await expect(userService.create(createRequest)).rejects.toThrow(
        'Email already in use',
      )
    })

    it('should map 409 conflict status to user-friendly message', async () => {
      const createRequest = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'Password123!',
      }

      const conflictError = Object.assign(new Error('User exists'), {
        status: 409,
      })
      ;(apiClient.post as jest.Mock).mockRejectedValue(conflictError)

      await expect(userService.create(createRequest)).rejects.toThrow(
        'This email is already registered. Please use a different email or try logging in',
      )
    })

    it('should map 400 validation status to user-friendly message', async () => {
      const createRequest = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email',
        password: 'Password123!',
      }

      const validationError = Object.assign(new Error('Invalid input'), {
        status: 400,
      })
      ;(apiClient.post as jest.Mock).mockRejectedValue(validationError)

      await expect(userService.create(createRequest)).rejects.toThrow(
        'Please check your information and try again',
      )
    })

    it('should map 500 server error to user-friendly message', async () => {
      const createRequest = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'Password123!',
      }

      const serverError = Object.assign(new Error('Internal server error'), {
        status: 500,
      })
      ;(apiClient.post as jest.Mock).mockRejectedValue(serverError)

      await expect(userService.create(createRequest)).rejects.toThrow(
        'An error occurred on our end. Please try again later',
      )
    })

    it('should handle network errors', async () => {
      const createRequest = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'Password123',
      }

      const networkError = new Error('Network request failed')
      ;(apiClient.post as jest.Mock).mockRejectedValue(networkError)

      await expect(userService.create(createRequest)).rejects.toThrow()
    })

    it('should pass fields to API in correct structure with nested user_metadata', async () => {
      const createRequest = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'Password123',
      }

      ;(apiClient.post as jest.Mock).mockResolvedValue({
        data: {
          user_id: '123',
          email: 'john@example.com',
          created_at: '2026-02-14T10:00:00Z',
        },
      })

      await userService.create(createRequest)

      // Verify request structure matches API contract with nested user_metadata
      expect(apiClient.post).toHaveBeenCalledWith(
        '/api/users/create',
        expect.objectContaining({
          email: 'john@example.com',
          password: 'Password123',
          user_metadata: expect.objectContaining({
            firstName: 'John',
            lastName: 'Doe',
          }),
        }),
      )
    })

    it('should return user object with userId (transformed from user_id) on success', async () => {
      const createRequest = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        password: 'Secure123Pass!',
      }

      const apiResponse = {
        user_id: '456',
        email: 'jane@example.com',
        created_at: '2026-02-14T11:00:00Z',
      }

      ;(apiClient.post as jest.Mock).mockResolvedValue({
        data: apiResponse,
      })

      const result = await userService.create(createRequest)

      expect(result).toHaveProperty('userId')
      expect(result.userId).toEqual('456')
      expect(result.email).toEqual('jane@example.com')
      expect(result.createdAt).toEqual('2026-02-14T11:00:00Z')
    })

    it('should handle 400 validation error response', async () => {
      const createRequest = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email',
        password: 'Password123',
      }

      const validationError = new Error('Validation failed')
      ;(apiClient.post as jest.Mock).mockRejectedValue(validationError)

      await expect(userService.create(createRequest)).rejects.toThrow(
        'Failed to create account',
      )
    })

    it('should handle 409 conflict error (email exists)', async () => {
      const createRequest = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'existing@example.com',
        password: 'Password123!',
      }

      const conflictError = new Error('Email already in use')
      ;(apiClient.post as jest.Mock).mockRejectedValue(conflictError)

      await expect(userService.create(createRequest)).rejects.toThrow(
        'Email already in use',
      )
    })

    it('should handle 500 server error', async () => {
      const createRequest = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'Password123',
      }

      const serverError = new Error('Internal server error')
      ;(apiClient.post as jest.Mock).mockRejectedValue(serverError)

      await expect(userService.create(createRequest)).rejects.toThrow(
        'Failed to create account',
      )
    })
  })
})
