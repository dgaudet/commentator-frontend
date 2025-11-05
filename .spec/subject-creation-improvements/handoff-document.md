# Subject Creation Improvements - Development Handoff

**Feature ID**: subject-creation-improvements
**Complexity**: L1 (Micro)
**Estimated Effort**: 1-2 days (5-6 story points)
**Priority**: HIGH (Story 2), MEDIUM (Story 1)
**Assignee**: Frontend Engineer

---

## 📋 Overview

Two complementary UX improvements for the subject creation workflow:
1. Add Cancel button to Create Subject form (create mode only - NOT edit mode)
2. Auto-select newly created subject in dropdown selector

---

## 🎯 User Stories

### US-SUBJECT-CREATE-001: Add Cancel Button to Create Mode (2 points, Low Risk)

**As a** teacher creating a new subject
**I want** a cancel button available in the create subject form
**So that** I can easily discard the form without submitting it

**Acceptance Criteria:**
- ✅ Cancel button displays in create mode only
- ✅ Cancel button NOT visible in edit mode
- ✅ Cancel button closes form and returns to subject list
- ✅ Cancel button disabled during form submission
- ✅ Clicking Cancel does NOT save any form data
- ✅ Two buttons side-by-side layout with proper spacing

### US-SUBJECT-CREATE-002: Auto-Select Newly Created Subject (3 points, Medium Risk)

**As a** teacher who just created a new subject
**I want** the newly created subject to be automatically selected in the dropdown
**So that** I can immediately start working with the new subject

**Acceptance Criteria:**
- ✅ Newly created subject automatically selected in dropdown
- ✅ Subject details display immediately after creation
- ✅ Selection persisted to localStorage
- ✅ List tab content displays by default
- ✅ No auto-select if creation fails
- ✅ Auto-selection does not interfere with existing state

---

## 📂 Files to Modify

### Primary Files

1. **`src/components/subjects/SubjectForm.tsx`**
   - **Lines 19-22**: Restore `onCancel` prop to interface
   - **Lines 40-42**: Restore `onCancel` to destructuring
   - **Lines 180-189**: Conditionally render cancel button (create mode only)
   - **Button Layout**: Two buttons in flex layout for create mode, single button for edit mode

2. **`src/components/subjects/SubjectList.tsx`**
   - **Line 51**: Add to `useSubjects` destructuring: `createSubject` (should already exist)
   - **Lines ~140-150**: Create `handleCreateSubject` wrapper that:
     - Calls the existing `createSubject` from hook
     - After success, calls `setSelectedSubjectId(newSubject.id)` with new subject
     - Calls parent's `onAddSubject` callback if provided

3. **`src/App.tsx`**
   - **Lines 107-111**: Restore `onCancel={handleFormCancel}` prop to SubjectForm in create mode

4. **`src/components/subjects/SubjectListItem.tsx`**
   - **Line 76**: Restore `onEditCancel` prop from destructuring (already there, just need to use it properly)

### Related Files (Context Only)

- **`src/utils/subjectStorageUtils.ts`** (already has `setSelectedSubjectId()`)
- **`src/hooks/useSubjects.ts`** (already has `createSubject()` method)

---

## 🛠️ Implementation Guide

### Task 1: Restore Cancel Button (TDD Red-Green-Refactor)

#### Red (Write Failing Test)

```typescript
// src/components/subjects/__tests__/SubjectForm.test.tsx

describe('SubjectForm cancel button', () => {
  it('should display Cancel button in create mode', () => {
    render(<SubjectForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />)

    expect(screen.getByRole('button', { name: /create subject/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
  })

  it('should have two buttons side-by-side in create mode', () => {
    render(<SubjectForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />)

    const createButton = screen.getByRole('button', { name: /create subject/i })
    const cancelButton = screen.getByRole('button', { name: /cancel/i })

    // Both should be in the same container with flex layout
    const container = createButton.closest('div')
    expect(container).toHaveClass('flex')
    expect(container).toHaveClass('gap-3')
  })

  it('should call onCancel when Cancel button clicked', () => {
    render(<SubjectForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />)

    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    fireEvent.click(cancelButton)

    expect(mockOnCancel).toHaveBeenCalled()
  })

  it('should NOT display Cancel button in edit mode', () => {
    const existingSubject = { id: 1, name: 'Math', createdAt: '2024-01-01', updatedAt: '2024-01-01' }

    render(
      <SubjectForm
        existingSubject={existingSubject}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    )

    expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument()
  })

  it('should disable Cancel button while submitting', async () => {
    mockCreateSubject.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100)),
    )

    render(<SubjectForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />)

    const nameInput = screen.getByLabelText(/subject name/i)
    fireEvent.change(nameInput, { target: { value: 'Test Subject' } })

    const createButton = screen.getByRole('button', { name: /create subject/i })
    fireEvent.click(createButton)

    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    expect(cancelButton).toBeDisabled()
  })
})
```

#### Green (Implement Changes)

