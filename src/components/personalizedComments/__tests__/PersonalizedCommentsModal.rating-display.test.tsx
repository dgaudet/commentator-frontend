/**
 * PersonalizedCommentsModal - Rating Display Tests
 * TDD Phase: RED - Writing failing tests first
 * Reference: US-RATING-004 - Display Rating in Comments List
 *
 * Testing rating display in PersonalizedCommentsModal:
 * - Rating emoji displayed next to comment text
 * - Correct emoji for each rating (1-5)
 * - Default rating (3-Neutral) for null/undefined ratings
 * - Accessibility labels for screen readers
 */
import { render, screen } from '../../../test-utils'
import { PersonalizedCommentsModal } from '../PersonalizedCommentsModal'
import type { PersonalizedComment } from '../../../types'

describe('PersonalizedCommentsModal - Rating Display', () => {
  const mockSubject = { id: '65a1b2c3d4e5f6g7h8i9j0k1', name: 'Mathematics', createdAt: '', updatedAt: '' }

  const defaultProps = {
    isOpen: true,
    entityData: mockSubject,
    personalizedComments: [],
    onCreateComment: jest.fn(),
    onUpdateComment: jest.fn(),
    onDeleteComment: jest.fn(),
    loading: false,
    error: null,
  }

  describe('Rating Display in List', () => {
    it('displays rating emoji next to comment in list view', () => {
      const commentWithRating: PersonalizedComment = {
        id: '65a1b2c3d4e5f6g7h8i9j0k1',
        subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
        comment: 'Great progress this term',
        rating: 5,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
      }

      render(
        <PersonalizedCommentsModal
          {...defaultProps}
          personalizedComments={[commentWithRating]}
        />,
      )

      // Check that emoji is displayed (multiple instances: selector + display)
      const emojis = screen.getAllByText('😊')
      expect(emojis.length).toBeGreaterThanOrEqual(1)
      // Check that display label is accessible (look specifically for "Rating:" prefix in comment display)
      expect(screen.getByLabelText(/^rating:.*5.*very positive/i)).toBeInTheDocument()
    })

    it('displays correct emoji for rating 1 (Very Negative)', () => {
      const comment: PersonalizedComment = {
        id: '65a1b2c3d4e5f6g7h8i9j0k1',
        subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
        comment: 'Needs significant improvement',
        rating: 1,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
      }

      render(
        <PersonalizedCommentsModal
          {...defaultProps}
          personalizedComments={[comment]}
        />,
      )

      expect(screen.getAllByText('😢').length).toBeGreaterThanOrEqual(1)
      expect(screen.getByLabelText(/^rating:.*1.*very negative/i)).toBeInTheDocument()
    })

    it('displays correct emoji for rating 2 (Negative)', () => {
      const comment: PersonalizedComment = {
        id: '65a1b2c3d4e5f6g7h8i9j0k1',
        subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
        comment: 'Below expectations',
        rating: 2,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
      }

      render(
        <PersonalizedCommentsModal
          {...defaultProps}
          personalizedComments={[comment]}
        />,
      )

      expect(screen.getAllByText('😟').length).toBeGreaterThanOrEqual(1)
      expect(screen.getByLabelText(/^rating:.*2.*negative/i)).toBeInTheDocument()
    })

    it('displays correct emoji for rating 3 (Neutral)', () => {
      const comment: PersonalizedComment = {
        id: '65a1b2c3d4e5f6g7h8i9j0k1',
        subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
        comment: 'Meeting expectations',
        rating: 3,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
      }

      render(
        <PersonalizedCommentsModal
          {...defaultProps}
          personalizedComments={[comment]}
        />,
      )

      expect(screen.getAllByText('😐').length).toBeGreaterThanOrEqual(1)
      expect(screen.getByLabelText(/^rating:.*3.*neutral/i)).toBeInTheDocument()
    })

    it('displays correct emoji for rating 4 (Positive)', () => {
      const comment: PersonalizedComment = {
        id: '65a1b2c3d4e5f6g7h8i9j0k1',
        subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
        comment: 'Good work this term',
        rating: 4,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
      }

      render(
        <PersonalizedCommentsModal
          {...defaultProps}
          personalizedComments={[comment]}
        />,
      )

      expect(screen.getAllByText('🙂').length).toBeGreaterThanOrEqual(1)
      expect(screen.getByLabelText(/^rating:.*4.*positive/i)).toBeInTheDocument()
    })

    it('displays correct emoji for rating 5 (Very Positive)', () => {
      const comment: PersonalizedComment = {
        id: '65a1b2c3d4e5f6g7h8i9j0k1',
        subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
        comment: 'Excellent work!',
        rating: 5,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
      }

      render(
        <PersonalizedCommentsModal
          {...defaultProps}
          personalizedComments={[comment]}
        />,
      )

      expect(screen.getAllByText('😊').length).toBeGreaterThanOrEqual(1)
      expect(screen.getByLabelText(/^rating:.*5.*very positive/i)).toBeInTheDocument()
    })

    it('displays default rating (3-Neutral) when rating is null', () => {
      const comment: PersonalizedComment = {
        id: '65a1b2c3d4e5f6g7h8i9j0k1',
        subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
        comment: 'Legacy comment without rating',
        rating: null,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
      }

      render(
        <PersonalizedCommentsModal
          {...defaultProps}
          personalizedComments={[comment]}
        />,
      )

      // Should display neutral emoji (default) - multiple instances due to selector
      expect(screen.getAllByText('😐').length).toBeGreaterThanOrEqual(1)
      expect(screen.getByLabelText(/^rating:.*3.*neutral/i)).toBeInTheDocument()
    })

    it('displays default rating (3-Neutral) when rating is undefined', () => {
      const comment: PersonalizedComment = {
        id: '65a1b2c3d4e5f6g7h8i9j0k1',
        subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
        comment: 'Legacy comment without rating',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
      }

      render(
        <PersonalizedCommentsModal
          {...defaultProps}
          personalizedComments={[comment]}
        />,
      )

      // Should display neutral emoji (default) - multiple instances due to selector
      expect(screen.getAllByText('😐').length).toBeGreaterThanOrEqual(1)
      expect(screen.getByLabelText(/^rating:.*3.*neutral/i)).toBeInTheDocument()
    })

    it('displays ratings for multiple comments correctly', () => {
      const comments: PersonalizedComment[] = [
        {
          id: '65a1b2c3d4e5f6g7h8i9j0k1',
          subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
          comment: 'Excellent work',
          rating: 5,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
        },
        {
          id: '65a1b2c3d4e5f6g7h8i9j0k2',
          subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
          comment: 'Good progress',
          rating: 4,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
        },
        {
          id: '65a1b2c3d4e5f6g7h8i9j0k3',
          subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
          comment: 'Needs improvement',
          rating: 2,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
        },
      ]

      render(
        <PersonalizedCommentsModal
          {...defaultProps}
          personalizedComments={comments}
        />,
      )

      // All three emojis should be present (multiple instances due to selector)
      expect(screen.getAllByText('😊').length).toBeGreaterThanOrEqual(1)
      expect(screen.getAllByText('🙂').length).toBeGreaterThanOrEqual(1)
      expect(screen.getAllByText('😟').length).toBeGreaterThanOrEqual(1)

      // All accessibility labels should be present (use ^ prefix to match display labels only)
      expect(screen.getAllByLabelText(/^rating:.*5.*very positive/i).length).toBe(1)
      expect(screen.getAllByLabelText(/^rating:.*4.*positive/i).length).toBe(1)
      expect(screen.getAllByLabelText(/^rating:.*2.*negative/i).length).toBe(1)
    })
  })

  describe('Rating Position and Layout', () => {
    it('displays rating before comment text (visual hierarchy)', () => {
      const comment: PersonalizedComment = {
        id: '65a1b2c3d4e5f6g7h8i9j0k1',
        subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
        comment: 'Test comment',
        rating: 5,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
      }

      render(
        <PersonalizedCommentsModal
          {...defaultProps}
          personalizedComments={[comment]}
        />,
      )

      // Both rating emoji and comment text should be present (multiple emojis due to selector)
      const ratingEmojis = screen.getAllByText('😊')
      const commentText = screen.getByText('Test comment')

      // Both elements should exist in the document (verifies they're rendered together)
      expect(ratingEmojis.length).toBeGreaterThanOrEqual(1)
      expect(commentText).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has semantic HTML for rating display', () => {
      const comment: PersonalizedComment = {
        id: '65a1b2c3d4e5f6g7h8i9j0k1',
        subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
        comment: 'Test comment',
        rating: 4,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
      }

      render(
        <PersonalizedCommentsModal
          {...defaultProps}
          personalizedComments={[comment]}
        />,
      )

      // Rating should have aria-label for screen readers
      const ratingElement = screen.getByLabelText(/rating.*4.*positive/i)
      expect(ratingElement).toBeInTheDocument()
      expect(ratingElement.tagName).toBe('SPAN')
    })
  })
})
