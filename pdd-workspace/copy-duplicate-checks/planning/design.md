# Design: Copy Comments with Duplicate Detection

**Feature**: Copy Personalized Comments with Duplicate Detection
**Status**: DESIGN_SPECIFICATION
**Last Updated**: 2026-02-06

---

## Technical Architecture

### 1. Type Definitions

#### Add to `src/types/index.ts`

```typescript
/**
 * Result of a copy operation for personalized comments
 * Returned by POST /personalized-comment/copy
 *
 * Used to communicate operation summary including success count and duplicate information
 */
export interface PersonalizedCommentCopyResult {
  /**
   * Number of comments successfully copied to the target subject
   * @example 3
   */
  successCount: number;

  /**
   * Number of comments skipped due to duplication detection
   * Only relevant when overwrite=false (append mode)
   * In overwrite mode, this is always 0
   * @example 2
   */
  duplicateCount: number;

  /**
   * The overwrite mode that was used in this copy operation
   * true: overwrite all existing comments
   * false: append to existing comments (with duplicate detection)
   * @example false
   */
  overwrite: boolean;
}
```

### 2. Service Layer Update

#### Update `src/services/api/personalizedCommentService.ts`

**Current Code (lines 102-117)**:
```typescript
async copy(request: {
  subjectFromId: string
  subjectToId: string
  overwrite: boolean
}): Promise<PersonalizedComment[]> {
  try {
    const response = await apiClient.post<PersonalizedComment[]>(
      '/personalized-comment/copy',
      request,
    )
    return response.data
  } catch (error) {
    console.error('Failed to copy personalized comments:', error)
    throw new Error('Failed to copy personalized comments')
  }
}
```

**Updated Code**:
```typescript
async copy(request: {
  subjectFromId: string
  subjectToId: string
  overwrite: boolean
}): Promise<PersonalizedCommentCopyResult> {
  try {
    const response = await apiClient.post<PersonalizedCommentCopyResult>(
      '/personalized-comment/copy',
      request,
    )
    return response.data
  } catch (error) {
    console.error('Failed to copy personalized comments:', error)
    throw new Error('Failed to copy personalized comments')
  }
}
```

**Changes**:
- Import new type: `PersonalizedCommentCopyResult`
- Update return type: `Promise<PersonalizedComment[]>` → `Promise<PersonalizedCommentCopyResult>`
- Update generic type in apiClient.post call

### 3. Component Update

#### Update `src/components/personalizedComments/CopyCommentsModal.tsx`

**Changes Required**:

1. **Response Type Change** (lines 65-68):
   - Old: State expects `{ count: number, overwrite: boolean }`
   - New: State will contain `PersonalizedCommentCopyResult`

2. **Success Message Generation**:
   - Add helper function to format message based on response

3. **Message Display Logic** (lines 420-431):
   - Different messages for append vs overwrite mode
   - Include duplicate count in append mode
   - Handle singular/plural

#### Implementation Details

**New State Type**:
```typescript
const [success, setSuccess] = useState<PersonalizedCommentCopyResult | null>(null)
```

**New Helper Function** (add before component):
```typescript
/**
 * Format success message based on copy operation result
 * Differentiates between append mode (with duplicate info) and overwrite mode
 */
function formatSuccessMessage(
  result: PersonalizedCommentCopyResult,
  targetName: string,
): string {
  const { successCount, duplicateCount, overwrite } = result

  if (overwrite) {
    // Overwrite mode: simple message about total copied
    return `Successfully replaced all comments in ${targetName}. Copied ${successCount} ${successCount === 1 ? 'comment' : 'comments'}.`
  }

  // Append mode: include duplicate information
  if (duplicateCount === 0) {
    return `Successfully copied ${successCount} ${successCount === 1 ? 'comment' : 'comments'} to ${targetName}.`
  }

  return `Successfully copied ${successCount} ${successCount === 1 ? 'comment' : 'comments'} to ${targetName}. ${duplicateCount} ${duplicateCount === 1 ? 'duplicate was' : 'duplicates were'} skipped (already existed).`
}
```

