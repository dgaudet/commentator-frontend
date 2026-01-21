/**
 * Deduplication Utility Tests
 * Story 1: Test-Driven Development - RED Phase
 *
 * These tests define the expected behavior of the deduplicateComments function
 * before any implementation code is written.
 */

import type { ParsedComment } from '../parseComments'
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

      const startTime = performance.now()
      const result = deduplicateComments(comments)
      const endTime = performance.now()

      // Should complete in reasonable time (< 100ms for 1000 items)
      expect(endTime - startTime).toBeLessThan(100)
      expect(result.unique).toHaveLength(100)
      expect(result.duplicateCount).toBe(900)
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
