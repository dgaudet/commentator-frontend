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
    warning: '#F59E0B',
    warningDark: '#92400E',
    warningLight: '#FEF3C7',
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
 * Dark Theme Color Palette
 * Reference: US-DARK-002
 *
 * Colors optimized for dark mode with WCAG 2.1 AA contrast ratios.
 * Uses dark grays instead of pure black to reduce eye strain.
 *
 * Design Principles:
 * - Background: Dark grays (#1A1A1A to #2D2D2D) instead of pure black
 * - Text: Light colors for readability on dark backgrounds
 * - Neutral: Inverted scale from light theme
 * - Semantic: Adjusted for visibility on dark backgrounds
 */
export const darkColors = {
  neutral: {
    50: '#1F2937', // Darkest (inverted from light theme 800)
    100: '#374151', // Dark
    200: '#4B5563', // Medium-dark
    300: '#6B7280', // Medium
    400: '#9CA3AF', // Medium-light (same as light theme)
    500: '#D1D5DB', // Light
    600: '#E5E7EB', // Lighter
    700: '#F3F4F6', // Very light
    800: '#F9FAFB', // Almost white
    900: '#FFFFFF', // White (inverted from light theme 50)
  },
  primary: {
    main: '#3D8BFF', // Brighter blue for dark backgrounds
    dark: '#0066FF', // Same as light theme main
    light: '#6BA5FF', // Lighter variant
  },
  semantic: {
    error: '#F87171', // Lighter red for visibility
    errorDark: '#DC2626', // Same as light theme error
    errorLight: '#7F1D1D', // Dark red background
    success: '#34D399', // Lighter green for visibility
    warning: '#FBBF24', // Lighter amber for dark backgrounds
    warningDark: '#FCD34D', // Light yellow text for dark backgrounds
    warningLight: '#78350F', // Very dark brown for dark background surface
  },
  background: {
    primary: '#1A1A1A', // Main background (dark gray, not pure black)
    secondary: '#2D2D2D', // Cards, modals
    tertiary: '#3A3A3A', // Hover states
  },
  border: {
    default: '#4B5563', // Visible borders on dark background
    focus: '#3D8BFF', // Same as primary.main
    error: '#F87171', // Same as semantic.error
  },
  text: {
    primary: '#E5E7EB', // Main text (light gray)
    secondary: '#9CA3AF', // Secondary text
    tertiary: '#6B7280', // Muted text
    disabled: '#4B5563', // Disabled state
    inverse: '#111827', // Text on light surfaces (same as light theme primary)
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
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.25rem', // 20px
    xl: '1.5rem', // 24px
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
 * Focus Shadow Colors
 *
 * Semantic shadow colors used for focus states on form elements.
 * These colors should be applied with 0.1 opacity for subtle focus rings.
 */
export const focusShadowColors = {
  primary: 'rgba(0, 102, 255, 0.1)', // Light theme primary focus shadow
  error: 'rgba(220, 38, 38, 0.1)', // Light theme error focus shadow
} as const

/**
 * Dark Theme Focus Shadow Colors
 *
 * Adjusted for dark mode with proper contrast and visibility.
 */
export const darkFocusShadowColors = {
  primary: 'rgba(61, 139, 255, 0.15)', // Dark theme primary focus shadow (brighter for visibility)
  error: 'rgba(248, 113, 113, 0.15)', // Dark theme error focus shadow (brighter for visibility)
} as const

/**
 * Focus Ring Shadows
 *
 * Pre-constructed box-shadow values for focus rings with proper opacity.
 * Used for components like Tabs that need a visible focus ring.
 * Format: inner solid ring + outer translucent ring
 */
export const focusRings = {
  primary: '0 0 0 2px #0066FF, 0 0 0 4px rgba(61, 139, 255, 0.2)', // Light theme: blue ring + light blue halo
} as const

/**
 * Dark Theme Focus Ring Shadows
 *
 * Adjusted for dark mode with enhanced contrast and visibility.
 */
export const darkFocusRings = {
  primary: '0 0 0 2px #3D8BFF, 0 0 0 4px rgba(107, 165, 255, 0.25)', // Dark theme: brighter blue ring + lighter halo
} as const

/**
 * TypeScript Types
 *
 * Export types for better IDE autocomplete and type safety.
 */
export type Colors = typeof colors
export type DarkColors = typeof darkColors
export type Spacing = typeof spacing
export type Typography = typeof typography
export type Borders = typeof borders
export type Shadows = typeof shadows
export type FocusShadowColors = typeof focusShadowColors
export type DarkFocusShadowColors = typeof darkFocusShadowColors
export type FocusRings = typeof focusRings
export type DarkFocusRings = typeof darkFocusRings
