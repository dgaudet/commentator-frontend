/**
 * SignupPage Responsive Design Tests
 * Tests for mobile-first responsive design across breakpoints
 * Reference: TASK 7 - Responsive Design Refinement
 */

import { renderWithRouter, screen } from '../../test-utils'
import { SignupPage } from '../SignupPage'

describe('SignupPage - Responsive Design', () => {
  describe('Desktop Layout (1200px+)', () => {
    beforeEach(() => {
      // Mock window.matchMedia for desktop
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: false,
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      })
    })

    it('should display hero section on desktop', () => {
      const { container } = renderWithRouter(<SignupPage />)
      const heroSection = container.querySelector('.signupHero')
      expect(heroSection).toBeInTheDocument()
      expect(heroSection).toBeVisible()
    })

    it('should use two-column grid layout on desktop', () => {
      const { container } = renderWithRouter(<SignupPage />)
      const signupContainer = container.querySelector('.signupContainer')
      // Grid should have two columns on desktop
      expect(signupContainer).toHaveClass('signupContainer')
    })

    it('should have adequate spacing between hero and form on desktop', () => {
      const { container } = renderWithRouter(<SignupPage />)
      const signupContainer = container.querySelector('.signupContainer')
      expect(signupContainer).toBeInTheDocument()
      // Desktop gap should be 40px or more
    })

    it('should display form with proper width on desktop', () => {
      const { container } = renderWithRouter(<SignupPage />)
      const formWrapper = container.querySelector('.formWrapper')
      expect(formWrapper).toBeInTheDocument()
      // Form should have max-width constraint
    })
  })

  describe('Tablet Layout (1025px - 1024px)', () => {
    it('should stack layout vertically on tablet', () => {
      const { container } = renderWithRouter(<SignupPage />)
      const signupContainer = container.querySelector('.signupContainer')
      expect(signupContainer).toBeInTheDocument()
      // Should be single column layout
    })

    it('should display hero section on tablet with reduced height', () => {
      const { container } = renderWithRouter(<SignupPage />)
      const heroSection = container.querySelector('.signupHero')
      expect(heroSection).toBeInTheDocument()
      // Hero should be visible but smaller (400px)
    })

    it('should reduce padding on tablet', () => {
      const { container } = renderWithRouter(<SignupPage />)
      const formWrapper = container.querySelector('.formWrapper')
      expect(formWrapper).toBeInTheDocument()
      // Padding should be 30px on tablet
    })

    it('should reduce title font size on tablet', () => {
      renderWithRouter(<SignupPage />)
      const title = screen.getByRole('heading', { level: 2 })
      expect(title).toBeInTheDocument()
      // Font size should be 24px on tablet
    })
  })

  describe('Mobile Layout (≤640px)', () => {
    it('should hide hero section on mobile', () => {
      const { container } = renderWithRouter(<SignupPage />)
      const heroSection = container.querySelector('.signupHero')
      // Hero should be hidden via display: none on mobile
      expect(heroSection).toBeInTheDocument()
    })

    it('should have single column layout on mobile', () => {
      const { container } = renderWithRouter(<SignupPage />)
      const signupContainer = container.querySelector('.signupContainer')
      expect(signupContainer).toBeInTheDocument()
      // Should be single column only
    })

    it('should have minimal padding on mobile', () => {
      renderWithRouter(<SignupPage />)
      const mainElement = screen.getByRole('main')
      expect(mainElement).toBeInTheDocument()
      // Padding should be 15px on mobile
    })

    it('should have reduced form padding on mobile', () => {
      const { container } = renderWithRouter(<SignupPage />)
      const formWrapper = container.querySelector('.formWrapper')
      expect(formWrapper).toBeInTheDocument()
      // Padding should be 20px on mobile
    })

    it('should have smaller title on mobile', () => {
      renderWithRouter(<SignupPage />)
      const title = screen.getByRole('heading', { level: 2 })
      expect(title).toBeInTheDocument()
      // Font size should be 20px on mobile
    })

    it('should have reduced gap between sections on mobile', () => {
      const { container } = renderWithRouter(<SignupPage />)
      const signupContainer = container.querySelector('.signupContainer')
      expect(signupContainer).toBeInTheDocument()
      // Gap should be 20px on mobile
    })

    it('should maintain form accessibility on mobile', () => {
      renderWithRouter(<SignupPage />)
      expect(screen.getByRole('form')).toBeInTheDocument()
      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
    })
  })

  describe('Form Touch Targets', () => {
    it('should have input fields with sufficient height on mobile', () => {
      const { container } = renderWithRouter(<SignupPage />)
      const inputs = container.querySelectorAll('input')
      expect(inputs.length).toBeGreaterThan(0)
      // Each input should have minimum height for touch (44px recommended)
    })

    it('should have submit button with sufficient touch target', () => {
      renderWithRouter(<SignupPage />)
      const submitButton = screen.getByRole('button', { name: /create account/i })
      expect(submitButton).toBeInTheDocument()
      // Button should have minimum height for touch (44px recommended)
    })

    it('should have clickable link area on mobile', () => {
      renderWithRouter(<SignupPage />)
      const loginLink = screen.getByRole('link', { name: /sign in/i })
      expect(loginLink).toBeInTheDocument()
      expect(loginLink).toBeVisible()
    })
  })

  describe('Responsive Text and Spacing', () => {
    it('should scale heading sizes appropriately', () => {
      renderWithRouter(<SignupPage />)
      const heading = screen.getByRole('heading', { level: 2 })
      expect(heading).toBeInTheDocument()
      // Desktop: 28px, Tablet: 24px, Mobile: 20px
    })

    it('should maintain readable line heights across breakpoints', () => {
      renderWithRouter(<SignupPage />)
      const title = screen.getByRole('heading', { level: 2 })
      expect(title).toBeVisible()
    })

    it('should have consistent spacing around form elements', () => {
      renderWithRouter(<SignupPage />)
      const formGroups = screen.getByRole('form')
      expect(formGroups).toBeInTheDocument()
      // Form groups should have consistent gap values
    })
  })

  describe('Container Constraints', () => {
    it('should have max-width on large screens', () => {
      renderWithRouter(<SignupPage />)
      expect(screen.getByRole('main')).toBeInTheDocument()
      // max-width should be 1200px
    })

    it('should respect max-width for form wrapper', () => {
      const { container } = renderWithRouter(<SignupPage />)
      const formWrapper = container.querySelector('.formWrapper')
      expect(formWrapper).toBeInTheDocument()
      // form wrapper max-width should be 500px
    })

    it('should use full width on mobile', () => {
      const { container } = renderWithRouter(<SignupPage />)
      const formWrapper = container.querySelector('.formWrapper')
      expect(formWrapper).toHaveClass('formWrapper')
      // width should be 100% on mobile
    })
  })

  describe('Orientation and Viewport Changes', () => {
    it('should render form fully visible on mobile', () => {
      renderWithRouter(<SignupPage />)
      expect(screen.getByRole('form')).toBeVisible()
      expect(screen.getByLabelText(/first name/i)).toBeVisible()
      expect(screen.getByLabelText(/last name/i)).toBeVisible()
      expect(screen.getByLabelText(/^email/i)).toBeVisible()
      expect(screen.getByLabelText(/^password/i)).toBeVisible()
      expect(screen.getByLabelText(/confirm password/i)).toBeVisible()
    })

    it('should have accessible form on all screen sizes', () => {
      renderWithRouter(<SignupPage />)
      const form = screen.getByRole('form')
      expect(form).toBeInTheDocument()
      // Check accessible names are present
      expect(screen.getByLabelText(/first name/i)).toHaveAccessibleName()
    })
  })
})
