import type { FinalComment, CreateFinalCommentRequest, UpdateFinalCommentRequest } from '../FinalComment'

describe('FinalComment Types', () => {
  it('should have string id and classId, numeric grade', () => {
    const comment: FinalComment = {
      id: 'a5e6f7g8h9i0j1k2l3m4n5o6',
      classId: '75b2c3d4e5f6g7h8i9j0k1l2',
      firstName: 'John',
      lastName: 'Doe',
      grade: 85,
      comment: 'Excellent work',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
    }
    expect(typeof comment.id).toBe('string')
    expect(typeof comment.classId).toBe('string')
    expect(typeof comment.grade).toBe('number')
    expect(comment.id).toBe('a5e6f7g8h9i0j1k2l3m4n5o6')
    expect(comment.classId).toBe('75b2c3d4e5f6g7h8i9j0k1l2')
    expect(comment.firstName).toBe('John')
    expect(comment.lastName).toBe('Doe')
    expect(comment.grade).toBe(85)
    expect(comment.comment).toBe('Excellent work')
    expect(comment.createdAt).toBe('2024-01-15T10:30:00Z')
    expect(comment.updatedAt).toBe('2024-01-15T10:30:00Z')
  })

  it('should have correct CreateFinalCommentRequest structure', () => {
    const request: CreateFinalCommentRequest = {
      classId: '75b2c3d4e5f6g7h8i9j0k1l2',
      firstName: 'John',
      lastName: 'Doe',
      grade: 85,
      comment: 'Excellent work',
    }
    expect(request).toBeDefined()
    expect(typeof request.classId).toBe('string')
    expect(typeof request.grade).toBe('number')
    expect(request.classId).toBe('75b2c3d4e5f6g7h8i9j0k1l2')
    expect(request.firstName).toBe('John')
    expect(request.lastName).toBe('Doe')
    expect(request.grade).toBe(85)
    expect(request.comment).toBe('Excellent work')
  })

  it('should have correct UpdateFinalCommentRequest structure', () => {
    const request: UpdateFinalCommentRequest = {
      classId: '85c3d4e5f6g7h8i9j0k1l2m3',
      firstName: 'Jane',
      lastName: 'Smith',
      grade: 92,
      comment: 'Outstanding progress',
    }
    expect(request).toBeDefined()
    expect(typeof request.classId).toBe('string')
    expect(typeof request.grade).toBe('number')
    expect(request.classId).toBe('85c3d4e5f6g7h8i9j0k1l2m3')
    expect(request.firstName).toBe('Jane')
    expect(request.lastName).toBe('Smith')
    expect(request.grade).toBe(92)
    expect(request.comment).toBe('Outstanding progress')
  })

  it('should handle optional fields correctly', () => {
    const minimalComment: FinalComment = {
      id: 'b6f7g8h9i0j1k2l3m4n5o6p7',
      classId: '95d4e5f6g7h8i9j0k1l2m3n4',
      firstName: 'Alice',
      grade: 78,
      createdAt: '2024-01-20T14:00:00Z',
      updatedAt: '2024-01-20T14:00:00Z',
    }
    expect(minimalComment.id).toBe('b6f7g8h9i0j1k2l3m4n5o6p7')
    expect(minimalComment.classId).toBe('95d4e5f6g7h8i9j0k1l2m3n4')
    expect(minimalComment.firstName).toBe('Alice')
    expect(minimalComment.lastName).toBeUndefined()
    expect(minimalComment.grade).toBe(78)
    expect(minimalComment.comment).toBeUndefined()
  })
})
