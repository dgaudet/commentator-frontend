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

import type { PersonalizedComment } from '../../../types'
import { bulkSaveComments } from '../bulkSaveComments'
import { deduplicateComments } from '../deduplicateComments'

// Mock the deduplicateComments function
jest.mock('../deduplicateComments')

describe('bulkSaveComments - Story 4: Sequential Save', () => {
  const mockCreateComment = jest.fn()
  const subjectId = 'test-subject-123'
  const mockDeduplicateComments = deduplicateComments as jest.MockedFunction<
    typeof deduplicateComments
  >

  beforeEach(() => {
    jest.clearAllMocks()
    // Set up default mock behavior for Story 4 tests (pass through without dedup)
    mockDeduplicateComments.mockImplementation((comments) => ({
      unique: comments,
      duplicateCount: 0,
      removedDuplicates: [],
    }))
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

describe('bulkSaveComments - Story 2: Deduplication Integration', () => {
  const mockCreateComment = jest.fn()
  const subjectId = 'test-subject-123'
  const mockDeduplicateComments = deduplicateComments as jest.MockedFunction<
    typeof deduplicateComments
  >

  beforeEach(() => {
    jest.clearAllMocks()
    // Reset mock implementation before each test
    mockDeduplicateComments.mockReset()
  })

  describe('AC1: Call deduplication before saving', () => {
    it('should call deduplicateComments with input comments', async () => {
      const comments = [
        { text: 'Great work', rating: 5 },
        { text: 'Good effort', rating: 4 },
      ]

      mockDeduplicateComments.mockReturnValueOnce({
        unique: comments,
        duplicateCount: 0,
        removedDuplicates: [],
      })

      mockCreateComment
        .mockResolvedValueOnce({ id: 'comment-1' })
        .mockResolvedValueOnce({ id: 'comment-2' })

      await bulkSaveComments(subjectId, comments, mockCreateComment)

      expect(mockDeduplicateComments).toHaveBeenCalledWith(comments, undefined)
      expect(mockDeduplicateComments).toHaveBeenCalledTimes(1)
    })

    it('should send only unique comments to API', async () => {
      const comments = [
        { text: 'Great work', rating: 5 },
        { text: 'great work', rating: 5 }, // duplicate
        { text: 'Good effort', rating: 4 },
      ]

      const unique = [
        { text: 'Great work', rating: 5 },
        { text: 'Good effort', rating: 4 },
      ]

      mockDeduplicateComments.mockReturnValueOnce({
        unique,
        duplicateCount: 1,
        removedDuplicates: [{ text: 'great work', rating: 5 }],
      })

      mockCreateComment
        .mockResolvedValueOnce({ id: 'comment-1' })
        .mockResolvedValueOnce({ id: 'comment-2' })

      await bulkSaveComments(subjectId, comments, mockCreateComment)

      expect(mockCreateComment).toHaveBeenCalledTimes(2)
      expect(mockCreateComment).toHaveBeenNthCalledWith(1, {
        subjectId,
        comment: 'Great work',
        rating: 5,
      })
      expect(mockCreateComment).toHaveBeenNthCalledWith(2, {
        subjectId,
        comment: 'Good effort',
        rating: 4,
      })
    })
  })

  describe('AC2: Return duplicate count in result', () => {
    it('should include duplicateCount in result when duplicates removed', async () => {
      const comments = [
        { text: 'Same comment', rating: 5 },
        { text: 'same comment', rating: 5 }, // duplicate
        { text: 'Same comment', rating: 5 }, // duplicate
      ]

      mockDeduplicateComments.mockReturnValueOnce({
        unique: [{ text: 'Same comment', rating: 5 }],
        duplicateCount: 2,
        removedDuplicates: [
          { text: 'same comment', rating: 5 },
          { text: 'Same comment', rating: 5 },
        ],
      })

      mockCreateComment.mockResolvedValueOnce({ id: 'comment-1' })

      const result = await bulkSaveComments(subjectId, comments, mockCreateComment)

      expect(result).toHaveProperty('duplicateCount')
      expect(result.duplicateCount).toBe(2)
    })

    it('should return duplicateCount of 0 when no duplicates', async () => {
      const comments = [
        { text: 'Unique one', rating: 5 },
        { text: 'Unique two', rating: 4 },
      ]

      mockDeduplicateComments.mockReturnValueOnce({
        unique: comments,
        duplicateCount: 0,
        removedDuplicates: [],
      })

      mockCreateComment
        .mockResolvedValueOnce({ id: 'comment-1' })
        .mockResolvedValueOnce({ id: 'comment-2' })

      const result = await bulkSaveComments(subjectId, comments, mockCreateComment)

      expect(result.duplicateCount).toBe(0)
    })
  })

  describe('AC3: Preserve existing behavior with deduplication', () => {
    it('should still track successful saves correctly', async () => {
      const comments = [
        { text: 'Comment 1', rating: 5 },
        { text: 'comment 1', rating: 5 }, // duplicate
      ]

      mockDeduplicateComments.mockReturnValueOnce({
        unique: [{ text: 'Comment 1', rating: 5 }],
        duplicateCount: 1,
        removedDuplicates: [{ text: 'comment 1', rating: 5 }],
      })

      mockCreateComment.mockResolvedValueOnce({ id: 'comment-1' })

      const result = await bulkSaveComments(subjectId, comments, mockCreateComment)

      expect(result.successful).toHaveLength(1)
      expect(result.successful[0]).toEqual({
        text: 'Comment 1',
        rating: 5,
      })
    })

    it('should still track failed saves correctly after deduplication', async () => {
      const comments = [
        { text: 'Valid comment', rating: 5 },
        { text: 'valid comment', rating: 5 }, // duplicate
        { text: 'This will fail', rating: 4 },
      ]

      mockDeduplicateComments.mockReturnValueOnce({
        unique: [
          { text: 'Valid comment', rating: 5 },
          { text: 'This will fail', rating: 4 },
        ],
        duplicateCount: 1,
        removedDuplicates: [{ text: 'valid comment', rating: 5 }],
      })

      mockCreateComment
        .mockResolvedValueOnce({ id: 'comment-1' })
        .mockRejectedValueOnce(new Error('Character limit exceeded'))

      const result = await bulkSaveComments(subjectId, comments, mockCreateComment)

      expect(result.successful).toHaveLength(1)
      expect(result.failed).toHaveLength(1)
      expect(result.failed[0].reason).toBe('Character limit exceeded')
      expect(result.duplicateCount).toBe(1)
    })

    it('should continue saving after failures even with deduplication', async () => {
      const comments = [
        { text: 'Comment 1', rating: 5 },
        { text: 'comment 1', rating: 5 }, // duplicate
        { text: 'Comment 2', rating: 4 },
        { text: 'Comment 3', rating: 3 },
      ]

      mockDeduplicateComments.mockReturnValueOnce({
        unique: [
          { text: 'Comment 1', rating: 5 },
          { text: 'Comment 2', rating: 4 },
          { text: 'Comment 3', rating: 3 },
        ],
        duplicateCount: 1,
        removedDuplicates: [{ text: 'comment 1', rating: 5 }],
      })

      mockCreateComment
        .mockResolvedValueOnce({ id: 'comment-1' })
        .mockRejectedValueOnce(new Error('API error'))
        .mockResolvedValueOnce({ id: 'comment-3' })

      const result = await bulkSaveComments(subjectId, comments, mockCreateComment)

      expect(result.successful).toHaveLength(2)
      expect(result.failed).toHaveLength(1)
      expect(mockCreateComment).toHaveBeenCalledTimes(3)
    })
  })

  describe('AC4: totalAttempted counts original comments before dedup', () => {
    it('should set totalAttempted to original input count', async () => {
      const comments = [
        { text: 'Comment', rating: 5 },
        { text: 'comment', rating: 5 }, // duplicate
        { text: 'comment', rating: 5 }, // duplicate
      ]

      mockDeduplicateComments.mockReturnValueOnce({
        unique: [{ text: 'Comment', rating: 5 }],
        duplicateCount: 2,
        removedDuplicates: [
          { text: 'comment', rating: 5 },
          { text: 'comment', rating: 5 },
        ],
      })

      mockCreateComment.mockResolvedValueOnce({ id: 'comment-1' })

      const result = await bulkSaveComments(subjectId, comments, mockCreateComment)

      expect(result.totalAttempted).toBe(3)
    })
  })

  describe('AC5: Handle edge cases with deduplication', () => {
    it('should handle all comments being duplicates', async () => {
      const comments = [
        { text: 'Same', rating: 5 },
        { text: 'same', rating: 5 },
        { text: 'SAME', rating: 5 },
      ]

      mockDeduplicateComments.mockReturnValueOnce({
        unique: [{ text: 'Same', rating: 5 }],
        duplicateCount: 2,
        removedDuplicates: [
          { text: 'same', rating: 5 },
          { text: 'SAME', rating: 5 },
        ],
      })

      mockCreateComment.mockResolvedValueOnce({ id: 'comment-1' })

      const result = await bulkSaveComments(subjectId, comments, mockCreateComment)

      expect(result.successful).toHaveLength(1)
      expect(result.duplicateCount).toBe(2)
      expect(result.totalAttempted).toBe(3)
      expect(mockCreateComment).toHaveBeenCalledTimes(1)
    })

    it('should handle empty result after deduplication', async () => {
      const comments = [
        { text: 'test', rating: 5 },
        { text: 'test', rating: 5 },
      ]

      mockDeduplicateComments.mockReturnValueOnce({
        unique: [],
        duplicateCount: 2,
        removedDuplicates: [
          { text: 'test', rating: 5 },
          { text: 'test', rating: 5 },
        ],
      })

      const result = await bulkSaveComments(subjectId, comments, mockCreateComment)

      expect(result.successful).toHaveLength(0)
      expect(result.failed).toHaveLength(0)
      expect(result.duplicateCount).toBe(2)
      expect(result.totalAttempted).toBe(2)
      expect(mockCreateComment).toHaveBeenCalledTimes(0)
    })
  })
})

/**
 * US-1: Bulk Upload Duplicate Detection Against Existing Comments
 * NEW FEATURE: Pass existing PersonalizedComments to prevent re-importing duplicates
 */
describe('bulkSaveComments - US-1: Checking Against Existing Comments', () => {
  const mockCreateComment = jest.fn()
  const subjectId = 'test-subject-123'
  const mockDeduplicateComments = deduplicateComments as jest.MockedFunction<
    typeof deduplicateComments
  >

  beforeEach(() => {
    jest.clearAllMocks()
    mockDeduplicateComments.mockReset()
  })

  describe('AC1: Pass existing comments to deduplication', () => {
    it('should pass existingComments parameter to deduplicateComments', async () => {
      const comments = [
        { text: 'New comment', rating: 5 },
      ]

      const existingComments: PersonalizedComment[] = [
        {
          id: '1',
          subjectId: 'subject-1',
          comment: 'Old comment',
          rating: 3,
          createdAt: '2026-01-01',
          updatedAt: '2026-01-01',
        },
      ]

      mockDeduplicateComments.mockReturnValueOnce({
        unique: comments,
        duplicateCount: 0,
        removedDuplicates: [],
      })

      mockCreateComment.mockResolvedValueOnce({ id: 'comment-1' })

      await bulkSaveComments(subjectId, comments, mockCreateComment, undefined, existingComments)

      expect(mockDeduplicateComments).toHaveBeenCalledWith(comments, existingComments)
    })

    it('should handle undefined existingComments gracefully', async () => {
      const comments = [
        { text: 'Comment', rating: 5 },
      ]

      mockDeduplicateComments.mockReturnValueOnce({
        unique: comments,
        duplicateCount: 0,
        removedDuplicates: [],
      })

      mockCreateComment.mockResolvedValueOnce({ id: 'comment-1' })

      await bulkSaveComments(subjectId, comments, mockCreateComment, undefined, undefined)

      expect(mockDeduplicateComments).toHaveBeenCalledWith(comments, undefined)
    })
  })

  describe('AC2: Duplicate count includes existing duplicates', () => {
    it('should report correct duplicateCount when existing comments removed', async () => {
      const comments = [
        { text: 'New comment', rating: 5 },
        { text: 'Existing duplicate', rating: 4 },
      ]

      const existingComments: PersonalizedComment[] = [
        {
          id: '1',
          subjectId: 'subject-1',
          comment: 'Existing duplicate',
          rating: 3,
          createdAt: '2026-01-01',
          updatedAt: '2026-01-01',
        },
      ]

      // Simulate deduplication result with existing duplicate removed
      mockDeduplicateComments.mockReturnValueOnce({
        unique: [{ text: 'New comment', rating: 5 }],
        duplicateCount: 1, // One comment matched existing
        removedDuplicates: [{ text: 'Existing duplicate', rating: 4 }],
      })

      mockCreateComment.mockResolvedValueOnce({ id: 'comment-1' })

      const result = await bulkSaveComments(
        subjectId,
        comments,
        mockCreateComment,
        undefined,
        existingComments,
      )

      expect(result.duplicateCount).toBe(1)
      expect(result.successful).toHaveLength(1)
    })

    it('should handle multiple duplicates with existing comments', async () => {
      const comments = [
        { text: 'New 1', rating: 5 },
        { text: 'Dup 1', rating: 4 },
        { text: 'Dup 2', rating: 3 },
        { text: 'New 2', rating: 2 },
      ]

      const existingComments: PersonalizedComment[] = [
        {
          id: '1',
          subjectId: 'subject-1',
          comment: 'Dup 1',
          rating: 5,
          createdAt: '2026-01-01',
          updatedAt: '2026-01-01',
        },
        {
          id: '2',
          subjectId: 'subject-1',
          comment: 'Dup 2',
          rating: 5,
          createdAt: '2026-01-01',
          updatedAt: '2026-01-01',
        },
      ]

      mockDeduplicateComments.mockReturnValueOnce({
        unique: [
          { text: 'New 1', rating: 5 },
          { text: 'New 2', rating: 2 },
        ],
        duplicateCount: 2,
        removedDuplicates: [
          { text: 'Dup 1', rating: 4 },
          { text: 'Dup 2', rating: 3 },
        ],
      })

      mockCreateComment
        .mockResolvedValueOnce({ id: 'comment-1' })
        .mockResolvedValueOnce({ id: 'comment-2' })

      const result = await bulkSaveComments(
        subjectId,
        comments,
        mockCreateComment,
        undefined,
        existingComments,
      )

      expect(result.duplicateCount).toBe(2)
      expect(result.successful).toHaveLength(2)
    })
  })

  describe('AC3: Only unique comments saved to API', () => {
    it('should not save comments that are duplicates of existing', async () => {
      const comments = [
        { text: 'Duplicate', rating: 5 },
      ]

      const existingComments: PersonalizedComment[] = [
        {
          id: '1',
          subjectId: 'subject-1',
          comment: 'Duplicate',
          rating: 5,
          createdAt: '2026-01-01',
          updatedAt: '2026-01-01',
        },
      ]

      mockDeduplicateComments.mockReturnValueOnce({
        unique: [],
        duplicateCount: 1,
        removedDuplicates: [{ text: 'Duplicate', rating: 5 }],
      })

      const result = await bulkSaveComments(
        subjectId,
        comments,
        mockCreateComment,
        undefined,
        existingComments,
      )

      expect(mockCreateComment).not.toHaveBeenCalled()
      expect(result.successful).toHaveLength(0)
      expect(result.duplicateCount).toBe(1)
    })

    it('should save only non-duplicate comments', async () => {
      const comments = [
        { text: 'New comment 1', rating: 5 },
        { text: 'Duplicate', rating: 4 },
        { text: 'New comment 2', rating: 3 },
      ]

      const existingComments: PersonalizedComment[] = [
        {
          id: '1',
          subjectId: 'subject-1',
          comment: 'Duplicate',
          rating: 5,
          createdAt: '2026-01-01',
          updatedAt: '2026-01-01',
        },
      ]

      mockDeduplicateComments.mockReturnValueOnce({
        unique: [
          { text: 'New comment 1', rating: 5 },
          { text: 'New comment 2', rating: 3 },
        ],
        duplicateCount: 1,
        removedDuplicates: [{ text: 'Duplicate', rating: 4 }],
      })

      mockCreateComment
        .mockResolvedValueOnce({ id: 'comment-1' })
        .mockResolvedValueOnce({ id: 'comment-2' })

      const result = await bulkSaveComments(
        subjectId,
        comments,
        mockCreateComment,
        undefined,
        existingComments,
      )

      expect(mockCreateComment).toHaveBeenCalledTimes(2)
      expect(result.successful).toHaveLength(2)
      expect(result.duplicateCount).toBe(1)
    })
  })

  describe('AC4: Progress reporting with existing comments', () => {
    it('should report progress for non-duplicate comments only', async () => {
      const mockProgress = jest.fn()
      const comments = [
        { text: 'New comment 1', rating: 5 },
        { text: 'Duplicate', rating: 4 },
      ]

      const existingComments: PersonalizedComment[] = [
        {
          id: '1',
          subjectId: 'subject-1',
          comment: 'Duplicate',
          rating: 5,
          createdAt: '2026-01-01',
          updatedAt: '2026-01-01',
        },
      ]

      mockDeduplicateComments.mockReturnValueOnce({
        unique: [{ text: 'New comment 1', rating: 5 }],
        duplicateCount: 1,
        removedDuplicates: [{ text: 'Duplicate', rating: 4 }],
      })

      mockCreateComment.mockResolvedValueOnce({ id: 'comment-1' })

      await bulkSaveComments(
        subjectId,
        comments,
        mockCreateComment,
        mockProgress,
        existingComments,
      )

      // Progress should only be called for the 1 unique comment being saved
      expect(mockProgress).toHaveBeenCalledWith(1)
      expect(mockProgress).toHaveBeenCalledTimes(1)
    })
  })
})
