/**
 * CommentTextField Component Tests
 *
 * Test-Driven Development approach for shared comment field component
 * US-SHARED-001: Create Shared CommentTextField Component
 */

import { render, screen, fireEvent } from '@testing-library/react'
import { CommentTextField } from '../CommentTextField'

describe('CommentTextField - Basic Rendering', () => {
  it('renders with required props', () => {
    const handleChange = jest.fn()

    render(
      <CommentTextField
        value=""
        onChange={handleChange}
      />,
    )

    // Should render a textarea
    const textarea = screen.getByRole('textbox')
    expect(textarea).toBeInTheDocument()
    expect(textarea).toHaveValue('')
  })

  it('renders with custom value', () => {
    const handleChange = jest.fn()
    const testValue = 'Test comment text'

    render(
      <CommentTextField
        value={testValue}
        onChange={handleChange}
      />,
    )

    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveValue(testValue)
  })

  it('calls onChange when text is entered', () => {
    const handleChange = jest.fn()

    render(
      <CommentTextField
        value=""
        onChange={handleChange}
      />,
    )

    const textarea = screen.getByRole('textbox')

    // Simulate typing
    const newValue = 'New comment'
    fireEvent.change(textarea, { target: { value: newValue } })

    expect(handleChange).toHaveBeenCalledWith(newValue)
  })
})

describe('CommentTextField - Character Validation', () => {
  it('displays character counter when showCharCount is true', () => {
    const handleChange = jest.fn()

    render(
      <CommentTextField
        value="Test"
        onChange={handleChange}
        showCharCount={true}
        maxLength={500}
      />,
    )

    // Should show "4 / 500 characters"
    expect(screen.getByText(/4 \/ 500 characters/i)).toBeInTheDocument()
  })

  it('does not display character counter when showCharCount is false', () => {
    const handleChange = jest.fn()

    render(
      <CommentTextField
        value="Test"
        onChange={handleChange}
        showCharCount={false}
      />,
    )

    // Should not show character counter
    expect(screen.queryByText(/characters/i)).not.toBeInTheDocument()
  })

  it('shows minimum character hint when count is below minimum', () => {
    const handleChange = jest.fn()

    render(
      <CommentTextField
        value="Test"
        onChange={handleChange}
        showCharCount={true}
        minLength={10}
      />,
    )

    // Should show minimum hint
    expect(screen.getByText(/\(minimum 10\)/i)).toBeInTheDocument()
  })

  it('does not show minimum hint when count meets minimum', () => {
    const handleChange = jest.fn()

    render(
      <CommentTextField
        value="Test comment that is long enough"
        onChange={handleChange}
        showCharCount={true}
        minLength={10}
      />,
    )

    // Should not show minimum hint
    expect(screen.queryByText(/\(minimum/i)).not.toBeInTheDocument()
  })

  it('uses default minLength of 10 and maxLength of 500', () => {
    const handleChange = jest.fn()

    render(
      <CommentTextField
        value="Test"
        onChange={handleChange}
        showCharCount={true}
      />,
    )

    // Should show default maxLength of 500
    expect(screen.getByText(/4 \/ 500 characters/i)).toBeInTheDocument()
    // Should show minimum hint for default minLength of 10
    expect(screen.getByText(/\(minimum 10\)/i)).toBeInTheDocument()
  })
})

describe('CommentTextField - Placeholder Integration', () => {
  it('displays PlaceholderTipsBox when showPlaceholderTips is true', () => {
    const handleChange = jest.fn()

    render(
      <CommentTextField
        value=""
        onChange={handleChange}
        showPlaceholderTips={true}
      />,
    )

    // Should show the tips box with tip text
    expect(screen.getByText(/use dynamic placeholders/i)).toBeInTheDocument()
  })

  it('does not display PlaceholderTipsBox when showPlaceholderTips is false', () => {
    const handleChange = jest.fn()

    render(
      <CommentTextField
        value=""
        onChange={handleChange}
        showPlaceholderTips={false}
      />,
    )

    // Should not show the tips box
    expect(screen.queryByText(/use dynamic placeholders/i)).not.toBeInTheDocument()
  })

  it('validates placeholders and shows warnings for malformed placeholders', () => {
    const handleChange = jest.fn()

    render(
      <CommentTextField
        value="Test <first name comment"
        onChange={handleChange}
      />,
    )

    // Should show warning for malformed placeholder (missing closing bracket)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('does not show warnings for valid placeholders', () => {
    const handleChange = jest.fn()

    render(
      <CommentTextField
        value="Test <first name> comment"
        onChange={handleChange}
      />,
    )

    // Should not show warnings
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('calls onValidationChange callback with warnings', () => {
    const handleChange = jest.fn()
    const handleValidationChange = jest.fn()

    render(
      <CommentTextField
        value="Test <first name comment"
        onChange={handleChange}
        onValidationChange={handleValidationChange}
      />,
    )

    // Should have called onValidationChange with warnings array
    expect(handleValidationChange).toHaveBeenCalledWith(
      expect.arrayContaining([expect.stringContaining('not closed')]),
    )
  })
})
