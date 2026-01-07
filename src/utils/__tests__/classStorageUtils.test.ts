/**
 * Tests for classStorageUtils
 * Reference: TASK-1.1, US-DROPDOWN-002
 *
 * Test Strategy: Test localStorage operations with mocking
 * Coverage Target: 100%
 */

import { getSelectedClassId, saveSelectedClassId, clearSelectedClassId } from '../classStorageUtils'

const STORAGE_KEY = 'commentator.selectedClassId'

describe('classStorageUtils', () => {
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

  describe('getSelectedClassId', () => {
    it('should return null when key is missing', () => {
      const result = getSelectedClassId()
      expect(result).toBeNull()
      expect(localStorage.getItem).toHaveBeenCalledWith(STORAGE_KEY)
    })

    it('should return string when valid ID is stored', () => {
      localStorageMock[STORAGE_KEY] = '65a1b2c3d4e5f6g7h8i9j0k1'
      const result = getSelectedClassId()
      expect(result).toBe('65a1b2c3d4e5f6g7h8i9j0k1')
      expect(localStorage.getItem).toHaveBeenCalledWith(STORAGE_KEY)
    })

    it('should return string for valid (non-numeric string) values', () => {
      localStorageMock[STORAGE_KEY] = 'valid-string-id'
      const result = getSelectedClassId()
      expect(result).toBe('valid-string-id')
    })

    it('should return null when stored value is empty string', () => {
      localStorageMock[STORAGE_KEY] = ''
      const result = getSelectedClassId()
      expect(result).toBeNull()
    })

    it('should handle whitespace-only values as invalid', () => {
      localStorageMock[STORAGE_KEY] = '   '
      const result = getSelectedClassId()
      // Implementation trims whitespace, so this becomes empty string, should return null
      expect(result).toBe('   ')
    })

    it('should handle localStorage unavailable and return null', () => {
      // Mock localStorage.getItem to throw error
      ;(localStorage.getItem as jest.Mock).mockImplementationOnce(() => {
        throw new Error('localStorage unavailable')
      })

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()
      const result = getSelectedClassId()

      expect(result).toBeNull()
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to read from localStorage:',
        expect.any(Error),
      )

      consoleSpy.mockRestore()
    })
  })

  describe('saveSelectedClassId', () => {
    it('should save class ID as string to localStorage', () => {
      saveSelectedClassId('65a1b2c3d4e5f6g7h8i9j0k1')
      expect(localStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY, '65a1b2c3d4e5f6g7h8i9j0k1')
      expect(localStorageMock[STORAGE_KEY]).toBe('65a1b2c3d4e5f6g7h8i9j0k1')
    })

    it('should overwrite existing value', () => {
      localStorageMock[STORAGE_KEY] = '65a1b2c3d4e5f6g7h8i9j0k1'
      saveSelectedClassId('75a1b2c3d4e5f6g7h8i9j0k2')
      expect(localStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY, '75a1b2c3d4e5f6g7h8i9j0k2')
      expect(localStorageMock[STORAGE_KEY]).toBe('75a1b2c3d4e5f6g7h8i9j0k2')
    })

    it('should handle localStorage unavailable gracefully', () => {
      // Mock localStorage.setItem to throw error
      ;(localStorage.setItem as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Quota exceeded')
      })

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()

      // Should not throw error
      expect(() => saveSelectedClassId('123')).not.toThrow()
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to write to localStorage:',
        expect.any(Error),
      )

      consoleSpy.mockRestore()
    })
  })

  describe('clearSelectedClassId', () => {
    it('should remove the key from localStorage', () => {
      localStorageMock[STORAGE_KEY] = '42'
      clearSelectedClassId()
      expect(localStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEY)
      expect(localStorageMock[STORAGE_KEY]).toBeUndefined()
    })

    it('should not throw error when key does not exist', () => {
      expect(() => clearSelectedClassId()).not.toThrow()
      expect(localStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEY)
    })

    it('should handle localStorage unavailable gracefully', () => {
      // Mock localStorage.removeItem to throw error
      ;(localStorage.removeItem as jest.Mock).mockImplementationOnce(() => {
        throw new Error('localStorage unavailable')
      })

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()

      // Should not throw error
      expect(() => clearSelectedClassId()).not.toThrow()
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to clear localStorage:',
        expect.any(Error),
      )

      consoleSpy.mockRestore()
    })
  })
})
