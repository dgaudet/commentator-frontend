# Minimal PRD: Increase Final Comment Character Limit to 3000

**Feature**: 3000-char-final-comments
**Complexity**: L0 (Atomic)
**Estimated Points**: 1
**Status**: Planning Phase
**Last Updated**: 2026-01-08

---

## Executive Summary

Update the FinalCommentsModal component to accept up to 3000 characters for final comments (currently limited to 1000). This aligns the frontend with the backend API which has already been updated to support the increased character limit, enabling teachers to provide more detailed and comprehensive feedback to students.

---

## Business Context

**Problem**: Teachers are limited to 1000 characters when writing final comments for students, restricting their ability to provide detailed feedback and context about student performance.

**Solution**: Increase the character limit to 3000 characters, matching the backend capability that was already implemented.

**Value Delivered**:
- Teachers can write more detailed comments without workarounds
- Better documentation of student performance and progress
- No API changes required (backend ready)
- Quick implementation, high user value

---

## User Problem Statement

**Current State (Before)**:
- Final comment field limited to 1000 characters
- Teachers must edit comments multiple times to fit detailed feedback
- Important context and specific examples are often omitted due to space constraints
- Character counter shows "X/1000" with no flexibility

**Desired State (After)**:
- Final comment field accepts up to 3000 characters
- Teachers can include more detailed feedback, examples, and context
- Character counter shows "X/3000" with more room for expression
- Populate with Above Comments button respects new limit

---

## Feature Scope

### In Scope ✅
- Update maxLength attribute on Add form textarea (1000 → 3000)
- Update maxLength attribute on Edit form textarea (1000 → 3000)
- Update placeholder text to reflect new limit
- Update character counter display
- Update Populate with Above Comments truncation logic
- Update all related documentation and code comments

### Out of Scope ❌
- Database schema changes (already supports 3000 chars)
- API endpoint changes (backend already updated)
- UI redesign or layout modifications
- Character encoding or validation changes
- Comment history or version tracking

---

## Key Requirements

### Functional Requirements

| Req ID | Requirement | Priority | Notes |
|--------|-------------|----------|-------|
| FR-1 | Add form textarea maxLength = 3000 | HIGH | Both Add and Edit forms |
| FR-2 | Character counter displays X/3000 format | HIGH | User-facing feedback |
| FR-3 | Placeholder text says "max 3000 characters" | HIGH | Consistent UX messaging |
| FR-4 | Populate button truncates to 3000 | HIGH | Not 1000, reflects new limit |
| FR-5 | All code comments updated | MEDIUM | Maintain code documentation |

### Non-Functional Requirements

| Req ID | Requirement | Priority | Notes |
|--------|-------------|----------|-------|
| NR-1 | Zero breaking changes | HIGH | Backward compatible |
| NR-2 | No API modifications | HIGH | Backend-ready |
| NR-3 | All tests pass | HIGH | Existing test suite unmodified |
| NR-4 | Lint checks pass | HIGH | Code quality |

---

## Implementation Overview

### Files to Modify

**Primary**: `src/components/finalComments/FinalCommentsModal.tsx`
- Update line 501: `if (populatedText.length > 1000)` → `if (populatedText.length > 3000)`
- Update line 501: `.substring(0, 1000)` → `.substring(0, 3000)`
- Update line 839: placeholder text
- Update line 842: `maxLength={1000}` → `maxLength={3000}`
- Update line 865: character counter display
- Update line 1147: placeholder text (Edit form)
- Update line 1150: `maxLength={1000}` → `maxLength={3000}`
- Update line 1172: character counter display (Edit form)
- Update line 43: JSDoc comment about 1000 char constraint

### Changes Required

**Change Type**: Configuration/Constant Update
**Lines Modified**: ~10-15 lines
**Complexity Level**: Trivial - Find and replace operation
**Testing Level**: Minimal - Verify character limits work

### Risk Assessment

**Risk Level**: Trivial
- No functional logic changes
- No API changes
- No component structure changes
- Simple string constant replacements
- Backend already ready for this limit

**Breaking Changes**: None
- Existing 1000-char comments will still work
- Form accepts anything up to 3000
- Backward compatible with all stored data

---

## Success Metrics

✅ **Definition of Done**:
1. Character limit increased to 3000 in both Add and Edit forms
2. Placeholder text updated in both forms
3. Character counter displays correctly
4. Populate button truncates to 3000 characters
5. All JSDoc comments updated
6. No lint errors: `npm run lint` passes
7. All tests pass: `npm run test` (should have 1473+ tests)
8. Manual verification of form behavior

---

## Timeline & Effort

**Estimated Effort**: 1 story point (< 1 hour)
- Code changes: 10 minutes
- Testing: 15 minutes
- Verification: 5 minutes

**Complexity**: L0 (Atomic)
- Single feature
- No dependencies
- No coordination required
- Can be completed in isolation

---

## Dependencies & Prerequisites

**No External Dependencies**
- Backend already supports 3000 characters
- No infrastructure changes needed
- No database migrations required

**Prerequisites**:
- Main branch latest code checked out
- Node.js v24 (see `.nvmrc`)
- npm installed

---

## Rollback Plan

**If issues arise**:
1. Revert commits to previous 1000-char implementation
2. All stored data remains intact (no schema changes)
3. Users revert to 1000-char limit temporarily
4. No data loss or corruption possible

**Rollback Risk**: Minimal
- No database changes
- No API changes
- Simple revert to previous constants

---

## Testing Strategy

### Unit Tests (Create or Update)
```typescript
// Test 1: Populate button with text > 3000 chars truncates correctly
test('should truncate to 3000 characters when populating long comments')

// Test 2: Character counter displays X/3000 format
test('should display character count in X/3000 format')
```

### Integration Tests
```typescript
// Test 3: Add form accepts 3000 char comment
test('should accept 3000 character comment in Add form')

// Test 4: Edit form accepts 3000 char comment
test('should accept 3000 character comment in Edit form')
```

### Manual Tests
- [ ] Type 2500 chars in Add form - counter shows "2500/3000"
- [ ] Type 3000 chars in Add form - counter shows "3000/3000"
- [ ] Browser prevents typing beyond 3000 (maxLength enforcement)
- [ ] Populate button with combined text > 3000 chars truncates correctly
- [ ] Edit form allows viewing/modifying 3000 char comments
- [ ] Form submission succeeds with 3000 char comment

---

## Acceptance Checklist

- [ ] Code changes complete
- [ ] All 5 acceptance criteria (AC-1.1 through AC-1.5) met
- [ ] Unit tests created/updated and passing
- [ ] Integration tests created/updated and passing
- [ ] Manual testing verification complete
- [ ] Linting passes: `npm run lint`
- [ ] Full test suite passes: `npm run test`
- [ ] Code review approved
- [ ] PR merged to main

---

## Release Notes (Draft)

**Final Comment Character Limit Increased**

Teachers can now write up to 3000 characters in final comments (previously 1000). This provides more space for detailed feedback and context about student performance. The Populate with Above Comments feature also respects the new limit, automatically truncating combined comments to 3000 characters when needed.

**What's Changed**:
- Add final comment form: Now accepts 3000 characters
- Edit final comment form: Now accepts 3000 characters
- Populate button: Truncates to 3000 characters (was 1000)
- Character counter: Displays X/3000 format

**What's NOT Changed**:
- No API changes
- No database schema changes
- Fully backward compatible with existing comments

---

## Key Contacts

- **Backend Lead**: Has already implemented 3000 char API support
- **QA Lead**: Verify character limits and form validation
- **Technical Writer**: Update user documentation if applicable
