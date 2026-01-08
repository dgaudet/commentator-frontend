/**
 * RatingFilterSelector Component Tests
 *
 * Tests for the composite RatingFilterSelector component that combines
 * EmojiRatingSelector with a clear filter button.
 *
 * Reference: US-FILTER-001
 */

import { render, screen, fireEvent, waitFor } from '../../../test-utils'
import { RatingFilterSelector } from '../RatingFilterSelector'

describe('RatingFilterSelector Component', () => {
  const defaultProps = {
    id: 'test-rating-filter',
    value: 0,
    onChange: jest.fn(),
    label: 'Filter Personalized Comments by Rating',
    disabled: false,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render the component with label', () => {
      render(<RatingFilterSelector {...defaultProps} />)

      expect(screen.getByText('Filter Personalized Comments by Rating')).toBeInTheDocument()
      expect(screen.getByRole('radiogroup')).toBeInTheDocument()
    })

    it('should render 5 rating buttons', () => {
      render(<RatingFilterSelector {...defaultProps} />)

      const radioButtons = screen.getByRole('radiogroup').querySelectorAll('[role="radio"]')
      expect(radioButtons).toHaveLength(5)
    })

    it('should render without label when label prop is not provided', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { label, ...propsWithoutLabel } = defaultProps
      render(<RatingFilterSelector {...propsWithoutLabel} />)

      expect(screen.queryByText('Filter Personalized Comments by Rating')).not.toBeInTheDocument()
      expect(screen.getByRole('radiogroup')).toBeInTheDocument()
    })

    it('should not render clear button initially when no rating selected', () => {
      render(<RatingFilterSelector {...defaultProps} value={0} />)

      expect(screen.queryByText(/clear filter/i)).not.toBeInTheDocument()
    })

    it('should render clear button when rating is selected', async () => {
      const onChange = jest.fn()
      render(<RatingFilterSelector {...defaultProps} value={3} onChange={onChange} />)

      await waitFor(() => {
        expect(screen.getByText(/clear filter/i)).toBeInTheDocument()
      })
    })
  })

  describe('Rating Selection', () => {
    it('should call onChange with correct rating when button is clicked', async () => {
      const onChange = jest.fn()
      render(<RatingFilterSelector {...defaultProps} onChange={onChange} />)

      const radioButtons = screen.getByRole('radiogroup').querySelectorAll('[role="radio"]')

      fireEvent.click(radioButtons[2]) // rating 3

      expect(onChange).toHaveBeenCalledWith(3)
    })

    it('should display selected rating with correct visual state', async () => {
      render(<RatingFilterSelector {...defaultProps} value={4} />)

      const radioButtons = screen.getByRole('radiogroup').querySelectorAll('[role="radio"]')

      await waitFor(() => {
        expect(radioButtons[3]).toHaveAttribute('aria-checked', 'true') // rating 4
        expect(radioButtons[0]).toHaveAttribute('aria-checked', 'false')
      })
    })

    it('should support all rating levels (1-5)', async () => {
      const onChange = jest.fn()
      const { rerender } = render(<RatingFilterSelector {...defaultProps} onChange={onChange} />)

      const radioGroup = screen.getByRole('radiogroup')
      const radioButtons = radioGroup.querySelectorAll('[role="radio"]')

      for (let i = 0; i < 5; i++) {
        fireEvent.click(radioButtons[i])
        expect(onChange).toHaveBeenCalledWith(i + 1)

        // Rerender with new value to show selection
        rerender(
          <RatingFilterSelector
            {...defaultProps}
            value={i + 1}
            onChange={onChange}
          />,
        )

        // Verify the rating is displayed as selected
        const updatedButtons = screen.getByRole('radiogroup').querySelectorAll('[role="radio"]')
        expect(updatedButtons[i]).toHaveAttribute('aria-checked', 'true')
      }
    })
  })

  describe('Clear Filter Button', () => {
    it('should show clear button when value is greater than 0', async () => {
      render(<RatingFilterSelector {...defaultProps} value={2} />)

      await waitFor(() => {
        expect(screen.getByText(/clear filter/i)).toBeInTheDocument()
      })
    })

    it('should hide clear button when value is 0', () => {
      render(<RatingFilterSelector {...defaultProps} value={0} />)

      expect(screen.queryByText(/clear filter/i)).not.toBeInTheDocument()
    })

    it('should call onChange with 0 when clear button is clicked', async () => {
      const onChange = jest.fn()
      render(<RatingFilterSelector {...defaultProps} value={5} onChange={onChange} />)

      const clearButton = screen.getByText(/clear filter/i)
      fireEvent.click(clearButton)

      expect(onChange).toHaveBeenCalledWith(0)
    })

    it('should hide clear button after clearing rating', async () => {
      const onChange = jest.fn()
      const { rerender } = render(
        <RatingFilterSelector {...defaultProps} value={3} onChange={onChange} />,
      )

      // Clear button should be visible
      await waitFor(() => {
        expect(screen.getByText(/clear filter/i)).toBeInTheDocument()
      })

      // Click clear button
      const clearButton = screen.getByText(/clear filter/i)
      fireEvent.click(clearButton)

      // Rerender with cleared value
      rerender(<RatingFilterSelector {...defaultProps} value={0} onChange={onChange} />)

      // Clear button should be hidden
      await waitFor(() => {
        expect(screen.queryByText(/clear filter/i)).not.toBeInTheDocument()
      })
    })

    it('should have proper aria-label for accessibility', async () => {
      render(<RatingFilterSelector {...defaultProps} value={2} />)

      await waitFor(() => {
        const clearButton = screen.getByRole('button', { name: /clear/i })
        expect(clearButton).toHaveAttribute('aria-label', 'Clear rating filter')
      })
    })
  })

  describe('Disabled State', () => {
    it('should disable rating buttons when disabled prop is true', async () => {
      render(<RatingFilterSelector {...defaultProps} disabled={true} />)

      const radioButtons = screen.getByRole('radiogroup').querySelectorAll('[role="radio"]')
      radioButtons.forEach((btn) => {
        expect(btn).toBeDisabled()
      })
    })

    it('should disable clear button when disabled prop is true', async () => {
      render(<RatingFilterSelector {...defaultProps} value={3} disabled={true} />)

      await waitFor(() => {
        const clearButton = screen.getByText(/clear filter/i)
        expect(clearButton).toBeDisabled()
      })
    })

    it('should not call onChange when disabled and rating button clicked', () => {
      const onChange = jest.fn()
      render(<RatingFilterSelector {...defaultProps} onChange={onChange} disabled={true} />)

      const radioButtons = screen.getByRole('radiogroup').querySelectorAll('[role="radio"]')
      fireEvent.click(radioButtons[2])

      // onChange should not be called (button is disabled)
      expect(onChange).not.toHaveBeenCalled()
    })

    it('should apply opacity style when disabled', async () => {
      render(<RatingFilterSelector {...defaultProps} value={2} disabled={true} />)

      await waitFor(() => {
        const clearButton = screen.getByText(/clear filter/i)
        expect(clearButton).toHaveStyle('opacity: 0.5')
      })
    })
  })

  describe('Styling and Theme Integration', () => {
    it('should render with proper button styling', async () => {
      render(<RatingFilterSelector {...defaultProps} value={1} />)

      await waitFor(() => {
        const clearButton = screen.getByText(/clear filter/i)

        // Check button has transparent background
        expect(clearButton).toHaveStyle('backgroundColor: transparent')

        // Check button has border with solid style
        const borderStyle = clearButton.style.border
        expect(borderStyle).toContain('solid')
      })
    })

    it('should change style on mouse enter', async () => {
      render(<RatingFilterSelector {...defaultProps} value={2} />)

      await waitFor(() => {
        const clearButton = screen.getByText(/clear filter/i)

        fireEvent.mouseEnter(clearButton)

        // Background should change on hover
        expect(clearButton.style.backgroundColor).not.toBe('transparent')
      })
    })

    it('should restore style on mouse leave', async () => {
      render(<RatingFilterSelector {...defaultProps} value={2} />)

      await waitFor(() => {
        const clearButton = screen.getByText(/clear filter/i)

        fireEvent.mouseEnter(clearButton)
        fireEvent.mouseLeave(clearButton)

        // Background should be transparent again
        expect(clearButton.style.backgroundColor).toBe('transparent')
      })
    })

    it('should not change style on mouse enter when disabled', async () => {
      render(<RatingFilterSelector {...defaultProps} value={2} disabled={true} />)

      await waitFor(() => {
        const clearButton = screen.getByText(/clear filter/i)
        const initialBackgroundColor = clearButton.style.backgroundColor

        fireEvent.mouseEnter(clearButton)

        // Background should not change when disabled
        expect(clearButton.style.backgroundColor).toBe(initialBackgroundColor)
      })
    })
  })

  describe('Keyboard Navigation', () => {
    it('should have rating buttons accessible via tab key', () => {
      render(<RatingFilterSelector {...defaultProps} />)

      const radioButtons = screen.getByRole('radiogroup').querySelectorAll('[role="radio"]')

      // At least one button should have tabIndex >= 0 for keyboard access
      const hasTabbableButton = Array.from(radioButtons).some((btn) => {
        const tabIndex = parseInt(btn.getAttribute('tabIndex') || '-1', 10)
        return tabIndex >= 0
      })

      expect(hasTabbableButton).toBe(true)
    })

    it('should support click interaction for rating selection', async () => {
      const onChange = jest.fn()
      render(<RatingFilterSelector {...defaultProps} onChange={onChange} />)

      const radioButtons = screen.getByRole('radiogroup').querySelectorAll('[role="radio"]')

      // Click the third button (rating 3)
      fireEvent.click(radioButtons[2])

      expect(onChange).toHaveBeenCalledWith(3)
    })
  })

  describe('Accessibility', () => {
    it('should have proper role attributes', () => {
      render(<RatingFilterSelector {...defaultProps} />)

      const radioGroup = screen.getByRole('radiogroup')
      expect(radioGroup).toBeInTheDocument()

      const radioButtons = radioGroup.querySelectorAll('[role="radio"]')
      expect(radioButtons.length).toBeGreaterThan(0)
    })

    it('should have aria-checked attributes on radio buttons', async () => {
      render(<RatingFilterSelector {...defaultProps} value={2} />)

      const radioButtons = screen.getByRole('radiogroup').querySelectorAll('[role="radio"]')

      await waitFor(() => {
        radioButtons.forEach((btn) => {
          expect(btn).toHaveAttribute('aria-checked')
        })
      })
    })

    it('should have descriptive aria-labels on rating buttons', async () => {
      render(<RatingFilterSelector {...defaultProps} />)

      const radioButtons = screen.getByRole('radiogroup').querySelectorAll('[role="radio"]')

      radioButtons.forEach((btn) => {
        expect(btn).toHaveAttribute('aria-label')
        const ariaLabel = btn.getAttribute('aria-label') || ''
        expect(ariaLabel).toMatch(/\d out of 5/)
      })
    })

    it('should be fully keyboard accessible', async () => {
      const onChange = jest.fn()
      const { rerender } = render(<RatingFilterSelector {...defaultProps} onChange={onChange} value={0} />)

      // Rating buttons should be accessible
      const radioButtons = screen.getByRole('radiogroup').querySelectorAll('[role="radio"]')
      expect(radioButtons[0]).toHaveAttribute('tabIndex')

      // Clear button should be accessible when visible
      rerender(<RatingFilterSelector {...defaultProps} onChange={onChange} value={3} />)
      await waitFor(() => {
        const clearButton = screen.getByRole('button', { name: /clear/i })
        expect(clearButton).toBeInTheDocument()
      })
    })
  })

  describe('Integration', () => {
    it('should handle rapid rating changes', async () => {
      const onChange = jest.fn()
      const { rerender } = render(
        <RatingFilterSelector {...defaultProps} onChange={onChange} value={0} />,
      )

      const radioGroup = screen.getByRole('radiogroup')
      const radioButtons = radioGroup.querySelectorAll('[role="radio"]')

      // Rapidly change ratings
      fireEvent.click(radioButtons[0]) // rating 1
      fireEvent.click(radioButtons[2]) // rating 3
      fireEvent.click(radioButtons[4]) // rating 5

      expect(onChange).toHaveBeenNthCalledWith(1, 1)
      expect(onChange).toHaveBeenNthCalledWith(2, 3)
      expect(onChange).toHaveBeenNthCalledWith(3, 5)

      // Rerender with final value
      rerender(
        <RatingFilterSelector {...defaultProps} onChange={onChange} value={5} />,
      )

      // Rating 5 should be selected
      await waitFor(() => {
        const updatedButtons = screen.getByRole('radiogroup').querySelectorAll('[role="radio"]')
        expect(updatedButtons[4]).toHaveAttribute('aria-checked', 'true')
      })
    })

    it('should work as a controlled component', async () => {
      const onChange = jest.fn()
      const { rerender } = render(
        <RatingFilterSelector {...defaultProps} onChange={onChange} value={0} />,
      )

      const radioButtons = screen.getByRole('radiogroup').querySelectorAll('[role="radio"]')

      // Select rating 3
      fireEvent.click(radioButtons[2])
      expect(onChange).toHaveBeenCalledWith(3)

      // Update component with new value
      rerender(
        <RatingFilterSelector {...defaultProps} onChange={onChange} value={3} />,
      )

      // Rating 3 should be visually selected
      await waitFor(() => {
        const updatedButtons = screen.getByRole('radiogroup').querySelectorAll('[role="radio"]')
        expect(updatedButtons[2]).toHaveAttribute('aria-checked', 'true')
      })

      // Click clear button
      const clearButton = screen.getByText(/clear filter/i)
      fireEvent.click(clearButton)
      expect(onChange).toHaveBeenCalledWith(0)

      // Update with cleared value
      rerender(
        <RatingFilterSelector {...defaultProps} onChange={onChange} value={0} />,
      )

      // Clear button should disappear
      await waitFor(() => {
        expect(screen.queryByText(/clear filter/i)).not.toBeInTheDocument()
      })
    })
  })
})
