/**
 * EmojiRatingSelector Component Tests
 * TDD Phase: RED - Writing failing tests first
 * Reference: US-RATING-001, US-RATING-003, US-RATING-010
 *
 * Testing rating selector component:
 * - Render 5 emoji buttons (1-5 scale)
 * - Handle click events and onChange callback
 * - Keyboard navigation (arrow keys, space/enter)
 * - Accessibility (ARIA labels, roles, keyboard focus)
 * - Visual states (selected, hover, disabled)
 * - Error handling
 */
import { render, screen, fireEvent } from '../../../test-utils'
import { EmojiRatingSelector } from '../EmojiRatingSelector'

describe('EmojiRatingSelector - Rendering', () => {
  it('renders all 5 emoji rating buttons', () => {
    render(<EmojiRatingSelector id="rating" value={3} onChange={() => {}} />)

    // Check all 5 emojis are present
    expect(screen.getByLabelText('Rate 1 out of 5: Very Negative')).toBeInTheDocument()
    expect(screen.getByLabelText('Rate 2 out of 5: Negative')).toBeInTheDocument()
    expect(screen.getByLabelText('Rate 3 out of 5: Neutral')).toBeInTheDocument()
    expect(screen.getByLabelText('Rate 4 out of 5: Positive')).toBeInTheDocument()
    expect(screen.getByLabelText('Rate 5 out of 5: Very Positive')).toBeInTheDocument()
  })

  it('renders with label when provided', () => {
    render(<EmojiRatingSelector id="rating" label="How would you rate this comment?" value={3} onChange={() => {}} />)

    expect(screen.getByText('How would you rate this comment?')).toBeInTheDocument()
  })

  it('renders without label when not provided', () => {
    render(<EmojiRatingSelector id="rating" value={3} onChange={() => {}} />)

    // No label text should be present
    const labels = screen.queryAllByRole('label')
    expect(labels).toHaveLength(0)
  })

  it('shows required asterisk when required prop is true', () => {
    render(<EmojiRatingSelector id="rating" label="Rating" value={3} onChange={() => {}} required />)

    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('renders error message when error is a string', () => {
    render(<EmojiRatingSelector id="rating" value={3} onChange={() => {}} error="Please select a rating" />)

    expect(screen.getByText('Please select a rating')).toBeInTheDocument()
  })

  it('does not render error message when error is boolean true', () => {
    render(<EmojiRatingSelector id="rating" value={3} onChange={() => {}} error={true} />)

    // Should not have any error message text
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})

describe('EmojiRatingSelector - Selection', () => {
  it('highlights the selected rating', () => {
    render(<EmojiRatingSelector id="rating" value={4} onChange={() => {}} />)

    const button4 = screen.getByLabelText('Rate 4 out of 5: Positive')
    expect(button4).toHaveAttribute('aria-checked', 'true')
  })

  it('does not highlight unselected ratings', () => {
    render(<EmojiRatingSelector id="rating" value={3} onChange={() => {}} />)

    const button1 = screen.getByLabelText('Rate 1 out of 5: Very Negative')
    const button5 = screen.getByLabelText('Rate 5 out of 5: Very Positive')

    expect(button1).toHaveAttribute('aria-checked', 'false')
    expect(button5).toHaveAttribute('aria-checked', 'false')
  })

  it('calls onChange with new rating when emoji clicked', () => {
    const handleChange = jest.fn()
    render(<EmojiRatingSelector id="rating" value={3} onChange={handleChange} />)

    const button5 = screen.getByLabelText('Rate 5 out of 5: Very Positive')
    fireEvent.click(button5)

    expect(handleChange).toHaveBeenCalledTimes(1)
    expect(handleChange).toHaveBeenCalledWith(5)
  })

  it('allows clicking the same rating (re-selection)', () => {
    const handleChange = jest.fn()
    render(<EmojiRatingSelector id="rating" value={4} onChange={handleChange} />)

    const button4 = screen.getByLabelText('Rate 4 out of 5: Positive')
    fireEvent.click(button4)

    expect(handleChange).toHaveBeenCalledTimes(1)
    expect(handleChange).toHaveBeenCalledWith(4)
  })

  it('updates selection when value prop changes', () => {
    const { rerender } = render(<EmojiRatingSelector id="rating" value={2} onChange={() => {}} />)

    let button2 = screen.getByLabelText('Rate 2 out of 5: Negative')
    expect(button2).toHaveAttribute('aria-checked', 'true')

    // Update value prop
    rerender(<EmojiRatingSelector id="rating" value={5} onChange={() => {}} />)

    button2 = screen.getByLabelText('Rate 2 out of 5: Negative')
    const button5 = screen.getByLabelText('Rate 5 out of 5: Very Positive')

    expect(button2).toHaveAttribute('aria-checked', 'false')
    expect(button5).toHaveAttribute('aria-checked', 'true')
  })
})

describe('EmojiRatingSelector - Keyboard Navigation', () => {
  it('supports arrow right to move to next rating', () => {
    const handleChange = jest.fn()
    render(<EmojiRatingSelector id="rating" value={3} onChange={handleChange} />)

    const button3 = screen.getByLabelText('Rate 3 out of 5: Neutral')
    button3.focus()

    fireEvent.keyDown(button3, { key: 'ArrowRight', code: 'ArrowRight' })

    expect(handleChange).toHaveBeenCalledWith(4)
  })

  it('supports arrow left to move to previous rating', () => {
    const handleChange = jest.fn()
    render(<EmojiRatingSelector id="rating" value={3} onChange={handleChange} />)

    const button3 = screen.getByLabelText('Rate 3 out of 5: Neutral')
    button3.focus()

    fireEvent.keyDown(button3, { key: 'ArrowLeft', code: 'ArrowLeft' })

    expect(handleChange).toHaveBeenCalledWith(2)
  })

  it('does not go below rating 1 with arrow left', () => {
    const handleChange = jest.fn()
    render(<EmojiRatingSelector id="rating" value={1} onChange={handleChange} />)

    const button1 = screen.getByLabelText('Rate 1 out of 5: Very Negative')
    button1.focus()

    fireEvent.keyDown(button1, { key: 'ArrowLeft', code: 'ArrowLeft' })

    expect(handleChange).not.toHaveBeenCalled()
  })

  it('does not go above rating 5 with arrow right', () => {
    const handleChange = jest.fn()
    render(<EmojiRatingSelector id="rating" value={5} onChange={handleChange} />)

    const button5 = screen.getByLabelText('Rate 5 out of 5: Very Positive')
    button5.focus()

    fireEvent.keyDown(button5, { key: 'ArrowRight', code: 'ArrowRight' })

    expect(handleChange).not.toHaveBeenCalled()
  })

  it('supports space key to select rating', () => {
    const handleChange = jest.fn()
    render(<EmojiRatingSelector id="rating" value={3} onChange={handleChange} />)

    const button4 = screen.getByLabelText('Rate 4 out of 5: Positive')
    button4.focus()

    fireEvent.keyDown(button4, { key: ' ', code: 'Space' })

    expect(handleChange).toHaveBeenCalledWith(4)
  })

  it('supports enter key to select rating', () => {
    const handleChange = jest.fn()
    render(<EmojiRatingSelector id="rating" value={3} onChange={handleChange} />)

    const button5 = screen.getByLabelText('Rate 5 out of 5: Very Positive')
    button5.focus()

    fireEvent.keyDown(button5, { key: 'Enter', code: 'Enter' })

    expect(handleChange).toHaveBeenCalledWith(5)
  })
})

describe('EmojiRatingSelector - Accessibility', () => {
  it('has role="radiogroup" on container', () => {
    render(<EmojiRatingSelector id="rating" value={3} onChange={() => {}} />)

    // Find the radiogroup container
    const radiogroup = screen.getByRole('radiogroup')
    expect(radiogroup).toBeInTheDocument()
  })

  it('has aria-labelledby when label is provided', () => {
    render(<EmojiRatingSelector id="rating" label="Comment Rating" value={3} onChange={() => {}} />)

    const radiogroup = screen.getByRole('radiogroup')
    expect(radiogroup).toHaveAttribute('aria-labelledby', 'rating-label')
  })

  it('has aria-describedby when error message is present', () => {
    render(<EmojiRatingSelector id="rating" value={3} onChange={() => {}} error="Invalid rating" />)

    const radiogroup = screen.getByRole('radiogroup')
    expect(radiogroup).toHaveAttribute('aria-describedby', 'rating-error')
  })

  it('marks radiogroup as invalid when error is present', () => {
    render(<EmojiRatingSelector id="rating" value={3} onChange={() => {}} error="Invalid rating" />)

    const radiogroup = screen.getByRole('radiogroup')
    expect(radiogroup).toHaveAttribute('aria-invalid', 'true')
  })

  it('marks radiogroup as valid when no error', () => {
    render(<EmojiRatingSelector id="rating" value={3} onChange={() => {}} />)

    const radiogroup = screen.getByRole('radiogroup')
    expect(radiogroup).toHaveAttribute('aria-invalid', 'false')
  })

  it('has role="radio" on each button', () => {
    render(<EmojiRatingSelector id="rating" value={3} onChange={() => {}} />)

    const radios = screen.getAllByRole('radio')
    expect(radios).toHaveLength(5)
  })

  it('has tabindex=0 on selected button and -1 on others (roving tabindex)', () => {
    render(<EmojiRatingSelector id="rating" value={3} onChange={() => {}} />)

    const button1 = screen.getByLabelText('Rate 1 out of 5: Very Negative')
    const button3 = screen.getByLabelText('Rate 3 out of 5: Neutral')
    const button5 = screen.getByLabelText('Rate 5 out of 5: Very Positive')

    expect(button3).toHaveAttribute('tabindex', '0')
    expect(button1).toHaveAttribute('tabindex', '-1')
    expect(button5).toHaveAttribute('tabindex', '-1')
  })

  it('error message has role="alert" for screen readers', () => {
    render(<EmojiRatingSelector id="rating" value={3} onChange={() => {}} error="Please select a rating" />)

    const errorMessage = screen.getByText('Please select a rating')
    expect(errorMessage.closest('[role="alert"]')).toBeInTheDocument()
  })
})

describe('EmojiRatingSelector - Disabled State', () => {
  it('disables all buttons when disabled prop is true', () => {
    render(<EmojiRatingSelector id="rating" value={3} onChange={() => {}} disabled />)

    const buttons = screen.getAllByRole('radio')
    buttons.forEach((button) => {
      expect(button).toBeDisabled()
    })
  })

  it('does not call onChange when disabled button is clicked', () => {
    const handleChange = jest.fn()
    render(<EmojiRatingSelector id="rating" value={3} onChange={handleChange} disabled />)

    const button5 = screen.getByLabelText('Rate 5 out of 5: Very Positive')
    fireEvent.click(button5)

    expect(handleChange).not.toHaveBeenCalled()
  })

  it('does not respond to keyboard navigation when disabled', () => {
    const handleChange = jest.fn()
    render(<EmojiRatingSelector id="rating" value={3} onChange={handleChange} disabled />)

    const button3 = screen.getByLabelText('Rate 3 out of 5: Neutral')
    button3.focus()

    fireEvent.keyDown(button3, { key: 'ArrowRight', code: 'ArrowRight' })

    expect(handleChange).not.toHaveBeenCalled()
  })
})

describe('EmojiRatingSelector - Visual Styling', () => {
  it('applies selected style to current rating', () => {
    render(<EmojiRatingSelector id="rating" value={4} onChange={() => {}} />)

    const button4 = screen.getByLabelText('Rate 4 out of 5: Positive')

    // Check for selected styling (exact values depend on implementation)
    expect(button4).toHaveStyle({
      opacity: '1',
    })
  })

  it('applies unselected style to other ratings', () => {
    render(<EmojiRatingSelector id="rating" value={4} onChange={() => {}} />)

    const button2 = screen.getByLabelText('Rate 2 out of 5: Negative')

    // Check for unselected styling (reduced opacity)
    expect(button2).toHaveStyle({
      opacity: '0.4',
    })
  })

  it('applies error border when error is present', () => {
    render(<EmojiRatingSelector id="rating" value={3} onChange={() => {}} error="Invalid" />)

    const radiogroup = screen.getByRole('radiogroup')

    // Check for error border color (from design tokens)
    expect(radiogroup).toHaveStyle({
      borderColor: '#DC2626', // colors.semantic.error
    })
  })

  it('applies default border when no error', () => {
    render(<EmojiRatingSelector id="rating" value={3} onChange={() => {}} />)

    const radiogroup = screen.getByRole('radiogroup')

    // Check for default border color
    expect(radiogroup).toHaveStyle({
      borderColor: '#E5E7EB', // colors.border.default
    })
  })
})

describe('EmojiRatingSelector - Edge Cases', () => {
  it('handles value of 0 (invalid rating)', () => {
    render(<EmojiRatingSelector id="rating" value={0} onChange={() => {}} />)

    // No button should be selected
    const buttons = screen.getAllByRole('radio')
    buttons.forEach((button) => {
      expect(button).toHaveAttribute('aria-checked', 'false')
    })
  })

  it('first button has tabIndex={0} when no selection (value=0) for keyboard accessibility', () => {
    render(<EmojiRatingSelector id="rating" value={0} onChange={() => {}} />)

    const button1 = screen.getByLabelText('Rate 1 out of 5: Very Negative')
    const button2 = screen.getByLabelText('Rate 2 out of 5: Negative')
    const button3 = screen.getByLabelText('Rate 3 out of 5: Neutral')

    // First button should be keyboard-accessible (tabIndex=0)
    expect(button1).toHaveAttribute('tabIndex', '0')
    // All other buttons should have tabIndex=-1
    expect(button2).toHaveAttribute('tabIndex', '-1')
    expect(button3).toHaveAttribute('tabIndex', '-1')
  })

  it('handles negative value (invalid rating)', () => {
    render(<EmojiRatingSelector id="rating" value={-1} onChange={() => {}} />)

    // No button should be selected
    const buttons = screen.getAllByRole('radio')
    buttons.forEach((button) => {
      expect(button).toHaveAttribute('aria-checked', 'false')
    })

    // First button should still be keyboard-accessible
    const button1 = screen.getByLabelText('Rate 1 out of 5: Very Negative')
    expect(button1).toHaveAttribute('tabIndex', '0')
  })

  it('handles value > 5 (invalid rating)', () => {
    render(<EmojiRatingSelector id="rating" value={10} onChange={() => {}} />)

    // No button should be selected
    const buttons = screen.getAllByRole('radio')
    buttons.forEach((button) => {
      expect(button).toHaveAttribute('aria-checked', 'false')
    })

    // First button should still be keyboard-accessible
    const button1 = screen.getByLabelText('Rate 1 out of 5: Very Negative')
    expect(button1).toHaveAttribute('tabIndex', '0')
  })

  it('handles decimal value by rounding to nearest integer', () => {
    render(<EmojiRatingSelector id="rating" value={3.7} onChange={() => {}} />)

    // Should select rating 4 (rounded from 3.7)
    const button4 = screen.getByLabelText('Rate 4 out of 5: Positive')
    expect(button4).toHaveAttribute('aria-checked', 'true')
  })
})
