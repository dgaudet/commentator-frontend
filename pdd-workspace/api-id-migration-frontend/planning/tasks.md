# API ID Migration - Implementation Tasks
## Test-Driven Implementation Breakdown

**Feature:** API ID Type Migration (Number → MongoDB ObjectId String)
**Version:** 1.0
**Status:** READY FOR EXECUTION
**Last Updated:** December 4, 2025

---

## Overview

This document provides **atomic, actionable tasks** for implementing the ID migration following TDD (Test-Driven Development) principles: Red → Green → Refactor.

**Key Principles:**
1. Complete one phase before starting the next
2. Run tests after each task
3. TypeScript compiler is your guide
4. No ID conversions (Number(), parseInt())
5. Commit after each phase completion

---

## Phase 1: Type Definitions (30 minutes)

### TASK-1.1: Update Subject Type Definition
**Risk:** TRIVIAL | **Time:** 5 min | **Files:** 1

**File:** `/src/types/Subject.ts`

**Change:**
```typescript
// FROM:
interface Subject {
  id: number
  // ...
}

// TO:
interface Subject {
  id: string  // MongoDB ObjectId: "65a1b2c3d4e5f6g7h8i9j0k1"
  // ...
}
```

**Acceptance:**
- [ ] Subject.id is `string`
- [ ] JSDoc updated
- [ ] Tests pass
- [ ] TypeScript: 0 errors

---

### TASK-1.2: Update Class Type Definition
**Risk:** TRIVIAL | **Time:** 5 min | **Files:** 1

**File:** `/src/types/Class.ts`

**Change:**
```typescript
// FROM:
interface Class {
  id: number
  subjectId: number
  // ...
}

// TO:
interface Class {
  id: string
  subjectId: string
  year: number  // Remains number
  // ...
}
```

Also update request/response types.

---

### TASK-1.3: Update OutcomeComment Type Definition
**Risk:** TRIVIAL | **Time:** 5 min | **Files:** 1

Same pattern: `id: number` → `id: string`, `subjectId: number` → `subjectId: string`

---

### TASK-1.4: Update PersonalizedComment Type Definition
**Risk:** TRIVIAL | **Time:** 5 min | **Files:** 1

Same pattern

---

### TASK-1.5: Update FinalComment Type Definition
**Risk:** TRIVIAL | **Time:** 5 min | **Files:** 1

**Change:** `id: string`, `classId: string` (was `number`)

---

### Phase 1 Checkpoint
```bash
npm run lint          # 0 errors
npx tsc --noEmit     # Will report errors in services/components (expected)
npm test -- --testPathPattern="types"  # Type tests pass
```

**Commit:** "TASK-1: Update type definitions to use string IDs"

---

## Phase 2: API Service Layer (45 minutes)

### TASK-2.1: Update Subject Service
**Risk:** LOW | **Time:** 10 min | **Files:** 2

**File:** `/src/services/api/subjectService.ts`

**Changes:**
- `getById(id: number)` → `getById(id: string)`
- `update(id: number, ...)` → `update(id: string, ...)`
- `delete(id: number)` → `delete(id: string)`
- Update JSDoc

**No code logic changes** - only type signatures

---

### TASK-2.2: Update Class Service
**Risk:** LOW | **Time:** 10 min | **Files:** 2

**File:** `/src/services/api/classService.ts`

**Changes:**
- `list(subjectId?: number)` → `list(subjectId?: string)`
- `getById(id: number)` → `getById(id: string)`
- `update(id: number, ...)` → `update(id: string, ...)`

---

### TASK-2.3 to TASK-2.5: Update Remaining Services
Apply same pattern to:
- OutcomeCommentService
- PersonalizedCommentService
- FinalCommentService

Each: 10 minutes

---

### Phase 2 Checkpoint
```bash
npm run lint                                # 0 errors
npm test -- --testPathPattern="services"   # Services tests pass
npx tsc --noEmit                          # Reports component errors (expected)
```

**Commit:** "TASK-2: Update API service layer to use string IDs"

---

## Phase 3: Mock Data & MSW Handlers (60 minutes)

### TASK-3.1: Create ObjectId Generator Utility
**Risk:** MEDIUM | **Time:** 10 min | **Files:** 1 (NEW)

**Create:** `/src/mocks/utils/objectIdGenerator.ts`

