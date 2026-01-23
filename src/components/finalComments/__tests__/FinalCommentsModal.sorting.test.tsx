/**
 * FinalCommentsModal Sorting Tests
 * TDD Phase: RED - Tests for sorting final comments by creation date (newest first)
 *
 * User Story: Sort final comments by creation date (newest first) instead of alphabetically
 * Current behavior: Comments sorted alphabetically by firstName (A-Z)
 * Desired behavior: Comments sorted by createdAt in descending order (newest first)
 */

import { render, screen } from '../../../test-utils'
import { FinalCommentsModal } from '../FinalCommentsModal'
import { usePersonalizedComments } from '../../../hooks/usePersonalizedComments'
import { useOutcomeComments } from '../../../hooks/useOutcomeComments'
import type { Class, FinalComment, PersonalizedComment, OutcomeComment } from '../../../types'

// Mock the hooks
jest.mock('../../../hooks/usePersonalizedComments')
jest.mock('../../../hooks/useOutcomeComments')

const mockUsePersonalizedComments = usePersonalizedComments as jest.MockedFunction<
  typeof usePersonalizedComments
>

const mockUseOutcomeComments = useOutcomeComments as jest.MockedFunction<
  typeof useOutcomeComments
>

const mockClass: Class = {
  id: 'class-1',
  name: 'Math 101',
  year: 2024,
  subjectId: 'subject-1',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
}

const mockPersonalizedComments: PersonalizedComment[] = []
const mockOutcomeComments: OutcomeComment[] = []

const mockHandlers = {
  onCreateComment: jest.fn(),
  onUpdateComment: jest.fn(),
  onDeleteComment: jest.fn(),
}

