/**
 * FinalCommentsModal Edit Form Styling Tests
 * TDD Phase: RED - Writing failing tests first
 * Reference: US-FINAL-STYLE-004
 *
 * Testing edit form styling consistency with add form and modalStyles pattern
 */

import { render, screen, fireEvent } from '../../../test-utils'
import { FinalCommentsModal } from '../FinalCommentsModal'
import type { Class, FinalComment } from '../../../types'

const mockClass: Class = {
  id: 1,
  name: 'Mathematics 101',
  year: 2024,
  subjectId: 1,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
}

const mockFinalComment: FinalComment = {
  id: 1,
  classId: 1,
  firstName: 'John',
  lastName: 'Doe',
  grade: 85,
  comment: 'Excellent work this semester!',
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-15T10:00:00Z',
}

const mockHandlers = {
  onCreateComment: jest.fn(),
  onUpdateComment: jest.fn(),
  onDeleteComment: jest.fn(),
}

describe('US-FINAL-STYLE-004: Edit Form Styling', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('AC1: Inline edit form with consistent styling', () => {
    it('should display edit form when Edit button is clicked', () => {
      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={[mockFinalComment]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      const editButton = screen.getByRole('button', { name: /Edit/i })
      fireEvent.click(editButton)

      // Edit form should be displayed
      expect(screen.getByRole('button', { name: /Save/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument()
    })

    it('should pre-populate edit form fields with existing values', () => {
      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={[mockFinalComment]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      const editButton = screen.getByRole('button', { name: /Edit/i })
      fireEvent.click(editButton)

      // Fields should be pre-populated
      const firstNameInput = screen.getAllByDisplayValue('John')[0] as HTMLInputElement
      const lastNameInput = screen.getByDisplayValue('Doe') as HTMLInputElement
      const gradeInput = screen.getByDisplayValue('85') as HTMLInputElement
      const commentTextarea = screen.getByDisplayValue('Excellent work this semester!') as HTMLTextAreaElement

      expect(firstNameInput.value).toBe('John')
      expect(lastNameInput.value).toBe('Doe')
      expect(gradeInput.value).toBe('85')
      expect(commentTextarea.value).toBe('Excellent work this semester!')
    })
  })

  describe('AC2: Identical field styling, spacing, and button variants', () => {
    it('should style First Name label with modalStyles pattern', () => {
      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={[mockFinalComment]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      fireEvent.click(screen.getByRole('button', { name: /Edit/i }))

      const labels = screen.getAllByText(/First Name/i)
      const editLabel = labels[labels.length - 1] // Last one is in edit form

      expect(editLabel).toHaveStyle({
        display: 'block',
        fontSize: '0.875rem',
        fontWeight: '500',
        color: '#374151',
        marginBottom: '0.5rem',
      })
    })

    it('should style First Name input with modalStyles pattern', () => {
      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={[mockFinalComment]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      fireEvent.click(screen.getByRole('button', { name: /Edit/i }))

      const inputs = screen.getAllByDisplayValue('John')
      const editInput = inputs[inputs.length - 1] // Last one is in edit form

      expect(editInput).toHaveStyle({
        padding: '0.75rem',
        fontSize: '1rem',
        border: '1px solid #E5E7EB',
        borderRadius: '8px',
      })
    })

    it('should style Grade field with modalStyles pattern', () => {
      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={[mockFinalComment]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      fireEvent.click(screen.getByRole('button', { name: /Edit/i }))

      const gradeInput = screen.getByDisplayValue('85') as HTMLInputElement

      expect(gradeInput.type).toBe('number')
      expect(gradeInput).toHaveStyle({
        padding: '0.75rem',
        fontSize: '1rem',
        border: '1px solid #E5E7EB',
        borderRadius: '8px',
      })
    })

    it('should style Comment textarea with modalStyles pattern', () => {
      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={[mockFinalComment]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      fireEvent.click(screen.getByRole('button', { name: /Edit/i }))

      const textarea = screen.getByDisplayValue('Excellent work this semester!')

      expect(textarea).toHaveStyle({
        padding: '0.75rem',
        fontSize: '1rem',
        border: '1px solid #E5E7EB',
        borderRadius: '8px',
      })
    })

    it('should use consistent margin between form fields', () => {
      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={[mockFinalComment]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      fireEvent.click(screen.getByRole('button', { name: /Edit/i }))

      const gradeLabels = screen.getAllByText(/^Grade/i)
      const editGradeLabel = gradeLabels[gradeLabels.length - 1]
      const gradeFormGroup = editGradeLabel.closest('.form-group')

      expect(gradeFormGroup).toHaveStyle({
        marginBottom: '1rem',
      })
    })
  })

  describe('AC3: Validation errors with existing patterns', () => {
    it('should show red border on invalid First Name field in edit mode', async () => {
      const { container } = render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={[mockFinalComment]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      fireEvent.click(screen.getByRole('button', { name: /Edit/i }))

      // Get the edit form's first name input using the unique ID
      const editInput = container.querySelector('#edit-first-name-1') as HTMLInputElement

      // Clear the input
      fireEvent.change(editInput, { target: { value: '' } })

      // Try to save with empty first name
      fireEvent.click(screen.getByRole('button', { name: /Save/i }))

      // Should show validation error border on the edit input
      expect(editInput).toHaveStyle({
        border: '1px solid #DC2626',
      })
    })
  })

  describe('AC4: Save/Cancel button variants', () => {
    it('should style Save button with primary variant', () => {
      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={[mockFinalComment]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      fireEvent.click(screen.getByRole('button', { name: /Edit/i }))

      const saveButton = screen.getByRole('button', { name: /Save/i })

      // Button component primary variant
      expect(saveButton).toHaveStyle({
        backgroundColor: '#0066FF',
        color: '#FFFFFF',
        borderColor: '#0066FF',
      })
    })

    it('should style Cancel button with secondary variant', () => {
      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={[mockFinalComment]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      fireEvent.click(screen.getByRole('button', { name: /Edit/i }))

      const cancelButton = screen.getByRole('button', { name: /Cancel/i })

      // Button component secondary variant
      expect(cancelButton).toHaveStyle({
        backgroundColor: '#E5E7EB',
        color: '#1F2937',
        borderColor: '#E5E7EB',
      })
    })

    it('should cancel edit and return to display mode', () => {
      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={[mockFinalComment]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      fireEvent.click(screen.getByRole('button', { name: /Edit/i }))

      // Should show Save and Cancel buttons
      expect(screen.getByRole('button', { name: /Save/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument()

      // Click Cancel
      fireEvent.click(screen.getByRole('button', { name: /Cancel/i }))

      // Should return to display mode with Edit and Delete buttons
      expect(screen.queryByRole('button', { name: /Save/i })).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /Cancel/i })).not.toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Edit/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Delete/i })).toBeInTheDocument()
    })
  })

  describe('Character counter in edit mode', () => {
    it('should display character counter with consistent styling', () => {
      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={[mockFinalComment]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      fireEvent.click(screen.getByRole('button', { name: /Edit/i }))

      const counter = screen.getByText(/29\/1000 characters/i)

      expect(counter).toHaveStyle({
        fontSize: '0.875rem',
        color: '#6B7280',
      })
    })

    it('should update character counter as user types in edit mode', () => {
      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={[mockFinalComment]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      fireEvent.click(screen.getByRole('button', { name: /Edit/i }))

      const commentTextarea = screen.getByDisplayValue('Excellent work this semester!')
      fireEvent.change(commentTextarea, { target: { value: 'Updated!' } })

      expect(screen.getByText(/8\/1000 characters/i)).toBeInTheDocument()
    })
  })

  describe('Side-by-side name fields in edit mode', () => {
    it('should display First Name and Last Name fields side by side', () => {
      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={[mockFinalComment]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      fireEvent.click(screen.getByRole('button', { name: /Edit/i }))

      const firstNameInputs = screen.getAllByDisplayValue('John')
      const lastNameInput = screen.getByDisplayValue('Doe')

      const editFirstNameInput = firstNameInputs[firstNameInputs.length - 1]
      const firstNameContainer = editFirstNameInput.closest('.form-group')
      const lastNameContainer = lastNameInput.closest('.form-group')
      const nameFieldsRow = firstNameContainer?.parentElement

      expect(nameFieldsRow).toBe(lastNameContainer?.parentElement)
      expect(nameFieldsRow).toHaveStyle({
        display: 'flex',
      })
    })
  })
})
