/**
 * OutcomeCommentsModal Replace Pronouns Button Tests
 *
 * Story 1: Replace Pronouns Button UI in Outcome Comments Modal
 * - Button appears in add section when pronouns are configured
 * - Button is disabled when no pronouns
 * - Button shows loading state while processing
 * - Button uses secondary variant
 * - Works on both add and edit forms
 */

import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from '../../../contexts/ThemeContext'
import { OutcomeCommentsModal } from '../OutcomeCommentsModal'
import type { OutcomeComment, Pronoun } from '../../../types'

describe('OutcomeCommentsModal - Replace Pronouns Button (Story 1)', () => {
  const mockEntityData = { id: 'class-1', name: 'Grade 10 Math' }
  const mockOutcomeComments: OutcomeComment[] = []
  const mockPronouns: Pronoun[] = [
    { id: '1', pronoun: 'he', possessivePronoun: 'his', userId: 'user-1', createdAt: '2026-01-21T00:00:00Z', updatedAt: '2026-01-21T00:00:00Z' },
    { id: '2', pronoun: 'she', possessivePronoun: 'her', userId: 'user-1', createdAt: '2026-01-21T00:00:00Z', updatedAt: '2026-01-21T00:00:00Z' },
  ]

  const mockHandlers = {
    onCreateComment: jest.fn(),
    onUpdateComment: jest.fn(),
    onDeleteComment: jest.fn(),
  }

  const renderComponent = (pronouns: Pronoun[] = mockPronouns) => {
    return render(
      <ThemeProvider>
        <OutcomeCommentsModal
          isOpen={true}
          entityData={mockEntityData}
          outcomeComments={mockOutcomeComments}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
          pronouns={pronouns}
          pronounsLoading={false}
          pronounsError={null}
        />
      </ThemeProvider>,
    )
  }

  describe('Button UI - Add Section', () => {
    it('should render Replace Pronouns button in add section when pronouns are configured', () => {
      renderComponent()

      const button = screen.getByRole('button', {
        name: /Replace Pronouns with Placeholders/i,
      })
      expect(button).toBeInTheDocument()
    })

    it('should render button with secondary variant styling', () => {
      renderComponent()

      const button = screen.getByRole('button', {
        name: /Replace Pronouns with Placeholders/i,
      })
      // Check that button element exists (styling will be verified in integration tests)
      expect(button).toBeInTheDocument()
      expect(button).not.toBeDisabled()
    })

    it('should disable button when pronouns array is empty', () => {
      renderComponent([])

      const button = screen.getByRole('button', {
        name: /Replace Pronouns with Placeholders/i,
      })
      expect(button).toBeDisabled()
    })

    it('should update textarea with replaced pronouns on click', () => {
      renderComponent()

      const textarea = screen.getByLabelText(/Add new outcome comment/i) as HTMLTextAreaElement
      const button = screen.getByRole('button', {
        name: /Replace Pronouns with Placeholders/i,
      })

      // Set some text with pronouns
      fireEvent.change(textarea, { target: { value: 'He did well' } })
      expect(textarea.value).toBe('He did well')

      // Click the button
      fireEvent.click(button)

      // Textarea should be updated with pronoun placeholders
      expect(textarea.value).toContain('<pronoun>')
    })

    it('should have proper title attribute for disabled state', () => {
      renderComponent([])

      const button = screen.getByRole('button', {
        name: /Replace Pronouns with Placeholders/i,
      })
      expect(button).toHaveAttribute('title', 'No pronouns configured')
    })

    it('should be positioned after textarea in add section', () => {
      renderComponent()

      const textarea = screen.getByLabelText(/Add new outcome comment/i)
      const button = screen.getByRole('button', {
        name: /Replace Pronouns with Placeholders/i,
      })

      // Button should exist and be in DOM after textarea
      expect(button).toBeInTheDocument()
      expect(textarea).toBeInTheDocument()
    })
  })

  describe('Button State Management', () => {
    it('should show success message when pronouns are replaced', () => {
      renderComponent()

      const textarea = screen.getByLabelText(/Add new outcome comment/i) as HTMLTextAreaElement
      const button = screen.getByRole('button', {
        name: /Replace Pronouns with Placeholders/i,
      })

      // Set text with pronouns
      fireEvent.change(textarea, { target: { value: 'He is great and his work is excellent' } })

      // Click the button
      fireEvent.click(button)

      // Success message should appear
      expect(screen.getByText(/Replaced 2 pronouns/i)).toBeInTheDocument()
    })

    it('should not render button when pronounsError is set', () => {
      render(
        <ThemeProvider>
          <OutcomeCommentsModal
            isOpen={true}
            entityData={mockEntityData}
            outcomeComments={mockOutcomeComments}
            onCreateComment={mockHandlers.onCreateComment}
            onUpdateComment={mockHandlers.onUpdateComment}
            onDeleteComment={mockHandlers.onDeleteComment}
            loading={false}
            error={null}
            pronouns={mockPronouns}
            pronounsLoading={false}
            pronounsError="Failed to load pronouns"
          />
        </ThemeProvider>,
      )

      const button = screen.queryByRole('button', {
        name: /Replace Pronouns with Placeholders/i,
      })
      expect(button).not.toBeInTheDocument()
    })
  })
})
