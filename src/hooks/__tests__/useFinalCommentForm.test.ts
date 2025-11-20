/**
 * useFinalCommentForm Hook Tests
 * TDD Phase: RED - Writing failing tests first
 * Reference: US-FC-REFACTOR-001
 *
 * Testing shared form logic for Add/Edit final comment forms:
 * - Form state management
 * - Validation logic
 * - Form reset/clear
 * - Outcome comment matching
 * - Personalized comment search state
 *
 * Story 5 Optimization: Uses fixture factories instead of inline mock data
 */

import { renderHook, act } from '@testing-library/react'
import { useFinalCommentForm } from '../useFinalCommentForm'
import { createMockOutcomeComments } from '../../test-utils'

const mockOutcomeComments = [
  createMockOutcomeComments(1, {
    id: 1,
    upperRange: 100,
    lowerRange: 90,
    comment: 'Excellent achievement',
  })[0],
  createMockOutcomeComments(1, {
    id: 2,
    upperRange: 89,
    lowerRange: 80,
    comment: 'Very good work',
  })[0],
  createMockOutcomeComments(1, {
    id: 3,
    upperRange: 79,
    lowerRange: 70,
    comment: 'Good effort',
  })[0],
]

describe('useFinalCommentForm', () => {
  describe('Hook Initialization', () => {
    it('should initialize with empty form values', () => {
      const { result } = renderHook(() => useFinalCommentForm(mockOutcomeComments))

      expect(result.current.firstName).toBe('')
      expect(result.current.lastName).toBe('')
      expect(result.current.grade).toBe('')
      expect(result.current.comment).toBe('')
      expect(result.current.personalizedCommentSearch).toBe('')
      expect(result.current.validationError).toBe('')
    })

    it('should initialize with provided initial values', () => {
      const initialValues = {
        firstName: 'John',
        lastName: 'Doe',
        grade: 85 as number | '',
        comment: 'Great work',
        personalizedCommentSearch: '',
      }

      const { result } = renderHook(() =>
        useFinalCommentForm(mockOutcomeComments, initialValues),
      )

      expect(result.current.firstName).toBe('John')
      expect(result.current.lastName).toBe('Doe')
      expect(result.current.grade).toBe(85)
      expect(result.current.comment).toBe('Great work')
    })
  })

  describe('Form State Updates', () => {
    it('should update firstName', () => {
      const { result } = renderHook(() => useFinalCommentForm(mockOutcomeComments))

      act(() => {
        result.current.setFirstName('Jane')
      })

      expect(result.current.firstName).toBe('Jane')
    })

    it('should update lastName', () => {
      const { result } = renderHook(() => useFinalCommentForm(mockOutcomeComments))

      act(() => {
        result.current.setLastName('Smith')
      })

      expect(result.current.lastName).toBe('Smith')
    })

    it('should update grade', () => {
      const { result } = renderHook(() => useFinalCommentForm(mockOutcomeComments))

      act(() => {
        result.current.setGrade(95)
      })

      expect(result.current.grade).toBe(95)
    })

    it('should update comment', () => {
      const { result } = renderHook(() => useFinalCommentForm(mockOutcomeComments))

      act(() => {
        result.current.setComment('New comment')
      })

      expect(result.current.comment).toBe('New comment')
    })

    it('should update personalizedCommentSearch', () => {
      const { result } = renderHook(() => useFinalCommentForm(mockOutcomeComments))

      act(() => {
        result.current.setPersonalizedCommentSearch('excellent')
      })

      expect(result.current.personalizedCommentSearch).toBe('excellent')
    })
  })

  describe('Validation', () => {
    it('should return error when firstName is empty', () => {
      const { result } = renderHook(() => useFinalCommentForm(mockOutcomeComments))

      act(() => {
        result.current.setGrade(85)
      })

      const error = result.current.validate()

      expect(error).toBe('First name is required')
    })

    it('should return error when firstName is only whitespace', () => {
      const { result } = renderHook(() => useFinalCommentForm(mockOutcomeComments))

      act(() => {
        result.current.setFirstName('   ')
        result.current.setGrade(85)
      })

      const error = result.current.validate()

      expect(error).toBe('First name is required')
    })

    it('should return error when grade is empty', () => {
      const { result } = renderHook(() => useFinalCommentForm(mockOutcomeComments))

      act(() => {
        result.current.setFirstName('John')
      })

      const error = result.current.validate()

      expect(error).toBe('Grade is required')
    })

    it('should return error when grade is below 0', () => {
      const { result } = renderHook(() => useFinalCommentForm(mockOutcomeComments))

      act(() => {
        result.current.setFirstName('John')
        result.current.setGrade(-5)
      })

      const error = result.current.validate()

      expect(error).toBe('Grade must be between 0 and 100')
    })

    it('should return error when grade is above 100', () => {
      const { result } = renderHook(() => useFinalCommentForm(mockOutcomeComments))

      act(() => {
        result.current.setFirstName('John')
        result.current.setGrade(105)
      })

      const error = result.current.validate()

      expect(error).toBe('Grade must be between 0 and 100')
    })

    it('should return error when comment exceeds 1000 characters', () => {
      const { result } = renderHook(() => useFinalCommentForm(mockOutcomeComments))

      act(() => {
        result.current.setFirstName('John')
        result.current.setGrade(85)
        result.current.setComment('a'.repeat(1001))
      })

      const error = result.current.validate()

      expect(error).toBe('Comment cannot exceed 1000 characters')
    })

    it('should return null when form is valid', () => {
      const { result } = renderHook(() => useFinalCommentForm(mockOutcomeComments))

      act(() => {
        result.current.setFirstName('John')
        result.current.setGrade(85)
      })

      const error = result.current.validate()

      expect(error).toBeNull()
    })

    it('should return null when form is valid with optional fields', () => {
      const { result } = renderHook(() => useFinalCommentForm(mockOutcomeComments))

      act(() => {
        result.current.setFirstName('John')
        result.current.setLastName('Doe')
        result.current.setGrade(85)
        result.current.setComment('Good work')
      })

      const error = result.current.validate()

      expect(error).toBeNull()
    })
  })

  describe('Outcome Comment Matching', () => {
    it('should return null matchedOutcomeComment when grade is empty', () => {
      const { result } = renderHook(() => useFinalCommentForm(mockOutcomeComments))

      expect(result.current.matchedOutcomeComment).toBeNull()
    })

    it('should match outcome comment for grade 95', () => {
      const { result } = renderHook(() => useFinalCommentForm(mockOutcomeComments))

      act(() => {
        result.current.setGrade(95)
      })

      expect(result.current.matchedOutcomeComment).toBe('Excellent achievement')
    })

    it('should match outcome comment for grade 85', () => {
      const { result } = renderHook(() => useFinalCommentForm(mockOutcomeComments))

      act(() => {
        result.current.setGrade(85)
      })

      expect(result.current.matchedOutcomeComment).toBe('Very good work')
    })

    it('should match outcome comment for grade 75', () => {
      const { result } = renderHook(() => useFinalCommentForm(mockOutcomeComments))

      act(() => {
        result.current.setGrade(75)
      })

      expect(result.current.matchedOutcomeComment).toBe('Good effort')
    })

    it('should return null when grade does not match any range', () => {
      const { result } = renderHook(() => useFinalCommentForm(mockOutcomeComments))

      act(() => {
        result.current.setGrade(50)
      })

      expect(result.current.matchedOutcomeComment).toBeNull()
    })

    it('should update matched comment when grade changes', () => {
      const { result } = renderHook(() => useFinalCommentForm(mockOutcomeComments))

      act(() => {
        result.current.setGrade(95)
      })
      expect(result.current.matchedOutcomeComment).toBe('Excellent achievement')

      act(() => {
        result.current.setGrade(85)
      })
      expect(result.current.matchedOutcomeComment).toBe('Very good work')
    })
  })

  describe('Form Reset', () => {
    it('should clear all form fields', () => {
      const { result } = renderHook(() => useFinalCommentForm(mockOutcomeComments))

      act(() => {
        result.current.setFirstName('John')
        result.current.setLastName('Doe')
        result.current.setGrade(85)
        result.current.setComment('Good work')
        result.current.setPersonalizedCommentSearch('excellent')
      })

      act(() => {
        result.current.reset()
      })

      expect(result.current.firstName).toBe('')
      expect(result.current.lastName).toBe('')
      expect(result.current.grade).toBe('')
      expect(result.current.comment).toBe('')
      expect(result.current.personalizedCommentSearch).toBe('')
      expect(result.current.validationError).toBe('')
    })

    it('should clear matchedOutcomeComment when grade is cleared', () => {
      const { result } = renderHook(() => useFinalCommentForm(mockOutcomeComments))

      act(() => {
        result.current.setGrade(95)
      })
      expect(result.current.matchedOutcomeComment).toBe('Excellent achievement')

      act(() => {
        result.current.reset()
      })

      expect(result.current.matchedOutcomeComment).toBeNull()
    })
  })

  describe('Validation Error Management', () => {
    it('should set validationError when validate() is called with invalid data', () => {
      const { result } = renderHook(() => useFinalCommentForm(mockOutcomeComments))

      act(() => {
        const error = result.current.validate()
        result.current.setValidationError(error || '')
      })

      expect(result.current.validationError).toBe('First name is required')
    })

    it('should clear validationError when clearValidationError is called', () => {
      const { result } = renderHook(() => useFinalCommentForm(mockOutcomeComments))

      act(() => {
        result.current.setValidationError('Some error')
      })
      expect(result.current.validationError).toBe('Some error')

      act(() => {
        result.current.clearValidationError()
      })

      expect(result.current.validationError).toBe('')
    })
  })
})
