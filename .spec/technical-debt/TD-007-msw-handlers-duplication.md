# TD-007: Mock Service Worker (MSW) Handlers Duplication

**Priority**: LOW
**Effort**: 2 story points
**Status**: Not Started
**Related**: Test Infrastructure, Code Maintainability
**Dependencies**: Should complete after TD-003 (Class infrastructure removal)

---

## Problem Statement

The `src/mocks/handlers.ts` file contains duplicate handler logic for Class and Subject endpoints. Both sets of handlers implement nearly identical CRUD operations with the only difference being entity structure (Class has `year` field, Subject does not).

**Current Duplication**:

| Handler Type | Class | Subject | Lines of Code |
|--------------|-------|---------|---------------|
| GET all | ✅ | ✅ | ~20 lines each |
| POST create | ✅ | ✅ | ~30 lines each |
| GET by ID | ✅ | ✅ | ~15 lines each |
| PUT update | ✅ | ✅ | ~35 lines each |
| DELETE | ✅ | ✅ | ~20 lines each |
| **Total** | ~120 lines | ~120 lines | **~240 lines** |

**Additional Duplication**:
- Validation logic duplicated (Class validates name+year, Subject validates name only)
- Error response formatting duplicated
- Storage management duplicated
- Mock data structures duplicated

**Impact**:
- **Maintenance Burden**: Bug fixes must be applied to both Class and Subject handlers
- **Drift Risk**: Class and Subject handlers may diverge over time
- **Code Readability**: ~240 lines of similar code makes file harder to understand
- **Testing Overhead**: More code to maintain and test

**Why LOW Priority**:
This is test infrastructure technical debt that doesn't impact production code or users. The duplication is intentional during the migration period. After TD-003 (Class infrastructure removal) completes, this becomes trivial to fix by simply deleting Class handlers.

---

## User Stories (EARS Format)

### US-TD-007-001: Remove Class MSW Handlers (LOW - 1 pt)

**As a** developer
**I want** to remove Class MSW handlers after Class infrastructure deprecation
**So that** we reduce test code duplication and maintenance overhead

**Acceptance Criteria**:

WHEN Class infrastructure is removed from frontend (TD-003 complete)
THE SYSTEM SHALL remove all Class-related MSW handlers from `handlers.ts`

WHEN Class handlers are removed
THE SYSTEM SHALL remove Class storage array and validation functions

WHEN mock tests are executed
THE SYSTEM SHALL only use Subject handlers

WHEN `handlers.ts` is reviewed
THE SYSTEM SHALL have ~120 lines of handler code (Subject only) instead of ~240

### US-TD-007-002: Refactor Mock Data Management (LOW - 1 pt)

**As a** developer
**I want** to centralize mock data management
**So that** tests can share mock data consistently

**Acceptance Criteria**:

WHEN mock data is needed for tests
THE SYSTEM SHALL import from `src/mocks/data/` instead of inline definitions

WHEN `handlers.ts` is reviewed
THE SYSTEM SHALL have no inline mock data arrays

WHEN mock data is updated
THE SYSTEM SHALL only need to update files in `src/mocks/data/`

WHEN MSW is initialized
THE SYSTEM SHALL reset mock data to default state consistently

---

## Technical Design

### Current State Analysis

**File**: `src/mocks/handlers.ts`

```typescript
// Current structure (simplified)

// Class storage and handlers (~120 lines)
let classes: Class[] = [...mockClasses]
let nextClassId = 4

function validateClassRequest(body: Record<string, unknown>): ValidationResult {
  // Validate name and year
}

const classHandlers = [
  http.get('/class', ...),
  http.post('/class', ...),
  http.get('/class/:id', ...),
  http.put('/class/:id', ...),
  http.delete('/class/:id', ...),
]

// Subject storage and handlers (~120 lines)
let subjects: Subject[] = [...mockSubjects]
let nextSubjectId = 4

function validateSubjectRequest(body: Record<string, unknown>): ValidationResult {
  // Validate name only (similar to Class but without year)
}

const subjectHandlers = [
  http.get('/subject', ...),
  http.post('/subject', ...),
  http.get('/subject/:id', ...),
  http.put('/subject/:id', ...),
  http.delete('/subject/:id', ...),
]

// OutcomeComment handlers (~150 lines)
const outcomeCommentHandlers = [...]

// Export all handlers
export const handlers = [
  ...classHandlers,
  ...subjectHandlers,
  ...outcomeCommentHandlers,
]
```

