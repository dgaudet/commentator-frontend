/**
 * Class Validation Tests
 * TDD Phase: RED - These tests should fail initially
 * Reference: TASK-2.2
 */
import { validateClassName, validateYear, validateClassForm } from '../classValidation'

describe('Class Validation', () => {
  describe('validateClassName', () => {
    it('should pass for valid class name', () => {
      expect(validateClassName('Math 101')).toBeNull()
    })

    it('should pass for name with special characters', () => {
      expect(validateClassName('Science & Technology 2024')).toBeNull()
    })

    it('should fail for empty name', () => {
      const error = validateClassName('')
      expect(error).not.toBeNull()
      expect(error?.field).toBe('name')
      expect(error?.message).toContain('required')
    })

    it('should fail for whitespace-only name', () => {
      const error = validateClassName('   ')
      expect(error).not.toBeNull()
      expect(error?.message).toContain('required')
    })

    it('should fail for name exceeding 100 characters', () => {
      const longName = 'A'.repeat(101)
      const error = validateClassName(longName)
      expect(error).not.toBeNull()
      expect(error?.message).toContain('between')
      expect(error?.message).toContain('100')
    })

    it('should pass for name at max length (100 chars)', () => {
      const maxName = 'A'.repeat(100)
      expect(validateClassName(maxName)).toBeNull()
    })

    it('should pass for name with 1 character', () => {
      expect(validateClassName('A')).toBeNull()
    })
  })

  describe('validateYear', () => {
    it('should pass for valid year', () => {
      expect(validateYear(2024)).toBeNull()
    })

    it('should pass for minimum year (2000)', () => {
      expect(validateYear(2000)).toBeNull()
    })

    it('should pass for maximum year (2099)', () => {
      expect(validateYear(2099)).toBeNull()
    })

    it('should fail for year below 2000', () => {
      const error = validateYear(1999)
      expect(error).not.toBeNull()
      expect(error?.field).toBe('year')
      expect(error?.message).toContain('between')
      expect(error?.message).toContain('2000')
    })

    it('should fail for year above 2099', () => {
      const error = validateYear(2100)
      expect(error).not.toBeNull()
      expect(error?.message).toContain('2099')
    })

    it('should fail for empty year', () => {
      const error = validateYear('')
      expect(error).not.toBeNull()
      expect(error?.message).toContain('required')
    })

    it('should handle string year input and convert', () => {
      expect(validateYear('2024')).toBeNull()
    })

    it('should fail for invalid string year', () => {
      const error = validateYear('abc')
      expect(error).not.toBeNull()
      expect(error?.message).toContain('valid number')
    })

    it('should fail for null year', () => {
      const error = validateYear(null as unknown as number)
      expect(error).not.toBeNull()
      expect(error?.message).toContain('required')
    })

    it('should fail for undefined year', () => {
      const error = validateYear(undefined as unknown as number)
      expect(error).not.toBeNull()
      expect(error?.message).toContain('required')
    })
  })

  describe('validateClassForm', () => {
    it('should pass for valid form data', () => {
      const result = validateClassForm({ name: 'Math 101', year: 2024 })
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should collect multiple errors', () => {
      const result = validateClassForm({ name: '', year: 1999 })
      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveLength(2)
      expect(result.errors.some((e) => e.field === 'name')).toBe(true)
      expect(result.errors.some((e) => e.field === 'year')).toBe(true)
    })

    it('should fail with empty name', () => {
      const result = validateClassForm({ name: '', year: 2024 })
      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveLength(1)
      expect(result.errors[0].field).toBe('name')
    })

    it('should fail with invalid year', () => {
      const result = validateClassForm({ name: 'Test Class', year: 3000 })
      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveLength(1)
      expect(result.errors[0].field).toBe('year')
    })

    it('should pass with boundary values', () => {
      const result1 = validateClassForm({ name: 'A', year: 2000 })
      expect(result1.isValid).toBe(true)

      const result2 = validateClassForm({ name: 'A'.repeat(100), year: 2099 })
      expect(result2.isValid).toBe(true)
    })
  })
})
