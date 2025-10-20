/**
 * Button Component Tests
 * TDD Phase: RED - These tests should fail initially
 */
import { render, screen, fireEvent } from '../../test-utils'
import { Button } from './Button'

describe('Button', () => {
  it('should render with text', () => {
    render(<Button>Click Me</Button>)
    expect(screen.getByText('Click Me')).toBeInTheDocument()
  })

  it('should call onClick handler', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    fireEvent.click(screen.getByText('Click'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByText('Disabled')).toBeDisabled()
  })

  it('should support primary variant', () => {
    render(<Button variant="primary">Primary</Button>)
    expect(screen.getByText('Primary')).toHaveClass('bg-blue-600')
  })

  it('should support secondary variant', () => {
    render(<Button variant="secondary">Secondary</Button>)
    expect(screen.getByText('Secondary')).toHaveClass('bg-gray-200')
  })

  it('should support danger variant', () => {
    render(<Button variant="danger">Danger</Button>)
    expect(screen.getByText('Danger')).toHaveClass('bg-red-600')
  })

  it('should default to primary variant', () => {
    render(<Button>Default</Button>)
    expect(screen.getByText('Default')).toHaveClass('bg-blue-600')
  })

  it('should support custom className', () => {
    render(<Button className="custom-class">Custom</Button>)
    expect(screen.getByText('Custom')).toHaveClass('custom-class')
  })

  it('should have button type by default', () => {
    render(<Button>Submit</Button>)
    expect(screen.getByText('Submit')).toHaveAttribute('type', 'button')
  })

  it('should support submit type', () => {
    render(<Button type="submit">Submit</Button>)
    expect(screen.getByText('Submit')).toHaveAttribute('type', 'submit')
  })
})
