/**
 * useSubjects Hook Tests
 * TDD: RED Phase - Tests written BEFORE implementation
 * Unit tests for hook structure and behavior with mocked service
 *
 * Key Change: Subject has no year field, so sorting is by name only
 * API Change: classService → subjectService, /class → /subject
 *
 * Note: Full integration tests with MSW will be performed at component level
 * This avoids MSW v2 + Jest ESM compatibility issues in Jest
 */
import { renderHook, waitFor, act } from '@testing-library/react'
import { useSubjects } from '../useSubjects'
import { subjectService } from '../../services/api/subjectService'
import { createMockSubject } from '../../test-utils'
import type { Subject } from '../../types'

// Mock the subjectService
jest.mock('../../services/api/subjectService')

const mockSubjectService = subjectService as jest.Mocked<typeof subjectService>

const mockSubjects = [
  createMockSubject({ id: 1, name: 'Mathematics 101' }),
  createMockSubject({ id: 2, name: 'English 201' }),
  createMockSubject({ id: 3, name: 'Science 301' }),
]

describe('useSubjects', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockSubjectService.getAll.mockResolvedValue([...mockSubjects])
  })

  describe('hook structure', () => {
    it('should return expected properties', async () => {
      const { result } = renderHook(() => useSubjects())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current).toHaveProperty('subjects')
      expect(result.current).toHaveProperty('isLoading')
      expect(result.current).toHaveProperty('error')
      expect(result.current).toHaveProperty('fetchSubjects')
      expect(result.current).toHaveProperty('createSubject')
      expect(result.current).toHaveProperty('updateSubject')
      expect(result.current).toHaveProperty('deleteSubject')
      expect(result.current).toHaveProperty('clearError')
    })

    it('should have function methods', async () => {
      const { result } = renderHook(() => useSubjects())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(typeof result.current.fetchSubjects).toBe('function')
      expect(typeof result.current.createSubject).toBe('function')
      expect(typeof result.current.updateSubject).toBe('function')
      expect(typeof result.current.deleteSubject).toBe('function')
      expect(typeof result.current.clearError).toBe('function')
    })
  })

  describe('initial state', () => {
    it('should start with empty subjects array', () => {
      // Mock that never resolves to test initial loading state before data arrives
      // This verifies the hook properly initializes with empty subjects and loading=true
      mockSubjectService.getAll.mockImplementation(
        () => new Promise(() => {}), // Never resolves - intentional for this test
      )

      const { result } = renderHook(() => useSubjects())

      expect(result.current.subjects).toEqual([])
      expect(result.current.isLoading).toBe(true)
      expect(result.current.error).toBeNull()
    })
  })

  describe('fetchSubjects', () => {
    it('should fetch subjects on mount', async () => {
      const { result } = renderHook(() => useSubjects())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(mockSubjectService.getAll).toHaveBeenCalledTimes(1)
      expect(result.current.subjects).toHaveLength(3)
    })

    it('should sort subjects by name (ascending)', async () => {
      const unsortedSubjects = [
        createMockSubject({ id: 3, name: 'Zebra Studies' }),
        createMockSubject({ id: 1, name: 'Art 101' }),
        createMockSubject({ id: 2, name: 'Biology 201' }),
      ]
      mockSubjectService.getAll.mockResolvedValue(unsortedSubjects)

      const { result } = renderHook(() => useSubjects())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // Should be sorted alphabetically by name
      expect(result.current.subjects[0].name).toBe('Art 101')
      expect(result.current.subjects[1].name).toBe('Biology 201')
      expect(result.current.subjects[2].name).toBe('Zebra Studies')
    })

    it('should handle fetch error', async () => {
      const errorMessage = 'Network error'
      mockSubjectService.getAll.mockRejectedValue(new Error(errorMessage))

      const { result } = renderHook(() => useSubjects())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.error).toBe(errorMessage)
      expect(result.current.subjects).toEqual([])
    })

    it('should set loading state during fetch', async () => {
      let resolvePromise: (value: Subject[]) => void
      mockSubjectService.getAll.mockReturnValue(
        new Promise((resolve) => {
          resolvePromise = resolve
        }),
      )

      const { result } = renderHook(() => useSubjects())

      // Initially loading
      expect(result.current.isLoading).toBe(true)

      // Resolve the promise
      act(() => {
        resolvePromise(mockSubjects)
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
    })
  })

  describe('createSubject', () => {
    it('should create subject and add to list', async () => {
      const newSubject = createMockSubject({ id: 4, name: 'History 401' })
      mockSubjectService.create.mockResolvedValue(newSubject)

      const { result } = renderHook(() => useSubjects())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // Create new subject (only name field, no year)
      await act(async () => {
        await result.current.createSubject({ name: 'History 401' })
      })

      expect(mockSubjectService.create).toHaveBeenCalledWith({ name: 'History 401' })
      expect(result.current.subjects).toHaveLength(4)
      expect(result.current.subjects.some((s) => s.id === 4)).toBe(true)
    })

    it('should maintain sort order after creation', async () => {
      const newSubject = createMockSubject({ id: 4, name: 'Art 401' })
      mockSubjectService.create.mockResolvedValue(newSubject)

      const { result } = renderHook(() => useSubjects())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      await act(async () => {
        await result.current.createSubject({ name: 'Art 401' })
      })

      // Should be sorted alphabetically
      expect(result.current.subjects[0].name).toBe('Art 401')
    })

    it('should handle creation error', async () => {
      const errorMessage = 'Duplicate subject name'
      mockSubjectService.create.mockRejectedValue(new Error(errorMessage))

      const { result } = renderHook(() => useSubjects())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      let errorCaught = false
      await act(async () => {
        try {
          await result.current.createSubject({ name: 'Math 101' })
        } catch (error) {
          errorCaught = true
          expect((error as Error).message).toBe(errorMessage)
        }
      })

      expect(errorCaught).toBe(true)
      expect(result.current.error).toBe(errorMessage)
    })
  })

  describe('updateSubject', () => {
    it('should update subject in list', async () => {
      const updatedSubject = createMockSubject({ ...mockSubjects[0], name: 'Advanced Mathematics' })
      mockSubjectService.update.mockResolvedValue(updatedSubject)

      const { result } = renderHook(() => useSubjects())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      await act(async () => {
        await result.current.updateSubject(1, { name: 'Advanced Mathematics' })
      })

      expect(mockSubjectService.update).toHaveBeenCalledWith(1, { name: 'Advanced Mathematics' })
      const updated = result.current.subjects.find((s) => s.id === 1)
      expect(updated?.name).toBe('Advanced Mathematics')
    })

    it('should maintain sort order after update', async () => {
      const updatedSubject = createMockSubject({ ...mockSubjects[0], name: 'Zebra Studies' })
      mockSubjectService.update.mockResolvedValue(updatedSubject)

      const { result } = renderHook(() => useSubjects())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      await act(async () => {
        await result.current.updateSubject(1, { name: 'Zebra Studies' })
      })

      // Should move to end after sorting
      expect(result.current.subjects[result.current.subjects.length - 1].name).toBe('Zebra Studies')
    })
  })

  describe('deleteSubject', () => {
    it('should delete subject from list', async () => {
      mockSubjectService.delete.mockResolvedValue({
        message: 'Subject deleted',
        deletedSubject: mockSubjects[0],
      })

      const { result } = renderHook(() => useSubjects())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      await act(async () => {
        await result.current.deleteSubject(1)
      })

      expect(mockSubjectService.delete).toHaveBeenCalledWith(1)
      expect(result.current.subjects).toHaveLength(2)
      expect(result.current.subjects.find((s) => s.id === 1)).toBeUndefined()
    })
  })

  describe('clearError', () => {
    it('should clear error state', async () => {
      mockSubjectService.getAll.mockRejectedValue(new Error('Test error'))

      const { result } = renderHook(() => useSubjects())

      await waitFor(() => {
        expect(result.current.error).not.toBeNull()
      })

      act(() => {
        result.current.clearError()
      })

      expect(result.current.error).toBeNull()
    })
  })
})
