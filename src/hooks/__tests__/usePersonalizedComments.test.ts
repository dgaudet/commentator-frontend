/**
 * Tests for usePersonalizedComments hook
 * Follows TDD principles and tests all CRUD operations
 * Simpler than useOutcomeComments - no upperRange/lowerRange fields
 */

import { renderHook, act } from '@testing-library/react'
import { usePersonalizedComments } from '../usePersonalizedComments'
import { personalizedCommentService } from '../../services/api/personalizedCommentService'
import { createMockPersonalizedComment } from '../../test-utils'
import type { CreatePersonalizedCommentRequest, UpdatePersonalizedCommentRequest } from '../../types'

// Mock the service
jest.mock('../../services/api/personalizedCommentService')
const mockPersonalizedCommentService = personalizedCommentService as jest.Mocked<typeof personalizedCommentService>

describe('usePersonalizedComments', () => {
  const mockComment = createMockPersonalizedComment({
    id: '65a1b2c3d4e5f6g7h8i9j0k1',
    subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
    comment: 'Test personalized comment',
  })

  const mockCreateRequest: CreatePersonalizedCommentRequest = {
    subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
    comment: 'New personalized comment',
  }

  const mockUpdateRequest: UpdatePersonalizedCommentRequest = {
    comment: 'Updated personalized comment',
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
      const { result } = renderHook(() => usePersonalizedComments())

      expect(result.current.personalizedComments).toEqual([])
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBeNull()
    })
  })

  describe('loadPersonalizedComments', () => {
    it('should load personalized comments successfully', async () => {
      const comments = [mockComment]
      mockPersonalizedCommentService.getBySubjectId.mockResolvedValue(comments)

      const { result } = renderHook(() => usePersonalizedComments())

      await act(async () => {
        await result.current.loadPersonalizedComments(1)
      })

      expect(mockPersonalizedCommentService.getBySubjectId).toHaveBeenCalledWith(1)
      expect(result.current.personalizedComments).toEqual(comments)
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBeNull()
    })

    it('should handle loading state correctly', async () => {
      let resolvePromise: (value: PersonalizedComment[]) => void
      const promise = new Promise<PersonalizedComment[]>((resolve) => {
        resolvePromise = resolve
      })
      mockPersonalizedCommentService.getBySubjectId.mockReturnValue(promise)

      const { result } = renderHook(() => usePersonalizedComments())

      act(() => {
        result.current.loadPersonalizedComments(1)
      })

      expect(result.current.loading).toBe(true)

      await act(async () => {
        resolvePromise!([mockComment])
      })

      expect(result.current.loading).toBe(false)
    })

    it('should handle errors when loading comments', async () => {
      const error = new Error('Failed to load')
      mockPersonalizedCommentService.getBySubjectId.mockRejectedValue(error)

      const { result } = renderHook(() => usePersonalizedComments())

      await act(async () => {
        await result.current.loadPersonalizedComments(1)
      })

      expect(result.current.personalizedComments).toEqual([])
      expect(result.current.error).toBe('Failed to load')
      expect(result.current.loading).toBe(false)
    })
  })

  describe('createComment', () => {
    it('should create a new comment successfully', async () => {
      const newComment = { ...mockComment, id: '65a1b2c3d4e5f6g7h8i9j0k2', comment: 'New personalized comment' }
      mockPersonalizedCommentService.create.mockResolvedValue(newComment)

      const { result } = renderHook(() => usePersonalizedComments())

      await act(async () => {
        await result.current.createComment(mockCreateRequest)
      })

      expect(mockPersonalizedCommentService.create).toHaveBeenCalledWith(mockCreateRequest)
      expect(result.current.personalizedComments).toEqual([newComment])
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBeNull()
    })

    it('should handle errors when creating a comment', async () => {
      const error = new Error('Failed to create')
      mockPersonalizedCommentService.create.mockRejectedValue(error)

      const { result } = renderHook(() => usePersonalizedComments())

      await act(async () => {
        try {
          await result.current.createComment(mockCreateRequest)
        } catch (e) {
          // Expected to throw
        }
      })

      expect(result.current.personalizedComments).toEqual([])
      expect(result.current.error).toBe('Failed to create')
      expect(result.current.loading).toBe(false)
    })
  })

  describe('updateComment', () => {
    it('should update a comment successfully', async () => {
      const updatedComment = { ...mockComment, comment: 'Updated personalized comment' }
      mockPersonalizedCommentService.getBySubjectId.mockResolvedValue([mockComment])
      mockPersonalizedCommentService.update.mockResolvedValue(updatedComment)

      const { result } = renderHook(() => usePersonalizedComments())

      // First load the comment
      await act(async () => {
        await result.current.loadPersonalizedComments(1)
      })

      // Then update it
      await act(async () => {
        await result.current.updateComment('65a1b2c3d4e5f6g7h8i9j0k1', mockUpdateRequest)
      })

      expect(mockPersonalizedCommentService.update).toHaveBeenCalledWith('65a1b2c3d4e5f6g7h8i9j0k1', mockUpdateRequest)
      expect(result.current.personalizedComments).toEqual([updatedComment])
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBeNull()
    })

    it('should handle errors when updating a comment', async () => {
      const error = new Error('Failed to update')
      mockPersonalizedCommentService.getBySubjectId.mockResolvedValue([mockComment])
      mockPersonalizedCommentService.update.mockRejectedValue(error)

      const { result } = renderHook(() => usePersonalizedComments())

      // First load the comment
      await act(async () => {
        await result.current.loadPersonalizedComments(1)
      })

      // Then try to update it
      await act(async () => {
        try {
          await result.current.updateComment(1, mockUpdateRequest)
        } catch (e) {
          // Expected to throw
        }
      })

      expect(result.current.error).toBe('Failed to update')
      expect(result.current.loading).toBe(false)
    })
  })

  describe('deleteComment', () => {
    it('should delete a comment successfully', async () => {
      mockPersonalizedCommentService.getBySubjectId.mockResolvedValue([mockComment])
      mockPersonalizedCommentService.delete.mockResolvedValue(undefined)

      const { result } = renderHook(() => usePersonalizedComments())

      // First load the comment
      await act(async () => {
        await result.current.loadPersonalizedComments(1)
      })

      expect(result.current.personalizedComments).toEqual([mockComment])

      // Then delete it
      await act(async () => {
        await result.current.deleteComment('65a1b2c3d4e5f6g7h8i9j0k1')
      })

      expect(mockPersonalizedCommentService.delete).toHaveBeenCalledWith('65a1b2c3d4e5f6g7h8i9j0k1')
      expect(result.current.personalizedComments).toEqual([])
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBeNull()
    })

    it('should handle errors when deleting a comment', async () => {
      const error = new Error('Failed to delete')
      mockPersonalizedCommentService.getBySubjectId.mockResolvedValue([mockComment])
      mockPersonalizedCommentService.delete.mockRejectedValue(error)

      const { result } = renderHook(() => usePersonalizedComments())

      // First load the comment
      await act(async () => {
        await result.current.loadPersonalizedComments(1)
      })

      // Then try to delete it
      await act(async () => {
        try {
          await result.current.deleteComment(1)
        } catch (e) {
          // Expected to throw
        }
      })

      expect(result.current.personalizedComments).toEqual([mockComment])
      expect(result.current.error).toBe('Failed to delete')
      expect(result.current.loading).toBe(false)
    })
  })

  describe('clearError', () => {
    it('should clear error state', async () => {
      const error = new Error('Failed to load')
      mockPersonalizedCommentService.getBySubjectId.mockRejectedValue(error)

      const { result } = renderHook(() => usePersonalizedComments())

      // Cause an error
      await act(async () => {
        await result.current.loadPersonalizedComments(1)
      })

      expect(result.current.error).toBe('Failed to load')

      // Clear the error
      act(() => {
        result.current.clearError()
      })

      expect(result.current.error).toBeNull()
    })
  })
})
