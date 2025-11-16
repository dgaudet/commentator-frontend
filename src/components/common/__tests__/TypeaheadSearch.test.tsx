/**
 * TypeaheadSearch Component Tests
 * TDD Phase: RED - Writing failing tests first
 * Reference: US-PC-TYPEAHEAD-001
 *
 * Testing typeahead search component with:
 * - Filtering functionality
 * - Item selection
 * - Keyboard navigation
 * - ARIA attributes
 * - Loading and error states
 */

import { render, screen, fireEvent } from '../../../test-utils'
import { TypeaheadSearch } from '../TypeaheadSearch'

interface MockItem {
  id: number
  label: string
}

const mockItems: MockItem[] = [
  { id: 1, label: 'Excellent work this semester' },
  { id: 2, label: 'Good effort on assignments' },
  { id: 3, label: 'Needs improvement in participation' },
  { id: 4, label: 'Outstanding performance' },
]

describe('TypeaheadSearch Component', () => {
  const mockOnSearchChange = jest.fn()
  const mockOnSelect = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('AC1: Component renders with label and placeholder', () => {
    it('should render with custom label', () => {
      render(
        <TypeaheadSearch
          items={mockItems}
          getItemLabel={(item) => item.label}
          searchQuery=""
          onSearchChange={mockOnSearchChange}
          onSelect={mockOnSelect}
          label="Search Comments"
          placeholder="Type to search..."
        />,
      )

      expect(screen.getByLabelText('Search Comments')).toBeInTheDocument()
    })

    it('should render with placeholder text', () => {
      render(
        <TypeaheadSearch
          items={mockItems}
          getItemLabel={(item) => item.label}
          searchQuery=""
          onSearchChange={mockOnSearchChange}
          onSelect={mockOnSelect}
          placeholder="Type to search..."
        />,
      )

      expect(screen.getByPlaceholderText('Type to search...')).toBeInTheDocument()
    })

    it('should render with default label when not provided', () => {
      render(
        <TypeaheadSearch
          items={mockItems}
          getItemLabel={(item) => item.label}
          searchQuery=""
          onSearchChange={mockOnSearchChange}
          onSelect={mockOnSelect}
        />,
      )

      expect(screen.getByLabelText('Search')).toBeInTheDocument()
    })
  })

  describe('AC2: Real-time filtering (case-insensitive)', () => {
    it('should filter items based on search query', () => {
      render(
        <TypeaheadSearch
          items={mockItems}
          getItemLabel={(item) => item.label}
          searchQuery="excellent"
          onSearchChange={mockOnSearchChange}
          onSelect={mockOnSelect}
        />,
      )

      const input = screen.getByRole('combobox')
      fireEvent.focus(input)

      expect(screen.getByText('Excellent work this semester')).toBeInTheDocument()
      expect(screen.queryByText('Good effort on assignments')).not.toBeInTheDocument()
    })

    it('should perform case-insensitive filtering', () => {
      render(
        <TypeaheadSearch
          items={mockItems}
          getItemLabel={(item) => item.label}
          searchQuery="EXCELLENT"
          onSearchChange={mockOnSearchChange}
          onSelect={mockOnSelect}
        />,
      )

      const input = screen.getByRole('combobox')
      fireEvent.focus(input)

      expect(screen.getByText('Excellent work this semester')).toBeInTheDocument()
    })

    it('should filter by substring match', () => {
      render(
        <TypeaheadSearch
          items={mockItems}
          getItemLabel={(item) => item.label}
          searchQuery="effort"
          onSearchChange={mockOnSearchChange}
          onSelect={mockOnSelect}
        />,
      )

      const input = screen.getByRole('combobox')
      fireEvent.focus(input)

      expect(screen.getByText('Good effort on assignments')).toBeInTheDocument()
      expect(screen.queryByText('Excellent work this semester')).not.toBeInTheDocument()
    })

    it('should show all items when search query is empty', () => {
      render(
        <TypeaheadSearch
          items={mockItems}
          getItemLabel={(item) => item.label}
          searchQuery=""
          onSearchChange={mockOnSearchChange}
          onSelect={mockOnSelect}
        />,
      )

      const input = screen.getByRole('combobox')
      fireEvent.focus(input)

      expect(screen.getByText('Excellent work this semester')).toBeInTheDocument()
      expect(screen.getByText('Good effort on assignments')).toBeInTheDocument()
      expect(screen.getByText('Needs improvement in participation')).toBeInTheDocument()
      expect(screen.getByText('Outstanding performance')).toBeInTheDocument()
    })
  })

  describe('AC3: Mouse hover highlights item', () => {
    it('should highlight item on hover', () => {
      render(
        <TypeaheadSearch
          items={mockItems}
          getItemLabel={(item) => item.label}
          searchQuery=""
          onSearchChange={mockOnSearchChange}
          onSelect={mockOnSelect}
        />,
      )

      const input = screen.getByRole('combobox')
      fireEvent.focus(input)

      const firstItem = screen.getByText('Excellent work this semester')
      fireEvent.mouseEnter(firstItem)

      // Item should be highlighted (checked via aria-selected or background color)
      expect(firstItem.closest('[role="option"]')).toHaveAttribute('aria-selected', 'true')
    })
  })

  describe('AC4: Keyboard navigation (Arrow Down/Up)', () => {
    it('should open dropdown and highlight first item on Arrow Down', () => {
      render(
        <TypeaheadSearch
          items={mockItems}
          getItemLabel={(item) => item.label}
          searchQuery=""
          onSearchChange={mockOnSearchChange}
          onSelect={mockOnSelect}
        />,
      )

      const input = screen.getByRole('combobox')
      fireEvent.keyDown(input, { key: 'ArrowDown' })

      expect(screen.getByRole('listbox')).toBeInTheDocument()
      expect(screen.getByText('Excellent work this semester').closest('[role="option"]'))
        .toHaveAttribute('aria-selected', 'true')
    })

    it('should navigate down through items with Arrow Down', () => {
      render(
        <TypeaheadSearch
          items={mockItems}
          getItemLabel={(item) => item.label}
          searchQuery=""
          onSearchChange={mockOnSearchChange}
          onSelect={mockOnSelect}
        />,
      )

      const input = screen.getByRole('combobox')
      fireEvent.focus(input)
      fireEvent.keyDown(input, { key: 'ArrowDown' })
      fireEvent.keyDown(input, { key: 'ArrowDown' })

      expect(screen.getByText('Good effort on assignments').closest('[role="option"]'))
        .toHaveAttribute('aria-selected', 'true')
    })

    it('should navigate up through items with Arrow Up', () => {
      render(
        <TypeaheadSearch
          items={mockItems}
          getItemLabel={(item) => item.label}
          searchQuery=""
          onSearchChange={mockOnSearchChange}
          onSelect={mockOnSelect}
        />,
      )

      const input = screen.getByRole('combobox')
      fireEvent.focus(input)
      fireEvent.keyDown(input, { key: 'ArrowDown' })
      fireEvent.keyDown(input, { key: 'ArrowDown' })
      fireEvent.keyDown(input, { key: 'ArrowUp' })

      expect(screen.getByText('Excellent work this semester').closest('[role="option"]'))
        .toHaveAttribute('aria-selected', 'true')
    })

    it('should not navigate past the last item', () => {
      render(
        <TypeaheadSearch
          items={[mockItems[0]]} // Only one item
          getItemLabel={(item) => item.label}
          searchQuery=""
          onSearchChange={mockOnSearchChange}
          onSelect={mockOnSelect}
        />,
      )

      const input = screen.getByRole('combobox')
      fireEvent.focus(input)
      fireEvent.keyDown(input, { key: 'ArrowDown' })
      fireEvent.keyDown(input, { key: 'ArrowDown' }) // Try to go past last item

      expect(screen.getByText('Excellent work this semester').closest('[role="option"]'))
        .toHaveAttribute('aria-selected', 'true')
    })
  })

  describe('AC5: Select item with Enter key', () => {
    it('should select highlighted item on Enter press', () => {
      render(
        <TypeaheadSearch
          items={mockItems}
          getItemLabel={(item) => item.label}
          searchQuery=""
          onSearchChange={mockOnSearchChange}
          onSelect={mockOnSelect}
        />,
      )

      const input = screen.getByRole('combobox')
      fireEvent.focus(input)
      fireEvent.keyDown(input, { key: 'ArrowDown' })
      fireEvent.keyDown(input, { key: 'Enter' })

      expect(mockOnSelect).toHaveBeenCalledWith(mockItems[0])
    })

    it('should close dropdown after Enter selection', () => {
      render(
        <TypeaheadSearch
          items={mockItems}
          getItemLabel={(item) => item.label}
          searchQuery=""
          onSearchChange={mockOnSearchChange}
          onSelect={mockOnSelect}
        />,
      )

      const input = screen.getByRole('combobox')
      fireEvent.focus(input)
      fireEvent.keyDown(input, { key: 'ArrowDown' })
      fireEvent.keyDown(input, { key: 'Enter' })

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    })
  })

  describe('AC6: Close dropdown on Escape', () => {
    it('should close dropdown on Escape press', () => {
      render(
        <TypeaheadSearch
          items={mockItems}
          getItemLabel={(item) => item.label}
          searchQuery=""
          onSearchChange={mockOnSearchChange}
          onSelect={mockOnSelect}
        />,
      )

      const input = screen.getByRole('combobox')
      fireEvent.focus(input)
      expect(screen.getByRole('listbox')).toBeInTheDocument()

      fireEvent.keyDown(input, { key: 'Escape' })
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    })

    it('should not select item on Escape', () => {
      render(
        <TypeaheadSearch
          items={mockItems}
          getItemLabel={(item) => item.label}
          searchQuery=""
          onSearchChange={mockOnSearchChange}
          onSelect={mockOnSelect}
        />,
      )

      const input = screen.getByRole('combobox')
      fireEvent.focus(input)
      fireEvent.keyDown(input, { key: 'ArrowDown' })
      fireEvent.keyDown(input, { key: 'Escape' })

      expect(mockOnSelect).not.toHaveBeenCalled()
    })
  })

  describe('AC7: Mouse click selects item', () => {
    it('should call onSelect when item is clicked', () => {
      render(
        <TypeaheadSearch
          items={mockItems}
          getItemLabel={(item) => item.label}
          searchQuery=""
          onSearchChange={mockOnSearchChange}
          onSelect={mockOnSelect}
        />,
      )

      const input = screen.getByRole('combobox')
      fireEvent.focus(input)
      fireEvent.click(screen.getByText('Excellent work this semester'))

      expect(mockOnSelect).toHaveBeenCalledWith(mockItems[0])
    })

    it('should close dropdown after click selection', () => {
      render(
        <TypeaheadSearch
          items={mockItems}
          getItemLabel={(item) => item.label}
          searchQuery=""
          onSearchChange={mockOnSearchChange}
          onSelect={mockOnSelect}
        />,
      )

      const input = screen.getByRole('combobox')
      fireEvent.focus(input)
      fireEvent.click(screen.getByText('Excellent work this semester'))

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    })
  })

  describe('Loading state', () => {
    it('should display loading indicator when loading is true', () => {
      render(
        <TypeaheadSearch
          items={[]}
          getItemLabel={(item) => item.label}
          searchQuery=""
          onSearchChange={mockOnSearchChange}
          onSelect={mockOnSelect}
          loading={true}
        />,
      )

      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    it('should disable input when loading', () => {
      render(
        <TypeaheadSearch
          items={[]}
          getItemLabel={(item) => item.label}
          searchQuery=""
          onSearchChange={mockOnSearchChange}
          onSelect={mockOnSelect}
          loading={true}
        />,
      )

      expect(screen.getByRole('combobox')).toBeDisabled()
    })

    it('should not show dropdown when loading', () => {
      render(
        <TypeaheadSearch
          items={mockItems}
          getItemLabel={(item) => item.label}
          searchQuery=""
          onSearchChange={mockOnSearchChange}
          onSelect={mockOnSelect}
          loading={true}
        />,
      )

      const input = screen.getByRole('combobox')
      fireEvent.focus(input)

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    })
  })

  describe('Error state', () => {
    it('should display error message when error is provided', () => {
      render(
        <TypeaheadSearch
          items={[]}
          getItemLabel={(item) => item.label}
          searchQuery=""
          onSearchChange={mockOnSearchChange}
          onSelect={mockOnSelect}
          error="Failed to load comments"
        />,
      )

      expect(screen.getByText('Failed to load comments')).toBeInTheDocument()
    })

    it('should not show dropdown when error exists', () => {
      render(
        <TypeaheadSearch
          items={mockItems}
          getItemLabel={(item) => item.label}
          searchQuery=""
          onSearchChange={mockOnSearchChange}
          onSelect={mockOnSelect}
          error="Failed to load comments"
        />,
      )

      const input = screen.getByRole('combobox')
      fireEvent.focus(input)

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    })
  })

  describe('Empty state', () => {
    it('should display empty message when no results found', () => {
      render(
        <TypeaheadSearch
          items={mockItems}
          getItemLabel={(item) => item.label}
          searchQuery="xyz"
          onSearchChange={mockOnSearchChange}
          onSelect={mockOnSelect}
          emptyMessage="No comments found"
        />,
      )

      const input = screen.getByRole('combobox')
      fireEvent.focus(input)

      expect(screen.getByText('No comments found')).toBeInTheDocument()
    })

    it('should display default empty message when not provided', () => {
      render(
        <TypeaheadSearch
          items={mockItems}
          getItemLabel={(item) => item.label}
          searchQuery="xyz"
          onSearchChange={mockOnSearchChange}
          onSelect={mockOnSelect}
        />,
      )

      const input = screen.getByRole('combobox')
      fireEvent.focus(input)

      expect(screen.getByText('No results found')).toBeInTheDocument()
    })
  })

  describe('ARIA attributes', () => {
    it('should have role="combobox" on input', () => {
      render(
        <TypeaheadSearch
          items={mockItems}
          getItemLabel={(item) => item.label}
          searchQuery=""
          onSearchChange={mockOnSearchChange}
          onSelect={mockOnSelect}
        />,
      )

      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('should have aria-expanded="false" when dropdown is closed', () => {
      render(
        <TypeaheadSearch
          items={mockItems}
          getItemLabel={(item) => item.label}
          searchQuery=""
          onSearchChange={mockOnSearchChange}
          onSelect={mockOnSelect}
        />,
      )

      expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false')
    })

    it('should have aria-expanded="true" when dropdown is open', () => {
      render(
        <TypeaheadSearch
          items={mockItems}
          getItemLabel={(item) => item.label}
          searchQuery=""
          onSearchChange={mockOnSearchChange}
          onSelect={mockOnSelect}
        />,
      )

      const input = screen.getByRole('combobox')
      fireEvent.focus(input)

      expect(input).toHaveAttribute('aria-expanded', 'true')
    })

    it('should have role="listbox" on dropdown', () => {
      render(
        <TypeaheadSearch
          items={mockItems}
          getItemLabel={(item) => item.label}
          searchQuery=""
          onSearchChange={mockOnSearchChange}
          onSelect={mockOnSelect}
        />,
      )

      const input = screen.getByRole('combobox')
      fireEvent.focus(input)

      expect(screen.getByRole('listbox')).toBeInTheDocument()
    })

    it('should have role="option" on each dropdown item', () => {
      render(
        <TypeaheadSearch
          items={mockItems}
          getItemLabel={(item) => item.label}
          searchQuery=""
          onSearchChange={mockOnSearchChange}
          onSelect={mockOnSelect}
        />,
      )

      const input = screen.getByRole('combobox')
      fireEvent.focus(input)

      const options = screen.getAllByRole('option')
      expect(options).toHaveLength(4)
    })

    it('should have aria-activedescendant pointing to highlighted item', () => {
      render(
        <TypeaheadSearch
          items={mockItems}
          getItemLabel={(item) => item.label}
          searchQuery=""
          onSearchChange={mockOnSearchChange}
          onSelect={mockOnSelect}
        />,
      )

      const input = screen.getByRole('combobox')
      fireEvent.focus(input)
      fireEvent.keyDown(input, { key: 'ArrowDown' })

      // Verify aria-activedescendant matches pattern (ID is auto-generated)
      const ariaActiveDescendant = input.getAttribute('aria-activedescendant')
      expect(ariaActiveDescendant).toMatch(/^typeahead-search-\d+-option-0$/)
    })
  })

  describe('Disabled state', () => {
    it('should disable input when disabled prop is true', () => {
      render(
        <TypeaheadSearch
          items={mockItems}
          getItemLabel={(item) => item.label}
          searchQuery=""
          onSearchChange={mockOnSearchChange}
          onSelect={mockOnSelect}
          disabled={true}
        />,
      )

      expect(screen.getByRole('combobox')).toBeDisabled()
    })
  })

  describe('US-RATING-005: Item Prefix (Rating Display)', () => {
    interface MockItemWithRating {
      id: number
      label: string
      rating: number
    }

    const itemsWithRatings: MockItemWithRating[] = [
      { id: 1, label: 'Excellent work', rating: 5 },
      { id: 2, label: 'Good effort', rating: 4 },
      { id: 3, label: 'Satisfactory', rating: 3 },
    ]

    const getRatingEmoji = (rating: number): string => {
      const emojis: Record<number, string> = { 1: '😢', 2: '😟', 3: '😐', 4: '🙂', 5: '😊' }
      return emojis[rating] || '😐'
    }

    it('should display prefix before item label in dropdown when getItemPrefix is provided', () => {
      render(
        <TypeaheadSearch
          items={itemsWithRatings}
          getItemLabel={(item) => item.label}
          getItemPrefix={(item) => getRatingEmoji(item.rating)}
          searchQuery=""
          onSearchChange={mockOnSearchChange}
          onSelect={mockOnSelect}
        />,
      )

      const input = screen.getByRole('combobox')
      fireEvent.focus(input)

      // Dropdown should show emoji and label (they're in separate elements)
      expect(screen.getByText('😊')).toBeInTheDocument()
      expect(screen.getByText('Excellent work')).toBeInTheDocument()
      expect(screen.getByText('🙂')).toBeInTheDocument()
      expect(screen.getByText('Good effort')).toBeInTheDocument()
      expect(screen.getByText('😐')).toBeInTheDocument()
      expect(screen.getByText('Satisfactory')).toBeInTheDocument()
    })

    it('should NOT include prefix in selected value', () => {
      render(
        <TypeaheadSearch
          items={itemsWithRatings}
          getItemLabel={(item) => item.label}
          getItemPrefix={(item) => getRatingEmoji(item.rating)}
          searchQuery=""
          onSearchChange={mockOnSearchChange}
          onSelect={mockOnSelect}
        />,
      )

      const input = screen.getByRole('combobox')
      fireEvent.focus(input)

      // Click on the first option (get by role for more reliability)
      const options = screen.getAllByRole('option')
      fireEvent.click(options[0])

      // onSelect should receive the item (not the prefixed string)
      expect(mockOnSelect).toHaveBeenCalledWith(itemsWithRatings[0])
    })

    it('should work without getItemPrefix (backward compatibility)', () => {
      render(
        <TypeaheadSearch
          items={mockItems}
          getItemLabel={(item) => item.label}
          searchQuery=""
          onSearchChange={mockOnSearchChange}
          onSelect={mockOnSelect}
        />,
      )

      const input = screen.getByRole('combobox')
      fireEvent.focus(input)

      // Should display labels without prefix
      expect(screen.getByText('Excellent work this semester')).toBeInTheDocument()
      expect(screen.queryByText(/😊/)).not.toBeInTheDocument()
    })

    it('should display correct prefix for each item', () => {
      render(
        <TypeaheadSearch
          items={itemsWithRatings}
          getItemLabel={(item) => item.label}
          getItemPrefix={(item) => getRatingEmoji(item.rating)}
          searchQuery=""
          onSearchChange={mockOnSearchChange}
          onSelect={mockOnSelect}
        />,
      )

      const input = screen.getByRole('combobox')
      fireEvent.focus(input)

      // Each item should have its own emoji
      expect(screen.getByText(/😊/)).toBeInTheDocument() // rating 5
      expect(screen.getByText(/🙂/)).toBeInTheDocument() // rating 4
      expect(screen.getByText(/😐/)).toBeInTheDocument() // rating 3
    })

    it('should filter items and preserve prefixes', () => {
      render(
        <TypeaheadSearch
          items={itemsWithRatings}
          getItemLabel={(item) => item.label}
          getItemPrefix={(item) => getRatingEmoji(item.rating)}
          searchQuery="excellent"
          onSearchChange={mockOnSearchChange}
          onSelect={mockOnSelect}
        />,
      )

      const input = screen.getByRole('combobox')
      fireEvent.focus(input)

      // Filtered item should still show prefix and label
      expect(screen.getByText('😊')).toBeInTheDocument()
      expect(screen.getByText('Excellent work')).toBeInTheDocument()
      expect(screen.queryByText('Good effort')).not.toBeInTheDocument()
    })
  })
})
