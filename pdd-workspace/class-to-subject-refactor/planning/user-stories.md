# User Stories: Class to Subject Refactoring

**Feature**: class-to-subject-refactor
**Complexity**: L2-SMALL (8-12 stories, 2-3 weeks)
**Created**: 2025-10-26
**Product Owner**: Principal Product Owner

---

## Business Context

**Problem Statement:**
The frontend currently uses "Class" terminology and entity structure that doesn't align with the backend API. The backend has evolved to use a hierarchical structure where:
- **Subject**: Top-level entity (e.g., "Mathematics 101") with only `id`, `name`, `createdAt`, `updatedAt`
- **Class**: Child entity belonging to a Subject, with additional `subjectId`, `name`, `year` fields

The current frontend "Class" entity (with `name` and `year`) actually maps to the backend's "Subject" entity, not the backend's "Class" entity. This mismatch creates confusion and technical debt.

**Opportunity:**
By refactoring the frontend to use "Subject" terminology and structure, we:
1. Align frontend and backend domain models
2. Prepare the codebase for future Class (within Subject) functionality
3. Reduce cognitive overhead for developers
4. Enable clearer API contracts and documentation

**API Changes Required:**
- Endpoint: `/class` → `/subject`
- Entity fields: Remove `year` field (Subject only has `id`, `name`, `createdAt`, `updatedAt`)
- Note: The backend `Class` entity (with `subjectId`, `name`, `year`) will be used in future features

---

## Epic: Refactor Class Entity to Subject Entity

**Epic Goal:** Systematically rename and refactor all frontend code from "Class" to "Subject" to align with backend API structure, ensuring all tests pass and documentation is updated.

---

## User Stories

### 🔵 US-REFACTOR-001: Rename Type Definitions from Class to Subject
**Priority:** HIGH (Foundational)
**Effort:** 2 Story Points
**Risk:** LOW
**Dependencies:** None

**As a** developer
**I want** the TypeScript type definitions renamed from Class to Subject
**So that** the codebase uses consistent terminology with the backend API

#### Acceptance Criteria (EARS Format)

**WHEN** viewing `src/types/Subject.ts` (renamed from `Class.ts`)
**THE SYSTEM SHALL** define `Subject`, `CreateSubjectRequest`, and `UpdateSubjectRequest` interfaces

**WHEN** viewing the `Subject` interface
**THE SYSTEM SHALL** include only these fields:
- `id: number`
- `name: string`
- `createdAt: string`
- `updatedAt: string`

**WHEN** viewing `CreateSubjectRequest` and `UpdateSubjectRequest`
**THE SYSTEM SHALL** include only `name: string` (no `year` field)

**WHEN** all type tests run (`npm test src/types/__tests__/`)
**THE SYSTEM SHALL** pass all tests with Subject terminology

#### Definition of Done
- [ ] File renamed: `src/types/Class.ts` → `src/types/Subject.ts`
- [ ] All interfaces renamed: `Class` → `Subject`, etc.
- [ ] Year field removed from interfaces
- [ ] Test file renamed: `src/types/__tests__/Class.test.ts` → `Subject.test.ts`
- [ ] All tests updated and passing
- [ ] API documentation comments updated
- [ ] No references to "Class" types in the types directory

---

### 🔵 US-REFACTOR-002: Update API Service Layer for Subject Endpoints
**Priority:** HIGH (Critical Path)
**Effort:** 3 Story Points
**Risk:** MEDIUM
**Dependencies:** US-REFACTOR-001

**As a** developer
**I want** the API service layer updated to call `/subject` endpoints instead of `/class`
**So that** the application communicates correctly with the backend

#### Acceptance Criteria (EARS Format)

**WHEN** viewing `src/services/api/subjectService.ts` (renamed from `classService.ts`)
**THE SYSTEM SHALL** define functions: `getSubjects()`, `getSubjectById()`, `createSubject()`, `updateSubject()`, `deleteSubject()`

