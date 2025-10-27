# TD-003: Parallel Class and Subject Infrastructure

**Priority**: LOW
**Effort**: 2-3 story points
**Status**: Not Started
**Related**: Architecture Cleanup, Code Maintainability
**Dependencies**: Should complete after Subject feature proves stable in production

---

## Problem Statement

The codebase currently maintains two parallel infrastructure layers: Class and Subject. Both have complete implementations with components, services, hooks, tests, and E2E scenarios. This duplication creates maintenance overhead and potential for drift between implementations.

**Current Duplication**:

| Component | Class | Subject | Status |
|-----------|-------|---------|--------|
| Types | `types/Class.ts` | `types/Subject.ts` | ✅ Both exist |
| Services | `services/api/classService.ts` | `services/api/subjectService.ts` | ✅ Both exist |
| Hooks | `hooks/useClasses.ts` | `hooks/useSubjects.ts` | ✅ Both exist |
| Components | `components/classes/*` | `components/subjects/*` | ✅ Both exist |
| Tests | `__tests__/classes/*` | `__tests__/subjects/*` | ✅ Both exist (279 Class + 143 Subject) |
| E2E Tests | `e2e/classManagement.spec.ts` | `e2e/subjectManagement.spec.ts` | ✅ Both exist (21 each) |
| Mock Data | `mocks/data/classes.ts` | `mocks/data/subjects.ts` | ✅ Both exist |
| MSW Handlers | Class handlers in `handlers.ts` | Subject handlers in `handlers.ts` | ✅ Both exist |

**Impact**:
- **Code Duplication**: ~2000 lines of duplicated code across components, services, hooks
- **Test Duplication**: 422 total tests (279 Class + 143 Subject) with similar scenarios
- **Maintenance Cost**: Bug fixes must be applied to both infrastructures
- **Drift Risk**: Class and Subject implementations may diverge over time
- **Bundle Size**: Larger production bundle including unused Class code

**Why LOW Priority**:
This is technical debt that doesn't block functionality or cause bugs. Subject infrastructure is working correctly alongside Class infrastructure. The duplication is intentional during the migration period and doesn't pose immediate risks. Cleanup should wait until Subject is proven stable in production.

---

## User Stories (EARS Format)

### US-TD-003-001: Deprecate Class Infrastructure (LOW - 2 pts)

**As a** developer
**I want** to remove Class infrastructure after Subject is proven stable
**So that** we reduce code duplication and maintenance overhead

**Acceptance Criteria**:

WHEN Subject feature has been stable in production for 2+ weeks
THE SYSTEM SHALL be ready for Class infrastructure deprecation

WHEN all production users are using Subject components
THE SYSTEM SHALL have no active references to Class components in App.tsx

WHEN Class infrastructure is deprecated
THE SYSTEM SHALL remove or archive all Class-related code

WHEN tests are executed after deprecation
THE SYSTEM SHALL only run Subject tests (143 tests, 21 E2E scenarios)

WHEN production bundle is analyzed
THE SYSTEM SHALL show reduced bundle size from removed Class code

### US-TD-003-002: Document Migration Decision (LOW - 1 pt)

**As a** developer
**I want** to document why we chose Subject over Class
**So that** future developers understand the rationale

**Acceptance Criteria**:

WHEN migration documentation is created
THE SYSTEM SHALL include a migration decision record (ADR)

WHEN the ADR is reviewed
THE SYSTEM SHALL explain why Subject was chosen over Class

WHEN the ADR is reviewed
THE SYSTEM SHALL document key differences (no year field, name-only validation)

WHEN the ADR is reviewed
THE SYSTEM SHALL list benefits of Subject over Class

---

## Technical Design

### Phase 1: Production Stabilization (Complete First)

**Prerequisites** (Must complete before deprecation):
1. ✅ Subject feature deployed to production
2. ⏳ Subject feature stable for 2+ weeks in production
3. ⏳ Zero critical bugs reported in Subject components
4. ⏳ All users successfully migrated to Subject workflow
5. ⏳ Backend `/subject` API stable and performant
6. ⏳ OutcomeComment migrated from classId to subjectId (TD-002)

