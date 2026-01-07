/**
 * Outcome Comment Service Tests
 * Unit tests for outcome comment service structure and methods
 * Reference: Outcome Comments CRUD Feature
 *
 * Note: Full integration tests with MSW will be performed at the component/hook level
 * This avoids MSW v2 + Jest ESM compatibility issues when testing services in isolation
 */
import { outcomeCommentService } from '../outcomeCommentService'
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

describe('OutcomeCommentService', () => {
  it('should be defined', () => {
    expect(outcomeCommentService).toBeDefined()
  })

  describe('API methods', () => {
    it('should have getBySubjectId method', () => {
      expect(outcomeCommentService.getBySubjectId).toBeDefined()
      expect(typeof outcomeCommentService.getBySubjectId).toBe('function')
    })

    it('should have create method', () => {
      expect(outcomeCommentService.create).toBeDefined()
      expect(typeof outcomeCommentService.create).toBe('function')
    })

    it('should have update method', () => {
      expect(outcomeCommentService.update).toBeDefined()
      expect(typeof outcomeCommentService.update).toBe('function')
    })

    it('should have delete method', () => {
      expect(outcomeCommentService.delete).toBeDefined()
      expect(typeof outcomeCommentService.delete).toBe('function')
    })
  })

  describe('method signatures', () => {
    beforeEach(() => {
      // Reset all mocks and set up default return values
      jest.clearAllMocks()

      // Mock successful responses for all API methods with proper AxiosResponse structure
      mockApiClient.get.mockResolvedValue({
        data: { data: [], success: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as InternalAxiosRequestConfig,
      })
      mockApiClient.post.mockResolvedValue({
        data: { data: { id: '65a1b2c3d4e5f6g7h8i9j0k1', comment: 'test' }, success: true },
        status: 201,
        statusText: 'Created',
        headers: {},
        config: {} as InternalAxiosRequestConfig,
      })
      mockApiClient.put.mockResolvedValue({
        data: { data: { id: '65a1b2c3d4e5f6g7h8i9j0k1', comment: 'updated' }, success: true },
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

    it('getBySubjectId should accept number parameter', async () => {
      const result = await outcomeCommentService.getBySubjectId('1')
      expect(result).toBeDefined()
      expect(mockApiClient.get).toHaveBeenCalledWith('/outcome-comment?subjectId=1')
    })

    it('create should accept request object', async () => {
      const request = {
        subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
        comment: 'Test comment',
        upperRange: 85,
        lowerRange: 70,
      }
      const result = await outcomeCommentService.create(request)
      expect(result).toBeDefined()
      expect(mockApiClient.post).toHaveBeenCalledWith(
        '/outcome-comment',
        {
          subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
          comment: 'Test comment',
          upperRange: 85,
          lowerRange: 70,
        },
      )
    })

    it('update should accept request object', async () => {
      const request = {
        comment: 'Updated comment',
        upperRange: 90,
        lowerRange: 75,
      }
      const result = await outcomeCommentService.update('1', request)
      expect(result).toBeDefined()
      expect(mockApiClient.put).toHaveBeenCalledWith('/outcome-comment/1', request)
    })

    it('delete should accept number parameter', async () => {
      await outcomeCommentService.delete('1')
      expect(mockApiClient.delete).toHaveBeenCalledWith('/outcome-comment/1')
    })
  })
})

// Note: Integration tests validating actual API behavior with MSW handlers
// will be performed in:
// - OutcomeCommentsModal component tests (tests full integration)
// This approach avoids MSW v2 ESM compatibility issues in Jest
