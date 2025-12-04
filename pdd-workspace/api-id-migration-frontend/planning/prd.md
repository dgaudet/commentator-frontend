# API ID Type Migration - Frontend Implementation
## Product Requirements Document (PRD)

**Feature:** API ID Migration (Number → MongoDB ObjectId String)
**Version:** 1.0
**Status:** APPROVED FOR IMPLEMENTATION
**Last Updated:** December 4, 2025
**Owner:** Frontend Team
**Complexity Level:** L2 (Low-Medium)
**Effort Estimate:** 5-6 hours (single developer)

---

## Executive Summary

Migrate the Commentator frontend application from using integer IDs to MongoDB ObjectId string IDs, aligning with the backend's completed MongoDB integration. This is a focused type-system migration affecting 5 core entities (Subject, Class, OutcomeComment, PersonalizedComment, FinalComment) across 40-50 files in the frontend codebase. The migration leverages TypeScript's type system for compile-time safety and comprehensive test coverage (313 tests) for runtime validation.

**Business Value:**
- **API Compatibility**: Frontend works seamlessly with live MongoDB backend
- **Type Safety**: Compile-time validation prevents runtime errors
- **Future-Proof**: MongoDB ObjectIds support enterprise data volumes
- **Data Integrity**: String IDs eliminate integer overflow issues

---

## Problem Statement

### Current State
- **Frontend IDs**: Expected as `number` type (`id: number`, `subjectId: number`)
- **Backend IDs**: Returns MongoDB ObjectIds as `string` (24-char hex: `"65a1b2c3d4e5f...jk1"`)
- **Result**: Type mismatches between frontend and backend, potential runtime failures

### Desired State
- **Frontend IDs**: Accepts `string` type (`id: string`, `subjectId: string`)
- **Backend IDs**: Provides MongoDB ObjectIds as `string`
- **Result**: Type compatibility, compile-time safety, consistent data flow

---

## Scope Definition

### In Scope (MVP)
- Update TypeScript type definitions for 5 entities
- Update API service layer functions
- Update mock data and MSW handlers for testing
- Update React components and hooks
- Update all 313 test files
- Ensure TypeScript, ESLint, and test suite pass

### Out of Scope
- Backend MongoDB migration (already completed)
- Database schema changes
- API contract negotiation
- New features or functionality changes
- Architectural refactoring

---

## User Stories

### Epic: API ID Type Migration
**Goal**: Enable the frontend to work seamlessly with the MongoDB backend by consistently using string IDs throughout the application.

---

### Group 1: Type Definitions (US-ID-001 to US-ID-005)

#### US-ID-001: Update Subject Type to Use String IDs
**Priority:** HIGH | **Risk Tier:** TRIVIAL | **Effort:** 5 min

```
WHEN a developer imports the Subject type
THEN the type definition SHALL have id field as type 'string'
AND the interface SHALL be exported as both named and type-only exports
AND JSDoc comments SHALL reference MongoDB ObjectId format
```

**Acceptance Criteria:**
- [ ] Subject.id is `string` (not `number`)
- [ ] CreateSubjectRequest has string ID types
- [ ] UpdateSubjectRequest has string ID types
- [ ] JSDoc updated with format examples
- [ ] TypeScript compilation: 0 errors
- [ ] Existing component tests import without errors

---

#### US-ID-002: Update Class Type to Use String IDs
**Priority:** HIGH | **Risk Tier:** TRIVIAL | **Effort:** 5 min

```
WHEN a developer imports the Class type
THEN both id and subjectId fields SHALL be type 'string'
AND the year field SHALL remain type 'number'
AND foreign key relationships SHALL be preserved
```

**Acceptance Criteria:**
- [ ] Class.id and Class.subjectId are `string`
- [ ] Request interfaces use string IDs
- [ ] year field remains `number`
- [ ] No breaking changes to component contracts
- [ ] TypeScript compilation: 0 errors

---

#### US-ID-003: Update OutcomeComment Type to Use String IDs
**Priority:** HIGH | **Risk Tier:** TRIVIAL | **Effort:** 5 min

**Acceptance Criteria:**
- [ ] OutcomeComment.id and OutcomeComment.subjectId are `string`
- [ ] Request interfaces use string IDs
- [ ] upperRange and lowerRange remain `number`
- [ ] TypeScript compilation: 0 errors

---

#### US-ID-004: Update PersonalizedComment Type to Use String IDs
**Priority:** HIGH | **Risk Tier:** TRIVIAL | **Effort:** 5 min

