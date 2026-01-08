# Implementation Tasks: Rating Selector Persistence

## Feature: Persist Last Selected Rating in PersonalizedCommentsModal

**Branch**: `feature/rating-persist-last-selected`
**Base Branch**: `main`
**Linked Stories**: US-RATING-PERSIST-001, US-RATING-PERSIST-002, US-RATING-PERSIST-003, US-RATING-PERSIST-004

---

## Task Breakdown

### TASK-1: Add State for Persisting Last Rating (LOW RISK)
**Story Mapping**: US-RATING-PERSIST-001, US-RATING-PERSIST-002
**Effort Estimate**: 1 point
**Risk Tier**: LOW - Single file state addition

**Objective**: Add state variable to track the last selected rating across add/edit operations within a modal session.

**Red-Green-Refactor Steps**:

1. **RED** - Write test that verifies:
   - `lastSelectedRating` state is initialized to 3 (neutral default)
   - State is accessible as a component variable
   - Test file: `PersonalizedCommentsModal.rating-selector.test.tsx`
   - Test name: `"should initialize lastSelectedRating to default (3)"`

2. **GREEN** - Add to PersonalizedCommentsModal.tsx:
   ```typescript
   const [lastSelectedRating, setLastSelectedRating] = useState<number>(3);
   ```
   - Location: Near line 63-67 with other rating state variables
   - Verify test passes

3. **REFACTOR** - Review alongside existing rating state:
   - `newCommentRating` state (for add form)
   - `editRating` state (for edit form)
   - Ensure naming is clear and consistent

**Acceptance**: Test passes, state variable is declared and initialized.

---

### TASK-2: Persist Rating on Successful Comment Add (LOW RISK)
**Story Mapping**: US-RATING-PERSIST-001 (AC-1.1, AC-1.2)
**Effort Estimate**: 1 point
**Risk Tier**: LOW - Modifies existing success handler

**Objective**: After successful comment creation, update `lastSelectedRating` instead of resetting `newCommentRating` to 3.

**Red-Green-Refactor Steps**:

1. **RED** - Write tests:
   - Mock successful API response for adding comment
   - Verify that after submit, `newCommentRating` equals the `lastSelectedRating`
   - Verify that `lastSelectedRating` is NOT reset to 3
   - Test names:
     - `"should persist rating after successful add"`
     - `"should keep newCommentRating equal to lastSelectedRating after add"`