**Update handleCopy Method** (lines 90-114):
```typescript
const handleCopy = async () => {
  if (!selectedTargetId) {
    setError('Please select a target subject')
    return
  }

  setIsLoading(true)
  setError(null)
  try {
    const result = await personalizedCommentService.copy({
      subjectFromId: sourceSubjectId,
      subjectToId: selectedTargetId,
      overwrite: overwriteMode,
    })
    // Result is now PersonalizedCommentCopyResult object
    setSuccess(result)
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to copy comments'
    setError(errorMessage)
  } finally {
    setIsLoading(false)
  }
}
```

**Update Success Display** (lines 402-433):
```typescript
{/* Success State Display (AC-4.3, AC-7.1) */}
{success && (
  <div
    style={{
      marginBottom: spacing.lg,
      padding: spacing.md,
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      borderRadius: borders.radius.md,
      border: `${borders.width.thin} solid rgba(34, 197, 94, 0.5)`,
    }}
  >
    <p
      style={{
        fontSize: typography.fontSize.sm,
        color: 'rgb(34, 197, 94)',
        margin: 0,
        marginBottom: spacing.xs,
      }}
    >
      {formatSuccessMessage(success, targetName)}
    </p>
  </div>
)}
```

### 4. Data Flow

```
User Action: Clicks Copy Button
    ↓
Component: handleCopy() called
    ↓
API Call: personalizedCommentService.copy(request)
    ↓
Service: POST /personalized-comment/copy
    ↓
Backend: Performs copy operation
    • Append mode: Detects duplicates (case-sensitive text match)
    • Overwrite mode: Replaces all comments
    ↓
Response: PersonalizedCommentCopyResult
    {
      successCount: number,
      duplicateCount: number,
      overwrite: boolean
    }
    ↓
Component: setSuccess(result)
    ↓
UI Update: Displays formatted message based on mode
    • Append + duplicates: Shows duplicate count
    • Append + no duplicates: Simple success message
    • Overwrite: Shows "replaced" message
    ↓
User Action: Clicks Done
    ↓
Component: onClose()
```

---

## User Interface Changes

### Success Message Examples

#### Scenario 1: Append Mode with Duplicates
```
Input: { successCount: 3, duplicateCount: 2, overwrite: false }
Display:
  ✓ Successfully copied 3 comments to Spanish 102.
    2 duplicates were skipped (already existed).
```

#### Scenario 2: Append Mode No Duplicates
```
Input: { successCount: 5, duplicateCount: 0, overwrite: false }
Display:
  ✓ Successfully copied 5 comments to Spanish 102.
```

#### Scenario 3: Overwrite Mode
```
Input: { successCount: 7, duplicateCount: 0, overwrite: true }
Display:
  ✓ Successfully replaced all comments in Spanish 102.
    Copied 7 comments.
```

### Message Styling
- Uses existing design tokens from theme/tokens
- Green accent color: `rgba(34, 197, 94)`
- Font size: `typography.fontSize.sm`
- Padding and spacing from design tokens

---

## Error Handling

### Error Scenarios (Unchanged)
1. **Network Error**
   - Message: "Failed to copy personalized comments"
   - User can click "Try Again"

2. **API Error Response**
   - Message from API error is displayed
   - User can click "Try Again" to retry

3. **Validation Error**
   - User must select target subject first
   - Message: "Please select a target subject"

### Implementation
- Existing try-catch logic remains unchanged
- Error handling in personalizedCommentService is unchanged
- Component error state management is unchanged

---

## Testing Strategy

### Unit Test: Service Method

**File**: `src/services/api/__tests__/personalizedCommentService.test.ts`

```typescript
describe('personalizedCommentService.copy', () => {
  it('should return PersonalizedCommentCopyResult with correct type', async () => {
    // Mock API response
    const mockResponse: PersonalizedCommentCopyResult = {
      successCount: 3,
      duplicateCount: 2,
      overwrite: false
    }

    // Mock API client
    jest.spyOn(apiClient, 'post').mockResolvedValue({
      data: mockResponse
    })

    // Call service method
    const result = await personalizedCommentService.copy({
      subjectFromId: 'source-id',
      subjectToId: 'target-id',
      overwrite: false
    })

    // Verify response structure
    expect(result).toEqual(mockResponse)
    expect(result.successCount).toBe(3)
    expect(result.duplicateCount).toBe(2)
    expect(result.overwrite).toBe(false)
  })
})
```

