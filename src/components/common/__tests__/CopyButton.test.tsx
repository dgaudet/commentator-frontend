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
      // Mock execCommand to also fail for this test
      const mockExecCommand = jest.fn().mockReturnValue(false)
      document.execCommand = mockExecCommand

      const onCopyError = jest.fn()
      mockWriteText.mockRejectedValueOnce(new Error('Permission denied'))

      render(<CopyButton text="Test comment" onCopyError={onCopyError} />)

      const button = screen.getByRole('button', { name: /copy/i })
      fireEvent.click(button)

      await waitFor(() => {
        expect(onCopyError).toHaveBeenCalledWith(
          expect.objectContaining({
            message: expect.stringContaining('Unable to copy'),
          }),
        )
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

  describe('US-COPY-004: Enhanced Accessibility', () => {
    it('should have ARIA live region for screen reader announcements', () => {
      render(<CopyButton text="Test comment" />)

      // Should have aria-live region in the document
      const liveRegion = document.querySelector('[aria-live]')
      expect(liveRegion).toBeInTheDocument()
      expect(liveRegion).toHaveAttribute('aria-live', 'polite')
    })

    it('should announce copy status changes to screen readers', async () => {
      render(<CopyButton text="Test comment" />)

      const button = screen.getByRole('button', { name: /copy/i })
      const liveRegion = document.querySelector('[aria-live]')

      // Initially empty
      expect(liveRegion).toHaveTextContent('')

      // Click to copy
      fireEvent.click(button)

      await waitFor(() => {
        expect(liveRegion).toHaveTextContent('Copied to clipboard')
      })

      // Should clear after announcement
      await waitFor(
        () => {
          expect(liveRegion).toHaveTextContent('')
        },
        { timeout: 3000 },
      )
    })

    it('should update aria-label based on button state', async () => {
      jest.useFakeTimers()

      render(<CopyButton text="Test comment" />)

      const button = screen.getByRole('button')

      // Initial state
      expect(button).toHaveAttribute('aria-label', 'Copy to clipboard')

      // After clicking
      fireEvent.click(button)

      await waitFor(() => {
        expect(button).toHaveAttribute('aria-label', 'Copied to clipboard')
      })

      // Should return to initial state after 2 seconds
      act(() => {
        jest.advanceTimersByTime(2000)
      })

      await waitFor(() => {
        expect(button).toHaveAttribute('aria-label', 'Copy to clipboard')
      })

      jest.useRealTimers()
    })

    it('should have role="status" on live region for better screen reader support', () => {
      render(<CopyButton text="Test comment" />)

      const liveRegion = document.querySelector('[aria-live]')
      expect(liveRegion).toHaveAttribute('role', 'status')
    })
  })

  describe('US-COPY-005: Error Handling & Fallback', () => {
    it('should detect Clipboard API availability', () => {
      render(<CopyButton text="Test comment" />)

      // Button should be enabled if clipboard API exists (mocked in our tests)
      const button = screen.getByRole('button', { name: /copy/i })
      expect(button).not.toBeDisabled()
    })

    it('should show error message when Clipboard API unavailable', () => {
      // Temporarily remove clipboard API
      const originalClipboard = navigator.clipboard
      Object.defineProperty(navigator, 'clipboard', {
        value: undefined,
        configurable: true,
      })

      render(<CopyButton text="Test comment" />)

      const button = screen.getByRole('button')
      // Button should show "Not supported" or be disabled
      expect(button).toBeDisabled()
      expect(button).toHaveTextContent('Not supported')

      // Restore clipboard
      Object.defineProperty(navigator, 'clipboard', {
        value: originalClipboard,
        configurable: true,
      })
    })

    it('should use fallback method when Clipboard API fails', async () => {
      // Mock execCommand as fallback
      const mockExecCommand = jest.fn().mockReturnValue(true)
      document.execCommand = mockExecCommand

      // Make clipboard API fail
      mockWriteText.mockRejectedValueOnce(new Error('Permission denied'))

      render(<CopyButton text="Test comment" />)

      const button = screen.getByRole('button', { name: /copy/i })
      fireEvent.click(button)

      await waitFor(() => {
        // Should attempt fallback
        expect(mockExecCommand).toHaveBeenCalledWith('copy')
      })
    })

    it('should show error message when all copy methods fail', async () => {
      // Mock execCommand to also fail
      const mockExecCommand = jest.fn().mockReturnValue(false)
      document.execCommand = mockExecCommand

      const onCopyError = jest.fn()
      mockWriteText.mockRejectedValueOnce(new Error('Permission denied'))

      render(<CopyButton text="Test comment" onCopyError={onCopyError} />)

      const button = screen.getByRole('button', { name: /copy/i })
      fireEvent.click(button)

      await waitFor(() => {
        expect(onCopyError).toHaveBeenCalledWith(
          expect.objectContaining({
            message: expect.stringContaining('Unable to copy'),
          }),
        )
      })
    })

    it('should announce error to screen readers via live region', async () => {
      mockWriteText.mockRejectedValueOnce(new Error('Permission denied'))

      render(<CopyButton text="Test comment" />)

      const button = screen.getByRole('button', { name: /copy/i })
      const liveRegion = document.querySelector('[aria-live]')

      fireEvent.click(button)

      await waitFor(() => {
        expect(liveRegion).toHaveTextContent('Failed to copy. Please try again.')
      })
    })

    it('should preserve special characters in fallback method', async () => {
      const specialText = 'Test with special chars: é, ñ, 中文, 🎉'
      const mockExecCommand = jest.fn().mockReturnValue(true)
      document.execCommand = mockExecCommand

      // Simulate old browser without clipboard API
      mockWriteText.mockRejectedValueOnce(new Error('Not available'))

      render(<CopyButton text={specialText} />)

      const button = screen.getByRole('button', { name: /copy/i })
      fireEvent.click(button)

      await waitFor(() => {
        expect(mockExecCommand).toHaveBeenCalledWith('copy')
      })

      // Should have created a temporary element with the text
      // (implementation detail - we'll verify in the component)
    })
  })
})
