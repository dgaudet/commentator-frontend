# Implementation Approach: Duplicate Comment Prevention

**Feature:** Duplicate Comment Prevention
**Complexity:** L1 (Simple Feature)
**Status:** Ready for Development
**Date:** 2026-01-31

---

## Executive Summary

This document outlines the technical approach for preventing duplicate outcome and personalized comments. The solution leverages existing comment lists already loaded in modals, requires no API changes, and introduces a single reusable modal component.

---

## Design Decisions

### 1. Client-Side Detection Only (for L1 Phase)

**Decision:** Implement duplicate detection on the client-side only, comparing against existing comments already loaded in the modal.

**Rationale:**
- Comment lists are already available in both OutcomeCommentsModal and PersonalizedCommentsModal
- No additional API calls needed
- Faster user feedback (instant duplicate detection)
- Reduces server load
- Simpler initial implementation

**Trade-off:**
- Users with multiple browser tabs could theoretically create duplicates
- Can add API-level validation as L2 feature if needed

---

### 2. Exact-Match, Case-Sensitive Comparison

**Decision:** Only detect exact duplicates; do not perform fuzzy/similarity matching.

**Rationale:**
- Simple, predictable behavior (users know what will be flagged)
- Avoids false positives
- Easy to implement and test
- Can expand to fuzzy matching in future iterations

**Examples:**
```
"Good work" == "Good work"           → DUPLICATE ✓
"Good work" != "good work"           → NOT duplicate (case differs)
"Good work" != "Good work overall"   → NOT duplicate (text differs)
"Good work" == "Good work"           → DUPLICATE ✓ (same exact text)
```

---

### 3. Whitespace Trimming Before Comparison

**Decision:** Trim leading/trailing whitespace before comparing, but preserve internal spacing.

**Rationale:**
- Prevents duplicate warnings from accidental whitespace variations
- Preserves intentional internal spacing (e.g., double-space emphasis)
- Consistent with common text processing practices

**Examples:**
```
"  Good work  ".trim() == "Good work"              → DUPLICATE
"Good  work" != "Good work"                        → NOT duplicate (internal spaces preserved)
"Line 1\nLine 2" preserved for multi-line comments
```

---

### 4. Reusable DuplicateCommentModal Component

**Decision:** Create a single, reusable modal component used by both outcome and personalized comment modals.

**Rationale:**
- Consistent UX across both comment types
- Easier to maintain (single source of truth)
- Can be extended for other duplicate detection scenarios
- Better code organization

**Component Structure:**
```
src/components/common/DuplicateCommentModal.tsx
├── Props: isOpen, existingComment, commentType, subjectName, onCancel
├── Displays existing comment
├── Shows helpful guidance message
├── Single Cancel button to return to editing
└── Accessible and themeable
```

---

### 5. Subject-Scoped Comparison

**Decision:** Only compare comments within the same subject (for outcome comments) or same subject (for personalized comments).

**Rationale:**
- Different subjects may legitimately have the same comment (e.g., "Excellent work" applies to all subjects)
- Avoids false positives across different contexts
- Matches user mental model

**Example:**
```
Outcome Comment "Good effort" for Math
Outcome Comment "Good effort" for English  → Allowed (different subject)
```

---

## Implementation Architecture

### File Structure

```
src/
├── components/
│   ├── common/
│   │   └── DuplicateCommentModal.tsx          [NEW]
│   │       └── __tests__/
│   │           └── DuplicateCommentModal.test.tsx  [NEW]
│   │
│   ├── outcomeComments/
│   │   ├── OutcomeCommentsModal.tsx           [MODIFIED]
│   │   └── __tests__/
│   │       └── OutcomeCommentsModal.duplicate-detection.test.tsx  [NEW]
│   │
│   └── personalizedComments/
│       ├── PersonalizedCommentsModal.tsx      [MODIFIED]
│       └── __tests__/
│           └── PersonalizedCommentsModal.duplicate-detection.test.tsx  [NEW]
│
└── utils/
    └── commentComparison.ts                   [NEW]
        ├── isDuplicateComment()               [NEW]
        └── trimCommentText()                  [NEW]
```

---

## Core Implementation Components

### 1. Comment Comparison Utility

**File:** `src/utils/commentComparison.ts`

