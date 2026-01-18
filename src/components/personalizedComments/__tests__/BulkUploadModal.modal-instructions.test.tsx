/**
 * BulkUploadModal - Modal Instructions Tests
 * Story 2: Create Bulk Upload Modal with Instructions
 *
 * Tests for modal structure and instructions:
 * - Modal opens with correct title
 * - Clear format instructions provided
 * - Examples showing different comment formats
 * - Large text area for pasting comments
 * - Import and Cancel buttons
 */

import { render, screen, fireEvent } from '../../../test-utils'
import { BulkUploadModal } from '../BulkUploadModal'
import type { Pronoun } from '../../../types'

describe('BulkUploadModal - Story 2: Modal Instructions', () => {
  const mockOnImport = jest.fn()
  const mockOnClose = jest.fn()

  const mockPronouns: Pronoun[] = [
    {
      id: '1',
      pronoun: 'he',
      possessivePronoun: 'his',
      userId: 'user1',
      createdAt: '2025-01-15T00:00:00Z',
      updatedAt: '2025-01-15T00:00:00Z',
    },
  ]

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
    onImport: mockOnImport,
    pronouns: mockPronouns,
    pronounsLoading: false,
    pronounsError: null,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('AC1: Modal structure and title', () => {
    it('should render modal with title "Bulk Upload Personalized Comments"', () => {
      render(<BulkUploadModal {...defaultProps} />)
      expect(screen.getByRole('heading', { name: /Bulk Upload Personalized Comments/i })).toBeInTheDocument()
    })

    it('should be dismissible via Cancel button', () => {
      render(<BulkUploadModal {...defaultProps} />)
      const cancelButton = screen.getByRole('button', { name: /Cancel/i })
      fireEvent.click(cancelButton)
      expect(mockOnClose).toHaveBeenCalled()
    })

    it('should not render when isOpen is false', () => {
      const { container } = render(<BulkUploadModal {...defaultProps} isOpen={false} />)
      expect(container.firstChild).toBeNull()
    })
  })

  describe('AC2: Format instructions and examples', () => {
    it('should display clear format instructions', () => {
      render(<BulkUploadModal {...defaultProps} />)
      expect(screen.getByText(/Single comment per line/i)).toBeInTheDocument()
      expect(screen.getByText(/Optional comma \+ rating \(1-5\)/i)).toBeInTheDocument()
      expect(screen.getByText(/Default rating is 3 if omitted/i)).toBeInTheDocument()
      expect(screen.getByText(/Commas within comment text are allowed/i)).toBeInTheDocument()
    })

    it('should display example: comment with rating', () => {
      render(<BulkUploadModal {...defaultProps} />)
      expect(screen.getByText(/excellent work on the assignment, 5/i)).toBeInTheDocument()
    })

    it('should display example: comment without rating', () => {
      render(<BulkUploadModal {...defaultProps} />)
      expect(screen.getByText(/needs more practice/i)).toBeInTheDocument()
    })

    it('should display example: comment with internal comma', () => {
      render(<BulkUploadModal {...defaultProps} />)
      expect(screen.getByText(/shows good effort, but needs revision, 4/i)).toBeInTheDocument()
    })
  })

  describe('AC3: Text area for pasting comments', () => {
    it('should render large text area for input', () => {
      render(<BulkUploadModal {...defaultProps} />)
      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
      expect(textarea).toBeInTheDocument()
      expect(textarea.rows).toBeGreaterThanOrEqual(10)
    })

    it('should have appropriate placeholder text', () => {
      render(<BulkUploadModal {...defaultProps} />)
      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
      expect(textarea.placeholder).toMatch(/paste comments/i)
    })

    it('should allow user to type comments', () => {
      render(<BulkUploadModal {...defaultProps} />)
      const textarea = screen.getByRole('textbox')
      fireEvent.change(textarea, { target: { value: 'test comment' } })
      expect((textarea as HTMLTextAreaElement).value).toBe('test comment')
    })
  })

  describe('AC4: Import and Cancel buttons', () => {
    it('should render Import button', () => {
      render(<BulkUploadModal {...defaultProps} />)
      expect(screen.getByRole('button', { name: /Import/i })).toBeInTheDocument()
    })

    it('should render Cancel button', () => {
      render(<BulkUploadModal {...defaultProps} />)
      expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument()
    })

    it('should close modal on Cancel button click', () => {
      render(<BulkUploadModal {...defaultProps} />)
      const cancelButton = screen.getByRole('button', { name: /Cancel/i })
      fireEvent.click(cancelButton)
      expect(mockOnClose).toHaveBeenCalled()
    })
  })

  describe('Accessibility', () => {
    it('should have proper dialog role', () => {
      render(<BulkUploadModal {...defaultProps} />)
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('should have aria-label on dialog', () => {
      render(<BulkUploadModal {...defaultProps} />)
      expect(screen.getByRole('dialog', { name: /Bulk Upload Personalized Comments/i })).toBeInTheDocument()
    })

    it('should have accessible text area label', () => {
      render(<BulkUploadModal {...defaultProps} />)
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAccessibleName()
    })
  })
})
