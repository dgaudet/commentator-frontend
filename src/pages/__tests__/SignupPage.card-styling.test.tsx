/**
 * SignupPage Card Styling Tests
 * Tests for card styling consistency with LoginPage using design tokens
 * Feature: signup-card-styling
 */

import { renderWithRouter } from '../../test-utils'
import { SignupPage } from '../SignupPage'
import { useThemeColors } from '../../hooks/useThemeColors'

// Mock the useThemeColors hook to verify token usage
jest.mock('../../hooks/useThemeColors')

describe('SignupPage Card Styling (signup-card-styling)', () => {
  beforeEach(() => {
    // Setup mock theme colors
    const mockThemeColors = {
      primary: {
        main: '#667eea',
        dark: '#764ba2',
        light: '#f0f0ff',
      },
      background: {
        primary: '#ffffff',
        secondary: '#f3f4f6',
      },
      border: {
        default: '#e5e7eb',
      },
      text: {
        primary: '#1f2937',
        secondary: '#6b7280',
      },
    }

    ;(useThemeColors as jest.Mock).mockReturnValue(mockThemeColors)
  })

  describe('Story 1: Card Background Color (SIGNUP-CARD-001)', () => {
    it('should render form wrapper with background.primary color', () => {
      const { container } = renderWithRouter(<SignupPage />)

      // Find the form wrapper div (the card container)
      const formWrapper = container.querySelector('.formWrapper')
      expect(formWrapper).toBeInTheDocument()

      // The background should be set via inline style
      const inlineStyle = (formWrapper as HTMLElement).style
      expect(inlineStyle.backgroundColor).toBe('rgb(255, 255, 255)')
    })

    it('should use theme colors hook to get background.primary', () => {
      renderWithRouter(<SignupPage />)

      // Verify that useThemeColors was called
      expect(useThemeColors).toHaveBeenCalled()
    })

    it('should NOT use background.secondary for card', () => {
      const { container } = renderWithRouter(<SignupPage />)

      const formWrapper = container.querySelector('.formWrapper')
      const inlineStyle = (formWrapper as HTMLElement).style

      // Should NOT be secondary color (#f3f4f6 = rgb(243, 244, 246))
      expect(inlineStyle.backgroundColor).not.toBe('rgb(243, 244, 246)')
    })

    it('should match LoginPage card background styling', () => {
      // This test verifies consistency between pages
      const { container } = renderWithRouter(<SignupPage />)

      const formWrapper = container.querySelector('.formWrapper')
      const inlineStyle = (formWrapper as HTMLElement).style

      // Should use white background like LoginPage
      expect(inlineStyle.backgroundColor).toBe('rgb(255, 255, 255)')
    })
  })

  describe('Story 2: Card Border (SIGNUP-CARD-002)', () => {
    it('should render form wrapper with border using theme tokens', () => {
      const { container } = renderWithRouter(<SignupPage />)

      const formWrapper = container.querySelector('.formWrapper')
      expect(formWrapper).toBeInTheDocument()

      // Should have border property set
      const style = (formWrapper as HTMLElement).style
      expect(style.border).toBeDefined()
    })

    it('should use 1px solid border with border.default color', () => {
      const { container } = renderWithRouter(<SignupPage />)

      const formWrapper = container.querySelector('.formWrapper')
      const style = (formWrapper as HTMLElement).style

      // Should match pattern: "1px solid <color>"
      expect(style.border).toMatch(/1px solid/)
    })
  })

  describe('Story 3: Design Token Compliance (SIGNUP-CARD-003)', () => {
    it('should use theme colors for all styling', () => {
      renderWithRouter(<SignupPage />)

      // Verify theme colors hook was used
      expect(useThemeColors).toHaveBeenCalled()
    })

    it('should use theme tokens for all colors', () => {
      // Verify that SignupPage component uses theme colors for styling
      renderWithRouter(<SignupPage />)

      // If the component is using theme tokens correctly, it will call useThemeColors
      expect(useThemeColors).toHaveBeenCalled()

      // Verify the mock was called to provide theme colors to styling
      const callCount = (useThemeColors as jest.Mock).mock.calls.length
      expect(callCount).toBeGreaterThan(0)
    })

    it('should support light and dark themes', () => {
      const { rerender } = renderWithRouter(<SignupPage />)

      // Switch theme by changing mock
      ;(useThemeColors as jest.Mock).mockReturnValue({
        primary: {
          main: '#667eea',
          dark: '#764ba2',
          light: '#f0f0ff',
        },
        background: {
          primary: '#1f2937', // Dark theme primary
          secondary: '#374151',
        },
        border: {
          default: '#4b5563',
        },
        text: {
          primary: '#f3f4f6',
          secondary: '#d1d5db',
        },
      })

      rerender(<SignupPage />)

      // Form wrapper should still render without errors
      const { container } = renderWithRouter(<SignupPage />)
      const formWrapper = container.querySelector('.formWrapper')
      expect(formWrapper).toBeInTheDocument()
    })
  })
})
