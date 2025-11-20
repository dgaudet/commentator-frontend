/**
 * useThemeFocusRings Hook
 *
 * Returns the appropriate focus ring box-shadow values based on the current active theme.
 * This ensures focus rings work properly across light/dark themes with proper contrast.
 *
 * Usage:
 * ```tsx
 * const focusRings = useThemeFocusRings()
 * const onFocus = (e) => {
 *   e.currentTarget.style.boxShadow = focusRings.primary
 * }
 * ```
 *
 * @returns FocusRings object (light or dark based on active theme)
 */

import { useMemo } from 'react'
import { useTheme } from './useTheme'
import { focusRings, darkFocusRings } from '../theme/tokens'
import type { FocusRings, DarkFocusRings } from '../theme/tokens'

export const useThemeFocusRings = (): FocusRings | DarkFocusRings => {
  const { theme } = useTheme()

  const rings = useMemo((): FocusRings | DarkFocusRings => {
    return theme === 'dark' ? darkFocusRings : focusRings
  }, [theme])

  return rings
}
