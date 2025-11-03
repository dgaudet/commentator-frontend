/**
 * App Component Tests
 * Validates testing infrastructure and basic rendering
 * Includes integration tests for Edit/Delete flows
 * Updated to use Subject instead of Class
 */
import { render, screen, waitFor, fireEvent, act } from '../test-utils'
import { cleanup } from '@testing-library/react'
import App from '../App'
import * as subjectService from '../services/api/subjectService'

// Mock the subjectService to avoid real API calls
jest.mock('../services/api/subjectService', () => ({
  subjectService: {
    getAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}))

const mockSubjects = [
  {
    id: 1,
    name: 'Mathematics 101',
    createdAt: '2024-01-15T10:00:00.000Z',
    updatedAt: '2024-01-15T10:00:00.000Z',
  },
  {
    id: 2,
    name: 'English 201',
    createdAt: '2024-01-16T10:00:00.000Z',
    updatedAt: '2024-01-16T10:00:00.000Z',
  },
]

const mockSubjectService = subjectService.subjectService as jest.Mocked<typeof subjectService.subjectService>

describe('App', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks()

    // Default mock implementations
    mockSubjectService.getAll.mockResolvedValue([])
    mockSubjectService.create.mockResolvedValue(mockSubjects[0])
    mockSubjectService.update.mockResolvedValue(mockSubjects[0])
    mockSubjectService.delete.mockResolvedValue({ message: 'Deleted', deletedSubject: mockSubjects[0] })
  })

  afterEach(() => {
    // Force cleanup between tests to reset component state
    cleanup()
  })

  it('renders without crashing', async () => {
    // Mock API to prevent network errors during component mounting
    mockSubjectService.getAll.mockResolvedValue([])

    act(() => {
      render(<App />)
    })
    await waitFor(() => {
      expect(screen.getByText(/commentator/i)).toBeInTheDocument()
    })
  })

  it('displays the application title', async () => {
    // Mock API to prevent network errors during component mounting
    mockSubjectService.getAll.mockResolvedValue([])

    act(() => {
      render(<App />)
    })
    await waitFor(() => {
      expect(screen.getByText('Commentator')).toBeInTheDocument()
    })
  })

  it('displays the subtitle', async () => {
    // Mock API to prevent network errors during component mounting
    mockSubjectService.getAll.mockResolvedValue([])

    act(() => {
      render(<App />)
    })
    await waitFor(() => {
      expect(screen.getByText('Student Report Card Comment Management')).toBeInTheDocument()
    })
  })

  it('renders the SubjectList component', async () => {
    // Setup: Mock API to return subjects soClassList renders with "Your Classes" heading
    mockSubjectService.getAll.mockResolvedValue(mockSubjects)

    act(() => {
      render(<App />)
    })

    // ClassList should render with "Your Classes" heading (not EmptyState)
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /your subjects/i })).toBeInTheDocument()
    })
  })

  it('allows users to interact with subject management features', async () => {
    // Setup: Mock API to return subjects soClassList shows "Add Class" button
    mockSubjectService.getAll.mockResolvedValue(mockSubjects)

    act(() => {
      render(<App />)
    })

    // Should show "Add Class" button from ClassList (not EmptyState)
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /add subject/i })).toBeInTheDocument()
    })
  })

  describe('Delete Flow Integration', () => {
    let testKey = 0

    beforeEach(() => {
      // Clear all mocks completely for this test suite
      jest.clearAllMocks()

      // Set up fresh mock implementations for each test
      mockSubjectService.create.mockResolvedValue(mockSubjects[0])
      mockSubjectService.update.mockResolvedValue(mockSubjects[0])
      mockSubjectService.delete.mockResolvedValue({ message: 'Deleted', deletedSubject: mockSubjects[0] })

      // Additional cleanup for this test suite
      cleanup()
      // Increment key to force component remounting
      testKey++
    })

    afterEach(() => {
      // Force cleanup after each test in this suite
      cleanup()
    })

    it('should remove subject from list after successful deletion', async () => {
      // Setup: Mock API to return classes for this test
      mockSubjectService.getAll.mockResolvedValue([...mockSubjects])

      act(() => {
        render(<App key={testKey} />)
      })

      // Wait for subjects to load in dropdown
      await waitFor(() => {
        const dropdown = screen.getByRole('combobox', { name: /select a subject to view/i })
        expect(dropdown).toBeInTheDocument()
      })

      // Select Mathematics 101 from dropdown to display the SubjectListItem
      const dropdown = screen.getByRole('combobox', { name: /select a subject to view/i })
      act(() => {
        fireEvent.change(dropdown, { target: { value: '1' } })
      })

      // Wait for SubjectListItem to render
      await waitFor(() => {
        expect(screen.getByTestId('subject-item-1')).toBeInTheDocument()
      })

      // Click delete button for Mathematics 101
      const deleteButton = screen.getByRole('button', { name: /delete mathematics 101/i })
      act(() => {
        fireEvent.click(deleteButton)
      })

      // Confirmation dialog should appear
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
        expect(screen.getByText(/are you sure you want to delete 'mathematics 101'/i)).toBeInTheDocument()
      })

      // IMPORTANT: Reset the mock to simulate the updated list after deletion
      // This simulates the server returning the updated list
      mockSubjectService.getAll.mockResolvedValue([mockSubjects[1]])

      // Confirm deletion
      const confirmButton = screen.getByRole('button', { name: /^delete$/i })
      act(() => {
        fireEvent.click(confirmButton)
      })

      // Wait for dialog to close
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })

      // Verify deleteSubject API was called
      expect(mockSubjectService.delete).toHaveBeenCalledWith(1)
      expect(mockSubjectService.delete).toHaveBeenCalledTimes(1)

      // CRITICAL: Verify the subjectwas removed from the dropdown options
      await waitFor(() => {
        const updatedDropdown = screen.getByRole('combobox', { name: /select a subject to view/i })
        const mathOption = Array.from(updatedDropdown.querySelectorAll('option')).find(
          option => option.textContent?.includes('Mathematics 101'),
        )
        expect(mathOption).toBeUndefined()
      })

      // Verify other class is still in dropdown
      const englishOption = Array.from(dropdown.querySelectorAll('option')).find(
        option => option.textContent?.includes('English 201'),
      )
      expect(englishOption).toBeDefined()
    })

    it('should close dialog and keep subject when deletion is cancelled', async () => {
      // Setup: Mock API to return fresh classes for this test
      mockSubjectService.getAll.mockResolvedValue([...mockSubjects])

      act(() => {
        render(<App key={testKey} />)
      })

      // Wait for subjects to load
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /your subjects/i })).toBeInTheDocument()
      })

      // Select Mathematics 101 from dropdown
      const dropdown = screen.getByRole('combobox', { name: /select a subject to view/i })
      act(() => {
        fireEvent.change(dropdown, { target: { value: '1' } })
      })

      // Wait for SubjectListItem to render
      await waitFor(() => {
        expect(screen.getByTestId('subject-item-1')).toBeInTheDocument()
      })

      // Click delete button
      const deleteButton = screen.getByRole('button', { name: /delete mathematics 101/i })
      act(() => {
        fireEvent.click(deleteButton)
      })

      // Confirmation dialog should appear
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })

      // Cancel deletion
      const cancelButton = screen.getByRole('button', { name: /cancel/i })
      act(() => {
        fireEvent.click(cancelButton)
      })

      // Dialog should close
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })

      // Verify deleteSubject API was NOT called
      expect(mockSubjectService.delete).not.toHaveBeenCalled()

      // Verify subject is still in the SubjectListItem
      expect(screen.getByTestId('subject-item-1')).toBeInTheDocument()
    })

    it('should handle delete errors gracefully', async () => {
      // Setup: Mock API to return fresh classes for this test
      mockSubjectService.getAll.mockResolvedValue([...mockSubjects])
      // Mock delete to fail
      mockSubjectService.delete.mockRejectedValueOnce(new Error('Delete failed'))

      act(() => {
        render(<App key={testKey} />)
      })

      // Wait for dropdown to load
      await waitFor(() => {
        const dropdown = screen.getByRole('combobox', { name: /select a subject to view/i })
        expect(dropdown).toBeInTheDocument()
      })

      // Select Mathematics 101 from dropdown
      const dropdown = screen.getByRole('combobox', { name: /select a subject to view/i })
      act(() => {
        fireEvent.change(dropdown, { target: { value: '1' } })
      })

      // Wait for SubjectListItem to render
      await waitFor(() => {
        expect(screen.getByTestId('subject-item-1')).toBeInTheDocument()
      })

      // Click delete button
      const deleteButton = screen.getByRole('button', { name: /delete mathematics 101/i })
      act(() => {
        fireEvent.click(deleteButton)
      })

      // Wait for dialog
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })

      // Confirm deletion
      const confirmButton = screen.getByRole('button', { name: /^delete$/i })
      act(() => {
        fireEvent.click(confirmButton)
      })

      // Wait for loading state to finish
      await waitFor(() => {
        expect(screen.queryByText(/deleting/i)).not.toBeInTheDocument()
      })

      // Dialog should STAY OPEN on error (US-SUBJ-DELETE-002 AC6: allow retry)
      expect(screen.getByRole('dialog')).toBeInTheDocument()

      // Subject should still be in SubjectListItem (delete failed)
      expect(screen.getByTestId('subject-item-1')).toBeInTheDocument()

      // Error message should be displayed
      await waitFor(() => {
        expect(screen.getByText(/delete failed/i)).toBeInTheDocument()
      })
    })
  })

  describe('outcome comments modal', () => {
    it('should show outcome comments modal when outcome comments button clicked', async () => {
      // Setup: Mock classes data
      mockSubjectService.getAll.mockResolvedValue(mockSubjects)

      render(<App />)

      // Wait for dropdown to appear and select Mathematics 101
      await waitFor(() => {
        const dropdown = screen.getByRole('combobox', { name: /select a subject to view/i })
        expect(dropdown).toBeInTheDocument()
      })

      const dropdown = screen.getByRole('combobox', { name: /select a subject to view/i })
      fireEvent.change(dropdown, { target: { value: '1' } })

      // Wait for SubjectListItem to render
      await waitFor(() => {
        expect(screen.getByTestId('subject-item-1')).toBeInTheDocument()
      })

      // Find and click the outcome comments tab (US-TAB-002)
      const outcomeCommentsTab = screen.getByRole('tab', { name: 'Outcome Comments' })
      fireEvent.click(outcomeCommentsTab)

      // Modal should be visible
      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(screen.getByText('Outcome Comments - Mathematics 101')).toBeInTheDocument()
    })

    it('should close outcome comments modal when close button clicked', async () => {
      // Setup: Mock classes data
      mockSubjectService.getAll.mockResolvedValue(mockSubjects)

      render(<App />)

      // Wait for dropdown to appear
      await waitFor(() => {
        const dropdown = screen.getByRole('combobox', { name: /select a subject to view/i })
        expect(dropdown).toBeInTheDocument()
      })

      // Select Mathematics 101 from dropdown
      const dropdown = screen.getByRole('combobox', { name: /select a subject to view/i })
      fireEvent.change(dropdown, { target: { value: '1' } })

      // Wait for SubjectListItem to render
      await waitFor(() => {
        expect(screen.getByTestId('subject-item-1')).toBeInTheDocument()
      })

      // Open modal using tab (US-TAB-002)
      const outcomeCommentsTab = screen.getByRole('tab', { name: 'Outcome Comments' })
      fireEvent.click(outcomeCommentsTab)

      // Modal should be visible
      expect(screen.getByRole('dialog')).toBeInTheDocument()

      // Close modal
      const closeButton = screen.getByRole('button', { name: /close/i })
      fireEvent.click(closeButton)

      // Modal should be closed
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })
})