```typescript
// src/components/subjects/SubjectForm.tsx

interface SubjectFormProps {
  existingSubject?: Subject
  onSuccess: (subjectItem: Subject) => void
  onCancel: () => void // Restore prop for create mode
}

export const SubjectForm: React.FC<SubjectFormProps> = ({
  existingSubject,
  onSuccess,
  onCancel,
}) => {
  // ... existing code ...

  // In the button section (around line 180):
  <div className={isEditMode ? 'mt-6' : 'flex gap-3 mt-6'}>
    <Button
      type="submit"
      variant="primary"
      disabled={isSubmitting}
      className={isEditMode ? 'w-full' : 'flex-1'}
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
}
```

#### Refactor
- Verify button styling matches design system
- Ensure accessibility (focus states, keyboard navigation)
- Test with multiple rapid clicks to verify disabled state

---

### Task 2: Auto-Select Newly Created Subject (TDD Red-Green-Refactor)

#### Red (Write Failing Test)

```typescript
// src/components/subjects/__tests__/SubjectList.test.tsx

describe('Auto-select newly created subject', () => {
  it('should select newly created subject in dropdown', async () => {
    const newSubject = {
      id: 99,
      name: 'New Subject',
      createdAt: '2024-01-16T10:30:00Z',
      updatedAt: '2024-01-16T10:30:00Z',
    }

    const mockCreateSubject = jest.fn().mockResolvedValue(newSubject)
    const mockSetSelectedSubjectId = jest.fn()

    // Mock useSubjects to provide our functions
    jest.spyOn(require('../../hooks/useSubjects'), 'useSubjects').mockReturnValue({
      subjects: mockSubjects,
      isLoading: false,
      error: null,
      fetchSubjects: jest.fn(),
      createSubject: mockCreateSubject,
      updateSubject: jest.fn(),
      deleteSubject: jest.fn(),
      clearError: jest.fn(),
    })

    // Mock storage utils
    jest.spyOn(require('../../utils/subjectStorageUtils'), 'setSelectedSubjectId').mockImplementation(
      mockSetSelectedSubjectId
    )

    const { user } = render(<SubjectList onAddSubject={jest.fn()} />)

    // Simulate subject creation (would happen through the form)
    // After creation, setSelectedSubjectId should have been called
    // and the dropdown should show the new subject selected

    // This would be verified through the component's state and localStorage update
  })

  it('should persist selection to localStorage after creation', async () => {
    const newSubject = {
      id: 99,
      name: 'New Subject',
      createdAt: '2024-01-16T10:30:00Z',
      updatedAt: '2024-01-16T10:30:00Z',
    }

    // Test that setSelectedSubjectId is called with the new subject ID
    expect(setSelectedSubjectId).toHaveBeenCalledWith(newSubject.id)
  })
})
```

#### Green (Implement Changes)

```typescript
// src/components/subjects/SubjectList.tsx

import { setSelectedSubjectId } from '../../utils/subjectStorageUtils'

// In SubjectList component, create wrapper for subject creation:

const handleCreateSubject = useCallback(
  async (subjectData: CreateSubjectRequest) => {
    try {
      const newSubject = await createSubject(subjectData)

      // Auto-select the newly created subject
      setSelectedSubjectId(newSubject.id)
      setSelectedSubjectId(newSubject.id) // Update state to trigger UI update

      // Call parent callback if provided
      onAddSubject?.()
    } catch (err) {
      // Error already handled by useSubjects hook
      console.error('Failed to create subject:', err)
    }
  },
  [createSubject, onAddSubject]
)

// Pass this wrapper to SubjectForm:
<SubjectForm
  onSuccess={handleCreateSubject}
  onCancel={handleFormCancel}
/>
```

#### Refactor
- Ensure localStorage is updated correctly
- Verify UI state synchronizes with localStorage
- Test that selection persists across page reloads
- Verify error cases don't cause unexpected selections

---

## 🧪 Test Requirements

### Unit Tests to Add/Update

1. **SubjectForm.test.tsx**
   - ✅ Cancel button displays in create mode
   - ✅ Cancel button NOT in edit mode
   - ✅ Two buttons layout in create mode
   - ✅ `onCancel` called when clicked
   - ✅ Cancel button disabled during submission

2. **SubjectList.test.tsx**
   - ✅ New subject auto-selected after creation
   - ✅ Selection persisted to localStorage
   - ✅ Subject details display after auto-selection
   - ✅ No auto-select on creation failure

### E2E Tests to Add

1. **e2e/subjectManagement.spec.ts**
   - ✅ Create subject → Cancel button visible
   - ✅ Edit subject → Cancel button hidden
   - ✅ Create new subject → Automatically selected
   - ✅ Auto-selected subject shows details
   - ✅ Selection persists on page reload

### Coverage Target
- **Minimum**: 90% line coverage for modified files
- **Focus**: Edge cases (create vs edit, selection state, localStorage)

---

## ✅ Acceptance Checklist

### Before Starting
- [ ] Read entire handoff document
- [ ] Understand TDD Red-Green-Refactor cycle
- [ ] Verify access to all files
- [ ] Understand difference between create and edit modes

