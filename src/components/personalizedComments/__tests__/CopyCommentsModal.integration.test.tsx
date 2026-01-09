/**
 * CopyCommentsModal Integration Tests
 * Reference: US-CP-002 - Integration of Copy feature with parent components
 *
 * Tests for integration with parent components:
 * - SubjectListItem passes ownedSubjects to PersonalizedCommentsModal
 * - PersonalizedCommentsModal passes ownedSubjects to CopyCommentsModal
 * - Dropdown displays owned subjects correctly
 *
 * TDD Phase: RED - Writing failing tests first
 */

import { render, screen, waitFor } from '../../../test-utils'
import { PersonalizedCommentsModal } from '../PersonalizedCommentsModal'
import type { Subject, PersonalizedComment } from '../../../types'

describe('CopyCommentsModal - Component Integration (US-CP-002)', () => {
  const sourceSubject: Subject = {
    id: '65a1b2c3d4e5f6g7h8i9j0k1',
    name: 'Mathematics',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  }

  const ownedSubject1: Subject = {
    id: '65a1b2c3d4e5f6g7h8i9j0k2',
    name: 'Chemistry',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  }

  const ownedSubject2: Subject = {
    id: '65a1b2c3d4e5f6g7h8i9j0k3',
    name: 'Physics',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  }

  const mockComment: PersonalizedComment = {
    id: '1',
    subjectId: sourceSubject.id,
    comment: 'Test comment',
    rating: 4,
    userId: 'user1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  }

  const defaultProps = {
    isOpen: true,
    entityData: sourceSubject,
    personalizedComments: [mockComment],
    onCreateComment: jest.fn(),
    onUpdateComment: jest.fn(),
    onDeleteComment: jest.fn(),
    loading: false,
    error: null,
  }

  describe('Integration: ownedSubjects prop propagation', () => {
    it('should display dropdown with owned subjects when passed through PersonalizedCommentsModal', async () => {
      const ownedSubjects = [ownedSubject1, ownedSubject2]

      render(
        <PersonalizedCommentsModal
          {...defaultProps}
          ownedSubjects={ownedSubjects}
        />,
      )

      // Open copy modal
      const copyButton = screen.getByRole('button', { name: /copy comments to another subject/i })
      copyButton.click()

      // Wait for dropdown to be present and shows owned subjects
      await waitFor(() => {
        const dropdown = screen.getByLabelText(/copy to \(Target\)/i)
        expect(dropdown).toBeInTheDocument()
      })

      const dropdown = screen.getByLabelText(/copy to \(Target\)/i)
      // Verify options include both owned subjects
      const options = dropdown.querySelectorAll('option')
      expect(options.length).toBe(3) // placeholder + 2 owned subjects
      expect(options[1].textContent).toBe('Chemistry')
      expect(options[2].textContent).toBe('Physics')
    })

    it('should not display "no other subjects" message when ownedSubjects are provided', async () => {
      const ownedSubjects = [ownedSubject1, ownedSubject2]

      render(
        <PersonalizedCommentsModal
          {...defaultProps}
          ownedSubjects={ownedSubjects}
        />,
      )

      // Open copy modal
      const copyButton = screen.getByRole('button', { name: /copy comments to another subject/i })
      copyButton.click()

      // Verify dropdown is shown and no "no subjects" message
      await waitFor(() => {
        const dropdown = screen.getByLabelText(/copy to \(Target\)/i)
        expect(dropdown).toBeInTheDocument()
      })

      expect(screen.queryByText(/you don't own any other subjects/i)).not.toBeInTheDocument()
    })

    it('should display "no subjects" message when ownedSubjects is empty', async () => {
      render(
        <PersonalizedCommentsModal
          {...defaultProps}
          ownedSubjects={[]}
        />,
      )

      // Open copy modal
      const copyButton = screen.getByRole('button', { name: /copy comments to another subject/i })
      copyButton.click()

      // Verify "no subjects" message is shown
      await waitFor(() => {
        expect(screen.getByText(/you don't own any other subjects/i)).toBeInTheDocument()
      })

      // Verify dropdown is not shown
      expect(screen.queryByLabelText(/copy to \(Target\)/i)).not.toBeInTheDocument()
    })

    it('should exclude source subject from dropdown when included in ownedSubjects', async () => {
      // ownedSubjects includes the source subject
      const ownedSubjects = [sourceSubject, ownedSubject1, ownedSubject2]

      render(
        <PersonalizedCommentsModal
          {...defaultProps}
          ownedSubjects={ownedSubjects}
        />,
      )

      // Open copy modal
      const copyButton = screen.getByRole('button', { name: /copy comments to another subject/i })
      copyButton.click()

      // Wait for dropdown and verify source is excluded
      await waitFor(() => {
        const dropdown = screen.getByLabelText(/copy to \(Target\)/i)
        expect(dropdown).toBeInTheDocument()

        const options = dropdown.querySelectorAll('option')
        expect(options.length).toBe(3) // placeholder + 2 subjects (source excluded)
        expect(options[1].textContent).toBe('Chemistry')
        expect(options[2].textContent).toBe('Physics')

        const optionTexts = Array.from(options).map((o) => o.textContent)
        expect(optionTexts).not.toContain(sourceSubject.name)
      })
    })

    it('should sort owned subjects alphabetically', async () => {
      // Create subjects with non-alphabetical order
      const unorderedSubjects = [ownedSubject2, ownedSubject1] // Physics, Chemistry

      render(
        <PersonalizedCommentsModal
          {...defaultProps}
          ownedSubjects={unorderedSubjects}
        />,
      )

      // Open copy modal
      const copyButton = screen.getByRole('button', { name: /copy comments to another subject/i })
      copyButton.click()

      // Verify dropdown shows subjects in alphabetical order
      await waitFor(() => {
        const dropdown = screen.getByLabelText(/copy to \(Target\)/i)
        const options = dropdown.querySelectorAll('option')

        // Should be: placeholder, Chemistry (C), Physics (P)
        expect(options[1].textContent).toBe('Chemistry')
        expect(options[2].textContent).toBe('Physics')
      })
    })

    it('should handle empty ownedSubjects array gracefully', async () => {
      render(
        <PersonalizedCommentsModal
          {...defaultProps}
          ownedSubjects={undefined} // undefined defaults to []
        />,
      )

      // Open copy modal
      const copyButton = screen.getByRole('button', { name: /copy comments to another subject/i })
      copyButton.click()

      // Should show "no other subjects" message
      await waitFor(() => {
        expect(screen.getByText(/you don't own any other subjects/i)).toBeInTheDocument()
      })
    })

    it('should update dropdown options when ownedSubjects prop changes', async () => {
      const { rerender } = render(
        <PersonalizedCommentsModal
          {...defaultProps}
          ownedSubjects={[ownedSubject1]}
        />,
      )

      // Open copy modal
      const copyButton = screen.getByRole('button', { name: /copy comments to another subject/i })
      copyButton.click()

      // Verify initial dropdown shows 1 subject
      await waitFor(() => {
        const dropdown = screen.getByLabelText(/copy to \(Target\)/i)
        const options = dropdown.querySelectorAll('option')
        expect(options.length).toBe(2) // placeholder + 1 subject
      })

      // Rerender with additional subject
      rerender(
        <PersonalizedCommentsModal
          {...defaultProps}
          ownedSubjects={[ownedSubject1, ownedSubject2]}
        />,
      )

      // Verify dropdown now shows 2 subjects
      await waitFor(() => {
        const dropdown = screen.getByLabelText(/copy to \(Target\)/i)
        const options = dropdown.querySelectorAll('option')
        expect(options.length).toBe(3) // placeholder + 2 subjects
      })
    })
  })
})
