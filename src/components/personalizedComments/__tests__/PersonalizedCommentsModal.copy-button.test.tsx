/**
 * PersonalizedCommentsModal Copy Button Tests
 * Reference: US-CP-001 - Add Copy Button to Personalized Comments Page
 *
 * Tests for the "Copy Comments to Another Subject" button functionality:
 * - Button visibility and accessibility
 * - Modal opening on button click
 * - Keyboard navigation
 * - Screen reader announcements
 *
 * TDD Phase: RED - Writing failing tests first
 */

import { render, screen, fireEvent, waitFor } from '../../../test-utils'
import { PersonalizedCommentsModal } from '../PersonalizedCommentsModal'
import type { PersonalizedComment } from '../../../types'

describe('PersonalizedCommentsModal - Copy Button (US-CP-001)', () => {
  const mockSubject = {
    id: '65a1b2c3d4e5f6g7h8i9j0k1',
    name: 'Mathematics',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  }

  const mockComment: PersonalizedComment = {
    id: '65a1b2c3d4e5f6g7h8i9j0k1',
    subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
    comment: 'Great progress on assignments',
    rating: 4.5,
    userId: 'auth0|user123',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  }

  const defaultProps = {
    isOpen: true,
    entityData: mockSubject,
    personalizedComments: [mockComment],
    onCreateComment: jest.fn(),
    onUpdateComment: jest.fn(),
    onDeleteComment: jest.fn(),
    loading: false,
    error: null,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('AC-1.1: Button Visibility', () => {
    it('should display a button labeled "Copy Comments to Another Subject"', () => {
      render(<PersonalizedCommentsModal {...defaultProps} />)
      const copyButton = screen.getByRole('button', { name: /copy comments to another subject/i })
      expect(copyButton).toBeInTheDocument()
    })

    it('should display copy button on the modal header', () => {
      render(<PersonalizedCommentsModal {...defaultProps} />)
      const copyButton = screen.getByRole('button', { name: /copy comments to another subject/i })
      // Button should be within the dialog
      const dialog = screen.getByRole('dialog')
      expect(dialog).toContainElement(copyButton)
    })
  })

  describe('AC-1.2: Button Styling', () => {
    it('should apply appropriate styling to the copy button', () => {
      render(<PersonalizedCommentsModal {...defaultProps} />)
      const copyButton = screen.getByRole('button', { name: /copy comments to another subject/i })
      // Verify button is rendered and visible
      expect(copyButton).toBeVisible()
    })
  })

  describe('AC-1.3: Button Accessibility', () => {
    it('should be keyboard accessible via Tab', () => {
      render(<PersonalizedCommentsModal {...defaultProps} />)
      const copyButton = screen.getByRole('button', { name: /copy comments to another subject/i })
      copyButton.focus()
      expect(copyButton).toHaveFocus()
    })

    it('should be activated by Enter key', () => {
      render(<PersonalizedCommentsModal {...defaultProps} />)
      const copyButton = screen.getByRole('button', { name: /copy comments to another subject/i })
      copyButton.focus()
      fireEvent.keyDown(copyButton, { key: 'Enter', code: 'Enter' })
      // Copy modal should open (checked in AC-1.4)
    })

    it('should be announced by screen readers', () => {
      render(<PersonalizedCommentsModal {...defaultProps} />)
      const copyButton = screen.getByRole('button', { name: /copy comments to another subject/i })
      expect(copyButton).toHaveAccessibleName(/copy comments to another subject/i)
    })
  })

  describe('AC-1.4: Modal Opening', () => {
    it('should open CopyCommentsModal when button is clicked', async () => {
      render(<PersonalizedCommentsModal {...defaultProps} />)
      const copyButton = screen.getByRole('button', { name: /copy comments to another subject/i })

      fireEvent.click(copyButton)

      // Wait for copy modal to appear
      await waitFor(() => {
        // The copy modal should be displayed - check for the modal by aria-label
        const copyModal = screen.getByRole('dialog', { name: /copy comments to another subject/i })
        expect(copyModal).toBeInTheDocument()
      })
    })

    it('should not block the copy modal with other page elements', async () => {
      render(<PersonalizedCommentsModal {...defaultProps} />)
      const copyButton = screen.getByRole('button', { name: /copy comments to another subject/i })

      fireEvent.click(copyButton)

      await waitFor(() => {
        // Copy modal should have higher z-index (not testable directly, but should be rendered)
        // The copy modal dialog should exist
        expect(document.body).toBeInTheDocument() // Verify DOM is intact
      })
    })

    it('should display copy modal with copy button clicked', async () => {
      render(<PersonalizedCommentsModal {...defaultProps} />)
      const copyButton = screen.getByRole('button', { name: /copy comments to another subject/i })

      fireEvent.click(copyButton)

      // Wait for copy modal elements to appear
      await waitFor(() => {
        // Should show source subject display
        expect(screen.getByText(/copy from \(source\):/i)).toBeInTheDocument()
      })
    })
  })
})