**WHEN** any service function is called
**THE SYSTEM SHALL** use `/subject` base URL (not `/class`)

**WHEN** `createSubject()` is called with `{name: "Math"}`
**THE SYSTEM SHALL** send POST request to `/subject` with only `name` field (no `year`)

**WHEN** service functions return data
**THE SYSTEM SHALL** return `Subject` type (with only `id`, `name`, `createdAt`, `updatedAt`)

**WHEN** all service tests run (`npm test src/services/api/__tests__/subjectService.test.ts`)
**THE SYSTEM SHALL** pass all tests with 90%+ coverage

#### Definition of Done
- [ ] File renamed: `src/services/api/classService.ts` → `subjectService.ts`
- [ ] All functions renamed to use "Subject" terminology
- [ ] All API endpoints changed to `/subject`
- [ ] Request/response types updated to `Subject` interfaces
- [ ] Year field removed from create/update requests
- [ ] Test file renamed and updated
- [ ] All Axios mock tests passing
- [ ] Error handling preserved
- [ ] JSDoc comments updated

---

### 🔵 US-REFACTOR-003: Update Validation Logic for Subject Entity
**Priority:** HIGH
**Effort:** 2 Story Points
**Risk:** LOW
**Dependencies:** US-REFACTOR-001

**As a** developer
**I want** validation logic updated to validate Subject entities (name only)
**So that** form validation works correctly without year field

#### Acceptance Criteria (EARS Format)

**WHEN** viewing `src/services/validation/subjectValidation.ts` (renamed)
**THE SYSTEM SHALL** export `validateSubjectName()` function

**WHEN** `validateSubjectName("")` is called
**THE SYSTEM SHALL** return error: "Subject name is required"

**WHEN** `validateSubjectName("Math")` is called with valid name
**THE SYSTEM SHALL** return `null` (no error)

**WHEN** `validateSubjectName()` receives name > 100 characters
**THE SYSTEM SHALL** return error: "Subject name must be 100 characters or less"

**WHEN** all validation tests run
**THE SYSTEM SHALL** pass all tests with Subject terminology

#### Definition of Done
- [ ] File renamed: `src/services/validation/classValidation.ts` → `subjectValidation.ts`
- [ ] All functions renamed to use "Subject"
- [ ] Year validation removed entirely
- [ ] Name validation preserved (1-100 chars)
- [ ] Test file renamed and updated
- [ ] All validation tests passing
- [ ] Error messages use "Subject" terminology

---

### 🔵 US-REFACTOR-004: Rename React Custom Hooks
**Priority:** HIGH
**Effort:** 3 Story Points
**Risk:** MEDIUM
**Dependencies:** US-REFACTOR-001, US-REFACTOR-002

**As a** developer
**I want** the `useClasses` hook renamed to `useSubjects`
**So that** React hooks use consistent Subject terminology

#### Acceptance Criteria (EARS Format)

**WHEN** importing from `src/hooks/useSubjects.ts`
**THE SYSTEM SHALL** export `useSubjects` hook (not `useClasses`)

**WHEN** calling `useSubjects()`
**THE SYSTEM SHALL** return `{ subjects, isLoading, error, createSubject, updateSubject, deleteSubject, clearError }`

**WHEN** `createSubject({name: "Math"})` is called
**THE SYSTEM SHALL** call `subjectService.createSubject()` and update local state

**WHEN** `deleteSubject(id)` is called
**THE SYSTEM SHALL** call `subjectService.deleteSubject()` and remove from local state

**WHEN** all hook tests run (`npm test src/hooks/__tests__/useSubjects.test.ts`)
**THE SYSTEM SHALL** pass all tests

#### Definition of Done
- [ ] File renamed: `src/hooks/useClasses.ts` → `useSubjects.ts`
- [ ] Hook renamed: `useClasses` → `useSubjects`
- [ ] All return values use "subject" terminology
- [ ] All internal functions renamed
- [ ] Test file renamed and updated
- [ ] All React Testing Library tests passing
- [ ] Mock service calls updated

