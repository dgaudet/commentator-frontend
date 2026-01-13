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

## Story 4: Validate Comments Against Form Constraints

**As a** teacher importing comments
**I want to** be told immediately if a comment violates character limits
**So that** I can correct them before importing

### Acceptance Criteria
- [ ] Each comment is validated against existing personalized comment form rules:
  - Character limit must match form (verify current limit in codebase)
  - Character limit applies to comment text only (not rating number)
- [ ] Rating must be integer 1-5
- [ ] Comments that exceed limits are marked as invalid
- [ ] Failed lines retain original text for easy reference
- [ ] Validation provides specific reason for failure (e.g., "exceeds 500 character limit")
- [ ] Valid and invalid comments are tracked separately

### Notes
- Coordinate with frontend team to confirm exact character limit for personalized comments
- Validation should be thorough but user-friendly in error messages

---

## Story 5: Execute Bulk Import and Save to Database

**As a** teacher completing a bulk upload
**I want to** all valid comments saved to the database in one operation
**So that** my import completes successfully without partial saves

### Acceptance Criteria
- [ ] All valid comments are saved to the current subject in a single API call
- [ ] Invalid comments are NOT saved (all-or-nothing for valid set)
- [ ] Comments are inserted with:
  - Correct subject ID (currently selected subject)
  - Correct rating (parsed or default 3)
  - Correct text (trimmed, original formatting preserved)
- [ ] Import succeeds even if some lines failed parsing (valid lines still save)
- [ ] Database timestamps (createdAt, updatedAt) are set by backend
- [ ] User can immediately see imported comments in the comments list

### Technical Notes
- Use batch create/insert operation if available
- Ensure subject context is preserved and correct
- Handle potential race conditions if user changes subject during import

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
3. **Story 4**: Validation logic (builds on Story 3)
4. **Story 7**: Edge cases (validate all edge cases before saving)
5. **Story 5**: Database integration (after validation confirmed working)
6. **Story 6**: Results display (depends on Story 5)
7. **Story 8**: List integration (final polish)

## Dependencies & Notes

- **No external dependencies** - uses existing form validation rules
- **Testing focus**: Parser, validation, and error handling are core; test thoroughly
- **Accessibility**: Ensure modal is accessible (ARIA labels, keyboard navigation, focus management)
- **Performance**: Should parse 50 comments in <500ms
