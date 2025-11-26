/**
 * Test Utilities
 * Custom render function and test helpers
 *
 * Memory Optimization (Story 2):
 * - Provides consistent test wrapper with proper cleanup
 * - Re-exports RTL utilities for consistency
 * - Supports minimal wrapper usage for unit tests
 *
 * Usage:
 * import { render, screen } from './test-utils'
 */
import { ReactElement } from 'react'
import { render as rtlRender, RenderOptions } from '@testing-library/react'
import { ThemeProvider } from './contexts/ThemeContext'

/**
 * Custom render function that wraps components with providers
 * Includes ThemeProvider to support components using useThemeColors()
 *
 * This is the standard wrapper for all component tests that need theme support.
 * For simpler unit tests that don't use theme, use renderMinimal() instead.
 *
 * @param ui - React component to render
 * @param options - Render options
 * @returns Render result with all RTL utilities
 */
function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) {
  return rtlRender(ui, {
    wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
    ...options,
  })
}

/**
 * Minimal render function for lightweight unit tests
 * Does not wrap with ThemeProvider (saves memory for simple tests)
 * Use this for tests that don't use theme-dependent components
 *
 * @param ui - React component to render
 * @param options - Render options
 * @returns Render result with all RTL utilities
 */
function renderMinimal(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) {
  // No wrapper - lightweight rendering
  return rtlRender(ui, options)
}

// Re-export everything from RTL except render (we provide custom render below)
export {
  screen,
  waitFor,
  fireEvent,
  within,
  cleanup,
  act,
} from '@testing-library/react'

// Export our custom renders
export { customRender as render, renderMinimal }

// Export all fixture factories (Story 5 - lightweight mocking)
// eslint-disable-next-line react-refresh/only-export-components
export * from './test-utils/fixtures'
