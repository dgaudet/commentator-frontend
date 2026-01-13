/**
 * useFinalCommentForm Hook
 * TDD Phase: GREEN - Minimal implementation to pass tests
 * Reference: US-FC-REFACTOR-001
 *
 * Shared form logic for Add/Edit final comment forms.
 * Extracts duplicated state management, validation, and outcome comment matching.
 *
 * Features:
 * - Form state management (firstName, lastName, grade, comment)
 * - Validation logic (required fields, grade range, character limits)
 * - Outcome comment matching based on grade
 * - Personalized comment search state
 * - Form reset functionality
 */

import { useState, useMemo, useCallback } from 'react'
import type { OutcomeComment } from '../types'

interface UseFinalCommentFormOptions {
  firstName?: string
  lastName?: string
  grade?: number | ''
  comment?: string
  personalizedCommentSearch?: string
}

interface UseFinalCommentFormReturn {
  // Form state
  firstName: string
  lastName: string
  grade: number | ''
  comment: string
  personalizedCommentSearch: string
  validationError: string
  selectedOutcomeCommentId: string | null

  // State setters
  setFirstName: (value: string) => void
  setLastName: (value: string) => void
  setGrade: (value: number | '') => void
  setComment: (value: string) => void
  setPersonalizedCommentSearch: (value: string) => void
  setValidationError: (value: string) => void
  setSelectedOutcomeCommentId: (id: string) => void

  // Outcome comment matching
  matchedOutcomeComment: string | null
  matchedOutcomeComments: OutcomeComment[]

  // Validation
  validate: () => string | null
  clearValidationError: () => void

  // Form reset
  reset: () => void
}

/**
 * Custom hook for managing final comment form state and logic
 *
 * @param outcomeComments - List of outcome comments for grade matching
 * @param initialValues - Optional initial form values (for edit mode)
 * @returns Form state, setters, validation, and utility functions
 */
export const useFinalCommentForm = (
  outcomeComments: OutcomeComment[],
  initialValues?: UseFinalCommentFormOptions,
): UseFinalCommentFormReturn => {
  // Form state
  const [firstName, setFirstName] = useState(initialValues?.firstName || '')
  const [lastName, setLastName] = useState(initialValues?.lastName || '')
  const [grade, setGrade] = useState<number | ''>(initialValues?.grade ?? '')
  const [comment, setComment] = useState(initialValues?.comment || '')
  const [personalizedCommentSearch, setPersonalizedCommentSearch] = useState(
    initialValues?.personalizedCommentSearch || '',
  )
  const [validationError, setValidationError] = useState('')
  const [selectedOutcomeCommentId, setSelectedOutcomeCommentId] = useState<string | null>(null)

  /**
   * Find all outcome comments that match the current grade range
   * Supports multiple outcomes per grade for US-FINAL-001 through US-FINAL-005
   *
   * @memoized Recalculates only when grade or outcomeComments change
   */
  const matchedOutcomeComments = useMemo(() => {
    if (grade === '' || outcomeComments.length === 0) {
      return []
    }

    const gradeNum = Number(grade)
    return outcomeComments.filter(
      (comment) => comment.lowerRange <= gradeNum && gradeNum <= comment.upperRange,
    )
  }, [grade, outcomeComments])

  /**
   * Get the currently selected outcome comment text
   * Prioritizes selectedOutcomeCommentId, falls back to first match
   *
   * @memoized Recalculates when matched comments or selection changes
   */
  const matchedOutcomeComment = useMemo(() => {
    if (matchedOutcomeComments.length === 0) {
      return null
    }

    // If a specific comment is selected, use that one's text
    if (selectedOutcomeCommentId) {
      const selected = matchedOutcomeComments.find((c) => c.id === selectedOutcomeCommentId)
      return selected ? selected.comment : matchedOutcomeComments[0].comment
    }

    // Otherwise use the first match
    return matchedOutcomeComments[0].comment
  }, [matchedOutcomeComments, selectedOutcomeCommentId])

  /**
   * Validate the form fields
   * Returns error message string or null if valid
   */
  const validate = useCallback((): string | null => {
    const trimmedFirstName = firstName.trim()

    if (!trimmedFirstName) {
      return 'First name is required'
    }

    if (grade === '') {
      return 'Grade is required'
    }

    const gradeNum = Number(grade)
    if (gradeNum < 0 || gradeNum > 100) {
      return 'Grade must be between 0 and 100'
    }

    if (comment.length > 3000) {
      return 'Comment cannot exceed 3000 characters'
    }

    return null
  }, [firstName, grade, comment])

  /**
   * Clear validation error
   */
  const clearValidationError = useCallback(() => {
    setValidationError('')
  }, [])

  /**
   * Reset all form fields to empty state
   */
  const reset = useCallback(() => {
    setFirstName('')
    setLastName('')
    setGrade('')
    setComment('')
    setPersonalizedCommentSearch('')
    setValidationError('')
    setSelectedOutcomeCommentId(null)
  }, [])

  return {
    // State
    firstName,
    lastName,
    grade,
    comment,
    personalizedCommentSearch,
    validationError,
    selectedOutcomeCommentId,

    // Setters
    setFirstName,
    setLastName,
    setGrade,
    setComment,
    setPersonalizedCommentSearch,
    setValidationError,
    setSelectedOutcomeCommentId,

    // Outcome comment matching
    matchedOutcomeComment,
    matchedOutcomeComments,

    // Validation
    validate,
    clearValidationError,

    // Reset
    reset,
  }
}
