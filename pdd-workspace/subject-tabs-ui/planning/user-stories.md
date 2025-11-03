# User Stories: Subject Tabs UI

**Feature**: Convert SubjectListItem Buttons to Tab Interface
**Complexity**: L1-MICRO (1 week, 10 story points)
**Status**: Planning Complete
**Created**: 2025-11-02

---

## Overview

Convert the SubjectListItem component's action button group into a tabbed interface for better organization and visual clarity while maintaining the same functionality and callbacks.

**Current State**: SubjectListItem displays action buttons (Edit, Outcome Comments, Personalized Comments, Manage Classes) in a horizontal button group on the right side.

**Target State**: Replace button group with a tab interface that maintains the same visual hierarchy and triggers the same callbacks.

---

## User Stories

### US-TAB-001: Create Reusable Tab Component
**Priority**: HIGH (MVP - Foundation)
**Story Points**: 3
**Assignee**: Frontend Engineer

**As a** developer
**I want** a reusable Tab component with proper accessibility
**So that** I can use tabs consistently across the application

#### Acceptance Criteria (EARS Format)

**WHEN** a developer imports and uses the Tab component
**THE SYSTEM SHALL** provide a flexible API with the following props:
- `tabs`: Array of tab definitions (id, label, content/callback, icon?, disabled?)
- `defaultTab`: Optional default selected tab ID
- `onChange`: Callback fired when tab selection changes
- `orientation`: Optional 'horizontal' | 'vertical' (default: 'horizontal')
- `variant`: Optional styling variant

**WHEN** a user interacts with tabs via mouse or keyboard
**THE SYSTEM SHALL**:
- Highlight the active tab visually (border/background/text color)
- Support keyboard navigation (Arrow keys, Home, End, Tab)
- Support Enter/Space to activate focused tab
- Emit onChange event with selected tab ID

**WHEN** the Tab component renders
**THE SYSTEM SHALL**:
- Apply proper ARIA attributes (role="tablist", role="tab", role="tabpanel")
- Support aria-selected, aria-controls, aria-labelledby
- Be fully keyboard accessible (WCAG 2.1 AA compliant)
- Support disabled tab states

**WHEN** multiple Tab instances exist on the page
**THE SYSTEM SHALL**:
- Use React 18's useId() for unique ID generation
- Prevent ARIA relationship conflicts
- Maintain independent state per instance

#### Technical Requirements
- Location: `src/components/common/Tabs.tsx`
- Styling: Use Tailwind CSS (consistent with existing components)
- Testing: Unit tests with React Testing Library (≥90% coverage)
- Accessibility: Pass axe-core automated accessibility checks

#### Definition of Done
- [ ] Tab component created with TypeScript interfaces
- [ ] Supports horizontal tab navigation
- [ ] Keyboard navigation implemented (Arrow keys, Enter, Space)
- [ ] ARIA attributes properly applied
- [ ] Unit tests pass (≥90% coverage)
- [ ] No accessibility violations (axe-core)
- [ ] Linting passes (0 errors)
- [ ] Code review completed

---

### US-TAB-002: Integrate Tabs into SubjectListItem
**Priority**: HIGH (MVP)
**Story Points**: 5
**Assignee**: Frontend Engineer
**Dependencies**: US-TAB-001

**As a** teacher
**I want** to see subject actions organized in tabs
**So that** I can easily access different subject management features

#### Acceptance Criteria (EARS Format)

**WHEN** a SubjectListItem is displayed
**THE SYSTEM SHALL**:
- Replace the action button group with a Tab component
- Display tabs: "Edit", "Outcome Comments", "Personalized Comments", "Manage Classes"
- Maintain the same visual hierarchy (right side of subject item)
- Only show tabs when corresponding callbacks are provided (conditional rendering)

**WHEN** a user clicks a tab
**THE SYSTEM SHALL**:
- Trigger the corresponding callback (onEdit, onViewOutcomeComments, onViewPersonalizedComments, onViewClasses)
- Highlight the selected tab visually
- Maintain the same behavior as the previous button implementation

**WHEN** tabs are displayed on the SubjectListItem
**THE SYSTEM SHALL**:
- Maintain responsive layout (stacks gracefully on mobile)
- Preserve the delete button position (beside subject name)
- Keep dates display below subject name
- Ensure proper spacing and alignment

**WHEN** only some callbacks are provided
**THE SYSTEM SHALL**:
- Only render tabs for provided callbacks (e.g., if no onViewClasses, no "Manage Classes" tab)
- Hide the entire tab group if no callbacks provided

#### Visual Design Requirements
- Tab height: 36px (py-2)
- Tab spacing: 2px gap between tabs
- Active tab: Blue border-bottom (border-blue-600) or background highlight
- Hover state: Light background change (hover:bg-gray-50)
- Font: Same as current buttons (font-medium, text-sm)

#### Technical Requirements
- Update: `src/components/subjects/SubjectListItem.tsx`
- Import and use Tab component from US-TAB-001
- Maintain React.memo optimization
- Update PropTypes/TypeScript interfaces
- Preserve existing data-testid attributes

