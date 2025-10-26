/**
 * Mock Subject Data
 * Test data for MSW handlers
 * Reference: US-REFACTOR-012
 *
 * Key Difference: Subject has NO year field (only id, name, createdAt, updatedAt)
 */
import { Subject } from '../../types/Subject'

export const mockSubjects: Subject[] = [
  {
    id: 1,
    name: 'Mathematics 101',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 2,
    name: 'English 201',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 3,
    name: 'Science 301',
    createdAt: '2024-02-20T14:15:00Z',
    updatedAt: '2024-02-20T14:15:00Z',
  },
]
