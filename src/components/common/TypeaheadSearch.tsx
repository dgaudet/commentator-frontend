/**
 * TypeaheadSearch Component
 * TDD Phase: GREEN - Minimal implementation to pass tests
 * Reference: US-PC-TYPEAHEAD-001
 *
 * Generic typeahead search component with:
 * - Real-time filtering (case-insensitive)
 * - Keyboard navigation (arrows, enter, escape)
 * - Mouse hover and click selection
 * - ARIA attributes for accessibility
 * - Loading and error states
 * - Design token styling
 */

import { useState, useRef, useEffect, useCallback } from 'react'
import { spacing, typography, borders, shadows } from '../../theme/tokens'
import { useThemeColors } from '../../hooks/useThemeColors'

// Generate unique ID for each TypeaheadSearch instance
let typeaheadIdCounter = 0

/**
 * Props for the TypeaheadSearch component
 * @template T - The type of items in the dropdown list
 */
interface TypeaheadSearchProps<T> {
  // ==================== Data ====================

  /**
   * Array of items to display in the dropdown
   * @example items={personalizedComments}
   */
  items: T[]

  /**
   * Function to extract the display label from each item
   * @param item - The item to extract the label from
   * @returns The string to display for this item
   * @example getItemLabel={(comment) => comment.text}
   */
  getItemLabel: (item: T) => string

  /**
   * Optional function to extract a unique key from each item for React reconciliation.
   * If not provided, falls back to array index (not recommended for dynamic lists).
   * Using unique keys prevents issues with React's reconciliation when filtering changes.
   * @param item - The item to extract the key from
   * @returns A unique string or number identifier for this item
   * @example getItemKey={(comment) => comment.id}
   */
  getItemKey?: (item: T) => string | number

  /**
   * Optional function to extract a prefix (e.g., emoji, icon) to display before the item label.
   * The prefix is shown in the dropdown but NOT included in the selected value.
   * @param item - The item to extract the prefix from
   * @returns A string prefix (e.g., emoji) to prepend to the label
   * @example getItemPrefix={(comment) => getRatingEmoji(comment.rating)}
   * @see US-RATING-005
   */
  getItemPrefix?: (item: T) => string

  // ==================== Search State ====================

  /**
   * Current search query value (controlled component)
   * @example searchQuery={searchState}
   */
  searchQuery: string

  /**
   * Callback fired when the search query changes
   * @param query - The new search query string
   * @example onSearchChange={setSearchState}
   */
  onSearchChange: (query: string) => void

  /**
   * Callback fired when an item is selected
   * @param item - The selected item
   * @example onSelect={(item) => setSelectedValue(item.id)}
   */
  onSelect: (item: T) => void

  // ==================== UI Customization ====================

  /**
   * Label text displayed above the input field
   * @default 'Search'
   * @example label="Personalized Comment (Optional)"
   */
  label?: string

  /**
   * Placeholder text shown in the input when empty
   * @default 'Type to search...'
   * @example placeholder="Search comments..."
   */
  placeholder?: string

  /**
   * Message displayed when no results match the search query
   * @default 'No results found'
   * @example emptyMessage="No comments available"
   */
  emptyMessage?: string

  /**
   * Optional unique ID for the input element. If not provided, an auto-generated
   * ID will be used. Useful when multiple TypeaheadSearch instances exist on the
   * same page to prevent HTML ID collisions.
   * @default Auto-generated: 'typeahead-search-{N}'
   * @example id="add-form-typeahead"
   */
  id?: string

  // ==================== States ====================

  /**
   * Whether the component is in a loading state. When true, the input is disabled
   * and a loading indicator is shown.
   * @default false
   * @example loading={isLoadingComments}
   */
  loading?: boolean

  /**
   * Whether the input field is disabled. When true, the input cannot be focused
   * or edited.
   * @default false
   * @example disabled={isSubmitting}
   */
  disabled?: boolean

  /**
   * Error message to display below the input. When set, the dropdown is hidden.
   * @default null
   * @example error={loadError}
   */
  error?: string | null
}

/**
 * TypeaheadSearch Component
 *
 * A generic, accessible typeahead/autocomplete search component with keyboard navigation.
 * Implements WAI-ARIA 1.2 Combobox pattern for accessibility.
 *
 * **Features:**
 * - Real-time case-insensitive filtering
 * - Full keyboard navigation (Arrow keys, Enter, Escape)
 * - Mouse interaction (click, hover)
 * - ARIA attributes for screen readers
 * - Loading, error, and empty states
 * - Click-outside-to-close behavior
 * - Design token styling (100% compliance)
 * - Unique ID generation to prevent collisions
 *
 * **Keyboard Navigation:**
 * - `Arrow Down`: Open dropdown and navigate to next item
 * - `Arrow Up`: Navigate to previous item
 * - `Enter`: Select highlighted item
 * - `Escape`: Close dropdown without selecting
 * - `Tab`: Move to next form field (browser default)
 *
 * @template T - The type of items in the dropdown list
 *
 * @example
 * ```tsx
 * const [search, setSearch] = useState('')
 *
 * <TypeaheadSearch
 *   items={comments}
 *   getItemLabel={(comment) => comment.text}
 *   getItemKey={(comment) => comment.id}
 *   searchQuery={search}
 *   onSearchChange={setSearch}
 *   onSelect={(comment) => setSelectedComment(comment.text)}
 *   label="Search Comments"
 *   placeholder="Type to search..."
 *   emptyMessage="No comments found"
 *   loading={isLoading}
 *   error={error}
 * />
 * ```
 *
 * @see US-PC-TYPEAHEAD-001 for implementation details
 * @see TypeaheadSearchProps for prop documentation
 */
