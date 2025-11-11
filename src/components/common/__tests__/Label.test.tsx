/**
 * Label Component Tests
 * TDD Phase: RED - Writing failing tests first
 * Reference: US-CSS-004
 *
 * Testing standalone Label component with design tokens
 */
import { render, screen } from '../../../test-utils'
import { Label } from '../Label'
import { colors, spacing, typography } from '../../../theme/tokens'

describe('US-CSS-004: Standardized Label Component', () => {
  describe('AC1: Label component API', () => {
    it('should render label with text children', () => {
      render(<Label htmlFor="test-input">Test Label</Label>)

      expect(screen.getByText('Test Label')).toBeInTheDocument()
    })

    it('should set htmlFor attribute correctly', () => {
      render(<Label htmlFor="test-input">Test Label</Label>)
      const label = screen.getByText('Test Label')

      expect(label).toHaveAttribute('for', 'test-input')
    })

    it('should render without required indicator by default', () => {
      render(<Label htmlFor="test-input">Test Label</Label>)

      expect(screen.queryByText('*')).not.toBeInTheDocument()
    })
  })

  describe('AC2: Consistent styling using design tokens', () => {
    it('should apply font size from design tokens', () => {
      render(<Label htmlFor="test-input">Test Label</Label>)
      const label = screen.getByText('Test Label')

      expect(label).toHaveStyle({
        fontSize: typography.fontSize.sm,
      })
    })

    it('should apply font weight from design tokens', () => {
      render(<Label htmlFor="test-input">Test Label</Label>)
      const label = screen.getByText('Test Label')

      expect(label).toHaveStyle({
        fontWeight: typography.fontWeight.medium.toString(),
      })
    })

    it('should apply text color from design tokens', () => {
      render(<Label htmlFor="test-input">Test Label</Label>)
      const label = screen.getByText('Test Label')

      expect(label).toHaveStyle({
        color: colors.text.secondary,
      })
    })

    it('should apply margin bottom from design tokens', () => {
      render(<Label htmlFor="test-input">Test Label</Label>)
      const label = screen.getByText('Test Label')

      expect(label).toHaveStyle({
        marginBottom: spacing.sm,
      })
    })

    it('should display as block element', () => {
      render(<Label htmlFor="test-input">Test Label</Label>)
      const label = screen.getByText('Test Label')

      expect(label).toHaveStyle({
        display: 'block',
      })
    })
  })

  describe('AC3: Required indicator', () => {
    it('should display asterisk when required is true', () => {
      render(
        <Label htmlFor="test-input" required>
          Test Label
        </Label>,
      )

      expect(screen.getByText('*')).toBeInTheDocument()
    })

    it('should style asterisk with error color from design tokens', () => {
      render(
        <Label htmlFor="test-input" required>
          Test Label
        </Label>,
      )
      const asterisk = screen.getByText('*')

      expect(asterisk).toHaveStyle({
        color: colors.semantic.error,
      })
    })

    it('should add left margin to asterisk from design tokens', () => {
      render(
        <Label htmlFor="test-input" required>
          Test Label
        </Label>,
      )
      const asterisk = screen.getByText('*')

      expect(asterisk).toHaveStyle({
        marginLeft: spacing.xs,
      })
    })

    it('should not display asterisk when required is false', () => {
      render(
        <Label htmlFor="test-input" required={false}>
          Test Label
        </Label>,
      )

      expect(screen.queryByText('*')).not.toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should render as label element', () => {
      const { container } = render(<Label htmlFor="test-input">Test Label</Label>)
      const label = container.querySelector('label')

      expect(label).toBeInTheDocument()
    })

    it('should associate with input via htmlFor', () => {
      const { container } = render(
        <>
          <Label htmlFor="my-input">My Label</Label>
          <input id="my-input" />
        </>,
      )

      const input = container.querySelector('#my-input')
      const label = screen.getByText('My Label')

      expect(label).toHaveAttribute('for', 'my-input')
      expect(input).toBeInTheDocument()
    })
  })

  describe('TypeScript type safety', () => {
    it('should accept React node as children', () => {
      render(
        <Label htmlFor="test-input">
          <span>Complex Label Content</span>
        </Label>,
      )

      expect(screen.getByText('Complex Label Content')).toBeInTheDocument()
    })
  })
})
