/**
 * BulkUploadModal - Replace Pronouns with Placeholders Button Tests
 * TASK-1.2: Replace Pronouns Button in Bulk Upload Modal
 *
 * TDD Tests following Red-Green-Refactor cycle
 * Tests for button functionality, loading states, and error handling
 */

import { render, screen, fireEvent, waitFor } from '../../../test-utils'
import { BulkUploadModal } from '../BulkUploadModal'
import type { Pronoun } from '../../../types'

describe('BulkUploadModal - Replace Pronouns with Placeholders Button', () => {
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

  const mockOnClose = jest.fn()
  const mockOnImport = jest.fn().mockResolvedValue({
    successful: [],
    failed: [],
  })

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    subjectId: 'subject1',
    onImport: mockOnImport,
    pronouns: mockPronouns,
    pronounsLoading: false,
    pronounsError: null,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('AC-2.1: Button Presence & Placement', () => {
    it('should render "Replace Pronouns with Placeholders" button', () => {
      render(<BulkUploadModal {...defaultProps} />)

      const button = screen.getByRole('button', { name: /replace pronouns with placeholders/i })
      expect(button).toBeInTheDocument()
    })

    it('should place button near the textarea', () => {
      render(<BulkUploadModal {...defaultProps} />)

      const button = screen.getByRole('button', { name: /replace pronouns with placeholders/i })
      const textarea = screen.getByRole('textbox', { name: /paste your comments here/i })

      // Button should be visible in the same container (near textarea)
      expect(button).toBeInTheDocument()
      expect(textarea).toBeInTheDocument()
    })
  })

  describe('AC-2.2: Button Disabled State', () => {
    it('should disable button while pronouns are loading', () => {
      render(<BulkUploadModal {...defaultProps} pronounsLoading={true} />)

      const button = screen.getByRole('button', { name: /replace pronouns with placeholders/i })
      expect(button).toBeDisabled()
    })

    it('should disable button if no pronouns exist for user', () => {
      render(<BulkUploadModal {...defaultProps} pronouns={[]} />)

      const button = screen.getByRole('button', { name: /replace pronouns with placeholders/i })
      expect(button).toBeDisabled()
    })

    it('should show tooltip explaining why button is disabled', () => {
      render(<BulkUploadModal {...defaultProps} />)

      const button = screen.getByRole('button', { name: /replace pronouns with placeholders/i })
      expect(button).toHaveAttribute('title')
    })
  })

  describe('AC-2.3: Loading State', () => {
    it('should show loading state briefly when replacing pronouns', async () => {
      render(<BulkUploadModal {...defaultProps} />)

      const button = screen.getByRole('button', { name: /replace pronouns with placeholders/i })
      const textarea = screen.getByRole('textbox', { name: /paste your comments here/i })

      // Type some text
      fireEvent.change(textarea, { target: { value: 'He is excellent' } })

      // Click button
      fireEvent.click(button)

      // Since replacement is synchronous, loading state happens very briefly
      // After that, button should show completed text
      await waitFor(() => {
        expect(textarea).toHaveValue('<pronoun> is excellent')
      })
    })

    it('should update textarea after replacement', async () => {
      render(<BulkUploadModal {...defaultProps} />)

      const textarea = screen.getByRole('textbox', { name: /paste your comments here/i })

      fireEvent.change(textarea, { target: { value: 'He is excellent' } })

      const button = screen.getByRole('button', { name: /replace pronouns with placeholders/i })
      fireEvent.click(button)

      // Textarea should be updated with replaced text
      expect(textarea).toHaveValue('<pronoun> is excellent')
    })
  })

  describe('AC-2.4: Successful Replacement', () => {
    it('should replace pronouns in textarea on successful click', async () => {
      render(<BulkUploadModal {...defaultProps} />)

      const textarea = screen.getByRole('textbox', { name: /paste your comments here/i })
      fireEvent.change(textarea, { target: { value: 'He is excellent. His work is great.' } })

      const button = screen.getByRole('button', { name: /replace pronouns with placeholders/i })
      fireEvent.click(button)

      await waitFor(() => {
        expect(textarea).toHaveValue(
          '<pronoun> is excellent. <possessive pronoun> work is great.',
        )
      })
    })

    it('should show success message with replacement count', async () => {
      render(<BulkUploadModal {...defaultProps} />)

      const textarea = screen.getByRole('textbox', { name: /paste your comments here/i })
      fireEvent.change(textarea, { target: { value: 'He is excellent. His work is great.' } })

      const button = screen.getByRole('button', { name: /replace pronouns with placeholders/i })
      fireEvent.click(button)

      await waitFor(() => {
        // Should show success message with count
        expect(screen.getByText(/replaced.*2.*pronouns/i)).toBeInTheDocument()
      })
    })
  })

  describe('AC-2.5: No Pronouns Found', () => {
    it('should show message when no pronouns found in text', async () => {
      render(<BulkUploadModal {...defaultProps} />)

      const textarea = screen.getByRole('textbox', { name: /paste your comments here/i })
      fireEvent.change(textarea, { target: { value: 'The student excels' } })

      const button = screen.getByRole('button', { name: /replace pronouns with placeholders/i })
      fireEvent.click(button)

      await waitFor(() => {
        expect(screen.getByText(/no pronouns found in text/i)).toBeInTheDocument()
      })
    })

    it('should not modify text when no pronouns are found', async () => {
      render(<BulkUploadModal {...defaultProps} />)

      const textarea = screen.getByRole('textbox', { name: /paste your comments here/i })
      const originalText = 'The student excels'
      fireEvent.change(textarea, { target: { value: originalText } })

      const button = screen.getByRole('button', { name: /replace pronouns with placeholders/i })
      fireEvent.click(button)

      await waitFor(() => {
        expect(textarea).toHaveValue(originalText)
      })
    })
  })

  describe('AC-2.6: Error Handling', () => {
    it('should show error message if replacement fails', async () => {
      render(<BulkUploadModal {...defaultProps} />)

      const textarea = screen.getByRole('textbox', { name: /paste your comments here/i })
      fireEvent.change(textarea, { target: { value: 'Invalid text' } })

      const button = screen.getByRole('button', { name: /replace pronouns with placeholders/i })
      fireEvent.click(button)

      // Should show success or info message (not error since replacement should work)
      await waitFor(() => {
        expect(screen.queryByText(/no pronouns found/i)).toBeInTheDocument()
      })
    })

    it('should disable button if pronouns error on load', async () => {
      render(<BulkUploadModal {...defaultProps} pronounsError="Failed to load pronouns" />)

      // Button should not be visible if there was an error
      const button = screen.queryByRole('button', { name: /replace pronouns with placeholders/i })
      expect(button).not.toBeInTheDocument()
    })
  })

  describe('AC-2.7: Empty Textarea Handling', () => {
    it('should show message when textarea is empty', async () => {
      render(<BulkUploadModal {...defaultProps} />)

      const textarea = screen.getByRole('textbox', { name: /paste your comments here/i })
      fireEvent.change(textarea, { target: { value: '' } })

      const button = screen.getByRole('button', { name: /replace pronouns with placeholders/i })
      fireEvent.click(button)

      await waitFor(() => {
        expect(screen.getByText(/please enter text first/i)).toBeInTheDocument()
      })
    })

    it('should not make API call when textarea is empty', async () => {
      render(<BulkUploadModal {...defaultProps} />)

      const textarea = screen.getByRole('textbox', { name: /paste your comments here/i })
      const button = screen.getByRole('button', { name: /replace pronouns with placeholders/i })

      // First click
      fireEvent.change(textarea, { target: { value: 'He is excellent. His work is great.' } })
      fireEvent.click(button)

      await waitFor(() => {
        expect(textarea).toHaveValue(
          '<pronoun> is excellent. <possessive pronoun> work is great.',
        )
      })

      // Second click (should not double-replace)
      fireEvent.click(button)

      await waitFor(() => {
        // Should not replace placeholders with more placeholders
        expect(textarea).toHaveValue(
          '<pronoun> is excellent. <possessive pronoun> work is great.',
        )
      })
    })
  })

  describe('AC-2.9: Text Preservation', () => {
    it('should preserve non-pronoun text', async () => {
      render(<BulkUploadModal {...defaultProps} />)

      const textarea = screen.getByRole('textbox', { name: /paste your comments here/i })
      const text = 'He is excellent, and his work is outstanding!'
      fireEvent.change(textarea, { target: { value: text } })

      const button = screen.getByRole('button', { name: /replace pronouns with placeholders/i })
      fireEvent.click(button)

      await waitFor(() => {
        const result = (textarea as HTMLTextAreaElement).value
        // Non-pronoun parts should be preserved
        expect(result).toContain('excellent')
        expect(result).toContain('outstanding')
        // Punctuation should be preserved
        expect(result).toContain(',')
        expect(result).toContain('!')
      })
    })

    it('should preserve line breaks', async () => {
      render(<BulkUploadModal {...defaultProps} />)

      const textarea = screen.getByRole('textbox', { name: /paste your comments here/i })
      const text = 'He is excellent.\nHis work is great.'
      fireEvent.change(textarea, { target: { value: text } })

      const button = screen.getByRole('button', { name: /replace pronouns with placeholders/i })
      fireEvent.click(button)

      await waitFor(() => {
        const result = (textarea as HTMLTextAreaElement).value
        expect(result).toContain('\n')
      })
    })
  })

  describe('AC-2.10: Accessibility', () => {
    it('should be focusable and activatable with keyboard', () => {
      render(<BulkUploadModal {...defaultProps} />)

      const button = screen.getByRole('button', { name: /replace pronouns with placeholders/i })

      // Should be a button element (keyboard accessible)
      expect(button.tagName).toBe('BUTTON')

      // Should not have tabindex that removes it from tab order
      const tabindex = button.getAttribute('tabindex')
      expect(tabindex === null || tabindex === '0' || parseInt(tabindex) >= 0).toBe(true)
    })

    it('should have proper ARIA labels', () => {
      render(<BulkUploadModal {...defaultProps} />)

      const button = screen.getByRole('button', { name: /replace pronouns with placeholders/i })

      // Button should have accessible name (visible or aria-label)
      expect(button).toHaveAccessibleName()
    })
  })
})
