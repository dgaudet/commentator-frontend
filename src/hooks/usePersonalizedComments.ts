/**
 * Custom hook for managing personalized comments
 * Provides CRUD operations and state management for personalized comments
 * Follows the same pattern as useOutcomeComments hook
 *
 * Simpler than useOutcomeComments - no upperRange/lowerRange fields
 */

import { useState, useCallback } from 'react'
import { personalizedCommentService } from '../services/api/personalizedCommentService'
import type {
  PersonalizedComment,
  CreatePersonalizedCommentRequest,
  UpdatePersonalizedCommentRequest,
} from '../types'

interface UsePersonalizedCommentsReturn {
  personalizedComments: PersonalizedComment[]
  loading: boolean
  error: string | null
  loadPersonalizedComments: (subjectId: number) => Promise<void>
  createComment: (request: CreatePersonalizedCommentRequest) => Promise<void>
  updateComment: (id: number, request: UpdatePersonalizedCommentRequest) => Promise<void>
  deleteComment: (id: number) => Promise<void>
  clearError: () => void
}

export const usePersonalizedComments = (): UsePersonalizedCommentsReturn => {
  const [personalizedComments, setPersonalizedComments] = useState<PersonalizedComment[]>([])
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

  const loadPersonalizedComments = useCallback(async (subjectId: number) => {
    setLoading(true)
    setError(null)
    try {
      const comments = await personalizedCommentService.getBySubjectId(subjectId)
      setPersonalizedComments(comments)
    } catch (error) {
      handleError(error, 'load personalized comments for subject')
    } finally {
      setLoading(false)
    }
  }, [handleError])

  const createComment = useCallback(async (request: CreatePersonalizedCommentRequest) => {
    setLoading(true)
    setError(null)
    try {
      const newComment = await personalizedCommentService.create(request)
      setPersonalizedComments(prev => [...prev, newComment])
    } catch (error) {
      handleError(error, 'create personalized comment')
      throw error // Re-throw so component can handle UI state
    } finally {
      setLoading(false)
    }
  }, [handleError])

  const updateComment = useCallback(async (id: number, request: UpdatePersonalizedCommentRequest) => {
    setLoading(true)
    setError(null)
    try {
      const updatedComment = await personalizedCommentService.update(id, request)
      setPersonalizedComments(prev =>
        prev.map(comment => comment.id === id ? updatedComment : comment),
      )
    } catch (error) {
      handleError(error, 'update personalized comment')
      throw error // Re-throw so component can handle UI state
    } finally {
      setLoading(false)
    }
  }, [handleError])

  const deleteComment = useCallback(async (id: number) => {
    setLoading(true)
    setError(null)
    try {
      await personalizedCommentService.delete(id)
      setPersonalizedComments(prev => prev.filter(comment => comment.id !== id))
    } catch (error) {
      handleError(error, 'delete personalized comment')
      throw error // Re-throw so component can handle UI state
    } finally {
      setLoading(false)
    }
  }, [handleError])

  return {
    personalizedComments,
    loading,
    error,
    loadPersonalizedComments,
    createComment,
    updateComment,
    deleteComment,
    clearError,
  }
}
