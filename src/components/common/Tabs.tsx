/**
 * Tabs Component
 * Reusable tabbed interface with full keyboard navigation and accessibility
 * Reference: US-TAB-001, US-TOKEN-004
 *
 * Features:
 * - Keyboard accessible (Arrow keys, Home, End, Enter, Space)
 * - WCAG 2.1 AA compliant with proper ARIA attributes
 * - Supports disabled tabs
 * - Unique IDs per instance using React 18 useId()
 * - Theme-adaptive styling with design tokens
 *
 * @example
 * ```tsx
 * <Tabs
 *   tabs={[
 *     { id: 'edit', label: 'Edit' },
 *     { id: 'view', label: 'View', disabled: true }
 *   ]}
 *   defaultTab="edit"
 *   onChange={(tabId) => console.log('Selected:', tabId)}
 * />
 * ```
 */
import React, { useState, useId, useRef, KeyboardEvent, useCallback, useEffect } from 'react'
import { useThemeColors } from '../../hooks/useThemeColors'
import { useThemeFocusRings } from '../../hooks/useThemeFocusRings'
import { spacing, typography, borders } from '../../theme/tokens'

/**
 * Individual tab definition
 */
export interface Tab {
  /** Unique identifier for the tab */
  id: string
  /** Display label for the tab */
  label: string
  /** Whether the tab is disabled and cannot be selected */
  disabled?: boolean
  /** Optional icon to display before the label */
  icon?: React.ReactNode
}

/**
 * Props for the Tabs component
 */
