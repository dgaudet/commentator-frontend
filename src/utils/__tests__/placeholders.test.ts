/**
 * Placeholder Utility Tests
 * TDD Phase: RED - Writing failing tests first
 * Reference: US-PLACEHOLDER-001, US-PLACEHOLDER-004, US-PLACEHOLDER-005, US-PLACEHOLDER-006
 *
 * Testing placeholder replacement functionality:
 * - Basic replacement for <first name>, <last name>, <grade>
 * - Case-insensitive matching
 * - Multiple placeholders
 * - Missing student data
 * - Edge cases (special characters, HTML tags, nested brackets)
 */

import { replacePlaceholders, validatePlaceholders, StudentData } from '../placeholders'

describe('replacePlaceholders', () => {
  describe('Basic Replacement', () => {
    it('replaces <first name> with student firstName', () => {
      const text = 'Hello, <first name>!'
      const studentData: StudentData = { firstName: 'Alice', lastName: 'Smith', grade: 95 }

      const result = replacePlaceholders(text, studentData)

      expect(result).toBe('Hello, Alice!')
    })

    it('replaces <last name> with student lastName', () => {
      const text = '<last name> showed improvement.'
      const studentData: StudentData = { firstName: 'Bob', lastName: 'Johnson', grade: 88 }

      const result = replacePlaceholders(text, studentData)

      expect(result).toBe('Johnson showed improvement.')
    })

    it('replaces <grade> with student grade', () => {
      const text = 'Grade: <grade>/100'
      const studentData: StudentData = { firstName: 'Charlie', lastName: 'Brown', grade: 92 }

      const result = replacePlaceholders(text, studentData)

      expect(result).toBe('Grade: 92/100')
    })
  })

  describe('Multiple Placeholders', () => {
    it('replaces multiple placeholders in same text', () => {
      const text = '<first name> <last name> earned <grade> points.'
      const studentData: StudentData = { firstName: 'Alice', lastName: 'Smith', grade: 95 }

      const result = replacePlaceholders(text, studentData)

      expect(result).toBe('Alice Smith earned 95 points.')
    })

    it('replaces multiple occurrences of same placeholder', () => {
      const text = '<first name> did well. <first name> improved significantly.'
      const studentData: StudentData = { firstName: 'Bob', lastName: 'Johnson', grade: 88 }

      const result = replacePlaceholders(text, studentData)

      expect(result).toBe('Bob did well. Bob improved significantly.')
    })
  })

  describe('Case-Insensitive Matching', () => {
    it('replaces <First Name> (capitalized)', () => {
      const text = 'Great work, <First Name>!'
      const studentData: StudentData = { firstName: 'Alice', lastName: 'Smith', grade: 95 }

      const result = replacePlaceholders(text, studentData)

      expect(result).toBe('Great work, Alice!')
    })

    it('replaces <LAST NAME> (uppercase)', () => {
      const text = '<LAST NAME> demonstrated mastery.'
      const studentData: StudentData = { firstName: 'Bob', lastName: 'Johnson', grade: 88 }

      const result = replacePlaceholders(text, studentData)

      expect(result).toBe('Johnson demonstrated mastery.')
    })

    it('replaces <GrAdE> (mixed case)', () => {
      const text = 'Score: <GrAdE>'
      const studentData: StudentData = { firstName: 'Charlie', lastName: 'Brown', grade: 92 }

      const result = replacePlaceholders(text, studentData)

      expect(result).toBe('Score: 92')
    })
  })

  describe('Missing Student Data', () => {
    it('leaves <first name> as-is when firstName is undefined', () => {
      const text = 'Hello, <first name>!'
      const studentData: StudentData = { lastName: 'Smith', grade: 95 }

      const result = replacePlaceholders(text, studentData)

      expect(result).toBe('Hello, <first name>!')
    })

    it('leaves <last name> as-is when lastName is undefined', () => {
      const text = '<last name> did well.'
      const studentData: StudentData = { firstName: 'Alice', grade: 95 }

      const result = replacePlaceholders(text, studentData)

      expect(result).toBe('<last name> did well.')
    })

    it('leaves <grade> as-is when grade is undefined', () => {
      const text = 'Grade: <grade>'
      const studentData: StudentData = { firstName: 'Alice', lastName: 'Smith' }

      const result = replacePlaceholders(text, studentData)

      expect(result).toBe('Grade: <grade>')
    })

    it('leaves <grade> as-is when grade is null', () => {
      const text = 'Grade: <grade>'
      const studentData: StudentData = { firstName: 'Alice', lastName: 'Smith', grade: null }

      const result = replacePlaceholders(text, studentData)

      expect(result).toBe('Grade: <grade>')
    })
  })

  describe('Empty String Handling', () => {
    it('leaves <first name> as-is when firstName is empty string', () => {
      const text = 'Hello, <first name>!'
      const studentData: StudentData = { firstName: '', lastName: 'Smith', grade: 95 }

      const result = replacePlaceholders(text, studentData)

      expect(result).toBe('Hello, <first name>!')
    })

    it('leaves <last name> as-is when lastName is empty string', () => {
      const text = '<last name> did well.'
      const studentData: StudentData = { firstName: 'Alice', lastName: '', grade: 95 }

      const result = replacePlaceholders(text, studentData)

      expect(result).toBe('<last name> did well.')
    })

    it('replaces <grade> with 0 when grade is 0 (0 is valid)', () => {
      const text = 'Grade: <grade>'
      const studentData: StudentData = { firstName: 'Alice', lastName: 'Smith', grade: 0 }

      const result = replacePlaceholders(text, studentData)

      expect(result).toBe('Grade: 0')
    })
  })

  describe('Special Characters in Names', () => {
    it('preserves apostrophes in names', () => {
      const text = '<first name> did great.'
      const studentData: StudentData = { firstName: "O'Brien", lastName: 'Smith', grade: 95 }

      const result = replacePlaceholders(text, studentData)

      expect(result).toBe("O'Brien did great.")
    })

    it('preserves hyphens in names', () => {
      const text = '<first name> improved.'
      const studentData: StudentData = { firstName: 'Mary-Jane', lastName: 'Watson', grade: 90 }

      const result = replacePlaceholders(text, studentData)

      expect(result).toBe('Mary-Jane improved.')
    })

    it('preserves accented characters', () => {
      const text = '<first name> demonstrated mastery.'
      const studentData: StudentData = { firstName: 'José', lastName: 'García', grade: 98 }

      const result = replacePlaceholders(text, studentData)

      expect(result).toBe('José demonstrated mastery.')
    })

    it('preserves Unicode characters', () => {
      const text = '<first name> <last name> excelled.'
      const studentData: StudentData = { firstName: '李', lastName: '明', grade: 97 }

      const result = replacePlaceholders(text, studentData)

      expect(result).toBe('李 明 excelled.')
    })
  })

  describe('Edge Cases - Non-Placeholders', () => {
    it('does not replace HTML tags', () => {
      const text = '<div>Hello, <first name>!</div>'
      const studentData: StudentData = { firstName: 'Alice', lastName: 'Smith', grade: 95 }

      const result = replacePlaceholders(text, studentData)

      expect(result).toBe('<div>Hello, Alice!</div>')
    })

    it('does not replace comparison operators', () => {
      const text = 'Score <90 means <first name> needs improvement.'
      const studentData: StudentData = { firstName: 'Bob', lastName: 'Johnson', grade: 85 }

      const result = replacePlaceholders(text, studentData)

      expect(result).toBe('Score <90 means Bob needs improvement.')
    })

    it('does not replace mathematical expressions', () => {
      const text = 'If x < 100, then <first name> passes.'
      const studentData: StudentData = { firstName: 'Charlie', lastName: 'Brown', grade: 92 }

      const result = replacePlaceholders(text, studentData)

      expect(result).toBe('If x < 100, then Charlie passes.')
    })

    it('leaves unknown placeholders as-is', () => {
      const text = '<first name> from <subject> earned <grade>.'
      const studentData: StudentData = { firstName: 'Alice', lastName: 'Smith', grade: 95 }

      const result = replacePlaceholders(text, studentData)

      expect(result).toBe('Alice from <subject> earned 95.')
    })
  })

  describe('Edge Cases - Whitespace', () => {
    it('does NOT replace placeholders with extra spaces', () => {
      const text = '< first name > did well.'
      const studentData: StudentData = { firstName: 'Alice', lastName: 'Smith', grade: 95 }

      const result = replacePlaceholders(text, studentData)

      // Should NOT be replaced (exact match required)
      expect(result).toBe('< first name > did well.')
    })

    it('does NOT replace placeholders with double spaces', () => {
      const text = '<first  name> improved.'
      const studentData: StudentData = { firstName: 'Bob', lastName: 'Johnson', grade: 88 }

      const result = replacePlaceholders(text, studentData)

      // Should NOT be replaced (exact match required)
      expect(result).toBe('<first  name> improved.')
    })
  })

  describe('Edge Cases - Nested Brackets', () => {
    it('handles nested angle brackets', () => {
      const text = '<<first name>> excelled.'
      const studentData: StudentData = { firstName: 'Alice', lastName: 'Smith', grade: 95 }

      const result = replacePlaceholders(text, studentData)

      // Inner placeholder replaced, outer brackets remain
      expect(result).toBe('<Alice> excelled.')
    })
  })

  describe('Empty Text', () => {
    it('returns empty string when text is empty', () => {
      const text = ''
      const studentData: StudentData = { firstName: 'Alice', lastName: 'Smith', grade: 95 }

      const result = replacePlaceholders(text, studentData)

      expect(result).toBe('')
    })

    it('returns text unchanged when no placeholders present', () => {
      const text = 'Great work this semester!'
      const studentData: StudentData = { firstName: 'Alice', lastName: 'Smith', grade: 95 }

      const result = replacePlaceholders(text, studentData)

      expect(result).toBe('Great work this semester!')
    })
  })
})

