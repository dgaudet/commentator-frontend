# User Stories: Subject Delete Button Relocation

**Feature**: Move subject delete button to appear beside Subject Name when a subject is selected

**Complexity**: L1-MICRO (3-5 days, 1 developer)

**Architecture Review**: SKIPPED (L1 level - straightforward UI enhancement)

---

## Overview

This feature improves the user experience by relocating the delete button to appear contextually beside the selected subject name, making the delete action more intuitive and reducing visual clutter when no subject is selected.

**Business Value**: Improved UX, better visual hierarchy, more intuitive delete action placement

**Target Users**: Teachers managing subjects in the commentator application

---

## User Stories

### US-SUBJ-DELETE-001: Show Delete Button on Subject Selection

**Priority**: HIGH
**Story Points**: 3
**Category**: MUST HAVE (MVP)

**As a** teacher
**I want** the delete button to appear beside the subject name when I select a subject
**So that** I can easily delete the selected subject without searching for the delete action

#### Acceptance Criteria (EARS Format)

**AC1: Button Visibility on Selection**
```
WHEN a user selects a subject from the subject list
THE SYSTEM SHALL display a delete button immediately beside the subject name
```

**AC2: Button Hidden When No Selection**
```
WHEN no subject is selected
THE SYSTEM SHALL hide the delete button
```

**AC3: Button Position and Styling**
```
WHEN the delete button is displayed
THE SYSTEM SHALL position it to the right of the subject name with appropriate spacing (8-16px)
AND SHALL style it consistently with the application's delete button patterns (e.g., red/danger color scheme)
```

**AC4: Responsive Behavior**
```
WHEN the subject name and delete button are displayed on mobile devices
THE SYSTEM SHALL ensure both elements remain visible and usable without text truncation
```

**AC5: Accessibility**
```
WHEN the delete button is rendered
THE SYSTEM SHALL include appropriate ARIA labels (e.g., "Delete [Subject Name]")
AND SHALL be keyboard accessible (tab navigation and Enter/Space to activate)
```

#### Technical Notes
- Remove delete button from previous location (likely button group or toolbar)
- Add conditional rendering based on `selectedSubject` state
- Consider using icon button with tooltip for mobile optimization
- Ensure proper focus management when button appears/disappears

#### Testing Requirements
- Unit test: Button shows/hides based on selection state
- Unit test: Button has correct ARIA labels
- E2E test: Select subject → verify button appears → deselect → verify button hidden
- Accessibility test: Keyboard navigation and screen reader compatibility

---

### US-SUBJ-DELETE-002: Delete Subject with Confirmation

**Priority**: HIGH
**Story Points**: 5
**Category**: MUST HAVE (MVP)

**As a** teacher
**I want** to confirm before deleting a subject
**So that** I don't accidentally delete important data

#### Acceptance Criteria (EARS Format)

**AC1: Confirmation Dialog on Delete Click**
```
WHEN a user clicks the delete button beside a selected subject
THE SYSTEM SHALL display a confirmation dialog
AND SHALL include the subject name in the confirmation message
```

**AC2: Confirmation Dialog Content**
```
WHEN the confirmation dialog is displayed
THE SYSTEM SHALL show a clear warning message (e.g., "Are you sure you want to delete '[Subject Name]'? This action cannot be undone.")
AND SHALL provide two action buttons: "Cancel" and "Delete"
AND SHALL style the "Delete" button with danger/warning colors
```

**AC3: Cancel Action**
```
WHEN a user clicks "Cancel" in the confirmation dialog
THE SYSTEM SHALL close the dialog
AND SHALL not delete the subject
AND SHALL keep the subject selected
```

**AC4: Confirm Delete Action**
```
WHEN a user clicks "Delete" in the confirmation dialog
THE SYSTEM SHALL send a DELETE request to the API
AND SHALL show a loading indicator during the deletion
AND SHALL close the dialog after successful deletion
```

**AC5: Successful Deletion**
```
WHEN the subject is successfully deleted
THE SYSTEM SHALL remove the subject from the subject list
AND SHALL clear the current selection (no subject selected)
AND SHALL hide the delete button
AND SHALL display a success message (e.g., "Subject '[Subject Name]' deleted successfully")
```

**AC6: Error Handling**
```
WHEN the deletion API request fails
THE SYSTEM SHALL display an error message with the reason (if available)
AND SHALL keep the subject selected
AND SHALL allow the user to retry the deletion
```

**AC7: Keyboard Accessibility**
```
WHEN the confirmation dialog is displayed
THE SYSTEM SHALL support keyboard navigation (Tab, Enter, Escape)
AND SHALL focus on the "Cancel" button by default (safe default)
AND SHALL allow Escape key to cancel the dialog
```

#### Technical Notes
- Use existing modal/dialog component if available
- Implement optimistic UI updates (remove from list immediately, rollback on error)
- Call `DELETE /subject/:id` API endpoint
- Update local state to clear selection after successful delete
- Consider if delete should refresh the entire subject list or just remove the deleted item