export const TypeaheadSearch = <T, >({
  items,
  getItemLabel,
  getItemKey,
  getItemPrefix,
  searchQuery,
  onSearchChange,
  onSelect,
  label = 'Search',
  placeholder = 'Type to search...',
  emptyMessage = 'No results found',
  id,
  loading = false,
  disabled = false,
  error = null,
}: TypeaheadSearchProps<T>) => {
  const themeColors = useThemeColors()
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Generate unique ID for this instance if not provided
  const instanceId = useRef(id || `typeahead-search-${typeaheadIdCounter++}`).current
  const listboxId = `${instanceId}-listbox`

  // Filter items based on search query (case-insensitive substring match)
  const filteredItems = searchQuery.trim()
    ? items.filter(item =>
      getItemLabel(item).toLowerCase().includes(searchQuery.toLowerCase()),
    )
    : items

  // Handle item selection
  const handleSelect = useCallback((item: T) => {
    onSelect(item)
    setIsOpen(false)
    setHighlightedIndex(-1)
  }, [onSelect])

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setIsOpen(true)
      setHighlightedIndex(0)
      e.preventDefault()
      return
    }

    if (!isOpen) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex(prev =>
          prev < filteredItems.length - 1 ? prev + 1 : prev,
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : 0))
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0 && filteredItems[highlightedIndex]) {
          handleSelect(filteredItems[highlightedIndex])
        }
        break
      case 'Escape':
        e.preventDefault()
        setIsOpen(false)
        setHighlightedIndex(-1)
        break
    }
  }

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setHighlightedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle input focus
  const handleFocus = () => {
    if (!loading && !error) {
      setIsOpen(true)
    }
  }

  return (
    <div ref={containerRef} style={{ marginBottom: spacing.lg, position: 'relative' as const }}>
      {/* Label */}
      <label
        htmlFor={instanceId}
        style={{
          display: 'block',
          marginBottom: spacing.sm,
          fontSize: typography.fontSize.sm,
          fontWeight: typography.fontWeight.medium,
          color: themeColors.text.secondary,
        }}
      >
        {label}
      </label>

      {/* Input */}
      <input
        ref={inputRef}
        id={instanceId}
        type="text"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled || loading}
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-autocomplete="list"
        aria-activedescendant={
          highlightedIndex >= 0 ? `${instanceId}-option-${highlightedIndex}` : undefined
        }
        style={{
          width: '100%',
          padding: spacing.md,
          fontSize: typography.fontSize.base,
          border: `${borders.width.thin} solid ${themeColors.border.default}`,
          borderRadius: borders.radius.md,
          backgroundColor: disabled ? themeColors.background.secondary : themeColors.background.primary,
          color: themeColors.text.primary,
        }}
      />

      {/* Error Message */}
      {error && (
        <div
          style={{
            marginTop: spacing.sm,
            fontSize: typography.fontSize.sm,
            color: themeColors.semantic.error,
          }}
        >
          {error}
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div
          style={{
            marginTop: spacing.sm,
            fontSize: typography.fontSize.sm,
            color: themeColors.text.disabled,
          }}
        >
          Loading...
        </div>
      )}

      {/* Dropdown */}
      {isOpen && !loading && !error && (
        <div
          id={listboxId}
          role="listbox"
          style={{
            position: 'absolute' as const,
            zIndex: 1000,
            width: '100%',
            maxHeight: '200px',
            overflowY: 'auto' as const,
            marginTop: spacing.sm,
            backgroundColor: themeColors.background.primary,
            border: `${borders.width.thin} solid ${themeColors.border.default}`,
            borderRadius: borders.radius.md,
            boxShadow: shadows.md,
          }}
        >
          {filteredItems.length === 0
            ? (
            <div
              style={{
                padding: spacing.md,
                fontSize: typography.fontSize.sm,
                color: themeColors.text.disabled,
                textAlign: 'center' as const,
              }}
            >
              {emptyMessage}
            </div>
              )
            : (
                filteredItems.map((item, index) => {
                  const prefix = getItemPrefix ? getItemPrefix(item) : ''
                  const label = getItemLabel(item)
                  return (
                    <div
                      key={getItemKey ? getItemKey(item) : index}
                      id={`${instanceId}-option-${index}`}
                      role="option"
                      aria-selected={highlightedIndex === index}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      style={{
                        padding: spacing.md,
                        fontSize: typography.fontSize.sm,
                        color: themeColors.text.primary,
                        backgroundColor:
                          highlightedIndex === index ? themeColors.neutral[100] : 'transparent',
                        cursor: 'pointer',
                        borderBottom:
                          index < filteredItems.length - 1
                            ? `${borders.width.thin} solid ${themeColors.border.default}`
                            : 'none',
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {prefix && <span style={{ marginRight: spacing.sm }}>{prefix}</span>}
                      {label}
                    </div>
                  )
                })
              )}
        </div>
      )}
    </div>
  )
}
