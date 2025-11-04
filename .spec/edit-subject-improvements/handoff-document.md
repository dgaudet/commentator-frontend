# Edit Subject Component Improvements - Development Handoff

**Feature ID**: edit-subject-improvements
**Complexity**: L0 (Atomic)
**Estimated Effort**: 2-4 hours
**Priority**: MEDIUM (US-EDIT-SUBJ-001), HIGH (US-EDIT-SUBJ-002)
**Assignee**: Frontend Engineer

---

## 📋 Overview

Two small but important UX improvements to the Edit Subject component:
1. Remove the unnecessary Cancel button from the edit form (user can switch tabs to cancel)
2. Ensure subject heading and dropdown update immediately after successful save

---

## 🎯 User Stories

### US-EDIT-SUBJ-001: Remove Cancel Button (1 point, Trivial)

**As a** teacher editing a subject
**I want** the cancel button removed from the edit form
**So that** the UI is cleaner and I can simply switch tabs to cancel editing

**Acceptance Criteria:**
- ✅ Edit form displays without Cancel button
- ✅ Save button uses full available width
- ✅ User can cancel by switching tabs or selecting different subject
- ✅ No functional changes to save behavior

### US-EDIT-SUBJ-002: Trigger Data Reload (2 points, Low Risk)

**As a** teacher who has edited a subject name
**I want** the subject heading and dropdown to immediately reflect my changes
**So that** I can see my updates without manually refreshing the page

**Acceptance Criteria:**
- ✅ Successful save triggers data reload from backend
- ✅ Subject heading (SubjectListItem) updates with new name
- ✅ Dropdown selector (SubjectList) updates with new name
- ✅ Failed saves do NOT trigger reload
- ✅ Current tab selection maintained during reload
- ✅ Reload completes within 2 seconds

---

## 📂 Files to Modify

### Primary Files

1. **`src/components/subjects/SubjectForm.tsx`**
   - **Lines 189-196**: Remove Cancel button JSX
   - **Line 125**: Ensure `onSuccess(result)` properly triggers reload
   - **Line 187**: Adjust Save button styling (remove `className="flex-1"`)

2. **Parent Component** (likely `src/App.tsx` or subject management container)
   - Implement `onEditSuccess` handler that calls `useSubjects` refresh method
   - Pass handler to SubjectList component

3. **`src/components/subjects/SubjectList.tsx`**
   - **Line 312**: Verify `onEditSuccess` prop is properly wired
   - Potentially add reload logic if not in parent

### Related Files (Context Only)

- **`src/components/subjects/SubjectListItem.tsx`** (Line 209: heading, Line 256: onSuccess prop)
- **`src/hooks/useSubjects.ts`** (May need to verify reload/refetch method exists)

---

## 🛠️ Implementation Guide

### Task 1: Remove Cancel Button (TDD Red-Green-Refactor)

#### Red (Write Failing Test)
```typescript
// src/components/subjects/__tests__/SubjectForm.test.tsx

describe('SubjectForm in Edit Mode', () => {
  it('should not display cancel button in edit mode', () => {
    const existingSubject = { id: 1, name: 'Math', createdAt: '2024-01-01', updatedAt: '2024-01-01' }

    render(
      <SubjectForm
        existingSubject={existingSubject}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    )

    const cancelButton = screen.queryByRole('button', { name: /cancel/i })
    expect(cancelButton).not.toBeInTheDocument()
  })

  it('should display save button with full width in edit mode', () => {
    const existingSubject = { id: 1, name: 'Math', createdAt: '2024-01-01', updatedAt: '2024-01-01' }

    render(
      <SubjectForm
        existingSubject={existingSubject}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    )

    const saveButton = screen.getByRole('button', { name: /save changes/i })
    expect(saveButton).toBeInTheDocument()
    expect(saveButton).not.toHaveClass('flex-1') // Should not share width
  })
})
```

#### Green (Implement Changes)
```tsx
// src/components/subjects/SubjectForm.tsx (lines 180-199)

<div className={isEditMode ? "mt-6" : "flex gap-3 mt-6"}>
  <Button
    type="submit"
    variant="primary"
    disabled={isSubmitting}
    className={isEditMode ? "w-full" : "flex-1"}
  >
    {isEditMode ? 'Save Changes' : 'Create Subject'}
  </Button>
  {!isEditMode && (
    <Button
      type="button"
      variant="secondary"
      onClick={onCancel}
      disabled={isSubmitting}
    >
      Cancel
    </Button>
  )}
</div>
```

#### Refactor
- Verify button styling matches design system
- Ensure accessibility (focus states, keyboard nav) remains intact
- Update any related E2E tests if needed

---

### Task 2: Trigger Data Reload After Save (TDD Red-Green-Refactor)

