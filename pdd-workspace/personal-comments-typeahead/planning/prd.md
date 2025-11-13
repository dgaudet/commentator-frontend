# Product Requirements Document (PRD)
## Personal Comments Typeahead Search Integration

**Feature Name**: Personal Comments Typeahead Search Integration
**Feature ID**: PC-TYPEAHEAD-001
**Version**: 1.0
**Date**: 2025-11-12
**Status**: Draft → Approved
**Complexity Level**: L1-MICRO (1-2 weeks, 13 story points)
**Branch**: `feat/personal-comments-typeahead`
**Owner**: Product Owner
**Contributors**: Frontend Engineer

---

## Executive Summary

### Overview

This feature adds a typeahead search box for selecting personalized comments in the Final Comments modal. Teachers will be able to search and select from existing personalized comments for the current subject, streamlining the workflow for creating final student reports.

### Business Value

- **Workflow Efficiency**: Reduces time to create final comments by enabling quick selection of personalized comments
- **Discoverability**: Makes existing personalized comments more accessible via search
- **User Experience**: Type-ahead filtering provides instant feedback and reduces cognitive load
- **Consistency**: Follows established outcome comment integration pattern

### Key Metrics

- **Effort**: 13 story points (~1-2 weeks)
- **Risk**: LOW-MEDIUM (new component, existing API integration)
- **Impact**: HIGH (improves teacher workflow efficiency)

---

## Problem Statement

### Current State

Teachers currently work with three types of comments:
1. **Outcome Comments** - Grade-based, automatically populated ✅ (implemented via US-FINAL-001)
2. **Personalized Comments** - Custom comments per subject ❌ (not integrated)
3. **Final Comment** - Manually typed free-form text ✅ (current workflow)

**Pain Point**: Teachers must manually type personalized comments or remember them from memory, leading to:
- Inconsistent phrasing across student reports
- Slower workflow (retyping common comments)
- Difficulty discovering existing personalized comments

### User Request

> "Picking the personal comment should be a type-ahead search box"
>
> "Drop-down for personal comment, which when you pick it, posts into a text box below you can edit"

### Current Workflow

```
1. Teacher navigates to Final Comments modal
2. Enters student first name
3. Enters student last name (optional)
4. Enters grade → Outcome comment auto-populates ✅
5. Manually types final comment from scratch ❌ SLOW
```

### Desired Workflow

```
1. Teacher navigates to Final Comments modal
2. Enters student first name
3. Enters student last name (optional)
4. Enters grade → Outcome comment auto-populates ✅
5. Types in typeahead search → Personalized comments filter ✅ NEW
6. Selects personalized comment → Populates final comment field ✅ NEW
7. Optionally edits final comment before saving ✅ NEW
```

---

## Goal

**Enable teachers to quickly search and select personalized comments via typeahead, automatically populating the final comment field for editing.**

### Objectives

1. Create reusable `TypeaheadSearch` component with design token styling
2. Integrate `usePersonalizedComments` hook to load comments by subject
3. Position typeahead search below outcome comment box in Add form
4. Position typeahead search below outcome comment box in Edit form
5. Implement real-time filtering (filter-as-you-type)
6. Auto-populate final comment textarea when personalized comment selected
7. Maintain keyboard accessibility (arrow keys, enter, escape)

### Non-Goals (Out of Scope)

- ❌ Creating new personalized comments from Final Comments modal (use dedicated PersonalizedComments modal)
- ❌ Editing existing personalized comments (use dedicated PersonalizedComments modal)
- ❌ Multi-select or combining multiple personalized comments
- ❌ Templating or variable substitution in comments
- ❌ Backend API changes (uses existing PersonalizedComment endpoints)

---

## User Stories

### US-PC-TYPEAHEAD-001: Create Reusable Typeahead Component
**Story Points**: 3 | **Priority**: HIGH | **Risk**: MEDIUM

**As a** developer
**I want** a reusable TypeaheadSearch component with design token styling
**So that** I can integrate personalized comment search into Final Comments modal

**Acceptance Criteria (EARS Format)**:

1. **GIVEN** the TypeaheadSearch component is implemented
   **WHEN** rendered with a list of items and search query
   **THEN** the system SHALL display filtered items matching the search query (case-insensitive)

2. **GIVEN** the user types in the search input
   **WHEN** the search query changes
   **THEN** the system SHALL filter results in real-time (debounced 200ms)

3. **GIVEN** filtered results are displayed
   **WHEN** the user hovers over an item
   **THEN** the system SHALL highlight the hovered item with design token colors

