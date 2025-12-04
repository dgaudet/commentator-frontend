import type { PersonalizedComment, CreatePersonalizedCommentRequest, UpdatePersonalizedCommentRequest } from '../PersonalizedComment'

describe('PersonalizedComment Types', () => {
  it('should have string id and subjectId, numeric rating', () => {
    const comment: PersonalizedComment = {
      id: '95d4e5f6g7h8i9j0k1l2m3n4',
      comment: 'Shows great improvement',
      subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
      rating: 4,
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
    }
    expect(typeof comment.id).toBe('string')
    expect(typeof comment.subjectId).toBe('string')
    expect(typeof comment.rating).toBe('number')
    expect(comment.id).toBe('95d4e5f6g7h8i9j0k1l2m3n4')
    expect(comment.comment).toBe('Shows great improvement')
    expect(comment.subjectId).toBe('65a1b2c3d4e5f6g7h8i9j0k1')
    expect(comment.rating).toBe(4)
    expect(comment.createdAt).toBe('2024-01-15T10:30:00Z')
    expect(comment.updatedAt).toBe('2024-01-15T10:30:00Z')
  })

  it('should have correct CreatePersonalizedCommentRequest structure', () => {
    const request: CreatePersonalizedCommentRequest = {
      comment: 'Shows great improvement',
      subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
      rating: 4,
    }
    expect(request).toBeDefined()
    expect(typeof request.subjectId).toBe('string')
    expect(typeof request.rating).toBe('number')
    expect(request.comment).toBe('Shows great improvement')
    expect(request.subjectId).toBe('65a1b2c3d4e5f6g7h8i9j0k1')
    expect(request.rating).toBe(4)
  })

  it('should have correct UpdatePersonalizedCommentRequest structure', () => {
    const request: UpdatePersonalizedCommentRequest = {
      subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
      comment: 'Updated comment text',
      rating: 5,
    }
    expect(request).toBeDefined()
    expect(typeof request.subjectId).toBe('string')
    expect(typeof request.rating).toBe('number')
    expect(request.comment).toBe('Updated comment text')
    expect(request.subjectId).toBe('65a1b2c3d4e5f6g7h8i9j0k1')
    expect(request.rating).toBe(5)
  })
})
