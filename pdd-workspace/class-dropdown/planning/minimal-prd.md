# Class Dropdown Selector - Minimal PRD

**Feature**: Class Dropdown Selector
**Complexity**: L1-MICRO (1-2 weeks, straightforward UI change)
**Status**: Planning
**Created**: 2025-10-24

---

## 1. Overview

### Problem Statement
Currently, the ClassList component displays all classes as a vertical list of ClassListItem components. Users must scroll through the entire list, and there's no focused view for working with a single class at a time. This becomes cumbersome when teachers have many classes and want to focus on managing one class (e.g., viewing outcome comments, editing details).

### Solution
Transform the ClassList into a dropdown selector that:
1. Shows "class name - year" format for all classes
2. Allows selection of a single class
3. Displays the selected class's ClassListItem below the dropdown
4. Maintains the dropdown visibility for easy class switching
5. Persists the selected class across component remounts

### Business Value
- **Improved UX**: Cleaner, more focused interface for teachers managing multiple classes
- **Better Navigation**: Quick switching between classes without scrolling
- **Scalability**: Handles large class lists more gracefully than vertical list
- **Context Preservation**: Selected class persists, improving workflow continuity

---

## 2. User Stories (EARS Format)

### US-DROPDOWN-001: Select Class from Dropdown (HIGH - MVP)
**Priority**: HIGH (MUST HAVE for MVP)
**Effort**: 5 Story Points

**As a** teacher
**I want to** select a class from a dropdown menu
**So that** I can focus on managing one class at a time without visual clutter

#### Acceptance Criteria (EARS Format)

**AC1: Dropdown Displays All Classes**
```
WHEN the component loads
THE SYSTEM SHALL display a dropdown showing all classes in "name - year" format
AND THE SYSTEM SHALL sort classes by name alphabetically
```

**AC2: Class Selection**
```
WHEN the user selects a class from the dropdown
THE SYSTEM SHALL display the full ClassListItem for that class below the dropdown
AND THE SYSTEM SHALL keep the dropdown visible and functional
```

**AC3: Dropdown Remains Accessible**
```
WHEN a class is selected and displayed
THE SYSTEM SHALL maintain the dropdown in the UI
AND THE SYSTEM SHALL allow the user to select a different class without additional actions
```

**AC4: Initial State Handling**
```
WHEN no class is selected yet
THE SYSTEM SHALL show a placeholder text "Select a class..." in the dropdown
AND THE SYSTEM SHALL not display any ClassListItem
```

**AC5: Loading State**
```
WHEN classes are being fetched from the API
THE SYSTEM SHALL display "Loading classes..." in the dropdown
AND THE SYSTEM SHALL disable the dropdown until data loads
```

**AC6: Error State**
```
WHEN the API returns an error
THE SYSTEM SHALL display the existing ErrorMessage component
AND THE SYSTEM SHALL show "Unable to load classes" in the dropdown
```

**AC7: Empty State**
```
WHEN no classes exist for the teacher
THE SYSTEM SHALL display the existing EmptyState component
AND THE SYSTEM SHALL not render the dropdown
```

#### Technical Notes
- Reuse existing ClassListItem component for displaying selected class
- Maintain existing error handling patterns from ClassList
- Use native HTML `<select>` element for accessibility (upgrade to custom dropdown in future if needed)
- Integrate with existing useClasses hook

---

### US-DROPDOWN-002: Persist Selected Class (MEDIUM - MVP)
**Priority**: MEDIUM (SHOULD HAVE for MVP)
**Effort**: 3 Story Points

**As a** teacher
**I want to** see my last selected class when I return to the page
**So that** I can continue my work without re-selecting the class each time

#### Acceptance Criteria (EARS Format)

**AC1: Persist Selection Across Remounts**
```
WHEN the user selects a class and then navigates away
AND WHEN the user returns to the class management page
THE SYSTEM SHALL automatically select the previously chosen class
AND THE SYSTEM SHALL display that class's ClassListItem
```

