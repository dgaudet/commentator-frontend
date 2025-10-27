import type { PersonalizedComment, CreatePersonalizedCommentRequest, UpdatePersonalizedCommentRequest } from '../PersonalizedComment'

describe('PersonalizedComment Types', () => {
  it('should have correct PersonalizedComment structure', () => {
    const comment: PersonalizedComment = {
      id: 1,
      comment: 'Shows great improvement',
      subjectId: 1,
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
    }
    expect(comment).toBeDefined()
    expect(comment.id).toBe(1)
    expect(comment.comment).toBe('Shows great improvement')
    expect(comment.subjectId).toBe(1)
    expect(comment.createdAt).toBe('2024-01-15T10:30:00Z')
    expect(comment.updatedAt).toBe('2024-01-15T10:30:00Z')
  })

  it('should have correct CreatePersonalizedCommentRequest structure', () => {
    const request: CreatePersonalizedCommentRequest = {
      comment: 'Shows great improvement',
      subjectId: 1,
    }
    expect(request).toBeDefined()
    expect(request.comment).toBe('Shows great improvement')
    expect(request.subjectId).toBe(1)
  })

  it('should have correct UpdatePersonalizedCommentRequest structure', () => {
    const request: UpdatePersonalizedCommentRequest = {
      comment: 'Updated comment text',
    }
    expect(request).toBeDefined()
    expect(request.comment).toBe('Updated comment text')
  })
})
