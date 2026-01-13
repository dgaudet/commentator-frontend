/**
 * parseComments - Parser Tests
 * Story 3: Parse Bulk Comments with Rating Detection
 *
 * Tests for parsing comments with optional ratings:
 * - Each line is processed as a separate comment
 * - Rating detection via last comma+digit pattern
 * - Default rating of 3 when omitted
 * - Leading/trailing whitespace trimmed
 * - Empty lines skipped
 * - Commas in comment text preserved
 */

import { parseComments } from '../parseComments'

describe('parseComments - Story 3: Rating Detection', () => {
  describe('AC1: Basic parsing', () => {
    it('should parse single comment without rating', () => {
      const input = 'excellent work'
      const result = parseComments(input)
      expect(result).toEqual([
        { text: 'excellent work', rating: 3 },
      ])
    })

    it('should parse single comment with rating', () => {
      const input = 'excellent work, 5'
      const result = parseComments(input)
      expect(result).toEqual([
        { text: 'excellent work', rating: 5 },
      ])
    })

    it('should process each line as separate comment', () => {
      const input = 'comment one\ncomment two\ncomment three'
      const result = parseComments(input)
      expect(result).toHaveLength(3)
      expect(result[0]).toEqual({ text: 'comment one', rating: 3 })
      expect(result[1]).toEqual({ text: 'comment two', rating: 3 })
      expect(result[2]).toEqual({ text: 'comment three', rating: 3 })
    })
  })

  describe('AC2: Rating detection patterns', () => {
    it('should detect rating 1', () => {
      const result = parseComments('comment, 1')
      expect(result[0].rating).toBe(1)
    })

    it('should detect rating 2', () => {
      const result = parseComments('comment, 2')
      expect(result[0].rating).toBe(2)
    })

    it('should detect rating 3', () => {
      const result = parseComments('comment, 3')
      expect(result[0].rating).toBe(3)
    })

    it('should detect rating 4', () => {
      const result = parseComments('comment, 4')
      expect(result[0].rating).toBe(4)
    })

    it('should detect rating 5', () => {
      const result = parseComments('comment, 5')
      expect(result[0].rating).toBe(5)
    })

    it('should preserve commas in comment text', () => {
      const input = 'shows good effort, but needs revision, 4'
      const result = parseComments(input)
      expect(result[0]).toEqual({
        text: 'shows good effort, but needs revision',
        rating: 4,
      })
    })

    it('should only match last comma+digit pattern as rating', () => {
      const input = 'excellent work, very thorough, 5'
      const result = parseComments(input)
      expect(result[0]).toEqual({
        text: 'excellent work, very thorough',
        rating: 5,
      })
    })
  })

  describe('AC3: Whitespace handling', () => {
    it('should trim leading whitespace from comment', () => {
      const result = parseComments('  excellent work')
      expect(result[0].text).toBe('excellent work')
    })

    it('should trim trailing whitespace from comment', () => {
      const result = parseComments('excellent work  ')
      expect(result[0].text).toBe('excellent work')
    })

    it('should handle spaces before rating', () => {
      const result = parseComments('excellent work  , 5')
      expect(result[0]).toEqual({
        text: 'excellent work',
        rating: 5,
      })
    })

    it('should skip empty lines', () => {
      const input = 'comment one\n\ncomment two'
      const result = parseComments(input)
      expect(result).toHaveLength(2)
    })

    it('should skip whitespace-only lines', () => {
      const input = 'comment one\n   \ncomment two'
      const result = parseComments(input)
      expect(result).toHaveLength(2)
    })
  })

  describe('AC4: Edge cases', () => {
    it('should return empty array for empty input', () => {
      const result = parseComments('')
      expect(result).toEqual([])
    })

    it('should return empty array for whitespace-only input', () => {
      const result = parseComments('   \n  \n   ')
      expect(result).toEqual([])
    })

    it('should treat invalid rating as no rating', () => {
      const result = parseComments('comment, abc')
      expect(result[0]).toEqual({
        text: 'comment, abc',
        rating: 3,
      })
    })

    it('should treat rating > 5 as no rating', () => {
      const result = parseComments('comment, 6')
      expect(result[0]).toEqual({
        text: 'comment, 6',
        rating: 3,
      })
    })

    it('should treat rating < 1 as no rating', () => {
      const result = parseComments('comment, 0')
      expect(result[0]).toEqual({
        text: 'comment, 0',
        rating: 3,
      })
    })

    it('should handle multiple spaces in comment text', () => {
      const result = parseComments('excellent   work   example')
      expect(result[0].text).toBe('excellent   work   example')
    })
  })

  describe('AC5: Complex multi-line scenarios', () => {
    it('should parse multiple comments with mixed ratings', () => {
      const input = 'excellent work, 5\nneeds more practice\ngood effort, 4\nanother comment'
      const result = parseComments(input)
      expect(result).toEqual([
        { text: 'excellent work', rating: 5 },
        { text: 'needs more practice', rating: 3 },
        { text: 'good effort', rating: 4 },
        { text: 'another comment', rating: 3 },
      ])
    })

    it('should handle Windows line endings', () => {
      const input = 'comment one, 5\r\ncomment two, 3'
      const result = parseComments(input)
      expect(result).toHaveLength(2)
      expect(result[0].rating).toBe(5)
      expect(result[1].rating).toBe(3)
    })

    it('should preserve internal punctuation', () => {
      const input = 'excellent work! (with great effort), 5'
      const result = parseComments(input)
      expect(result[0].text).toBe('excellent work! (with great effort)')
    })
  })
})
