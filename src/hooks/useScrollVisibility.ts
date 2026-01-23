/**
 * useScrollVisibility Hook
 *
 * Manages header visibility based on scroll position with a 100px threshold.
 * Hides header when scrolling down, prevents "pop-in" by keeping it hidden
 * when scrolling up past the threshold zone.
 *
 * Usage:
 * ```typescript
 * const { isVisible } = useScrollVisibility()
 * return <header style={{ display: isVisible ? 'block' : 'none' }}>...</header>
 * ```
 */

import { useState, useEffect, useRef } from 'react'

interface ScrollVisibilityState {
  isVisible: boolean
}

/**
 * Custom hook to detect scroll direction and toggle element visibility
 *
 * Header visibility is based on scroll position with a 100px threshold from top:
 * - Always visible when scrollY <= 100px (near top of page)
 * - Hidden when scrolling down past the 100px threshold
 * - Remains hidden if scrolling up while still > 100px (prevents "pop-in")
 * - Reappears when scrolling back into the 100px threshold zone
 *
 * @returns Object with isVisible boolean state
 */
export const useScrollVisibility = (): ScrollVisibilityState => {
  const [isVisible, setIsVisible] = useState(true)
  const lastScrollYRef = useRef(0)
  const topThresholdRef = useRef(100) // Distance from top where header stays visible

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Determine scroll direction
      const isScrollingDown = currentScrollY > lastScrollYRef.current

      // Header visibility logic with threshold-based reappearance:
      // 1. Always show when within 100px from top
      if (currentScrollY <= topThresholdRef.current) {
        setIsVisible(true)
      } else {
        // 2. When beyond 100px threshold: hide on scroll down, stay hidden on scroll up
        // (only show if we re-enter the 100px zone)
        if (isScrollingDown) {
          setIsVisible(false)
        }
        // If scrolling up but still > 100px, maintain current hidden state
      }

      lastScrollYRef.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, []) // Empty dependency array - effect runs once on mount only

  return { isVisible }
}