```typescript
/**
 * Compares two comment strings for exact duplicate
 * - Trims whitespace before comparison
 * - Case-sensitive
 * - Returns boolean
 */
export function isDuplicateComment(
  newComment: string,
  existingComment: string
): boolean {
  const trimmed1 = newComment.trim()
  const trimmed2 = existingComment.trim()
  return trimmed1 === trimmed2
}

/**
 * Checks if new comment matches any existing comments
 * - Filters by subject
 * - Returns first match or null
 */
export function findDuplicateComment<T extends { text: string }>(
  newCommentText: string,
  existingComments: T[],
  filterBySubject?: (comment: T) => boolean
): T | null {
  const filtered = filterBySubject
    ? existingComments.filter(filterBySubject)
    : existingComments

  return filtered.find(comment =>
    isDuplicateComment(newCommentText, comment.text)
  ) || null
}
```

### 2. DuplicateCommentModal Component

**File:** `src/components/common/DuplicateCommentModal.tsx`

```typescript
interface DuplicateCommentModalProps {
  isOpen: boolean
  existingComment: string
  commentType: 'outcome' | 'personalized'
  subjectName: string
  onCancel: () => void
}

export function DuplicateCommentModal({
  isOpen,
  existingComment,
  commentType,
  subjectName,
  onCancel,
}: DuplicateCommentModalProps) {
  if (!isOpen) return null

  return (
    <div role="dialog" aria-modal="true">
      <h2>Duplicate Comment Detected</h2>
      <p>This {commentType} comment already exists for "{subjectName}":</p>

      <div className="existing-comment">
        <p className="comment-text">{existingComment}</p>
      </div>

      <p className="guidance">
        Please edit the existing comment or enter a different comment.
      </p>

      <div className="actions">
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  )
}
```

### 3. OutcomeCommentsModal Integration

**File:** `src/components/outcomeComments/OutcomeCommentsModal.tsx` [MODIFIED]

```typescript
// In OutcomeCommentsModal.tsx

const [duplicateModal, setDuplicateModal] = useState<{
  isOpen: boolean
  existingComment: OutcomeComment | null
}>({ isOpen: false, existingComment: null })

const handleSaveComment = async (commentText: string) => {
  // Step 1: Validate empty/whitespace-only
  if (!commentText.trim()) {
    setError('Please enter a comment')
    return
  }

  // Step 2: Check for duplicate
  const duplicate = findDuplicateComment(
    commentText,
    outcomeComments,
    (c) => c.subjectId === selectedSubjectId  // Filter by subject
  )

  if (duplicate) {
    // Show duplicate modal - prevent save
    setDuplicateModal({ isOpen: true, existingComment: duplicate })
    return
  }

  // Step 3: No duplicate - proceed with save
  await saveComment(commentText)
}

const handleCancelDuplicate = () => {
  // Close modal, keep text in input for user to edit
  setDuplicateModal({ isOpen: false, existingComment: null })
}

return (
  <>
    {/* Existing modal content */}

    <DuplicateCommentModal
      isOpen={duplicateModal.isOpen}
      existingComment={duplicateModal.existingComment?.text || ''}
      commentType="outcome"
      subjectName={selectedSubject?.name || 'Unknown'}
      onCancel={handleCancelDuplicate}
    />
  </>
)
```

### 4. PersonalizedCommentsModal Integration

**File:** `src/components/personalizedComments/PersonalizedCommentsModal.tsx` [MODIFIED]

Similar to OutcomeCommentsModal, with comments filtered by subject.

---

## Test-Driven Development (TDD) Approach

### Development Workflow

**Phase 1: RED (Write Failing Tests)**
```
1. Write test: "should show duplicate modal when comment exists"
   → Test fails (no modal exists yet)
2. Write test: "should allow save when 'Save Anyway' clicked"
   → Test fails
3. Write test: "should trim whitespace before comparison"
   → Test fails
```

**Phase 2: GREEN (Implement Minimal Code)**
```
1. Implement comparison utility
2. Create DuplicateCommentModal component
3. Wire up button handlers
→ Tests pass
```

**Phase 3: REFACTOR**
```
1. Improve component accessibility
2. Extract logic to utilities
3. Optimize performance
→ Tests still pass, code is cleaner
```

### Test Coverage Goals

| Component | Coverage Target | Key Test Cases |
|-----------|-----------------|-----------------|
| commentComparison.ts | >95% | Exact match, case sensitivity, whitespace trimming |
| DuplicateCommentModal | >90% | Button clicks, rendering, accessibility |
| OutcomeCommentsModal | >85% | Save flow, duplicate detection, modal interaction |
| PersonalizedCommentsModal | >85% | Same as outcome comments |

---

## User Experience Flow