#### Red (Write Failing Test)

**Unit Test - SubjectList.tsx**
```typescript
// src/components/subjects/__tests__/SubjectList.test.tsx

describe('SubjectList Edit Success', () => {
  it('should reload subjects when onEditSuccess is called', async () => {
    const mockReload = jest.fn()
    // Mock useSubjects to provide reload method
    jest.spyOn(require('../../hooks/useSubjects'), 'useSubjects').mockReturnValue({
      subjects: mockSubjects,
      isLoading: false,
      error: null,
      clearError: jest.fn(),
      deleteSubject: jest.fn(),
      reload: mockReload, // New method to test
    })

    const { user } = render(<SubjectList />)

    // Simulate edit success
    const editSuccessCallback = // ... get callback from component props
    const updatedSubject = { id: 1, name: 'Updated Math', createdAt: '2024-01-01', updatedAt: '2024-01-02' }

    await editSuccessCallback(updatedSubject)

    expect(mockReload).toHaveBeenCalled()
  })
})
```

**Integration Test - E2E**
```typescript
// e2e/subjectManagement.spec.ts

test('editing subject updates heading and dropdown', async ({ page }) => {
  // Create initial subject
  await page.fill('[data-testid="subject-name-input"]', 'Original Math')
  await page.click('button:has-text("Create Subject")')

  // Select subject from dropdown
  await page.selectOption('#subject-selector', { label: 'Original Math' })

  // Click Edit tab
  await page.click('button[role="tab"]:has-text("Edit")')

  // Verify no cancel button
  await expect(page.locator('button:has-text("Cancel")')).not.toBeVisible()

  // Edit the subject name
  await page.fill('#subject-name', 'Updated Math')
  await page.click('button:has-text("Save Changes")')

  // Wait for success and verify heading updated
  await expect(page.locator('h3:has-text("Updated Math")')).toBeVisible({ timeout: 2000 })

  // Verify dropdown updated
  const dropdownText = await page.locator('#subject-selector option:checked').textContent()
  expect(dropdownText).toBe('Updated Math')
})
```

#### Green (Implement Changes)

**Option A: Add reload method to useSubjects hook** (if not exists)
```typescript
// src/hooks/useSubjects.ts

export const useSubjects = () => {
  // ... existing code ...

  const reload = useCallback(async () => {
    setIsLoading(true)
    try {
      const freshSubjects = await subjectService.getAll()
      setSubjects(freshSubjects)
      setError(null)
    } catch (err) {
      setError('Failed to reload subjects')
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    subjects,
    isLoading,
    error,
    clearError,
    createSubject,
    updateSubject,
    deleteSubject,
    reload, // Export reload method
  }
}
```

**Option B: Parent component implementation**
```typescript
// src/App.tsx (or parent component)

const handleEditSuccess = useCallback(async (updatedSubject: Subject) => {
  // Reload subjects from backend to get fresh data
  // This assumes useSubjects hook has a reload/refetch method
  // OR you can call the update method which may automatically update state

  // If using reload method:
  await subjectsHook.reload()

  // Alternative: If updateSubject already updates local state correctly,
  // you may not need additional logic here
}, [/* dependencies */])

<SubjectList
  onEditSuccess={handleEditSuccess}
  // ... other props
/>
```

**SubjectList component**
```typescript
// src/components/subjects/SubjectList.tsx

// Add reload function from useSubjects
const { subjects, isLoading, error, clearError, deleteSubject, reload } = useSubjects()

// Modify onEditSuccess handler
const handleEditSuccess = useCallback(async (subject: Subject) => {
  // Call parent's onEditSuccess if provided
  onEditSuccess?.(subject)

  // Reload subjects to reflect changes in dropdown and heading
  await reload()
}, [onEditSuccess, reload])
```

#### Refactor
- Consider optimistic updates to avoid reload delay
- Add loading indicator during reload if needed
- Verify no flickering during reload
- Ensure selected subject remains selected after reload

---

## 🧪 Test Requirements

### Unit Tests to Update/Add

1. **SubjectForm.test.tsx**
   - ✅ Cancel button not visible in edit mode
   - ✅ Save button full width in edit mode
   - ✅ Cancel button visible in create mode
   - ✅ `onSuccess` callback invoked after save

2. **SubjectList.test.tsx**
   - ✅ `onEditSuccess` triggers subject reload
   - ✅ Dropdown shows updated subject name after reload
   - ✅ Selected subject remains selected after reload
   - ✅ Reload does not occur on failed save

3. **SubjectListItem.test.tsx**
   - ✅ Heading displays updated subject name after edit
   - ✅ Tab selection maintained during reload

### E2E Tests to Add

