import { sortOutcomeCommentsByRange } from '../sortOutcomeComments'
import type { OutcomeComment } from '../../types/OutcomeComment'

describe('sortOutcomeCommentsByRange', () => {
  describe('RED Phase - Basic Sorting', () => {
    it('should sort comments by upperRange in descending order (highest first)', () => {
      const comments: OutcomeComment[] = [
        {
          id: 1,
          upperRange: 70,
          lowerRange: 60,
          comment: 'Needs improvement',
          subjectId: 1,
          createdAt: '2025-01-01T00:00:00Z',
          updatedAt: '2025-01-01T00:00:00Z',
        },
        {
          id: 2,
          upperRange: 100,
          lowerRange: 90,
          comment: 'Excellent work',
          subjectId: 1,
          createdAt: '2025-01-02T00:00:00Z',
          updatedAt: '2025-01-02T00:00:00Z',
        },
        {
          id: 3,
          upperRange: 80,
          lowerRange: 70,
          comment: 'Good job',
          subjectId: 1,
          createdAt: '2025-01-03T00:00:00Z',
          updatedAt: '2025-01-03T00:00:00Z',
        },
      ]

      const sorted = sortOutcomeCommentsByRange(comments)

      expect(sorted[0].id).toBe(2) // 100 - highest
      expect(sorted[1].id).toBe(3) // 80
      expect(sorted[2].id).toBe(1) // 70 - lowest
    })

    it('should handle a single comment', () => {
      const comments: OutcomeComment[] = [
        {
          id: 1,
          upperRange: 85,
          lowerRange: 75,
          comment: 'Average performance',
          subjectId: 1,
          createdAt: '2025-01-01T00:00:00Z',
          updatedAt: '2025-01-01T00:00:00Z',
        },
      ]

      const sorted = sortOutcomeCommentsByRange(comments)

      expect(sorted).toHaveLength(1)
      expect(sorted[0].id).toBe(1)
    })

    it('should handle an empty array', () => {
      const comments: OutcomeComment[] = []

      const sorted = sortOutcomeCommentsByRange(comments)

      expect(sorted).toHaveLength(0)
    })
  })

  describe('RED Phase - Secondary Sort (lowerRange)', () => {
    it('should sort by lowerRange descending when upperRange values are equal', () => {
      const comments: OutcomeComment[] = [
        {
          id: 1,
          upperRange: 80,
          lowerRange: 70,
          comment: 'First comment in range',
          subjectId: 1,
          createdAt: '2025-01-01T00:00:00Z',
          updatedAt: '2025-01-01T00:00:00Z',
        },
        {
          id: 2,
          upperRange: 80,
          lowerRange: 75,
          comment: 'Second comment in range',
          subjectId: 1,
          createdAt: '2025-01-02T00:00:00Z',
          updatedAt: '2025-01-02T00:00:00Z',
        },
      ]

      const sorted = sortOutcomeCommentsByRange(comments)

      expect(sorted[0].id).toBe(2) // lowerRange 75 comes first (higher)
      expect(sorted[1].id).toBe(1) // lowerRange 70 comes second (lower)
    })
  })

  describe('RED Phase - Tertiary Sort (createdAt)', () => {
    it('should sort by createdAt descending when ranges are identical', () => {
      const comments: OutcomeComment[] = [
        {
          id: 1,
          upperRange: 80,
          lowerRange: 70,
          comment: 'Created first',
          subjectId: 1,
          createdAt: '2025-01-01T00:00:00Z',
          updatedAt: '2025-01-01T00:00:00Z',
        },
        {
          id: 2,
          upperRange: 80,
          lowerRange: 70,
          comment: 'Created second',
          subjectId: 1,
          createdAt: '2025-01-02T00:00:00Z',
          updatedAt: '2025-01-02T00:00:00Z',
        },
      ]

      const sorted = sortOutcomeCommentsByRange(comments)

      expect(sorted[0].id).toBe(2) // More recent created date comes first
      expect(sorted[1].id).toBe(1) // Older created date comes second
    })
  })

  describe('RED Phase - Edge Cases', () => {
    it('should not mutate the original array', () => {
      const original: OutcomeComment[] = [
        {
          id: 1,
          upperRange: 70,
          lowerRange: 60,
          comment: 'Comment 1',
          subjectId: 1,
          createdAt: '2025-01-01T00:00:00Z',
          updatedAt: '2025-01-01T00:00:00Z',
        },
        {
          id: 2,
          upperRange: 100,
          lowerRange: 90,
          comment: 'Comment 2',
          subjectId: 1,
          createdAt: '2025-01-02T00:00:00Z',
          updatedAt: '2025-01-02T00:00:00Z',
        },
      ]

      const originalCopy = JSON.parse(JSON.stringify(original))
      const sorted = sortOutcomeCommentsByRange(original)

      expect(original).toEqual(originalCopy)
      expect(sorted).not.toBe(original)
    })

    it('should handle comments with zero ranges', () => {
      const comments: OutcomeComment[] = [
        {
          id: 1,
          upperRange: 0,
          lowerRange: 0,
          comment: 'Zero range',
          subjectId: 1,
          createdAt: '2025-01-01T00:00:00Z',
          updatedAt: '2025-01-01T00:00:00Z',
        },
        {
          id: 2,
          upperRange: 50,
          lowerRange: 40,
          comment: 'Non-zero range',
          subjectId: 1,
          createdAt: '2025-01-02T00:00:00Z',
          updatedAt: '2025-01-02T00:00:00Z',
        },
      ]

      const sorted = sortOutcomeCommentsByRange(comments)

      expect(sorted[0].id).toBe(2) // 50 is higher than 0
      expect(sorted[1].id).toBe(1)
    })

    it('should handle comments with negative ranges', () => {
      const comments: OutcomeComment[] = [
        {
          id: 1,
          upperRange: -10,
          lowerRange: -20,
          comment: 'Negative range',
          subjectId: 1,
          createdAt: '2025-01-01T00:00:00Z',
          updatedAt: '2025-01-01T00:00:00Z',
        },
        {
          id: 2,
          upperRange: 50,
          lowerRange: 40,
          comment: 'Positive range',
          subjectId: 1,
          createdAt: '2025-01-02T00:00:00Z',
          updatedAt: '2025-01-02T00:00:00Z',
        },
      ]

      const sorted = sortOutcomeCommentsByRange(comments)

      expect(sorted[0].id).toBe(2) // 50 is higher than -10
      expect(sorted[1].id).toBe(1)
    })

    it('should handle large datasets (50+ comments) efficiently', () => {
      const comments: OutcomeComment[] = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        upperRange: Math.floor(Math.random() * 100),
        lowerRange: Math.floor(Math.random() * 100),
        comment: `Comment ${i + 1}`,
        subjectId: 1,
        createdAt: new Date(2025, 0, i + 1).toISOString(),
        updatedAt: new Date(2025, 0, i + 1).toISOString(),
      }))

      const sorted = sortOutcomeCommentsByRange(comments)

      expect(sorted).toHaveLength(50)
      // Verify descending order by upperRange
      for (let i = 0; i < sorted.length - 1; i++) {
        const current = sorted[i].upperRange
        const next = sorted[i + 1].upperRange
        expect(current).toBeGreaterThanOrEqual(next)
      }
    })
  })
})
