/**
 * Test Utilities
 * Custom render function and test helpers
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

// Re-export everything from RTL except render (we provide custom render below)
export {
  screen,
  waitFor,
  fireEvent,
  within,
  cleanup,
  act,
} from '@testing-library/react'

// Export our custom render
export { customRender as render }
