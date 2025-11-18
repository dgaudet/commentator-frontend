/**
 * useThemeColors Hook
 *
 * US-DARK-005: Apply Theme to All Components
 *
 * Returns the appropriate color palette based on the current active theme.
 * Components should use this hook instead of directly importing colors.
 *
 * Usage:
 * ```tsx
 * const themeColors = useThemeColors()
 * const buttonStyle = {
 *   backgroundColor: themeColors.primary.main,
 *   color: themeColors.text.primary,
 * }
 * ```
 *
 * @returns Colors object (light or dark based on active theme)
 */

import { useMemo } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { colors, darkColors } from '../theme/tokens'
import type { Colors, DarkColors } from '../theme/tokens'

export const useThemeColors = (): Colors | DarkColors => {
  const { theme } = useTheme()

  const themeColors = useMemo((): Colors | DarkColors => {
    return theme === 'dark' ? darkColors : colors
  }, [theme])

  return themeColors
}
