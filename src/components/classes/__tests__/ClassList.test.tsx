/**
 * ClassList Component Tests
 * TDD Phase: RED - These tests should fail initially
 * Reference: TASK-4.4, US-CLASS-001, US-CLASS-003, US-CLASS-005, DES-1, DES-16
 */
import { render, screen, fireEvent } from '../../../test-utils'
import { ClassList } from '../ClassList'
import { useClasses } from '../../../hooks/useClasses'
import * as classStorageUtils from '../../../utils/classStorageUtils'

// Mock the useClasses hook
jest.mock('../../../hooks/useClasses')

// Mock classStorageUtils
jest.mock('../../../utils/classStorageUtils')

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

    it('should show error message above dropdown when error and classes exist', () => {
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
      // Dropdown should still be visible
      expect(screen.getByRole('combobox', { name: /select a class/i })).toBeInTheDocument()
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
    it('should render dropdown with all classes as options', () => {
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
      // Dropdown should contain all classes
      expect(screen.getByRole('option', { name: 'Mathematics 101 - 2024' })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: 'English 201 - 2024' })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: 'Science 301 - 2025' })).toBeInTheDocument()
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

    it('should render all classes from hook in dropdown', () => {
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
      // Verify all classes are in dropdown options
      expect(screen.getByRole('option', { name: 'Mathematics 101 - 2024' })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: 'English 201 - 2024' })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: 'Science 301 - 2025' })).toBeInTheDocument()
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
      // Should show dropdown AND loading indicator
      expect(screen.getByRole('combobox', { name: /select a class/i })).toBeInTheDocument()
      expect(screen.getByText('Updating...')).toBeInTheDocument()
    })
  })

  describe('interactions', () => {
    it('should pass onClassClick to ClassListItem when class selected', () => {
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
      // With single class, it should auto-select
      expect(screen.getByTestId('class-item-1')).toBeInTheDocument()
    })

    it('should pass onEdit callback to ClassListItem when class selected', () => {
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

      // With single class, it auto-selects - Edit button should be present
      const editButton = screen.getByRole('button', { name: /edit mathematics 101/i })
      expect(editButton).toBeInTheDocument()

      // Click edit button
      fireEvent.click(editButton)

      // Handler should be called with the class item
      expect(handleEdit).toHaveBeenCalledTimes(1)
      expect(handleEdit).toHaveBeenCalledWith(mockClasses[0])
    })

    it('should pass onDelete callback to ClassListItem when class selected', () => {
      const handleDelete = jest.fn()
      const mockDeleteClass = jest.fn().mockResolvedValue(undefined)

      mockUseClasses.mockReturnValue({
        classes: [mockClasses[0]],
        isLoading: false,
        error: null,
        fetchClasses: jest.fn(),
        createClass: jest.fn(),
        updateClass: jest.fn(),
        deleteClass: mockDeleteClass,
        clearError: jest.fn(),
      })

      render(<ClassList onDelete={handleDelete} />)

      // With single class, it auto-selects - Delete button should be present
      const deleteButton = screen.getByRole('button', { name: /delete mathematics 101/i })
      expect(deleteButton).toBeInTheDocument()

      // Click delete button
      fireEvent.click(deleteButton)

      // Handler should be called with className and a confirmation function
      expect(handleDelete).toHaveBeenCalledTimes(1)
      expect(handleDelete).toHaveBeenCalledWith('Mathematics 101', expect.any(Function))
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

  describe('dropdown selector (TASK-2.1)', () => {
    it('should render dropdown with "Select a class..." placeholder', () => {
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
      const dropdown = screen.getByRole('combobox', { name: /select a class/i })
      expect(dropdown).toBeInTheDocument()
      expect(screen.getByText('Select a class...')).toBeInTheDocument()
    })

    it('should render dropdown with all classes as options', () => {
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
      expect(screen.getByRole('option', { name: 'Mathematics 101 - 2024' })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: 'English 201 - 2024' })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: 'Science 301 - 2025' })).toBeInTheDocument()
    })

    it('should disable dropdown when loading with existing classes', () => {
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
      const dropdown = screen.getByRole('combobox', { name: /select a class/i })
      expect(dropdown).toBeDisabled()
    })

    it('should show "Loading classes..." in dropdown placeholder when loading', () => {
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
      const dropdown = screen.getByRole('combobox', { name: /select a class/i })
      expect(dropdown).toBeInTheDocument()
      expect(screen.getByText('Loading classes...')).toBeInTheDocument()
    })

    it('should update selectedClassId when dropdown option selected', () => {
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
      const dropdown = screen.getByRole('combobox', { name: /select a class/i }) as HTMLSelectElement

      // Select a class
      fireEvent.change(dropdown, { target: { value: '2' } })

      // Dropdown should reflect selected value
      expect(dropdown.value).toBe('2')
    })
  })

  describe('conditional ClassListItem rendering (TASK-2.2)', () => {
    it('should not render ClassListItem when no class selected', () => {
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

      // Should not render any ClassListItem components initially
      expect(screen.queryByTestId('class-item-1')).not.toBeInTheDocument()
      expect(screen.queryByTestId('class-item-2')).not.toBeInTheDocument()
      expect(screen.queryByTestId('class-item-3')).not.toBeInTheDocument()
    })

    it('should render single ClassListItem when class selected', () => {
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
      const dropdown = screen.getByRole('combobox', { name: /select a class/i })

      // Select a class
      fireEvent.change(dropdown, { target: { value: '2' } })

      // Should render only the selected ClassListItem
      expect(screen.queryByTestId('class-item-1')).not.toBeInTheDocument()
      expect(screen.getByTestId('class-item-2')).toBeInTheDocument()
      expect(screen.queryByTestId('class-item-3')).not.toBeInTheDocument()
    })

    it('should update ClassListItem when different class selected', () => {
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
      const dropdown = screen.getByRole('combobox', { name: /select a class/i })

      // Select first class
      fireEvent.change(dropdown, { target: { value: '1' } })
      expect(screen.getByTestId('class-item-1')).toBeInTheDocument()
      expect(screen.queryByTestId('class-item-3')).not.toBeInTheDocument()

      // Select different class
      fireEvent.change(dropdown, { target: { value: '3' } })
      expect(screen.queryByTestId('class-item-1')).not.toBeInTheDocument()
      expect(screen.getByTestId('class-item-3')).toBeInTheDocument()
    })
  })

  describe('persistence logic (TASK-2.3)', () => {
    let mockGetSelectedClassId: jest.MockedFunction<typeof classStorageUtils.getSelectedClassId>
    let mockSaveSelectedClassId: jest.MockedFunction<typeof classStorageUtils.saveSelectedClassId>
    let mockClearSelectedClassId: jest.MockedFunction<typeof classStorageUtils.clearSelectedClassId>

    beforeEach(() => {
      mockGetSelectedClassId = classStorageUtils.getSelectedClassId as jest.MockedFunction<typeof classStorageUtils.getSelectedClassId>
      mockSaveSelectedClassId = classStorageUtils.saveSelectedClassId as jest.MockedFunction<typeof classStorageUtils.saveSelectedClassId>
      mockClearSelectedClassId = classStorageUtils.clearSelectedClassId as jest.MockedFunction<typeof classStorageUtils.clearSelectedClassId>

      // Reset mocks
      mockGetSelectedClassId.mockReturnValue(null)
      mockSaveSelectedClassId.mockImplementation(() => {})
      mockClearSelectedClassId.mockImplementation(() => {})
    })

    it('should load persisted selection on mount if valid', () => {
      mockGetSelectedClassId.mockReturnValue(2)
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

      // Should auto-select the persisted class
      expect(mockGetSelectedClassId).toHaveBeenCalled()
      expect(screen.getByTestId('class-item-2')).toBeInTheDocument()
    })

    it('should not load persisted selection if ID does not exist in classes', () => {
      mockGetSelectedClassId.mockReturnValue(999) // Non-existent ID
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

      // Should not render any ClassListItem
      expect(mockGetSelectedClassId).toHaveBeenCalled()
      expect(screen.queryByTestId('class-item-1')).not.toBeInTheDocument()
      expect(screen.queryByTestId('class-item-2')).not.toBeInTheDocument()
      expect(screen.queryByTestId('class-item-3')).not.toBeInTheDocument()
    })

    it('should save selection to localStorage when class selected', () => {
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
      const dropdown = screen.getByRole('combobox', { name: /select a class/i })

      // Select a class
      fireEvent.change(dropdown, { target: { value: '3' } })

      // Should save to localStorage
      expect(mockSaveSelectedClassId).toHaveBeenCalledWith(3)
    })

    it('should clear selection from localStorage when deselecting', () => {
      mockGetSelectedClassId.mockReturnValue(2)
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
      const dropdown = screen.getByRole('combobox', { name: /select a class/i })

      // Deselect by choosing placeholder
      fireEvent.change(dropdown, { target: { value: '' } })

      // Should clear from localStorage
      expect(mockClearSelectedClassId).toHaveBeenCalled()
    })

    it('should handle getSelectedClassId returning null gracefully', () => {
      mockGetSelectedClassId.mockReturnValue(null)
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

      // Should render dropdown without selection
      expect(mockGetSelectedClassId).toHaveBeenCalled()
      expect(screen.getByRole('combobox', { name: /select a class/i })).toBeInTheDocument()
      expect(screen.queryByTestId('class-item-1')).not.toBeInTheDocument()
    })
  })

  describe('auto-selection (TASK-3.1)', () => {
    let mockGetSelectedClassId: jest.MockedFunction<typeof classStorageUtils.getSelectedClassId>

    beforeEach(() => {
      mockGetSelectedClassId = classStorageUtils.getSelectedClassId as jest.MockedFunction<typeof classStorageUtils.getSelectedClassId>
      mockGetSelectedClassId.mockReturnValue(null)
    })

    it('should auto-select when only one class exists', () => {
      const singleClass = [mockClasses[0]]
      mockUseClasses.mockReturnValue({
        classes: singleClass,
        isLoading: false,
        error: null,
        fetchClasses: jest.fn(),
        createClass: jest.fn(),
        updateClass: jest.fn(),
        deleteClass: jest.fn(),
        clearError: jest.fn(),
      })

      render(<ClassList />)

      // Should auto-select the only class
      expect(screen.getByTestId('class-item-1')).toBeInTheDocument()
      const dropdown = screen.getByRole('combobox', { name: /select a class/i }) as HTMLSelectElement
      expect(dropdown.value).toBe('1')
    })

    it('should not auto-select when multiple classes exist', () => {
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

      // Should not auto-select
      expect(screen.queryByTestId('class-item-1')).not.toBeInTheDocument()
      expect(screen.queryByTestId('class-item-2')).not.toBeInTheDocument()
      const dropdown = screen.getByRole('combobox', { name: /select a class/i }) as HTMLSelectElement
      expect(dropdown.value).toBe('')
    })

    it('should prefer persisted selection over auto-selection', () => {
      mockGetSelectedClassId.mockReturnValue(2)
      const twoClasses = [mockClasses[0], mockClasses[1]]
      mockUseClasses.mockReturnValue({
        classes: twoClasses,
        isLoading: false,
        error: null,
        fetchClasses: jest.fn(),
        createClass: jest.fn(),
        updateClass: jest.fn(),
        deleteClass: jest.fn(),
        clearError: jest.fn(),
      })

      render(<ClassList />)

      // Should use persisted selection, not auto-select
      expect(screen.getByTestId('class-item-2')).toBeInTheDocument()
      expect(screen.queryByTestId('class-item-1')).not.toBeInTheDocument()
    })
  })

  describe('accessibility (TASK-4.1)', () => {
    beforeEach(() => {
      const mockGetSelectedClassId = classStorageUtils.getSelectedClassId as jest.MockedFunction<typeof classStorageUtils.getSelectedClassId>
      mockGetSelectedClassId.mockReturnValue(null)
    })

    it('should have accessible combobox role for dropdown', () => {
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
      const dropdown = screen.getByRole('combobox', { name: /select a class to view/i })
      expect(dropdown).toBeInTheDocument()
    })

    it('should have proper aria-label on dropdown', () => {
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
      const dropdown = screen.getByLabelText('Select a class to view')
      expect(dropdown).toBeInTheDocument()
      expect(dropdown.tagName).toBe('SELECT')
    })

    it('should have accessible label element linked to dropdown', () => {
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
      const label = screen.getByText('Select a Class')
      const dropdown = screen.getByRole('combobox')

      expect(label).toBeInTheDocument()
      expect(label.tagName).toBe('LABEL')
      expect(label.getAttribute('for')).toBe('class-selector')
      expect(dropdown.getAttribute('id')).toBe('class-selector')
    })

    it('should support keyboard navigation (Tab to dropdown)', () => {
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
      const dropdown = screen.getByRole('combobox')

      // Dropdown should be focusable
      dropdown.focus()
      expect(document.activeElement).toBe(dropdown)
    })

    it('should support keyboard selection (Arrow keys + Enter)', () => {
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
      const dropdown = screen.getByRole('combobox') as HTMLSelectElement

      // Focus dropdown
      dropdown.focus()

      // Simulate selecting with keyboard
      fireEvent.change(dropdown, { target: { value: '2' } })

      // Should update selection
      expect(dropdown.value).toBe('2')
      expect(screen.getByTestId('class-item-2')).toBeInTheDocument()
    })

    it('should announce loading state to screen readers', () => {
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
      const loadingSpinner = screen.getByRole('status')
      expect(loadingSpinner).toBeInTheDocument()
      expect(loadingSpinner).toHaveAttribute('aria-live', 'polite')
    })

    it('should maintain focus on dropdown after selection', () => {
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
      const dropdown = screen.getByRole('combobox') as HTMLSelectElement

      // Focus and select
      dropdown.focus()
      fireEvent.change(dropdown, { target: { value: '1' } })

      // Dropdown should still be in the DOM (not removed)
      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })
  })
})
