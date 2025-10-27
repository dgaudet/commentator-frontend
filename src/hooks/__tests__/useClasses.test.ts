/**
 * useClasses Hook Tests
 * TDD Phase: RED - Tests written before implementation
 *
 * Tests verify custom hook for Class state management and CRUD operations
 */

import { renderHook, act, waitFor } from '@testing-library/react'
import { useClasses } from '../useClasses'
import { classService } from '../../services/api/classService'
import type { Class, CreateClassRequest, UpdateClassRequest } from '../../types'

// Mock the classService
jest.mock('../../services/api/classService')
const mockedClassService = classService as jest.Mocked<typeof classService>

describe('useClasses', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Initial State', () => {
    it('should initialize with empty classes array', () => {
      const { result } = renderHook(() => useClasses())

      expect(result.current.classes).toEqual([])
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBeNull()
    })
  })

  describe('loadClasses', () => {
    it('should load classes for a subject successfully', async () => {
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

      mockedClassService.getBySubjectId.mockResolvedValueOnce(mockClasses)

      const { result } = renderHook(() => useClasses())

      // Loading should be false initially
      expect(result.current.loading).toBe(false)

      // Trigger load
      act(() => {
        void result.current.loadClasses(5)
      })

      // Should be loading now
      expect(result.current.loading).toBe(true)

      // Wait for async operation
      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.classes).toEqual(mockClasses)
      expect(result.current.error).toBeNull()
      expect(mockedClassService.getBySubjectId).toHaveBeenCalledWith(5)
    })

    it('should handle load errors', async () => {
      const error = new Error('Failed to fetch classes for subject')
      mockedClassService.getBySubjectId.mockRejectedValueOnce(error)

      const { result } = renderHook(() => useClasses())

      act(() => {
        void result.current.loadClasses(5)
      })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.error).toBe('Failed to fetch classes for subject')
      expect(result.current.classes).toEqual([])
    })
  })

  describe('createClass', () => {
    it('should create a new class successfully', async () => {
      const request: CreateClassRequest = {
        subjectId: 5,
        name: 'New Class',
        year: 2024,
      }

      const newClass: Class = {
        id: 10,
        subjectId: 5,
        name: 'New Class',
        year: 2024,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
      }

      mockedClassService.create.mockResolvedValueOnce(newClass)

      const { result } = renderHook(() => useClasses())

      await act(async () => {
        await result.current.createClass(request)
      })

      expect(result.current.classes).toContainEqual(newClass)
      expect(result.current.error).toBeNull()
      expect(mockedClassService.create).toHaveBeenCalledWith(request)
    })

    it('should handle create errors and re-throw', async () => {
      const request: CreateClassRequest = {
        subjectId: 5,
        name: 'Duplicate Class',
        year: 2024,
      }

      const error = new Error('Failed to create class')
      mockedClassService.create.mockRejectedValueOnce(error)

      const { result } = renderHook(() => useClasses())

      await act(async () => {
        try {
          await result.current.createClass(request)
        } catch (e) {
          // Expected to throw
        }
      })

      expect(result.current.error).toBe('Failed to create class')
      expect(result.current.classes).toEqual([])
      expect(result.current.loading).toBe(false)
    })
  })

  describe('updateClass', () => {
    it('should update an existing class successfully', async () => {
      const existingClass: Class = {
        id: 1,
        subjectId: 5,
        name: 'Old Name',
        year: 2024,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
      }

      const request: UpdateClassRequest = {
        name: 'Updated Name',
        year: 2025,
      }

      const updatedClass: Class = {
        ...existingClass,
        ...request,
        updatedAt: '2024-01-16T14:30:00Z',
      }

      mockedClassService.update.mockResolvedValueOnce(updatedClass)

      const { result } = renderHook(() => useClasses())

      // Set initial classes
      act(() => {
        result.current['classes'] = [existingClass]
      })

      // Manually set the initial state by simulating a load
      mockedClassService.getBySubjectId.mockResolvedValueOnce([existingClass])
      await act(async () => {
        await result.current.loadClasses(5)
      })

      // Now update
      await act(async () => {
        await result.current.updateClass(1, request)
      })

      expect(result.current.classes).toContainEqual(updatedClass)
      expect(result.current.classes).not.toContainEqual(existingClass)
      expect(result.current.error).toBeNull()
      expect(mockedClassService.update).toHaveBeenCalledWith(1, request)
    })

    it('should handle update errors and re-throw', async () => {
      const request: UpdateClassRequest = {
        name: 'Duplicate Name',
        year: 2024,
      }

      const error = new Error('Failed to update class')
      mockedClassService.update.mockRejectedValueOnce(error)

      const { result } = renderHook(() => useClasses())

      await act(async () => {
        try {
          await result.current.updateClass(1, request)
        } catch (e) {
          // Expected to throw
        }
      })

      expect(result.current.error).toBe('Failed to update class')
      expect(result.current.loading).toBe(false)
    })
  })

  describe('deleteClass', () => {
    it('should delete a class successfully', async () => {
      const classToDelete: Class = {
        id: 1,
        subjectId: 5,
        name: 'Class to Delete',
        year: 2024,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
      }

      mockedClassService.delete.mockResolvedValueOnce()
      mockedClassService.getBySubjectId.mockResolvedValueOnce([classToDelete])

      const { result } = renderHook(() => useClasses())

      // Load initial classes
      await act(async () => {
        await result.current.loadClasses(5)
      })

      expect(result.current.classes).toContainEqual(classToDelete)

      // Delete the class
      await act(async () => {
        await result.current.deleteClass(1)
      })

      expect(result.current.classes).not.toContainEqual(classToDelete)
      expect(result.current.classes).toHaveLength(0)
      expect(result.current.error).toBeNull()
      expect(mockedClassService.delete).toHaveBeenCalledWith(1)
    })

    it('should handle delete errors and re-throw', async () => {
      const error = new Error('Failed to delete class')
      mockedClassService.delete.mockRejectedValueOnce(error)

      const { result } = renderHook(() => useClasses())

      await act(async () => {
        try {
          await result.current.deleteClass(1)
        } catch (e) {
          // Expected to throw
        }
      })

      expect(result.current.error).toBe('Failed to delete class')
      expect(result.current.loading).toBe(false)
    })
  })

  describe('clearError', () => {
    it('should clear the error state', async () => {
      const error = new Error('Some error')
      mockedClassService.getBySubjectId.mockRejectedValueOnce(error)

      const { result } = renderHook(() => useClasses())

      // Trigger an error
      act(() => {
        void result.current.loadClasses(5)
      })

      await waitFor(() => {
        expect(result.current.error).not.toBeNull()
      })

      // Clear the error
      act(() => {
        result.current.clearError()
      })

      expect(result.current.error).toBeNull()
    })
  })
})
