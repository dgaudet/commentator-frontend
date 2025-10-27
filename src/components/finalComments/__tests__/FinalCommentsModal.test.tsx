/**
 * FinalCommentsModal Component Tests
 * TDD Phase: RED - Writing failing tests before implementation
 * Reference: US-FINAL-001 (Modal opens from Final Comments button)
 *
 * Initial test suite focuses on modal rendering and basic structure
 * US-FINAL-002 and US-FINAL-003 tests will be added in subsequent phases
 */
import { render, screen } from '../../../test-utils'
import { FinalCommentsModal } from '../FinalCommentsModal'
import type { Class } from '../../../types'

const mockClass: Class = {
  id: 1,
  name: 'Grade 10 Math',
  year: 2024,
  subjectId: 5,
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-02-20T14:15:00Z',
}

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