---

### 🔵 US-REFACTOR-005: Refactor Subject List Component
**Priority:** HIGH
**Effort:** 5 Story Points
**Risk:** MEDIUM
**Dependencies:** US-REFACTOR-001, US-REFACTOR-004

**As a** user
**I want** the subject list interface to display subject names (without year)
**So that** I can view and select subjects clearly

#### Acceptance Criteria (EARS Format)

**WHEN** viewing the subjects page
**THE SYSTEM SHALL** display "Your Subjects" heading (not "Your Classes")

**WHEN** dropdown selector is rendered
**THE SYSTEM SHALL** show label "Select a Subject" and display only subject names (no year)

**WHEN** a subject is selected from dropdown
**THE SYSTEM SHALL** display SubjectListItem below the dropdown

**WHEN** "Add Subject" button is clicked
**THE SYSTEM SHALL** open the subject creation form

**WHEN** localStorage has a persisted selection
**THE SYSTEM SHALL** restore the selected subject on page load

**WHEN** all component tests run (`npm test src/components/subjects/__tests__/SubjectList.test.tsx`)
**THE SYSTEM SHALL** pass all 38+ tests

#### Definition of Done
- [ ] Directory renamed: `src/components/classes/` → `src/components/subjects/`
- [ ] File renamed: `ClassList.tsx` → `SubjectList.tsx`
- [ ] Component renamed: `ClassList` → `SubjectList`
- [ ] All props use "subject" terminology
- [ ] All UI text updated ("Subject" not "Class")
- [ ] Dropdown shows only subject names (no year display)
- [ ] localStorage key renamed: `commentator.selectedClassId` → `commentator.selectedSubjectId`
- [ ] Test file renamed and updated
- [ ] All 38 tests passing
- [ ] Accessibility labels updated

---

### 🔵 US-REFACTOR-006: Refactor Subject List Item Component
**Priority:** HIGH
**Effort:** 3 Story Points
**Risk:** LOW
**Dependencies:** US-REFACTOR-001

**As a** user
**I want** each subject list item to display subject information clearly
**So that** I can view, edit, delete, and manage outcome comments for each subject

#### Acceptance Criteria (EARS Format)

**WHEN** viewing a SubjectListItem
**THE SYSTEM SHALL** display only subject name (no year field)

**WHEN** viewing action buttons
**THE SYSTEM SHALL** display "Edit Subject", "Delete Subject", "Manage Outcome Comments" buttons

**WHEN** "Edit Subject" is clicked
**THE SYSTEM SHALL** trigger `onEdit` callback with subject data

**WHEN** "Manage Outcome Comments" is clicked
**THE SYSTEM SHALL** trigger `onViewOutcomeComments` with subject data

**WHEN** all component tests run
**THE SYSTEM SHALL** pass all SubjectListItem tests

#### Definition of Done
- [ ] File renamed: `ClassListItem.tsx` → `SubjectListItem.tsx`
- [ ] Component renamed: `ClassListItem` → `SubjectListItem`
- [ ] Props interface renamed and updated
- [ ] Year display removed from template
- [ ] Button labels updated to "Subject"
- [ ] Test file renamed and updated
- [ ] All tests passing
- [ ] data-testid updated: `class-item-*` → `subject-item-*`

---

### 🔵 US-REFACTOR-007: Refactor Subject Form Component
**Priority:** HIGH
**Effort:** 3 Story Points
**Risk:** LOW
**Dependencies:** US-REFACTOR-001, US-REFACTOR-003

**As a** user
**I want** to create and edit subjects using a simple form with name only
**So that** I can manage subjects without unnecessary year field

#### Acceptance Criteria (EARS Format)

