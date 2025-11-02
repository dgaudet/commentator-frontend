/**
 * SubjectListItem Delete Button Relocation Tests
 * TDD Phase: RED - Writing failing tests first
 * Reference: US-SUBJ-DELETE-001
 *
 * Testing delete button positioning beside subject name
 */
import { render, screen } from '../../../test-utils'
import { SubjectListItem } from '../SubjectListItem'
import { Subject } from '../../../types/Subject'

const mockSubject: Subject = {
  id: 1,
  name: 'Mathematics 101',
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-02-20T14:15:00Z',
}

describe('SubjectListItem - Delete Button Relocation (US-SUBJ-DELETE-001)', () => {
  describe('AC1: Button Visibility on Selection', () => {
    it('should display delete button beside subject name when onDelete provided', () => {
      const handleDelete = jest.fn()
      render(<SubjectListItem subjectItem={mockSubject} onDelete={handleDelete} />)

      // Button should exist with proper positioning data attribute
      const deleteButton = screen.getByRole('button', { name: /delete mathematics 101/i })
      expect(deleteButton).toBeInTheDocument()

      // Button should be in the subject name area, not action buttons area
      expect(deleteButton).toHaveAttribute('data-position', 'beside-name')
    })
  })

  describe('AC2: Button Hidden When No Selection', () => {
    it('should not render delete button when onDelete not provided', () => {
      render(<SubjectListItem subjectItem={mockSubject} />)

      // No delete button should exist
      expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument()
    })
  })

  describe('AC3: Button Position and Styling', () => {
    it('should position delete button to the right of subject name with proper spacing', () => {
      const handleDelete = jest.fn()
      render(<SubjectListItem subjectItem={mockSubject} onDelete={handleDelete} />)

      // Find the subject name heading
      const subjectName = screen.getByText('Mathematics 101')
      const subjectNameParent = subjectName.parentElement

      // Delete button should be within the same container as the subject name
      const deleteButton = screen.getByRole('button', { name: /delete mathematics 101/i })
      expect(subjectNameParent).toContainElement(deleteButton)

      // Container should use flex layout
      expect(subjectNameParent).toHaveClass('flex')
    })

    it('should use danger styling for delete button', () => {
      const handleDelete = jest.fn()
      render(<SubjectListItem subjectItem={mockSubject} onDelete={handleDelete} />)

      const deleteButton = screen.getByRole('button', { name: /delete mathematics 101/i })

      // Should have red/danger color classes
      expect(deleteButton).toHaveClass('text-red-600')
      expect(deleteButton).toHaveClass('border-red-600')
    })
  })

  describe('AC4: Responsive Behavior', () => {
    it('should remain visible on mobile without text truncation', () => {
      const handleDelete = jest.fn()
      render(<SubjectListItem subjectItem={mockSubject} onDelete={handleDelete} />)

      // Subject name should not truncate
      const subjectName = screen.getByText('Mathematics 101')
      expect(subjectName).not.toHaveClass('truncate')

      // Container should use flex layout
      const nameDeleteContainer = screen.getByText('Mathematics 101').parentElement
      expect(nameDeleteContainer).toHaveClass('flex')
    })
  })

  describe('AC5: Accessibility', () => {
    it('should include appropriate ARIA label with subject name', () => {
      const handleDelete = jest.fn()
      render(<SubjectListItem subjectItem={mockSubject} onDelete={handleDelete} />)

      const deleteButton = screen.getByRole('button', { name: /delete mathematics 101/i })
      expect(deleteButton).toHaveAttribute('aria-label', 'Delete Mathematics 101')
    })

    it('should be keyboard accessible with tab navigation', () => {
      const handleDelete = jest.fn()
      render(<SubjectListItem subjectItem={mockSubject} onDelete={handleDelete} />)

      const deleteButton = screen.getByRole('button', { name: /delete mathematics 101/i })

      // Should be focusable
      expect(deleteButton).toHaveAttribute('tabIndex', '0')
    })

    it('should handle Enter key to trigger delete', () => {
      const handleDelete = jest.fn()
      render(<SubjectListItem subjectItem={mockSubject} onDelete={handleDelete} />)

      const deleteButton = screen.getByRole('button', { name: /delete mathematics 101/i })

      // Simulate Enter key
      deleteButton.focus()
      deleteButton.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))

      expect(handleDelete).toHaveBeenCalledWith(1)
    })

    it('should handle Space key to trigger delete', () => {
      const handleDelete = jest.fn()
      render(<SubjectListItem subjectItem={mockSubject} onDelete={handleDelete} />)

      const deleteButton = screen.getByRole('button', { name: /delete mathematics 101/i })

      // Simulate Space key
      deleteButton.focus()
      deleteButton.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))

      expect(handleDelete).toHaveBeenCalledWith(1)
    })
  })

  describe('Integration with existing functionality', () => {
    it('should still allow edit button to function independently', () => {
      const handleEdit = jest.fn()
      const handleDelete = jest.fn()

      render(<SubjectListItem subjectItem={mockSubject} onEdit={handleEdit} onDelete={handleDelete} />)

      // Both buttons should exist
      expect(screen.getByRole('button', { name: /edit mathematics 101/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /delete mathematics 101/i })).toBeInTheDocument()

      // Edit button should still be in action buttons area
      const editButton = screen.getByRole('button', { name: /edit mathematics 101/i })
      expect(editButton).not.toHaveAttribute('data-position', 'beside-name')
    })
  })
})
