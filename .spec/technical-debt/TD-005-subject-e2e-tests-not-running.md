# TD-005: E2E Tests for Subject Management Not Running

**Priority**: MEDIUM
**Effort**: 1-3 story points
**Status**: Not Started
**Related**: Subject Management Infrastructure
**Dependencies**: Requires backend `/subject` API endpoints to be available

---

## Problem Statement

The Subject E2E test suite (`e2e/subjectManagement.spec.ts`) exists with 21 comprehensive test scenarios, but cannot run successfully because the backend API does not yet expose `/subject` endpoints. The tests are ready and validated, but will fail due to 404 responses from the API.

**Current Situation**:
- ✅ 21 Subject E2E test scenarios written and validated
- ✅ Tests follow Playwright best practices
- ✅ Tests mirror Class E2E test structure
- ❌ Backend API only exposes `/class` endpoints
- ❌ Tests will fail with 404 errors if executed

**Impact**:
- Cannot validate Subject feature end-to-end
- Risk of regression bugs going undetected
- Cannot confirm Subject components work with real API
- Blocks production deployment of Subject feature

---

## User Stories (EARS Format)

### US-TD-005-001: Backend Exposes Subject API Endpoints (HIGH - Backend - 2-3 pts)

**As a** frontend developer
**I want** the backend to expose `/subject` REST API endpoints
**So that** Subject E2E tests can validate real API integration

**Acceptance Criteria**:

WHEN GET `/subject` is called
THE SYSTEM SHALL return an array of all subjects for the authenticated user

WHEN POST `/subject` is called with valid payload `{ name: string }`
THE SYSTEM SHALL create a new subject and return the created entity with 201 status

WHEN GET `/subject/:id` is called with valid ID
THE SYSTEM SHALL return the subject entity

WHEN PUT `/subject/:id` is called with valid payload `{ name: string }`
THE SYSTEM SHALL update the subject and return the updated entity

WHEN DELETE `/subject/:id` is called with valid ID
THE SYSTEM SHALL delete the subject and return confirmation

WHEN duplicate subject name is submitted
THE SYSTEM SHALL return 409 Conflict error

WHEN invalid data is submitted
THE SYSTEM SHALL return 400 Bad Request with validation details

**Backend Implementation Notes**:
- Follow same patterns as `/class` endpoints
- Validate name: required, 1-100 characters
- Duplicate detection: case-insensitive name match per user
- NO year field (Subject has only id, name, createdAt, updatedAt)
- Support sorting by name (optional query param)

### US-TD-005-002: Run Subject E2E Tests in CI Pipeline (MEDIUM - 1 pt)

**As a** developer
**I want** Subject E2E tests to run in the CI pipeline
**So that** we catch regressions automatically

**Acceptance Criteria**:

WHEN the CI pipeline executes
THE SYSTEM SHALL run Subject E2E tests in addition to Class E2E tests

WHEN all tests pass
THE SYSTEM SHALL report 42 total E2E scenarios (21 Class + 21 Subject)

WHEN any test fails
THE SYSTEM SHALL fail the CI build and report failures

WHEN test artifacts are needed
THE SYSTEM SHALL capture screenshots and videos for failed tests

**CI Configuration Notes**:
- Update GitHub Actions workflow to include Subject tests
- Consider running Class and Subject tests in parallel for speed
- Ensure test database is seeded with Subject data
- Configure proper environment variables for backend URL

---

## Technical Design

### Backend API Endpoints Required

#### 1. GET /subject
**Description**: Fetch all subjects for authenticated user

**Response** (200):
```json
[
  {
    "id": 1,
    "name": "Mathematics 101",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
]
```

**Query Parameters** (Optional):
- `sortBy`: "name" (default)
- `sortOrder`: "ASC" | "DESC" (default: "ASC")

#### 2. POST /subject
**Description**: Create new subject

**Request Body**:
```json
{
  "name": "English 201"
}
```

