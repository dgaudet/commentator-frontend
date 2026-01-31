# Product Requirements Document: Duplicate Comment Prevention

**Feature:** Prevent creation of duplicate outcome and personalized comments
**Priority:** High
**Complexity:** L1-L2 (Simple feature, localized changes)
**Status:** In Planning

---

## 1. Executive Summary

Currently, users can accidentally create duplicate comments within the same subject, leading to redundant data and increased cognitive load when reviewing comments. This feature implements client-side duplicate detection with modal notifications to prevent this issue while maintaining user agency.

---

## 2. Problem Statement

**Current Situation:**
- Users can add the same outcome or personalized comment multiple times for the same subject
- No validation prevents this during comment creation
- Duplicates clutter the comment list and confuse reviewers
- Users must manually delete duplicates after creation

**Impact:**
- Data quality issues (redundant comments)
- Worse user experience (cluttered lists)
- Additional manual cleanup work
- Inconsistent data state

**Root Cause:**
- No duplicate check is performed before saving comments
- Modal validations don't compare against existing comments

---

## 3. Solution Overview

Implement duplicate detection with user-friendly modal notifications:

**Outcome Comments:**
- When user attempts to save an outcome comment, compare against existing outcome comments for that subject
- If exact match found, show modal with existing comment details
- Allow user to proceed with override if intentional

**Personalized Comments:**
- Same pattern: compare against existing personalized comments for the same subject
- Show modal notification if duplicate detected
- Provide option to cancel, view existing, or override

**Technical Approach:**
- Use existing comment lists already loaded in modals
- Client-side duplicate detection (exact string matching)
- Optional: API-level validation as backup

---

## 4. User Stories

### US-DCP-001: Detect Duplicate Outcome Comments
**As a** teacher managing outcome comments
**I want to** receive a notification if I'm about to create a duplicate outcome comment
**So that** I avoid cluttering the comment list with redundant entries

**Acceptance Criteria:**
- AC-1: When user enters comment text and clicks save, system compares to existing outcome comments for selected subject
- AC-2: If exact match found, modal displays showing:
  - Message: "This outcome comment already exists for [Subject Name]"
  - Existing comment text displayed
  - Existing comment metadata (date created, number of uses if available)
- AC-3: Modal provides options:
  - "Cancel" - return to editing without saving
  - "View Existing" - navigate to existing comment to view/edit
  - "Save Anyway" - proceed with save despite duplicate (allows intentional duplicates)
- AC-4: Comparison is case-sensitive, exact-match only
- AC-5: Modal prevents accidental double-saves with clear warnings

**Priority:** High
**Story Points:** 5-8

---

### US-DCP-002: Detect Duplicate Personalized Comments
**As a** teacher managing personalized comments
**I want to** receive a notification if I'm about to create a duplicate personalized comment
**So that** I maintain clean, deduplicated comment records per student

**Acceptance Criteria:**
- AC-1: When user enters personalized comment and clicks save, system compares to existing personalized comments for the same subject
- AC-2: If exact match found, modal displays:
  - Message: "This personalized comment already exists for [Subject Name]"
  - Existing comment text
  - Student name associated with existing comment
- AC-3: Modal provides options:
  - "Cancel" - return to editing
  - "View Existing" - view the existing comment
  - "Save Anyway" - save despite duplicate
- AC-4: Case-sensitive, exact-match comparison
- AC-5: Prevents common user errors without blocking intentional duplicates

**Priority:** High
**Story Points:** 5-8

---

### US-DCP-003: Empty/Whitespace Validation
**As a** system
**I want to** trim whitespace and handle empty/whitespace-only comments appropriately
**So that** duplicate detection doesn't flag false positives from whitespace variations

**Acceptance Criteria:**
- AC-1: Before comparison, trim leading/trailing whitespace from both new and existing comments
- AC-2: Prevent saving comments that are empty or whitespace-only
- AC-3: Show user-friendly error if comment is blank

**Priority:** Medium
**Story Points:** 2-3

---

### US-DCP-004: Optional API-Level Validation (Future)
**As a** system
**I want to** validate duplicate prevention on the API level
**So that** duplicate comments cannot be created even if client validation is bypassed

**Acceptance Criteria:**
- AC-1: API checks for duplicate comments before insert
- AC-2: API returns 409 Conflict with clear error message if duplicate
- AC-3: Frontend handles API 409 response gracefully
- AC-4: Does not block feature; can be implemented after UI is complete

**Priority:** Low
**Story Points:** 5-8
**Notes:** Optional for L1 scope; can be added in L2 phase

---

## 5. Feature Scope & Exclusions

### In Scope
✅ Client-side duplicate detection for outcome comments
✅ Client-side duplicate detection for personalized comments
✅ Modal notifications with user options
✅ Exact-match, case-sensitive comparison
✅ Whitespace trimming before comparison

### Out of Scope (for this feature)
❌ API-level validation (optional future work)
❌ Similar comment detection (fuzzy matching)
❌ Analytics/tracking of duplicate attempts
❌ Auto-suggest to use existing comment instead of creating duplicate
❌ Bulk duplicate detection/cleanup tool

---

## 6. User Experience Design

### Outcome Comment Duplicate Modal

```
┌─────────────────────────────────────────┐
│  Duplicate Comment Detected              │
├─────────────────────────────────────────┤
│                                         │
│  This outcome comment already exists    │
│  for "Mathematics"                      │
│                                         │
│  Existing Comment:                      │
│  ┌─────────────────────────────────┐   │
│  │ "Shows strong understanding of  │   │
│  │  key mathematical concepts"     │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Would you like to:                     │
│  [Cancel]  [View Existing]  [Save Anyway]
│                                         │
└─────────────────────────────────────────┘
```

### Personalized Comment Duplicate Modal

