/**
 * FinalCommentsModal Header Cleanup Tests
 * TDD Phase: RED - Writing failing tests first
 * Reference: US-FINAL-STYLE-002
 *
 * Testing redundant header removal for cleaner UI
 */

import { render, screen } from '../../../test-utils'
import { FinalCommentsModal } from '../FinalCommentsModal'
import type { Class, FinalComment } from '../../../types'

const mockClass: Class = {
  id: 1,
  name: 'Mathematics 101',
  year: 2024,
  subjectId: 1,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
}

const mockFinalComment: FinalComment = {
  id: 1,
  classId: 1,
  firstName: 'John',
  lastName: 'Doe',
  grade: 85,
  comment: 'Excellent work this semester!',
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-15T10:00:00Z',
}

const mockHandlers = {
  onCreateComment: jest.fn(),
  onUpdateComment: jest.fn(),
  onDeleteComment: jest.fn(),
}

describe('US-FINAL-STYLE-002: Remove Redundant Header', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('AC1: No "Student Final Comments" heading', () => {
    it('should NOT display "Student Final Comments" heading', () => {
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

      // Should NOT find this heading
      expect(screen.queryByRole('heading', { name: /Student Final Comments/i }))
        .not.toBeInTheDocument()
    })

    it('should NOT display "Student Final Comments" heading when comments exist', () => {
      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={[mockFinalComment]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      // Should NOT find this heading
      expect(screen.queryByRole('heading', { name: /Student Final Comments/i }))
        .not.toBeInTheDocument()
    })

    it('should NOT display redundant heading in embedded mode', () => {
      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={[mockFinalComment]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
          embedded={true}
        />,
      )

      expect(screen.queryByText(/Student Final Comments/i))
        .not.toBeInTheDocument()
    })
  })

  describe('AC2: Class name shown in tab context', () => {
    it('should display class context from parent (via entityData)', () => {
      const testClass: Class = {
        id: 1,
        name: 'Mathematics 101',
        year: 2024,
        subjectId: 1,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      }

      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={testClass}
          finalComments={[mockFinalComment]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
        />,
      )

      // Class name should still be available in component context
      // (displayed in modal header for non-embedded, or parent breadcrumb for embedded)
      expect(testClass.name).toBe('Mathematics 101')
    })
  })

  describe('AC3: Clear context through tab labels', () => {
    it('should maintain context without redundant heading when embedded', () => {
      render(
        <FinalCommentsModal
          isOpen={true}
          entityData={mockClass}
          finalComments={[mockFinalComment]}
          onCreateComment={mockHandlers.onCreateComment}
          onUpdateComment={mockHandlers.onUpdateComment}
          onDeleteComment={mockHandlers.onDeleteComment}
          loading={false}
          error={null}
          embedded={true}
        />,
      )

      // Should show "Add New Final Comment" section header
      expect(screen.getByText('Add New Final Comment')).toBeInTheDocument()

      // But NOT the redundant "Student Final Comments" page header
      expect(screen.queryByRole('heading', { name: /Student Final Comments/i, level: 3 }))
        .not.toBeInTheDocument()
    })
  })
})