#### Definition of Done
- [ ] SubjectListItem uses Tab component instead of buttons
- [ ] All four tabs render when callbacks provided
- [ ] Tabs trigger correct callbacks (onEdit, etc.)
- [ ] Conditional rendering works (only shows provided tabs)
- [ ] Visual hierarchy maintained
- [ ] Responsive behavior on mobile
- [ ] Existing tests updated and passing
- [ ] New tests for tab integration (≥90% coverage)
- [ ] Linting passes (0 errors)
- [ ] Code review completed

---

### US-TAB-003: Accessibility Compliance and Keyboard Navigation
**Priority**: HIGH (MVP)
**Story Points**: 2
**Assignee**: Frontend Engineer
**Dependencies**: US-TAB-001, US-TAB-002

**As a** keyboard user or screen reader user
**I want** full keyboard navigation and screen reader support for subject tabs
**So that** I can access all subject management features without a mouse

#### Acceptance Criteria (EARS Format)

**WHEN** a keyboard user navigates to a SubjectListItem
**THE SYSTEM SHALL**:
- Allow Tab key to focus the tab group
- Allow Arrow keys (Left/Right) to navigate between tabs
- Allow Enter/Space to activate the focused tab
- Allow Home key to jump to first tab
- Allow End key to jump to last tab
- Provide visible focus indicators on all focusable elements

**WHEN** a screen reader user encounters a SubjectListItem
**THE SYSTEM SHALL**:
- Announce "tablist" role for the tab container
- Announce each tab with its label and selected state
- Announce when tab selection changes
- Provide proper aria-label for context (e.g., "Subject actions for Mathematics 101")

**WHEN** automated accessibility testing runs
**THE SYSTEM SHALL**:
- Pass axe-core automated checks (0 violations)
- Meet WCAG 2.1 AA standards
- Provide proper color contrast (≥4.5:1 for text)
- Support keyboard-only navigation

**WHEN** tabs are disabled (e.g., loading state)
**THE SYSTEM SHALL**:
- Apply aria-disabled="true"
- Prevent keyboard activation
- Provide visual disabled state
- Skip disabled tabs in keyboard navigation

#### Technical Requirements
- Run axe-core accessibility tests
- Add E2E keyboard navigation tests (Playwright)
- Verify screen reader compatibility (NVDA/JAWS/VoiceOver)
- Document keyboard shortcuts in component

#### Definition of Done
- [ ] Full keyboard navigation implemented and tested
- [ ] ARIA attributes properly applied and validated
- [ ] Screen reader announcements verified
- [ ] Axe-core tests pass (0 violations)
- [ ] E2E keyboard tests pass (Playwright)
- [ ] Focus indicators visible and clear
- [ ] Color contrast meets WCAG 2.1 AA (≥4.5:1)
- [ ] Linting passes (0 errors)
- [ ] Accessibility audit documented
- [ ] Code review completed

---

## Story Breakdown by Phase

### Sprint 1 (MVP - 1 week)
**Goal**: Convert SubjectListItem to use tabbed interface with full accessibility

**Must Have (HIGH Priority - 10 points)**:
1. US-TAB-001: Create Reusable Tab Component (3 pts)
2. US-TAB-002: Integrate Tabs into SubjectListItem (5 pts)
3. US-TAB-003: Accessibility Compliance (2 pts)

**Total MVP**: 10 story points

---

## INVEST Criteria Validation

### US-TAB-001: Create Reusable Tab Component
- **Independent**: ✅ Can be developed standalone
- **Negotiable**: ✅ Styling and API details can be refined
- **Valuable**: ✅ Provides reusable component for future features
- **Estimable**: ✅ Clear scope (3 points)
- **Small**: ✅ Fits in sprint with buffer
- **Testable**: ✅ Clear acceptance criteria and test requirements

### US-TAB-002: Integrate Tabs into SubjectListItem
- **Independent**: ⚠️ Depends on US-TAB-001 (acceptable dependency)
- **Negotiable**: ✅ Visual styling can be refined
- **Valuable**: ✅ Directly improves UX for teachers
- **Estimable**: ✅ Clear scope (5 points)
- **Small**: ✅ Fits in sprint
- **Testable**: ✅ Clear behavior and visual requirements

### US-TAB-003: Accessibility Compliance
- **Independent**: ⚠️ Depends on US-TAB-001, US-TAB-002 (acceptable)
- **Negotiable**: ❌ WCAG 2.1 AA compliance is non-negotiable
- **Valuable**: ✅ Essential for inclusive design
- **Estimable**: ✅ Clear scope (2 points)
- **Small**: ✅ Fits in sprint
- **Testable**: ✅ Automated and manual tests defined

---

## Success Metrics

### User Experience Metrics
- **Task Completion Rate**: 100% of users can access all subject actions via tabs
- **Error Rate**: < 2% of tab interactions result in errors
- **User Satisfaction**: Positive feedback from teachers on new UI

### Technical Metrics
- **Test Coverage**: ≥90% for Tab component and SubjectListItem changes
- **Accessibility**: 0 WCAG 2.1 AA violations (axe-core)
- **Performance**: No increase in render time (< 16ms per frame)
- **Bundle Size**: < 5 KB gzipped for Tab component

