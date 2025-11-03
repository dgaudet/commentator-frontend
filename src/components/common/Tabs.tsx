/**
 * Tabs Component
 * Reusable tabbed interface with full keyboard navigation and accessibility
 * Reference: US-TAB-001
 *
 * Features:
 * - Keyboard accessible (Arrow keys, Home, End, Enter, Space)
 * - WCAG 2.1 AA compliant with proper ARIA attributes
 * - Supports disabled tabs
 * - Unique IDs per instance using React 18 useId()
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
import React, { useState, useId, useRef, KeyboardEvent, useCallback } from 'react'
import styles from './Tabs.module.css'

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
  /** Visual style variant */
  variant?: 'default' | 'pills'
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  onChange,
  orientation = 'horizontal',
  // variant is reserved for future styling variants
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  variant = 'default',
}) => {
  const baseId = useId()
  const [selectedTab, setSelectedTab] = useState<string>(defaultTab || tabs[0]?.id)
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map())

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

  return (
    <div
      role="tablist"
      aria-orientation={orientation}
      id={`${baseId}-tablist`}
      className={styles.tablist}
      data-orientation={orientation}
    >
      {tabs.map((tab, index) => {
        const isSelected = selectedTab === tab.id
        const isDisabled = tab.disabled || false

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
            className={styles.tab}
          >
            {tab.icon && <span className={styles.tabIcon} aria-hidden="true">{tab.icon}</span>}
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
