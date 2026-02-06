# Feature: Copy Personalized Comments with Duplicate Detection

## Overview

This PDD (Persona-Driven Development) project updates the frontend to handle the new response format from the `/personalized-comment/copy` API endpoint. The backend API now returns operation summary information (success count, duplicate count, mode used) instead of an array of copied comments.

**Status**: ✅ Planning Complete - Ready for Implementation
**Complexity**: L1 (Micro) - Low Risk
**Estimated Effort**: 1-2 weeks (1 developer)

## Quick Links

- 📋 [Intent & Specification](./planning/intent.md)
- 📋 [User Stories & Requirements](./planning/requirements.md)
- 🎨 [Technical Design](./planning/design.md)
- 📅 [Implementation Tasks](./planning/tasks.md)
- 📊 [Metadata & Assessment](./metadata.json)

## What Changed?

### API Response Change

**Before** (Previous Response):
```typescript
// Returns array of PersonalizedComment objects
Promise<PersonalizedComment[]>
```

**After** (New Response):
```typescript
// Returns operation summary
Promise<{
  successCount: number;       // Comments copied
  duplicateCount: number;     // Duplicates skipped (append mode)
  overwrite: boolean;         // Mode used
}>
```

### Example Responses

**Append Mode with Duplicates**:
```json
{
  "successCount": 3,
  "duplicateCount": 2,
  "overwrite": false
}
```
**User Sees**: "Successfully copied 3 comments. 2 duplicates were skipped (already existed)."

**Overwrite Mode**:
```json
{
  "successCount": 5,
  "duplicateCount": 0,
  "overwrite": true
}
```
**User Sees**: "Successfully replaced all comments. Copied 5 comments."

## What Gets Updated?

### Files Changed

| File | Change | Impact |
|------|--------|--------|
| `src/types/index.ts` | Add new interface | Type safe response handling |
| `src/services/api/personalizedCommentService.ts` | Update return type | Service reflects new API |
| `src/components/personalizedComments/CopyCommentsModal.tsx` | Update success message | Users see duplicate info |
| Test files | Add new tests | Verify functionality |

### Total Changes
- ~5 lines added to types
- ~4 lines changed in service
- ~15 lines updated in component
- ~200 lines of new test code

## Implementation Roadmap

### Phase 1: Setup (15 min)
- [ ] TASK-1: Define TypeScript interface
- [ ] TASK-2: Update service method

### Phase 2: Logic (50 min)
- [ ] TASK-3: Create message formatter
- [ ] TASK-4: Update component state
- [ ] TASK-5: Update success display

### Phase 3: Testing (120 min)
- [ ] TASK-6: Service tests
- [ ] TASK-7: Component tests
- [ ] TASK-8: Full test suite

**Total Time**: ~4-5 hours (can be done in 1 day)

## Key Features

### ✅ Duplicate Detection in Append Mode
- Backend automatically detects duplicates (case-sensitive text match)
- Users see how many duplicates were skipped
- Prevents accidental duplicate comments

### ✅ Clear Mode Differentiation
- Append mode: Shows duplicate information
- Overwrite mode: Shows "replaced all" message
- Users understand the operation outcome

### ✅ User-Friendly Messages
- Singular/plural handled correctly
- Target subject name included
- Clear, concise success messages

### ✅ No Breaking Changes
- Existing error handling preserved
- Modal functionality unchanged
- User workflow unaffected

## Success Criteria

- ✅ TypeScript types updated
- ✅ Service method handles new response type
- ✅ Component displays duplicate information
- ✅ All tests pass (80%+ coverage)
- ✅ No regression in existing features
- ✅ Feature deployed to production

## Testing Strategy

### Service Tests (45 min)
- Verify response type structure
- Test all response scenarios
- Validate error handling

### Component Tests (60 min)
- Test message formatting
- Test singular/plural handling
- Test append vs overwrite modes
- Test zero duplicates edge case

### Integration Tests
- Full copy flow end-to-end
- User interaction scenarios
- Modal state management

## Risk Assessment

**Overall Risk**: 🟢 LOW

**Why Low Risk?**
1. ✅ Single component affected
2. ✅ Service change is straightforward
3. ✅ Response type is simpler (object vs array)
4. ✅ No backend changes needed
5. ✅ Existing error handling preserved
6. ✅ Clear test patterns exist

## Rollback Plan

If critical issues are discovered:
1. Revert type changes (5 min)
2. Restore previous service signature (5 min)
3. Redeploy (~10 min)
4. No data loss or consistency issues

## Dependencies

- ✅ Backend API already updated
- ✅ No external libraries needed
- ✅ No database changes
- ✅ No environment variable changes

## Team Notes

### For Frontend Engineer
- Start with TASK-1 (type definition)
- Follow sequential order for tasks
- Use TDD-first approach
- Write tests as you go

### For Product Owner
- Review requirements before implementation
- Validate acceptance criteria met after TASK-8
- No stakeholder communication needed

### For QA Engineer
- Validate test coverage after TASK-7
- Test duplicate detection scenarios
- Verify message formatting
- Check browser compatibility

## Next Steps

1. **Review Planning Artifacts**
   - Read intent.md for feature overview
   - Read requirements.md for user stories
   - Read design.md for technical details

2. **Approve Feature Scope**
   - Confirm API change understanding
   - Approve message formats
   - Confirm test coverage plan

3. **Begin Implementation**
   - Assign engineer to tasks
   - Start with TASK-1
   - Follow sequential order

4. **Validation**
   - Run tests after TASK-8
   - Code review implementation
   - Deploy to production

## Questions?

Refer to the specific phase document:
- **Why build this?** → intent.md
- **What should it do?** → requirements.md
- **How does it work?** → design.md
- **How to build it?** → tasks.md

---

**Created**: 2026-02-06
**Branch**: feat/copy-duplicate-checks
**Status**: ✅ Ready for Implementation
