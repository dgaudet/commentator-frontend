/**
 * Tests for subjectStorageUtils
 * TDD: RED Phase - Tests written BEFORE implementation
 *
 * Key Change: classId → subjectId, storage key renamed
 * Test Strategy: Test localStorage operations with mocking
 * Coverage Target: 100%
 */

import { getSelectedSubjectId, saveSelectedSubjectId, clearSelectedSubjectId } from '../subjectStorageUtils'

const STORAGE_KEY = 'commentator.selectedSubjectId'

describe('subjectStorageUtils', () => {
  // Mock localStorage
  let localStorageMock: { [key: string]: string }

  beforeEach(() => {
    // Reset mock before each test
    localStorageMock = {}

    // Create mock functions
    const getItemMock = jest.fn((key: string) => localStorageMock[key] || null)
    const setItemMock = jest.fn((key: string, value: string) => {
      localStorageMock[key] = value
    })
    const removeItemMock = jest.fn((key: string) => {
      delete localStorageMock[key]
    })
    const clearMock = jest.fn(() => {
      localStorageMock = {}
    })

    // Mock localStorage methods
    Object.defineProperty(global, 'localStorage', {
      value: {
        getItem: getItemMock,
        setItem: setItemMock,
        removeItem: removeItemMock,
        clear: clearMock,
        key: jest.fn(),
        length: 0,
      },
      writable: true,
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('getSelectedSubjectId', () => {
    it('should return null when key is missing', () => {
      const result = getSelectedSubjectId()
      expect(result).toBeNull()
      expect(localStorage.getItem).toHaveBeenCalledWith(STORAGE_KEY)
    })

    it('should return number when valid ID is stored', () => {
      localStorageMock[STORAGE_KEY] = '42'
      const result = getSelectedSubjectId()
      expect(result).toBe(42)
      expect(localStorage.getItem).toHaveBeenCalledWith(STORAGE_KEY)
    })

    it('should return null when stored value is invalid (not a number)', () => {
      localStorageMock[STORAGE_KEY] = 'invalid'
      const result = getSelectedSubjectId()
      expect(result).toBeNull()
    })

    it('should return null when stored value is empty string', () => {
      localStorageMock[STORAGE_KEY] = ''
      const result = getSelectedSubjectId()
      expect(result).toBeNull()
    })

    it('should return null when stored value is NaN', () => {
      localStorageMock[STORAGE_KEY] = 'NaN'
      const result = getSelectedSubjectId()
      expect(result).toBeNull()
    })

    it('should handle localStorage unavailable and return null', () => {
      // Mock localStorage.getItem to throw error
      ;(localStorage.getItem as jest.Mock).mockImplementationOnce(() => {
        throw new Error('localStorage unavailable')
      })

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()
      const result = getSelectedSubjectId()

      expect(result).toBeNull()
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to read from localStorage:',
        expect.any(Error),
      )

      consoleSpy.mockRestore()
    })
  })

  describe('saveSelectedSubjectId', () => {
    it('should save subject ID as string to localStorage', () => {
      saveSelectedSubjectId(123)
      expect(localStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY, '123')
      expect(localStorageMock[STORAGE_KEY]).toBe('123')
    })

    it('should overwrite existing value', () => {
      localStorageMock[STORAGE_KEY] = '42'
      saveSelectedSubjectId(999)
      expect(localStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY, '999')
      expect(localStorageMock[STORAGE_KEY]).toBe('999')
    })

    it('should handle localStorage unavailable gracefully', () => {
      // Mock localStorage.setItem to throw error
      ;(localStorage.setItem as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Quota exceeded')
      })

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()

      // Should not throw error
      expect(() => saveSelectedSubjectId(123)).not.toThrow()
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to write to localStorage:',
        expect.any(Error),
      )

      consoleSpy.mockRestore()
    })
  })

  describe('clearSelectedSubjectId', () => {
    it('should remove the key from localStorage', () => {
      localStorageMock[STORAGE_KEY] = '42'
      clearSelectedSubjectId()
      expect(localStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEY)
      expect(localStorageMock[STORAGE_KEY]).toBeUndefined()
    })

    it('should not throw error when key does not exist', () => {
      expect(() => clearSelectedSubjectId()).not.toThrow()
      expect(localStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEY)
    })

    it('should handle localStorage unavailable gracefully', () => {
      // Mock localStorage.removeItem to throw error
      ;(localStorage.removeItem as jest.Mock).mockImplementationOnce(() => {
        throw new Error('localStorage unavailable')
      })

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()

      // Should not throw error
      expect(() => clearSelectedSubjectId()).not.toThrow()
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to clear localStorage:',
        expect.any(Error),
      )

      consoleSpy.mockRestore()
    })
  })
})
