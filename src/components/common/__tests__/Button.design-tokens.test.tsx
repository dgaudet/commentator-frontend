/**
 * Button Component Design Token Tests
 * TDD Phase: RED - Writing failing tests first
 * Reference: US-CSS-005
 *
 * Testing Button component uses design tokens consistently
 */
import { render, screen } from '../../../test-utils'
import { Button } from '../Button'
import { colors, spacing, typography, borders, shadows } from '../../../theme/tokens'

describe('US-CSS-005: Button Component Design Tokens', () => {
  describe('AC1: Base styling with design tokens', () => {
    it('should use design token padding', () => {
      render(<Button>Test</Button>)
      const button = screen.getByText('Test')

      // padding: '12px 24px' should use spacing tokens
      // 12px = 0.75rem = spacing.md, 24px = 1.5rem = spacing.xl
      expect(button).toHaveStyle({
        padding: `${spacing.md} ${spacing.xl}`,
      })
    })

    it('should use design token border radius', () => {
      render(<Button>Test</Button>)
      const button = screen.getByText('Test')

      expect(button).toHaveStyle({
        borderRadius: borders.radius.md,
      })
    })

    it('should use design token font size', () => {
      render(<Button>Test</Button>)
      const button = screen.getByText('Test')

      expect(button).toHaveStyle({
        fontSize: typography.fontSize.base,
      })
    })

    it('should use design token font weight', () => {
      render(<Button>Test</Button>)
      const button = screen.getByText('Test')

      expect(button).toHaveStyle({
        fontWeight: typography.fontWeight.semibold.toString(),
      })
    })

    it('should use design token box shadow', () => {
      render(<Button>Test</Button>)
      const button = screen.getByText('Test')

      expect(button).toHaveStyle({
        boxShadow: shadows.md,
      })
    })

    it('should use design token border width', () => {
      render(<Button>Test</Button>)
      const button = screen.getByText('Test')

      // Border should use tokens (even if transparent)
      expect(button).toHaveStyle({
        border: `${borders.width.thick} solid transparent`,
      })
    })
  })

  describe('AC1: Primary variant with design tokens', () => {
    it('should use primary color from design tokens', () => {
      render(<Button variant="primary">Primary</Button>)
      const button = screen.getByText('Primary')

      expect(button).toHaveStyle({
        backgroundColor: colors.primary.main,
        color: colors.text.inverse,
        borderColor: colors.primary.main,
      })
    })
  })

  describe('AC1: Secondary variant with design tokens', () => {
    it('should use neutral colors from design tokens', () => {
      render(<Button variant="secondary">Secondary</Button>)
      const button = screen.getByText('Secondary')

      expect(button).toHaveStyle({
        backgroundColor: colors.neutral[200],
        color: colors.neutral[800],
        borderColor: colors.neutral[200],
      })
    })
  })

  describe('AC1: Danger variant with design tokens', () => {
    it('should use semantic error color from design tokens', () => {
      render(<Button variant="danger">Danger</Button>)
      const button = screen.getByText('Danger')

      expect(button).toHaveStyle({
        backgroundColor: colors.semantic.error,
        color: colors.text.inverse,
        borderColor: colors.semantic.error,
      })
    })
  })

  describe('AC2: Maintain existing API', () => {
    it('should preserve onClick functionality', () => {
      const handleClick = jest.fn()
      render(<Button onClick={handleClick}>Click</Button>)

      screen.getByText('Click').click()
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should preserve disabled functionality', () => {
      render(<Button disabled>Disabled</Button>)

      expect(screen.getByText('Disabled')).toBeDisabled()
    })

    it('should preserve type attribute', () => {
      render(<Button type="submit">Submit</Button>)

      expect(screen.getByText('Submit')).toHaveAttribute('type', 'submit')
    })

    it('should preserve className prop', () => {
      render(<Button className="custom">Custom</Button>)

      expect(screen.getByText('Custom')).toHaveClass('custom')
    })

    it('should preserve variant prop', () => {
      render(<Button variant="secondary">Secondary</Button>)

      expect(screen.getByText('Secondary')).toHaveStyle({
        backgroundColor: colors.neutral[200],
      })
    })
  })

  describe('AC3: Visual consistency - colors unchanged', () => {
    it('should render primary button with same visual appearance', () => {
      render(<Button variant="primary">Primary</Button>)
      const button = screen.getByText('Primary')

      // Colors should be identical to original hardcoded values
      expect(button).toHaveStyle({
        backgroundColor: '#0066FF',
        color: '#FFFFFF',
      })
    })

    it('should render secondary button with same visual appearance', () => {
      render(<Button variant="secondary">Secondary</Button>)
      const button = screen.getByText('Secondary')

      expect(button).toHaveStyle({
        backgroundColor: '#E5E7EB',
        color: '#1F2937',
      })
    })

    it('should render danger button with same visual appearance', () => {
      render(<Button variant="danger">Danger</Button>)
      const button = screen.getByText('Danger')

      expect(button).toHaveStyle({
        backgroundColor: '#DC2626',
        color: '#FFFFFF',
      })
    })
  })

  describe('Spacing values using design tokens', () => {
    it('should use 0.75rem (12px) vertical padding from spacing.md', () => {
      render(<Button>Test</Button>)
      const button = screen.getByText('Test')

      // Verify spacing.md = 0.75rem = 12px
      expect(spacing.md).toBe('0.75rem')
      expect(button).toHaveStyle({
        padding: '0.75rem 1.5rem',
      })
    })

    it('should use 1.5rem (24px) horizontal padding from spacing.xl', () => {
      render(<Button>Test</Button>)
      const button = screen.getByText('Test')

      // Verify spacing.xl = 1.5rem = 24px
      expect(spacing.xl).toBe('1.5rem')
    })
  })
})
