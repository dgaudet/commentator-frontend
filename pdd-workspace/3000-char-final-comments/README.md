# PDD: 3000 Character Final Comments

## Overview

This Product-Driven Design (PDD) specification covers the feature to increase the final comment character limit from **1000 to 3000 characters** in the FinalCommentsModal component.

## Quick Facts

- **Complexity**: L0 (Atomic)
- **Effort**: 1 story point (~1 hour)
- **Priority**: HIGH
- **Risk Level**: TRIVIAL
- **Status**: Planning Phase Complete

## Feature Summary

The backend API has already been updated to support 3000 character final comments. This feature updates the frontend FinalCommentsModal component to match:

- Update `maxLength` from 1000 → 3000 on both Add and Edit form textareas
- Update character counter display to show "X/3000" format
- Update placeholder text to reflect new limit
- Update Populate with Above Comments truncation logic (1000 → 3000)
- Update all documentation and code comments

## Specification Files

### Phase 1: Requirements ✅
**File**: `planning/user-stories.md`

Contains:
- 1 user story (US-3000-CHAR-001)
- 5 acceptance criteria covering all aspects of the feature
- Testing strategy with unit and integration tests
- Edge cases and validation rules
- Technical considerations for backward compatibility
- List of affected files with specific line numbers

### Phase 2: Product Requirements ✅
**File**: `planning/minimal-prd.md`

Contains:
- Executive summary and business context
- User problem statement
- Feature scope (in/out of scope)
- Key functional and non-functional requirements
- Implementation overview with specific file changes
- Risk assessment (trivial)
- Success metrics and definition of done
- Timeline and effort estimate
- Rollback plan
- Testing strategy
- Release notes (draft)

### Metadata
**File**: `metadata.json`

Contains:
- Feature information and title
- Complexity assessment and reasoning
- Scope: 1 story, 1 point, 1 component affected
- Phase status tracking
- Business value and impact
- Dependencies
- Estimated effort breakdown

## Key Locations to Modify

**File**: `src/components/finalComments/FinalCommentsModal.tsx`

| Line | Current | Update To | Note |
|------|---------|-----------|------|
| 43 | JSDoc mentions "1000 char" | Change to "3000 char" | Documentation |
| 501 | `if (populatedText.length > 1000)` | Change to `> 3000` | Truncation condition |
| 501 | `.substring(0, 1000)` | Change to `.substring(0, 3000)` | Truncation |
| 839 | `placeholder="Enter optional comment (max 1000 characters)"` | Change to `3000` | Add form |
| 842 | `maxLength={1000}` | Change to `{3000}` | Add form |
| 865 | `{addForm.comment.length}/1000` | Change to `/3000` | Add form counter |
| 1147 | `placeholder="Enter optional comment (max 1000 characters)"` | Change to `3000` | Edit form |
| 1150 | `maxLength={1000}` | Change to `{3000}` | Edit form |
| 1172 | `{editForm.comment.length}/1000` | Change to `/3000` | Edit form counter |

## Next Steps

### Before Implementation
1. Review and approve this PDD specification
2. Verify acceptance criteria align with requirements
3. Confirm backend truly supports 3000 characters

### During Implementation
1. Make 9 code changes in FinalCommentsModal.tsx
2. Create/update tests for character limits
3. Run full test suite: `npm run test`
4. Run linter: `npm run lint`
5. Manual verification of both forms

### After Implementation
1. Update metadata.json with completion timestamps
2. Create pull request referencing this PDD
3. Ensure all tests pass in CI
4. Merge to main branch

## Acceptance Criteria Summary

✅ **AC-1.1**: Add form accepts 3000 characters with proper maxLength and placeholder
✅ **AC-1.2**: Edit form accepts 3000 characters with proper maxLength and placeholder
✅ **AC-1.3**: Populate button truncates to 3000 (not 1000) with Unicode preservation
✅ **AC-1.4**: All documentation and code comments updated
✅ **AC-1.5**: Form validation passes with up to 3000 character comments

## Technical Notes

- **No API changes required**: Backend already supports 3000 chars
- **Backward compatible**: Existing 1000-char comments will work fine
- **No database changes**: No migrations needed
- **No component structure changes**: Pure configuration update
- **Simple rollback**: Revert character constants if issues arise

## Files in This PDD

```
3000-char-final-comments/
├── README.md                  (this file)
├── metadata.json             (feature metadata and status)
├── planning/
│   ├── user-stories.md       (5 acceptance criteria)
│   └── minimal-prd.md        (business requirements)
└── (design and tasks files will be created during subsequent phases)
```

## Questions & Decisions

**Q: Why L0 (Atomic) complexity?**
A: Single component, simple constant changes, no new logic, backend ready, minimal testing scope.

**Q: Will existing long comments break?**
A: No. Existing comments under 3000 chars will display fine. Comments between 1000-3000 chars will now be editable.

**Q: What if something goes wrong?**
A: Simple revert of 9 code lines restores 1000-char limit. No data loss possible.

---

**PDD Created**: 2026-01-08
**Version**: 1.0
**Status**: Ready for Design Phase
