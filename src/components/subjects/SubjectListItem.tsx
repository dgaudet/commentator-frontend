/**
 * SubjectListItem Component
 * Displays a single subject in the list with formatted dates
 * Reference: US-REFACTOR-006, US-SUBJ-DELETE-001, US-TAB-002, US-TABPANEL-002, US-TABPANEL-003, US-TOKEN-006
 *
 * Key Changes:
 * - Subject has no year field, so year display removed
 * - Delete button relocated beside subject name (US-SUBJ-DELETE-001)
 * - Action buttons replaced with tabbed interface (US-TAB-002)
 * - Tab panels display content below tabs (US-TABPANEL-002)
 * - Tab panels update when subject changes (US-TABPANEL-003)
 * - Migrated to design tokens for theme support (US-TOKEN-006)
 * Performance: Memoized to prevent unnecessary re-renders
 */
import React, { useMemo, useCallback, useState, useEffect } from 'react'
import { Subject } from '../../types/Subject'
import { formatDate } from '../../utils/dateFormatter'
import { useThemeColors } from '../../hooks/useThemeColors'
import { spacing, borders } from '../../theme/tokens'
import { Tabs, Tab } from '../common/Tabs'
import { TabPanel } from '../common/TabPanel'
import { Button } from '../common/Button'
import { SubjectForm } from './SubjectForm'
import { OutcomeCommentsModal } from '../outcomeComments/OutcomeCommentsModal'
import { PersonalizedCommentsModal } from '../personalizedComments/PersonalizedCommentsModal'
import { ClassManagementModal } from '../classes/ClassManagementModal'
import type { OutcomeComment, PersonalizedComment, Class, FinalComment, Pronoun, CreateOutcomeCommentRequest, UpdateOutcomeCommentRequest, CreatePersonalizedCommentRequest, UpdatePersonalizedCommentRequest, CreateClassRequest, UpdateClassRequest, CreateFinalCommentRequest, UpdateFinalCommentRequest } from '../../types'

interface SubjectListItemProps {
  subjectItem: Subject
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onView?: (id: string) => void
  onViewOutcomeComments?: (id: string) => void
  onViewPersonalizedComments?: (id: string) => void
  onViewClasses?: (id: string) => void
  // Edit panel props
  onEditSuccess?: (subject: Subject) => void
  onEditCancel?: () => void
  // Outcome Comments panel props
  outcomeComments?: OutcomeComment[]
  onCreateOutcomeComment?: (request: CreateOutcomeCommentRequest) => Promise<void>
  onUpdateOutcomeComment?: (id: string, request: UpdateOutcomeCommentRequest) => Promise<void>
  onDeleteOutcomeComment?: (id: string) => Promise<void>
  outcomeCommentsLoading?: boolean
  outcomeCommentsError?: string | null
  // Story 1: Replace Pronouns Button props
  pronouns?: Pronoun[]
  pronounsLoading?: boolean
  pronounsError?: string | null
  // Personalized Comments panel props
  personalizedComments?: PersonalizedComment[]
  onCreatePersonalizedComment?: (request: CreatePersonalizedCommentRequest) => Promise<void>
  onUpdatePersonalizedComment?: (id: string, request: UpdatePersonalizedCommentRequest) => Promise<void>
  onDeletePersonalizedComment?: (id: string) => Promise<void>
  personalizedCommentsLoading?: boolean
  personalizedCommentsError?: string | null
  // US-CP-002: Copy Comments feature - list of subjects owned by user
  ownedSubjects?: Subject[]
  // Classes panel props
  classes?: Class[]
  onCreateClass?: (request: CreateClassRequest) => Promise<void>
  onUpdateClass?: (id: string, request: UpdateClassRequest) => Promise<void>
  onDeleteClass?: (id: string) => Promise<void>
  checkFinalCommentsCount?: (classId: string) => Promise<number>
  classesLoading?: boolean
  classesError?: string | null
  onViewFinalComments?: (classData: Class) => void
  // US-CLASS-TABS-003: Final Comments tab props for embedded mode
  finalComments?: FinalComment[]
  onCreateFinalComment?: (request: CreateFinalCommentRequest) => Promise<void>
  onUpdateFinalComment?: (id: string, request: UpdateFinalCommentRequest) => Promise<void>
  onDeleteFinalComment?: (id: string) => Promise<void>
  finalCommentsLoading?: boolean
  finalCommentsError?: string | null
}

