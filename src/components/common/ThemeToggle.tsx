/**
 * ThemeToggle Component
 *
 * US-DARK-003: Theme Toggle UI Component
 *
 * Radio button control for theme selection with three options:
 * - Light: Always use light theme
 * - Dark: Always use dark theme
 * - System: Follow OS/browser preference
 *
 * Features:
 * - Keyboard navigation support (arrow keys, space/enter)
 * - Smooth visual transitions
 * - Hover feedback
 * - ARIA labels for accessibility
 * - Reflects current theme preference
 */

import React from 'react'
import { useTheme } from '../../hooks/useTheme'
import { useThemeColors } from '../../hooks/useThemeColors'
import { spacing, typography, borders } from '../../theme/tokens'
import type { ThemePreference } from '../../hooks/useThemePersistence'

export const ThemeToggle: React.FC = () => {
  const { themePreference, setThemePreference } = useTheme()
  const themeColors = useThemeColors()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setThemePreference(event.target.value as ThemePreference)
  }

  const radioGroupStyle: React.CSSProperties = {
    display: 'flex',
    gap: spacing.md,
    alignItems: 'center',
  }

  const labelStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    padding: `${spacing.sm} ${spacing.md}`,
    borderRadius: borders.radius.md,
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: themeColors.text.primary,
  }

  const inputStyle: React.CSSProperties = {
    cursor: 'pointer',
    width: '1.125rem',
    height: '1.125rem',
    accentColor: themeColors.primary.main,
  }

  return (
    <div
      role="radiogroup"
      aria-label="Theme preference"
      style={radioGroupStyle}
    >
      {/* Light Theme Option */}
      <label
        style={{
          ...labelStyle,
          backgroundColor:
            themePreference === 'light'
              ? themeColors.neutral[100]
              : 'transparent',
        }}
        onMouseEnter={(e) => {
          if (themePreference !== 'light') {
            e.currentTarget.style.backgroundColor = themeColors.neutral[50]
          }
        }}
        onMouseLeave={(e) => {
          if (themePreference !== 'light') {
            e.currentTarget.style.backgroundColor = 'transparent'
          }
        }}
      >
        <input
          type="radio"
          name="theme-preference"
          value="light"
          checked={themePreference === 'light'}
          onChange={handleChange}
          style={inputStyle}
          aria-label="Light theme"
        />
        <span>☀️ Light</span>
      </label>

      {/* Dark Theme Option */}
      <label
        style={{
          ...labelStyle,
          backgroundColor:
            themePreference === 'dark'
              ? themeColors.neutral[100]
              : 'transparent',
        }}
        onMouseEnter={(e) => {
          if (themePreference !== 'dark') {
            e.currentTarget.style.backgroundColor = themeColors.neutral[50]
          }
        }}
        onMouseLeave={(e) => {
          if (themePreference !== 'dark') {
            e.currentTarget.style.backgroundColor = 'transparent'
          }
        }}
      >
        <input
          type="radio"
          name="theme-preference"
          value="dark"
          checked={themePreference === 'dark'}
          onChange={handleChange}
          style={inputStyle}
          aria-label="Dark theme"
        />
        <span>🌙 Dark</span>
      </label>

      {/* System Theme Option */}
      <label
        style={{
          ...labelStyle,
          backgroundColor:
            themePreference === 'system'
              ? themeColors.neutral[100]
              : 'transparent',
        }}
        onMouseEnter={(e) => {
          if (themePreference !== 'system') {
            e.currentTarget.style.backgroundColor = themeColors.neutral[50]
          }
        }}
        onMouseLeave={(e) => {
          if (themePreference !== 'system') {
            e.currentTarget.style.backgroundColor = 'transparent'
          }
        }}
      >
        <input
          type="radio"
          name="theme-preference"
          value="system"
          checked={themePreference === 'system'}
          onChange={handleChange}
          style={inputStyle}
          aria-label="System theme"
        />
        <span>🔄 System</span>
      </label>
    </div>
  )
}
