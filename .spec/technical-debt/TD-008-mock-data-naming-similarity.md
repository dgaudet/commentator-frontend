# TD-008: Test Data Mock Subjects Have Similar Names to Classes

**Priority**: VERY LOW
**Effort**: 0.5 story points
**Status**: Not Started
**Related**: Test Data Quality, Developer Experience
**Dependencies**: None (cosmetic improvement)

---

## Problem Statement

Mock test data for Class and Subject use similar or identical names (e.g., "Mathematics 101", "English 201"), making it harder for developers to distinguish which entity type is being tested when reading test code. This is a minor cosmetic issue that doesn't affect functionality but could improve test readability.

**Current Mock Data**:

**Class Mock Data** (`src/mocks/data/classes.ts`):
```typescript
const mockClasses: Class[] = [
  { id: 1, name: 'Mathematics 101', year: 2024, ... },
  { id: 2, name: 'English 201', year: 2024, ... },
  { id: 3, name: 'Science 301', year: 2025, ... },
]
```

**Subject Mock Data** (`src/mocks/data/subjects.ts`):
```typescript
const mockSubjects: Subject[] = [
  { id: 1, name: 'Mathematics 101', ... },
  { id: 2, name: 'English 201', ... },
  { id: 3, name: 'Science 301', ... },
]
```

**Issues**:
1. **Name Collision**: Both Class and Subject use "Mathematics 101"
2. **Reduced Readability**: Hard to know if test is using Class or Subject data
3. **Copy-Paste Confusion**: Developers might accidentally use wrong mock data
4. **No Functional Impact**: Tests still work correctly despite similar names

**Why VERY LOW Priority**:
- No functional bugs or test failures
- No user impact (test data only)
- No blocking issues for development
- Cosmetic improvement only
- Will be resolved automatically when Class is deprecated (TD-003)

---

## User Stories (EARS Format)

### US-TD-008-001: Rename Subject Mock Data for Clarity (VERY LOW - 0.5 pts)

**As a** developer
**I want** Subject mock data to have distinct names from Class mock data
**So that** I can easily identify which entity type tests are using

**Acceptance Criteria**:

WHEN Subject mock data is reviewed
THE SYSTEM SHALL use names that clearly indicate Subject entity

WHEN test code is reviewed
THE SYSTEM SHALL make it obvious whether test uses Class or Subject

WHEN mock data is imported in tests
THE SYSTEM SHALL have no name collisions between Class and Subject

WHEN tests are executed
THE SYSTEM SHALL still pass with renamed mock data

---

## Technical Design

### Option 1: Add "Subject:" Prefix (Recommended)

**Pros**:
- Clear distinction from Class entities
- Minimal code changes
- Grep-able for debugging
- Easy to understand

**Cons**:
- Slightly less realistic test data
- Longer names

**Implementation**:

```typescript
// src/mocks/data/subjects.ts
export const mockSubjects: Subject[] = [
  {
    id: 1,
    name: 'Subject: Mathematics Fundamentals',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 2,
    name: 'Subject: English Literature',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 3,
    name: 'Subject: Physical Science',
    createdAt: '2024-02-20T14:15:00Z',
    updatedAt: '2024-02-20T14:15:00Z',
  },
]
```

**Test Impact**:
```typescript
// Tests become more explicit
expect(screen.getByText('Subject: Mathematics Fundamentals')).toBeInTheDocument()

// vs. previous (ambiguous)
expect(screen.getByText('Mathematics 101')).toBeInTheDocument()
```

### Option 2: Use Different Subject Names (Alternative)

**Pros**:
- More realistic test data
- No prefix required
- Clearer separation

**Cons**:
- Larger diff in test files
- More test updates required

**Implementation**:

```typescript
// src/mocks/data/subjects.ts
export const mockSubjects: Subject[] = [
  {
    id: 1,
    name: 'Algebra and Trigonometry',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 2,
    name: 'World Literature',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 3,
    name: 'Biology Essentials',
    createdAt: '2024-02-20T14:15:00Z',
    updatedAt: '2024-02-20T14:15:00Z',
  },
]
```

