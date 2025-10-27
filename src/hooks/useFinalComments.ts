/**
 * Custom hook for managing final comments
 * Provides CRUD operations and state management for final comments
 * Follows the same pattern as useOutcomeComments hook
 *
 * User Stories: US-FINAL-001, US-FINAL-002, US-FINAL-003, US-FINAL-004, US-FINAL-005
 */

import { useState, useCallback } from 'react'
import { finalCommentService } from '../services/api/finalCommentService'
import type {
  FinalComment,
  CreateFinalCommentRequest,
  UpdateFinalCommentRequest,
} from '../types'

interface UseFinalCommentsReturn {
  finalComments: FinalComment[]
  loading: boolean
  error: string | null
  loadFinalComments: (classId: number) => Promise<void>
  createComment: (request: CreateFinalCommentRequest) => Promise<void>
  updateComment: (id: number, request: UpdateFinalCommentRequest) => Promise<void>
  deleteComment: (id: number) => Promise<void>
  clearError: () => void
}

export const useFinalComments = (): UseFinalCommentsReturn => {
  const [finalComments, setFinalComments] = useState<FinalComment[]>([])
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

  const loadFinalComments = useCallback(async (classId: number) => {
    setLoading(true)
    setError(null)
    try {
      const comments = await finalCommentService.getByClassId(classId)
      setFinalComments(comments)
    } catch (error) {
      handleError(error, 'load final comments for class')
    } finally {
      setLoading(false)
    }
  }, [handleError])

  const createComment = useCallback(async (request: CreateFinalCommentRequest) => {
    setLoading(true)
    setError(null)
    try {
      const newComment = await finalCommentService.create(request)
      setFinalComments(prev => [...prev, newComment])
    } catch (error) {
      handleError(error, 'create final comment')
      throw error // Re-throw so component can handle UI state
    } finally {
      setLoading(false)
    }
  }, [handleError])

  const updateComment = useCallback(async (id: number, request: UpdateFinalCommentRequest) => {
    setLoading(true)
    setError(null)
    try {
      const updatedComment = await finalCommentService.update(id, request)
      setFinalComments(prev =>
        prev.map(comment => comment.id === id ? updatedComment : comment),
      )
    } catch (error) {
      handleError(error, 'update final comment')
      throw error // Re-throw so component can handle UI state
    } finally {
      setLoading(false)
    }
  }, [handleError])

  const deleteComment = useCallback(async (id: number) => {
    setLoading(true)
    setError(null)
    try {
      await finalCommentService.delete(id)
      setFinalComments(prev => prev.filter(comment => comment.id !== id))
    } catch (error) {
      handleError(error, 'delete final comment')
      throw error // Re-throw so component can handle UI state
    } finally {
      setLoading(false)
    }
  }, [handleError])

  return {
    finalComments,
    loading,
    error,
    loadFinalComments,
    createComment,
    updateComment,
    deleteComment,
    clearError,
  }
}
