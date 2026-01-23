/**
 * useScrollVisibility Hook Tests
 *
 * Feature: Hide Header on Scroll
 * - Custom hook to track scroll direction and manage header visibility
 * - Returns isVisible state based on scroll direction
 * - Detects scroll down (hides header) and scroll up (shows header)
 */

import { renderHook, act } from '@testing-library/react'
import { useScrollVisibility } from '../useScrollVisibility'

describe('useScrollVisibility Hook', () => {
  beforeEach(() => {
    // Reset scroll position before each test
    window.scrollY = 0
  })

  afterEach(() => {
    // Clean up
    window.scrollY = 0
  })

  describe('Initialization', () => {
    it('should initialize with isVisible as true (header shown by default)', () => {
      const { result } = renderHook(() => useScrollVisibility())

      expect(result.current.isVisible).toBe(true)
    })
  })

  describe('Scroll Down Detection', () => {
    it('should hide header when scrolling down', () => {
      const { result } = renderHook(() => useScrollVisibility())

      expect(result.current.isVisible).toBe(true)

      // Simulate scrolling down
      act(() => {
        window.scrollY = 100
        window.dispatchEvent(new Event('scroll'))
      })

      expect(result.current.isVisible).toBe(false)
    })

    it('should continue hiding header when scrolling down further', () => {
      const { result } = renderHook(() => useScrollVisibility())

      // Simulate scrolling down multiple times
      act(() => {
        window.scrollY = 100
        window.dispatchEvent(new Event('scroll'))
      })

      expect(result.current.isVisible).toBe(false)

      act(() => {
        window.scrollY = 200
        window.dispatchEvent(new Event('scroll'))
      })

      expect(result.current.isVisible).toBe(false)
    })
  })

  describe('Scroll Up Detection', () => {
    it('should show header when scrolling up after scrolling down', () => {
      const { result } = renderHook(() => useScrollVisibility())

      // Scroll down first
      act(() => {
        window.scrollY = 100
        window.dispatchEvent(new Event('scroll'))
      })

      expect(result.current.isVisible).toBe(false)

      // Scroll back up
      act(() => {
        window.scrollY = 50
        window.dispatchEvent(new Event('scroll'))
      })

      expect(result.current.isVisible).toBe(true)
    })

    it('should show header when scrolling all the way to top', () => {
      const { result } = renderHook(() => useScrollVisibility())

      // Scroll down
      act(() => {
        window.scrollY = 150
        window.dispatchEvent(new Event('scroll'))
      })

      // Scroll back to top
      act(() => {
        window.scrollY = 0
        window.dispatchEvent(new Event('scroll'))
      })

      expect(result.current.isVisible).toBe(true)
    })
  })

  describe('Scroll Behavior Edge Cases', () => {
    it('should not hide header with minimal scroll (less than threshold)', () => {
      const { result } = renderHook(() => useScrollVisibility())

      // Scroll just 1 pixel
      act(() => {
        window.scrollY = 1
        window.dispatchEvent(new Event('scroll'))
      })

      // Should still be visible (header only hides after significant scroll)
      expect(result.current.isVisible).toBe(true)
    })

    it('should handle scroll event when at top of page', () => {
      const { result } = renderHook(() => useScrollVisibility())

      act(() => {
        window.scrollY = 0
        window.dispatchEvent(new Event('scroll'))
      })

      expect(result.current.isVisible).toBe(true)
    })

    it('should manage multiple rapid scroll events correctly', () => {
      const { result } = renderHook(() => useScrollVisibility())

      // Simulate rapid scrolling down
      act(() => {
        window.scrollY = 50
        window.dispatchEvent(new Event('scroll'))
        window.scrollY = 100
        window.dispatchEvent(new Event('scroll'))
        window.scrollY = 150
        window.dispatchEvent(new Event('scroll'))
      })

      expect(result.current.isVisible).toBe(false)

      // Simulate rapid scrolling up
      act(() => {
        window.scrollY = 100
        window.dispatchEvent(new Event('scroll'))
        window.scrollY = 50
        window.dispatchEvent(new Event('scroll'))
        window.scrollY = 0
        window.dispatchEvent(new Event('scroll'))
      })

      expect(result.current.isVisible).toBe(true)
    })
  })

  describe('Cleanup', () => {
    it('should remove scroll event listener on unmount', () => {
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener')

      const { unmount } = renderHook(() => useScrollVisibility())

      unmount()

      expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function))

      removeEventListenerSpy.mockRestore()
    })
  })
})
