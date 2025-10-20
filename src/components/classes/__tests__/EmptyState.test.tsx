/**
 * EmptyState Component Tests
 * TDD Phase: RED - These tests should fail initially
 * Reference: TASK-4.2, US-CLASS-001
 */
import { render, screen, fireEvent } from '../../../test-utils'
import { EmptyState } from '../EmptyState'

describe('EmptyState', () => {
  it('should render "No classes found" message', () => {
    render(<EmptyState />)
    expect(screen.getByText('No classes found')).toBeInTheDocument()
  })

  it('should render call-to-action message', () => {
    render(<EmptyState />)
    expect(screen.getByText(/get started by creating your first class/i)).toBeInTheDocument()
  })

  it('should render create button when onCreateFirst provided', () => {
    const handleCreate = jest.fn()
    render(<EmptyState onCreateFirst={handleCreate} />)
    expect(screen.getByRole('button', { name: /create first class/i })).toBeInTheDocument()
  })

  it('should call onCreateFirst when button clicked', () => {
    const handleCreate = jest.fn()
    render(<EmptyState onCreateFirst={handleCreate} />)
    fireEvent.click(screen.getByRole('button', { name: /create first class/i }))
    expect(handleCreate).toHaveBeenCalledTimes(1)
  })

  it('should not render button when onCreateFirst not provided', () => {
    render(<EmptyState />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('should render icon', () => {
    render(<EmptyState />)
    // Icon should be present and marked as decorative
    const svg = screen.getByRole('img', { hidden: true })
    expect(svg).toBeInTheDocument()
  })
})
