/**
 * Deduplication Utility Tests
 * Story 1: Test-Driven Development - RED Phase
 *
 * These tests define the expected behavior of the deduplicateComments function
 * before any implementation code is written.
 */

import type { ParsedComment } from '../parseComments'
import type { PersonalizedComment } from '../../../types'
import { deduplicateComments } from '../deduplicateComments'

describe('deduplicateComments', () => {
  describe('Basic Deduplication', () => {
    it('should return unique comments and duplicate count', () => {
      const comments: ParsedComment[] = [
        { text: 'Great work', rating: 5 },
        { text: 'Great work', rating: 5 },
      ]

      const result = deduplicateComments(comments)

      expect(result.unique).toHaveLength(1)
      expect(result.duplicateCount).toBe(1)
      expect(result.unique[0].text).toBe('Great work')
    })

    it('should detect exact duplicate comments', () => {
      const comments: ParsedComment[] = [
        { text: 'Excellent effort', rating: 4 },
        { text: 'Excellent effort', rating: 4 },
        { text: 'Excellent effort', rating: 4 },
      ]

      const result = deduplicateComments(comments)

      expect(result.unique).toHaveLength(1)
      expect(result.duplicateCount).toBe(2)
    })

    it('should preserve non-duplicate comments', () => {
      const comments: ParsedComment[] = [
        { text: 'Great work', rating: 5 },
        { text: 'Good effort', rating: 4 },
        { text: 'Nice try', rating: 3 },
      ]

      const result = deduplicateComments(comments)

      expect(result.unique).toHaveLength(3)
      expect(result.duplicateCount).toBe(0)
    })
  })

  describe('Case Insensitivity', () => {
    it('should treat uppercase and lowercase as duplicates', () => {
      const comments: ParsedComment[] = [
        { text: 'Great Work', rating: 5 },
        { text: 'great work', rating: 5 },
        { text: 'GREAT WORK', rating: 5 },
      ]

      const result = deduplicateComments(comments)

      expect(result.unique).toHaveLength(1)
      expect(result.duplicateCount).toBe(2)
    })

    it('should handle mixed case duplicates', () => {
      const comments: ParsedComment[] = [
        { text: 'ExCeLlEnT', rating: 5 },
        { text: 'excellent', rating: 5 },
      ]

      const result = deduplicateComments(comments)

      expect(result.unique).toHaveLength(1)
      expect(result.duplicateCount).toBe(1)
    })
  })

  describe('Whitespace Normalization', () => {
    it('should treat leading/trailing whitespace as duplicates', () => {
      const comments: ParsedComment[] = [
        { text: 'Great work', rating: 5 },
        { text: '  Great work  ', rating: 5 },
        { text: '\tGreat work\t', rating: 5 },
      ]

      const result = deduplicateComments(comments)

      expect(result.unique).toHaveLength(1)
      expect(result.duplicateCount).toBe(2)
    })

    it('should normalize internal whitespace variations', () => {
      const comments: ParsedComment[] = [
        { text: 'Great  work', rating: 5 },
        { text: 'Great work', rating: 5 },
        { text: 'Great   work', rating: 5 },
      ]

      const result = deduplicateComments(comments)

      expect(result.unique).toHaveLength(1)
      expect(result.duplicateCount).toBe(2)
    })

    it('should handle newlines and tabs in text', () => {
      const comments: ParsedComment[] = [
        { text: 'Great\nwork', rating: 5 },
        { text: 'Great work', rating: 5 },
      ]

      const result = deduplicateComments(comments)

      expect(result.unique).toHaveLength(1)
      expect(result.duplicateCount).toBe(1)
    })
  })

  describe('Order Preservation', () => {
    it('should preserve first occurrence order', () => {
      const comments: ParsedComment[] = [
        { text: 'Apple', rating: 5 },
        { text: 'Banana', rating: 4 },
        { text: 'Apple', rating: 5 },
        { text: 'Cherry', rating: 3 },
        { text: 'Banana', rating: 4 },
      ]

      const result = deduplicateComments(comments)

      expect(result.unique).toHaveLength(3)
      expect(result.unique[0].text).toBe('Apple')
      expect(result.unique[1].text).toBe('Banana')
      expect(result.unique[2].text).toBe('Cherry')
      expect(result.duplicateCount).toBe(2)
    })
  })

  describe('Rating Handling', () => {
    it('should treat same text with different ratings as duplicates', () => {
      const comments: ParsedComment[] = [
        { text: 'Great work', rating: 5 },
        { text: 'Great work', rating: 4 },
      ]

      const result = deduplicateComments(comments)

      expect(result.unique).toHaveLength(1)
      expect(result.duplicateCount).toBe(1)
      // First occurrence should be preserved
      expect(result.unique[0].rating).toBe(5)
    })

    it('should preserve original rating of first occurrence', () => {
      const comments: ParsedComment[] = [
        { text: 'Good effort', rating: 3 },
        { text: 'good effort', rating: 5 },
      ]

      const result = deduplicateComments(comments)

      expect(result.unique).toHaveLength(1)
      expect(result.unique[0].rating).toBe(3)
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty input', () => {
      const comments: ParsedComment[] = []

      const result = deduplicateComments(comments)

      expect(result.unique).toHaveLength(0)
      expect(result.duplicateCount).toBe(0)
      expect(result.removedDuplicates).toHaveLength(0)
    })

    it('should handle single comment', () => {
      const comments: ParsedComment[] = [{ text: 'Single comment', rating: 4 }]

      const result = deduplicateComments(comments)

      expect(result.unique).toHaveLength(1)
      expect(result.duplicateCount).toBe(0)
    })

    it('should handle all comments being duplicates', () => {
      const comments: ParsedComment[] = [
        { text: 'Same', rating: 5 },
        { text: 'same', rating: 5 },
        { text: 'SAME', rating: 5 },
      ]

      const result = deduplicateComments(comments)

      expect(result.unique).toHaveLength(1)
      expect(result.duplicateCount).toBe(2)
      expect(result.unique[0].text).toBe('Same')
    })

    it('should handle comments with only whitespace differences', () => {
      const comments: ParsedComment[] = [
        { text: 'test', rating: 5 },
        { text: ' test ', rating: 5 },
        { text: '   test   ', rating: 5 },
      ]

      const result = deduplicateComments(comments)

      expect(result.unique).toHaveLength(1)
      expect(result.duplicateCount).toBe(2)
    })

    it('should handle empty string comments', () => {
      const comments: ParsedComment[] = [
        { text: '', rating: 5 },
        { text: '', rating: 5 },
        { text: 'real comment', rating: 4 },
      ]

      const result = deduplicateComments(comments)

      expect(result.unique).toHaveLength(2)
      expect(result.duplicateCount).toBe(1)
    })

    it('should handle whitespace-only comments', () => {
      const comments: ParsedComment[] = [
        { text: '   ', rating: 5 },
        { text: '\t\t', rating: 5 },
      ]

      const result = deduplicateComments(comments)

      // After normalization, both become empty strings
      expect(result.unique).toHaveLength(1)
      expect(result.duplicateCount).toBe(1)
    })
  })

  describe('Return Value Structure', () => {
    it('should return correct type with all required properties', () => {
      const comments: ParsedComment[] = [
        { text: 'Test', rating: 5 },
        { text: 'test', rating: 5 },
      ]

      const result = deduplicateComments(comments)

      expect(result).toHaveProperty('unique')
      expect(result).toHaveProperty('duplicateCount')
      expect(result).toHaveProperty('removedDuplicates')
      expect(Array.isArray(result.unique)).toBe(true)
      expect(typeof result.duplicateCount).toBe('number')
      expect(Array.isArray(result.removedDuplicates)).toBe(true)
    })

    it('should provide details of removed duplicates', () => {
      const comments: ParsedComment[] = [
        { text: 'First', rating: 5 },
        { text: 'first', rating: 5 },
        { text: 'FIRST', rating: 5 },
      ]

      const result = deduplicateComments(comments)

      expect(result.removedDuplicates).toHaveLength(2)
      expect(result.removedDuplicates[0]).toEqual({ text: 'first', rating: 5 })
      expect(result.removedDuplicates[1]).toEqual({ text: 'FIRST', rating: 5 })
    })
  })

  describe('Performance', () => {
    it('should handle large datasets efficiently', () => {
      // Create 1000 comments with 100 unique values
      const comments: ParsedComment[] = []
      for (let i = 0; i < 1000; i++) {
        comments.push({
          text: `Comment ${i % 100}`,
          rating: (i % 5) + 1,
        })
      }

      const result = deduplicateComments(comments)

      // Should correctly deduplicate large dataset without errors
      expect(result.unique).toHaveLength(100)
      expect(result.duplicateCount).toBe(900)
      expect(result.removedDuplicates).toHaveLength(900)
    })
  })

  describe('Combined Scenarios', () => {
    it('should handle real-world bulk upload scenario', () => {
      const comments: ParsedComment[] = [
        { text: 'Excellent participation', rating: 5 },
        { text: 'Good effort on homework', rating: 4 },
        { text: 'excellent participation', rating: 5 },
        { text: 'Needs improvement', rating: 2 },
        { text: 'Good Effort on Homework', rating: 4 },
        { text: '  excellent participation  ', rating: 5 },
        { text: 'Good effort on homework', rating: 3 },
      ]

      const result = deduplicateComments(comments)

      // Should have 3 unique: "Excellent participation", "Good effort on homework", "Needs improvement"
      expect(result.unique).toHaveLength(3)
      expect(result.duplicateCount).toBe(4)
      expect(result.unique.map((c) => c.text)).toContain('Excellent participation')
      expect(result.unique.map((c) => c.text)).toContain('Needs improvement')
    })
  })
})

