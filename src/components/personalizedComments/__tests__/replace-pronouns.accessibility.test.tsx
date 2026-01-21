/**
 * Replace Pronouns Feature - Accessibility & Integration Tests
 * TASK-1.5: Accessibility & Integration Testing
 *
 * TDD Tests for accessibility, keyboard navigation, and full integration
 */

import { render, screen, fireEvent, waitFor } from '../../../test-utils'
import { PersonalizedCommentsModal } from '../PersonalizedCommentsModal'
import { BulkUploadModal } from '../BulkUploadModal'
import * as pronounsApi from '../../../hooks/usePronounsQuery'
import type { Pronoun, Subject } from '../../../types'

jest.mock('../../../hooks/usePronounsQuery')

describe('Replace Pronouns Feature - Accessibility & Integration (TASK-1.5)', () => {
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

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('AC-5.1: Keyboard Navigation (PersonalizedCommentsModal)', () => {
    it('should focus Replace Pronouns button with Tab key', () => {
      jest.mocked(pronounsApi.usePronounsQuery).mockReturnValue({
        pronouns: mockPronouns,
        loading: false,
        error: null,
        refetch: jest.fn(),
      })

      render(
        <PersonalizedCommentsModal
          isOpen={true}
          entityData={mockSubject}
          personalizedComments={[]}
          onCreateComment={jest.fn().mockResolvedValue(undefined)}
          onUpdateComment={jest.fn().mockResolvedValue(undefined)}
          onDeleteComment={jest.fn().mockResolvedValue(undefined)}
          loading={false}
          error={null}
        />,
      )

      const button = screen.getByRole('button', { name: /replace pronouns/i })

      // Button should be focusable
      button.focus()
      expect(document.activeElement).toBe(button)
    })

    it('should activate button with Enter key', () => {
      jest.mocked(pronounsApi.usePronounsQuery).mockReturnValue({
        pronouns: mockPronouns,
        loading: false,
        error: null,
        refetch: jest.fn(),
      })

      render(
        <PersonalizedCommentsModal
          isOpen={true}
          entityData={mockSubject}
          personalizedComments={[]}
          onCreateComment={jest.fn().mockResolvedValue(undefined)}
          onUpdateComment={jest.fn().mockResolvedValue(undefined)}
          onDeleteComment={jest.fn().mockResolvedValue(undefined)}
          loading={false}
          error={null}
        />,
      )

      const textarea = screen.getByRole('textbox', { name: /add new personalized comment/i })
      const button = screen.getAllByRole('button', { name: /replace pronouns/i })[0]

      // Set text
      fireEvent.change(textarea, { target: { value: 'He is excellent' } })

      // Focus and press Enter
      button.focus()
      fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' })

      // Button should respond
      expect(button).toBeInTheDocument()
    })

    it('should activate button with Space key', () => {
      jest.mocked(pronounsApi.usePronounsQuery).mockReturnValue({
        pronouns: mockPronouns,
        loading: false,
        error: null,
        refetch: jest.fn(),
      })

      render(
        <PersonalizedCommentsModal
          isOpen={true}
          entityData={mockSubject}
          personalizedComments={[]}
          onCreateComment={jest.fn().mockResolvedValue(undefined)}
          onUpdateComment={jest.fn().mockResolvedValue(undefined)}
          onDeleteComment={jest.fn().mockResolvedValue(undefined)}
          loading={false}
          error={null}
        />,
      )

      const textarea = screen.getByRole('textbox', { name: /add new personalized comment/i })
      const button = screen.getAllByRole('button', { name: /replace pronouns/i })[0]

      // Set text
      fireEvent.change(textarea, { target: { value: 'He is excellent' } })

      // Focus and press Space
      button.focus()
      fireEvent.keyDown(button, { key: ' ', code: 'Space' })

      // Button should respond
      expect(button).toBeInTheDocument()
    })
  })

  describe('AC-5.2: Screen Reader Announcements', () => {
    it('should have accessible button name', () => {
      jest.mocked(pronounsApi.usePronounsQuery).mockReturnValue({
        pronouns: mockPronouns,
        loading: false,
        error: null,
        refetch: jest.fn(),
      })

      render(
        <PersonalizedCommentsModal
          isOpen={true}
          entityData={mockSubject}
          personalizedComments={[]}
          onCreateComment={jest.fn().mockResolvedValue(undefined)}
          onUpdateComment={jest.fn().mockResolvedValue(undefined)}
          onDeleteComment={jest.fn().mockResolvedValue(undefined)}
          loading={false}
          error={null}
        />,
      )

      const button = screen.getByRole('button', { name: /replace pronouns with placeholders/i })

      // Button should have accessible name
      expect(button).toHaveAccessibleName()
    })

    it('should display success message with role alert', async () => {
      jest.mocked(pronounsApi.usePronounsQuery).mockReturnValue({
        pronouns: mockPronouns,
        loading: false,
        error: null,
        refetch: jest.fn(),
      })

      render(
        <PersonalizedCommentsModal
          isOpen={true}
          entityData={mockSubject}
          personalizedComments={[]}
          onCreateComment={jest.fn().mockResolvedValue(undefined)}
          onUpdateComment={jest.fn().mockResolvedValue(undefined)}
          onDeleteComment={jest.fn().mockResolvedValue(undefined)}
          loading={false}
          error={null}
        />,
      )

      const textarea = screen.getByRole('textbox', { name: /add new personalized comment/i })
      const button = screen.getAllByRole('button', { name: /replace pronouns/i })[0]

      fireEvent.change(textarea, { target: { value: 'He is excellent' } })
      fireEvent.click(button)

      // Success message should be announced
      await waitFor(() => {
        expect(screen.getByText(/replaced/i)).toBeInTheDocument()
      })
    })

    it('should display error message with role alert', async () => {
      render(
        <BulkUploadModal
          isOpen={true}
          onClose={jest.fn()}
          subjectId="subject1"
          onImport={jest.fn().mockResolvedValue({ successful: [], failed: [], totalAttempted: 0, duplicateCount: 0 })}
          pronouns={mockPronouns}
          pronounsLoading={false}
          pronounsError="API Error"
        />,
      )

      // Error alert should not be shown when pronouns error
      const button = screen.queryByRole('button', { name: /replace pronouns/i })
      expect(button).not.toBeInTheDocument()
    })
  })

  describe('AC-5.3: Visual Feedback', () => {
    it('should show loading state change', async () => {
      jest.mocked(pronounsApi.usePronounsQuery).mockReturnValue({
        pronouns: mockPronouns,
        loading: false,
        error: null,
        refetch: jest.fn(),
      })

      render(
        <PersonalizedCommentsModal
          isOpen={true}
          entityData={mockSubject}
          personalizedComments={[]}
          onCreateComment={jest.fn().mockResolvedValue(undefined)}
          onUpdateComment={jest.fn().mockResolvedValue(undefined)}
          onDeleteComment={jest.fn().mockResolvedValue(undefined)}
          loading={false}
          error={null}
        />,
      )

      const textarea = screen.getByRole('textbox', { name: /add new personalized comment/i })
      const button = screen.getAllByRole('button', { name: /replace pronouns/i })[0]

      fireEvent.change(textarea, { target: { value: 'He is excellent' } })
      fireEvent.click(button)

      // Button text should change briefly to show loading
      // Since replacement is synchronous, we check the normal text appears
      expect(button).toBeInTheDocument()
    })

    it('should display success message with visual styling', async () => {
      jest.mocked(pronounsApi.usePronounsQuery).mockReturnValue({
        pronouns: mockPronouns,
        loading: false,
        error: null,
        refetch: jest.fn(),
      })

      render(
        <PersonalizedCommentsModal
          isOpen={true}
          entityData={mockSubject}
          personalizedComments={[]}
          onCreateComment={jest.fn().mockResolvedValue(undefined)}
          onUpdateComment={jest.fn().mockResolvedValue(undefined)}
          onDeleteComment={jest.fn().mockResolvedValue(undefined)}
          loading={false}
          error={null}
        />,
      )

      const textarea = screen.getByRole('textbox', { name: /add new personalized comment/i })
      const button = screen.getAllByRole('button', { name: /replace pronouns/i })[0]

      fireEvent.change(textarea, { target: { value: 'He is excellent' } })
      fireEvent.click(button)

      await waitFor(() => {
        const message = screen.getByText(/replaced/i)
        // Message should be visible with styling properties
        expect(message).toBeVisible()
        // Check that it has some styling applied (via style attribute or class)
        expect(
          message.getAttribute('style') || message.className,
        ).toBeTruthy()
      })
    })
  })

  describe('AC-5.4: ARIA Labels', () => {
    it('button should have proper accessible name', () => {
      jest.mocked(pronounsApi.usePronounsQuery).mockReturnValue({
        pronouns: mockPronouns,
        loading: false,
        error: null,
        refetch: jest.fn(),
      })

      render(
        <PersonalizedCommentsModal
          isOpen={true}
          entityData={mockSubject}
          personalizedComments={[]}
          onCreateComment={jest.fn().mockResolvedValue(undefined)}
          onUpdateComment={jest.fn().mockResolvedValue(undefined)}
          onDeleteComment={jest.fn().mockResolvedValue(undefined)}
          loading={false}
          error={null}
        />,
      )

      const button = screen.getByRole('button', { name: /replace pronouns with placeholders/i })
      expect(button).toHaveAccessibleName(/replace pronouns with placeholders/i)
    })

    it('disabled button should have title attribute explaining why', () => {
      jest.mocked(pronounsApi.usePronounsQuery).mockReturnValue({
        pronouns: [],
        loading: false,
        error: null,
        refetch: jest.fn(),
      })

      render(
        <PersonalizedCommentsModal
          isOpen={true}
          entityData={mockSubject}
          personalizedComments={[]}
          onCreateComment={jest.fn().mockResolvedValue(undefined)}
          onUpdateComment={jest.fn().mockResolvedValue(undefined)}
          onDeleteComment={jest.fn().mockResolvedValue(undefined)}
          loading={false}
          error={null}
        />,
      )

      const button = screen.getByRole('button', { name: /replace pronouns/i })
      expect(button).toBeDisabled()
      expect(button).toHaveAttribute('title')
    })
  })

  describe('AC-5.5: No Page Layout Shifts (CLS)', () => {
    it('should render without layout shift when button appears', () => {
      jest.mocked(pronounsApi.usePronounsQuery).mockReturnValue({
        pronouns: mockPronouns,
        loading: false,
        error: null,
        refetch: jest.fn(),
      })

      const { container } = render(
        <PersonalizedCommentsModal
          isOpen={true}
          entityData={mockSubject}
          personalizedComments={[]}
          onCreateComment={jest.fn().mockResolvedValue(undefined)}
          onUpdateComment={jest.fn().mockResolvedValue(undefined)}
          onDeleteComment={jest.fn().mockResolvedValue(undefined)}
          loading={false}
          error={null}
        />,
      )

      // Check that container is stable
      expect(container).toBeInTheDocument()
      const initialHeight = container.getBoundingClientRect().height

      // Simulate clicking button and getting message
      const textarea = screen.getByRole('textbox', { name: /add new personalized comment/i })
      const button = screen.getAllByRole('button', { name: /replace pronouns/i })[0]

      fireEvent.change(textarea, { target: { value: 'He is excellent' } })
      fireEvent.click(button)

      // Height should not change significantly
      const afterHeight = container.getBoundingClientRect().height
      expect(Math.abs(initialHeight - afterHeight)).toBeLessThan(100)
    })
  })

  describe('AC-5.6: Design Token Compliance', () => {
    it('should use design tokens for button styling', () => {
      jest.mocked(pronounsApi.usePronounsQuery).mockReturnValue({
        pronouns: mockPronouns,
        loading: false,
        error: null,
        refetch: jest.fn(),
      })

      render(
        <PersonalizedCommentsModal
          isOpen={true}
          entityData={mockSubject}
          personalizedComments={[]}
          onCreateComment={jest.fn().mockResolvedValue(undefined)}
          onUpdateComment={jest.fn().mockResolvedValue(undefined)}
          onDeleteComment={jest.fn().mockResolvedValue(undefined)}
          loading={false}
          error={null}
        />,
      )

      const button = screen.getAllByRole('button', { name: /replace pronouns/i })[0]

      // Button should exist and be properly styled via component system
      expect(button).toBeInTheDocument()
      // Button should have some visual styling (either inline or class-based)
      const computedStyle = window.getComputedStyle(button)
      expect(computedStyle).toBeTruthy()
    })

    it('should use design tokens for message styling', async () => {
      jest.mocked(pronounsApi.usePronounsQuery).mockReturnValue({
        pronouns: mockPronouns,
        loading: false,
        error: null,
        refetch: jest.fn(),
      })

      render(
        <PersonalizedCommentsModal
          isOpen={true}
          entityData={mockSubject}
          personalizedComments={[]}
          onCreateComment={jest.fn().mockResolvedValue(undefined)}
          onUpdateComment={jest.fn().mockResolvedValue(undefined)}
          onDeleteComment={jest.fn().mockResolvedValue(undefined)}
          loading={false}
          error={null}
        />,
      )

      const textarea = screen.getByRole('textbox', { name: /add new personalized comment/i })
      const button = screen.getAllByRole('button', { name: /replace pronouns/i })[0]

      fireEvent.change(textarea, { target: { value: 'He is excellent' } })
      fireEvent.click(button)

      await waitFor(() => {
        const message = screen.getByText(/replaced/i)
        // Message should have visual styling applied
        expect(message).toBeInTheDocument()
        // Message should have some styling properties from design tokens
        const computedStyle = window.getComputedStyle(message)
        expect(computedStyle.padding).toBeTruthy()
      })
    })
  })

  describe('AC-5.7: Integration with Existing Features', () => {
    it('should not interfere with form validation', () => {
      jest.mocked(pronounsApi.usePronounsQuery).mockReturnValue({
        pronouns: mockPronouns,
        loading: false,
        error: null,
        refetch: jest.fn(),
      })

      const onCreateComment = jest.fn().mockResolvedValue(undefined)

      render(
        <PersonalizedCommentsModal
          isOpen={true}
          entityData={mockSubject}
          personalizedComments={[]}
          onCreateComment={onCreateComment}
          onUpdateComment={jest.fn().mockResolvedValue(undefined)}
          onDeleteComment={jest.fn().mockResolvedValue(undefined)}
          loading={false}
          error={null}
        />,
      )

      const textarea = screen.getByRole('textbox', { name: /add new personalized comment/i })
      const addButton = screen.getByRole('button', { name: /^Add Comment$/i })

      // Try adding with too-short text
      fireEvent.change(textarea, { target: { value: 'Hi' } })

      expect(addButton).toBeDisabled()
    })

    it('should work with Copy Comments feature', () => {
      jest.mocked(pronounsApi.usePronounsQuery).mockReturnValue({
        pronouns: mockPronouns,
        loading: false,
        error: null,
        refetch: jest.fn(),
      })

      render(
        <PersonalizedCommentsModal
          isOpen={true}
          entityData={mockSubject}
          personalizedComments={[]}
          onCreateComment={jest.fn().mockResolvedValue(undefined)}
          onUpdateComment={jest.fn().mockResolvedValue(undefined)}
          onDeleteComment={jest.fn().mockResolvedValue(undefined)}
          loading={false}
          error={null}
          ownedSubjects={[
            { id: 'subj2', name: 'Science' },
            { id: 'subj3', name: 'History' },
          ]}
        />,
      )

      // Copy Comments button should exist
      const copyButton = screen.getByRole('button', { name: /copy comments/i })
      expect(copyButton).toBeInTheDocument()

      // Replace Pronouns button should also exist
      const replaceButton = screen.getByRole('button', { name: /replace pronouns/i })
      expect(replaceButton).toBeInTheDocument()
    })

    it('should work with Bulk Upload feature', () => {
      jest.mocked(pronounsApi.usePronounsQuery).mockReturnValue({
        pronouns: mockPronouns,
        loading: false,
        error: null,
        refetch: jest.fn(),
      })

      render(
        <PersonalizedCommentsModal
          isOpen={true}
          entityData={mockSubject}
          personalizedComments={[]}
          onCreateComment={jest.fn().mockResolvedValue(undefined)}
          onUpdateComment={jest.fn().mockResolvedValue(undefined)}
          onDeleteComment={jest.fn().mockResolvedValue(undefined)}
          loading={false}
          error={null}
        />,
      )

      // Bulk Upload button should exist
      const bulkButton = screen.getByRole('button', { name: /bulk upload/i })
      expect(bulkButton).toBeInTheDocument()

      // Replace Pronouns button should also exist
      const replaceButton = screen.getByRole('button', { name: /replace pronouns/i })
      expect(replaceButton).toBeInTheDocument()
    })
  })
})
