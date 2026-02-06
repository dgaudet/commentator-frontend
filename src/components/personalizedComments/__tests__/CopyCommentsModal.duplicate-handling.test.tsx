/**
 * Component Tests for CopyCommentsModal with Duplicate Handling
 * Reference: US-CP-007 - Display duplicate information in append mode
 *
 * Tests verify:
 * - Correct success message display for all scenarios
 * - Duplicate count integration
 * - Append vs overwrite mode differentiation
 * - Singular/plural form handling
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

describe('CopyCommentsModal - Duplicate Handling & Message Display (US-CP-007)', () => {
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

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('AC-7.1: Append Mode with Duplicates', () => {
    it('should display duplicate count in success message', async () => {
      const mockResult = {
        successCount: 3,
        duplicateCount: 2,
        overwrite: false,
      }
      personalizedCommentService.copy.mockResolvedValue(mockResult)

      render(<CopyCommentsModal {...defaultProps} />)

      const dropdown = screen.getByLabelText(/copy to \(Target\)/i)
      fireEvent.change(dropdown, { target: { value: targetSubject.id } })

      const copyButton = screen.getByRole('button', { name: /copy/i })
      fireEvent.click(copyButton)

      await waitFor(() => {
        expect(screen.getByText(/successfully copied 3 comments to Physics/i)).toBeInTheDocument()
        expect(screen.getByText(/2 duplicates were skipped/i)).toBeInTheDocument()
      })
    })

    it('should show "(already existed)" for clarity', async () => {
      const mockResult = {
        successCount: 2,
        duplicateCount: 1,
        overwrite: false,
      }
      personalizedCommentService.copy.mockResolvedValue(mockResult)

      render(<CopyCommentsModal {...defaultProps} />)

      const dropdown = screen.getByLabelText(/copy to \(Target\)/i)
      fireEvent.change(dropdown, { target: { value: targetSubject.id } })

      const copyButton = screen.getByRole('button', { name: /copy/i })
      fireEvent.click(copyButton)

      await waitFor(() => {
        expect(screen.getByText(/\(already existed\)/i)).toBeInTheDocument()
      })
    })

    it('should handle large duplicate counts', async () => {
      const mockResult = {
        successCount: 10,
        duplicateCount: 50,
        overwrite: false,
      }
      personalizedCommentService.copy.mockResolvedValue(mockResult)

      render(<CopyCommentsModal {...defaultProps} />)

      const dropdown = screen.getByLabelText(/copy to \(Target\)/i)
      fireEvent.change(dropdown, { target: { value: targetSubject.id } })

      const copyButton = screen.getByRole('button', { name: /copy/i })
      fireEvent.click(copyButton)

      await waitFor(() => {
        expect(screen.getByText(/successfully copied 10 comments/i)).toBeInTheDocument()
        expect(screen.getByText(/50 duplicates were skipped/i)).toBeInTheDocument()
      })
    })
  })

  describe('AC-7.2: Overwrite Mode', () => {
    it('should display "replaced all comments" message in overwrite mode', async () => {
      const mockResult = {
        successCount: 5,
        duplicateCount: 0,
        overwrite: true,
      }
      personalizedCommentService.copy.mockResolvedValue(mockResult)

      render(<CopyCommentsModal {...defaultProps} />)

      const dropdown = screen.getByLabelText(/copy to \(Target\)/i)
      fireEvent.change(dropdown, { target: { value: targetSubject.id } })

      const overwriteRadio = screen.getByRole('radio', { name: /overwrite existing comments/i })
      fireEvent.click(overwriteRadio)

      const copyButton = screen.getByRole('button', { name: /copy/i })
      fireEvent.click(copyButton)

      await waitFor(() => {
        expect(screen.getByText(/successfully replaced all comments/i)).toBeInTheDocument()
        expect(screen.getByText(/Copied 5 comments/i)).toBeInTheDocument()
      })
    })

    it('should not show duplicate info in overwrite mode', async () => {
      const mockResult = {
        successCount: 7,
        duplicateCount: 0,
        overwrite: true,
      }
      personalizedCommentService.copy.mockResolvedValue(mockResult)

      render(<CopyCommentsModal {...defaultProps} />)

      const dropdown = screen.getByLabelText(/copy to \(Target\)/i)
      fireEvent.change(dropdown, { target: { value: targetSubject.id } })

      const overwriteRadio = screen.getByRole('radio', { name: /overwrite existing comments/i })
      fireEvent.click(overwriteRadio)

      const copyButton = screen.getByRole('button', { name: /copy/i })
      fireEvent.click(copyButton)

      await waitFor(() => {
        expect(screen.queryByText(/duplicate/i)).not.toBeInTheDocument()
      })
    })
  })

  describe('AC-7.3: Append Mode Without Duplicates', () => {
    it('should not show duplicate information when count is zero', async () => {
      const mockResult = {
        successCount: 5,
        duplicateCount: 0,
        overwrite: false,
      }
      personalizedCommentService.copy.mockResolvedValue(mockResult)

      render(<CopyCommentsModal {...defaultProps} />)

      const dropdown = screen.getByLabelText(/copy to \(Target\)/i)
      fireEvent.change(dropdown, { target: { value: targetSubject.id } })

      const copyButton = screen.getByRole('button', { name: /copy/i })
      fireEvent.click(copyButton)

      await waitFor(() => {
        expect(screen.getByText(/successfully copied 5 comments to Physics/i)).toBeInTheDocument()
        expect(screen.queryByText(/duplicate/i)).not.toBeInTheDocument()
        expect(screen.queryByText(/skipped/i)).not.toBeInTheDocument()
      })
    })

    it('should display simple success message in append mode with no duplicates', async () => {
      const mockResult = {
        successCount: 3,
        duplicateCount: 0,
        overwrite: false,
      }
      personalizedCommentService.copy.mockResolvedValue(mockResult)

      render(<CopyCommentsModal {...defaultProps} />)

      const dropdown = screen.getByLabelText(/copy to \(Target\)/i)
      fireEvent.change(dropdown, { target: { value: targetSubject.id } })

      const copyButton = screen.getByRole('button', { name: /copy/i })
      fireEvent.click(copyButton)

      await waitFor(() => {
        // Should only have one success message, not multiple lines
        const messages = screen.getAllByText(/successfully copied/i)
        expect(messages.length).toBe(1)
      })
    })
  })

  describe('AC-7.4: Singular/Plural Forms', () => {
    it('should use singular "comment" for 1 comment in append mode', async () => {
      const mockResult = {
        successCount: 1,
        duplicateCount: 0,
        overwrite: false,
      }
      personalizedCommentService.copy.mockResolvedValue(mockResult)

      render(<CopyCommentsModal {...defaultProps} />)

      const dropdown = screen.getByLabelText(/copy to \(Target\)/i)
      fireEvent.change(dropdown, { target: { value: targetSubject.id } })

      const copyButton = screen.getByRole('button', { name: /copy/i })
      fireEvent.click(copyButton)

      await waitFor(() => {
        expect(screen.getByText(/1 comment to Physics/i)).toBeInTheDocument()
        expect(screen.queryByText(/1 comments/i)).not.toBeInTheDocument()
      })
    })

    it('should use plural "comments" for multiple comments in append mode', async () => {
      const mockResult = {
        successCount: 5,
        duplicateCount: 0,
        overwrite: false,
      }
      personalizedCommentService.copy.mockResolvedValue(mockResult)

      render(<CopyCommentsModal {...defaultProps} />)

      const dropdown = screen.getByLabelText(/copy to \(Target\)/i)
      fireEvent.change(dropdown, { target: { value: targetSubject.id } })

      const copyButton = screen.getByRole('button', { name: /copy/i })
      fireEvent.click(copyButton)

      await waitFor(() => {
        expect(screen.getByText(/5 comments to Physics/i)).toBeInTheDocument()
      })
    })

    it('should use singular "duplicate was" for 1 duplicate', async () => {
      const mockResult = {
        successCount: 3,
        duplicateCount: 1,
        overwrite: false,
      }
      personalizedCommentService.copy.mockResolvedValue(mockResult)

      render(<CopyCommentsModal {...defaultProps} />)

      const dropdown = screen.getByLabelText(/copy to \(Target\)/i)
      fireEvent.change(dropdown, { target: { value: targetSubject.id } })

      const copyButton = screen.getByRole('button', { name: /copy/i })
      fireEvent.click(copyButton)

      await waitFor(() => {
        expect(screen.getByText(/1 duplicate was skipped/i)).toBeInTheDocument()
        expect(screen.queryByText(/duplicates were/i)).not.toBeInTheDocument()
      })
    })

    it('should use plural "duplicates were" for multiple duplicates', async () => {
      const mockResult = {
        successCount: 3,
        duplicateCount: 5,
        overwrite: false,
      }
      personalizedCommentService.copy.mockResolvedValue(mockResult)

      render(<CopyCommentsModal {...defaultProps} />)

      const dropdown = screen.getByLabelText(/copy to \(Target\)/i)
      fireEvent.change(dropdown, { target: { value: targetSubject.id } })

      const copyButton = screen.getByRole('button', { name: /copy/i })
      fireEvent.click(copyButton)

      await waitFor(() => {
        expect(screen.getByText(/5 duplicates were skipped/i)).toBeInTheDocument()
        expect(screen.queryByText(/duplicate was/i)).not.toBeInTheDocument()
      })
    })

    it('should use singular "comment" in overwrite mode for 1 comment', async () => {
      const mockResult = {
        successCount: 1,
        duplicateCount: 0,
        overwrite: true,
      }
      personalizedCommentService.copy.mockResolvedValue(mockResult)

      render(<CopyCommentsModal {...defaultProps} />)

      const dropdown = screen.getByLabelText(/copy to \(Target\)/i)
      fireEvent.change(dropdown, { target: { value: targetSubject.id } })

      const overwriteRadio = screen.getByRole('radio', { name: /overwrite existing comments/i })
      fireEvent.click(overwriteRadio)

      const copyButton = screen.getByRole('button', { name: /copy/i })
      fireEvent.click(copyButton)

      await waitFor(() => {
        expect(screen.getByText(/Copied 1 comment/i)).toBeInTheDocument()
        expect(screen.queryByText(/1 comments/i)).not.toBeInTheDocument()
      })
    })

    it('should use plural "comments" in overwrite mode for multiple comments', async () => {
      const mockResult = {
        successCount: 8,
        duplicateCount: 0,
        overwrite: true,
      }
      personalizedCommentService.copy.mockResolvedValue(mockResult)

      render(<CopyCommentsModal {...defaultProps} />)

      const dropdown = screen.getByLabelText(/copy to \(Target\)/i)
      fireEvent.change(dropdown, { target: { value: targetSubject.id } })

      const overwriteRadio = screen.getByRole('radio', { name: /overwrite existing comments/i })
      fireEvent.click(overwriteRadio)

      const copyButton = screen.getByRole('button', { name: /copy/i })
      fireEvent.click(copyButton)

      await waitFor(() => {
        expect(screen.getByText(/Copied 8 comments/i)).toBeInTheDocument()
      })
    })
  })

  describe('AC-7.4: Long Target Names', () => {
    it('should handle very long target subject names', async () => {
      const longNameSubject: Subject = {
        id: '65a1b2c3d4e5f6g7h8i9j0k3',
        name: 'Advanced Placement Computer Science Principles Honors',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      }

      const mockResult = {
        successCount: 3,
        duplicateCount: 2,
        overwrite: false,
      }
      personalizedCommentService.copy.mockResolvedValue(mockResult)

      render(
        <CopyCommentsModal
          {...defaultProps}
          ownedSubjects={[longNameSubject]}
        />,
      )

      const dropdown = screen.getByLabelText(/copy to \(Target\)/i)
      fireEvent.change(dropdown, { target: { value: longNameSubject.id } })

      const copyButton = screen.getByRole('button', { name: /copy/i })
      fireEvent.click(copyButton)

      await waitFor(() => {
        expect(screen.getByText(/Advanced Placement Computer Science Principles Honors/i)).toBeInTheDocument()
      })
    })

    it('should handle subject names with special characters', async () => {
      const specialNameSubject: Subject = {
        id: '65a1b2c3d4e5f6g7h8i9j0k3',
        name: "O'Reilly's English & Composition",
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      }

      const mockResult = {
        successCount: 2,
        duplicateCount: 0,
        overwrite: false,
      }
      personalizedCommentService.copy.mockResolvedValue(mockResult)

      render(
        <CopyCommentsModal
          {...defaultProps}
          ownedSubjects={[specialNameSubject]}
        />,
      )

      const dropdown = screen.getByLabelText(/copy to \(Target\)/i)
      fireEvent.change(dropdown, { target: { value: specialNameSubject.id } })

      const copyButton = screen.getByRole('button', { name: /copy/i })
      fireEvent.click(copyButton)

      await waitFor(() => {
        expect(screen.getByText(/O'Reilly's English & Composition/i)).toBeInTheDocument()
      })
    })
  })

  describe('Modal Behavior After Success', () => {
    it('should display Done button after successful copy', async () => {
      const mockResult = {
        successCount: 3,
        duplicateCount: 0,
        overwrite: false,
      }
      personalizedCommentService.copy.mockResolvedValue(mockResult)

      render(<CopyCommentsModal {...defaultProps} />)

      const dropdown = screen.getByLabelText(/copy to \(Target\)/i)
      fireEvent.change(dropdown, { target: { value: targetSubject.id } })

      const copyButton = screen.getByRole('button', { name: /copy/i })
      fireEvent.click(copyButton)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /done/i })).toBeInTheDocument()
      })
    })

    it('should keep modal open until Done button clicked', async () => {
      const mockResult = {
        successCount: 2,
        duplicateCount: 1,
        overwrite: false,
      }
      personalizedCommentService.copy.mockResolvedValue(mockResult)

      render(<CopyCommentsModal {...defaultProps} />)

      const dropdown = screen.getByLabelText(/copy to \(Target\)/i)
      fireEvent.change(dropdown, { target: { value: targetSubject.id } })

      const copyButton = screen.getByRole('button', { name: /copy/i })
      fireEvent.click(copyButton)

      await waitFor(() => {
        expect(screen.getByText(/successfully copied/i)).toBeInTheDocument()
      })

      // Modal should still be open
      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(mockOnClose).not.toHaveBeenCalled()

      // Click Done
      const doneButton = screen.getByRole('button', { name: /done/i })
      fireEvent.click(doneButton)

      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })
  })

  describe('Edge Cases', () => {
    it('should handle zero comments copied', async () => {
      const mockResult = {
        successCount: 0,
        duplicateCount: 5,
        overwrite: false,
      }
      personalizedCommentService.copy.mockResolvedValue(mockResult)

      render(<CopyCommentsModal {...defaultProps} />)

      const dropdown = screen.getByLabelText(/copy to \(Target\)/i)
      fireEvent.change(dropdown, { target: { value: targetSubject.id } })

      const copyButton = screen.getByRole('button', { name: /copy/i })
      fireEvent.click(copyButton)

      await waitFor(() => {
        expect(screen.getByText(/successfully copied 0 comments/i)).toBeInTheDocument()
        expect(screen.getByText(/5 duplicates were skipped/i)).toBeInTheDocument()
      })
    })

    it('should display large numbers correctly', async () => {
      const mockResult = {
        successCount: 100,
        duplicateCount: 75,
        overwrite: false,
      }
      personalizedCommentService.copy.mockResolvedValue(mockResult)

      render(<CopyCommentsModal {...defaultProps} />)

      const dropdown = screen.getByLabelText(/copy to \(Target\)/i)
      fireEvent.change(dropdown, { target: { value: targetSubject.id } })

      const copyButton = screen.getByRole('button', { name: /copy/i })
      fireEvent.click(copyButton)

      await waitFor(() => {
        expect(screen.getByText(/100 comments/i)).toBeInTheDocument()
        expect(screen.getByText(/75 duplicates/i)).toBeInTheDocument()
      })
    })
  })
})
