/**
 * replacePronounsWithPlaceholders Utility Tests
 * TASK-1.1: Reusable pronoun-to-placeholder utility
 *
 * TDD Tests following Red-Green-Refactor cycle
 * Test file written FIRST, implementation follows
 */

import { replacePronounsWithPlaceholders } from '../pronouns'
import type { Pronoun } from '../../types'

describe('replacePronounsWithPlaceholders', () => {
  describe('AC-1.2: Basic Pronoun Replacement', () => {
    it('should replace subject pronoun with <pronoun> placeholder', () => {
      const text = 'He is excellent'
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

      expect(result.replacedText).toBe('<pronoun> is excellent')
      expect(result.replacementCount.pronoun).toBe(1)
      expect(result.replacementCount.possessivePronoun).toBe(0)
    })
  })

  describe('AC-1.3: Possessive Pronoun Replacement', () => {
    it('should replace possessive pronoun with <possessive pronoun> placeholder', () => {
      const text = 'His work is outstanding'
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

      expect(result.replacedText).toBe('<possessive pronoun> work is outstanding')
      expect(result.replacementCount.pronoun).toBe(0)
      expect(result.replacementCount.possessivePronoun).toBe(1)
    })
  })

  describe('AC-1.4: Multiple Pronoun Occurrences', () => {
    it('should replace all occurrences of pronouns', () => {
      const text = 'She is excellent. She brings energy. Her work is great.'
      const pronouns: Pronoun[] = [
        {
          id: '1',
          pronoun: 'she',
          possessivePronoun: 'her',
          userId: 'user1',
          createdAt: '2025-01-15T00:00:00Z',
          updatedAt: '2025-01-15T00:00:00Z',
        },
      ]

      const result = replacePronounsWithPlaceholders(text, pronouns)

      expect(result.replacedText).toBe(
        '<pronoun> is excellent. <pronoun> brings energy. <possessive pronoun> work is great.',
      )
      expect(result.replacementCount.pronoun).toBe(2)
      expect(result.replacementCount.possessivePronoun).toBe(1)
    })
  })

  describe('AC-1.5: Case-Insensitive Matching', () => {
    it('should match "He" (capital)', () => {
      const text = 'He is excellent'
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

      expect(result.replacedText).toBe('<pronoun> is excellent')
    })

    it('should match "HE" (all caps)', () => {
      const text = 'HE is excellent'
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

      expect(result.replacedText).toBe('<pronoun> is excellent')
    })

    it('should match "hE" (mixed case)', () => {
      const text = 'hE is excellent'
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

      expect(result.replacedText).toBe('<pronoun> is excellent')
    })
  })

  describe('AC-1.6: Multiple User Pronouns & Word Boundary Matching', () => {
    it('should replace multiple pronouns from array', () => {
      const text = 'They are excellent. Their work is outstanding. They bring energy.'
      const pronouns: Pronoun[] = [
        {
          id: '1',
          pronoun: 'they',
          possessivePronoun: 'their',
          userId: 'user1',
          createdAt: '2025-01-15T00:00:00Z',
          updatedAt: '2025-01-15T00:00:00Z',
        },
      ]

      const result = replacePronounsWithPlaceholders(text, pronouns)

      expect(result.replacedText).toBe(
        '<pronoun> are excellent. <possessive pronoun> work is outstanding. <pronoun> bring energy.',
      )
      expect(result.replacementCount.pronoun).toBe(2)
      expect(result.replacementCount.possessivePronoun).toBe(1)
    })

    it('should not replace partial word matches (word boundary)', () => {
      const text = 'the student excels'
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

      expect(result.replacedText).toBe('the student excels')
      expect(result.replacementCount.pronoun).toBe(0)
    })

    it('should handle multiple different pronouns', () => {
      const text = 'He is here and she is there'
      const pronouns: Pronoun[] = [
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
          pronoun: 'she',
          possessivePronoun: 'her',
          userId: 'user1',
          createdAt: '2025-01-15T00:00:00Z',
          updatedAt: '2025-01-15T00:00:00Z',
        },
      ]

      const result = replacePronounsWithPlaceholders(text, pronouns)

      expect(result.replacedText).toBe('<pronoun> is here and <pronoun> is there')
      expect(result.replacementCount.pronoun).toBe(2)
    })
  })

  describe('AC-1.7: Return Value Structure', () => {
    it('should return object with replacedText and replacementCount', () => {
      const text = 'He is excellent'
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

      expect(result).toHaveProperty('replacedText')
      expect(result).toHaveProperty('replacementCount')
      expect(typeof result.replacedText).toBe('string')
      expect(typeof result.replacementCount).toBe('object')
    })

    it('should have pronoun and possessivePronoun counts', () => {
      const text = 'He and his friend'
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

      expect(result.replacementCount.pronoun).toBe(1)
      expect(result.replacementCount.possessivePronoun).toBe(1)
    })
  })

  describe('AC-1.8: Empty or Missing Pronouns Handling', () => {
    it('should return original text when pronouns array is empty', () => {
      const text = 'He is excellent'
      const pronouns: Pronoun[] = []

      const result = replacePronounsWithPlaceholders(text, pronouns)

      expect(result.replacedText).toBe('He is excellent')
      expect(result.replacementCount.pronoun).toBe(0)
      expect(result.replacementCount.possessivePronoun).toBe(0)
    })
  })

  describe('AC-1.9: Empty Text Handling', () => {
    it('should handle empty string', () => {
      const text = ''
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

      expect(result.replacedText).toBe('')
      expect(result.replacementCount.pronoun).toBe(0)
      expect(result.replacementCount.possessivePronoun).toBe(0)
    })
  })

  describe('AC-1.10: Text Formatting Preservation', () => {
    it('should preserve line breaks', () => {
      const text = 'He is excellent.\nHis work is great.'
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

      expect(result.replacedText).toBe('<pronoun> is excellent.\n<possessive pronoun> work is great.')
    })

    it('should preserve multiple spaces', () => {
      const text = 'He  is   excellent'
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

      expect(result.replacedText).toBe('<pronoun>  is   excellent')
    })

    it('should handle special characters', () => {
      const text = "He's excellent! His work is great."
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

      expect(result.replacedText).toBe("<pronoun>'s excellent! <possessive pronoun> work is great.")
    })
  })

  describe('AC-1.11: Regex Special Character Escaping (Security)', () => {
    it('should not be vulnerable to regex injection with dot metacharacter', () => {
      // Without escaping, 'a.b' regex would match 'a' + any character + 'b'
      // With escaping, it should only match the literal string 'a.b'
      const text = 'aXb should not match here'
      const pronouns: Pronoun[] = [
        {
          id: '1',
          pronoun: 'a.b',
          possessivePronoun: 'his',
          userId: 'user1',
          createdAt: '2025-01-15T00:00:00Z',
          updatedAt: '2025-01-15T00:00:00Z',
        },
      ]

      const result = replacePronounsWithPlaceholders(text, pronouns)

      // With proper escaping, 'aXb' should not match the pattern 'a.b' (literal dot)
      expect(result.replacementCount.pronoun).toBe(0)
    })

    it('should not be vulnerable to regex injection with asterisk metacharacter', () => {
      // Without escaping, 'a*' would match 'a' repeated 0+ times
      const text = 'aaa matches one a should not match'
      const pronouns: Pronoun[] = [
        {
          id: '1',
          pronoun: 'a*',
          possessivePronoun: 'his',
          userId: 'user1',
          createdAt: '2025-01-15T00:00:00Z',
          updatedAt: '2025-01-15T00:00:00Z',
        },
      ]

      const result = replacePronounsWithPlaceholders(text, pronouns)

      // Should not match because we escaped the asterisk
      expect(result.replacementCount.pronoun).toBe(0)
    })

    it('should not be vulnerable to regex injection with pipe (OR) operator', () => {
      // Without escaping, 'he|she' would match either 'he' or 'she'
      const text = 'he and she are here'
      const pronouns: Pronoun[] = [
        {
          id: '1',
          pronoun: 'he|she',
          possessivePronoun: 'his',
          userId: 'user1',
          createdAt: '2025-01-15T00:00:00Z',
          updatedAt: '2025-01-15T00:00:00Z',
        },
      ]

      const result = replacePronounsWithPlaceholders(text, pronouns)

      // Should not match because we escaped the pipe operator
      expect(result.replacementCount.pronoun).toBe(0)
    })

    it('should safely escape bracket characters', () => {
      // Without escaping, '[abc]' would match any character in the set
      const text = 'a and b and [abc] should not match'
      const pronouns: Pronoun[] = [
        {
          id: '1',
          pronoun: '[abc]',
          possessivePronoun: 'his',
          userId: 'user1',
          createdAt: '2025-01-15T00:00:00Z',
          updatedAt: '2025-01-15T00:00:00Z',
        },
      ]

      const result = replacePronounsWithPlaceholders(text, pronouns)

      // Should not match 'a' or 'b' because we escaped the brackets
      expect(result.replacementCount.pronoun).toBe(0)
    })

    it('should safely escape caret (^) anchor character', () => {
      // Without escaping, '^he' would match 'he' at start of string
      const text = 'hello there. He is great'
      const pronouns: Pronoun[] = [
        {
          id: '1',
          pronoun: '^he',
          possessivePronoun: 'his',
          userId: 'user1',
          createdAt: '2025-01-15T00:00:00Z',
          updatedAt: '2025-01-15T00:00:00Z',
        },
      ]

      const result = replacePronounsWithPlaceholders(text, pronouns)

      // Should not match because we escaped the caret
      expect(result.replacementCount.pronoun).toBe(0)
    })

    it('should safely escape dollar sign ($) anchor character', () => {
      // Without escaping, 'he$' would match 'he' at end of string
      const text = 'He is great'
      const pronouns: Pronoun[] = [
        {
          id: '1',
          pronoun: 'he$',
          possessivePronoun: 'his',
          userId: 'user1',
          createdAt: '2025-01-15T00:00:00Z',
          updatedAt: '2025-01-15T00:00:00Z',
        },
      ]

      const result = replacePronounsWithPlaceholders(text, pronouns)

      // Should not match because we escaped the dollar sign
      expect(result.replacementCount.pronoun).toBe(0)
    })

    it('should safely escape backslash character without throwing errors', () => {
      // Backslash has special meaning in regex escape sequences
      // Test that escaping prevents errors when backslash is in pronoun
      const text = 'hello world'
      const pronouns: Pronoun[] = [
        {
          id: '1',
          pronoun: 'he\\b',
          possessivePronoun: 'his',
          userId: 'user1',
          createdAt: '2025-01-15T00:00:00Z',
          updatedAt: '2025-01-15T00:00:00Z',
        },
      ]

      // Should not throw an error when processing regex special character
      const result = replacePronounsWithPlaceholders(text, pronouns)

      // The pattern 'he\b' (with backslash) won't match 'he' in the text
      expect(result.replacementCount.pronoun).toBe(0)
    })
  })

  describe('Integration Tests', () => {
    it('should handle typical comment scenario', () => {
      const outcomeComment = 'Alex scored 88. He performed well.'
      const personalizedComment = 'Great job! His participation was excellent.'
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

      const outcomeResult = replacePronounsWithPlaceholders(outcomeComment, pronouns)
      const personalResult = replacePronounsWithPlaceholders(personalizedComment, pronouns)

      expect(outcomeResult.replacedText).toBe('Alex scored 88. <pronoun> performed well.')
      expect(personalResult.replacedText).toBe('Great job! <possessive pronoun> participation was excellent.')
    })
  })
})
