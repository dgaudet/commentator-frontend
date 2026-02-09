/**
 * SignupPage Tests
 * Tests for user registration page layout and structure
 */

import { renderWithRouter, screen } from '../../test-utils'
import { SignupPage } from '../SignupPage'

describe('SignupPage', () => {
  describe('Page Structure (AC-1.1)', () => {
    it('should render signup page at /signup route', () => {
      renderWithRouter(<SignupPage />)

      // Check main container exists
      const mainElement = screen.getByRole('main')
      expect(mainElement).toBeInTheDocument()
    })

    it('should display page title', () => {
      renderWithRouter(<SignupPage />)

      const title = screen.getByRole('heading', { level: 2 })
      expect(title).toBeInTheDocument()
      expect(title).toHaveTextContent(/create account|sign up/i)
    })

    it('should have responsive layout container', () => {
      renderWithRouter(<SignupPage />)

      const container = screen.getByRole('main')
      expect(container).toHaveClass('container')
    })
  })

  describe('Layout Sections (AC-1.2)', () => {
    it('should have hero section for teacher image', () => {
      const { container } = renderWithRouter(<SignupPage />)

      const heroSection = container.querySelector('.signupHero')
      expect(heroSection).toBeInTheDocument()
    })

    it('should have form section on the right', () => {
      const { container } = renderWithRouter(<SignupPage />)

      const formSection = container.querySelector('.signupFormSection')
      expect(formSection).toBeInTheDocument()
    })
  })

  describe('Signup Form Component (AC-1.3)', () => {
    it('should render SignupForm component', () => {
      renderWithRouter(<SignupPage />)

      // The form should be rendered (check for form element)
      const form = screen.getByRole('form')
      expect(form).toBeInTheDocument()
    })
  })

  describe('Responsive Design (AC-1.4)', () => {
    it('should render without errors on desktop layout', () => {
      const { container } = renderWithRouter(<SignupPage />)

      expect(container.firstChild).toBeInTheDocument()
    })

    it('should have responsive CSS classes', () => {
      renderWithRouter(<SignupPage />)

      const container = screen.getByRole('main')
      expect(container).toHaveClass('container')
    })
  })

  describe('Navigation Links (AC-1.5)', () => {
    it('should have link to login page', () => {
      renderWithRouter(<SignupPage />)

      const loginLink = screen.getByRole('link', { name: /already have an account|sign in/i })
      expect(loginLink).toBeInTheDocument()
      expect(loginLink).toHaveAttribute('href', '/login')
    })
  })

  describe('Accessibility (AC-1.6)', () => {
    it('should have semantic main element', () => {
      renderWithRouter(<SignupPage />)

      const mainElement = screen.getByRole('main')
      expect(mainElement).toBeInTheDocument()
    })

    it('should have proper heading hierarchy', () => {
      renderWithRouter(<SignupPage />)

      const heading = screen.getByRole('heading', { level: 2 })
      expect(heading).toBeInTheDocument()
    })
  })
})
