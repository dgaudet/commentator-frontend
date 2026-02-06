# Implementation Tasks: Copy Comments with Duplicate Detection

**Feature**: Copy Personalized Comments with Duplicate Detection
**Status**: TASK_BREAKDOWN
**Last Updated**: 2026-02-06
**Complexity**: L1 (Micro) - Low Risk
**Effort Estimate**: 1-2 weeks

---

## Task Summary

| Task ID | Title | Risk | Effort | Status |
|---------|-------|------|--------|--------|
| TASK-1 | Define PersonalizedCommentCopyResult Type | Trivial | 15 min | Pending |
| TASK-2 | Update Service Method Signature | Trivial | 15 min | Pending |
| TASK-3 | Implement Message Formatting Helper | Low | 30 min | Pending |
| TASK-4 | Update Component State Management | Low | 20 min | Pending |
| TASK-5 | Update Component Success Display | Low | 20 min | Pending |
| TASK-6 | Write Service Tests | Low | 45 min | Pending |
| TASK-7 | Write Component Tests | Low | 60 min | Pending |
| TASK-8 | Run Full Test Suite | Low | 15 min | Pending |

---

## Detailed Tasks

### TASK-1: Define PersonalizedCommentCopyResult Type

**Risk Level**: Trivial
**Effort**: 15 minutes
**Acceptance Criteria**:
- [ ] New interface added to `src/types/index.ts`
- [ ] Interface has three required properties: successCount, duplicateCount, overwrite
- [ ] Each property has JSDoc comments explaining its purpose
- [ ] TypeScript compiles without errors
- [ ] No breaking changes to existing types

**Implementation Steps**:
1. Open `src/types/index.ts`
2. Add new interface after PersonalizedComment definition:
   ```typescript
   export interface PersonalizedCommentCopyResult {
     successCount: number;
     duplicateCount: number;
     overwrite: boolean;
   }
   ```
3. Add JSDoc comments to each field
4. Run `npm run lint` to verify

**Testing**:
- [ ] TypeScript compilation passes
- [ ] No type errors reported

**Definition of Done**:
- Interface is properly exported
- All properties documented
- No compilation errors

---

### TASK-2: Update Service Method Signature

**Risk Level**: Trivial
**Effort**: 15 minutes
**Acceptance Criteria**:
- [ ] Service method imports new type
- [ ] Return type changed from `Promise<PersonalizedComment[]>` to `Promise<PersonalizedCommentCopyResult>`
- [ ] Generic type in apiClient.post updated
- [ ] TypeScript compilation clean
- [ ] Existing error handling preserved

**Implementation Steps**:
1. Open `src/services/api/personalizedCommentService.ts`
2. Import new type at top:
   ```typescript
   import type { PersonalizedCommentCopyResult } from '../../types'
   ```
3. Update copy method signature (line 106):
   - Old: `Promise<PersonalizedComment[]>`
   - New: `Promise<PersonalizedCommentCopyResult>`
4. Update generic type in apiClient.post (line 108):
   - Old: `apiClient.post<PersonalizedComment[]>`
   - New: `apiClient.post<PersonalizedCommentCopyResult>`
5. Response handling stays the same (line 112): `return response.data`
6. Error handling unchanged

**Testing**:
- [ ] TypeScript compilation passes
- [ ] npm run lint shows no errors

**Definition of Done**:
- Method signature updated
- Type safe for calling code
- No compilation errors

---

### TASK-3: Implement Message Formatting Helper

**Risk Level**: Low
**Effort**: 30 minutes
**Acceptance Criteria**:
- [ ] Helper function created and exported
- [ ] Takes PersonalizedCommentCopyResult and targetName as parameters
- [ ] Returns appropriate message for each scenario:
  - Append mode with duplicates
  - Append mode without duplicates
  - Overwrite mode
- [ ] Handles singular/plural correctly
- [ ] Message formatting matches design specification
- [ ] Function is pure (no side effects)
- [ ] Unit tests pass

**Implementation Steps**:
1. Create helper function in CopyCommentsModal.tsx (before component definition)
2. Function signature:
   ```typescript
   function formatSuccessMessage(
     result: PersonalizedCommentCopyResult,
     targetName: string,
   ): string
   ```
