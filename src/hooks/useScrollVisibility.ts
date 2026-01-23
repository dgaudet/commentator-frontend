/**
 * useScrollVisibility Hook
 *
 * Tracks scroll direction and manages header visibility.
 * Returns isVisible state based on whether user is scrolling down (hide) or up (show).
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
 * Header is hidden when scrolling down, shown when scrolling up
 *
 * @returns Object with isVisible boolean state
 */
export const useScrollVisibility = (): ScrollVisibilityState => {
  const [isVisible, setIsVisible] = useState(true)
  const lastScrollYRef = useRef(0)
  const scrollThresholdRef = useRef(10) // Minimum scroll distance to trigger hide

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Determine scroll direction
      const isScrollingDown = currentScrollY > lastScrollYRef.current

      // Only hide if we've scrolled past the threshold
      if (isScrollingDown && currentScrollY > scrollThresholdRef.current) {
        setIsVisible(false)
      } else {
        // Show header when scrolling up or at top
        setIsVisible(true)
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
