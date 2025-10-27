# TD-002: OutcomeComment Entity classId → subjectId Migration

**Priority**: MEDIUM
**Effort**: 5-8 story points
**Status**: Not Started
**Related**: Class to Subject Refactoring Technical Debt
**Dependencies**: Requires backend coordination

---

## Problem Statement

The OutcomeComment entity still uses `classId` as the foreign key field name, which is inconsistent with the Subject-based architecture. This creates naming confusion and requires backend coordination to update API contracts.

**Current Type**:
```typescript
interface OutcomeComment {
  id: number
  classId: number  // ← Should be subjectId
  comment: string
  upperRange: number
  lowerRange: number
  createdAt: string
  updatedAt: string
}
```

**Current API**:
- GET `/outcome-comment?classId=:id`
- POST `/outcome-comment` with `{ classId, comment, upperRange, lowerRange }`

---

## User Stories (EARS Format)

### US-TD-002-001: Update OutcomeComment Type Definition (HIGH - 2 pts)

**As a** developer
**I want** OutcomeComment to use `subjectId` instead of `classId`
**So that** entity relationships are clear and consistent

**Acceptance Criteria**:

WHEN the OutcomeComment type is defined
THE SYSTEM SHALL have a `subjectId` field instead of `classId`

WHEN TypeScript compilation occurs
THE SYSTEM SHALL show no type errors related to the field name change

WHEN existing code references `classId`
THE SYSTEM SHALL show TypeScript errors until updated

### US-TD-002-002: Update OutcomeComment Service API Calls (HIGH - 3 pts)

**As a** developer
**I want** outcomeCommentService to use `subjectId` parameter
**So that** API calls use consistent naming

**Acceptance Criteria**:

WHEN fetching outcome comments
THE SYSTEM SHALL use query parameter `?subjectId=:id` instead of `?classId=:id`

WHEN creating an outcome comment
THE SYSTEM SHALL send request body with `subjectId` field

WHEN updating an outcome comment
THE SYSTEM SHALL maintain `subjectId` in the updated entity

WHEN the service encounters errors
THE SYSTEM SHALL provide clear error messages referencing subjects

### US-TD-002-003: Update Backend API Contract (BACKEND - 3 pts)

**As a** backend developer
**I want** to update `/outcome-comment` endpoints to accept `subjectId`
**So that** API is consistent with frontend expectations

**Acceptance Criteria**:

WHEN GET `/outcome-comment?subjectId=:id` is called
THE SYSTEM SHALL return all outcome comments for that subject

WHEN POST `/outcome-comment` receives `{ subjectId, comment, ... }`
THE SYSTEM SHALL create outcome comment linked to that subject

WHEN backward compatibility is needed
THE SYSTEM SHALL support both `classId` and `subjectId` during transition period

WHEN API documentation is generated
THE SYSTEM SHALL reflect `subjectId` as the primary parameter

---

## Technical Design

### Frontend Changes

#### 1. Update OutcomeComment Type

**File**: `src/types/OutcomeComment.ts`

```typescript
export interface OutcomeComment {
  id: number
  subjectId: number  // Changed from classId
  comment: string
  upperRange: number
  lowerRange: number
  createdAt: string
  updatedAt: string
}

export interface CreateOutcomeCommentRequest {
  subjectId: number  // Changed from classId
  comment: string
  upperRange: number
  lowerRange: number
}

export interface UpdateOutcomeCommentRequest {
  comment?: string
  upperRange?: number
  lowerRange?: number
  // subjectId should not be updatable
}
```

#### 2. Update OutcomeComment Service

**File**: `src/services/api/outcomeCommentService.ts`

```typescript
const outcomeCommentService = {
  // GET /outcome-comment?subjectId=:id
  getBySubjectId: async (subjectId: number): Promise<OutcomeComment[]> => {
    const response = await apiClient.get<OutcomeComment[]>('/outcome-comment', {
      params: { subjectId },  // Changed from classId
    })
    return response.data
  },

  // POST /outcome-comment
  create: async (request: CreateOutcomeCommentRequest): Promise<OutcomeComment> => {
    const response = await apiClient.post<OutcomeComment>('/outcome-comment', request)
    return response.data
  },

  // ... rest of service
}
```

#### 3. Update useOutcomeComments Hook

**File**: `src/hooks/useOutcomeComments.ts`

```typescript
const loadOutcomeComments = async (subjectId: number) => {
  try {
    setLoading(true)
    setError(null)
    const comments = await outcomeCommentService.getBySubjectId(subjectId)
    setOutcomeComments(comments)
  } catch (err) {
    setError(`Failed to load outcome comments for subject`)
    // ...
  }
}
```

### Backend Changes (Coordinate with Backend Team)

#### 1. Database Migration

**Option A: Rename Column** (Breaking Change)
```sql
ALTER TABLE outcome_comment
RENAME COLUMN class_id TO subject_id;
```

**Option B: Add New Column + Migrate** (Non-Breaking)
```sql
-- Step 1: Add new column
ALTER TABLE outcome_comment
ADD COLUMN subject_id INTEGER REFERENCES subject(id);

-- Step 2: Migrate data (if class_id == subject_id in your schema)
UPDATE outcome_comment
SET subject_id = class_id;

-- Step 3: Make non-nullable
ALTER TABLE outcome_comment
ALTER COLUMN subject_id SET NOT NULL;

-- Step 4: Drop old column (after transition period)
ALTER TABLE outcome_comment
DROP COLUMN class_id;
```

#### 2. Update API Endpoints

