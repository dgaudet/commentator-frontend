/**
 * ClassForm Component Tests
 * TDD Phase: RED - These tests should fail initially
 * Reference: TASK-4.5, US-CLASS-002, US-CLASS-003, DES-3, DES-4
 */
import { render, screen, fireEvent, waitFor } from '../../test-utils'
import { ClassForm } from './ClassForm'
import { useClasses } from '../../hooks/useClasses'
import type { Class } from '../../types/Class'

// Mock the useClasses hook
jest.mock('../../hooks/useClasses')

const mockUseClasses = useClasses as jest.MockedFunction<typeof useClasses>

const mockExistingClass: Class = {
  id: 1,
  name: 'Mathematics 101',
  year: 2024,
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-15T10:30:00Z',
}

describe('ClassForm', () => {
  const mockCreateClass = jest.fn()
  const mockUpdateClass = jest.fn()
  const mockOnSuccess = jest.fn()
  const mockOnCancel = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseClasses.mockReturnValue({
      classes: [],
      isLoading: false,
      error: null,
      fetchClasses: jest.fn(),
      createClass: mockCreateClass,
      updateClass: mockUpdateClass,
      deleteClass: jest.fn(),
      clearError: jest.fn(),
    })
  })

  describe('create mode', () => {
    it('should render form title "Add New Class"', () => {
      render(<ClassForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />)
      expect(screen.getByText('Add New Class')).toBeInTheDocument()
    })

    it('should render empty name input with label and required indicator', () => {
      render(<ClassForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />)
      const nameInput = screen.getByLabelText(/class name/i)
      expect(nameInput).toBeInTheDocument()
      expect(nameInput).toHaveValue('')
      expect(nameInput).toHaveAttribute('required')
    })

    it('should render year input with current year as default', () => {
      render(<ClassForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />)
      const yearInput = screen.getByLabelText(/year/i)
      expect(yearInput).toBeInTheDocument()
      expect(yearInput).toHaveValue(new Date().getFullYear())
    })

    it('should render Create and Cancel buttons', () => {
      render(<ClassForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />)
      expect(screen.getByRole('button', { name: /create class/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
    })

    it('should show validation error for empty name on submit', async () => {
      render(<ClassForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />)

      const nameInput = screen.getByLabelText(/class name/i)
      // Explicitly clear the input to ensure it's empty
      fireEvent.change(nameInput, { target: { value: '' } })

      const submitButton = screen.getByRole('button', { name: /create class/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/class name is required/i)).toBeInTheDocument()
      })
      expect(mockCreateClass).not.toHaveBeenCalled()
    })

    it('should show validation error for name too long', async () => {
      render(<ClassForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />)

      const nameInput = screen.getByLabelText(/class name/i)
      fireEvent.change(nameInput, { target: { value: 'a'.repeat(101) } })

      const submitButton = screen.getByRole('button', { name: /create class/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/class name must be between 1 and 100 characters/i)).toBeInTheDocument()
      })
      expect(mockCreateClass).not.toHaveBeenCalled()
    })

    it('should show validation error for invalid year', async () => {
      render(<ClassForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />)

      const yearInput = screen.getByLabelText(/year/i)
      fireEvent.change(yearInput, { target: { value: '1999' } })

      const submitButton = screen.getByRole('button', { name: /create class/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/year must be between 2000 and 2099/i)).toBeInTheDocument()
      })
      expect(mockCreateClass).not.toHaveBeenCalled()
    })

    it('should call createClass with valid data', async () => {
      mockCreateClass.mockResolvedValue({
        id: 2,
        name: 'English 201',
        year: 2024,
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
      })

      render(<ClassForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />)

      const nameInput = screen.getByLabelText(/class name/i)
      fireEvent.change(nameInput, { target: { value: 'English 201' } })

      const yearInput = screen.getByLabelText(/year/i)
      fireEvent.change(yearInput, { target: { value: '2024' } })

      const submitButton = screen.getByRole('button', { name: /create class/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockCreateClass).toHaveBeenCalledWith({
          name: 'English 201',
          year: 2024,
        })
      })
    })

    it('should call onSuccess after successful creation', async () => {
      const createdClass = {
        id: 2,
        name: 'English 201',
        year: 2024,
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
      }
      mockCreateClass.mockResolvedValue(createdClass)

      render(<ClassForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />)

      const nameInput = screen.getByLabelText(/class name/i)
      fireEvent.change(nameInput, { target: { value: 'English 201' } })

      const submitButton = screen.getByRole('button', { name: /create class/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalledWith(createdClass)
      })
    })

    it('should call onCancel when Cancel button clicked', () => {
      render(<ClassForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />)

      const cancelButton = screen.getByRole('button', { name: /cancel/i })
      fireEvent.click(cancelButton)

      expect(mockOnCancel).toHaveBeenCalled()
    })

    it('should disable submit button while submitting', async () => {
      mockCreateClass.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))

      render(<ClassForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />)

      const nameInput = screen.getByLabelText(/class name/i)
      fireEvent.change(nameInput, { target: { value: 'English 201' } })

      const submitButton = screen.getByRole('button', { name: /create class/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(submitButton).toBeDisabled()
      })
    })

    it('should show error message on creation failure', async () => {
      mockCreateClass.mockRejectedValue(new Error('Network error'))

      render(<ClassForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />)

      const nameInput = screen.getByLabelText(/class name/i)
      fireEvent.change(nameInput, { target: { value: 'English 201' } })

      const submitButton = screen.getByRole('button', { name: /create class/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/failed to create class/i)).toBeInTheDocument()
      })
      expect(mockOnSuccess).not.toHaveBeenCalled()
    })
  })

  describe('edit mode', () => {
    it('should render form title "Edit Class"', () => {
      render(
        <ClassForm
          existingClass={mockExistingClass}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />,
      )
      expect(screen.getByText('Edit Class')).toBeInTheDocument()
    })

    it('should pre-fill form with existing class data', () => {
      render(
        <ClassForm
          existingClass={mockExistingClass}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />,
      )

      const nameInput = screen.getByLabelText(/class name/i)
      expect(nameInput).toHaveValue('Mathematics 101')

      const yearInput = screen.getByLabelText(/year/i)
      expect(yearInput).toHaveValue(2024)
    })

    it('should render Save and Cancel buttons', () => {
      render(
        <ClassForm
          existingClass={mockExistingClass}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />,
      )
      expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
    })

    it('should call updateClass with valid data', async () => {
      const updatedClass = {
        ...mockExistingClass,
        name: 'Advanced Mathematics',
        updatedAt: '2024-01-16T10:30:00Z',
      }
      mockUpdateClass.mockResolvedValue(updatedClass)

      render(
        <ClassForm
          existingClass={mockExistingClass}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />,
      )

      const nameInput = screen.getByLabelText(/class name/i)
      fireEvent.change(nameInput, { target: { value: 'Advanced Mathematics' } })

      const submitButton = screen.getByRole('button', { name: /save changes/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockUpdateClass).toHaveBeenCalledWith(1, {
          name: 'Advanced Mathematics',
          year: 2024,
        })
      })
    })

    it('should call onSuccess after successful update', async () => {
      const updatedClass = {
        ...mockExistingClass,
        name: 'Advanced Mathematics',
        updatedAt: '2024-01-16T10:30:00Z',
      }
      mockUpdateClass.mockResolvedValue(updatedClass)

      render(
        <ClassForm
          existingClass={mockExistingClass}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />,
      )

      const nameInput = screen.getByLabelText(/class name/i)
      fireEvent.change(nameInput, { target: { value: 'Advanced Mathematics' } })

      const submitButton = screen.getByRole('button', { name: /save changes/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalledWith(updatedClass)
      })
    })

    it('should show validation errors in edit mode', async () => {
      render(
        <ClassForm
          existingClass={mockExistingClass}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />,
      )

      const nameInput = screen.getByLabelText(/class name/i)
      fireEvent.change(nameInput, { target: { value: '' } })

      const submitButton = screen.getByRole('button', { name: /save changes/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/class name is required/i)).toBeInTheDocument()
      })
      expect(mockUpdateClass).not.toHaveBeenCalled()
    })

    it('should show error message on update failure', async () => {
      mockUpdateClass.mockRejectedValue(new Error('Network error'))

      render(
        <ClassForm
          existingClass={mockExistingClass}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />,
      )

      const nameInput = screen.getByLabelText(/class name/i)
      fireEvent.change(nameInput, { target: { value: 'Advanced Mathematics' } })

      const submitButton = screen.getByRole('button', { name: /save changes/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/failed to update class/i)).toBeInTheDocument()
      })
      expect(mockOnSuccess).not.toHaveBeenCalled()
    })
  })

  describe('duplicate detection', () => {
    beforeEach(() => {
      mockUseClasses.mockReturnValue({
        classes: [
          mockExistingClass,
          {
            id: 2,
            name: 'English 201',
            year: 2024,
            createdAt: '2024-01-15T10:30:00Z',
            updatedAt: '2024-01-15T10:30:00Z',
          },
        ],
        isLoading: false,
        error: null,
        fetchClasses: jest.fn(),
        createClass: mockCreateClass,
        updateClass: mockUpdateClass,
        deleteClass: jest.fn(),
        clearError: jest.fn(),
      })
    })

    it('should show error for duplicate name+year in create mode', async () => {
      render(<ClassForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />)

      const nameInput = screen.getByLabelText(/class name/i)
      fireEvent.change(nameInput, { target: { value: 'Mathematics 101' } })

      const yearInput = screen.getByLabelText(/year/i)
      fireEvent.change(yearInput, { target: { value: '2024' } })

      const submitButton = screen.getByRole('button', { name: /create class/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/a class with this name and year already exists/i)).toBeInTheDocument()
      })
      expect(mockCreateClass).not.toHaveBeenCalled()
    })

    it('should allow same name with different year in create mode', async () => {
      mockCreateClass.mockResolvedValue({
        id: 3,
        name: 'Mathematics 101',
        year: 2025,
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
      })

      render(<ClassForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />)

      const nameInput = screen.getByLabelText(/class name/i)
      fireEvent.change(nameInput, { target: { value: 'Mathematics 101' } })

      const yearInput = screen.getByLabelText(/year/i)
      fireEvent.change(yearInput, { target: { value: '2025' } })

      const submitButton = screen.getByRole('button', { name: /create class/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockCreateClass).toHaveBeenCalledWith({
          name: 'Mathematics 101',
          year: 2025,
        })
      })
    })

    it('should not flag duplicate when editing same class in edit mode', async () => {
      mockUpdateClass.mockResolvedValue(mockExistingClass)

      render(
        <ClassForm
          existingClass={mockExistingClass}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />,
      )

      // Keep same name and year
      const submitButton = screen.getByRole('button', { name: /save changes/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockUpdateClass).toHaveBeenCalled()
      })
      expect(screen.queryByText(/a class with this name and year already exists/i)).not.toBeInTheDocument()
    })

    it('should show error when editing to match another class in edit mode', async () => {
      render(
        <ClassForm
          existingClass={mockExistingClass}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />,
      )

      const nameInput = screen.getByLabelText(/class name/i)
      fireEvent.change(nameInput, { target: { value: 'English 201' } })

      const submitButton = screen.getByRole('button', { name: /save changes/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/a class with this name and year already exists/i)).toBeInTheDocument()
      })
      expect(mockUpdateClass).not.toHaveBeenCalled()
    })
  })
})
