/**
 * Comment Comparison Utility Tests
 * Tests for exact-match duplicate detection with whitespace trimming
 */

import { isDuplicateComment, findDuplicateComment } from '../commentComparison'

describe('commentComparison', () => {
  describe('isDuplicateComment', () => {
    it('should return true for exact matching comments', () => {
      const result = isDuplicateComment('Good work', 'Good work')
      expect(result).toBe(true)
    })

    it('should return false when comments differ', () => {
      const result = isDuplicateComment('Good work', 'Excellent work')
      expect(result).toBe(false)
    })

    it('should be case-sensitive (different case = no match)', () => {
      const result = isDuplicateComment('Good work', 'good work')
      expect(result).toBe(false)
    })

    it('should trim leading whitespace before comparing', () => {
      const result = isDuplicateComment('  Good work', 'Good work')
      expect(result).toBe(true)
    })

    it('should trim trailing whitespace before comparing', () => {
      const result = isDuplicateComment('Good work  ', 'Good work')
      expect(result).toBe(true)
    })

    it('should trim both leading and trailing whitespace', () => {
      const result = isDuplicateComment('  Good work  ', 'Good work')
      expect(result).toBe(true)
    })

    it('should preserve internal whitespace (not collapse multiple spaces)', () => {
      const result = isDuplicateComment('Good  work', 'Good work')
      expect(result).toBe(false)
    })

    it('should preserve internal whitespace when both have multiple spaces', () => {
      const result = isDuplicateComment('Good  work', 'Good  work')
      expect(result).toBe(true)
    })

    it('should handle empty strings correctly', () => {
      const result = isDuplicateComment('', '')
      expect(result).toBe(true)
    })

    it('should handle whitespace-only strings', () => {
      const result = isDuplicateComment('   ', '   ')
      expect(result).toBe(true)
    })

    it('should handle multiline comments with newlines preserved', () => {
      const multiline1 = 'Line 1\nLine 2'
      const multiline2 = 'Line 1\nLine 2'
      const result = isDuplicateComment(multiline1, multiline2)
      expect(result).toBe(true)
    })

    it('should detect difference in multiline comments', () => {
      const multiline1 = 'Line 1\nLine 2'
      const multiline2 = 'Line 1\nLine 3'
      const result = isDuplicateComment(multiline1, multiline2)
      expect(result).toBe(false)
    })
  })

  describe('findDuplicateComment', () => {
    const mockComments = [
      { id: '1', text: 'Good work', subjectId: 'math' },
      { id: '2', text: 'Excellent effort', subjectId: 'math' },
      { id: '3', text: 'Needs improvement', subjectId: 'math' },
    ]

    it('should find exact duplicate in comment list', () => {
      const result = findDuplicateComment('Good work', mockComments)
      expect(result).toEqual(mockComments[0])
    })

    it('should return null when no duplicate found', () => {
      const result = findDuplicateComment('Great job', mockComments)
      expect(result).toBeNull()
    })

    it('should return first matching duplicate', () => {
      const commentsWithDuplicates = [
        { id: '1', text: 'Good work', subjectId: 'math' },
        { id: '2', text: 'Good work', subjectId: 'math' },
      ]
      const result = findDuplicateComment('Good work', commentsWithDuplicates)
      expect(result?.id).toBe('1')
    })

    it('should trim whitespace when finding duplicates', () => {
      const result = findDuplicateComment('  Good work  ', mockComments)
      expect(result).toEqual(mockComments[0])
    })

    it('should work with empty comment list', () => {
      const result = findDuplicateComment('Good work', [])
      expect(result).toBeNull()
    })

    it('should filter comments by subject when predicate provided', () => {
      const commentsMultiSubject = [
        { id: '1', text: 'Good work', subjectId: 'math' },
        { id: '2', text: 'Good work', subjectId: 'english' },
        { id: '3', text: 'Excellent', subjectId: 'math' },
      ]
      const result = findDuplicateComment(
        'Good work',
        commentsMultiSubject,
        (comment) => comment.subjectId === 'english',
      )
      expect(result?.id).toBe('2')
    })

    it('should return null when predicate filters out all matching comments', () => {
      const commentsMultiSubject = [
        { id: '1', text: 'Good work', subjectId: 'math' },
        { id: '2', text: 'Good work', subjectId: 'english' },
      ]
      const result = findDuplicateComment(
        'Good work',
        commentsMultiSubject,
        (comment) => comment.subjectId === 'science',
      )
      expect(result).toBeNull()
    })
  })
})