3. Implement logic:
   - Check overwrite flag
   - If overwrite: return "Successfully replaced..." message
   - If append and duplicateCount > 0: include duplicate info
   - If append and duplicateCount === 0: simple success message
   - Use ternary for singular/plural forms
4. Test all three paths manually

**Test Scenarios**:
- [ ] Append mode with 2 duplicates
- [ ] Append mode with 0 duplicates
- [ ] Overwrite mode
- [ ] Singular forms (1 comment, 1 duplicate)
- [ ] Plural forms (5 comments, 2 duplicates)

**Definition of Done**:
- Helper function works for all scenarios
- Message formatting correct
- Unit tests pass

---

### TASK-4: Update Component State Management

**Risk Level**: Low
**Effort**: 20 minutes
**Acceptance Criteria**:
- [ ] Success state type changed to `PersonalizedCommentCopyResult | null`
- [ ] State initialization unchanged
- [ ] setSuccess call in handleCopy passes result object directly
- [ ] No type errors in component
- [ ] Existing error handling preserved
- [ ] Loading state logic unchanged

**Implementation Steps**:
1. Open `src/components/personalizedComments/CopyCommentsModal.tsx`
2. Find success state declaration (lines 65-68):
   ```typescript
   const [success, setSuccess] = useState<PersonalizedCommentCopyResult | null>(null)
   ```
3. Update handleCopy method (lines 99-107):
   - Change: `const copied = await personalizedCommentService.copy(...)`
   - Change: `setSuccess(result)` instead of `setSuccess({ count: copied.length, overwrite: overwriteMode })`
4. Import PersonalizedCommentCopyResult type at top of file
5. Run linting

**Testing**:
- [ ] TypeScript compilation passes
- [ ] No type errors in IDE
- [ ] ESLint passes

**Definition of Done**:
- State type matches API response
- No type errors
- Component compiles cleanly

---

### TASK-5: Update Component Success Display

**Risk Level**: Low
**Effort**: 20 minutes
**Acceptance Criteria**:
- [ ] Success message uses formatSuccessMessage helper
- [ ] Message displays correctly for append mode with duplicates
- [ ] Message displays correctly for append mode without duplicates
- [ ] Message displays correctly for overwrite mode
- [ ] Visual styling preserved
- [ ] No text truncation or overflow
- [ ] Message is visible and readable

**Implementation Steps**:
1. Open CopyCommentsModal.tsx
2. Find success display section (lines 402-433)
3. Replace message content with:
   ```typescript
   <p style={{...}}>
     {formatSuccessMessage(success, targetName)}
   </p>
   ```
4. Remove the old multi-line success message logic
5. Keep styling and error state display unchanged
6. Test display at different screen sizes

**Testing**:
- [ ] Message displays for all three scenarios
- [ ] Text is readable
- [ ] No layout issues
- [ ] Modal still closes when clicking Done

**Definition of Done**:
- Message displays correctly
- All scenarios work
- Visual styling matches design

---

### TASK-6: Write Service Tests

**Risk Level**: Low
**Effort**: 45 minutes
**Acceptance Criteria**:
- [ ] Test file exists: `src/services/api/__tests__/personalizedCommentService.copy.test.ts`
- [ ] Tests verify correct response type parsing
- [ ] Tests verify each field of response
- [ ] Error handling tests pass
- [ ] All tests pass with `npm run test`
- [ ] Test coverage > 80%

**Test Cases**:

**Test 1: Append mode with duplicates**
```typescript
it('should return PersonalizedCommentCopyResult with duplicates', async () => {
  const mockResponse: PersonalizedCommentCopyResult = {
    successCount: 3,
    duplicateCount: 2,
    overwrite: false
  }

  jest.spyOn(apiClient, 'post').mockResolvedValue({ data: mockResponse })

  const result = await personalizedCommentService.copy({
    subjectFromId: 'source',
    subjectToId: 'target',
    overwrite: false
  })

  expect(result).toEqual(mockResponse)
  expect(result.successCount).toBe(3)
  expect(result.duplicateCount).toBe(2)
})
```

