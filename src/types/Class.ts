/**
 * Class Type Definitions
 * Represents a class/course section within a subject
 *
 * A Class belongs to a Subject and contains:
 * - name: The class name (e.g., "Advanced Section", "Period 1")
 * - year: The academic year (e.g., 2024, 2025)
 *
 * Business Rules:
 * - The combination of (subjectId + name + year) must be unique (case-insensitive)
 * - name: Required, 1-100 characters, trimmed
 * - year: Required, 2000-2099
 */

export interface Class {
  id: number
  subjectId: number
  name: string
  year: number
  createdAt: string
  updatedAt: string
}

export interface CreateClassRequest {
  subjectId: number
  name: string
  year: number
}

export interface UpdateClassRequest {
  name: string
  year: number
}
