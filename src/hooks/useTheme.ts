/**
 * useTheme Hook
 *
 * US-DARK-003: Theme Toggle UI Component
 *
 * Custom hook to access the theme context.
 * Extracted to separate file to comply with React Fast Refresh rules.
 *
 * @throws Error if used outside ThemeProvider
 */

import { useContext } from 'react'
import { ThemeContext } from '../contexts/themeContextInstance'
import { Theme } from './useSystemThemeDetection'
import { ThemePreference } from './useThemePersistence'

export interface ThemeContextValue {
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
