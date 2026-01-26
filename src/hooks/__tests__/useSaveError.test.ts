/**
 * useSaveError Hook Tests
 *
 * Test-Driven Development for Error Handling: Save Error State Management
 *
 * Feature: Custom hook for managing save operation errors with proper clearing
 * strategies for different user interactions (manual dismiss, auto-clear on edit, success).
 *
 * User Story: As a developer, I need a reusable hook to manage save error state
 * so that components can consistently handle and display save operation errors
 * while providing multiple dismissal strategies (manual, on-edit, on-success).
 */

import { renderHook, act } from '@testing-library/react'
import { useSaveError } from '../useSaveError'
import type { SaveError } from '../../utils/errorHandling'

describe('useSaveError', () => {
  describe('Initial State', () => {
    it('should initialize with null saveError', () => {
      const { result } = renderHook(() => useSaveError())

      expect(result.current.saveError).toBeNull()
    })

    it('should provide all required methods', () => {
      const { result } = renderHook(() => useSaveError())

      expect(typeof result.current.setError).toBe('function')
      expect(typeof result.current.clearError).toBe('function')
      expect(typeof result.current.clearErrorOnEdit).toBe('function')
    })

    it('should have stable method references (memoized)', () => {
      const { result, rerender } = renderHook(() => useSaveError())

      const initialSetError = result.current.setError
      const initialClearError = result.current.clearError
      const initialClearErrorOnEdit = result.current.clearErrorOnEdit

      rerender()

      expect(result.current.setError).toBe(initialSetError)
      expect(result.current.clearError).toBe(initialClearError)
      expect(result.current.clearErrorOnEdit).toBe(initialClearErrorOnEdit)
    })
  })

  describe('setError Function', () => {
    it('should set error with structured format { error, details }', () => {
      const { result } = renderHook(() => useSaveError())
      const testError: SaveError = {
        error: 'Duplicate entry',
        details: 'This student already has a final comment in this class',
      }

      act(() => {
        result.current.setError(testError)
      })

      expect(result.current.saveError).toEqual(testError)
      expect(result.current.saveError?.error).toBe('Duplicate entry')
      expect(result.current.saveError?.details).toBe(
        'This student already has a final comment in this class',
      )
    })

    it('should overwrite previous error when setError is called again', () => {
      const { result } = renderHook(() => useSaveError())
      const firstError: SaveError = {
        error: 'First error',
        details: 'First details',
      }
      const secondError: SaveError = {
        error: 'Second error',
        details: 'Second details',
      }

      act(() => {
        result.current.setError(firstError)
      })

      expect(result.current.saveError).toEqual(firstError)

      act(() => {
        result.current.setError(secondError)
      })

      expect(result.current.saveError).toEqual(secondError)
      expect(result.current.saveError?.error).toBe('Second error')
    })

    it('should preserve error object properties exactly', () => {
      const { result } = renderHook(() => useSaveError())
      const testError: SaveError = {
        error: 'Network timeout',
        details: 'Request took longer than 60 seconds',
      }

      act(() => {
        result.current.setError(testError)
      })

      expect(result.current.saveError).toStrictEqual(testError)
    })

    it('should handle errors with empty strings', () => {
      const { result } = renderHook(() => useSaveError())
      const testError: SaveError = {
        error: '',
        details: '',
      }

      act(() => {
        result.current.setError(testError)
      })

      expect(result.current.saveError).toEqual(testError)
      expect(result.current.saveError?.error).toBe('')
      expect(result.current.saveError?.details).toBe('')
    })

    it('should handle errors with long text', () => {
      const { result } = renderHook(() => useSaveError())
      const longText = 'A'.repeat(1000)
      const testError: SaveError = {
        error: longText,
        details: longText,
      }

      act(() => {
        result.current.setError(testError)
      })

      expect(result.current.saveError?.error).toBe(longText)
      expect(result.current.saveError?.details).toBe(longText)
    })

    it('should handle errors with special characters', () => {
      const { result } = renderHook(() => useSaveError())
      const testError: SaveError = {
        error: 'Error: <script>alert("xss")</script>',
        details: 'Special chars: !@#$%^&*()_+-=[]{}|;:\'",.<>?/',
      }

      act(() => {
        result.current.setError(testError)
      })

      expect(result.current.saveError).toEqual(testError)
    })
  })

  describe('clearError Function', () => {
    it('should clear error by setting saveError to null', () => {
      const { result } = renderHook(() => useSaveError())
      const testError: SaveError = {
        error: 'Test error',
        details: 'Test details',
      }

      act(() => {
        result.current.setError(testError)
      })

      expect(result.current.saveError).not.toBeNull()

      act(() => {
        result.current.clearError()
      })

      expect(result.current.saveError).toBeNull()
    })

    it('should be idempotent (calling multiple times has same effect)', () => {
      const { result } = renderHook(() => useSaveError())

      act(() => {
        result.current.clearError()
      })

      expect(result.current.saveError).toBeNull()

      act(() => {
        result.current.clearError()
      })

      expect(result.current.saveError).toBeNull()
    })

    it('should clear error even if none is set', () => {
      const { result } = renderHook(() => useSaveError())

      expect(() => {
        act(() => {
          result.current.clearError()
        })
      }).not.toThrow()

      expect(result.current.saveError).toBeNull()
    })
  })

  describe('clearErrorOnEdit Function', () => {
    it('should clear error by setting saveError to null', () => {
      const { result } = renderHook(() => useSaveError())
      const testError: SaveError = {
        error: 'Save failed',
        details: 'API error occurred',
      }

      act(() => {
        result.current.setError(testError)
      })

      expect(result.current.saveError).not.toBeNull()

      act(() => {
        result.current.clearErrorOnEdit()
      })

      expect(result.current.saveError).toBeNull()
    })

    it('should be idempotent (calling multiple times has same effect)', () => {
      const { result } = renderHook(() => useSaveError())

      act(() => {
        result.current.clearErrorOnEdit()
      })

      expect(result.current.saveError).toBeNull()

      act(() => {
        result.current.clearErrorOnEdit()
      })

      expect(result.current.saveError).toBeNull()
    })

    it('should clear error even if none is set', () => {
      const { result } = renderHook(() => useSaveError())

      expect(() => {
        act(() => {
          result.current.clearErrorOnEdit()
        })
      }).not.toThrow()

      expect(result.current.saveError).toBeNull()
    })

    it('should have same effect as clearError', () => {
      const { result: result1 } = renderHook(() => useSaveError())
      const { result: result2 } = renderHook(() => useSaveError())
      const testError: SaveError = {
        error: 'Test error',
        details: 'Test details',
      }

      // Set error on both hooks
      act(() => {
        result1.current.setError(testError)
        result2.current.setError(testError)
      })

      // Clear with different methods
      act(() => {
        result1.current.clearError()
        result2.current.clearErrorOnEdit()
      })

      // Both should result in null
      expect(result1.current.saveError).toBeNull()
      expect(result2.current.saveError).toBeNull()
    })
  })

  describe('State Transitions and Workflows', () => {
    it('should handle typical error workflow: set -> clear', () => {
      const { result } = renderHook(() => useSaveError())
      const testError: SaveError = {
        error: 'Duplicate entry',
        details: 'Student already exists',
      }

      // Initially null
      expect(result.current.saveError).toBeNull()

      // Set error
      act(() => {
        result.current.setError(testError)
      })

      expect(result.current.saveError).toEqual(testError)

      // Clear error
      act(() => {
        result.current.clearError()
      })

      expect(result.current.saveError).toBeNull()
    })

    it('should handle error workflow: set -> clearErrorOnEdit', () => {
      const { result } = renderHook(() => useSaveError())
      const testError: SaveError = {
        error: 'Validation failed',
        details: 'First name is required',
      }

      // Set error (simulating failed save)
      act(() => {
        result.current.setError(testError)
      })

      expect(result.current.saveError).toEqual(testError)

      // Clear on edit (simulating user correction)
      act(() => {
        result.current.clearErrorOnEdit()
      })

      expect(result.current.saveError).toBeNull()
    })

    it('should handle retry workflow: set -> clear -> set new error', () => {
      const { result } = renderHook(() => useSaveError())
      const firstError: SaveError = {
        error: 'Network error',
        details: 'Connection timeout',
      }
      const secondError: SaveError = {
        error: 'Permission denied',
        details: 'You do not have permission to perform this action',
      }

      // First attempt fails
      act(() => {
        result.current.setError(firstError)
      })

      expect(result.current.saveError).toEqual(firstError)

      // User corrects and retries, clearing the error
      act(() => {
        result.current.clearError()
      })

      expect(result.current.saveError).toBeNull()

      // Second attempt fails with different error
      act(() => {
        result.current.setError(secondError)
      })

      expect(result.current.saveError).toEqual(secondError)
      expect(result.current.saveError?.error).toBe('Permission denied')
    })

    it('should handle multiple edits without error: set -> clearErrorOnEdit -> clearErrorOnEdit', () => {
      const { result } = renderHook(() => useSaveError())
      const testError: SaveError = {
        error: 'Save failed',
        details: 'Backend error',
      }

      // Error occurs
      act(() => {
        result.current.setError(testError)
      })

      expect(result.current.saveError).toEqual(testError)

      // First edit clears error
      act(() => {
        result.current.clearErrorOnEdit()
      })

      expect(result.current.saveError).toBeNull()

      // Subsequent edits should not crash
      act(() => {
        result.current.clearErrorOnEdit()
        result.current.clearErrorOnEdit()
      })

      expect(result.current.saveError).toBeNull()
    })

    it('should allow error to be set again after being cleared', () => {
      const { result } = renderHook(() => useSaveError())
      const testError: SaveError = {
        error: 'Error 1',
        details: 'Details 1',
      }

      // Set, clear, set again
      act(() => {
        result.current.setError(testError)
        result.current.clearError()
        result.current.setError(testError)
      })

      expect(result.current.saveError).toEqual(testError)
    })
  })

  describe('Multiple Instances', () => {
    it('should maintain separate state for different hook instances', () => {
      const { result: result1 } = renderHook(() => useSaveError())
      const { result: result2 } = renderHook(() => useSaveError())
      const error1: SaveError = {
        error: 'Error 1',
        details: 'Details 1',
      }
      const error2: SaveError = {
        error: 'Error 2',
        details: 'Details 2',
      }

      act(() => {
        result1.current.setError(error1)
        result2.current.setError(error2)
      })

      expect(result1.current.saveError).toEqual(error1)
      expect(result2.current.saveError).toEqual(error2)

      act(() => {
        result1.current.clearError()
      })

      expect(result1.current.saveError).toBeNull()
      expect(result2.current.saveError).toEqual(error2)
    })

    it('should not affect other instances when clearing error', () => {
      const { result: result1 } = renderHook(() => useSaveError())
      const { result: result2 } = renderHook(() => useSaveError())
      const error: SaveError = {
        error: 'Shared error',
        details: 'Details',
      }

      act(() => {
        result1.current.setError(error)
        result2.current.setError(error)
      })

      act(() => {
        result1.current.clearErrorOnEdit()
      })

      expect(result1.current.saveError).toBeNull()
      expect(result2.current.saveError).toEqual(error)
    })
  })

  describe('Edge Cases and Robustness', () => {
    it('should handle rapid consecutive operations', () => {
      const { result } = renderHook(() => useSaveError())
      const error1: SaveError = { error: 'E1', details: 'D1' }
      const error2: SaveError = { error: 'E2', details: 'D2' }
      const error3: SaveError = { error: 'E3', details: 'D3' }

      act(() => {
        result.current.setError(error1)
        result.current.setError(error2)
        result.current.clearErrorOnEdit()
        result.current.setError(error3)
        result.current.clearError()
      })

      expect(result.current.saveError).toBeNull()
    })

    it('should not throw when operations are called outside act', () => {
      const { result } = renderHook(() => useSaveError())

      // This tests that the hook is stable and doesn't require act wrapper for reading
      expect(result.current.saveError).toBeNull()
      expect(typeof result.current.setError).toBe('function')
    })

    it('should maintain state after multiple rerenders', () => {
      const { result, rerender } = renderHook(() => useSaveError())
      const testError: SaveError = {
        error: 'Persistent error',
        details: 'Should remain through rerenders',
      }

      act(() => {
        result.current.setError(testError)
      })

      rerender()
      expect(result.current.saveError).toEqual(testError)

      rerender()
      expect(result.current.saveError).toEqual(testError)

      rerender()
      expect(result.current.saveError).toEqual(testError)
    })
  })
})
