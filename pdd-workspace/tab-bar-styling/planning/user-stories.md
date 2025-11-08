# Tab Bar Styling - User Stories

**Feature**: Tab Bar Styling Consistency
**Complexity**: L0-ATOMIC (2 story points, < 1 day)
**Epic**: UI/UX Consistency
**Status**: Ready for Implementation

---

## Overview

Align tab bar styling with the recently updated Subject component design to ensure visual consistency across the application. This includes matching text sizes and updating tab labels for clarity.

**Business Value**: Consistent UI improves user experience, reduces cognitive load, and presents a more polished, professional application.

**Context**: Following the Subject component styling updates (feat/style-subject), the tab bar now has inconsistent styling and could benefit from clearer labeling.

---

## User Stories

### US-TAB-STYLE-001: Update Tab Text Styling
**Priority**: HIGH (MVP)
**Story Points**: 1
**Type**: Enhancement

**As a** user
**I want** the tab bar text to match the Subject component styling
**So that** the interface feels cohesive and professionally designed

#### Acceptance Criteria (EARS Format)

**WHEN** viewing the tab bar in the Subject detail view
**THE SYSTEM SHALL** display tab text with the following properties:
- Font size matches Subject component text (1.875rem for headings, appropriate size for tabs)
- Font weight consistent with Subject component design (600 for active tabs)
- Color scheme matches Subject component palette:
  - Active tab: #0066FF (primary blue)
  - Inactive tab: #1E3A5F (navy) or #6B7280 (gray)
  - Hover state: Appropriate transition effect
- Border/underline styling consistent with design system

**WHEN** comparing tab bar and Subject component styling side-by-side
**THE SYSTEM SHALL** show consistent visual design language

**WHEN** multiple tabs are present (Edit Subject, Outcome Comments, etc.)
**THE SYSTEM SHALL** apply consistent styling to all tabs

#### Test Scenarios

1. **Visual Consistency Check**
   - **Given** the Subject detail view is displayed
   - **When** I view both the Subject heading and tab bar
   - **Then** the text styling should feel visually consistent

