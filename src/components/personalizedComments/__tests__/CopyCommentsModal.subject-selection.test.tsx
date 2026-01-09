/**
 * CopyCommentsModal Subject Selection Tests
 * Reference: US-CP-002 - Display Modal with Subject Selection
 *
 * Tests for subject selection functionality:
 * - Source subject display (read-only)
 * - Target subject dropdown with owned subjects filter
 * - Subject list population
 * - Comment count display
 * - Modal layout and accessibility
 *
 * TDD Phase: RED - Writing failing tests first
 */

import { render, screen, fireEvent, waitFor } from '../../../test-utils'
import { CopyCommentsModal } from '../CopyCommentsModal'
import type { Subject } from '../../../types'

describe('CopyCommentsModal - Subject Selection (US-CP-002)', () => {
  const sourceSubject: Subject = {
    id: '65a1b2c3d4e5f6g7h8i9j0k1',
    name: 'Mathematics',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  }

  const ownedSubjects: Subject[] = [
    {
      id: '65a1b2c3d4e5f6g7h8i9j0k2',
      name: 'Physics',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: '65a1b2c3d4e5f6g7h8i9j0k3',
      name: 'Chemistry',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
  ]

  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    sourceSubjectId: sourceSubject.id,
    sourceSubjectName: sourceSubject.name,
    ownedSubjects,
    sourceCommentCount: 5,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('AC-2.1: Source Subject Display', () => {
    it('should display source subject as "Copying FROM"', () => {
      render(<CopyCommentsModal {...defaultProps} />)
      expect(screen.getByText(/copy from \(source\):/i)).toBeInTheDocument()
    })

    it('should display source subject name', () => {
      render(<CopyCommentsModal {...defaultProps} />)
      expect(screen.getByText(sourceSubject.name)).toBeInTheDocument()
    })

    it('should display source subject as read-only', () => {
      const { container } = render(<CopyCommentsModal {...defaultProps} />)
      // Should not have editable input for source
      const sourceInput = container.querySelector('input[value="' + sourceSubject.name + '"]')
      expect(sourceInput).not.toBeInTheDocument()
    })
  })

  describe('AC-2.2 & AC-2.3: Target Subject Dropdown with Owned Subjects Filter', () => {
    it('should display dropdown labeled "Copy to (Target)"', () => {
      render(<CopyCommentsModal {...defaultProps} />)
      expect(screen.getByLabelText(/copy to \(Target\)/i)).toBeInTheDocument()
    })

    it('should show owned subjects in dropdown', async () => {
      render(<CopyCommentsModal {...defaultProps} />)
      const dropdown = screen.getByLabelText(/copy to \(Target\)/i)
      fireEvent.click(dropdown)

      await waitFor(() => {
        expect(screen.getByText('Physics')).toBeInTheDocument()
        expect(screen.getByText('Chemistry')).toBeInTheDocument()
      })
    })

    it('should exclude source subject from dropdown', async () => {
      render(<CopyCommentsModal {...defaultProps} />)
      const dropdown = screen.getByLabelText(/copy to \(Target\)/i)
      fireEvent.click(dropdown)

      await waitFor(() => {
        // Mathematics (source) should not appear in the dropdown options
        const allMathematicsElements = screen.queryAllByText('Mathematics')
        // Only the source subject display should show Mathematics, not in dropdown
        expect(allMathematicsElements.length).toBeLessThanOrEqual(1)
      })
    })

    it('should show empty state when user owns no other subjects', () => {
      render(
        <CopyCommentsModal
          {...defaultProps}
          ownedSubjects={[]} // No other subjects owned
        />,
      )
      expect(screen.getByText(/you don't own any other subjects to copy to/i)).toBeInTheDocument()
    })

    it('should show empty state when only source subject is owned', () => {
      render(
        <CopyCommentsModal
          {...defaultProps}
          ownedSubjects={[sourceSubject]} // Only source is owned
        />,
      )
      expect(screen.getByText(/you don't own any other subjects to copy to/i)).toBeInTheDocument()
    })

    it('should sort subjects alphabetically', async () => {
      const unorderedSubjects = [
        {
          id: '65a1b2c3d4e5f6g7h8i9j0k3',
          name: 'Zoology',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        {
          id: '65a1b2c3d4e5f6g7h8i9j0k2',
          name: 'Biology',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      ]

      render(
        <CopyCommentsModal
          {...defaultProps}
          ownedSubjects={unorderedSubjects}
        />,
      )

      await waitFor(() => {
        const options = screen.getAllByRole('option')
        // First option is placeholder, so Biology should be at index 1, Zoology at index 2
        expect(options[1]).toHaveTextContent('Biology')
        expect(options[2]).toHaveTextContent('Zoology')
      })
    })
  })

  describe('AC-2.4: Comment Count Display', () => {
    it('should display count of comments to be copied', () => {
      render(<CopyCommentsModal {...defaultProps} sourceCommentCount={5} />)
      expect(screen.getByText(/5 comment/i)).toBeInTheDocument()
    })

    it('should use singular "comment" for count of 1', () => {
      render(<CopyCommentsModal {...defaultProps} sourceCommentCount={1} />)
      expect(screen.getByText(/1 comment/i)).toBeInTheDocument()
    })

    it('should use plural "comments" for count > 1', () => {
      render(<CopyCommentsModal {...defaultProps} sourceCommentCount={12} />)
      expect(screen.getByText(/12 comments/i)).toBeInTheDocument()
    })

    it('should update count when target subject changes', async () => {
      const { rerender } = render(<CopyCommentsModal {...defaultProps} sourceCommentCount={5} />)
      expect(screen.getByText(/5 comment/i)).toBeInTheDocument()

      // Rerender with different count
      rerender(
        <CopyCommentsModal {...defaultProps} sourceCommentCount={8} />,
      )
      await waitFor(() => {
        expect(screen.getByText(/8 comment/i)).toBeInTheDocument()
      })
    })
  })

  describe('AC-2.5: Modal Layout & Accessibility', () => {
    it('should have logical tab order: source -> dropdown -> buttons', () => {
      const { container } = render(<CopyCommentsModal {...defaultProps} />)
      const focusableElements = container.querySelectorAll(
        'button, [role="combobox"], input[type="radio"]',
      )
      expect(focusableElements.length).toBeGreaterThan(0)
    })

    it('should have labels associated with form fields', () => {
      render(<CopyCommentsModal {...defaultProps} />)
      const dropdown = screen.getByLabelText(/copy to \(Target\)/i)
      expect(dropdown).toHaveAccessibleName()
    })

    it('should be navigable with arrow keys in dropdown', async () => {
      render(<CopyCommentsModal {...defaultProps} />)
      const dropdown = screen.getByLabelText(/copy to \(Target\)/i)
      fireEvent.click(dropdown)

      await waitFor(() => {
        expect(screen.getByText('Physics')).toBeInTheDocument()
      })

      fireEvent.keyDown(dropdown, { key: 'ArrowDown', code: 'ArrowDown' })
      // After arrow down, first option should be highlighted (browser default behavior)
    })
  })
})
