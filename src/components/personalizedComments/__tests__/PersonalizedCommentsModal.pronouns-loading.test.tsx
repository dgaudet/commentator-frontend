/**
 * PersonalizedCommentsModal - Pronouns Loading Indicator Tests
 * TASK-1.3: Visual Loading Indicator for Pronouns Fetching
 *
 * Tests for loading indicator display when pronouns are being fetched
 * Ensures users see visual feedback that pronouns are loading
 */

import { render, screen, waitFor } from '../../../test-utils'
import { PersonalizedCommentsModal } from '../PersonalizedCommentsModal'
import * as pronounsApi from '../../../hooks/usePronounsQuery'
import type { Subject } from '../../../types'

/**
 * Mock the usePronounsQuery hook
 */
jest.mock('../../../hooks/usePronounsQuery')

describe('PersonalizedCommentsModal - Pronouns Loading Indicator', () => {
  const mockSubject: Subject = {
    id: 'subject1',
    name: 'Math',
  }

  const defaultProps = {
    isOpen: true,
    entityData: mockSubject,
    personalizedComments: [],
    onCreateComment: jest.fn().mockResolvedValue(undefined),
    onUpdateComment: jest.fn().mockResolvedValue(undefined),
    onDeleteComment: jest.fn().mockResolvedValue(undefined),
    loading: false,
    error: null,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('AC-1.7: Loading Indicator Display', () => {
    it('should show loading spinner when pronouns are loading in Add section', () => {
      jest.mocked(pronounsApi.usePronounsQuery).mockReturnValue({
        pronouns: [],
        loading: true,
        error: null,
        refetch: jest.fn(),
      },
      )

      render(<PersonalizedCommentsModal {...defaultProps} />)

      // Should have loading spinner visible
      const spinners = screen.getAllByTestId('pronouns-loading-spinner')
      expect(spinners.length).toBeGreaterThanOrEqual(1)
    })

    it('should hide button when pronouns are loading', () => {
      jest.mocked(pronounsApi.usePronounsQuery).mockReturnValue({
        pronouns: [],
        loading: true,
        error: null,
        refetch: jest.fn(),
      },
      )

      render(<PersonalizedCommentsModal {...defaultProps} />)

      // Button should not be visible when loading
      const buttons = screen.queryAllByRole('button', {
        name: /replace pronouns with placeholders/i,
      })
      expect(buttons.length).toBe(0)
    })

    it('should show button when pronouns finish loading', async () => {
      const { rerender } = render(
        <PersonalizedCommentsModal
          {...defaultProps}
        />,
      )

      // First render with loading state
      jest.mocked(pronounsApi.usePronounsQuery).mockReturnValue({
        pronouns: [],
        loading: true,
        error: null,
        refetch: jest.fn(),
      })

      rerender(<PersonalizedCommentsModal {...defaultProps} />)

      // Loading spinner should be visible
      const spinners = screen.getAllByTestId('pronouns-loading-spinner')
      expect(spinners.length).toBeGreaterThanOrEqual(1)

      // Now simulate pronouns finished loading
      jest.mocked(pronounsApi.usePronounsQuery).mockReturnValue({
        pronouns: [
          {
            id: '1',
            pronoun: 'he',
            possessivePronoun: 'his',
            userId: 'user1',
            createdAt: '2025-01-15T00:00:00Z',
            updatedAt: '2025-01-15T00:00:00Z',
          },
        ],
        loading: false,
        error: null,
        refetch: jest.fn(),
      },
      )

      rerender(<PersonalizedCommentsModal {...defaultProps} />)

      // Button should now be visible
      await waitFor(() => {
        const buttons = screen.getAllByRole('button', {
          name: /replace pronouns with placeholders/i,
        })
        expect(buttons.length).toBeGreaterThanOrEqual(1)
      })
    })

    it('should show loading spinner in both Add and Edit sections', async () => {
      const mockComment = {
        id: 'comment1',
        comment: 'Existing comment',
        rating: 3,
        createdAt: '2025-01-15T00:00:00Z',
        updatedAt: '2025-01-15T00:00:00Z',
      }

      jest.mocked(pronounsApi.usePronounsQuery).mockReturnValue({
        pronouns: [],
        loading: true,
        error: null,
        refetch: jest.fn(),
      })

      render(
        <PersonalizedCommentsModal
          {...defaultProps}
          personalizedComments={[mockComment]}
        />,
      )

      // Open Edit mode
      const editButton = screen.getByRole('button', { name: /edit/i })
      editButton.click()

      // Should have loading spinners visible
      await waitFor(() => {
        const spinners = screen.getAllByTestId(/pronouns-loading-spinner/)
        expect(spinners.length).toBeGreaterThanOrEqual(2)
      })
    })

    it('should have consistent loading indicator styling with modal layout', () => {
      jest.mocked(pronounsApi.usePronounsQuery).mockReturnValue({
        pronouns: [],
        loading: true,
        error: null,
        refetch: jest.fn(),
      })

      render(<PersonalizedCommentsModal {...defaultProps} />)

      // Loading spinner should be rendered
      const spinner = screen.getByTestId('pronouns-loading-spinner')
      expect(spinner).toBeInTheDocument()

      // Verify it's in the correct container with proper spacing
      const container = spinner.parentElement
      expect(container).toHaveStyle({
        marginTop: '-1.5rem',
        marginBottom: expect.any(String),
      })
    })
  })

  describe('AC-1.8: Loading and Button State Transitions', () => {
    it('should maintain modal layout during loading state transitions', async () => {
      const { rerender } = render(
        <PersonalizedCommentsModal {...defaultProps} />,
      )

      // Start with loading
      jest.mocked(pronounsApi.usePronounsQuery).mockReturnValue({
        pronouns: [],
        loading: true,
        error: null,
        refetch: jest.fn(),
      })

      rerender(<PersonalizedCommentsModal {...defaultProps} />)

      // Modal should still be visible and properly rendered
      const modal = screen.getByRole('dialog', { name: /personalized comments/i })
      expect(modal).toBeInTheDocument()

      // Loading spinner should be visible
      const spinner = screen.getByTestId('pronouns-loading-spinner')
      expect(spinner).toBeInTheDocument()

      // Transition to loaded state
      jest.mocked(pronounsApi.usePronounsQuery).mockReturnValue({
        pronouns: [
          {
            id: '1',
            pronoun: 'he',
            possessivePronoun: 'his',
            userId: 'user1',
            createdAt: '2025-01-15T00:00:00Z',
            updatedAt: '2025-01-15T00:00:00Z',
          },
        ],
        loading: false,
        error: null,
        refetch: jest.fn(),
      })

      rerender(<PersonalizedCommentsModal {...defaultProps} />)

      // Modal should still be visible
      expect(modal).toBeInTheDocument()

      // Button should now be visible
      await waitFor(() => {
        const button = screen.getByRole('button', {
          name: /replace pronouns with placeholders/i,
        })
        expect(button).toBeInTheDocument()
      })
    })
  })
})
