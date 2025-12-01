/**
 * Class Service Tests
 * TDD Phase: RED - Tests written before implementation
 *
 * Tests verify all CRUD operations for Class management
 */

import { classService } from '../classService'
import { apiClient } from '../../apiClient'
import type { Class, CreateClassRequest, UpdateClassRequest } from '../../../types'

// Mock the apiClient
jest.mock('../../apiClient')
const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>

describe('classService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getBySubjectId', () => {
    it('should fetch classes for a subject successfully', async () => {
      const mockClasses: Class[] = [
        {
          id: 1,
          subjectId: 5,
          name: 'Advanced Section',
          year: 2024,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
        },
        {
          id: 2,
          subjectId: 5,
          name: 'Honors Class',
          year: 2024,
          createdAt: '2024-01-15T11:00:00Z',
          updatedAt: '2024-01-15T11:00:00Z',
        },
      ]

      mockedApiClient.get.mockResolvedValueOnce({ data: mockClasses })

      const result = await classService.getBySubjectId(5)

      expect(mockedApiClient.get).toHaveBeenCalledWith('/class?subjectId=5')
      expect(result).toEqual(mockClasses)
    })

    it('should throw error when fetch fails', async () => {
      mockedApiClient.get.mockRejectedValueOnce(new Error('Network error'))

      await expect(classService.getBySubjectId(5)).rejects.toThrow(
        'Failed to fetch classes for subject',
      )
    })

    it('should return empty array when no classes exist', async () => {
      mockedApiClient.get.mockResolvedValueOnce({ data: [] })

      const result = await classService.getBySubjectId(5)

      expect(result).toEqual([])
    })
  })

  describe('create', () => {
    it('should create a new class successfully', async () => {
      const request: CreateClassRequest = {
        subjectId: 5,
        name: 'New Class',
        year: 2024,
      }

      const mockCreatedClass: Class = {
        id: 10,
        subjectId: 5,
        name: 'New Class',
        year: 2024,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
      }

      mockedApiClient.post.mockResolvedValueOnce({ data: mockCreatedClass })

      const result = await classService.create(request)

      expect(mockedApiClient.post).toHaveBeenCalledWith('/class', request)
      expect(result).toEqual(mockCreatedClass)
    })

    it('should throw error when create fails', async () => {
      const request: CreateClassRequest = {
        subjectId: 5,
        name: 'New Class',
        year: 2024,
      }

      mockedApiClient.post.mockRejectedValueOnce(new Error('Validation error'))

      await expect(classService.create(request)).rejects.toThrow('Failed to create class')
    })

    it('should handle duplicate class error', async () => {
      const request: CreateClassRequest = {
        subjectId: 5,
        name: 'Duplicate Class',
        year: 2024,
      }

      mockedApiClient.post.mockRejectedValueOnce(new Error('Duplicate class'))

      await expect(classService.create(request)).rejects.toThrow('Failed to create class')
    })
  })

  describe('update', () => {
    it('should update an existing class successfully', async () => {
      const request: UpdateClassRequest = {
        name: 'Updated Class Name',
        year: 2025,
      }

      const mockUpdatedClass: Class = {
        id: 1,
        subjectId: 5,
        name: 'Updated Class Name',
        year: 2025,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-16T14:30:00Z',
      }

      mockedApiClient.put.mockResolvedValueOnce({ data: mockUpdatedClass })

      const result = await classService.update(1, request)

      expect(mockedApiClient.put).toHaveBeenCalledWith('/class/1', request)
      expect(result).toEqual(mockUpdatedClass)
    })

    it('should throw error when update fails', async () => {
      const request: UpdateClassRequest = {
        name: 'Updated Name',
        year: 2025,
      }

      mockedApiClient.put.mockRejectedValueOnce(new Error('Not found'))

      await expect(classService.update(1, request)).rejects.toThrow('Failed to update class')
    })

    it('should handle duplicate error on update', async () => {
      const request: UpdateClassRequest = {
        name: 'Duplicate Name',
        year: 2024,
      }

      mockedApiClient.put.mockRejectedValueOnce(new Error('Duplicate class'))

      await expect(classService.update(1, request)).rejects.toThrow('Failed to update class')
    })
  })

  describe('delete', () => {
    it('should delete a class successfully', async () => {
      mockedApiClient.delete.mockResolvedValueOnce({ data: null })

      await classService.delete(1)

      expect(mockedApiClient.delete).toHaveBeenCalledWith('/class/1')
    })

    it('should throw error when delete fails', async () => {
      mockedApiClient.delete.mockRejectedValueOnce(new Error('Not found'))

      await expect(classService.delete(1)).rejects.toThrow('Failed to delete class')
    })

    it('should throw error when trying to delete class with associated data', async () => {
      mockedApiClient.delete.mockRejectedValueOnce(
        new Error('Cannot delete class with associated data'),
      )

      await expect(classService.delete(1)).rejects.toThrow('Failed to delete class')
    })
  })
})
