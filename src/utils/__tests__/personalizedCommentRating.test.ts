/**
 * Personalized Comment Rating Utility Tests
 * TDD Phase: RED - Writing failing tests first
 * Reference: US-RATING-001, US-RATING-004, US-RATING-009
 *
 * Testing rating utility functions:
 * - getNormalizedRating: Default null/undefined ratings to 3
 * - getRatingEmoji: Map rating (1-5) to emoji
 * - getRatingLabel: Map rating (1-5) to accessibility label
 * - sortPersonalizedCommentsByRating: Sort by rating desc, then alphabetically
 */

import {
  getNormalizedRating,
  getRatingEmoji,
  getRatingLabel,
  sortPersonalizedCommentsByRating,
} from '../personalizedCommentRating'
import type { PersonalizedComment } from '../../types/PersonalizedComment'

describe('getNormalizedRating', () => {
  it('returns the rating when defined', () => {
    const comment: PersonalizedComment = {
      id: '65a1b2c3d4e5f6g7h8i9j0k1',
      comment: 'Great work',
      subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
      rating: 5,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
    }

    expect(getNormalizedRating(comment)).toBe(5)
  })

  it('defaults to 3 when rating is null', () => {
    const comment: PersonalizedComment = {
      id: '65a1b2c3d4e5f6g7h8i9j0k1',
      comment: 'Okay work',
      subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
      rating: null,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
    }

    expect(getNormalizedRating(comment)).toBe(3)
  })

  it('defaults to 3 when rating is undefined', () => {
    const comment: PersonalizedComment = {
      id: '65a1b2c3d4e5f6g7h8i9j0k1',
      comment: 'No rating yet',
      subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
    }

    expect(getNormalizedRating(comment)).toBe(3)
  })

  it('returns 0 when rating is 0 (valid edge case)', () => {
    const comment: PersonalizedComment = {
      id: '65a1b2c3d4e5f6g7h8i9j0k1',
      comment: 'Zero rating',
      subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
      rating: 0,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
    }

    expect(getNormalizedRating(comment)).toBe(0)
  })
})

describe('getRatingEmoji', () => {
  it('returns 😢 for rating 1 (Very Negative)', () => {
    expect(getRatingEmoji(1)).toBe('😢')
  })

  it('returns 😟 for rating 2 (Negative)', () => {
    expect(getRatingEmoji(2)).toBe('😟')
  })

  it('returns 😐 for rating 3 (Neutral)', () => {
    expect(getRatingEmoji(3)).toBe('😐')
  })

  it('returns 🙂 for rating 4 (Positive)', () => {
    expect(getRatingEmoji(4)).toBe('🙂')
  })

  it('returns 😊 for rating 5 (Very Positive)', () => {
    expect(getRatingEmoji(5)).toBe('😊')
  })

  it('returns 😐 (Neutral) for rating 0 (fallback)', () => {
    expect(getRatingEmoji(0)).toBe('😐')
  })

  it('returns 😐 (Neutral) for negative rating (fallback)', () => {
    expect(getRatingEmoji(-1)).toBe('😐')
  })

  it('returns 😐 (Neutral) for rating > 5 (fallback)', () => {
    expect(getRatingEmoji(6)).toBe('😐')
    expect(getRatingEmoji(10)).toBe('😐')
  })

  it('rounds decimal ratings to nearest integer emoji', () => {
    expect(getRatingEmoji(1.4)).toBe('😢') // Rounds to 1
    expect(getRatingEmoji(1.6)).toBe('😟') // Rounds to 2
    expect(getRatingEmoji(3.5)).toBe('🙂') // Rounds to 4
    expect(getRatingEmoji(4.8)).toBe('😊') // Rounds to 5
  })
})

describe('getRatingLabel', () => {
  it('returns "Very Negative" for rating 1', () => {
    expect(getRatingLabel(1)).toBe('Very Negative')
  })

  it('returns "Negative" for rating 2', () => {
    expect(getRatingLabel(2)).toBe('Negative')
  })

  it('returns "Neutral" for rating 3', () => {
    expect(getRatingLabel(3)).toBe('Neutral')
  })

  it('returns "Positive" for rating 4', () => {
    expect(getRatingLabel(4)).toBe('Positive')
  })

  it('returns "Very Positive" for rating 5', () => {
    expect(getRatingLabel(5)).toBe('Very Positive')
  })

  it('returns "Neutral" for rating 0 (fallback)', () => {
    expect(getRatingLabel(0)).toBe('Neutral')
  })

  it('returns "Neutral" for negative rating (fallback)', () => {
    expect(getRatingLabel(-1)).toBe('Neutral')
  })

  it('returns "Neutral" for rating > 5 (fallback)', () => {
    expect(getRatingLabel(6)).toBe('Neutral')
    expect(getRatingLabel(10)).toBe('Neutral')
  })

  it('rounds decimal ratings to nearest integer label', () => {
    expect(getRatingLabel(1.4)).toBe('Very Negative') // Rounds to 1
    expect(getRatingLabel(1.6)).toBe('Negative') // Rounds to 2
    expect(getRatingLabel(3.5)).toBe('Positive') // Rounds to 4
    expect(getRatingLabel(4.8)).toBe('Very Positive') // Rounds to 5
  })
})

