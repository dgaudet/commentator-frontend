/**
 * Type tests for OutcomeComment
 * Validates type structure matches API contract with string IDs
 */

import type {
  OutcomeComment,
  CreateOutcomeCommentRequest,
  UpdateOutcomeCommentRequest,
} from '../OutcomeComment'

describe('OutcomeComment Type', () => {
  describe('OutcomeComment interface', () => {
    it('should have string id and subjectId', () => {
      const comment: OutcomeComment = {
        id: '85c3d4e5f6g7h8i9j0k1l2m3',
        subjectId: '65a1b2c3d4e5f6g7h8i9j0k1', // References Subject
        lowerRange: 0,
        upperRange: 50,
        comment: 'Needs improvement',
        userId: 'user_123',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
      }

      expect(typeof comment.id).toBe('string')
      expect(typeof comment.subjectId).toBe('string')
      expect(typeof comment.lowerRange).toBe('number') // Score range stays numeric
      expect(typeof comment.upperRange).toBe('number')
      expect(typeof comment.comment).toBe('string')
      expect(typeof comment.userId).toBe('string')
    })

    it('should validate complete OutcomeComment structure', () => {
      const comment: OutcomeComment = {
        id: 'abc123def456',
        subjectId: 'xyz789uvw012',
        lowerRange: 51,
        upperRange: 75,
        comment: 'Satisfactory performance',
        userId: 'auth0|teacher123',
        createdAt: '2024-01-20T14:30:00Z',
        updatedAt: '2024-01-21T09:15:00Z',
      }

      // Validate all required fields exist
      expect(comment).toHaveProperty('id')
      expect(comment).toHaveProperty('subjectId')
      expect(comment).toHaveProperty('lowerRange')
      expect(comment).toHaveProperty('upperRange')
      expect(comment).toHaveProperty('comment')
      expect(comment).toHaveProperty('userId')
      expect(comment).toHaveProperty('createdAt')
      expect(comment).toHaveProperty('updatedAt')
    })
  })

  describe('CreateOutcomeCommentRequest interface', () => {
    it('should have string subjectId in create request', () => {
      const request: CreateOutcomeCommentRequest = {
        subjectId: 'subject_string_id_123',
        lowerRange: 0,
        upperRange: 50,
        comment: 'Requires significant improvement',
      }

      expect(typeof request.subjectId).toBe('string')
      expect(typeof request.lowerRange).toBe('number')
      expect(typeof request.upperRange).toBe('number')
      expect(typeof request.comment).toBe('string')
    })

    it('should not include id, userId, or timestamps in create request', () => {
      const request: CreateOutcomeCommentRequest = {
        subjectId: 'subject_id_789',
        lowerRange: 76,
        upperRange: 100,
        comment: 'Excellent achievement',
      }

      expect(request).not.toHaveProperty('id')
      expect(request).not.toHaveProperty('userId')
      expect(request).not.toHaveProperty('createdAt')
      expect(request).not.toHaveProperty('updatedAt')
    })
  })

  describe('UpdateOutcomeCommentRequest interface', () => {
    it('should have numeric score ranges in update request', () => {
      const request: UpdateOutcomeCommentRequest = {
        lowerRange: 60,
        upperRange: 80,
        comment: 'Updated comment text',
      }

      expect(typeof request.lowerRange).toBe('number')
      expect(typeof request.upperRange).toBe('number')
      expect(typeof request.comment).toBe('string')
    })

    it('should not include id, subjectId, userId, or timestamps in update request', () => {
      const request: UpdateOutcomeCommentRequest = {
        lowerRange: 0,
        upperRange: 40,
        comment: 'Needs more practice',
      }

      expect(request).not.toHaveProperty('id')
      expect(request).not.toHaveProperty('subjectId')
      expect(request).not.toHaveProperty('userId')
      expect(request).not.toHaveProperty('createdAt')
      expect(request).not.toHaveProperty('updatedAt')
    })
  })
})
