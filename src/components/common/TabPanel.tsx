/**
 * TabPanel Component
 * Shows/hides content based on active tab selection
 * Reference: US-TABPANEL-001
 *
 * Features:
 * - Conditional rendering based on activeTabId
 * - Components unmount when hidden (no preservation)
 * - WCAG 2.1 AA compliant with proper ARIA attributes
 * - Memoized to prevent unnecessary re-renders
 *
 * @example
 * ```tsx
 * const [activeTab, setActiveTab] = useState('edit')
 *
 * <Tabs tabs={tabs} onChange={setActiveTab} />
 *
 * <TabPanel id="edit" activeTabId={activeTab} tabId="edit">
 *   <EditForm subject={subject} />
 * </TabPanel>
 *
 * <TabPanel id="outcome" activeTabId={activeTab} tabId="outcome">
 *   <OutcomeComments subjectId={subject.id} />
 * </TabPanel>
 * ```
 */
import React from 'react'

/**
 * Props for the TabPanel component
 */
export interface TabPanelProps {
  /** Unique identifier for this panel (matches tab ID) */
  id: string
  /** Currently active tab ID */
  activeTabId: string
  /** Associated tab ID for ARIA relationship */
  tabId: string
  /** Content to display when panel is active */
  children: React.ReactNode
  /** Optional additional CSS classes */
  className?: string
}

/**
 * TabPanel component that shows/hides content based on active tab
 *
 * The component unmounts completely when hidden (returns null) rather than
 * just hiding with CSS. This ensures:
 * - Clean component lifecycle (mount/unmount)
 * - No stale state preserved between switches
 * - Better performance (no hidden DOM elements)
 *
 * Memoized to prevent unnecessary re-renders when parent components update
 * but TabPanel props remain unchanged.
 */
export const TabPanel = React.memo<TabPanelProps>(({
  id,
  activeTabId,
  tabId,
  children,
  className = '',
}) => {
  // Hide panel if not active (component unmounts completely)
  const isActive = id === activeTabId

  if (!isActive) {
    return null
  }

  // Render panel with proper ARIA attributes for accessibility
  return (
    <div
      role="tabpanel"
      id={`tabpanel-${id}`}
      aria-labelledby={`tab-${tabId}`}
      className={`mt-4 ${className}`}
    >
      {children}
    </div>
  )
})

// Display name for React DevTools
TabPanel.displayName = 'TabPanel'
