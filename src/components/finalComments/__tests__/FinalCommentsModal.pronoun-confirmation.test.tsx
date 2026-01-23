/**
 * FinalCommentsModal Pronoun Confirmation Tests
 * TDD Phase: RED - Tests for pronoun confirmation alert when saving without pronoun
 *
 * User Story: Confirm before saving final comment without pronoun selection
 * Current behavior: Users can save final comments without selecting a pronoun
 * Desired behavior: Display confirmation alert and allow save only if confirmed
 */

import { render, screen, waitFor } from '../../../test-utils'
import userEvent from '@testing-library/user-event'
import { FinalCommentsModal } from '../FinalCommentsModal'
import type { Class, FinalComment } from '../../../types'

// Mock the usePronounsQuery hook
jest.mock('../../../hooks/usePronounsQuery', () => ({
  usePronounsQuery: jest.fn(() => ({
    pronouns: [
      { id: '1', pronoun: 'he', possessivePronoun: 'his', userId: 'user-1', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
      { id: '2', pronoun: 'she', possessivePronoun: 'her', userId: 'user-1', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
    ],
    loading: false,
    error: null,
  })),
}))

// Mock the useOutcomeComments hook
jest.mock('../../../hooks/useOutcomeComments', () => ({
  useOutcomeComments: jest.fn(() => ({
    outcomeComments: [],
    loading: false,
    error: null,
    loadOutcomeComments: jest.fn(),
  })),
}))

// Mock the usePersonalizedComments hook
jest.mock('../../../hooks/usePersonalizedComments', () => ({
  usePersonalizedComments: jest.fn(() => ({
    personalizedComments: [],
    loading: false,
    error: null,
    loadPersonalizedComments: jest.fn(),
  })),
}))

const mockClass: Class = {
  id: 'class-1',
  name: 'Math 101',
  year: 2024,
  subjectId: 'subject-1',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
}

const mockHandlers = {
  onCreateComment: jest.fn().mockResolvedValue(undefined),
  onUpdateComment: jest.fn().mockResolvedValue(undefined),
  onDeleteComment: jest.fn().mockResolvedValue(undefined),
}

describe('FinalCommentsModal - Pronoun Confirmation Alert', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Create Form - Pronoun Confirmation', () => {
    it('should show confirmation alert when trying to create comment without pronoun', async () => {
      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={[]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      // Fill in comment form without selecting pronoun
      const gradeInput = screen.getByLabelText(/grade/i)
      const firstNameInput = screen.getByPlaceholderText(/first name/i)
      const lastNameInput = screen.getByPlaceholderText(/last name/i)
      const commentInput = screen.getByPlaceholderText(/optional comment/i)

      await userEvent.type(firstNameInput, 'John')
      await userEvent.type(lastNameInput, 'Doe')
      await userEvent.type(gradeInput, '85')
      await userEvent.type(commentInput, 'Great work!')

      // Try to save without selecting pronoun (leave pronounId as null/undefined)
      const saveButton = screen.getByRole('button', { name: /add final comment/i })
      await userEvent.click(saveButton)

      // Confirmation alert should appear
      const confirmationAlert = screen.getByRole('dialog', { name: /pronoun confirmation/i })
      expect(confirmationAlert).toBeInTheDocument()
      expect(screen.getByText(/you are saving this comment without a pronoun/i)).toBeInTheDocument()
    })

    it('should show confirmation alert with correct message', async () => {
      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={[]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      // Fill in form and trigger alert
      const firstNameInput = screen.getByPlaceholderText(/first name/i)
      const gradeInput = screen.getByLabelText(/grade/i)
      await userEvent.type(firstNameInput, 'Alice')
      await userEvent.type(gradeInput, '90')

      const saveButton = screen.getByRole('button', { name: /add final comment/i })
      await userEvent.click(saveButton)

      // Verify exact message
      expect(screen.getByText(/you are saving this comment without a pronoun. do you want to continue?/i)).toBeInTheDocument()
    })

    it('should show Yes and No buttons on confirmation alert', async () => {
      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={[]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      // Fill in form and trigger alert
      const firstNameInput = screen.getByPlaceholderText(/first name/i)
      const gradeInput = screen.getByLabelText(/grade/i)
      await userEvent.type(firstNameInput, 'Bob')
      await userEvent.type(gradeInput, '75')

      const saveButton = screen.getByRole('button', { name: /add final comment/i })
      await userEvent.click(saveButton)

      // Verify alert appears with Yes and No buttons
      await waitFor(() => {
        const yesButtons = screen.queryAllByRole('button', { name: /yes/i })
        const noButtons = screen.queryAllByRole('button', { name: /no/i })
        expect(yesButtons.length).toBeGreaterThan(0)
        expect(noButtons.length).toBeGreaterThan(0)
      })
    })

    it('should close alert and keep modal open when clicking No', async () => {
      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={[]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      // Fill in form and trigger alert
      const firstNameInput = screen.getByPlaceholderText(/first name/i)
      const gradeInput = screen.getByLabelText(/grade/i)
      await userEvent.type(firstNameInput, 'Carol')
      await userEvent.type(gradeInput, '88')

      const saveButton = screen.getByRole('button', { name: /add final comment/i })
      await userEvent.click(saveButton)

      // Alert should appear with No button
      await waitFor(() => {
        expect(screen.getByText(/you are saving this comment without a pronoun/i)).toBeInTheDocument()
      })

      // Modal should still be open (form should still be visible)
      expect(screen.getByRole('button', { name: /add final comment/i })).toBeInTheDocument()

      // onCreateComment should NOT be called
      expect(mockHandlers.onCreateComment).not.toHaveBeenCalled()
    })

    it('should proceed with save when clicking Yes on confirmation alert', async () => {
      mockHandlers.onCreateComment.mockResolvedValue(undefined)
      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={[]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      // Fill in form and trigger alert
      const firstNameInput = screen.getByPlaceholderText(/first name/i)
      const gradeInput = screen.getByLabelText(/grade/i)
      await userEvent.type(firstNameInput, 'David')
      await userEvent.type(gradeInput, '92')

      const saveButton = screen.getByRole('button', { name: /add final comment/i })
      await userEvent.click(saveButton)

      // Click Yes button
      const yesButton = screen.getByRole('button', { name: /yes/i })
      await userEvent.click(yesButton)

      // onCreateComment should be called with the comment data
      expect(mockHandlers.onCreateComment).toHaveBeenCalledWith(
        expect.objectContaining({
          classId: 'class-1',
          firstName: 'David',
          grade: 92,
          pronounId: null,
        }),
      )
    })

    it('should dismiss alert when clicking X button (acts as No)', async () => {
      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={[]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      // Fill in form and trigger alert
      const firstNameInput = screen.getByPlaceholderText(/first name/i)
      const gradeInput = screen.getByLabelText(/grade/i)
      await userEvent.type(firstNameInput, 'Eve')
      await userEvent.type(gradeInput, '79')

      const saveButton = screen.getByRole('button', { name: /add final comment/i })
      await userEvent.click(saveButton)

      // Click on overlay (acts as X button - dismisses by clicking outside)
      const overlay = screen.getByRole('dialog', { name: /pronoun confirmation/i }).parentElement
      if (overlay) {
        await userEvent.click(overlay)
      }

      // Alert should be dismissed
      expect(screen.queryByText(/you are saving this comment without a pronoun/i)).not.toBeInTheDocument()

      // Modal should still be open
      expect(screen.getByRole('button', { name: /add final comment/i })).toBeInTheDocument()

      // onCreateComment should NOT be called
      expect(mockHandlers.onCreateComment).not.toHaveBeenCalled()
    })
  })

  describe('Edit Form - Pronoun Confirmation', () => {
    it('should show confirmation alert when trying to update comment without pronoun', async () => {
      const existingComment: FinalComment = {
        id: '1',
        classId: 'class-1',
        firstName: 'John',
        lastName: 'Doe',
        grade: 85,
        comment: 'Great work!',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        pronounId: '1',
      }

      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={[existingComment]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      // Open edit form
      const editButton = screen.getByRole('button', { name: /edit/i })
      await userEvent.click(editButton)

      // Find the pronoun select and clear it by selecting empty option
      const pronounSelects = screen.getAllByRole('combobox', { name: /pronoun/i })
      const pronounSelect = pronounSelects[pronounSelects.length - 1] as HTMLSelectElement
      await userEvent.selectOptions(pronounSelect, '')

      // Click save
      const saveButton = screen.getByRole('button', { name: /save/i })
      await userEvent.click(saveButton)

      // Confirmation alert should appear
      const confirmationAlert = screen.getByRole('dialog', { name: /pronoun confirmation/i })
      expect(confirmationAlert).toBeInTheDocument()
      expect(screen.getByText(/you are saving this comment without a pronoun/i)).toBeInTheDocument()
    })

    it('should close alert and keep modal open when clicking No during edit', async () => {
      const existingComment: FinalComment = {
        id: '1',
        classId: 'class-1',
        firstName: 'John',
        lastName: 'Doe',
        grade: 85,
        comment: 'Great work!',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        pronounId: '1',
      }

      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={[existingComment]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      // Open edit form
      const editButton = screen.getByRole('button', { name: /edit/i })
      await userEvent.click(editButton)

      // Clear pronoun
      const pronounSelects = screen.getAllByRole('combobox', { name: /pronoun/i })
      const pronounSelect = pronounSelects[pronounSelects.length - 1] as HTMLSelectElement
      await userEvent.selectOptions(pronounSelect, '')

      // Click save to trigger alert
      const saveButtons = screen.getAllByRole('button', { name: /save/i })
      await userEvent.click(saveButtons[saveButtons.length - 1])

      // Alert should appear
      await waitFor(() => {
        expect(screen.getByText(/you are saving this comment without a pronoun/i)).toBeInTheDocument()
      })

      // onUpdateComment should NOT be called yet
      expect(mockHandlers.onUpdateComment).not.toHaveBeenCalled()
    })

    it('should proceed with update when clicking Yes during edit', async () => {
      mockHandlers.onUpdateComment.mockResolvedValue(undefined)
      const existingComment: FinalComment = {
        id: '1',
        classId: 'class-1',
        firstName: 'John',
        lastName: 'Doe',
        grade: 85,
        comment: 'Great work!',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        pronounId: '1',
      }

      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={[existingComment]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      // Open edit form
      const editButton = screen.getByRole('button', { name: /edit/i })
      await userEvent.click(editButton)

      // Clear pronoun
      const pronounSelects = screen.getAllByRole('combobox', { name: /pronoun/i })
      const pronounSelect = pronounSelects[pronounSelects.length - 1] as HTMLSelectElement
      await userEvent.selectOptions(pronounSelect, '')

      // Click save to trigger alert
      const saveButton = screen.getByRole('button', { name: /save/i })
      await userEvent.click(saveButton)

      // Click Yes
      const yesButton = screen.getByRole('button', { name: /yes/i })
      await userEvent.click(yesButton)

      // onUpdateComment should be called with updated data
      expect(mockHandlers.onUpdateComment).toHaveBeenCalledWith(
        '1',
        expect.objectContaining({
          classId: 'class-1',
          firstName: 'John',
          lastName: 'Doe',
          grade: 85,
          pronounId: null,
        }),
      )
    })
  })

  describe('Pronoun Confirmation - Edge Cases', () => {
    it('should NOT show alert when comment has pronoun selected', async () => {
      mockHandlers.onCreateComment.mockResolvedValue(undefined)
      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={[]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      // Fill in form with pronoun selected
      const firstNameInput = screen.getByPlaceholderText(/first name/i)
      const gradeInput = screen.getByLabelText(/grade/i)
      const pronounSelect = screen.getByRole('combobox', { name: /pronoun/i }) as HTMLSelectElement

      await userEvent.type(firstNameInput, 'Frank')
      await userEvent.type(gradeInput, '88')
      await userEvent.selectOptions(pronounSelect, '1')

      // Click save
      const saveButton = screen.getByRole('button', { name: /add final comment/i })
      await userEvent.click(saveButton)

      // Alert should NOT appear
      expect(screen.queryByText(/you are saving this comment without a pronoun/i)).not.toBeInTheDocument()

      // onCreateComment should be called immediately
      expect(mockHandlers.onCreateComment).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: 'Frank',
          grade: 88,
          pronounId: '1',
        }),
      )
    })

    it('should show alert when pronounId is empty string', async () => {
      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={[]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      // Fill in form without selecting pronoun (empty string)
      const firstNameInput = screen.getByPlaceholderText(/first name/i)
      const gradeInput = screen.getByLabelText(/grade/i)
      await userEvent.type(firstNameInput, 'Grace')
      await userEvent.type(gradeInput, '82')

      // Click save without selecting pronoun
      const saveButton = screen.getByRole('button', { name: /add final comment/i })
      await userEvent.click(saveButton)

      // Alert should appear
      expect(screen.getByText(/you are saving this comment without a pronoun/i)).toBeInTheDocument()
    })

    it('should show alert when pronounId is undefined', async () => {
      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={[]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      // Fill in form without selecting pronoun (undefined by default)
      const firstNameInput = screen.getByPlaceholderText(/first name/i)
      const gradeInput = screen.getByLabelText(/grade/i)
      await userEvent.type(firstNameInput, 'Henry')
      await userEvent.type(gradeInput, '76')

      // Click save without selecting pronoun
      const saveButton = screen.getByRole('button', { name: /add final comment/i })
      await userEvent.click(saveButton)

      // Alert should appear
      expect(screen.getByText(/you are saving this comment without a pronoun/i)).toBeInTheDocument()
    })
  })
})
