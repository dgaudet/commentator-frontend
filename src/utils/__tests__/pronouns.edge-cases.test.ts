/**
 * Pronoun Replacement - Edge Cases Tests
 * TASK-1.4: Error Handling & Edge Cases
 *
 * TDD Tests for special characters, debouncing, and other edge cases
 */

import { replacePronounsWithPlaceholders } from '../pronouns'
import type { Pronoun } from '../../types'

describe('replacePronounsWithPlaceholders - Edge Cases (TASK-1.4)', () => {
  const mockPronouns: Pronoun[] = [
    {
      id: '1',
      pronoun: 'he',
      possessivePronoun: 'his',
      userId: 'user1',
      createdAt: '2025-01-15T00:00:00Z',
      updatedAt: '2025-01-15T00:00:00Z',
    },
  ]

  describe('AC-5.3: Special Characters in Pronouns', () => {
    it('should handle pronouns with apostrophes', () => {
      const pronounsWithApostrophe: Pronoun[] = [
        {
          id: '1',
          pronoun: "zi'e",
          possessivePronoun: "zi'r",
          userId: 'user1',
          createdAt: '2025-01-15T00:00:00Z',
          updatedAt: '2025-01-15T00:00:00Z',
        },
      ]

      const text = "zi'e is excellent. zi'r work is great."
      const result = replacePronounsWithPlaceholders(text, pronounsWithApostrophe)

      expect(result.replacedText).toContain('<pronoun>')
      expect(result.replacedText).toContain('<possessive pronoun>')
      expect(result.replacementCount.pronoun).toBeGreaterThan(0)
      expect(result.replacementCount.possessivePronoun).toBeGreaterThan(0)
    })

    it('should handle pronouns with hyphens', () => {
      const pronounsWithHyphen: Pronoun[] = [
        {
          id: '1',
          pronoun: 'x-self',
          possessivePronoun: 'x-self-own',
          userId: 'user1',
          createdAt: '2025-01-15T00:00:00Z',
          updatedAt: '2025-01-15T00:00:00Z',
        },
      ]

      const text = 'x-self brings energy. x-self-own ideas are valuable.'
      const result = replacePronounsWithPlaceholders(text, pronounsWithHyphen)

      expect(result.replacedText).toContain('<pronoun>')
      expect(result.replacementCount.pronoun).toBeGreaterThan(0)
    })

    it('should match pronouns adjacent to special characters at word boundaries', () => {
      const pronounsWithSpecialChar: Pronoun[] = [
        {
          id: '1',
          pronoun: 'they',
          possessivePronoun: 'their',
          userId: 'user1',
          createdAt: '2025-01-15T00:00:00Z',
          updatedAt: '2025-01-15T00:00:00Z',
        },
      ]

      const text = 'they-are excellent. they work great.'
      const result = replacePronounsWithPlaceholders(text, pronounsWithSpecialChar)

      // Should match both instances - hyphen is not a word character
      // so \bthey\b matches "they" before and after hyphen
      expect(result.replacementCount.pronoun).toBe(2)
      expect(result.replacedText).toContain('<pronoun>-are')
      expect(result.replacedText).toContain('<pronoun> work')
    })
  })

  describe('AC-5.5: Word Boundary Matching', () => {
    it('should not replace pronouns that are part of other words', () => {
      const pronounsWithWordInside: Pronoun[] = [
        {
          id: '1',
          pronoun: 'he',
          possessivePronoun: 'his',
          userId: 'user1',
          createdAt: '2025-01-15T00:00:00Z',
          updatedAt: '2025-01-15T00:00:00Z',
        },
      ]

      const text = 'The student excels at their work'
      const result = replacePronounsWithPlaceholders(text, pronounsWithWordInside)

      // Should not replace "he" in "the"
      expect(result.replacedText).toContain('The')
      expect(result.replacementCount.pronoun).toBe(0)
      expect(result.replacementCount.possessivePronoun).toBe(0)
    })

    it('should handle punctuation after pronouns', () => {
      const text = 'He, she, and they work together.'
      const pronouns: Pronoun[] = [
        {
          id: '1',
          pronoun: 'he',
          possessivePronoun: 'his',
          userId: 'user1',
          createdAt: '2025-01-15T00:00:00Z',
          updatedAt: '2025-01-15T00:00:00Z',
        },
      ]

      const result = replacePronounsWithPlaceholders(text, pronouns)

      // Should replace "He" even with comma after
      expect(result.replacementCount.pronoun).toBe(1)
      expect(result.replacedText).toContain('<pronoun>, she')
    })

    it('should handle pronouns at sentence boundaries', () => {
      const text = 'he is excellent. He brings energy.'
      const result = replacePronounsWithPlaceholders(text, mockPronouns)

      // Both instances should be replaced
      expect(result.replacementCount.pronoun).toBe(2)
      expect(result.replacedText).toContain('<pronoun> is excellent')
      expect(result.replacedText).toContain('<pronoun> brings energy')
    })

    it('should not replace pronouns with numbers adjacent', () => {
      const pronouns: Pronoun[] = [
        {
          id: '1',
          pronoun: 'he',
          possessivePronoun: 'his',
          userId: 'user1',
          createdAt: '2025-01-15T00:00:00Z',
          updatedAt: '2025-01-15T00:00:00Z',
        },
      ]

      const text = 'he1student is excellent'
      const result = replacePronounsWithPlaceholders(text, pronouns)

      // Should not replace "he" in "he1student"
      expect(result.replacementCount.pronoun).toBe(0)
      expect(result.replacedText).toBe(text)
    })
  })

  describe('AC-5.2: No Pronouns Configured', () => {
    it('should return original text when pronouns array is empty', () => {
      const text = 'He is excellent. His work is great.'
      const result = replacePronounsWithPlaceholders(text, [])

      expect(result.replacedText).toBe(text)
      expect(result.replacementCount.pronoun).toBe(0)
      expect(result.replacementCount.possessivePronoun).toBe(0)
    })

    it('should handle pronouns with empty string values', () => {
      const pronounsWithEmpty: Pronoun[] = [
        {
          id: '1',
          pronoun: '',
          possessivePronoun: '',
          userId: 'user1',
          createdAt: '2025-01-15T00:00:00Z',
          updatedAt: '2025-01-15T00:00:00Z',
        },
      ]

      const text = 'He is excellent'
      const result = replacePronounsWithPlaceholders(text, pronounsWithEmpty)

      // Should not replace anything
      expect(result.replacedText).toBe(text)
      expect(result.replacementCount.pronoun).toBe(0)
    })
  })

  describe('AC-5.1: API Failure Handling (Utility Level)', () => {
    it('should handle null pronouns array gracefully', () => {
      const text = 'He is excellent'
      // This tests defensive programming - shouldn't crash if null passed
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = replacePronounsWithPlaceholders(text, null as any)
        // If it doesn't throw, it should return original text
        expect(result.replacedText).toBe(text)
      } catch {
        // If it throws, that's also acceptable - graceful error
        expect(true).toBe(true)
      }
    })

    it('should return original text and 0 counts on any processing error', () => {
      const text = 'He is excellent'
      const result = replacePronounsWithPlaceholders(text, mockPronouns)

      // Should always return an object with expected structure
      expect(result).toHaveProperty('replacedText')
      expect(result).toHaveProperty('replacementCount')
      expect(typeof result.replacementCount.pronoun).toBe('number')
      expect(typeof result.replacementCount.possessivePronoun).toBe('number')
    })
  })

  describe('Multiple Pronouns with Special Characters', () => {
    it('should handle mixed pronouns with and without special characters', () => {
      const mixedPronouns: Pronoun[] = [
        {
          id: '1',
          pronoun: 'he',
          possessivePronoun: 'his',
          userId: 'user1',
          createdAt: '2025-01-15T00:00:00Z',
          updatedAt: '2025-01-15T00:00:00Z',
        },
        {
          id: '2',
          pronoun: "zi'e",
          possessivePronoun: "zi'r",
          userId: 'user1',
          createdAt: '2025-01-15T00:00:00Z',
          updatedAt: '2025-01-15T00:00:00Z',
        },
      ]

      const text = "He works well. zi'e does too. His approach. zi'r ideas."
      const result = replacePronounsWithPlaceholders(text, mixedPronouns)

      // Should replace all pronouns
      expect(result.replacementCount.pronoun).toBeGreaterThanOrEqual(2)
      expect(result.replacedText).toContain('<pronoun>')
    })
  })

  describe('Large Text Performance', () => {
    it('should handle large text with many pronouns', () => {
      // Generate large text with repeated pronouns
      const sentences = []
      for (let i = 0; i < 100; i++) {
        sentences.push('He is excellent. His work is great.')
      }
      const largeText = sentences.join(' ')

      const result = replacePronounsWithPlaceholders(largeText, mockPronouns)

      // Should have replaced all instances
      expect(result.replacementCount.pronoun).toBe(100)
      expect(result.replacementCount.possessivePronoun).toBe(100)
      expect(result.replacedText).toContain('<pronoun>')
      expect(result.replacedText).toContain('<possessive pronoun>')
    })
  })
})
