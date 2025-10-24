# Outcome Comments Integration - Minimal PRD

**Feature**: Outcome Comments Integration with Class Management
**Complexity**: L1 (Micro)
**Estimated Duration**: 1 week
**Developer**: Single frontend developer

## Problem Statement

Users currently have separate workflows for managing classes and outcome comments. The outcome comments functionality exists (OutcomeCommentsModal with full CRUD operations) but lacks integration with the class management interface. Users need a seamless way to view and manage outcome comments directly from a class.

## Solution Overview

Add an "Outcome Comments" button to each class in the ClassListItem component, following the established Edit/Delete button pattern. Clicking this button opens the existing OutcomeCommentsModal with class-specific filtering and context.

## User Stories

### Story 1: Add Outcome Comments Button to Class List
**As a** teacher
**I want** to see an "Outcome Comments" button on each class in my class list
**So that** I can easily access outcome comments for that specific class

**Acceptance Criteria:**
- ✅ Add "Outcome Comments" button to ClassListItem component following established button pattern (lines 50-65)
- ✅ Button appears alongside existing Edit/Delete buttons
- ✅ Button uses consistent styling with existing action buttons
- ✅ Button has proper accessibility labels (aria-label)
- ✅ Button is only visible when class has valid ID

**Technical Notes:**
- Leverage existing button pattern in ClassListItem.tsx at lines 50-65
- Add `onViewOutcomeComments` callback prop similar to `onEdit` and `onDelete`
- Use existing button styling classes for consistency

### Story 2: Open Outcome Comments Modal from Class Context
**As a** teacher
**I want** to click the "Outcome Comments" button and see the outcome comments modal
**So that** I can manage outcome comments for that specific class

**Acceptance Criteria:**
- ✅ Clicking "Outcome Comments" button opens OutcomeCommentsModal
- ✅ Modal displays with class-specific context (class name in title)
- ✅ Modal shows existing outcome comments for the selected class
- ✅ User can create new outcome comments for the class
- ✅ User can delete existing outcome comments for the class
- ✅ Modal can be closed without affecting class list

**Technical Notes:**
- Reuse existing OutcomeCommentsModal component (already has 22 passing tests)
- Pass class ID to modal for filtering outcome comments
- Update modal title to show class context
- Ensure existing CRUD functionality works within class context

## Success Metrics

- ✅ Users can access outcome comments from class list in ≤2 clicks
- ✅ All existing OutcomeCommentsModal functionality preserved
- ✅ No regression in class management functionality
- ✅ Consistent UI/UX with existing action button patterns

## Technical Requirements

### Integration Points
- **ClassListItem.tsx**: Add outcome comments button following established pattern
- **App.tsx**: Add state management for outcome comments modal
- **OutcomeCommentsModal**: Accept class context prop for filtering

### No Changes Required
- ❌ Backend API endpoints (confirmed by user)
- ❌ Outcome comments service layer (already implemented)
- ❌ Database schema changes
- ❌ Authentication/authorization

## Definition of Done

- [ ] "Outcome Comments" button added to ClassListItem
- [ ] Button follows established styling and accessibility patterns
- [ ] OutcomeCommentsModal opens with class context
- [ ] All existing outcome comments functionality works
- [ ] No test regressions (maintain 80%+ coverage)
- [ ] Code review passed
- [ ] Manual testing completed

## Risks & Mitigation

**Risk**: UI inconsistency with existing buttons
**Mitigation**: Follow exact pattern from Edit/Delete buttons at ClassListItem lines 50-65

**Risk**: Modal state conflicts with class management
**Mitigation**: Use separate state management similar to existing delete confirmation dialog

## Next Steps

1. Implement Story 1: Add button to ClassListItem component
2. Implement Story 2: Wire up modal integration
3. Test integration with existing functionality
4. Code review and merge

---

**Created**: October 23, 2025
**Product Owner**: PDD Framework
**Status**: Ready for Development