1. **e2e/subjectManagement.spec.ts**
   - ✅ Edit subject → heading updates immediately
   - ✅ Edit subject → dropdown updates immediately
   - ✅ No cancel button in edit mode
   - ✅ Can cancel editing by switching tabs
   - ✅ Failed save does not trigger reload

### Coverage Target
- **Minimum**: 90% line coverage for modified files
- **Focus**: Edge cases (failed saves, rapid edits, tab switching)

---

## ✅ Acceptance Checklist

### Before Starting
- [ ] Read through this entire handoff document
- [ ] Verify you have access to all files listed
- [ ] Confirm understanding of TDD Red-Green-Refactor cycle
- [ ] Check that `useSubjects` hook has or can add reload method

### During Implementation
- [ ] **US-EDIT-SUBJ-001**: Write failing test for cancel button removal
- [ ] **US-EDIT-SUBJ-001**: Implement cancel button removal
- [ ] **US-EDIT-SUBJ-001**: Verify test passes and UI looks correct
- [ ] **US-EDIT-SUBJ-002**: Write failing test for data reload
- [ ] **US-EDIT-SUBJ-002**: Implement reload trigger
- [ ] **US-EDIT-SUBJ-002**: Verify test passes and reload works
- [ ] Run full test suite: `npm run test`
- [ ] Run E2E tests: `npm run test:e2e` (or Playwright equivalent)
- [ ] Run linter: `npm run lint` (must pass before commit)
- [ ] Manual testing in browser

### Before Committing
- [ ] All unit tests passing
- [ ] All E2E tests passing
- [ ] Linter passing with no errors
- [ ] Code coverage meets 90% threshold
- [ ] Manual testing confirms:
  - [ ] No cancel button in edit mode
  - [ ] Save button looks good (full width)
  - [ ] Subject heading updates after save
  - [ ] Dropdown updates after save
  - [ ] Failed saves don't break anything
  - [ ] Tab switching works as cancel mechanism
- [ ] All files end with newline character
- [ ] Accessibility tested (keyboard navigation, screen reader friendly)

### Commit Message Format
```
feat(subjects): improve edit subject UX

- Remove cancel button from edit form (US-EDIT-SUBJ-001)
- Trigger data reload after successful save (US-EDIT-SUBJ-002)
- Update heading and dropdown to reflect changes immediately

Fixes: lines 22-24 in toDos.md

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

## 🚨 Known Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| **Reload breaks tab state** | Preserve `requestedTab` state during reload, covered by existing useEffect logic |
| **Race condition on rapid edits** | `isSubmitting` state already prevents double-submission |
| **Dropdown loses selection** | `selectedSubjectId` persisted to localStorage, will survive reload |
| **Flickering during reload** | Consider optimistic update OR brief loading indicator |
| **useSubjects missing reload method** | Add reload method to hook (see Option A above) |

---

## 📚 Reference Documentation

### Existing Patterns
- **Subject Management**: See existing subject CRUD in `src/components/subjects/`
- **Hooks Pattern**: Follow pattern in `src/hooks/useSubjects.ts`
- **TDD Examples**: Check `src/components/subjects/__tests__/` for test patterns
- **Tab Implementation**: Reference `src/components/common/Tabs.tsx` and `SubjectListItem.tsx`

### Related User Stories
- **US-REFACTOR-006**: SubjectListItem refactoring (reference for component structure)
- **US-REFACTOR-007**: SubjectForm refactoring (reference for form patterns)
- **US-TAB-002**: Tabbed interface implementation (context for cancel button removal)
- **US-TABPANEL-002**: Tab panels display (context for edit form in tab)

---

## 💬 Questions or Issues?

If you encounter blockers during implementation:

1. **useSubjects hook doesn't have reload method**: Add it following the pattern in the hook, or check if `updateSubject` already updates local state correctly
2. **Parent component unclear**: Look at `src/App.tsx` to find where SubjectList is rendered and where state is managed
3. **Test failures**: Check existing test patterns in `__tests__/` directories for guidance
4. **Styling issues**: Refer to Button component (`src/components/common/Button.tsx`) for styling patterns

---

## 🎉 Success Criteria

**Feature is complete when:**
- ✅ All acceptance criteria met for both user stories
- ✅ All tests passing (unit + E2E)
- ✅ Linter passing
- ✅ Code coverage ≥ 90%
- ✅ Manual testing confirms expected behavior
- ✅ No regressions in existing subject management functionality
- ✅ Commit message follows project standards
- ✅ PR ready for review with reference to this handoff document

---

**Estimated Completion Time**: 2-4 hours
**Handoff Date**: 2025-11-04
**Product Owner**: Principal Product Owner (Product-Owner Persona)
**Next Step**: Assign to Frontend Engineer for implementation
