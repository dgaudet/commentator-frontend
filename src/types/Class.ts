/**
 * Class Type Definitions
 * Represents a class/course section within a subject
 *
 * A Class belongs to a Subject and contains:
 * - id: MongoDB ObjectId as string (e.g., "75b2c3d4e5f6g7h8i9j0k1l2")
 * - subjectId: Foreign key to Subject (MongoDB ObjectId as string)
 * - name: The class name (e.g., "Advanced Section", "Period 1")
 * - year: The academic year as number (e.g., 2024, 2025)
 *
 * Business Rules:
 * - The combination of (subjectId + name + year) must be unique (case-insensitive)
 * - name: Required, 1-100 characters, trimmed
 * - year: Required, 2000-2099
 */

export interface Class {
  id: string
  subjectId: string
  name: string
  year: number
  createdAt: string
  updatedAt: string
}

export interface CreateClassRequest {
  subjectId: string
  name: string
  year: number
}

export interface UpdateClassRequest {
  subjectId?: string
  name: string
  year: number
}
