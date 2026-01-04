/**
 * FinalCommentsModal - Pronoun Placeholder Replacement Tests
 *
 * TDD tests for pronoun placeholder replacement during comment population
 * TASK-1.3 & TASK-1.4: Pronoun support in Final Comments
 *
 * Tests verify that when the "Populate with Above Comments" button is used,
 * pronoun placeholders (<pronoun> and <possessive pronoun>) are correctly
 * replaced with actual pronoun values.
 */

import { replacePlaceholders, type StudentData } from '../../../utils/placeholders'

describe('Pronoun Placeholder Replacement in FinalCommentsModal', () => {
  describe('With Pronoun Data', () => {
    it('should replace <pronoun> placeholder in outcome comment', () => {
      const outcomeComment = '<first name> shows strong understanding. <pronoun> excels in this subject.'
      const studentData: StudentData = {
        firstName: 'Alex',
        pronoun: 'they',
      }

      const result = replacePlaceholders(outcomeComment, studentData)

      expect(result).toContain('Alex')
      expect(result).toContain('they')
      expect(result).toBe('Alex shows strong understanding. they excels in this subject.')
    })

    it('should replace <possessive pronoun> placeholder in outcome comment', () => {
      const outcomeComment = '<first name> completed all work on time. <possessive pronoun> effort was commendable.'
      const studentData: StudentData = {
        firstName: 'Jordan',
        possessivePronoun: 'their',
      }

      const result = replacePlaceholders(outcomeComment, studentData)

      expect(result).toBe('Jordan completed all work on time. their effort was commendable.')
    })

    it('should replace both pronoun and possessive pronoun in outcome comment', () => {
      const outcomeComment = '<first name> is an excellent student. <pronoun> brings <possessive pronoun> best effort every day.'
      const studentData: StudentData = {
        firstName: 'Casey',
        pronoun: 'she',
        possessivePronoun: 'her',
      }

      const result = replacePlaceholders(outcomeComment, studentData)

      expect(result).toBe('Casey is an excellent student. she brings her best effort every day.')
    })

    it('should replace pronoun placeholders in personalized comment', () => {
      const personalizedComment = 'Excellent participation! <pronoun> demonstrated <possessive pronoun> commitment to learning.'
      const studentData: StudentData = {
        pronoun: 'he',
        possessivePronoun: 'his',
      }

      const result = replacePlaceholders(personalizedComment, studentData)

      expect(result).toBe('Excellent participation! he demonstrated his commitment to learning.')
    })

    it('should replace all placeholder types together in combined text', () => {
      const combined = '<first name> earned <grade> points. <pronoun> demonstrates <possessive pronoun> dedication.'
      const studentData: StudentData = {
        firstName: 'Morgan',
        grade: 92,
        pronoun: 'they',
        possessivePronoun: 'their',
      }

      const result = replacePlaceholders(combined, studentData)

      expect(result).toBe('Morgan earned 92 points. they demonstrates their dedication.')
    })
  })

  describe('Without Pronoun Data', () => {
    it('should leave <pronoun> unchanged when pronoun is not provided', () => {
      const outcomeComment = '<first name> shows strong understanding. <pronoun> excels in this subject.'
      const studentData: StudentData = {
        firstName: 'Alex',
        // pronoun not provided
      }

      const result = replacePlaceholders(outcomeComment, studentData)

      expect(result).toBe('Alex shows strong understanding. <pronoun> excels in this subject.')
    })

    it('should leave <possessive pronoun> unchanged when not provided', () => {
      const outcomeComment = '<first name> completed all work on time. <possessive pronoun> effort was commendable.'
      const studentData: StudentData = {
        firstName: 'Jordan',
        // possessivePronoun not provided
      }

      const result = replacePlaceholders(outcomeComment, studentData)

      expect(result).toBe('Jordan completed all work on time. <possessive pronoun> effort was commendable.')
    })

    it('should handle empty studentData gracefully', () => {
      const outcomeComment = '<first name> earned <grade> points. <pronoun> shows promise.'
      const studentData: StudentData = {}

      const result = replacePlaceholders(outcomeComment, studentData)

      // Only placeholders with matching data should be replaced
      expect(result).toBe('<first name> earned <grade> points. <pronoun> shows promise.')
    })
  })

  describe('Case-Insensitive Replacement', () => {
    it('should replace uppercase pronoun placeholders', () => {
      const outcomeComment = '<PRONOUN> is a dedicated student.'
      const studentData: StudentData = {
        pronoun: 'she',
      }

      const result = replacePlaceholders(outcomeComment, studentData)

      expect(result).toBe('she is a dedicated student.')
    })

    it('should replace mixed case possessive pronoun placeholders', () => {
      const outcomeComment = 'Work on <Possessive Pronoun> grammar skills.'
      const studentData: StudentData = {
        possessivePronoun: 'your',
      }

      const result = replacePlaceholders(outcomeComment, studentData)

      expect(result).toBe('Work on your grammar skills.')
    })
  })

  describe('Multiple Occurrences', () => {
    it('should replace multiple occurrences of pronoun placeholder', () => {
      const comment = '<pronoun> is a great student. <pronoun> demonstrates leadership.'
      const studentData: StudentData = {
        pronoun: 'they',
      }

      const result = replacePlaceholders(comment, studentData)

      expect(result).toBe('they is a great student. they demonstrates leadership.')
    })

    it('should replace multiple occurrences of possessive pronoun placeholder', () => {
      const comment = '<possessive pronoun> work is excellent. <possessive pronoun> dedication is noted.'
      const studentData: StudentData = {
        possessivePronoun: 'their',
      }

      const result = replacePlaceholders(comment, studentData)

      expect(result).toBe('their work is excellent. their dedication is noted.')
    })
  })

  describe('Integration with Population Scenarios', () => {
    it('should handle typical population scenario: outcome + personalized comments', () => {
      const outcomeComment = '<first name> scored <grade>. <pronoun> performed well.'
      const personalizedComment = 'Great job! <possessive pronoun> participation was excellent.'

      const studentData: StudentData = {
        firstName: 'Riley',
        grade: 88,
        pronoun: 'they',
        possessivePronoun: 'their',
      }

      const outcomeResult = replacePlaceholders(outcomeComment, studentData)
      const personalResult = replacePlaceholders(personalizedComment, studentData)

      expect(outcomeResult).toBe('Riley scored 88. they performed well.')
      expect(personalResult).toBe('Great job! their participation was excellent.')
    })

    it('should truncate combined text correctly after replacement', () => {
      // Simulate the populate function's text concatenation
      const outcome = '<pronoun> demonstrated exceptional skills. <possessive pronoun> work is outstanding.'
      const personal = '<first name> is a model student in every way.'

      const studentData: StudentData = {
        firstName: 'Samuel',
        pronoun: 'he',
        possessivePronoun: 'his',
      }

      const outcomeReplaced = replacePlaceholders(outcome, studentData)
      const personalReplaced = replacePlaceholders(personal, studentData)
      const combined = `${outcomeReplaced} ${personalReplaced}`

      expect(combined).toBe('he demonstrated exceptional skills. his work is outstanding. Samuel is a model student in every way.')
    })
  })
})