interface TabsProps {
  /** Array of tab definitions to render */
  tabs: Tab[]
  /** ID of the tab to select by default (defaults to first tab) */
  defaultTab?: string
  /** Callback fired when a tab is selected */
  onChange: (tabId: string) => void
  /** Orientation of the tabs */
  orientation?: 'horizontal' | 'vertical'
  /** Visual style variant - reserved for future use */
  _variant?: 'default' | 'pills'
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  onChange,
  orientation = 'horizontal',
  // variant is reserved for future styling variants
  _variant = 'default',
}) => {
  const themeColors = useThemeColors()
  const focusRings = useThemeFocusRings()
  const baseId = useId()
  const [selectedTab, setSelectedTab] = useState<string>(defaultTab || tabs[0]?.id)
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map())

  // Style definitions using design tokens
  const tablistStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: orientation === 'vertical' ? 'column' : 'row',
    borderBottom: orientation === 'horizontal' ? `${borders.width.thin} solid ${themeColors.border.default}` : 'none',
    borderRight: orientation === 'vertical' ? `${borders.width.thin} solid ${themeColors.border.default}` : 'none',
  }

  const getTabStyle = (isSelected: boolean, isDisabled: boolean): React.CSSProperties => ({
    appearance: 'none' as const,
    background: 'transparent',
    border: 'none',
    borderTop: 'none',
    borderLeft: 'none',
    borderRight: 'none',
    borderBottom: orientation === 'horizontal' ? '3px solid transparent' : 'none',
    borderRadius: 0,
    boxShadow: 'none',
    padding: `${spacing.md} ${spacing.lg}`,
    marginBottom: orientation === 'horizontal' ? '-1px' : undefined,
    marginRight: orientation === 'vertical' ? '-1px' : undefined,
    position: 'relative' as const,
    fontSize: typography.fontSize.base,
    fontWeight: isSelected ? typography.fontWeight.semibold : typography.fontWeight.medium,
    transition: 'color 0.2s ease, border-color 0.2s ease, box-shadow 0.15s ease',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    opacity: isDisabled ? 0.5 : 1,
    color: isSelected ? themeColors.primary.main : themeColors.text.tertiary,
    borderBottomColor: orientation === 'horizontal' ? (isSelected ? themeColors.primary.main : 'transparent') : undefined,
  })

  /**
   * Sync internal state when defaultTab prop changes (US-TABPANEL-003)
   * Ensures visual tab selection stays in sync with parent component state
   * Note: Only depends on defaultTab, not selectedTab, to avoid resetting user selections
   */
  useEffect(() => {
    if (defaultTab) {
      setSelectedTab(defaultTab)
    }
  }, [defaultTab])

  // Get list of enabled tabs for keyboard navigation
  const enabledTabs = tabs.filter((tab) => !tab.disabled)

  /**
   * Handle tab selection
   */
  const handleTabClick = useCallback(
    (tabId: string, disabled?: boolean) => {
      if (disabled) return

      setSelectedTab(tabId)
      onChange(tabId)
    },
    [onChange],
  )

  /**
   * Handle keyboard navigation (Arrow keys, Home, End, Enter, Space)
   * Follows WAI-ARIA Authoring Practices for tabs pattern
   */
  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
      const currentTabIdInEnabled = tabs[currentIndex].id
      const currentEnabledIndex = enabledTabs.findIndex((tab) => tab.id === currentTabIdInEnabled)

      let nextEnabledIndex: number | null = null

      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          event.preventDefault()
          // Move to next enabled tab, wrap to first
          nextEnabledIndex = (currentEnabledIndex + 1) % enabledTabs.length
          break

        case 'ArrowLeft':
        case 'ArrowUp':
          event.preventDefault()
          // Move to previous enabled tab, wrap to last
          nextEnabledIndex = (currentEnabledIndex - 1 + enabledTabs.length) % enabledTabs.length
          break

        case 'Home':
          event.preventDefault()
          // Jump to first enabled tab
          nextEnabledIndex = 0
          break

        case 'End':
          event.preventDefault()
          // Jump to last enabled tab
          nextEnabledIndex = enabledTabs.length - 1
          break

        case 'Enter':
        case ' ':
          event.preventDefault()
          // Activate current tab
          if (!tabs[currentIndex].disabled) {
            handleTabClick(tabs[currentIndex].id)
          }
          return

        default:
          // Ignore other keys
          return
      }

      // Focus the next tab if navigation key was pressed
      if (nextEnabledIndex !== null) {
        const nextTab = enabledTabs[nextEnabledIndex]
        const nextTabElement = tabRefs.current.get(nextTab.id)
        nextTabElement?.focus()
      }
    },
    [tabs, enabledTabs, handleTabClick],
  )

  /**
   * Store tab button refs for keyboard navigation
   */
  const setTabRef = useCallback((tabId: string, element: HTMLButtonElement | null) => {
    if (element) {
      tabRefs.current.set(tabId, element)
    } else {
      tabRefs.current.delete(tabId)
    }
  }, [])

  const iconStyle: React.CSSProperties = {
    marginRight: spacing.sm,
    display: 'inline-block',
  }

  return (
    <>
      <style>
        {`
          [role="tab"]::after {
            content: attr(data-label);
            display: block;
            font-weight: 600;
            height: 0;
            visibility: hidden;
            overflow: hidden;
            user-select: none;
            pointer-events: none;
          }
        `}
      </style>
      <div
        role="tablist"
        aria-orientation={orientation}
        id={`${baseId}-tablist`}
        style={tablistStyle}
        data-orientation={orientation}
      >
        {tabs.map((tab, index) => {
          const isSelected = selectedTab === tab.id
          const isDisabled = tab.disabled || false
          const tabStyle = getTabStyle(isSelected, isDisabled)

          return (
            <button
              key={tab.id}
              ref={(el) => setTabRef(tab.id, el)}
              role="tab"
              aria-selected={isSelected}
              aria-disabled={isDisabled}
              aria-controls={`${baseId}-tabpanel-${tab.id}`}
              id={`${baseId}-tab-${tab.id}`}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => handleTabClick(tab.id, isDisabled)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              disabled={isDisabled}
              style={tabStyle}
              data-label={tab.label}
              onMouseEnter={(e) => {
                if (!isDisabled) {
                  // Hover effect: use darker primary for visual emphasis (similar to original navy)
                  e.currentTarget.style.color = themeColors.primary.dark
                }
              }}
              onMouseLeave={(e) => {
                if (!isDisabled) {
                  // Return to normal color based on selection state
                  e.currentTarget.style.color = isSelected ? themeColors.primary.main : themeColors.text.tertiary
                }
              }}
              onFocus={(e) => {
                if (!isDisabled && !isSelected) {
                  // Focus ring: only visible on inactive tabs (selected tab has blue underline as indicator)
                  // Uses theme-aware focus ring with proper rgba formatting
                  e.currentTarget.style.boxShadow = focusRings.primary
                }
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {tab.icon && <span style={iconStyle} aria-hidden="true">{tab.icon}</span>}
              {tab.label}
            </button>
          )
        })}
      </div>
    </>
  )
}
