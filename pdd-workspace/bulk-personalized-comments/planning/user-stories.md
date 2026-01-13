# User Stories - Bulk Personalized Comments

## Story 1: Display Bulk Upload Button on Personalized Comments Component

**As a** teacher managing personalized comments
**I want to** see a "Bulk Upload Comments" button next to the existing form
**So that** I can quickly access the bulk import feature

### Acceptance Criteria
- [ ] Button labeled "Bulk Upload Comments" appears beside "Copy Comments to Another Subject" button
- [ ] Button styling matches existing button design (consistent with app theme)
- [ ] Button is disabled when no subject is selected
- [ ] Clicking button opens the bulk upload modal
- [ ] Button is only visible on the personalized comments section (not other components)

### Notes
- Button should be positioned logically near existing comment management actions
- Use existing button component/styling for consistency

---

## Story 2: Create Bulk Upload Modal with Instructions

**As a** teacher using bulk upload
**I want to** see clear instructions on the expected format before pasting
**So that** I understand how to format my comments correctly

### Acceptance Criteria
- [ ] Modal opens with title "Bulk Upload Personalized Comments"
- [ ] Instructions clearly explain the format with examples:
  - Single comment per line
  - Optional comma + rating (1-5) at end of line
  - Default rating is 3 if omitted
  - Commas within comment text are allowed (rating is last comma+digit)
- [ ] Modal includes 3-5 realistic examples showing:
  - Comment with rating: `excellent work on the assignment, 5`
  - Comment without rating: `needs more practice`
  - Comment with internal comma: `shows good effort, but needs revision, 4`
- [ ] Large text area (min 10 rows) for pasting comments
- [ ] "Import" and "Cancel" buttons at bottom
- [ ] Character count indicator showing bytes used (if needed)
- [ ] Modal is dismissible via X button or Cancel

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
- [ ] Each line is processed as a separate comment
- [ ] Rating detection works via last comma+digit pattern:
  - `, 1`, `, 2`, `, 3`, `, 4`, `, 5` all recognized
  - Commas elsewhere in text are ignored
- [ ] Comments with no rating are assigned default rating of 3
- [ ] Leading/trailing whitespace is trimmed
- [ ] Empty lines are skipped (no error)
- [ ] Comment text (without rating) is preserved exactly as entered
- [ ] Returns parsed array with `{ text: string, rating: number }` objects

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
- [ ] For each parsed comment, call the existing personalized comment API to create it
- [ ] Comments are saved with:
  - Correct subject ID (currently selected subject)
  - Correct rating (parsed or default 3)
  - Correct text (trimmed, original formatting preserved)
- [ ] If a save fails, capture:
  - The line number (original position in pasted list)
  - The original comment text (including rating if present)
  - The error reason from the API (e.g., "exceeds character limit", validation error)
- [ ] Continue attempting to save remaining comments even if previous ones fail
- [ ] Track success and failure separately throughout the process
- [ ] Return results object with:
  - `successful`: array of comment objects that were saved
  - `failed`: array of objects with `lineNumber`, `originalText`, `reason`
  - `totalAttempted`: count of all parsed comments

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
- [ ] Import modal shows progress feedback:
  - Progress indicator (e.g., "Saving comment 3 of 15...")
  - Visual progress bar or spinner showing ongoing saves
- [ ] After all save attempts complete, display comprehensive results:
  - ✅ "Successfully imported X comments"
  - ⚠️ "X comment(s) failed to save"
- [ ] Failed comments section shows for each failed line:
  - Line number (e.g., "Line 5:")
  - Original text that was pasted (word-for-word)
  - Specific error reason (from API)
- [ ] Results are easy to scan and copy for correction:
  - Failed lines in distinct section with monospace font for easy re-entry
  - Consider allowing copy-paste of failed lines
- [ ] User can:
  - Close results modal and verify imported comments in list
  - "Retry Failed" button to re-attempt failed lines with a new bulk upload
- [ ] "Done" button closes modal and returns to personalized comments view

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
- [ ] Empty textarea shows validation: "Please paste at least one comment"
- [ ] Textarea with only whitespace/empty lines: processes as empty (no error, just shows 0 imported)
- [ ] Malformed ratings (e.g., `, abc` or `, 6`) are treated as no rating (default 3 applied)
- [ ] Very long comments with valid rating are properly validated:
  - Text length checked before rating number
  - Rating not included in character count
- [ ] Network errors show user-friendly message: "Failed to save comments. Please try again."
- [ ] Modal can be retried/reopened if import fails
- [ ] Extremely long textarea (1000+ lines) handles gracefully:
  - Shows warning if >50 lines pasted
  - Still processes all valid lines
  - Clear feedback on what was imported

### Notes
- Test with various malformed inputs during implementation
- Ensure users understand "default rating 3" is applied for ambiguous cases

---

## Story 8: Update Personalized Comments List After Bulk Import

**As a** teacher completing a bulk import
**I want to** see the newly imported comments in my personalized comments list immediately
**So that** I can verify the import worked and edit if needed

### Acceptance Criteria
- [ ] After successful import, modal closes automatically (or on "Done" click)
- [ ] Personalized comments list refreshes with imported comments
- [ ] New comments appear in chronological order (newest first or appended)
- [ ] Comment details (text, rating) match what was imported
- [ ] List shows accurate count of total comments
- [ ] Teacher can immediately edit/delete any imported comment if needed
- [ ] UI provides clear visual indication of newly added comments (optional: highlight briefly)

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