**Validation Checklist**:
- [ ] Subject feature deployed to production
- [ ] 2+ weeks of production stability
- [ ] < 2% error rate for Subject API calls
- [ ] No user-reported issues with Subject feature
- [ ] Performance metrics meet targets (< 2s page load)
- [ ] All E2E tests passing in production

### Phase 2: Class Infrastructure Deprecation

#### Step 1: Mark Class Components as Deprecated
**File**: `src/components/classes/*`

Add deprecation warnings to all Class components:

```typescript
/**
 * @deprecated Use SubjectList from components/subjects instead.
 * This component is maintained for backward compatibility only.
 * Will be removed in v2.0.0
 */
export const ClassList = ({ ... }: ClassListProps) => {
  // ... existing implementation
}
```

**Files to Update**:
- `components/classes/ClassList.tsx`
- `components/classes/ClassForm.tsx`
- `components/classes/ClassListItem.tsx`

#### Step 2: Mark Class Services and Hooks as Deprecated
**Files**:
- `src/services/api/classService.ts`
- `src/hooks/useClasses.ts`

Add deprecation JSDoc comments:

```typescript
/**
 * @deprecated Use subjectService from services/api/subjectService instead.
 * This service is maintained for backward compatibility only.
 * Will be removed in v2.0.0
 */
export const classService = { ... }
```

#### Step 3: Move Class Tests to Archive
**Action**: Move Class tests to separate directory for potential future reference

```bash
mkdir -p src/__tests__/archived/classes
mv src/__tests__/classes/* src/__tests__/archived/classes/
mv e2e/classManagement.spec.ts e2e/archived/classManagement.spec.ts
```

**Update `package.json`**:
```json
{
  "scripts": {
    "test": "jest --testPathIgnorePatterns=archived",
    "test:e2e": "playwright test --ignore-path=e2e/archived"
  }
}
```

#### Step 4: Remove Class Infrastructure Code

**Delete Files**:
```bash
rm -rf src/components/classes
rm -rf src/__tests__/archived/classes
rm -rf e2e/archived
rm src/services/api/classService.ts
rm src/hooks/useClasses.ts
rm src/types/Class.ts
rm src/mocks/data/classes.ts
```

**Update `src/mocks/handlers.ts`**:
Remove all Class-related handlers:
```typescript
// DELETE: Class handlers (GET, POST, PUT, DELETE /class)
// KEEP: Subject handlers, OutcomeComment handlers
```

**Update MSW Storage**:
```typescript
// DELETE: Class storage and nextClassId
let classes: Class[] = []
let nextClassId = 4

// KEEP: Subject storage
let subjects: Subject[] = [...mockSubjects]
let nextSubjectId = 4
```

#### Step 5: Update Documentation

**`README.md`**:
- Remove "Class Management" section
- Update test coverage numbers (422 → 143 tests, 42 → 21 E2E scenarios)
- Remove Class API endpoint documentation
- Update Project Structure to remove Class files
- Update badges to reflect Subject-only architecture

**`CLAUDE.md`**:
- Remove any references to Class entities
- Update Domain Model section to list only Subject, OutcomeComments, PersonalizedComments, FinalComments
- Update test count expectations

**`.spec/refactoring/`**:
- Archive refactoring specifications to `.spec/archived/refactoring/`
- Keep as historical reference for future similar migrations

### Phase 3: Verification

#### Code Verification
```bash
# Search for any remaining Class references
grep -r "Class" src/ --exclude-dir=node_modules --exclude-dir=archived

# Search for classService imports
grep -r "classService" src/ --exclude-dir=node_modules

# Search for useClasses hook usage
grep -r "useClasses" src/ --exclude-dir=node_modules
```