**Acceptance Criteria:**
- [ ] PersonalizedComment.id and PersonalizedComment.subjectId are `string`
- [ ] rating field remains `number`
- [ ] Request interfaces updated
- [ ] TypeScript compilation: 0 errors

---

#### US-ID-005: Update FinalComment Type to Use String IDs
**Priority:** HIGH | **Risk Tier:** TRIVIAL | **Effort:** 5 min

**Acceptance Criteria:**
- [ ] FinalComment.id and FinalComment.classId are `string`
- [ ] grade field remains `number` (0-100)
- [ ] Request interfaces updated
- [ ] TypeScript compilation: 0 errors

---

### Group 2: API Services (US-ID-006 to US-ID-010)

#### US-ID-006: Update Subject API Service to Accept String IDs
**Priority:** HIGH | **Risk Tier:** LOW | **Effort:** 10 min

```
WHEN subjectService functions are called
THEN all ID parameters SHALL be type 'string'
AND no Number() or parseInt() conversions SHALL exist
AND function signatures SHALL be consistent
```

**Acceptance Criteria:**
- [ ] `getById(id: string)` accepts string
- [ ] `update(id: string, data)` accepts string
- [ ] `delete(id: string)` accepts string
- [ ] No ID conversions in implementation
- [ ] JSDoc updated
- [ ] Service tests pass

---

#### US-ID-007 to US-ID-010: Update Remaining Services
**Pattern:** Apply same pattern to Class, OutcomeComment, PersonalizedComment, FinalComment services

**Acceptance Criteria (for each):**
- [ ] All ID-based operations use string types
- [ ] Foreign key filtering uses string comparison
- [ ] No Number() or parseInt() conversions
- [ ] Service tests pass

---

### Group 3: Mock Data & Testing Infrastructure (US-ID-011 to US-ID-015)

#### US-ID-011: Create Mock ObjectId Generator Utility
**Priority:** HIGH | **Risk Tier:** MEDIUM | **Effort:** 10 min

```
WHEN creating mock data for tests
THEN the application SHALL provide generateMockObjectId() utility
AND generated ObjectIds SHALL be 24-character hexadecimal strings
AND the function SHALL support seed parameter for reproducibility
```

**Acceptance Criteria:**
- [ ] `generateMockObjectId()` returns valid format: `/^[0-9a-fA-F]{24}$/`
- [ ] Optional seed parameter for consistent testing
- [ ] `isValidObjectId(id: string)` validation function exists
- [ ] Utility is thoroughly tested
- [ ] Used consistently across all mock data

---

#### US-ID-012 to US-ID-015: Update Mock Data & Handlers
**Pattern:** Systematically update all mock data and MSW handlers

**Acceptance Criteria (combined):**
- [ ] All mock subjects have string IDs
- [ ] All mock classes have string id and subjectId
- [ ] MSW handlers validate string IDs (not numeric)
- [ ] No `Number()` or `Number.isInteger()` conversions in handlers
- [ ] Handler responses match entity types
- [ ] Referential integrity maintained in mock data
- [ ] Handler tests pass

---

### Group 4: React Hooks (US-ID-016 to US-ID-020)

#### US-ID-016 to US-ID-020: Update All Custom Hooks
**Pattern:** Hooks automatically return typed data from updated types

**Stories:**
- US-ID-016: useSubjects hook
- US-ID-017: useClasses hook
- US-ID-018: useOutcomeComments hook
- US-ID-019: usePersonalizedComments hook
- US-ID-020: useFinalComments hook

**Acceptance Criteria (for each):**
- [ ] Hook returns entities with string IDs
- [ ] TypeScript type inference is correct
- [ ] No type conversions in hook logic
- [ ] Hook tests pass

---

### Group 5: React Components (US-ID-021 to US-ID-025)

#### US-ID-021 to US-ID-025: Update All Entity Components
**Pattern:** Update props interfaces to accept string IDs

**Stories:**
- US-ID-021: Subject components (SubjectList, SubjectListItem)
- US-ID-022: Class components (ClassManagementModal)
- US-ID-023: OutcomeComment components (OutcomeCommentsModal)
- US-ID-024: PersonalizedComment components (PersonalizedCommentsModal)
- US-ID-025: FinalComment components (FinalCommentsModal)

**Acceptance Criteria (for each):**
- [ ] Component receives string ID props
- [ ] Delete/update handlers use string IDs
- [ ] String comparison for filtering works
- [ ] Key props work with string IDs
- [ ] Component tests pass

---

### Group 6: Test Suite (US-ID-026 to US-ID-029)

#### US-ID-026: Update Type Definition Tests
**Priority:** HIGH | **Risk Tier:** MEDIUM | **Effort:** 15 min

