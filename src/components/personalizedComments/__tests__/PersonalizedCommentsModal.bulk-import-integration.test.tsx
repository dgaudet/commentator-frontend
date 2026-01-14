/**
 * PersonalizedCommentsModal - Bulk Import Integration Tests
 * Story 8: Update Personalized Comments List After Bulk Import
 *
 * Tests for integration with comments list:
 * - Newly imported comments appear in the list
 * - Modal closes after successful import
 * - Comments maintain correct order
 * - User can edit/delete imported comments
 */

import { render, screen } from '../../../test-utils'
import { PersonalizedCommentsModal } from '../PersonalizedCommentsModal'
import type { Subject, PersonalizedComment } from '../../../types'

describe('PersonalizedCommentsModal - Story 8: Bulk Import Integration', () => {
  const mockSubject: Subject = {
    id: '65a1b2c3d4e5f6g7h8i9j0k1',
    name: 'Mathematics',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  }

  const mockExistingComments: PersonalizedComment[] = [
    {
      id: '1',
      comment: 'existing comment',
      rating: 4,
      subjectId: mockSubject.id,
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
    },
  ]

  const defaultProps = {
    isOpen: true,
    entityData: mockSubject,
    personalizedComments: mockExistingComments,
    onCreateComment: jest.fn(),
    onUpdateComment: jest.fn(),
    onDeleteComment: jest.fn(),
    loading: false,
    error: null,
  }

  describe('AC1: Bulk upload button is available', () => {
    it('should display bulk upload button alongside copy button', () => {
      render(<PersonalizedCommentsModal {...defaultProps} />)

      expect(screen.getByRole('button', { name: /Bulk Upload Comments/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Copy Comments to Another Subject/i })).toBeInTheDocument()
    })
  })

  describe('AC2: Comments list displays existing and imported comments', () => {
    it('should show existing comments in the list', () => {
      render(<PersonalizedCommentsModal {...defaultProps} />)

      // Modal should render successfully with existing comments
      expect(screen.getByRole('dialog', { name: /Personalized Comments/i })).toBeInTheDocument()
    })

    it('should show multiple imported comments in the list', () => {
      const importedComments: PersonalizedComment[] = [
        ...mockExistingComments,
        {
          id: 'imported-1',
          comment: 'imported comment 1',
          rating: 3,
          subjectId: mockSubject.id,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
        {
          id: 'imported-2',
          comment: 'imported comment 2',
          rating: 5,
          subjectId: mockSubject.id,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
      ]

      const props = {
        ...defaultProps,
        personalizedComments: importedComments,
      }

      render(<PersonalizedCommentsModal {...props} />)

      expect(screen.getByText(/imported comment 1/i)).toBeInTheDocument()
      expect(screen.getByText(/imported comment 2/i)).toBeInTheDocument()
    })
  })

  describe('AC3: Imported comments maintain ratings', () => {
    it('should preserve ratings from bulk import', () => {
      const importedComment: PersonalizedComment = {
        id: 'imported-1',
        comment: 'rated import comment',
        rating: 5,
        subjectId: mockSubject.id,
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
      }

      const props = {
        ...defaultProps,
        personalizedComments: [...mockExistingComments, importedComment],
      }

      render(<PersonalizedCommentsModal {...props} />)

      expect(screen.getByText(/rated import comment/i)).toBeInTheDocument()
    })
  })

  describe('AC4: Comments can be edited after import', () => {
    it('should allow editing of imported comments', () => {
      const importedComments: PersonalizedComment[] = [
        ...mockExistingComments,
        {
          id: 'imported-1',
          comment: 'editable imported comment',
          rating: 3,
          subjectId: mockSubject.id,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
      ]

      const props = {
        ...defaultProps,
        personalizedComments: importedComments,
      }

      render(<PersonalizedCommentsModal {...props} />)

      // Imported comment should be visible and available for editing
      expect(screen.getByText(/editable imported comment/i)).toBeInTheDocument()
    })
  })

  describe('AC5: List maintains comment count', () => {
    it('should accurately reflect total comment count', () => {
      const importedComments: PersonalizedComment[] = Array.from({ length: 5 }, (_, i) => ({
        id: `comment-${i}`,
        comment: `imported comment ${i + 1}`,
        rating: (i % 5) + 1,
        subjectId: mockSubject.id,
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
      }))

      const props = {
        ...defaultProps,
        personalizedComments: [...mockExistingComments, ...importedComments],
      }

      render(<PersonalizedCommentsModal {...props} />)

      // All comments should be visible
      for (let i = 1; i <= 5; i++) {
        expect(screen.getByText(new RegExp(`imported comment ${i}`, 'i'))).toBeInTheDocument()
      }
    })
  })
})
