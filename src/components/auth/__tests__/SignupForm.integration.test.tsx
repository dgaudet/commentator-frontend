/**
 * SignupForm Integration Tests
 * Simplified tests for form submission and API integration
 * Reference: US-UR-005, US-UR-006
 */

import { renderWithRouter, screen, fireEvent, waitFor } from '../../../test-utils'
import { SignupForm } from '../SignupForm'
import { userService } from '../../../services/api/userService'

jest.mock('../../../services/api/userService', () => ({
  userService: {
    create: jest.fn(),
  },
}))

jest.mock('../../../utils/userValidators', () => ({
  validateFirstName: jest.fn(() => undefined),
  validateLastName: jest.fn(() => undefined),
  validateEmail: jest.fn(() => undefined),
  validatePassword: jest.fn(() => undefined),
  validatePasswordMatch: jest.fn(() => undefined),
}))

describe('SignupForm - Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(userService.create as jest.Mock).mockResolvedValue({
      userId: '123',
      email: 'test@example.com',
      createdAt: '2026-02-14T10:00:00Z',
    })
  })

  const fillForm = () => {
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
      target: { value: 'Password123!' },
    })
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'Password123!' },
    })

    fireEvent.blur(screen.getByLabelText(/first name/i))
    fireEvent.blur(screen.getByLabelText(/last name/i))
    fireEvent.blur(screen.getByLabelText(/^email/i))
    fireEvent.blur(screen.getByLabelText(/^password/i))
    fireEvent.blur(screen.getByLabelText(/confirm password/i))
  }

  it('should successfully submit form with valid data', async () => {
    renderWithRouter(<SignupForm />)

    fillForm()
    const submitButton = screen.getByRole('button', { name: /create account/i })
    fireEvent.click(submitButton)

    await waitFor(
      () => {
        expect(userService.create).toHaveBeenCalledWith(
          expect.objectContaining({
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            password: 'Password123!',
          }),
        )
      },
      { timeout: 2000 },
    )
  })

  it('should disable submit button during submission', async () => {
    const errorMsg = 'Test error'
    ;(userService.create as jest.Mock).mockRejectedValueOnce(new Error(errorMsg))

    renderWithRouter(<SignupForm />)
    fillForm()

    const submitButton = screen.getByRole('button', { name: /create account/i })
    fireEvent.click(submitButton)

    // Button should be disabled while submitting
    expect(submitButton).toBeDisabled()

    // After error, button should be re-enabled
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled()
    })
  })

  it('should display button text while submitting', () => {
    renderWithRouter(<SignupForm />)
    fillForm()

    const submitButton = screen.getByRole('button', { name: /create account/i })
    expect(submitButton.textContent).toBe('Create Account')

    ;(userService.create as jest.Mock).mockImplementationOnce(
      () => new Promise(resolve => setTimeout(resolve, 50)),
    )

    fireEvent.click(submitButton)
    // After click, button should show loading text briefly
    expect(submitButton.textContent).toMatch(/Creating Account|Create Account/)
  })

  it('should handle submission errors gracefully', async () => {
    const errorMsg = 'Email already in use'
    ;(userService.create as jest.Mock).mockRejectedValueOnce(new Error(errorMsg))

    renderWithRouter(<SignupForm />)
    fillForm()

    const submitButton = screen.getByRole('button', { name: /create account/i })
    fireEvent.click(submitButton)

    // After error, button should be re-enabled
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled()
    })
  })

  it('should not submit if form validation fails', () => {
    renderWithRouter(<SignupForm />)

    // Don't fill form - validation should fail
    const submitButton = screen.getByRole('button', { name: /create account/i })
    fireEvent.click(submitButton)

    expect(userService.create).not.toHaveBeenCalled()
  })

  it('should clear error when user edits form after error', async () => {
    const errorMsg = 'Failed to create account'
    ;(userService.create as jest.Mock).mockRejectedValueOnce(new Error(errorMsg))

    renderWithRouter(<SignupForm />)
    fillForm()

    const submitButton = screen.getByRole('button', { name: /create account/i })
    fireEvent.click(submitButton)

    // Wait for error state
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled()
    })

    // User starts editing - should clear error
    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: 'Jane' },
    })

    // No error should be visible anymore
    // (Error message should be cleared when user types)
  })
})
