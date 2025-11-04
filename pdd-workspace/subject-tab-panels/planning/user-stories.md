# User Stories: Subject Tab Panel Content Switching

**Feature**: Subject Tab Panel Content Switching
**Complexity**: L0-ATOMIC (< 1 day, 6 story points)
**Status**: Planning In Progress
**Created**: 2025-11-03

---

## Overview

Add TabPanel components to display different content below the tabs in SubjectListItem. When a tab is selected, the corresponding component should render below the tabs, replacing the previous content.

**Current State**: SubjectListItem has tabs (Edit, Outcome Comments, Personalized Comments, Manage Classes) created by US-TAB-001/002. Tabs trigger callbacks but don't show/hide content panels below them.

**Target State**: Clicking a tab displays the corresponding component below the tabs. Only the active tab's content is rendered. Switching subjects reloads panels with new subject data.

**Dependencies**: Requires `subject-tabs-ui` feature (US-TAB-001, US-TAB-002) to be complete.

---

## User Stories

### US-TABPANEL-001: Create TabPanel Component for Content Switching
**Priority**: HIGH (MVP - Foundation)
**Story Points**: 2
**Assignee**: Frontend Engineer

**As a** developer
**I want** a TabPanel component that shows/hides content based on active tab
**So that** I can display different components for each tab selection

#### Acceptance Criteria (EARS Format)

**WHEN** a TabPanel component is rendered with an active tab ID
**THE SYSTEM SHALL**:
- Render child content only if the panel's ID matches the active tab
- Hide content when the panel's ID doesn't match the active tab
- Unmount the component when hidden (no content preservation)
- Apply proper ARIA attributes (role="tabpanel", aria-labelledby)

**WHEN** the active tab changes
**THE SYSTEM SHALL**:
- Unmount the previous TabPanel component
- Mount the new TabPanel component corresponding to the selected tab
- Trigger any initialization logic in the newly mounted component

**WHEN** multiple TabPanel components are siblings
**THE SYSTEM SHALL**:
- Ensure only one TabPanel is visible at a time
- Use consistent spacing below the tabs
- Maintain proper semantic HTML structure

**WHEN** TabPanel receives updated props
**THE SYSTEM SHALL**:
- Re-render with new props (e.g., updated subject data)
- Maintain accessibility attributes
- Preserve component hierarchy

#### Technical Requirements
- Location: `src/components/common/TabPanel.tsx`
- Props interface:
  ```typescript
  interface TabPanelProps {
    id: string              // Panel ID (matches tab ID)
    activeTabId: string     // Currently active tab ID
    tabId: string           // Associated tab ID for ARIA
    children: React.ReactNode
    className?: string      // Optional additional styling
  }
  ```
- TypeScript interfaces with proper typing
- ARIA attributes: `role="tabpanel"`, `aria-labelledby`, `id`, `hidden`

#### Definition of Done
- [ ] TabPanel component created with TypeScript
- [ ] Shows/hides content based on activeTabId
- [ ] Components unmount when hidden
- [ ] ARIA attributes properly applied
- [ ] Unit tests pass (≥90% coverage)
- [ ] Linting passes (0 errors)
- [ ] Code review completed

---

### US-TABPANEL-002: Integrate Existing Components into Tab Panels
**Priority**: HIGH (MVP)
**Story Points**: 3
**Assignee**: Frontend Engineer
**Dependencies**: US-TABPANEL-001

**As a** teacher
**I want** to see different content below the tabs based on my selection
**So that** I can access Edit, Outcome Comments, Personalized Comments, and Manage Classes views

#### Acceptance Criteria (EARS Format)

**WHEN** a user clicks the "Edit" tab
**THE SYSTEM SHALL**:
- Display the Edit Subject form/component below the tabs
- Hide all other tab panel content
- Pass the current subject data to the Edit component
- Maintain the edit component's existing functionality

**WHEN** a user clicks the "Outcome Comments" tab
**THE SYSTEM SHALL**:
- Display the Outcome Comments component below the tabs
- Hide all other tab panel content
- Pass the current subject ID to the Outcome Comments component
- Show the list of outcome comments for the selected subject

**WHEN** a user clicks the "Personalized Comments" tab
**THE SYSTEM SHALL**:
- Display the Personalized Comments component below the tabs
- Hide all other tab panel content
- Pass the current subject ID to the Personalized Comments component
- Show the list of personalized comments for the selected subject

**WHEN** a user clicks the "Manage Classes" tab
**THE SYSTEM SHALL**:
- Display the Manage Classes component below the tabs
- Hide all other tab panel content
- Pass the current subject ID to the Manage Classes component
- Show the classes associated with the selected subject

**WHEN** tabs are displayed in SubjectListItem
**THE SYSTEM SHALL**:
- Render TabPanel components below the tabs
- Apply consistent spacing (e.g., mt-4 for visual separation)
- Maintain responsive layout on mobile devices
- Keep the tab panels within the SubjectListItem container

**WHEN** no tab is actively selected
**THE SYSTEM SHALL**:
- Show no tab panel content (or show a default "Select a tab" message)
- OR default to showing the first tab's content

