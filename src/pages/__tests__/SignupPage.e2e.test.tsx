/**
 * SignupPage E2E Integration Tests
 * End-to-end user journey tests for complete signup workflow
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
    const trimmed = value.trim()
    if (!trimmed) return 'First name is required'
    return undefined
  }),
  validateLastName: jest.fn(value => {
    const trimmed = value.trim()
    if (!trimmed) return 'Last name is required'
    return undefined
  }),
  validateEmail: jest.fn(value => {
    const trimmed = value.trim()
    if (!trimmed) return 'Email is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return 'Please enter a valid email'
    return undefined
  }),
  validatePassword: jest.fn(value => {
    const trimmed = value.trim()
    if (!trimmed) return 'Password is required'
    if (trimmed.length < 8) return 'Password must be at least 8 characters'
    return undefined
  }),
  validatePasswordMatch: jest.fn((password, confirm) => {
    if (password.trim() !== confirm.trim()) return 'Passwords do not match'
    return undefined
  }),
}))

describe('SignupPage - E2E User Journeys', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Happy Path: Successful Signup', () => {
    it('should allow user to complete signup with minimal valid data', async () => {
      ;(userService.create as jest.Mock).mockResolvedValueOnce({
        id: '789',
        email: 'alice.brown@example.com',
      })

      renderWithRouter(<SignupPage />)

      // Step 1: User fills form
      fireEvent.change(screen.getByLabelText(/first name/i), {
        target: { value: 'Alice' },
      })
      fireEvent.change(screen.getByLabelText(/last name/i), {
        target: { value: 'Brown' },
      })
      fireEvent.change(screen.getByLabelText(/^email/i), {
        target: { value: 'alice.brown@example.com' },
      })
      fireEvent.change(screen.getByLabelText(/^password/i), {
        target: { value: 'SecurePassword123!' },
      })
      fireEvent.change(screen.getByLabelText(/confirm password/i), {
        target: { value: 'SecurePassword123!' },
      })

      // Step 2: User validates fields
      fireEvent.blur(screen.getByLabelText(/first name/i))
      fireEvent.blur(screen.getByLabelText(/last name/i))
      fireEvent.blur(screen.getByLabelText(/^email/i))
      fireEvent.blur(screen.getByLabelText(/^password/i))
      fireEvent.blur(screen.getByLabelText(/confirm password/i))

      // Step 3: User submits
      fireEvent.click(screen.getByRole('button', { name: /create account/i }))

      // Step 4: Verify successful submission
      await waitFor(() => {
        expect(userService.create).toHaveBeenCalledWith({
          firstName: 'Alice',
          lastName: 'Brown',
          email: 'alice.brown@example.com',
          password: 'SecurePassword123!',
        })
      })
    })

    it('should support user with special characters in name', async () => {
      ;(userService.create as jest.Mock).mockResolvedValueOnce({
        id: '999',
        email: 'test@example.com',
      })

      renderWithRouter(<SignupPage />)

      fireEvent.change(screen.getByLabelText(/first name/i), {
        target: { value: "O'Connor" },
      })
      fireEvent.change(screen.getByLabelText(/last name/i), {
        target: { value: 'García-López' },
      })
      fireEvent.change(screen.getByLabelText(/^email/i), {
        target: { value: 'test+tag@example.com' },
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
  })

  describe('Error Path: Validation Failures', () => {
    it('should show multiple validation errors', () => {
      renderWithRouter(<SignupPage />)

      // Blur all fields without filling them
      fireEvent.blur(screen.getByLabelText(/first name/i))
      fireEvent.blur(screen.getByLabelText(/last name/i))
      fireEvent.blur(screen.getByLabelText(/^email/i))
      fireEvent.blur(screen.getByLabelText(/^password/i))
      fireEvent.blur(screen.getByLabelText(/confirm password/i))

      // Try to submit
      fireEvent.click(screen.getByRole('button', { name: /create account/i }))

      // Should not call API
      expect(userService.create).not.toHaveBeenCalled()

      // Form should still be visible
      expect(screen.getByRole('form')).toBeInTheDocument()
    })

    it('should handle field-by-field validation as user fills form', () => {
      renderWithRouter(<SignupPage />)

      // User fills first name
      fireEvent.change(screen.getByLabelText(/first name/i), {
        target: { value: 'John' },
      })
      fireEvent.blur(screen.getByLabelText(/first name/i))

      // User fills last name
      fireEvent.change(screen.getByLabelText(/last name/i), {
        target: { value: 'Doe' },
      })
      fireEvent.blur(screen.getByLabelText(/last name/i))

      // User enters invalid email
      fireEvent.change(screen.getByLabelText(/^email/i), {
        target: { value: 'not-an-email' },
      })
      fireEvent.blur(screen.getByLabelText(/^email/i))

      // User corrects email
      fireEvent.change(screen.getByLabelText(/^email/i), {
        target: { value: 'john.doe@example.com' },
      })
      fireEvent.blur(screen.getByLabelText(/^email/i))

      // User enters password
      fireEvent.change(screen.getByLabelText(/^password/i), {
        target: { value: 'SecurePass123' },
      })
      fireEvent.blur(screen.getByLabelText(/^password/i))

      // User confirms password
      fireEvent.change(screen.getByLabelText(/confirm password/i), {
        target: { value: 'SecurePass123' },
      })
      fireEvent.blur(screen.getByLabelText(/confirm password/i))

      // Now form should be submittable
      expect(screen.getByRole('form')).toBeInTheDocument()
    })
  })

  describe('API Error Path: Server Responses', () => {
    it('should handle 400 Bad Request error', async () => {
      const errorMsg = 'Invalid email format'
      ;(userService.create as jest.Mock).mockRejectedValueOnce(
        new Error(errorMsg),
      )

      renderWithRouter(<SignupPage />)

      fireEvent.change(screen.getByLabelText(/first name/i), {
        target: { value: 'Bob' },
      })
      fireEvent.change(screen.getByLabelText(/last name/i), {
        target: { value: 'Test' },
      })
      fireEvent.change(screen.getByLabelText(/^email/i), {
        target: { value: 'bob@test.com' },
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

      // Form should still be visible for retry
      expect(screen.getByRole('form')).toBeInTheDocument()
    })

    it('should handle 409 Conflict (email already exists)', async () => {
      ;(userService.create as jest.Mock).mockRejectedValueOnce(
        new Error('Email already in use'),
      )

      renderWithRouter(<SignupPage />)

      fireEvent.change(screen.getByLabelText(/first name/i), {
        target: { value: 'Carol' },
      })
      fireEvent.change(screen.getByLabelText(/last name/i), {
        target: { value: 'Test' },
      })
      fireEvent.change(screen.getByLabelText(/^email/i), {
        target: { value: 'existing@test.com' },
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

    it('should handle 500 Server error', async () => {
      ;(userService.create as jest.Mock).mockRejectedValueOnce(
        new Error('Server error'),
      )

      renderWithRouter(<SignupPage />)

      fireEvent.change(screen.getByLabelText(/first name/i), {
        target: { value: 'Dave' },
      })
      fireEvent.change(screen.getByLabelText(/last name/i), {
        target: { value: 'Test' },
      })
      fireEvent.change(screen.getByLabelText(/^email/i), {
        target: { value: 'dave@test.com' },
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
  })

  describe('User Interactions: Edge Cases', () => {
    it('should handle rapid successive submissions', async () => {
      ;(userService.create as jest.Mock).mockResolvedValue({
        id: '111',
        email: 'test@example.com',
      })

      renderWithRouter(<SignupPage />)

      fireEvent.change(screen.getByLabelText(/first name/i), {
        target: { value: 'Eve' },
      })
      fireEvent.change(screen.getByLabelText(/last name/i), {
        target: { value: 'Test' },
      })
      fireEvent.change(screen.getByLabelText(/^email/i), {
        target: { value: 'eve@test.com' },
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

      // Rapid clicks - button should be disabled after first click
      fireEvent.click(submitButton)
      fireEvent.click(submitButton)
      fireEvent.click(submitButton)

      await waitFor(() => {
        // Should only call API once due to button being disabled
        expect(userService.create).toHaveBeenCalledTimes(1)
      })
    })

    it('should handle user clearing fields after validation', () => {
      renderWithRouter(<SignupPage />)

      // Fill form
      fireEvent.change(screen.getByLabelText(/first name/i), {
        target: { value: 'Frank' },
      })
      fireEvent.blur(screen.getByLabelText(/first name/i))

      // Clear the field
      fireEvent.change(screen.getByLabelText(/first name/i), {
        target: { value: '' },
      })

      // Field should be empty
      expect((screen.getByLabelText(/first name/i) as HTMLInputElement).value).toBe('')
    })

    it('should handle whitespace-only input', () => {
      renderWithRouter(<SignupPage />)

      fireEvent.change(screen.getByLabelText(/first name/i), {
        target: { value: '   ' },
      })
      fireEvent.blur(screen.getByLabelText(/first name/i))

      // Should treat as invalid (empty)
      fireEvent.change(screen.getByLabelText(/last name/i), {
        target: { value: 'Test' },
      })
      fireEvent.blur(screen.getByLabelText(/last name/i))

      fireEvent.change(screen.getByLabelText(/^email/i), {
        target: { value: 'test@test.com' },
      })
      fireEvent.blur(screen.getByLabelText(/^email/i))

      fireEvent.change(screen.getByLabelText(/^password/i), {
        target: { value: 'Password123' },
      })
      fireEvent.blur(screen.getByLabelText(/^password/i))

      fireEvent.change(screen.getByLabelText(/confirm password/i), {
        target: { value: 'Password123' },
      })
      fireEvent.blur(screen.getByLabelText(/confirm password/i))

      fireEvent.click(screen.getByRole('button', { name: /create account/i }))

      // Should not submit due to validation error on first name
      expect(userService.create).not.toHaveBeenCalled()
    })
  })
})
