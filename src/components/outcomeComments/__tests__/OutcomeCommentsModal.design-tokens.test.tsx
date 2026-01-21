/**
 * OutcomeCommentsModal Component Design Token Tests
 * TDD Phase: RED - Writing failing tests first
 * Reference: US-UI-002
 *
 * Testing OutcomeCommentsModal uses design tokens instead of modalStyles
 */
import { render, screen } from '../../../test-utils'
import { OutcomeCommentsModal } from '../OutcomeCommentsModal'
import { colors, spacing, typography, borders } from '../../../theme/tokens'
import type { OutcomeComment } from '../../../types'

const mockEntityData = {
  id: '65a1b2c3d4e5f6g7h8i9j0k1',
  name: 'Mathematics',
}

const mockOutcomeComments: OutcomeComment[] = [
  {
    id: '65a1b2c3d4e5f6g7h8i9j0k1',
    subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
    userId: 'auth0|mock-user-123',
    comment: 'Demonstrates strong understanding of algebraic concepts',
    upperRange: 100,
    lowerRange: 80,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
]

describe('US-UI-002: OutcomeCommentsModal Component Design Tokens', () => {
  const mockOnCreate = jest.fn()
  const mockOnUpdate = jest.fn()
  const mockOnDelete = jest.fn()

  describe('AC1: Container styling with design tokens', () => {
    it('should use design token padding for container', () => {
      const { container } = render(
        <OutcomeCommentsModal
          isOpen={true}
          entityData={mockEntityData}
          outcomeComments={[]}
          onCreateComment={mockOnCreate}
          onUpdateComment={mockOnUpdate}
          onDeleteComment={mockOnDelete}
          loading={false}
          error={null}
          pronouns={[]}
          pronounsLoading={false}
          pronounsError={null}
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
        <OutcomeCommentsModal
          isOpen={true}
          entityData={mockEntityData}
          outcomeComments={[]}
          onCreateComment={mockOnCreate}
          onUpdateComment={mockOnUpdate}
          onDeleteComment={mockOnDelete}
          loading={false}
          error={null}
          pronouns={[]}
          pronounsLoading={false}
          pronounsError={null}
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
        <OutcomeCommentsModal
          isOpen={true}
          entityData={mockEntityData}
          outcomeComments={[]}
          onCreateComment={mockOnCreate}
          onUpdateComment={mockOnUpdate}
          onDeleteComment={mockOnDelete}
          loading={false}
          error={null}
          pronouns={[]}
          pronounsLoading={false}
          pronounsError={null}
        />,
      )

      const heading = screen.getByText('Add New Outcome Comment')

      expect(heading).toHaveStyle({
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.semibold,
        color: colors.text.primary,
        marginBottom: spacing.lg,
      })
    })
  })

  describe('AC1: Input component migration', () => {
    it('should use standardized Input component for Lower Range', () => {
      render(
        <OutcomeCommentsModal
          isOpen={true}
          entityData={mockEntityData}
          outcomeComments={[]}
          onCreateComment={mockOnCreate}
          onUpdateComment={mockOnUpdate}
          onDeleteComment={mockOnDelete}
          loading={false}
          error={null}
          pronouns={[]}
          pronounsLoading={false}
          pronounsError={null}
        />,
      )

      // Input component should have label with proper styling
      const lowerRangeLabel = screen.getByText(/Lower Range:/i)
      expect(lowerRangeLabel).toBeInTheDocument()

      // Input field should exist with proper attributes
      const lowerRangeInput = screen.getByPlaceholderText(/Min score/i)
      expect(lowerRangeInput).toHaveAttribute('type', 'number')
      expect(lowerRangeInput).toHaveAttribute('id', 'lower-range')
    })

    it('should use standardized Input component for Upper Range', () => {
      render(
        <OutcomeCommentsModal
          isOpen={true}
          entityData={mockEntityData}
          outcomeComments={[]}
          onCreateComment={mockOnCreate}
          onUpdateComment={mockOnUpdate}
          onDeleteComment={mockOnDelete}
          loading={false}
          error={null}
          pronouns={[]}
          pronounsLoading={false}
          pronounsError={null}
        />,
      )

      // Input component should have label with proper styling
      const upperRangeLabel = screen.getByText(/Upper Range:/i)
      expect(upperRangeLabel).toBeInTheDocument()

      // Input field should exist with proper attributes
      const upperRangeInput = screen.getByPlaceholderText(/Max score/i)
      expect(upperRangeInput).toHaveAttribute('type', 'number')
      expect(upperRangeInput).toHaveAttribute('id', 'upper-range')
    })
  })

  describe('AC1: Textarea styling with design tokens', () => {
    it('should use design tokens for textarea styles', () => {
      render(
        <OutcomeCommentsModal
          isOpen={true}
          entityData={mockEntityData}
          outcomeComments={[]}
          onCreateComment={mockOnCreate}
          onUpdateComment={mockOnUpdate}
          onDeleteComment={mockOnDelete}
          loading={false}
          error={null}
          pronouns={[]}
          pronounsLoading={false}
          pronounsError={null}
        />,
      )

      const textarea = screen.getByPlaceholderText(/Enter outcome comment.../i)

      expect(textarea).toHaveStyle({
        width: '100%',
        padding: spacing.md,
        fontSize: typography.fontSize.base,
        border: `${borders.width.thin} solid ${colors.border.default}`,
        borderRadius: borders.radius.md,
      })
    })
  })

  describe('AC1: Empty state styling with design tokens', () => {
    it('should use design tokens for empty state container', () => {
      render(
        <OutcomeCommentsModal
          isOpen={true}
          entityData={mockEntityData}
          outcomeComments={[]}
          onCreateComment={mockOnCreate}
          onUpdateComment={mockOnUpdate}
          onDeleteComment={mockOnDelete}
          loading={false}
          error={null}
          pronouns={[]}
          pronounsLoading={false}
          pronounsError={null}
        />,
      )

      const emptyStateText = screen.getByText(/No outcome comments found/i)
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
        <OutcomeCommentsModal
          isOpen={true}
          entityData={mockEntityData}
          outcomeComments={[]}
          onCreateComment={mockOnCreate}
          onUpdateComment={mockOnUpdate}
          onDeleteComment={mockOnDelete}
          loading={false}
          error={null}
          pronouns={[]}
          pronounsLoading={false}
          pronounsError={null}
        />,
      )

      const emptyStateText = screen.getByText(/No outcome comments found/i)

      expect(emptyStateText).toHaveStyle({
        fontSize: typography.fontSize.base,
        color: colors.text.tertiary,
      })
    })

    it('should use design tokens for empty state subtext', () => {
      render(
        <OutcomeCommentsModal
          isOpen={true}
          entityData={mockEntityData}
          outcomeComments={[]}
          onCreateComment={mockOnCreate}
          onUpdateComment={mockOnUpdate}
          onDeleteComment={mockOnDelete}
          loading={false}
          error={null}
          pronouns={[]}
          pronounsLoading={false}
          pronounsError={null}
        />,
      )

      const emptyStateSubtext = screen.getByText(/Be the first to add an outcome comment/i)

      expect(emptyStateSubtext).toHaveStyle({
        fontSize: typography.fontSize.sm,
        color: colors.text.disabled,
      })
    })
  })

  describe('AC1: Comment card styling with design tokens', () => {
    it('should use design tokens for comment card container', () => {
      render(
        <OutcomeCommentsModal
          isOpen={true}
          entityData={mockEntityData}
          outcomeComments={mockOutcomeComments}
          onCreateComment={mockOnCreate}
          onUpdateComment={mockOnUpdate}
          onDeleteComment={mockOnDelete}
          loading={false}
          error={null}
          pronouns={[]}
          pronounsLoading={false}
          pronounsError={null}
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
        <OutcomeCommentsModal
          isOpen={true}
          entityData={mockEntityData}
          outcomeComments={mockOutcomeComments}
          onCreateComment={mockOnCreate}
          onUpdateComment={mockOnUpdate}
          onDeleteComment={mockOnDelete}
          loading={false}
          error={null}
          pronouns={[]}
          pronounsLoading={false}
          pronounsError={null}
        />,
      )

      const commentText = screen.getByText(/Demonstrates strong understanding/i)

      expect(commentText).toHaveStyle({
        fontSize: typography.fontSize.base,
        color: colors.text.primary,
        marginBottom: spacing.md,
      })
    })

    it('should use design tokens for score range metadata', () => {
      render(
        <OutcomeCommentsModal
          isOpen={true}
          entityData={mockEntityData}
          outcomeComments={mockOutcomeComments}
          onCreateComment={mockOnCreate}
          onUpdateComment={mockOnUpdate}
          onDeleteComment={mockOnDelete}
          loading={false}
          error={null}
          pronouns={[]}
          pronounsLoading={false}
          pronounsError={null}
        />,
      )

      const scoreRange = screen.getByText(/Score Range: 80 - 100/i)

      expect(scoreRange).toHaveStyle({
        fontSize: typography.fontSize.sm,
        color: colors.text.tertiary,
        marginBottom: spacing.md,
      })
    })
  })

  describe('AC1: Flex layout styling with design tokens', () => {
    it('should use design tokens for flex row container', () => {
      render(
        <OutcomeCommentsModal
          isOpen={true}
          entityData={mockEntityData}
          outcomeComments={[]}
          onCreateComment={mockOnCreate}
          onUpdateComment={mockOnUpdate}
          onDeleteComment={mockOnDelete}
          loading={false}
          error={null}
          pronouns={[]}
          pronounsLoading={false}
          pronounsError={null}
        />,
      )

      const lowerRangeInput = screen.getByPlaceholderText(/Min score/i)
      // Input -> flexItem div -> flexRow div
      const flexRowContainer = lowerRangeInput.parentElement?.parentElement

      expect(flexRowContainer).toHaveStyle({
        display: 'flex',
        gap: spacing.lg,
        marginBottom: spacing.lg,
      })
    })

    it('should use design tokens for button group gap', () => {
      render(
        <OutcomeCommentsModal
          isOpen={true}
          entityData={mockEntityData}
          outcomeComments={mockOutcomeComments}
          onCreateComment={mockOnCreate}
          onUpdateComment={mockOnUpdate}
          onDeleteComment={mockOnDelete}
          loading={false}
          error={null}
          pronouns={[]}
          pronounsLoading={false}
          pronounsError={null}
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
        <OutcomeCommentsModal
          isOpen={true}
          entityData={mockEntityData}
          outcomeComments={[]}
          onCreateComment={mockOnCreate}
          onUpdateComment={mockOnUpdate}
          onDeleteComment={mockOnDelete}
          loading={false}
          error={null}
          pronouns={[]}
          pronounsLoading={false}
          pronounsError={null}
        />,
      )

      expect(screen.getByText('Add New Outcome Comment')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Add Comment/i })).toBeInTheDocument()
    })

    it('should preserve edit/delete functionality for comments', () => {
      render(
        <OutcomeCommentsModal
          isOpen={true}
          entityData={mockEntityData}
          outcomeComments={mockOutcomeComments}
          onCreateComment={mockOnCreate}
          onUpdateComment={mockOnUpdate}
          onDeleteComment={mockOnDelete}
          loading={false}
          error={null}
          pronouns={[]}
          pronounsLoading={false}
          pronounsError={null}
        />,
      )

      expect(screen.getByRole('button', { name: /Edit/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Delete/i })).toBeInTheDocument()
    })

    it('should preserve loading state rendering', () => {
      render(
        <OutcomeCommentsModal
          isOpen={true}
          entityData={mockEntityData}
          outcomeComments={[]}
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
        <OutcomeCommentsModal
          isOpen={true}
          entityData={mockEntityData}
          outcomeComments={[]}
          onCreateComment={mockOnCreate}
          onUpdateComment={mockOnUpdate}
          onDeleteComment={mockOnDelete}
          loading={false}
          error={errorMessage}
        />,
      )

      expect(screen.getByRole('alert')).toHaveTextContent(errorMessage)
    })
  })

  describe('AC3: Visual consistency - colors unchanged', () => {
    it('should render container with same visual appearance', () => {
      const { container } = render(
        <OutcomeCommentsModal
          isOpen={true}
          entityData={mockEntityData}
          outcomeComments={[]}
          onCreateComment={mockOnCreate}
          onUpdateComment={mockOnUpdate}
          onDeleteComment={mockOnDelete}
          loading={false}
          error={null}
          pronouns={[]}
          pronounsLoading={false}
          pronounsError={null}
        />,
      )

      const dialog = container.querySelector('[role="dialog"]')

      expect(dialog).toHaveStyle({
        backgroundColor: '#FFFFFF',
      })
    })

    it('should render heading with same visual appearance', () => {
      render(
        <OutcomeCommentsModal
          isOpen={true}
          entityData={mockEntityData}
          outcomeComments={[]}
          onCreateComment={mockOnCreate}
          onUpdateComment={mockOnUpdate}
          onDeleteComment={mockOnDelete}
          loading={false}
          error={null}
          pronouns={[]}
          pronounsLoading={false}
          pronounsError={null}
        />,
      )

      const heading = screen.getByText('Add New Outcome Comment')

      expect(heading).toHaveStyle({
        fontSize: '1.25rem',
        color: '#111827',
      })
    })

    it('should render empty state with same visual appearance', () => {
      render(
        <OutcomeCommentsModal
          isOpen={true}
          entityData={mockEntityData}
          outcomeComments={[]}
          onCreateComment={mockOnCreate}
          onUpdateComment={mockOnUpdate}
          onDeleteComment={mockOnDelete}
          loading={false}
          error={null}
          pronouns={[]}
          pronounsLoading={false}
          pronounsError={null}
        />,
      )

      const emptyStateText = screen.getByText(/No outcome comments found/i)
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
