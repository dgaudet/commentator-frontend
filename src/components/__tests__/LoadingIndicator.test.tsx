/**
 * LoadingIndicator Component Tests
 * Tests for the animated teacher character loading indicator
 */

import { render, screen } from '@testing-library/react'
import { ReactNode } from 'react'
import { LoadingIndicator } from '../LoadingIndicator'
import { LoadingProvider } from '../../contexts/LoadingContext'

// Helper to render component within LoadingProvider
const renderWithLoadingProvider = (component: ReactNode) => {
  return render(<LoadingProvider>{component}</LoadingProvider>)
}

// Helper for testing with rerender that maintains provider context
const renderWithLoadingProviderAndRerender = (component: ReactNode) => {
  let currentComponent = component
  const result = render(
    <LoadingProvider>
      <div>{currentComponent}</div>
    </LoadingProvider>,
  )
  return {
    ...result,
    rerenderWithProvider: (newComponent: ReactNode) => {
      currentComponent = newComponent
      result.rerender(
        <LoadingProvider>
          <div>{newComponent}</div>
        </LoadingProvider>,
      )
    },
  }
}

describe('LoadingIndicator', () => {
  describe('Rendering', () => {
    it('should render the loading indicator when visible is true', () => {
      renderWithLoadingProvider(<LoadingIndicator visible={true} />)

      const container = screen.getByTestId('loading-indicator-container')
      expect(container).toBeInTheDocument()
    })

    it('should not render the loading indicator when visible is false', () => {
      const { container } = renderWithLoadingProvider(<LoadingIndicator visible={false} />)

      const loadingIndicator = container.querySelector('[data-testid="loading-indicator-container"]')
      expect(loadingIndicator).not.toBeInTheDocument()
    })

    it('should render the SVG animation element', () => {
      renderWithLoadingProvider(<LoadingIndicator visible={true} />)

      const svg = screen.getByTestId('loading-animation')
      expect(svg).toBeInTheDocument()
    })
  })

  describe('Styling and Appearance', () => {
    it('should center the loading indicator on screen', () => {
      renderWithLoadingProvider(<LoadingIndicator visible={true} />)

      const container = screen.getByTestId('loading-indicator-container')
      const styles = window.getComputedStyle(container)

      expect(styles.display).toBe('flex')
      expect(styles.justifyContent).toContain('center')
      expect(styles.alignItems).toContain('center')
    })

    it('should have proper dimensions for the animation', () => {
      renderWithLoadingProvider(<LoadingIndicator visible={true} />)

      const svg = screen.getByTestId('loading-animation')
      expect(svg).toHaveAttribute('width', '64')
      expect(svg).toHaveAttribute('height', '64')
    })

    it('should apply min-height to ensure full viewport coverage', () => {
      renderWithLoadingProvider(<LoadingIndicator visible={true} />)

      const container = screen.getByTestId('loading-indicator-container')
      const styles = window.getComputedStyle(container)

      expect(styles.minHeight).toBe('100vh')
    })
  })

  describe('Accessibility', () => {
    it('should have aria-busy set to true when visible', () => {
      renderWithLoadingProvider(<LoadingIndicator visible={true} />)

      const container = screen.getByTestId('loading-indicator-container')
      expect(container).toHaveAttribute('aria-busy', 'true')
    })

    it('should have aria-label describing the loading state', () => {
      renderWithLoadingProvider(<LoadingIndicator visible={true} />)

      const container = screen.getByTestId('loading-indicator-container')
      expect(container).toHaveAttribute('aria-label')
      expect(container.getAttribute('aria-label')).toMatch(/loading|initializing/i)
    })

    it('should have role="status" for screen reader announcements', () => {
      renderWithLoadingProvider(<LoadingIndicator visible={true} />)

      const container = screen.getByTestId('loading-indicator-container')
      expect(container).toHaveAttribute('role', 'status')
    })
  })

  describe('Loading States', () => {
    it('should handle transition from loading to loaded', () => {
      const { rerenderWithProvider, container } = renderWithLoadingProviderAndRerender(<LoadingIndicator visible={true} />)

      let loadingIndicator = container.querySelector('[data-testid="loading-indicator-container"]')
      expect(loadingIndicator).toBeInTheDocument()

      rerenderWithProvider(<LoadingIndicator visible={false} />)

      loadingIndicator = container.querySelector('[data-testid="loading-indicator-container"]')
      expect(loadingIndicator).not.toBeInTheDocument()
    })

    it('should handle rapid visibility changes', () => {
      const { rerenderWithProvider, container } = renderWithLoadingProviderAndRerender(<LoadingIndicator visible={true} />)

      expect(container.querySelector('[data-testid="loading-indicator-container"]')).toBeInTheDocument()

      rerenderWithProvider(<LoadingIndicator visible={false} />)
      expect(container.querySelector('[data-testid="loading-indicator-container"]')).not.toBeInTheDocument()

      rerenderWithProvider(<LoadingIndicator visible={true} />)
      expect(container.querySelector('[data-testid="loading-indicator-container"]')).toBeInTheDocument()
    })
  })

  describe('SVG Structure', () => {
    it('should load the SVG animation file', () => {
      renderWithLoadingProvider(<LoadingIndicator visible={true} />)

      const svg = screen.getByTestId('loading-animation')
      expect(svg.tagName.toLowerCase()).toBe('svg')
    })

    it('should use correct SVG viewBox for responsive scaling', () => {
      renderWithLoadingProvider(<LoadingIndicator visible={true} />)

      const svg = screen.getByTestId('loading-animation')
      expect(svg).toHaveAttribute('viewBox')
    })
  })

  describe('Performance', () => {
    it('should not render when visible is false (prevents unnecessary DOM)', () => {
      const { container } = renderWithLoadingProvider(<LoadingIndicator visible={false} />)

      const svgs = container.querySelectorAll('svg')
      expect(svgs.length).toBe(0)
    })

    it('should use efficient SVG rendering without external dependencies', () => {
      renderWithLoadingProvider(<LoadingIndicator visible={true} />)

      const svg = screen.getByTestId('loading-animation')
      // SVG should be a simple file reference or inline, not a heavy component
      expect(svg).toBeInTheDocument()
    })
  })

  describe('Integration with AuthContext', () => {
    it('should accept visible prop that reflects loading state', () => {
      const { rerenderWithProvider } = renderWithLoadingProviderAndRerender(<LoadingIndicator visible={false} />)

      // Simulate AuthContext loading state starting
      rerenderWithProvider(<LoadingIndicator visible={true} />)
      expect(screen.getByTestId('loading-indicator-container')).toBeInTheDocument()

      // Simulate AuthContext loading state ending
      rerenderWithProvider(<LoadingIndicator visible={false} />)
      expect(screen.queryByTestId('loading-indicator-container')).not.toBeInTheDocument()
    })
  })
})
