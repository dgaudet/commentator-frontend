/**
 * Error Handling Utility Tests
 *
 * Test-Driven Development for Error Extraction and Formatting
 *
 * Feature: Error extraction utility that normalizes various error response
 * formats from APIs and exceptions into a consistent SaveError format.
 *
 * User Story: As a developer, I need a utility to extract and normalize
 * errors from different sources so that they can be displayed consistently
 * to users in a user-friendly manner.
 */

import { extractErrorMessage } from '../errorHandling'

describe('errorHandling', () => {
  describe('extractErrorMessage', () => {
    describe('Structured Error (error + details)', () => {
      it('should extract structured error with both error and details fields', () => {
        const error = {
          error: 'Duplicate entry',
          details: 'This student already has a final comment in this class',
        }

        const result = extractErrorMessage(error)

        expect(result).toEqual({
          error: 'Duplicate entry',
          details: 'This student already has a final comment in this class',
        })
      })

      it('should preserve exact error and details text', () => {
        const error = {
          error: 'Permission denied',
          details: 'You do not have permission to perform this action',
        }

        const result = extractErrorMessage(error)

        expect(result.error).toBe('Permission denied')
        expect(result.details).toBe('You do not have permission to perform this action')
      })

      it('should handle structured error with empty error field', () => {
        const error = {
          error: '',
          details: 'Details about the error',
        }

        const result = extractErrorMessage(error)

        expect(result.error).toBe('Save failed')
        expect(result.details).toBe('Details about the error')
      })

      it('should handle structured error with empty details field', () => {
        const error = {
          error: 'Error type',
          details: '',
        }

        const result = extractErrorMessage(error)

        expect(result.error).toBe('Error type')
        expect(result.details).toBe('An unexpected error occurred.')
      })

      it('should handle structured error with null error field', () => {
        const error = {
          error: null,
          details: 'Details about the error',
        }

        const result = extractErrorMessage(error)

        expect(result.error).toBe('Save failed')
        expect(result.details).toBe('Details about the error')
      })

      it('should handle structured error with null details field', () => {
        const error = {
          error: 'Error type',
          details: null,
        }

        const result = extractErrorMessage(error)

        expect(result.error).toBe('Error type')
        expect(result.details).toBe('An unexpected error occurred.')
      })

      it('should convert numeric fields to strings', () => {
        const error = {
          error: 404,
          details: 500,
        }

        const result = extractErrorMessage(error)

        expect(result.error).toBe('404')
        expect(result.details).toBe('500')
      })

      it('should handle structured error with boolean fields', () => {
        const error = {
          error: true,
          details: false,
        }

        const result = extractErrorMessage(error)

        // Boolean true converts to string "true"
        expect(result.error).toBe('true')
        // Boolean false is falsy, so fallback is used
        expect(result.details).toBe('An unexpected error occurred.')
      })

      it('should handle structured error with additional properties ignored', () => {
        const error = {
          error: 'Error message',
          details: 'Error details',
          code: 'ERR_001',
          statusCode: 400,
          extra: 'ignored',
        }

        const result = extractErrorMessage(error)

        expect(result).toEqual({
          error: 'Error message',
          details: 'Error details',
        })
      })
    })

    describe('Error Object with error field only', () => {
      it('should extract error from object with only error field', () => {
        const error = {
          error: 'Validation error',
        }

        const result = extractErrorMessage(error)

        expect(result).toEqual({
          error: 'Validation error',
          details: 'Please try again.',
        })
      })

      it('should use fallback details for error-only objects', () => {
        const error = {
          error: 'Network timeout',
        }

        const result = extractErrorMessage(error)

        expect(result.error).toBe('Network timeout')
        expect(result.details).toBe('Please try again.')
      })

      it('should handle error field with empty string', () => {
        const error = {
          error: '',
        }

        const result = extractErrorMessage(error)

        expect(result.error).toBe('Save failed')
        expect(result.details).toBe('Please try again.')
      })

      it('should handle error field with null value', () => {
        const error = {
          error: null,
        }

        const result = extractErrorMessage(error)

        expect(result.error).toBe('Save failed')
        expect(result.details).toBe('Please try again.')
      })

      it('should convert numeric error to string', () => {
        const error = {
          error: 400,
        }

        const result = extractErrorMessage(error)

        expect(result.error).toBe('400')
        expect(result.details).toBe('Please try again.')
      })

      it('should handle error object with other unrelated properties', () => {
        const error = {
          error: 'Upload failed',
          message: 'Ignored - error field takes precedence',
          code: 'ERR_UPLOAD',
          statusCode: 413,
        }

        const result = extractErrorMessage(error)

        expect(result.error).toBe('Upload failed')
        expect(result.details).toBe('Please try again.')
      })
    })

    describe('Error Object with message field only', () => {
      it('should extract error from object with only message field', () => {
        const error = {
          message: 'Connection refused',
        }

        const result = extractErrorMessage(error)

        expect(result).toEqual({
          error: 'Save failed',
          details: 'Connection refused',
        })
      })

      it('should use generic error type for message-only objects', () => {
        const error = {
          message: 'Detailed error description from backend',
        }

        const result = extractErrorMessage(error)

        expect(result.error).toBe('Save failed')
        expect(result.details).toBe('Detailed error description from backend')
      })

      it('should handle message field with empty string', () => {
        const error = {
          message: '',
        }

        const result = extractErrorMessage(error)

        expect(result.error).toBe('Save failed')
        expect(result.details).toBe('An unexpected error occurred.')
      })

      it('should handle message field with null value', () => {
        const error = {
          message: null,
        }

        const result = extractErrorMessage(error)

        expect(result.error).toBe('Save failed')
        expect(result.details).toBe('An unexpected error occurred.')
      })

      it('should convert numeric message to string', () => {
        const error = {
          message: 500,
        }

        const result = extractErrorMessage(error)

        expect(result.error).toBe('Save failed')
        expect(result.details).toBe('500')
      })

      it('should handle message object with other properties ignored', () => {
        const error = {
          message: 'API error occurred',
          code: 'ERR_API',
        }

        const result = extractErrorMessage(error)

        expect(result.error).toBe('Save failed')
        expect(result.details).toBe('API error occurred')
      })
    })

    describe('String Error', () => {
      it('should extract string error directly', () => {
        const error = 'Something went wrong'

        const result = extractErrorMessage(error)

        expect(result).toEqual({
          error: 'Save failed',
          details: 'Something went wrong',
        })
      })

      it('should use generic error type for string errors', () => {
        const error = 'Network connection failed'

        const result = extractErrorMessage(error)

        expect(result.error).toBe('Save failed')
        expect(result.details).toBe('Network connection failed')
      })

      it('should handle empty string error', () => {
        const error = ''

        const result = extractErrorMessage(error)

        expect(result.error).toBe('Save failed')
        expect(result.details).toBe('An unexpected error occurred.')
      })

      it('should handle string with special characters', () => {
        const error = 'Error: <script>alert("xss")</script>'

        const result = extractErrorMessage(error)

        expect(result.error).toBe('Save failed')
        expect(result.details).toBe('Error: <script>alert("xss")</script>')
      })

      it('should handle very long string errors', () => {
        const longError = 'E'.repeat(1000)

        const result = extractErrorMessage(longError)

        expect(result.error).toBe('Save failed')
        expect(result.details).toBe(longError)
      })

      it('should handle string with newlines', () => {
        const error = 'Error on line 1\nError on line 2\nError on line 3'

        const result = extractErrorMessage(error)

        expect(result.error).toBe('Save failed')
        expect(result.details).toContain('Error on line')
      })

      it('should handle unicode string errors', () => {
        const error = 'Erreur: 错误 エラー'

        const result = extractErrorMessage(error)

        expect(result.error).toBe('Save failed')
        expect(result.details).toBe('Erreur: 错误 エラー')
      })
    })

    describe('Unknown/Fallback Error Types', () => {
      it('should handle null error', () => {
        const result = extractErrorMessage(null)

        expect(result).toEqual({
          error: 'Save failed',
          details: 'An unexpected error occurred. Please try again.',
        })
      })

      it('should handle undefined error', () => {
        const result = extractErrorMessage(undefined)

        expect(result).toEqual({
          error: 'Save failed',
          details: 'An unexpected error occurred. Please try again.',
        })
      })

      it('should handle number error', () => {
        const result = extractErrorMessage(404)

        expect(result).toEqual({
          error: 'Save failed',
          details: 'An unexpected error occurred. Please try again.',
        })
      })

      it('should handle boolean error', () => {
        const result = extractErrorMessage(true)

        expect(result).toEqual({
          error: 'Save failed',
          details: 'An unexpected error occurred. Please try again.',
        })
      })

      it('should handle array error', () => {
        const result = extractErrorMessage(['Error 1', 'Error 2'])

        expect(result).toEqual({
          error: 'Save failed',
          details: 'An unexpected error occurred. Please try again.',
        })
      })

      it('should handle object without error, details, or message fields', () => {
        const error = {
          code: 'ERR_001',
          statusCode: 400,
          description: 'Something failed',
        }

        const result = extractErrorMessage(error)

        expect(result).toEqual({
          error: 'Save failed',
          details: 'An unexpected error occurred. Please try again.',
        })
      })

      it('should handle empty object', () => {
        const result = extractErrorMessage({})

        expect(result).toEqual({
          error: 'Save failed',
          details: 'An unexpected error occurred. Please try again.',
        })
      })

      it('should handle Symbol error', () => {
        const result = extractErrorMessage(Symbol('error'))

        expect(result).toEqual({
          error: 'Save failed',
          details: 'An unexpected error occurred. Please try again.',
        })
      })
    })

    describe('Error Priority and Precedence', () => {
      it('should prioritize structured error (error + details) over message', () => {
        const error = {
          error: 'Structured error',
          details: 'Structured details',
          message: 'This message should be ignored',
        }

        const result = extractErrorMessage(error)

        expect(result.error).toBe('Structured error')
        expect(result.details).toBe('Structured details')
      })

      it('should prioritize error field over message field', () => {
        const error = {
          error: 'Error field',
          message: 'Message field should be ignored',
        }

        const result = extractErrorMessage(error)

        expect(result.error).toBe('Error field')
        expect(result.details).toBe('Please try again.')
      })

      it('should fall back to message when error field is missing', () => {
        const error = {
          message: 'Message-only error',
        }

        const result = extractErrorMessage(error)

        expect(result.error).toBe('Save failed')
        expect(result.details).toBe('Message-only error')
      })

      it('should handle Error instance as object with message', () => {
        const error = new Error('Native error message')

        const result = extractErrorMessage(error)

        expect(result.error).toBe('Save failed')
        expect(result.details).toBe('Native error message')
      })

      it('should handle Error instance with custom properties', () => {
        const error = new Error('Custom error')
        ;(error as Record<string, unknown>).details = 'Custom details from Error'

        const result = extractErrorMessage(error)

        // Error instances are objects, so they match message pattern first
        expect(result.error).toBe('Save failed')
        expect(result.details).toBe('Custom error')
      })
    })

    describe('Return Type Validation', () => {
      it('should always return SaveError interface with required fields', () => {
        const testCases = [
          { error: 'E', details: 'D' },
          { error: 'E' },
          { message: 'M' },
          'string error',
          null,
          undefined,
          {},
        ]

        testCases.forEach((testCase) => {
          const result = extractErrorMessage(testCase)

          expect(result).toHaveProperty('error')
          expect(result).toHaveProperty('details')
          expect(typeof result.error).toBe('string')
          expect(typeof result.details).toBe('string')
        })
      })

      it('should never return null or undefined', () => {
        const testCases = [null, undefined, '', 0, false, [], {}]

        testCases.forEach((testCase) => {
          const result = extractErrorMessage(testCase)

          expect(result).not.toBeNull()
          expect(result).not.toBeUndefined()
        })
      })

      it('should always have error string with content', () => {
        const testCases = [null, undefined, {}, []]

        testCases.forEach((testCase) => {
          const result = extractErrorMessage(testCase)

          expect(result.error).toBeTruthy()
          expect(result.error.length).toBeGreaterThan(0)
        })
      })

      it('should always have details string with content', () => {
        const testCases = [null, undefined, {}, []]

        testCases.forEach((testCase) => {
          const result = extractErrorMessage(testCase)

          expect(result.details).toBeTruthy()
          expect(result.details.length).toBeGreaterThan(0)
        })
      })
    })

    describe('Real-World API Error Scenarios', () => {
      it('should handle typical REST API error response', () => {
        const error = {
          error: 'Conflict',
          details: 'This student already has a final comment in this class',
        }

        const result = extractErrorMessage(error)

        expect(result.error).toBe('Conflict')
        expect(result.details).toBe('This student already has a final comment in this class')
      })

      it('should handle backend validation error', () => {
        const error = {
          error: 'Validation failed',
          details: 'First name is required',
        }

        const result = extractErrorMessage(error)

        expect(result.error).toBe('Validation failed')
        expect(result.details).toBe('First name is required')
      })

      it('should handle authentication error', () => {
        const error = {
          error: 'Unauthorized',
          details: 'Access token is invalid or expired',
        }

        const result = extractErrorMessage(error)

        expect(result.error).toBe('Unauthorized')
        expect(result.details).toBe('Access token is invalid or expired')
      })

      it('should handle network timeout error', () => {
        const error = new Error('Request timeout')

        const result = extractErrorMessage(error)

        expect(result.error).toBe('Save failed')
        expect(result.details).toBe('Request timeout')
      })

      it('should handle axios error response', () => {
        const error = {
          message: 'Request failed with status code 500',
          response: {
            data: {
              error: 'Server error',
              details: 'Internal server error occurred',
            },
          },
        }

        // Axios error has message field, so it matches message pattern
        const result = extractErrorMessage(error)

        expect(result.error).toBe('Save failed')
        expect(result.details).toBe('Request failed with status code 500')
      })

      it('should handle GraphQL error response', () => {
        const error = {
          error: 'GraphQL Error',
          details: 'Cannot query field "nonexistent" on type "Query"',
        }

        const result = extractErrorMessage(error)

        expect(result.error).toBe('GraphQL Error')
        expect(result.details).toBe('Cannot query field "nonexistent" on type "Query"')
      })

      it('should handle rate limit error', () => {
        const error = {
          error: 'Rate limit exceeded',
          details: 'Too many requests. Please try again in 60 seconds.',
        }

        const result = extractErrorMessage(error)

        expect(result.error).toBe('Rate limit exceeded')
        expect(result.details).toBe('Too many requests. Please try again in 60 seconds.')
      })
    })

    describe('Edge Cases and Robustness', () => {
      it('should handle extremely long error strings', () => {
        const longError = {
          error: 'E'.repeat(5000),
          details: 'D'.repeat(10000),
        }

        const result = extractErrorMessage(longError)

        expect(result.error).toBe('E'.repeat(5000))
        expect(result.details).toBe('D'.repeat(10000))
      })

      it('should handle error with circular references (safe)', () => {
        const error: Record<string, unknown> = {
          error: 'Circular error',
          details: 'Circular details',
        }
        // Note: actual circular reference would cause issues, but we test safe object creation
        error.self = error

        const result = extractErrorMessage(error)

        expect(result.error).toBe('Circular error')
        expect(result.details).toBe('Circular details')
      })

      it('should handle error with deeply nested properties', () => {
        const error = {
          error: 'Nested error',
          details: 'Nested details',
          nested: {
            deeply: {
              nested: {
                property: 'ignored',
              },
            },
          },
        }

        const result = extractErrorMessage(error)

        expect(result.error).toBe('Nested error')
        expect(result.details).toBe('Nested details')
      })

      it('should handle error with prototype pollution attempts', () => {
        const error: Record<string, unknown> = {
          error: 'Safe error',
          details: 'Safe details',
        }
        // Simulate prototype pollution attempt
        Object.defineProperty(error, '__proto__', { value: { isAdmin: true } })
        Object.defineProperty(error, 'constructor', {
          value: { prototype: { isAdmin: true } },
        })

        const result = extractErrorMessage(error)

        expect(result.error).toBe('Safe error')
        expect(result.details).toBe('Safe details')
      })

      it('should preserve error details exactly as provided', () => {
        const error = {
          error: '  Spaces  ',
          details: '  Multiple   Spaces  ',
        }

        const result = extractErrorMessage(error)

        expect(result.error).toBe('  Spaces  ')
        expect(result.details).toBe('  Multiple   Spaces  ')
      })

      it('should handle JSON stringified error objects', () => {
        const errorString =
          '{"error":"JSON error","details":"JSON details"}'

        const result = extractErrorMessage(errorString)

        // String is handled as string error type
        expect(result.error).toBe('Save failed')
        expect(result.details).toBe(errorString)
      })
    })
  })
})
