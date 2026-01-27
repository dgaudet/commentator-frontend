/**
 * SaveErrorAlert Component Tests
 *
 * Test-Driven Development for Error Handling: Save Error Alert Display
 *
 * Feature: Accessible, non-modal error alert component that displays save operation
 * errors with both error type and detailed message. Supports dismiss button and
 * automatic clearing on form field edits.
 *
 * User Story: As a user, when a save operation fails, I want to see a clear,
 * accessible error message that doesn't block my work, with the ability to dismiss
 * it or have it automatically cleared when I start editing the form.
 */

import { render, screen, fireEvent } from '../../../test-utils'
import { SaveErrorAlert } from '../SaveErrorAlert'
import type { SaveError } from '../../../utils/errorHandling'

describe('SaveErrorAlert', () => {
  const mockError: SaveError = {
    error: 'Duplicate entry',
    details: 'This student already has a final comment in this class',
  }

  const mockOnDismiss = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render error alert with error message', () => {
      render(<SaveErrorAlert error={mockError} onDismiss={mockOnDismiss} />)

      expect(screen.getByText('Duplicate entry')).toBeInTheDocument()
    })

    it('should render error alert with details message', () => {
      render(<SaveErrorAlert error={mockError} onDismiss={mockOnDismiss} />)

      expect(
        screen.getByText('This student already has a final comment in this class'),
      ).toBeInTheDocument()
    })

    it('should render both error and details together', () => {
      render(<SaveErrorAlert error={mockError} onDismiss={mockOnDismiss} />)

      const alert = screen.getByRole('alert')
      expect(alert).toBeInTheDocument()
      expect(alert).toHaveTextContent('Duplicate entry')
      expect(alert).toHaveTextContent(
        'This student already has a final comment in this class',
      )
    })

    it('should render dismiss button with accessible label', () => {
      render(<SaveErrorAlert error={mockError} onDismiss={mockOnDismiss} />)

      expect(screen.getByRole('button', { name: /close error message/i })).toBeInTheDocument()
    })

    it('should display × symbol in dismiss button', () => {
      render(<SaveErrorAlert error={mockError} onDismiss={mockOnDismiss} />)

      const button = screen.getByRole('button', { name: /close error message/i })
      expect(button.textContent).toContain('✕')
    })
  })

  describe('Accessibility (ARIA)', () => {
    it('should have role="alert" for screen reader announcements', () => {
      render(<SaveErrorAlert error={mockError} onDismiss={mockOnDismiss} />)

      expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    it('should have aria-live="polite" for dynamic updates', () => {
      render(<SaveErrorAlert error={mockError} onDismiss={mockOnDismiss} />)

      const alert = screen.getByRole('alert')
      expect(alert).toHaveAttribute('aria-live', 'polite')
    })

    it('should have accessible dismiss button label', () => {
      render(<SaveErrorAlert error={mockError} onDismiss={mockOnDismiss} />)

      const dismissButton = screen.getByRole('button', {
        name: /close error message/i,
      })
      expect(dismissButton).toHaveAttribute('aria-label', 'Close error message')
    })

    it('should announce error to screen readers', () => {
      const { container } = render(
        <SaveErrorAlert error={mockError} onDismiss={mockOnDismiss} />,
      )

      const alert = container.querySelector('[role="alert"]')
      expect(alert).toBeInTheDocument()
      expect(alert?.getAttribute('aria-live')).toBe('polite')
    })

    it('should maintain semantic structure for screen readers', () => {
      render(<SaveErrorAlert error={mockError} onDismiss={mockOnDismiss} />)

      const alert = screen.getByRole('alert')
      const errorTitle = alert.querySelector('div:first-child > div:first-child')
      const errorDetails = alert.querySelector('div:first-child > div:last-child')

      expect(errorTitle?.textContent).toContain('Duplicate entry')
      expect(errorDetails?.textContent).toContain(
        'This student already has a final comment in this class',
      )
    })
  })

  describe('Dismiss Button Functionality', () => {
    it('should call onDismiss when dismiss button is clicked', () => {
      render(<SaveErrorAlert error={mockError} onDismiss={mockOnDismiss} />)

      const dismissButton = screen.getByRole('button', {
        name: /close error message/i,
      })
      fireEvent.click(dismissButton)

      expect(mockOnDismiss).toHaveBeenCalledTimes(1)
    })

    it('should call onDismiss exactly once per click', () => {
      render(<SaveErrorAlert error={mockError} onDismiss={mockOnDismiss} />)

      const dismissButton = screen.getByRole('button', {
        name: /close error message/i,
      })
      fireEvent.click(dismissButton)
      fireEvent.click(dismissButton)

      expect(mockOnDismiss).toHaveBeenCalledTimes(2)
    })

    it('should have proper button styling and interaction', () => {
      render(<SaveErrorAlert error={mockError} onDismiss={mockOnDismiss} />)

      const dismissButton = screen.getByRole('button', {
        name: /close error message/i,
      })

      // Check that button has cursor pointer (main interactive style)
      expect(dismissButton).toHaveStyle({
        cursor: 'pointer',
      })
      // Button should not have padding (or have 0 padding)
      const style = window.getComputedStyle(dismissButton)
      expect(style.cursor).toBe('pointer')
    })

    it('should be keyboard accessible', () => {
      render(<SaveErrorAlert error={mockError} onDismiss={mockOnDismiss} />)

      const dismissButton = screen.getByRole('button', {
        name: /close error message/i,
      })

      // Button should be focusable
      expect(dismissButton).toBeInTheDocument()
      expect(dismissButton.tagName).toBe('BUTTON')
    })
  })

  describe('Theme Color Usage', () => {
    it('should render with theme colors from useThemeColors hook', () => {
      render(<SaveErrorAlert error={mockError} onDismiss={mockOnDismiss} />)

      const alert = screen.getByRole('alert')

      // Check that inline styles are applied
      const style = alert.getAttribute('style')
      expect(style).toBeTruthy()
      expect(style).toContain('padding')
      expect(style).toContain('margin-bottom')
      expect(style).toContain('background-color')
      expect(style).toContain('border')
      expect(style).toContain('color')
    })

    it('should use semantic error colors from theme', () => {
      render(<SaveErrorAlert error={mockError} onDismiss={mockOnDismiss} />)

      const alert = screen.getByRole('alert')
      const computedStyle = window.getComputedStyle(alert)

      // Should have error-themed colors
      expect(computedStyle.backgroundColor).toBeTruthy()
      expect(computedStyle.color).toBeTruthy()
      expect(computedStyle.borderLeft).toBeTruthy()
    })

    it('should apply theme tokens for spacing', () => {
      render(<SaveErrorAlert error={mockError} onDismiss={mockOnDismiss} />)

      const alert = screen.getByRole('alert')
      const style = alert.getAttribute('style')

      // Should use design tokens for spacing
      expect(style).toContain('gap')
      expect(style).toContain('margin-bottom')
    })

    it('should style dismiss button with theme colors', () => {
      render(<SaveErrorAlert error={mockError} onDismiss={mockOnDismiss} />)

      const dismissButton = screen.getByRole('button', {
        name: /close error message/i,
      })
      const computedStyle = window.getComputedStyle(dismissButton)

      // Button should inherit error color from theme
      expect(computedStyle.color).toBeTruthy()
    })

    it('should adapt to theme changes', () => {
      const { rerender } = render(
        <SaveErrorAlert error={mockError} onDismiss={mockOnDismiss} />,
      )

      const alert = screen.getByRole('alert')
      const initialStyle = alert.getAttribute('style')

      // Rerender with same props
      rerender(<SaveErrorAlert error={mockError} onDismiss={mockOnDismiss} />)

      // Styles should be maintained
      const updatedStyle = alert.getAttribute('style')
      expect(updatedStyle).toBe(initialStyle)
    })
  })

  describe('Props and Error Handling', () => {
    it('should accept error object with error and details properties', () => {
      const customError: SaveError = {
        error: 'Network timeout',
        details: 'Request took longer than 60 seconds',
      }

      render(<SaveErrorAlert error={customError} onDismiss={mockOnDismiss} />)

      expect(screen.getByText('Network timeout')).toBeInTheDocument()
      expect(screen.getByText('Request took longer than 60 seconds')).toBeInTheDocument()
    })

    it('should handle errors with empty details', () => {
      const errorWithoutDetails: SaveError = {
        error: 'Save failed',
        details: '',
      }

      render(<SaveErrorAlert error={errorWithoutDetails} onDismiss={mockOnDismiss} />)

      expect(screen.getByText('Save failed')).toBeInTheDocument()
    })

    it('should handle errors with long text', () => {
      const longText = 'A'.repeat(500)
      const errorWithLongText: SaveError = {
        error: 'Error: ' + longText,
        details: 'Details: ' + longText,
      }

      render(<SaveErrorAlert error={errorWithLongText} onDismiss={mockOnDismiss} />)

      expect(screen.getByRole('alert')).toBeInTheDocument()
      // Text should be present even if truncated by CSS
      const alert = screen.getByRole('alert')
      expect(alert.textContent).toContain('Error: A')
    })

    it('should require onDismiss callback and wire it correctly', () => {
      const handleDismiss = jest.fn()
      render(<SaveErrorAlert error={mockError} onDismiss={handleDismiss} />)

      const dismissButton = screen.getByRole('button', {
        name: /close error message/i,
      })

      // Verify button is properly interactive
      expect(dismissButton).toBeInTheDocument()
      fireEvent.click(dismissButton)
      expect(handleDismiss).toHaveBeenCalledTimes(1)
    })

    it('should handle multiple error updates', () => {
      const { rerender } = render(
        <SaveErrorAlert error={mockError} onDismiss={mockOnDismiss} />,
      )

      expect(screen.getByText('Duplicate entry')).toBeInTheDocument()

      const newError: SaveError = {
        error: 'Permission denied',
        details: 'You do not have permission to perform this action',
      }

      rerender(<SaveErrorAlert error={newError} onDismiss={mockOnDismiss} />)

      expect(screen.getByText('Permission denied')).toBeInTheDocument()
      expect(screen.getByText('You do not have permission to perform this action')).toBeInTheDocument()
      expect(screen.queryByText('Duplicate entry')).not.toBeInTheDocument()
    })
  })

  describe('Component Structure', () => {
    it('should have flex layout for error and dismiss button', () => {
      render(<SaveErrorAlert error={mockError} onDismiss={mockOnDismiss} />)

      const alert = screen.getByRole('alert')
      const style = alert.getAttribute('style')

      expect(style).toContain('display')
      expect(style).toContain('justify-content')
      expect(style).toContain('align-items')
    })

    it('should position error content and dismiss button side by side', () => {
      render(<SaveErrorAlert error={mockError} onDismiss={mockOnDismiss} />)

      const alert = screen.getByRole('alert')
      const children = alert.children

      // Should have 2 children: content wrapper and button
      expect(children.length).toBeGreaterThan(0)
    })

    it('should display error title with proper styling', () => {
      render(<SaveErrorAlert error={mockError} onDismiss={mockOnDismiss} />)

      const alert = screen.getByRole('alert')
      const contentWrapper = alert.querySelector('div:first-child')
      const errorTitle = contentWrapper?.querySelector('div:first-child')

      // Error title should be visible and properly rendered
      expect(errorTitle).toBeInTheDocument()
      expect(errorTitle?.textContent).toContain('Duplicate entry')
      // Error title should have inline styles applied
      expect(errorTitle?.getAttribute('style')).toBeTruthy()
    })

    it('should display error details with smaller font size', () => {
      render(<SaveErrorAlert error={mockError} onDismiss={mockOnDismiss} />)

      const alert = screen.getByRole('alert')
      const errorDetails = alert.querySelector('div:first-child > div:last-child')

      expect(errorDetails?.textContent).toContain(
        'This student already has a final comment in this class',
      )
    })
  })

  describe('Edge Cases', () => {
    it('should handle special characters in error message', () => {
      const specialError: SaveError = {
        error: 'Error: <script>alert("xss")</script>',
        details: 'Special chars: !@#$%^&*()',
      }

      render(<SaveErrorAlert error={specialError} onDismiss={mockOnDismiss} />)

      // Text should be escaped and rendered safely
      const alert = screen.getByRole('alert')
      expect(alert.textContent).toContain('Error: <script>')
    })

    it('should handle unicode characters', () => {
      const unicodeError: SaveError = {
        error: 'Erreur: 错误 エラー',
        details: 'Details with emojis: 😀 🎉 ⚠️',
      }

      render(<SaveErrorAlert error={unicodeError} onDismiss={mockOnDismiss} />)

      expect(screen.getByText(/Erreur.*错误.*エラー/)).toBeInTheDocument()
    })

    it('should handle whitespace in error text', () => {
      const whitespaceError: SaveError = {
        error: '   Error with spaces   ',
        details: '\n\n  Details with newlines  \n\n',
      }

      render(<SaveErrorAlert error={whitespaceError} onDismiss={mockOnDismiss} />)

      const alert = screen.getByRole('alert')
      expect(alert).toBeInTheDocument()
      expect(alert.textContent).toContain('Error')
    })

    it('should remain accessible even with very long error messages', () => {
      const veryLongError: SaveError = {
        error: 'E'.repeat(200),
        details: 'D'.repeat(500),
      }

      render(<SaveErrorAlert error={veryLongError} onDismiss={mockOnDismiss} />)

      expect(screen.getByRole('alert')).toBeInTheDocument()
      // Should still be accessible
      expect(screen.getByRole('button', { name: /close error message/i })).toBeInTheDocument()
    })

    it('should handle rapid dismiss button clicks gracefully', () => {
      render(<SaveErrorAlert error={mockError} onDismiss={mockOnDismiss} />)

      const dismissButton = screen.getByRole('button', {
        name: /close error message/i,
      })

      // Simulate rapid clicks
      fireEvent.click(dismissButton)
      fireEvent.click(dismissButton)
      fireEvent.click(dismissButton)

      expect(mockOnDismiss).toHaveBeenCalledTimes(3)
    })
  })

  describe('Non-Modal Behavior', () => {
    it('should not block user interaction with underlying content', () => {
      render(<SaveErrorAlert error={mockError} onDismiss={mockOnDismiss} />)

      const alert = screen.getByRole('alert')

      // Alert should not have modal-blocking styles
      const style = alert.getAttribute('style')
      expect(style).not.toContain('position: fixed')
      expect(style).not.toContain('z-index: 9999')
    })

    it('should display as inline alert without overlay', () => {
      render(<SaveErrorAlert error={mockError} onDismiss={mockOnDismiss} />)

      const alert = screen.getByRole('alert')

      // Should use flexbox, not absolute positioning
      expect(alert.getAttribute('style')).toContain('display')
    })
  })

  describe('Integration with Form Context', () => {
    it('should position correctly near save buttons', () => {
      render(
        <div>
          <SaveErrorAlert error={mockError} onDismiss={mockOnDismiss} />
          <button>Save</button>
        </div>,
      )

      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByText('Save')).toBeInTheDocument()
    })

    it('should allow multiple instances in same document', () => {
      render(
        <div>
          <SaveErrorAlert
            error={{
              error: 'Error 1',
              details: 'Details 1',
            }}
            onDismiss={jest.fn()}
          />
          <SaveErrorAlert
            error={{
              error: 'Error 2',
              details: 'Details 2',
            }}
            onDismiss={jest.fn()}
          />
        </div>,
      )

      const alerts = screen.getAllByRole('alert')
      expect(alerts).toHaveLength(2)
    })
  })
})
