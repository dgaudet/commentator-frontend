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

import React, { useMemo } from 'react'
import { useSystemThemeDetection, Theme } from '../hooks/useSystemThemeDetection'
import { useThemePersistence } from '../hooks/useThemePersistence'
import { ThemeContextValue } from '../hooks/useTheme'
import { ThemeContext } from './themeContextInstance'

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
