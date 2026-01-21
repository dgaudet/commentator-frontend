# Bulk Upload Deduplication - Minimal PRD

**Feature**: Bulk Upload Deduplication
**Complexity**: L1 (Micro)
**Status**: Planning Complete
**Version**: 1.0
**Last Updated**: 2026-01-21

---

## Problem Statement

Teachers using the bulk comment upload feature sometimes accidentally paste the same comment multiple times, resulting in:
- Duplicate entries in the database
- Wasted time (uploading redundant data)
- Cluttered comment history (multiple identical records)
- Manual cleanup effort to remove duplicates after import

**User Quote**: *"I often copy-paste from documents, and I sometimes accidentally include the same line twice. It would be nice if the system automatically caught that."*

---

## Solution Overview

Add automatic duplicate detection and removal to the bulk upload feature. When teachers paste comments:

1. **Detection**: System identifies duplicate comments before sending to API
2. **Filtering**: Removes duplicates from upload queue
3. **Feedback**: Shows clear status message indicating:
   - How many comments were successfully added
   - How many were filtered as duplicates
   - Example: "✅ Successfully imported 45 comments (3 duplicates removed)"

---

## Business Value

| Aspect | Benefit |
|--------|---------|
| **Data Quality** | Prevents duplicate comment entries in database |
| **User Efficiency** | Teachers don't need to manually clean up after upload |
| **Better Feedback** | Clear transparency on what was imported vs. filtered |
| **Reduced Support** | Fewer "why do I have duplicate comments?" support tickets |

---

## Key Requirements

### Functional Requirements
- **FR1**: Detect duplicate comments (exact text match, case-insensitive)
- **FR2**: Remove duplicates before sending to API
- **FR3**: Display duplicate count in success message
- **FR4**: Preserve non-duplicate comments from same upload

### Non-Functional Requirements
- **NR1**: Client-side only (no API changes required)
- **NR2**: No performance impact (handle 1000+ comments efficiently)
- **NR3**: Preserve existing bulk upload UI/UX
- **NR4**: Transparent to user (no additional user actions needed)

### Edge Cases
- **E1**: Comments with different ratings but identical text (treat as duplicates)
- **E2**: Whitespace variations (normalize before comparison)
- **E3**: Case variations (case-insensitive matching)
- **E4**: 100% duplicate upload (all comments filtered - show appropriate message)
- **E5**: Zero comments after filtering (edge case messaging)

---

## User Stories

**Story 1: Implement Deduplication Logic**
- Remove duplicate comments from upload before API call
- Use exact text match (case-insensitive)
- Return count of duplicates removed

**Story 2: Enhance Status Message**
- Display duplicate count in success message
- Format: "✅ Successfully imported X comments (Y duplicates removed)"
- Handle edge cases (0 duplicates, all duplicates, etc.)

**Story 3: Add Comprehensive Tests**
- Test exact match scenarios
- Test edge cases (whitespace, case, empty)
- Test integration with bulk upload flow

**Story 4: Verify No Regressions**
- Ensure existing bulk upload still works
- Validate non-duplicate comments always import
- Confirm status messages are clear and accurate

---

## Success Criteria

- ✅ Duplicate comments are automatically removed
- ✅ Status message clearly shows duplicate count
- ✅ 100% test coverage for deduplication logic
- ✅ Zero impact on non-duplicate upload paths
- ✅ All existing bulk upload tests still pass
- ✅ Edge cases handled gracefully
- ✅ No performance degradation

---

## Acceptance Criteria

**Definition of Done:**
1. Deduplication logic implemented and tested
2. Status message updated to show duplicate count
3. All tests passing (new + existing)
4. No regressions in bulk upload functionality
5. Code reviewed and approved
6. Ready for production deployment

---

## Future Enhancements (Out of Scope)

### Phase 2 Opportunities
- Fuzzy/semantic matching (similar but not identical text)
- Preview removed duplicates before confirming upload
- Configurable deduplication rules
- Duplicate detection across different classes/subjects
- API-side deduplication as safety net

---

## Timeline

| Phase | Target Date | Duration |
|-------|-------------|----------|
| Planning | ✅ 2026-01-21 | COMPLETE |
| Design | 2026-01-21 | 1 day |
| Implementation | 2026-02-04 | 3-4 days |
| QA | 2026-02-07 | 1-2 days |
| Release | 2026-02-07 | Ready |

---

## Dependencies

- Existing `bulkSaveComments` utility
- Existing `BulkUploadModal` component
- Existing `parseComments` functionality

**No external dependencies or API changes required.**

---

## Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Over-filtering removes intentional duplicates | MEDIUM | Use exact match (conservative); Phase 2 for fuzzy |
| Performance with large uploads | LOW | Set-based deduplication is O(n) |
| User confusion about removed duplicates | MEDIUM | Clear status message; Phase 2 for preview feature |

---

## Glossary

- **Duplicate**: Two or more comments with identical text (case-insensitive)
- **Exact Match**: Character-by-character comparison after normalization
- **Deduplication**: Process of identifying and removing duplicates
- **Status Message**: User-facing feedback after bulk upload completes

