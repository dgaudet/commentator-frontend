/**
 * Custom hook for managing outcome comments
 * Provides CRUD operations and state management for outcome comments
 * Follows the same pattern as useSubjects hook
 *
 * Related: TD-002 (OutcomeComment classId → subjectId Migration)
 * Change: loadOutcomeComments now takes subjectId parameter instead of classId
 */

import { useState, useCallback } from 'react'
import { outcomeCommentService } from '../services/api/outcomeCommentService'
import type {
  OutcomeComment,
  CreateOutcomeCommentRequest,
  UpdateOutcomeCommentRequest,
} from '../types'

interface UseOutcomeCommentsReturn {
  outcomeComments: OutcomeComment[]
  loading: boolean
  error: string | null
  loadOutcomeComments: (subjectId: string) => Promise<void>
  createComment: (request: CreateOutcomeCommentRequest) => Promise<void>
  updateComment: (id: string, request: UpdateOutcomeCommentRequest) => Promise<void>
  deleteComment: (id: string) => Promise<void>
  clearError: () => void
}

export const useOutcomeComments = (): UseOutcomeCommentsReturn => {
  const [outcomeComments, setOutcomeComments] = useState<OutcomeComment[]>([])
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

  const loadOutcomeComments = useCallback(async (subjectId: string) => {
    setLoading(true)
    setError(null)
    try {
      const comments = await outcomeCommentService.getBySubjectId(subjectId)
      setOutcomeComments(comments)
    } catch (error) {
      handleError(error, 'load outcome comments for subject')
    } finally {
      setLoading(false)
    }
  }, [handleError])

  const createComment = useCallback(async (request: CreateOutcomeCommentRequest) => {
    setLoading(true)
    setError(null)
    try {
      const newComment = await outcomeCommentService.create(request)
      setOutcomeComments(prev => [...prev, newComment])
    } catch (error) {
      handleError(error, 'create outcome comment')
      throw error // Re-throw so component can handle UI state
    } finally {
      setLoading(false)
    }
  }, [handleError])

  const updateComment = useCallback(async (id: string, request: UpdateOutcomeCommentRequest) => {
    setLoading(true)
    setError(null)
    try {
      const updatedComment = await outcomeCommentService.update(id, request)
      setOutcomeComments(prev =>
        prev.map(comment => comment.id === id ? updatedComment : comment),
      )
    } catch (error) {
      handleError(error, 'update outcome comment')
      throw error // Re-throw so component can handle UI state
    } finally {
      setLoading(false)
    }
  }, [handleError])

  const deleteComment = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      await outcomeCommentService.delete(id)
      setOutcomeComments(prev => prev.filter(comment => comment.id !== id))
    } catch (error) {
      handleError(error, 'delete outcome comment')
      throw error // Re-throw so component can handle UI state
    } finally {
      setLoading(false)
    }
  }, [handleError])

  return {
    outcomeComments,
    loading,
    error,
    loadOutcomeComments,
    createComment,
    updateComment,
    deleteComment,
    clearError,
  }
}
