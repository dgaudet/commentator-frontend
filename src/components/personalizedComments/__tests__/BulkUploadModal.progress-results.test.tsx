/**
 * BulkUploadModal - Progress and Results Tests
 * Story 5: Display Sequential Import Progress and Final Results
 *
 * Tests for progress feedback during import and results display after completion:
 * - Progress indicator showing current save progress
 * - Visual progress bar or spinner
 * - Comprehensive results with success/failure counts
 * - Failed lines displayed with details (line number, text, reason)
 * - User can close and verify imported comments
 * - Done button closes modal
 */

import { render, screen, fireEvent, waitFor } from '../../../test-utils'
import { BulkUploadModal } from '../BulkUploadModal'
import type { BulkSaveResult } from '../bulkSaveComments'
import type { Pronoun } from '../../../types'

describe('BulkUploadModal - Story 5: Progress and Results', () => {
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

  beforeEach(() => {
    jest.clearAllMocks()
  })

  const getDefaultProps = () => ({
    isOpen: true,
    onClose: mockOnClose,
    subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
    onImport: jest.fn(),
    pronouns: mockPronouns,
    pronounsLoading: false,
    pronounsError: null,
  })

  describe('AC1: Progress feedback during import', () => {
    it('should show progress indicator while saving', async () => {
      const mockOnImport = jest.fn().mockImplementation(async () => {
        // Simulate slow save
        await new Promise((resolve) => setTimeout(resolve, 100))
        return {
          successful: [],
          failed: [],
          totalAttempted: 0,
        }
      })

      const props = { ...getDefaultProps(), onImport: mockOnImport }
      render(<BulkUploadModal {...props} />)

      // Type comments and click Import
      const textarea = screen.getByRole('textbox')
      fireEvent.change(textarea, { target: { value: 'comment 1\ncomment 2' } })
      const importButton = screen.getByRole('button', { name: /Import/i })
      fireEvent.click(importButton)

      // Progress should be visible during import
      await waitFor(
        () => {
          expect(screen.queryByText(/Saving comment/i)).toBeInTheDocument()
        },
        { timeout: 2000 },
      )
    })

    it('should show progress in format: Saving comment X of Y', async () => {
      const mockOnImport = jest.fn().mockImplementation(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100))
        return {
          successful: [],
          failed: [],
          totalAttempted: 0,
        }
      })

      const props = { ...getDefaultProps(), onImport: mockOnImport }
      render(<BulkUploadModal {...props} />)

      const textarea = screen.getByRole('textbox')
      fireEvent.change(textarea, { target: { value: 'c1\nc2\nc3' } })
      const importButton = screen.getByRole('button', { name: /Import/i })
      fireEvent.click(importButton)

      // Progress message should show
      await waitFor(
        () => {
          const progressText = screen.queryByText(/Saving comment \d+ of \d+/i)
          expect(progressText).toBeInTheDocument()
        },
        { timeout: 2000 },
      )
    })

    it('should show spinner or progress bar during save', async () => {
      const mockOnImport = jest.fn().mockImplementation(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100))
        return {
          successful: [],
          failed: [],
          totalAttempted: 0,
        }
      })

      const props = { ...getDefaultProps(), onImport: mockOnImport }
      render(<BulkUploadModal {...props} />)

      const textarea = screen.getByRole('textbox')
      fireEvent.change(textarea, { target: { value: 'comment 1' } })
      const importButton = screen.getByRole('button', { name: /Import/i })
      fireEvent.click(importButton)

      // Should show loading indicator
      await waitFor(() => {
        const spinner = screen.queryByRole('progressbar') || screen.queryByText(/Loading/)
        expect(spinner).toBeInTheDocument()
      })
    })
  })

  describe('AC2: Results summary display', () => {
    it('should display successful import count', async () => {
      const mockResult: BulkSaveResult = {
        successful: [{ text: 'comment 1', rating: 5 }],
        failed: [],
        totalAttempted: 1,
      }
      const mockOnImport = jest.fn(async () => mockResult)

      const props = { ...getDefaultProps(), onImport: mockOnImport }
      render(<BulkUploadModal {...props} />)

      const textarea = screen.getByRole('textbox')
      fireEvent.change(textarea, { target: { value: 'comment 1, 5' } })
      const importButton = screen.getByRole('button', { name: /Import/i })
      fireEvent.click(importButton)

      // Should show success message
      await waitFor(() => {
        expect(screen.queryByText(/Successfully imported 1 comment/i)).toBeInTheDocument()
      })
    })

    it('should display failed import count', async () => {
      const mockResult: BulkSaveResult = {
        successful: [],
        failed: [
          { lineNumber: 1, originalText: 'x'.repeat(600), reason: 'exceeds character limit' },
        ],
        totalAttempted: 1,
      }
      const mockOnImport = jest.fn(async () => mockResult)

      const props = { ...getDefaultProps(), onImport: mockOnImport }
      render(<BulkUploadModal {...props} />)

      const textarea = screen.getByRole('textbox')
      fireEvent.change(textarea, { target: { value: 'x'.repeat(600) } })
      const importButton = screen.getByRole('button', { name: /Import/i })
      fireEvent.click(importButton)

      // Should show failure message
      await waitFor(() => {
        expect(screen.queryByText(/1 comment\(s\) failed to save/i)).toBeInTheDocument()
      })
    })
  })

  describe('AC3: Failed lines section', () => {
    it('should display failed items with line number', async () => {
      const mockResult: BulkSaveResult = {
        successful: [],
        failed: [
          { lineNumber: 2, originalText: 'too long comment', reason: 'exceeds character limit' },
        ],
        totalAttempted: 1,
      }
      const mockOnImport = jest.fn(async () => mockResult)

      const props = { ...getDefaultProps(), onImport: mockOnImport }
      render(<BulkUploadModal {...props} />)

      const textarea = screen.getByRole('textbox')
      fireEvent.change(textarea, { target: { value: 'comment\ntoo long comment' } })
      const importButton = screen.getByRole('button', { name: /Import/i })
      fireEvent.click(importButton)

      await waitFor(() => {
        expect(screen.queryByText(/Line 2:/i)).toBeInTheDocument()
      })
    })

    it('should display original text for failed items', async () => {
      const mockResult: BulkSaveResult = {
        successful: [],
        failed: [
          { lineNumber: 1, originalText: 'failed comment text', reason: 'validation error' },
        ],
        totalAttempted: 1,
      }
      const mockOnImport = jest.fn(async () => mockResult)

      const props = { ...getDefaultProps(), onImport: mockOnImport }
      render(<BulkUploadModal {...props} />)

      const textarea = screen.getByRole('textbox')
      fireEvent.change(textarea, { target: { value: 'failed comment text' } })
      const importButton = screen.getByRole('button', { name: /Import/i })
      fireEvent.click(importButton)

      // Wait for the results to be displayed
      await waitFor(
        () => {
          expect(screen.queryByText(/failed comment text/i)).toBeInTheDocument()
        },
        { timeout: 3000 },
      )
    })

    it('should display error reason for each failed item', async () => {
      const mockResult: BulkSaveResult = {
        successful: [],
        failed: [
          { lineNumber: 1, originalText: 'text', reason: 'exceeds character limit' },
        ],
        totalAttempted: 1,
      }
      const mockOnImport = jest.fn(async () => mockResult)

      const props = { ...getDefaultProps(), onImport: mockOnImport }
      render(<BulkUploadModal {...props} />)

      const textarea = screen.getByRole('textbox')
      fireEvent.change(textarea, { target: { value: 'text' } })
      const importButton = screen.getByRole('button', { name: /Import/i })
      fireEvent.click(importButton)

      await waitFor(() => {
        expect(screen.queryByText(/exceeds character limit/i)).toBeInTheDocument()
      })
    })

    it('should display failed lines in monospace font for easy copy', async () => {
      const mockResult: BulkSaveResult = {
        successful: [],
        failed: [
          { lineNumber: 1, originalText: 'failed comment', reason: 'error' },
        ],
        totalAttempted: 1,
      }
      const mockOnImport = jest.fn(async () => mockResult)

      const props = { ...getDefaultProps(), onImport: mockOnImport }
      render(<BulkUploadModal {...props} />)

      const textarea = screen.getByRole('textbox')
      fireEvent.change(textarea, { target: { value: 'failed comment' } })
      const importButton = screen.getByRole('button', { name: /Import/i })
      fireEvent.click(importButton)

      await waitFor(() => {
        const failedSection = screen.queryByText(/failed comment/)
        expect(failedSection).toBeInTheDocument()
        // Check if it's in a monospace font (the element itself has monospace style)
        const style = window.getComputedStyle(failedSection!)
        expect(style.fontFamily).toContain('monospace')
      })
    })
  })

  describe('AC4: User actions after results', () => {
    it('should have Done button to close modal', async () => {
      const mockResult: BulkSaveResult = {
        successful: [{ text: 'comment 1', rating: 5 }],
        failed: [],
        totalAttempted: 1,
      }
      const mockOnImport = jest.fn(async () => mockResult)

      const props = { ...getDefaultProps(), onImport: mockOnImport }
      render(<BulkUploadModal {...props} />)

      const textarea = screen.getByRole('textbox')
      fireEvent.change(textarea, { target: { value: 'comment 1, 5' } })
      const importButton = screen.getByRole('button', { name: /Import/i })
      fireEvent.click(importButton)

      await waitFor(() => {
        const doneButton = screen.queryByRole('button', { name: /Done/i })
        expect(doneButton).toBeInTheDocument()
      })
    })

    it('should close modal and return to comments list on Done', async () => {
      const mockResult: BulkSaveResult = {
        successful: [{ text: 'comment 1', rating: 5 }],
        failed: [],
        totalAttempted: 1,
      }
      const mockOnImport = jest.fn(async () => mockResult)

      const props = { ...getDefaultProps(), onImport: mockOnImport }
      render(<BulkUploadModal {...props} />)

      const textarea = screen.getByRole('textbox')
      fireEvent.change(textarea, { target: { value: 'comment 1, 5' } })
      const importButton = screen.getByRole('button', { name: /Import/i })
      fireEvent.click(importButton)

      await waitFor(() => {
        const doneButton = screen.queryByRole('button', { name: /Done/i })
        expect(doneButton).toBeInTheDocument()
      })

      const doneButton = screen.getByRole('button', { name: /Done/i })
      fireEvent.click(doneButton)

      expect(mockOnClose).toHaveBeenCalled()
    })
  })

  describe('AC5: Accessibility', () => {
    it('should have alert role for results message', async () => {
      const mockResult: BulkSaveResult = {
        successful: [{ text: 'comment 1', rating: 5 }],
        failed: [],
        totalAttempted: 1,
      }
      const mockOnImport = jest.fn(async () => mockResult)

      const props = { ...getDefaultProps(), onImport: mockOnImport }
      render(<BulkUploadModal {...props} />)

      const textarea = screen.getByRole('textbox')
      fireEvent.change(textarea, { target: { value: 'comment 1, 5' } })
      const importButton = screen.getByRole('button', { name: /Import/i })
      fireEvent.click(importButton)

      await waitFor(() => {
        const alert = screen.queryByRole('alert')
        expect(alert).toBeInTheDocument()
      })
    })
  })

  describe('AC6: Story 3 - Duplicate count in status message', () => {
    it('should display duplicate count when duplicates removed', async () => {
      const mockResult: BulkSaveResult = {
        successful: [{ text: 'Great work', rating: 5 }],
        failed: [],
        totalAttempted: 3,
        duplicateCount: 2,
      }
      const mockOnImport = jest.fn(async () => mockResult)

      const props = { ...getDefaultProps(), onImport: mockOnImport }
      render(<BulkUploadModal {...props} />)

      const textarea = screen.getByRole('textbox')
      fireEvent.change(textarea, { target: { value: 'Great work, 5\ngreat work, 5\ngreat work, 5' } })
      const importButton = screen.getByRole('button', { name: /Import/i })
      fireEvent.click(importButton)

      await waitFor(() => {
        expect(screen.queryByText(/2 duplicates removed/i)).toBeInTheDocument()
      })
    })

    it('should not display duplicate count when no duplicates', async () => {
      const mockResult: BulkSaveResult = {
        successful: [
          { text: 'Great work', rating: 5 },
          { text: 'Good effort', rating: 4 },
        ],
        failed: [],
        totalAttempted: 2,
        duplicateCount: 0,
      }
      const mockOnImport = jest.fn(async () => mockResult)

      const props = { ...getDefaultProps(), onImport: mockOnImport }
      render(<BulkUploadModal {...props} />)

      const textarea = screen.getByRole('textbox')
      fireEvent.change(textarea, { target: { value: 'Great work, 5\nGood effort, 4' } })
      const importButton = screen.getByRole('button', { name: /Import/i })
      fireEvent.click(importButton)

      await waitFor(() => {
        expect(screen.queryByText(/Successfully imported 2 comments$/i)).toBeInTheDocument()
        expect(screen.queryByText(/duplicates removed/i)).not.toBeInTheDocument()
      })
    })

    it('should use singular "1 duplicate removed" for single duplicate', async () => {
      const mockResult: BulkSaveResult = {
        successful: [{ text: 'Comment', rating: 5 }],
        failed: [],
        totalAttempted: 2,
        duplicateCount: 1,
      }
      const mockOnImport = jest.fn(async () => mockResult)

      const props = { ...getDefaultProps(), onImport: mockOnImport }
      render(<BulkUploadModal {...props} />)

      const textarea = screen.getByRole('textbox')
      fireEvent.change(textarea, { target: { value: 'Comment, 5\ncomment, 5' } })
      const importButton = screen.getByRole('button', { name: /Import/i })
      fireEvent.click(importButton)

      await waitFor(() => {
        expect(screen.queryByText(/1 duplicate removed/i)).toBeInTheDocument()
        expect(screen.queryByText(/duplicates removed/i)).not.toBeInTheDocument()
      })
    })

    it('should use singular "1 comment" when only 1 successfully imported', async () => {
      const mockResult: BulkSaveResult = {
        successful: [{ text: 'Only one', rating: 5 }],
        failed: [],
        totalAttempted: 1,
        duplicateCount: 0,
      }
      const mockOnImport = jest.fn(async () => mockResult)

      const props = { ...getDefaultProps(), onImport: mockOnImport }
      render(<BulkUploadModal {...props} />)

      const textarea = screen.getByRole('textbox')
      fireEvent.change(textarea, { target: { value: 'Only one, 5' } })
      const importButton = screen.getByRole('button', { name: /Import/i })
      fireEvent.click(importButton)

      await waitFor(() => {
        const message = screen.queryByText(/Successfully imported/)
        expect(message?.textContent).toContain('1 comment')
        expect(message?.textContent).not.toContain('1 comments')
      })
    })

    it('should use plural "2 comments" when 2 or more successfully imported', async () => {
      const mockResult: BulkSaveResult = {
        successful: [
          { text: 'Comment 1', rating: 5 },
          { text: 'Comment 2', rating: 4 },
        ],
        failed: [],
        totalAttempted: 2,
        duplicateCount: 0,
      }
      const mockOnImport = jest.fn(async () => mockResult)

      const props = { ...getDefaultProps(), onImport: mockOnImport }
      render(<BulkUploadModal {...props} />)

      const textarea = screen.getByRole('textbox')
      fireEvent.change(textarea, { target: { value: 'Comment 1, 5\nComment 2, 4' } })
      const importButton = screen.getByRole('button', { name: /Import/i })
      fireEvent.click(importButton)

      await waitFor(() => {
        expect(screen.queryByText(/Successfully imported 2 comments$/i)).toBeInTheDocument()
      })
    })

    it('should show both comment count and duplicate count in message', async () => {
      const mockResult: BulkSaveResult = {
        successful: [{ text: 'Great', rating: 5 }],
        failed: [],
        totalAttempted: 4,
        duplicateCount: 3,
      }
      const mockOnImport = jest.fn(async () => mockResult)

      const props = { ...getDefaultProps(), onImport: mockOnImport }
      render(<BulkUploadModal {...props} />)

      const textarea = screen.getByRole('textbox')
      fireEvent.change(textarea, { target: { value: 'Great, 5\ngreat, 5\ngreat, 5\ngreat, 5' } })
      const importButton = screen.getByRole('button', { name: /Import/i })
      fireEvent.click(importButton)

      await waitFor(() => {
        const message = screen.queryByText(/Successfully imported 1 comment/)
        expect(message).toBeInTheDocument()
        expect(screen.queryByText(/3 duplicates removed/i)).toBeInTheDocument()
      })
    })
  })
})