### Component Tests: Message Formatting

**File**: `src/components/personalizedComments/__tests__/CopyCommentsModal.duplicate-handling.test.tsx`

```typescript
describe('CopyCommentsModal - Duplicate Handling', () => {
  it('should show duplicate count in append mode', async () => {
    // Setup: Component in append mode
    // Mock API to return append result with duplicates
    // User clicks Copy
    // Assert: Message shows "2 duplicates were skipped"
  })

  it('should hide duplicate info when none found', async () => {
    // Setup: Component in append mode
    // Mock API to return: { successCount: 5, duplicateCount: 0, overwrite: false }
    // User clicks Copy
    // Assert: Message shows only success message, no duplicate mention
  })

  it('should show replace message in overwrite mode', async () => {
    // Setup: Component in overwrite mode
    // Mock API to return: { successCount: 5, duplicateCount: 0, overwrite: true }
    // User clicks Copy
    // Assert: Message says "Successfully replaced all comments"
  })

  it('should handle singular/plural correctly', async () => {
    // Test: 1 comment vs 2+ comments
    // Test: 1 duplicate vs 2+ duplicates
    // Assert: Message uses correct singular/plural form
  })
})
```

### Integration Test: End-to-End Flow

**File**: `src/components/personalizedComments/__tests__/CopyCommentsModal.integration.test.tsx`

```typescript
describe('CopyCommentsModal - Full Copy Flow', () => {
  it('should complete copy operation with new response type', async () => {
    // Setup modal
    // Select target subject
    // Select append mode
    // Click Copy
    // Verify: API called with correct params
    // Verify: Success message displayed with correct format
    // Verify: Modal doesn't close until user clicks Done
    // Click Done
    // Verify: Modal closes
  })
})
```

---

## Performance Considerations

| Aspect | Consideration | Mitigation |
|--------|---|---|
| **API Response Parsing** | New response is smaller object (not array) | Faster parsing, no array iteration needed |
| **Component Rendering** | Message formatting is sync | Helper function is minimal, no performance impact |
| **Type Checking** | TypeScript compilation | No additional overhead |

---

## Accessibility

1. **Screen Reader Support**
   - Success message is in standard `<p>` tag
   - Message is semantic and clear
   - No visual-only information

2. **Keyboard Navigation**
   - Modal buttons remain keyboard accessible
   - Focus management unchanged

3. **Color Contrast**
   - Success message uses green color: sufficient contrast
   - No changes to existing contrast ratios

---

## Browser Compatibility

- No new APIs or features introduced
- Uses existing React patterns
- No browser-specific code
- Compatible with all supported browsers

---

## Code Quality Standards

### TypeScript
- ✅ No `any` types
- ✅ All return types explicit
- ✅ Strict mode compatible
- ✅ Clear interface documentation

### React Best Practices
- ✅ Functional components with hooks
- ✅ Proper state management
- ✅ No unnecessary re-renders
- ✅ Memoization where appropriate (existing patterns maintained)

### Testing
- ✅ Unit tests for service method
- ✅ Component tests for message formatting
- ✅ Integration tests for full flow
- ✅ Edge cases covered (singular/plural, zero duplicates)

---

## Files Modified Summary

| File | Change Type | Impact |
|------|---|---|
| `src/types/index.ts` | Addition | New interface definition |
| `src/services/api/personalizedCommentService.ts` | Update | Return type change |
| `src/components/personalizedComments/CopyCommentsModal.tsx` | Update | Success message logic |
| Test files | Addition | New test cases |

---

## Deployment Notes

- No database migrations required
- No environment variable changes
- No API authentication changes
- No breaking changes to other features
- Can be deployed with other features in same release

---

## Rollback Plan

If issues arise after deployment:
1. Revert TypeScript type imports to old `PersonalizedComment[]`
2. Update service method return type back to `Promise<PersonalizedComment[]>`
3. Remove new interface from types
4. Handle response with `response.data.length` in component
5. No data loss or consistency issues

---

## Sign-Off

**Status**: Ready for Task Breakdown
**Next Step**: Create implementation tasks with TDD-first approach
