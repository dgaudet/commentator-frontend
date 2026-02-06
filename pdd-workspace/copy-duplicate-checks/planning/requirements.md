# Requirements: Copy Comments with Duplicate Detection

**Feature**: Copy Personalized Comments with Duplicate Detection
**Status**: SPECIFICATION
**Last Updated**: 2026-02-06

---

## User Stories

### US-CP-006: Handle New API Response Format

**WHEN** a user clicks "Copy" to copy personalized comments from one subject to another
**THE SYSTEM SHALL** correctly parse and handle the new `PersonalizedCommentCopyResult` response structure

#### Acceptance Criteria

**AC-6.1: Service returns correct response type**
- GIVEN the copy API endpoint returns `{ successCount, duplicateCount, overwrite }`
- WHEN `personalizedCommentService.copy()` is called
- THEN the response is returned as-is without attempting to map to PersonalizedComment array
- AND the response object contains all three required fields

**AC-6.2: TypeScript types are updated**
- GIVEN the API response has changed structure
- WHEN the frontend codebase is compiled with `npm run lint`
- THEN no TypeScript errors about PersonalizedComment[] are present
- AND a new `PersonalizedCommentCopyResult` interface exists with successCount, duplicateCount, overwrite

**AC-6.3: Component handles response without runtime errors**
- GIVEN the copy operation completes successfully
- WHEN the response is received by CopyCommentsModal
- THEN no runtime errors occur from type mismatches
- AND the success state is set correctly with the new response data

#### Edge Cases
- API returns { successCount: 0, duplicateCount: 5, overwrite: false } - 0 comments copied, all were duplicates
- API returns { successCount: 5, duplicateCount: 0, overwrite: true } - Overwrite mode
- API returns with unexpected fields - Extra fields are ignored, required fields are used

---

### US-CP-007: Display Duplicate Information in Append Mode

**WHEN** a user performs a copy operation in append mode (append to existing comments)
**THE SYSTEM SHALL** display a success message that includes information about duplicates detected and skipped

#### Acceptance Criteria

**AC-7.1: Success message shows duplicate count**
- GIVEN a copy operation completes in append mode (overwrite=false)
- WHEN the response contains `{ successCount: 3, duplicateCount: 2, overwrite: false }`
- THEN the success message displays: "Successfully copied 3 comments to {targetName}. 2 duplicates were skipped (already existed)."
- AND both numbers are clearly visible to the user

**AC-7.2: Message differs between append and overwrite modes**
- GIVEN a copy operation in append mode shows duplicate information
- WHEN the same operation is done in overwrite mode (overwrite=true)
- THEN overwrite mode message displays: "Successfully replaced all comments in {targetName}. Copied 5 comments."
- AND no duplicate information appears in overwrite messages
- AND the distinction between modes is clear

**AC-7.3: Zero duplicates handled gracefully**
- GIVEN a copy operation in append mode with no duplicates
- WHEN the response contains `{ successCount: 5, duplicateCount: 0, overwrite: false }`
- THEN the success message displays: "Successfully copied 5 comments to {targetName}."
- AND no duplicate-related text appears when duplicateCount is 0

**AC-7.4: Message persists in success view**
- GIVEN a user sees the success message
- WHEN they don't immediately close the modal
- THEN the message remains visible
- AND the message is readable and not cut off

#### Edge Cases
- Singular vs plural: "1 comment" vs "5 comments", "1 duplicate" vs "2 duplicates"
- Long target subject names don't break the message layout
- Very large counts (100+ comments) display correctly

---

### US-CP-008: Maintain Existing Copy Functionality

**WHEN** the copy feature is updated to handle the new API response
**THE SYSTEM SHALL** ensure all existing functionality continues to work without user impact

#### Acceptance Criteria

**AC-8.1: Copy mode selection still works**
- GIVEN the CopyCommentsModal component
- WHEN a user selects between "Append" and "Overwrite" radio buttons
- THEN the selection is tracked correctly
- AND the appropriate mode is sent to the API

**AC-8.2: Both append and overwrite modes function correctly**
- GIVEN a user chooses append mode
- WHEN they perform the copy operation
- THEN the API is called with `overwrite: false`
- AND the response is handled correctly
- WHEN a user chooses overwrite mode
- THEN the API is called with `overwrite: true`
- AND the response is handled correctly

**AC-8.3: Error handling unchanged**
- GIVEN a copy operation fails due to API error
- WHEN the error response is received
- THEN the error message is displayed
- AND the error handling logic works as before
- AND users can click "Try Again" to retry

**AC-8.4: Modal state management correct**
- GIVEN the modal opens
- WHEN the user performs a copy operation
- THEN the form resets on success before showing success message
- WHEN the user clicks "Done"
- THEN the modal closes
- AND the form resets for the next copy operation

#### Edge Cases
- Network error during copy - error message displays
- API returns error with descriptive message - message is shown to user
- Copy operation takes time - loading state is visible
- User clicks copy multiple times rapidly - duplicate API calls are prevented