**Acceptance Criteria:**
- [ ] All type test files use string IDs
- [ ] Tests verify `id: string` type
- [ ] No numeric ID test data
- [ ] All type tests pass

---

#### US-ID-027: Update Service Layer Tests
**Priority:** HIGH | **Risk Tier:** MEDIUM | **Effort:** 20 min

**Acceptance Criteria:**
- [ ] All mock API responses use string IDs
- [ ] Service function calls use string parameters
- [ ] Test assertions verify string types
- [ ] All service tests pass

---

#### US-ID-028: Update Component Tests
**Priority:** HIGH | **Risk Tier:** MEDIUM | **Effort:** 45 min

**Acceptance Criteria:**
- [ ] All component test mock data uses string IDs
- [ ] Component props are string-typed
- [ ] All 100+ component tests pass

---

#### US-ID-029: Verify Full Test Suite
**Priority:** HIGH | **Risk Tier:** MEDIUM | **Effort:** 10 min

```
WHEN full test suite executes
THEN all 313 tests SHALL pass
AND no test failures SHALL exist
AND code coverage SHALL remain ≥90%
```

**Acceptance Criteria:**
- [ ] `npm test`: 313/313 passing
- [ ] No skipped tests
- [ ] Code coverage ≥90%
- [ ] No warnings

---

### Group 7: Quality Verification (US-ID-030 to US-ID-032)

#### US-ID-030: TypeScript Compilation Verification
**Priority:** HIGH | **Risk Tier:** TRIVIAL | **Effort:** 5 min

```
WHEN TypeScript compiler runs
THEN compilation SHALL succeed with 0 errors
AND no type mismatches SHALL exist
```

**Acceptance Criteria:**
- [ ] `npx tsc --noEmit`: 0 errors
- [ ] No type assertions needed
- [ ] All files compile successfully

---

#### US-ID-031: ESLint Verification
**Priority:** HIGH | **Risk Tier:** TRIVIAL | **Effort:** 5 min

```
WHEN ESLint runs
THEN linting SHALL pass with 0 errors
AND code follows project standards
```

**Acceptance Criteria:**
- [ ] `npm run lint`: 0 errors
- [ ] No code quality issues

---

#### US-ID-032: Manual Smoke Testing
**Priority:** HIGH | **Risk Tier:** TRIVIAL | **Effort:** 5 min

```
WHEN dev server starts
THEN application SHALL function correctly with string IDs
AND all CRUD operations SHALL work
AND no console errors SHALL appear
```

**Acceptance Criteria:**
- [ ] Dev server starts without errors
- [ ] App loads in browser
- [ ] Create/Read/Update/Delete work
- [ ] No console errors or warnings

---

## Success Metrics & KPIs

### Functional Success
- ✅ All CRUD operations work with string IDs
- ✅ Foreign key relationships preserved and functional
- ✅ Filtering by ID works correctly
- ✅ API calls send/receive string IDs correctly
- ✅ No runtime type errors or coercion

### Technical Success
- ✅ TypeScript compilation: 0 errors
- ✅ ESLint validation: 0 errors
- ✅ Test suite: 313/313 tests passing
- ✅ No deprecated ID conversion patterns
- ✅ Consistent string ID usage throughout

### Operational Success
- ✅ Development server starts without errors
- ✅ Manual smoke testing passes
- ✅ Code review approved
- ✅ Pull request merged to main

---

## Affected Entities & Impact Analysis

| Entity | Changes | Impact |
|--------|---------|--------|
| **Subject** | `id: number` → `id: string` | 8-10 files affected |
| **Class** | `id: number` → `string`, `subjectId: number` → `string` | 10-12 files affected |
| **OutcomeComment** | `id: number` → `string`, `subjectId: number` → `string` | 10-12 files affected |
| **PersonalizedComment** | `id: number` → `string`, `subjectId: number` → `string` | 10-12 files affected |
| **FinalComment** | `id: number` → `string`, `classId: number` → `string` | 10-12 files affected |

**Total Impact:**
- 5 type definition files
- 5 API service files
- 10+ component files
- 5+ hook files
- 313 test files
- 4 mock data files
- ~50 total files affected

---

## Dependencies & Prerequisites

### Prerequisites (All Met ✅)
- ✅ Backend API migrated to MongoDB
- ✅ Backend endpoints return string IDs
- ✅ Backend tests passing with string IDs
- ✅ API contracts finalized

### External Dependencies
- None (no new npm packages required)

### Internal Dependencies
- All 313 existing tests
- Type system (TypeScript)
- Existing architecture (no changes)

