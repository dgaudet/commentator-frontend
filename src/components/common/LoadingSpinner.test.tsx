/**
 * LoadingSpinner Component Tests
 * TDD Phase: RED - These tests should fail initially
 */
import { render, screen } from '../../test-utils'
import { LoadingSpinner } from './LoadingSpinner'

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
    expect(screen.getByRole('status').querySelector('div')).toHaveClass('h-4')

    rerender(<LoadingSpinner size="large" />)
    expect(screen.getByRole('status').querySelector('div')).toHaveClass('h-12')
  })
})
