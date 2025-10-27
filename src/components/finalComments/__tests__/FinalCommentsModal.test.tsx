/**
 * FinalCommentsModal Component Tests
 * TDD Phase: GREEN - All tests passing
 * Reference: US-FINAL-001 (Modal opens from Final Comments button)
 *           US-FINAL-002 (View list of final comments)
 *           US-FINAL-003 (Create new final comment)
 *
 * Comprehensive test suite covering all MVP functionality
 */
import { render, screen, fireEvent, waitFor } from '../../../test-utils'
import { FinalCommentsModal } from '../FinalCommentsModal'
import type { Class, FinalComment } from '../../../types'

const mockClass: Class = {
  id: 1,
  name: 'Grade 10 Math',
  year: 2024,
  subjectId: 5,
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-02-20T14:15:00Z',
}

const mockFinalComments: FinalComment[] = [
  {
    id: 1,
    classId: 1,
    firstName: 'John',
    lastName: 'Doe',
    grade: 85,
    comment: 'Excellent work this semester!',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 2,
    classId: 1,
    firstName: 'Alice',
    lastName: 'Smith',
    grade: 92,
    comment: 'Outstanding performance.',
    createdAt: '2024-01-16T11:00:00Z',
    updatedAt: '2024-01-16T11:00:00Z',
  },
  {
    id: 3,
    classId: 1,
    firstName: 'Bob',
    grade: 78,
    createdAt: '2024-01-17T12:00:00Z',
    updatedAt: '2024-01-17T12:00:00Z',
  },
]