**AC2: Handle Deleted Class**
```
WHEN the previously selected class no longer exists (deleted or API removed)
THE SYSTEM SHALL clear the stored selection
AND THE SYSTEM SHALL return to the "Select a class..." placeholder state
```

**AC3: Handle Empty Class List**
```
WHEN the user had a selected class but now has zero classes
THE SYSTEM SHALL clear the stored selection
AND THE SYSTEM SHALL display the EmptyState component
```

**AC4: Storage Mechanism**
```
WHEN the user selects a class
THE SYSTEM SHALL store the class ID in browser localStorage
AND THE SYSTEM SHALL key it by user session (if multi-user support exists)
```

#### Technical Notes
- Use localStorage for persistence (localStorage key: `commentator.selectedClassId`)
- Validate stored ID against fetched classes list
- Clear invalid/stale selections gracefully
- Consider future enhancement: sync across browser tabs using storage events

---

## 3. Success Metrics

### Performance Targets
- **Page Load Time**: < 2 seconds (no change from current)
- **API Response Time**: < 200ms for class list (no change)
- **Dropdown Interaction**: < 100ms from selection to ClassListItem render

### User Experience Metrics
- **Dropdown Accessibility**: 0 WCAG 2.1 AA violations (keyboard navigation, screen reader support)
- **Selection Persistence**: 95% success rate (stored selection matches available class)
- **Error Recovery**: < 2% error rate for invalid stored selections

### Quality Metrics
- **Test Coverage**: ≥ 90% code coverage
- **Bundle Size Impact**: < 5 KB gzipped (minimal - mostly UI reorganization)

---

## 4. Validation Rules

### Dropdown Behavior
- **Class Format**: Display as `{name} - {year}` (e.g., "Mathematics 101 - 2024")
- **Sorting**: Alphabetical by name (ascending)
- **Placeholder**: "Select a class..." when no selection
- **Loading**: "Loading classes..." during initial fetch

### State Persistence
- **Storage Key**: `commentator.selectedClassId`
- **Storage Value**: Number (class ID)
- **Validation**: On load, verify stored ID exists in fetched classes array
- **Expiration**: None (clear only when invalid)

### Edge Cases
1. **No classes exist**: Show EmptyState, hide dropdown
2. **Single class exists**: Auto-select it and show ClassListItem
3. **Stored ID invalid**: Clear localStorage, show placeholder
4. **API error during load**: Show ErrorMessage, disable dropdown
5. **Class deleted while selected**: On next load, detect missing ID and clear selection

---

## 5. Non-Functional Requirements

### Accessibility
- Dropdown must support keyboard navigation (Arrow keys, Enter, Esc)
- Screen reader announces selected class
- ARIA labels for dropdown and selected class display

### Compatibility
- Must work in all modern browsers (Chrome, Firefox, Safari, Edge)
- Must work on mobile devices (responsive design)

### Maintainability
- Reuse existing components (ClassListItem, ErrorMessage, EmptyState, LoadingSpinner)
- Follow existing patterns from ClassList component
- Maintain testability with React Testing Library

---

## 6. Out of Scope (Future Enhancements)

The following are explicitly **OUT OF SCOPE** for this L1-MICRO feature:

- ❌ Custom-styled dropdown component (native `<select>` is sufficient for MVP)
- ❌ Multi-class selection (single selection only)
- ❌ Search/filter functionality in dropdown (manual scroll for now)
- ❌ Keyboard shortcuts for quick class switching (e.g., Ctrl+1, Ctrl+2)
- ❌ Showing class metadata in dropdown (just name + year)
- ❌ Drag-and-drop reordering of classes
- ❌ Grouping classes by year or other attributes

---

## 7. Dependencies & Constraints

### Technical Dependencies
- **Existing Components**: ClassListItem, ErrorMessage, EmptyState, LoadingSpinner, Button
- **Existing Hooks**: useClasses
- **Existing API**: GET /class (no API changes required)
- **Browser APIs**: localStorage for persistence

### Team Dependencies
- **Frontend Developer**: Implement UI changes and component refactoring
- **QA Engineer**: Test accessibility, persistence, and edge cases

