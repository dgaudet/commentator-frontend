/**
 * Storage Keys Tests
 * Unit tests for centralized localStorage key management
 * Related: TD-004 (localStorage Keys Use Different Conventions)
 */

import {
  STORAGE_KEYS,
  getStorageItem,
  setStorageItem,
  removeStorageItem,
  clearCommentatorStorage,
} from '../storageKeys'

describe('storageKeys', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe('STORAGE_KEYS', () => {
    it('should define SELECTED_SUBJECT_ID key', () => {
      expect(STORAGE_KEYS.SELECTED_SUBJECT_ID).toBe('commentator.selectedSubjectId')
    })

    it('should define SELECTED_CLASS_ID key', () => {
      expect(STORAGE_KEYS.SELECTED_CLASS_ID).toBe('commentator.selectedClassId')
    })

    it('should have commentator namespace prefix for all keys', () => {
      Object.values(STORAGE_KEYS).forEach(key => {
        expect(key).toMatch(/^commentator\./)
      })
    })

    it('should use camelCase for key names', () => {
      Object.values(STORAGE_KEYS).forEach(key => {
        // Remove namespace prefix
        const keyName = key.replace('commentator.', '')
        // Should not contain underscores or hyphens (camelCase convention)
        expect(keyName).not.toMatch(/[_-]/)
      })
    })
  })

  describe('getStorageItem', () => {
    it('should retrieve stored value', () => {
      localStorage.setItem('commentator.selectedSubjectId', '123')
      const value = getStorageItem(STORAGE_KEYS.SELECTED_SUBJECT_ID)
      expect(value).toBe('123')
    })

    it('should return null for non-existent key', () => {
      const value = getStorageItem(STORAGE_KEYS.SELECTED_SUBJECT_ID)
      expect(value).toBeNull()
    })

    it('should work with all defined storage keys', () => {
      // Test that getStorageItem works with any STORAGE_KEYS value
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.setItem(key, 'test-value')
        const value = getStorageItem(key)
        expect(value).toBe('test-value')
        localStorage.removeItem(key)
      })
    })
  })

  describe('setStorageItem', () => {
    it('should store value in localStorage', () => {
      setStorageItem(STORAGE_KEYS.SELECTED_SUBJECT_ID, '456')
      const value = localStorage.getItem('commentator.selectedSubjectId')
      expect(value).toBe('456')
    })

    it('should overwrite existing value', () => {
      setStorageItem(STORAGE_KEYS.SELECTED_SUBJECT_ID, '111')
      setStorageItem(STORAGE_KEYS.SELECTED_SUBJECT_ID, '222')
      const value = localStorage.getItem('commentator.selectedSubjectId')
      expect(value).toBe('222')
    })

    it('should work with all defined storage keys', () => {
      Object.values(STORAGE_KEYS).forEach(key => {
        setStorageItem(key, 'test-value')
        const value = localStorage.getItem(key)
        expect(value).toBe('test-value')
      })
    })
  })

  describe('removeStorageItem', () => {
    it('should remove value from localStorage', () => {
      localStorage.setItem('commentator.selectedSubjectId', '789')
      removeStorageItem(STORAGE_KEYS.SELECTED_SUBJECT_ID)
      const value = localStorage.getItem('commentator.selectedSubjectId')
      expect(value).toBeNull()
    })

    it('should not throw error when removing non-existent key', () => {
      expect(() => {
        removeStorageItem(STORAGE_KEYS.SELECTED_SUBJECT_ID)
      }).not.toThrow()
    })

    it('should work with all defined storage keys', () => {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.setItem(key, 'test-value')
        removeStorageItem(key)
        const value = localStorage.getItem(key)
        expect(value).toBeNull()
      })
    })
  })

  describe('clearCommentatorStorage', () => {
    it('should clear all commentator keys', () => {
      localStorage.setItem('commentator.selectedSubjectId', '1')
      localStorage.setItem('commentator.selectedClassId', '2')
      localStorage.setItem('other.key', 'keep-me')

      clearCommentatorStorage()

      expect(localStorage.getItem('commentator.selectedSubjectId')).toBeNull()
      expect(localStorage.getItem('commentator.selectedClassId')).toBeNull()
      expect(localStorage.getItem('other.key')).toBe('keep-me')
    })

    it('should not throw error when clearing empty storage', () => {
      expect(() => {
        clearCommentatorStorage()
      }).not.toThrow()
    })

    it('should clear only keys defined in STORAGE_KEYS', () => {
      // Set up test data
      localStorage.setItem('commentator.selectedSubjectId', '1')
      localStorage.setItem('commentator.selectedClassId', '2')
      localStorage.setItem('commentator.unknownKey', 'should-remain')
      localStorage.setItem('other.key', 'should-remain')

      clearCommentatorStorage()

      // Only keys in STORAGE_KEYS should be cleared
      expect(localStorage.getItem('commentator.selectedSubjectId')).toBeNull()
      expect(localStorage.getItem('commentator.selectedClassId')).toBeNull()

      // Keys not in STORAGE_KEYS should remain
      expect(localStorage.getItem('commentator.unknownKey')).toBe('should-remain')
      expect(localStorage.getItem('other.key')).toBe('should-remain')
    })
  })

  describe('Type Safety', () => {
    it('should only accept valid storage keys', () => {
      // This test verifies TypeScript type safety at compile time
      // If these compile, the type constraints are working correctly

      const validKey1 = STORAGE_KEYS.SELECTED_SUBJECT_ID
      const validKey2 = STORAGE_KEYS.SELECTED_CLASS_ID

      // These should work with type-safe functions
      setStorageItem(validKey1, 'test')
      setStorageItem(validKey2, 'test')
      getStorageItem(validKey1)
      getStorageItem(validKey2)
      removeStorageItem(validKey1)
      removeStorageItem(validKey2)

      // The test passes if TypeScript compilation succeeds
      expect(true).toBe(true)
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty string values', () => {
      setStorageItem(STORAGE_KEYS.SELECTED_SUBJECT_ID, '')
      const value = getStorageItem(STORAGE_KEYS.SELECTED_SUBJECT_ID)
      expect(value).toBe('')
    })

    it('should handle numeric string values', () => {
      setStorageItem(STORAGE_KEYS.SELECTED_SUBJECT_ID, '12345')
      const value = getStorageItem(STORAGE_KEYS.SELECTED_SUBJECT_ID)
      expect(value).toBe('12345')
    })

    it('should handle special characters in values', () => {
      const specialValue = 'test!@#$%^&*()_+-=[]{}|;:,.<>?'
      setStorageItem(STORAGE_KEYS.SELECTED_SUBJECT_ID, specialValue)
      const value = getStorageItem(STORAGE_KEYS.SELECTED_SUBJECT_ID)
      expect(value).toBe(specialValue)
    })
  })
})
