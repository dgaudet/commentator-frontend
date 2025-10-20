/**
 * Date Formatter Tests
 * TDD Phase: RED - These tests should fail initially
 */
import { formatDate, formatDateTime } from './dateFormatter'

describe('dateFormatter', () => {
  describe('formatDate', () => {
    it('should format ISO 8601 date to human-readable format', () => {
      expect(formatDate('2024-01-15T10:30:00Z')).toBe('Jan 15, 2024')
    })

    it('should handle different months', () => {
      // Use midday to avoid timezone edge cases
      expect(formatDate('2024-12-25T12:00:00Z')).toBe('Dec 25, 2024')
    })

    it('should handle single digit days', () => {
      expect(formatDate('2024-03-05T10:30:00Z')).toBe('Mar 5, 2024')
    })

    it('should return "Invalid date" for invalid input', () => {
      expect(formatDate('invalid')).toBe('Invalid date')
    })

    it('should return "Invalid date" for empty string', () => {
      expect(formatDate('')).toBe('Invalid date')
    })
  })

  describe('formatDateTime', () => {
    it('should format ISO 8601 date with time', () => {
      expect(formatDateTime('2024-01-15T10:30:00Z')).toMatch(/Jan 15, 2024/)
    })

    it('should return "Invalid date" for invalid input', () => {
      expect(formatDateTime('invalid')).toBe('Invalid date')
    })
  })
})
