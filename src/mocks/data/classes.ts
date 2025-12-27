/**
 * Mock Class Data
 * Test data for MSW handlers
 *
 * Classes belong to Subjects and include:
 * - name: Class/section name (e.g., "Advanced Section", "Period 1")
 * - year: Academic year (e.g., 2024, 2025)
 * - subjectId: Foreign key to Subject
 *
 * ID Migration: Using string IDs (MongoDB ObjectId format)
 */
import { Class } from '../../types/Class'
import {
  MOCK_SUBJECT_ID_MATH,
  MOCK_SUBJECT_ID_ENGLISH,
  MOCK_SUBJECT_ID_SCIENCE,
} from './subjects'

// Export ID constants for use in other mock files
export const MOCK_CLASS_ID_MATH_ADVANCED = '75a1b2c3d4e5f6g7h8i9j0k1'
export const MOCK_CLASS_ID_MATH_HONORS = '75a1b2c3d4e5f6g7h8i9j0k2'
export const MOCK_CLASS_ID_MATH_REGULAR = '75a1b2c3d4e5f6g7h8i9j0k3'
export const MOCK_CLASS_ID_ENGLISH_P1 = '75a1b2c3d4e5f6g7h8i9j0k4'
export const MOCK_CLASS_ID_ENGLISH_P2 = '75a1b2c3d4e5f6g7h8i9j0k5'
export const MOCK_CLASS_ID_SCIENCE_LAB = '75a1b2c3d4e5f6g7h8i9j0k6'

export const mockClasses: Class[] = [
  {
    id: MOCK_CLASS_ID_MATH_ADVANCED,
    subjectId: MOCK_SUBJECT_ID_MATH,
    name: 'Advanced Section',
    year: 2024,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: MOCK_CLASS_ID_MATH_HONORS,
    subjectId: MOCK_SUBJECT_ID_MATH,
    name: 'Honors Class',
    year: 2024,
    createdAt: '2024-01-15T11:00:00Z',
    updatedAt: '2024-01-15T11:00:00Z',
  },
  {
    id: MOCK_CLASS_ID_MATH_REGULAR,
    subjectId: MOCK_SUBJECT_ID_MATH,
    name: 'Regular Section',
    year: 2025,
    createdAt: '2024-01-20T09:00:00Z',
    updatedAt: '2024-01-20T09:00:00Z',
  },
  {
    id: MOCK_CLASS_ID_ENGLISH_P1,
    subjectId: MOCK_SUBJECT_ID_ENGLISH,
    name: 'Period 1',
    year: 2024,
    createdAt: '2024-02-10T08:30:00Z',
    updatedAt: '2024-02-10T08:30:00Z',
  },
  {
    id: MOCK_CLASS_ID_ENGLISH_P2,
    subjectId: MOCK_SUBJECT_ID_ENGLISH,
    name: 'Period 2',
    year: 2024,
    createdAt: '2024-02-10T08:35:00Z',
    updatedAt: '2024-02-10T08:35:00Z',
  },
  {
    id: MOCK_CLASS_ID_SCIENCE_LAB,
    subjectId: MOCK_SUBJECT_ID_SCIENCE,
    name: 'Lab Section A',
    year: 2024,
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-03-01T10:00:00Z',
  },
]
