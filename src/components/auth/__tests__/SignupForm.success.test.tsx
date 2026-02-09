/**
 * SignupForm Success Flow Tests
 * Tests for successful account creation and redirect to login
 * Reference: US-UR-008
 */

import { render, screen, fireEvent, waitFor } from '../../../test-utils'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
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

// Test page to verify navigation
const TestLoginPage = () => <div>Login Page</div>

describe('SignupForm - Success Flow & Navigation', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should navigate to login page after successful account creation', async () => {
    ;(userService.create as jest.Mock).mockResolvedValueOnce({
      id: '123',
      email: 'john@example.com',
    })

    render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignupForm />} />
          <Route path="/login" element={<TestLoginPage />} />
        </Routes>
      </BrowserRouter>,
    )

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

    // Should navigate to login page
    await waitFor(() => {
      expect(screen.getByText('Login Page')).toBeInTheDocument()
    })
  })

  it('should not navigate if form validation fails', async () => {
    render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignupForm />} />
          <Route path="/login" element={<TestLoginPage />} />
        </Routes>
      </BrowserRouter>,
    )

    // Try to submit without filling form
    const submitButton = screen.getByRole('button', { name: /create account/i })
    fireEvent.click(submitButton)

    // userService should not be called
    expect(userService.create).not.toHaveBeenCalled()

    // Should still be on signup page
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument()
  })

  it('should call userService.create before redirecting', async () => {
    ;(userService.create as jest.Mock).mockResolvedValueOnce({
      id: '456',
      email: 'jane@example.com',
    })

    render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignupForm />} />
          <Route path="/login" element={<TestLoginPage />} />
        </Routes>
      </BrowserRouter>,
    )

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

    // Verify API was called
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

    // Should redirect after successful API call
    await waitFor(() => {
      expect(screen.getByText('Login Page')).toBeInTheDocument()
    })
  })
})
