/**
 * useClasses Hook Tests
 * Unit tests for hook structure and behavior with mocked service
 * Reference: TASK-3.1, US-CLASS-001, US-CLASS-002, DES-9
 *
 * Note: Full integration tests with MSW will be performed at component level
 * This avoids MSW v2 + Jest ESM compatibility issues in Jest
 */
import { renderHook, waitFor, act } from '@testing-library/react'
import { useClasses } from '../useClasses'
import { classService } from '../../services/api/classService'

// Mock the classService
jest.mock('../../services/api/classService')

const mockClassService = classService as jest.Mocked<typeof classService>

const mockClasses = [
  {
    id: 1,
    name: 'Mathematics 101',
    year: 2024,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 2,
    name: 'English 201',
    year: 2024,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 3,
    name: 'Science 301',
    year: 2025,
    createdAt: '2024-02-20T14:15:00Z',
    updatedAt: '2024-02-20T14:15:00Z',
  },
]

describe('useClasses', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockClassService.getAll.mockResolvedValue([...mockClasses])
  })

  describe('hook structure', () => {
    it('should return expected properties', async () => {
      const { result } = renderHook(() => useClasses())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current).toHaveProperty('classes')
      expect(result.current).toHaveProperty('isLoading')
      expect(result.current).toHaveProperty('error')
      expect(result.current).toHaveProperty('fetchClasses')
      expect(result.current).toHaveProperty('createClass')
      expect(result.current).toHaveProperty('updateClass')
      expect(result.current).toHaveProperty('deleteClass')
      expect(result.current).toHaveProperty('clearError')
    })

    it('should have function methods', async () => {
      const { result } = renderHook(() => useClasses())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(typeof result.current.fetchClasses).toBe('function')
      expect(typeof result.current.createClass).toBe('function')
      expect(typeof result.current.updateClass).toBe('function')
      expect(typeof result.current.deleteClass).toBe('function')
      expect(typeof result.current.clearError).toBe('function')
    })
  })

  describe('initialization', () => {
    it('should fetch classes on mount', async () => {
      const { result } = renderHook(() => useClasses())

      // Initially loading
      expect(result.current.isLoading).toBe(true)
      expect(result.current.classes).toEqual([])

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(mockClassService.getAll).toHaveBeenCalledTimes(1)
      expect(result.current.classes.length).toBe(3)
      expect(result.current.error).toBeNull()
    })

    it('should handle fetch errors', async () => {
      mockClassService.getAll.mockRejectedValue(new Error('Network error'))

      const { result } = renderHook(() => useClasses())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.error).toBe('Network error')
      expect(result.current.classes).toEqual([])
    })
  })

  describe('sorting', () => {
    it('should sort classes by year desc, then name asc', async () => {
      const { result } = renderHook(() => useClasses())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      const classes = result.current.classes

      // Science 301 (2025) should be first
      expect(classes[0].name).toBe('Science 301')
      expect(classes[0].year).toBe(2025)

      // English and Math (both 2024) should be sorted alphabetically
      expect(classes[1].name).toBe('English 201')
      expect(classes[2].name).toBe('Mathematics 101')
    })
  })

  describe('createClass', () => {
    it('should create class and add to list', async () => {
      const newClass = {
        id: 4,
        name: 'Physics 401',
        year: 2025,
        createdAt: '2024-03-01T10:00:00Z',
        updatedAt: '2024-03-01T10:00:00Z',
      }

      mockClassService.create.mockResolvedValue(newClass)

      const { result } = renderHook(() => useClasses())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      const initialLength = result.current.classes.length

      await act(async () => {
        await result.current.createClass({ name: 'Physics 401', year: 2025 })
      })

      expect(mockClassService.create).toHaveBeenCalledWith({
        name: 'Physics 401',
        year: 2025,
      })
      expect(result.current.classes.length).toBe(initialLength + 1)
      expect(result.current.error).toBeNull()
    })

    it('should handle create errors', async () => {
      mockClassService.create.mockRejectedValue(new Error('Validation failed'))

      const { result } = renderHook(() => useClasses())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      let errorCaught = false
      await act(async () => {
        try {
          await result.current.createClass({ name: '', year: 2024 })
        } catch (error) {
          errorCaught = true
          expect((error as Error).message).toBe('Validation failed')
        }
      })

      expect(errorCaught).toBe(true)
      expect(result.current.error).not.toBeNull()
    })
  })

  describe('updateClass', () => {
    it('should update class in list', async () => {
      const updatedClass = {
        ...mockClasses[0],
        name: 'Updated Name',
        year: 2026,
      }

      mockClassService.update.mockResolvedValue(updatedClass)

      const { result } = renderHook(() => useClasses())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      await act(async () => {
        await result.current.updateClass(1, { name: 'Updated Name', year: 2026 })
      })

      expect(mockClassService.update).toHaveBeenCalledWith(1, {
        name: 'Updated Name',
        year: 2026,
      })

      const found = result.current.classes.find((c) => c.id === 1)
      expect(found?.name).toBe('Updated Name')
      expect(result.current.error).toBeNull()
    })

    it('should handle update errors', async () => {
      mockClassService.update.mockRejectedValue(new Error('Not found'))

      const { result } = renderHook(() => useClasses())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      let errorCaught = false
      await act(async () => {
        try {
          await result.current.updateClass(999, { name: 'Test', year: 2024 })
        } catch (error) {
          errorCaught = true
          expect((error as Error).message).toBe('Not found')
        }
      })

      expect(errorCaught).toBe(true)
      expect(result.current.error).not.toBeNull()
    })
  })

  describe('deleteClass', () => {
    it('should remove class from list', async () => {
      mockClassService.delete.mockResolvedValue({
        message: 'Deleted',
        deletedClass: mockClasses[0],
      })

      const { result } = renderHook(() => useClasses())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      const initialLength = result.current.classes.length

      await act(async () => {
        await result.current.deleteClass(1)
      })

      expect(mockClassService.delete).toHaveBeenCalledWith(1)
      expect(result.current.classes.length).toBe(initialLength - 1)
      expect(result.current.classes.find((c) => c.id === 1)).toBeUndefined()
      expect(result.current.error).toBeNull()
    })

    it('should handle delete errors', async () => {
      mockClassService.delete.mockRejectedValue(new Error('Cannot delete'))

      const { result } = renderHook(() => useClasses())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      let errorCaught = false
      await act(async () => {
        try {
          await result.current.deleteClass(999)
        } catch (error) {
          errorCaught = true
          expect((error as Error).message).toBe('Cannot delete')
        }
      })

      expect(errorCaught).toBe(true)
      expect(result.current.error).not.toBeNull()
    })
  })

  describe('clearError', () => {
    it('should clear error state', async () => {
      mockClassService.getAll.mockRejectedValue(new Error('Test error'))

      const { result } = renderHook(() => useClasses())

      await waitFor(() => {
        expect(result.current.error).toBe('Test error')
      })

      act(() => {
        result.current.clearError()
      })

      expect(result.current.error).toBeNull()
    })
  })
})
