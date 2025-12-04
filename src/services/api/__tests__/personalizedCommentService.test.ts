/**
 * Personalized Comment Service Tests
 * Unit tests for personalized comment service structure and methods
 * Reference: Personalized Comments CRUD Feature
 *
 * Note: Full integration tests with MSW will be performed at the component/hook level
 * This avoids MSW v2 + Jest ESM compatibility issues when testing services in isolation
 */
import { personalizedCommentService } from '../personalizedCommentService'
import { apiClient } from '../../apiClient'
import type { InternalAxiosRequestConfig } from 'axios'

// Mock the API client to prevent actual HTTP requests
jest.mock('../../apiClient', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}))

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>

describe('PersonalizedCommentService', () => {
  it('should be defined', () => {
    expect(personalizedCommentService).toBeDefined()
  })

  describe('API methods', () => {
    it('should have getBySubjectId method', () => {
      expect(personalizedCommentService.getBySubjectId).toBeDefined()
      expect(typeof personalizedCommentService.getBySubjectId).toBe('function')
    })

    it('should have create method', () => {
      expect(personalizedCommentService.create).toBeDefined()
      expect(typeof personalizedCommentService.create).toBe('function')
    })

    it('should have update method', () => {
      expect(personalizedCommentService.update).toBeDefined()
      expect(typeof personalizedCommentService.update).toBe('function')
    })

    it('should have delete method', () => {
      expect(personalizedCommentService.delete).toBeDefined()
      expect(typeof personalizedCommentService.delete).toBe('function')
    })
  })

  describe('method signatures', () => {
    beforeEach(() => {
      // Reset all mocks and set up default return values
      jest.clearAllMocks()

      // Mock successful responses for all API methods with proper AxiosResponse structure
      mockApiClient.get.mockResolvedValue({
        data: [],
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as InternalAxiosRequestConfig,
      })
      mockApiClient.post.mockResolvedValue({
        data: { id: '65a1b2c3d4e5f6g7h8i9j0k1', comment: 'test', subjectId: '65a1b2c3d4e5f6g7h8i9j0k1', rating: 3, createdAt: '', updatedAt: '' },
        status: 201,
        statusText: 'Created',
        headers: {},
        config: {} as InternalAxiosRequestConfig,
      })
      mockApiClient.put.mockResolvedValue({
        data: { id: '65a1b2c3d4e5f6g7h8i9j0k1', comment: 'updated', subjectId: '65a1b2c3d4e5f6g7h8i9j0k1', rating: 4, createdAt: '', updatedAt: '' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as InternalAxiosRequestConfig,
      })
      mockApiClient.delete.mockResolvedValue({
        data: { success: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as InternalAxiosRequestConfig,
      })
    })

    it('getBySubjectId should accept a number parameter', async () => {
      await personalizedCommentService.getBySubjectId(1)
      expect(mockApiClient.get).toHaveBeenCalledWith('/personalized-comment?subjectId=1')
    })

    it('create should accept CreatePersonalizedCommentRequest', async () => {
      const request = {
        comment: 'Test comment',
        subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
        rating: 3,
      }
      await personalizedCommentService.create(request)
      expect(mockApiClient.post).toHaveBeenCalledWith('/personalized-comment', {
        comment: 'Test comment',
        subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
        rating: 3,
      })
    })

    it('update should accept id and UpdatePersonalizedCommentRequest', async () => {
      const request = {
        subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
        comment: 'Updated comment',
        rating: 4,
      }
      await personalizedCommentService.update(1, request)
      expect(mockApiClient.put).toHaveBeenCalledWith('/personalized-comment/1', {
        subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
        comment: 'Updated comment',
        rating: 4,
      })
    })

    it('delete should accept an id parameter', async () => {
      await personalizedCommentService.delete(1)
      expect(mockApiClient.delete).toHaveBeenCalledWith('/personalized-comment/1')
    })
  })

  describe('error handling', () => {
    it('getBySubjectId should throw error on API failure', async () => {
      mockApiClient.get.mockRejectedValue(new Error('API Error'))
      await expect(personalizedCommentService.getBySubjectId(1)).rejects.toThrow(
        'Failed to fetch personalized comments for subject',
      )
    })

    it('create should throw error on API failure', async () => {
      mockApiClient.post.mockRejectedValue(new Error('API Error'))
      await expect(
        personalizedCommentService.create({ comment: 'Test', subjectId: '65a1b2c3d4e5f6g7h8i9j0k1', rating: 3 }),
      ).rejects.toThrow('Failed to create personalized comment')
    })

    it('update should throw error on API failure', async () => {
      mockApiClient.put.mockRejectedValue(new Error('API Error'))
      await expect(
        personalizedCommentService.update(1, { subjectId: '65a1b2c3d4e5f6g7h8i9j0k1', comment: 'Updated', rating: 4 }),
      ).rejects.toThrow('Failed to update personalized comment')
    })

    it('delete should throw error on API failure', async () => {
      mockApiClient.delete.mockRejectedValue(new Error('API Error'))
      await expect(personalizedCommentService.delete(1)).rejects.toThrow(
        'Failed to delete personalized comment',
      )
    })
  })
})
