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

  // State setters
  setFirstName: (value: string) => void
  setLastName: (value: string) => void
  setGrade: (value: number | '') => void
  setComment: (value: string) => void
  setPersonalizedCommentSearch: (value: string) => void
  setValidationError: (value: string) => void

  // Outcome comment matching
  matchedOutcomeComment: string | null

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

  /**
   * Find the outcome comment that matches the current grade range
   * Returns the comment text or null if no match found
   *
   * @memoized Recalculates only when grade or outcomeComments change
   */
  const matchedOutcomeComment = useMemo(() => {
    if (grade === '' || outcomeComments.length === 0) {
      return null
    }

    const gradeNum = Number(grade)
    const matchedComment = outcomeComments.find(
      (comment) => comment.lowerRange <= gradeNum && gradeNum <= comment.upperRange,
    )

    return matchedComment ? matchedComment.comment : null
  }, [grade, outcomeComments])

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

    if (comment.length > 1000) {
      return 'Comment cannot exceed 1000 characters'
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
  }, [])

  return {
    // State
    firstName,
    lastName,
    grade,
    comment,
    personalizedCommentSearch,
    validationError,

    // Setters
    setFirstName,
    setLastName,
    setGrade,
    setComment,
    setPersonalizedCommentSearch,
    setValidationError,

    // Outcome comment matching
    matchedOutcomeComment,

    // Validation
    validate,
    clearValidationError,

    // Reset
    reset,
  }
}