**Controller Changes**:
```typescript
// GET /outcome-comment
async getOutcomeComments(@Query('subjectId') subjectId: number) {
  // Support both for backward compatibility during transition
  const id = subjectId || req.query.classId
  return this.outcomeCommentService.findBySubjectId(id)
}

// POST /outcome-comment
async createOutcomeComment(@Body() dto: CreateOutcomeCommentDto) {
  // Support both field names during transition
  const subjectId = dto.subjectId || dto.classId
  return this.outcomeCommentService.create({ ...dto, subjectId })
}
```

#### 3. Update API Documentation

Update OpenAPI/Swagger specs:
```yaml
/outcome-comment:
  get:
    parameters:
      - name: subjectId
        in: query
        required: true
        schema:
          type: integer
        description: ID of the subject to fetch comments for
```

---

## Implementation Tasks

### Frontend Tasks

#### Task 1: Update OutcomeComment Type Definition (RED)
**Risk**: High (breaks compilation)
**Effort**: 30 minutes

1. Update `src/types/OutcomeComment.ts`
2. Change `classId` → `subjectId` in interfaces
3. Run TypeScript compiler to find all usages
4. Document all compilation errors

#### Task 2: Update OutcomeComment Service (RED)
**Risk**: Medium
**Effort**: 1 hour

1. Update `outcomeCommentService.ts` to use `subjectId` parameter
2. Update function signatures
3. Update API request parameters
4. Update error messages to reference "subject"

#### Task 3: Update useOutcomeComments Hook (RED)
**Risk**: Medium
**Effort**: 1 hour

1. Update hook to use `subjectId` in function calls
2. Update error messages
3. Update internal state if needed

#### Task 4: Update All OutcomeComment Tests (RED)
**Risk**: Low
**Effort**: 2 hours

1. Update mock data to use `subjectId`
2. Update service tests
3. Update hook tests
4. Update component tests (OutcomeCommentsModal)
5. Verify all tests fail appropriately

#### Task 5: Update MSW Handlers (GREEN)
**Risk**: Low
**Effort**: 1 hour

1. Update `src/mocks/handlers.ts` outcome comment handlers
2. Change query parameter from `classId` to `subjectId`
3. Update request body validation
4. Update mock data

#### Task 6: Run All Tests (GREEN)
**Risk**: Low
**Effort**: 30 minutes

1. Run all unit tests
2. Run integration tests
3. Fix any remaining issues
4. Verify all tests pass

### Backend Tasks (Coordinate with Backend Team)

#### Task 7: Backend Database Migration (Backend)
**Risk**: High (data migration)
**Effort**: 3 hours

1. Create migration script
2. Test on development database
3. Test on staging database
4. Plan production migration with rollback

#### Task 8: Backend API Updates (Backend)
**Risk**: Medium
**Effort**: 2 hours

1. Update controller to accept `subjectId`
2. Support both `classId` and `subjectId` during transition
3. Update service layer
4. Update API documentation

#### Task 9: Backend Testing (Backend)
**Risk**: Low
**Effort**: 1 hour

1. Update API tests
2. Test both parameter names work
3. Integration test with frontend

---

## Migration Strategy

### Phase 1: Backend Preparation
1. Backend adds `subject_id` column (non-breaking)
2. Backend migrates data from `class_id` to `subject_id`
3. Backend supports both parameters in API
4. Deploy backend

### Phase 2: Frontend Migration
1. Update frontend types and code
2. Update all tests
3. Deploy frontend

### Phase 3: Cleanup
1. Backend deprecates `classId` parameter
2. Backend removes `class_id` column
3. Update API documentation
4. Deploy backend cleanup

---

## Testing Strategy

### Unit Tests
- [ ] OutcomeComment type uses `subjectId`
- [ ] Service calls use `subjectId` parameter
- [ ] Hook loads comments with `subjectId`
- [ ] All mock data uses `subjectId`

### Integration Tests
- [ ] Create outcome comment with `subjectId`
- [ ] Fetch outcome comments by `subjectId`
- [ ] Update outcome comment maintains `subjectId`
- [ ] Delete outcome comment works correctly

### E2E Tests
- [ ] Open outcome comments modal for subject
- [ ] Create comment successfully
- [ ] Edit comment successfully
- [ ] Delete comment successfully

### Backend Tests (Backend Team)
- [ ] API accepts `subjectId` parameter
- [ ] Database stores `subject_id` correctly
- [ ] Both parameters work during transition
- [ ] Migration script works on test data

---

## Rollback Plan

If issues arise after frontend deployment:

1. **Frontend Rollback**: Revert to previous version using `classId`
2. **Backend Maintains Compatibility**: Keep supporting both parameters
3. **Data Integrity**: No data loss since backend supports both fields
4. **Investigation**: Debug issues in development environment

---

## Dependencies

- **Requires**: TD-001 (OutcomeCommentsModal Subject compatibility)
- **Requires**: Backend team coordination and availability
- **Blocks**: Full Subject feature completion
- **Blocks**: Class infrastructure deprecation

---

## Communication Plan

### Backend Team Coordination

**Pre-Implementation**:
- [ ] Schedule meeting with backend team
- [ ] Review specification together
- [ ] Agree on timeline
- [ ] Agree on migration strategy
- [ ] Identify deployment window

**During Implementation**:
- [ ] Daily sync on progress
- [ ] Share test results
- [ ] Coordinate deployment timing

**Post-Deployment**:
- [ ] Monitor error logs
- [ ] Verify API metrics
- [ ] Confirm data integrity

---

## Acceptance Criteria

This technical debt item is complete when:
1. All OutcomeComment references use `subjectId` instead of `classId`
2. Backend API accepts `subjectId` parameter
3. All frontend tests pass with new naming
4. Backend tests pass with new naming
5. E2E tests confirm end-to-end functionality
6. No TypeScript compilation errors
7. API documentation updated
8. Both teams sign off on completion
