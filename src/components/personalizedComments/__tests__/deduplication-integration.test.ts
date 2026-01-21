/**
 * Deduplication Feature - End-to-End Integration Tests
 * Story 4: Add Comprehensive Test Coverage
 *
 * Integration tests validating the complete deduplication workflow:
 * - Parser → Deduplication → Bulk Save → Results Display
 * - Verify no regressions in existing bulk upload functionality
 * - Test real-world scenarios and edge cases
 */

import { parseComments } from '../parseComments'
import { deduplicateComments } from '../deduplicateComments'
import { bulkSaveComments } from '../bulkSaveComments'
import type { CreatePersonalizedCommentRequest } from '../../../types'

describe('Deduplication Feature - End-to-End Integration Tests', () => {
  const subjectId = 'test-subject-123'
  const mockCreateComment = jest.fn<Promise<unknown>, [CreatePersonalizedCommentRequest]>()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('AC1: Complete workflow - Parse → Deduplicate → Save', () => {
    it('should handle complete flow from raw text to saved comments', async () => {
      // Step 1: User pastes text with duplicates
      const rawText = `Excellent participation, 5
excellent participation, 5
Good effort, 4`

      // Step 2: Parse the comments
      const parsed = parseComments(rawText)
      expect(parsed).toHaveLength(3)

      // Step 3: Bulk save with deduplication (happens internally)
      mockCreateComment
        .mockResolvedValueOnce({ id: 'comment-1' })
        .mockResolvedValueOnce({ id: 'comment-2' })

      const result = await bulkSaveComments(subjectId, parsed, mockCreateComment)

      // Verify results
      expect(result.successful).toHaveLength(2)
      expect(result.failed).toHaveLength(0)
      expect(result.duplicateCount).toBe(1)
      expect(result.totalAttempted).toBe(3)
      expect(mockCreateComment).toHaveBeenCalledTimes(2)
    })

    it('should preserve comment text and rating through entire workflow', async () => {
      const rawText = `Great job, 5
needs work, 2`

      const parsed = parseComments(rawText)

      mockCreateComment
        .mockResolvedValueOnce({ id: 'c1' })
        .mockResolvedValueOnce({ id: 'c2' })

      const result = await bulkSaveComments(subjectId, parsed, mockCreateComment)

      expect(result.successful[0]).toEqual({ text: 'Great job', rating: 5 })
      expect(result.successful[1]).toEqual({ text: 'needs work', rating: 2 })
    })
  })

  describe('AC2: Real-world scenarios', () => {
    it('should handle teacher bulk paste with accidental duplicates', async () => {
      // Scenario: Teacher copy-pasted comments from a document
      const teacherPaste = `Excellent participation
Good effort on homework
Excellent participation
Needs more practice
Good effort on homework`

      const parsed = parseComments(teacherPaste)
      expect(parsed).toHaveLength(5)

      const dedup = deduplicateComments(parsed)
      expect(dedup.unique).toHaveLength(3) // 3 unique comments
      expect(dedup.duplicateCount).toBe(2) // 2 duplicates removed

      mockCreateComment
        .mockResolvedValueOnce({ id: 'c1' })
        .mockResolvedValueOnce({ id: 'c2' })
        .mockResolvedValueOnce({ id: 'c3' })

      const result = await bulkSaveComments(subjectId, parsed, mockCreateComment)

      expect(result.successful).toHaveLength(3)
      expect(result.duplicateCount).toBe(2)
      expect(result.totalAttempted).toBe(5)
    })

    it('should handle mixed case and whitespace variations', async () => {
      const messyPaste = `  EXCELLENT WORK  
excellent work
Excellent Work
  
good effort, 4
GOOD EFFORT, 4`

      const parsed = parseComments(messyPaste)
      const dedup = deduplicateComments(parsed)

      expect(dedup.unique.length).toBeLessThan(parsed.length)
      expect(dedup.duplicateCount).toBeGreaterThan(0)
    })

    it('should handle comments with punctuation and special characters', async () => {
      const comments = `Great job! Keep it up!!
Great job! Keep it up!!
Good work...
GOOD WORK...`

      const parsed = parseComments(comments)
      const dedup = deduplicateComments(parsed)

      // Verify deduplication works with special chars
      expect(dedup.unique.length).toBeLessThan(parsed.length)
      expect(dedup.duplicateCount).toBeGreaterThan(0)
    })
  })

  describe('AC3: Error scenarios with deduplication', () => {
    it('should track failures separately from duplicates', async () => {
      const rawText = `Comment 1, 5
comment 1, 5
Comment 2, 4
Comment 3, 3`

      const parsed = parseComments(rawText)
      expect(parsed).toHaveLength(4)

      mockCreateComment
        .mockResolvedValueOnce({ id: 'c1' })
        .mockRejectedValueOnce(new Error('exceeds character limit'))
        .mockResolvedValueOnce({ id: 'c3' })

      const result = await bulkSaveComments(subjectId, parsed, mockCreateComment)

      expect(result.successful).toHaveLength(2)
      expect(result.failed).toHaveLength(1)
      expect(result.duplicateCount).toBe(1) // Still reports duplicates
      expect(result.totalAttempted).toBe(4) // Original count
    })

    it('should continue saving even when some unique comments fail', async () => {
      const rawText = `Working comment 1, 5
working comment 1, 5
Will fail, 4
Working comment 2, 3`

      const parsed = parseComments(rawText)

      mockCreateComment
        .mockResolvedValueOnce({ id: 'c1' })
        .mockRejectedValueOnce(new Error('API error'))
        .mockResolvedValueOnce({ id: 'c3' })

      const result = await bulkSaveComments(subjectId, parsed, mockCreateComment)

      expect(result.successful).toHaveLength(2)
      expect(result.failed).toHaveLength(1)
      expect(result.duplicateCount).toBe(1)
    })
  })

  describe('AC4: Progress tracking with deduplication', () => {
    it('should report progress only for unique comments processed', async () => {
      const rawText = `Comment 1, 5
comment 1, 5
comment 1, 5
Comment 2, 4`

      const parsed = parseComments(rawText)
      expect(parsed).toHaveLength(4)

      const progressUpdates: number[] = []
      mockCreateComment
        .mockResolvedValueOnce({ id: 'c1' })
        .mockResolvedValueOnce({ id: 'c2' })

      await bulkSaveComments(subjectId, parsed, mockCreateComment, (current) => {
        progressUpdates.push(current)
      })

      // Should report progress for 2 unique comments (after deduplication removed 2)
      expect(progressUpdates).toEqual([1, 2])
      expect(mockCreateComment).toHaveBeenCalledTimes(2)
    })

    it('should report total attempted as original count', async () => {
      const rawText = `Dup, 5
dup, 5
dup, 5
Unique, 4`

      const parsed = parseComments(rawText)
      mockCreateComment
        .mockResolvedValueOnce({ id: 'c1' })
        .mockResolvedValueOnce({ id: 'c2' })

      const result = await bulkSaveComments(subjectId, parsed, mockCreateComment)

      expect(result.totalAttempted).toBe(4) // Original count before dedup
      expect(mockCreateComment).toHaveBeenCalledTimes(2) // Only unique comments saved
    })
  })

  describe('AC5: Backward compatibility - non-duplicate uploads', () => {
    it('should work exactly as before when no duplicates present', async () => {
      const rawText = `Unique comment 1, 5
Unique comment 2, 4
Unique comment 3, 3`

      const parsed = parseComments(rawText)
      const dedup = deduplicateComments(parsed)

      // When no duplicates, behavior should be identical to before
      expect(dedup.unique).toHaveLength(3)
      expect(dedup.duplicateCount).toBe(0)

      mockCreateComment
        .mockResolvedValueOnce({ id: 'c1' })
        .mockResolvedValueOnce({ id: 'c2' })
        .mockResolvedValueOnce({ id: 'c3' })

      const result = await bulkSaveComments(subjectId, parsed, mockCreateComment)

      expect(result.successful).toHaveLength(3)
      expect(result.failed).toHaveLength(0)
      expect(result.duplicateCount).toBe(0)
      expect(result.totalAttempted).toBe(3)
      expect(mockCreateComment).toHaveBeenCalledTimes(3)
    })

    it('should maintain existing failure behavior', async () => {
      const rawText = `Comment 1, 5
Comment 2, 4
Comment 3, 3`

      const parsed = parseComments(rawText)

      mockCreateComment
        .mockResolvedValueOnce({ id: 'c1' })
        .mockRejectedValueOnce(new Error('Invalid rating'))
        .mockResolvedValueOnce({ id: 'c3' })

      const result = await bulkSaveComments(subjectId, parsed, mockCreateComment)

      expect(result.successful).toHaveLength(2)
      expect(result.failed).toHaveLength(1)
      expect(result.failed[0].reason).toBe('Invalid rating')
      expect(result.failed[0].originalText).toBe('Comment 2')
    })
  })

  describe('AC6: Edge cases and boundary conditions', () => {
    it('should handle all comments being identical', async () => {
      const rawText = `Same, 5
same, 5
SAME, 5
same, 5`

      const parsed = parseComments(rawText)

      mockCreateComment.mockResolvedValueOnce({ id: 'c1' })

      const result = await bulkSaveComments(subjectId, parsed, mockCreateComment)

      expect(result.successful).toHaveLength(1)
      expect(result.duplicateCount).toBe(3)
      expect(result.totalAttempted).toBe(4)
      expect(mockCreateComment).toHaveBeenCalledTimes(1)
    })

    it('should handle empty paste gracefully', async () => {
      const rawText = ''
      const parsed = parseComments(rawText)
      expect(parsed).toHaveLength(0)

      const result = await bulkSaveComments(subjectId, parsed, mockCreateComment)

      expect(result.successful).toHaveLength(0)
      expect(result.failed).toHaveLength(0)
      expect(result.totalAttempted).toBe(0)
      expect(result.duplicateCount).toBe(0)
      expect(mockCreateComment).toHaveBeenCalledTimes(0)
    })

    it('should handle single comment', async () => {
      const rawText = 'Just one comment, 5'
      const parsed = parseComments(rawText)

      mockCreateComment.mockResolvedValueOnce({ id: 'c1' })

      const result = await bulkSaveComments(subjectId, parsed, mockCreateComment)

      expect(result.successful).toHaveLength(1)
      expect(result.duplicateCount).toBe(0)
      expect(result.totalAttempted).toBe(1)
    })

    it('should handle very large number of duplicates', async () => {
      // Generate 100 comments with only 3 unique values
      const comments = []
      for (let i = 0; i < 100; i++) {
        comments.push({
          text: ['Comment A', 'Comment B', 'Comment C'][i % 3],
          rating: (i % 5) + 1,
        })
      }

      const dedup = deduplicateComments(comments)
      expect(dedup.unique).toHaveLength(3)
      expect(dedup.duplicateCount).toBe(97)

      mockCreateComment
        .mockResolvedValueOnce({ id: 'c1' })
        .mockResolvedValueOnce({ id: 'c2' })
        .mockResolvedValueOnce({ id: 'c3' })

      const result = await bulkSaveComments(subjectId, comments, mockCreateComment)

      expect(result.successful).toHaveLength(3)
      expect(result.duplicateCount).toBe(97)
      expect(result.totalAttempted).toBe(100)
      expect(mockCreateComment).toHaveBeenCalledTimes(3)
    })
  })

  describe('AC7: Data integrity', () => {
    it('should preserve original comment properties through workflow', async () => {
      const parsed = [
        { text: 'First comment', rating: 5 },
        { text: 'first comment', rating: 5 },
        { text: 'Second comment', rating: 3 },
      ]

      mockCreateComment
        .mockResolvedValueOnce({ id: 'c1' })
        .mockResolvedValueOnce({ id: 'c2' })

      const result = await bulkSaveComments(subjectId, parsed, mockCreateComment)

      // Verify saved comments match original data
      expect(result.successful[0]).toEqual({ text: 'First comment', rating: 5 })
      expect(result.successful[1]).toEqual({ text: 'Second comment', rating: 3 })
    })

    it('should preserve rating distinction when text is identical', async () => {
      const parsed = [
        { text: 'Good work', rating: 5 },
        { text: 'good work', rating: 4 },
        { text: 'good work', rating: 3 },
      ]

      const dedup = deduplicateComments(parsed)

      // All are duplicates (text is same), only first is kept
      expect(dedup.unique).toHaveLength(1)
      expect(dedup.unique[0].rating).toBe(5) // First occurrence preserved

      mockCreateComment.mockResolvedValueOnce({ id: 'c1' })

      const result = await bulkSaveComments(subjectId, parsed, mockCreateComment)

      expect(result.successful[0].rating).toBe(5)
    })
  })

  describe('AC8: Regression - existing bulk upload tests', () => {
    it('should handle all API success scenario', async () => {
      const parsed = [
        { text: 'Comment 1', rating: 5 },
        { text: 'Comment 2', rating: 4 },
      ]

      mockCreateComment
        .mockResolvedValueOnce({ id: 'c1' })
        .mockResolvedValueOnce({ id: 'c2' })

      const result = await bulkSaveComments(subjectId, parsed, mockCreateComment)

      expect(result.successful).toHaveLength(2)
      expect(result.failed).toHaveLength(0)
      expect(mockCreateComment).toHaveBeenCalledTimes(2)
    })

    it('should handle partial API failure scenario', async () => {
      const parsed = [
        { text: 'Comment 1', rating: 5 },
        { text: 'Comment 2', rating: 4 },
        { text: 'Comment 3', rating: 3 },
      ]

      mockCreateComment
        .mockResolvedValueOnce({ id: 'c1' })
        .mockRejectedValueOnce(new Error('API error'))
        .mockResolvedValueOnce({ id: 'c3' })

      const result = await bulkSaveComments(subjectId, parsed, mockCreateComment)

      expect(result.successful).toHaveLength(2)
      expect(result.failed).toHaveLength(1)
      expect(mockCreateComment).toHaveBeenCalledTimes(3)
    })

    it('should handle all API failure scenario', async () => {
      const parsed = [
        { text: 'CommentA', rating: 5 },
        { text: 'CommentB', rating: 4 },
      ]

      mockCreateComment
        .mockRejectedValueOnce(new Error('API error 1'))
        .mockRejectedValueOnce(new Error('API error 2'))

      const result = await bulkSaveComments(subjectId, parsed, mockCreateComment)

      expect(result.successful).toHaveLength(0)
      expect(result.failed).toHaveLength(2)
      expect(mockCreateComment).toHaveBeenCalledTimes(2)
    })
  })
})
