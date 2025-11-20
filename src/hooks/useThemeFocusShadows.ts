/**
 * useThemeFocusShadows Hook
 *
 * Returns the appropriate focus shadow colors based on the current active theme.
 * This ensures focus rings adapt properly across light/dark themes.
 *
 * Usage:
 * ```tsx
 * const focusShadows = useThemeFocusShadows()
 * const focusBoxShadow = `0 0 0 3px ${focusShadows.primary}`
 * ```
 *
 * @returns FocusShadowColors object (light or dark based on active theme)
 */

import { useMemo } from 'react'
import { useTheme } from './useTheme'
import { focusShadowColors, darkFocusShadowColors } from '../theme/tokens'
import type { FocusShadowColors, DarkFocusShadowColors } from '../theme/tokens'

export const useThemeFocusShadows = (): FocusShadowColors | DarkFocusShadowColors => {
  const { theme } = useTheme()

  const shadowColors = useMemo((): FocusShadowColors | DarkFocusShadowColors => {
    return theme === 'dark' ? darkFocusShadowColors : focusShadowColors
  }, [theme])

  return shadowColors
}
