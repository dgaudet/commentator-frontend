/**
 * CopyCommentsModal Validation & Edge Cases Tests
 * Reference: US-CP-005 - Implement Validation and Edge Case Handling
 *
 * Tests for validation and edge case scenarios:
 * - Target subject selection required validation
 * - Cannot copy to self validation
 * - Ownership validation (only copy to owned subjects)
 * - Empty source comments handling
 * - Duplicate handling
 * - Edge case error scenarios
 *
 * TDD Phase: RED - Writing failing tests first
 */

import { render, screen, fireEvent, waitFor } from '../../../test-utils'
import { CopyCommentsModal } from '../CopyCommentsModal'
import type { Subject } from '../../../types'
import { personalizedCommentService } from '../../../services/api/personalizedCommentService'

// Mock the API service
jest.mock('../../../services/api/personalizedCommentService', () => ({
  personalizedCommentService: {
    copy: jest.fn(),
  },
}))

describe('CopyCommentsModal - Validation & Edge Cases (US-CP-005)', () => {
  const sourceSubject: Subject = {
    id: '65a1b2c3d4e5f6g7h8i9j0k1',
    name: 'Mathematics',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  }

  const targetSubject1: Subject = {
    id: '65a1b2c3d4e5f6g7h8i9j0k2',
    name: 'Chemistry',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  }

  const targetSubject2: Subject = {
    id: '65a1b2c3d4e5f6g7h8i9j0k3',
    name: 'Physics',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  }

  const ownedSubjects = [targetSubject1, targetSubject2]
  const mockOnClose = jest.fn()

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    sourceSubjectId: sourceSubject.id,
    sourceSubjectName: sourceSubject.name,
    ownedSubjects,
    sourceCommentCount: 5,
  }

  const mockComments = [
    {
      id: '1',
      subjectId: targetSubject1.id,
      comment: 'Comment 1',
      rating: 4,
      userId: 'user1',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('AC-5.1: Target Selection Validation', () => {
    it('should disable copy button until target subject selected', () => {
      render(<CopyCommentsModal {...defaultProps} />)

      const copyButton = screen.getByRole('button', { name: /copy/i })

      // Initially disabled when no target selected
      expect(copyButton).toBeDisabled()

      // Select a target
      const dropdown = screen.getByLabelText(/copy to \(subjects you own\)/i)
      fireEvent.change(dropdown, { target: { value: targetSubject1.id } })

      // Button should now be enabled
      expect(copyButton).not.toBeDisabled()
    })

    it('should show validation error message during error recovery with cleared target', async () => {
      personalizedCommentService.copy.mockRejectedValueOnce(new Error('API Error'))
      personalizedCommentService.copy.mockRejectedValueOnce(new Error('Validation error'))

      render(<CopyCommentsModal {...defaultProps} />)

      // First attempt with target
      const dropdown = screen.getByLabelText(/copy to \(subjects you own\)/i)
      fireEvent.change(dropdown, { target: { value: targetSubject1.id } })

      const copyButton = screen.getByRole('button', { name: /copy/i })
      fireEvent.click(copyButton)

      // Wait for first error
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
      })

      // Clear target selection
      fireEvent.change(dropdown, { target: { value: '' } })

      // Try again without target
      const tryAgainButton = screen.getByRole('button', { name: /try again/i })
      fireEvent.click(tryAgainButton)

      // Should show validation error (not call API)
      await waitFor(() => {
        expect(screen.getByText(/Error: Please select a target subject/i)).toBeInTheDocument()
      })

      expect(personalizedCommentService.copy).toHaveBeenCalledTimes(1)
    })
  })

  describe('AC-5.2: Owned Subjects Only Validation', () => {
    it('should only show owned subjects in dropdown', () => {
      render(
        <CopyCommentsModal
          {...defaultProps}
          ownedSubjects={[targetSubject1, targetSubject2]}
        />,
      )

      const dropdown = screen.getByLabelText(/copy to \(subjects you own\)/i)
      const options = dropdown.querySelectorAll('option')

      // Should have placeholder + 2 owned subjects
      expect(options.length).toBe(3)
      expect(options[1].textContent).toBe(targetSubject1.name)
      expect(options[2].textContent).toBe(targetSubject2.name)
    })

    it('should exclude source subject from available targets', () => {
      // If source is in ownedSubjects, it should be excluded
      const ownedWithSource = [sourceSubject, targetSubject1, targetSubject2]

      render(
        <CopyCommentsModal
          {...defaultProps}
          ownedSubjects={ownedWithSource}
        />,
      )

      const dropdown = screen.getByLabelText(/copy to \(subjects you own\)/i)
      const options = dropdown.querySelectorAll('option')

      // Should have placeholder + 2 subjects (source excluded)
      expect(options.length).toBe(3)
      expect(options[1].textContent).toBe(targetSubject1.name)
      expect(options[2].textContent).toBe(targetSubject2.name)

      // Source subject should not be in options
      const optionValues = Array.from(options).map((opt) => opt.value)
      expect(optionValues).not.toContain(sourceSubject.id)
    })

    it('should show message when no owned subjects available', () => {
      render(
        <CopyCommentsModal
          {...defaultProps}
          ownedSubjects={[]}
        />,
      )

      // Should show "no other subjects" message instead of dropdown
      expect(
        screen.getByText(/you don't own any other subjects to copy to/i),
      ).toBeInTheDocument()

      // Dropdown should not be visible
      expect(screen.queryByLabelText(/copy to \(subjects you own\)/i)).not.toBeInTheDocument()
    })
  })

  describe('AC-5.3: Empty Source Comments', () => {
    it('should allow copy operation even with zero source comments', async () => {
      personalizedCommentService.copy.mockResolvedValue([])

      render(
        <CopyCommentsModal
          {...defaultProps}
          sourceCommentCount={0}
        />,
      )

      const dropdown = screen.getByLabelText(/copy to \(subjects you own\)/i)
      fireEvent.change(dropdown, { target: { value: targetSubject1.id } })

      const copyButton = screen.getByRole('button', { name: /copy/i })
      fireEvent.click(copyButton)

      await waitFor(() => {
        expect(personalizedCommentService.copy).toHaveBeenCalled()
      })
    })

    it('should display correct count in success message for zero comments', async () => {
      personalizedCommentService.copy.mockResolvedValue([])

      render(
        <CopyCommentsModal
          {...defaultProps}
          sourceCommentCount={0}
        />,
      )

      const dropdown = screen.getByLabelText(/copy to \(subjects you own\)/i)
      fireEvent.change(dropdown, { target: { value: targetSubject1.id } })

      const copyButton = screen.getByRole('button', { name: /copy/i })
      fireEvent.click(copyButton)

      await waitFor(() => {
        expect(screen.getByText(/successfully copied 0 comments/i)).toBeInTheDocument()
      })
    })

    it('should not display comment count message when sourceCommentCount is 0', () => {
      render(
        <CopyCommentsModal
          {...defaultProps}
          sourceCommentCount={0}
        />,
      )

      // Should not show "X comments will be copied" message
      expect(screen.queryByText(/comments will be copied/i)).not.toBeInTheDocument()
    })
  })

  describe('AC-5.4: Duplicate Handling', () => {
    it('should allow copy operation with duplicates (backend handles logic)', async () => {
      // Backend is responsible for handling duplicate logic
      // Frontend should allow the operation to proceed
      personalizedCommentService.copy.mockResolvedValue(mockComments)

      render(<CopyCommentsModal {...defaultProps} />)

      const dropdown = screen.getByLabelText(/copy to \(subjects you own\)/i)
      fireEvent.change(dropdown, { target: { value: targetSubject2.id } })

      const copyButton = screen.getByRole('button', { name: /copy/i })
      fireEvent.click(copyButton)

      await waitFor(() => {
        expect(personalizedCommentService.copy).toHaveBeenCalled()
      })
    })

    it('should display success even if duplicates are created', async () => {
      const duplicateComments = [
        ...mockComments,
        ...mockComments, // Duplicates
      ]

      personalizedCommentService.copy.mockResolvedValue(duplicateComments)

      render(<CopyCommentsModal {...defaultProps} />)

      const dropdown = screen.getByLabelText(/copy to \(subjects you own\)/i)
      fireEvent.change(dropdown, { target: { value: targetSubject2.id } })

      const copyButton = screen.getByRole('button', { name: /copy/i })
      fireEvent.click(copyButton)

      await waitFor(() => {
        expect(screen.getByText(/successfully copied 2 comments/i)).toBeInTheDocument()
      })
    })
  })

  describe('AC-5.5: API Error Edge Cases', () => {
    it('should handle 400 validation error from backend', async () => {
      const validationError = new Error('Invalid request: target subject does not exist')
      personalizedCommentService.copy.mockRejectedValue(validationError)

      render(<CopyCommentsModal {...defaultProps} />)

      const dropdown = screen.getByLabelText(/copy to \(subjects you own\)/i)
      fireEvent.change(dropdown, { target: { value: targetSubject1.id } })

      const copyButton = screen.getByRole('button', { name: /copy/i })
      fireEvent.click(copyButton)

      await waitFor(() => {
        expect(screen.getByText(/Invalid request/i)).toBeInTheDocument()
      })
    })

    it('should handle 404 not found error', async () => {
      const notFoundError = new Error('Subject not found')
      personalizedCommentService.copy.mockRejectedValue(notFoundError)

      render(<CopyCommentsModal {...defaultProps} />)

      const dropdown = screen.getByLabelText(/copy to \(subjects you own\)/i)
      fireEvent.change(dropdown, { target: { value: targetSubject1.id } })

      const copyButton = screen.getByRole('button', { name: /copy/i })
      fireEvent.click(copyButton)

      await waitFor(() => {
        expect(screen.getByText(/Subject not found/i)).toBeInTheDocument()
      })
    })

    it('should handle 500 server error', async () => {
      const serverError = new Error('Internal server error')
      personalizedCommentService.copy.mockRejectedValue(serverError)

      render(<CopyCommentsModal {...defaultProps} />)

      const dropdown = screen.getByLabelText(/copy to \(subjects you own\)/i)
      fireEvent.change(dropdown, { target: { value: targetSubject1.id } })

      const copyButton = screen.getByRole('button', { name: /copy/i })
      fireEvent.click(copyButton)

      await waitFor(() => {
        expect(screen.getByText(/Internal server error/i)).toBeInTheDocument()
      })
    })
  })

  describe('AC-5.6: Form State Edge Cases', () => {
    it('should maintain form state during error recovery', async () => {
      personalizedCommentService.copy.mockRejectedValueOnce(new Error('First attempt failed'))
      personalizedCommentService.copy.mockResolvedValueOnce(mockComments)

      render(<CopyCommentsModal {...defaultProps} />)

      // Select target and overwrite mode
      const dropdown = screen.getByLabelText(/copy to \(subjects you own\)/i)
      fireEvent.change(dropdown, { target: { value: targetSubject2.id } })

      const overwriteRadio = screen.getByRole('radio', { name: /overwrite existing comments/i })
      fireEvent.click(overwriteRadio)

      const copyButton = screen.getByRole('button', { name: /copy/i })

      // First attempt - fail
      fireEvent.click(copyButton)
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
      })

      // Retry - selections should be preserved
      expect(dropdown).toHaveValue(targetSubject2.id)
      expect(overwriteRadio).toBeChecked()

      const tryAgainButton = screen.getByRole('button', { name: /try again/i })
      fireEvent.click(tryAgainButton)

      await waitFor(() => {
        expect(screen.getByText(/successfully copied/i)).toBeInTheDocument()
        // Mode indication should reflect the selection made
        expect(screen.getByText(/overwrote existing comments/i)).toBeInTheDocument()
      })
    })

    it('should reset form state when modal is reopened after success', async () => {
      const { rerender } = render(<CopyCommentsModal {...defaultProps} />)

      const dropdown = screen.getByLabelText(/copy to \(subjects you own\)/i)
      fireEvent.change(dropdown, { target: { value: targetSubject2.id } })

      personalizedCommentService.copy.mockResolvedValue(mockComments)

      const copyButton = screen.getByRole('button', { name: /copy/i })
      fireEvent.click(copyButton)

      await waitFor(() => {
        expect(screen.getByText(/successfully copied/i)).toBeInTheDocument()
      })

      // Close modal (isOpen={false})
      rerender(
        <CopyCommentsModal
          {...defaultProps}
          isOpen={false}
        />,
      )

      // Reopen modal (isOpen={true})
      rerender(
        <CopyCommentsModal
          {...defaultProps}
          isOpen={true}
        />,
      )

      // Form should be reset
      const reopenedDropdown = screen.getByLabelText(/copy to \(subjects you own\)/i)
      expect(reopenedDropdown).toHaveValue('')

      const appendRadio = screen.getByRole('radio', { name: /append to existing comments/i })
      expect(appendRadio).toBeChecked()
    })

    it('should handle rapid successive copy attempts', async () => {
      personalizedCommentService.copy.mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve(mockComments), 50)
          }),
      )

      render(<CopyCommentsModal {...defaultProps} />)

      const dropdown = screen.getByLabelText(/copy to \(subjects you own\)/i)
      fireEvent.change(dropdown, { target: { value: targetSubject2.id } })

      const copyButton = screen.getByRole('button', { name: /copy/i })

      // Try to click multiple times rapidly
      fireEvent.click(copyButton)
      fireEvent.click(copyButton)
      fireEvent.click(copyButton)

      await waitFor(() => {
        expect(screen.getByText(/successfully copied/i)).toBeInTheDocument()
      })

      // Should only call API once due to loading state disabling button
      expect(personalizedCommentService.copy).toHaveBeenCalledTimes(1)
    })
  })
})
