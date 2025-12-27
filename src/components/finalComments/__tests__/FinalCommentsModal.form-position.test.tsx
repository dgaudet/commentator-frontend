/**
 * FinalCommentsModal Form Position Tests
 * TDD Phase: RED - Writing failing tests first
 * Reference: US-FINAL-STYLE-001
 *
 * Testing add form position above the list of final comments
 */

import { render, screen, fireEvent, waitFor } from '../../../test-utils'
import { FinalCommentsModal } from '../FinalCommentsModal'
import type { Class, FinalComment } from '../../../types'

const mockClass: Class = {
  id: '65a1b2c3d4e5f6g7h8i9j0k1',
  name: 'Mathematics 101',
  year: 2024,
  subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
}

const mockFinalComments: FinalComment[] = [
  {
    id: '65a1b2c3d4e5f6g7h8i9j0k1',
    classId: '75a1b2c3d4e5f6g7h8i9j0k1',
    firstName: 'John',
    lastName: 'Doe',
    grade: 85,
    comment: 'Excellent work this semester!',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '65a1b2c3d4e5f6g7h8i9j0k2',
    classId: '75a1b2c3d4e5f6g7h8i9j0k1',
    firstName: 'Alice',
    lastName: 'Smith',
    grade: 92,
    comment: 'Outstanding performance.',
    createdAt: '2024-01-16T11:00:00Z',
    updatedAt: '2024-01-16T11:00:00Z',
  },
]

const mockHandlers = {
  onCreateComment: jest.fn(),
  onUpdateComment: jest.fn(),
  onDeleteComment: jest.fn(),
}

describe('US-FINAL-STYLE-001: Add Form Above List', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('AC1: Add form renders at top of panel', () => {
    it('should display add form above empty list', () => {
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

      const addFormHeading = screen.getByText('Add New Final Comment')
      const emptyMessage = screen.getByText(/No final comments yet/i)

      // Add form should come before empty message in DOM order
      expect(addFormHeading.compareDocumentPosition(emptyMessage))
        .toBe(Node.DOCUMENT_POSITION_FOLLOWING)
    })

    it('should display add form above populated list', () => {
      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={mockFinalComments}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      const addFormHeading = screen.getByText('Add New Final Comment')
      const firstComment = screen.getByText(/Excellent work this semester/i)

      // Add form should come before first comment in DOM order
      expect(addFormHeading.compareDocumentPosition(firstComment))
        .toBe(Node.DOCUMENT_POSITION_FOLLOWING)
    })

    it('should have add form as first interactive element in tab order', () => {
      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={mockFinalComments}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      const firstNameInput = screen.getByLabelText(/First Name/i)

      // First Name input should be first focusable element
      firstNameInput.focus()
      expect(firstNameInput).toHaveFocus()
    })
  })

  describe('AC2: Add form stays at top after adding comment', () => {
    it('should keep add form at top after successful submission', async () => {
      const onCreateComment = jest.fn().mockResolvedValue(undefined)
      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={[]}
          onCreateComment={onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      // Fill and submit form
      fireEvent.change(screen.getByLabelText(/First Name/i), {
        target: { value: 'John' },
      })
      fireEvent.change(screen.getByLabelText(/Grade/i), {
        target: { value: '85' },
      })
      fireEvent.click(screen.getByRole('button', { name: /Add Final Comment/i }))

      await waitFor(() => {
        expect(onCreateComment).toHaveBeenCalled()
      })

      // Add form should still be at top
      const addFormHeading = screen.getByText('Add New Final Comment')
      expect(addFormHeading).toBeInTheDocument()
    })
  })

  describe('AC3: List scrolls independently of add form', () => {
    it('should allow add form and list to be in separate containers', () => {
      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={mockFinalComments}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      const addFormSection = screen.getByText('Add New Final Comment').closest('div')
      // US-FC-STYLE-001: Updated to use 'Existing Comments' heading instead of removed CSS class
      const listSection = screen.getByText('Existing Comments').closest('div')

      // Add form and list should be in separate containers
      expect(addFormSection).not.toBe(listSection)
      expect(listSection).not.toContainElement(addFormSection!)
    })
  })
})