describe('sortPersonalizedCommentsByRating', () => {
  const createComment = (
    id: number,
    comment: string,
    rating?: number | null,
  ): PersonalizedComment => ({
    id: String(id),
    comment,
    subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
    rating: rating === undefined ? undefined : rating,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  })

  it('sorts comments by rating descending (5 → 1)', () => {
    const comments: PersonalizedComment[] = [
      createComment(1, 'Comment A', 1),
      createComment(2, 'Comment B', 5),
      createComment(3, 'Comment C', 3),
      createComment(4, 'Comment D', 4),
      createComment(5, 'Comment E', 2),
    ]

    const sorted = sortPersonalizedCommentsByRating(comments)

    expect(sorted.map((c) => c.rating)).toEqual([5, 4, 3, 2, 1])
    expect(sorted.map((c) => c.id)).toEqual([2, 4, 3, 5, 1])
  })

  it('sorts comments with same rating alphabetically by comment text', () => {
    const comments: PersonalizedComment[] = [
      createComment(1, 'Zebra comment', 4),
      createComment(2, 'Apple comment', 4),
      createComment(3, 'Banana comment', 4),
    ]

    const sorted = sortPersonalizedCommentsByRating(comments)

    expect(sorted.map((c) => c.comment)).toEqual([
      'Apple comment',
      'Banana comment',
      'Zebra comment',
    ])
  })

  it('treats null ratings as 3 (Neutral) for sorting', () => {
    const comments: PersonalizedComment[] = [
      createComment(1, 'No rating', null),
      createComment(2, 'Rating 5', 5),
      createComment(3, 'Rating 1', 1),
    ]

    const sorted = sortPersonalizedCommentsByRating(comments)

    expect(sorted.map((c) => c.id)).toEqual([2, 1, 3]) // 5, 3 (null), 1
  })

  it('treats undefined ratings as 3 (Neutral) for sorting', () => {
    const comments: PersonalizedComment[] = [
      createComment(1, 'No rating'),
      createComment(2, 'Rating 5', 5),
      createComment(3, 'Rating 1', 1),
    ]

    const sorted = sortPersonalizedCommentsByRating(comments)

    expect(sorted.map((c) => c.id)).toEqual([2, 1, 3]) // 5, 3 (undefined), 1
  })

  it('sorts mixed ratings and null/undefined correctly', () => {
    const comments: PersonalizedComment[] = [
      createComment(1, 'B comment', null),
      createComment(2, 'A comment'),
      createComment(3, 'Rating 5', 5),
      createComment(4, 'Rating 1', 1),
      createComment(5, 'C comment', 3),
    ]

    const sorted = sortPersonalizedCommentsByRating(comments)

    // Expected order:
    // 1. Rating 5 (id: 3)
    // 2-4. Rating 3 group (null, undefined, explicit 3) sorted alphabetically:
    //      - "A comment" (id: '65a1b2c3d4e5f6g7h8i9j0k2', undefined rating = 3)
    //      - "B comment" (id: '65a1b2c3d4e5f6g7h8i9j0k1', null rating = 3)
    //      - "C comment" (id: '65a1b2c3d4e5f6g7h8i9j0k5', rating = 3)
    // 5. Rating 1 (id: 4)
    expect(sorted.map((c) => c.id)).toEqual([3, 2, 1, 5, 4])
  })

  it('returns empty array for empty input', () => {
    const comments: PersonalizedComment[] = []
    const sorted = sortPersonalizedCommentsByRating(comments)

    expect(sorted).toEqual([])
  })

  it('returns single comment unchanged', () => {
    const comments: PersonalizedComment[] = [createComment(1, 'Only comment', 4)]
    const sorted = sortPersonalizedCommentsByRating(comments)

    expect(sorted).toEqual(comments)
  })

  it('does not mutate original array', () => {
    const comments: PersonalizedComment[] = [
      createComment(1, 'Comment A', 1),
      createComment(2, 'Comment B', 5),
    ]
    const originalOrder = comments.map((c) => c.id)

    sortPersonalizedCommentsByRating(comments)

    // Original array should remain unchanged
    expect(comments.map((c) => c.id)).toEqual(originalOrder)
  })

  it('handles decimal ratings (rounds to nearest integer)', () => {
    const comments: PersonalizedComment[] = [
      createComment(1, 'Rating 1.4', 1.4), // Rounds to 1
      createComment(2, 'Rating 4.8', 4.8), // Rounds to 5
      createComment(3, 'Rating 3.5', 3.5), // Rounds to 4
    ]

    const sorted = sortPersonalizedCommentsByRating(comments)

    // Expected order: 4.8 (≈5), 3.5 (≈4), 1.4 (≈1)
    expect(sorted.map((c) => c.id)).toEqual([2, 3, 1])
  })
})
