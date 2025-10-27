/**
 * SubjectListItem Component Tests
 * TDD Phase: GREEN - SubjectListItem.tsx already created
 * Reference: US-REFACTOR-006
 *
 * Key Change: Subject has no year field, so year test removed
 */
import { render, screen, fireEvent } from '../../../test-utils'
import { SubjectListItem } from '../SubjectListItem'
import { Subject } from '../../../types/Subject'

const mockSubject: Subject = {
  id: 1,
  name: 'Mathematics 101',
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-02-20T14:15:00Z',
}

describe('SubjectListItem', () => {
  it('should render subject name', () => {
    render(<SubjectListItem subjectItem={mockSubject} />)
    expect(screen.getByText('Mathematics 101')).toBeInTheDocument()
  })

  it('should NOT render year field (Subject has no year)', () => {
    render(<SubjectListItem subjectItem={mockSubject} />)
    expect(screen.queryByText(/Year:/)).not.toBeInTheDocument()
  })

  it('should render formatted created date', () => {
    render(<SubjectListItem subjectItem={mockSubject} />)
    expect(screen.getByText(/Created: Jan 15, 2024/)).toBeInTheDocument()
  })

  it('should render formatted updated date', () => {
    render(<SubjectListItem subjectItem={mockSubject} />)
    expect(screen.getByText(/Updated: Feb 20, 2024/)).toBeInTheDocument()
  })

  it('should have correct data-testid', () => {
    render(<SubjectListItem subjectItem={mockSubject} />)
    expect(screen.getByTestId('subject-item-1')).toBeInTheDocument()
  })

  it('should call onView when name clicked', () => {
    const handleView = jest.fn()
    render(<SubjectListItem subjectItem={mockSubject} onView={handleView} />)
    fireEvent.click(screen.getByText('Mathematics 101'))
    expect(handleView).toHaveBeenCalledWith(1)
  })

  it('should render edit button when onEdit provided', () => {
    const handleEdit = jest.fn()
    render(<SubjectListItem subjectItem={mockSubject} onEdit={handleEdit} />)
    expect(screen.getByRole('button', { name: /edit mathematics 101/i })).toBeInTheDocument()
  })

  it('should call onEdit when edit button clicked', () => {
    const handleEdit = jest.fn()
    render(<SubjectListItem subjectItem={mockSubject} onEdit={handleEdit} />)
    fireEvent.click(screen.getByRole('button', { name: /edit/i }))
    expect(handleEdit).toHaveBeenCalledWith(1)
  })

  it('should render delete button when onDelete provided', () => {
    const handleDelete = jest.fn()
    render(<SubjectListItem subjectItem={mockSubject} onDelete={handleDelete} />)
    expect(screen.getByRole('button', { name: /delete mathematics 101/i })).toBeInTheDocument()
  })

  it('should call onDelete when delete button clicked', () => {
    const handleDelete = jest.fn()
    render(<SubjectListItem subjectItem={mockSubject} onDelete={handleDelete} />)
    fireEvent.click(screen.getByRole('button', { name: /delete/i }))
    expect(handleDelete).toHaveBeenCalledWith(1)
  })

  it('should render outcome comments button when onViewOutcomeComments provided', () => {
    const handleViewOutcomeComments = jest.fn()
    render(<SubjectListItem subjectItem={mockSubject} onViewOutcomeComments={handleViewOutcomeComments} />)
    expect(screen.getByRole('button', { name: /outcome comments for mathematics 101/i })).toBeInTheDocument()
  })

  it('should call onViewOutcomeComments when outcome comments button clicked', () => {
    const handleViewOutcomeComments = jest.fn()
    render(<SubjectListItem subjectItem={mockSubject} onViewOutcomeComments={handleViewOutcomeComments} />)
    fireEvent.click(screen.getByRole('button', { name: /outcome comments/i }))
    expect(handleViewOutcomeComments).toHaveBeenCalledWith(1)
  })

  it('should render personalized comments button when onViewPersonalizedComments provided', () => {
    const handleViewPersonalizedComments = jest.fn()
    render(<SubjectListItem subjectItem={mockSubject} onViewPersonalizedComments={handleViewPersonalizedComments} />)
    expect(screen.getByRole('button', { name: /personalized comments for mathematics 101/i })).toBeInTheDocument()
  })

  it('should call onViewPersonalizedComments when personalized comments button clicked', () => {
    const handleViewPersonalizedComments = jest.fn()
    render(<SubjectListItem subjectItem={mockSubject} onViewPersonalizedComments={handleViewPersonalizedComments} />)
    fireEvent.click(screen.getByRole('button', { name: /personalized comments/i }))
    expect(handleViewPersonalizedComments).toHaveBeenCalledWith(1)
  })

  it('should not render action buttons when handlers not provided', () => {
    render(<SubjectListItem subjectItem={mockSubject} />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('should have hover styles', () => {
    render(<SubjectListItem subjectItem={mockSubject} />)
    const container = screen.getByTestId('subject-item-1')
    expect(container).toHaveClass('hover:shadow-md')
  })
})