export const SubjectListItem: React.FC<SubjectListItemProps> = React.memo(({
  subjectItem,
  onEdit,
  onDelete,
  onView,
  onViewOutcomeComments,
  onViewPersonalizedComments,
  onViewClasses,
  // Edit panel props
  onEditSuccess,
  onEditCancel: _onEditCancel, // No longer used - SubjectForm has no cancel button
  // Outcome Comments panel props
  outcomeComments = [],
  onCreateOutcomeComment,
  onUpdateOutcomeComment,
  onDeleteOutcomeComment,
  outcomeCommentsLoading = false,
  outcomeCommentsError = null,
  // Story 1: Replace Pronouns Button props
  pronouns = [],
  pronounsLoading = false,
  pronounsError = null,
  // Personalized Comments panel props
  personalizedComments = [],
  onCreatePersonalizedComment,
  onUpdatePersonalizedComment,
  onDeletePersonalizedComment,
  personalizedCommentsLoading = false,
  personalizedCommentsError = null,
  // US-CP-002: Copy Comments feature
  ownedSubjects = [],
  // Classes panel props
  classes = [],
  onCreateClass,
  onUpdateClass,
  onDeleteClass,
  checkFinalCommentsCount,
  classesLoading = false,
  classesError = null,
  onViewFinalComments,
  // US-CLASS-TABS-003: Final Comments tab props for embedded mode
  finalComments = [],
  onCreateFinalComment,
  onUpdateFinalComment,
  onDeleteFinalComment,
  finalCommentsLoading = false,
  finalCommentsError = null,
}) => {
  /**
   * Build tabs array dynamically based on provided callbacks
   * Only includes tabs for callbacks that are provided
   */
  const tabs = useMemo<Tab[]>(() => {
    const tabsList: Tab[] = []

    if (onEdit) {
      tabsList.push({ id: 'edit', label: 'Edit Subject' })
    }
    if (onViewOutcomeComments) {
      tabsList.push({ id: 'outcome', label: 'Outcome Comments' })
    }
    if (onViewPersonalizedComments) {
      tabsList.push({ id: 'personalized', label: 'Personalized Comments' })
    }
    if (onViewClasses) {
      tabsList.push({ id: 'classes', label: 'Manage Classes' })
    }

    return tabsList
  }, [onEdit, onViewOutcomeComments, onViewPersonalizedComments, onViewClasses])

  /**
   * Memoized key for Tabs component to avoid recalculating on every render
   * Only recomputes when tabs array changes
   */
  const tabsKey = useMemo(() => tabs.map((t) => t.id).join('-'), [tabs])

  /**
   * Track active tab state (US-TABPANEL-002)
   * Default to first tab if tabs exist
   */
  const [requestedTab, setRequestedTab] = useState<string>(tabs[0]?.id || '')

  /**
   * Compute actual active tab (US-TABPANEL-003)
   * If requested tab no longer exists, use first available tab
   */
  const activeTab = useMemo(() => {
    if (tabs.length === 0) return ''

    // Check if requested tab still exists in tabs array
    const tabExists = tabs.some((tab) => tab.id === requestedTab)

    // If requested tab exists, use it; otherwise use first tab
    return tabExists ? requestedTab : tabs[0].id
  }, [tabs, requestedTab])

  /**
   * Reset requestedTab when tabs change and requested tab no longer exists
   * This keeps requestedTab in sync with activeTab
   */
  useEffect(() => {
    if (tabs.length === 0) {
      setRequestedTab('')
      return
    }

    // If requested tab doesn't exist in current tabs, reset to first tab
    const tabExists = tabs.some((tab) => tab.id === requestedTab)
    if (!tabExists) {
      setRequestedTab(tabs[0].id)
    }
  }, [tabs, requestedTab])

  /**
   * Handle tab selection - update active tab state and trigger data loading
   * US-TABPANEL-002: Switches tab panels and loads data for non-edit tabs
   */
  const handleTabChange = useCallback((tabId: string) => {
    setRequestedTab(tabId)

    // Trigger data loading for tabs that need it (edit tab uses inline form, no loading needed)
    switch (tabId) {
      case 'outcome':
        onViewOutcomeComments?.(subjectItem.id)
        break
      case 'personalized':
        onViewPersonalizedComments?.(subjectItem.id)
        break
      case 'classes':
        onViewClasses?.(subjectItem.id)
        break
    }
  }, [subjectItem.id, onViewOutcomeComments, onViewPersonalizedComments, onViewClasses])

  const themeColors = useThemeColors()

  const containerStyle: React.CSSProperties = {
    marginBottom: spacing.xl,
  }

  const headerStyle: React.CSSProperties = {
    marginBottom: spacing.lg,
  }

  const titleRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.lg,
    marginBottom: spacing.md,
  }

  const titleStyle: React.CSSProperties = {
    fontSize: '1.875rem',
    fontWeight: 'bold',
    color: themeColors.text.primary,
    cursor: onView ? 'pointer' : 'default',
    margin: 0,
  }

  const dateStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    color: themeColors.text.secondary,
  }

  const cardStyle: React.CSSProperties = {
    border: `${borders.width.thin} solid ${themeColors.border.default}`,
    borderRadius: borders.radius.md,
    padding: spacing.xl,
    backgroundColor: themeColors.background.primary,
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  }

  return (
    <div style={containerStyle} data-testid={`subject-item-${subjectItem.id}`}>
      {/* Subject info section - OUTSIDE the bordered card */}
      <div style={headerStyle}>
        {/* Subject name + delete button on same line (US-STYLE-002 AC3) */}
        <div style={titleRowStyle}>
          <h3
            onClick={() => onView?.(subjectItem.id)}
            role={onView ? 'button' : undefined}
            tabIndex={onView ? 0 : undefined}
            onKeyDown={(e) => {
              if (onView && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault()
                onView(subjectItem.id)
              }
            }}
            style={titleStyle}
          >
            {subjectItem.name}
          </h3>

          {/* Delete button beside subject name (US-SUBJ-DELETE-001, US-STYLE-001 AC3) */}
          {onDelete && (
            <Button
              onClick={() => onDelete(subjectItem.id)}
              variant="danger"
              aria-label={`Delete ${subjectItem.name}`}
              data-position="beside-name"
            >
              Delete
            </Button>
          )}
        </div>

        {/* Created date (US-STYLE-003: Updated date removed) */}
        <div style={dateStyle}>
          <p style={{ margin: 0 }}>Created: {formatDate(subjectItem.createdAt)}</p>
        </div>
      </div>

      {/* Tabs and Panels section - INSIDE bordered card */}
      {tabs.length > 0 && (
        <div style={cardStyle}>
          {/* Tabbed interface (US-TAB-002) */}
          <div style={{ marginBottom: '1rem' }}>
            <Tabs
              key={tabsKey}
              tabs={tabs}
              defaultTab={activeTab}
              onChange={handleTabChange}
            />
          </div>

          {/* Tab Panels (US-TABPANEL-002) - Display content below tabs */}
          <>
            {/* Edit Panel */}
            {onEdit && (
              <TabPanel id="edit" activeTabId={activeTab} tabId="edit">
              <div data-testid="edit-panel-content">
                {onEditSuccess
                  ? (
                    <SubjectForm
                      existingSubject={subjectItem}
                      onSuccess={onEditSuccess}
                      onCancel={_onEditCancel}
                    />
                    )
                  : (
                    <>
                      <h4 className="text-lg font-semibold mb-2">Edit Subject: {subjectItem.name}</h4>
                      <p className="text-gray-600">Edit form will appear here (SubjectForm component)</p>
                    </>
                    )}
              </div>
            </TabPanel>
            )}

          {/* Outcome Comments Panel */}
          {onViewOutcomeComments && (
            <TabPanel id="outcome" activeTabId={activeTab} tabId="outcome">
              <div data-testid="outcome-comments-panel-content">
                {onCreateOutcomeComment && onUpdateOutcomeComment && onDeleteOutcomeComment
                  ? (
                  <OutcomeCommentsModal
                    isOpen={true}
                    entityData={subjectItem}
                    outcomeComments={outcomeComments}
                    onCreateComment={onCreateOutcomeComment}
                    onUpdateComment={onUpdateOutcomeComment}
                    onDeleteComment={onDeleteOutcomeComment}
                    loading={outcomeCommentsLoading}
                    error={outcomeCommentsError}
                    pronouns={pronouns}
                    pronounsLoading={pronounsLoading}
                    pronounsError={pronounsError}
                  />
                    )
                  : (
                  <>
                    <h4 className="text-lg font-semibold mb-2">Outcome Comments</h4>
                    <p className="text-gray-600">Subject ID: {subjectItem.id}</p>
                    <p className="text-gray-600">Outcome comments management will appear here</p>
                  </>
                    )}
              </div>
            </TabPanel>
          )}

          {/* Personalized Comments Panel */}
          {onViewPersonalizedComments && (
            <TabPanel id="personalized" activeTabId={activeTab} tabId="personalized">
              <div data-testid="personalized-comments-panel-content">
                {onCreatePersonalizedComment && onUpdatePersonalizedComment && onDeletePersonalizedComment
                  ? (
                  <PersonalizedCommentsModal
                    isOpen={true}
                    entityData={subjectItem}
                    personalizedComments={personalizedComments}
                    onCreateComment={onCreatePersonalizedComment}
                    onUpdateComment={onUpdatePersonalizedComment}
                    onDeleteComment={onDeletePersonalizedComment}
                    loading={personalizedCommentsLoading}
                    error={personalizedCommentsError}
                    ownedSubjects={ownedSubjects}
                  />
                    )
                  : (
                  <>
                    <h4 className="text-lg font-semibold mb-2">Personalized Comments</h4>
                    <p className="text-gray-600">Subject ID: {subjectItem.id}</p>
                    <p className="text-gray-600">Personalized comments management will appear here</p>
                  </>
                    )}
              </div>
            </TabPanel>
          )}

          {/* Manage Classes Panel */}
          {onViewClasses && (
            <TabPanel id="classes" activeTabId={activeTab} tabId="classes">
              <div data-testid="classes-panel-content">
                {onCreateClass && onUpdateClass && onDeleteClass
                  ? (
                  <ClassManagementModal
                    isOpen={true}
                    entityData={subjectItem}
                    classes={classes}
                    onCreateClass={onCreateClass}
                    onUpdateClass={onUpdateClass}
                    onDeleteClass={onDeleteClass}
                    checkFinalCommentsCount={checkFinalCommentsCount}
                    onViewFinalComments={onViewFinalComments}
                    loading={classesLoading}
                    error={classesError}
                    finalComments={finalComments}
                    onCreateFinalComment={onCreateFinalComment}
                    onUpdateFinalComment={onUpdateFinalComment}
                    onDeleteFinalComment={onDeleteFinalComment}
                    finalCommentsLoading={finalCommentsLoading}
                    finalCommentsError={finalCommentsError}
                  />
                    )
                  : (
                  <>
                    <h4 className="text-lg font-semibold mb-2">Manage Classes</h4>
                    <p className="text-gray-600">Subject ID: {subjectItem.id}</p>
                    <p className="text-gray-600">Class management will appear here</p>
                  </>
                    )}
              </div>
            </TabPanel>
          )}
          </>
        </div>
      )}
    </div>
  )
})
