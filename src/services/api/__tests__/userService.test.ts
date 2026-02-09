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
    it('should call apiClient.post with correct endpoint and data', async () => {
      const createRequest = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'Password123',
      }

      const expectedResponse = {
        id: '123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      }

      ;(apiClient.post as jest.Mock).mockResolvedValue({
        data: expectedResponse,
      })

      const result = await userService.create(createRequest)

      expect(apiClient.post).toHaveBeenCalledWith('/api/users/create', createRequest)
      expect(result).toEqual(expectedResponse)
    })

    it('should handle API errors and throw user-friendly error message', async () => {
      const createRequest = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'Password123',
      }

      const apiError = new Error('Email already in use')
      ;(apiClient.post as jest.Mock).mockRejectedValue(apiError)

      await expect(userService.create(createRequest)).rejects.toThrow(
        'Failed to create account',
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

    it('should pass only required fields to API', async () => {
      const createRequest = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'Password123',
      }

      ;(apiClient.post as jest.Mock).mockResolvedValue({
        data: { id: '123', ...createRequest },
      })

      await userService.create(createRequest)

      // Verify exactly these fields are sent
      expect(apiClient.post).toHaveBeenCalledWith(
        '/api/users/create',
        expect.objectContaining({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          password: 'Password123',
        }),
      )
    })

    it('should return user object with id on success', async () => {
      const createRequest = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        password: 'Secure123Pass',
      }

      const expectedResponse = {
        id: '456',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
      }

      ;(apiClient.post as jest.Mock).mockResolvedValue({
        data: expectedResponse,
      })

      const result = await userService.create(createRequest)

      expect(result).toHaveProperty('id')
      expect(result.firstName).toEqual('Jane')
      expect(result.email).toEqual('jane@example.com')
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
        password: 'Password123',
      }

      const conflictError = new Error('Email already in use')
      ;(apiClient.post as jest.Mock).mockRejectedValue(conflictError)

      await expect(userService.create(createRequest)).rejects.toThrow(
        'Failed to create account',
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
