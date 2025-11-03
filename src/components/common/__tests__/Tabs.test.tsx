/**
 * Tabs Component Tests
 * TDD Phase: RED - Writing failing tests first
 * Reference: US-TAB-001
 *
 * Testing reusable tab component with accessibility and keyboard navigation
 */
import { render, screen, fireEvent } from '../../../test-utils'
import { Tabs } from '../Tabs'

describe('Tabs Component (US-TAB-001)', () => {
  const mockOnChange = jest.fn()

  const defaultTabs = [
    { id: 'edit', label: 'Edit' },
    { id: 'outcome', label: 'Outcome Comments' },
    { id: 'personalized', label: 'Personalized Comments' },
    { id: 'classes', label: 'Manage Classes' },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('AC1: Component API and Props', () => {
    it('should render tabs from tabs array prop', () => {
      render(<Tabs tabs={defaultTabs} onChange={mockOnChange} />)

      expect(screen.getByRole('tab', { name: 'Edit' })).toBeInTheDocument()
      expect(screen.getByRole('tab', { name: 'Outcome Comments' })).toBeInTheDocument()
      expect(screen.getByRole('tab', { name: 'Personalized Comments' })).toBeInTheDocument()
      expect(screen.getByRole('tab', { name: 'Manage Classes' })).toBeInTheDocument()
    })

    it('should select first tab by default when no defaultTab provided', () => {
      render(<Tabs tabs={defaultTabs} onChange={mockOnChange} />)

      const firstTab = screen.getByRole('tab', { name: 'Edit' })
      expect(firstTab).toHaveAttribute('aria-selected', 'true')
    })

    it('should select specified defaultTab when provided', () => {
      render(<Tabs tabs={defaultTabs} defaultTab="outcome" onChange={mockOnChange} />)

      const outcomeTab = screen.getByRole('tab', { name: 'Outcome Comments' })
      expect(outcomeTab).toHaveAttribute('aria-selected', 'true')

      const editTab = screen.getByRole('tab', { name: 'Edit' })
      expect(editTab).toHaveAttribute('aria-selected', 'false')
    })

    it('should render with horizontal orientation by default', () => {
      render(<Tabs tabs={defaultTabs} onChange={mockOnChange} />)

      const tablist = screen.getByRole('tablist')
      expect(tablist).toHaveAttribute('aria-orientation', 'horizontal')
    })
  })

  describe('AC2: Mouse Interaction', () => {
    it('should call onChange when a tab is clicked', () => {
      render(<Tabs tabs={defaultTabs} onChange={mockOnChange} />)

      const outcomeTab = screen.getByRole('tab', { name: 'Outcome Comments' })
      fireEvent.click(outcomeTab)

      expect(mockOnChange).toHaveBeenCalledTimes(1)
      expect(mockOnChange).toHaveBeenCalledWith('outcome')
    })

    it('should update aria-selected when tab is clicked', () => {
      render(<Tabs tabs={defaultTabs} onChange={mockOnChange} />)

      const editTab = screen.getByRole('tab', { name: 'Edit' })
      const outcomeTab = screen.getByRole('tab', { name: 'Outcome Comments' })

      // Initially, first tab is selected
      expect(editTab).toHaveAttribute('aria-selected', 'true')
      expect(outcomeTab).toHaveAttribute('aria-selected', 'false')

      // Click second tab
      fireEvent.click(outcomeTab)

      // Second tab should now be selected
      expect(editTab).toHaveAttribute('aria-selected', 'false')
      expect(outcomeTab).toHaveAttribute('aria-selected', 'true')
    })

    it('should visually highlight the active tab', () => {
      render(<Tabs tabs={defaultTabs} onChange={mockOnChange} />)

      const editTab = screen.getByRole('tab', { name: 'Edit' })

      // Active tab should have specific styling classes
      expect(editTab.className).toContain('border-b-2')
      expect(editTab.className).toContain('border-blue-600')
    })
  })

  describe('AC3: Keyboard Navigation - Arrow Keys', () => {
    it('should move focus to next tab on ArrowRight', () => {
      render(<Tabs tabs={defaultTabs} onChange={mockOnChange} />)

      const editTab = screen.getByRole('tab', { name: 'Edit' })
      const outcomeTab = screen.getByRole('tab', { name: 'Outcome Comments' })

      editTab.focus()
      expect(editTab).toHaveFocus()

      fireEvent.keyDown(editTab, { key: 'ArrowRight' })

      expect(outcomeTab).toHaveFocus()
    })

    it('should move focus to previous tab on ArrowLeft', () => {
      render(<Tabs tabs={defaultTabs} onChange={mockOnChange} />)

      const editTab = screen.getByRole('tab', { name: 'Edit' })
      const outcomeTab = screen.getByRole('tab', { name: 'Outcome Comments' })

      outcomeTab.focus()
      expect(outcomeTab).toHaveFocus()

      fireEvent.keyDown(outcomeTab, { key: 'ArrowLeft' })

      expect(editTab).toHaveFocus()
    })

    it('should wrap focus to first tab when ArrowRight on last tab', () => {
      render(<Tabs tabs={defaultTabs} onChange={mockOnChange} />)

      const lastTab = screen.getByRole('tab', { name: 'Manage Classes' })
      const firstTab = screen.getByRole('tab', { name: 'Edit' })

      lastTab.focus()
      fireEvent.keyDown(lastTab, { key: 'ArrowRight' })

      expect(firstTab).toHaveFocus()
    })

    it('should wrap focus to last tab when ArrowLeft on first tab', () => {
      render(<Tabs tabs={defaultTabs} onChange={mockOnChange} />)

      const firstTab = screen.getByRole('tab', { name: 'Edit' })
      const lastTab = screen.getByRole('tab', { name: 'Manage Classes' })

      firstTab.focus()
      fireEvent.keyDown(firstTab, { key: 'ArrowLeft' })

      expect(lastTab).toHaveFocus()
    })
  })

  describe('AC4: Keyboard Navigation - Home/End', () => {
    it('should move focus to first tab on Home key', () => {
      render(<Tabs tabs={defaultTabs} onChange={mockOnChange} />)

      const lastTab = screen.getByRole('tab', { name: 'Manage Classes' })
      const firstTab = screen.getByRole('tab', { name: 'Edit' })

      lastTab.focus()
      fireEvent.keyDown(lastTab, { key: 'Home' })

      expect(firstTab).toHaveFocus()
    })

    it('should move focus to last tab on End key', () => {
      render(<Tabs tabs={defaultTabs} onChange={mockOnChange} />)

      const firstTab = screen.getByRole('tab', { name: 'Edit' })
      const lastTab = screen.getByRole('tab', { name: 'Manage Classes' })

      firstTab.focus()
      fireEvent.keyDown(firstTab, { key: 'End' })

      expect(lastTab).toHaveFocus()
    })
  })

  describe('AC5: Keyboard Activation - Enter/Space', () => {
    it('should activate tab and call onChange on Enter key', () => {
      render(<Tabs tabs={defaultTabs} onChange={mockOnChange} />)

      const outcomeTab = screen.getByRole('tab', { name: 'Outcome Comments' })
      outcomeTab.focus()

      fireEvent.keyDown(outcomeTab, { key: 'Enter' })

      expect(mockOnChange).toHaveBeenCalledTimes(1)
      expect(mockOnChange).toHaveBeenCalledWith('outcome')
      expect(outcomeTab).toHaveAttribute('aria-selected', 'true')
    })

    it('should activate tab and call onChange on Space key', () => {
      render(<Tabs tabs={defaultTabs} onChange={mockOnChange} />)

      const personalizedTab = screen.getByRole('tab', { name: 'Personalized Comments' })
      personalizedTab.focus()

      fireEvent.keyDown(personalizedTab, { key: ' ' })

      expect(mockOnChange).toHaveBeenCalledTimes(1)
      expect(mockOnChange).toHaveBeenCalledWith('personalized')
      expect(personalizedTab).toHaveAttribute('aria-selected', 'true')
    })
  })

  describe('AC6: ARIA Attributes and Accessibility', () => {
    it('should have proper role="tablist" on container', () => {
      render(<Tabs tabs={defaultTabs} onChange={mockOnChange} />)

      const tablist = screen.getByRole('tablist')
      expect(tablist).toBeInTheDocument()
    })

    it('should have proper role="tab" on each tab', () => {
      render(<Tabs tabs={defaultTabs} onChange={mockOnChange} />)

      const tabs = screen.getAllByRole('tab')
      expect(tabs).toHaveLength(4)
    })

    it('should have aria-selected="true" on active tab and "false" on others', () => {
      render(<Tabs tabs={defaultTabs} onChange={mockOnChange} />)

      const tabs = screen.getAllByRole('tab')

      expect(tabs[0]).toHaveAttribute('aria-selected', 'true')
      expect(tabs[1]).toHaveAttribute('aria-selected', 'false')
      expect(tabs[2]).toHaveAttribute('aria-selected', 'false')
      expect(tabs[3]).toHaveAttribute('aria-selected', 'false')
    })

    it('should have tabindex="0" on active tab and tabindex="-1" on inactive tabs', () => {
      render(<Tabs tabs={defaultTabs} onChange={mockOnChange} />)

      const tabs = screen.getAllByRole('tab')

      expect(tabs[0]).toHaveAttribute('tabindex', '0')
      expect(tabs[1]).toHaveAttribute('tabindex', '-1')
      expect(tabs[2]).toHaveAttribute('tabindex', '-1')
      expect(tabs[3]).toHaveAttribute('tabindex', '-1')
    })
  })

  describe('AC7: Disabled Tab States', () => {
    it('should render disabled tabs with aria-disabled', () => {
      const tabsWithDisabled = [
        { id: 'edit', label: 'Edit' },
        { id: 'outcome', label: 'Outcome Comments', disabled: true },
      ]

      render(<Tabs tabs={tabsWithDisabled} onChange={mockOnChange} />)

      const disabledTab = screen.getByRole('tab', { name: 'Outcome Comments' })
      expect(disabledTab).toHaveAttribute('aria-disabled', 'true')
    })

    it('should not call onChange when disabled tab is clicked', () => {
      const tabsWithDisabled = [
        { id: 'edit', label: 'Edit' },
        { id: 'outcome', label: 'Outcome Comments', disabled: true },
      ]

      render(<Tabs tabs={tabsWithDisabled} onChange={mockOnChange} />)

      const disabledTab = screen.getByRole('tab', { name: 'Outcome Comments' })
      fireEvent.click(disabledTab)

      expect(mockOnChange).not.toHaveBeenCalled()
    })

    it('should skip disabled tabs in keyboard navigation', () => {
      const tabsWithDisabled = [
        { id: 'edit', label: 'Edit' },
        { id: 'outcome', label: 'Outcome Comments', disabled: true },
        { id: 'personalized', label: 'Personalized Comments' },
      ]

      render(<Tabs tabs={tabsWithDisabled} onChange={mockOnChange} />)

      const editTab = screen.getByRole('tab', { name: 'Edit' })
      const personalizedTab = screen.getByRole('tab', { name: 'Personalized Comments' })

      editTab.focus()
      fireEvent.keyDown(editTab, { key: 'ArrowRight' })

      // Should skip disabled tab and focus next enabled tab
      expect(personalizedTab).toHaveFocus()
    })
  })

  describe('AC8: Unique ID Generation with useId()', () => {
    it('should generate unique IDs for multiple tab instances', () => {
      render(
        <>
          <Tabs tabs={defaultTabs} onChange={mockOnChange} />
          <Tabs tabs={defaultTabs} onChange={mockOnChange} />
        </>,
      )

      const tablists = screen.getAllByRole('tablist')
      expect(tablists).toHaveLength(2)

      // Each tablist should have different IDs
      const firstTablistId = tablists[0].id
      const secondTablistId = tablists[1].id

      expect(firstTablistId).toBeDefined()
      expect(secondTablistId).toBeDefined()
      expect(firstTablistId).not.toBe(secondTablistId)
    })
  })
})
