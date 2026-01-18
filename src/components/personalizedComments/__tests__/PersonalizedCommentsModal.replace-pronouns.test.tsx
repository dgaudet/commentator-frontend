/**
 * PersonalizedCommentsModal - Replace Pronouns with Placeholders Button Tests
 * TASK-1.3: Replace Pronouns Button in Personalized Comments Components
 *
 * TDD Tests following Red-Green-Refactor cycle
 * Tests for button functionality in add and edit modes
 */

import { render, screen, fireEvent, waitFor } from '../../../test-utils'
import { PersonalizedCommentsModal } from '../PersonalizedCommentsModal'
import * as pronounsApi from '../../../hooks/usePronounsQuery'
import type { Pronoun, Subject } from '../../../types'

/**
 * Mock the usePronounsQuery hook
 */
jest.mock('../../../hooks/usePronounsQuery')

describe('PersonalizedCommentsModal - Replace Pronouns with Placeholders Button', () => {
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

  const mockSubject: Subject = {
    id: 'subject1',
    name: 'Math',
  }

  const defaultProps = {
    isOpen: true,
    entityData: mockSubject,
    personalizedComments: [],
    onCreateComment: jest.fn().mockResolvedValue(undefined),
    onUpdateComment: jest.fn().mockResolvedValue(undefined),
    onDeleteComment: jest.fn().mockResolvedValue(undefined),
    loading: false,
    error: null,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('AC-3.1: Button in Personalized Comments Components', () => {
    it('should render "Replace Pronouns with Placeholders" button in Add New Comment section', () => {
      jest.mocked(pronounsApi.usePronounsQuery).mockReturnValue({
        pronouns: mockPronouns,
        loading: false,
        error: null,
        refetch: jest.fn(),
      })

      render(<PersonalizedCommentsModal {...defaultProps} />)

      const buttons = screen.getAllByRole('button', {
        name: /replace pronouns with placeholders/i,
      })

      // Should have at least one button (in add section)
      expect(buttons.length).toBeGreaterThanOrEqual(1)
    })

    it('should place button near textarea in Add New Comment section', () => {
      jest.mocked(pronounsApi.usePronounsQuery).mockReturnValue({
        pronouns: mockPronouns,
        loading: false,
        error: null,
        refetch: jest.fn(),
      })

      render(<PersonalizedCommentsModal {...defaultProps} />)

      // Both button and textarea should exist
      const buttons = screen.getAllByRole('button', {
        name: /replace pronouns with placeholders/i,
      })
      const textareas = screen.getAllByRole('textbox')

      expect(buttons.length).toBeGreaterThanOrEqual(1)
      expect(textareas.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('AC-3.2: Consistent Behavior', () => {
    it('should have same behavior as bulk upload button (loading, success, error states)', async () => {
      jest.mocked(pronounsApi.usePronounsQuery).mockReturnValue({
        pronouns: mockPronouns,
        loading: false,
        error: null,
        refetch: jest.fn(),
      })

      render(<PersonalizedCommentsModal {...defaultProps} />)

      // Get the button in Add section
      const buttons = screen.getAllByRole('button', {
        name: /replace pronouns with placeholders/i,
      })
      const addButton = buttons[0]

      // Get the add textarea
      const textareas = screen.getAllByRole('textbox')
      const addTextarea = textareas[0]

      // Type text and click
      fireEvent.change(addTextarea, { target: { value: 'He is excellent. His work is great.' } })
      fireEvent.click(addButton)

      // Should show success message
      await waitFor(() => {
        expect(screen.getByText(/replaced.*pronouns/i)).toBeInTheDocument()
      })
    })
  })

  describe('AC-3.3: Component Layout', () => {
    it('should maintain layout when button is added to Add section', () => {
      jest.mocked(pronounsApi.usePronounsQuery).mockReturnValue({
        pronouns: mockPronouns,
        loading: false,
        error: null,
        refetch: jest.fn(),
      })

      render(<PersonalizedCommentsModal {...defaultProps} />)

      // Modal should render without layout issues
      const modal = screen.getByRole('dialog', { name: /personalized comments/i })
      expect(modal).toBeInTheDocument()

      // Button should be visible
      const buttons = screen.getAllByRole('button', {
        name: /replace pronouns with placeholders/i,
      })
      expect(buttons[0]).toBeInTheDocument()
    })

    it('should show button in Edit section when editing a comment', async () => {
      const mockComment = {
        id: 'comment1',
        comment: 'Existing comment',
        rating: 3,
        createdAt: '2025-01-15T00:00:00Z',
        updatedAt: '2025-01-15T00:00:00Z',
      }

      jest.mocked(pronounsApi.usePronounsQuery).mockReturnValue({
        pronouns: mockPronouns,
        loading: false,
        error: null,
        refetch: jest.fn(),
      })

      render(
        <PersonalizedCommentsModal
          {...defaultProps}
          personalizedComments={[mockComment]}
        />,
      )

      // Click Edit button
      const editButton = screen.getByRole('button', { name: /edit/i })
      fireEvent.click(editButton)

      // Should have Replace Pronouns button in edit mode
      await waitFor(() => {
        const buttons = screen.getAllByRole('button', {
          name: /replace pronouns with placeholders/i,
        })
        expect(buttons.length).toBeGreaterThanOrEqual(2) // Add + Edit
      })
    })
  })

  describe('AC-3.4: Text Preservation', () => {
    it('should preserve non-pronoun text in Add section', async () => {
      jest.mocked(pronounsApi.usePronounsQuery).mockReturnValue({
        pronouns: mockPronouns,
        loading: false,
        error: null,
        refetch: jest.fn(),
      })

      render(<PersonalizedCommentsModal {...defaultProps} />)

      const textareas = screen.getAllByRole('textbox')
      const addTextarea = textareas[0]
      const text = 'He is excellent, and his work is outstanding!'

      fireEvent.change(addTextarea, { target: { value: text } })

      const buttons = screen.getAllByRole('button', {
        name: /replace pronouns with placeholders/i,
      })
      fireEvent.click(buttons[0])

      await waitFor(() => {
        const result = (addTextarea as HTMLTextAreaElement).value
        expect(result).toContain('excellent')
        expect(result).toContain('outstanding')
        expect(result).toContain(',')
        expect(result).toContain('!')
      })
    })

    it('should preserve non-pronoun text in Edit section', async () => {
      const mockComment = {
        id: 'comment1',
        comment: 'Existing comment',
        rating: 3,
        createdAt: '2025-01-15T00:00:00Z',
        updatedAt: '2025-01-15T00:00:00Z',
      }

      jest.mocked(pronounsApi.usePronounsQuery).mockReturnValue({
        pronouns: mockPronouns,
        loading: false,
        error: null,
        refetch: jest.fn(),
      })

      render(
        <PersonalizedCommentsModal
          {...defaultProps}
          personalizedComments={[mockComment]}
        />,
      )

      // Click Edit button
      const editButton = screen.getByRole('button', { name: /edit/i })
      fireEvent.click(editButton)

      const textareas = screen.getAllByRole('textbox')
      const editTextarea = textareas[0]
      const text = 'He is excellent, and his work is outstanding!'

      fireEvent.change(editTextarea, { target: { value: text } })

      await waitFor(() => {
        const buttons = screen.getAllByRole('button', {
          name: /replace pronouns with placeholders/i,
        })
        // Should have 2 buttons: one in Add section, one in Edit section
        expect(buttons.length).toBeGreaterThanOrEqual(2)
        // Click the last one (Edit section button)
        fireEvent.click(buttons[buttons.length - 1])
      })

      await waitFor(() => {
        const result = (editTextarea as HTMLTextAreaElement).value
        expect(result).toContain('excellent')
        expect(result).toContain('outstanding')
      })
    })
  })

  describe('Add Section - Specific Tests', () => {
    it('should replace pronouns in Add comment textarea', async () => {
      jest.mocked(pronounsApi.usePronounsQuery).mockReturnValue({
        pronouns: mockPronouns,
        loading: false,
        error: null,
        refetch: jest.fn(),
      })

      render(<PersonalizedCommentsModal {...defaultProps} />)

      const textareas = screen.getAllByRole('textbox')
      const addTextarea = textareas[0]

      fireEvent.change(addTextarea, { target: { value: 'He is excellent. His work is great.' } })

      const buttons = screen.getAllByRole('button', {
        name: /replace pronouns with placeholders/i,
      })
      fireEvent.click(buttons[0])

      await waitFor(() => {
        expect(addTextarea).toHaveValue(
          '<pronoun> is excellent. <possessive pronoun> work is great.',
        )
      })
    })

    it('should show success message with count in Add section', async () => {
      jest.mocked(pronounsApi.usePronounsQuery).mockReturnValue({
        pronouns: mockPronouns,
        loading: false,
        error: null,
        refetch: jest.fn(),
      })

      render(<PersonalizedCommentsModal {...defaultProps} />)

      const textareas = screen.getAllByRole('textbox')
      fireEvent.change(textareas[0], { target: { value: 'He and his work' } })

      const buttons = screen.getAllByRole('button', {
        name: /replace pronouns with placeholders/i,
      })
      fireEvent.click(buttons[0])

      await waitFor(() => {
        expect(screen.getByText(/replaced.*2.*pronouns/i)).toBeInTheDocument()
      })
    })
  })

  describe('Edit Section - Specific Tests', () => {
    it('should replace pronouns in Edit comment textarea', async () => {
      const mockComment = {
        id: 'comment1',
        comment: 'Original comment',
        rating: 3,
        createdAt: '2025-01-15T00:00:00Z',
        updatedAt: '2025-01-15T00:00:00Z',
      }

      jest.mocked(pronounsApi.usePronounsQuery).mockReturnValue({
        pronouns: mockPronouns,
        loading: false,
        error: null,
        refetch: jest.fn(),
      })

      render(
        <PersonalizedCommentsModal
          {...defaultProps}
          personalizedComments={[mockComment]}
        />,
      )

      // Click Edit
      const editButton = screen.getByRole('button', { name: /edit/i })
      fireEvent.click(editButton)

      // Wait for Edit section to render and get the textareas
      await waitFor(() => {
        const allTextareas = screen.getAllByRole('textbox')
        // Should have at least 2 textareas (Add + Edit)
        expect(allTextareas.length).toBeGreaterThanOrEqual(2)
      })

      // Get the Edit textarea (should be the second one when in edit mode)
      const allTextareas = screen.getAllByRole('textbox')
      const editTextarea = allTextareas[1] as HTMLTextAreaElement
      fireEvent.change(editTextarea, { target: { value: 'He is excellent. His work is great.' } })

      // Find the Replace button specifically in Edit section by looking for the one that appears after edit content
      const replaceButtons = screen.getAllByRole('button', {
        name: /replace pronouns with placeholders/i,
      })
      expect(replaceButtons.length).toBeGreaterThanOrEqual(2)

      // Click the Edit section's replace button (last one)
      const editReplaceButton = replaceButtons[replaceButtons.length - 1]
      fireEvent.click(editReplaceButton)

      // Wait for textarea value to change
      await waitFor(
        () => {
          const updatedEditTextarea = screen.getAllByRole('textbox')[1] as HTMLTextAreaElement
          expect(updatedEditTextarea.value).toContain('<pronoun>')
          expect(updatedEditTextarea.value).toContain('<possessive pronoun>')
        },
        { timeout: 2000 },
      )
    })
  })
})
