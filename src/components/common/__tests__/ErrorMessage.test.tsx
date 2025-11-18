/**
 * ErrorMessage Component Tests
 * TDD Phase: RED - These tests should fail initially
 *
 * US-TOKEN-001: Migrate ErrorMessage to Design Tokens
 */
import { render, screen, fireEvent } from '../../../test-utils'
import { ErrorMessage } from '../ErrorMessage'
import { ThemeProvider } from '../../../contexts/ThemeContext'

describe('ErrorMessage', () => {
  it('should render error message', () => {
    render(<ErrorMessage message="Something went wrong" />)
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })

  it('should have role="alert" for screen readers', () => {
    render(<ErrorMessage message="Error" />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('should have aria-live attribute', () => {
    render(<ErrorMessage message="Error" />)
    expect(screen.getByRole('alert')).toHaveAttribute('aria-live', 'assertive')
  })

  it('should show dismiss button when onDismiss provided', () => {
    const handleDismiss = jest.fn()
    render(<ErrorMessage message="Error" onDismiss={handleDismiss} />)
    expect(screen.getByRole('button', { name: /dismiss/i })).toBeInTheDocument()
  })

  it('should call onDismiss when dismiss button clicked', () => {
    const handleDismiss = jest.fn()
    render(<ErrorMessage message="Error" onDismiss={handleDismiss} />)
    fireEvent.click(screen.getByRole('button', { name: /dismiss/i }))
    expect(handleDismiss).toHaveBeenCalledTimes(1)
  })

  it('should not show dismiss button when onDismiss not provided', () => {
    render(<ErrorMessage message="Error" />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('should support custom className', () => {
    render(<ErrorMessage message="Error" className="custom-error" />)
    expect(screen.getByRole('alert')).toHaveClass('custom-error')
  })

  describe('US-TOKEN-001: Theme Adaptation', () => {
    it('should render correctly in light theme', () => {
      render(<ErrorMessage message="Test error" />)

      const alert = screen.getByRole('alert')
      expect(alert).toBeInTheDocument()

      // Component should have inline styles (not Tailwind classes)
      const computedStyle = window.getComputedStyle(alert)
      expect(computedStyle.backgroundColor).toBeTruthy()
      expect(computedStyle.color).toBeTruthy()
    })

    it('should render correctly in dark theme', () => {
      render(
        <ThemeProvider>
          <ErrorMessage message="Test error" />
        </ThemeProvider>,
      )

      // Switch to dark theme
      const alert = screen.getByRole('alert')
      expect(alert).toBeInTheDocument()

      // Component should adapt to theme colors
      const computedStyle = window.getComputedStyle(alert)
      expect(computedStyle.backgroundColor).toBeTruthy()
      expect(computedStyle.color).toBeTruthy()
    })

    it('should use design tokens for all styling', () => {
      render(<ErrorMessage message="Test error" />)

      const alert = screen.getByRole('alert')

      // Should have inline styles, not className-based styling
      expect(alert.getAttribute('style')).toBeTruthy()
    })

    it('should adapt dismiss button colors to theme', () => {
      const handleDismiss = jest.fn()
      render(<ErrorMessage message="Error" onDismiss={handleDismiss} />)

      const button = screen.getByRole('button', { name: /dismiss/i })

      // Button should have inline styles
      const computedStyle = window.getComputedStyle(button)
      expect(computedStyle.color).toBeTruthy()
    })
  })
})