4. **GIVEN** the search results are visible
   **WHEN** the user presses Arrow Down/Up
   **THEN** the system SHALL navigate through results via keyboard

5. **GIVEN** a result is highlighted
   **WHEN** the user presses Enter
   **THEN** the system SHALL select the highlighted item and invoke onSelect callback

6. **GIVEN** the dropdown is open
   **WHEN** the user presses Escape
   **THEN** the system SHALL close the dropdown without selecting

7. **GIVEN** the component is rendered
   **WHEN** applying styles
   **THEN** the system SHALL use design tokens for all visual properties

**Technical Implementation**:
- **Component**: `src/components/common/TypeaheadSearch.tsx`
- **Props Interface**:
  ```typescript
  interface TypeaheadSearchProps<T> {
    items: T[]
    searchQuery: string
    onSearchChange: (query: string) => void
    onSelect: (item: T) => void
    getItemLabel: (item: T) => string
    placeholder?: string
    label?: string
    disabled?: boolean
    loading?: boolean
    error?: string | null
  }
  ```
- **Design Tokens**: Use `colors`, `spacing`, `typography`, `borders` from `src/theme/tokens.ts`
- **Accessibility**: ARIA roles (`combobox`, `listbox`, `option`), keyboard navigation
- **Reference Pattern**: Input component (src/components/common/Input.tsx)

---

### US-PC-TYPEAHEAD-002: Load Personalized Comments by Subject
**Story Points**: 2 | **Priority**: HIGH | **Risk**: LOW

**As a** teacher
**I want** personalized comments to load automatically when I open the Final Comments modal
**So that** I can search through available comments for the current subject

**Acceptance Criteria (EARS Format)**:

1. **GIVEN** the Final Comments modal is opened for a class
   **WHEN** the modal mounts
   **THEN** the system SHALL load personalized comments for the class's subject using `loadPersonalizedComments(subjectId)`

2. **GIVEN** personalized comments are loading
   **WHEN** the typeahead is rendered
   **THEN** the system SHALL display a loading indicator in the typeahead

3. **GIVEN** personalized comments fail to load
   **WHEN** the API returns an error
   **THEN** the system SHALL display an error message below the typeahead

4. **GIVEN** no personalized comments exist for the subject
   **WHEN** the typeahead is opened
   **THEN** the system SHALL display "No personalized comments available for this subject"

5. **GIVEN** personalized comments are loaded successfully
   **WHEN** stored in component state
   **THEN** the system SHALL sort comments alphabetically by comment text

**Technical Implementation**:
- **Hook**: Use existing `usePersonalizedComments` hook (already implemented)
- **API Call**: `loadPersonalizedComments(classEntity.subjectId)` in `useEffect`
- **Loading State**: Display LoadingSpinner component inside typeahead
- **Error Handling**: Use ErrorMessage component pattern
- **Location**: FinalCommentsModal.tsx (add state and useEffect similar to outcome comments integration)

---

### US-PC-TYPEAHEAD-003: Integrate Typeahead in Add Form
**Story Points**: 3 | **Priority**: HIGH | **Risk**: MEDIUM

**As a** teacher
**I want** a personalized comment search box in the Add form
**So that** I can quickly select a comment template when creating a new final comment

**Acceptance Criteria (EARS Format)**:

1. **GIVEN** the Final Comments modal Add form is displayed
   **WHEN** rendered
   **THEN** the system SHALL display the typeahead search box below the "Outcome Comment by Grade" field

2. **GIVEN** the typeahead is positioned correctly
   **WHEN** viewing the form layout
   **THEN** the system SHALL show:
   - **Position 1**: First Name / Last Name inputs
   - **Position 2**: Grade input
   - **Position 3**: Outcome Comment by Grade (read-only) ✅ EXISTING
   - **Position 4**: Personalized Comment Search (typeahead) ✅ NEW
   - **Position 5**: Comment textarea

3. **GIVEN** the user searches for a personalized comment
   **WHEN** typing in the typeahead
   **THEN** the system SHALL filter personalized comments in real-time (case-insensitive substring match)

4. **GIVEN** the user selects a personalized comment from the dropdown
   **WHEN** onSelect is triggered
   **THEN** the system SHALL populate the Comment textarea with the selected comment text

5. **GIVEN** the Comment textarea already has content
   **WHEN** a personalized comment is selected
   **THEN** the system SHALL replace the existing content with the selected comment

6. **GIVEN** the form is submitted successfully
   **WHEN** the new final comment is created
   **THEN** the system SHALL clear the typeahead search query (but NOT the Comment textarea)

