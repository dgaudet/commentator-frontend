/**
 * Design Token System
 * Reference: US-CSS-002
 *
 * Single source of truth for all design values across the application.
 * Based on CSS Architecture Audit findings (US-CSS-001).
 *
 * Usage:
 * import { colors, spacing, typography, borders, shadows } from '@/theme/tokens'
 *
 * Example:
 * const buttonStyle = {
 *   backgroundColor: colors.primary.main,
 *   padding: spacing.md,
 *   fontSize: typography.fontSize.base,
 *   borderRadius: borders.radius.md,
 * }
 */

/**
 * Color Palette
 *
 * Neutral: Grayscale colors (50-900)
 * Primary: Brand blue colors
 * Semantic: Status colors (error, success)
 * Background: Surface colors
 * Border: Border colors for different states
 * Text: Text colors for different hierarchies
 */
export const colors = {
  neutral: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  primary: {
    main: '#0066FF',
    dark: '#0052CC',
    light: '#3D8BFF',
  },
  semantic: {
    error: '#DC2626',
    errorDark: '#B91C1C',
    errorLight: '#FEE2E2',
    success: '#10B981',
  },
  background: {
    primary: '#FFFFFF',
    secondary: '#F9FAFB',
    tertiary: '#F5F8FA',
  },
  border: {
    default: '#E5E7EB',
    focus: '#0066FF',
    error: '#DC2626',
  },
  text: {
    primary: '#111827',
    secondary: '#374151',
    tertiary: '#6B7280',
    disabled: '#9CA3AF',
    inverse: '#FFFFFF',
  },
} as const

/**
 * Spacing Scale
 *
 * Uses rem units for accessibility and scalability.
 * Base: 1rem = 16px (browser default)
 *
 * xs:  4px  (0.25rem)
 * sm:  8px  (0.5rem)
 * md:  12px (0.75rem)
 * lg:  16px (1rem)
 * xl:  24px (1.5rem)
 * 2xl: 32px (2rem)
 */
export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '0.75rem',
  lg: '1rem',
  xl: '1.5rem',
  '2xl': '2rem',
} as const

/**
 * Typography Scale
 *
 * Font sizes, weights, and line heights for text hierarchy.
 */
export const typography = {
  fontSize: {
    xs: '0.75rem',   // 12px
    sm: '0.875rem',  // 14px
    base: '1rem',    // 16px
    lg: '1.25rem',   // 20px
    xl: '1.5rem',    // 24px
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const

/**
 * Border System
 *
 * Standardized border widths and radius values.
 */
export const borders = {
  width: {
    thin: '1px',
    thick: '2px',
  },
  radius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    full: '9999px',
  },
} as const

/**
 * Shadow Definitions
 *
 * Box shadow values for elevation and depth.
 */
export const shadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 1px 3px rgba(0, 0, 0, 0.1)',
  lg: '0 4px 6px rgba(0, 0, 0, 0.15)',
} as const

/**
 * TypeScript Types
 *
 * Export types for better IDE autocomplete and type safety.
 */
export type Colors = typeof colors
export type Spacing = typeof spacing
export type Typography = typeof typography
export type Borders = typeof borders
export type Shadows = typeof shadows
