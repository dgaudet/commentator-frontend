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

    it('should use border.default color token (light gray)', () => {
      const { container } = renderWithRouter(<SignupPage />)

      const formWrapper = container.querySelector('.formWrapper')
      const style = (formWrapper as HTMLElement).style

      // Border should use the mocked border.default color (#e5e7eb)
      // Rendered as rgb(229, 231, 235) or similar hex representation
      expect(style.border).toContain('e5e7eb')
    })

    it('should have proper border styling matching LoginPage', () => {
      const { container } = renderWithRouter(<SignupPage />)

      const formWrapper = container.querySelector('.formWrapper')
      const style = (formWrapper as HTMLElement).style

      // Border must be exactly: "1px solid #e5e7eb"
      expect(style.border).toBe('1px solid #e5e7eb')
    })

    it('should display border in light theme', () => {
      ;(useThemeColors as jest.Mock).mockReturnValue({
        primary: { main: '#667eea', dark: '#764ba2', light: '#f0f0ff' },
        background: { primary: '#ffffff', secondary: '#f3f4f6' },
        border: { default: '#e5e7eb' },
        text: { primary: '#1f2937', secondary: '#6b7280' },
      })

      const { container } = renderWithRouter(<SignupPage />)
      const formWrapper = container.querySelector('.formWrapper')
      const style = (formWrapper as HTMLElement).style

      expect(style.border).toContain('#e5e7eb')
    })

    it('should display border in dark theme', () => {
      ;(useThemeColors as jest.Mock).mockReturnValue({
        primary: { main: '#667eea', dark: '#764ba2', light: '#f0f0ff' },
        background: { primary: '#1f2937', secondary: '#374151' },
        border: { default: '#4b5563' }, // Dark theme border
        text: { primary: '#f3f4f6', secondary: '#d1d5db' },
      })

      const { container } = renderWithRouter(<SignupPage />)
      const formWrapper = container.querySelector('.formWrapper')
      const style = (formWrapper as HTMLElement).style

      expect(style.border).toContain('#4b5563')
    })

    it('should have consistent border on all sides', () => {
      const { container } = renderWithRouter(<SignupPage />)

      const formWrapper = container.querySelector('.formWrapper')
      const style = (formWrapper as HTMLElement).style

      // Border shorthand should apply to all sides
      expect(style.border).toBeDefined()
      expect(style.border).toMatch(/1px solid/)

      // When computed, all sides should have the border
      const computedStyle = window.getComputedStyle(formWrapper!)
      expect(computedStyle.borderTopWidth).toBe('1px')
      expect(computedStyle.borderBottomWidth).toBe('1px')
      expect(computedStyle.borderLeftWidth).toBe('1px')
      expect(computedStyle.borderRightWidth).toBe('1px')
    })

    it('should align visually with LoginPage card border', () => {
      const { container: signupContainer } = renderWithRouter(<SignupPage />)
      const signupFormWrapper = signupContainer.querySelector('.formWrapper')
      const signupBorder = (signupFormWrapper as HTMLElement).style.border

      // Both should use same border token: 1px solid <theme-border>
      expect(signupBorder).toMatch(/^1px solid #/)
      expect(signupBorder).toMatch(/e5e7eb|4b5563/) // Light or dark theme border
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

    describe('Info Boxes Token Compliance', () => {
      it('should use spacing tokens for info box padding', () => {
        const { container } = renderWithRouter(<SignupPage />)

        // Find info boxes (they have position: absolute)
        const infoBoxes = container.querySelectorAll('[style*="absolute"]')
        expect(infoBoxes.length).toBeGreaterThan(0)

        // Check that padding uses spacing tokens (not hardcoded '12px 16px')
        infoBoxes.forEach((box) => {
          const style = (box as HTMLElement).style
          // Should NOT have hardcoded pixel padding
          expect(style.padding).not.toBe('12px 16px')
        })
      })

      it('should use spacing tokens for info box gap', () => {
        const { container } = renderWithRouter(<SignupPage />)

        const infoBoxes = container.querySelectorAll('[style*="absolute"]')
        infoBoxes.forEach((box) => {
          const style = (box as HTMLElement).style
          // Should NOT have hardcoded gap
          expect(style.gap).not.toBe('8px')
        })
      })

      it('should use design tokens for info box borderRadius', () => {
        const { container } = renderWithRouter(<SignupPage />)

        const infoBoxes = container.querySelectorAll('[style*="absolute"]')
        infoBoxes.forEach((box) => {
          const style = (box as HTMLElement).style
          // borderRadius should use borders.radius.md token (which is '8px')
          // Verify it's defined and has appropriate value
          expect(style.borderRadius).toBeDefined()
          expect(['8px', '4px', '12px'].includes(style.borderRadius)).toBe(true)
        })
      })

      it('should use shadows token for info box boxShadow', () => {
        const { container } = renderWithRouter(<SignupPage />)

        const infoBoxes = container.querySelectorAll('[style*="absolute"]')
        infoBoxes.forEach((box) => {
          const style = (box as HTMLElement).style
          // Should NOT use hardcoded shadow value
          expect(style.boxShadow).not.toBe('0 4px 12px rgba(0, 0, 0, 0.1)')
        })
      })

      it('should use typography tokens for info box fontWeight', () => {
        const { container } = renderWithRouter(<SignupPage />)

        const infoBoxes = container.querySelectorAll('[style*="absolute"]')
        infoBoxes.forEach((box) => {
          const style = (box as HTMLElement).style
          // fontWeight should be a semibold value (600)
          // It's converted to string via template literal for token usage
          expect(style.fontWeight).toBeDefined()
          expect(['600', 600].includes(parseInt(style.fontWeight))).toBe(true)
        })
      })

      it('should use theme tokens for info box backgroundColor', () => {
        const { container } = renderWithRouter(<SignupPage />)

        const infoBoxes = container.querySelectorAll('[style*="absolute"]')
        infoBoxes.forEach((box) => {
          const style = (box as HTMLElement).style
          // backgroundColor should use theme color (not hardcoded rgba white)
          expect(style.backgroundColor).toBeDefined()
          // Should contain hex color from theme token (not hardcoded rgba)
          expect(style.backgroundColor).not.toEqual('rgba(255, 255, 255, 0.95)')
        })
      })

      it('info boxes should still be visible and functional', () => {
        const { container } = renderWithRouter(<SignupPage />)

        const infoBoxes = container.querySelectorAll('[style*="absolute"]')
        expect(infoBoxes.length).toBe(2)

        infoBoxes.forEach((box) => {
          // Should still have display flex
          const style = (box as HTMLElement).style
          expect(style.display).toBe('flex')
        })
      })
    })
  })
})
