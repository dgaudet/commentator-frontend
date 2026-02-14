/**
 * useThemeGradients Hook
 *
 * Returns the appropriate gradient palette based on the current active theme.
 * Components should use this hook instead of directly importing gradients.
 *
 * Usage:
 * ```tsx
 * const themeGradients = useThemeGradients()
 * const containerStyle = {
 *   background: themeGradients.primary,
 * }
 * ```
 *
 * @returns Gradients object (light or dark based on active theme)
 */

import { useMemo } from 'react'
import { useTheme } from './useTheme'
import { gradients, darkGradients } from '../theme/tokens'
import type { Gradients, DarkGradients } from '../theme/tokens'

export const useThemeGradients = (): Gradients | DarkGradients => {
  const { theme } = useTheme()

  const themeGradients = useMemo((): Gradients | DarkGradients => {
    return theme === 'dark' ? darkGradients : gradients
  }, [theme])

  return themeGradients
}