```
┌─────────────────────────────────────────┐
│  Duplicate Comment Detected              │
├─────────────────────────────────────────┤
│                                         │
│  This comment already exists for        │
│  "Mathematics"                          │
│                                         │
│  Existing Comment:                      │
│  ┌─────────────────────────────────┐   │
│  │ "Great progress this semester"  │   │
│  └─────────────────────────────────┘   │
│                                         │
│  [Cancel]  [View Existing]  [Save Anyway]
│                                         │
└─────────────────────────────────────────┘
```

---

## 7. Implementation Notes

### Technical Details

**Outcome Comments:**
- Use `OutcomeCommentsModal` existing `outcomeComments` list
- Compare `newComment.text.trim()` against `existingComment.text.trim()`
- Case-sensitive exact match: `newComment === existing`

**Personalized Comments:**
- Use `PersonalizedCommentsModal` existing comments list
- Same trimming and comparison logic
- Filter by subject to compare only relevant comments

**Modal Behavior:**
- "Cancel" → Close modal, return focus to input field
- "View Existing" → Navigate to existing comment (edit mode if possible)
- "Save Anyway" → Proceed with save despite duplicate

### Code Locations
- `src/components/outcomeComments/OutcomeCommentsModal.tsx`
- `src/components/outcomeComments/__tests__/OutcomeCommentsModal.duplicate-detection.test.tsx`
- `src/components/personalizedComments/PersonalizedCommentsModal.tsx`
- `src/components/personalizedComments/__tests__/PersonalizedCommentsModal.duplicate-detection.test.tsx`

### New Component: DuplicateCommentModal
- Reusable modal for both outcome and personalized comments
- Props: `isOpen`, `existingComment`, `newComment`, `onCancel`, `onViewExisting`, `onSaveAnyway`

---

## 8. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Duplicate Prevention Rate | >90% of duplicate attempts prevented | Count prevented saves vs total save attempts |
| User Override Rate | <10% of prevented attempts bypassed | Track "Save Anyway" clicks |
| Error Rate | 0% false positives | Manual QA testing with edge cases |
| User Satisfaction | 4.5+/5 | Post-feature survey on comment management |

---

## 9. Acceptance Criteria (Feature Level)

**Must Have:**
- ✅ Exact-match duplicate detection for outcome comments
- ✅ Exact-match duplicate detection for personalized comments
- ✅ Modal displays existing comment text
- ✅ User can cancel, view existing, or override
- ✅ Case-sensitive comparison
- ✅ Whitespace trimming before comparison

**Should Have:**
- ✅ Clear, user-friendly modal messages
- ✅ Consistent behavior between outcome and personalized
- ✅ Comprehensive test coverage

**Nice to Have:**
- ⭕ API-level validation (optional)
- ⭕ Fuzzy duplicate detection (future)
- ⭕ Analytics tracking

---

## 10. Dependencies & Risks

### Dependencies
- None - uses existing comment lists already in modals
- No API changes required
- No database schema changes

### Risks
**Low Priority:**
- User frustration if duplicate modal blocks legitimate use (mitigated by "Save Anyway")
- Edge cases with whitespace handling (mitigated by comprehensive tests)

### Mitigation
- "Save Anyway" option preserves user agency
- Clear modal messaging explains duplicate detection
- Comprehensive test coverage for edge cases

---

## 11. Success Criteria Validation

**Before Merge:**
- [ ] All acceptance criteria met for both modals
- [ ] Tests pass with >90% coverage for new code
- [ ] Modal displays correctly in light/dark themes
- [ ] Accessibility validation (WCAG 2.1 AA)
- [ ] Cross-browser testing (Chrome, Firefox, Safari)
- [ ] Manual QA sign-off on user flows

---

## 12. Release Notes (Draft)

**New Feature: Duplicate Comment Prevention**

Comments are essential for tracking student progress. To maintain clean, meaningful comment records, the system now detects and alerts you when you're about to create a duplicate comment.

**What's New:**
- When creating an outcome or personalized comment, the system checks if that exact comment already exists for the subject
- If a duplicate is detected, you'll see a modal showing the existing comment
- You can cancel, view the existing comment, or choose to save anyway

**Why This Matters:**
- Keeps comment lists clean and focused
- Prevents accidental duplicate data entry
- Makes comment reviews faster and clearer

---

## 13. Stakeholder Alignment

**Teachers/Educators:**
- Reduces manual cleanup of duplicate comments
- Cleaner comment lists improve usability
- Maintains ability to create intentional duplicates if needed

**Product/Analytics:**
- Improves data quality
- Reduces user error
- Sets foundation for future smart comment suggestions

**Engineering:**
- Localized changes, low risk
- Reusable modal component
- Easy to extend with API validation later

---

## 14. Timeline & Effort Estimate

| Phase | Duration | Notes |
|-------|----------|-------|
| Planning & Design | 1 day | ✅ In Progress |
| Implementation | 3-5 days | TDD: Tests first, then implementation |
| Testing & QA | 2 days | Comprehensive test coverage |
| Review & Merge | 1 day | Code review, accessibility check |
| **Total** | **7-9 days** | One developer, one sprint |

---

## 15. Future Enhancements (Not in Scope)

- **Smart Suggestions:** "Did you mean to use this existing comment?"
- **Fuzzy Matching:** Detect similar comments, not just exact matches
- **Bulk Deduplication:** Tool to find and merge duplicate comments
- **Comment Versioning:** Track comment history and changes
- **API-Level Validation:** Prevent duplicates even if client validation bypassed
- **Duplicate Analytics:** Dashboard showing duplicate attempts and trends

---

**Document Status:** Ready for Design Phase
**Last Updated:** 2026-01-31
**Next Step:** Review with stakeholders → Proceed to design phase
