/**
 * PersonalizedCommentsModal Component Design Token Tests
 * TDD Phase: RED - Writing failing tests first
 * Reference: US-UI-003
 *
 * Testing PersonalizedCommentsModal uses design tokens instead of modalStyles
 */
import { render, screen, fireEvent } from '../../../test-utils'
import { PersonalizedCommentsModal } from '../PersonalizedCommentsModal'
import { colors, spacing, typography, borders } from '../../../theme/tokens'
import type { PersonalizedComment } from '../../../types'

const mockEntityData = {
  id: 1,
  name: 'Mathematics',
}

const mockPersonalizedComments: PersonalizedComment[] = [
  {
    id: 1,
    subjectId: 1,
    comment: 'Shows exceptional problem-solving skills and mathematical reasoning',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
]

describe('US-UI-003: PersonalizedCommentsModal Component Design Tokens', () => {
  const mockOnCreate = jest.fn()
  const mockOnUpdate = jest.fn()
  const mockOnDelete = jest.fn()

  describe('AC1: Container styling with design tokens', () => {
    it('should use design token padding for container', () => {
      const { container } = render(
        <PersonalizedCommentsModal
          isOpen={true}
          entityData={mockEntityData}
          personalizedComments={[]}
          onCreateComment={mockOnCreate}
          onUpdateComment={mockOnUpdate}
          onDeleteComment={mockOnDelete}
          loading={false}
          error={null}
        />,
      )

      const dialog = container.querySelector('[role="dialog"]')

      expect(dialog).toHaveStyle({
        padding: spacing.xl,
        backgroundColor: colors.background.primary,
      })
    })
  })

  describe('AC1: Section styling with design tokens', () => {
    it('should use design token margin bottom for sections', () => {
      render(
        <PersonalizedCommentsModal
          isOpen={true}
          entityData={mockEntityData}
          personalizedComments={[]}
          onCreateComment={mockOnCreate}
          onUpdateComment={mockOnUpdate}
          onDeleteComment={mockOnDelete}
          loading={false}
          error={null}
        />,
      )

      const headings = screen.getAllByRole('heading', { level: 3 })
      const firstSection = headings[0].parentElement

      expect(firstSection).toHaveStyle({
        marginBottom: spacing['2xl'],
      })
    })
  })

  describe('AC1: Heading styling with design tokens', () => {
    it('should use design tokens for heading styles', () => {
      render(
        <PersonalizedCommentsModal
          isOpen={true}
          entityData={mockEntityData}
          personalizedComments={[]}
          onCreateComment={mockOnCreate}
          onUpdateComment={mockOnUpdate}
          onDeleteComment={mockOnDelete}
          loading={false}
          error={null}
        />,
      )

      const heading = screen.getByText('Add New Personalized Comment')

      expect(heading).toHaveStyle({
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.semibold.toString(),
        color: colors.text.primary,
        marginBottom: spacing.lg,
      })
    })
  })

  describe('AC1: Textarea styling with design tokens', () => {
    it('should use design tokens for textarea styles', () => {
      render(
        <PersonalizedCommentsModal
          isOpen={true}
          entityData={mockEntityData}
          personalizedComments={[]}
          onCreateComment={mockOnCreate}
          onUpdateComment={mockOnUpdate}
          onDeleteComment={mockOnDelete}
          loading={false}
          error={null}
        />,
      )

      const textarea = screen.getByPlaceholderText(/Enter personalized comment/i)

      expect(textarea).toHaveStyle({
        width: '100%',
        padding: spacing.md,
        fontSize: typography.fontSize.base,
        border: `${borders.width.thin} solid ${colors.border.default}`,
        borderRadius: borders.radius.md,
      })
    })
  })

  describe('AC1: Character counter styling with design tokens', () => {
    it('should use design tokens for character counter container', () => {
      render(
        <PersonalizedCommentsModal
          isOpen={true}
          entityData={mockEntityData}
          personalizedComments={[]}
          onCreateComment={mockOnCreate}
          onUpdateComment={mockOnUpdate}
          onDeleteComment={mockOnDelete}
          loading={false}
          error={null}
        />,
      )

      const counterText = screen.getByText(/0 \/ 500 characters/)
      const counterContainer = counterText.parentElement

      expect(counterContainer).toHaveStyle({
        marginTop: spacing.sm,
        fontSize: typography.fontSize.sm,
        textAlign: 'right',
      })
    })

    it('should use design tokens for invalid character count color', () => {
      render(
        <PersonalizedCommentsModal
          isOpen={true}
          entityData={mockEntityData}
          personalizedComments={[]}
          onCreateComment={mockOnCreate}
          onUpdateComment={mockOnUpdate}
          onDeleteComment={mockOnDelete}
          loading={false}
          error={null}
        />,
      )

      const counterText = screen.getByText(/0 \/ 500 characters/)

      expect(counterText).toHaveStyle({
        color: colors.semantic.error,
      })
    })

    it('should use design tokens for valid character count color', () => {
      render(
        <PersonalizedCommentsModal
          isOpen={true}
          entityData={mockEntityData}
          personalizedComments={[]}
          onCreateComment={mockOnCreate}
          onUpdateComment={mockOnUpdate}
          onDeleteComment={mockOnDelete}
          loading={false}
          error={null}
        />,
      )

      const textarea = screen.getByPlaceholderText(/Enter personalized comment/i) as HTMLTextAreaElement

      // Simulate typing valid comment
      const validComment = 'This is a valid comment with more than 10 characters'
      fireEvent.change(textarea, { target: { value: validComment } })

      const counterText = screen.getByText(new RegExp(`${validComment.length} / 500 characters`))

      expect(counterText).toHaveStyle({
        color: colors.semantic.success,
      })
    })

    it('should use design tokens for character count hint color', () => {
      render(
        <PersonalizedCommentsModal
          isOpen={true}
          entityData={mockEntityData}
          personalizedComments={[]}
          onCreateComment={mockOnCreate}
          onUpdateComment={mockOnUpdate}
          onDeleteComment={mockOnDelete}
          loading={false}
          error={null}
        />,
      )

      const textarea = screen.getByPlaceholderText(/Enter personalized comment/i) as HTMLTextAreaElement

      // Type short comment
      fireEvent.change(textarea, { target: { value: 'Short' } })

      const hintText = screen.getByText(/\(minimum 10\)/)

      expect(hintText).toHaveStyle({
        color: colors.text.tertiary,
      })
    })
  })

  describe('AC1: Empty state styling with design tokens', () => {
    it('should use design tokens for empty state container', () => {
      render(
        <PersonalizedCommentsModal
          isOpen={true}
          entityData={mockEntityData}
          personalizedComments={[]}
          onCreateComment={mockOnCreate}
          onUpdateComment={mockOnUpdate}
          onDeleteComment={mockOnDelete}
          loading={false}
          error={null}
        />,
      )

      const emptyStateText = screen.getByText(/No personalized comments yet/i)
      const emptyStateContainer = emptyStateText.parentElement

      expect(emptyStateContainer).toHaveStyle({
        textAlign: 'center',
        padding: spacing['2xl'],
        backgroundColor: colors.neutral[50],
        borderRadius: borders.radius.md,
        border: `${borders.width.thin} dashed ${colors.border.default}`,
      })
    })

    it('should use design tokens for empty state text', () => {
      render(
        <PersonalizedCommentsModal
          isOpen={true}
          entityData={mockEntityData}
          personalizedComments={[]}
          onCreateComment={mockOnCreate}
          onUpdateComment={mockOnUpdate}
          onDeleteComment={mockOnDelete}
          loading={false}
          error={null}
        />,
      )

      const emptyStateText = screen.getByText(/No personalized comments yet/i)

      expect(emptyStateText).toHaveStyle({
        fontSize: typography.fontSize.base,
        color: colors.text.tertiary,
      })
    })

    it('should use design tokens for empty state subtext', () => {
      render(
        <PersonalizedCommentsModal
          isOpen={true}
          entityData={mockEntityData}
          personalizedComments={[]}
          onCreateComment={mockOnCreate}
          onUpdateComment={mockOnUpdate}
          onDeleteComment={mockOnDelete}
          loading={false}
          error={null}
        />,
      )

      const emptyStateSubtext = screen.getByText(/Add your first personalized comment/i)

      expect(emptyStateSubtext).toHaveStyle({
        fontSize: typography.fontSize.sm,
        color: colors.text.disabled,
      })
    })
  })

  describe('AC1: Comment card styling with design tokens', () => {
    it('should use design tokens for comment card container', () => {
      render(
        <PersonalizedCommentsModal
          isOpen={true}
          entityData={mockEntityData}
          personalizedComments={mockPersonalizedComments}
          onCreateComment={mockOnCreate}
          onUpdateComment={mockOnUpdate}
          onDeleteComment={mockOnDelete}
          loading={false}
          error={null}
        />,
      )

      const editButton = screen.getByRole('button', { name: /Edit/i })
      // Go up to find the card container: button -> buttonGroup div -> view mode div -> card div
      const commentCard = editButton.parentElement?.parentElement?.parentElement

      expect(commentCard).toHaveStyle({
        padding: spacing.xl,
        border: `${borders.width.thin} solid ${colors.border.default}`,
        borderRadius: borders.radius.md,
        backgroundColor: colors.background.primary,
      })
    })

    it('should use design tokens for comment content text', () => {
      render(
        <PersonalizedCommentsModal
          isOpen={true}
          entityData={mockEntityData}
          personalizedComments={mockPersonalizedComments}
          onCreateComment={mockOnCreate}
          onUpdateComment={mockOnUpdate}
          onDeleteComment={mockOnDelete}
          loading={false}
          error={null}
        />,
      )

      const commentText = screen.getByText(/Shows exceptional problem-solving/i)

      expect(commentText).toHaveStyle({
        fontSize: typography.fontSize.base,
        color: colors.text.primary,
        marginBottom: spacing.md,
      })
    })

    it('should use design tokens for metadata text', () => {
      render(
        <PersonalizedCommentsModal
          isOpen={true}
          entityData={mockEntityData}
          personalizedComments={mockPersonalizedComments}
          onCreateComment={mockOnCreate}
          onUpdateComment={mockOnUpdate}
          onDeleteComment={mockOnDelete}
          loading={false}
          error={null}
        />,
      )

      const metadataText = screen.getByText(/Created:/i)

      expect(metadataText).toHaveStyle({
        fontSize: typography.fontSize.xs,
        color: colors.text.disabled,
        marginBottom: spacing.lg,
      })
    })
  })

  describe('AC1: Button group styling with design tokens', () => {
    it('should use design tokens for button group gap', () => {
      render(
        <PersonalizedCommentsModal
          isOpen={true}
          entityData={mockEntityData}
          personalizedComments={mockPersonalizedComments}
          onCreateComment={mockOnCreate}
          onUpdateComment={mockOnUpdate}
          onDeleteComment={mockOnDelete}
          loading={false}
          error={null}
        />,
      )

      const editButton = screen.getByRole('button', { name: /Edit/i })
      const buttonGroup = editButton.parentElement

      expect(buttonGroup).toHaveStyle({
        display: 'flex',
        gap: spacing.sm,
      })
    })
  })

  describe('AC2: Maintain existing API', () => {
    it('should preserve onCreate callback functionality', () => {
      render(
        <PersonalizedCommentsModal
          isOpen={true}
          entityData={mockEntityData}
          personalizedComments={[]}
          onCreateComment={mockOnCreate}
          onUpdateComment={mockOnUpdate}
          onDeleteComment={mockOnDelete}
          loading={false}
          error={null}
        />,
      )

      expect(screen.getByText('Add New Personalized Comment')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Add Comment/i })).toBeInTheDocument()
    })

    it('should preserve edit/delete functionality for comments', () => {
      render(
        <PersonalizedCommentsModal
          isOpen={true}
          entityData={mockEntityData}
          personalizedComments={mockPersonalizedComments}
          onCreateComment={mockOnCreate}
          onUpdateComment={mockOnUpdate}
          onDeleteComment={mockOnDelete}
          loading={false}
          error={null}
        />,
      )

      expect(screen.getByRole('button', { name: /Edit/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Delete/i })).toBeInTheDocument()
    })

    it('should preserve loading state rendering', () => {
      render(
        <PersonalizedCommentsModal
          isOpen={true}
          entityData={mockEntityData}
          personalizedComments={[]}
          onCreateComment={mockOnCreate}
          onUpdateComment={mockOnUpdate}
          onDeleteComment={mockOnDelete}
          loading={true}
          error={null}
        />,
      )

      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
    })

    it('should preserve error state rendering', () => {
      const errorMessage = 'Failed to load comments'

      render(
        <PersonalizedCommentsModal
          isOpen={true}
          entityData={mockEntityData}
          personalizedComments={[]}
          onCreateComment={mockOnCreate}
          onUpdateComment={mockOnUpdate}
          onDeleteComment={mockOnDelete}
          loading={false}
          error={errorMessage}
        />,
      )

      expect(screen.getByRole('alert')).toHaveTextContent(errorMessage)
    })

    it('should preserve character validation functionality', () => {
      render(
        <PersonalizedCommentsModal
          isOpen={true}
          entityData={mockEntityData}
          personalizedComments={[]}
          onCreateComment={mockOnCreate}
          onUpdateComment={mockOnUpdate}
          onDeleteComment={mockOnDelete}
          loading={false}
          error={null}
        />,
      )

      const addButton = screen.getByRole('button', { name: /Add Comment/i })
      expect(addButton).toBeDisabled() // Should be disabled with empty comment
    })
  })

  describe('AC3: Visual consistency - colors unchanged', () => {
    it('should render container with same visual appearance', () => {
      const { container } = render(
        <PersonalizedCommentsModal
          isOpen={true}
          entityData={mockEntityData}
          personalizedComments={[]}
          onCreateComment={mockOnCreate}
          onUpdateComment={mockOnUpdate}
          onDeleteComment={mockOnDelete}
          loading={false}
          error={null}
        />,
      )

      const dialog = container.querySelector('[role="dialog"]')

      expect(dialog).toHaveStyle({
        backgroundColor: '#FFFFFF',
      })
    })

    it('should render heading with same visual appearance', () => {
      render(
        <PersonalizedCommentsModal
          isOpen={true}
          entityData={mockEntityData}
          personalizedComments={[]}
          onCreateComment={mockOnCreate}
          onUpdateComment={mockOnUpdate}
          onDeleteComment={mockOnDelete}
          loading={false}
          error={null}
        />,
      )

      const heading = screen.getByText('Add New Personalized Comment')

      expect(heading).toHaveStyle({
        fontSize: '1.25rem',
        color: '#111827',
      })
    })

    it('should render empty state with same visual appearance', () => {
      render(
        <PersonalizedCommentsModal
          isOpen={true}
          entityData={mockEntityData}
          personalizedComments={[]}
          onCreateComment={mockOnCreate}
          onUpdateComment={mockOnUpdate}
          onDeleteComment={mockOnDelete}
          loading={false}
          error={null}
        />,
      )

      const emptyStateText = screen.getByText(/No personalized comments yet/i)
      const emptyStateContainer = emptyStateText.parentElement

      expect(emptyStateContainer).toHaveStyle({
        backgroundColor: '#F9FAFB',
        borderRadius: '8px',
      })
    })
  })

  describe('Token value verification', () => {
    it('should verify spacing.xl equals 1.5rem', () => {
      expect(spacing.xl).toBe('1.5rem')
    })

    it('should verify spacing.2xl equals 2rem', () => {
      expect(spacing['2xl']).toBe('2rem')
    })

    it('should verify spacing.lg equals 1rem', () => {
      expect(spacing.lg).toBe('1rem')
    })

    it('should verify spacing.md equals 0.75rem', () => {
      expect(spacing.md).toBe('0.75rem')
    })

    it('should verify spacing.sm equals 0.5rem', () => {
      expect(spacing.sm).toBe('0.5rem')
    })

    it('should verify typography.fontSize.lg equals 1.25rem', () => {
      expect(typography.fontSize.lg).toBe('1.25rem')
    })

    it('should verify typography.fontSize.base equals 1rem', () => {
      expect(typography.fontSize.base).toBe('1rem')
    })

    it('should verify typography.fontSize.sm equals 0.875rem', () => {
      expect(typography.fontSize.sm).toBe('0.875rem')
    })

    it('should verify typography.fontSize.xs equals 0.75rem', () => {
      expect(typography.fontSize.xs).toBe('0.75rem')
    })

    it('should verify colors.background.primary equals #FFFFFF', () => {
      expect(colors.background.primary).toBe('#FFFFFF')
    })

    it('should verify colors.text.primary equals #111827', () => {
      expect(colors.text.primary).toBe('#111827')
    })

    it('should verify colors.text.tertiary equals #6B7280', () => {
      expect(colors.text.tertiary).toBe('#6B7280')
    })

    it('should verify colors.text.disabled equals #9CA3AF', () => {
      expect(colors.text.disabled).toBe('#9CA3AF')
    })

    it('should verify colors.semantic.success equals #10B981', () => {
      expect(colors.semantic.success).toBe('#10B981')
    })

    it('should verify colors.semantic.error equals #DC2626', () => {
      expect(colors.semantic.error).toBe('#DC2626')
    })

    it('should verify colors.neutral[50] equals #F9FAFB', () => {
      expect(colors.neutral[50]).toBe('#F9FAFB')
    })

    it('should verify borders.radius.md equals 8px', () => {
      expect(borders.radius.md).toBe('8px')
    })

    it('should verify borders.width.thin equals 1px', () => {
      expect(borders.width.thin).toBe('1px')
    })
  })
})
