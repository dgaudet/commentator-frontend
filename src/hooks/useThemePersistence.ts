/**
 * useThemePersistence Hook
 *
 * US-DARK-004: User Preference Persistence
 *
 * Manages theme preference persistence to localStorage with multi-tab synchronization.
 * Provides graceful fallback for storage errors (private browsing, disabled storage).
 *
 * @returns {object} Current theme and setter function
 * - theme: 'light' | 'dark' | 'system' - Current theme preference
 * - setTheme: Function to update theme preference
 */

import { useState, useEffect } from 'react'

const STORAGE_KEY = 'theme-preference'

export type ThemePreference = 'light' | 'dark' | 'system'

interface UseThemePersistenceReturn {
  theme: ThemePreference
  setTheme: (theme: ThemePreference) => void
}

/**
 * Validates if a string is a valid theme preference
 */
const isValidTheme = (value: string): value is ThemePreference => {
  return value === 'light' || value === 'dark' || value === 'system'
}

/**
 * Safely reads theme preference from localStorage
 * Returns 'system' as default if reading fails or value is invalid
 */
const loadThemePreference = (): ThemePreference => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)

    if (stored && isValidTheme(stored)) {
      return stored
    }

    return 'system'
  } catch (error) {
    // Handle localStorage errors (private browsing, disabled storage)
    console.warn('Failed to load theme preference from localStorage:', error)
    return 'system'
  }
}

/**
 * Safely saves theme preference to localStorage
 */
const saveThemePreference = (theme: ThemePreference): void => {
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch (error) {
    // Handle localStorage errors gracefully
    console.warn('Failed to save theme preference to localStorage:', error)
  }
}

export const useThemePersistence = (): UseThemePersistenceReturn => {
  const [theme, setThemeState] = useState<ThemePreference>(() => loadThemePreference())

  // Save to localStorage when theme changes
  useEffect(() => {
    saveThemePreference(theme)
  }, [theme])

  // Listen for storage events (multi-tab synchronization)
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      // Only respond to changes for our storage key
      if (event.key !== STORAGE_KEY) {
        return
      }

      const newValue = event.newValue

      if (newValue && isValidTheme(newValue)) {
        setThemeState(newValue)
      }
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const setTheme = (newTheme: ThemePreference) => {
    setThemeState(newTheme)
  }

  return { theme, setTheme }
}
