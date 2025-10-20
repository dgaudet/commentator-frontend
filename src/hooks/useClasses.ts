/**
 * useClasses Custom Hook
 * Manages class data and CRUD operations with centralized state
 *
 * Reference: TASK-3.1, US-CLASS-001, US-CLASS-002, DES-9
 *
 * Features:
 * - Auto-fetches classes on mount
 * - Manages loading and error states
 * - Automatic sorting by year (desc) then name (asc)
 * - CRUD operations with optimistic updates
 * - Error handling with error state management
 */
import { useState, useEffect, useCallback } from 'react'
import { Class, CreateClassRequest, UpdateClassRequest } from '../types/Class'
import { classService } from '../services/api/classService'

interface UseClassesReturn {
  classes: Class[]
  isLoading: boolean
  error: string | null
  fetchClasses: () => Promise<void>
  createClass: (data: CreateClassRequest) => Promise<Class>
  updateClass: (id: number, data: UpdateClassRequest) => Promise<Class>
  deleteClass: (id: number) => Promise<void>
  clearError: () => void
}

/**
 * Sort classes by year (descending), then by name (ascending)
 * Business requirement from DES-9
 */
function sortClasses(classes: Class[]): Class[] {
  return [...classes].sort((a, b) => {
    if (a.year !== b.year) {
      return b.year - a.year // Descending year
    }
    return a.name.localeCompare(b.name) // Ascending name
  })
}

/**
 * Custom hook for managing class data and operations
 * Provides centralized state management for all class-related CRUD operations
 *
 * @returns {UseClassesReturn} Classes state and CRUD operations
 *
 * @example
 * const { classes, isLoading, error, createClass } = useClasses();
 *
 * // Create new class
 * await createClass({ name: 'Math 101', year: 2025 });
 */
export function useClasses(): UseClassesReturn {
  const [classes, setClasses] = useState<Class[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Fetch all classes from API
   * Automatically sorts results
   */
  const fetchClasses = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await classService.getAll()
      const sorted = sortClasses(data)
      setClasses(sorted)
    } catch (err: unknown) {
      const errorMessage = (err as Error).message || 'Failed to fetch classes'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Auto-fetch classes on mount
   */
  useEffect(() => {
    fetchClasses()
  }, [fetchClasses])

  /**
   * Create new class
   * Adds to local state and re-sorts
   */
  const createClass = useCallback(async (data: CreateClassRequest): Promise<Class> => {
    setIsLoading(true)
    setError(null)
    try {
      const newClass = await classService.create(data)
      setClasses((prev) => sortClasses([...prev, newClass]))
      return newClass
    } catch (err: unknown) {
      const errorMessage = (err as Error).message || 'Failed to create class'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Update existing class
   * Updates local state and re-sorts
   */
  const updateClass = useCallback(
    async (id: number, data: UpdateClassRequest): Promise<Class> => {
      setIsLoading(true)
      setError(null)
      try {
        const updatedClass = await classService.update(id, data)
        setClasses((prev) => {
          const updated = prev.map((c) => (c.id === id ? updatedClass : c))
          return sortClasses(updated)
        })
        return updatedClass
      } catch (err: unknown) {
        const errorMessage = (err as Error).message || 'Failed to update class'
        setError(errorMessage)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  /**
   * Delete class
   * Removes from local state
   */
  const deleteClass = useCallback(async (id: number): Promise<void> => {
    setIsLoading(true)
    setError(null)
    try {
      await classService.delete(id)
      setClasses((prev) => prev.filter((c) => c.id !== id))
    } catch (err: unknown) {
      const errorMessage = (err as Error).message || 'Failed to delete class'
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
    classes,
    isLoading,
    error,
    fetchClasses,
    createClass,
    updateClass,
    deleteClass,
    clearError,
  }
}
