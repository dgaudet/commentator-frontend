/**
 * FinalCommentsModal Add Form Styling Tests
 * TDD Phase: RED - Writing failing tests first
 * Reference: US-FINAL-STYLE-003
 *
 * Testing add form styling consistency with Input component pattern
 * Reference: SubjectForm.tsx, Input.tsx, Button.tsx
 */

import { render, screen, fireEvent, waitFor } from '../../../test-utils'
import { FinalCommentsModal } from '../FinalCommentsModal'
import type { Class } from '../../../types'

const mockClass: Class = {
  id: 1,
  name: 'Mathematics 101',
  year: 2024,
  subjectId: 1,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
}

const mockHandlers = {
  onCreateComment: jest.fn(),
  onUpdateComment: jest.fn(),
  onDeleteComment: jest.fn(),
}

describe('US-FINAL-STYLE-003: Add Form Styling', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('AC1: Consistent form field styling', () => {
    it('should style First Name label with modalStyles pattern', () => {
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

      const label = screen.getByText(/First Name/i)

      expect(label).toHaveStyle({
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
          finalComments={[]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      const input = screen.getByLabelText(/First Name/i)

      expect(input).toHaveStyle({
        padding: '0.75rem',
        fontSize: '1rem',
        border: '1px solid #E5E7EB',
        borderRadius: '8px',
      })
    })

    it('should style Last Name field consistently', () => {
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

      const label = screen.getByText(/Last Name/i)
      const input = screen.getByLabelText(/Last Name/i)

      expect(label).toHaveStyle({
        fontSize: '0.875rem',
        fontWeight: '500',
        color: '#374151',
      })

      expect(input).toHaveStyle({
        padding: '0.75rem',
        fontSize: '1rem',
        border: '1px solid #E5E7EB',
        borderRadius: '8px',
      })
    })

    it('should style Grade field as numeric input with modalStyles pattern', () => {
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

      const label = screen.getByText(/^Grade/i)
      const input = screen.getByLabelText(/Grade/i) as HTMLInputElement

      expect(label).toHaveStyle({
        fontSize: '0.875rem',
        fontWeight: '500',
        color: '#374151',
      })

      expect(input.type).toBe('number')
      expect(input).toHaveStyle({
        padding: '0.75rem',
        fontSize: '1rem',
        border: '1px solid #E5E7EB',
        borderRadius: '8px',
      })
    })

    it('should style Comment textarea consistently', () => {
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

      const label = screen.getByText(/^Comment$/i)
      const textarea = screen.getByPlaceholderText(/Enter optional comment/i)

      expect(label).toHaveStyle({
        fontSize: '0.875rem',
        fontWeight: '500',
        color: '#374151',
      })

      expect(textarea).toHaveStyle({
        padding: '0.75rem',
        fontSize: '1rem',
        border: '1px solid #E5E7EB',
        borderRadius: '8px',
      })
    })
  })

  describe('AC2: Validation error styling', () => {
    it('should show red border on invalid First Name field', async () => {
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

      const input = screen.getByLabelText(/First Name/i)
      const submitButton = screen.getByRole('button', { name: /Add Final Comment/i })

      // Try to submit empty form
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(input).toHaveStyle({
          border: '1px solid #DC2626',
        })
      })
    })

    it('should show red border on invalid Grade field', async () => {
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

      const gradeInput = screen.getByLabelText(/Grade/i)
      const submitButton = screen.getByRole('button', { name: /Add Final Comment/i })

      // Fill first name but leave grade empty
      fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(gradeInput).toHaveStyle({
          border: '1px solid #DC2626',
        })
      })
    })
  })

  describe('AC3: Consistent layout spacing and typography', () => {
    it('should use consistent margin between form fields', () => {
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

      // US-CSS-006: Input component manages its own marginBottom (spacing.lg = 1rem)
      const gradeLabel = screen.getByText(/^Grade/i)
      const gradeWrapper = gradeLabel.parentElement

      expect(gradeWrapper).toHaveStyle({
        marginBottom: '1rem', // spacing.lg
      })
    })

    it('should display required asterisk with correct styling', () => {
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

      // US-CSS-006: Input component renders asterisks for required fields
      // First Name is required
      const firstNameLabel = screen.getByText(/First Name/i)
      const asterisk = firstNameLabel.parentElement?.querySelector('span')

      expect(asterisk).toBeInTheDocument()
      expect(asterisk).toHaveTextContent('*')
      expect(asterisk).toHaveStyle({
        color: '#DC2626', // colors.semantic.error
      })

      // Grade is required
      const gradeLabel = screen.getByText(/^Grade/i)
      const gradeAsterisk = gradeLabel.parentElement?.querySelector('span')

      expect(gradeAsterisk).toBeInTheDocument()
      expect(gradeAsterisk).toHaveTextContent('*')
      expect(gradeAsterisk).toHaveStyle({
        color: '#DC2626', // colors.semantic.error
      })

      // Last Name is optional (no asterisk)
      const lastNameLabel = screen.getByText(/Last Name/i)
      expect(lastNameLabel.parentElement?.querySelector('span')).not.toBeInTheDocument()
    })
  })

  describe('AC4: Button styling with variants', () => {
    it('should style Add button with primary variant', () => {
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

      const addButton = screen.getByRole('button', { name: /Add Final Comment/i })

      // Button component uses design tokens (US-CSS-005)
      expect(addButton).toHaveStyle({
        backgroundColor: '#0066FF',
        color: '#FFFFFF',
        borderColor: '#0066FF',
        padding: '0.75rem 1.5rem', // Updated to design tokens: spacing.md spacing.xl
        borderRadius: '8px',
        fontSize: '1rem', // Updated to design tokens: typography.fontSize.base
        fontWeight: '600',
      })
    })

    it('should enable Add button but show validation on click when form is invalid', () => {
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

      const addButton = screen.getByRole('button', { name: /Add Final Comment/i })

      // Button should be enabled (allows clicking to trigger validation)
      expect(addButton).not.toBeDisabled()
    })

    it('should enable Add button when form is valid', () => {
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

      fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } })
      fireEvent.change(screen.getByLabelText(/Grade/i), { target: { value: '85' } })

      const addButton = screen.getByRole('button', { name: /Add Final Comment/i })
      expect(addButton).not.toBeDisabled()
    })
  })

  describe('Character counter styling', () => {
    it('should display character counter with consistent styling', () => {
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

      const counter = screen.getByText(/0\/1000 characters/i)

      expect(counter).toHaveStyle({
        fontSize: '0.875rem',
        color: '#6B7280',
      })
    })

    it('should update character counter as user types', () => {
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

      const commentTextarea = screen.getByPlaceholderText(/Enter optional comment/i)
      fireEvent.change(commentTextarea, { target: { value: 'Great work!' } })

      expect(screen.getByText(/11\/1000 characters/i)).toBeInTheDocument()
    })
  })

  describe('Side-by-side name fields layout', () => {
    it('should display First Name and Last Name fields side by side', () => {
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

      const firstNameInput = screen.getByLabelText(/First Name/i)
      const lastNameInput = screen.getByLabelText(/Last Name/i)

      // US-CSS-006: Input wrapper -> flex container div -> flex row
      // Both fields should have a common parent container with flex display
      const firstNameWrapper = firstNameInput.parentElement // Input wrapper
      const lastNameWrapper = lastNameInput.parentElement // Input wrapper
      const firstNameFlexContainer = firstNameWrapper?.parentElement // flex: 1 div
      const lastNameFlexContainer = lastNameWrapper?.parentElement // flex: 1 div
      const nameFieldsRow = firstNameFlexContainer?.parentElement // flex row

      expect(nameFieldsRow).toBe(lastNameFlexContainer?.parentElement)
      expect(nameFieldsRow).toHaveStyle({
        display: 'flex',
      })
    })

    it('should have equal spacing between first and last name fields', () => {
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

      const firstNameInput = screen.getByLabelText(/First Name/i)
      // US-CSS-006: Input wrapper -> flex container -> flex row
      const nameFieldsRow = firstNameInput.parentElement?.parentElement?.parentElement

      expect(nameFieldsRow).toHaveStyle({
        gap: '1rem', // spacing.lg
      })
    })

    it('should give equal width to both name fields', () => {
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

      const firstNameInput = screen.getByLabelText(/First Name/i)
      const lastNameInput = screen.getByLabelText(/Last Name/i)

      // US-CSS-006: Input wrapper -> flex container (this has flex: 1)
      const firstNameContainer = firstNameInput.parentElement?.parentElement
      const lastNameContainer = lastNameInput.parentElement?.parentElement

      expect(firstNameContainer).toHaveStyle({
        flex: '1',
      })
      expect(lastNameContainer).toHaveStyle({
        flex: '1',
      })
    })
  })
})