**Expected Results**:
- Zero matches in active code (excluding archived directories)
- Only Subject-related code should remain

#### Test Verification
```bash
# Run all tests
npm run test

# Run E2E tests
npm run test:e2e
```

**Expected Results**:
- 143 unit/integration tests pass (Subject only)
- 21 E2E scenarios pass (Subject only)
- Test execution time reduced by ~30-40%

#### Bundle Size Verification
```bash
# Build production bundle
npm run build

# Analyze bundle size
npm run analyze
```

**Expected Results**:
- Production bundle reduced by ~15-20 KB gzipped
- No Class component code in bundle
- Only Subject components and dependencies included

---

## Implementation Tasks

### Task 1: Production Stability Monitoring (Wait Period)
**Risk**: Trivial
**Effort**: 2 weeks (monitoring only)

1. Deploy Subject feature to production
2. Monitor error logs for Subject-related errors
3. Track Subject API performance metrics
4. Collect user feedback on Subject feature
5. Verify < 2% error rate for 2 consecutive weeks
6. Document any issues and resolutions

**Exit Criteria**: 2 weeks of stable production usage with < 2% error rate

### Task 2: Add Deprecation Warnings (GREEN)
**Risk**: Trivial
**Effort**: 1 hour

1. Add `@deprecated` JSDoc comments to all Class components
2. Add `@deprecated` JSDoc comments to classService
3. Add `@deprecated` JSDoc comments to useClasses hook
4. Add `@deprecated` JSDoc comment to Class type
5. Run TypeScript compiler to verify no errors
6. Commit changes with message: "chore: deprecate Class infrastructure"

### Task 3: Archive Class Tests (REFACTOR)
**Risk**: Low
**Effort**: 30 minutes

1. Create `src/__tests__/archived/classes/` directory
2. Move all Class test files to archived directory
3. Create `e2e/archived/` directory
4. Move `classManagement.spec.ts` to archived directory
5. Update `package.json` test scripts to ignore archived directories
6. Run tests to verify Subject tests still pass
7. Commit changes with message: "chore: archive Class tests"

### Task 4: Remove Class Infrastructure Code (REFACTOR)
**Risk**: Medium (irreversible)
**Effort**: 1 hour

1. **IMPORTANT**: Create git tag before deletion: `git tag pre-class-removal`
2. Delete `src/components/classes/` directory
3. Delete `src/services/api/classService.ts`
4. Delete `src/hooks/useClasses.ts`
5. Delete `src/types/Class.ts`
6. Delete `src/mocks/data/classes.ts`
7. Remove Class handlers from `src/mocks/handlers.ts`
8. Remove Class storage from `src/mocks/handlers.ts`
9. Run TypeScript compiler to verify no errors
10. Run tests to verify all tests pass
11. Commit changes with message: "chore: remove Class infrastructure"

**Rollback Plan**: If issues arise, revert using git tag:
```bash
git reset --hard pre-class-removal
```

### Task 5: Update Documentation (REFACTOR)
**Risk**: Trivial
**Effort**: 1 hour

1. Update `README.md` to remove Class references
2. Update test count badges (422 → 143 tests, 42 → 21 E2E)
3. Update `CLAUDE.md` Domain Model section
4. Create Architecture Decision Record (ADR) for Class → Subject migration
5. Archive refactoring specifications to `.spec/archived/refactoring/`
6. Update `toDos.md` to mark Class deprecation complete
7. Commit changes with message: "docs: update documentation after Class removal"

### Task 6: Verify Removal (GREEN)
**Risk**: Low
**Effort**: 1 hour

1. Search codebase for any remaining Class references
2. Run all tests (`npm run test`)
3. Run E2E tests (`npm run test:e2e`)
4. Build production bundle (`npm run build`)
5. Analyze bundle size and verify reduction
6. Perform smoke test in development environment
7. Document bundle size reduction

### Task 7: Deploy to Production (GREEN)
**Risk**: Low
**Effort**: 30 minutes