**WHEN** viewing the subject form
**THE SYSTEM SHALL** display "Create Subject" or "Edit Subject" heading

**WHEN** viewing form fields
**THE SYSTEM SHALL** display only "Subject Name" input field (no year field)

**WHEN** submitting form with empty name
**THE SYSTEM SHALL** display validation error "Subject name is required"

**WHEN** submitting form with valid name
**THE SYSTEM SHALL** call `onSubmit` with `{name: "..."}`

**WHEN** all form tests run
**THE SYSTEM SHALL** pass all SubjectForm tests

#### Definition of Done
- [ ] File renamed: `ClassForm.tsx` → `SubjectForm.tsx`
- [ ] Component renamed: `ClassForm` → `SubjectForm`
- [ ] Year field completely removed from form
- [ ] Form labels updated to "Subject"
- [ ] Validation calls `validateSubjectName()`
- [ ] Test file renamed and updated
- [ ] All tests passing
- [ ] Form submission passes only `name` field

---

### 🟡 US-REFACTOR-008: Update Storage Utilities for Subject Selection
**Priority:** MEDIUM
**Effort:** 2 Story Points
**Risk:** LOW
**Dependencies:** None (parallel to other tasks)

**As a** developer
**I want** localStorage utilities to use "subject" terminology and keys
**So that** persisted selection uses consistent naming

#### Acceptance Criteria (EARS Format)

**WHEN** viewing `src/utils/subjectStorageUtils.ts`
**THE SYSTEM SHALL** export `getSelectedSubjectId()`, `saveSelectedSubjectId()`, `clearSelectedSubjectId()`

**WHEN** calling `saveSelectedSubjectId(123)`
**THE SYSTEM SHALL** store value in localStorage with key `commentator.selectedSubjectId`

**WHEN** calling `getSelectedSubjectId()` after saving
**THE SYSTEM SHALL** return the previously saved subject ID

**WHEN** all storage util tests run
**THE SYSTEM SHALL** pass all 12 tests

#### Definition of Done
- [ ] File renamed: `classStorageUtils.ts` → `subjectStorageUtils.ts`
- [ ] All functions renamed to use "Subject"
- [ ] localStorage key changed: `selectedClassId` → `selectedSubjectId`
- [ ] Test file renamed and updated
- [ ] All 12 tests passing
- [ ] Migration: Clear old `selectedClassId` key on first load

---

### 🟡 US-REFACTOR-009: Update Integration Tests
**Priority:** MEDIUM
**Effort:** 3 Story Points
**Risk:** LOW
**Dependencies:** All component stories (US-REFACTOR-005 to 007)

**As a** developer
**I want** all integration tests updated to use Subject terminology
**So that** integration test suite validates the refactored code

#### Acceptance Criteria (EARS Format)

**WHEN** viewing `src/__tests__/integration/subjectManagement.test.tsx`
**THE SYSTEM SHALL** test subject CRUD workflows with Subject types

**WHEN** running integration tests
**THE SYSTEM SHALL** mock `subjectService` API calls

**WHEN** all integration tests run
**THE SYSTEM SHALL** pass all tests

**WHEN** test coverage is measured
**THE SYSTEM SHALL** maintain 90%+ coverage

#### Definition of Done
- [ ] File renamed: `classManagement.test.tsx` → `subjectManagement.test.tsx`
- [ ] All test descriptions use "Subject"
- [ ] All mocks use `subjectService`
- [ ] All component imports use Subject components
- [ ] All tests passing
- [ ] Coverage maintained at 90%+

---

### 🟡 US-REFACTOR-010: Update E2E Tests for Subject Management
**Priority:** MEDIUM
**Effort:** 5 Story Points
**Risk:** MEDIUM (high file count)
**Dependencies:** All component stories

**As a** QA engineer
**I want** E2E tests updated to use Subject terminology and test flows
**So that** end-to-end testing validates the refactored application

#### Acceptance Criteria (EARS Format)