describe('FinalCommentsModal - US-FINAL-001', () => {
  const mockHandlers = {
    onClose: jest.fn(),
    onCreateComment: jest.fn(),
    onUpdateComment: jest.fn(),
    onDeleteComment: jest.fn(),
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Modal Visibility', () => {
    it('should not render when isOpen is false', () => {
      render(
        <FinalCommentsModal
          isOpen={false}
          onClose={mockHandlers.onClose}
          entityData={mockClass}
          finalComments={[]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('should render when isOpen is true', () => {
      render(
        <FinalCommentsModal
          isOpen={true}
          onClose={mockHandlers.onClose}
          entityData={mockClass}
          finalComments={[]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
  })

  describe('Modal Header (AC 4: Class name in title)', () => {
    it('should display class name in modal title', () => {
      render(
        <FinalCommentsModal
          isOpen={true}
          onClose={mockHandlers.onClose}
          entityData={mockClass}
          finalComments={[]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )
      expect(screen.getByText(/Final Comments - Grade 10 Math/i)).toBeInTheDocument()
    })

    it('should have close button', () => {
      render(
        <FinalCommentsModal
          isOpen={true}
          onClose={mockHandlers.onClose}
          entityData={mockClass}
          finalComments={[]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )
      const closeButton = screen.getByRole('button', { name: /close modal/i })
      expect(closeButton).toBeInTheDocument()
    })
  })

  describe('Accessibility (AC 1-4)', () => {
    it('should have proper ARIA attributes', () => {
      render(
        <FinalCommentsModal
          isOpen={true}
          onClose={mockHandlers.onClose}
          entityData={mockClass}
          finalComments={[]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )
      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title')
      expect(dialog).toHaveAttribute('aria-modal', 'true')
    })
  })
})

describe('FinalCommentsModal - US-FINAL-002: View List', () => {
  const mockHandlers = {
    onClose: jest.fn(),
    onCreateComment: jest.fn(),
    onUpdateComment: jest.fn(),
    onDeleteComment: jest.fn(),
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Loading State (AC 5)', () => {
    it('should display loading spinner while fetching data', () => {
      render(
        <FinalCommentsModal
          isOpen={true}
          onClose={mockHandlers.onClose}
          entityData={mockClass}
          finalComments={[]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={true}
          error={null}
        />,
      )
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
    })

    it('should not display list content while loading', () => {
      render(
        <FinalCommentsModal
          isOpen={true}
          onClose={mockHandlers.onClose}
          entityData={mockClass}
          finalComments={mockFinalComments}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={true}
          error={null}
        />,
      )
      expect(screen.queryByText(/John Doe/i)).not.toBeInTheDocument()
    })
  })

  describe('Error State (AC 6)', () => {
    it('should display error message when fetch fails', () => {
      render(
        <FinalCommentsModal
          isOpen={true}
          onClose={mockHandlers.onClose}
          entityData={mockClass}
          finalComments={[]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error="Failed to fetch final comments for class"
        />,
      )
      expect(screen.getByText(/Failed to fetch final comments for class/i)).toBeInTheDocument()
    })
  })

  describe('Empty State (AC 3)', () => {
    it('should display empty state message when no final comments exist', () => {
      render(
        <FinalCommentsModal
          isOpen={true}
          onClose={mockHandlers.onClose}
          entityData={mockClass}
          finalComments={[]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )
      expect(screen.getByText(/No final comments yet for this class/i)).toBeInTheDocument()
      expect(screen.getByText(/Add your first student grade!/i)).toBeInTheDocument()
    })
  })

  describe('List Display (AC 1, 2, 7)', () => {
    it('should display list of final comments', () => {
      render(
        <FinalCommentsModal
          isOpen={true}
          onClose={mockHandlers.onClose}
          entityData={mockClass}
          finalComments={mockFinalComments}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )
      // Should display all three students
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument()
      expect(screen.getByText(/Alice Smith/i)).toBeInTheDocument()
      expect(screen.getByText(/Bob/i)).toBeInTheDocument()
    })

    it('should display student name with firstName and lastName', () => {
      render(
        <FinalCommentsModal
          isOpen={true}
          onClose={mockHandlers.onClose}
          entityData={mockClass}
          finalComments={[mockFinalComments[0]]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument()
    })

    it('should display student name with firstName only when lastName not provided', () => {
      render(
        <FinalCommentsModal
          isOpen={true}
          onClose={mockHandlers.onClose}
          entityData={mockClass}
          finalComments={[mockFinalComments[2]]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )
      expect(screen.getByText(/^Bob$/i)).toBeInTheDocument()
    })

    it('should display grade for each student', () => {
      render(
        <FinalCommentsModal
          isOpen={true}
          onClose={mockHandlers.onClose}
          entityData={mockClass}
          finalComments={mockFinalComments}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )
      expect(screen.getByText(/Grade:.*85/i)).toBeInTheDocument()
      expect(screen.getByText(/Grade:.*92/i)).toBeInTheDocument()
      expect(screen.getByText(/Grade:.*78/i)).toBeInTheDocument()
    })

    it('should display comment text when provided', () => {
      render(
        <FinalCommentsModal
          isOpen={true}
          onClose={mockHandlers.onClose}
          entityData={mockClass}
          finalComments={[mockFinalComments[0]]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )
      expect(screen.getByText(/Excellent work this semester!/i)).toBeInTheDocument()
    })

    it('should not display comment section when comment not provided', () => {
      render(
        <FinalCommentsModal
          isOpen={true}
          onClose={mockHandlers.onClose}
          entityData={mockClass}
          finalComments={[mockFinalComments[2]]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )
      // Bob has no comment
      expect(screen.queryByText(/Excellent work/i)).not.toBeInTheDocument()
    })

    it('should display created date', () => {
      render(
        <FinalCommentsModal
          isOpen={true}
          onClose={mockHandlers.onClose}
          entityData={mockClass}
          finalComments={[mockFinalComments[0]]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )
      expect(screen.getByText(/Created:/i)).toBeInTheDocument()
      expect(screen.getByText(/Jan 15, 2024/i)).toBeInTheDocument()
    })

    it('should sort final comments by firstName alphabetically (A-Z)', () => {
      render(
        <FinalCommentsModal
          isOpen={true}
          onClose={mockHandlers.onClose}
          entityData={mockClass}
          finalComments={mockFinalComments}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      const names = screen.getAllByText(/Alice Smith|Bob|John Doe/i)
      // Should be sorted: Alice, Bob, John
      expect(names[0].textContent).toContain('Alice')
      expect(names[1].textContent).toContain('Bob')
      expect(names[2].textContent).toContain('John')
    })
  })
})

describe('FinalCommentsModal - US-FINAL-003: Create New Final Comment', () => {
  const mockHandlers = {
    onClose: jest.fn(),
    onCreateComment: jest.fn(),
    onUpdateComment: jest.fn(),
    onDeleteComment: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockHandlers.onCreateComment.mockResolvedValue(undefined)
  })

  describe('Form Rendering (AC 1)', () => {
    it('should display create form with all fields', () => {
      render(
        <FinalCommentsModal
          isOpen={true}
          onClose={mockHandlers.onClose}
          entityData={mockClass}
          finalComments={[]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      expect(screen.getByLabelText(/First Name/i, { selector: 'input' })).toBeInTheDocument()
      expect(screen.getByLabelText(/Last Name/i, { selector: 'input' })).toBeInTheDocument()
      expect(screen.getByLabelText(/Grade/i, { selector: 'input' })).toBeInTheDocument()
      expect(screen.getByLabelText(/Comment/i, { selector: 'textarea' })).toBeInTheDocument()
    })

    it('should display "Add Final Comment" submit button', () => {
      render(
        <FinalCommentsModal
          isOpen={true}
          onClose={mockHandlers.onClose}
          entityData={mockClass}
          finalComments={[]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      expect(screen.getByRole('button', { name: /Add Final Comment/i })).toBeInTheDocument()
    })

    it('should mark First Name as required with asterisk', () => {
      render(
        <FinalCommentsModal
          isOpen={true}
          onClose={mockHandlers.onClose}
          entityData={mockClass}
          finalComments={[]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      const firstNameLabel = screen.getByText(/First Name/i)
      expect(firstNameLabel.textContent).toMatch(/\*/)
    })

    it('should mark Grade as required with asterisk', () => {
      render(
        <FinalCommentsModal
          isOpen={true}
          onClose={mockHandlers.onClose}
          entityData={mockClass}
          finalComments={[]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      const gradeLabel = screen.getByText(/^Grade/i)
      expect(gradeLabel.textContent).toMatch(/\*/)
    })
  })

  describe('Character Counter (AC 3.4)', () => {
    it('should display character counter for comment field', () => {
      render(
        <FinalCommentsModal
          isOpen={true}
          onClose={mockHandlers.onClose}
          entityData={mockClass}
          finalComments={[]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      expect(screen.getByText(/0\/1000 characters/i)).toBeInTheDocument()
    })

    it('should update character counter as user types', () => {
      render(
        <FinalCommentsModal
          isOpen={true}
          onClose={mockHandlers.onClose}
          entityData={mockClass}
          finalComments={[]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      const commentField = screen.getByLabelText(/Comment/i, { selector: 'textarea' })
      fireEvent.change(commentField, { target: { value: 'Great work!' } })

      expect(screen.getByText(/11\/1000 characters/i)).toBeInTheDocument()
    })
  })

  describe('Form Validation (AC 3)', () => {
    it('should show error when First Name is empty', async () => {
      render(
        <FinalCommentsModal
          isOpen={true}
          onClose={mockHandlers.onClose}
          entityData={mockClass}
          finalComments={[]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      const submitButton = screen.getByRole('button', { name: /Add Final Comment/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/First name is required/i)).toBeInTheDocument()
      })
    })

    it('should show error when Grade is empty', async () => {
      render(
        <FinalCommentsModal
          isOpen={true}
          onClose={mockHandlers.onClose}
          entityData={mockClass}
          finalComments={[]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      const firstNameField = screen.getByLabelText(/First Name/i, { selector: 'input' })
      fireEvent.change(firstNameField, { target: { value: 'John' } })

      const submitButton = screen.getByRole('button', { name: /Add Final Comment/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/Grade is required/i)).toBeInTheDocument()
      })
    })

    it('should show error when Grade is below 0', async () => {
      render(
        <FinalCommentsModal
          isOpen={true}
          onClose={mockHandlers.onClose}
          entityData={mockClass}
          finalComments={[]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      const firstNameField = screen.getByLabelText(/First Name/i, { selector: 'input' })
      const gradeField = screen.getByLabelText(/Grade/i, { selector: 'input' })

      fireEvent.change(firstNameField, { target: { value: 'John' } })
      fireEvent.change(gradeField, { target: { value: '-5' } })

      const submitButton = screen.getByRole('button', { name: /Add Final Comment/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/Grade must be between 0 and 100/i)).toBeInTheDocument()
      })
    })

    it('should show error when Grade is above 100', async () => {
      render(
        <FinalCommentsModal
          isOpen={true}
          onClose={mockHandlers.onClose}
          entityData={mockClass}
          finalComments={[]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      const firstNameField = screen.getByLabelText(/First Name/i, { selector: 'input' })
      const gradeField = screen.getByLabelText(/Grade/i, { selector: 'input' })

      fireEvent.change(firstNameField, { target: { value: 'John' } })
      fireEvent.change(gradeField, { target: { value: '105' } })

      const submitButton = screen.getByRole('button', { name: /Add Final Comment/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/Grade must be between 0 and 100/i)).toBeInTheDocument()
      })
    })

    it('should show error when Comment exceeds 1000 characters', async () => {
      render(
        <FinalCommentsModal
          isOpen={true}
          onClose={mockHandlers.onClose}
          entityData={mockClass}
          finalComments={[]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      const firstNameField = screen.getByLabelText(/First Name/i, { selector: 'input' })
      const gradeField = screen.getByLabelText(/Grade/i, { selector: 'input' })
      const commentField = screen.getByLabelText(/Comment/i, { selector: 'textarea' })

      fireEvent.change(firstNameField, { target: { value: 'John' } })
      fireEvent.change(gradeField, { target: { value: '85' } })
      fireEvent.change(commentField, { target: { value: 'a'.repeat(1001) } })

      const submitButton = screen.getByRole('button', { name: /Add Final Comment/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/Comment cannot exceed 1000 characters/i)).toBeInTheDocument()
      })
    })

    it('should NOT submit when validation errors exist', async () => {
      render(
        <FinalCommentsModal
          isOpen={true}
          onClose={mockHandlers.onClose}
          entityData={mockClass}
          finalComments={[]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      const submitButton = screen.getByRole('button', { name: /Add Final Comment/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/First name is required/i)).toBeInTheDocument()
      })

      expect(mockHandlers.onCreateComment).not.toHaveBeenCalled()
    })
  })

  describe('Successful Submission (AC 6, 7)', () => {
    it('should submit form with all fields when valid', async () => {
      render(
        <FinalCommentsModal
          isOpen={true}
          onClose={mockHandlers.onClose}
          entityData={mockClass}
          finalComments={[]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      const firstNameField = screen.getByLabelText(/First Name/i, { selector: 'input' })
      const lastNameField = screen.getByLabelText(/Last Name/i, { selector: 'input' })
      const gradeField = screen.getByLabelText(/Grade/i, { selector: 'input' })
      const commentField = screen.getByLabelText(/Comment/i, { selector: 'textarea' })

      fireEvent.change(firstNameField, { target: { value: 'John' } })
      fireEvent.change(lastNameField, { target: { value: 'Doe' } })
      fireEvent.change(gradeField, { target: { value: '85' } })
      fireEvent.change(commentField, { target: { value: 'Excellent work!' } })

      const submitButton = screen.getByRole('button', { name: /Add Final Comment/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockHandlers.onCreateComment).toHaveBeenCalledWith({
          classId: 1,
          firstName: 'John',
          lastName: 'Doe',
          grade: 85,
          comment: 'Excellent work!',
        })
      })
    })

    it('should submit form with optional fields omitted', async () => {
      render(
        <FinalCommentsModal
          isOpen={true}
          onClose={mockHandlers.onClose}
          entityData={mockClass}
          finalComments={[]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      const firstNameField = screen.getByLabelText(/First Name/i, { selector: 'input' })
      const gradeField = screen.getByLabelText(/Grade/i, { selector: 'input' })

      fireEvent.change(firstNameField, { target: { value: 'Bob' } })
      fireEvent.change(gradeField, { target: { value: '78' } })

      const submitButton = screen.getByRole('button', { name: /Add Final Comment/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockHandlers.onCreateComment).toHaveBeenCalledWith({
          classId: 1,
          firstName: 'Bob',
          grade: 78,
        })
      })
    })

    it('should clear form after successful submission', async () => {
      render(
        <FinalCommentsModal
          isOpen={true}
          onClose={mockHandlers.onClose}
          entityData={mockClass}
          finalComments={[]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      const firstNameField = screen.getByLabelText(/First Name/i, { selector: 'input' }) as HTMLInputElement
      const gradeField = screen.getByLabelText(/Grade/i, { selector: 'input' }) as HTMLInputElement

      fireEvent.change(firstNameField, { target: { value: 'John' } })
      fireEvent.change(gradeField, { target: { value: '85' } })

      const submitButton = screen.getByRole('button', { name: /Add Final Comment/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(firstNameField.value).toBe('')
        expect(gradeField.value).toBe('')
      })
    })
  })

  describe('Error Handling (AC 8, 9)', () => {
    it('should display error message when submission fails', async () => {
      mockHandlers.onCreateComment.mockRejectedValueOnce(new Error('API Error'))

      render(
        <FinalCommentsModal
          isOpen={true}
          onClose={mockHandlers.onClose}
          entityData={mockClass}
          finalComments={[]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      const firstNameField = screen.getByLabelText(/First Name/i, { selector: 'input' })
      const gradeField = screen.getByLabelText(/Grade/i, { selector: 'input' })

      fireEvent.change(firstNameField, { target: { value: 'John' } })
      fireEvent.change(gradeField, { target: { value: '85' } })

      const submitButton = screen.getByRole('button', { name: /Add Final Comment/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/Failed to add final comment/i)).toBeInTheDocument()
      })
    })

    it('should show loading state during submission', async () => {
      // Mock a delayed response
      mockHandlers.onCreateComment.mockImplementation(() =>
        new Promise(resolve => setTimeout(resolve, 100)),
      )

      render(
        <FinalCommentsModal
          isOpen={true}
          onClose={mockHandlers.onClose}
          entityData={mockClass}
          finalComments={[]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      const firstNameField = screen.getByLabelText(/First Name/i, { selector: 'input' })
      const gradeField = screen.getByLabelText(/Grade/i, { selector: 'input' })

      fireEvent.change(firstNameField, { target: { value: 'John' } })
      fireEvent.change(gradeField, { target: { value: '85' } })

      const submitButton = screen.getByRole('button', { name: /Add Final Comment/i })
      fireEvent.click(submitButton)

      // Form should be disabled during submission
      await waitFor(() => {
        expect(submitButton).toBeDisabled()
      })
    })
  })
})