**Test 2: Overwrite mode**
```typescript
it('should return correct result in overwrite mode', async () => {
  const mockResponse: PersonalizedCommentCopyResult = {
    successCount: 5,
    duplicateCount: 0,
    overwrite: true
  }

  jest.spyOn(apiClient, 'post').mockResolvedValue({ data: mockResponse })

  const result = await personalizedCommentService.copy({
    subjectFromId: 'source',
    subjectToId: 'target',
    overwrite: true
  })

  expect(result.overwrite).toBe(true)
  expect(result.duplicateCount).toBe(0)
})
```

**Test 3: Error handling**
```typescript
it('should throw error on API failure', async () => {
  jest.spyOn(apiClient, 'post').mockRejectedValue(new Error('API Error'))

  await expect(personalizedCommentService.copy({
    subjectFromId: 'source',
    subjectToId: 'target',
    overwrite: false
  })).rejects.toThrow('Failed to copy personalized comments')
})
```

**Definition of Done**:
- All three test cases pass
- No console errors during test
- Coverage metrics adequate

---

### TASK-7: Write Component Tests

**Risk Level**: Low
**Effort**: 60 minutes
**Acceptance Criteria**:
- [ ] New test file: `src/components/personalizedComments/__tests__/CopyCommentsModal.duplicate-handling.test.tsx`
- [ ] Tests for message formatting in all three scenarios
- [ ] Tests for singular/plural handling
- [ ] Tests for zero duplicates edge case
- [ ] All tests pass with `npm run test`
- [ ] Test coverage > 80%

**Test Cases**:

**Test 1: Append mode with duplicates shows duplicate count**
```typescript
it('should display duplicate count in append mode', async () => {
  // Setup component with append mode selected
  // Mock API to return: { successCount: 3, duplicateCount: 2, overwrite: false }
  // User clicks Copy
  // Assert: Success message contains "2 duplicates were skipped"
})
```

**Test 2: Append mode without duplicates hides duplicate info**
```typescript
it('should not show duplicates when count is zero', async () => {
  // Setup component with append mode selected
  // Mock API to return: { successCount: 5, duplicateCount: 0, overwrite: false }
  // User clicks Copy
  // Assert: Success message does NOT mention duplicates
})
```

**Test 3: Overwrite mode shows replace message**
```typescript
it('should show replace message in overwrite mode', async () => {
  // Setup component with overwrite mode selected
  // Mock API to return: { successCount: 5, duplicateCount: 0, overwrite: true }
  // User clicks Copy
  // Assert: Success message says "replaced all comments"
})
```

**Test 4: Singular/Plural handling**
```typescript
it('should use singular form for 1 comment', async () => {
  // Mock API to return: { successCount: 1, duplicateCount: 0, overwrite: false }
  // Assert: Message says "1 comment" (not "1 comments")
})

it('should use plural form for multiple comments', async () => {
  // Mock API to return: { successCount: 5, duplicateCount: 0, overwrite: false }
  // Assert: Message says "5 comments"
})
```

**Definition of Done**:
- All test cases pass
- Component renders correctly
- No runtime errors
- Coverage adequate

---

### TASK-8: Run Full Test Suite

**Risk Level**: Low
**Effort**: 15 minutes
**Acceptance Criteria**:
- [ ] `npm run test` passes all tests
- [ ] No test failures
- [ ] No console errors or warnings
- [ ] TypeScript compilation clean with `npm run lint`
- [ ] No breaking changes to other features

**Testing Steps**:
1. Run: `npm run test -- --testPathPattern=personalizedCommentService`
2. Run: `npm run test -- --testPathPattern=CopyCommentsModal`
3. Run: `npm run test` (full suite)
4. Run: `npm run lint`
5. Verify no failures or warnings

**Definition of Done**:
- All tests pass
- No compilation errors
- No lint warnings
- Feature ready for integration testing

---

## Risk Assessment

### Overall Risk: LOW

**Why Low Risk?**
1. Single component affected
2. Service method change is straightforward
3. No data model changes on backend
4. Response type is simpler (object vs array)
5. Existing error handling preserved
6. No breaking changes to other features
7. Clear test patterns exist