### Solution: Remove Class Handlers (After TD-003)

**Prerequisite**: TD-003 (Class infrastructure removal) must be complete

**Target State**:

```typescript
// After Class removal (~150 lines total)

// Subject storage and handlers (~120 lines)
let subjects: Subject[] = [...mockSubjects]
let nextSubjectId = 4

function validateSubjectRequest(body: Record<string, unknown>): ValidationResult {
  // Validate name only
}

const subjectHandlers = [
  http.get(`${BASE_URL}/subject`, ...),
  http.post(`${BASE_URL}/subject`, ...),
  http.get(`${BASE_URL}/subject/:id`, ...),
  http.put(`${BASE_URL}/subject/:id`, ...),
  http.delete(`${BASE_URL}/subject/:id`, ...),
]

// OutcomeComment handlers (~150 lines)
const outcomeCommentHandlers = [...]

// Export handlers
export const handlers = [
  ...subjectHandlers,
  ...outcomeCommentHandlers,
]
```

**Lines of Code Reduction**: ~240 lines → ~120 lines (50% reduction)

### Optional Improvement: Centralize Mock Data

**Current Issue**: Mock data duplicated between `src/mocks/data/` and `handlers.ts`

**Improvement**: Import all mock data from `src/mocks/data/`

```typescript
// handlers.ts
import { mockSubjects } from './data/subjects'
import { mockOutcomeComments } from './data/outcomeComments'

// Initialize mutable copies for testing
let subjects: Subject[] = []
let outcomeComments: OutcomeComment[] = []
let nextSubjectId = 1
let nextOutcomeCommentId = 1

/**
 * Reset mock data to initial state.
 * Called before each test suite to ensure clean state.
 */
export function resetMockData(): void {
  subjects = [...mockSubjects]
  outcomeComments = [...mockOutcomeComments]
  nextSubjectId = Math.max(...subjects.map(s => s.id), 0) + 1
  nextOutcomeCommentId = Math.max(...outcomeComments.map(c => c.id), 0) + 1
}

// Initialize on module load
resetMockData()
```

**Benefits**:
- Single source of truth for mock data
- Tests can import same mock data
- Easier to update test data
- Consistent data across tests

---

## Implementation Tasks

### Task 1: Wait for TD-003 Completion (Prerequisite)
**Risk**: Trivial
**Effort**: 0 (blocked waiting)

1. Monitor TD-003 (Class infrastructure removal) progress
2. Verify Class components removed from frontend
3. Verify Class tests removed/archived
4. Verify no Class references remain in active code
5. Proceed when TD-003 marked complete

**Exit Criteria**: TD-003 status changed to "Complete"

### Task 2: Remove Class MSW Handlers (REFACTOR)
**Risk**: Low
**Effort**: 30 minutes

1. **IMPORTANT**: Create git tag: `git tag pre-class-handler-removal`
2. Open `src/mocks/handlers.ts`
3. Remove Class storage array: `let classes: Class[] = ...`
4. Remove `nextClassId` counter
5. Remove `validateClassRequest()` function
6. Remove all Class handlers (GET, POST, PUT, DELETE)
7. Remove Class handlers from `handlers` export array
8. Remove Class import from mock data
9. Run TypeScript compiler to verify no errors

**Lines to Remove**: ~120 lines

### Task 3: Update resetMockData Function (REFACTOR)
**Risk**: Trivial
**Effort**: 10 minutes

1. Remove Class data initialization from `resetMockData()`
2. Keep Subject and OutcomeComment initialization
3. Verify function still works correctly
4. Run tests to confirm

**Before**:
```typescript
export function resetMockData(): void {
  classes = [...mockClasses]
  subjects = [...mockSubjects]
  outcomeComments = [...mockOutcomeComments]
  // ...
}
```

**After**:
```typescript
export function resetMockData(): void {
  subjects = [...mockSubjects]
  outcomeComments = [...mockOutcomeComments]
  // ...
}
```