**Response** (201):
```json
{
  "id": 2,
  "name": "English 201",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

**Error Responses**:
- 400: Invalid name (empty, too long)
- 409: Duplicate name (case-insensitive)
- 401: Unauthorized

#### 3. GET /subject/:id
**Description**: Fetch single subject by ID

**Response** (200):
```json
{
  "id": 1,
  "name": "Mathematics 101",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

**Error Responses**:
- 404: Subject not found
- 401: Unauthorized

#### 4. PUT /subject/:id
**Description**: Update existing subject

**Request Body**:
```json
{
  "name": "Advanced Mathematics"
}
```

**Response** (200):
```json
{
  "id": 1,
  "name": "Advanced Mathematics",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-16T14:20:00Z"
}
```

**Error Responses**:
- 400: Invalid name
- 404: Subject not found
- 409: Duplicate name
- 401: Unauthorized

#### 5. DELETE /subject/:id
**Description**: Delete subject

**Response** (200):
```json
{
  "message": "Subject deleted successfully",
  "deletedSubject": {
    "id": 1,
    "name": "Mathematics 101",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Error Responses**:
- 404: Subject not found
- 400: Cannot delete (has associated outcome comments)
- 401: Unauthorized

### Frontend Integration Points

#### 1. Update API Service
**File**: `src/services/api/subjectService.ts`

**Current Status**: ✅ Already implemented and ready

**Validation**:
- Ensure all 5 CRUD operations match backend contract
- Verify error handling for 400/404/409 responses
- Confirm TypeScript types match backend response structure

#### 2. E2E Test Configuration
**File**: `e2e/subjectManagement.spec.ts`

**Current Status**: ✅ Already implemented with 21 test scenarios

**Test Coverage**:
1. View subject list (empty state and populated)
2. Add new subject (valid and invalid cases)
3. Edit subject (including duplicate detection)
4. Delete subject (with confirmation)
5. Subject details display (name, dates, no year)
6. Sorting and filtering
7. localStorage persistence
8. Accessibility (keyboard navigation, ARIA)
9. Error handling and validation
10. Form submission and cancellation

**Required Changes**: None (tests are ready to run)

#### 3. Playwright Configuration
**File**: `playwright.config.ts`

**Current Status**: ✅ Already configured for both Class and Subject tests

**Validation**:
- Ensure `e2e/subjectManagement.spec.ts` is included in test discovery
- Verify baseURL points to correct backend API
- Confirm timeout settings are appropriate

### CI Pipeline Configuration

#### GitHub Actions Workflow
**File**: `.github/workflows/ci.yml` (or equivalent)

**Required Changes**:
```yaml
- name: Run E2E Tests
  run: |
    npm run test:e2e
    # This should automatically discover and run both:
    # - e2e/classManagement.spec.ts (21 scenarios)
    # - e2e/subjectManagement.spec.ts (21 scenarios)
```

**Environment Variables Needed**:
- `API_BASE_URL`: Backend API endpoint
- `TEST_USER_EMAIL`: Test user credentials (if auth required)
- `TEST_USER_PASSWORD`: Test user password (if auth required)

**Test Database Seeding**:
- Backend should seed test database with sample subjects
- Consider running migrations before E2E tests
- Ensure test isolation (reset database between test runs)

---

## Implementation Tasks

### Backend Tasks (Coordinate with Backend Team)

#### Task 1: Implement Subject Database Schema (Backend)
**Risk**: Medium
**Effort**: 2 hours

1. Create `subject` table with columns: `id`, `name`, `user_id`, `created_at`, `updated_at`
2. Add foreign key constraint on `user_id`
3. Create unique index on `(user_id, LOWER(name))` for duplicate detection
4. Run migration on development database
5. Verify schema matches Class table structure (minus `year` column)

#### Task 2: Implement Subject API Endpoints (Backend)
**Risk**: Medium
**Effort**: 4 hours

1. Create SubjectController with 5 CRUD endpoints
2. Implement validation (name required, 1-100 chars)
3. Implement duplicate detection (case-insensitive)
4. Add error handling (400, 404, 409, 401)
5. Add authorization checks (user can only access their subjects)
6. Add sorting support (name ASC/DESC)

#### Task 3: Write Backend API Tests (Backend)
**Risk**: Low
**Effort**: 2 hours

1. Unit tests for Subject service layer
2. Integration tests for Subject API endpoints
3. Test validation rules
4. Test duplicate detection
5. Test authorization
6. Verify all error responses

#### Task 4: Deploy Backend Changes to Development Environment (Backend)
**Risk**: Low
**Effort**: 1 hour

1. Deploy backend changes to dev environment
2. Run database migrations
3. Verify API endpoints are accessible
4. Test with Postman/curl
5. Seed test data if needed

### Frontend Tasks

#### Task 5: Verify Subject API Service Integration (Frontend)
**Risk**: Low
**Effort**: 1 hour

1. Review `src/services/api/subjectService.ts` for any needed updates
2. Verify error handling matches backend responses
3. Update TypeScript types if backend response structure differs
4. Add any missing error codes (409 Conflict)
5. Run unit tests for subjectService

#### Task 6: Run Subject E2E Tests Locally (Frontend)
**Risk**: Low
**Effort**: 1 hour

1. Point Playwright to development backend
2. Run `npx playwright test e2e/subjectManagement.spec.ts`
3. Verify all 21 scenarios pass
4. Fix any test flakiness or timing issues
5. Capture screenshots/videos for documentation

#### Task 7: Update CI Pipeline Configuration (Frontend)
**Risk**: Low
**Effort**: 30 minutes

1. Ensure GitHub Actions workflow runs Subject E2E tests
2. Add environment variables for backend URL
3. Configure test database seeding (if needed)
4. Verify CI runs both Class and Subject E2E tests
5. Update CI badge in README.md to show 42 E2E scenarios

---

## Testing Strategy

### Backend API Testing (Backend Team)

**Unit Tests**:
- [ ] Subject service creates subject with valid data
- [ ] Subject service validates name (required, length)
- [ ] Subject service detects duplicates (case-insensitive)
- [ ] Subject service filters by user_id
- [ ] Subject service sorts by name

**Integration Tests**:
- [ ] POST /subject creates subject and returns 201
- [ ] GET /subject returns all user's subjects
- [ ] PUT /subject updates subject and returns 200
- [ ] DELETE /subject deletes subject and returns 200
- [ ] POST /subject with duplicate name returns 409
- [ ] POST /subject with invalid name returns 400
- [ ] Unauthorized requests return 401

### Frontend E2E Testing

**Existing Test Scenarios** (Ready in `e2e/subjectManagement.spec.ts`):
- [ ] Display empty state when no subjects exist
- [ ] Display subject list when subjects exist
- [ ] Add new subject with valid name
- [ ] Prevent adding subject with empty name
- [ ] Prevent adding subject with name > 100 chars
- [ ] Prevent adding duplicate subject (case-insensitive)
- [ ] Edit subject name successfully
- [ ] Prevent editing to duplicate name
- [ ] Delete subject with confirmation
- [ ] Cancel delete operation
- [ ] Display subject details (name, dates, no year)
- [ ] Sort subjects by name
- [ ] Persist selected subject in localStorage
- [ ] Navigate with keyboard
- [ ] ARIA labels and roles
- [ ] Form validation messages
- [ ] Error handling for API failures
- [ ] Loading states
- [ ] Success messages
- [ ] Responsive layout

**CI Pipeline Validation**:
- [ ] CI runs 42 E2E scenarios (21 Class + 21 Subject)
- [ ] CI fails build if any E2E test fails
- [ ] CI captures screenshots/videos on failure
- [ ] CI reports test results clearly

---

## Coordination Plan

### Backend Team Communication

**Pre-Implementation**:
- [ ] Schedule kickoff meeting with backend team
- [ ] Share Subject API specification (this document)
- [ ] Review database schema design
- [ ] Agree on timeline and deployment window
- [ ] Confirm authentication/authorization approach

**During Implementation**:
- [ ] Daily standup sync on progress
- [ ] Share Postman collection for manual API testing
- [ ] Backend team notifies when dev deployment is ready
- [ ] Frontend team tests API manually before E2E run

**Post-Deployment**:
- [ ] Frontend team runs Subject E2E tests
- [ ] Report any issues to backend team
- [ ] Backend team monitors API logs for errors
- [ ] Coordinate production deployment

### Frontend Team Tasks

- [ ] Review this specification with team
- [ ] Assign Task 5 (API service verification)
- [ ] Assign Task 6 (E2E test execution)
- [ ] Assign Task 7 (CI configuration)
- [ ] Update project documentation

---

## Rollback Plan

If Subject E2E tests fail after backend deployment:

### Scenario 1: Backend API Issues
**Symptoms**: 500 errors, incorrect responses, validation failures

**Action**:
1. Backend team investigates logs
2. Backend team rolls back deployment if critical
3. Frontend continues using Class endpoints (no impact)
4. Fix backend issues in development
5. Re-deploy when ready

### Scenario 2: E2E Test Flakiness
**Symptoms**: Tests pass locally but fail in CI

**Action**:
1. Review Playwright configuration (timeouts, retries)
2. Check for timing issues in tests
3. Add explicit waits where needed
4. Re-run tests to confirm stability
5. Update tests if needed

### Scenario 3: API Contract Mismatch
**Symptoms**: Tests fail due to unexpected response structure

**Action**:
1. Compare backend response to specification
2. Determine if backend or frontend needs update
3. Update TypeScript types if needed
4. Update tests if API contract intentionally different
5. Re-run tests to confirm

---

## Dependencies

- **Requires**: Backend team availability and capacity
- **Requires**: Development environment with Subject API deployed
- **Blocks**: Production deployment of Subject feature
- **Blocks**: Full migration from Class to Subject architecture
- **Relates to**: TD-006 (Backend API Class Endpoints Deprecation)

---

## Success Metrics

### Performance Targets
- **API Response Time**: < 200ms for GET /subject
- **API Response Time**: < 300ms for POST/PUT/DELETE
- **E2E Test Execution Time**: < 5 minutes for all 21 Subject scenarios
- **CI Pipeline Total Time**: < 10 minutes including both Class and Subject E2E tests

### Quality Metrics
- **E2E Test Pass Rate**: 100% (all 21 scenarios pass)
- **API Error Rate**: < 1% in development environment
- **Test Flakiness**: 0 flaky tests (consistent pass/fail)
- **Test Coverage**: All CRUD operations validated end-to-end

---

## Acceptance Criteria

This technical debt item is complete when:

1. Backend exposes all 5 Subject API endpoints (`/subject`)
2. Backend API tests pass (unit and integration)
3. Backend deployed to development environment
4. All 21 Subject E2E tests pass consistently
5. CI pipeline runs both Class and Subject E2E tests (42 total)
6. CI badge updated to show 42 E2E scenarios
7. No flaky or unstable tests
8. API performance meets targets (< 200ms GET, < 300ms POST/PUT/DELETE)
9. Documentation updated (README.md, API docs)
10. Both frontend and backend teams sign off on completion