2. **Active Tab Styling**
   - **Given** I am on any tab panel
   - **When** I observe the active tab
   - **Then** it should have clear visual distinction (color: #0066FF, underline/border)

3. **Inactive Tab Styling**
   - **Given** multiple tabs are available
   - **When** I observe inactive tabs
   - **Then** they should be readable but visually de-emphasized

4. **Hover State**
   - **Given** I hover over an inactive tab
   - **When** the hover state activates
   - **Then** there should be a smooth visual transition

#### Implementation Notes
- Reference `src/components/subjects/SubjectListItem.tsx` for Subject component styling
- Update `src/components/common/Tabs.tsx` with matching inline styles
- Ensure accessibility (WCAG 2.1 AA compliance) is maintained
- Test with screen readers to ensure tab navigation remains accessible

#### Definition of Done
- [ ] Tab text size matches Subject component design
- [ ] Tab colors use the established color palette (#0066FF, #1E3A5F, #6B7280)
- [ ] Active tab has clear visual distinction
- [ ] Hover states work smoothly with transitions
- [ ] All existing tab tests pass
- [ ] Visual regression testing completed
- [ ] Code review approved
- [ ] Linting passes with no errors

---

### US-TAB-STYLE-002: Rename "Edit" Tab to "Edit Subject"
**Priority**: MEDIUM (Post-MVP - Quick Win)
**Story Points**: 1
**Type**: Enhancement

**As a** user
**I want** the first tab to be labeled "Edit Subject" instead of just "Edit"
**So that** the tab's purpose is immediately clear and consistent with other tab labels

#### Acceptance Criteria (EARS Format)

**WHEN** viewing the tab bar in the Subject detail view
**THE SYSTEM SHALL** display the first tab with the label "Edit Subject"

**WHEN** I click the "Edit Subject" tab
**THE SYSTEM SHALL** display the Subject editing form (existing behavior maintained)

**WHEN** viewing tabs for different entity types (if applicable in future)
**THE SYSTEM SHALL** use specific labels (e.g., "Edit Class", "Edit Comment") for clarity

#### Test Scenarios

1. **Tab Label Display**
   - **Given** the Subject detail view is open
   - **When** I observe the tab bar
   - **Then** the first tab should read "Edit Subject" (not "Edit")

2. **Tab Functionality**
   - **Given** the tab label has been updated
   - **When** I click the "Edit Subject" tab
   - **Then** the edit form should display as before (no functional regression)

3. **ARIA Label Update**
   - **Given** I use a screen reader
   - **When** I navigate to the first tab
   - **Then** the screen reader should announce "Edit Subject" tab

4. **Test Coverage**
   - **Given** the label text has changed
   - **When** I run the test suite
   - **Then** all tests expecting "Edit" should be updated to "Edit Subject"

#### Implementation Notes
- Update `src/components/subjects/SubjectListItem.tsx` line ~110: `{ id: 'edit', label: 'Edit' }` → `{ id: 'edit', label: 'Edit Subject' }`
- Update test files to expect "Edit Subject" instead of "Edit":
  - `src/components/subjects/__tests__/SubjectListItem.test.tsx`
  - Any E2E tests referencing the Edit tab
- Ensure `aria-label` attributes are updated if they reference the tab name
- Consider: Should the tab ID remain 'edit' or change to 'edit-subject'? (Recommend keeping 'edit' for backward compatibility)

#### Definition of Done
- [ ] Tab label changed from "Edit" to "Edit Subject"
- [ ] All component tests updated and passing
- [ ] ARIA labels updated for accessibility
- [ ] No functional regressions in tab navigation
- [ ] Linting passes with no errors
- [ ] Code review approved

---

## Success Metrics

### User Experience Metrics
- **Visual Consistency Score**: Subjective assessment by design review (target: 9/10)
- **User Confusion Reports**: Track support tickets mentioning unclear tab labels (target: 0 new tickets)

### Technical Metrics
- **Test Coverage**: Maintain ≥90% test coverage
- **Performance**: No negative impact on tab rendering performance
- **Accessibility**: 0 WCAG 2.1 AA violations
- **Build Time**: No significant increase in bundle size

### Implementation Metrics
- **Completion Time**: < 1 day
- **Test Updates**: All tests pass with updated expectations
- **Regression Issues**: 0 new bugs introduced

---

## Dependencies

### Completed Dependencies
- ✅ Subject component styling (feat/style-subject branch)
- ✅ Color palette defined (#0066FF, #1E3A5F, #6B7280, #DC2626)
- ✅ Inline styling approach established (no Tailwind)

### Blocked By
- None (ready for immediate implementation)

### Blocks
- None (independent styling task)

---

## Technical Context

### Files to Modify
1. **`src/components/common/Tabs.tsx`**
   - Update inline styles to match Subject component design
   - Apply color palette (#0066FF for active, #1E3A5F for inactive)
   - Add/update hover state handlers or CSS classes

2. **`src/components/subjects/SubjectListItem.tsx`** (line ~110)
   - Change tab label: `'Edit'` → `'Edit Subject'`

3. **Test Files**
   - `src/components/subjects/__tests__/SubjectListItem.test.tsx`
   - `src/components/common/__tests__/Tabs.test.tsx` (if it exists)
   - Update assertions expecting "Edit" to "Edit Subject"

### Design Reference
- **Color Palette**:
  - Primary Blue: `#0066FF`
  - Navy: `#1E3A5F`
  - Gray: `#6B7280`
  - Red (error): `#DC2626`
- **Font Sizes**:
  - Subject heading: `1.875rem` (bold)
  - Consider `1rem` or `1.125rem` for tabs
- **Font Weight**:
  - Active tab: `600` (semi-bold)
  - Inactive tab: `500` (medium)

---

## Risk Assessment

### Low Risks
- **Styling Conflicts**: Inline styles may conflict with existing CSS
  - **Mitigation**: Review existing Tabs component styling before changes
  - **Impact**: LOW - Easily fixable with specificity adjustments

- **Test Failures**: Changing "Edit" to "Edit Subject" will break tests
  - **Mitigation**: Update tests concurrently with implementation
  - **Impact**: LOW - Known issue, straightforward fix

- **Accessibility Regression**: Styling changes could affect screen readers
  - **Mitigation**: Test with screen readers during development
  - **Impact**: LOW - Maintaining ARIA attributes should prevent issues

### Negligible Risks
- **Performance**: Styling changes have minimal performance impact
- **Browser Compatibility**: CSS properties used are widely supported
- **User Impact**: Non-breaking visual enhancements

---

## Prioritization Rationale

### US-TAB-STYLE-001 (HIGH Priority - MVP)
**Value**: 8/10 - Visual consistency significantly improves user experience
**Effort**: 1 story point - Quick styling update
**Risk**: LOW - Isolated styling change

**Why HIGH**: This directly addresses visual inconsistency that users will notice immediately. Quick win for UX improvement.

### US-TAB-STYLE-002 (MEDIUM Priority - Post-MVP)
**Value**: 6/10 - Clearer labeling improves usability but not critical
**Effort**: 1 story point - Simple text change + test updates
**Risk**: LOW - Minimal code changes

**Why MEDIUM**: While helpful for clarity, the current "Edit" label is functional. Can be bundled with styling changes or done separately as time permits.

---

## Next Steps

1. **Implementation Ready**: Both stories are ready for developer pickup
2. **Suggested Approach**: Implement both stories together (< 1 day effort)
3. **Branch Strategy**: Create `feat/tab-bar-styling` branch from current `feat/style-subject`
4. **Testing**: Update tests concurrently with implementation to avoid test failures

**Recommended Action**: Hand off to Frontend Engineer for implementation using TDD approach.

---

## Related Documentation

- **Parent Feature**: Subject Component Styling (feat/style-subject)
- **Design System**: Color palette defined in subject styling work
- **Accessibility Guidelines**: WCAG 2.1 AA compliance (maintained throughout)
- **Testing Standards**: 90%+ test coverage requirement

---

**Product Owner Sign-off**: Ready for implementation
**Created**: 2025-11-08
**Last Updated**: 2025-11-08
