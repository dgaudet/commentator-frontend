/**
 * Custom hook for managing classes
 * Provides CRUD operations and state management for classes
 * Follows the same pattern as usePersonalizedComments hook
 *
 * A Class belongs to a Subject and contains name and year fields
 */

import { useState, useCallback } from 'react'
import { classService } from '../services/api/classService'
import type { Class, CreateClassRequest, UpdateClassRequest } from '../types'

interface UseClassesReturn {
  classes: Class[]
  loading: boolean
  error: string | null
  loadClasses: (subjectId: number) => Promise<void>
  createClass: (request: CreateClassRequest) => Promise<void>
  updateClass: (id: number, request: UpdateClassRequest) => Promise<void>
  deleteClass: (id: number) => Promise<void>
  clearError: () => void
}

export const useClasses = (): UseClassesReturn => {
  const [classes, setClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const handleError = useCallback((error: unknown, operation: string) => {
    console.error(`Failed to ${operation}:`, error)
    const message = error instanceof Error ? error.message : `Failed to ${operation}`
    setError(message)
  }, [])

  const loadClasses = useCallback(async (subjectId: number) => {
    setLoading(true)
    setError(null)
    try {
      const fetchedClasses = await classService.getBySubjectId(subjectId)
      setClasses(fetchedClasses)
    } catch (error) {
      handleError(error, 'load classes for subject')
    } finally {
      setLoading(false)
    }
  }, [handleError])

  const createClass = useCallback(async (request: CreateClassRequest) => {
    setLoading(true)
    setError(null)
    try {
      const newClass = await classService.create(request)
      setClasses(prev => [...prev, newClass])
    } catch (error) {
      handleError(error, 'create class')
      throw error // Re-throw so component can handle UI state
    } finally {
      setLoading(false)
    }
  }, [handleError])

  const updateClass = useCallback(async (id: number, request: UpdateClassRequest) => {
    setLoading(true)
    setError(null)
    try {
      const updatedClass = await classService.update(id, request)
      setClasses(prev =>
        prev.map(cls => cls.id === id ? updatedClass : cls),
      )
    } catch (error) {
      handleError(error, 'update class')
      throw error // Re-throw so component can handle UI state
    } finally {
      setLoading(false)
    }
  }, [handleError])

  const deleteClass = useCallback(async (id: number) => {
    setLoading(true)
    setError(null)
    try {
      await classService.delete(id)
      setClasses(prev => prev.filter(cls => cls.id !== id))
    } catch (error) {
      handleError(error, 'delete class')
      throw error // Re-throw so component can handle UI state
    } finally {
      setLoading(false)
    }
  }, [handleError])

  return {
    classes,
    loading,
    error,
    loadClasses,
    createClass,
    updateClass,
    deleteClass,
    clearError,
  }
}
