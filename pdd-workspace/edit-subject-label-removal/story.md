# Story: Remove "Edit Subject" Label from SubjectForm

## User Story

**As a** product manager optimizing the UI/UX of the subject management interface

**I want** to remove or simplify the "Edit Subject" label from the SubjectForm component

**So that** the interface is cleaner and less redundant (the tab and form context already indicate we're editing)

## Acceptance Criteria

### AC1: Remove Form Title in Edit Mode
- **GIVEN** a user is editing an existing subject
- **WHEN** the SubjectForm renders in edit mode
- **THEN** the form title "Edit Subject" is no longer displayed
- **AND** the form maintains proper spacing and layout

### AC2: Update Button Text
- **GIVEN** a user is editing an existing subject
- **WHEN** the form is in edit mode
- **THEN** the button text changes from "Save Changes" to "Update Subject"
- **AND** the button styling remains consistent with the design system

### AC3: Create Mode Unchanged
- **GIVEN** a user is creating a new subject
- **WHEN** the SubjectForm renders in create mode
- **THEN** the form title "Add New Subject" is still displayed
- **AND** button text remains "Create Subject"
- **AND** cancel button still appears (when onCancel is provided)

### AC4: Tab Label Remains
- **GIVEN** a user views the SubjectListItem tabs
- **WHEN** navigating the tabs
- **THEN** the "Edit Subject" tab label remains visible in the tab navigation
- **AND** this serves as the context indicator for editing mode

### AC5: Tests Updated
- **GIVEN** the codebase has tests that reference the "Edit Subject" label
- **WHEN** tests run after implementation
- **THEN** all tests pass with updated assertions
- **AND** tests validate the new behavior (no form title, "Update Subject" button)

## Design & Context

### Current Behavior
- Form displays "Edit Subject" heading when `existingSubject` prop is provided
- Button in edit mode says "Save Changes"
- Tab label in SubjectListItem says "Edit Subject"

### Proposed Behavior
- Remove the form heading entirely in edit mode (context from tab is sufficient)
- Change button text from "Save Changes" to "Update Subject" (more semantic)
- Keep tab label as "Edit Subject" (provides navigation context)

### Rationale
- The tab already indicates we're in edit mode
- Removing redundant label simplifies the UI
- "Update Subject" is more semantically correct than "Save Changes"
- Reduces cognitive load for users

## Implementation Details

### Files to Modify

1. **src/components/subjects/SubjectForm.tsx**
   - Line 181-189: Remove the form heading in edit mode
   - Line 225: Change "Save Changes" to "Update Subject"
   - Keep "Add New Subject" heading for create mode

2. **src/components/subjects/__tests__/SubjectForm.test.tsx**
   - Remove test checking for "Edit Subject" heading
   - Update tests to verify button says "Update Subject"
   - Add test to verify form title is NOT shown in edit mode

3. **src/components/subjects/__tests__/SubjectForm.design-tokens.test.tsx**
   - Update or remove design token tests related to the removed heading

4. **src/components/subjects/__tests__/SubjectListItem.test.tsx**
   - Verify "Edit Subject" tab label still exists (no changes needed)

5. **src/components/subjects/__tests__/SubjectListItem.delete-relocation.test.tsx**
   - Update any assertions related to the "Edit Subject" form heading

6. **src/components/subjects/__tests__/SubjectList.test.tsx**
   - Update any integration tests checking for "Edit Subject" heading

## Technical Approach

### Option A: Remove Title Entirely (Recommended)
```typescript
// Before
{isEditMode ? 'Edit Subject' : 'Add New Subject'}

// After
{!isEditMode && 'Add New Subject'}
```

**Pros:**
- Simplest implementation
- Cleaner UI
- Tab provides context

**Cons:**
- Less visual indication of editing

### Option B: Replace with Subject Name
```typescript
// Before
{isEditMode ? 'Edit Subject' : 'Add New Subject'}

// After
{isEditMode ? `Edit: ${existingSubject?.name}` : 'Add New Subject'}
```

**Pros:**
- Shows which subject is being edited
- Maintains some visual indication

**Cons:**
- More complex
- Subject name might be long

**Recommendation:** Option A (Remove title) - tab context is sufficient

## Dependencies

- No external dependencies
- No API changes
- No data model changes
- TDD approach: Write failing tests first, then update component

## Testing Strategy

1. **Unit Tests**: Verify form behavior in both create and edit modes
2. **Component Tests**: Check button text and form structure
3. **Visual Tests**: Ensure layout remains proper after removing title
4. **Integration Tests**: Verify editing flow still works end-to-end

## Effort Estimate

- **Implementation**: 30-45 minutes
- **Testing**: 20-30 minutes
- **Review**: 15-20 minutes
- **Total**: ~1-1.5 hours (L0/L1 complexity)

## Risk Assessment

**Risk Level: LOW**

- Simple UI change
- No business logic changes
- No data structure changes
- All tests can be easily updated
- No breaking changes to API

**Mitigation:**
- Comprehensive test coverage
- Visual verification after implementation
- Clear commit message with context

## Success Metrics

✅ Form title removed in edit mode
✅ Button text changed to "Update Subject"
✅ All tests pass
✅ No visual layout issues
✅ Create mode unaffected
✅ Tab navigation still works

## Related Issues

- Resolves TODO item in toDos.md (lines 42-44)
- Improves UI/UX by reducing redundancy
- Follows DRY principle (tab already indicates context)

## Acceptance Notes

- QA should verify both create and edit flows work correctly
- Visual verification needed to ensure spacing is proper
- Tab label must remain visible and clickable
