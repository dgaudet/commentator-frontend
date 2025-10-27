# TD-001: OutcomeCommentsModal Subject Type Compatibility

**Priority**: HIGH
**Effort**: 3-5 story points
**Status**: Not Started
**Related**: Class to Subject Refactoring Technical Debt

---

## Problem Statement

The OutcomeCommentsModal component currently expects a `Class` type with a `year` field, but the frontend has migrated to using `Subject` types which do not have a year field. A temporary workaround adds a runtime year field, creating type mismatches and maintainability issues.

**Current Workaround** (App.tsx:164-166):
```typescript
classData={outcomeCommentsModal.subjectItem
  ? { ...outcomeCommentsModal.subjectItem, year: new Date().getFullYear() }
  : { id: 0, name: '', year: 2024, createdAt: '', updatedAt: '' }}
```

---

## User Stories (EARS Format)

### US-TD-001-001: OutcomeCommentsModal Accepts Subject Type (HIGH - 3 pts)

**As a** developer
**I want** OutcomeCommentsModal to accept Subject type directly
**So that** we eliminate the runtime year field workaround

**Acceptance Criteria**:

WHEN the OutcomeCommentsModal component is rendered
THE SYSTEM SHALL accept either a Subject or Class type via props

WHEN a Subject is provided
THE SYSTEM SHALL display the subject name without requiring a year field

WHEN the modal title is rendered
THE SYSTEM SHALL show "Outcome Comments - [Subject Name]" format

WHEN outcome comments are loaded
THE SYSTEM SHALL use the subject ID to fetch comments via API

### US-TD-001-002: Update OutcomeCommentsModal Tests (MEDIUM - 2 pts)

**As a** developer
**I want** OutcomeCommentsModal tests to use Subject mocks
**So that** tests reflect the new Subject-based architecture

**Acceptance Criteria**:

WHEN OutcomeCommentsModal tests are executed
THE SYSTEM SHALL use Subject type mocks instead of Class type mocks

WHEN tests verify modal title rendering
THE SYSTEM SHALL assert against subject names without year references

WHEN tests verify API calls
THE SYSTEM SHALL mock subjectId-based API endpoints

---

## Technical Design

### Option 1: Generic Type Parameter (Recommended)

**Pros**:
- Supports both Class and Subject during transition
- Type-safe at compile time
- Minimal breaking changes

**Cons**:
- Slightly more complex type definitions

**Implementation**:
```typescript
interface OutcomeCommentsModalProps<T extends { id: number; name: string }> {
  isOpen: boolean
  entityData: T
  outcomeComments: OutcomeComment[]
  onCreateComment: (request: CreateOutcomeCommentRequest) => Promise<void>
  onUpdateComment: (id: number, request: UpdateOutcomeCommentRequest) => Promise<void>
  onDeleteComment: (id: number) => Promise<void>
  loading: boolean
  error: string | null
  onClose: () => void
}

export const OutcomeCommentsModal = <T extends { id: number; name: string }>({
  entityData,
  // ... other props
}: OutcomeCommentsModalProps<T>) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>Outcome Comments - {entityData.name}</h2>
      {/* Rest of implementation */}
    </Modal>
  )
}
```

### Option 2: Subject Type Only (Breaking Change)

**Pros**:
- Simpler implementation
- Enforces new architecture
- Removes Class dependency

**Cons**:
- Breaking change if any code still uses Class
- Requires all consumers to migrate

**Implementation**:
```typescript
interface OutcomeCommentsModalProps {
  isOpen: boolean
  subjectData: Subject
  outcomeComments: OutcomeComment[]
  // ... rest of props
}
```

### Recommended Approach: Option 1

Use generic type parameter to support both Class and Subject during transition, then simplify to Option 2 after Class deprecation.

---

## Implementation Tasks

### Task 1: Refactor OutcomeCommentsModal to Use Generic Type (RED)
**Risk**: Medium
**Effort**: 2 hours

1. Update `OutcomeCommentsModalProps` interface with generic type parameter
2. Replace `classData` prop with `entityData`
3. Update modal title to use `entityData.name`
4. Remove all references to `year` field
5. Verify TypeScript compilation

### Task 2: Update OutcomeCommentsModal Tests (RED)
**Risk**: Low
**Effort**: 1 hour

1. Create Subject mock data in test file
2. Update all test cases to use Subject mocks
3. Remove year field assertions
4. Update API mock calls to use subject IDs
5. Run tests and verify they fail appropriately

### Task 3: Implement Generic Type Support (GREEN)
**Risk**: Low
**Effort**: 1 hour

1. Implement generic component logic
2. Update modal title rendering
3. Update comment loading logic
4. Run tests and verify they pass

### Task 4: Update App.tsx to Remove Workaround (GREEN)
**Risk**: Low
**Effort**: 30 minutes

1. Remove year field workaround from App.tsx
2. Pass `subjectItem` directly to modal
3. Update prop name from `classData` to `entityData`
4. Run integration tests

### Task 5: Update Documentation (REFACTOR)
**Risk**: Trivial
**Effort**: 30 minutes

1. Update component JSDoc comments
2. Add migration notes for consumers
3. Update README if component is documented

---

## Validation Criteria

### Unit Tests
- [ ] All OutcomeCommentsModal tests pass with Subject mocks
- [ ] Generic type parameter correctly infers types
- [ ] Modal title displays subject name correctly
- [ ] No references to `year` field remain

### Integration Tests
- [ ] App.tsx integration tests pass
- [ ] Modal opens with Subject data
- [ ] Outcome comments load for subject

### Manual Testing
- [ ] Open modal from SubjectList
- [ ] Verify modal title shows subject name
- [ ] Create/edit/delete outcome comments
- [ ] Close modal without errors

---

## Migration Path

### Phase 1: Implement Generic Type (Breaking Change Avoidance)
1. Add generic type parameter
2. Support both `classData` and `subjectData` props (deprecated)
3. Update internal logic to use generic `entityData`

### Phase 2: Update Consumers
1. Update App.tsx to use `entityData` prop
2. Remove year field workaround
3. Update all tests

### Phase 3: Deprecate Class Support (Future)
1. Add deprecation warnings for `classData` prop
2. Update documentation
3. Remove Class support in next major version

---

## Dependencies

- Requires: Class to Subject refactoring complete (✅ DONE)
- Blocks: TD-002 (OutcomeComment classId → subjectId)
- Blocks: Full Subject feature completion

---

## Acceptance

This technical debt item is complete when:
1. OutcomeCommentsModal accepts Subject type without workarounds
2. All tests pass using Subject mocks
3. App.tsx no longer adds runtime year field
4. TypeScript compilation has no errors
5. Manual testing confirms modal works with subjects
