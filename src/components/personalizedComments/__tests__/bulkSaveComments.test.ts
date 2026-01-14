/**
 * bulkSaveComments - Sequential Save Tests
 * Story 4: Validate and Save Comments Sequentially
 *
 * Tests for saving parsed comments through existing API:
 * - Attempts to save each comment one-by-one
 * - Tracks successful saves separately from failures
 * - Captures error reasons from API
 * - Continues trying remaining comments even if some fail
 * - Returns comprehensive results object
 */

import { bulkSaveComments } from '../bulkSaveComments'

describe('bulkSaveComments - Story 4: Sequential Save', () => {
  const mockCreateComment = jest.fn()
  const subjectId = 'test-subject-123'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('AC1: Basic sequential save', () => {
    it('should save single comment successfully', async () => {
      mockCreateComment.mockResolvedValueOnce({ id: 'comment-1' })

      const comments = [{ text: 'test comment', rating: 3 }]
      const result = await bulkSaveComments(subjectId, comments, mockCreateComment)

      expect(result.successful).toHaveLength(1)
      expect(result.failed).toHaveLength(0)
      expect(result.totalAttempted).toBe(1)
      expect(mockCreateComment).toHaveBeenCalledWith({
        subjectId,
        comment: 'test comment',
        rating: 3,
      })
    })

    it('should save multiple comments successfully', async () => {
      mockCreateComment
        .mockResolvedValueOnce({ id: 'comment-1' })
        .mockResolvedValueOnce({ id: 'comment-2' })
        .mockResolvedValueOnce({ id: 'comment-3' })

      const comments = [
        { text: 'comment one', rating: 5 },
        { text: 'comment two', rating: 3 },
        { text: 'comment three', rating: 4 },
      ]
      const result = await bulkSaveComments(subjectId, comments, mockCreateComment)

      expect(result.successful).toHaveLength(3)
      expect(result.failed).toHaveLength(0)
      expect(result.totalAttempted).toBe(3)
      expect(mockCreateComment).toHaveBeenCalledTimes(3)
    })
  })

  describe('AC2: Failure tracking', () => {
    it('should track failed save with reason', async () => {
      mockCreateComment.mockRejectedValueOnce(new Error('exceeds character limit'))

      const comments = [{ text: 'test comment', rating: 3 }]
      const result = await bulkSaveComments(subjectId, comments, mockCreateComment)

      expect(result.successful).toHaveLength(0)
      expect(result.failed).toHaveLength(1)
      expect(result.failed[0]).toEqual({
        lineNumber: 1,
        originalText: 'test comment',
        reason: 'exceeds character limit',
      })
    })

    it('should capture line number for failed items', async () => {
      mockCreateComment
        .mockResolvedValueOnce({ id: 'comment-1' })
        .mockRejectedValueOnce(new Error('validation error'))
        .mockResolvedValueOnce({ id: 'comment-3' })

      const comments = [
        { text: 'comment one', rating: 5 },
        { text: 'comment two', rating: 3 },
        { text: 'comment three', rating: 4 },
      ]
      const result = await bulkSaveComments(subjectId, comments, mockCreateComment)

      expect(result.failed).toHaveLength(1)
      expect(result.failed[0].lineNumber).toBe(2)
    })
  })

  describe('AC3: Continue after failures', () => {
    it('should continue saving remaining comments after failure', async () => {
      mockCreateComment
        .mockResolvedValueOnce({ id: 'comment-1' })
        .mockRejectedValueOnce(new Error('exceeds character limit'))
        .mockResolvedValueOnce({ id: 'comment-3' })

      const comments = [
        { text: 'comment one', rating: 5 },
        { text: 'comment two that is very long', rating: 3 },
        { text: 'comment three', rating: 4 },
      ]
      const result = await bulkSaveComments(subjectId, comments, mockCreateComment)

      expect(result.successful).toHaveLength(2)
      expect(result.failed).toHaveLength(1)
      expect(result.totalAttempted).toBe(3)
      expect(mockCreateComment).toHaveBeenCalledTimes(3)
    })

    it('should maximize successful imports even with multiple failures', async () => {
      mockCreateComment
        .mockResolvedValueOnce({ id: 'comment-1' })
        .mockRejectedValueOnce(new Error('error 1'))
        .mockResolvedValueOnce({ id: 'comment-3' })
        .mockRejectedValueOnce(new Error('error 2'))
        .mockResolvedValueOnce({ id: 'comment-5' })

      const comments = [
        { text: 'comment 1', rating: 5 },
        { text: 'comment 2', rating: 3 },
        { text: 'comment 3', rating: 4 },
        { text: 'comment 4', rating: 2 },
        { text: 'comment 5', rating: 1 },
      ]
      const result = await bulkSaveComments(subjectId, comments, mockCreateComment)

      expect(result.successful).toHaveLength(3)
      expect(result.failed).toHaveLength(2)
      expect(result.totalAttempted).toBe(5)
    })
  })

  describe('AC4: Results format', () => {
    it('should return proper successful comment objects', async () => {
      const savedComment = { id: 'saved-1', text: 'saved comment', rating: 5 }
      mockCreateComment.mockResolvedValueOnce(savedComment)

      const comments = [{ text: 'saved comment', rating: 5 }]
      const result = await bulkSaveComments(subjectId, comments, mockCreateComment)

      expect(result.successful[0]).toEqual({
        text: 'saved comment',
        rating: 5,
      })
    })

    it('should include totalAttempted count', async () => {
      mockCreateComment
        .mockResolvedValueOnce({ id: 'comment-1' })
        .mockRejectedValueOnce(new Error('error'))
        .mockResolvedValueOnce({ id: 'comment-3' })

      const comments = [
        { text: 'comment 1', rating: 5 },
        { text: 'comment 2', rating: 3 },
        { text: 'comment 3', rating: 4 },
      ]
      const result = await bulkSaveComments(subjectId, comments, mockCreateComment)

      expect(result.totalAttempted).toBe(3)
    })
  })

  describe('AC5: API integration', () => {
    it('should pass correct subjectId to API', async () => {
      mockCreateComment.mockResolvedValueOnce({ id: 'comment-1' })

      const comments = [{ text: 'test', rating: 3 }]
      await bulkSaveComments(subjectId, comments, mockCreateComment)

      expect(mockCreateComment).toHaveBeenCalledWith(
        expect.objectContaining({
          subjectId,
        }),
      )
    })

    it('should pass correct rating to API', async () => {
      mockCreateComment.mockResolvedValueOnce({ id: 'comment-1' })

      const comments = [{ text: 'test', rating: 5 }]
      await bulkSaveComments(subjectId, comments, mockCreateComment)

      expect(mockCreateComment).toHaveBeenCalledWith(
        expect.objectContaining({
          rating: 5,
        }),
      )
    })

    it('should pass trimmed comment text to API', async () => {
      mockCreateComment.mockResolvedValueOnce({ id: 'comment-1' })

      const comments = [{ text: 'test comment', rating: 3 }]
      await bulkSaveComments(subjectId, comments, mockCreateComment)

      expect(mockCreateComment).toHaveBeenCalledWith(
        expect.objectContaining({
          comment: 'test comment',
        }),
      )
    })
  })

  describe('AC6: Error handling', () => {
    it('should handle API errors gracefully without throwing', async () => {
      mockCreateComment.mockRejectedValueOnce(new Error('Network error'))

      const comments = [{ text: 'test', rating: 3 }]
      const result = await bulkSaveComments(subjectId, comments, mockCreateComment)

      expect(result.failed).toHaveLength(1)
      expect(result.failed[0].reason).toBe('Network error')
    })

    it('should preserve error message from API', async () => {
      const errorMessage = 'Comment exceeds maximum length of 500 characters'
      mockCreateComment.mockRejectedValueOnce(new Error(errorMessage))

      const comments = [{ text: 'test', rating: 3 }]
      const result = await bulkSaveComments(subjectId, comments, mockCreateComment)

      expect(result.failed[0].reason).toBe(errorMessage)
    })

    it('should handle empty comments array', async () => {
      const result = await bulkSaveComments(subjectId, [], mockCreateComment)

      expect(result.successful).toHaveLength(0)
      expect(result.failed).toHaveLength(0)
      expect(result.totalAttempted).toBe(0)
    })
  })
})
