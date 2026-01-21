# User Stories - Bulk Upload Deduplication

**Feature**: Bulk Upload Deduplication
**Total Stories**: 4
**Complexity**: L1 (Micro)
**Target Sprint**: 2026-02-04 to 2026-02-07

---

## Story 1: Implement Deduplication Utility

**Title**: Create deduplication utility to detect and remove duplicate comments

**As a** frontend engineer implementing bulk upload deduplication
**I want** a reusable utility function that identifies and removes duplicate comments
**So that** we can apply deduplication logic cleanly before saving to API

---

### User Story Details

**Description**:
Create a new utility function `deduplicateComments` that:
- Accepts an array of parsed comments
- Identifies duplicates based on exact text match (case-insensitive)
- Returns deduplicated array + metadata about removed duplicates
- Preserves original order of first occurrence

**Acceptance Criteria**:

1. **Function Signature & Return Type**
   - Function: `deduplicateComments(comments: ParsedComment[]): DeduplicationResult`
   - Returns object with:
     - `unique: ParsedComment[]` - deduplicated comments
     - `duplicateCount: number` - how many were removed
     - `removedDuplicates: RemovedDuplicate[]` - details of what was removed (for debugging)

2. **Duplicate Detection Logic**
   - Treat two comments as duplicates if text is identical (case-insensitive)
   - Normalize whitespace: trim leading/trailing, collapse internal whitespace to single space
   - Text comparison: `text1.toLowerCase().trim() === text2.toLowerCase().trim()`
   - Preserve first occurrence, remove subsequent duplicates

3. **Edge Case Handling**
   - Empty input: return `{ unique: [], duplicateCount: 0, removedDuplicates: [] }`
   - Single comment: return `{ unique: [comment], duplicateCount: 0, removedDuplicates: [] }`
   - All duplicates: return `{ unique: [first], duplicateCount: n-1, removedDuplicates: [...] }`
   - Different ratings, same text: treat as duplicates (rating not considered for dedup)
   - Whitespace variations: normalize and treat as same

4. **Test Coverage**
   - Test exact duplicates
   - Test case variations ("Test", "test", "TEST")
   - Test whitespace variations ("test  text", "test text", " test text ")
   - Test mixed case + whitespace
   - Test all duplicates scenario
   - Test no duplicates scenario
   - Test single comment scenario
   - Test empty input scenario
   - Test order preservation (first occurrence kept)
   - Test non-string ratings/metadata handling

5. **Implementation Details**
   - Create: `src/components/personalizedComments/deduplicateComments.ts`
   - Use Set-based algorithm for O(n) performance
   - Add JSDoc comments explaining algorithm
   - Export `DeduplicationResult` type for typing

---

### Acceptance Criteria Verification

- [ ] `deduplicateComments` utility exists and is exported
- [ ] Function signature matches spec
- [ ] Case-insensitive matching works
- [ ] Whitespace normalization works
- [ ] First occurrence is preserved
- [ ] All edge cases handled
- [ ] 100% test coverage achieved
- [ ] Performance is O(n) (verified with large datasets)
- [ ] Exports `DeduplicationResult` type

---

## Story 2: Integrate Deduplication into Bulk Save Flow

**Title**: Integrate deduplication utility into existing bulk upload workflow

**As a** user uploading comments in bulk
**I want** duplicates automatically removed before upload
**So that** I don't waste time uploading redundant comments

---

### User Story Details

**Description**:
Modify the bulk upload flow to use deduplication:
1. Parse comments from pasted text (existing)
2. **NEW**: Deduplicate parsed comments
3. Save deduplicated comments to API (existing)
4. Pass duplicate count to status message

**Acceptance Criteria**:

1. **Integration Point**
   - Modify: `src/components/personalizedComments/bulkSaveComments.ts`
   - Call `deduplicateComments` before saving to API
   - Update `BulkSaveResult` interface to include `duplicateCount`
   - Preserve existing error handling and success tracking

