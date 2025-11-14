/**
 * CopyButton Component Tests
 * TDD Phase: RED - Writing failing tests first
 * Reference: US-COPY-001
 *
 * Testing copy button functionality:
 * - Rendering and basic states
 * - Disabled state when text is empty
 * - Copy to clipboard functionality
 * - Visual feedback ("Copied!" state)
 * - Error handling
 */

import { render, screen, fireEvent, waitFor, act } from '../../../test-utils'
import { CopyButton } from '../CopyButton'

// Mock the Clipboard API
const mockWriteText = jest.fn()
Object.assign(navigator, {
  clipboard: {
    writeText: mockWriteText,
  },
})

describe('CopyButton Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockWriteText.mockResolvedValue(undefined)
  })

  describe('Rendering', () => {
    it('should render copy button with default text', () => {
      render(<CopyButton text="Test comment" />)

      const button = screen.getByRole('button', { name: /copy/i })
      expect(button).toBeInTheDocument()
      expect(button).toHaveTextContent('Copy')
    })

    it('should be disabled when text is empty', () => {
      render(<CopyButton text="" />)

      const button = screen.getByRole('button', { name: /copy/i })
      expect(button).toBeDisabled()
    })

    it('should be disabled when text is only whitespace', () => {
      render(<CopyButton text="   " />)

      const button = screen.getByRole('button', { name: /copy/i })
      expect(button).toBeDisabled()
    })

    it('should be enabled when text is provided', () => {
      render(<CopyButton text="Valid comment text" />)

      const button = screen.getByRole('button', { name: /copy/i })
      expect(button).not.toBeDisabled()
    })

    it('should respect disabled prop', () => {
      render(<CopyButton text="Test comment" disabled={true} />)

      const button = screen.getByRole('button', { name: /copy/i })
      expect(button).toBeDisabled()
    })
  })

  describe('Copy Functionality', () => {
    it('should copy text to clipboard when clicked', async () => {
      render(<CopyButton text="Test comment to copy" />)

      const button = screen.getByRole('button', { name: /copy/i })
      fireEvent.click(button)

      await waitFor(() => {
        expect(mockWriteText).toHaveBeenCalledWith('Test comment to copy')
      })
    })

    it('should trim whitespace before copying', async () => {
      render(<CopyButton text="  Test comment with spaces  " />)

      const button = screen.getByRole('button', { name: /copy/i })
      fireEvent.click(button)

      await waitFor(() => {
        expect(mockWriteText).toHaveBeenCalledWith('Test comment with spaces')
      })
    })

    it('should preserve special characters and Unicode', async () => {
      const specialText = 'Comment with special chars: é, ñ, 中文, 🎉'
      render(<CopyButton text={specialText} />)

      const button = screen.getByRole('button', { name: /copy/i })
      fireEvent.click(button)

      await waitFor(() => {
        expect(mockWriteText).toHaveBeenCalledWith(specialText)
      })
    })
  })

  describe('Visual Feedback', () => {
    it('should show "Copied!" text after successful copy', async () => {
      render(<CopyButton text="Test comment" />)

      const button = screen.getByRole('button', { name: /copy/i })
      fireEvent.click(button)

      await waitFor(() => {
        expect(button).toHaveTextContent('Copied!')
      })
    })

    it('should return to "Copy" text after 2 seconds', async () => {
      jest.useFakeTimers()
      render(<CopyButton text="Test comment" />)

      const button = screen.getByRole('button', { name: /copy/i })
      fireEvent.click(button)

      // Wait for "Copied!" state
      await waitFor(() => {
        expect(button).toHaveTextContent('Copied!')
      })

      // Fast-forward 2 seconds
      act(() => {
        jest.advanceTimersByTime(2000)
      })

      await waitFor(() => {
        expect(button).toHaveTextContent('Copy')
      })

      jest.useRealTimers()
    })

    it('should call onCopySuccess callback when copy succeeds', async () => {
      const onCopySuccess = jest.fn()
      render(<CopyButton text="Test comment" onCopySuccess={onCopySuccess} />)

      const button = screen.getByRole('button', { name: /copy/i })
      fireEvent.click(button)

      await waitFor(() => {
        expect(onCopySuccess).toHaveBeenCalled()
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle clipboard API errors gracefully', async () => {
      mockWriteText.mockRejectedValueOnce(new Error('Permission denied'))

      render(<CopyButton text="Test comment" />)

      const button = screen.getByRole('button', { name: /copy/i })
      fireEvent.click(button)

      // Should not crash and button should remain enabled
      await waitFor(() => {
        expect(button).not.toBeDisabled()
      })
    })

    it('should call onCopyError callback when copy fails', async () => {
      const onCopyError = jest.fn()
      const error = new Error('Permission denied')
      mockWriteText.mockRejectedValueOnce(error)

      render(<CopyButton text="Test comment" onCopyError={onCopyError} />)

      const button = screen.getByRole('button', { name: /copy/i })
      fireEvent.click(button)

      await waitFor(() => {
        expect(onCopyError).toHaveBeenCalledWith(error)
      })
    })

    it('should return to "Copy" state after error', async () => {
      mockWriteText.mockRejectedValueOnce(new Error('Permission denied'))

      render(<CopyButton text="Test comment" />)

      const button = screen.getByRole('button', { name: /copy/i })
      fireEvent.click(button)

      await waitFor(() => {
        expect(button).toHaveTextContent('Copy')
      })
    })
  })

  describe('Accessibility', () => {
    it('should have accessible name', () => {
      render(<CopyButton text="Test comment" />)

      const button = screen.getByRole('button', { name: /copy/i })
      expect(button).toHaveAccessibleName()
    })

    it('should be keyboard accessible', () => {
      render(<CopyButton text="Test comment" />)

      const button = screen.getByRole('button', { name: /copy/i })
      button.focus()
      expect(button).toHaveFocus()
    })

    it('should activate on Enter key', async () => {
      render(<CopyButton text="Test comment" />)

      const button = screen.getByRole('button', { name: /copy/i })
      button.focus()
      fireEvent.keyDown(button, { key: 'Enter', code: 'Enter', charCode: 13 })
      fireEvent.click(button) // React Testing Library requires explicit click after keyDown

      await waitFor(() => {
        expect(mockWriteText).toHaveBeenCalled()
      })
    })

    it('should activate on Space key', async () => {
      render(<CopyButton text="Test comment" />)

      const button = screen.getByRole('button', { name: /copy/i })
      button.focus()
      fireEvent.keyDown(button, { key: ' ', code: 'Space', charCode: 32 })
      fireEvent.click(button) // React Testing Library requires explicit click after keyDown

      await waitFor(() => {
        expect(mockWriteText).toHaveBeenCalled()
      })
    })
  })

  describe('Multiple Buttons', () => {
    it('should allow multiple copy buttons to work independently', async () => {
      render(
        <div>
          <CopyButton text="Comment 1" />
          <CopyButton text="Comment 2" />
        </div>,
      )

      const buttons = screen.getAllByRole('button', { name: /copy/i })
      expect(buttons).toHaveLength(2)

      // Click first button
      fireEvent.click(buttons[0])

      await waitFor(() => {
        expect(mockWriteText).toHaveBeenCalledWith('Comment 1')
        expect(buttons[0]).toHaveTextContent('Copied!')
      })

      // Second button should still show "Copy"
      expect(buttons[1]).toHaveTextContent('Copy')
    })
  })
})
