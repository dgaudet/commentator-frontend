/**
 * OutcomeCommentsModal Component Tests
 * Test Suite for viewing, creating, editing, and deleting outcome comments
 * 
 * User Stories:
 * - View all outcome comments for a class
 * - Create new outcome comment for a class
 * - Edit existing outcome comment
 * - Delete outcome comment
 * 
 * Testing approach: Test-Driven Development (Red-Green-Refactor)
 */

import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { OutcomeCommentsModal } from '../OutcomeCommentsModal'
import type { Class, OutcomeComment } from '../../../types'

// Mock data
const mockClass: Class = {
  id: 1,
  name: 'Mathematics 101',
  year: 2024,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z'
}

const mockOutcomeComments: OutcomeComment[] = [
  {
    id: 1,
    classId: 1,
    content: 'Students demonstrated excellent problem-solving skills',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z'
  },
  {
    id: 2,
    classId: 1,
    content: 'Need to focus more on algebra concepts',
    createdAt: '2024-01-02T10:00:00Z',
    updatedAt: '2024-01-02T10:00:00Z'
  }
]

describe('OutcomeCommentsModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    classData: mockClass,
    outcomeComments: mockOutcomeComments,
    onCreateComment: jest.fn(),
    onUpdateComment: jest.fn(),
    onDeleteComment: jest.fn(),
    loading: false,
    error: null
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('User Story 1: View outcome comments', () => {
    it('should display modal title with class name', () => {
      render(<OutcomeCommentsModal {...defaultProps} />)
      
      expect(screen.getByText('Outcome Comments - Mathematics 101')).toBeInTheDocument()
    })

    it('should display all outcome comments for the class', () => {
      render(<OutcomeCommentsModal {...defaultProps} />)
      
      expect(screen.getByText('Students demonstrated excellent problem-solving skills')).toBeInTheDocument()
      expect(screen.getByText('Need to focus more on algebra concepts')).toBeInTheDocument()
    })

    it('should display empty state when no comments exist', () => {
      render(<OutcomeCommentsModal {...defaultProps} outcomeComments={[]} />)
      
      expect(screen.getByText('No outcome comments found')).toBeInTheDocument()
      expect(screen.getByText('Be the first to add an outcome comment for this class.')).toBeInTheDocument()
    })

    it('should display comment creation date', () => {
      render(<OutcomeCommentsModal {...defaultProps} />)
      
      // Should format dates properly
      expect(screen.getByText(/Jan 1, 2024/)).toBeInTheDocument()
      expect(screen.getByText(/Jan 2, 2024/)).toBeInTheDocument()
    })

    it('should have close button that calls onClose', async () => {
      const user = userEvent.setup()
      render(<OutcomeCommentsModal {...defaultProps} />)
      
      const closeButton = screen.getByRole('button', { name: /close/i })
      await user.click(closeButton)
      
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
    })
  })

  describe('User Story 2: Create outcome comment', () => {
    it('should display create comment form', () => {
      render(<OutcomeCommentsModal {...defaultProps} />)
      
      expect(screen.getByRole('textbox', { name: /add new outcome comment/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /add comment/i })).toBeInTheDocument()
    })

    it('should call onCreateComment when form is submitted with valid content', async () => {
      const user = userEvent.setup()
      render(<OutcomeCommentsModal {...defaultProps} />)
      
      const textarea = screen.getByRole('textbox', { name: /add new outcome comment/i })
      const submitButton = screen.getByRole('button', { name: /add comment/i })
      
      await user.type(textarea, 'New outcome comment content')
      await user.click(submitButton)
      
      expect(defaultProps.onCreateComment).toHaveBeenCalledWith({
        classId: 1,
        content: 'New outcome comment content'
      })
    })

    it('should clear form after successful submission', async () => {
      const user = userEvent.setup()
      render(<OutcomeCommentsModal {...defaultProps} />)
      
      const textarea = screen.getByRole('textbox', { name: /add new outcome comment/i })
      const submitButton = screen.getByRole('button', { name: /add comment/i })
      
      await user.type(textarea, 'New comment')
      await user.click(submitButton)
      
      expect(textarea).toHaveValue('')
    })

    it('should not submit empty comment', async () => {
      const user = userEvent.setup()
      render(<OutcomeCommentsModal {...defaultProps} />)
      
      const submitButton = screen.getByRole('button', { name: /add comment/i })
      await user.click(submitButton)
      
      expect(defaultProps.onCreateComment).not.toHaveBeenCalled()
    })

    it('should display validation error for empty comment', async () => {
      const user = userEvent.setup()
      render(<OutcomeCommentsModal {...defaultProps} />)
      
      const submitButton = screen.getByRole('button', { name: /add comment/i })
      await user.click(submitButton)
      
      expect(screen.getByText('Comment content is required')).toBeInTheDocument()
    })
  })

  describe('User Story 3: Edit outcome comment', () => {
    it('should display edit button for each comment', () => {
      render(<OutcomeCommentsModal {...defaultProps} />)
      
      const editButtons = screen.getAllByRole('button', { name: /edit/i })
      expect(editButtons).toHaveLength(2)
    })

    it('should switch to edit mode when edit button is clicked', async () => {
      const user = userEvent.setup()
      render(<OutcomeCommentsModal {...defaultProps} />)
      
      const editButtons = screen.getAllByRole('button', { name: /edit/i })
      await user.click(editButtons[0])
      
      expect(screen.getByDisplayValue('Students demonstrated excellent problem-solving skills')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
    })

    it('should call onUpdateComment when save button is clicked', async () => {
      const user = userEvent.setup()
      render(<OutcomeCommentsModal {...defaultProps} />)
      
      const editButtons = screen.getAllByRole('button', { name: /edit/i })
      await user.click(editButtons[0])
      
      const textarea = screen.getByDisplayValue('Students demonstrated excellent problem-solving skills')
      await user.clear(textarea)
      await user.type(textarea, 'Updated comment content')
      
      const saveButton = screen.getByRole('button', { name: /save/i })
      await user.click(saveButton)
      
      expect(defaultProps.onUpdateComment).toHaveBeenCalledWith(1, {
        content: 'Updated comment content'
      })
    })

    it('should cancel edit mode when cancel button is clicked', async () => {
      const user = userEvent.setup()
      render(<OutcomeCommentsModal {...defaultProps} />)
      
      const editButtons = screen.getAllByRole('button', { name: /edit/i })
      await user.click(editButtons[0])
      
      const cancelButton = screen.getByRole('button', { name: /cancel/i })
      await user.click(cancelButton)
      
      expect(screen.getByText('Students demonstrated excellent problem-solving skills')).toBeInTheDocument()
      expect(screen.queryByDisplayValue('Students demonstrated excellent problem-solving skills')).not.toBeInTheDocument()
    })
  })

  describe('User Story 4: Delete outcome comment', () => {
    it('should display delete button for each comment', () => {
      render(<OutcomeCommentsModal {...defaultProps} />)
      
      const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
      expect(deleteButtons).toHaveLength(2)
    })

    it('should show confirmation dialog when delete button is clicked', async () => {
      const user = userEvent.setup()
      render(<OutcomeCommentsModal {...defaultProps} />)
      
      const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
      await user.click(deleteButtons[0])
      
      expect(screen.getByText('Delete Outcome Comment')).toBeInTheDocument()
      expect(screen.getByText('Are you sure you want to delete this outcome comment? This action cannot be undone.')).toBeInTheDocument()
    })

    it('should call onDeleteComment when delete is confirmed', async () => {
      const user = userEvent.setup()
      render(<OutcomeCommentsModal {...defaultProps} />)
      
      const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
      await user.click(deleteButtons[0])
      
      // Look for the confirm button specifically within the confirmation dialog
      const confirmDialog = screen.getByRole('dialog', { name: 'Delete Outcome Comment' })
      const confirmButton = within(confirmDialog).getByRole('button', { name: /delete/i })
      await user.click(confirmButton)
      
      expect(defaultProps.onDeleteComment).toHaveBeenCalledWith(1)
    })

    it('should close confirmation dialog when cancel is clicked', async () => {
      const user = userEvent.setup()
      render(<OutcomeCommentsModal {...defaultProps} />)
      
      const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
      await user.click(deleteButtons[0])
      
      const cancelButton = screen.getByRole('button', { name: /cancel/i })
      await user.click(cancelButton)
      
      expect(screen.queryByText('Delete Outcome Comment')).not.toBeInTheDocument()
    })
  })

  describe('Loading and Error States', () => {
    it('should display loading spinner when loading is true', () => {
      render(<OutcomeCommentsModal {...defaultProps} loading={true} />)
      
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
    })

    it('should display error message when error exists', () => {
      render(<OutcomeCommentsModal {...defaultProps} error="Failed to load comments" />)
      
      expect(screen.getByText('Failed to load comments')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<OutcomeCommentsModal {...defaultProps} />)
      
      expect(screen.getByRole('dialog')).toHaveAttribute('aria-labelledby')
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-label')
    })

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup()
      render(<OutcomeCommentsModal {...defaultProps} />)
      
      // Should be able to tab through interactive elements
      await user.tab()
      expect(screen.getByRole('button', { name: /close/i })).toHaveFocus()
    })
  })
})