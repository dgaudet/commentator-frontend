# User Stories: Bulk Upload Duplicate Detection

## US-1: Duplicate Detection with Case-Insensitive Matching

**As a** teacher importing bulk comments
**When** I click "Import" on the bulk upload modal
**Then** the system checks each comment against existing personalized comments for the same subject with case-insensitive matching

### Acceptance Criteria

- ✅ System retrieves all existing personalized comments for the subject from PersonalizedCommentsModal state
- ✅ Each uploaded comment is normalized: trimmed of leading/trailing whitespace
- ✅ Comparison is case-insensitive (e.g., "Great work!" matches "great work!")
- ✅ Comments matching exactly (after normalization and case transformation) are identified as duplicates
- ✅ Duplicate comments are NOT saved to the database
- ✅ Non-duplicate comments are saved normally

### Test Scenarios

1. Upload "Hello" when "hello" exists → Detected as duplicate
2. Upload "  Hello  " when "hello" exists → Detected as duplicate (after trim)
3. Upload "Hello World" when "Hello world" exists → Detected as duplicate (case-insensitive)
4. Upload "New comment" when "different" exists → Saved as new comment
5. Upload 50 comments with 10 duplicates → 40 saved, 10 skipped

---

## US-2: Duplicate Count Tracking in Import Results

**As a** teacher
**When** I import bulk comments
**Then** the import results show how many comments were duplicates

### Acceptance Criteria

- ✅ `importResults.duplicateCount` is initialized to 0
- ✅ Each duplicate found increments `duplicateCount` by 1
- ✅ Final import results accurately reflect total duplicates detected
- ✅ Teachers can see the duplicate count in the import results summary

### Test Scenarios

1. Import 20 unique comments → `duplicateCount = 0`
2. Import 20 comments, 5 are duplicates → `duplicateCount = 5`
3. Import 100 comments, 25 are duplicates → `duplicateCount = 25`
4. Results summary displays: "3 duplicates skipped, 17 new comments added"

---

## US-3: Edge Case Handling for Whitespace and Empty Values

**As a** system
**When** processing bulk uploads
**Then** I correctly handle whitespace and empty value edge cases

### Acceptance Criteria

- ✅ Leading/trailing whitespace is trimmed before comparison
- ✅ Internal whitespace is preserved (e.g., "Hello  World" vs "Hello World" are different)
- ✅ Empty or null comments are handled gracefully (not matched as duplicates)
- ✅ Tabs and newlines are treated as whitespace for trimming
- ✅ System doesn't crash on malformed input

### Test Scenarios

1. Upload "  comment  " when "comment" exists → Duplicate
2. Upload "hello  world" when "hello world" exists → Different (internal space counts)
3. Upload "" (empty string) → Handled gracefully
4. Upload "\t\n  " (only whitespace) → Handled gracefully

---

## US-4: Import Results Display Shows Duplicate Feedback

**As a** teacher
**When** I complete a bulk import
**Then** I see clear feedback about which comments were duplicates

### Acceptance Criteria

- ✅ Import results modal/summary displays total duplicates skipped
- ✅ Results show breakdown: X new comments added, Y duplicates skipped
- ✅ User understands why some comments weren't added
- ✅ Duplicate count is accessible in importResults data structure
- ✅ Clear language: "3 comments were already present and were not re-imported"

### Test Scenarios

1. After import: Results show "Successfully imported 17 comments. 3 were already present and skipped."
2. All comments are new: Results show "Successfully imported 20 comments. No duplicates found."
3. All comments are duplicates: Results show "All 20 comments were already present. No new comments imported."

---

## Story Dependencies & Implementation Order

1. **US-1** (Duplicate Detection) - Core logic, build first
2. **US-3** (Edge Case Handling) - Related to US-1, test in parallel
3. **US-2** (Duplicate Tracking) - Build after US-1 works
4. **US-4** (Results Display) - Final UI feedback, depends on US-2

---

## Definition of Done

For each story:
- ✅ Code passes ESLint/Stylelint (`npm run lint`)
- ✅ Unit tests written first (TDD), all passing
- ✅ Feature tested manually with 20-100 comment uploads
- ✅ No console errors or warnings
- ✅ Duplicate detection accurate to 100%
- ✅ PersonalizedCommentsModal state used correctly
- ✅ PR includes reference to this PRD
