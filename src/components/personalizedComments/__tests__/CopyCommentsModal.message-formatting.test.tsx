/**
 * Tests for CopyCommentsModal message formatting
 * TDD: Tests written BEFORE implementation
 * Reference: US-CP-007 - Display duplicate information in append mode
 */

import { formatSuccessMessage } from '../../../utils/formatCopyMessage'
import type { PersonalizedCommentCopyResult } from '../../../types'

describe('formatSuccessMessage', () => {
  describe('Append mode with duplicates (AC-7.1)', () => {
    it('should show duplicate count in success message', () => {
      const result: PersonalizedCommentCopyResult = {
        successCount: 3,
        duplicateCount: 2,
        overwrite: false,
      }

      const message = formatSuccessMessage(result, 'Spanish 102')

      expect(message).toContain('Successfully copied 3 comments')
      expect(message).toContain('Spanish 102')
      expect(message).toContain('2 duplicates')
      expect(message).toContain('skipped')
    })

    it('should use singular form "duplicate was" for 1 duplicate', () => {
      const result: PersonalizedCommentCopyResult = {
        successCount: 5,
        duplicateCount: 1,
        overwrite: false,
      }

      const message = formatSuccessMessage(result, 'Math 101')

      expect(message).toContain('1 duplicate was skipped')
    })

    it('should use plural form "duplicates were" for multiple duplicates', () => {
      const result: PersonalizedCommentCopyResult = {
        successCount: 3,
        duplicateCount: 5,
        overwrite: false,
      }

      const message = formatSuccessMessage(result, 'Science 201')

      expect(message).toContain('5 duplicates were skipped')
    })

    it('should include "(already existed)" text for clarity', () => {
      const result: PersonalizedCommentCopyResult = {
        successCount: 2,
        duplicateCount: 1,
        overwrite: false,
      }

      const message = formatSuccessMessage(result, 'History 101')

      expect(message).toContain('(already existed)')
    })
  })

  describe('Append mode without duplicates (AC-7.3)', () => {
    it('should not show duplicate information when count is zero', () => {
      const result: PersonalizedCommentCopyResult = {
        successCount: 5,
        duplicateCount: 0,
        overwrite: false,
      }

      const message = formatSuccessMessage(result, 'Biology 101')

      expect(message).toContain('Successfully copied 5 comments')
      expect(message).toContain('Biology 101')
      expect(message).not.toContain('duplicate')
      expect(message).not.toContain('skipped')
    })

    it('should use singular "comment" for 1 comment', () => {
      const result: PersonalizedCommentCopyResult = {
        successCount: 1,
        duplicateCount: 0,
        overwrite: false,
      }

      const message = formatSuccessMessage(result, 'Chemistry 101')

      expect(message).toContain('1 comment to Chemistry 101')
      expect(message).not.toContain('1 comments')
    })

    it('should use plural "comments" for multiple comments', () => {
      const result: PersonalizedCommentCopyResult = {
        successCount: 5,
        duplicateCount: 0,
        overwrite: false,
      }

      const message = formatSuccessMessage(result, 'Physics 201')

      expect(message).toContain('5 comments')
    })
  })

  describe('Overwrite mode (AC-7.2)', () => {
    it('should show "replaced all comments" message in overwrite mode', () => {
      const result: PersonalizedCommentCopyResult = {
        successCount: 7,
        duplicateCount: 0,
        overwrite: true,
      }

      const message = formatSuccessMessage(result, 'English 102')

      expect(message).toContain('Successfully replaced all comments')
      expect(message).toContain('English 102')
      expect(message).toContain('Copied 7 comments')
    })

    it('should not mention duplicates in overwrite mode', () => {
      const result: PersonalizedCommentCopyResult = {
        successCount: 5,
        duplicateCount: 0,
        overwrite: true,
      }

      const message = formatSuccessMessage(result, 'Art 101')

      expect(message).not.toContain('duplicate')
      expect(message).not.toContain('skipped')
    })

    it('should use singular "comment" for 1 comment in overwrite mode', () => {
      const result: PersonalizedCommentCopyResult = {
        successCount: 1,
        duplicateCount: 0,
        overwrite: true,
      }

      const message = formatSuccessMessage(result, 'History 101')

      expect(message).toContain('Copied 1 comment')
      expect(message).not.toContain('1 comments')
    })

    it('should use plural "comments" for multiple comments in overwrite mode', () => {
      const result: PersonalizedCommentCopyResult = {
        successCount: 5,
        duplicateCount: 0,
        overwrite: true,
      }

      const message = formatSuccessMessage(result, 'Music 101')

      expect(message).toContain('Copied 5 comments')
    })
  })

  describe('Edge cases', () => {
    it('should handle very long target subject names (AC-7.4)', () => {
      const longName = 'Advanced Placement Computer Science Principles Honors'
      const result: PersonalizedCommentCopyResult = {
        successCount: 3,
        duplicateCount: 2,
        overwrite: false,
      }

      const message = formatSuccessMessage(result, longName)

      expect(message).toContain(longName)
      expect(message.length).toBeGreaterThan(0)
    })

    it('should handle zero comments copied', () => {
      const result: PersonalizedCommentCopyResult = {
        successCount: 0,
        duplicateCount: 5,
        overwrite: false,
      }

      const message = formatSuccessMessage(result, 'Test Subject')

      expect(message).toContain('0 comments')
      expect(message).toContain('5 duplicates')
    })

    it('should handle large numbers of comments', () => {
      const result: PersonalizedCommentCopyResult = {
        successCount: 100,
        duplicateCount: 50,
        overwrite: false,
      }

      const message = formatSuccessMessage(result, 'Large Class')

      expect(message).toContain('100 comments')
      expect(message).toContain('50 duplicates')
    })

    it('should handle subject names with special characters', () => {
      const result: PersonalizedCommentCopyResult = {
        successCount: 3,
        duplicateCount: 0,
        overwrite: false,
      }

      const message = formatSuccessMessage(result, "O'Reilly's English & Composition")

      expect(message).toContain("O'Reilly's English & Composition")
    })
  })
})
