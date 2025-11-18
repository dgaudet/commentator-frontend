/**
 * useSystemThemeDetection Hook Tests
 *
 * Test-Driven Development for US-DARK-001: System Preference Detection
 *
 * User Story: As a user, I want the app to automatically detect my OS/browser
 * dark mode preference so the app matches my system-wide theme settings.
 */

import { renderHook, act } from '@testing-library/react'
import { useSystemThemeDetection } from '../useSystemThemeDetection'

describe('useSystemThemeDetection', () => {
  let matchMediaMock: jest.Mock

  beforeEach(() => {
    // Mock window.matchMedia
    matchMediaMock = jest.fn()
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: matchMediaMock,
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Initial Theme Detection', () => {
    it('should detect dark theme when system prefers dark mode', () => {
      // Arrange: Mock system preference for dark mode
      matchMediaMock.mockReturnValue({
        matches: true, // System prefers dark mode
        media: '(prefers-color-scheme: dark)',
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      })

      // Act: Render the hook
      const { result } = renderHook(() => useSystemThemeDetection())

      // Assert: Should detect 'dark' theme
      expect(result.current).toBe('dark')
    })

    it('should detect light theme when system prefers light mode', () => {
      // Arrange: Mock system preference for light mode
      matchMediaMock.mockReturnValue({
        matches: false, // System prefers light mode or no preference
        media: '(prefers-color-scheme: dark)',
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      })

      // Act: Render the hook
      const { result } = renderHook(() => useSystemThemeDetection())

      // Assert: Should detect 'light' theme
      expect(result.current).toBe('light')
    })

    it('should default to light theme when matchMedia is not supported', () => {
      // Arrange: Mock browser without matchMedia support
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: undefined,
      })

      // Act: Render the hook
      const { result } = renderHook(() => useSystemThemeDetection())

      // Assert: Should default to 'light' theme
      expect(result.current).toBe('light')
    })
  })

  describe('Theme Change Detection', () => {
    it('should update theme when system preference changes', () => {
      // Arrange: Mock initial preference as light mode
      let changeListener: ((e: MediaQueryListEvent) => void) | null = null

      matchMediaMock.mockReturnValue({
        matches: false, // Initially light mode
        media: '(prefers-color-scheme: dark)',
        addEventListener: jest.fn((event, listener) => {
          if (event === 'change') {
            changeListener = listener
          }
        }),
        removeEventListener: jest.fn(),
      })

      // Act: Render the hook
      const { result } = renderHook(() => useSystemThemeDetection())

      // Assert: Initially should be 'light'
      expect(result.current).toBe('light')

      // Simulate system preference change to dark mode
      act(() => {
        if (changeListener) {
          changeListener({
            matches: true, // Changed to dark mode
            media: '(prefers-color-scheme: dark)',
          } as MediaQueryListEvent)
        }
      })

      // Assert: Should update to 'dark' after system change
      expect(result.current).toBe('dark')
    })

    it('should clean up event listener on unmount', () => {
      // Arrange: Track listener registration
      const addEventListener = jest.fn()
      const removeEventListener = jest.fn()

      matchMediaMock.mockReturnValue({
        matches: false,
        media: '(prefers-color-scheme: dark)',
        addEventListener,
        removeEventListener,
      })

      // Act: Render and unmount the hook
      const { unmount } = renderHook(() => useSystemThemeDetection())

      // Assert: Listener should be added
      expect(addEventListener).toHaveBeenCalledWith('change', expect.any(Function))

      // Act: Unmount the hook
      unmount()

      // Assert: Listener should be removed
      expect(removeEventListener).toHaveBeenCalledWith('change', expect.any(Function))
    })
  })
})
