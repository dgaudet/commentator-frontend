/**
 * useThemePersistence Hook Tests
 *
 * Test-Driven Development for US-DARK-004: User Preference Persistence
 *
 * User Story: As a user, I want my theme preference to be remembered across
 * browser sessions so that I don't have to re-select my preferred theme every
 * time I visit the app.
 */

import { renderHook, act } from '@testing-library/react'
import { useThemePersistence } from '../useThemePersistence'

describe('useThemePersistence', () => {
  const STORAGE_KEY = 'theme-preference'

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    jest.clearAllMocks()
  })

  describe('AC1: Save theme preference to localStorage', () => {
    it('should save theme preference when setTheme is called', () => {
      const { result } = renderHook(() => useThemePersistence())

      act(() => {
        result.current.setTheme('dark')
      })

      expect(localStorage.getItem(STORAGE_KEY)).toBe('dark')
    })

    it('should save "light" theme preference', () => {
      const { result } = renderHook(() => useThemePersistence())

      act(() => {
        result.current.setTheme('light')
      })

      expect(localStorage.getItem(STORAGE_KEY)).toBe('light')
    })

    it('should save "system" theme preference', () => {
      const { result } = renderHook(() => useThemePersistence())

      act(() => {
        result.current.setTheme('system')
      })

      expect(localStorage.getItem(STORAGE_KEY)).toBe('system')
    })
  })

  describe('AC2: Load saved theme preference on initialization', () => {
    it('should load saved "dark" preference from localStorage', () => {
      localStorage.setItem(STORAGE_KEY, 'dark')

      const { result } = renderHook(() => useThemePersistence())

      expect(result.current.theme).toBe('dark')
    })

    it('should load saved "light" preference from localStorage', () => {
      localStorage.setItem(STORAGE_KEY, 'light')

      const { result } = renderHook(() => useThemePersistence())

      expect(result.current.theme).toBe('light')
    })

    it('should load saved "system" preference from localStorage', () => {
      localStorage.setItem(STORAGE_KEY, 'system')

      const { result } = renderHook(() => useThemePersistence())

      expect(result.current.theme).toBe('system')
    })
  })

  describe('AC3: Default to "system" when no saved preference exists', () => {
    it('should default to "system" when localStorage is empty', () => {
      const { result } = renderHook(() => useThemePersistence())

      expect(result.current.theme).toBe('system')
    })
  })

  describe('AC4: Graceful fallback for invalid or corrupted data', () => {
    it('should default to "system" when saved preference is invalid', () => {
      localStorage.setItem(STORAGE_KEY, 'invalid-theme')

      const { result } = renderHook(() => useThemePersistence())

      expect(result.current.theme).toBe('system')
    })

    it('should default to "system" when saved preference is corrupted JSON', () => {
      localStorage.setItem(STORAGE_KEY, '{invalid-json}')

      const { result } = renderHook(() => useThemePersistence())

      expect(result.current.theme).toBe('system')
    })

    it('should handle localStorage errors gracefully (private browsing)', () => {
      // Mock localStorage.getItem to throw error (simulating private browsing)
      jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('localStorage is disabled')
      })

      const { result } = renderHook(() => useThemePersistence())

      expect(result.current.theme).toBe('system')

      // Restore mock
      jest.restoreAllMocks()
    })

    it('should handle localStorage.setItem errors gracefully', () => {
      // Mock localStorage.setItem to throw error
      jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('localStorage is disabled')
      })

      const { result } = renderHook(() => useThemePersistence())

      // Should not crash when trying to save
      act(() => {
        expect(() => result.current.setTheme('dark')).not.toThrow()
      })

      // Restore mock
      jest.restoreAllMocks()
    })
  })

  describe('AC5: Multi-tab synchronization', () => {
    it('should update theme when storage event is triggered', () => {
      const { result } = renderHook(() => useThemePersistence())

      // Initially system
      expect(result.current.theme).toBe('system')

      // Simulate another tab changing the theme
      act(() => {
        const storageEvent = new StorageEvent('storage', {
          key: STORAGE_KEY,
          newValue: 'dark',
          storageArea: localStorage,
        })
        window.dispatchEvent(storageEvent)
      })

      expect(result.current.theme).toBe('dark')
    })

    it('should ignore storage events for other keys', () => {
      const { result } = renderHook(() => useThemePersistence())

      act(() => {
        result.current.setTheme('light')
      })

      expect(result.current.theme).toBe('light')

      // Simulate storage event for different key
      act(() => {
        const storageEvent = new StorageEvent('storage', {
          key: 'other-key',
          newValue: 'dark',
          storageArea: localStorage,
        })
        window.dispatchEvent(storageEvent)
      })

      // Should remain unchanged
      expect(result.current.theme).toBe('light')
    })

    it('should clean up storage event listener on unmount', () => {
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener')

      const { unmount } = renderHook(() => useThemePersistence())

      unmount()

      expect(removeEventListenerSpy).toHaveBeenCalledWith('storage', expect.any(Function))

      removeEventListenerSpy.mockRestore()
    })
  })
})