**WHEN** viewing `e2e/subjectManagement.spec.ts`
**THE SYSTEM SHALL** define test suites for subject management workflows

**WHEN** E2E test "should display list of subjects" runs
**THE SYSTEM SHALL** verify dropdown shows subjects without year

**WHEN** E2E test "should create new subject" runs
**THE SYSTEM SHALL** fill only name field and submit successfully

**WHEN** E2E test "should persist selected subject" runs
**THE SYSTEM SHALL** verify subject selection persists across page reload

**WHEN** all E2E tests run (`npm run test:e2e`)
**THE SYSTEM SHALL** pass 19+ tests (2 may be skipped as per current state)

#### Definition of Done
- [ ] File renamed: `e2e/classManagement.spec.ts` → `subjectManagement.spec.ts`
- [ ] All test descriptions use "Subject"
- [ ] All selectors updated: `#class-selector` → `#subject-selector`, `data-testid="class-item-*"` → `subject-item-*`
- [ ] Year field assertions removed
- [ ] Backend mock calls use `/subject` endpoints
- [ ] All 21 E2E tests updated
- [ ] 19+ tests passing (2 skipped OK)
- [ ] Playwright report shows success

---

### 🟢 US-REFACTOR-011: Update Documentation and README
**Priority:** LOW
**Effort:** 2 Story Points
**Risk:** LOW
**Dependencies:** All implementation stories

**As a** developer onboarding to the project
**I want** documentation updated to reflect Subject terminology
**So that** I can understand the codebase structure and API contracts

#### Acceptance Criteria (EARS Format)

**WHEN** viewing README.md
**THE SYSTEM SHALL** describe "Subject Management" features (not "Class Management")

**WHEN** viewing API documentation section
**THE SYSTEM SHALL** reference `/subject` endpoints

**WHEN** viewing feature badges
**THE SYSTEM SHALL** show updated test counts

**WHEN** viewing project structure section
**THE SYSTEM SHALL** reference `src/components/subjects/` directory

**WHEN** viewing memory files (`.github/instructions/memory/`)
**THE SYSTEM SHALL** document the refactoring in change history

#### Definition of Done
- [ ] README.md updated: all "Class Management" → "Subject Management"
- [ ] API documentation references updated
- [ ] Project structure diagram updated
- [ ] Memory file updated: `memory/features/subject-management/memory.md`
- [ ] COMPLETION_REPORT.md created for this refactoring feature
- [ ] All internal docs reference Subject, not Class

---

### 🟢 US-REFACTOR-012: Update Mock Data and Test Fixtures
**Priority:** LOW
**Effort:** 1 Story Point
**Risk:** LOW
**Dependencies:** US-REFACTOR-001

**As a** developer
**I want** all mock data and test fixtures updated to use Subject structure
**So that** tests use realistic data matching the backend API

#### Acceptance Criteria (EARS Format)

**WHEN** viewing `src/mocks/data/subjects.ts` (renamed)
**THE SYSTEM SHALL** export mock subjects with only `id`, `name`, `createdAt`, `updatedAt` fields

**WHEN** tests import mock data
**THE SYSTEM SHALL** use `Subject` type for all mock objects

**WHEN** year field references exist in mocks
**THE SYSTEM SHALL** be completely removed

#### Definition of Done
- [ ] File renamed: `src/mocks/data/classes.ts` → `subjects.ts`
- [ ] All mock objects use Subject interface
- [ ] Year field removed from all mocks
- [ ] All test imports updated
- [ ] All tests using mocks still pass

---

## Story Prioritization & Sprint Planning

### Sprint 1: Foundational Refactoring (Week 1)
**Goal:** Update core types, services, and validation
- US-REFACTOR-001: Type definitions (2 pts) - **Day 1**
- US-REFACTOR-002: API service layer (3 pts) - **Days 2-3**
- US-REFACTOR-003: Validation logic (2 pts) - **Day 3**
- US-REFACTOR-004: Custom hooks (3 pts) - **Days 4-5**
- US-REFACTOR-008: Storage utilities (2 pts) - **Day 5**

