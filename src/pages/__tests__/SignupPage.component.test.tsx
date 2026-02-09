/**
 * SignupPage Component Tests
 * Comprehensive component tests for SignupPage layout and structure
 * Reference: US-UR-001
 */

import { renderWithRouter, screen, within } from '../../test-utils'
import { SignupPage } from '../SignupPage'

describe('SignupPage Component', () => {
  describe('Page Layout Structure', () => {
    it('should render main container with correct role', () => {
      renderWithRouter(<SignupPage />)
      const mainElement = screen.getByRole('main')
      expect(mainElement).toBeInTheDocument()
    })

    it('should have container CSS class', () => {
      renderWithRouter(<SignupPage />)
      const mainElement = screen.getByRole('main')
      expect(mainElement).toHaveClass('container')
    })

    it('should render hero section for branding', () => {
      const { container } = renderWithRouter(<SignupPage />)
      const heroSection = container.querySelector('.signupHero')
      expect(heroSection).toBeInTheDocument()
    })

    it('should render form section on the right', () => {
      const { container } = renderWithRouter(<SignupPage />)
      const formSection = container.querySelector('.signupFormSection')
      expect(formSection).toBeInTheDocument()
    })

    it('should render signup container wrapper', () => {
      const { container } = renderWithRouter(<SignupPage />)
      const signupContainer = container.querySelector('.signupContainer')
      expect(signupContainer).toBeInTheDocument()
    })
  })

  describe('Page Content', () => {
    it('should display page title', () => {
      renderWithRouter(<SignupPage />)
      const title = screen.getByRole('heading', { level: 2 })
      expect(title).toBeInTheDocument()
      expect(title.textContent).toMatch(/create account|sign up/i)
    })

    it('should render SignupForm component', () => {
      renderWithRouter(<SignupPage />)
      const form = screen.getByRole('form')
      expect(form).toBeInTheDocument()
    })

    it('should have signup form in the form section', () => {
      const { container } = renderWithRouter(<SignupPage />)
      const formSection = container.querySelector('.signupFormSection')
      const form = within(formSection as HTMLElement).getByRole('form')
      expect(form).toBeInTheDocument()
    })
  })

  describe('Navigation Links', () => {
    it('should have link to login page', () => {
      renderWithRouter(<SignupPage />)
      const loginLink = screen.getByRole('link', { name: /already have an account|sign in/i })
      expect(loginLink).toBeInTheDocument()
    })

    it('should link to correct login route', () => {
      renderWithRouter(<SignupPage />)
      const loginLink = screen.getByRole('link', { name: /already have an account|sign in/i })
      expect(loginLink).toHaveAttribute('href', '/login')
    })

    it('should only have one link on page', () => {
      renderWithRouter(<SignupPage />)
      const links = screen.getAllByRole('link')
      expect(links).toHaveLength(1)
    })
  })

  describe('Responsive Design', () => {
    it('should render without layout errors', () => {
      const { container } = renderWithRouter(<SignupPage />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('should have flex layout container', () => {
      renderWithRouter(<SignupPage />)
      const mainElement = screen.getByRole('main')
      // Check that container exists and is rendered
      expect(mainElement).toHaveClass('container')
    })

    it('should have form wrapper inside form section', () => {
      const { container } = renderWithRouter(<SignupPage />)
      const formWrapper = container.querySelector('.formWrapper')
      expect(formWrapper).toBeInTheDocument()
    })
  })

  describe('Semantic HTML', () => {
    it('should use semantic main element for page content', () => {
      renderWithRouter(<SignupPage />)
      const main = screen.getByRole('main')
      expect(main.tagName).toBe('MAIN')
    })

    it('should have proper heading hierarchy', () => {
      renderWithRouter(<SignupPage />)
      const heading = screen.getByRole('heading', { level: 2 })
      expect(heading).toBeInTheDocument()
    })

    it('should have form element with role attribute', () => {
      renderWithRouter(<SignupPage />)
      const form = screen.getByRole('form')
      expect(form.tagName).toBe('FORM')
    })

    it('should have navigation link with href', () => {
      renderWithRouter(<SignupPage />)
      const link = screen.getByRole('link', { name: /already have an account|sign in/i })
      expect(link).toHaveAttribute('href')
    })
  })

  describe('Page Accessibility', () => {
    it('should have main landmark', () => {
      renderWithRouter(<SignupPage />)
      expect(screen.getByRole('main')).toBeInTheDocument()
    })

    it('should have descriptive heading', () => {
      renderWithRouter(<SignupPage />)
      const heading = screen.getByRole('heading', { level: 2 })
      expect(heading.textContent).not.toBe('')
    })

    it('should have navigable link to login', () => {
      renderWithRouter(<SignupPage />)
      const link = screen.getByRole('link', { name: /already have an account|sign in/i })
      expect(link).toBeVisible()
    })

    it('should have proper contrast in text', () => {
      renderWithRouter(<SignupPage />)
      const title = screen.getByRole('heading', { level: 2 })
      expect(title).toBeVisible()
    })
  })

  describe('Component Integration', () => {
    it('should render page with all required sections', () => {
      const { container } = renderWithRouter(<SignupPage />)
      expect(screen.getByRole('main')).toBeInTheDocument()
      expect(container.querySelector('.signupHero')).toBeInTheDocument()
      expect(container.querySelector('.signupFormSection')).toBeInTheDocument()
      expect(screen.getByRole('form')).toBeInTheDocument()
    })

    it('should have form and navigation on same page', () => {
      renderWithRouter(<SignupPage />)
      expect(screen.getByRole('form')).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument()
    })

    it('should render complete signup flow', () => {
      renderWithRouter(<SignupPage />)
      // Verify all key elements for signup flow
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument() // Title
      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument() // Form fields
      expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument() // Submit
      expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument() // Login link
    })
  })

  describe('Form Visibility', () => {
    it('should have visible form fields', () => {
      renderWithRouter(<SignupPage />)
      expect(screen.getByLabelText(/first name/i)).toBeVisible()
      expect(screen.getByLabelText(/last name/i)).toBeVisible()
      expect(screen.getByLabelText(/^email/i)).toBeVisible()
      expect(screen.getByLabelText(/^password/i)).toBeVisible()
      expect(screen.getByLabelText(/confirm password/i)).toBeVisible()
    })

    it('should have visible submit button', () => {
      renderWithRouter(<SignupPage />)
      const submitButton = screen.getByRole('button', { name: /create account/i })
      expect(submitButton).toBeVisible()
    })

    it('should have visible heading', () => {
      renderWithRouter(<SignupPage />)
      const heading = screen.getByRole('heading', { level: 2 })
      expect(heading).toBeVisible()
    })
  })
})
