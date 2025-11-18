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

    // US-TOKEN-010: Apply theme-aware background gradients
    // Light theme: cyan gradient (original design)
    // Dark theme: darker gradient for dark mode
    const backgroundGradient = theme === 'dark'
      ? `linear-gradient(180deg, ${themeColors.primary.dark} 0%, ${themeColors.background.primary} 100%)`
      : 'linear-gradient(180deg, #E0F7FF 0%, #FFFFFF 100%)'

    // Apply theme colors to document body
    document.body.style.background = backgroundGradient
    document.body.style.backgroundAttachment = 'fixed'
    document.body.style.color = themeColors.text.primary
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease'

    // Apply to html element as well for full coverage
    document.documentElement.style.backgroundColor = themeColors.background.primary

    // Cleanup function
    return () => {
      // Reset to defaults on unmount (not strictly necessary but good practice)
      document.body.style.background = ''
      document.body.style.color = ''
      document.documentElement.style.backgroundColor = ''
    }
  }, [theme])

  // This component doesn't render anything
  return null
}
