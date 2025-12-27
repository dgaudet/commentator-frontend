import type { PersonalizedComment } from '../../types'
import { MOCK_SUBJECT_ID_MATH, MOCK_SUBJECT_ID_ENGLISH } from './subjects'

/**
 * Mock Personalized Comments Data
 * Used for MSW handlers and testing
 * ID Migration: Using string IDs (MongoDB ObjectId format)
 */

// Export ID constants for use in other mock files
export const MOCK_PERSONALIZED_COMMENT_ID_1 = '85a1b2c3d4e5f6g7h8i9j0k1'
export const MOCK_PERSONALIZED_COMMENT_ID_2 = '85a1b2c3d4e5f6g7h8i9j0k2'
export const MOCK_PERSONALIZED_COMMENT_ID_3 = '85a1b2c3d4e5f6g7h8i9j0k3'

export const mockPersonalizedComments: PersonalizedComment[] = [
  {
    id: MOCK_PERSONALIZED_COMMENT_ID_1,
    comment: 'Shows great improvement in problem-solving skills',
    subjectId: MOCK_SUBJECT_ID_MATH,
    createdAt: '2024-01-15T10:30:00.000Z',
    updatedAt: '2024-01-15T10:30:00.000Z',
  },
  {
    id: MOCK_PERSONALIZED_COMMENT_ID_2,
    comment: 'Excellent participation in class discussions',
    subjectId: MOCK_SUBJECT_ID_MATH,
    createdAt: '2024-01-16T14:20:00.000Z',
    updatedAt: '2024-01-16T14:20:00.000Z',
  },
  {
    id: MOCK_PERSONALIZED_COMMENT_ID_3,
    comment: 'Demonstrates strong collaboration skills with peers',
    subjectId: MOCK_SUBJECT_ID_ENGLISH,
    createdAt: '2024-01-17T09:15:00.000Z',
    updatedAt: '2024-01-17T09:15:00.000Z',
  },
]