### Task 4: Run All Tests (GREEN)
**Risk**: Low
**Effort**: 15 minutes

1. Run all unit tests: `npm run test`
2. Run E2E tests: `npm run test:e2e`
3. Verify all tests pass
4. Check for any MSW-related errors
5. Fix any issues if tests fail

**Expected Results**:
- 143 unit/integration tests pass (Subject only)
- 21 E2E scenarios pass (Subject only)
- Zero MSW errors
- All API mocking works correctly

### Task 5: Verify No Class Handler References (REFACTOR)
**Risk**: Trivial
**Effort**: 10 minutes

1. Search codebase for Class handler references
2. Search for `mockClasses` imports
3. Search for `validateClassRequest` calls
4. Verify no remaining references
5. Document findings

**Search Commands**:
```bash
# Search for Class handler references
grep -r "mockClasses" src/ --exclude-dir=node_modules --exclude-dir=archived

# Search for validateClassRequest
grep -r "validateClassRequest" src/ --exclude-dir=node_modules

# Search for /class endpoint in tests
grep -r "'/class" src/ --exclude-dir=node_modules
```

**Expected Results**: Zero matches

### Task 6: Update MSW Documentation (REFACTOR)
**Risk**: Trivial
**Effort**: 15 minutes

1. Update comments in `handlers.ts` to remove Class references
2. Update `README.md` MSW section if it mentions Class
3. Document mock data structure
4. Add usage examples for tests
5. Commit changes

### Task 7: Commit Changes (REFACTOR)
**Risk**: Trivial
**Effort**: 5 minutes

1. Review all changes
2. Ensure tests pass
3. Create commit: "chore: remove Class MSW handlers after TD-003"
4. Push to branch
5. Create PR if needed

---

## Testing Strategy

### Pre-Removal Testing
- [ ] Verify TD-003 (Class infrastructure removal) complete
- [ ] Verify no Class components in active code
- [ ] Verify no Class imports in active code
- [ ] Run all tests to establish baseline

### Post-Removal Testing
- [ ] All unit tests pass (143 tests)
- [ ] All E2E tests pass (21 scenarios)
- [ ] No MSW errors in test output
- [ ] No Class handler references remain
- [ ] Mock data resets correctly between tests
- [ ] Subject CRUD operations work in tests

### Verification
```bash
# Run tests
npm run test

# Run E2E tests
npm run test:e2e

# Check for Class references
grep -r "Class" src/mocks/ --exclude-dir=node_modules

# Verify handler count reduced
wc -l src/mocks/handlers.ts
# Expected: ~270 lines → ~150 lines
```

---

## Code Quality Improvements

### Before (240 lines of duplication):
```typescript
// Class handlers (~120 lines)
http.get('/class', async () => {
  return HttpResponse.json(classes, { status: 200 })
}),

http.post('/class', async ({ request }) => {
  const body = await request.json() as ClassRequest
  const validation = validateClassRequest(body)
  if (!validation.valid) {
    return HttpResponse.json(validation.error, { status: 400 })
  }
  // ... create logic
}),

// Subject handlers (~120 lines) - NEARLY IDENTICAL
http.get('/subject', async () => {
  return HttpResponse.json(subjects, { status: 200 })
}),

http.post('/subject', async ({ request }) => {
  const body = await request.json() as SubjectRequest
  const validation = validateSubjectRequest(body)
  if (!validation.valid) {
    return HttpResponse.json(validation.error, { status: 400 })
  }
  // ... create logic (almost identical)
}),
```

### After (120 lines, no duplication):
```typescript
// Subject handlers only (~120 lines)
http.get(`${BASE_URL}/subject`, async () => {
  return HttpResponse.json(subjects, { status: 200 })
}),

http.post(`${BASE_URL}/subject`, async ({ request }) => {
  const body = await request.json() as SubjectRequest
  const validation = validateSubjectRequest(body)
  if (!validation.valid) {
    return HttpResponse.json(validation.error, { status: 400 })
  }
  // ... create logic
}),

// No Class handlers needed
```

**Improvements**:
- 50% reduction in handler code
- Single validation function instead of two
- Easier to understand and maintain
- Faster test execution (less MSW processing)
- No risk of Class/Subject handler drift

