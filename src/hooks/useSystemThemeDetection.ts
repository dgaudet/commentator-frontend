/**
 * useSystemThemeDetection Hook
 *
 * US-DARK-001: System Preference Detection
 *
 * Detects the user's operating system or browser dark mode preference
 * using the prefers-color-scheme media query.
 *
 * @returns 'dark' | 'light' - The detected system theme preference
 */

import { useState, useEffect } from 'react'

export type Theme = 'light' | 'dark'

export const useSystemThemeDetection = (): Theme => {
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    // Check if matchMedia is supported
    if (typeof window === 'undefined' || !window.matchMedia) {
      return
    }

    // Query system preference for dark mode
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    // Set initial theme based on system preference
    setTheme(mediaQuery.matches ? 'dark' : 'light')

    // Listen for system preference changes
    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light')
    }

    mediaQuery.addEventListener('change', handleChange)

    // Cleanup listener on unmount
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  return theme
}
