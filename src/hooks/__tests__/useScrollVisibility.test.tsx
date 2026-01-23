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

/**
 * Helper to set window.scrollY value for testing
 * Since scrollY is read-only, we need to mock it using Object.defineProperty
 */
const setScrollY = (value: number) => {
  Object.defineProperty(window, 'scrollY', {
    writable: true,
    configurable: true,
    value,
  })
}

describe('useScrollVisibility Hook', () => {
  beforeEach(() => {
    // Reset scroll position before each test
    setScrollY(0)
  })

  afterEach(() => {
    // Clean up
    setScrollY(0)
  })

  describe('Initialization', () => {
    it('should initialize with isVisible as true (header shown by default)', () => {
      const { result } = renderHook(() => useScrollVisibility())

      expect(result.current.isVisible).toBe(true)
    })
  })

  describe('Scroll Down Detection', () => {
    it('should hide header when scrolling down past 100px threshold', () => {
      const { result } = renderHook(() => useScrollVisibility())

      expect(result.current.isVisible).toBe(true)

      // Simulate scrolling down past threshold
      act(() => {
        setScrollY(150)
        window.dispatchEvent(new Event('scroll'))
      })

      expect(result.current.isVisible).toBe(false)
    })

    it('should continue hiding header when scrolling down further', () => {
      const { result } = renderHook(() => useScrollVisibility())

      // Simulate scrolling down past threshold
      act(() => {
        setScrollY(150)
        window.dispatchEvent(new Event('scroll'))
      })

      expect(result.current.isVisible).toBe(false)

      act(() => {
        setScrollY(200)
        window.dispatchEvent(new Event('scroll'))
      })

      expect(result.current.isVisible).toBe(false)
    })
  })

  describe('Scroll Up Detection', () => {
    it('should show header when scrolling up after scrolling down', () => {
      const { result } = renderHook(() => useScrollVisibility())

      // Scroll down past threshold first
      act(() => {
        setScrollY(150)
        window.dispatchEvent(new Event('scroll'))
      })

      expect(result.current.isVisible).toBe(false)

      // Scroll back up into threshold area
      act(() => {
        setScrollY(50)
        window.dispatchEvent(new Event('scroll'))
      })

      expect(result.current.isVisible).toBe(true)
    })

    it('should show header when scrolling all the way to top', () => {
      const { result } = renderHook(() => useScrollVisibility())

      // Scroll down
      act(() => {
        setScrollY(150)
        window.dispatchEvent(new Event('scroll'))
      })

      // Scroll back to top
      act(() => {
        setScrollY(0)
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
        setScrollY(1)
        window.dispatchEvent(new Event('scroll'))
      })

      // Should still be visible (header only hides after significant scroll)
      expect(result.current.isVisible).toBe(true)
    })

    it('should handle scroll event when at top of page', () => {
      const { result } = renderHook(() => useScrollVisibility())

      act(() => {
        setScrollY(0)
        window.dispatchEvent(new Event('scroll'))
      })

      expect(result.current.isVisible).toBe(true)
    })

    it('should manage multiple rapid scroll events correctly', () => {
      const { result } = renderHook(() => useScrollVisibility())

      // Simulate rapid scrolling down
      act(() => {
        setScrollY(50)
        window.dispatchEvent(new Event('scroll'))
        setScrollY(100)
        window.dispatchEvent(new Event('scroll'))
        setScrollY(150)
        window.dispatchEvent(new Event('scroll'))
      })

      expect(result.current.isVisible).toBe(false)

      // Simulate rapid scrolling up
      act(() => {
        setScrollY(100)
        window.dispatchEvent(new Event('scroll'))
        setScrollY(50)
        window.dispatchEvent(new Event('scroll'))
        setScrollY(0)
        window.dispatchEvent(new Event('scroll'))
      })

      expect(result.current.isVisible).toBe(true)
    })
  })

  describe('Threshold-Based Visibility (100px from top)', () => {
    it('should always show header when scrollTop <= 100px', () => {
      const { result } = renderHook(() => useScrollVisibility())

      // Start at top
      expect(result.current.isVisible).toBe(true)

      // Scroll to 50px (within threshold)
      act(() => {
        setScrollY(50)
        window.dispatchEvent(new Event('scroll'))
      })

      expect(result.current.isVisible).toBe(true)

      // Scroll to 100px (at threshold boundary)
      act(() => {
        setScrollY(100)
        window.dispatchEvent(new Event('scroll'))
      })

      expect(result.current.isVisible).toBe(true)
    })

    it('should hide header when scrolling down past 100px', () => {
      const { result } = renderHook(() => useScrollVisibility())

      // Scroll down to 150px
      act(() => {
        setScrollY(150)
        window.dispatchEvent(new Event('scroll'))
      })

      expect(result.current.isVisible).toBe(false)
    })

    it('should NOT show header when scrolling up but still scrollTop > 100px', () => {
      const { result } = renderHook(() => useScrollVisibility())

      // Start far down (200px)
      act(() => {
        setScrollY(200)
        window.dispatchEvent(new Event('scroll'))
      })

      expect(result.current.isVisible).toBe(false)

      // Scroll up a bit (to 150px) but still > 100px threshold
      act(() => {
        setScrollY(150)
        window.dispatchEvent(new Event('scroll'))
      })

      // Header should still be hidden since we're not near the top yet
      expect(result.current.isVisible).toBe(false)
    })

    it('should show header when scrolling up and crossing into 100px threshold', () => {
      const { result } = renderHook(() => useScrollVisibility())

      // Start far down (200px)
      act(() => {
        setScrollY(200)
        window.dispatchEvent(new Event('scroll'))
      })

      expect(result.current.isVisible).toBe(false)

      // Scroll up and cross into threshold (to 90px)
      act(() => {
        setScrollY(90)
        window.dispatchEvent(new Event('scroll'))
      })

      expect(result.current.isVisible).toBe(true)
    })

    it('should keep header visible within threshold range', () => {
      const { result } = renderHook(() => useScrollVisibility())

      // Scroll to 50px (within threshold)
      act(() => {
        setScrollY(50)
        window.dispatchEvent(new Event('scroll'))
      })

      expect(result.current.isVisible).toBe(true)

      // Scroll to 80px (still within threshold)
      act(() => {
        setScrollY(80)
        window.dispatchEvent(new Event('scroll'))
      })

      expect(result.current.isVisible).toBe(true)

      // Scroll back to 30px (still within threshold)
      act(() => {
        setScrollY(30)
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
