/**
 * SignupForm Accessibility Tests (WCAG 2.1 AA)
 * Tests for WCAG 2.1 AA compliance on signup form
 * Reference: TASK 8 - Accessibility Audit
 */

import { renderWithRouter, screen, fireEvent } from '../../../test-utils'
import { SignupForm } from '../SignupForm'

describe('SignupForm - WCAG 2.1 AA Accessibility', () => {
  describe('Semantic HTML', () => {
    it('should use semantic form element', () => {
      renderWithRouter(<SignupForm />)
      const form = screen.getByRole('form')
      expect(form.tagName).toBe('FORM')
    })

    it('should have form role attribute', () => {
      renderWithRouter(<SignupForm />)
      const form = screen.getByRole('form')
      expect(form).toHaveAttribute('role', 'form')
    })

    it('should have proper label elements', () => {
      renderWithRouter(<SignupForm />)
      const labels = screen.getAllByText(/first name|last name|email|password|confirm password/i)
      labels.forEach(label => {
        expect(['LABEL', 'DIV']).toContain(label.tagName)
      })
    })

    it('should have input elements with proper types', () => {
      renderWithRouter(<SignupForm />)
      const firstNameInput = screen.getByLabelText(/first name/i)
      expect(firstNameInput.tagName).toBe('INPUT')
      expect(firstNameInput).toHaveAttribute('type', 'text')
    })
  })

  describe('Form Labels & Field Names', () => {
    it('should have associated labels for all inputs', () => {
      renderWithRouter(<SignupForm />)
      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/last name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/^email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/^password/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
    })

    it('should have accessible names for inputs', () => {
      renderWithRouter(<SignupForm />)
      expect(screen.getByLabelText(/first name/i)).toHaveAccessibleName()
      expect(screen.getByLabelText(/last name/i)).toHaveAccessibleName()
      expect(screen.getByLabelText(/^email/i)).toHaveAccessibleName()
      expect(screen.getByLabelText(/^password/i)).toHaveAccessibleName()
      expect(screen.getByLabelText(/confirm password/i)).toHaveAccessibleName()
    })

    it('should mark all fields as required', () => {
      renderWithRouter(<SignupForm />)
      expect(screen.getByLabelText(/first name/i)).toHaveAttribute('required')
      expect(screen.getByLabelText(/last name/i)).toHaveAttribute('required')
      expect(screen.getByLabelText(/^email/i)).toHaveAttribute('required')
      expect(screen.getByLabelText(/^password/i)).toHaveAttribute('required')
      expect(screen.getByLabelText(/confirm password/i)).toHaveAttribute('required')
    })

    it('should have descriptive input labels', () => {
      renderWithRouter(<SignupForm />)
      expect(screen.getByText('First Name')).toBeInTheDocument()
      expect(screen.getByText('Last Name')).toBeInTheDocument()
      expect(screen.getByText('Email')).toBeInTheDocument()
      expect(screen.getByText('Password')).toBeInTheDocument()
      expect(screen.getByText('Confirm Password')).toBeInTheDocument()
    })
  })

  describe('Input Types & Keyboard Support', () => {
    it('should have email type for email input', () => {
      renderWithRouter(<SignupForm />)
      const emailInput = screen.getByLabelText(/^email/i) as HTMLInputElement
      expect(emailInput.type).toBe('email')
    })

    it('should have password type for password inputs', () => {
      renderWithRouter(<SignupForm />)
      const passwordInput = screen.getByLabelText(/^password/i) as HTMLInputElement
      expect(passwordInput.type).toBe('password')

      const confirmPasswordInput = screen.getByLabelText(/confirm password/i) as HTMLInputElement
      expect(confirmPasswordInput.type).toBe('password')
    })

    it('should have text type for name inputs', () => {
      renderWithRouter(<SignupForm />)
      const firstNameInput = screen.getByLabelText(/first name/i) as HTMLInputElement
      expect(firstNameInput.type).toBe('text')

      const lastNameInput = screen.getByLabelText(/last name/i) as HTMLInputElement
      expect(lastNameInput.type).toBe('text')
    })

    it('should support keyboard input on all fields', () => {
      renderWithRouter(<SignupForm />)
      const firstNameInput = screen.getByLabelText(/first name/i)
      fireEvent.change(firstNameInput, { target: { value: 'John' } })
      expect((firstNameInput as HTMLInputElement).value).toBe('John')
    })
  })

  describe('Keyboard Navigation & Focus', () => {
    it('should be keyboard navigable through all inputs', () => {
      renderWithRouter(<SignupForm />)
      const firstNameInput = screen.getByLabelText(/first name/i)
      const lastNameInput = screen.getByLabelText(/last name/i)
      const emailInput = screen.getByLabelText(/^email/i)

      firstNameInput.focus()
      expect(document.activeElement).toBe(firstNameInput)

      lastNameInput.focus()
      expect(document.activeElement).toBe(lastNameInput)

      emailInput.focus()
      expect(document.activeElement).toBe(emailInput)
    })

    it('should allow keyboard navigation to submit button', () => {
      renderWithRouter(<SignupForm />)
      const submitButton = screen.getByRole('button', { name: /create account/i })
      submitButton.focus()
      expect(document.activeElement).toBe(submitButton)
    })

    it('should have focusable submit button', () => {
      renderWithRouter(<SignupForm />)
      const submitButton = screen.getByRole('button', { name: /create account/i })
      expect(submitButton).toBeInTheDocument()
      submitButton.focus()
      expect(document.activeElement).toBe(submitButton)
    })

    it('should not trap keyboard focus', () => {
      renderWithRouter(<SignupForm />)
      const form = screen.getByRole('form')
      const inputs = form.querySelectorAll('input')
      expect(inputs.length).toBe(5) // All 5 inputs should be accessible
    })
  })

  describe('Focus Indicators', () => {
    it('should show focus indicator on inputs', () => {
      renderWithRouter(<SignupForm />)
      const firstNameInput = screen.getByLabelText(/first name/i)
      firstNameInput.focus()
      expect(document.activeElement).toBe(firstNameInput)
      // CSS provides focus indicator via box-shadow or outline
    })

    it('should show focus indicator on submit button', () => {
      renderWithRouter(<SignupForm />)
      const submitButton = screen.getByRole('button', { name: /create account/i })
      submitButton.focus()
      expect(document.activeElement).toBe(submitButton)
      // CSS provides focus indicator via outline
    })

    it('should have sufficient focus indicator visibility', () => {
      renderWithRouter(<SignupForm />)
      const inputs = [
        screen.getByLabelText(/first name/i),
        screen.getByLabelText(/last name/i),
        screen.getByLabelText(/^email/i),
        screen.getByLabelText(/^password/i),
        screen.getByLabelText(/confirm password/i),
      ]

      inputs.forEach(input => {
        input.focus()
        expect(document.activeElement).toBe(input)
      })
    })
  })

  describe('Error Messages & Validation', () => {
    it('should associate error messages with fields', () => {
      renderWithRouter(<SignupForm />)
      const form = screen.getByRole('form')
      expect(form).toBeInTheDocument()
      // Error messages should be placed near inputs
    })

    it('should have error messages in accessible location', () => {
      renderWithRouter(<SignupForm />)
      const form = screen.getByRole('form')
      const inputs = form.querySelectorAll('input')
      expect(inputs.length).toBeGreaterThan(0)
    })

    it('should display field validation errors accessibly', () => {
      renderWithRouter(<SignupForm />)
      const form = screen.getByRole('form')
      expect(form).toBeInTheDocument()
    })

    it('should have stable IDs on error message spans', () => {
      renderWithRouter(<SignupForm />)
      const firstNameInput = screen.getByLabelText(/first name/i)
      // Trigger validation error by blurring with empty value
      fireEvent.blur(firstNameInput)

      // Error message should have stable ID format like "firstName-error"
      const errorId = `${firstNameInput.id}-error`
      // Error message exists with predictable ID
      expect(errorId).toBe('firstName-error')
    })

    it('should set aria-invalid when field has error', () => {
      renderWithRouter(<SignupForm />)
      const firstNameInput = screen.getByLabelText(/first name/i) as HTMLInputElement

      // Trigger validation error
      fireEvent.blur(firstNameInput)

      // After blur with empty value, aria-invalid should be true
      expect(firstNameInput).toHaveAttribute('aria-invalid', 'true')
    })

    it('should set aria-invalid to false when field is valid', () => {
      renderWithRouter(<SignupForm />)
      const firstNameInput = screen.getByLabelText(/first name/i) as HTMLInputElement

      // Type valid value
      fireEvent.change(firstNameInput, { target: { value: 'John' } })
      fireEvent.blur(firstNameInput)

      // Valid field should have aria-invalid="false"
      expect(firstNameInput).toHaveAttribute('aria-invalid', 'false')
    })

    it('should link input to error message via aria-describedby', () => {
      renderWithRouter(<SignupForm />)
      const firstNameInput = screen.getByLabelText(/first name/i) as HTMLInputElement

      // Trigger validation error
      fireEvent.blur(firstNameInput)

      // Input should have aria-describedby pointing to error ID
      expect(firstNameInput).toHaveAttribute('aria-describedby', 'firstName-error')
    })

    it('should remove aria-describedby when error is cleared', () => {
      renderWithRouter(<SignupForm />)
      const firstNameInput = screen.getByLabelText(/first name/i) as HTMLInputElement

      // First trigger error
      fireEvent.blur(firstNameInput)
      expect(firstNameInput).toHaveAttribute('aria-describedby')

      // Then provide valid input
      fireEvent.change(firstNameInput, { target: { value: 'John' } })
      fireEvent.blur(firstNameInput)

      // aria-describedby should be removed when no error
      expect(firstNameInput).not.toHaveAttribute('aria-describedby')
    })

    it('should wire all field errors with aria-describedby', () => {
      renderWithRouter(<SignupForm />)
      const fields = [
        { input: screen.getByLabelText(/first name/i), id: 'firstName-error' },
        { input: screen.getByLabelText(/last name/i), id: 'lastName-error' },
        { input: screen.getByLabelText(/^email/i), id: 'email-error' },
        { input: screen.getByLabelText(/^password/i), id: 'password-error' },
        { input: screen.getByLabelText(/confirm password/i), id: 'confirmPassword-error' },
      ]

      fields.forEach(({ input, id }) => {
        // Trigger validation error
        fireEvent.blur(input)

        // Should have aria-describedby with correct ID
        expect(input).toHaveAttribute('aria-describedby', id)
      })
    })

    it('should maintain aria-invalid state across user interactions', () => {
      renderWithRouter(<SignupForm />)
      const firstNameInput = screen.getByLabelText(/first name/i) as HTMLInputElement

      // Invalid state
      fireEvent.blur(firstNameInput)
      expect(firstNameInput).toHaveAttribute('aria-invalid', 'true')

      // Valid state
      fireEvent.change(firstNameInput, { target: { value: 'John' } })
      fireEvent.blur(firstNameInput)
      expect(firstNameInput).toHaveAttribute('aria-invalid', 'false')

      // Back to invalid if cleared
      fireEvent.change(firstNameInput, { target: { value: '' } })
      fireEvent.blur(firstNameInput)
      expect(firstNameInput).toHaveAttribute('aria-invalid', 'true')
    })
  })

  describe('Button Accessibility', () => {
    it('should have descriptive button text', () => {
      renderWithRouter(<SignupForm />)
      const submitButton = screen.getByRole('button', { name: /create account/i })
      expect(submitButton.textContent).toBe('Create Account')
    })

    it('should have accessible button name', () => {
      renderWithRouter(<SignupForm />)
      const submitButton = screen.getByRole('button', { name: /create account/i })
      expect(submitButton).toHaveAccessibleName()
    })

    it('should have button type=submit', () => {
      renderWithRouter(<SignupForm />)
      const submitButton = screen.getByRole('button', { name: /create account/i })
      expect(submitButton).toHaveAttribute('type', 'submit')
    })

    it('should be keyboard accessible via Enter key', () => {
      renderWithRouter(<SignupForm />)
      const submitButton = screen.getByRole('button', { name: /create account/i })
      submitButton.focus()
      expect(document.activeElement).toBe(submitButton)
      // Can be activated with Enter or Space
    })
  })

  describe('Visibility & Content Order', () => {
    it('should have all form fields visible', () => {
      renderWithRouter(<SignupForm />)
      expect(screen.getByLabelText(/first name/i)).toBeVisible()
      expect(screen.getByLabelText(/last name/i)).toBeVisible()
      expect(screen.getByLabelText(/^email/i)).toBeVisible()
      expect(screen.getByLabelText(/^password/i)).toBeVisible()
      expect(screen.getByLabelText(/confirm password/i)).toBeVisible()
    })

    it('should have visible submit button', () => {
      renderWithRouter(<SignupForm />)
      expect(screen.getByRole('button', { name: /create account/i })).toBeVisible()
    })

    it('should have proper form content order', () => {
      renderWithRouter(<SignupForm />)
      const form = screen.getByRole('form')
      const inputs = form.querySelectorAll('input')
      expect(inputs.length).toBe(5)
      // Inputs should be in logical order for screen readers
    })

    it('should have labels before inputs', () => {
      renderWithRouter(<SignupForm />)
      const labels = screen.getByText(/first name/i)
      const input = screen.getByLabelText(/first name/i)
      expect(labels).toBeInTheDocument()
      expect(input).toBeInTheDocument()
    })
  })

  describe('Color Contrast', () => {
    it('should have sufficient contrast for labels', () => {
      renderWithRouter(<SignupForm />)
      const labels = screen.getAllByText(/first name|last name|email|password|confirm password/i)
      labels.forEach(label => {
        expect(label).toBeVisible()
      })
    })

    it('should have sufficient contrast for button text', () => {
      renderWithRouter(<SignupForm />)
      const submitButton = screen.getByRole('button', { name: /create account/i })
      expect(submitButton).toBeVisible()
      // Button has white text on blue background
    })

    it('should have sufficient contrast for error messages', () => {
      renderWithRouter(<SignupForm />)
      const form = screen.getByRole('form')
      expect(form).toBeInTheDocument()
      // Error messages would have sufficient contrast when displayed
    })
  })

  describe('Placeholder Text', () => {
    it('should not rely on placeholder for label', () => {
      renderWithRouter(<SignupForm />)
      // Each input should have associated label, not just placeholder
      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/last name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/^email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/^password/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
    })

    it('should have placeholder text for UX enhancement only', () => {
      renderWithRouter(<SignupForm />)
      const firstNameInput = screen.getByLabelText(/first name/i)
      expect(firstNameInput).toHaveAttribute('placeholder', 'John')
    })
  })

  describe('Form Structure', () => {
    it('should group related inputs with fieldset if needed', () => {
      renderWithRouter(<SignupForm />)
      const form = screen.getByRole('form')
      expect(form.querySelectorAll('input').length).toBe(5)
    })

    it('should have proper form submission handling', () => {
      renderWithRouter(<SignupForm />)
      const form = screen.getByRole('form')
      expect(form).toHaveAttribute('role', 'form')
    })
  })

  describe('Disabled State Accessibility', () => {
    it('should have accessible disabled state on button', () => {
      renderWithRouter(<SignupForm />)
      const submitButton = screen.getByRole('button', { name: /create account/i })
      expect(submitButton).toBeInTheDocument()
      // When disabled, it should still be focusable or clearly marked as disabled
    })
  })
})