### Constraints
- Must not break existing functionality (Add Class, Edit, Delete, View Outcome Comments)
- Must maintain 90%+ test coverage
- Must pass accessibility audit (WCAG 2.1 AA)

---

## 8. Implementation Approach

### High-Level Design
1. **Refactor ClassList Component**:
   - Add dropdown UI (native `<select>` element)
   - Add state for selected class ID
   - Conditionally render single ClassListItem based on selection

2. **Add Persistence Logic**:
   - Create utility functions for localStorage get/set/clear
   - Load stored ID on component mount
   - Validate stored ID against fetched classes
   - Auto-select first class if only one exists

3. **Update Tests**:
   - Refactor existing ClassList tests for new UI
   - Add tests for dropdown interaction
   - Add tests for persistence logic
   - Add accessibility tests

### Component Structure
```
ClassList (Modified)
├── <select> Dropdown (new)
├── ErrorMessage (existing, conditional)
├── ClassListItem (existing, single instance, conditional)
└── EmptyState (existing, conditional)
```

---

## 9. Risks & Mitigation

### Risk 1: Breaking Existing Functionality
**Likelihood**: Medium
**Impact**: High
**Mitigation**:
- Refactor tests first (TDD approach)
- Maintain all existing props and event handlers
- Test Edit, Delete, View Outcome Comments workflows thoroughly

### Risk 2: Poor Accessibility
**Likelihood**: Low
**Impact**: Medium
**Mitigation**:
- Use semantic HTML (`<select>`, `<option>`)
- Add ARIA labels and descriptions
- Test with screen readers (VoiceOver, NVDA)

### Risk 3: State Synchronization Issues
**Likelihood**: Medium
**Impact**: Low
**Mitigation**:
- Clear localStorage on invalid ID
- Handle race conditions (component unmounts during API call)
- Test with React Strict Mode

---

## 10. Rollout Plan

### Phase 1: Implementation (Week 1)
- **Day 1-2**: Refactor ClassList component with dropdown UI (US-DROPDOWN-001)
- **Day 3-4**: Add persistence logic (US-DROPDOWN-002)
- **Day 5**: Accessibility audit and fixes

### Phase 2: Validation (End of Week 1)
- **QA Testing**: Functional testing, accessibility testing, cross-browser testing
- **User Acceptance**: Demo to stakeholders (if applicable)
- **Deployment**: Merge to main branch after all tests pass

### Rollback Plan
- Feature is self-contained in ClassList component
- Rollback = revert ClassList component to previous version
- No database migrations or API changes, so rollback is low-risk

---

## 11. Acceptance Criteria Summary

**This feature is DONE when**:

✅ Dropdown displays all classes in "name - year" format
✅ User can select a class and see its ClassListItem below
✅ Dropdown remains visible for easy class switching
✅ Selected class persists across page reloads
✅ Invalid stored selections are cleared gracefully
✅ All existing functionality (Add, Edit, Delete, View Outcome Comments) still works
✅ 90%+ test coverage maintained
✅ 0 accessibility violations (WCAG 2.1 AA)
✅ All acceptance criteria in US-DROPDOWN-001 and US-DROPDOWN-002 are met

---

## 12. Appendix

### Related Documentation
- Existing Class Management PRD: `.spec/class-management/requirements.md`
- Outcome Comments PRD: `pdd-workspace/outcome-comments-integration/planning/minimal-prd.md`
- Class API Documentation: `http://localhost:3000/api-docs/ui`

### Glossary
- **ClassListItem**: Existing component that displays a single class with Edit/Delete/View actions
- **useClasses**: Existing React hook that fetches and manages class data
- **EARS Format**: Easy Approach to Requirements Syntax (WHEN...THE SYSTEM SHALL...)

---

**Document Control**
**Version**: 1.0
**Author**: Product Owner (PDD Framework)
**Last Updated**: 2025-10-24
**Status**: APPROVED FOR IMPLEMENTATION
**Architecture Review**: SKIPPED (L1-MICRO complexity)