#### Component Integration Details

**Edit Tab Panel**:
- Component: `EditSubjectForm` or existing edit component
- Props: `subject` (Subject object), `onSave`, `onCancel`

**Outcome Comments Tab Panel**:
- Component: `OutcomeCommentsManagement` or similar
- Props: `subjectId` (number)

**Personalized Comments Tab Panel**:
- Component: `PersonalizedCommentsManagement` or similar
- Props: `subjectId` (number)

**Manage Classes Tab Panel**:
- Component: `ManageClassesView` or similar
- Props: `subjectId` (number)

#### Technical Requirements
- Update: `src/components/subjects/SubjectListItem.tsx`
- Import TabPanel component
- Map tab IDs to corresponding components
- Track active tab state (useState or lift to parent)
- Pass subject context as props

#### Definition of Done
- [ ] All 4 tab panels integrated into SubjectListItem
- [ ] Clicking tabs switches visible content
- [ ] Only one panel visible at a time
- [ ] Subject data/ID passed correctly to each panel
- [ ] Existing component functionality preserved
- [ ] Responsive layout maintained
- [ ] Unit tests updated and passing (≥90% coverage)
- [ ] E2E tests for tab switching (Playwright)
- [ ] Linting passes (0 errors)
- [ ] Code review completed

---

### US-TABPANEL-003: Handle Subject Context Switching
**Priority**: MEDIUM (Enhancement)
**Story Points**: 1
**Assignee**: Frontend Engineer
**Dependencies**: US-TABPANEL-001, US-TABPANEL-002

**As a** teacher
**I want** tab panels to update when I select a different subject
**So that** I always see content relevant to the currently selected subject

#### Acceptance Criteria (EARS Format)

**WHEN** a user selects a different subject from the subject list
**THE SYSTEM SHALL**:
- Unmount all existing tab panels
- Remount tab panels with the new subject's data
- Reset the active tab to the first tab (or maintain selection if applicable)
- Trigger any data fetching for the new subject

**WHEN** subject data is updated (e.g., via edit)
**THE SYSTEM SHALL**:
- Refresh the tab panels with updated subject data
- Maintain the currently active tab selection
- Re-render components with new data

**WHEN** switching between subjects rapidly
**THE SYSTEM SHALL**:
- Cancel any pending data fetches for the previous subject
- Ensure no stale data is displayed
- Prevent race conditions in data loading

**WHEN** a subject is deleted
**THE SYSTEM SHALL**:
- Remove the SubjectListItem and all tab panels
- Update the subject list
- Select the next subject (if applicable)

#### Technical Requirements
- Use React keys to force remounting on subject change
- Key format: `${subjectId}-${tabId}` for each TabPanel
- Implement cleanup in useEffect hooks if data fetching
- Consider using AbortController for fetch cancellation

#### Edge Cases to Handle
1. **Subject ID Changes**: Remount all panels with new ID
2. **Rapid Switching**: Debounce or cancel pending requests
3. **Deleted Subject**: Clean up state and close panels
4. **Network Errors**: Show error state in panels

#### Definition of Done
- [ ] Selecting different subjects reloads tab panels
- [ ] Subject data correctly passed to panels
- [ ] No stale data displayed
- [ ] Race conditions prevented
- [ ] Keys used to force remounting
- [ ] Unit tests for subject switching
- [ ] E2E tests for multi-subject scenarios
- [ ] Linting passes (0 errors)
- [ ] Code review completed

---

## Story Breakdown by Phase

### Sprint 1 (MVP - < 1 day)
**Goal**: Implement tab panel content switching for SubjectListItem

**Must Have (HIGH Priority - 5 points)**:
1. US-TABPANEL-001: Create TabPanel Component (2 pts)
2. US-TABPANEL-002: Integrate Existing Components (3 pts)

**Should Have (MEDIUM Priority - 1 point)**:
3. US-TABPANEL-003: Handle Subject Context Switching (1 pt)

**Total MVP**: 6 story points (< 1 day)

---

## INVEST Criteria Validation

### US-TABPANEL-001: Create TabPanel Component
- **Independent**: ✅ Can be developed standalone
- **Negotiable**: ✅ Implementation details flexible
- **Valuable**: ✅ Enables content switching functionality
- **Estimable**: ✅ Clear scope (2 points)
- **Small**: ✅ Can be completed in 2-3 hours
- **Testable**: ✅ Clear show/hide behavior

### US-TABPANEL-002: Integrate Existing Components
- **Independent**: ⚠️ Depends on US-TABPANEL-001 (acceptable)
- **Negotiable**: ✅ Component mapping can be refined
- **Valuable**: ✅ Delivers core functionality to users
- **Estimable**: ✅ Clear scope (3 points)
- **Small**: ✅ Can be completed in 3-4 hours
- **Testable**: ✅ Clear integration requirements