describe('FinalCommentsModal - Sorting by Created Date (Newest First)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUsePersonalizedComments.mockReturnValue({
      personalizedComments: mockPersonalizedComments,
      loading: false,
      error: null,
      loadPersonalizedComments: jest.fn(),
    })
    mockUseOutcomeComments.mockReturnValue({
      outcomeComments: mockOutcomeComments,
      loading: false,
      error: null,
      loadOutcomeComments: jest.fn(),
    })
  })

  describe('Comment Display Order', () => {
    it('should display 3+ final comments in reverse chronological order (newest first)', () => {
      // Comments with different creation times
      const finalComments: FinalComment[] = [
        {
          id: '1',
          classId: 'class-1',
          firstName: 'Charlie',
          lastName: 'Brown',
          grade: 85,
          comment: 'Charlie added first',
          createdAt: '2024-01-15T10:00:00Z', // Oldest
          updatedAt: '2024-01-15T10:00:00Z',
          pronounId: 'pronoun-1',
        },
        {
          id: '2',
          classId: 'class-1',
          firstName: 'Alice',
          lastName: 'Anderson',
          grade: 90,
          comment: 'Alice added second',
          createdAt: '2024-01-20T10:00:00Z', // Middle
          updatedAt: '2024-01-20T10:00:00Z',
          pronounId: 'pronoun-1',
        },
        {
          id: '3',
          classId: 'class-1',
          firstName: 'Bob',
          lastName: 'Baker',
          grade: 88,
          comment: 'Bob added third',
          createdAt: '2024-01-25T10:00:00Z', // Newest
          updatedAt: '2024-01-25T10:00:00Z',
          pronounId: 'pronoun-1',
        },
      ]

      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={finalComments}
          {...mockHandlers}
          loading={false}
          error={null}
          outcomeComments={mockOutcomeComments}
          personalizedComments={mockPersonalizedComments}
          pronouns={[]}
          pronounsLoading={false}
          pronounsError={null}
        />,
      )

      const commentNames = screen.getAllByText(/Bob added third|Alice added second|Charlie added first/)
      const displayedOrder = commentNames.map((el) => el.textContent)

      // Should be: Bob (newest), Alice (middle), Charlie (oldest)
      expect(displayedOrder[0]).toBe('Bob added third')
      expect(displayedOrder[1]).toBe('Alice added second')
      expect(displayedOrder[2]).toBe('Charlie added first')
    })

    it('should display newly added comment at the top of the list', () => {
      const finalComments: FinalComment[] = [
        {
          id: '1',
          classId: 'class-1',
          firstName: 'Alice',
          lastName: 'Anderson',
          grade: 90,
          comment: 'Original comment',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
          pronounId: 'pronoun-1',
        },
        {
          id: '2',
          classId: 'class-1',
          firstName: 'Bob',
          lastName: 'Baker',
          grade: 88,
          comment: 'New comment just added',
          createdAt: '2024-01-25T10:00:00Z', // Most recent
          updatedAt: '2024-01-25T10:00:00Z',
          pronounId: 'pronoun-1',
        },
      ]

      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={finalComments}
          {...mockHandlers}
          loading={false}
          error={null}
          outcomeComments={mockOutcomeComments}
          personalizedComments={mockPersonalizedComments}
          pronouns={[]}
          pronounsLoading={false}
          pronounsError={null}
        />,
      )

      // New comment should appear first in the DOM
      const allText = screen.getAllByText(/New comment just added|Original comment/)
      expect(allText[0]).toHaveTextContent('New comment just added')
    })

    it('should display oldest comment at the bottom of the list', () => {
      const finalComments: FinalComment[] = [
        {
          id: '1',
          classId: 'class-1',
          firstName: 'Bob',
          lastName: 'Baker',
          grade: 88,
          comment: 'New comment',
          createdAt: '2024-01-25T10:00:00Z', // Newest
          updatedAt: '2024-01-25T10:00:00Z',
          pronounId: 'pronoun-1',
        },
        {
          id: '2',
          classId: 'class-1',
          firstName: 'Alice',
          lastName: 'Anderson',
          grade: 90,
          comment: 'Old comment',
          createdAt: '2024-01-15T10:00:00Z', // Oldest
          updatedAt: '2024-01-15T10:00:00Z',
          pronounId: 'pronoun-1',
        },
      ]

      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={finalComments}
          {...mockHandlers}
          loading={false}
          error={null}
          outcomeComments={mockOutcomeComments}
          personalizedComments={mockPersonalizedComments}
          pronouns={[]}
          pronounsLoading={false}
          pronounsError={null}
        />,
      )

      // Old comment should appear last
      const allText = screen.getAllByText(/New comment|Old comment/)
      expect(allText[allText.length - 1]).toHaveTextContent('Old comment')
    })

    it('should handle empty final comments list gracefully', () => {
      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={[]}
          {...mockHandlers}
          loading={false}
          error={null}
          outcomeComments={mockOutcomeComments}
          personalizedComments={mockPersonalizedComments}
          pronouns={[]}
          pronounsLoading={false}
          pronounsError={null}
        />,
      )

      expect(screen.getByText(/No final comments yet/i)).toBeInTheDocument()
    })

    it('should display single comment correctly', () => {
      const finalComments: FinalComment[] = [
        {
          id: '1',
          classId: 'class-1',
          firstName: 'Alice',
          lastName: 'Anderson',
          grade: 90,
          comment: 'Single comment',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
          pronounId: 'pronoun-1',
        },
      ]

      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={finalComments}
          {...mockHandlers}
          loading={false}
          error={null}
          outcomeComments={mockOutcomeComments}
          personalizedComments={mockPersonalizedComments}
          pronouns={[]}
          pronounsLoading={false}
          pronounsError={null}
        />,
      )

      expect(screen.getByText('Single comment')).toBeInTheDocument()
      expect(screen.getByText('Alice Anderson')).toBeInTheDocument()
    })

    it('should maintain consistent order for comments with same createdAt', () => {
      const finalComments: FinalComment[] = [
        {
          id: '1',
          classId: 'class-1',
          firstName: 'Charlie',
          lastName: 'Chen',
          grade: 85,
          comment: 'Comment C',
          createdAt: '2024-01-20T10:00:00Z', // Same time
          updatedAt: '2024-01-20T10:00:00Z',
          pronounId: 'pronoun-1',
        },
        {
          id: '2',
          classId: 'class-1',
          firstName: 'Alice',
          lastName: 'Anderson',
          grade: 90,
          comment: 'Comment A',
          createdAt: '2024-01-20T10:00:00Z', // Same time
          updatedAt: '2024-01-20T10:00:00Z',
          pronounId: 'pronoun-1',
        },
        {
          id: '3',
          classId: 'class-1',
          firstName: 'Bob',
          lastName: 'Baker',
          grade: 88,
          comment: 'Comment B',
          createdAt: '2024-01-20T10:00:00Z', // Same time
          updatedAt: '2024-01-20T10:00:00Z',
          pronounId: 'pronoun-1',
        },
      ]

      const { rerender } = render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={finalComments}
          {...mockHandlers}
          loading={false}
          error={null}
          outcomeComments={mockOutcomeComments}
          personalizedComments={mockPersonalizedComments}
          pronouns={[]}
          pronounsLoading={false}
          pronounsError={null}
        />,
      )

      const firstRender = screen.getAllByText(/Comment [ABC]/)
      const firstOrder = firstRender.map((el) => el.textContent)

      // Re-render should maintain same order
      rerender(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={finalComments}
          {...mockHandlers}
          loading={false}
          error={null}
          outcomeComments={mockOutcomeComments}
          personalizedComments={mockPersonalizedComments}
          pronouns={[]}
          pronounsLoading={false}
          pronounsError={null}
        />,
      )

      const secondRender = screen.getAllByText(/Comment [ABC]/)
      const secondOrder = secondRender.map((el) => el.textContent)

      expect(secondOrder).toEqual(firstOrder)
    })
  })
})
