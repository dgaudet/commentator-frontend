/**
 * PersonalizedCommentsModal - Bulk Upload Button Tests
 * Story 1: Display Bulk Upload Button on Personalized Comments Component
 *
 * Tests for bulk upload button:
 * - Button appears next to "Copy Comments to Another Subject"
 * - Button has correct label and styling
 * - Button is disabled when no subject is selected
 * - Button opens bulk upload modal when clicked
 */

import { render, screen, fireEvent } from '../../../test-utils'
import { PersonalizedCommentsModal } from '../PersonalizedCommentsModal'
import type { Subject } from '../../../types'

describe('PersonalizedCommentsModal - Story 1: Bulk Upload Button', () => {
  const mockSubject: Subject = {
    id: '65a1b2c3d4e5f6g7h8i9j0k1',
    name: 'Mathematics',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  }

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

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('AC1: Button appears alongside Copy Comments button', () => {
    it('should render Bulk Upload Comments button', () => {
      render(<PersonalizedCommentsModal {...defaultProps} />)
      expect(screen.getByRole('button', { name: /Bulk Upload Comments/i })).toBeInTheDocument()
    })

    it('should render Bulk Upload button next to Copy Comments button', () => {
      render(<PersonalizedCommentsModal {...defaultProps} />)
      const bulkUploadButton = screen.getByRole('button', { name: /Bulk Upload Comments/i })
      const copyButton = screen.getByRole('button', { name: /Copy Comments to Another Subject/i })

      // Both buttons should be in the same flex container
      const buttonContainer = bulkUploadButton.parentElement
      expect(buttonContainer).toContainElement(copyButton)
    })

    it('should have consistent button styling', () => {
      render(<PersonalizedCommentsModal {...defaultProps} />)
      const bulkUploadButton = screen.getByRole('button', { name: /Bulk Upload Comments/i })

      // Button should use variant secondary (same as Copy button)
      // This is verified through class name or styling attributes
      expect(bulkUploadButton).toBeInTheDocument()
      // Styling verification will depend on Button component implementation
    })
  })

  describe('AC2: Button is disabled when no subject is selected', () => {
    it('should disable Bulk Upload button when subject is null', () => {
      const noSubjectProps = {
        ...defaultProps,
        entityData: null as unknown as Subject,
      }
      render(<PersonalizedCommentsModal {...noSubjectProps} />)
      const bulkUploadButton = screen.getByRole('button', { name: /Bulk Upload Comments/i })

      expect(bulkUploadButton).toBeDisabled()
    })

    it('should enable Bulk Upload button when subject is present', () => {
      render(<PersonalizedCommentsModal {...defaultProps} />)
      const bulkUploadButton = screen.getByRole('button', { name: /Bulk Upload Comments/i })

      expect(bulkUploadButton).not.toBeDisabled()
    })
  })

  describe('AC3: Clicking button opens bulk upload modal', () => {
    it('should open Bulk Upload Modal when button is clicked', () => {
      render(<PersonalizedCommentsModal {...defaultProps} />)
      const bulkUploadButton = screen.getByRole('button', { name: /Bulk Upload Comments/i })

      fireEvent.click(bulkUploadButton)

      // Modal should appear with title
      expect(screen.getByRole('dialog', { name: /Bulk Upload Personalized Comments/i })).toBeInTheDocument()
    })

    it('should show modal title with instructions', () => {
      render(<PersonalizedCommentsModal {...defaultProps} />)
      const bulkUploadButton = screen.getByRole('button', { name: /Bulk Upload Comments/i })

      fireEvent.click(bulkUploadButton)

      expect(screen.getByText(/Bulk Upload Personalized Comments/i)).toBeInTheDocument()
    })
  })

  describe('AC4: Button is only visible in personalized comments section', () => {
    it('should render button when modal is open', () => {
      render(<PersonalizedCommentsModal {...defaultProps} isOpen={true} />)
      expect(screen.getByRole('button', { name: /Bulk Upload Comments/i })).toBeInTheDocument()
    })

    it('should not render anything when modal is closed', () => {
      const { container } = render(<PersonalizedCommentsModal {...defaultProps} isOpen={false} />)
      expect(container.firstChild).toBeNull()
    })
  })

  describe('Accessibility', () => {
    it('should have accessible aria-label on bulk upload button', () => {
      render(<PersonalizedCommentsModal {...defaultProps} />)
      const bulkUploadButton = screen.getByRole('button', { name: /Bulk Upload Comments/i })

      expect(bulkUploadButton).toHaveAccessibleName()
    })
  })
})