#### Testing Requirements
- Unit test: Dialog opens with correct subject name
- Unit test: Cancel action closes dialog without deletion
- Unit test: Successful deletion updates state correctly
- Unit test: Error handling displays error message
- E2E test: Full delete workflow (select → delete → confirm → verify removal)
- E2E test: Cancel workflow (select → delete → cancel → verify still exists)

---

### US-SUBJ-DELETE-003: Handle Delete Button Edge Cases

**Priority**: MEDIUM
**Story Points**: 2
**Category**: SHOULD HAVE (Post-MVP Enhancement)

**As a** teacher
**I want** the delete button to handle edge cases gracefully
**So that** the application remains stable and predictable

#### Acceptance Criteria (EARS Format)

**AC1: Disable During Pending Operations**
```
WHEN a deletion is in progress
THE SYSTEM SHALL disable the delete button
AND SHALL show a loading indicator on the button
```

**AC2: Subject Switch During Deletion**
```
WHEN a deletion is in progress
AND the user selects a different subject
THE SYSTEM SHALL allow the background deletion to complete
AND SHALL update the delete button to reflect the newly selected subject
```

**AC3: Last Subject Deletion**
```
WHEN the last subject in the list is deleted
THE SYSTEM SHALL show an empty state message (e.g., "No subjects available. Create your first subject.")
AND SHALL hide the delete button (no selection)
```

**AC4: Permission Handling (Future Consideration)**
```
IF the user does not have permission to delete a subject
THE SYSTEM SHALL hide the delete button OR disable it with a tooltip explaining lack of permissions
```

#### Technical Notes
- Add loading state to button component
- Handle race conditions if user rapidly switches selections
- Consider undo functionality (future enhancement)
- Plan for role-based access control (RBAC) integration

#### Testing Requirements
- Unit test: Button disabled during deletion
- Unit test: Correct behavior when deleting last subject
- E2E test: Delete last subject → verify empty state
- E2E test: Switch subject during deletion → verify no errors

---

## Story Summary

| Story ID | Description | Priority | Story Points | Category |
|----------|-------------|----------|--------------|----------|
| US-SUBJ-DELETE-001 | Show Delete Button on Selection | HIGH | 3 | MUST HAVE |
| US-SUBJ-DELETE-002 | Delete Subject with Confirmation | HIGH | 5 | MUST HAVE |
| US-SUBJ-DELETE-003 | Handle Edge Cases | MEDIUM | 2 | SHOULD HAVE |

**Total Story Points**: 10
**Estimated Duration**: 3-5 days (1 developer)

---

## MVP Scope

**Sprint 1 Focus**: US-SUBJ-DELETE-001 + US-SUBJ-DELETE-002 (8 story points)

These two stories deliver the core functionality of relocating and implementing the delete button with proper confirmation.

**Post-MVP**: US-SUBJ-DELETE-003 can be addressed in a follow-up sprint if time allows.

---

## Success Metrics

- **User Task Completion**: Users can delete a subject in ≤ 3 clicks (select → delete → confirm)
- **Error Rate**: < 2% of delete operations fail
- **Accessibility**: 0 WCAG 2.1 AA violations
- **Performance**: Delete operation completes in < 500ms (API response + UI update)
- **User Satisfaction**: Positive feedback on delete button placement in usability testing

---

## Technical Dependencies

- Existing Subject state management (likely `useSubjects` hook or Redux store)
- DELETE API endpoint (`/subject/:id` or similar)
- Modal/Dialog component for confirmation
- Button component with loading/disabled states

---

## Assumptions

1. Subject entity has an `id` field for deletion
2. DELETE API endpoint follows RESTful conventions
3. No cascade delete warnings needed (or handled by backend)
4. Single subject selection model (not multi-select)
5. Backend prevents deletion of subjects with associated data (returns error)

---

## Risks & Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Accidental deletions despite confirmation | HIGH | LOW | Clear confirmation message, safe default focus (Cancel button) |
| API deletion fails silently | MEDIUM | LOW | Robust error handling, retry mechanism, rollback on error |
| Delete button obscures subject name on mobile | LOW | MEDIUM | Responsive design testing, icon-only button on small screens |
| Confusion if button appears/disappears unexpectedly | LOW | LOW | Smooth CSS transitions, clear visual feedback |

---

## Related Work

- Consider if this pattern should be applied to other entity types (Classes, Comments, etc.)
- Future: Implement undo functionality for accidental deletions
- Future: Batch delete for multiple subjects

---

## Definition of Done

- [ ] All acceptance criteria met for MVP stories (US-SUBJ-DELETE-001, US-SUBJ-DELETE-002)
- [ ] Unit tests written and passing (≥ 90% coverage)
- [ ] E2E tests passing for delete workflow
- [ ] Accessibility audit passing (WCAG 2.1 AA)
- [ ] Code review approved
- [ ] UX review confirms improved usability
- [ ] Documentation updated (if applicable)
- [ ] Deployed to staging and validated

---

**Created**: 2025-11-02
**Product Owner**: Principal Product Owner
**Status**: Ready for Development