### Option 3: Do Nothing (Wait for TD-003)

**Pros**:
- Zero effort
- No test updates needed
- Class will be removed soon anyway

**Cons**:
- Temporary confusion continues

**Rationale**:
After TD-003 (Class infrastructure removal), only Subject mock data will remain. The similarity issue disappears automatically. This is the most pragmatic approach given the VERY LOW priority.

---

## Recommendation

**Recommended Approach**: **Option 3 - Do Nothing**

**Rationale**:
1. This is cosmetic only - no functional impact
2. TD-003 will remove Class infrastructure soon
3. After TD-003, only Subject mock data remains (no confusion)
4. Effort is better spent on higher priority technical debt
5. Team can re-evaluate after TD-003 if renaming still desired

**If renaming is desired before TD-003**:
- Use **Option 1 (Add "Subject:" prefix)** for minimal test changes
- Only update mock data file, not all test assertions
- Most tests use data-testid, not text content, so impact is minimal

---

## Implementation Tasks (If Pursued)

### Task 1: Update Subject Mock Data (REFACTOR)
**Risk**: Trivial
**Effort**: 10 minutes

1. Open `src/mocks/data/subjects.ts`
2. Rename mock subject names (choose Option 1 or 2)
3. Save file
4. Run TypeScript compiler (no errors expected)

### Task 2: Update Test Assertions (REFACTOR)
**Risk**: Low
**Effort**: 20 minutes

1. Find all tests that reference old subject names
2. Update assertions to use new names
3. Most tests use `data-testid`, so impact minimal
4. Only text-based assertions need updates

**Search for impacted tests**:
```bash
grep -r "Mathematics 101" src/__tests__/ e2e/
grep -r "English 201" src/__tests__/ e2e/
grep -r "Science 301" src/__tests__/ e2e/
```

### Task 3: Run All Tests (GREEN)
**Risk**: Low
**Effort**: 5 minutes

1. Run unit tests: `npm run test`
2. Run E2E tests: `npm run test:e2e`
3. Verify all tests pass
4. Fix any failing assertions

### Task 4: Commit Changes (REFACTOR)
**Risk**: Trivial
**Effort**: 5 minutes

1. Review changes
2. Commit: "chore: rename Subject mock data for clarity"
3. Push to branch

---

## Testing Strategy

### Pre-Change Testing
- [ ] Identify all tests that reference subject names
- [ ] Document test files that will need updates
- [ ] Run tests to establish baseline

### Post-Change Testing
- [ ] All unit tests pass (143 tests)
- [ ] All E2E tests pass (21 scenarios)
- [ ] No TypeScript errors
- [ ] Manual review of test output

### Verification
```bash
# Search for old names (should return zero results)
grep -r "Mathematics 101" src/mocks/data/subjects.ts

# Run tests
npm run test
npm run test:e2e
```

---

## Code Changes (Option 1 Example)

### src/mocks/data/subjects.ts

```typescript
/**
 * Mock Subject Data
 * Test data for MSW handlers
 * Reference: US-REFACTOR-012
 *
 * Note: Subject names use "Subject:" prefix to distinguish from Class entities during migration.
 * This prefix can be removed after Class infrastructure deprecation (TD-003).
 */
import { Subject } from '../../types/Subject'

export const mockSubjects: Subject[] = [
  {
    id: 1,
    name: 'Subject: Mathematics Fundamentals',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 2,
    name: 'Subject: English Literature',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 3,
    name: 'Subject: Physical Science',
    createdAt: '2024-02-20T14:15:00Z',
    updatedAt: '2024-02-20T14:15:00Z',
  },
]
```

### Test Updates (Minimal Impact)

Most tests use `data-testid`, so updates minimal:

```typescript
// src/__tests__/App.test.tsx
// BEFORE
expect(screen.getByText('Mathematics 101')).toBeInTheDocument()

// AFTER
expect(screen.getByText('Subject: Mathematics Fundamentals')).toBeInTheDocument()

// BETTER: Use data-testid (no change needed)
expect(screen.getByTestId('subject-item-1')).toBeInTheDocument()
```

