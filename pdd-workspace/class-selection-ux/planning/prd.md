# Class Selection UX Improvements - PRD

## Overview

This feature improves the user experience around class selection by:
1. Automatically selecting newly created classes (reducing clicks and cognitive load)
2. Updating the class selection label to be more descriptive and actionable

**Complexity Level**: L0 (Atomic) - 1-2 stories, < 1 day effort
**Priority**: HIGH - High-value UX improvements with minimal risk
**Target Users**: Teachers managing classes

---

## Business Context

Currently, when teachers create a new class, they must manually select it from the dropdown to start working with it. The label "Select a class to edit or delete:" is also vague about the action's purpose.

These small frictions reduce usability and require unnecessary user actions. By selecting the class automatically and improving the label text, we reduce cognitive load and streamline the workflow.

**Expected Impact**:
- ✅ Reduced friction when creating classes
- ✅ Clearer UI guidance for new users
- ✅ Fewer user interactions to accomplish common workflows

---

## User Stories

### US-CLASS-SELECT-001: Auto-Select Newly Created Classes
**Complexity**: Trivial (< 30 min)
**Priority**: HIGH
**Story Points**: 1

#### User Story
```
WHEN a teacher creates a new class
THEN the newly created class should be automatically selected in the dropdown
SO THAT the teacher can immediately start working with it without manual selection
```

#### Acceptance Criteria

**AC1: Class auto-selected after successful creation**
- GIVEN: Teacher is in ClassManagementModal with class creation form
- WHEN: Teacher successfully creates a new class
- THEN: The new class is automatically selected in the dropdown
- AND: The class tabs/edit form is immediately displayed
- AND: No additional user action is required to select the class

**AC2: Maintains form reset behavior**
- GIVEN: A class has been successfully created and selected
- WHEN: The creation workflow completes
- THEN: The class name and year input fields are cleared for next creation
- AND: The newly created class remains selected in dropdown (selection persists while form resets)

**AC3: Works with existing class list updates**
- GIVEN: The classes array has been updated with the new class
- WHEN: `handleCreateClass` completes successfully
- THEN: `setSelectedClassId` is called with the new class ID
- AND: The new class ID matches the created class from the updated array

#### Technical Details
- **File**: `src/components/classes/ClassManagementModal.tsx`
- **Handler**: `handleCreateClass` function (line ~171)
- **Current Behavior**: Sets `selectedClassId` to `null` after creation (line 187)
- **Required Change**: Extract the newly created class ID and set it as `selectedClassId`
- **Integration**: Requires modification after `onCreateClass` succeeds and classes array updates

#### Definition of Done
- ✅ Test: Verify new class is automatically selected
- ✅ Test: Verify tab group displays for newly created class
- ✅ Test: Verify input fields are cleared (form reset works)
- ✅ Manual test: Create class and confirm immediate selection
- ✅ No regressions: Existing tests pass

---

### US-CLASS-SELECT-002: Improve Class Selection Label
**Complexity**: Trivial (< 15 min)
**Priority**: MEDIUM
**Story Points**: 1

#### User Story
```
WHEN a teacher views the class dropdown
THEN the label should clearly indicate what action the selection enables
SO THAT new users understand they can work with (edit/view) the selected class
```

#### Acceptance Criteria

**AC1: Label updated to "Select a Class to work with"**
- GIVEN: ClassManagementModal is open with a class list
- WHEN: The dropdown is visible
- THEN: The label text reads "Select a Class to work with" (not "Select a class to edit or delete:")
- AND: The label is clearly visible above the dropdown

**AC2: Label is localized and accessible**
- GIVEN: The updated label is rendered
- WHEN: A screen reader reads the page
- THEN: The label is associated with the dropdown via `<label htmlFor="class-dropdown">`
- AND: The aria-label on the select element still provides accessible description

**AC3: Styling remains consistent**
- GIVEN: The label text is updated
- WHEN: The ClassManagementModal renders
- THEN: The label maintains existing typography, spacing, and color tokens
- AND: No visual regression occurs

#### Technical Details
- **File**: `src/components/classes/ClassManagementModal.tsx`
- **Current Text** (line ~361): "Select a class to edit or delete:"
- **New Text**: "Select a Class to work with"
- **Context**: Label is used consistently throughout the modal for user guidance
- **Design Tokens**: Uses existing `typography`, `spacing`, and `themeColors`

#### Definition of Done
- ✅ Text updated in component
- ✅ Lint check passes (npm run lint)
- ✅ Manual verification: Label displays correctly in UI
- ✅ Accessibility verified: Label properly associated with dropdown
- ✅ No breaking tests

---

## Success Metrics

| Metric | Target | Baseline |
|--------|--------|----------|
| Time to select newly created class | 0 actions (auto) | 1 click |
| Label clarity score | ≥ 8/10 (from user feedback) | N/A |
| Test coverage | 100% of new behavior | N/A |

---

## Acceptance Validation Checklist

When development is complete:

- [ ] Both user stories implemented
- [ ] All acceptance criteria met and tested
- [ ] No regression in existing tests
- [ ] `npm run lint` passes without errors
- [ ] Manual testing confirms:
  - [ ] New class is auto-selected after creation
  - [ ] Form resets while selection persists
  - [ ] Label text updated and readable
  - [ ] Accessibility maintained
- [ ] Code review completed

---

## Notes

- **Low Risk**: Changes are isolated to class creation flow and one label text
- **No Backend Changes**: Purely frontend UI/UX improvements
- **No Data Model Changes**: No schema or API modifications needed
- **Backward Compatible**: No breaking changes

---

## Related Items

- Backlog reference: `toDos.md` - High Priority Features section
- Related epic: Class Management Feature (US-CLASS-001 through US-CLASS-007)

