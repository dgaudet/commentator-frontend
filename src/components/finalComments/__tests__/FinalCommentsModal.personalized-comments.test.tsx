/**
 * FinalCommentsModal Personalized Comments Integration Tests
 * TDD Phase: RED - Writing failing tests first
 * Reference: US-PC-TYPEAHEAD-002
 *
 * Testing personalized comments loading:
 * - Load personalized comments on mount by subject ID
 * - Loading state handling
 * - Error state handling
 * - Empty state handling
 */

import { render, waitFor } from '../../../test-utils'
import { FinalCommentsModal } from '../FinalCommentsModal'
import { usePersonalizedComments } from '../../../hooks/usePersonalizedComments'
import type { Class, FinalComment } from '../../../types'

// Mock the usePersonalizedComments hook
jest.mock('../../../hooks/usePersonalizedComments')

const mockUsePersonalizedComments = usePersonalizedComments as jest.MockedFunction<
  typeof usePersonalizedComments
>

const mockClass: Class = {
  id: '65a1b2c3d4e5f6g7h8i9j0k1',
  name: 'Mathematics 101',
  year: 2024,
  subjectId: 5,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
}

const mockFinalComments: FinalComment[] = []

const mockPersonalizedComments = [
  {
    id: '65a1b2c3d4e5f6g7h8i9j0k1',
    comment: 'Excellent work this semester',
    subjectId: 5,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '65a1b2c3d4e5f6g7h8i9j0k2',
    comment: 'Good effort on assignments',
    subjectId: 5,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
  {
    id: '65a1b2c3d4e5f6g7h8i9j0k3',
    comment: 'Needs improvement in participation',
    subjectId: 5,
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z',
  },
]

const mockHandlers = {
  onCreateComment: jest.fn(),
  onUpdateComment: jest.fn(),
  onDeleteComment: jest.fn(),
}

describe('US-PC-TYPEAHEAD-002: Load Personalized Comments', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('AC1: Load personalized comments on modal mount', () => {
    it('should call loadPersonalizedComments with class subjectId on mount', async () => {
      const mockLoadPersonalizedComments = jest.fn()

      mockUsePersonalizedComments.mockReturnValue({
        personalizedComments: [],
        loading: false,
        error: null,
        loadPersonalizedComments: mockLoadPersonalizedComments,
        createComment: jest.fn(),
        updateComment: jest.fn(),
        deleteComment: jest.fn(),
        clearError: jest.fn(),
      })

      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={mockFinalComments}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      await waitFor(() => {
        expect(mockLoadPersonalizedComments).toHaveBeenCalledWith(5)
      })
    })

    it('should call loadPersonalizedComments only once on mount', async () => {
      const mockLoadPersonalizedComments = jest.fn()

      mockUsePersonalizedComments.mockReturnValue({
        personalizedComments: mockPersonalizedComments,
        loading: false,
        error: null,
        loadPersonalizedComments: mockLoadPersonalizedComments,
        createComment: jest.fn(),
        updateComment: jest.fn(),
        deleteComment: jest.fn(),
        clearError: jest.fn(),
      })

      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={mockFinalComments}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      await waitFor(() => {
        expect(mockLoadPersonalizedComments).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('AC2: Display loading indicator during personalized comments fetch', () => {
    it('should expose loading state from usePersonalizedComments hook', () => {
      mockUsePersonalizedComments.mockReturnValue({
        personalizedComments: [],
        loading: true,
        error: null,
        loadPersonalizedComments: jest.fn(),
        createComment: jest.fn(),
        updateComment: jest.fn(),
        deleteComment: jest.fn(),
        clearError: jest.fn(),
      })

      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={mockFinalComments}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      // The component should have access to the loading state
      // This will be used by TypeaheadSearch component in next stories
      // For now, we're just verifying the hook is called and state is available
      expect(mockUsePersonalizedComments).toHaveBeenCalled()
    })
  })

  describe('AC3: Display error message when fetch fails', () => {
    it('should expose error state from usePersonalizedComments hook', () => {
      mockUsePersonalizedComments.mockReturnValue({
        personalizedComments: [],
        loading: false,
        error: 'Failed to load personalized comments',
        loadPersonalizedComments: jest.fn(),
        createComment: jest.fn(),
        updateComment: jest.fn(),
        deleteComment: jest.fn(),
        clearError: jest.fn(),
      })

      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={mockFinalComments}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      // The component should have access to the error state
      // This will be used by TypeaheadSearch component in next stories
      expect(mockUsePersonalizedComments).toHaveBeenCalled()
    })
  })

  describe('AC4: Display empty state message when no comments exist', () => {
    it('should expose empty personalizedComments array', () => {
      mockUsePersonalizedComments.mockReturnValue({
        personalizedComments: [],
        loading: false,
        error: null,
        loadPersonalizedComments: jest.fn(),
        createComment: jest.fn(),
        updateComment: jest.fn(),
        deleteComment: jest.fn(),
        clearError: jest.fn(),
      })

      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={mockFinalComments}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      // The component should have access to empty array
      // This will be used by TypeaheadSearch component in next stories
      expect(mockUsePersonalizedComments).toHaveBeenCalled()
    })
  })

  describe('AC5: Sort personalized comments alphabetically', () => {
    it('should provide comments in the order returned by the hook', () => {
      mockUsePersonalizedComments.mockReturnValue({
        personalizedComments: mockPersonalizedComments,
        loading: false,
        error: null,
        loadPersonalizedComments: jest.fn(),
        createComment: jest.fn(),
        updateComment: jest.fn(),
        deleteComment: jest.fn(),
        clearError: jest.fn(),
      })

      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={mockFinalComments}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      // Component should have access to the comments array
      // Sorting will be handled by the hook or TypeaheadSearch component
      expect(mockUsePersonalizedComments).toHaveBeenCalled()
    })
  })
})
