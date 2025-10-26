/**
 * Subject Validation Tests
 * TDD: RED Phase - Tests written BEFORE implementation
 *
 * Key Change: No year validation (Subject only has name field)
 * Backend API Reference: http://localhost:3000/api-docs/ui
 */
import { validateSubjectName, validateSubjectForm } from '../subjectValidation'

describe('Subject Validation', () => {
  describe('validateSubjectName', () => {
    it('should pass for valid subject name', () => {
      expect(validateSubjectName('Mathematics 101')).toBeNull()
    })

    it('should pass for name with special characters', () => {
      expect(validateSubjectName('Science & Technology')).toBeNull()
    })

    it('should pass for name with numbers', () => {
      expect(validateSubjectName('Math 101')).toBeNull()
    })

    it('should fail for empty name', () => {
      const error = validateSubjectName('')
      expect(error).not.toBeNull()
      expect(error?.field).toBe('name')
      expect(error?.message).toContain('required')
    })

    it('should fail for whitespace-only name', () => {
      const error = validateSubjectName('   ')
      expect(error).not.toBeNull()
      expect(error?.message).toContain('required')
    })

    it('should fail for name exceeding 100 characters', () => {
      const longName = 'A'.repeat(101)
      const error = validateSubjectName(longName)
      expect(error).not.toBeNull()
      expect(error?.field).toBe('name')
      expect(error?.message).toContain('between')
      expect(error?.message).toContain('100')
    })

    it('should pass for name at max length (100 chars)', () => {
      const maxName = 'A'.repeat(100)
      expect(validateSubjectName(maxName)).toBeNull()
    })

    it('should pass for name with 1 character', () => {
      expect(validateSubjectName('A')).toBeNull()
    })

    it('should fail for null name', () => {
      const error = validateSubjectName(null as unknown as string)
      expect(error).not.toBeNull()
      expect(error?.message).toContain('required')
    })

    it('should fail for undefined name', () => {
      const error = validateSubjectName(undefined as unknown as string)
      expect(error).not.toBeNull()
      expect(error?.message).toContain('required')
    })
  })

  describe('validateSubjectForm', () => {
    it('should pass for valid form data with only name', () => {
      const result = validateSubjectForm({ name: 'Mathematics 101' })
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should fail with empty name', () => {
      const result = validateSubjectForm({ name: '' })
      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveLength(1)
      expect(result.errors[0].field).toBe('name')
      expect(result.errors[0].message).toContain('required')
    })

    it('should fail with whitespace-only name', () => {
      const result = validateSubjectForm({ name: '   ' })
      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveLength(1)
    })

    it('should fail with name exceeding 100 characters', () => {
      const longName = 'A'.repeat(101)
      const result = validateSubjectForm({ name: longName })
      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveLength(1)
      expect(result.errors[0].message).toContain('100')
    })

    it('should pass with boundary values', () => {
      const result1 = validateSubjectForm({ name: 'A' })
      expect(result1.isValid).toBe(true)

      const result2 = validateSubjectForm({ name: 'A'.repeat(100) })
      expect(result2.isValid).toBe(true)
    })

    it('should pass for subject names with various formats', () => {
      const validNames = [
        'English 201',
        'Science & Technology',
        'Math: Advanced Topics',
        'History (World)',
        'Physical Education',
        'Art/Design',
      ]

      validNames.forEach((name) => {
        const result = validateSubjectForm({ name })
        expect(result.isValid).toBe(true)
      })
    })

    it('should NOT validate year field (Subject has no year)', () => {
      // Subject validation only validates name
      // This test confirms we don't have validateYear logic
      const result = validateSubjectForm({ name: 'Math 101' })
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })
  })
})
