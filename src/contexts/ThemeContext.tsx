/**
 * ThemeContext
 *
 * US-DARK-003: Theme Toggle UI Component
 * US-DARK-004: User Preference Persistence
 *
 * Provides theme state management integrating:
 * - System theme detection (useSystemThemeDetection)
 * - User preference persistence (useThemePersistence)
 * - Computed active theme based on preference and system
 *
 * Context provides:
 * - theme: 'light' | 'dark' - The currently active theme
 * - themePreference: 'light' | 'dark' | 'system' - User's preference
 * - setThemePreference: Function to update preference
 */

import React, { createContext, useContext, useMemo } from 'react'
import { useSystemThemeDetection, Theme } from '../hooks/useSystemThemeDetection'
import { useThemePersistence, ThemePreference } from '../hooks/useThemePersistence'

interface ThemeContextValue {
  /**
   * The currently active theme ('light' or 'dark')
   * - If preference is 'light' or 'dark', returns that value
   * - If preference is 'system', returns the system-detected theme
   */
  theme: Theme

  /**
   * The user's theme preference ('light', 'dark', or 'system')
   */
  themePreference: ThemePreference

  /**
   * Updates the user's theme preference
   */
  setThemePreference: (preference: ThemePreference) => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

interface ThemeProviderProps {
  children: React.ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Get system theme preference
  const systemTheme = useSystemThemeDetection()

  // Get persisted user preference
  const { theme: themePreference, setTheme: setThemePreference } = useThemePersistence()

  // Compute active theme based on preference
  const theme = useMemo((): Theme => {
    if (themePreference === 'system') {
      return systemTheme
    }
    return themePreference
  }, [themePreference, systemTheme])

  const value: ThemeContextValue = {
    theme,
    themePreference,
    setThemePreference,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

/**
 * Hook to access theme context
 * @throws Error if used outside ThemeProvider
 */
export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext)

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  return context
}