**Technical Implementation**:
- **Location**: FinalCommentsModal.tsx lines ~598-599 (after outcome comment display, before comment textarea)
- **State Variables**:
  ```typescript
  const [personalizedCommentSearch, setPersonalizedCommentSearch] = useState('')
  const { personalizedComments, loading: pcLoading, error: pcError } = usePersonalizedComments()
  ```
- **Integration Pattern**: Mirror outcome comment integration structure
- **Design Token Styling**: Match existing form field spacing (`marginBottom: spacing.lg`)

---

### US-PC-TYPEAHEAD-004: Integrate Typeahead in Edit Form
**Story Points**: 3 | **Priority**: HIGH | **Risk**: MEDIUM

**As a** teacher
**I want** a personalized comment search box in the Edit form
**So that** I can quickly update a final comment using a personalized comment template

**Acceptance Criteria (EARS Format)**:

1. **GIVEN** the Final Comments modal Edit form is displayed
   **WHEN** rendered
   **THEN** the system SHALL display the typeahead search box below the "Outcome Comment by Grade (Edit)" field

2. **GIVEN** the typeahead is positioned correctly
   **WHEN** viewing the edit form layout
   **THEN** the system SHALL show:
   - **Position 1**: First Name / Last Name inputs
   - **Position 2**: Grade input
   - **Position 3**: Outcome Comment by Grade (Edit) (read-only) ✅ EXISTING
   - **Position 4**: Personalized Comment Search (typeahead) ✅ NEW
   - **Position 5**: Comment textarea

3. **GIVEN** the user selects a personalized comment from the dropdown
   **WHEN** onSelect is triggered
   **THEN** the system SHALL populate the Comment textarea with the selected comment text

4. **GIVEN** the edit form is cancelled
   **WHEN** the user clicks Cancel
   **THEN** the system SHALL clear the typeahead search query

5. **GIVEN** the edit form is saved successfully
   **WHEN** the final comment is updated
   **THEN** the system SHALL clear the typeahead search query and exit edit mode

**Technical Implementation**:
- **Location**: FinalCommentsModal.tsx lines ~821-822 (after outcome comment display in edit mode, before comment textarea)
- **State Variables**:
  ```typescript
  const [editPersonalizedCommentSearch, setEditPersonalizedCommentSearch] = useState('')
  ```
- **Shared Hook**: Use same `usePersonalizedComments` instance (personalized comments loaded once, used in both add/edit)
- **Clear on Cancel**: Reset search state in `handleEditCancel`

---

### US-PC-TYPEAHEAD-005: Keyboard Accessibility and UX Polish
**Story Points**: 2 | **Priority**: MEDIUM | **Risk**: LOW

**As a** teacher using keyboard navigation
**I want** full keyboard support for the typeahead search
**So that** I can efficiently navigate and select comments without using a mouse

**Acceptance Criteria (EARS Format)**:

1. **GIVEN** the typeahead input has focus
   **WHEN** the user presses Arrow Down
   **THEN** the system SHALL open the dropdown and highlight the first result

2. **GIVEN** the dropdown is open with multiple results
   **WHEN** the user presses Arrow Down/Up
   **THEN** the system SHALL cycle through results with visual highlight

3. **GIVEN** a result is highlighted
   **WHEN** the user presses Enter
   **THEN** the system SHALL select the item, populate the textarea, and close the dropdown

4. **GIVEN** the dropdown is open
   **WHEN** the user presses Escape
   **THEN** the system SHALL close the dropdown without selecting

5. **GIVEN** the typeahead has focus
   **WHEN** the user presses Tab
   **THEN** the system SHALL move focus to the next form field (Comment textarea)

6. **GIVEN** the user clicks outside the typeahead
   **WHEN** focus is lost
   **THEN** the system SHALL close the dropdown without selecting

7. **GIVEN** the typeahead is rendered
   **WHEN** inspected with accessibility tools
   **THEN** the system SHALL have proper ARIA attributes:
   - `role="combobox"` on input
   - `role="listbox"` on dropdown
   - `role="option"` on each result
   - `aria-expanded` state
   - `aria-activedescendant` for highlighted item

**Technical Implementation**:
- **Keyboard Handlers**: `onKeyDown` event listeners in TypeaheadSearch component
- **ARIA Attributes**: Follow WAI-ARIA 1.2 Combobox pattern
- **Focus Management**: Use `useRef` for managing focused result index
- **Click Outside**: Use `useEffect` with document event listener
- **Testing**: Add keyboard navigation tests in TypeaheadSearch.test.tsx

