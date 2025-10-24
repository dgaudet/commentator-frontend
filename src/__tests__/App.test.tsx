/**
 * App Component Tests
 * Validates testing infrastructure and basic rendering
 * Includes integration tests for Edit/Delete flows
 */
import { render, screen, waitFor, fireEvent, act } from '../test-utils'
import { cleanup } from '@testing-library/react'
import App from '../App'
import * as classService from '../services/api/classService'

// Mock the classService to avoid real API calls
jest.mock('../services/api/classService', () => ({
  classService: {
    getAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}))

const mockClasses = [
  {
    id: 1,
    name: 'Mathematics 101',
    year: 2024,
    createdAt: '2024-01-15T10:00:00.000Z',
    updatedAt: '2024-01-15T10:00:00.000Z',
  },
  {
    id: 2,
    name: 'English 201',
    year: 2024,
    createdAt: '2024-01-16T10:00:00.000Z',
    updatedAt: '2024-01-16T10:00:00.000Z',
  },
]

const mockClassService = classService.classService as jest.Mocked<typeof classService.classService>

describe('App', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks()

    // Default mock implementations
    mockClassService.getAll.mockResolvedValue([])
    mockClassService.create.mockResolvedValue(mockClasses[0])
    mockClassService.update.mockResolvedValue(mockClasses[0])
    mockClassService.delete.mockResolvedValue({ message: 'Deleted', deletedClass: mockClasses[0] })
  })

  afterEach(() => {
    // Force cleanup between tests to reset component state
    cleanup()
  })

  it('renders without crashing', async () => {
    // Mock API to prevent network errors during component mounting
    mockClassService.getAll.mockResolvedValue([])
    
    act(() => {
      render(<App />)
    })
    await waitFor(() => {
      expect(screen.getByText(/commentator/i)).toBeInTheDocument()
    })
  })

  it('displays the application title', async () => {
    // Mock API to prevent network errors during component mounting
    mockClassService.getAll.mockResolvedValue([])
    
    act(() => {
      render(<App />)
    })
    await waitFor(() => {
      expect(screen.getByText('Commentator')).toBeInTheDocument()
    })
  })

  it('displays the subtitle', async () => {
    // Mock API to prevent network errors during component mounting
    mockClassService.getAll.mockResolvedValue([])
    
    act(() => {
      render(<App />)
    })
    await waitFor(() => {
      expect(screen.getByText('Student Report Card Comment Management')).toBeInTheDocument()
    })
  })

  it('renders the ClassList component', async () => {
    // Setup: Mock API to return classes so ClassList renders with "Your Classes" heading
    mockClassService.getAll.mockResolvedValue(mockClasses)
    
    act(() => {
      render(<App />)
    })

    // ClassList should render with "Your Classes" heading (not EmptyState)
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /your classes/i })).toBeInTheDocument()
    })
  })

  it('allows users to interact with class management features', async () => {
    // Setup: Mock API to return classes so ClassList shows "Add Class" button
    mockClassService.getAll.mockResolvedValue(mockClasses)
    
    act(() => {
      render(<App />)
    })

    // Should show "Add Class" button from ClassList (not EmptyState)
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /add class/i })).toBeInTheDocument()
    })
  })

  describe('Delete Flow Integration', () => {
    let testKey = 0

    beforeEach(() => {
      // Clear all mocks completely for this test suite
      jest.clearAllMocks()
      
      // Set up fresh mock implementations for each test
      mockClassService.create.mockResolvedValue(mockClasses[0])
      mockClassService.update.mockResolvedValue(mockClasses[0])
      mockClassService.delete.mockResolvedValue({ message: 'Deleted', deletedClass: mockClasses[0] })
      
      // Additional cleanup for this test suite
      cleanup()
      // Increment key to force component remounting
      testKey++
    })

    afterEach(() => {
      // Force cleanup after each test in this suite
      cleanup()
    })

    it('should remove class from list after successful deletion', async () => {
      // Setup: Mock API to return classes for this test
      mockClassService.getAll.mockResolvedValue([...mockClasses])

      act(() => {
        render(<App key={testKey} />)
      })

      // Wait for classes to load
      await waitFor(() => {
        expect(screen.getByText('Mathematics 101')).toBeInTheDocument()
        expect(screen.getByText('English 201')).toBeInTheDocument()
      })

      // Click delete button for Mathematics 101
      const deleteButton = screen.getByRole('button', { name: /delete mathematics 101/i })
      act(() => {
        fireEvent.click(deleteButton)
      })

      // Confirmation dialog should appear
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
        expect(screen.getByText(/are you sure you want to delete "mathematics 101"/i)).toBeInTheDocument()
      })

      // IMPORTANT: Reset the mock to simulate the updated list after deletion
      // This simulates the server returning the updated list
      mockClassService.getAll.mockResolvedValue([mockClasses[1]])

      // Confirm deletion
      const confirmButton = screen.getByRole('button', { name: /^delete$/i })
      act(() => {
        fireEvent.click(confirmButton)
      })

      // Wait for dialog to close
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })

      // Verify deleteClass API was called
      expect(mockClassService.delete).toHaveBeenCalledWith(1)
      expect(mockClassService.delete).toHaveBeenCalledTimes(1)

      // CRITICAL: Verify the class was removed from the UI
      await waitFor(() => {
        expect(screen.queryByText('Mathematics 101')).not.toBeInTheDocument()
      })

      // Verify other class is still there
      expect(screen.getByText('English 201')).toBeInTheDocument()
    })

    it('should close dialog and keep class when deletion is cancelled', async () => {
      // Setup: Mock API to return fresh classes for this test
      mockClassService.getAll.mockResolvedValue([...mockClasses])

      act(() => {
        render(<App key={testKey} />)
      })

      // Wait for classes to load
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /your classes/i })).toBeInTheDocument()
      })

      // Wait for Mathematics 101 to appear
      await waitFor(() => {
        expect(screen.getByText('Mathematics 101')).toBeInTheDocument()
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

      // Verify deleteClass API was NOT called
      expect(mockClassService.delete).not.toHaveBeenCalled()

      // Verify class is still in the list
      expect(screen.getByText('Mathematics 101')).toBeInTheDocument()
    })

    it('should handle delete errors gracefully', async () => {
      // Setup: Mock API to return fresh classes for this test
      mockClassService.getAll.mockResolvedValue([...mockClasses])
      // Mock delete to fail
      mockClassService.delete.mockRejectedValueOnce(new Error('Delete failed'))

      act(() => {
        render(<App key={testKey} />)
      })

      // Wait for classes to load
      await waitFor(() => {
        expect(screen.getByText('Mathematics 101')).toBeInTheDocument()
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
      const confirmButton = screen.getByRole('button', { name: /^Delete$/i })
      act(() => {
        fireEvent.click(confirmButton)
      })

      // Dialog should close
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })

      // Class should still be in list (delete failed)
      expect(screen.getByText('Mathematics 101')).toBeInTheDocument()
    })
  })

  describe('outcome comments modal', () => {
    it('should show outcome comments modal when outcome comments button clicked', async () => {
      // Setup: Mock classes data
      mockClassService.getAll.mockResolvedValue(mockClasses)

      render(<App />)

      // Wait for classes to load
      await waitFor(() => {
        expect(screen.getByText('Mathematics 101')).toBeInTheDocument()
      })

      // Find and click the outcome comments button
      const outcomeCommentsButton = screen.getByRole('button', { name: /outcome comments for mathematics 101/i })
      fireEvent.click(outcomeCommentsButton)

      // Modal should be visible
      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(screen.getByText('Outcome Comments - Mathematics 101')).toBeInTheDocument()
    })

    it('should close outcome comments modal when close button clicked', async () => {
      // Setup: Mock classes data
      mockClassService.getAll.mockResolvedValue(mockClasses)

      render(<App />)

      // Wait for classes to load
      await waitFor(() => {
        expect(screen.getByText('Mathematics 101')).toBeInTheDocument()
      })

      // Open modal
      const outcomeCommentsButton = screen.getByRole('button', { name: /outcome comments for mathematics 101/i })
      fireEvent.click(outcomeCommentsButton)

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