/**
 * US-1: Duplicate Detection Against Existing Comments
 * NEW FEATURE: Check uploaded comments against existing PersonalizedComments from modal state
 *
 * Acceptance Criteria:
 * - ✅ Accepts optional existingComments parameter
 * - ✅ Case-insensitive matching against existing comments
 * - ✅ Whitespace normalization before comparison
 * - ✅ Returns accurate duplicateCount when checking against existing
 * - ✅ Removes duplicates from unique array when they match existing
 * - ✅ Preserves uploaded comment order for non-duplicates
 */
describe('deduplicateComments - Checking Against Existing Comments', () => {
  describe('AC1: Basic duplicate detection against existing', () => {
    it('should detect exact match with existing comment', () => {
      const uploadedComments: ParsedComment[] = [
        { text: 'Great work', rating: 5 },
      ]

      const existingComments: PersonalizedComment[] = [
        {
          id: '1',
          subjectId: 'subject-1',
          comment: 'Great work',
          rating: 5,
          createdAt: '2026-01-01',
          updatedAt: '2026-01-01',
        },
      ]

      const result = deduplicateComments(uploadedComments, existingComments)

      expect(result.unique).toHaveLength(0)
      expect(result.duplicateCount).toBe(1)
      expect(result.removedDuplicates).toHaveLength(1)
    })

    it('should detect case-insensitive duplicates against existing', () => {
      const uploadedComments: ParsedComment[] = [
        { text: 'Great work', rating: 5 },
      ]

      const existingComments: PersonalizedComment[] = [
        {
          id: '1',
          subjectId: 'subject-1',
          comment: 'great work',
          rating: 5,
          createdAt: '2026-01-01',
          updatedAt: '2026-01-01',
        },
      ]

      const result = deduplicateComments(uploadedComments, existingComments)

      expect(result.unique).toHaveLength(0)
      expect(result.duplicateCount).toBe(1)
    })

    it('should detect duplicates with whitespace variations', () => {
      const uploadedComments: ParsedComment[] = [
        { text: '  Great work  ', rating: 5 },
      ]

      const existingComments: PersonalizedComment[] = [
        {
          id: '1',
          subjectId: 'subject-1',
          comment: 'Great work',
          rating: 5,
          createdAt: '2026-01-01',
          updatedAt: '2026-01-01',
        },
      ]

      const result = deduplicateComments(uploadedComments, existingComments)

      expect(result.unique).toHaveLength(0)
      expect(result.duplicateCount).toBe(1)
    })
  })

  describe('AC2: Preserve non-duplicates when checking existing', () => {
    it('should keep comment that does not match existing', () => {
      const uploadedComments: ParsedComment[] = [
        { text: 'New comment', rating: 5 },
      ]

      const existingComments: PersonalizedComment[] = [
        {
          id: '1',
          subjectId: 'subject-1',
          comment: 'Great work',
          rating: 5,
          createdAt: '2026-01-01',
          updatedAt: '2026-01-01',
        },
      ]

      const result = deduplicateComments(uploadedComments, existingComments)

      expect(result.unique).toHaveLength(1)
      expect(result.unique[0].text).toBe('New comment')
      expect(result.duplicateCount).toBe(0)
    })

    it('should keep multiple non-duplicate comments', () => {
      const uploadedComments: ParsedComment[] = [
        { text: 'New comment 1', rating: 5 },
        { text: 'New comment 2', rating: 4 },
        { text: 'New comment 3', rating: 3 },
      ]

      const existingComments: PersonalizedComment[] = [
        {
          id: '1',
          subjectId: 'subject-1',
          comment: 'Great work',
          rating: 5,
          createdAt: '2026-01-01',
          updatedAt: '2026-01-01',
        },
      ]

      const result = deduplicateComments(uploadedComments, existingComments)

      expect(result.unique).toHaveLength(3)
      expect(result.duplicateCount).toBe(0)
    })
  })

  describe('AC3: Mixed duplicates and new comments', () => {
    it('should filter out duplicates but keep new comments', () => {
      const uploadedComments: ParsedComment[] = [
        { text: 'Great work', rating: 5 },
        { text: 'New comment', rating: 4 },
        { text: 'great work', rating: 3 }, // duplicate
      ]

      const existingComments: PersonalizedComment[] = [
        {
          id: '1',
          subjectId: 'subject-1',
          comment: 'Great work',
          rating: 5,
          createdAt: '2026-01-01',
          updatedAt: '2026-01-01',
        },
      ]

      const result = deduplicateComments(uploadedComments, existingComments)

      expect(result.unique).toHaveLength(1)
      expect(result.unique[0].text).toBe('New comment')
      expect(result.duplicateCount).toBe(2) // One exact match with existing, one duplicate within upload
    })

    it('should handle uploaded duplicates + existing duplicates', () => {
      const uploadedComments: ParsedComment[] = [
        { text: 'Great work', rating: 5 },
        { text: 'great work', rating: 5 }, // dup within upload
        { text: 'New comment', rating: 4 },
      ]

      const existingComments: PersonalizedComment[] = [
        {
          id: '1',
          subjectId: 'subject-1',
          comment: 'Great work',
          rating: 5,
          createdAt: '2026-01-01',
          updatedAt: '2026-01-01',
        },
      ]

      const result = deduplicateComments(uploadedComments, existingComments)

      // Should have: "New comment" (the only non-duplicate)
      expect(result.unique).toHaveLength(1)
      expect(result.unique[0].text).toBe('New comment')
      // Duplicate count: 1 (from within upload: great work) + 1 (from existing: Great work)
      expect(result.duplicateCount).toBe(2)
    })
  })

  describe('AC4: Edge cases with existing comments', () => {
    it('should handle empty existing comments array', () => {
      const uploadedComments: ParsedComment[] = [
        { text: 'New comment', rating: 5 },
      ]

      const existingComments: PersonalizedComment[] = []

      const result = deduplicateComments(uploadedComments, existingComments)

      expect(result.unique).toHaveLength(1)
      expect(result.duplicateCount).toBe(0)
    })

    it('should handle no existing comments parameter', () => {
      const uploadedComments: ParsedComment[] = [
        { text: 'Comment 1', rating: 5 },
        { text: 'comment 1', rating: 5 },
      ]

      const result = deduplicateComments(uploadedComments)

      // Should only deduplicate within uploaded (existing behavior)
      expect(result.unique).toHaveLength(1)
      expect(result.duplicateCount).toBe(1)
    })

    it('should handle multiple existing comments', () => {
      const uploadedComments: ParsedComment[] = [
        { text: 'Comment 1', rating: 5 },
        { text: 'Comment 2', rating: 4 },
        { text: 'Comment 3', rating: 3 },
        { text: 'New unique', rating: 2 },
      ]

      const existingComments: PersonalizedComment[] = [
        {
          id: '1',
          subjectId: 'subject-1',
          comment: 'Comment 1',
          rating: 5,
          createdAt: '2026-01-01',
          updatedAt: '2026-01-01',
        },
        {
          id: '2',
          subjectId: 'subject-1',
          comment: 'Comment 2',
          rating: 4,
          createdAt: '2026-01-01',
          updatedAt: '2026-01-01',
        },
      ]

      const result = deduplicateComments(uploadedComments, existingComments)

      expect(result.unique).toHaveLength(2)
      expect(result.unique[0].text).toBe('Comment 3')
      expect(result.unique[1].text).toBe('New unique')
      expect(result.duplicateCount).toBe(2)
    })
  })

  describe('AC5: Rating irrelevant for duplicate detection', () => {
    it('should consider different ratings as same duplicate if text matches existing', () => {
      const uploadedComments: ParsedComment[] = [
        { text: 'Great work', rating: 3 }, // Different rating from existing
      ]

      const existingComments: PersonalizedComment[] = [
        {
          id: '1',
          subjectId: 'subject-1',
          comment: 'Great work',
          rating: 5,
          createdAt: '2026-01-01',
          updatedAt: '2026-01-01',
        },
      ]

      const result = deduplicateComments(uploadedComments, existingComments)

      // Should still be detected as duplicate despite different rating
      expect(result.unique).toHaveLength(0)
      expect(result.duplicateCount).toBe(1)
    })
  })

  describe('AC6: Performance with large existing dataset', () => {
    it('should efficiently check against many existing comments', () => {
      const uploadedComments: ParsedComment[] = [
        { text: 'New comment 1', rating: 5 },
        { text: 'New comment 2', rating: 4 },
      ]

      // Create 1000 existing comments
      const existingComments: PersonalizedComment[] = Array.from({ length: 1000 }, (_, i) => ({
        id: `existing-${i}`,
        subjectId: 'subject-1',
        comment: `Existing comment ${i}`,
        rating: (i % 5) + 1,
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
      }))

      const result = deduplicateComments(uploadedComments, existingComments)

      // New comments should not match any existing
      expect(result.unique).toHaveLength(2)
      expect(result.duplicateCount).toBe(0)
    })
  })
})