**Most tests already use data-testid**, so impact is minimal.

---

## Benefits (If Implemented)

### Code Readability
- **Clear Intent**: Immediately obvious which entity type tests use
- **Less Confusion**: No ambiguity in test code
- **Better Debugging**: Easier to trace test failures

### Developer Experience
- **Faster Onboarding**: New developers understand tests faster
- **Less Mistakes**: Reduces risk of using wrong mock data
- **Clearer Diffs**: Git diffs show entity type clearly

---

## Risks and Mitigation

### Risk 1: Breaking Tests
**Scenario**: Renaming breaks text-based assertions

**Mitigation**:
- Most tests use data-testid (no impact)
- Search and update text assertions
- Run full test suite
- Quick to rollback if issues

### Risk 2: Not Worth the Effort
**Scenario**: Effort exceeds benefit given VERY LOW priority

**Mitigation**:
- This is why Option 3 (Do Nothing) is recommended
- Wait for TD-003 to naturally resolve the issue
- Re-evaluate after Class removal if still desired

---

## Alternative: Update Only Comments

**Minimal effort alternative**: Just update comments without renaming

```typescript
/**
 * Mock Subject Data
 * Test data for MSW handlers
 *
 * NOTE: These names are similar to Class mock data names during migration.
 * When reading tests, check the import statement to determine entity type:
 * - import { mockSubjects } from './data/subjects' ← Subject
 * - import { mockClasses } from './data/classes' ← Class
 *
 * After Class infrastructure removal (TD-003), this note can be removed.
 */
export const mockSubjects: Subject[] = [
  { id: 1, name: 'Mathematics 101', ... },
  // ...
]
```

**Pros**:
- Zero code changes
- Zero test updates
- Clarifies situation for developers

**Cons**:
- Doesn't solve underlying issue
- Still have name similarity

---

## Dependencies

- **Requires**: None
- **Blocks**: None
- **Relates to**: TD-003 (After Class removal, issue disappears)

---

## Acceptance Criteria (If Pursued)

This technical debt item is complete when:

1. Subject mock data renamed (if Option 1 or 2 chosen)
2. All test assertions updated
3. All tests pass (143 unit/integration, 21 E2E)
4. TypeScript compilation successful
5. No references to old subject names remain
6. Documentation updated (if needed)
7. Changes committed and merged

**OR**

If Option 3 (Do Nothing) chosen:
1. Mark this ticket as "Won't Fix" or "Deferred"
2. Re-evaluate after TD-003 completion
3. Close ticket if issue resolved by Class removal

---

## Recommendation Summary

**Recommendation**: **Do Not Implement** (Wait for TD-003)

**Reasoning**:
1. **VERY LOW Priority**: No functional impact, cosmetic only
2. **Temporary Issue**: Resolves automatically after TD-003
3. **Better Effort Allocation**: Focus on HIGH/MEDIUM priority debt first
4. **Natural Resolution**: Class removal eliminates confusion

**Timeline**:
- TD-003 completion: ~6-8 weeks after Subject production deployment
- After TD-003: Only Subject mock data remains (no confusion)
- Decision point: Re-evaluate if renaming still desired post-TD-003

**If pursued anyway**:
- Use Option 1 (Add "Subject:" prefix)
- Minimal test impact (~30 minutes total effort)
- Easy to implement and rollback

---

## Notes

This ticket exists primarily for completeness in technical debt documentation. It identifies a minor inconsistency that could theoretically cause confusion, but in practice has not caused any issues.

**Historical Context**:
- Subject mock data intentionally mirrored Class data during development
- This made it easier to validate Subject components had same functionality
- Similar names were helpful during parallel development
- Now that migration is complete, distinction becomes more valuable

**Team Decision Required**:
The team should decide:
1. Defer until after TD-003 (recommended)
2. Implement Option 1 (low effort, quick win)
3. Close as "Won't Fix" (accept current state)

No wrong answer - this is truly cosmetic.
