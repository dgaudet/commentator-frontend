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

  describe('Pronoun Placeholders (TASK-1.1, TASK-1.2, TASK-1.3, TASK-1.4)', () => {
    it('replaces <pronoun> with student pronoun', () => {
      const text = '<first name> uses <pronoun> pronouns.'
      const studentData: StudentData = {
        firstName: 'Alex',
        lastName: 'Smith',
        grade: 95,
        pronoun: 'they',
      }

      const result = replacePlaceholders(text, studentData)

      expect(result).toBe('Alex uses they pronouns.')
    })

    it('replaces <possessive pronoun> with student possessive pronoun', () => {
      const text = '<first name> did great work on <possessive pronoun> project.'
      const studentData: StudentData = {
        firstName: 'Jordan',
        lastName: 'Brown',
        grade: 92,
        possessivePronoun: 'their',
      }

      const result = replacePlaceholders(text, studentData)

      expect(result).toBe('Jordan did great work on their project.')
    })

    it('replaces both pronoun and possessive pronoun', () => {
      const text = '<first name> showed progress with <pronoun> studies, and <possessive pronoun> effort was commendable.'
      const studentData: StudentData = {
        firstName: 'Casey',
        lastName: 'Johnson',
        grade: 88,
        pronoun: 'she',
        possessivePronoun: 'her',
      }

      const result = replacePlaceholders(text, studentData)

      expect(result).toBe('Casey showed progress with she studies, and her effort was commendable.')
    })

    it('handles case-insensitive pronoun placeholders', () => {
      const text = '<PRONOUN> is a great student.'
      const studentData: StudentData = {
        firstName: 'Morgan',
        pronoun: 'he',
      }

      const result = replacePlaceholders(text, studentData)

      // Pronoun at start of text is capitalized
      expect(result).toBe('He is a great student.')
    })

    it('leaves <pronoun> unchanged when pronoun is undefined', () => {
      const text = '<first name> uses <pronoun> pronouns.'
      const studentData: StudentData = {
        firstName: 'Alex',
        lastName: 'Smith',
        grade: 95,
      }

      const result = replacePlaceholders(text, studentData)

      expect(result).toBe('Alex uses <pronoun> pronouns.')
    })

    it('leaves <possessive pronoun> unchanged when possessive pronoun is undefined', () => {
      const text = '<first name> did great work on <possessive pronoun> project.'
      const studentData: StudentData = {
        firstName: 'Jordan',
        lastName: 'Brown',
        grade: 92,
      }

      const result = replacePlaceholders(text, studentData)

      expect(result).toBe('Jordan did great work on <possessive pronoun> project.')
    })

    it('works with all placeholder types together', () => {
      const text = '<first name> <last name> earned <grade> points. <pronoun> used <possessive pronoun> best effort.'
      const studentData: StudentData = {
        firstName: 'Riley',
        lastName: 'Davis',
        grade: 96,
        pronoun: 'they',
        possessivePronoun: 'their',
      }

      const result = replacePlaceholders(text, studentData)

      // Pronoun after period is capitalized; possessive pronoun mid-sentence is lowercase
      expect(result).toBe('Riley Davis earned 96 points. They used their best effort.')
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

describe('Smart Pronoun Capitalization (US-SMART-PRONOUN-CAPITALIZE)', () => {
  describe('Capitalize at Text Start', () => {
    it('capitalizes <pronoun> when it appears at the start of text', () => {
      const text = '<pronoun> is a great student.'
      const studentData: StudentData = {
        firstName: 'Morgan',
        pronoun: 'she',
      }

      const result = replacePlaceholders(text, studentData)

      expect(result).toBe('She is a great student.')
    })

    it('capitalizes <possessive pronoun> when it appears at the start of text', () => {
      const text = '<possessive pronoun> work demonstrates mastery.'
      const studentData: StudentData = {
        firstName: 'Alex',
        possessivePronoun: 'his',
      }

      const result = replacePlaceholders(text, studentData)

      expect(result).toBe('His work demonstrates mastery.')
    })

    it('does not double-capitalize when pronoun value is already capitalized', () => {
      const text = '<pronoun> excels in class.'
      const studentData: StudentData = {
        firstName: 'Jordan',
        pronoun: 'He',
      }

      const result = replacePlaceholders(text, studentData)

      expect(result).toBe('He excels in class.')
    })

    it('does not double-capitalize when possessive pronoun is already capitalized', () => {
      const text = '<possessive pronoun> participation is excellent.'
      const studentData: StudentData = {
        firstName: 'Casey',
        possessivePronoun: 'Their',
      }

      const result = replacePlaceholders(text, studentData)

      expect(result).toBe('Their participation is excellent.')
    })
  })

  describe('Capitalize After Sentence Enders (., !, ?)', () => {
    it('capitalizes <pronoun> after period', () => {
      const text = 'She did well. <pronoun> shows strong effort.'
      const studentData: StudentData = {
        firstName: 'Emma',
        pronoun: 'she',
      }

      const result = replacePlaceholders(text, studentData)

      expect(result).toBe('She did well. She shows strong effort.')
    })

    it('capitalizes <pronoun> after exclamation mark', () => {
      const text = 'Excellent work! <pronoun> demonstrates mastery!'
      const studentData: StudentData = {
        firstName: 'Oliver',
        pronoun: 'he',
      }

      const result = replacePlaceholders(text, studentData)

      expect(result).toBe('Excellent work! He demonstrates mastery!')
    })

    it('capitalizes <pronoun> after question mark', () => {
      const text = 'Does <first name> participate? <pronoun> contribute regularly.'
      const studentData: StudentData = {
        firstName: 'Sam',
        pronoun: 'they',
      }

      const result = replacePlaceholders(text, studentData)

      expect(result).toBe('Does Sam participate? They contribute regularly.')
    })

    it('capitalizes <possessive pronoun> after period', () => {
      const text = '<first name> excels in math. <possessive pronoun> problem-solving skills are strong.'
      const studentData: StudentData = {
        firstName: 'Riley',
        possessivePronoun: 'their',
      }

      const result = replacePlaceholders(text, studentData)

      expect(result).toBe('Riley excels in math. Their problem-solving skills are strong.')
    })

    it('capitalizes <possessive pronoun> after exclamation mark', () => {
      const text = 'Outstanding achievement! <possessive pronoun> dedication is impressive.'
      const studentData: StudentData = {
        firstName: 'Avery',
        possessivePronoun: 'her',
      }

      const result = replacePlaceholders(text, studentData)

      expect(result).toBe('Outstanding achievement! Her dedication is impressive.')
    })

    it('capitalizes <possessive pronoun> after question mark', () => {
      const text = 'Will <first name> continue? <possessive pronoun> progress is excellent.'
      const studentData: StudentData = {
        firstName: 'Taylor',
        possessivePronoun: 'his',
      }

      const result = replacePlaceholders(text, studentData)

      expect(result).toBe('Will Taylor continue? His progress is excellent.')
    })
  })

  describe('Handle Edge Cases - Ellipsis', () => {
    it('capitalizes <pronoun> after ellipsis (...)', () => {
      const text = '<first name> shows great potential... <pronoun> will continue improving.'
      const studentData: StudentData = {
        firstName: 'Blake',
        pronoun: 'she',
      }

      const result = replacePlaceholders(text, studentData)

      expect(result).toBe('Blake shows great potential... She will continue improving.')
    })

    it('capitalizes <possessive pronoun> after ellipsis', () => {
      const text = '<first name> is making progress... <possessive pronoun> efforts are paying off.'
      const studentData: StudentData = {
        firstName: 'Dakota',
        possessivePronoun: 'their',
      }

      const result = replacePlaceholders(text, studentData)

      expect(result).toBe('Dakota is making progress... Their efforts are paying off.')
    })
  })

  describe('Handle Edge Cases - Multiple Spaces and Newlines', () => {
    it('capitalizes <pronoun> after sentence ender with multiple spaces', () => {
      const text = '<first name> participated well.   <pronoun> adds value to discussions.'
      const studentData: StudentData = {
        firstName: 'Morgan',
        pronoun: 'he',
      }

      const result = replacePlaceholders(text, studentData)

      expect(result).toBe('Morgan participated well.   He adds value to discussions.')
    })

    it('capitalizes <pronoun> after sentence ender with newline', () => {
      const text = '<first name> did great work.\n<pronoun> is a model student.'
      const studentData: StudentData = {
        firstName: 'Quinn',
        pronoun: 'they',
      }

      const result = replacePlaceholders(text, studentData)

      expect(result).toBe('Quinn did great work.\nThey is a model student.')
    })

    it('capitalizes <possessive pronoun> after sentence ender with multiple spaces', () => {
      const text = '<first name> showed dedication.    <possessive pronoun> commitment is admirable.'
      const studentData: StudentData = {
        firstName: 'Scout',
        possessivePronoun: 'his',
      }

      const result = replacePlaceholders(text, studentData)

      expect(result).toBe('Scout showed dedication.    His commitment is admirable.')
    })

    it('capitalizes <possessive pronoun> after sentence ender with newline', () => {
      const text = '<first name> excels academically.\n<possessive pronoun> grade reflects <possessive pronoun> effort.'
      const studentData: StudentData = {
        firstName: 'Phoenix',
        possessivePronoun: 'her',
      }

      const result = replacePlaceholders(text, studentData)

      expect(result).toBe('Phoenix excels academically.\nHer grade reflects her effort.')
    })
  })

  describe('Multiple Pronouns in Same Comment', () => {
    it('capitalizes multiple occurrences of <pronoun> at proper positions', () => {
      const text = '<pronoun> is brilliant. <pronoun> shows initiative. However, <pronoun> could improve.'
      const studentData: StudentData = {
        firstName: 'River',
        pronoun: 'they',
      }

      const result = replacePlaceholders(text, studentData)

      expect(result).toBe('They is brilliant. They shows initiative. However, they could improve.')
    })

    it('capitalizes <pronoun> and <possessive pronoun> together', () => {
      const text = '<pronoun> completed <possessive pronoun> assignment. <pronoun> did excellent work.'
      const studentData: StudentData = {
        firstName: 'Sage',
        pronoun: 'she',
        possessivePronoun: 'her',
      }

      const result = replacePlaceholders(text, studentData)

      expect(result).toBe('She completed her assignment. She did excellent work.')
    })
  })

  describe('Do Not Capitalize Mid-Sentence', () => {
    it('does not capitalize <pronoun> in middle of sentence', () => {
      const text = '<first name> believes <pronoun> will succeed.'
      const studentData: StudentData = {
        firstName: 'Skylar',
        pronoun: 'he',
      }

      const result = replacePlaceholders(text, studentData)

      expect(result).toBe('Skylar believes he will succeed.')
    })

    it('does not capitalize <possessive pronoun> in middle of sentence', () => {
      const text = '<first name> completed <possessive pronoun> project on time.'
      const studentData: StudentData = {
        firstName: 'Jordan',
        possessivePronoun: 'their',
      }

      const result = replacePlaceholders(text, studentData)

      expect(result).toBe('Jordan completed their project on time.')
    })
  })
})