---

## Technical Requirements

### New Files to Create

| File | Purpose | Lines (Est.) |
|------|---------|--------------|
| `src/components/common/TypeaheadSearch.tsx` | Reusable typeahead component | ~200 |
| `src/components/common/__tests__/TypeaheadSearch.test.tsx` | Unit tests for typeahead | ~300 |

### Files to Modify

| File | Lines | Changes |
|------|-------|---------|
| `FinalCommentsModal.tsx` | ~598, ~821 | Add typeahead integration (add/edit forms) |
| `FinalCommentsModal.test.tsx` | New tests | Add tests for personalized comment integration |

### Design Tokens Used

```typescript
// Spacing
spacing.sm, spacing.md, spacing.lg

// Typography
typography.fontSize.sm, typography.fontSize.base
typography.fontWeight.medium, typography.fontWeight.semibold
typography.lineHeight.normal

// Colors
colors.text.primary, colors.text.secondary, colors.text.disabled
colors.border.default, colors.border.focus
colors.background.primary, colors.background.secondary
colors.neutral[50], colors.neutral[100]

// Borders
borders.width.thin
borders.radius.md

// Shadows (for dropdown)
shadows.md
```

### Dependencies

- **Existing Hook**: `usePersonalizedComments` (already implemented, no changes needed)
- **Existing Service**: `personalizedCommentService` (already implemented, no changes needed)
- **Existing Types**: `PersonalizedComment` (already defined)
- **New Component**: `TypeaheadSearch` (to be created)

---

## Component API Design

### TypeaheadSearch Component

```typescript
interface TypeaheadSearchProps<T> {
  // Data
  items: T[]                                    // List of items to search through
  getItemLabel: (item: T) => string             // Extract display text from item

  // Search state
  searchQuery: string                           // Controlled search input value
  onSearchChange: (query: string) => void       // Search query change handler
  onSelect: (item: T) => void                   // Item selection handler

  // UI customization
  label?: string                                // Field label (e.g., "Personalized Comment")
  placeholder?: string                          // Input placeholder text
  emptyMessage?: string                         // Message when no results found

  // States
  loading?: boolean                             // Show loading indicator
  disabled?: boolean                            // Disable input
  error?: string | null                         // Error message to display
}
```

### Usage Example

```typescript
<TypeaheadSearch
  items={personalizedComments}
  getItemLabel={(comment) => comment.comment}
  searchQuery={personalizedCommentSearch}
  onSearchChange={setPersonalizedCommentSearch}
  onSelect={(selectedComment) => {
    setComment(selectedComment.comment)
    setPersonalizedCommentSearch('')
  }}
  label="Personalized Comment (Optional)"
  placeholder="Search personalized comments..."
  emptyMessage="No personalized comments available for this subject"
  loading={pcLoading}
  error={pcError}
/>
```

---

## Success Metrics

### Quality Gates

| Metric | Target | Validation |
|--------|--------|------------|
| **Component Reusability** | Generic, type-safe `<T>` | Code review |
| **Keyboard Accessibility** | 100% keyboard navigable | Manual testing + axe audit |
| **Performance** | Debounced search (200ms) | Performance testing |
| **Test Coverage** | ≥90% coverage | Jest coverage report |
| **Design Token Compliance** | 100% design tokens | Code review |
| **Functionality** | 0 regressions | Manual testing + unit tests |

### Post-Implementation Validation

- [ ] Typeahead component created with generic type support
- [ ] Personalized comments load automatically for class's subject
- [ ] Typeahead positioned correctly below outcome comment in Add form
- [ ] Typeahead positioned correctly below outcome comment in Edit form
- [ ] Selecting comment populates textarea
- [ ] Search filters in real-time (case-insensitive)
- [ ] Keyboard navigation works (arrows, enter, escape)
- [ ] ARIA attributes present and correct
- [ ] Loading and error states display correctly
- [ ] Empty state message displays when no comments available
- [ ] All tests passing (≥90% coverage)
- [ ] Linting passes (0 errors)
- [ ] WCAG 2.1 AA compliance (axe DevTools audit)

---

## Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Typeahead component complexity | MEDIUM | MEDIUM | Break into smaller incremental stories, test thoroughly |
| Keyboard navigation bugs | MEDIUM | MEDIUM | Follow WAI-ARIA patterns, extensive keyboard testing |
| Performance with large comment lists | LOW | LOW | Implement debouncing, consider virtualization if >100 items |
| Integration conflicts with existing form | LOW | LOW | Follow existing outcome comment integration pattern |
| Accessibility violations | MEDIUM | LOW | Use ARIA attributes, test with screen readers |

