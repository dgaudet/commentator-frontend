/**
 * Mock Subject Data
 * Test data for MSW handlers
 * Reference: US-REFACTOR-012
 *
 * Key Difference: Subject has NO year field (only id, name, createdAt, updatedAt)
 * ID Migration: Using string IDs (MongoDB ObjectId format)
 */
import { Subject } from '../../types/Subject'

// Export ID constants for use in other mock files
export const MOCK_SUBJECT_ID_MATH = '65a1b2c3d4e5f6g7h8i9j0k1'
export const MOCK_SUBJECT_ID_ENGLISH = '65a1b2c3d4e5f6g7h8i9j0k2'
export const MOCK_SUBJECT_ID_SCIENCE = '65a1b2c3d4e5f6g7h8i9j0k3'

export const mockSubjects: Subject[] = [
  {
    id: MOCK_SUBJECT_ID_MATH,
    name: 'Mathematics 101',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: MOCK_SUBJECT_ID_ENGLISH,
    name: 'English 201',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: MOCK_SUBJECT_ID_SCIENCE,
    name: 'Science 301',
    createdAt: '2024-02-20T14:15:00Z',
    updatedAt: '2024-02-20T14:15:00Z',
  },
]
