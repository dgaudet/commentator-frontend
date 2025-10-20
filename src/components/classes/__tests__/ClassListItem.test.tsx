/**
 * ClassListItem Component Tests
 * TDD Phase: RED - These tests should fail initially
 * Reference: TASK-4.3, US-CLASS-001, DES-2
 */
import { render, screen, fireEvent } from '../../../test-utils'
import { ClassListItem } from '../ClassListItem'
import { Class } from '../../../types/Class'

const mockClass: Class = {
  id: 1,
  name: 'Mathematics 101',
  year: 2024,
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-02-20T14:15:00Z',
}

describe('ClassListItem', () => {
  it('should render class name', () => {
    render(<ClassListItem classItem={mockClass} />)
    expect(screen.getByText('Mathematics 101')).toBeInTheDocument()
  })

  it('should render class year', () => {
    render(<ClassListItem classItem={mockClass} />)
    expect(screen.getByText('Year: 2024')).toBeInTheDocument()
  })

  it('should render formatted created date', () => {
    render(<ClassListItem classItem={mockClass} />)
    expect(screen.getByText(/Created: Jan 15, 2024/)).toBeInTheDocument()
  })

  it('should render formatted updated date', () => {
    render(<ClassListItem classItem={mockClass} />)
    expect(screen.getByText(/Updated: Feb 20, 2024/)).toBeInTheDocument()
  })

  it('should have correct data-testid', () => {
    render(<ClassListItem classItem={mockClass} />)
    expect(screen.getByTestId('class-item-1')).toBeInTheDocument()
  })

  it('should call onView when name clicked', () => {
    const handleView = jest.fn()
    render(<ClassListItem classItem={mockClass} onView={handleView} />)
    fireEvent.click(screen.getByText('Mathematics 101'))
    expect(handleView).toHaveBeenCalledWith(1)
  })

  it('should render edit button when onEdit provided', () => {
    const handleEdit = jest.fn()
    render(<ClassListItem classItem={mockClass} onEdit={handleEdit} />)
    expect(screen.getByRole('button', { name: /edit mathematics 101/i })).toBeInTheDocument()
  })

  it('should call onEdit when edit button clicked', () => {
    const handleEdit = jest.fn()
    render(<ClassListItem classItem={mockClass} onEdit={handleEdit} />)
    fireEvent.click(screen.getByRole('button', { name: /edit/i }))
    expect(handleEdit).toHaveBeenCalledWith(1)
  })

  it('should render delete button when onDelete provided', () => {
    const handleDelete = jest.fn()
    render(<ClassListItem classItem={mockClass} onDelete={handleDelete} />)
    expect(screen.getByRole('button', { name: /delete mathematics 101/i })).toBeInTheDocument()
  })

  it('should call onDelete when delete button clicked', () => {
    const handleDelete = jest.fn()
    render(<ClassListItem classItem={mockClass} onDelete={handleDelete} />)
    fireEvent.click(screen.getByRole('button', { name: /delete/i }))
    expect(handleDelete).toHaveBeenCalledWith(1)
  })

  it('should not render action buttons when handlers not provided', () => {
    render(<ClassListItem classItem={mockClass} />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('should have hover styles', () => {
    render(<ClassListItem classItem={mockClass} />)
    const container = screen.getByTestId('class-item-1')
    expect(container).toHaveClass('hover:shadow-md')
  })
})
