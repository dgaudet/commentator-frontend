/**
 * useSubjects Custom Hook
 * Manages subject data and CRUD operations with centralized state
 *
 * API Change: classService → subjectService, /class → /subject
 * Key Change: Subject has no year field, so sorting is by name only (ascending)
 *
 * Features:
 * - Auto-fetches subjects on mount
 * - Manages loading and error states
 * - Automatic sorting by name (ascending)
 * - CRUD operations with optimistic updates
 * - Error handling with error state management
 */
import { useState, useEffect, useCallback } from 'react'
import { Subject, CreateSubjectRequest, UpdateSubjectRequest } from '../types/Subject'
import { subjectService } from '../services/api/subjectService'

interface UseSubjectsReturn {
  subjects: Subject[]
  isLoading: boolean
  error: string | null
  fetchSubjects: () => Promise<void>
  createSubject: (data: CreateSubjectRequest) => Promise<Subject>
  updateSubject: (id: number, data: UpdateSubjectRequest) => Promise<Subject>
  deleteSubject: (id: number) => Promise<void>
  clearError: () => void
}

/**
 * Sort subjects by name (ascending)
 * Business requirement: Alphabetical sorting for subjects
 * Note: No year sorting since Subject entity has no year field
 */
function sortSubjects(subjects: Subject[]): Subject[] {
  return [...subjects].sort((a, b) => {
    return a.name.localeCompare(b.name) // Ascending name
  })
}

/**
 * Custom hook for managing subject data and operations
 * Provides centralized state management for all subject-related CRUD operations
 *
 * @returns {UseSubjectsReturn} Subjects state and CRUD operations
 *
 * @example
 * const { subjects, isLoading, error, createSubject } = useSubjects();
 *
 * // Create new subject (only name field, no year)
 * await createSubject({ name: 'Mathematics 101' });
 */
export function useSubjects(): UseSubjectsReturn {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Fetch all subjects from API
   * Automatically sorts results
   */
  const fetchSubjects = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await subjectService.getAll()
      const sorted = sortSubjects(data)
      setSubjects(sorted)
    } catch (err: unknown) {
      const errorMessage = (err as Error).message || 'Failed to fetch subjects'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Auto-fetch subjects on mount
   *
   * Dependency on fetchSubjects is intentional:
   * - fetchSubjects is memoized with useCallback (empty deps)
   * - Effect runs once on mount, never re-runs
   * - fetchSubjects dependency ensures code clarity even if hook evolves
   */
  useEffect(() => {
    fetchSubjects()
  }, [fetchSubjects])

  /**
   * Create new subject
   * Adds to local state and re-sorts
   */
  const createSubject = useCallback(async (data: CreateSubjectRequest): Promise<Subject> => {
    setIsLoading(true)
    setError(null)
    try {
      const newSubject = await subjectService.create(data)
      setSubjects((prev) => sortSubjects([...prev, newSubject]))
      return newSubject
    } catch (err: unknown) {
      const errorMessage = (err as Error).message || 'Failed to create subject'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Update existing subject
   * Updates local state and re-sorts
   */
  const updateSubject = useCallback(
    async (id: number, data: UpdateSubjectRequest): Promise<Subject> => {
      setIsLoading(true)
      setError(null)
      try {
        const updatedSubject = await subjectService.update(id, data)
        setSubjects((prev) => {
          const updated = prev.map((s) => (s.id === id ? updatedSubject : s))
          return sortSubjects(updated)
        })
        return updatedSubject
      } catch (err: unknown) {
        const errorMessage = (err as Error).message || 'Failed to update subject'
        setError(errorMessage)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  /**
   * Delete subject
   * Removes from local state
   */
  const deleteSubject = useCallback(async (id: number): Promise<void> => {
    setIsLoading(true)
    setError(null)
    try {
      await subjectService.delete(id)
      setSubjects((prev) => prev.filter((s) => s.id !== id))
    } catch (err: unknown) {
      const errorMessage = (err as Error).message || 'Failed to delete subject'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    subjects,
    isLoading,
    error,
    fetchSubjects,
    createSubject,
    updateSubject,
    deleteSubject,
    clearError,
  }
}
