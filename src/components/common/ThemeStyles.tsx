/**
 * ThemeStyles Component
 *
 * US-DARK-005: Apply Theme to All Components
 *
 * Applies theme colors to the document root (body/html) elements.
 * This ensures the entire page background and text colors update with the theme.
 *
 * Usage: Place this component inside ThemeProvider
 */

import { useEffect } from 'react'
import { useTheme } from '../../hooks/useTheme'
import { colors, darkColors } from '../../theme/tokens'

export const ThemeStyles: React.FC = () => {
  const { theme } = useTheme()

  useEffect(() => {
    const themeColors = theme === 'dark' ? darkColors : colors

    // Apply theme colors to document body
    document.body.style.backgroundColor = themeColors.background.primary
    document.body.style.color = themeColors.text.primary
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease'

    // Apply to html element as well for full coverage
    document.documentElement.style.backgroundColor = themeColors.background.primary

    // Cleanup function
    return () => {
      // Reset to defaults on unmount (not strictly necessary but good practice)
      document.body.style.backgroundColor = ''
      document.body.style.color = ''
      document.documentElement.style.backgroundColor = ''
    }
  }, [theme])

  // This component doesn't render anything
  return null
}
