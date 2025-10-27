import type { PersonalizedComment } from '../../types'

/**
 * Mock Personalized Comments Data
 * Used for MSW handlers and testing
 */
export const mockPersonalizedComments: PersonalizedComment[] = [
  {
    id: 1,
    comment: 'Shows great improvement in problem-solving skills',
    subjectId: 1,
    createdAt: '2024-01-15T10:30:00.000Z',
    updatedAt: '2024-01-15T10:30:00.000Z',
  },
  {
    id: 2,
    comment: 'Excellent participation in class discussions',
    subjectId: 1,
    createdAt: '2024-01-16T14:20:00.000Z',
    updatedAt: '2024-01-16T14:20:00.000Z',
  },
  {
    id: 3,
    comment: 'Demonstrates strong collaboration skills with peers',
    subjectId: 2,
    createdAt: '2024-01-17T09:15:00.000Z',
    updatedAt: '2024-01-17T09:15:00.000Z',
  },
]
