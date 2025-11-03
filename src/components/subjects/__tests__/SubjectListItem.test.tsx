/**
 * SubjectListItem Component Tests
 * TDD Phase: RED - Updating tests for tab interface + tab panels
 * Reference: US-REFACTOR-006, US-TAB-002, US-TABPANEL-002
 *
 * Key Changes:
 * - Subject has no year field, so year test removed
 * - Action buttons replaced with tabbed interface (US-TAB-002)
 * - Tab panels display content below tabs (US-TABPANEL-002)
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

  /**
   * US-TABPANEL-002: Tab Panel Content Switching
   * Tests for displaying content below tabs based on selection
   */
  describe('US-TABPANEL-002: Tab Panel Integration', () => {
    describe('AC1: Tab Panel Rendering', () => {
      it('should display Edit panel below tabs when Edit tab is active', () => {
        render(<SubjectListItem subjectItem={mockSubject} onEdit={jest.fn()} />)

        // Edit tab should be selected by default (first tab)
        const editTab = screen.getByRole('tab', { name: 'Edit' })
        expect(editTab).toHaveAttribute('aria-selected', 'true')

        // Edit panel should be visible
        expect(screen.getByRole('tabpanel')).toBeInTheDocument()
        expect(screen.getByTestId('edit-panel-content')).toBeInTheDocument()
      })

      it('should display tabpanel with correct ARIA attributes', () => {
        render(<SubjectListItem subjectItem={mockSubject} onEdit={jest.fn()} />)

        const tabpanel = screen.getByRole('tabpanel')
        expect(tabpanel).toHaveAttribute('id', expect.stringContaining('tabpanel'))
        expect(tabpanel).toHaveAttribute('aria-labelledby', expect.stringContaining('tab'))
      })

      it('should display tabpanel below the tabs with proper spacing', () => {
        render(<SubjectListItem subjectItem={mockSubject} onEdit={jest.fn()} />)

        const tabpanel = screen.getByRole('tabpanel')
        expect(tabpanel).toHaveClass('mt-4') // Spacing below tabs
      })
    })

    describe('AC2: Tab Switching Behavior', () => {
      it('should switch to Outcome Comments panel when Outcome Comments tab clicked', () => {
        render(
          <SubjectListItem
            subjectItem={mockSubject}
            onEdit={jest.fn()}
            onViewOutcomeComments={jest.fn()}
          />,
        )

        // Initially Edit panel is visible
        expect(screen.getByTestId('edit-panel-content')).toBeInTheDocument()
        expect(screen.queryByTestId('outcome-comments-panel-content')).not.toBeInTheDocument()

        // Click Outcome Comments tab
        const outcomeTab = screen.getByRole('tab', { name: 'Outcome Comments' })
        fireEvent.click(outcomeTab)

        // Now Outcome Comments panel should be visible, Edit panel hidden
        expect(screen.queryByTestId('edit-panel-content')).not.toBeInTheDocument()
        expect(screen.getByTestId('outcome-comments-panel-content')).toBeInTheDocument()
      })

      it('should switch to Personalized Comments panel when Personalized Comments tab clicked', () => {
        render(
          <SubjectListItem
            subjectItem={mockSubject}
            onEdit={jest.fn()}
            onViewPersonalizedComments={jest.fn()}
          />,
        )

        // Click Personalized Comments tab
        const personalizedTab = screen.getByRole('tab', { name: 'Personalized Comments' })
        fireEvent.click(personalizedTab)

        // Personalized Comments panel should be visible
        expect(screen.queryByTestId('edit-panel-content')).not.toBeInTheDocument()
        expect(screen.getByTestId('personalized-comments-panel-content')).toBeInTheDocument()
      })

      it('should switch to Manage Classes panel when Manage Classes tab clicked', () => {
        render(
          <SubjectListItem
            subjectItem={mockSubject}
            onEdit={jest.fn()}
            onViewClasses={jest.fn()}
          />,
        )

        // Click Manage Classes tab
        const classesTab = screen.getByRole('tab', { name: 'Manage Classes' })
        fireEvent.click(classesTab)

        // Manage Classes panel should be visible
        expect(screen.queryByTestId('edit-panel-content')).not.toBeInTheDocument()
        expect(screen.getByTestId('classes-panel-content')).toBeInTheDocument()
      })

      it('should only show one panel at a time', () => {
        render(
          <SubjectListItem
            subjectItem={mockSubject}
            onEdit={jest.fn()}
            onViewOutcomeComments={jest.fn()}
            onViewPersonalizedComments={jest.fn()}
            onViewClasses={jest.fn()}
          />,
        )

        // Initially Edit panel
        expect(screen.getByTestId('edit-panel-content')).toBeInTheDocument()
        expect(screen.getAllByRole('tabpanel')).toHaveLength(1)

        // Switch to Outcome Comments
        fireEvent.click(screen.getByRole('tab', { name: 'Outcome Comments' }))
        expect(screen.getByTestId('outcome-comments-panel-content')).toBeInTheDocument()
        expect(screen.getAllByRole('tabpanel')).toHaveLength(1)

        // Switch to Personalized Comments
        fireEvent.click(screen.getByRole('tab', { name: 'Personalized Comments' }))
        expect(screen.getByTestId('personalized-comments-panel-content')).toBeInTheDocument()
        expect(screen.getAllByRole('tabpanel')).toHaveLength(1)

        // Switch to Manage Classes
        fireEvent.click(screen.getByRole('tab', { name: 'Manage Classes' }))
        expect(screen.getByTestId('classes-panel-content')).toBeInTheDocument()
        expect(screen.getAllByRole('tabpanel')).toHaveLength(1)
      })
    })

    describe('AC3: Subject Context Passing', () => {
      it('should pass subject data to Edit panel', () => {
        render(<SubjectListItem subjectItem={mockSubject} onEdit={jest.fn()} />)

        // Check that subject name appears in edit panel
        const editPanel = screen.getByTestId('edit-panel-content')
        expect(editPanel).toHaveTextContent('Mathematics 101')
      })

      it('should pass subject ID to Outcome Comments panel', () => {
        render(
          <SubjectListItem
            subjectItem={mockSubject}
            onEdit={jest.fn()}
            onViewOutcomeComments={jest.fn()}
          />,
        )

        // Switch to Outcome Comments panel
        fireEvent.click(screen.getByRole('tab', { name: 'Outcome Comments' }))

        // Check that subject ID is passed (shown in panel)
        const outcomePanel = screen.getByTestId('outcome-comments-panel-content')
        expect(outcomePanel).toHaveTextContent('Subject ID: 1')
      })

      it('should pass subject ID to Personalized Comments panel', () => {
        render(
          <SubjectListItem
            subjectItem={mockSubject}
            onEdit={jest.fn()}
            onViewPersonalizedComments={jest.fn()}
          />,
        )

        // Switch to Personalized Comments panel
        fireEvent.click(screen.getByRole('tab', { name: 'Personalized Comments' }))

        const personalizedPanel = screen.getByTestId('personalized-comments-panel-content')
        expect(personalizedPanel).toHaveTextContent('Subject ID: 1')
      })

      it('should pass subject ID to Manage Classes panel', () => {
        render(
          <SubjectListItem
            subjectItem={mockSubject}
            onEdit={jest.fn()}
            onViewClasses={jest.fn()}
          />,
        )

        // Switch to Manage Classes panel
        fireEvent.click(screen.getByRole('tab', { name: 'Manage Classes' }))

        const classesPanel = screen.getByTestId('classes-panel-content')
        expect(classesPanel).toHaveTextContent('Subject ID: 1')
      })
    })

    describe('AC4: Conditional Rendering', () => {
      it('should not render tab panels when no tab handlers provided', () => {
        render(<SubjectListItem subjectItem={mockSubject} onDelete={jest.fn()} />)

        expect(screen.queryByRole('tabpanel')).not.toBeInTheDocument()
      })

      it('should render only panels for provided handlers', () => {
        render(
          <SubjectListItem
            subjectItem={mockSubject}
            onEdit={jest.fn()}
            onViewClasses={jest.fn()}
          />,
        )

        // Edit panel visible by default
        expect(screen.getByTestId('edit-panel-content')).toBeInTheDocument()

        // Can switch to Classes panel
        fireEvent.click(screen.getByRole('tab', { name: 'Manage Classes' }))
        expect(screen.getByTestId('classes-panel-content')).toBeInTheDocument()

        // No Outcome or Personalized tabs/panels
        expect(screen.queryByRole('tab', { name: 'Outcome Comments' })).not.toBeInTheDocument()
        expect(screen.queryByRole('tab', { name: 'Personalized Comments' })).not.toBeInTheDocument()
      })
    })

    describe('AC5: Responsive Layout', () => {
      it('should maintain visual hierarchy with panels below tabs', () => {
        const { container } = render(
          <SubjectListItem subjectItem={mockSubject} onEdit={jest.fn()} />,
        )

        // Tabs should be in the same container structure
        const tablist = screen.getByRole('tablist')
        const tabpanel = screen.getByRole('tabpanel')

        // Panel should appear after tabs in DOM order
        const tablistPosition = Array.from(container.querySelectorAll('*')).indexOf(tablist as Element)
        const tabpanelPosition = Array.from(container.querySelectorAll('*')).indexOf(tabpanel)

        expect(tabpanelPosition).toBeGreaterThan(tablistPosition)
      })
    })
  })
})