**Sprint 1 Total:** 12 story points

### Sprint 2: Component Refactoring (Week 2)
**Goal:** Update all React components and UI
- US-REFACTOR-005: Subject List component (5 pts) - **Days 1-2**
- US-REFACTOR-006: Subject List Item (3 pts) - **Day 3**
- US-REFACTOR-007: Subject Form (3 pts) - **Days 4-5**

**Sprint 2 Total:** 11 story points

### Sprint 3: Testing & Documentation (Week 3)
**Goal:** Update all tests and documentation
- US-REFACTOR-009: Integration tests (3 pts) - **Days 1-2**
- US-REFACTOR-010: E2E tests (5 pts) - **Days 2-4**
- US-REFACTOR-012: Mock data (1 pt) - **Day 4**
- US-REFACTOR-011: Documentation (2 pts) - **Day 5**

**Sprint 3 Total:** 11 story points

**Total Effort:** 34 story points (~3 weeks for small team)

---

## Success Metrics

### Technical Metrics
- **Test Coverage:** Maintain 90%+ coverage (currently 279 tests)
- **Linting:** Zero ESLint errors maintained
- **Bundle Size:** No increase in bundle size (currently 99.98 KB gzipped)
- **E2E Tests:** 19+ passing (2 may remain skipped)

### Quality Metrics
- **Accessibility:** WCAG 2.1 AA compliance maintained
- **Performance:** No regression in page load time (< 2 seconds)
- **Type Safety:** 100% TypeScript strict mode compliance
- **API Compatibility:** All backend `/subject` endpoints working

### Process Metrics
- **Code Review:** All PRs reviewed before merge
- **TDD Compliance:** All new code follows Red-Green-Refactor
- **Documentation:** README and memory files updated

---

## Risk Assessment

### High Risk Items
- **API Breaking Changes:** Backend `/class` → `/subject` endpoint change may affect other systems
  - **Mitigation:** Coordinate with backend team, ensure backward compatibility if needed

- **E2E Test Breakage:** 21 E2E tests need comprehensive updates
  - **Mitigation:** Update tests incrementally, use test.skip() for temporarily failing tests

### Medium Risk Items
- **State Management:** localStorage key change may lose user's persisted selection
  - **Mitigation:** Add migration logic in US-REFACTOR-008 to preserve selection

- **Component Re-renders:** Extensive renaming may cause performance regressions
  - **Mitigation:** Preserve React.memo() and useCallback() optimizations

### Low Risk Items
- **Documentation Drift:** Documentation may become outdated during refactoring
  - **Mitigation:** Update documentation in final sprint (US-REFACTOR-011)

---

## Dependencies & Blockers

### External Dependencies
- ✅ **Backend API:** `/subject` endpoint must be available and stable
- ✅ **Backend Docs:** OpenAPI spec at `http://localhost:3000/api-docs` confirmed

### Internal Dependencies
- All stories depend on US-REFACTOR-001 (type definitions)
- Component stories (005-007) depend on service layer (002, 004)
- Testing stories (009-010) depend on all component stories

### No Blockers Identified
- Backend API is already implemented and stable
- No architectural changes required
- Team has necessary skills for refactoring

---

## Stakeholder Communication Plan

### Development Team
- **Frequency:** Daily standups during refactoring
- **Channel:** Slack/Teams + PR comments
- **Updates:** Progress on story completion, blockers, test status

### Backend Team
- **Frequency:** Weekly sync meeting
- **Channel:** Shared Slack channel
- **Updates:** API compatibility, endpoint testing, data contract validation

### Product Stakeholders
- **Frequency:** End of each sprint demo
- **Channel:** Sprint review meeting
- **Updates:** Feature progress, user impact, timeline adjustments

---