### Mitigation Strategies

| Risk | Mitigation |
|------|---|
| Type mismatch | Strict TypeScript checking, comprehensive testing |
| Component state errors | Unit tests for state changes |
| Message formatting bugs | Multiple test scenarios covering all cases |
| API integration issues | Service method tests with mocked API |
| Browser compatibility | No new APIs or features introduced |

---

## Task Dependencies

```
TASK-1 (Type Definition)
    ↓
TASK-2 (Service Update) ← depends on TASK-1
    ↓
TASK-3 (Message Helper)
    ↓
TASK-4 (State Management) ← depends on TASK-1, TASK-2
    ↓
TASK-5 (Success Display) ← depends on TASK-3, TASK-4
    ↓
TASK-6 (Service Tests) ← depends on TASK-2
    ↓
TASK-7 (Component Tests) ← depends on TASK-3, TASK-4, TASK-5
    ↓
TASK-8 (Full Test Run) ← depends on all previous tasks
```

**Sequential Execution Recommended**: TASK-1 → TASK-2 → (TASK-3 in parallel) → TASK-4 → TASK-5 → TASK-6 → TASK-7 → TASK-8

---

## Testing Checklist

### Unit Tests
- [ ] Service method returns correct type
- [ ] Service method handles success response
- [ ] Service method handles error response
- [ ] Message helper returns correct format for append with duplicates
- [ ] Message helper returns correct format for append without duplicates
- [ ] Message helper returns correct format for overwrite
- [ ] Message helper handles singular forms
- [ ] Message helper handles plural forms

### Component Tests
- [ ] Component renders in initial state
- [ ] Component handles copy in append mode
- [ ] Component handles copy in overwrite mode
- [ ] Success message displays correctly
- [ ] Error state still works
- [ ] Modal closes on Done
- [ ] Form resets between operations

### Integration Tests
- [ ] Full copy flow works end-to-end
- [ ] API call made with correct parameters
- [ ] Response parsed and displayed correctly
- [ ] User can retry after error
- [ ] Modal can be opened and closed

---

## Deployment Checklist

- [ ] All tests pass locally
- [ ] No TypeScript errors
- [ ] ESLint/Stylelint pass
- [ ] Feature reviewed by team
- [ ] No breaking changes detected
- [ ] Backward compatible with existing code
- [ ] Documentation updated if needed

---

## Rollback Plan

If critical issues discovered after deployment:

1. **Revert to Previous Type** (5 minutes)
   - Change service return type back to `Promise<PersonalizedComment[]>`
   - Component won't compile, change success state type back
   - Deploy revert

2. **Quick Hotfix** (15 minutes)
   - Fix specific issue
   - Run tests again
   - Deploy fix

---

## Success Metrics

- ✅ All tests pass (100% pass rate)
- ✅ No regression in existing features
- ✅ Users see duplicate information when copying
- ✅ No type errors in codebase
- ✅ Feature deployed to production successfully
- ✅ No production issues reported

---

## Timeline

**Estimated Total Duration**: 4-5 hours (1 developer, 1 day)

| Task | Duration | Day |
|------|----------|-----|
| TASK-1 | 15 min | Day 1, morning |
| TASK-2 | 15 min | Day 1, morning |
| TASK-3 | 30 min | Day 1, morning |
| TASK-4 | 20 min | Day 1, midday |
| TASK-5 | 20 min | Day 1, midday |
| TASK-6 | 45 min | Day 1, afternoon |
| TASK-7 | 60 min | Day 1, afternoon |
| TASK-8 | 15 min | Day 1, end of day |
| **Total** | **220 min (3.7 hrs)** | **1 day** |

---

## Sign-Off

**Status**: Ready for Implementation
**Next Step**: Begin TASK-1 with TDD-first approach
**QA Review**: After TASK-8 completes

---

## Reference Materials

- API Specification: `http://localhost:3000/api-docs`
- Schema: `PersonalizedCommentCopyResult`
- Component: `src/components/personalizedComments/CopyCommentsModal.tsx`
- Service: `src/services/api/personalizedCommentService.ts`
- Types: `src/types/index.ts`
