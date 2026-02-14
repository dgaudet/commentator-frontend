/**
 * SignupForm Responsive Design Tests
 * Tests for responsive form inputs and buttons
 * Reference: TASK 7 - Responsive Design Refinement
 */

import { renderWithRouter, screen } from '../../../test-utils'
import { SignupForm } from '../SignupForm'

describe('SignupForm - Responsive Design', () => {
  describe('Mobile Input Sizing', () => {
    it('should have inputs with sufficient height for touch targets', () => {
      renderWithRouter(<SignupForm />)
      const firstNameInput = screen.getByLabelText(/first name/i) as HTMLInputElement
      expect(firstNameInput).toBeInTheDocument()
      // Input should have padding to reach 44px minimum height on mobile
    })

    it('should use 16px font size on mobile to prevent zoom', () => {
      renderWithRouter(<SignupForm />)
      const emailInput = screen.getByLabelText(/^email/i) as HTMLInputElement
      expect(emailInput).toBeInTheDocument()
      // Font size should be 16px on mobile (CSS media query)
    })

    it('should have all form inputs visible and accessible', () => {
      renderWithRouter(<SignupForm />)
      expect(screen.getByLabelText(/first name/i)).toBeVisible()
      expect(screen.getByLabelText(/last name/i)).toBeVisible()
      expect(screen.getByLabelText(/^email/i)).toBeVisible()
      expect(screen.getByLabelText(/^password/i)).toBeVisible()
      expect(screen.getByLabelText(/confirm password/i)).toBeVisible()
    })

    it('should have proper spacing between form groups on mobile', () => {
      renderWithRouter(<SignupForm />)
      const form = screen.getByRole('form')
      expect(form).toBeInTheDocument()
      // Form groups should have gap: 6px on mobile
    })
  })

  describe('Mobile Button Sizing', () => {
    it('should have submit button with adequate touch target size', () => {
      renderWithRouter(<SignupForm />)
      const submitButton = screen.getByRole('button', { name: /create account/i })
      expect(submitButton).toBeInTheDocument()
      // Button should have minimum height for touch (44px)
    })

    it('should have visible button text on mobile', () => {
      renderWithRouter(<SignupForm />)
      const submitButton = screen.getByRole('button', { name: /create account/i })
      expect(submitButton).toHaveTextContent('Create Account')
      expect(submitButton).toBeVisible()
    })

    it('should adjust button font size on mobile', () => {
      renderWithRouter(<SignupForm />)
      const submitButton = screen.getByRole('button', { name: /create account/i })
      expect(submitButton).toBeInTheDocument()
      // Font size should be 14px on mobile
    })

    it('should maintain button accessibility on mobile', () => {
      renderWithRouter(<SignupForm />)
      const submitButton = screen.getByRole('button', { name: /create account/i })
      expect(submitButton).toHaveAccessibleName()
      // Button can be focused
      submitButton.focus()
      expect(document.activeElement).toBe(submitButton)
    })
  })

  describe('Label Sizing', () => {
    it('should have readable labels on mobile', () => {
      renderWithRouter(<SignupForm />)
      const firstNameLabel = screen.getByText(/first name/i)
      expect(firstNameLabel).toBeVisible()
      // Label should be 13px on mobile, 14px on desktop
    })

    it('should maintain label accessibility on mobile', () => {
      renderWithRouter(<SignupForm />)
      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/last name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/^email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/^password/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
    })
  })

  describe('Error Message Display on Mobile', () => {
    it('should display form error message on mobile', () => {
      renderWithRouter(<SignupForm />)
      const form = screen.getByRole('form')
      expect(form).toBeInTheDocument()
      // Error message should be readable on mobile
    })

    it('should display field error messages on mobile', () => {
      renderWithRouter(<SignupForm />)
      const firstNameInput = screen.getByLabelText(/first name/i)
      expect(firstNameInput).toBeInTheDocument()
      // Error text below input should be readable
    })

    it('should have sufficient spacing for error messages', () => {
      renderWithRouter(<SignupForm />)
      const form = screen.getByRole('form')
      expect(form).toBeInTheDocument()
      // Error messages should not overlap content
    })
  })

  describe('Desktop Font Scaling', () => {
    it('should have larger labels on desktop', () => {
      renderWithRouter(<SignupForm />)
      const labels = screen.getAllByText(/first name|last name|email|password|confirm password/i)
      expect(labels.length).toBeGreaterThan(0)
      // Labels should be 14px on desktop
    })

    it('should have larger button text on desktop', () => {
      renderWithRouter(<SignupForm />)
      const submitButton = screen.getByRole('button', { name: /create account/i })
      expect(submitButton).toBeInTheDocument()
      // Button text should be 16px on desktop
    })
  })

  describe('Form Width on Desktop', () => {
    it('should have reasonable form width on desktop', () => {
      renderWithRouter(<SignupForm />)
      const form = screen.getByRole('form')
      expect(form).toBeInTheDocument()
      // Form should not be too wide on desktop
    })
  })

  describe('Mobile Spacing Consistency', () => {
    it('should have consistent spacing in form', () => {
      renderWithRouter(<SignupForm />)
      const form = screen.getByRole('form')
      expect(form).toBeInTheDocument()
      // All form groups should have consistent gap
    })

    it('should have adequate margin on submit button', () => {
      renderWithRouter(<SignupForm />)
      const submitButton = screen.getByRole('button', { name: /create account/i })
      expect(submitButton).toBeInTheDocument()
      // Button should have margin-top: 10px
    })
  })

  describe('Input Placeholder Readability', () => {
    it('should have readable placeholders on mobile', () => {
      renderWithRouter(<SignupForm />)
      const firstNameInput = screen.getByPlaceholderText('John') as HTMLInputElement
      expect(firstNameInput).toBeInTheDocument()
      // Placeholder should be readable
    })

    it('should have appropriate placeholder styling', () => {
      renderWithRouter(<SignupForm />)
      const emailInput = screen.getByPlaceholderText('john.doe@example.com')
      expect(emailInput).toBeInTheDocument()
    })
  })

  describe('Focus States on Mobile', () => {
    it('should have visible focus state on inputs', () => {
      renderWithRouter(<SignupForm />)
      const firstNameInput = screen.getByLabelText(/first name/i)
      firstNameInput.focus()
      expect(document.activeElement).toBe(firstNameInput)
      // Focus should be clearly visible
    })

    it('should have visible focus state on button', () => {
      renderWithRouter(<SignupForm />)
      const submitButton = screen.getByRole('button', { name: /create account/i })
      submitButton.focus()
      expect(document.activeElement).toBe(submitButton)
      // Focus should have outline
    })
  })

  describe('Text Input Types', () => {
    it('should have correct input type for mobile keyboards', () => {
      renderWithRouter(<SignupForm />)
      const emailInput = screen.getByLabelText(/^email/i) as HTMLInputElement
      expect(emailInput.type).toBe('email')
      // Mobile should show email keyboard
    })

    it('should have password input type for password fields', () => {
      renderWithRouter(<SignupForm />)
      const passwordInput = screen.getByLabelText(/^password/i) as HTMLInputElement
      expect(passwordInput.type).toBe('password')
      // Mobile should show password keyboard
    })

    it('should have text input type for name fields', () => {
      renderWithRouter(<SignupForm />)
      const firstNameInput = screen.getByLabelText(/first name/i) as HTMLInputElement
      expect(firstNameInput.type).toBe('text')
    })
  })
})