**Implementation:**
```typescript
export function generateMockObjectId(seed?: string): string {
  const timestamp = Math.floor(Date.now() / 1000)
    .toString(16)
    .padStart(8, '0')

  if (seed) {
    const hash = Array.from(seed).reduce((h, c) => {
      return ((h << 5) - h) + c.charCodeAt(0)
    }, 0)
    const random = Math.abs(hash).toString(16).padStart(16, '0').slice(0, 16)
    return (timestamp + random).slice(0, 24)
  }

  const random = Math.random().toString(16).slice(2, 18).padStart(16, '0')
  return (timestamp + random).slice(0, 24)
}

export function isValidObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id)
}
```

**Tests:**
- Generates 24-char hex strings
- Validates ObjectId format
- Produces consistent IDs from seed

---

### TASK-3.2: Update Mock Subjects Data
**Risk:** MEDIUM | **Time:** 5 min | **Files:** 1

**File:** `/src/mocks/data/subjects.ts`

**Change:**
```typescript
// FROM:
export const mockSubjects = [
  { id: 1, name: 'Math', ... },
]

// TO:
export const MOCK_SUBJECT_ID_MATH = '65a1b2c3d4e5f6g7h8i9j0k1'
export const mockSubjects = [
  {
    id: MOCK_SUBJECT_ID_MATH,
    name: 'Math',
    // ...
  },
]
```

**Export IDs** for use in other mock files

---

### TASK-3.3: Update Mock Classes Data
**Risk:** MEDIUM | **Time:** 5 min | **Files:** 1

**File:** `/src/mocks/data/classes.ts`

**Key:** Reference mock subject IDs for foreign keys
```typescript
subjectId: MOCK_SUBJECT_ID_MATH  // String reference
```

---

### TASK-3.4: Update MSW Handler Validation
**Risk:** MEDIUM | **Time:** 15 min | **Files:** 1

**File:** `/src/mocks/handlers.ts`

**Change Pattern:**

FROM:
```typescript
const numId = Number(params.id)
if (isNaN(numId) || !Number.isInteger(numId)) { /* error */ }
```

TO:
```typescript
const id = params.id
if (typeof id !== 'string' || !id.trim()) {
  return HttpResponse.json({ error: 'ID must be string' }, { status: 400 })
}
```

**Apply to all handlers** - remove all Number() conversions

---

### TASK-3.5: Update Mock Data in Handlers
**Risk:** MEDIUM | **Time:** 10 min | **Files:** 1

**File:** `/src/mocks/handlers.ts`

**Change:** Update inline mock data to use string IDs and generateMockObjectId()

---

### Phase 3 Checkpoint
```bash
npm run lint                                # 0 errors
npm test -- --testPathPattern="handlers"   # Handler tests pass
```

**Commit:** "TASK-3: Update mock data and MSW handlers to use string IDs"

---

## Phase 4: React Components & Hooks (75 minutes)

### TASK-4.1 to TASK-4.5: Update Hooks (25 min)

**Hooks to Update:**
- `useSubjects()` - Returns Subject[] with string IDs
- `useClasses()` - Returns Class[] with string id/subjectId
- `useOutcomeComments()` - Returns OutcomeComment[] with string IDs
- `usePersonalizedComments()` - Returns PersonalizedComment[] with string IDs
- `useFinalComments()` - Returns FinalComment[] with string IDs

**Pattern:** Type change is automatic - TypeScript automatically infers string ID types from updated type definitions.

**Verification:**
- [ ] Hook returns correct type
- [ ] No type conversions
- [ ] Tests pass

---

### TASK-5.1 to TASK-5.5: Update Components (50 min)

**Components to Update:**
1. SubjectList & SubjectListItem - `onDelete: (id: string)`
2. ClassManagementModal - `subjectId: string`
3. OutcomeCommentsModal - `subjectId: string`
4. PersonalizedCommentsModal - `subjectId: string`
5. FinalCommentsModal - `classId: string`

**Pattern:**
- Update props interface: ID parameters become strings
- Component logic unchanged
- String comparison for filtering (already works)

---

### Phase 4 Checkpoint
```bash
npm run lint                                # 0 errors
npm test -- --testPathPattern="components" # Component tests pass
npx tsc --noEmit                          # 0 errors
```

**Commit:** "TASK-4: Update React hooks and components for string IDs"

---

## Phase 5: Test Suite Updates (90 minutes)

