/**
 * Final Comment Service Tests
 * TDD Phase: RED - Writing failing tests before implementation
 * Unit tests for final comment service structure and methods
 * Reference: US-FINAL-001, US-FINAL-002, US-FINAL-003
 *
 * Note: Full integration tests with MSW will be performed at the component/hook level
 * This avoids MSW v2 + Jest ESM compatibility issues when testing services in isolation
 */
import { finalCommentService } from '../finalCommentService'
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

describe('FinalCommentService', () => {
  it('should be defined', () => {
    expect(finalCommentService).toBeDefined()
  })

  describe('API methods', () => {
    it('should have getByClassId method', () => {
      expect(finalCommentService.getByClassId).toBeDefined()
      expect(typeof finalCommentService.getByClassId).toBe('function')
    })

    it('should have create method', () => {
      expect(finalCommentService.create).toBeDefined()
      expect(typeof finalCommentService.create).toBe('function')
    })

    it('should have update method', () => {
      expect(finalCommentService.update).toBeDefined()
      expect(typeof finalCommentService.update).toBe('function')
    })

    it('should have delete method', () => {
      expect(finalCommentService.delete).toBeDefined()
      expect(typeof finalCommentService.delete).toBe('function')
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
        data: { data: { id: '65a1b2c3d4e5f6g7h8i9j0k1', firstName: 'John', lastName: 'Doe', grade: 85, classId: 1 }, success: true },
        status: 201,
        statusText: 'Created',
        headers: {},
        config: {} as InternalAxiosRequestConfig,
      })
      mockApiClient.put.mockResolvedValue({
        data: { data: { id: '65a1b2c3d4e5f6g7h8i9j0k1', firstName: 'Jane', lastName: 'Smith', grade: 90, classId: 1 }, success: true },
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

    it('getByClassId should accept number parameter and call GET with classId query', async () => {
      const result = await finalCommentService.getByClassId(42)
      expect(result).toBeDefined()
      expect(mockApiClient.get).toHaveBeenCalledWith('/final-comment?classId=42')
    })

    it('create should accept request object with all required fields', async () => {
      const request = {
        classId: '75a1b2c3d4e5f6g7h8i9j0k1',
        firstName: 'John',
        lastName: 'Doe',
        grade: 85,
        comment: 'Excellent work this semester!',
      }
      const result = await finalCommentService.create(request)
      expect(result).toBeDefined()
      expect(mockApiClient.post).toHaveBeenCalledWith('/final-comment', request)
    })

    it('create should accept request object with optional lastName omitted', async () => {
      const request = {
        classId: '75a1b2c3d4e5f6g7h8i9j0k1',
        firstName: 'John',
        grade: 85,
      }
      const result = await finalCommentService.create(request)
      expect(result).toBeDefined()
      expect(mockApiClient.post).toHaveBeenCalledWith('/final-comment', request)
    })

    it('create should accept request object with optional comment omitted', async () => {
      const request = {
        classId: '75a1b2c3d4e5f6g7h8i9j0k1',
        firstName: 'John',
        lastName: 'Doe',
        grade: 85,
      }
      const result = await finalCommentService.create(request)
      expect(result).toBeDefined()
      expect(mockApiClient.post).toHaveBeenCalledWith('/final-comment', request)
    })

    it('update should accept id and request object', async () => {
      const request = {
        classId: '75a1b2c3d4e5f6g7h8i9j0k1',
        firstName: 'Jane',
        lastName: 'Smith',
        grade: 90,
        comment: 'Improved significantly!',
      }
      const result = await finalCommentService.update(5, request)
      expect(result).toBeDefined()
      expect(mockApiClient.put).toHaveBeenCalledWith('/final-comment/5', request)
    })

    it('delete should accept number parameter', async () => {
      await finalCommentService.delete(7)
      expect(mockApiClient.delete).toHaveBeenCalledWith('/final-comment/7')
    })
  })
})

// Note: Integration tests validating actual API behavior with MSW handlers
// will be performed in:
// - FinalCommentsModal component tests (tests full integration)
// This approach avoids MSW v2 ESM compatibility issues in Jest
