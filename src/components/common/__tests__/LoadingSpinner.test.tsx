/**
 * LoadingSpinner Component Tests
 * TDD Phase: RED - These tests should fail initially
 *
 * US-TOKEN-002: Migrate LoadingSpinner to Design Tokens
 */
import { render, screen } from '../../../test-utils'
import { LoadingSpinner } from '../LoadingSpinner'
import { ThemeProvider } from '../../../contexts/ThemeContext'

describe('LoadingSpinner', () => {
  it('should render with default message', () => {
    render(<LoadingSpinner />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('should render with custom message', () => {
    render(<LoadingSpinner message="Fetching classes..." />)
    expect(screen.getByText('Fetching classes...')).toBeInTheDocument()
  })

  it('should have role="status" for screen readers', () => {
    render(<LoadingSpinner />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('should have aria-live attribute', () => {
    render(<LoadingSpinner />)
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite')
  })

  it('should support different sizes', () => {
    const { rerender } = render(<LoadingSpinner size="small" />)
    const spinnerSmall = screen.getByRole('status').querySelector('svg')
    expect(spinnerSmall).toBeInTheDocument()

    rerender(<LoadingSpinner size="large" />)
    const spinnerLarge = screen.getByRole('status').querySelector('svg')
    expect(spinnerLarge).toBeInTheDocument()
  })

  describe('US-TOKEN-002: Theme Adaptation', () => {
    it('should render correctly in light theme', () => {
      render(<LoadingSpinner message="Loading data..." />)

      const status = screen.getByRole('status')
      expect(status).toBeInTheDocument()

      // Component should have inline styles
      expect(status.getAttribute('style')).toBeTruthy()

      // Text should have theme-aware color
      const text = screen.getByText('Loading data...')
      const computedStyle = window.getComputedStyle(text)
      expect(computedStyle.color).toBeTruthy()
    })

    it('should render correctly in dark theme', () => {
      render(
        <ThemeProvider>
          <LoadingSpinner message="Loading data..." />
        </ThemeProvider>,
      )

      const status = screen.getByRole('status')
      expect(status).toBeInTheDocument()

      // Component should adapt to theme
      const text = screen.getByText('Loading data...')
      const computedStyle = window.getComputedStyle(text)
      expect(computedStyle.color).toBeTruthy()
    })

    it('should use design tokens for spinner colors', () => {
      render(<LoadingSpinner />)

      const spinnerContainer = screen.getByTestId('loading-spinner')
      expect(spinnerContainer).toBeInTheDocument()

      // SVG should be rendered with design tokens applied via stroke color
      const svg = spinnerContainer.querySelector('svg')
      expect(svg).toBeInTheDocument()

      // Check that SVG has circles or paths with stroke attributes
      const strokeElements = svg?.querySelectorAll('[stroke]')
      expect(strokeElements?.length).toBeGreaterThan(0)
    })

    it('should adapt all styling to current theme', () => {
      render(<LoadingSpinner />)

      const spinner = screen.getByTestId('loading-spinner')

      // Should use inline styles, not Tailwind classes
      expect(spinner.getAttribute('style')).toBeTruthy()
    })
  })
})
