/**
 * Input Component Tests
 * TDD Phase: RED - These tests should fail initially
 */
import { render, screen, fireEvent } from '../../../test-utils'
import { Input } from '../Input'

describe('Input', () => {
  it('should render with label', () => {
    render(<Input label="Class Name" id="name" />)
    expect(screen.getByLabelText('Class Name')).toBeInTheDocument()
  })

  it('should call onChange handler', () => {
    const handleChange = jest.fn()
    render(<Input label="Name" id="name" onChange={handleChange} />)
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'test' } })
    expect(handleChange).toHaveBeenCalled()
  })

  it('should display error message when error prop provided', () => {
    render(<Input label="Name" id="name" error="This field is required" />)
    expect(screen.getByText('This field is required')).toBeInTheDocument()
  })

  it('should show required indicator when required', () => {
    render(<Input label="Name" id="name" required />)
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Input label="Name" id="name" disabled />)
    expect(screen.getByLabelText('Name')).toBeDisabled()
  })

  it('should support different input types', () => {
    render(<Input label="Year" id="year" type="number" />)
    expect(screen.getByLabelText('Year')).toHaveAttribute('type', 'number')
  })

  it('should have aria-invalid when error present', () => {
    render(<Input label="Name" id="name" error="Invalid" />)
    expect(screen.getByLabelText('Name')).toHaveAttribute('aria-invalid', 'true')
  })

  it('should have aria-describedby when error present', () => {
    render(<Input label="Name" id="name" error="Invalid" />)
    expect(screen.getByLabelText('Name')).toHaveAttribute('aria-describedby', 'name-error')
  })
})
