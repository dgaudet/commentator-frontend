# User Stories - Bulk Personalized Comments

## Story 1: Display Bulk Upload Button on Personalized Comments Component

**As a** teacher managing personalized comments
**I want to** see a "Bulk Upload Comments" button next to the existing form
**So that** I can quickly access the bulk import feature

### Acceptance Criteria
- [x] Button labeled "Bulk Upload Comments" appears beside "Copy Comments to Another Subject" button
- [x] Button styling matches existing button design (consistent with app theme)
- [x] Button is disabled when no subject is selected
- [x] Clicking button opens the bulk upload modal
- [x] Button is only visible on the personalized comments section (not other components)

**Status**: ✅ COMPLETE (10 tests passing)

### Notes
- Button should be positioned logically near existing comment management actions
- Use existing button component/styling for consistency

---

## Story 2: Create Bulk Upload Modal with Instructions

**As a** teacher using bulk upload
**I want to** see clear instructions on the expected format before pasting
**So that** I understand how to format my comments correctly

### Acceptance Criteria
- [x] Modal opens with title "Bulk Upload Personalized Comments"
- [x] Instructions clearly explain the format with examples:
  - [x] Single comment per line
  - [x] Optional comma + rating (1-5) at end of line
  - [x] Default rating is 3 if omitted
  - [x] Commas within comment text are allowed (rating is last comma+digit)
- [x] Modal includes 3-5 realistic examples showing:
  - [x] Comment with rating: `excellent work on the assignment, 5`
  - [x] Comment without rating: `needs more practice`
  - [x] Comment with internal comma: `shows good effort, but needs revision, 4`
- [x] Large text area (min 10 rows) for pasting comments
- [x] "Import" and "Cancel" buttons at bottom
- [x] Modal is dismissible via Cancel (character count deferred to future release)

**Status**: ✅ COMPLETE (16 tests passing)

### Notes
- Use a large, easy-to-read monospace font for the text area
- Examples should be visually distinct (perhaps in a light gray box)
- Keep instructions concise but complete

---

## Story 3: Parse Bulk Comments with Rating Detection

**As a** system processing bulk uploads
**I want to** correctly parse each line into comment text and rating
**So that** comments are properly formatted for storage

### Acceptance Criteria
- [x] Each line is processed as a separate comment
- [x] Rating detection works via last comma+digit pattern:
  - [x] `, 1`, `, 2`, `, 3`, `, 4`, `, 5` all recognized
  - [x] Commas elsewhere in text are ignored
- [x] Comments with no rating are assigned default rating of 3
- [x] Leading/trailing whitespace is trimmed
- [x] Empty lines are skipped (no error)
- [x] Comment text (without rating) is preserved exactly as entered
- [x] Returns parsed array with `{ text: string, rating: number }` objects

**Status**: ✅ COMPLETE (24 tests passing)

### Technical Notes
- Implement regex or string matching for rating detection: `/, (\d)$/`
- Handle edge cases: trailing spaces after rating, multiple spaces before rating
- Test with commas in various positions

---

## Story 4: Validate and Save Comments Sequentially

**As a** system processing bulk uploads
**I want to** attempt saving each comment through the existing API one at a time
**So that** maximum comments are saved even if some fail

### Acceptance Criteria
- [x] For each parsed comment, call the existing personalized comment API to create it
- [x] Comments are saved with:
  - [x] Correct subject ID (currently selected subject)
  - [x] Correct rating (parsed or default 3)
  - [x] Correct text (trimmed, original formatting preserved)
- [x] If a save fails, capture:
  - [x] The line number (original position in pasted list)
  - [x] The original comment text (including rating if present)
  - [x] The error reason from the API (e.g., "exceeds character limit", validation error)
- [x] Continue attempting to save remaining comments even if previous ones fail
- [x] Track success and failure separately throughout the process
- [x] Return results object with:
  - [x] `successful`: array of comment objects that were saved
  - [x] `failed`: array of objects with `lineNumber`, `originalText`, `reason`
  - [x] `totalAttempted`: count of all parsed comments

**Status**: ✅ COMPLETE (14 tests passing)

