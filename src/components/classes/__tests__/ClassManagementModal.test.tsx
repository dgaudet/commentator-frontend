/**
 * ClassManagementModal Component Tests
 * TDD Phase: RED - Tests written before implementation
 *
 * Tests verify modal for managing classes with dropdown selector
 */

import { render, screen, fireEvent, waitFor } from '../../../test-utils'
import { ClassManagementModal } from '../ClassManagementModal'
import type { Class } from '../../../types'

const mockSubject = {
  id: 1,
  name: 'Mathematics 101',
}

const mockClasses: Class[] = [
  {
    id: 1,
    subjectId: 1,
    name: 'Advanced Section',
    year: 2024,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 2,
    subjectId: 1,
    name: 'Honors Class',
    year: 2024,
    createdAt: '2024-01-15T11:00:00Z',
    updatedAt: '2024-01-15T11:00:00Z',
  },
]

describe('ClassManagementModal', () => {
  const mockOnCreateClass = jest.fn()
  const mockOnUpdateClass = jest.fn()
  const mockOnDeleteClass = jest.fn()
  const mockOnViewFinalComments = jest.fn()
  const mockCheckFinalCommentsCount = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should not render when isOpen is false', () => {
      render(
        <ClassManagementModal
          isOpen={false}
          entityData={mockSubject}
          classes={mockClasses}
          onCreateClass={mockOnCreateClass}
          onUpdateClass={mockOnUpdateClass}
          onDeleteClass={mockOnDeleteClass}
          loading={false}
          error={null}
        />,
      )

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('should render when isOpen is true', () => {
      render(
        <ClassManagementModal
          isOpen={true}
          entityData={mockSubject}
          classes={mockClasses}
          onCreateClass={mockOnCreateClass}
          onUpdateClass={mockOnUpdateClass}
          onDeleteClass={mockOnDeleteClass}
          loading={false}
          error={null}
        />,
      )

      expect(screen.getByRole('dialog')).toBeInTheDocument()
      // US-MODAL-STYLE-001 AC1: Modal title removed, check for panel content instead
      expect(screen.getByRole('heading', { name: /Select a Class/i })).toBeInTheDocument()
    })

    it('should display loading spinner when loading', () => {
      render(
        <ClassManagementModal
          isOpen={true}
          entityData={mockSubject}
          classes={[]}
          onCreateClass={mockOnCreateClass}
          onUpdateClass={mockOnUpdateClass}
          onDeleteClass={mockOnDeleteClass}
          loading={true}
          error={null}
        />,
      )

      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
    })

    it('should display error message when error exists', () => {
      render(
        <ClassManagementModal
          isOpen={true}
          entityData={mockSubject}
          classes={[]}
          onCreateClass={mockOnCreateClass}
          onUpdateClass={mockOnUpdateClass}
          onDeleteClass={mockOnDeleteClass}
          loading={false}
          error="Failed to load classes"
        />,
      )

      expect(screen.getByText(/Failed to load classes/i)).toBeInTheDocument()
    })
  })

  describe('Class Dropdown', () => {
    it('should display dropdown with all classes', () => {
      render(
        <ClassManagementModal
          isOpen={true}
          entityData={mockSubject}
          classes={mockClasses}
          onCreateClass={mockOnCreateClass}
          onUpdateClass={mockOnUpdateClass}
          onDeleteClass={mockOnDeleteClass}
          loading={false}
          error={null}
        />,
      )

      const dropdown = screen.getByLabelText(/Select a class/i)
      expect(dropdown).toBeInTheDocument()
    })

    it('should show empty state when no classes exist', () => {
      render(
        <ClassManagementModal
          isOpen={true}
          entityData={mockSubject}
          classes={[]}
          onCreateClass={mockOnCreateClass}
          onUpdateClass={mockOnUpdateClass}
          onDeleteClass={mockOnDeleteClass}
          loading={false}
          error={null}
        />,
      )

      expect(screen.getByText(/No classes yet/i)).toBeInTheDocument()
    })
  })

  describe('Create Class', () => {
    it('should render create form fields', () => {
      render(
        <ClassManagementModal
          isOpen={true}
          entityData={mockSubject}
          classes={[]}
          onCreateClass={mockOnCreateClass}
          onUpdateClass={mockOnUpdateClass}
          onDeleteClass={mockOnDeleteClass}
          loading={false}
          error={null}
        />,
      )

      expect(screen.getByLabelText(/Class Name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Year/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Add Class/i })).toBeInTheDocument()
    })

    it('should create a new class successfully', async () => {
      mockOnCreateClass.mockResolvedValueOnce(undefined)

      render(
        <ClassManagementModal
          isOpen={true}
          entityData={mockSubject}
          classes={[]}
          onCreateClass={mockOnCreateClass}
          onUpdateClass={mockOnUpdateClass}
          onDeleteClass={mockOnDeleteClass}
          loading={false}
          error={null}
        />,
      )

      const nameInput = screen.getByLabelText(/Class Name/i)
      const yearInput = screen.getByLabelText(/Year/i)
      const addButton = screen.getByRole('button', { name: /Add Class/i })

      fireEvent.change(nameInput, { target: { value: 'New Class' } })
      fireEvent.change(yearInput, { target: { value: '2024' } })
      fireEvent.click(addButton)

      await waitFor(() => {
        expect(mockOnCreateClass).toHaveBeenCalledWith({
          subjectId: 1,
          name: 'New Class',
          year: 2024,
        })
      })
    })

    it('should validate class name is required', async () => {
      render(
        <ClassManagementModal
          isOpen={true}
          entityData={mockSubject}
          classes={[]}
          onCreateClass={mockOnCreateClass}
          onUpdateClass={mockOnUpdateClass}
          onDeleteClass={mockOnDeleteClass}
          loading={false}
          error={null}
        />,
      )

      const addButton = screen.getByRole('button', { name: /Add Class/i })
      fireEvent.click(addButton)

      await waitFor(() => {
        expect(screen.getByText(/Class name is required/i)).toBeInTheDocument()
      })
    })

    it('should validate year is within range', async () => {
      render(
        <ClassManagementModal
          isOpen={true}
          entityData={mockSubject}
          classes={[]}
          onCreateClass={mockOnCreateClass}
          onUpdateClass={mockOnUpdateClass}
          onDeleteClass={mockOnDeleteClass}
          loading={false}
          error={null}
        />,
      )

      const nameInput = screen.getByLabelText(/Class Name/i)
      const yearInput = screen.getByLabelText(/Year/i)
      const addButton = screen.getByRole('button', { name: /Add Class/i })

      fireEvent.change(nameInput, { target: { value: 'Test Class' } })
      fireEvent.change(yearInput, { target: { value: '1999' } })
      fireEvent.click(addButton)

      await waitFor(() => {
        expect(screen.getByText(/Year must be between 2000 and 2099/i)).toBeInTheDocument()
      })
    })
  })

  describe('Edit Class', () => {
    it('should populate edit form when class is selected', async () => {
      render(
        <ClassManagementModal
          isOpen={true}
          entityData={mockSubject}
          classes={mockClasses}
          onCreateClass={mockOnCreateClass}
          onUpdateClass={mockOnUpdateClass}
          onDeleteClass={mockOnDeleteClass}
          loading={false}
          error={null}
        />,
      )

      const dropdown = screen.getByLabelText(/Select a class/i)
      fireEvent.change(dropdown, { target: { value: '1' } })

      await waitFor(() => {
        const nameInput = screen.getByDisplayValue('Advanced Section')
        expect(nameInput).toBeInTheDocument()
      })
    })

    it('should update an existing class successfully', async () => {
      mockOnUpdateClass.mockResolvedValueOnce(undefined)

      render(
        <ClassManagementModal
          isOpen={true}
          entityData={mockSubject}
          classes={mockClasses}
          onCreateClass={mockOnCreateClass}
          onUpdateClass={mockOnUpdateClass}
          onDeleteClass={mockOnDeleteClass}
          loading={false}
          error={null}
        />,
      )

      // Select a class
      const dropdown = screen.getByLabelText(/Select a class/i)
      fireEvent.change(dropdown, { target: { value: '1' } })

      await waitFor(() => {
        expect(screen.getByDisplayValue('Advanced Section')).toBeInTheDocument()
      })

      // Update the class
      const nameInput = screen.getByLabelText(/Class Name/i)
      fireEvent.change(nameInput, { target: { value: 'Updated Section' } })

      const updateButton = screen.getByRole('button', { name: /Update Class/i })
      fireEvent.click(updateButton)

      await waitFor(() => {
        expect(mockOnUpdateClass).toHaveBeenCalledWith(1, {
          name: 'Updated Section',
          year: 2024,
        })
      })
    })
  })

  describe('Delete Class', () => {
    it('should show delete confirmation dialog', async () => {
      render(
        <ClassManagementModal
          isOpen={true}
          entityData={mockSubject}
          classes={mockClasses}
          onCreateClass={mockOnCreateClass}
          onUpdateClass={mockOnUpdateClass}
          onDeleteClass={mockOnDeleteClass}
          loading={false}
          error={null}
        />,
      )

      // Select a class
      const dropdown = screen.getByLabelText(/Select a class/i)
      fireEvent.change(dropdown, { target: { value: '1' } })

      await waitFor(() => {
        const deleteButton = screen.getByRole('button', { name: /Delete Class/i })
        fireEvent.click(deleteButton)
      })

      expect(screen.getByText(/Are you sure you want to delete this class/i)).toBeInTheDocument()
    })

    it('should delete class when confirmed', async () => {
      mockOnDeleteClass.mockResolvedValueOnce(undefined)

      render(
        <ClassManagementModal
          isOpen={true}
          entityData={mockSubject}
          classes={mockClasses}
          onCreateClass={mockOnCreateClass}
          onUpdateClass={mockOnUpdateClass}
          onDeleteClass={mockOnDeleteClass}
          loading={false}
          error={null}
        />,
      )

      // Select a class
      const dropdown = screen.getByLabelText(/Select a class/i)
      fireEvent.change(dropdown, { target: { value: '1' } })

      await waitFor(() => {
        const deleteButton = screen.getByRole('button', { name: /Delete Class/i })
        fireEvent.click(deleteButton)
      })

      // Confirm deletion (get all Delete buttons and choose the confirmation one)
      const deleteButtons = screen.getAllByRole('button', { name: /^Delete$/i })
      const confirmButton = deleteButtons[deleteButtons.length - 1] // The confirmation button is the last one
      fireEvent.click(confirmButton)

      await waitFor(() => {
        expect(mockOnDeleteClass).toHaveBeenCalledWith(1)
      })
    })

    // US-DELETE-CONFIRM-003: Cascading delete warning
    it('should check for final comments count when delete button is clicked (AC1)', async () => {
      mockCheckFinalCommentsCount.mockResolvedValue(0)

      render(
        <ClassManagementModal
          isOpen={true}
          entityData={mockSubject}
          classes={mockClasses}
          onCreateClass={mockOnCreateClass}
          onUpdateClass={mockOnUpdateClass}
          onDeleteClass={mockOnDeleteClass}
          checkFinalCommentsCount={mockCheckFinalCommentsCount}
          loading={false}
          error={null}
        />,
      )

      // Select a class
      const dropdown = screen.getByLabelText(/Select a class/i)
      fireEvent.change(dropdown, { target: { value: '1' } })

      await waitFor(async () => {
        const deleteButton = screen.getByRole('button', { name: /Delete Class/i })
        fireEvent.click(deleteButton)
      })

      await waitFor(() => {
        expect(mockCheckFinalCommentsCount).toHaveBeenCalledWith(1)
      })
    })

    it('should show cascading delete warning when class has final comments (AC5)', async () => {
      mockCheckFinalCommentsCount.mockResolvedValue(3)

      render(
        <ClassManagementModal
          isOpen={true}
          entityData={mockSubject}
          classes={mockClasses}
          onCreateClass={mockOnCreateClass}
          onUpdateClass={mockOnUpdateClass}
          onDeleteClass={mockOnDeleteClass}
          checkFinalCommentsCount={mockCheckFinalCommentsCount}
          loading={false}
          error={null}
        />,
      )

      // Select a class
      const dropdown = screen.getByLabelText(/Select a class/i)
      fireEvent.change(dropdown, { target: { value: '1' } })

      // Click delete button and wait for async check to complete
      const deleteButton = await screen.findByRole('button', { name: /Delete Class/i })
      fireEvent.click(deleteButton)

      // Wait for modal to open and warning to appear (after async check)
      await waitFor(() => {
        expect(screen.getByText(/⚠️ This class has 3 final comment\(s\) that will also be deleted/i)).toBeInTheDocument()
      }, { timeout: 3000 })
    })

    it('should NOT show cascading warning when class has no final comments (AC5)', async () => {
      mockCheckFinalCommentsCount.mockResolvedValue(0)

      render(
        <ClassManagementModal
          isOpen={true}
          entityData={mockSubject}
          classes={mockClasses}
          onCreateClass={mockOnCreateClass}
          onUpdateClass={mockOnUpdateClass}
          onDeleteClass={mockOnDeleteClass}
          checkFinalCommentsCount={mockCheckFinalCommentsCount}
          loading={false}
          error={null}
        />,
      )

      // Select a class
      const dropdown = screen.getByLabelText(/Select a class/i)
      fireEvent.change(dropdown, { target: { value: '1' } })

      // Click delete button and wait for async check to complete
      const deleteButton = await screen.findByRole('button', { name: /Delete Class/i })
      fireEvent.click(deleteButton)

      // Wait for modal to open (after async check)
      await waitFor(() => {
        expect(screen.getByText(/Delete Class/)).toBeInTheDocument()
      }, { timeout: 3000 })

      // Verify no cascading warning appears
      expect(screen.queryByText(/will also be deleted/i)).not.toBeInTheDocument()
    })

    it('should show class name and year in confirmation modal (AC4)', async () => {
      mockCheckFinalCommentsCount.mockResolvedValue(0)

      render(
        <ClassManagementModal
          isOpen={true}
          entityData={mockSubject}
          classes={mockClasses}
          onCreateClass={mockOnCreateClass}
          onUpdateClass={mockOnUpdateClass}
          onDeleteClass={mockOnDeleteClass}
          checkFinalCommentsCount={mockCheckFinalCommentsCount}
          loading={false}
          error={null}
        />,
      )

      // Select a class
      const dropdown = screen.getByLabelText(/Select a class/i)
      fireEvent.change(dropdown, { target: { value: '1' } })

      await waitFor(async () => {
        const deleteButton = screen.getByRole('button', { name: /Delete Class/i })
        fireEvent.click(deleteButton)
      })

      await waitFor(() => {
        expect(screen.getByText(/Advanced Section 2024/)).toBeInTheDocument()
      })
    })
  })

  describe('Final Comments Button (US-FINAL-001)', () => {
    it('should display Final Comments button when class is selected and onViewFinalComments is provided', async () => {
      render(
        <ClassManagementModal
          isOpen={true}
          entityData={mockSubject}
          classes={mockClasses}
          onCreateClass={mockOnCreateClass}
          onUpdateClass={mockOnUpdateClass}
          onDeleteClass={mockOnDeleteClass}
          onViewFinalComments={mockOnViewFinalComments}
          loading={false}
          error={null}
        />,
      )

      // Select a class
      const dropdown = screen.getByLabelText(/Select a class/i)
      fireEvent.change(dropdown, { target: { value: '1' } })

      // US-CLASS-TABS-001: Now a tab instead of button
      await waitFor(() => {
        expect(screen.getByRole('tab', { name: /Final Comments/i })).toBeInTheDocument()
      })
    })

    it('should NOT display Final Comments tab when no class is selected', () => {
      render(
        <ClassManagementModal
          isOpen={true}
          entityData={mockSubject}
          classes={mockClasses}
          onCreateClass={mockOnCreateClass}
          onUpdateClass={mockOnUpdateClass}
          onDeleteClass={mockOnDeleteClass}
          onViewFinalComments={mockOnViewFinalComments}
          loading={false}
          error={null}
        />,
      )

      // US-CLASS-TABS-001: Now a tab instead of button
      expect(screen.queryByRole('tab', { name: /Final Comments/i })).not.toBeInTheDocument()
    })

    it('should call onViewFinalComments with class data when Final Comments tab clicked', async () => {
      render(
        <ClassManagementModal
          isOpen={true}
          entityData={mockSubject}
          classes={mockClasses}
          onCreateClass={mockOnCreateClass}
          onUpdateClass={mockOnUpdateClass}
          onDeleteClass={mockOnDeleteClass}
          onViewFinalComments={mockOnViewFinalComments}
          loading={false}
          error={null}
        />,
      )

      // Select a class
      const dropdown = screen.getByLabelText(/Select a class/i)
      fireEvent.change(dropdown, { target: { value: '1' } })

      // US-CLASS-TABS-001: Click the Final Comments tab
      await waitFor(() => {
        const finalCommentsTab = screen.getByRole('tab', { name: /Final Comments/i })
        fireEvent.click(finalCommentsTab)
      })

      expect(mockOnViewFinalComments).toHaveBeenCalledWith(mockClasses[0])
    })

    it('should NOT display Final Comments tab when onViewFinalComments is not provided', async () => {
      render(
        <ClassManagementModal
          isOpen={true}
          entityData={mockSubject}
          classes={mockClasses}
          onCreateClass={mockOnCreateClass}
          onUpdateClass={mockOnUpdateClass}
          onDeleteClass={mockOnDeleteClass}
          loading={false}
          error={null}
        />,
      )

      // Select a class
      const dropdown = screen.getByLabelText(/Select a class/i)
      fireEvent.change(dropdown, { target: { value: '1' } })

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Update Class/i })).toBeInTheDocument()
      })

      // US-CLASS-TABS-001: Final Comments tab should not appear without callback
      expect(screen.queryByRole('tab', { name: /Final Comments/i })).not.toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(
        <ClassManagementModal
          isOpen={true}
          entityData={mockSubject}
          classes={mockClasses}
          onCreateClass={mockOnCreateClass}
          onUpdateClass={mockOnUpdateClass}
          onDeleteClass={mockOnDeleteClass}
          loading={false}
          error={null}
        />,
      )

      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveAttribute('aria-modal', 'true')
      expect(dialog).toHaveAttribute('aria-label', 'Class Management')
      expect(screen.getByLabelText(/Select a class/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Class Name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Year/i)).toBeInTheDocument()
    })

    // US-MODAL-STYLE-001 AC2: Close button removed when embedded in tab panels
    it('should NOT have close button when embedded', () => {
      render(
        <ClassManagementModal
          isOpen={true}
          entityData={mockSubject}
          classes={mockClasses}
          onCreateClass={mockOnCreateClass}
          onUpdateClass={mockOnUpdateClass}
          onDeleteClass={mockOnDeleteClass}
          loading={false}
          error={null}
        />,
      )

      const closeButton = screen.queryByLabelText(/Close modal/i)
      expect(closeButton).not.toBeInTheDocument()
    })
  })

  describe('US-CLASS-TABS-001: Tab Group Display', () => {
    // TDD RED PHASE: These tests should FAIL before implementation

    it('should display tab group when a class is selected (AC1)', () => {
      render(
        <ClassManagementModal
          isOpen={true}
          entityData={mockSubject}
          classes={mockClasses}
          onCreateClass={mockOnCreateClass}
          onUpdateClass={mockOnUpdateClass}
          onDeleteClass={mockOnDeleteClass}
          onViewFinalComments={mockOnViewFinalComments}
          loading={false}
          error={null}
        />,
      )

      // Select a class from dropdown
      const dropdown = screen.getByLabelText(/Select a class/i)
      fireEvent.change(dropdown, { target: { value: '1' } })

      // Tab group should appear with both tabs
      expect(screen.getByRole('tablist')).toBeInTheDocument()
      expect(screen.getByRole('tab', { name: /Edit Class/i })).toBeInTheDocument()
      expect(screen.getByRole('tab', { name: /Final Comments/i })).toBeInTheDocument()

      // "Edit Class" tab should be selected by default
      expect(screen.getByRole('tab', { name: /Edit Class/i })).toHaveAttribute('aria-selected', 'true')
      expect(screen.getByRole('tab', { name: /Final Comments/i })).toHaveAttribute('aria-selected', 'false')
    })

    it('should NOT display tab group when no class is selected (AC2)', () => {
      render(
        <ClassManagementModal
          isOpen={true}
          entityData={mockSubject}
          classes={mockClasses}
          onCreateClass={mockOnCreateClass}
          onUpdateClass={mockOnUpdateClass}
          onDeleteClass={mockOnDeleteClass}
          loading={false}
          error={null}
        />,
      )

      // No class selected (default state)
      // Tab group should NOT be present
      expect(screen.queryByRole('tablist')).not.toBeInTheDocument()

      // "Add New Class" form should be shown instead
      expect(screen.getByText(/Add New Class/i)).toBeInTheDocument()
    })
  })
})