---

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Missed ID reference | Low | Medium | TypeScript compiler catches all usages |
| Mock data inconsistency | Medium | Low | Systematic update with test validation |
| Foreign key breakage | Low | Medium | Verify referential integrity in tests |
| Type inference issues | Low | Low | TypeScript provides clear error messages |
| Test data mismatch | Medium | Low | Incremental phase completion and validation |

**Overall Risk Assessment: LOW**
- Type system prevents most errors at compile time
- Comprehensive test coverage validates runtime behavior
- Simple, straightforward pattern across all entities
- No architectural changes required

---

## Implementation Approach

### Strategy: Incremental Entity-by-Entity with TDD

**6 Phases:**
1. **Type Definitions** (30 min) - Update entity types
2. **API Services** (45 min) - Update service layer
3. **Mock Data** (60 min) - Update test infrastructure
4. **Components & Hooks** (75 min) - Update UI layer
5. **Test Suite** (90 min) - Update tests (313 files)
6. **Verification** (15 min) - Quality gates

**Methodology:**
- Test-Driven Development (Red-Green-Refactor)
- TypeScript compiler guidance
- Comprehensive test validation
- Incremental commits by phase

**Timeline:**
- Single developer: 5-6 hours
- Total calendar time: 1-2 days (including code review)

---

## Acceptance Criteria (Summary)

### Phase 1: Type Definitions Complete
- [ ] All 5 type files updated (Subject, Class, OutcomeComment, PersonalizedComment, FinalComment)
- [ ] All ID fields are strings
- [ ] JSDoc updated
- [ ] TypeScript compilation: 0 errors

### Phase 2: API Services Complete
- [ ] All 5 service files updated
- [ ] All ID parameters are strings
- [ ] No Number() or parseInt() conversions
- [ ] Service tests passing

### Phase 3: Mock Data & Handlers Complete
- [ ] ObjectId generator utility created
- [ ] All mock data uses string IDs
- [ ] MSW handlers validate string IDs
- [ ] Referential integrity maintained

### Phase 4: Components & Hooks Complete
- [ ] 5 hooks updated (all return string IDs)
- [ ] 6+ components updated (all accept string ID props)
- [ ] String comparison for filtering
- [ ] Component tests passing

### Phase 5: Test Suite Complete
- [ ] Type definition tests passing
- [ ] Service tests passing
- [ ] Component tests passing
- [ ] All 313 tests passing

### Phase 6: Verification Complete
- [ ] TypeScript: 0 errors
- [ ] ESLint: 0 errors
- [ ] Manual smoke testing passed
- [ ] Ready for code review

---

## Resources Required

### Team
- 1 Frontend Developer (5-6 hours) - Implementation
- 1 Tech Lead (1-2 hours) - Design/code review
- 1 Product Owner (0.5 hours) - Approvals

### Tools
- Node.js v24 (already installed)
- npm (already installed)
- TypeScript (already installed)
- Jest (already installed)
- ESLint (already installed)

### Infrastructure
- Development machine
- Git for version control
- No new dependencies required

---

## Rollback Strategy

**Risk Level:** VERY LOW
**Strategy:** Simple git revert

```bash
git revert <commit-hash>
npm install
npm test
```

**Estimated Rollback Time:** 5 minutes

---

## Next Steps

### Immediate (Today)
1. Review and approve this PRD
2. Review technical design document
3. Review task breakdown

### Kickoff (Next Available)
1. Assign frontend developer
2. Review design with team
3. Create feature branch
4. Begin Phase 1: Type Definitions

### Development (Day 1-2)
1. Execute each phase following TDD
2. Run tests after each phase
3. Commit incrementally by phase
4. Follow quality gates

### Code Review (End of Implementation)
1. Create pull request
2. Tech lead reviews
3. Address feedback
4. Merge to main

---

## Success Definition

**The migration is complete when:**
1. ✅ All 5 entity types use string IDs
2. ✅ All 5 API services accept string ID parameters
3. ✅ All mock data uses string IDs
4. ✅ All components and hooks handle string IDs
5. ✅ All 313 tests passing
6. ✅ TypeScript: 0 errors
7. ✅ ESLint: 0 errors
8. ✅ Manual smoke testing passed
9. ✅ Code review approved
10. ✅ Merged to main branch

---

## Document History

| Version | Date | Author | Status |
|---------|------|--------|--------|
| 1.0 | 2025-12-04 | Frontend Team | APPROVED |

---

**Document Status:** ✅ APPROVED FOR IMPLEMENTATION

**Next Review:** Upon completion of all phases
