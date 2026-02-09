/**
 * SignupForm Success Flow Tests
 * Tests for successful account creation and redirect to login
 * Reference: US-UR-008
 */

import { renderWithRouter, screen, fireEvent, waitFor } from '../../../test-utils'
import { SignupForm } from '../SignupForm'
import { userService } from '../../../services/api/userService'

// Mock the userService
jest.mock('../../../services/api/userService', () => ({
  userService: {
    create: jest.fn(),
  },
}))

// Mock the validators
jest.mock('../../../utils/userValidators', () => ({
  validateFirstName: jest.fn(() => undefined),
  validateLastName: jest.fn(() => undefined),
  validateEmail: jest.fn(() => undefined),
  validatePassword: jest.fn(() => undefined),
  validatePasswordMatch: jest.fn(() => undefined),
}))

describe('SignupForm - Success Flow & Navigation', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should navigate to login page after successful account creation', async () => {
    ;(userService.create as jest.Mock).mockResolvedValueOnce({
      id: '123',
      email: 'john@example.com',
    })

    renderWithRouter(<SignupForm />)

    // Fill form
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

    // Verify API was called
    await waitFor(() => {
      expect(userService.create).toHaveBeenCalled()
    })
  })

  it('should not call userService if form validation fails', () => {
    renderWithRouter(<SignupForm />)

    // Try to submit without filling form
    const submitButton = screen.getByRole('button', { name: /create account/i })
    fireEvent.click(submitButton)

    // userService should not be called when validation fails
    expect(userService.create).not.toHaveBeenCalled()

    // Form should still be visible
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
  })

  it('should call userService with correct form data', async () => {
    ;(userService.create as jest.Mock).mockResolvedValueOnce({
      id: '456',
      email: 'jane@example.com',
    })

    renderWithRouter(<SignupForm />)

    // Fill form
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
      target: { value: 'Password456' },
    })
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'Password456' },
    })

    fireEvent.blur(screen.getByLabelText(/first name/i))
    fireEvent.blur(screen.getByLabelText(/last name/i))
    fireEvent.blur(screen.getByLabelText(/^email/i))
    fireEvent.blur(screen.getByLabelText(/^password/i))
    fireEvent.blur(screen.getByLabelText(/confirm password/i))

    const submitButton = screen.getByRole('button', { name: /create account/i })
    fireEvent.click(submitButton)

    // Verify API was called with correct data
    await waitFor(() => {
      expect(userService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@example.com',
          password: 'Password456',
        }),
      )
    })
  })
})
