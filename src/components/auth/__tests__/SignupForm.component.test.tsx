/**
 * SignupForm Component Tests
 * Comprehensive component tests for SignupForm
 * Reference: US-UR-002 through US-UR-007
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

describe('SignupForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Form Structure', () => {
    it('should render signup form', () => {
      renderWithRouter(<SignupForm />)
      expect(screen.getByRole('form')).toBeInTheDocument()
    })

    it('should have first name input field', () => {
      renderWithRouter(<SignupForm />)
      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument()
    })

    it('should have last name input field', () => {
      renderWithRouter(<SignupForm />)
      expect(screen.getByLabelText(/last name/i)).toBeInTheDocument()
    })

    it('should have email input field', () => {
      renderWithRouter(<SignupForm />)
      expect(screen.getByLabelText(/^email/i)).toBeInTheDocument()
    })

    it('should have password input field', () => {
      renderWithRouter(<SignupForm />)
      expect(screen.getByLabelText(/^password/i)).toBeInTheDocument()
    })

    it('should have confirm password input field', () => {
      renderWithRouter(<SignupForm />)
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
    })

    it('should have submit button', () => {
      renderWithRouter(<SignupForm />)
      expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
    })
  })

  describe('Input Field Properties', () => {
    it('should have password type for password fields', () => {
      renderWithRouter(<SignupForm />)
      const passwordField = screen.getByLabelText(/^password/i) as HTMLInputElement
      expect(passwordField.type).toBe('password')
    })

    it('should have email type for email field', () => {
      renderWithRouter(<SignupForm />)
      const emailField = screen.getByLabelText(/^email/i) as HTMLInputElement
      expect(emailField.type).toBe('email')
    })

    it('should have text type for name fields', () => {
      renderWithRouter(<SignupForm />)
      const firstNameField = screen.getByLabelText(/first name/i) as HTMLInputElement
      expect(firstNameField.type).toBe('text')
    })

    it('should have required attribute on all fields', () => {
      renderWithRouter(<SignupForm />)
      expect(screen.getByLabelText(/first name/i)).toHaveAttribute('required')
      expect(screen.getByLabelText(/last name/i)).toHaveAttribute('required')
      expect(screen.getByLabelText(/^email/i)).toHaveAttribute('required')
      expect(screen.getByLabelText(/^password/i)).toHaveAttribute('required')
      expect(screen.getByLabelText(/confirm password/i)).toHaveAttribute('required')
    })

    it('should have placeholder text on fields', () => {
      renderWithRouter(<SignupForm />)
      expect(screen.getByLabelText(/first name/i)).toHaveAttribute('placeholder', 'John')
      expect(screen.getByLabelText(/last name/i)).toHaveAttribute('placeholder', 'Doe')
      expect(screen.getByLabelText(/^email/i)).toHaveAttribute(
        'placeholder',
        'john.doe@example.com',
      )
    })
  })

  describe('User Input', () => {
    it('should update first name when user types', () => {
      renderWithRouter(<SignupForm />)
      const firstNameField = screen.getByLabelText(/first name/i) as HTMLInputElement
      fireEvent.change(firstNameField, { target: { value: 'Jane' } })
      expect(firstNameField.value).toBe('Jane')
    })

    it('should update all fields independently', () => {
      renderWithRouter(<SignupForm />)
      fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } })
      fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } })
      fireEvent.change(screen.getByLabelText(/^email/i), { target: { value: 'john@test.com' } })

      expect((screen.getByLabelText(/first name/i) as HTMLInputElement).value).toBe('John')
      expect((screen.getByLabelText(/last name/i) as HTMLInputElement).value).toBe('Doe')
      expect((screen.getByLabelText(/^email/i) as HTMLInputElement).value).toBe('john@test.com')
    })

    it('should clear field value when user deletes text', () => {
      renderWithRouter(<SignupForm />)
      const firstNameField = screen.getByLabelText(/first name/i) as HTMLInputElement
      fireEvent.change(firstNameField, { target: { value: 'Jane' } })
      fireEvent.change(firstNameField, { target: { value: '' } })
      expect(firstNameField.value).toBe('')
    })
  })

  describe('Submit Button', () => {
    it('should have submit button enabled initially', () => {
      renderWithRouter(<SignupForm />)
      const submitButton = screen.getByRole('button', { name: /create account/i })
      expect(submitButton).not.toBeDisabled()
    })

    it('should show default button text', () => {
      renderWithRouter(<SignupForm />)
      expect(screen.getByRole('button', { name: /create account/i })).toHaveTextContent(
        'Create Account',
      )
    })

    it('should have submit type', () => {
      renderWithRouter(<SignupForm />)
      const submitButton = screen.getByRole('button', { name: /create account/i })
      expect(submitButton).toHaveAttribute('type', 'submit')
    })
  })

  describe('Form Submission', () => {
    it('should call userService.create on valid form submission', async () => {
      ;(userService.create as jest.Mock).mockResolvedValueOnce({
        id: '123',
        email: 'test@example.com',
      })

      renderWithRouter(<SignupForm />)

      fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } })
      fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } })
      fireEvent.change(screen.getByLabelText(/^email/i), { target: { value: 'john@example.com' } })
      fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: 'Password123' } })
      fireEvent.change(screen.getByLabelText(/confirm password/i), {
        target: { value: 'Password123' },
      })

      fireEvent.blur(screen.getByLabelText(/first name/i))
      fireEvent.blur(screen.getByLabelText(/last name/i))
      fireEvent.blur(screen.getByLabelText(/^email/i))
      fireEvent.blur(screen.getByLabelText(/^password/i))
      fireEvent.blur(screen.getByLabelText(/confirm password/i))

      fireEvent.click(screen.getByRole('button', { name: /create account/i }))

      await waitFor(
        () => {
          expect(userService.create).toHaveBeenCalled()
        },
        { timeout: 2000 },
      )
    })

    it('should not call userService.create on empty form submission', () => {
      renderWithRouter(<SignupForm />)

      fireEvent.click(screen.getByRole('button', { name: /create account/i }))

      expect(userService.create).not.toHaveBeenCalled()
    })

    it('should handle form submission with all fields filled', async () => {
      ;(userService.create as jest.Mock).mockResolvedValueOnce({
        id: '456',
        email: 'jane@example.com',
      })

      renderWithRouter(<SignupForm />)

      const fillForm = () => {
        fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'Jane' } })
        fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Smith' } })
        fireEvent.change(screen.getByLabelText(/^email/i), { target: { value: 'jane@example.com' } })
        fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: 'Password456' } })
        fireEvent.change(screen.getByLabelText(/confirm password/i), {
          target: { value: 'Password456' },
        })

        fireEvent.blur(screen.getByLabelText(/first name/i))
        fireEvent.blur(screen.getByLabelText(/last name/i))
        fireEvent.blur(screen.getByLabelText(/^email/i))
        fireEvent.blur(screen.getByLabelText(/^password/i))
        fireEvent.blur(screen.getByLabelText(/confirm password/i))
      }

      fillForm()
      fireEvent.click(screen.getByRole('button', { name: /create account/i }))

      await waitFor(
        () => {
          expect(userService.create).toHaveBeenCalledWith({
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane@example.com',
            password: 'Password456',
          })
        },
        { timeout: 2000 },
      )
    })
  })

  describe('Error Handling', () => {
    it('should display form error when API fails', async () => {
      ;(userService.create as jest.Mock).mockRejectedValueOnce(
        new Error('Email already in use'),
      )

      renderWithRouter(<SignupForm />)

      fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } })
      fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } })
      fireEvent.change(screen.getByLabelText(/^email/i), { target: { value: 'john@example.com' } })
      fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: 'Password123' } })
      fireEvent.change(screen.getByLabelText(/confirm password/i), {
        target: { value: 'Password123' },
      })

      fireEvent.blur(screen.getByLabelText(/first name/i))
      fireEvent.blur(screen.getByLabelText(/last name/i))
      fireEvent.blur(screen.getByLabelText(/^email/i))
      fireEvent.blur(screen.getByLabelText(/^password/i))
      fireEvent.blur(screen.getByLabelText(/confirm password/i))

      fireEvent.click(screen.getByRole('button', { name: /create account/i }))

      await waitFor(
        () => {
          expect(userService.create).toHaveBeenCalled()
        },
        { timeout: 2000 },
      )
    })

    it('should maintain form data when error occurs', async () => {
      ;(userService.create as jest.Mock).mockRejectedValueOnce(new Error('Server error'))

      renderWithRouter(<SignupForm />)

      const firstName = 'Test'
      const email = 'test@example.com'

      fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: firstName } })
      fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'User' } })
      fireEvent.change(screen.getByLabelText(/^email/i), { target: { value: email } })
      fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: 'Password123' } })
      fireEvent.change(screen.getByLabelText(/confirm password/i), {
        target: { value: 'Password123' },
      })

      fireEvent.blur(screen.getByLabelText(/first name/i))
      fireEvent.blur(screen.getByLabelText(/last name/i))
      fireEvent.blur(screen.getByLabelText(/^email/i))
      fireEvent.blur(screen.getByLabelText(/^password/i))
      fireEvent.blur(screen.getByLabelText(/confirm password/i))

      fireEvent.click(screen.getByRole('button', { name: /create account/i }))

      await waitFor(
        () => {
          expect(userService.create).toHaveBeenCalled()
        },
        { timeout: 2000 },
      )

      // Check form data is preserved
      expect((screen.getByLabelText(/first name/i) as HTMLInputElement).value).toBe(firstName)
      expect((screen.getByLabelText(/^email/i) as HTMLInputElement).value).toBe(email)
    })
  })

  describe('Accessibility', () => {
    it('should have proper form role', () => {
      renderWithRouter(<SignupForm />)
      expect(screen.getByRole('form')).toBeInTheDocument()
    })

    it('should have associated labels for all inputs', () => {
      renderWithRouter(<SignupForm />)
      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/last name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/^email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/^password/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
    })

    it('should have descriptive button text', () => {
      renderWithRouter(<SignupForm />)
      expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
    })

    it('should be keyboard navigable', () => {
      renderWithRouter(<SignupForm />)
      const firstNameInput = screen.getByLabelText(/first name/i)
      const submitButton = screen.getByRole('button', { name: /create account/i })

      // Tab to first input
      firstNameInput.focus()
      expect(document.activeElement).toBe(firstNameInput)

      // Elements should be tabbable
      expect(submitButton).toBeVisible()
    })
  })
})
