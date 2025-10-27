/**
 * Mock Class Data
 * Test data for MSW handlers
 *
 * Classes belong to Subjects and include:
 * - name: Class/section name (e.g., "Advanced Section", "Period 1")
 * - year: Academic year (e.g., 2024, 2025)
 * - subjectId: Foreign key to Subject
 */
import { Class } from '../../types/Class'

export const mockClasses: Class[] = [
  {
    id: 1,
    subjectId: 1,
    name: 'Advanced Section',
    year: 2024,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 2,
    subjectId: 1,
    name: 'Honors Class',
    year: 2024,
    createdAt: '2024-01-15T11:00:00Z',
    updatedAt: '2024-01-15T11:00:00Z',
  },
  {
    id: 3,
    subjectId: 1,
    name: 'Regular Section',
    year: 2025,
    createdAt: '2024-01-20T09:00:00Z',
    updatedAt: '2024-01-20T09:00:00Z',
  },
  {
    id: 4,
    subjectId: 2,
    name: 'Period 1',
    year: 2024,
    createdAt: '2024-02-10T08:30:00Z',
    updatedAt: '2024-02-10T08:30:00Z',
  },
  {
    id: 5,
    subjectId: 2,
    name: 'Period 2',
    year: 2024,
    createdAt: '2024-02-10T08:35:00Z',
    updatedAt: '2024-02-10T08:35:00Z',
  },
  {
    id: 6,
    subjectId: 3,
    name: 'Lab Section A',
    year: 2024,
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-03-01T10:00:00Z',
  },
]