2. **Flow Integration**
   - Input: `comments: ParsedComment[]` (from parser)
   - Process: `const dedup = deduplicateComments(comments)`
   - Save: `bulkSaveComments(subjectId, dedup.unique, ...)`
   - Output: Include `duplicateCount` in result

3. **Backward Compatibility**
   - Existing tests should still pass
   - Existing error handling unchanged
   - Existing success tracking logic unchanged
   - Only difference: fewer comments sent to API (duplicates removed)

4. **Result Object Enhancement**
   ```typescript
   interface BulkSaveResult {
     successful: SuccessfulSave[]
     failed: FailedSave[]
     totalAttempted: number
     duplicateCount: number // NEW
   }
   ```

5. **Test Coverage**
   - Test that deduplicated comments are sent to API
   - Test that duplicate count is correctly reported
   - Test that failed comments are still tracked
   - Test that progress reporting still works
   - Test integration with existing error scenarios

---

### Acceptance Criteria Verification

- [ ] `bulkSaveComments` calls `deduplicateComments`
- [ ] Duplicate count is returned in result
- [ ] Only unique comments sent to API
- [ ] All existing tests still pass
- [ ] New integration tests added
- [ ] No performance regression
- [ ] Error handling unchanged

---

## Story 3: Update Status Message to Show Duplicate Count

**Title**: Display duplicate count in bulk upload success message

**As a** user completing a bulk upload
**I want** to see how many comments were actually added vs. filtered
**So that** I understand what the system did with my upload

---

### User Story Details

**Description**:
Update the BulkUploadModal success message to show duplicate information:
- Current: "✅ Successfully imported 45 comments"
- Enhanced: "✅ Successfully imported 45 comments (3 duplicates removed)"

**Acceptance Criteria**:

1. **Message Format**
   - Format with duplicates: `✅ Successfully imported X comments (Y duplicates removed)`
   - Format without duplicates: `✅ Successfully imported X comments`
   - Handle 1 duplicate: singular form - `1 duplicate removed` (not "1 duplicates")
   - Handle 1 comment: singular form - `1 comment imported` (not "1 comments")

2. **Message Display Logic**
   - Location: `src/components/personalizedComments/BulkUploadModal.tsx`
   - Show duplicate count only if > 0
   - Display both comment count and duplicate count clearly
   - Use clear language (e.g., "removed" not "filtered")

3. **Edge Cases**
   - No duplicates: show normal message (no "(0 duplicates removed)")
   - All duplicates (0 successful): show "✅ Successfully imported 0 comments (X duplicates removed)" or special message
   - Mixed success/failure: show comment count + duplicate count separate

4. **Test Coverage**
   - Test message with 0 duplicates (no duplicate info shown)
   - Test message with 1 duplicate (singular form)
   - Test message with 5+ duplicates (plural form)
   - Test message with 1 comment imported (singular form)
   - Test message with 5+ comments (plural form)
   - Test message with 0 successful + duplicates

5. **Implementation Detail**
   - Use existing `importResults` object which now has `duplicateCount`
   - Update message building logic only (no modal restructure)
   - Ensure message fits in existing message box
   - Consider message localization (leave for future if needed)

---

### Acceptance Criteria Verification

- [ ] Message format matches spec
- [ ] Duplicate count displayed when > 0
- [ ] Singular/plural forms correct
- [ ] Message fits in UI without wrapping/overflow
- [ ] All message variations tested
- [ ] No existing functionality broken
- [ ] Message is clear and user-friendly

---

## Story 4: Add Comprehensive Test Coverage

**Title**: Add tests for deduplication feature and integrate with existing bulk upload tests

**As a** QA engineer
**I want** comprehensive test coverage for deduplication logic and integration
**So that** we have confidence in the feature and prevent regressions

---

### User Story Details

**Description**:
Create test suite covering:
1. Deduplication utility logic (unit tests)
2. Integration with bulk save flow (integration tests)
3. Status message display (component tests)
4. No regressions in existing bulk upload (regression tests)

**Acceptance Criteria**:

