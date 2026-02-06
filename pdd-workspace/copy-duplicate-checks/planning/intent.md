# Feature Intent: Copy Comments with Duplicate Detection

**Feature Name**: Copy Personalized Comments with Duplicate Detection
**Status**: INTENT_REFINEMENT
**Date**: 2026-02-06
**Owner**: Principal Product Owner

## Executive Summary

The `/personalized-comment/copy` API endpoint has been enhanced to handle duplicate detection when copying comments between subjects. The response format has changed from returning an array of copied comments to returning an operation summary with success counts and duplicate detection. This feature requires frontend updates to handle the new response type and communicate duplicate information to users.

## Business Context

**Problem Statement**: When copying personalized comments from one subject to another in append mode, users had no visibility into:
- How many comments were actually copied
- How many duplicates were detected and skipped
- The operation outcome details

**User Impact**: Teachers can now safely copy comments between subjects knowing that:
1. In **append mode**: Duplicate comments are automatically detected and skipped, preventing unintended duplicates
2. In **overwrite mode**: All existing comments are replaced with source comments
3. A clear summary shows the operation results

## API Changes

### New Response Schema: PersonalizedCommentCopyResult

```typescript
{
  successCount: number;        // Comments successfully copied
  duplicateCount: number;      // Duplicates skipped (append mode only)
  overwrite: boolean;          // Mode used (overwrite vs append)
}
```

### Response Examples

**Append Mode (overwrite=false)**
```json
{
  "successCount": 3,
  "duplicateCount": 2,
  "overwrite": false
}
```
Message: "Copied 3 comments. 2 duplicates were skipped (already existed)."

**Overwrite Mode (overwrite=true)**
```json
{
  "successCount": 5,
  "duplicateCount": 0,
  "overwrite": true
}
```
Message: "Successfully replaced all comments with 5 copied comments."

## Scope

### In Scope
- Update `personalizedCommentService.copy()` to handle new response type
- Update `CopyCommentsModal` component to display operation summary
- Update success message logic to show duplicate counts in append mode
- Update type definitions for the API response

### Out of Scope
- Backend API changes (already complete)
- Changes to other copy functionality (bulk upload handles separately)
- UI redesign or modal restructuring

## Success Criteria

1. **API Compatibility**: Frontend correctly handles `PersonalizedCommentCopyResult` response
2. **User Feedback**: Users see clear summary of copy operation including duplicate counts
3. **Type Safety**: TypeScript types updated to reflect new response structure
4. **Test Coverage**: New tests verify response handling for both append and overwrite modes
5. **No Breaking Changes**: Feature maintains backward compatibility with existing UI

## Stakeholder Alignment

- ✅ Users can see operation summary with duplicate information
- ✅ Teachers understand when duplicates are prevented
- ✅ No changes required to user workflows
- ✅ Improves transparency of copy operations

## Acceptance Criteria Summary

**US-CP-006**: Handle new API response format
- AC-6.1: Service returns PersonalizedCommentCopyResult structure
- AC-6.2: TypeScript types updated for new response
- AC-6.3: Component handles response without errors

**US-CP-007**: Display duplicate information in append mode
- AC-7.1: Success message shows duplicate count
- AC-7.2: Message differentiates between append and overwrite modes
- AC-7.3: Zero duplicates handled gracefully

**US-CP-008**: Maintain existing functionality
- AC-8.1: Component still displays copy mode selection
- AC-8.2: Both append and overwrite modes work correctly
- AC-8.3: Error handling still works as before

## Complexity Assessment

**Complexity Level**: L1 (Micro)
**Effort**: 1-2 weeks
**Team Size**: 1 developer
**Risk Level**: Low

**Rationale**:
- Single component update (CopyCommentsModal)
- Service method change is straightforward
- New response type is simpler than old (no array mapping)
- Existing UI can accommodate new information
- Clear test patterns exist from prior work

## Technical Notes

- Current code at line 99-112 of `personalizedCommentService.ts` expects `PersonalizedComment[]`
- Current code at line 104-107 of `CopyCommentsModal.tsx` uses `copied.length`
- Response is now an object with summary counts instead of array of comments
- Backend already implements duplicate detection (case-sensitive text match in append mode)

---

## Next Phase: Requirements Definition

Ready to proceed to TASK_EXECUTION once approved.
