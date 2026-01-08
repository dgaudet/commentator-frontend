# User Stories: Increase Final Comment Character Limit to 3000

**Feature**: 3000-char-final-comments
**Complexity**: L0 (Atomic)
**Branch**: `feature/3000-char-final-comments`
**Base Branch**: `main`
**Status**: Planning Phase
**Last Updated**: 2026-01-08

---

## Story Overview

| Story ID | Title | Points | Status | Linked Tasks |
|----------|-------|--------|--------|--------------|
| US-3000-CHAR-001 | Update Final Comment Character Limit from 1000 to 3000 | 1 | PENDING | TASK-1, TASK-2, TASK-3 |

**Total Effort**: 1 story point
**Total Acceptance Criteria**: 5
**Estimated Implementation Time**: Less than 1 day

---

## US-3000-CHAR-001: Update Final Comment Character Limit from 1000 to 3000

**Complexity**: L0 (Atomic)
**Effort Estimate**: 1 point
**Status**: PENDING
**Priority**: HIGH
**Linked Epic**: Backend API Enhancement (backend already supports 3000 char limit)

### User Story

```
AS A teacher writing final comments
I WANT to be able to write up to 3000 characters in the final comment field
SO THAT I have more space to provide detailed, comprehensive feedback to students
```

### Acceptance Criteria

**AC-1.1: Character Limit Updated in Add Form**
```
GIVEN a teacher opens the FinalCommentsModal in Add mode
WHEN the Add form is displayed
THEN the final comment textarea accepts up to 3000 characters
AND the maxLength HTML attribute is set to 3000
AND the character counter displays X/3000 (e.g., "156/3000 characters")
AND the placeholder text reads "Enter optional comment (max 3000 characters)"
```

**AC-1.2: Character Limit Updated in Edit Form**
```
GIVEN a teacher opens the FinalCommentsModal in Edit mode
WHEN the Edit form is displayed
THEN the final comment textarea accepts up to 3000 characters
AND the maxLength HTML attribute is set to 3000
AND the character counter displays X/3000 (e.g., "156/3000 characters")
AND the placeholder text reads "Enter optional comment (max 3000 characters)"
```

**AC-1.3: Truncation Logic Updated**
```
GIVEN the Populate with Above Comments button is clicked
AND the combined outcome + personalized comment text exceeds 3000 characters
WHEN the text is populated into the textarea
THEN the text is truncated to exactly 3000 characters (not 1000)
AND special characters and Unicode are preserved in the truncation
AND the textarea is focused and ready for user editing
```

**AC-1.4: Documentation Updated**
```
GIVEN the feature has been implemented
WHEN reviewing component documentation and code comments
THEN all references to the 1000 character limit are updated to 3000
AND the JSDoc comments in FinalCommentsModal.tsx accurately reflect the new limit
AND the character limit explanation in the Populate button logic is updated
```

**AC-1.5: Form Validation Passes**
```
GIVEN a user attempts to submit a final comment
WHEN the comment contains up to 3000 characters
THEN the form validates successfully
AND the comment is submitted to the API
AND no validation errors appear
```

### Testing Strategy

**Unit Tests** (2 tests required):
1. Test 1000-char edge case still validates (backward compatibility)
2. Test 3000-char edge case validates and truncates correctly

**Integration Tests** (2 tests required):
1. Add form accepts and submits 3000-char comment
2. Edit form accepts and submits 3000-char comment

**Manual Testing**:
1. Verify character counter updates correctly as user types
2. Verify Populate button correctly truncates to 3000 chars
3. Verify form submission succeeds with 3000 char comment
4. Verify form submission succeeds with comment under 3000 chars

### Edge Cases & Validation Rules

| Case | Behavior |
|------|----------|
| User types 3000 chars | Text accepted, counter shows "3000/3000" |
| User types 3001 chars | Browser maxLength prevents input |
| Populate button creates >3000 chars | Auto-truncate to 3000 |
| Comment with Unicode (emojis) | Preserved in full, character count is accurate |
| Form submission with 3000 chars | Accepted by API (backend already supports) |
| Existing comments in DB >1000 chars | Display correctly in Edit form |

### Technical Considerations

1. **Backward Compatibility**:
   - Existing comments with 1000-3000 characters in database will display correctly
   - Form should accept and preserve these comments

2. **Truncation Behavior**:
   - Current truncation at character 1000 occurs in `populateComments()` function
   - Must update to character 3000
   - Truncation happens AFTER combining outcome + personal comments

3. **UI Implications**:
   - Character counter font size and styling may need adjustment for larger numbers
   - "3000" is 4 digits vs "1000" being 4 digits (no change in width needed)
   - No layout changes anticipated

4. **No API Changes**:
   - Backend already accepts 3000 character limit
   - No API endpoint modifications needed

### Dependencies

- **None** - This is purely a frontend configuration change
- Backend has already been updated to accept 3000 characters

### Affected Files

| File | Changes Required |
|------|------------------|
| `src/components/finalComments/FinalCommentsModal.tsx` | Update maxLength, placeholder, truncation logic (line 501, 839, 842, 1147, 1150) |
| `src/components/finalComments/FinalCommentsModal.tsx` (JSDoc) | Update character limit references in comments (line 43) |
| Test files | Update any tests that validate character limits |

---

## Reference Links

- **Backend Feature**: Already implemented - API accepts up to 3000 characters
- **Current Implementation**: `src/components/finalComments/FinalCommentsModal.tsx` lines 500-502, 839-865, 1147-1172
- **Related Features**:
  - US-FC-REFACTOR-003: Populate with Above Comments (contains truncation logic)
  - US-FINAL-003: Create new final comment (uses FinalCommentsModal)
  - US-FINAL-004: Edit existing final comment (uses FinalCommentsModal)

---

## Acceptance Definition

**Feature is complete when**:
1. ✅ All 5 acceptance criteria are met
2. ✅ All unit and integration tests pass
3. ✅ Character limit works in both Add and Edit forms
4. ✅ Populate button truncates to 3000 (not 1000)
5. ✅ Documentation and code comments updated
6. ✅ Manual testing confirms expected behavior
7. ✅ Linting passes: `npm run lint`
8. ✅ Full test suite passes: `npm run test` (1473+ tests)