## Technical Notes

### API Field Mapping

**Current Frontend "Class" → Backend "Subject":**
```typescript
// BEFORE (Frontend Class):
{
  id: 1,
  name: "Mathematics 101",
  year: 2024,
  createdAt: "...",
  updatedAt: "..."
}

// AFTER (Backend Subject):
{
  id: 1,
  name: "Mathematics 101",  // Keep name
  // year: REMOVED
  createdAt: "...",
  updatedAt: "..."
}
```

**Backend Class Entity (Future Use):**
```typescript
// Backend Class (not currently used in frontend):
{
  id: 1,
  subjectId: 5,           // NEW: FK to Subject
  name: "Advanced Math",  // Class name within subject
  year: 2024,             // Year now belongs to Class
  createdAt: "...",
  updatedAt: "..."
}
```

### File Rename Checklist

**23 Files to Rename:**

**Types:**
- `src/types/Class.ts` → `Subject.ts`
- `src/types/__tests__/Class.test.ts` → `Subject.test.ts`

**Services:**
- `src/services/api/classService.ts` → `subjectService.ts`
- `src/services/api/__tests__/classService.test.ts` → `subjectService.test.ts`
- `src/services/validation/classValidation.ts` → `subjectValidation.ts`
- `src/services/validation/__tests__/classValidation.test.ts` → `subjectValidation.test.ts`

**Hooks:**
- `src/hooks/useClasses.ts` → `useSubjects.ts`
- `src/hooks/__tests__/useClasses.test.ts` → `useSubjects.test.ts`

**Components:**
- `src/components/classes/` → `subjects/` (entire directory)
- `ClassList.tsx` → `SubjectList.tsx`
- `ClassListItem.tsx` → `SubjectListItem.tsx`
- `ClassForm.tsx` → `SubjectForm.tsx`
- `EmptyState.tsx` (keep name, update text)
- + 4 test files

**Utils:**
- `src/utils/classStorageUtils.ts` → `subjectStorageUtils.ts`
- `src/utils/__tests__/classStorageUtils.test.ts` → `subjectStorageUtils.test.ts`

**Tests:**
- `src/__tests__/integration/classManagement.test.tsx` → `subjectManagement.test.tsx`
- `e2e/classManagement.spec.ts` → `subjectManagement.spec.ts`

**Mocks:**
- `src/mocks/data/classes.ts` → `subjects.ts`

**Memory/Docs:**
- `.github/instructions/memory/features/class-management/` → `subject-management/`

---

## Acceptance Validation Strategy

### TDD Approach (Red-Green-Refactor)
1. **RED:** Update test files with new names/expectations → Confirm failures
2. **GREEN:** Rename/refactor implementation code → Confirm tests pass
3. **REFACTOR:** Improve code quality while keeping tests green

### Testing Pyramid
- **Unit Tests:** 279+ tests (maintain current coverage)
- **Integration Tests:** Full CRUD workflow testing
- **E2E Tests:** 19+ Playwright tests covering user journeys

### Manual Validation
- [ ] Dropdown shows subjects without year
- [ ] Create subject form has only name field
- [ ] Edit subject form has only name field
- [ ] localStorage persists subject selection
- [ ] All buttons use "Subject" terminology
- [ ] No console errors or TypeScript errors

---

## Rollback Plan

If critical issues arise during refactoring:

1. **Immediate Rollback:** Revert to previous git commit before refactoring started
2. **Partial Rollback:** Use git cherry-pick to selectively revert problematic stories
3. **Feature Flag:** If backend supports both `/class` and `/subject`, add runtime flag to switch between endpoints

**Rollback Risk:** LOW - Refactoring is isolated to frontend, backend `/subject` endpoint is stable

---

**Document Version:** 1.0.0
**Last Updated:** 2025-10-26
**Next Review:** After Sprint 1 completion
**Status:** Ready for Architecture Review (Optional) or Implementation