### During Implementation - Story 1 (Cancel Button)
- [ ] Write failing test for cancel button in create mode
- [ ] Implement cancel button JSX conditionally
- [ ] Verify test passes
- [ ] Write test for edit mode (no cancel button)
- [ ] Verify both-button layout styling
- [ ] Write test for onCancel callback
- [ ] Verify disabled state during submission
- [ ] Run full test suite: `npm run test`
- [ ] Run linter: `npm run lint`

### During Implementation - Story 2 (Auto-Select)
- [ ] Write failing test for auto-select behavior
- [ ] Create `handleCreateSubject` wrapper
- [ ] Call `setSelectedSubjectId()` with new subject ID
- [ ] Update state to trigger UI refresh
- [ ] Verify dropdown shows new subject selected
- [ ] Test localStorage persistence
- [ ] Test that selection survives page reload
- [ ] Write test for failed creation (no auto-select)
- [ ] Run full test suite: `npm test`
- [ ] Run linter: `npm run lint`

### Before Committing
- [ ] All unit tests passing
- [ ] All E2E tests passing
- [ ] Linter passing with zero errors
- [ ] Code coverage meets 90% threshold
- [ ] Manual testing confirms:
  - [ ] Cancel button visible in create mode
  - [ ] Cancel button hidden in edit mode
  - [ ] Cancel closes form without saving
  - [ ] New subject auto-selected after creation
  - [ ] Subject details display immediately
  - [ ] Selection persists after page reload
  - [ ] Failed saves don't auto-select
- [ ] All files end with newline
- [ ] Accessibility tested (keyboard nav, screen reader)

---

## 📋 Commit Message Format

```
feat(subjects): add cancel button and auto-select for new subjects

- Add Cancel button to create subject form (US-SUBJECT-CREATE-001)
- Auto-select newly created subject in dropdown (US-SUBJECT-CREATE-002)
- Restore onCancel prop to SubjectForm for create mode only
- Persist subject selection to localStorage after creation
- Maintain full-width button in edit mode, two-button layout in create

Cancel button only appears in create mode. Users can still cancel
edit mode by switching tabs. Newly created subjects are now
immediately available and selected, improving workflow continuity.

Tests: All 540+ tests passing
Lint: Zero errors

Implements: lines 19 in toDos.md

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

## 🚨 Known Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| **Cancel button shows in edit mode** | Low | High | Test both modes thoroughly, JSX conditional clear |
| **Auto-select causes wrong subject display** | Low | Medium | Verify `setSelectedSubjectId()` timing, test state sync |
| **localStorage not updated** | Low | Medium | Mock storage utils in tests, verify calls |
| **Race condition on rapid creation** | Low | Low | `isSubmitting` state prevents double-submission |
| **Selection doesn't persist on reload** | Low | Medium | Test localStorage integration, verify utility functions |

---

## 📚 Reference Documentation

### Existing Patterns
- **Cancel handling**: Reference how `onCancel` is used elsewhere in App.tsx
- **Selection state**: Review `SubjectList` dropdown selection management
- **Storage utils**: Check `subjectStorageUtils.ts` for `setSelectedSubjectId()` implementation
- **Button styling**: Reference Button component (`src/components/common/Button.tsx`)
- **TDD examples**: Check existing tests in `__tests__/` directories

### Related User Stories
- **US-EDIT-SUBJ-001**: Cancel button removal (inverse - we're adding it back for create only)
- **US-EDIT-SUBJ-002**: Data reload after save (storage and state management patterns)
- **US-REFACTOR-005**: SubjectList refactoring (component structure reference)

---

## 💬 Questions or Issues?

If you encounter blockers:

1. **Cancel button logic**: Review the earlier refactoring where we removed it - reverse those changes for create mode only
2. **State management**: Check how `selectedSubjectId` state is managed in SubjectList
3. **localStorage integration**: Verify `setSelectedSubjectId()` utility exists and works as expected
4. **Test failures**: Compare with existing subject creation tests for patterns
5. **Styling issues**: Reference Button component and flex layout patterns in codebase

---

## 🎉 Success Criteria

**Feature is complete when:**
- ✅ Cancel button visible in create mode, hidden in edit mode
- ✅ Cancel button works correctly (closes form without saving)
- ✅ Newly created subjects automatically selected in dropdown
- ✅ Auto-selected subject shows all details immediately
- ✅ Selection persists to localStorage
- ✅ No auto-select on creation failure
- ✅ All 540+ tests passing
- ✅ Linter passing with zero errors
- ✅ Code coverage ≥ 90%
- ✅ Manual testing confirms all requirements
- ✅ No regressions in existing functionality
- ✅ Commit message follows project standards

---

**Estimated Completion Time**: 1-2 days (5-6 story points)
**Complexity**: L1 (Micro) - Straightforward feature additions
**Handoff Date**: 2025-11-05
**Product Owner**: Principal Product Owner (Product-Owner Persona)
**Next Step**: Assign to Frontend Engineer for TDD implementation
