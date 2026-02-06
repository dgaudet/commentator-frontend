/**
 * Tests for personalizedCommentService.copy method
 * Reference: US-CP-006 - Handle new API response format
 *
 * Tests verify:
 * - Correct response type parsing (PersonalizedCommentCopyResult)
 * - All response fields present and correct
 * - Error handling and error messages
 * - API request payload validation
 */

import { personalizedCommentService } from '../personalizedCommentService'
import { apiClient } from '../../apiClient'
import type { PersonalizedCommentCopyResult } from '../../../types'

// Mock the API client
jest.mock('../../apiClient', () => ({
  apiClient: {
    post: jest.fn(),
  },
}))

describe('personalizedCommentService.copy', () => {
  const mockApiClient = apiClient as jest.Mocked<typeof apiClient>

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Response Type Handling (AC-6.1, AC-6.2)', () => {
    it('should return PersonalizedCommentCopyResult with correct type', async () => {
      const mockResponse: PersonalizedCommentCopyResult = {
        successCount: 3,
        duplicateCount: 2,
        overwrite: false,
      }

      mockApiClient.post.mockResolvedValue({
        data: mockResponse,
      })

      const result = await personalizedCommentService.copy({
        subjectFromId: 'source-id',
        subjectToId: 'target-id',
        overwrite: false,
      })

      expect(result).toEqual(mockResponse)
      expect(result).toHaveProperty('successCount')
      expect(result).toHaveProperty('duplicateCount')
      expect(result).toHaveProperty('overwrite')
    })

    it('should have correct field types in response', async () => {
      const mockResponse: PersonalizedCommentCopyResult = {
        successCount: 5,
        duplicateCount: 0,
        overwrite: true,
      }

      mockApiClient.post.mockResolvedValue({
        data: mockResponse,
      })

      const result = await personalizedCommentService.copy({
        subjectFromId: 'source-id',
        subjectToId: 'target-id',
        overwrite: true,
      })

      expect(typeof result.successCount).toBe('number')
      expect(typeof result.duplicateCount).toBe('number')
      expect(typeof result.overwrite).toBe('boolean')
    })
  })

  describe('Append Mode Response (AC-6.1)', () => {
    it('should return correct response for append mode with duplicates', async () => {
      const mockResponse: PersonalizedCommentCopyResult = {
        successCount: 3,
        duplicateCount: 2,
        overwrite: false,
      }

      mockApiClient.post.mockResolvedValue({
        data: mockResponse,
      })

      const result = await personalizedCommentService.copy({
        subjectFromId: '65a1b2c3d4e5f6g7h8i9j0k1',
        subjectToId: '65a1b2c3d4e5f6g7h8i9j0k2',
        overwrite: false,
      })

      expect(result.successCount).toBe(3)
      expect(result.duplicateCount).toBe(2)
      expect(result.overwrite).toBe(false)
    })

    it('should return correct response for append mode without duplicates', async () => {
      const mockResponse: PersonalizedCommentCopyResult = {
        successCount: 5,
        duplicateCount: 0,
        overwrite: false,
      }

      mockApiClient.post.mockResolvedValue({
        data: mockResponse,
      })

      const result = await personalizedCommentService.copy({
        subjectFromId: 'source-id',
        subjectToId: 'target-id',
        overwrite: false,
      })

      expect(result.successCount).toBe(5)
      expect(result.duplicateCount).toBe(0)
      expect(result.overwrite).toBe(false)
    })

    it('should handle zero comments in append mode', async () => {
      const mockResponse: PersonalizedCommentCopyResult = {
        successCount: 0,
        duplicateCount: 5,
        overwrite: false,
      }

      mockApiClient.post.mockResolvedValue({
        data: mockResponse,
      })

      const result = await personalizedCommentService.copy({
        subjectFromId: 'source-id',
        subjectToId: 'target-id',
        overwrite: false,
      })

      expect(result.successCount).toBe(0)
      expect(result.duplicateCount).toBe(5)
    })
  })

  describe('Overwrite Mode Response', () => {
    it('should return correct response for overwrite mode', async () => {
      const mockResponse: PersonalizedCommentCopyResult = {
        successCount: 7,
        duplicateCount: 0,
        overwrite: true,
      }

      mockApiClient.post.mockResolvedValue({
        data: mockResponse,
      })

      const result = await personalizedCommentService.copy({
        subjectFromId: '65a1b2c3d4e5f6g7h8i9j0k1',
        subjectToId: '65a1b2c3d4e5f6g7h8i9j0k2',
        overwrite: true,
      })

      expect(result.successCount).toBe(7)
      expect(result.duplicateCount).toBe(0)
      expect(result.overwrite).toBe(true)
    })

    it('should always have zero duplicates in overwrite mode', async () => {
      const mockResponse: PersonalizedCommentCopyResult = {
        successCount: 10,
        duplicateCount: 0,
        overwrite: true,
      }

      mockApiClient.post.mockResolvedValue({
        data: mockResponse,
      })

      const result = await personalizedCommentService.copy({
        subjectFromId: 'source-id',
        subjectToId: 'target-id',
        overwrite: true,
      })

      expect(result.duplicateCount).toBe(0)
    })
  })

  describe('API Request Payload (AC-6.1)', () => {
    it('should send correct request payload for append mode', async () => {
      const mockResponse: PersonalizedCommentCopyResult = {
        successCount: 2,
        duplicateCount: 1,
        overwrite: false,
      }

      mockApiClient.post.mockResolvedValue({
        data: mockResponse,
      })

      await personalizedCommentService.copy({
        subjectFromId: 'source-id',
        subjectToId: 'target-id',
        overwrite: false,
      })

      expect(mockApiClient.post).toHaveBeenCalledWith(
        '/personalized-comment/copy',
        {
          subjectFromId: 'source-id',
          subjectToId: 'target-id',
          overwrite: false,
        },
      )
    })

    it('should send correct request payload for overwrite mode', async () => {
      const mockResponse: PersonalizedCommentCopyResult = {
        successCount: 5,
        duplicateCount: 0,
        overwrite: true,
      }

      mockApiClient.post.mockResolvedValue({
        data: mockResponse,
      })

      await personalizedCommentService.copy({
        subjectFromId: 'source-123',
        subjectToId: 'target-456',
        overwrite: true,
      })

      expect(mockApiClient.post).toHaveBeenCalledWith(
        '/personalized-comment/copy',
        {
          subjectFromId: 'source-123',
          subjectToId: 'target-456',
          overwrite: true,
        },
      )
    })

    it('should call correct API endpoint', async () => {
      const mockResponse: PersonalizedCommentCopyResult = {
        successCount: 1,
        duplicateCount: 0,
        overwrite: false,
      }

      mockApiClient.post.mockResolvedValue({
        data: mockResponse,
      })

      await personalizedCommentService.copy({
        subjectFromId: 'source-id',
        subjectToId: 'target-id',
        overwrite: false,
      })

      expect(mockApiClient.post).toHaveBeenCalledWith(
        expect.stringContaining('/personalized-comment/copy'),
        expect.any(Object),
      )
    })
  })

  describe('Error Handling', () => {
    it('should throw error when API call fails', async () => {
      const error = new Error('Network error')
      mockApiClient.post.mockRejectedValue(error)

      await expect(
        personalizedCommentService.copy({
          subjectFromId: 'source-id',
          subjectToId: 'target-id',
          overwrite: false,
        }),
      ).rejects.toThrow('Failed to copy personalized comments')
    })

    it('should throw descriptive error message', async () => {
      const apiError = new Error('API Error')
      mockApiClient.post.mockRejectedValue(apiError)

      try {
        await personalizedCommentService.copy({
          subjectFromId: 'source-id',
          subjectToId: 'target-id',
          overwrite: false,
        })
        fail('Should have thrown error')
      } catch (err) {
        expect(err).toBeInstanceOf(Error)
        expect((err as Error).message).toBe('Failed to copy personalized comments')
      }
    })

    it('should handle 400 validation error from backend', async () => {
      const error = new Error('Validation failed: target subject not found')
      mockApiClient.post.mockRejectedValue(error)

      await expect(
        personalizedCommentService.copy({
          subjectFromId: 'invalid-source',
          subjectToId: 'target-id',
          overwrite: false,
        }),
      ).rejects.toThrow('Failed to copy personalized comments')
    })

    it('should handle 404 not found error', async () => {
      const error = new Error('Subject not found')
      mockApiClient.post.mockRejectedValue(error)

      await expect(
        personalizedCommentService.copy({
          subjectFromId: 'source-id',
          subjectToId: 'nonexistent-id',
          overwrite: false,
        }),
      ).rejects.toThrow('Failed to copy personalized comments')
    })

    it('should handle 500 server error', async () => {
      const error = new Error('Internal server error')
      mockApiClient.post.mockRejectedValue(error)

      await expect(
        personalizedCommentService.copy({
          subjectFromId: 'source-id',
          subjectToId: 'target-id',
          overwrite: false,
        }),
      ).rejects.toThrow('Failed to copy personalized comments')
    })
  })

  describe('Edge Cases', () => {
    it('should handle large success count', async () => {
      const mockResponse: PersonalizedCommentCopyResult = {
        successCount: 1000,
        duplicateCount: 500,
        overwrite: false,
      }

      mockApiClient.post.mockResolvedValue({
        data: mockResponse,
      })

      const result = await personalizedCommentService.copy({
        subjectFromId: 'source-id',
        subjectToId: 'target-id',
        overwrite: false,
      })

      expect(result.successCount).toBe(1000)
      expect(result.duplicateCount).toBe(500)
    })

    it('should handle very long subject IDs (MongoDB ObjectIds)', async () => {
      const longId = '65a1b2c3d4e5f6g7h8i9j0k1234567890abcdef'
      const mockResponse: PersonalizedCommentCopyResult = {
        successCount: 1,
        duplicateCount: 0,
        overwrite: false,
      }

      mockApiClient.post.mockResolvedValue({
        data: mockResponse,
      })

      const result = await personalizedCommentService.copy({
        subjectFromId: longId,
        subjectToId: longId,
        overwrite: false,
      })

      expect(result).toBeDefined()
      expect(mockApiClient.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          subjectFromId: longId,
          subjectToId: longId,
        }),
      )
    })

    it('should return response without modification', async () => {
      const originalResponse: PersonalizedCommentCopyResult = {
        successCount: 7,
        duplicateCount: 3,
        overwrite: false,
      }

      mockApiClient.post.mockResolvedValue({
        data: originalResponse,
      })

      const result = await personalizedCommentService.copy({
        subjectFromId: 'source-id',
        subjectToId: 'target-id',
        overwrite: false,
      })

      // Result should be exactly the same object
      expect(result).toBe(originalResponse)
    })
  })

  describe('Multiple Concurrent Calls', () => {
    it('should handle multiple concurrent copy requests', async () => {
      const mockResponse1: PersonalizedCommentCopyResult = {
        successCount: 2,
        duplicateCount: 0,
        overwrite: false,
      }

      const mockResponse2: PersonalizedCommentCopyResult = {
        successCount: 3,
        duplicateCount: 1,
        overwrite: true,
      }

      mockApiClient.post
        .mockResolvedValueOnce({
          data: mockResponse1,
        })
        .mockResolvedValueOnce({
          data: mockResponse2,
        })

      const results = await Promise.all([
        personalizedCommentService.copy({
          subjectFromId: 'source-1',
          subjectToId: 'target-1',
          overwrite: false,
        }),
        personalizedCommentService.copy({
          subjectFromId: 'source-2',
          subjectToId: 'target-2',
          overwrite: true,
        }),
      ])

      expect(results[0]).toEqual(mockResponse1)
      expect(results[1]).toEqual(mockResponse2)
      expect(mockApiClient.post).toHaveBeenCalledTimes(2)
    })
  })

  describe('Type Safety', () => {
    it('should return a value that matches PersonalizedCommentCopyResult interface', async () => {
      const mockResponse: PersonalizedCommentCopyResult = {
        successCount: 4,
        duplicateCount: 2,
        overwrite: false,
      }

      mockApiClient.post.mockResolvedValue({
        data: mockResponse,
      })

      const result = await personalizedCommentService.copy({
        subjectFromId: 'source-id',
        subjectToId: 'target-id',
        overwrite: false,
      })

      // Verify all required properties exist and have correct types
      const typedResult: PersonalizedCommentCopyResult = result
      expect(typedResult.successCount).toBeDefined()
      expect(typedResult.duplicateCount).toBeDefined()
      expect(typedResult.overwrite).toBeDefined()
    })
  })
})