---

## Benefits

### Code Quality
- **50% Reduction**: ~240 lines → ~120 lines in handlers.ts
- **No Duplication**: Single set of handlers instead of two
- **Easier Maintenance**: Bug fixes only need to be applied once
- **Better Readability**: Less code to understand

### Test Performance
- **Faster Initialization**: Fewer handlers for MSW to register
- **Faster Tests**: Less handler matching logic
- **Reduced Memory**: Less mock data in memory

### Developer Experience
- **Simpler Mental Model**: Only need to understand Subject handlers
- **Easier Debugging**: Fewer places to look when tests fail
- **Clearer Intent**: Code matches production architecture (Subject only)

---

## Risks and Mitigation

### Risk 1: Accidentally Breaking Tests
**Scenario**: Removing Class handlers breaks tests that still reference them

**Mitigation**:
- Ensure TD-003 complete before starting
- Run full test suite after removal
- Create git tag for quick rollback
- Manual review of test files

**Rollback Plan**:
```bash
git reset --hard pre-class-handler-removal
```

### Risk 2: Missed Class Handler References
**Scenario**: Some test files still import or use Class handlers

**Mitigation**:
- Use grep to search for all Class references
- Review test files manually
- TypeScript compiler will catch most issues
- Run tests to catch runtime issues

---

## Dependencies

- **Requires**: TD-003 (Frontend Class infrastructure removal) complete
- **Blocks**: None (test infrastructure cleanup)
- **Relates to**: TD-006 (Backend Class endpoints deprecation)

---

## Documentation Updates

### src/mocks/handlers.ts

Add comment at top of file:

```typescript
/**
 * Mock Service Worker (MSW) Handlers
 *
 * Provides mock API responses for testing without a real backend.
 *
 * Supported Entities:
 * - Subject: CRUD operations for subjects (no year field)
 * - OutcomeComment: CRUD operations for outcome comments
 *
 * Mock Data Sources:
 * - src/mocks/data/subjects.ts
 * - src/mocks/data/outcomeComments.ts
 *
 * Usage in Tests:
 * ```typescript
 * import { server } from './mocks/server'
 * import { resetMockData } from './mocks/handlers'
 *
 * beforeEach(() => {
 *   resetMockData() // Reset to default state
 * })
 * ```
 *
 * Note: Class handlers were removed after Class infrastructure deprecation (TD-003).
 */
```

### README.md

Update Mock Service Worker section:

```markdown
## Testing Infrastructure

### Mock Service Worker (MSW)

The application uses MSW to mock API responses during testing.

**Supported Entities**:
- Subject: Full CRUD operations
- OutcomeComment: Full CRUD operations

**Mock Data**:
- `src/mocks/data/subjects.ts` - Subject test data
- `src/mocks/data/outcomeComments.ts` - OutcomeComment test data

**Handlers**:
- `src/mocks/handlers.ts` - MSW request handlers (~150 lines)

**Note**: Class handlers were removed after Class infrastructure deprecation. See TD-003 for details.
```

---

## Acceptance Criteria

This technical debt item is complete when:

1. TD-003 (Class infrastructure removal) is complete
2. All Class MSW handlers removed from `handlers.ts`
3. `validateClassRequest()` function removed
4. Class storage array removed
5. Class mock data imports removed
6. `resetMockData()` no longer initializes Class data
7. All tests pass (143 unit/integration, 21 E2E)
8. Zero Class handler references found in codebase
9. TypeScript compilation successful
10. `handlers.ts` reduced from ~240 lines to ~120 lines (50% reduction)
11. Documentation updated
12. Changes committed and merged

---

## Notes

**Why Wait for TD-003?**

This task is intentionally marked as LOW priority because it's blocked on TD-003. The duplication exists to support the Class-to-Subject migration period. Once Class infrastructure is removed, this becomes a trivial cleanup task (30 minutes of deletion).

**Attempting this before TD-003 would**:
- Break Class tests (if not yet removed)
- Break Class components (if still in use)
- Require premature removal of test infrastructure
- Add no value to the migration

**After TD-003**:
- Simple deletion of unused code
- No risk to functionality
- Clear improvement in code quality
- Quick win for team morale
