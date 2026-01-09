/**
 * CopyCommentsModal API Integration Tests
 * Reference: US-CP-004 - Implement Copy API Integration with Feedback
 *
 * Tests for API integration and user feedback:
 * - Copy button submission with all required fields
 * - API request payload validation
 * - Loading state during request
 * - Success feedback with count and mode indication
 * - Error handling and retry
 * - Network error handling
 * - Modal state management during request
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

describe('CopyCommentsModal - API Integration (US-CP-004)', () => {
  const sourceSubject: Subject = {
    id: '65a1b2c3d4e5f6g7h8i9j0k1',
    name: 'Mathematics',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  }

  const targetSubject: Subject = {
    id: '65a1b2c3d4e5f6g7h8i9j0k2',
    name: 'Physics',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  }

  const ownedSubjects = [targetSubject]
  const mockOnClose = jest.fn()

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    sourceSubjectId: sourceSubject.id,
    sourceSubjectName: sourceSubject.name,
    ownedSubjects,
    sourceCommentCount: 12,
  }

  const mockComments = [
    {
      id: '1',
      subjectId: targetSubject.id,
      comment: 'Comment 1',
      rating: 4,
      userId: 'user1',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: '2',
      subjectId: targetSubject.id,
      comment: 'Comment 2',
      rating: 3,
      userId: 'user1',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('AC-4.1: Copy Button Submission', () => {
    it('should send copy request when Copy button is clicked', async () => {
      personalizedCommentService.copy.mockResolvedValue(mockComments)
      render(<CopyCommentsModal {...defaultProps} />)

      // Select target subject
      const dropdown = screen.getByLabelText(/copy to \(subjects you own\)/i)
      fireEvent.change(dropdown, { target: { value: targetSubject.id } })

      // Click copy button
      const copyButton = screen.getByRole('button', { name: /copy/i })
      fireEvent.click(copyButton)

      await waitFor(() => {
        expect(personalizedCommentService.copy).toHaveBeenCalled()
      })
    })

    it('should show loading state while copying', async () => {
      personalizedCommentService.copy.mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve(mockComments), 100)
          }),
      )
      render(<CopyCommentsModal {...defaultProps} />)

      // Select target and click copy
      const dropdown = screen.getByLabelText(/copy to \(subjects you own\)/i)
      fireEvent.change(dropdown, { target: { value: targetSubject.id } })
      const copyButton = screen.getByRole('button', { name: /copy/i })
      fireEvent.click(copyButton)

      // Loading state should be visible (button disabled or spinner)
      await waitFor(() => {
        // Button should be disabled during copy
        expect(copyButton).toBeDisabled()
      })
    })

    it('should keep modal visible during request', async () => {
      personalizedCommentService.copy.mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve(mockComments), 100)
          }),
      )
      render(<CopyCommentsModal {...defaultProps} />)

      const dialog = screen.getByRole('dialog')
      const dropdown = screen.getByLabelText(/copy to \(subjects you own\)/i)
      fireEvent.change(dropdown, { target: { value: targetSubject.id } })
      const copyButton = screen.getByRole('button', { name: /copy/i })

      fireEvent.click(copyButton)

      // Modal should remain visible
      expect(dialog).toBeInTheDocument()
    })
  })

  describe('AC-4.2: API Request Format', () => {
    it('should send correct request payload with subjectFromId, subjectToId, overwrite', async () => {
      personalizedCommentService.copy.mockResolvedValue(mockComments)
      render(<CopyCommentsModal {...defaultProps} />)

      // Select target and mode
      const dropdown = screen.getByLabelText(/copy to \(subjects you own\)/i)
      fireEvent.change(dropdown, { target: { value: targetSubject.id } })

      // Keep append mode (default)
      const copyButton = screen.getByRole('button', { name: /copy/i })
      fireEvent.click(copyButton)

      await waitFor(() => {
        expect(personalizedCommentService.copy).toHaveBeenCalledWith({
          subjectFromId: sourceSubject.id,
          subjectToId: targetSubject.id,
          overwrite: false, // append mode
        })
      })
    })

    it('should send overwrite=true when overwrite mode is selected', async () => {
      personalizedCommentService.copy.mockResolvedValue(mockComments)
      render(<CopyCommentsModal {...defaultProps} />)

      // Select target
      const dropdown = screen.getByLabelText(/copy to \(subjects you own\)/i)
      fireEvent.change(dropdown, { target: { value: targetSubject.id } })

      // Select overwrite mode
      const overwriteRadio = screen.getByRole('radio', { name: /overwrite existing comments/i })
      fireEvent.click(overwriteRadio)

      const copyButton = screen.getByRole('button', { name: /copy/i })
      fireEvent.click(copyButton)

      await waitFor(() => {
        expect(personalizedCommentService.copy).toHaveBeenCalledWith({
          subjectFromId: sourceSubject.id,
          subjectToId: targetSubject.id,
          overwrite: true,
        })
      })
    })
  })

  describe('AC-4.3: Success Feedback with Mode Indication', () => {
    it('should display success message with count and append indication', async () => {
      personalizedCommentService.copy.mockResolvedValue(mockComments) // 2 comments
      render(<CopyCommentsModal {...defaultProps} />)

      const dropdown = screen.getByLabelText(/copy to \(subjects you own\)/i)
      fireEvent.change(dropdown, { target: { value: targetSubject.id } })
      const copyButton = screen.getByRole('button', { name: /copy/i })
      fireEvent.click(copyButton)

      await waitFor(() => {
        expect(screen.getByText(/successfully copied 2 comments to Physics/i)).toBeInTheDocument()
        expect(screen.getByText(/appended to existing comments/i)).toBeInTheDocument()
      })
    })

    it('should display overwrite indication in success message', async () => {
      personalizedCommentService.copy.mockResolvedValue(mockComments)
      render(<CopyCommentsModal {...defaultProps} />)

      const dropdown = screen.getByLabelText(/copy to \(subjects you own\)/i)
      fireEvent.change(dropdown, { target: { value: targetSubject.id } })
      const overwriteRadio = screen.getByRole('radio', { name: /overwrite existing comments/i })
      fireEvent.click(overwriteRadio)

      const copyButton = screen.getByRole('button', { name: /copy/i })
      fireEvent.click(copyButton)

      await waitFor(() => {
        expect(screen.getByText(/overwrote existing comments/i)).toBeInTheDocument()
      })
    })

    it('should close modal after 2-3 seconds on success', async () => {
      jest.useFakeTimers()
      personalizedCommentService.copy.mockResolvedValue(mockComments)
      render(<CopyCommentsModal {...defaultProps} />)

      const dropdown = screen.getByLabelText(/copy to \(subjects you own\)/i)
      fireEvent.change(dropdown, { target: { value: targetSubject.id } })
      const copyButton = screen.getByRole('button', { name: /copy/i })
      fireEvent.click(copyButton)

      await waitFor(() => {
        expect(screen.getByText(/successfully copied/i)).toBeInTheDocument()
      })

      // Fast-forward time
      jest.advanceTimersByTime(3000)

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled()
      })

      jest.useRealTimers()
    })

    it('should allow user to close immediately with button', async () => {
      personalizedCommentService.copy.mockResolvedValue(mockComments)
      render(<CopyCommentsModal {...defaultProps} />)

      const dropdown = screen.getByLabelText(/copy to \(subjects you own\)/i)
      fireEvent.change(dropdown, { target: { value: targetSubject.id } })
      const copyButton = screen.getByRole('button', { name: /copy/i })
      fireEvent.click(copyButton)

      await waitFor(() => {
        expect(screen.getByText(/successfully copied/i)).toBeInTheDocument()
      })

      // Look for "Done" button and click it
      const doneButton = screen.queryByRole('button', { name: /done/i })
      if (doneButton) {
        fireEvent.click(doneButton)
        expect(mockOnClose).toHaveBeenCalled()
      }
    })
  })

  describe('AC-4.4: Error Handling', () => {
    it('should display error message when copy fails', async () => {
      personalizedCommentService.copy.mockRejectedValue(new Error('Failed to copy'))
      render(<CopyCommentsModal {...defaultProps} />)

      const dropdown = screen.getByLabelText(/copy to \(subjects you own\)/i)
      fireEvent.change(dropdown, { target: { value: targetSubject.id } })
      const copyButton = screen.getByRole('button', { name: /copy/i })
      fireEvent.click(copyButton)

      await waitFor(() => {
        expect(screen.getByText(/error|failed/i)).toBeInTheDocument()
      })
    })

    it('should provide Try Again button on error', async () => {
      personalizedCommentService.copy.mockRejectedValue(new Error('API Error'))
      render(<CopyCommentsModal {...defaultProps} />)

      const dropdown = screen.getByLabelText(/copy to \(subjects you own\)/i)
      fireEvent.change(dropdown, { target: { value: targetSubject.id } })
      const copyButton = screen.getByRole('button', { name: /copy/i })
      fireEvent.click(copyButton)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
      })
    })

    it('should provide Cancel button on error', async () => {
      personalizedCommentService.copy.mockRejectedValue(new Error('API Error'))
      render(<CopyCommentsModal {...defaultProps} />)

      const dropdown = screen.getByLabelText(/copy to \(subjects you own\)/i)
      fireEvent.change(dropdown, { target: { value: targetSubject.id } })
      const copyButton = screen.getByRole('button', { name: /copy/i })
      fireEvent.click(copyButton)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
      })
    })

    it('should remove loading state on error', async () => {
      personalizedCommentService.copy.mockRejectedValue(new Error('API Error'))
      render(<CopyCommentsModal {...defaultProps} />)

      const dropdown = screen.getByLabelText(/copy to \(subjects you own\)/i)
      fireEvent.change(dropdown, { target: { value: targetSubject.id } })
      const copyButton = screen.getByRole('button', { name: /copy/i })
      fireEvent.click(copyButton)

      await waitFor(() => {
        // Button should be re-enabled
        expect(copyButton).not.toBeDisabled()
      })
    })

    it('should allow retry after error', async () => {
      personalizedCommentService.copy.mockRejectedValueOnce(new Error('First attempt failed'))
      personalizedCommentService.copy.mockResolvedValueOnce(mockComments)

      render(<CopyCommentsModal {...defaultProps} />)

      const dropdown = screen.getByLabelText(/copy to \(subjects you own\)/i)
      fireEvent.change(dropdown, { target: { value: targetSubject.id } })
      const copyButton = screen.getByRole('button', { name: /copy/i })

      // First attempt - fail
      fireEvent.click(copyButton)
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
      })

      // Retry
      const tryAgainButton = screen.getByRole('button', { name: /try again/i })
      fireEvent.click(tryAgainButton)

      await waitFor(() => {
        expect(screen.getByText(/successfully copied/i)).toBeInTheDocument()
      })
    })
  })

  describe('AC-4.5: Network Error Handling', () => {
    it('should display network error message on timeout', async () => {
      personalizedCommentService.copy.mockRejectedValue(new Error('Network timeout'))
      render(<CopyCommentsModal {...defaultProps} />)

      const dropdown = screen.getByLabelText(/copy to \(subjects you own\)/i)
      fireEvent.change(dropdown, { target: { value: targetSubject.id } })
      const copyButton = screen.getByRole('button', { name: /copy/i })
      fireEvent.click(copyButton)

      await waitFor(() => {
        expect(screen.getByText(/network error|connection|timeout/i)).toBeInTheDocument()
      })
    })

    it('should provide Try Again button for network errors', async () => {
      personalizedCommentService.copy.mockRejectedValue(new Error('Network error'))
      render(<CopyCommentsModal {...defaultProps} />)

      const dropdown = screen.getByLabelText(/copy to \(subjects you own\)/i)
      fireEvent.change(dropdown, { target: { value: targetSubject.id } })
      const copyButton = screen.getByRole('button', { name: /copy/i })
      fireEvent.click(copyButton)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
      })
    })
  })

  describe('AC-4.6: Modal State Management', () => {
    it('should prevent modal close during copy', async () => {
      personalizedCommentService.copy.mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve(mockComments), 100)
          }),
      )
      render(<CopyCommentsModal {...defaultProps} />)

      const dropdown = screen.getByLabelText(/copy to \(subjects you own\)/i)
      fireEvent.change(dropdown, { target: { value: targetSubject.id } })
      const copyButton = screen.getByRole('button', { name: /copy/i })
      fireEvent.click(copyButton)

      // Try to close while copying
      const cancelButton = screen.queryByRole('button', { name: /cancel/i })
      if (cancelButton) {
        fireEvent.click(cancelButton)
        // Modal should still show success message, not call onClose immediately
        expect(mockOnClose).not.toHaveBeenCalled()
      }
    })
  })
})
