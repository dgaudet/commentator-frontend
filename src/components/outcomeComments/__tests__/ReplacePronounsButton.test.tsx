/**
 * ReplacePronounsButton Component Tests
 *
 * Tests for the reusable ReplacePronounsButton component.
 * Ensures the button and message display work correctly with various prop combinations.
 */

import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from '../../../contexts/ThemeContext'
import { ReplacePronounsButton } from '../ReplacePronounsButton'
import { spacing } from '../../../theme/tokens'
import type { ReplacePronounsMessage } from '../../../hooks/useReplacePronounsButton'

describe('ReplacePronounsButton Component', () => {
  const mockOnReplace = jest.fn()
  const mockGetMessageBoxStyle = (type: string): React.CSSProperties => ({
    padding: spacing.md,
    backgroundColor: type === 'success' ? '#e8f5e9' : type === 'error' ? '#ffebee' : '#e3f2fd',
    color: type === 'success' ? '#2e7d32' : type === 'error' ? '#c62828' : '#1565c0',
    marginTop: spacing.md,
    marginBottom: spacing.md,
    borderRadius: spacing.sm,
    fontSize: '0.875rem',
    border: '1px solid',
    borderColor: type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3',
  })

  const renderComponent = (props: Partial<React.ComponentProps<typeof ReplacePronounsButton>> = {}) => {
    const defaultProps = {
      isLoading: false,
      message: null,
      onReplace: mockOnReplace,
      getMessageBoxStyle: mockGetMessageBoxStyle,
      disabled: false,
      title: 'Replace pronouns with placeholders',
      ...props,
    }

    return render(
      <ThemeProvider>
        <ReplacePronounsButton {...defaultProps} />
      </ThemeProvider>,
    )
  }

  beforeEach(() => {
    mockOnReplace.mockClear()
  })

  describe('Button Rendering', () => {
    it('should render the button with default text', () => {
      renderComponent()

      const button = screen.getByRole('button', {
        name: /Replace Pronouns with Placeholders/i,
      })
      expect(button).toBeInTheDocument()
    })

    it('should show loading text when isLoading is true', () => {
      renderComponent({ isLoading: true })

      const button = screen.getByRole('button', {
        name: /Replacing/i,
      })
      expect(button).toBeInTheDocument()
    })

    it('should be disabled when disabled prop is true', () => {
      renderComponent({ disabled: true })

      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
    })

    it('should not be disabled when disabled prop is false', () => {
      renderComponent({ disabled: false })

      const button = screen.getByRole('button')
      expect(button).not.toBeDisabled()
    })

    it('should have correct title attribute', () => {
      const customTitle = 'No pronouns configured'
      renderComponent({ title: customTitle })

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('title', customTitle)
    })

    it('should call onReplace when button is clicked', () => {
      renderComponent()

      const button = screen.getByRole('button')
      fireEvent.click(button)

      expect(mockOnReplace).toHaveBeenCalledTimes(1)
    })
  })

  describe('Message Display', () => {
    it('should not display message when message prop is null', () => {
      renderComponent({ message: null })

      const message = screen.queryByText(/Replaced|No pronouns|Please enter/)
      expect(message).not.toBeInTheDocument()
    })

    it('should display success message', () => {
      const successMessage: ReplacePronounsMessage = {
        type: 'success',
        text: 'Replaced 2 pronouns',
      }

      renderComponent({ message: successMessage })

      expect(screen.getByText('Replaced 2 pronouns')).toBeInTheDocument()
    })

    it('should display error message with alert role', () => {
      const errorMessage: ReplacePronounsMessage = {
        type: 'error',
        text: 'Failed to replace pronouns',
      }

      renderComponent({ message: errorMessage })

      const messageElement = screen.getByRole('alert')
      expect(messageElement).toHaveTextContent('Failed to replace pronouns')
    })

    it('should display info message without alert role', () => {
      const infoMessage: ReplacePronounsMessage = {
        type: 'info',
        text: 'No pronouns found in text',
      }

      renderComponent({ message: infoMessage })

      expect(screen.getByText('No pronouns found in text')).toBeInTheDocument()
      const messageElement = screen.queryByRole('alert')
      expect(messageElement).not.toBeInTheDocument()
    })

    it('should apply message box style with correct color for success', () => {
      const successMessage: ReplacePronounsMessage = {
        type: 'success',
        text: 'Success',
      }

      renderComponent({ message: successMessage })

      const messageBox = screen.getByText('Success')
      expect(messageBox).toHaveStyle({ backgroundColor: 'rgb(232, 245, 233)' })
    })

    it('should apply message box style with correct color for error', () => {
      const errorMessage: ReplacePronounsMessage = {
        type: 'error',
        text: 'Error',
      }

      renderComponent({ message: errorMessage })

      const messageBox = screen.getByRole('alert')
      expect(messageBox).toHaveStyle({ backgroundColor: 'rgb(255, 235, 238)' })
    })
  })

  describe('Layout and Styling', () => {
    it('should render button and message in flex layout', () => {
      const message: ReplacePronounsMessage = {
        type: 'success',
        text: 'Replaced 1 pronoun',
      }

      const { container } = renderComponent({ message })

      const flexContainer = container.querySelector('div')
      expect(flexContainer).toHaveStyle({
        display: 'flex',
        alignItems: 'center',
      })
    })

    it('should have proper spacing between button and message', () => {
      const message: ReplacePronounsMessage = {
        type: 'info',
        text: 'Info message',
      }

      const { container } = renderComponent({ message })

      const flexContainer = container.querySelector('div')
      expect(flexContainer).toHaveStyle({
        gap: spacing.md,
      })
    })

    it('should have negative top margin for close positioning', () => {
      const { container } = renderComponent()

      const flexContainer = container.querySelector('div')
      expect(flexContainer).toHaveStyle({
        marginTop: '-1.5rem',
      })
    })
  })

  describe('Accessibility', () => {
    it('should have accessible button name', () => {
      renderComponent()

      const button = screen.getByRole('button')
      expect(button).toHaveAccessibleName()
    })

    it('should have title attribute for hover information', () => {
      renderComponent({ title: 'Custom title' })

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('title')
    })

    it('should use alert role for error messages', () => {
      const errorMessage: ReplacePronounsMessage = {
        type: 'error',
        text: 'Error message',
      }

      renderComponent({ message: errorMessage })

      const alert = screen.getByRole('alert')
      expect(alert).toBeInTheDocument()
    })

    it('should not use alert role for success messages', () => {
      const successMessage: ReplacePronounsMessage = {
        type: 'success',
        text: 'Success message',
      }

      renderComponent({ message: successMessage })

      const alert = screen.queryByRole('alert')
      expect(alert).not.toBeInTheDocument()
    })

    it('should use status role for success messages to announce to screen readers', () => {
      const successMessage: ReplacePronounsMessage = {
        type: 'success',
        text: 'Success message',
      }

      renderComponent({ message: successMessage })

      const status = screen.getByRole('status')
      expect(status).toHaveTextContent('Success message')
    })

    it('should use status role for info messages to announce to screen readers', () => {
      const infoMessage: ReplacePronounsMessage = {
        type: 'info',
        text: 'Info message',
      }

      renderComponent({ message: infoMessage })

      const status = screen.getByRole('status')
      expect(status).toHaveTextContent('Info message')
    })
  })

  describe('Pronouns Loading State', () => {
    it('should show loading spinner when pronounsLoading is true', () => {
      renderComponent({ pronounsLoading: true })

      const spinner = screen.getByTestId('pronouns-loading-spinner')
      expect(spinner).toBeInTheDocument()
    })

    it('should not show button when pronounsLoading is true', () => {
      renderComponent({ pronounsLoading: true })

      const button = screen.queryByRole('button')
      expect(button).not.toBeInTheDocument()
    })

    it('should not show message when pronounsLoading is true', () => {
      const message: ReplacePronounsMessage = {
        type: 'success',
        text: 'Success',
      }

      renderComponent({ pronounsLoading: true, message })

      expect(screen.queryByText('Success')).not.toBeInTheDocument()
    })

    it('should show button when pronounsLoading is false', () => {
      renderComponent({ pronounsLoading: false })

      const button = screen.getByRole('button', {
        name: /Replace Pronouns with Placeholders/i,
      })
      expect(button).toBeInTheDocument()
    })
  })
})
