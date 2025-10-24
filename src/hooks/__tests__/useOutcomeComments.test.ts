/**
 * Tests for useOutcomeComments hook
 * Follows TDD principles and tests all CRUD operations
 */

import { renderHook, act } from '@testing-library/react'
import { useOutcomeComments } from '../useOutcomeComments'
import { outcomeCommentService } from '../../services/api/outcomeCommentService'
import type { OutcomeComment, CreateOutcomeCommentRequest, UpdateOutcomeCommentRequest } from '../../types'

// Mock the service
jest.mock('../../services/api/outcomeCommentService')
const mockOutcomeCommentService = outcomeCommentService as jest.Mocked<typeof outcomeCommentService>

describe('useOutcomeComments', () => {
  const mockComment: OutcomeComment = {
    id: 1,
    classId: 1,
    upperRange: 85,
    lowerRange: 75,
    comment: 'Test comment',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  }

  const mockCreateRequest: CreateOutcomeCommentRequest = {
    classId: 1,
    upperRange: 85,
    lowerRange: 75,
    comment: 'New comment',
  }

  const mockUpdateRequest: UpdateOutcomeCommentRequest = {
    upperRange: 90,
    lowerRange: 80,
    comment: 'Updated comment',
  }

  beforeEach(() => {
    jest.clearAllMocks()
    // Clear console.error mock
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('initial state', () => {
    it('should initialize with empty state', () => {
      const { result } = renderHook(() => useOutcomeComments())

      expect(result.current.outcomeComments).toEqual([])
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBeNull()
    })
  })

  describe('loadOutcomeComments', () => {
    it('should load outcome comments successfully', async () => {
      const comments = [mockComment]
      mockOutcomeCommentService.getByClassId.mockResolvedValue(comments)

      const { result } = renderHook(() => useOutcomeComments())

      await act(async () => {
        await result.current.loadOutcomeComments(1)
      })

      expect(mockOutcomeCommentService.getByClassId).toHaveBeenCalledWith(1)
      expect(result.current.outcomeComments).toEqual(comments)
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBeNull()
    })

    it('should handle loading state correctly', async () => {
      let resolvePromise: (value: OutcomeComment[]) => void
      const promise = new Promise<OutcomeComment[]>((resolve) => {
        resolvePromise = resolve
      })
      mockOutcomeCommentService.getByClassId.mockReturnValue(promise)

      const { result } = renderHook(() => useOutcomeComments())

      act(() => {
        result.current.loadOutcomeComments(1)
      })

      expect(result.current.loading).toBe(true)

      await act(async () => {
        resolvePromise!([mockComment])
      })

      expect(result.current.loading).toBe(false)
    })

    it('should handle errors when loading comments', async () => {
      const error = new Error('Failed to load')
      mockOutcomeCommentService.getByClassId.mockRejectedValue(error)

      const { result } = renderHook(() => useOutcomeComments())

      await act(async () => {
        await result.current.loadOutcomeComments(1)
      })

      expect(result.current.outcomeComments).toEqual([])
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe('Failed to load')
      expect(console.error).toHaveBeenCalledWith('Failed to load outcome comments:', error)
    })
  })

  describe('createComment', () => {
    it('should create comment successfully', async () => {
      mockOutcomeCommentService.create.mockResolvedValue(mockComment)

      const { result } = renderHook(() => useOutcomeComments())

      await act(async () => {
        await result.current.createComment(mockCreateRequest)
      })

      expect(mockOutcomeCommentService.create).toHaveBeenCalledWith(mockCreateRequest)
      expect(result.current.outcomeComments).toEqual([mockComment])
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBeNull()
    })

    it('should handle create errors and re-throw', async () => {
      const error = new Error('Failed to create')
      mockOutcomeCommentService.create.mockRejectedValue(error)

      const { result } = renderHook(() => useOutcomeComments())

      await act(async () => {
        await expect(result.current.createComment(mockCreateRequest)).rejects.toThrow(error)
      })

      expect(result.current.outcomeComments).toEqual([])
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe('Failed to create')
      expect(console.error).toHaveBeenCalledWith('Failed to create outcome comment:', error)
    })
  })

  describe('updateComment', () => {
    beforeEach(async () => {
      mockOutcomeCommentService.getByClassId.mockResolvedValue([mockComment])
    })

    it('should update comment successfully', async () => {
      const updatedComment = { ...mockComment, comment: 'Updated comment', upperRange: 90, lowerRange: 80 }
      mockOutcomeCommentService.update.mockResolvedValue(updatedComment)

      const { result } = renderHook(() => useOutcomeComments())

      // Load initial comments first
      await act(async () => {
        await result.current.loadOutcomeComments(1)
      })

      await act(async () => {
        await result.current.updateComment(1, mockUpdateRequest)
      })

      expect(mockOutcomeCommentService.update).toHaveBeenCalledWith(1, mockUpdateRequest)
      expect(result.current.outcomeComments).toEqual([updatedComment])
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBeNull()
    })

    it('should handle update errors and re-throw', async () => {
      const error = new Error('Failed to update')
      mockOutcomeCommentService.update.mockRejectedValue(error)

      const { result } = renderHook(() => useOutcomeComments())

      // Load initial comments first
      await act(async () => {
        await result.current.loadOutcomeComments(1)
      })

      await act(async () => {
        await expect(result.current.updateComment(1, mockUpdateRequest)).rejects.toThrow(error)
      })

      expect(result.current.outcomeComments).toEqual([mockComment]) // Unchanged
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe('Failed to update')
    })
  })

  describe('deleteComment', () => {
    beforeEach(async () => {
      mockOutcomeCommentService.getByClassId.mockResolvedValue([mockComment])
    })

    it('should delete comment successfully', async () => {
      mockOutcomeCommentService.delete.mockResolvedValue()

      const { result } = renderHook(() => useOutcomeComments())

      // Load initial comments first
      await act(async () => {
        await result.current.loadOutcomeComments(1)
      })

      await act(async () => {
        await result.current.deleteComment(1)
      })

      expect(mockOutcomeCommentService.delete).toHaveBeenCalledWith(1)
      expect(result.current.outcomeComments).toEqual([])
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBeNull()
    })

    it('should handle delete errors and re-throw', async () => {
      const error = new Error('Failed to delete')
      mockOutcomeCommentService.delete.mockRejectedValue(error)

      const { result } = renderHook(() => useOutcomeComments())

      // Load initial comments first
      await act(async () => {
        await result.current.loadOutcomeComments(1)
      })

      await act(async () => {
        await expect(result.current.deleteComment(1)).rejects.toThrow(error)
      })

      expect(result.current.outcomeComments).toEqual([mockComment]) // Unchanged
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe('Failed to delete')
    })
  })

  describe('clearError', () => {
    it('should clear error state', async () => {
      const error = new Error('Test error')
      mockOutcomeCommentService.getByClassId.mockRejectedValue(error)

      const { result } = renderHook(() => useOutcomeComments())

      // Trigger an error
      await act(async () => {
        await result.current.loadOutcomeComments(1)
      })

      expect(result.current.error).toBe('Test error')

      // Clear the error
      act(() => {
        result.current.clearError()
      })

      expect(result.current.error).toBeNull()
    })
  })
})