---

## Data Model Updates

### New TypeScript Interface

```typescript
interface PersonalizedCommentCopyResult {
  successCount: number;      // Comments successfully copied
  duplicateCount: number;    // Comments skipped (append mode only)
  overwrite: boolean;        // Mode used in the operation
}
```

**Changes from Previous Model**:
- Old: `PersonalizedComment[]` - Array of full comment objects
- New: `PersonalizedCommentCopyResult` - Summary object with counts only

### Service Method Signature

```typescript
async copy(request: {
  subjectFromId: string
  subjectToId: string
  overwrite: boolean
}): Promise<PersonalizedCommentCopyResult>
```

**Changes**:
- Return type changes from `Promise<PersonalizedComment[]>` to `Promise<PersonalizedCommentCopyResult>`
- Request parameter unchanged
- Response mapping simplified (no array unpacking needed)

---

## Functional Specification

### Copy Operation Response Handling

#### Current Flow (Pre-Change)
```
User clicks Copy
  → API call with subjectFromId, subjectToId, overwrite
  → API returns PersonalizedComment[] (array)
  → Component uses: copied.length
  → Success message: "{copied.length} comments copied"
```

#### New Flow (Post-Change)
```
User clicks Copy
  → API call with subjectFromId, subjectToId, overwrite
  → API returns PersonalizedCommentCopyResult object
  → Component uses: result.successCount, result.duplicateCount
  → Success message (append): "{successCount} copied, {duplicateCount} duplicates skipped"
  → Success message (overwrite): "{successCount} comments copied (replaced all existing)"
```

### Message Templates

**Append Mode Success**:
```
Successfully copied {successCount} {plural:comment} to {targetName}.
{if duplicateCount > 0: {duplicateCount} {plural:duplicate} {plural:was/were} skipped (already existed).}
```

**Overwrite Mode Success**:
```
Successfully replaced all comments in {targetName}. Copied {successCount} {plural:comment}.
```

**Error Messages**: Unchanged - reuse existing error handling

---

## Testing Strategy

### Unit Tests

1. **Service Method Tests**
   - Verify correct response type from API
   - Verify response is returned without modification
   - Verify error handling unchanged

2. **Component Tests**
   - Verify success state set with new response structure
   - Verify success message displays correct counts
   - Verify append vs overwrite message differences
   - Verify zero duplicates edge case
   - Verify error state still works

### Integration Tests

1. **End-to-End Copy Flow**
   - Complete copy operation in append mode
   - Complete copy operation in overwrite mode
   - Verify success message displayed correctly
   - Verify modal closes on completion

2. **Error Scenarios**
   - Network error during copy
   - API error response
   - User cancels operation

### Test Examples

```typescript
describe('Copy with duplicate detection', () => {
  it('should display duplicate count in append mode', () => {
    // Given response: { successCount: 3, duplicateCount: 2, overwrite: false }
    // When copy completes
    // Then message shows: "Successfully copied 3 comments... 2 duplicates were skipped"
  })

  it('should not show duplicate info in overwrite mode', () => {
    // Given response: { successCount: 5, duplicateCount: 0, overwrite: true }
    // When copy completes
    // Then message shows: "Successfully replaced all comments... Copied 5 comments"
  })

  it('should handle zero duplicates in append mode', () => {
    // Given response: { successCount: 5, duplicateCount: 0, overwrite: false }
    // When copy completes
    // Then message shows only: "Successfully copied 5 comments" (no duplicate mention)
  })
})
```

---

## Non-Functional Requirements

| Requirement | Specification |
|-------------|---|
| **Performance** | Copy operation response parsed in < 100ms |
| **Type Safety** | Zero TypeScript errors with strict mode enabled |
| **Accessibility** | Success message readable by screen readers |
| **Compatibility** | Works with all supported browsers |
| **Maintainability** | Code follows existing patterns in codebase |

---

## Dependency & Impact Analysis

### Files Affected
1. `src/services/api/personalizedCommentService.ts` - Update response type
2. `src/types/index.ts` - Add PersonalizedCommentCopyResult interface
3. `src/components/personalizedComments/CopyCommentsModal.tsx` - Update success message logic
4. Test files: `CopyCommentsModal.*.test.tsx` - Add new test cases

### Breaking Changes
- **None** - Changes are backward compatible with existing API endpoint

### Migration Path
- No migration needed for users
- Frontend code change is additive, no removals required

---

## Version & Traceability

| ID | Type | Traceability |
|----|------|---|
| REQ-CP-001 | Requirement | API Response Format Change |
| REQ-CP-002 | Requirement | Duplicate Information Display |
| REQ-CP-003 | Requirement | Mode Differentiation |
| REQ-CP-004 | Requirement | Error Handling |
| REQ-CP-005 | Requirement | Type Safety |

---

## Sign-Off

**Status**: Ready for Design Review
**Next Step**: Create technical design and task breakdown
