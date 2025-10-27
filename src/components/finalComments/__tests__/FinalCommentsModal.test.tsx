/**
 * FinalCommentsModal Component Tests
 * TDD Phase: RED - Writing failing tests before implementation
 * Reference: US-FINAL-001 (Modal opens from Final Comments button)
 *           US-FINAL-002 (View list of final comments)
 *
 * Initial test suite focuses on modal rendering and basic structure
 * US-FINAL-003 tests will be added in subsequent phase
 */
import { render, screen } from '../../../test-utils'
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