2. **GREEN** - Modify `handleAddComment()` in PersonalizedCommentsModal.tsx (around line 101-120):
   - Change from: `setNewCommentRating(3)` after success
   - Change to: `setLastSelectedRating(newCommentRating)` after success
   - Keep `newCommentRating` at its current value (don't reset)
   - Clear comment text: `setNewCommentContent('')`
   - Verify tests pass

3. **REFACTOR** - Review the flow:
   - Ensure error states still reset appropriately (if applicable)
   - Verify focus management after add (consider moving focus to comment field for accessibility)

**Acceptance**: Tests pass, rating persists after successful add, comment text clears for next entry.

---

### TASK-3: Update newCommentRating When lastSelectedRating Changes (LOW RISK)
**Story Mapping**: US-RATING-PERSIST-001 (AC-1.3)
**Effort Estimate**: 1 point
**Risk Tier**: LOW - Connects existing state handlers

**Objective**: When user selects a new rating in add form, update both `newCommentRating` and `lastSelectedRating`.

**Red-Green-Refactor Steps**:

1. **RED** - Write test:
   - User selects rating 4 in the add form
   - Verify `newCommentRating` updates to 4
   - Verify `lastSelectedRating` also updates to 4
   - Test name: `"should update both newCommentRating and lastSelectedRating when user selects rating"`

2. **GREEN** - Modify the `onChange` handler for the add form rating selector (around line 153-157):
   - Current handler: `setNewCommentRating(rating)`
   - Add: `setLastSelectedRating(rating)` in the same handler
   - Verify both state variables update together
   - Verify test passes

3. **REFACTOR** - Consider creating a wrapper handler if needed:
   ```typescript
   const handleAddFormRatingChange = (rating: number) => {
     setNewCommentRating(rating);
     setLastSelectedRating(rating);
   };
   ```
   - Use on EmojiRatingSelector for add form
   - Name is explicit and reusable

**Acceptance**: Tests pass, rating selection updates both state variables.

---

### TASK-4: Persist Rating When Returning from Edit Mode (LOW RISK)
**Story Mapping**: US-RATING-PERSIST-002 (AC-2.1, AC-2.3)
**Effort Estimate**: 1 point
**Risk Tier**: LOW - Modifies edit mode exit handlers

**Objective**: When user saves or cancels edit mode, set `lastSelectedRating` to the edited comment's rating.

**Red-Green-Refactor Steps**:

1. **RED** - Write tests:
   - User edits a comment with rating 2
   - After save or cancel, verify `lastSelectedRating` = 2
   - Add form rating selector shows 2 as selected
   - Test names:
     - `"should persist edited comment rating when save is clicked"`
     - `"should persist edited comment rating when cancel is clicked"`
     - `"should show persisted rating in add form after edit mode closes"`

2. **GREEN** - Modify edit mode handlers:
   - `handleSaveEdit()` (around line 131-145):
     - After API call succeeds, add: `setLastSelectedRating(editRating)`
   - `handleCancelEdit()` (around line 146-151):
     - When exiting edit mode, add: `setLastSelectedRating(editRating)`
   - Set `editingId` to null to exit edit mode as normal
   - Verify tests pass

3. **REFACTOR** - Review both handlers:
   - Ensure state cleanup is complete
   - Verify no duplicate ratings are being sent to API

**Acceptance**: Tests pass, edit mode exit handlers update `lastSelectedRating`.

---

### TASK-5: Sync newCommentRating with lastSelectedRating on Edit Completion (LOW RISK)
**Story Mapping**: US-RATING-PERSIST-002 (AC-2.2)
**Effort Estimate**: 1 point
**Risk Tier**: LOW - State synchronization

**Objective**: Ensure the add form rating selector displays the `lastSelectedRating` for next comment.

**Red-Green-Refactor Steps**:

1. **RED** - Write test:
   - Edit comment with rating 4
   - Save or cancel edit
   - Verify add form rating selector displays 4 (not reset to 3)
   - Test name: `"should sync add form rating with lastSelectedRating after edit closes"`

2. **GREEN** - Sync state after edit mode closes:
   - In both `handleSaveEdit()` and `handleCancelEdit()`:
     - After `setEditingId(null)`, add: `setNewCommentRating(editRating)`
   - This ensures add form rating matches the persisted last rating
   - Verify test passes

3. **REFACTOR** - Ensure clean state transitions:
   - Review all state update patterns
   - Ensure no stale values remain

**Acceptance**: Tests pass, add form rating syncs with persisted rating after edit.

---

### TASK-6: Reset Rating on Modal Close (LOW RISK)
**Story Mapping**: US-RATING-PERSIST-003 (AC-3.1)
**Effort Estimate**: 1 point
**Risk Tier**: LOW - Cleanup handler

**Objective**: Reset `lastSelectedRating` to default when modal closes to prevent cross-session carryover.

**Red-Green-Refactor Steps**:

1. **RED** - Write test:
   - Set `lastSelectedRating` to 4
   - Verify modal is open
   - Close modal (set `isModalOpen` to false)
   - Reopen modal
   - Verify `lastSelectedRating` is reset to 3
   - Test name: `"should reset lastSelectedRating to default when modal closes and reopens"`

2. **GREEN** - Add useEffect cleanup or modal close handler:
   - Option A: Add `useEffect` that resets on modal close:
     ```typescript
     useEffect(() => {
       if (!isModalOpen) {
         setLastSelectedRating(3);
       }
     }, [isModalOpen]);
     ```
   - Option B: Call reset in existing modal close handler
   - Verify test passes

3. **REFACTOR** - Consider also resetting add/edit form state:
   - When modal closes: reset `newCommentRating`, `editRating`, `editingId`
   - Ensure clean state for next session
   - Review existing cleanup patterns in component

**Acceptance**: Tests pass, rating resets on modal close/reopen.

---

### TASK-7: Handle Edit Form Rating Display (LOW RISK)
**Story Mapping**: US-RATING-PERSIST-004 (AC-4.1, AC-4.3)
**Effort Estimate**: 1 point
**Risk Tier**: LOW - Existing functionality verification

**Objective**: Verify edit form correctly loads and displays comment's rating, handling null/undefined properly.

**Red-Green-Refactor Steps**:

1. **RED** - Write tests:
   - Edit comment with rating 2: verify `editRating` = 2
   - Edit comment with null rating: verify `editRating` = 3 (normalized default)
   - Test names:
     - `"should load existing rating into edit form"`
     - `"should normalize null rating to 3 when loading into edit form"`

2. **GREEN** - Review existing code (around line 123-130):
   - Confirm `getNormalizedRating()` is being used properly
   - Confirm null/undefined ratings default to 3
   - Current code should already handle this; verify tests confirm behavior

3. **REFACTOR** - If needed:
   - Ensure consistency with edit form initialization
   - Verify no duplicate rating normalizations

**Acceptance**: Tests pass, edit form correctly loads and normalizes ratings.

---

### TASK-8: Integration Test - Complete Workflow (LOW RISK)
**Story Mapping**: All stories (End-to-end validation)
**Effort Estimate**: 2 points
**Risk Tier**: LOW - Integration/validation

**Objective**: Verify complete workflow: add → persist → edit → persist → reset.

**Red-Green-Refactor Steps**:

1. **RED** - Write integration test:
   - Add comment with rating 4 (verify persists)
   - Add another comment with rating 4 (verify uses persisted rating)
   - Edit first comment to rating 2 (verify exits edit with rating 2)
   - Verify add form shows rating 2
   - Close and reopen modal (verify rating resets to 3)
   - Test name: `"should complete full rating persistence workflow"`

2. **GREEN** - Verify all previous TASK implementations work together:
   - Mock API responses
   - Simulate user interactions
   - Verify state transitions match acceptance criteria

3. **REFACTOR** - Clean up test as needed

**Acceptance**: Integration test passes, workflow matches AC from all user stories.

---

### TASK-9: Regression Testing & Cleanup (LOW RISK)
**Story Mapping**: Definition of Done
**Effort Estimate**: 1 point
**Risk Tier**: LOW - QA verification

**Objective**: Verify no regressions in existing rating functionality and code quality.

**Checklist**:
- [ ] All existing rating selector tests still pass
- [ ] All existing add/edit comment tests still pass
- [ ] No console errors or warnings
- [ ] Code follows project linting standards (`npm run lint` passes)
- [ ] TypeScript compilation errors: 0
- [ ] New tests follow existing test patterns
- [ ] Accessibility features intact (keyboard navigation, ARIA labels)
- [ ] Component prop types unchanged

**Acceptance**: All checks pass, no regressions detected.

---

## Summary Table

| Task ID | Title | Story Link | Effort | Risk | Status |
|---------|-------|-----------|--------|------|--------|
| TASK-1 | Add State for Persisting Last Rating | US-PERSIST-001/002 | 1 pt | LOW | PENDING |
| TASK-2 | Persist Rating on Successful Add | US-PERSIST-001 | 1 pt | LOW | PENDING |
| TASK-3 | Update Both Rating States on Selection | US-PERSIST-001 | 1 pt | LOW | PENDING |
| TASK-4 | Persist Rating When Returning from Edit | US-PERSIST-002 | 1 pt | LOW | PENDING |
| TASK-5 | Sync Add Form Rating After Edit | US-PERSIST-002 | 1 pt | LOW | PENDING |
| TASK-6 | Reset Rating on Modal Close | US-PERSIST-003 | 1 pt | LOW | PENDING |
| TASK-7 | Handle Edit Form Rating Display | US-PERSIST-004 | 1 pt | LOW | PENDING |
| TASK-8 | Integration Test - Complete Workflow | All | 2 pts | LOW | PENDING |
| TASK-9 | Regression Testing & Cleanup | DoD | 1 pt | LOW | PENDING |

**Total Effort**: 10 story points
**Total Risk**: All LOW risk (no blocking or risky changes)

---

## Definition of Done (from User Stories)

- [ ] Code changes committed to feature branch
- [ ] All acceptance criteria verified with tests
- [ ] Existing rating-selector tests still pass
- [ ] No regressions in add/edit/delete comment workflows
- [ ] Code adheres to project TDD standards
- [ ] PR includes reference to user stories and acceptance criteria
- [ ] Product Owner acceptance: All acceptance criteria met

---

## Technical Notes

**Files Modified**:
- `src/components/personalizedComments/PersonalizedCommentsModal.tsx` (main changes)

**Test Files**:
- `src/components/personalizedComments/__tests__/PersonalizedCommentsModal.rating-selector.test.tsx` (add new tests)

**No Breaking Changes**:
- EmojiRatingSelector component unchanged
- API contract unchanged
- UI unchanged

**State Management Summary**:
- Add `lastSelectedRating` state (number, default 3)
- Modify `handleAddComment()` to persist rating instead of reset
- Modify rating change handlers to update both state variables
- Modify edit mode exits to persist the edited rating
- Add cleanup on modal close