1. Create pull request with all changes
2. Request code review from team
3. Merge to main after approval
4. Deploy to production
5. Monitor production logs for errors
6. Verify bundle size reduction in production
7. Confirm no user-reported issues

---

## Testing Strategy

### Pre-Deprecation Testing
- [ ] All Subject tests pass (143 unit/integration)
- [ ] All Subject E2E tests pass (21 scenarios)
- [ ] Subject feature stable in production for 2+ weeks
- [ ] No critical bugs reported

### Post-Deprecation Testing
- [ ] TypeScript compilation successful (no errors)
- [ ] All Subject tests still pass (143 tests)
- [ ] All Subject E2E tests still pass (21 scenarios)
- [ ] No Class references found in active code
- [ ] Bundle size reduced by 15-20 KB gzipped
- [ ] Production deployment successful
- [ ] Smoke tests pass in production

### Rollback Testing
- [ ] Git tag `pre-class-removal` exists
- [ ] Can revert to pre-removal state if needed
- [ ] Rollback procedure documented and tested

---

## Architecture Decision Record (ADR)

### ADR: Migrate from Class to Subject Entity

**Status**: Accepted
**Date**: 2024-01-15
**Deciders**: Development Team

#### Context

The original Class entity included a `year` field (e.g., "Mathematics 101" with year "2024"). After reviewing user requirements and domain modeling, we determined that the year field adds unnecessary complexity without clear business value.

#### Decision

We decided to migrate from Class to Subject, where Subject has only:
- `id` (unique identifier)
- `name` (required, 1-100 characters)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

**Key Changes**:
1. Removed `year` field entirely
2. Changed duplicate detection from "name + year" to "name only (case-insensitive)"
3. Simplified form validation (no year input)
4. Updated API endpoints from `/class` to `/subject`
5. Updated localStorage keys from `selectedClassId` to `selectedSubjectId`

#### Rationale

**Pros of Subject over Class**:
- **Simpler Mental Model**: Teachers think in terms of subjects, not "class + year"
- **Reduced Cognitive Load**: One field (name) instead of two (name + year)
- **Better UX**: No need to select/enter year for each subject
- **Cleaner API**: Fewer validation rules, simpler duplicate detection
- **Future-Proof**: Easier to extend with new fields if needed

**Cons**:
- Required migration effort (~23 story points across 3 sprints)
- Temporary code duplication during transition
- Risk of bugs during migration (mitigated by TDD approach)

#### Consequences

**Positive**:
- Cleaner, more maintainable codebase
- Better user experience (simpler forms)
- Reduced bundle size after Class removal
- Faster test execution (less duplication)

**Negative**:
- One-time migration effort
- Temporary increase in codebase size during transition
- Need to coordinate backend changes

**Mitigation**:
- Used TDD throughout migration (422 tests, 42 E2E scenarios)
- Maintained parallel infrastructure until Subject proven stable
- Created comprehensive technical debt tracking
- Documented rollback procedures

---

## Dependencies

- **Requires**: Subject feature stable in production for 2+ weeks
- **Requires**: TD-001 (OutcomeCommentsModal Subject compatibility) complete
- **Requires**: TD-002 (OutcomeComment classId → subjectId) complete
- **Requires**: TD-005 (Subject E2E tests running) complete
- **Blocks**: None (this is cleanup work)
- **Relates to**: TD-006 (Backend API Class endpoints deprecation)

---

## Acceptance Criteria

This technical debt item is complete when:

1. Subject feature has been stable in production for 2+ weeks
2. All Class components marked as deprecated
3. All Class tests archived
4. All Class infrastructure code deleted
5. Class handlers removed from MSW
6. Documentation updated (README.md, CLAUDE.md)
7. Architecture Decision Record (ADR) created
8. All tests pass (143 unit/integration, 21 E2E)
9. TypeScript compilation successful
10. Bundle size reduced by 15-20 KB gzipped
11. Production deployment successful
12. No user-reported issues after deployment
