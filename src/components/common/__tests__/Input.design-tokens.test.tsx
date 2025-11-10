/**
 * Input Component Design Token Tests
 * TDD Phase: RED - Writing failing tests first
 * Reference: US-CSS-003
 *
 * Testing Input component uses design tokens consistently
 */
import { render, screen } from '../../../test-utils'
import { Input } from '../Input'
import { colors, spacing, typography, borders } from '../../../theme/tokens'

describe('US-CSS-003: Input Component Design Tokens', () => {
  describe('AC2: Consistent styling using design tokens', () => {
    it('should style input with design token padding', () => {
      render(<Input label="Test" id="test" />)
      const input = screen.getByLabelText('Test')

      expect(input).toHaveStyle({
        padding: spacing.md,
      })
    })

    it('should style input with design token font size', () => {
      render(<Input label="Test" id="test" />)
      const input = screen.getByLabelText('Test')

      expect(input).toHaveStyle({
        fontSize: typography.fontSize.base,
      })
    })

    it('should style input with design token border', () => {
      render(<Input label="Test" id="test" />)
      const input = screen.getByLabelText('Test')

      expect(input).toHaveStyle({
        border: `${borders.width.thin} solid ${colors.border.default}`,
        borderRadius: borders.radius.md,
      })
    })

    it('should style input with design token background', () => {
      render(<Input label="Test" id="test" />)
      const input = screen.getByLabelText('Test')

      expect(input).toHaveStyle({
        backgroundColor: colors.background.primary,
      })
    })
  })

  describe('AC3: Error state styling', () => {
    it('should apply error border color from design tokens', () => {
      render(<Input label="Test" id="test" error="Error message" />)
      const input = screen.getByLabelText('Test')

      expect(input).toHaveStyle({
        border: `${borders.width.thin} solid ${colors.semantic.error}`,
      })
    })

    it('should style error message with design tokens', () => {
      render(<Input label="Test" id="test" error="Error message" />)
      const errorMessage = screen.getByText('Error message')

      expect(errorMessage).toHaveStyle({
        marginTop: spacing.sm,
        fontSize: typography.fontSize.sm,
        color: colors.semantic.error,
      })
    })

    it('should handle boolean error prop', () => {
      render(<Input label="Test" id="test" error={true} />)
      const input = screen.getByLabelText('Test')

      expect(input).toHaveStyle({
        border: `${borders.width.thin} solid ${colors.semantic.error}`,
      })
    })

    it('should not display error message for boolean error', () => {
      render(<Input label="Test" id="test" error={true} />)

      // Should only show border change, no text message
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })
  })

  describe('AC4: Required indicator styling', () => {
    it('should style required asterisk with error color from tokens', () => {
      render(<Input label="Test" id="test" required />)
      const asterisk = screen.getByText('*')

      expect(asterisk).toHaveStyle({
        color: colors.semantic.error,
        marginLeft: spacing.xs,
      })
    })
  })

  describe('AC5: Label styling', () => {
    it('should style label with design tokens', () => {
      render(<Input label="Test Label" id="test" />)
      const label = screen.getByText('Test Label')

      expect(label).toHaveStyle({
        display: 'block',
        marginBottom: spacing.sm,
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.medium.toString(),
        color: colors.text.secondary,
      })
    })
  })

  describe('AC1: Optional label prop', () => {
    it('should render without label when label prop is not provided', () => {
      const { container } = render(<Input id="test" />)
      const label = container.querySelector('label')

      expect(label).not.toBeInTheDocument()
    })

    it('should render input without label styling when label omitted', () => {
      render(<Input id="test" placeholder="No label" />)
      const input = screen.getByPlaceholderText('No label')

      expect(input).toBeInTheDocument()
      expect(input).toHaveStyle({
        padding: spacing.md,
      })
    })
  })

  describe('Container spacing', () => {
    it('should use design token spacing for container margin', () => {
      const { container } = render(<Input label="Test" id="test" />)
      const wrapper = container.firstChild as HTMLElement

      expect(wrapper).toHaveStyle({
        marginBottom: spacing.lg,
      })
    })
  })

  describe('TypeScript type safety', () => {
    it('should accept all standard input props', () => {
      render(
        <Input
          label="Test"
          id="test"
          type="number"
          placeholder="Enter number"
          disabled={false}
          required={false}
          min={0}
          max={100}
        />,
      )

      const input = screen.getByLabelText('Test') as HTMLInputElement
      expect(input.type).toBe('number')
      expect(input.placeholder).toBe('Enter number')
    })
  })
})
