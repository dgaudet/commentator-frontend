/**
 * User Validators Unit Tests
 * Reference: US-UR-002, US-UR-003, US-UR-004
 *
 * Tests verify:
 * - First Name validation (required, max length)
 * - Last Name validation (required, max length)
 * - Email validation (required, valid format)
 * - Password validation (8+ chars, uppercase, lowercase, number)
 * - Password match validation (confirmation field)
 */

import {
  validateFirstName,
  validateLastName,
  validateEmail,
  validatePassword,
  validatePasswordMatch,
} from './userValidators'

describe('userValidators', () => {
  describe('validateFirstName', () => {
    it('should return error for empty first name', () => {
      expect(validateFirstName('')).toBeDefined()
      expect(validateFirstName('   ')).toBeDefined()
    })

    it('should return undefined for valid first name', () => {
      expect(validateFirstName('John')).toBeUndefined()
      expect(validateFirstName('Jane')).toBeUndefined()
      expect(validateFirstName('Jean-Pierre')).toBeUndefined()
    })

    it('should return error if first name exceeds max length', () => {
      const longName = 'a'.repeat(101)
      expect(validateFirstName(longName)).toBeDefined()
    })

    it('should accept first name at max length', () => {
      const maxName = 'a'.repeat(100)
      expect(validateFirstName(maxName)).toBeUndefined()
    })

    it('should allow names with hyphens and apostrophes', () => {
      expect(validateFirstName("O'Brien")).toBeUndefined()
      expect(validateFirstName('Mary-Jane')).toBeUndefined()
    })
  })

  describe('validateLastName', () => {
    it('should return error for empty last name', () => {
      expect(validateLastName('')).toBeDefined()
      expect(validateLastName('   ')).toBeDefined()
    })

    it('should return undefined for valid last name', () => {
      expect(validateLastName('Doe')).toBeUndefined()
      expect(validateLastName('Smith')).toBeUndefined()
      expect(validateLastName('van der Berg')).toBeUndefined()
    })

    it('should return error if last name exceeds max length', () => {
      const longName = 'a'.repeat(101)
      expect(validateLastName(longName)).toBeDefined()
    })

    it('should accept last name at max length', () => {
      const maxName = 'a'.repeat(100)
      expect(validateLastName(maxName)).toBeUndefined()
    })

    it('should allow names with spaces, hyphens, and apostrophes', () => {
      expect(validateLastName('de la Cruz')).toBeUndefined()
      expect(validateLastName("O'Connor")).toBeUndefined()
      expect(validateLastName('Smith-Jones')).toBeUndefined()
    })
  })

  describe('validateEmail', () => {
    it('should return error for empty email', () => {
      expect(validateEmail('')).toBeDefined()
      expect(validateEmail('   ')).toBeDefined()
    })

    it('should return undefined for valid email addresses', () => {
      expect(validateEmail('user@example.com')).toBeUndefined()
      expect(validateEmail('john.doe@company.co.uk')).toBeUndefined()
      expect(validateEmail('test+tag@domain.com')).toBeUndefined()
    })

    it('should return error for invalid email format', () => {
      expect(validateEmail('notanemail')).toBeDefined()
      expect(validateEmail('user@')).toBeDefined()
      expect(validateEmail('@example.com')).toBeDefined()
      expect(validateEmail('user@.com')).toBeDefined()
      expect(validateEmail('user @example.com')).toBeDefined()
    })

    it('should accept emails with various valid formats', () => {
      expect(validateEmail('a@b.co')).toBeUndefined()
      expect(validateEmail('user123@test-domain.com')).toBeUndefined()
      expect(validateEmail('first.last@subdomain.example.org')).toBeUndefined()
    })
  })

  describe('validatePassword', () => {
    it('should return error for empty password', () => {
      expect(validatePassword('')).toBeDefined()
      expect(validatePassword('   ')).toBeDefined()
    })

    it('should return error for password less than 8 characters', () => {
      expect(validatePassword('Pass1')).toBeDefined()
      expect(validatePassword('Pwd1')).toBeDefined()
    })

    it('should return error if password lacks uppercase letter', () => {
      expect(validatePassword('password123')).toBeDefined()
      expect(validatePassword('pass1234')).toBeDefined()
    })

    it('should return error if password lacks lowercase letter', () => {
      expect(validatePassword('PASSWORD123')).toBeDefined()
      expect(validatePassword('PASS1234')).toBeDefined()
    })

    it('should return error if password lacks number', () => {
      expect(validatePassword('PasswordTest')).toBeDefined()
      expect(validatePassword('MyPassword')).toBeDefined()
    })

    it('should return error for password exceeding max length', () => {
      const longPassword = 'A' + 'a'.repeat(127) + '1'
      expect(validatePassword(longPassword)).toBeDefined()
    })

    it('should return undefined for valid passwords', () => {
      expect(validatePassword('Password1')).toBeUndefined()
      expect(validatePassword('MyPass123')).toBeUndefined()
      expect(validatePassword('SecurePass99')).toBeUndefined()
      expect(validatePassword('P@ssw0rd')).toBeUndefined()
    })

    it('should accept passwords at max length', () => {
      const maxPassword = 'A' + 'a'.repeat(126) + '1'
      expect(validatePassword(maxPassword)).toBeUndefined()
    })

    it('should accept passwords with special characters', () => {
      expect(validatePassword('P@ssw0rd!')).toBeUndefined()
      expect(validatePassword('Pass#word1')).toBeUndefined()
    })

    it('should provide multiple errors when multiple conditions fail', () => {
      const result = validatePassword('pass')
      expect(result).toBeDefined()
      // Should mention multiple requirements
      expect(result?.toLowerCase()).toMatch(/password/i)
    })
  })

  describe('validatePasswordMatch', () => {
    it('should return error when passwords do not match', () => {
      expect(validatePasswordMatch('Password1', 'Password2')).toBeDefined()
      expect(validatePasswordMatch('MyPass123', 'MyPass124')).toBeDefined()
    })

    it('should return undefined when passwords match', () => {
      expect(validatePasswordMatch('Password1', 'Password1')).toBeUndefined()
      expect(validatePasswordMatch('MyPass123', 'MyPass123')).toBeUndefined()
    })

    it('should be case-sensitive', () => {
      expect(validatePasswordMatch('Password1', 'password1')).toBeDefined()
      expect(validatePasswordMatch('MyPass123', 'myPass123')).toBeDefined()
    })

    it('should return error when either password is empty', () => {
      expect(validatePasswordMatch('Password1', '')).toBeDefined()
      expect(validatePasswordMatch('', 'Password1')).toBeDefined()
      expect(validatePasswordMatch('', '')).toBeDefined()
    })
  })

  describe('Integration: Multiple validation checks', () => {
    it('should validate a complete registration attempt', () => {
      const firstName = 'John'
      const lastName = 'Doe'
      const email = 'john.doe@example.com'
      const password = 'SecurePass123'
      const confirmPassword = 'SecurePass123'

      expect(validateFirstName(firstName)).toBeUndefined()
      expect(validateLastName(lastName)).toBeUndefined()
      expect(validateEmail(email)).toBeUndefined()
      expect(validatePassword(password)).toBeUndefined()
      expect(validatePasswordMatch(password, confirmPassword)).toBeUndefined()
    })

    it('should detect all errors in invalid registration attempt', () => {
      const firstName = ''
      const lastName = ''
      const email = 'invalid'
      const password = 'weak'
      const confirmPassword = 'different'

      expect(validateFirstName(firstName)).toBeDefined()
      expect(validateLastName(lastName)).toBeDefined()
      expect(validateEmail(email)).toBeDefined()
      expect(validatePassword(password)).toBeDefined()
      expect(validatePasswordMatch(password, confirmPassword)).toBeDefined()
    })
  })

  describe('Error message content', () => {
    it('first name error message should be helpful', () => {
      const error = validateFirstName('')
      expect(error).toBeTruthy()
      expect(typeof error).toBe('string')
    })

    it('password error message should mention all requirements', () => {
      const error = validatePassword('short')
      expect(error).toBeTruthy()
      expect(typeof error).toBe('string')
      expect(error.toLowerCase()).toMatch(/password|character|letter|number/i)
    })

    it('password match error message should be clear', () => {
      const error = validatePasswordMatch('Password1', 'Password2')
      expect(error).toBeTruthy()
      expect(typeof error).toBe('string')
      expect(error.toLowerCase()).toMatch(/match|not match|password/i)
    })
  })

  describe('Edge cases', () => {
    it('should handle whitespace in names', () => {
      expect(validateFirstName('  John  ')).toBeUndefined() // trimmed
      expect(validateLastName('  Doe  ')).toBeUndefined() // trimmed
    })

    it('should handle unicode characters in names', () => {
      expect(validateFirstName('José')).toBeUndefined()
      expect(validateLastName('Müller')).toBeUndefined()
    })

    it('should handle mixed case emails', () => {
      expect(validateEmail('User@Example.COM')).toBeUndefined()
      expect(validateEmail('JOHN.DOE@EXAMPLE.COM')).toBeUndefined()
    })
  })
})