1. **Unit Tests - Deduplication Logic** (`deduplicateComments.test.ts`)
   - [ ] Exact match detection
   - [ ] Case-insensitive matching (uppercase, lowercase, mixed)
   - [ ] Whitespace normalization (leading, trailing, internal)
   - [ ] Preserves first occurrence order
   - [ ] Handles empty input
   - [ ] Handles single comment
   - [ ] Handles all duplicates
   - [ ] Handles no duplicates
   - [ ] Different ratings, same text treated as duplicates
   - [ ] Returns correct duplicate count
   - [ ] Performance acceptable (O(n) - measure with 1000+ items)

   **Minimum test cases**: 12-15 tests

2. **Integration Tests - Bulk Save Flow** (`bulkSaveComments.test.ts`)
   - [ ] Deduplication called before API save
   - [ ] Only unique comments sent to API
   - [ ] Duplicate count returned in result
   - [ ] Existing error handling works
   - [ ] Existing progress tracking works
   - [ ] Failed comments still tracked after dedup
   - [ ] Integration with onProgress callback

   **Minimum test cases**: 6-8 tests

3. **Component Tests - Status Message** (`BulkUploadModal.progress-results.test.tsx`)
   - [ ] Message with 0 duplicates
   - [ ] Message with 1 duplicate (singular)
   - [ ] Message with 5+ duplicates (plural)
   - [ ] Message with 1 comment (singular)
   - [ ] Message with 5+ comments (plural)
   - [ ] Message fits in UI
   - [ ] Message appears correctly after import

   **Minimum test cases**: 6-8 tests

4. **Regression Tests - Existing Bulk Upload**
   - [ ] Non-duplicate uploads work unchanged
   - [ ] Error handling unchanged
   - [ ] Progress reporting unchanged
   - [ ] API calls unchanged
   - [ ] All existing bulk upload tests pass

5. **Test Organization**
   - Create: `src/components/personalizedComments/__tests__/deduplicateComments.test.ts`
   - Update: `src/components/personalizedComments/__tests__/bulkSaveComments.test.ts`
   - Update: `src/components/personalizedComments/__tests__/BulkUploadModal.progress-results.test.tsx`

6. **Coverage Target**
   - Deduplication utility: 100% coverage
   - Bulk save integration: 100% coverage
   - Status message update: 100% coverage
   - Overall feature: 100% coverage
   - No regression in existing tests

---

### Acceptance Criteria Verification

- [ ] All new tests added and passing
- [ ] All existing tests still passing (no regressions)
- [ ] 100% code coverage achieved
- [ ] Edge cases thoroughly tested
- [ ] Integration tested end-to-end
- [ ] Test organization is clean and maintainable
- [ ] Tests are readable and well-documented

---

## Test Scenarios Summary

### Scenario 1: No Duplicates
Input: 5 unique comments
Expected: All 5 imported, message shows "5 comments (0 duplicates)" → actually shows "5 comments"

### Scenario 2: Some Duplicates
Input: 10 comments, 3 duplicates detected
Expected: 7 unique imported, message shows "7 comments (3 duplicates removed)"

### Scenario 3: All Duplicates
Input: 5 comments, all identical
Expected: 1 unique imported, message shows "1 comment (4 duplicates removed)"

### Scenario 4: Edge Cases
Input: Comments with whitespace/case variations
Expected: Duplicates detected despite variations, deduplicated correctly

---

## Definition of Done

For this feature to be considered complete:

- ✅ All 4 user stories implemented
- ✅ All acceptance criteria met for each story
- ✅ Test coverage ≥ 95% for new code, 100% for deduplication logic
- ✅ All existing tests still passing
- ✅ Code reviewed and approved
- ✅ No performance regression
- ✅ Ready for production deployment

---

## Story Points Estimation

| Story | Complexity | Points |
|-------|------------|--------|
| Story 1 (Dedup Utility) | High | 3-5 |
| Story 2 (Integration) | Medium | 2-3 |
| Story 3 (Status Message) | Low | 1-2 |
| Story 4 (Tests) | Medium | 3-5 |
| **Total** | - | **9-15** |

*Typical L1 feature: 5-13 points (this is 9-15, on the higher end of micro but still L1)*