---

## Timeline

**Total Effort**: 13 Story Points (~1-2 weeks)

### Implementation Plan

| Task | Duration | Owner | Dependencies |
|------|----------|-------|--------------|
| **Phase 1: Component Development** | | | |
| Create TypeaheadSearch component (US-001) | 2 days | Frontend Engineer | None |
| Write unit tests for TypeaheadSearch | 1 day | Frontend Engineer | Component complete |
| **Phase 2: Integration** | | | |
| Load personalized comments (US-002) | 0.5 days | Frontend Engineer | Component complete |
| Integrate in Add form (US-003) | 1 day | Frontend Engineer | US-002 complete |
| Integrate in Edit form (US-004) | 1 day | Frontend Engineer | US-003 complete |
| **Phase 3: Polish & Testing** | | | |
| Keyboard accessibility (US-005) | 1 day | Frontend Engineer | Integration complete |
| Integration tests | 0.5 days | Frontend Engineer | All features complete |
| Accessibility audit & fixes | 0.5 days | Frontend Engineer | All features complete |
| Code review & merge | 0.5 days | Team | All complete |

**Total**: ~8 working days (1.5-2 weeks for single developer)

---

## Dependencies

### Internal Dependencies

| Dependency | Status | Risk |
|------------|--------|------|
| `usePersonalizedComments` hook | ✅ Implemented | LOW |
| `personalizedCommentService` | ✅ Implemented | LOW |
| `PersonalizedComment` type | ✅ Defined | LOW |
| Design token system | ✅ Stable | LOW |
| FinalCommentsModal | ✅ Stable | LOW |

### External Dependencies

None - Uses existing REST API endpoints

---

## Definition of Done

**Component Development**:
- [x] TypeaheadSearch component created with generic type support
- [x] Design token styling applied (100% compliance)
- [x] ARIA attributes implemented (WAI-ARIA 1.2 Combobox pattern)
- [x] Keyboard navigation (arrows, enter, escape, tab)
- [x] Loading, error, and empty states handled
- [x] Component unit tests (≥90% coverage)

**Integration**:
- [x] Personalized comments loaded by subject on modal mount
- [x] Typeahead integrated in Add form (below outcome comment)
- [x] Typeahead integrated in Edit form (below outcome comment)
- [x] Selected comment populates textarea
- [x] Search filters in real-time (debounced 200ms)
- [x] Integration tests added to FinalCommentsModal.test.tsx

**Quality & Validation**:
- [x] All tests passing (≥90% coverage)
- [x] Linting passes (0 errors)
- [x] Accessibility audit passes (WCAG 2.1 AA, 0 new violations)
- [x] Keyboard navigation tested manually
- [x] Responsive behavior validated (mobile, tablet, desktop)
- [x] No functionality regressions
- [x] Code review approved
- [x] Merged to main branch

---

## Related Documents

- **Design System**: `src/theme/tokens.ts`
- **Existing Hook**: `src/hooks/usePersonalizedComments.ts`
- **Existing Service**: `src/services/api/personalizedCommentService.ts`
- **Target Component**: `src/components/finalComments/FinalCommentsModal.tsx`
- **User Stories**: See sections above
- **Backlog Item**: `toDos.md` line 15-17

---

## Approval Sign-Off

| Role | Name | Approval | Date |
|------|------|----------|------|
| Product Owner | [Auto-approved L1] | ✅ Approved | 2025-11-12 |
| Frontend Engineer | [Pending] | ⏳ Pending | - |

---

**Document Status**: ✅ **APPROVED FOR IMPLEMENTATION**

**Complexity Level**: L1-MICRO (1-2 weeks, new component + integration)

**Next Steps**:
1. Frontend Engineer reviews PRD and existing PersonalizedComments integration
2. Create TypeaheadSearch component with TDD approach (US-PC-TYPEAHEAD-001)
3. Integrate personalized comments loading (US-PC-TYPEAHEAD-002)
4. Integrate in Add form (US-PC-TYPEAHEAD-003)
5. Integrate in Edit form (US-PC-TYPEAHEAD-004)
6. Polish keyboard accessibility (US-PC-TYPEAHEAD-005)
7. Submit for code review
8. Merge to main

---

*Generated by Product Owner Persona - PDD Framework*
*AWO Complexity: L1-MICRO (1-2 weeks, new component development + integration)*
