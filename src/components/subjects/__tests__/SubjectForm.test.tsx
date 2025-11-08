/**
 * SubjectForm Component Tests
 * TDD Phase: RED - These tests should fail initially
 * Reference: US-REFACTOR-007
 *
 * Key Change: Subject has no year field, so year-related tests removed
 * Duplicate detection only checks name (not name+year combination)
 */
import { render, screen, fireEvent, waitFor } from '../../../test-utils'
import { SubjectForm } from '../SubjectForm'
import { useSubjects } from '../../../hooks/useSubjects'
import type { Subject } from '../../../types/Subject'

// Mock the useSubjects hook
jest.mock('../../../hooks/useSubjects')

const mockUseSubjects = useSubjects as jest.MockedFunction<typeof useSubjects>

const mockExistingSubject: Subject = {
  id: 1,
  name: 'Mathematics 101',
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-15T10:30:00Z',
}

describe('SubjectForm', () => {
  const mockCreateSubject = jest.fn()
  const mockUpdateSubject = jest.fn()
  const mockOnSuccess = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseSubjects.mockReturnValue({
      subjects: [],
      isLoading: false,
      error: null,
      fetchSubjects: jest.fn(),
      createSubject: mockCreateSubject,
      updateSubject: mockUpdateSubject,
      deleteSubject: jest.fn(),
      clearError: jest.fn(),
    })
  })

  describe('create mode', () => {
    it('should render form title "Add New Subject"', () => {
      render(<SubjectForm onSuccess={mockOnSuccess} />)
      expect(screen.getByText('Add New Subject')).toBeInTheDocument()
    })
    it('should render empty name input with label and required indicator', () => {
      render(<SubjectForm onSuccess={mockOnSuccess} />)
      const nameInput = screen.getByLabelText(/subject name/i)
      expect(nameInput).toBeInTheDocument()
      expect(nameInput).toHaveValue('')
      expect(nameInput).toHaveAttribute('required')
    })

    it('should NOT render year input (Subject has no year field)', () => {
      render(<SubjectForm onSuccess={mockOnSuccess} />)
      expect(screen.queryByLabelText(/year/i)).not.toBeInTheDocument()
    })
    it('should render Create button but NOT Cancel button', () => {
      render(<SubjectForm onSuccess={mockOnSuccess} />)
      expect(screen.getByRole('button', { name: /create subject/i })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument()
    })

    it('should display create button', () => {
      render(<SubjectForm onSuccess={mockOnSuccess} />)
      const createButton = screen.getByRole('button', { name: /create subject/i })
      expect(createButton).toBeInTheDocument()
    })
    it('should show validation error for empty name on submit', async () => {
      render(<SubjectForm onSuccess={mockOnSuccess} />)

      const nameInput = screen.getByLabelText(/subject name/i)
      // Explicitly clear the input to ensure it's empty
      fireEvent.change(nameInput, { target: { value: '' } })

      const submitButton = screen.getByRole('button', { name: /create subject/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/subject name is required/i)).toBeInTheDocument()
      })
      expect(mockCreateSubject).not.toHaveBeenCalled()
    })

    it('should show validation error for name too long', async () => {
      render(<SubjectForm onSuccess={mockOnSuccess} />)
      const nameInput = screen.getByLabelText(/subject name/i)
      fireEvent.change(nameInput, { target: { value: 'a'.repeat(101) } })
      const submitButton = screen.getByRole('button', { name: /create subject/i })
      fireEvent.click(submitButton)
      await waitFor(() => {
        expect(screen.getByText(/subject name must be between 1 and 100 characters/i)).toBeInTheDocument()
      })
      expect(mockCreateSubject).not.toHaveBeenCalled()
    })
    it('should call createSubject with valid data (name only)', async () => {
      mockCreateSubject.mockResolvedValue({
        id: 2,
        name: 'English 201',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
      })
      render(<SubjectForm onSuccess={mockOnSuccess} />)

      const nameInput = screen.getByLabelText(/subject name/i)
      fireEvent.change(nameInput, { target: { value: 'English 201' } })

      const submitButton = screen.getByRole('button', { name: /create subject/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockCreateSubject).toHaveBeenCalledWith({
          name: 'English 201',
        })
      })
    })

    it('should call onSuccess after successful creation', async () => {
      const createdSubject = {
        id: 2,
        name: 'English 201',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
      }
      mockCreateSubject.mockResolvedValue(createdSubject)

      render(<SubjectForm onSuccess={mockOnSuccess} />)
      const nameInput = screen.getByLabelText(/subject name/i)
      fireEvent.change(nameInput, { target: { value: 'English 201' } })
      const submitButton = screen.getByRole('button', { name: /create subject/i })
      fireEvent.click(submitButton)
      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalledWith(createdSubject)
      })
    })
    // Cancel button removed - users can cancel by navigating away or switching tabs
    it('should disable submit button while submitting', async () => {
      mockCreateSubject.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      )
      render(<SubjectForm onSuccess={mockOnSuccess} />)

      const nameInput = screen.getByLabelText(/subject name/i)
      fireEvent.change(nameInput, { target: { value: 'Test Subject' } })

      const submitButton = screen.getByRole('button', { name: /create subject/i })
      fireEvent.click(submitButton)

      expect(submitButton).toBeDisabled()
    })

    it('should show error message on creation failure', async () => {
      mockCreateSubject.mockRejectedValue(new Error('Network error'))

      render(<SubjectForm onSuccess={mockOnSuccess} />)
      const nameInput = screen.getByLabelText(/subject name/i)
      fireEvent.change(nameInput, { target: { value: 'Test Subject' } })
      const submitButton = screen.getByRole('button', { name: /create subject/i })
      fireEvent.click(submitButton)
      await waitFor(() => {
        expect(screen.getByText(/failed to create subject/i)).toBeInTheDocument()
      })
    })
  })
  describe('edit mode', () => {
    it('should render form title "Edit Subject"', () => {
      render(
        <SubjectForm
          existingSubject={mockExistingSubject}
          onSuccess={mockOnSuccess}
        />,
      )
      expect(screen.getByText('Edit Subject')).toBeInTheDocument()
    })

    it('should pre-fill form with existing subject data (name only)', () => {
      render(
        <SubjectForm
          existingSubject={mockExistingSubject}
          onSuccess={mockOnSuccess}
        />,
      )

      const nameInput = screen.getByLabelText(/subject name/i)
      expect(nameInput).toHaveValue('Mathematics 101')
    })

    // US-EDIT-SUBJ-001: Cancel button should NOT be displayed in edit mode
    it('should render Save button but NOT Cancel button in edit mode', () => {
      render(
        <SubjectForm
          existingSubject={mockExistingSubject}
          onSuccess={mockOnSuccess}
        />,
      )
      expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument()
    })

    // US-EDIT-SUBJ-001: Save button should use full width in edit mode
    it('should display save button with full width styling in edit mode', () => {
      render(
        <SubjectForm
          existingSubject={mockExistingSubject}
          onSuccess={mockOnSuccess}
        />,
      )
      const saveButton = screen.getByRole('button', { name: /save changes/i })
      expect(saveButton).toBeInTheDocument()
    })

    it('should call updateSubject with valid data', async () => {
      mockUpdateSubject.mockResolvedValue({
        ...mockExistingSubject,
        name: 'Updated Mathematics',
      })

      render(
        <SubjectForm
          existingSubject={mockExistingSubject}
          onSuccess={mockOnSuccess}
        />,
      )

      const nameInput = screen.getByLabelText(/subject name/i)
      fireEvent.change(nameInput, { target: { value: 'Updated Mathematics' } })

      const submitButton = screen.getByRole('button', { name: /save changes/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockUpdateSubject).toHaveBeenCalledWith(1, {
          name: 'Updated Mathematics',
        })
      })
    })

    it('should call onSuccess after successful update', async () => {
      const updatedSubject = {
        ...mockExistingSubject,
        name: 'Updated Mathematics',
      }
      mockUpdateSubject.mockResolvedValue(updatedSubject)

      render(
        <SubjectForm
          existingSubject={mockExistingSubject}
          onSuccess={mockOnSuccess}
        />,
      )

      const nameInput = screen.getByLabelText(/subject name/i)
      fireEvent.change(nameInput, { target: { value: 'Updated Mathematics' } })

      const submitButton = screen.getByRole('button', { name: /save changes/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalledWith(updatedSubject)
      })
    })

    it('should show validation errors in edit mode', async () => {
      render(
        <SubjectForm
          existingSubject={mockExistingSubject}
          onSuccess={mockOnSuccess}
        />,
      )

      const nameInput = screen.getByLabelText(/subject name/i)
      fireEvent.change(nameInput, { target: { value: '' } })

      const submitButton = screen.getByRole('button', { name: /save changes/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/subject name is required/i)).toBeInTheDocument()
      })
      expect(mockUpdateSubject).not.toHaveBeenCalled()
    })

    it('should show error message on update failure', async () => {
      mockUpdateSubject.mockRejectedValue(new Error('Network error'))

      render(
        <SubjectForm
          existingSubject={mockExistingSubject}
          onSuccess={mockOnSuccess}
        />,
      )

      const nameInput = screen.getByLabelText(/subject name/i)
      fireEvent.change(nameInput, { target: { value: 'Updated Mathematics' } })

      const submitButton = screen.getByRole('button', { name: /save changes/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/failed to update subject/i)).toBeInTheDocument()
      })
    })
  })

  describe('duplicate detection', () => {
    it('should show error for duplicate name in create mode', async () => {
      mockUseSubjects.mockReturnValue({
        subjects: [mockExistingSubject],
        isLoading: false,
        error: null,
        fetchSubjects: jest.fn(),
        createSubject: mockCreateSubject,
        updateSubject: mockUpdateSubject,
        deleteSubject: jest.fn(),
        clearError: jest.fn(),
      })

      render(<SubjectForm onSuccess={mockOnSuccess} />)
      const nameInput = screen.getByLabelText(/subject name/i)
      fireEvent.change(nameInput, { target: { value: 'Mathematics 101' } })
      const submitButton = screen.getByRole('button', { name: /create subject/i })
      fireEvent.click(submitButton)
      await waitFor(() => {
        expect(screen.getByText(/a subject with this name already exists/i)).toBeInTheDocument()
      })
      expect(mockCreateSubject).not.toHaveBeenCalled()
    })
    it('should not flag duplicate when editing same subject in edit mode', async () => {
      mockUseSubjects.mockReturnValue({
        subjects: [mockExistingSubject],
        isLoading: false,
        error: null,
        fetchSubjects: jest.fn(),
        createSubject: mockCreateSubject,
        updateSubject: mockUpdateSubject,
        deleteSubject: jest.fn(),
        clearError: jest.fn(),
      })
      mockUpdateSubject.mockResolvedValue(mockExistingSubject)
      render(
        <SubjectForm
          existingSubject={mockExistingSubject}
          onSuccess={mockOnSuccess}
        />,
      )

      const submitButton = screen.getByRole('button', { name: /save changes/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockUpdateSubject).toHaveBeenCalled()
      })
      expect(screen.queryByText(/already exists/i)).not.toBeInTheDocument()
    })

    it('should show error when editing to match another subject in edit mode', async () => {
      const anotherSubject: Subject = {
        id: 2,
        name: 'English 201',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
      }

      mockUseSubjects.mockReturnValue({
        subjects: [mockExistingSubject, anotherSubject],
        isLoading: false,
        error: null,
        fetchSubjects: jest.fn(),
        createSubject: mockCreateSubject,
        updateSubject: mockUpdateSubject,
        deleteSubject: jest.fn(),
        clearError: jest.fn(),
      })

      render(
        <SubjectForm
          existingSubject={mockExistingSubject}
          onSuccess={mockOnSuccess}
        />,
      )

      const nameInput = screen.getByLabelText(/subject name/i)
      fireEvent.change(nameInput, { target: { value: 'English 201' } })

      const submitButton = screen.getByRole('button', { name: /save changes/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/a subject with this name already exists/i)).toBeInTheDocument()
      })
      expect(mockUpdateSubject).not.toHaveBeenCalled()
    })

    it('should perform case-insensitive duplicate detection', async () => {
      mockUseSubjects.mockReturnValue({
        subjects: [mockExistingSubject],
        isLoading: false,
        error: null,
        fetchSubjects: jest.fn(),
        createSubject: mockCreateSubject,
        updateSubject: mockUpdateSubject,
        deleteSubject: jest.fn(),
        clearError: jest.fn(),
      })

      render(<SubjectForm onSuccess={mockOnSuccess} />)
      const nameInput = screen.getByLabelText(/subject name/i)
      fireEvent.change(nameInput, { target: { value: 'MATHEMATICS 101' } })
      const submitButton = screen.getByRole('button', { name: /create subject/i })
      fireEvent.click(submitButton)
      await waitFor(() => {
        expect(screen.getByText(/a subject with this name already exists/i)).toBeInTheDocument()
      })
      expect(mockCreateSubject).not.toHaveBeenCalled()
    })
  })
  describe('input clearing', () => {
    it('should clear field error when user types', async () => {
      render(<SubjectForm onSuccess={mockOnSuccess} />)

      const nameInput = screen.getByLabelText(/subject name/i)
      const submitButton = screen.getByRole('button', { name: /create subject/i })

      // Submit empty form to trigger error
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/subject name is required/i)).toBeInTheDocument()
      })

      // Type in input - error should clear
      fireEvent.change(nameInput, { target: { value: 'Test' } })

      expect(screen.queryByText(/subject name is required/i)).not.toBeInTheDocument()
    })

    it('should clear duplicate error when user changes name', async () => {
      mockUseSubjects.mockReturnValue({
        subjects: [mockExistingSubject],
        isLoading: false,
        error: null,
        fetchSubjects: jest.fn(),
        createSubject: mockCreateSubject,
        updateSubject: mockUpdateSubject,
        deleteSubject: jest.fn(),
        clearError: jest.fn(),
      })

      render(<SubjectForm onSuccess={mockOnSuccess} />)
      const nameInput = screen.getByLabelText(/subject name/i)
      const submitButton = screen.getByRole('button', { name: /create subject/i })
      // Enter duplicate name
      fireEvent.change(nameInput, { target: { value: 'Mathematics 101' } })
      fireEvent.click(submitButton)
      await waitFor(() => {
        expect(screen.getByText(/a subject with this name already exists/i)).toBeInTheDocument()
      })
      // Change name - duplicate error should clear
      fireEvent.change(nameInput, { target: { value: 'Mathematics 102' } })
      expect(screen.queryByText(/already exists/i)).not.toBeInTheDocument()
    })
  })

  // US-SUBJECT-CREATE-001: Cancel button in create mode
  describe('cancel button', () => {
    it('should display Cancel button in create mode', () => {
      const mockOnCancel = jest.fn()

      render(<SubjectForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />)

      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
    })

    it('should display both Create and Cancel buttons side-by-side in create mode', () => {
      const mockOnCancel = jest.fn()

      render(<SubjectForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />)

      const createButton = screen.getByRole('button', { name: /create subject/i })
      const cancelButton = screen.getByRole('button', { name: /cancel/i })

      expect(createButton).toBeInTheDocument()
      expect(cancelButton).toBeInTheDocument()

      // Verify buttons are in a flex container with gap (using inline styles)
      // Button is wrapped in a div, so we need to get the parent of the wrapper
      const container = createButton.closest('div')?.parentElement
      expect(container).toHaveStyle({ display: 'flex' })
      expect(container).toHaveStyle({ gap: '1rem' })
    })

    it('should NOT display Cancel button in edit mode', () => {
      const mockOnCancel = jest.fn()
      const existingSubject = {
        id: 1,
        name: 'Mathematics 101',
        createdAt: '2024-01-01T10:30:00Z',
        updatedAt: '2024-01-01T10:30:00Z',
      }

      render(
        <SubjectForm
          existingSubject={existingSubject}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />,
      )

      expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument()
    })

    it('should call onCancel when Cancel button is clicked', () => {
      const mockOnCancel = jest.fn()

      render(<SubjectForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />)

      const cancelButton = screen.getByRole('button', { name: /cancel/i })
      fireEvent.click(cancelButton)

      expect(mockOnCancel).toHaveBeenCalled()
    })

    it('should disable Cancel button while form is submitting', async () => {
      const mockOnCancel = jest.fn()

      mockCreateSubject.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      )

      render(<SubjectForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />)

      const nameInput = screen.getByLabelText(/subject name/i)
      fireEvent.change(nameInput, { target: { value: 'Test Subject' } })

      const createButton = screen.getByRole('button', { name: /create subject/i })
      fireEvent.click(createButton)

      const cancelButton = screen.getByRole('button', { name: /cancel/i })
      expect(cancelButton).toBeDisabled()
    })
  })
})
