/**
 * API Response Type Definition Tests
 * TDD: RED Phase - Tests written BEFORE implementation
 */
import { describe, it, expect } from '@jest/globals'
import type { ApiResponse, ApiError } from './ApiResponse'

describe('API Response Type Definitions', () => {
  describe('ApiResponse interface', () => {
    it('should wrap data with generic type', () => {
      interface TestData {
        id: number
        value: string
      }

      const response: ApiResponse<TestData> = {
        data: {
          id: 1,
          value: 'test',
        },
      }

      expect(response.data.id).toBe(1)
      expect(response.data.value).toBe('test')
    })

    it('should optionally include a message', () => {
      const responseWithMessage: ApiResponse<string> = {
        data: 'success',
        message: 'Operation completed successfully',
      }

      expect(responseWithMessage.message).toBe('Operation completed successfully')
    })

    it('should work without optional message', () => {
      const responseWithoutMessage: ApiResponse<number> = {
        data: 42,
      }

      expect(responseWithoutMessage.data).toBe(42)
      expect(responseWithoutMessage.message).toBeUndefined()
    })
  })

  describe('ApiError interface', () => {
    it('should contain error information', () => {
      const error: ApiError = {
        error: 'ValidationError',
        message: 'Invalid input data',
        statusCode: 400,
      }

      expect(error.error).toBe('ValidationError')
      expect(error.message).toBe('Invalid input data')
      expect(error.statusCode).toBe(400)
    })

    it('should support string details for simple errors', () => {
      const error: ApiError = {
        error: 'NotFound',
        message: 'Resource not found',
        statusCode: 404,
        details: 'Class with id 123 does not exist',
      }

      expect(error.details).toBe('Class with id 123 does not exist')
      expect(typeof error.details).toBe('string')
    })

    it('should support object details for validation errors', () => {
      const error: ApiError = {
        error: 'ValidationFailed',
        message: 'Validation errors occurred',
        statusCode: 400,
        details: {
          name: ['Name is required', 'Name must be between 1-100 characters'],
          year: ['Year must be between 2000-2099'],
        },
      }

      expect(error.details).toHaveProperty('name')
      expect(error.details).toHaveProperty('year')

      // Type guard to safely access object properties
      if (typeof error.details === 'object' && error.details !== null) {
        expect(Array.isArray(error.details.name)).toBe(true)
        expect(error.details.name).toHaveLength(2)
      }
    })

    it('should work without optional details field', () => {
      const error: ApiError = {
        error: 'ServerError',
        message: 'Internal server error',
        statusCode: 500,
      }

      expect(error.details).toBeUndefined()
    })

    it('should have statusCode as number', () => {
      const error: ApiError = {
        error: 'BadRequest',
        message: 'Bad request',
        statusCode: 400,
      }

      expect(typeof error.statusCode).toBe('number')
    })
  })

  describe('Type flexibility', () => {
    it('should support ApiResponse with array data', () => {
      const response: ApiResponse<string[]> = {
        data: ['item1', 'item2', 'item3'],
      }

      expect(Array.isArray(response.data)).toBe(true)
      expect(response.data).toHaveLength(3)
    })

    it('should support ApiResponse with nested objects', () => {
      interface ComplexData {
        user: {
          id: number
          name: string
        }
        classes: Array<{ id: number; name: string }>
      }

      const response: ApiResponse<ComplexData> = {
        data: {
          user: { id: 1, name: 'Teacher' },
          classes: [
            { id: 1, name: 'Math' },
            { id: 2, name: 'Science' },
          ],
        },
      }

      expect(response.data.user.name).toBe('Teacher')
      expect(response.data.classes).toHaveLength(2)
    })
  })
})
