/**
 * SubjectListItem Component Tests
 * TDD Phase: RED - Updating tests for tab interface
 * Reference: US-REFACTOR-006, US-TAB-002
 *
 * Key Changes:
 * - Subject has no year field, so year test removed
 * - Action buttons replaced with tabbed interface (US-TAB-002)
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

  it('should render Edit tab when onEdit provided', () => {
    const handleEdit = jest.fn()
    render(<SubjectListItem subjectItem={mockSubject} onEdit={handleEdit} />)
    expect(screen.getByRole('tab', { name: 'Edit' })).toBeInTheDocument()
  })

  it('should call onEdit when Edit tab clicked', () => {
    const handleEdit = jest.fn()
    render(<SubjectListItem subjectItem={mockSubject} onEdit={handleEdit} />)
    fireEvent.click(screen.getByRole('tab', { name: 'Edit' }))
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

  it('should render Outcome Comments tab when onViewOutcomeComments provided', () => {
    const handleViewOutcomeComments = jest.fn()
    render(<SubjectListItem subjectItem={mockSubject} onViewOutcomeComments={handleViewOutcomeComments} />)
    expect(screen.getByRole('tab', { name: 'Outcome Comments' })).toBeInTheDocument()
  })

  it('should call onViewOutcomeComments when Outcome Comments tab clicked', () => {
    const handleViewOutcomeComments = jest.fn()
    render(<SubjectListItem subjectItem={mockSubject} onViewOutcomeComments={handleViewOutcomeComments} />)
    fireEvent.click(screen.getByRole('tab', { name: 'Outcome Comments' }))
    expect(handleViewOutcomeComments).toHaveBeenCalledWith(1)
  })

  it('should render Personalized Comments tab when onViewPersonalizedComments provided', () => {
    const handleViewPersonalizedComments = jest.fn()
    render(<SubjectListItem subjectItem={mockSubject} onViewPersonalizedComments={handleViewPersonalizedComments} />)
    expect(screen.getByRole('tab', { name: 'Personalized Comments' })).toBeInTheDocument()
  })

  it('should call onViewPersonalizedComments when Personalized Comments tab clicked', () => {
    const handleViewPersonalizedComments = jest.fn()
    render(<SubjectListItem subjectItem={mockSubject} onViewPersonalizedComments={handleViewPersonalizedComments} />)
    fireEvent.click(screen.getByRole('tab', { name: 'Personalized Comments' }))
    expect(handleViewPersonalizedComments).toHaveBeenCalledWith(1)
  })

  it('should render Manage Classes tab when onViewClasses provided', () => {
    const handleViewClasses = jest.fn()
    render(<SubjectListItem subjectItem={mockSubject} onViewClasses={handleViewClasses} />)
    expect(screen.getByRole('tab', { name: 'Manage Classes' })).toBeInTheDocument()
  })

  it('should call onViewClasses when Manage Classes tab clicked', () => {
    const handleViewClasses = jest.fn()
    render(<SubjectListItem subjectItem={mockSubject} onViewClasses={handleViewClasses} />)
    fireEvent.click(screen.getByRole('tab', { name: 'Manage Classes' }))
    expect(handleViewClasses).toHaveBeenCalledWith(1)
  })

  it('should not render tabs when no tab handlers provided', () => {
    render(<SubjectListItem subjectItem={mockSubject} onDelete={jest.fn()} />)
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument()
  })

  it('should render only tabs for provided handlers', () => {
    const handleEdit = jest.fn()
    const handleViewClasses = jest.fn()
    render(
      <SubjectListItem
        subjectItem={mockSubject}
        onEdit={handleEdit}
        onViewClasses={handleViewClasses}
      />,
    )
    expect(screen.getByRole('tab', { name: 'Edit' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Manage Classes' })).toBeInTheDocument()
    expect(screen.queryByRole('tab', { name: 'Outcome Comments' })).not.toBeInTheDocument()
    expect(screen.queryByRole('tab', { name: 'Personalized Comments' })).not.toBeInTheDocument()
  })

  it('should have hover styles', () => {
    render(<SubjectListItem subjectItem={mockSubject} />)
    const container = screen.getByTestId('subject-item-1')
    expect(container).toHaveClass('hover:shadow-md')
  })
})
