/**
 * ClassList Component Tests
 * TDD Phase: RED - These tests should fail initially
 * Reference: TASK-4.4, US-CLASS-001, US-CLASS-003, US-CLASS-005, DES-1, DES-16
 */
import { render, screen, fireEvent } from '../../../test-utils'
import { ClassList } from '../ClassList'
import { useClasses } from '../../../hooks/useClasses'

// Mock the useClasses hook
jest.mock('../../../hooks/useClasses')

const mockUseClasses = useClasses as jest.MockedFunction<typeof useClasses>

const mockClasses = [
  {
    id: 1,
    name: 'Mathematics 101',
    year: 2024,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 2,
    name: 'English 201',
    year: 2024,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 3,
    name: 'Science 301',
    year: 2025,
    createdAt: '2024-02-20T14:15:00Z',
    updatedAt: '2024-02-20T14:15:00Z',
  },
]

describe('ClassList', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('loading state', () => {
    it('should show loading spinner when loading and no classes', () => {
      mockUseClasses.mockReturnValue({
        classes: [],
        isLoading: true,
        error: null,
        fetchClasses: jest.fn(),
        createClass: jest.fn(),
        updateClass: jest.fn(),
        deleteClass: jest.fn(),
        clearError: jest.fn(),
      })

      render(<ClassList />)
      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })
  })

  describe('error state', () => {
    it('should show error message when error and no classes', () => {
      mockUseClasses.mockReturnValue({
        classes: [],
        isLoading: false,
        error: 'Failed to fetch classes',
        fetchClasses: jest.fn(),
        createClass: jest.fn(),
        updateClass: jest.fn(),
        deleteClass: jest.fn(),
        clearError: jest.fn(),
      })

      render(<ClassList />)
      expect(screen.getByText('Failed to fetch classes')).toBeInTheDocument()
    })

    it('should show error message above list when error and classes exist', () => {
      mockUseClasses.mockReturnValue({
        classes: mockClasses,
        isLoading: false,
        error: 'Something went wrong',
        fetchClasses: jest.fn(),
        createClass: jest.fn(),
        updateClass: jest.fn(),
        deleteClass: jest.fn(),
        clearError: jest.fn(),
      })

      render(<ClassList />)
      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
      expect(screen.getByText('Mathematics 101')).toBeInTheDocument()
    })
  })

  describe('empty state', () => {
    it('should show empty state when no classes', () => {
      mockUseClasses.mockReturnValue({
        classes: [],
        isLoading: false,
        error: null,
        fetchClasses: jest.fn(),
        createClass: jest.fn(),
        updateClass: jest.fn(),
        deleteClass: jest.fn(),
        clearError: jest.fn(),
      })

      render(<ClassList />)
      expect(screen.getByText('No classes found')).toBeInTheDocument()
    })

    it('should pass onAddClass to EmptyState when provided', () => {
      const handleAdd = jest.fn()
      mockUseClasses.mockReturnValue({
        classes: [],
        isLoading: false,
        error: null,
        fetchClasses: jest.fn(),
        createClass: jest.fn(),
        updateClass: jest.fn(),
        deleteClass: jest.fn(),
        clearError: jest.fn(),
      })

      render(<ClassList onAddClass={handleAdd} />)
      expect(screen.getByRole('button', { name: /create first class/i })).toBeInTheDocument()
    })
  })

  describe('success state', () => {
    it('should render list of classes', () => {
      mockUseClasses.mockReturnValue({
        classes: mockClasses,
        isLoading: false,
        error: null,
        fetchClasses: jest.fn(),
        createClass: jest.fn(),
        updateClass: jest.fn(),
        deleteClass: jest.fn(),
        clearError: jest.fn(),
      })

      render(<ClassList />)
      expect(screen.getByText('Mathematics 101')).toBeInTheDocument()
      expect(screen.getByText('English 201')).toBeInTheDocument()
      expect(screen.getByText('Science 301')).toBeInTheDocument()
    })

    it('should render "Your Classes" heading', () => {
      mockUseClasses.mockReturnValue({
        classes: mockClasses,
        isLoading: false,
        error: null,
        fetchClasses: jest.fn(),
        createClass: jest.fn(),
        updateClass: jest.fn(),
        deleteClass: jest.fn(),
        clearError: jest.fn(),
      })

      render(<ClassList />)
      expect(screen.getByText('Your Classes')).toBeInTheDocument()
    })

    it('should render Add Class button when onAddClass provided', () => {
      const handleAdd = jest.fn()
      mockUseClasses.mockReturnValue({
        classes: mockClasses,
        isLoading: false,
        error: null,
        fetchClasses: jest.fn(),
        createClass: jest.fn(),
        updateClass: jest.fn(),
        deleteClass: jest.fn(),
        clearError: jest.fn(),
      })

      render(<ClassList onAddClass={handleAdd} />)
      expect(screen.getByRole('button', { name: /add class/i })).toBeInTheDocument()
    })

    it('should not render Add Class button when onAddClass not provided', () => {
      mockUseClasses.mockReturnValue({
        classes: mockClasses,
        isLoading: false,
        error: null,
        fetchClasses: jest.fn(),
        createClass: jest.fn(),
        updateClass: jest.fn(),
        deleteClass: jest.fn(),
        clearError: jest.fn(),
      })

      render(<ClassList />)
      expect(screen.queryByRole('button', { name: /add class/i })).not.toBeInTheDocument()
    })

    it('should render all classes from hook', () => {
      // Note: useClasses hook already handles sorting (tested in its own tests)
      mockUseClasses.mockReturnValue({
        classes: mockClasses,
        isLoading: false,
        error: null,
        fetchClasses: jest.fn(),
        createClass: jest.fn(),
        updateClass: jest.fn(),
        deleteClass: jest.fn(),
        clearError: jest.fn(),
      })

      render(<ClassList />)
      // Verify all classes are rendered
      expect(screen.getByText('Mathematics 101')).toBeInTheDocument()
      expect(screen.getByText('English 201')).toBeInTheDocument()
      expect(screen.getByText('Science 301')).toBeInTheDocument()
    })

    it('should show loading spinner while background loading', () => {
      mockUseClasses.mockReturnValue({
        classes: mockClasses,
        isLoading: true,
        error: null,
        fetchClasses: jest.fn(),
        createClass: jest.fn(),
        updateClass: jest.fn(),
        deleteClass: jest.fn(),
        clearError: jest.fn(),
      })

      render(<ClassList />)
      // Should show list AND loading indicator
      expect(screen.getByText('Mathematics 101')).toBeInTheDocument()
      expect(screen.getByText('Updating...')).toBeInTheDocument()
    })
  })

  describe('interactions', () => {
    it('should pass onClassClick to ClassListItem when provided', () => {
      const handleClick = jest.fn()
      mockUseClasses.mockReturnValue({
        classes: [mockClasses[0]],
        isLoading: false,
        error: null,
        fetchClasses: jest.fn(),
        createClass: jest.fn(),
        updateClass: jest.fn(),
        deleteClass: jest.fn(),
        clearError: jest.fn(),
      })

      render(<ClassList onClassClick={handleClick} />)
      // ClassListItem should be rendered (we tested its click handler in its own tests)
      expect(screen.getByTestId('class-item-1')).toBeInTheDocument()
    })

    it('should pass onEdit callback to ClassListItem when provided', () => {
      const handleEdit = jest.fn()
      mockUseClasses.mockReturnValue({
        classes: [mockClasses[0]],
        isLoading: false,
        error: null,
        fetchClasses: jest.fn(),
        createClass: jest.fn(),
        updateClass: jest.fn(),
        deleteClass: jest.fn(),
        clearError: jest.fn(),
      })

      render(<ClassList onEdit={handleEdit} />)

      // Edit button should be present
      const editButton = screen.getByRole('button', { name: /edit mathematics 101/i })
      expect(editButton).toBeInTheDocument()

      // Click edit button
      fireEvent.click(editButton)

      // Handler should be called with the class item
      expect(handleEdit).toHaveBeenCalledTimes(1)
      expect(handleEdit).toHaveBeenCalledWith(mockClasses[0])
    })

    it('should pass onDelete callback to ClassListItem when provided', () => {
      const handleDelete = jest.fn()
      mockUseClasses.mockReturnValue({
        classes: [mockClasses[0]],
        isLoading: false,
        error: null,
        fetchClasses: jest.fn(),
        createClass: jest.fn(),
        updateClass: jest.fn(),
        deleteClass: jest.fn(),
        clearError: jest.fn(),
      })

      render(<ClassList onDelete={handleDelete} />)

      // Delete button should be present
      const deleteButton = screen.getByRole('button', { name: /delete mathematics 101/i })
      expect(deleteButton).toBeInTheDocument()

      // Click delete button
      fireEvent.click(deleteButton)

      // Handler should be called with the class ID
      expect(handleDelete).toHaveBeenCalledTimes(1)
      expect(handleDelete).toHaveBeenCalledWith(1)
    })

    it('should not show Edit/Delete buttons when callbacks not provided', () => {
      mockUseClasses.mockReturnValue({
        classes: [mockClasses[0]],
        isLoading: false,
        error: null,
        fetchClasses: jest.fn(),
        createClass: jest.fn(),
        updateClass: jest.fn(),
        deleteClass: jest.fn(),
        clearError: jest.fn(),
      })

      render(<ClassList />)

      // Edit and Delete buttons should not be present
      expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument()
    })
  })
})
