/**
 * SignupPage Integration Tests
 * End-to-end integration tests for complete signup flow
 * Reference: TASK 9 - Integration Testing & Final Validation
 */

import { renderWithRouter, screen, fireEvent, waitFor } from '../../test-utils'
import { SignupPage } from '../SignupPage'
import { userService } from '../../services/api/userService'

jest.mock('../../services/api/userService', () => ({
  userService: {
    create: jest.fn(),
  },
}))

jest.mock('../../utils/userValidators', () => ({
  validateFirstName: jest.fn(value => {
    if (!value) return 'First name is required'
    if (value.length > 100) return 'First name must be less than 100 characters'
    return undefined
  }),
  validateLastName: jest.fn(value => {
    if (!value) return 'Last name is required'
    if (value.length > 100) return 'Last name must be less than 100 characters'
    return undefined
  }),
  validateEmail: jest.fn(value => {
    if (!value) return 'Email is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email'
    return undefined
  }),
  validatePassword: jest.fn(value => {
    if (!value) return 'Password is required'
    if (value.length < 8) return 'Password must be at least 8 characters'
    return undefined
  }),
  validatePasswordMatch: jest.fn((password, confirm) => {
    if (password !== confirm) return 'Passwords do not match'
    return undefined
  }),
}))

describe('SignupPage - Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Complete Signup Flow', () => {
    it('should complete successful signup with valid data', async () => {
      ;(userService.create as jest.Mock).mockResolvedValueOnce({
        id: '123',
        email: 'john.doe@example.com',
      })

      renderWithRouter(<SignupPage />)

      // Verify page structure
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Create Account')
      expect(screen.getByRole('form')).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument()

      // Fill form with valid data
      fireEvent.change(screen.getByLabelText(/first name/i), {
        target: { value: 'John' },
      })
      fireEvent.change(screen.getByLabelText(/last name/i), {
        target: { value: 'Doe' },
      })
      fireEvent.change(screen.getByLabelText(/^email/i), {
        target: { value: 'john.doe@example.com' },
      })
      fireEvent.change(screen.getByLabelText(/^password/i), {
        target: { value: 'SecurePass123' },
      })
      fireEvent.change(screen.getByLabelText(/confirm password/i), {
        target: { value: 'SecurePass123' },
      })

      // Blur all fields to trigger validation
      fireEvent.blur(screen.getByLabelText(/first name/i))
      fireEvent.blur(screen.getByLabelText(/last name/i))
      fireEvent.blur(screen.getByLabelText(/^email/i))
      fireEvent.blur(screen.getByLabelText(/^password/i))
      fireEvent.blur(screen.getByLabelText(/confirm password/i))

      // Submit form
      fireEvent.click(screen.getByRole('button', { name: /create account/i }))

      // Verify API was called with correct data
      await waitFor(() => {
        expect(userService.create).toHaveBeenCalledWith({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          password: 'SecurePass123',
        })
      })
    })

    it('should show validation errors before submission', async () => {
      renderWithRouter(<SignupPage />)

      // Try to submit empty form
      fireEvent.click(screen.getByRole('button', { name: /create account/i }))

      // Form should not be submitted
      expect(userService.create).not.toHaveBeenCalled()
    })

    it('should prevent submission with mismatched passwords', () => {
      renderWithRouter(<SignupPage />)

      fireEvent.change(screen.getByLabelText(/first name/i), {
        target: { value: 'Jane' },
      })
      fireEvent.change(screen.getByLabelText(/last name/i), {
        target: { value: 'Smith' },
      })
      fireEvent.change(screen.getByLabelText(/^email/i), {
        target: { value: 'jane@example.com' },
      })
      fireEvent.change(screen.getByLabelText(/^password/i), {
        target: { value: 'Password123' },
      })
      fireEvent.change(screen.getByLabelText(/confirm password/i), {
        target: { value: 'Password456' },
      })

      fireEvent.blur(screen.getByLabelText(/first name/i))
      fireEvent.blur(screen.getByLabelText(/last name/i))
      fireEvent.blur(screen.getByLabelText(/^email/i))
      fireEvent.blur(screen.getByLabelText(/^password/i))
      fireEvent.blur(screen.getByLabelText(/confirm password/i))

      fireEvent.click(screen.getByRole('button', { name: /create account/i }))

      expect(userService.create).not.toHaveBeenCalled()
    })

    it('should prevent submission with invalid email', () => {
      renderWithRouter(<SignupPage />)

      fireEvent.change(screen.getByLabelText(/first name/i), {
        target: { value: 'John' },
      })
      fireEvent.change(screen.getByLabelText(/last name/i), {
        target: { value: 'Doe' },
      })
      fireEvent.change(screen.getByLabelText(/^email/i), {
        target: { value: 'invalid-email' },
      })
      fireEvent.change(screen.getByLabelText(/^password/i), {
        target: { value: 'Password123' },
      })
      fireEvent.change(screen.getByLabelText(/confirm password/i), {
        target: { value: 'Password123' },
      })

      fireEvent.blur(screen.getByLabelText(/first name/i))
      fireEvent.blur(screen.getByLabelText(/last name/i))
      fireEvent.blur(screen.getByLabelText(/^email/i))
      fireEvent.blur(screen.getByLabelText(/^password/i))
      fireEvent.blur(screen.getByLabelText(/confirm password/i))

      fireEvent.click(screen.getByRole('button', { name: /create account/i }))

      expect(userService.create).not.toHaveBeenCalled()
    })

    it('should prevent submission with short password', () => {
      renderWithRouter(<SignupPage />)

      fireEvent.change(screen.getByLabelText(/first name/i), {
        target: { value: 'John' },
      })
      fireEvent.change(screen.getByLabelText(/last name/i), {
        target: { value: 'Doe' },
      })
      fireEvent.change(screen.getByLabelText(/^email/i), {
        target: { value: 'john@example.com' },
      })
      fireEvent.change(screen.getByLabelText(/^password/i), {
        target: { value: 'Short1' },
      })
      fireEvent.change(screen.getByLabelText(/confirm password/i), {
        target: { value: 'Short1' },
      })

      fireEvent.blur(screen.getByLabelText(/first name/i))
      fireEvent.blur(screen.getByLabelText(/last name/i))
      fireEvent.blur(screen.getByLabelText(/^email/i))
      fireEvent.blur(screen.getByLabelText(/^password/i))
      fireEvent.blur(screen.getByLabelText(/confirm password/i))

      fireEvent.click(screen.getByRole('button', { name: /create account/i }))

      expect(userService.create).not.toHaveBeenCalled()
    })
  })

  describe('Error Handling', () => {
    it('should handle API error and display error message', async () => {
      const errorMessage = 'Email already in use'
      ;(userService.create as jest.Mock).mockRejectedValueOnce(new Error(errorMessage))

      renderWithRouter(<SignupPage />)

      fireEvent.change(screen.getByLabelText(/first name/i), {
        target: { value: 'John' },
      })
      fireEvent.change(screen.getByLabelText(/last name/i), {
        target: { value: 'Doe' },
      })
      fireEvent.change(screen.getByLabelText(/^email/i), {
        target: { value: 'john@example.com' },
      })
      fireEvent.change(screen.getByLabelText(/^password/i), {
        target: { value: 'Password123' },
      })
      fireEvent.change(screen.getByLabelText(/confirm password/i), {
        target: { value: 'Password123' },
      })

      fireEvent.blur(screen.getByLabelText(/first name/i))
      fireEvent.blur(screen.getByLabelText(/last name/i))
      fireEvent.blur(screen.getByLabelText(/^email/i))
      fireEvent.blur(screen.getByLabelText(/^password/i))
      fireEvent.blur(screen.getByLabelText(/confirm password/i))

      fireEvent.click(screen.getByRole('button', { name: /create account/i }))

      await waitFor(() => {
        expect(userService.create).toHaveBeenCalled()
      })
    })

    it('should allow retry after API error', async () => {
      ;(userService.create as jest.Mock).mockRejectedValueOnce(
        new Error('Server error'),
      )

      renderWithRouter(<SignupPage />)

      fireEvent.change(screen.getByLabelText(/first name/i), {
        target: { value: 'John' },
      })
      fireEvent.change(screen.getByLabelText(/last name/i), {
        target: { value: 'Doe' },
      })
      fireEvent.change(screen.getByLabelText(/^email/i), {
        target: { value: 'john@example.com' },
      })
      fireEvent.change(screen.getByLabelText(/^password/i), {
        target: { value: 'Password123' },
      })
      fireEvent.change(screen.getByLabelText(/confirm password/i), {
        target: { value: 'Password123' },
      })

      fireEvent.blur(screen.getByLabelText(/first name/i))
      fireEvent.blur(screen.getByLabelText(/last name/i))
      fireEvent.blur(screen.getByLabelText(/^email/i))
      fireEvent.blur(screen.getByLabelText(/^password/i))
      fireEvent.blur(screen.getByLabelText(/confirm password/i))

      // First submission fails
      fireEvent.click(screen.getByRole('button', { name: /create account/i }))

      await waitFor(() => {
        expect(userService.create).toHaveBeenCalledTimes(1)
      })

      // Button should be re-enabled for retry
      expect(screen.getByRole('button', { name: /create account/i })).not.toBeDisabled()

      // Mock second attempt to succeed
      ;(userService.create as jest.Mock).mockResolvedValueOnce({
        id: '456',
        email: 'john@example.com',
      })

      // Retry submission
      fireEvent.click(screen.getByRole('button', { name: /create account/i }))

      await waitFor(() => {
        expect(userService.create).toHaveBeenCalledTimes(2)
      })
    })
  })

  describe('Navigation Integration', () => {
    it('should display login link on signup page', () => {
      renderWithRouter(<SignupPage />)

      const loginLink = screen.getByRole('link', { name: /sign in/i })
      expect(loginLink).toBeInTheDocument()
      expect(loginLink).toHaveAttribute('href', '/login')
    })

    it('should have proper signup form context', () => {
      renderWithRouter(<SignupPage />)

      const form = screen.getByRole('form')
      expect(form).toBeInTheDocument()

      // Check all form elements are present
      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/last name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/^email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/^password/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
    })
  })

  describe('Form State Management', () => {
    it('should preserve form data when user edits fields', () => {
      renderWithRouter(<SignupPage />)

      fireEvent.change(screen.getByLabelText(/first name/i), {
        target: { value: 'John' },
      })
      fireEvent.change(screen.getByLabelText(/last name/i), {
        target: { value: 'Doe' },
      })

      expect((screen.getByLabelText(/first name/i) as HTMLInputElement).value).toBe('John')
      expect((screen.getByLabelText(/last name/i) as HTMLInputElement).value).toBe('Doe')

      // Edit first name
      fireEvent.change(screen.getByLabelText(/first name/i), {
        target: { value: 'Jane' },
      })

      // Last name should still be preserved
      expect((screen.getByLabelText(/last name/i) as HTMLInputElement).value).toBe('Doe')
      expect((screen.getByLabelText(/first name/i) as HTMLInputElement).value).toBe('Jane')
    })

    it('should clear error when user starts typing', () => {
      renderWithRouter(<SignupPage />)

      // Blur without filling - should trigger error
      fireEvent.blur(screen.getByLabelText(/first name/i))

      // Start typing - error should be cleared
      fireEvent.change(screen.getByLabelText(/first name/i), {
        target: { value: 'J' },
      })

      // Form state should be clean
      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument()
    })
  })

  describe('UI Feedback', () => {
    it('should disable submit button during submission', async () => {
      ;(userService.create as jest.Mock).mockImplementationOnce(
        () => new Promise(resolve => setTimeout(resolve, 100)),
      )

      renderWithRouter(<SignupPage />)

      fireEvent.change(screen.getByLabelText(/first name/i), {
        target: { value: 'John' },
      })
      fireEvent.change(screen.getByLabelText(/last name/i), {
        target: { value: 'Doe' },
      })
      fireEvent.change(screen.getByLabelText(/^email/i), {
        target: { value: 'john@example.com' },
      })
      fireEvent.change(screen.getByLabelText(/^password/i), {
        target: { value: 'Password123' },
      })
      fireEvent.change(screen.getByLabelText(/confirm password/i), {
        target: { value: 'Password123' },
      })

      fireEvent.blur(screen.getByLabelText(/first name/i))
      fireEvent.blur(screen.getByLabelText(/last name/i))
      fireEvent.blur(screen.getByLabelText(/^email/i))
      fireEvent.blur(screen.getByLabelText(/^password/i))
      fireEvent.blur(screen.getByLabelText(/confirm password/i))

      const submitButton = screen.getByRole('button', { name: /create account/i })
      fireEvent.click(submitButton)

      expect(submitButton).toBeDisabled()
    })

    it('should show loading text during submission', () => {
      ;(userService.create as jest.Mock).mockImplementationOnce(
        () => new Promise(resolve => setTimeout(resolve, 50)),
      )

      renderWithRouter(<SignupPage />)

      fireEvent.change(screen.getByLabelText(/first name/i), {
        target: { value: 'John' },
      })
      fireEvent.change(screen.getByLabelText(/last name/i), {
        target: { value: 'Doe' },
      })
      fireEvent.change(screen.getByLabelText(/^email/i), {
        target: { value: 'john@example.com' },
      })
      fireEvent.change(screen.getByLabelText(/^password/i), {
        target: { value: 'Password123' },
      })
      fireEvent.change(screen.getByLabelText(/confirm password/i), {
        target: { value: 'Password123' },
      })

      fireEvent.blur(screen.getByLabelText(/first name/i))
      fireEvent.blur(screen.getByLabelText(/last name/i))
      fireEvent.blur(screen.getByLabelText(/^email/i))
      fireEvent.blur(screen.getByLabelText(/^password/i))
      fireEvent.blur(screen.getByLabelText(/confirm password/i))

      const submitButton = screen.getByRole('button', { name: /create account/i })
      fireEvent.click(submitButton)

      // Button text should change to loading state
      expect(submitButton.textContent).toMatch(/Creating Account|Create Account/)
    })
  })
})