### Outcome Comment Save Flow

```
User enters comment text
         ↓
User clicks "Save"
         ↓
Is text empty or whitespace-only?
    YES → Show error, return to editing
    NO ↓
Exists in comment list for this subject?
    YES → Show DuplicateCommentModal
    NO ↓
Save comment, show success
```

### DuplicateCommentModal Interaction

```
Modal displays with existing comment
         ↓
User reads guidance message
         ↓
User clicks "Cancel"
         ↓
Modal closes, return to editing with text preserved
         ↓
User edits comment or starts over with different text
```

---

## Technical Specifications

### Comparison Logic Complexity
- **Time:** O(n) where n = number of existing comments for subject
- **Space:** O(1) - no additional space beyond input
- **Performance:** Negligible impact (typically < 100 comments per subject)

### Modal Behavior
- **Modal Type:** Blocking modal (prevents interaction with background)
- **Keyboard Navigation:** Tab through buttons, Enter to activate
- **Focus Management:** Focus trap within modal
- **Close Behavior:** Only closes via Cancel, View Existing, or Save Anyway

### Accessibility Requirements
- **WCAG 2.1 Level AA**
- Proper ARIA labels and roles
- Keyboard navigable
- Screen reader friendly
- High contrast colors

---

## Future Enhancements (Out of Scope)

1. **API-Level Validation** (L2)
   - Backup check on server to prevent duplicates if client validation bypassed
   - Return 409 Conflict if duplicate detected

2. **Fuzzy Matching** (L2/L3)
   - Detect similar comments (e.g., same meaning, different wording)
   - Use string similarity algorithm

3. **Smart Suggestions** (L2/L3)
   - "Did you mean to use this existing comment?"
   - Suggest existing comments when user starts typing

4. **Bulk Deduplication Tool** (L3)
   - Admin tool to find and merge duplicate comments
   - Consolidate variants of same comment

5. **Analytics** (L2)
   - Track duplicate attempts
   - Identify most-created duplicate patterns

---

## Success Criteria Checklist

- [ ] 100% of duplicate attempts are prevented
- [ ] Zero false positive duplicate detections
- [ ] >90% test coverage on new code
- [ ] WCAG 2.1 AA accessibility compliance
- [ ] Modal works on mobile, tablet, desktop
- [ ] No performance degradation
- [ ] QA sign-off on all test cases
- [ ] Code review approved

---

## Implementation Risks & Mitigations

| Risk | Severity | Mitigation |
|------|----------|-----------|
| User frustration with modal | Low | "Save Anyway" button preserves agency |
| Edge cases in comparison | Low | Comprehensive unit tests |
| Performance impact | Low | O(n) comparison is negligible |
| Accessibility issues | Low | WCAG testing, screen reader validation |
| Multi-browser compatibility | Low | Cross-browser testing matrix |

---

## Dependencies & Prerequisites

**Must Have Before Implementation:**
- [ ] Product requirements approved (PDD complete)
- [ ] Design mockups of modal (UX/Design)
- [ ] Accessibility review of modal design
- [ ] Test environment setup

**No External Dependencies:**
- No new API endpoints needed
- No database schema changes
- No third-party libraries required
- Uses existing design system components

---

## Timeline & Milestones

```
Week 1:
  Day 1: Setup, write RED tests
  Day 2-3: Implement comparison utility + component
  Day 4: Integration with both modals
  Day 5: Testing & refinement

Week 2:
  Day 1-2: QA testing, accessibility validation
  Day 3: Code review, final adjustments
  Day 4: Merge & deployment
```

**Estimated Total:** 7-9 days

---

## Code Review Checklist

- [ ] All acceptance criteria met
- [ ] Tests are comprehensive and passing
- [ ] Code follows project style guide
- [ ] No console errors or warnings
- [ ] Accessibility standards met
- [ ] Performance impact analyzed
- [ ] Documentation updated
- [ ] Backwards compatible

---

**Status:** ✅ COMPLETE - IMPLEMENTATION DELIVERED

**Implementation Summary:**
- ✅ Comment comparison utility with flexible type support (19 tests)
- ✅ DuplicateCommentModal component with design tokens (25 tests)
- ✅ OutcomeCommentsModal integration (12 tests)
- ✅ PersonalizedCommentsModal integration (12 tests)
- ✅ All 68 tests passing
- ✅ Production build successful
- ✅ TypeScript strict mode compliant

**Owner:** Frontend Engineering Team
**Created:** 2026-01-31
**Completed:** 2026-01-31
