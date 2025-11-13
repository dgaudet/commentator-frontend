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
import { colors, spacing, typography, borders, shadows } from '../../theme/tokens'

// Generate unique ID for each TypeaheadSearch instance
let typeaheadIdCounter = 0

interface TypeaheadSearchProps<T> {
  // Data
  items: T[]
  getItemLabel: (item: T) => string

  // Search state
  searchQuery: string
  onSearchChange: (query: string) => void
  onSelect: (item: T) => void

  // UI customization
  label?: string
  placeholder?: string
  emptyMessage?: string
  id?: string // Optional unique ID for the input element

  // States
  loading?: boolean
  disabled?: boolean
  error?: string | null
}

export const TypeaheadSearch = <T, >({
  items,
  getItemLabel,
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
          color: colors.text.secondary,
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
          border: `${borders.width.thin} solid ${colors.border.default}`,
          borderRadius: borders.radius.md,
          backgroundColor: disabled ? colors.background.secondary : colors.background.primary,
          color: colors.text.primary,
        }}
      />

      {/* Error Message */}
      {error && (
        <div
          style={{
            marginTop: spacing.sm,
            fontSize: typography.fontSize.sm,
            color: colors.semantic.error,
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
            color: colors.text.disabled,
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
            backgroundColor: colors.background.primary,
            border: `${borders.width.thin} solid ${colors.border.default}`,
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
                color: colors.text.disabled,
                textAlign: 'center' as const,
              }}
            >
              {emptyMessage}
            </div>
              )
            : (
                filteredItems.map((item, index) => (
              <div
                key={index}
                id={`${instanceId}-option-${index}`}
                role="option"
                aria-selected={highlightedIndex === index}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setHighlightedIndex(index)}
                style={{
                  padding: spacing.md,
                  fontSize: typography.fontSize.sm,
                  color: colors.text.primary,
                  backgroundColor:
                    highlightedIndex === index ? colors.neutral[100] : 'transparent',
                  cursor: 'pointer',
                  borderBottom:
                    index < filteredItems.length - 1
                      ? `${borders.width.thin} solid ${colors.border.default}`
                      : 'none',
                }}
              >
                {getItemLabel(item)}
              </div>
                ))
              )}
        </div>
      )}
    </div>
  )
}