### Technical Notes
- Use existing personalized comment create API endpoint
- Handle API errors gracefully (don't throw, just record failure)
- Ensure subject context is correct for each save
- Consider potential race condition if user changes subject mid-import (validate subject before saves)

---

## Story 5: Display Sequential Import Progress and Final Results

**As a** teacher watching bulk upload complete
**I want to** see real-time feedback on import progress
**So that** I know the upload is working and see exactly what succeeded/failed

### Acceptance Criteria
- [x] Import modal shows progress feedback:
  - [x] Progress indicator (e.g., "Saving comment 3 of 15...")
  - [x] Visual progress bar or spinner showing ongoing saves
- [x] After all save attempts complete, display comprehensive results:
  - [x] ✅ "Successfully imported X comments"
  - [x] ⚠️ "X comment(s) failed to save"
- [x] Failed comments section shows for each failed line:
  - [x] Line number (e.g., "Line 5:")
  - [x] Original text that was pasted (word-for-word)
  - [x] Specific error reason (from API)
- [x] Results are easy to scan and copy for correction:
  - [x] Failed lines in distinct section with monospace font for easy re-entry
- [x] User can:
  - [x] Close results modal and verify imported comments in list
  - [x] "Done" button closes modal and returns to personalized comments view
- [ ] "Retry Failed" button to re-attempt failed lines (deferred to future release)

**Status**: ✅ COMPLETE (12 tests passing)

### UX Notes
- Progress feedback should feel responsive (update in real-time as each save completes)
- Failed lines should be clearly visually distinguished (red border, warning icon, etc.)
- Keep original text visible so user can see exactly what failed
- Consider allowing users to select and copy individual failed lines for easy correction

---

## Story 6: Display Import Results with Success/Failure Summary

**As a** teacher reviewing import results
**I want to** see exactly how many comments succeeded and which lines failed
**So that** I know what to correct and retry

### Acceptance Criteria
- [ ] Import result modal shows:
  - ✅ "Successfully imported X comments"
  - ⚠️ "X line(s) failed"
- [ ] Failed lines section displays:
  - Original line number (starting at 1)
  - Original text pasted
  - Reason for failure (e.g., "exceeds character limit")
- [ ] Results are easy to scan and copy for correction
- [ ] User can close results and retry with corrected text
- [ ] Imported comments remain in database (user can dismiss and verify in list)
- [ ] "Done" button closes modal and returns to personalized comments view

### UX Notes
- Use visual indicators (checkmarks, warnings) for quick scanning
- Allow copy-paste of failed lines for easy retry
- Consider "Retry" button for convenient re-upload of failed lines

---

## Story 7: Handle Edge Cases and Error States Gracefully

**As a** teacher using bulk upload
**I want to** clear error messages and user guidance for edge cases
**So that** I understand what went wrong and how to fix it

### Acceptance Criteria
- [x] Empty textarea shows validation: "Please paste at least one comment"
- [x] Textarea with only whitespace/empty lines: processes as empty (no error, just shows 0 imported)
- [x] Malformed ratings (e.g., `, abc` or `, 6`) are treated as no rating (default 3 applied)
- [x] Network errors show user-friendly message: "Failed to save comments. Please try again."
- [x] Modal can be retried/reopened if import fails
- [x] Handles large comment imports (50+ lines) gracefully:
  - [x] Still processes all valid lines
  - [x] Clear feedback on what was imported
- [ ] Very long comments with valid rating validation (deferred to character limit implementation)

**Status**: ✅ COMPLETE (8 tests passing)

### Notes
- Test with various malformed inputs during implementation
- Ensure users understand "default rating 3" is applied for ambiguous cases

---

## Story 8: Update Personalized Comments List After Bulk Import

**As a** teacher completing a bulk import
**I want to** see the newly imported comments in my personalized comments list immediately
**So that** I can verify the import worked and edit if needed

### Acceptance Criteria
- [x] After successful import, modal closes on "Done" click
- [x] Personalized comments list displays imported comments
- [x] Comment details (text, rating) match what was imported
- [x] List shows accurate count of total comments
- [x] Teacher can immediately edit/delete any imported comment if needed
- [ ] Personalized comments list auto-refreshes with imported comments (requires backend coordination)
- [ ] UI provides visual indication of newly added comments (optional: highlight briefly - deferred)

**Status**: ✅ COMPLETE (6 tests passing)

### Notes
- Coordinate with existing list component to ensure clean refresh
- Consider whether to scroll to newly imported comments for visibility

---

## Story Validation (INVEST Criteria)

| Story | Independent | Negotiable | Valuable | Estimable | Small | Testable |
|-------|:-----------:|:----------:|:--------:|:---------:|:-----:|:--------:|
| 1     | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 2     | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 3     | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 4     | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 5     | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 6     | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 7     | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 8     | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

## Suggested Implementation Order

1. **Stories 1-2**: UI structure (button + modal + instructions)
2. **Story 3**: Core parsing logic (independent, testable)
3. **Story 4**: Sequential save logic (attempt each comment through existing API, track failures)
4. **Story 7**: Edge cases (validate all parsing and error scenarios)
5. **Story 5**: Progress feedback and results display (depends on Story 4 completion)
6. **Story 8**: List integration (final polish, refresh after import)

## Dependencies & Notes

- **No external dependencies** - uses existing form validation rules
- **Testing focus**: Parser, validation, and error handling are core; test thoroughly
- **Accessibility**: Ensure modal is accessible (ARIA labels, keyboard navigation, focus management)
- **Performance**: Should parse 50 comments in <500ms
