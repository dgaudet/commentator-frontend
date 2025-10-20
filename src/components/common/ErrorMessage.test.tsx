/**
 * ErrorMessage Component Tests
 * TDD Phase: RED - These tests should fail initially
 */
import { render, screen, fireEvent } from '../../test-utils'
import { ErrorMessage } from './ErrorMessage'

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
})
