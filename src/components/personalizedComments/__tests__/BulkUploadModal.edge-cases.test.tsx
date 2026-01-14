/**
 * BulkUploadModal - Edge Cases and Error Handling Tests
 * Story 6 & 7: Display Results and Handle Edge Cases
 *
 * Tests for edge cases, error handling, and validation:
 * - Empty textarea validation
 * - Whitespace-only input
 * - Malformed ratings
 * - Very long comment lists
 * - Network errors
 */

import { render, screen, fireEvent, waitFor } from '../../../test-utils'
import { BulkUploadModal } from '../BulkUploadModal'
import type { BulkSaveResult } from '../bulkSaveComments'

describe('BulkUploadModal - Story 6 & 7: Edge Cases and Results', () => {
  const mockOnClose = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  const getDefaultProps = () => ({
    isOpen: true,
    onClose: mockOnClose,
    subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
    onImport: jest.fn(),
  })

  describe('AC1: Validation errors', () => {
    it('should show validation error for empty textarea', async () => {
      const props = getDefaultProps()
      render(<BulkUploadModal {...props} />)

      const importButton = screen.getByRole('button', { name: /Import/i })
      fireEvent.click(importButton)

      await waitFor(() => {
        expect(screen.queryByText(/Please paste at least one comment/i)).toBeInTheDocument()
      })
    })

    it('should show validation error for whitespace-only input', async () => {
      const props = getDefaultProps()
      render(<BulkUploadModal {...props} />)

      const textarea = screen.getByRole('textbox')
      fireEvent.change(textarea, { target: { value: '   \n  \n   ' } })
      const importButton = screen.getByRole('button', { name: /Import/i })
      fireEvent.click(importButton)

      await waitFor(() => {
        expect(screen.queryByText(/Please paste at least one comment/i)).toBeInTheDocument()
      })
    })
  })

  describe('AC2: Malformed ratings', () => {
    it('should treat invalid rating as no rating', async () => {
      const mockResult: BulkSaveResult = {
        successful: [{ text: 'comment, abc', rating: 3 }],
        failed: [],
        totalAttempted: 1,
      }
      const mockOnImport = jest.fn(async () => mockResult)

      const props = { ...getDefaultProps(), onImport: mockOnImport }
      render(<BulkUploadModal {...props} />)

      const textarea = screen.getByRole('textbox')
      fireEvent.change(textarea, { target: { value: 'comment, abc' } })
      const importButton = screen.getByRole('button', { name: /Import/i })
      fireEvent.click(importButton)

      // Should call onImport with default rating 3 and progress callback
      await waitFor(() => {
        expect(mockOnImport).toHaveBeenCalledWith(
          expect.arrayContaining([
            expect.objectContaining({
              text: 'comment, abc',
              rating: 3,
            }),
          ]),
          expect.any(Function),
        )
      })
    })

    it('should treat rating > 5 as no rating', async () => {
      const mockResult: BulkSaveResult = {
        successful: [{ text: 'comment, 6', rating: 3 }],
        failed: [],
        totalAttempted: 1,
      }
      const mockOnImport = jest.fn(async () => mockResult)

      const props = { ...getDefaultProps(), onImport: mockOnImport }
      render(<BulkUploadModal {...props} />)

      const textarea = screen.getByRole('textbox')
      fireEvent.change(textarea, { target: { value: 'comment, 6' } })
      const importButton = screen.getByRole('button', { name: /Import/i })
      fireEvent.click(importButton)

      await waitFor(() => {
        expect(mockOnImport).toHaveBeenCalledWith(
          expect.arrayContaining([
            expect.objectContaining({
              rating: 3,
            }),
          ]),
          expect.any(Function),
        )
      })
    })
  })

  describe('AC3: Large imports', () => {
    it('should handle 50+ comments', async () => {
      const comments = Array.from({ length: 55 }, (_, i) => `comment ${i + 1}`)
      const mockResult: BulkSaveResult = {
        successful: comments.map((text) => ({ text, rating: 3 })),
        failed: [],
        totalAttempted: 55,
      }
      const mockOnImport = jest.fn(async () => mockResult)

      const props = { ...getDefaultProps(), onImport: mockOnImport }
      render(<BulkUploadModal {...props} />)

      const textarea = screen.getByRole('textbox')
      fireEvent.change(textarea, { target: { value: comments.join('\n') } })
      const importButton = screen.getByRole('button', { name: /Import/i })
      fireEvent.click(importButton)

      await waitFor(() => {
        expect(screen.queryByText(/Successfully imported 55 comments/i)).toBeInTheDocument()
      })
    })
  })

  describe('AC4: Network errors', () => {
    it('should show user-friendly error message on network failure', async () => {
      const mockOnImport = jest.fn(async () => {
        throw new Error('Network error')
      })

      const props = { ...getDefaultProps(), onImport: mockOnImport }
      render(<BulkUploadModal {...props} />)

      const textarea = screen.getByRole('textbox')
      fireEvent.change(textarea, { target: { value: 'test comment' } })
      const importButton = screen.getByRole('button', { name: /Import/i })
      fireEvent.click(importButton)

      await waitFor(() => {
        expect(screen.queryByText(/Failed to import comments/i)).toBeInTheDocument()
      })
    })

    it('should allow retry after error', async () => {
      const mockOnImport = jest.fn(async () => {
        throw new Error('Network error')
      })

      const props = { ...getDefaultProps(), onImport: mockOnImport }
      render(<BulkUploadModal {...props} />)

      const textarea = screen.getByRole('textbox')
      fireEvent.change(textarea, { target: { value: 'test comment' } })
      const importButton = screen.getByRole('button', { name: /Import/i })
      fireEvent.click(importButton)

      await waitFor(() => {
        expect(screen.queryByText(/Failed to import comments/i)).toBeInTheDocument()
      })

      // Should show textarea again for retry
      const retryTextarea = screen.getByRole('textbox')
      expect(retryTextarea).toBeInTheDocument()
      expect(retryTextarea).toHaveValue('test comment')
    })
  })

  describe('AC5: Partial success tracking', () => {
    it('should track both successful and failed imports', async () => {
      const mockResult: BulkSaveResult = {
        successful: [
          { text: 'comment 1', rating: 5 },
          { text: 'comment 3', rating: 4 },
        ],
        failed: [
          { lineNumber: 2, originalText: 'x'.repeat(600), reason: 'exceeds character limit' },
        ],
        totalAttempted: 3,
      }
      const mockOnImport = jest.fn(async () => mockResult)

      const props = { ...getDefaultProps(), onImport: mockOnImport }
      render(<BulkUploadModal {...props} />)

      const textarea = screen.getByRole('textbox')
      fireEvent.change(textarea, { target: { value: 'comment 1\nx'.repeat(600) + '\ncomment 3' } })
      const importButton = screen.getByRole('button', { name: /Import/i })
      fireEvent.click(importButton)

      await waitFor(() => {
        expect(screen.queryByText(/Successfully imported 2 comments/i)).toBeInTheDocument()
        expect(screen.queryByText(/1 comment\(s\) failed/i)).toBeInTheDocument()
      })
    })
  })
})