describe('validatePlaceholders', () => {
  describe('Valid Comments', () => {
    it('returns empty array for valid placeholders', () => {
      const text = '<first name> <last name> earned <grade>.'

      const warnings = validatePlaceholders(text)

      expect(warnings).toEqual([])
    })

    it('returns empty array for text without placeholders', () => {
      const text = 'Great work this semester!'

      const warnings = validatePlaceholders(text)

      expect(warnings).toEqual([])
    })
  })

  describe('Unclosed Placeholders', () => {
    it('detects unclosed placeholder at end of text', () => {
      const text = 'Hello, <first name'

      const warnings = validatePlaceholders(text)

      expect(warnings).toHaveLength(1)
      expect(warnings[0]).toContain('not closed')
      expect(warnings[0]).toContain('<first name>')
    })

    it('detects unclosed placeholder that starts in middle and extends to end', () => {
      const text = 'Hello, <first name and goodbye.'

      const warnings = validatePlaceholders(text)

      expect(warnings).toHaveLength(1)
      expect(warnings[0]).toContain('not closed')
    })

    it('does not detect unclosed placeholder in middle when followed by other content', () => {
      // This is expected behavior - we only detect unclosed placeholders at the END
      // to avoid false positives while user is still typing
      const text = 'Hello, <first name and <last name>'

      const warnings = validatePlaceholders(text)

      // The <last name> at the end is closed, so no warning
      expect(warnings).toHaveLength(0)
    })
  })

  describe('Empty Placeholders', () => {
    it('detects empty placeholder', () => {
      const text = 'Hello, <> world!'

      const warnings = validatePlaceholders(text)

      expect(warnings).toHaveLength(1)
      expect(warnings[0]).toContain('Empty placeholder')
      expect(warnings[0]).toContain('<first name>')
    })

    it('detects multiple empty placeholders', () => {
      const text = '<> and <> here.'

      const warnings = validatePlaceholders(text)

      expect(warnings.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('Multiple Issues', () => {
    it('returns warnings for all issues found', () => {
      const text = '<first name and <> here'

      const warnings = validatePlaceholders(text)

      expect(warnings.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('Non-Issues', () => {
    it('does not warn about HTML tags', () => {
      const text = '<div>Hello, <first name>!</div>'

      const warnings = validatePlaceholders(text)

      expect(warnings).toEqual([])
    })

    it('does not warn about comparison operators', () => {
      const text = 'Score <90 needs work.'

      const warnings = validatePlaceholders(text)

      expect(warnings).toEqual([])
    })
  })
})