### Quality Metrics
- **Linting**: 0 errors
- **Test Pass Rate**: 100% (all tests passing)
- **Code Review Approval**: Required before merge
- **Visual Regression**: No unintended UI changes

---

## Risk Assessment

### Technical Risks

**Risk 1: Tab Component Complexity**
- **Probability**: Low
- **Impact**: Medium
- **Mitigation**: Use existing Tailwind patterns, keep API simple, reference ConfirmationModal for similar patterns
- **Contingency**: Start with minimal Tab implementation, iterate based on feedback

**Risk 2: Accessibility Implementation**
- **Probability**: Medium
- **Impact**: High (WCAG compliance required)
- **Mitigation**: Follow WAI-ARIA Authoring Practices for tabs, use automated testing (axe-core), manual screen reader testing
- **Contingency**: Allocate extra time for accessibility fixes if violations found

**Risk 3: Breaking Existing Functionality**
- **Probability**: Low
- **Impact**: High
- **Mitigation**: Maintain same callback interfaces, comprehensive regression testing, incremental rollout
- **Contingency**: Feature flag to toggle between old/new UI during testing

**Risk 4: Mobile Responsive Behavior**
- **Probability**: Low
- **Impact**: Medium
- **Mitigation**: Test on multiple screen sizes, use responsive Tailwind classes, follow existing responsive patterns
- **Contingency**: Simplify tab layout on mobile (vertical stack or dropdown)

### Process Risks

**Risk 5: Scope Creep**
- **Probability**: Medium
- **Impact**: Medium
- **Mitigation**: Clearly defined MVP scope, defer enhancements to post-MVP
- **Contingency**: Use time-boxing (1 week limit), prioritize core functionality

---

## Dependencies

### Internal Dependencies
- **Tab Component** (US-TAB-001): Foundation for US-TAB-002
- **SubjectListItem Integration** (US-TAB-002): Required for US-TAB-003 testing
- **Existing Components**: Button, ConfirmationModal (reference for patterns)

### External Dependencies
- **React 18**: useId() hook for unique IDs
- **Tailwind CSS**: Styling framework
- **React Testing Library**: Unit test framework
- **Playwright**: E2E test framework
- **axe-core**: Accessibility testing

### Technical Constraints
- Must maintain TDD methodology (tests first)
- Must pass linting (0 errors)
- Must achieve ≥90% test coverage
- Must meet WCAG 2.1 AA standards
- Must not break existing SubjectList functionality

---

## Edge Cases to Consider

1. **No Callbacks Provided**: Hide entire tab group (current behavior: no buttons shown)
2. **Partial Callbacks**: Only render tabs for provided callbacks
3. **Very Long Tab Labels**: Ensure text doesn't wrap awkwardly
4. **Mobile Small Screens**: Tabs may need to stack or use dropdown
5. **High Contrast Mode**: Ensure tabs visible in Windows High Contrast Mode
6. **Disabled State**: If parent component passes disabled state
7. **Multiple SubjectListItems**: Ensure tab state independent per item
8. **Fast Tab Switching**: Debounce/throttle if callbacks are expensive

---

## Validation Plan

### Unit Tests (React Testing Library)
- Tab component renders with correct ARIA attributes
- Tab selection changes on click
- Keyboard navigation works (Arrow, Enter, Space, Home, End)
- Disabled tabs are skipped in navigation
- useId() generates unique IDs per instance
- SubjectListItem renders tabs correctly
- Tabs trigger correct callbacks
- Conditional rendering works (only shows provided tabs)

### E2E Tests (Playwright)
- User can navigate tabs with keyboard
- User can activate tabs with mouse
- Tabs trigger correct modals/views
- Tabs work on mobile viewport
- Multiple SubjectListItems have independent tab states

### Accessibility Tests
- Axe-core automated scan (0 violations)
- Manual screen reader testing (NVDA/JAWS/VoiceOver)
- Keyboard-only navigation testing
- Color contrast validation (≥4.5:1)
- Focus indicator visibility

### Visual Regression Tests
- SubjectListItem with tabs matches design
- Active tab state is visually clear
- Hover states work correctly
- Mobile responsive layout
- No unintended layout shifts

---

## Next Steps

1. ✅ **Planning Complete**: User stories created and prioritized
2. **Ready for Implementation**: Hand off to Frontend Engineer
3. **TDD Approach**: Write tests first (Red-Green-Refactor)
4. **Architecture Review**: SKIPPED (L1-MICRO complexity)

### Recommended Handoff

```bash
pdd handoff "frontend engineer" "Implement tabbed interface for SubjectListItem following these user stories. Create reusable Tab component first (US-TAB-001), then integrate into SubjectListItem (US-TAB-002), and ensure full accessibility (US-TAB-003). Follow TDD methodology and maintain ≥90% test coverage."
```

---

**Status**: Ready for Implementation
**Estimated Effort**: 1 week (10 story points)
**Risk Level**: Low
**Architecture Review**: Not Required (L1-MICRO)