### US-TABPANEL-003: Handle Subject Context Switching
- **Independent**: ⚠️ Depends on US-TABPANEL-002 (acceptable)
- **Negotiable**: ✅ Implementation approach flexible
- **Valuable**: ✅ Ensures data consistency
- **Estimable**: ✅ Clear scope (1 point)
- **Small**: ✅ Can be completed in 1-2 hours
- **Testable**: ✅ Clear switching behavior

---

## Success Metrics

### User Experience Metrics
- **Task Completion Rate**: 100% of users can switch between tab panels
- **Error Rate**: < 1% of tab panel switches result in errors
- **Load Time**: Tab panel content loads < 200ms

### Technical Metrics
- **Test Coverage**: ≥90% for TabPanel and integration
- **Performance**: No increase in render time (< 16ms per frame)
- **Bundle Size**: < 3 KB gzipped for TabPanel component

### Quality Metrics
- **Linting**: 0 errors
- **Test Pass Rate**: 100% (all tests passing)
- **Code Review Approval**: Required before merge

---

## Risk Assessment

### Technical Risks

**Risk 1: Component Unmounting Side Effects**
- **Probability**: Medium
- **Impact**: Medium
- **Mitigation**: Ensure proper cleanup in useEffect hooks, test component lifecycle
- **Contingency**: Add error boundaries to catch unmounting errors

**Risk 2: Subject Context Passing**
- **Probability**: Low
- **Impact**: Medium
- **Mitigation**: Use TypeScript to enforce proper prop types, test with different subject data
- **Contingency**: Lift state to parent component if context passing is complex

**Risk 3: Performance Impact**
- **Probability**: Low
- **Impact**: Low
- **Mitigation**: Use React.memo where appropriate, profile render times
- **Contingency**: Implement lazy loading if components are heavy

---

## Dependencies

### Internal Dependencies
- **Tabs Component** (US-TAB-001): Required for tab selection
- **SubjectListItem Integration** (US-TAB-002): Required for tab rendering
- **Existing Components**: Edit, Outcome Comments, Personalized Comments, Manage Classes components must exist

### External Dependencies
- **React 18**: Component lifecycle and hooks
- **TypeScript**: Type safety for props
- **React Testing Library**: Unit test framework

---

## Edge Cases to Consider

1. **No Active Tab**: Should first tab be selected by default or show empty state?
2. **Tab Panel Loading States**: Should show spinner while component initializes?
3. **Error States**: What if a panel component throws an error?
4. **Empty Subject Data**: How to handle panels when subject has no associated data?
5. **Rapid Tab Switching**: Should debounce or show all switches?
6. **Mobile Viewports**: Do panels need special mobile styling?
7. **Accessibility**: Should focus move to panel content when tab activates?

---

## Validation Plan

### Unit Tests (React Testing Library)
- TabPanel renders children when active
- TabPanel hides children when inactive
- Switching active tab unmounts/mounts correct panels
- Subject context passed correctly to panels
- ARIA attributes correctly applied

### E2E Tests (Playwright)
- User can switch between all 4 tab panels
- Content changes when tabs are clicked
- Switching subjects updates panel content
- Mobile viewport renders panels correctly

### Accessibility Tests
- TabPanel has proper ARIA attributes
- Focus management when tabs switch
- Screen reader announces panel changes

---

## Implementation Notes

### Recommended Component Structure

```tsx
// TabPanel.tsx
interface TabPanelProps {
  id: string
  activeTabId: string
  tabId: string
  children: React.ReactNode
  className?: string
}

export const TabPanel: React.FC<TabPanelProps> = ({
  id,
  activeTabId,
  tabId,
  children,
  className = '',
}) => {
  const isActive = id === activeTabId

  if (!isActive) return null

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
}
```

### Recommended SubjectListItem Integration

```tsx
// SubjectListItem.tsx
const [activeTab, setActiveTab] = useState<string>('edit')

<Tabs
  tabs={[...]}
  defaultTab="edit"
  onChange={(tabId) => setActiveTab(tabId)}
/>

<TabPanel id="edit" activeTabId={activeTab} tabId="edit">
  <EditSubjectForm subject={subject} onSave={...} />
</TabPanel>

<TabPanel id="outcome-comments" activeTabId={activeTab} tabId="outcome-comments">
  <OutcomeCommentsManagement subjectId={subject.id} />
</TabPanel>

{/* ... other panels */}
```

---

## Next Steps

1. **Planning Complete**: User stories created and prioritized
2. **Ready for Implementation**: Hand off to Frontend Engineer
3. **TDD Approach**: Write tests first (Red-Green-Refactor)
4. **Architecture Review**: SKIPPED (L0-ATOMIC complexity)

### Recommended Handoff

```bash
pdd handoff "frontend engineer" "Implement tab panel content switching for SubjectListItem. Create TabPanel component (US-TABPANEL-001), integrate 4 existing components (US-TABPANEL-002), and handle subject context switching (US-TABPANEL-003). Follow TDD methodology and maintain ≥90% test coverage."
```

---

**Status**: Ready for Implementation
**Estimated Effort**: < 1 day (6 story points)
**Risk Level**: Low
**Architecture Review**: Not Required (L0-ATOMIC)