### TASK-6.1: Update Type Definition Tests
**Risk:** MEDIUM | **Time:** 15 min | **Files:** 5

**Files:** Type test files for Subject, Class, OutcomeComment, PersonalizedComment, FinalComment

**Change:**
```typescript
// FROM:
const subject: Subject = { id: 1, ... }

// TO:
const subject: Subject = { id: '65a1b2c3d4e5f...k1', ... }
```

**Update mock data** in all type tests to use string IDs

---

### TASK-6.2: Update Service Layer Tests
**Risk:** MEDIUM | **Time:** 20 min | **Files:** 5

**Files:** Service test files (5 services)

**Changes:**
- Mock API response data uses string IDs
- Test parameters use string IDs
- Assertions verify string types

---

### TASK-6.3: Update Component Tests
**Risk:** MEDIUM | **Time:** 45 min | **Files:** 10+

**Systematic Approach:**
1. Find all test files with mock data
2. Replace numeric IDs with string IDs
3. Update spy/mock expectations
4. Run tests: `npm test`
5. Fix any failures

---

### TASK-6.4: Run Full Test Suite
**Risk:** MEDIUM | **Time:** 10 min

```bash
npm test
# Expected: 313/313 passing

# If failures:
# - Read error carefully
# - Update mock data to use string IDs
# - Rerun: npm test
```

---

### Phase 5 Checkpoint
```bash
npm test          # 313/313 passing ✅
npm run lint      # 0 errors ✅
npx tsc --noEmit # 0 errors ✅
```

**Commit:** "TASK-5: Update all tests for string IDs"

---

## Phase 6: Quality Verification (15 minutes)

### TASK-7.1: Verify TypeScript Compilation
**Risk:** TRIVIAL | **Time:** 5 min

```bash
npx tsc --noEmit
```

**Expected:** No output (0 errors)

**If errors:** Compiler output points to exact file/line - update and rerun

---

### TASK-7.2: Verify ESLint Passes
**Risk:** TRIVIAL | **Time:** 5 min

```bash
npm run lint
```

**Expected:** No errors

---

### TASK-7.3: Manual Smoke Testing
**Risk:** TRIVIAL | **Time:** 5 min

```bash
npm run dev
```

1. Open http://localhost:3000
2. Log in
3. Test basic flows:
   - View subjects
   - Create subject
   - View classes
   - Create class
   - Delete operations
4. Verify no console errors

---

### Phase 6 Checkpoint

✅ All quality gates passed
✅ Ready for code review

**Commit:** "TASK-6: Verify implementation quality gates"

---

## Summary

### Completion Checklist
- [ ] Phase 1: Type definitions updated (5 types)
- [ ] Phase 2: API services updated (5 services)
- [ ] Phase 3: Mock data and handlers updated (4 files)
- [ ] Phase 4: Hooks and components updated (10 files)
- [ ] Phase 5: All tests updated (313 tests)
- [ ] Phase 6: Quality verification passed

### Quality Gates
- [ ] TypeScript: 0 errors
- [ ] ESLint: 0 errors
- [ ] Tests: 313/313 passing
- [ ] Dev server: Starts without errors
- [ ] Manual testing: All CRUD ops work

### Final Verification
```bash
npm run lint          # 0 errors
npx tsc --noEmit     # 0 errors
npm test              # 313/313 passing
npm run dev           # Starts successfully
```

---

## Timeline

| Phase | Duration | Cumulative |
|-------|----------|-----------|
| 1. Types | 30 min | 30 min |
| 2. Services | 45 min | 1h 15m |
| 3. Mocks | 60 min | 2h 15m |
| 4. Components | 75 min | 3h 30m |
| 5. Tests | 90 min | 5h |
| 6. Verification | 15 min | 5h 15m |

**Total: 5-6 hours**

---

## Next Steps

1. ✅ Review PRD and design documents
2. ✅ Get team approvals
3. 👉 Create feature branch: `feat/api-id-migration-frontend`
4. 👉 Begin Phase 1: Type Definitions
5. 👉 Follow TDD for each task
6. 👉 Commit after each phase
7. 👉 Create pull request
8. 👉 Code review and merge

---

**Task Document Status:** ✅ READY FOR EXECUTION

For detailed implementation patterns and examples, see the original tasks document in `.pdd/api-id-migration-frontend/tasks.md`.
