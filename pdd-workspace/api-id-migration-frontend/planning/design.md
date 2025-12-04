# API ID Migration - Technical Design Document

**Feature:** API ID Type Migration (Number → MongoDB ObjectId String)
**Version:** 1.0
**Status:** APPROVED FOR IMPLEMENTATION
**Last Updated:** December 4, 2025

*This document contains the complete technical design. See design.md in the original .pdd folder for full implementation examples and patterns.*

## Design Overview

This is a **type-system migration** with minimal runtime behavior changes. The TypeScript type system guides the implementation, and comprehensive tests validate the changes.

### Design Philosophy
- **Minimal Disruption**: Preserve existing architecture and component APIs
- **Type Safety**: Let TypeScript compiler guide implementation
- **Incremental**: Entity-by-entity migration with validation at each step
- **Test-Driven**: Follow Red-Green-Refactor cycle for all changes

---

## Type System Design

### Entity Type Changes (All entities follow this pattern)

**Before (Integer IDs):**
```typescript
interface Subject {
  id: number
  name: string
  // ... other fields
}
```

**After (MongoDB ObjectId Strings):**
```typescript
interface Subject {
  id: string  // MongoDB ObjectId: "65a1b2c3d4e5f6g7h8i9j0k1"
  name: string
  // ... other fields
}
```

### Affected Type Files
- `/src/types/Subject.ts` - id: string
- `/src/types/Class.ts` - id: string, subjectId: string
- `/src/types/OutcomeComment.ts` - id: string, subjectId: string
- `/src/types/PersonalizedComment.ts` - id: string, subjectId: string
- `/src/types/FinalComment.ts` - id: string, classId: string

---

## Service Layer Design

### Pattern: String ID Parameters

**Before:**
```typescript
export async function getById(id: number): Promise<Subject> {
  return apiClient.get<Subject>(`/subject/${id}`)
}
```

**After:**
```typescript
export async function getById(id: string): Promise<Subject> {
  return apiClient.get<Subject>(`/subject/${id}`)
}
```

### Critical Design Decision
**NO ID CONVERSION LOGIC** - Never use `Number()`, `parseInt()`, or string-to-number conversions on IDs.
- IDs are MongoDB ObjectIds (strings by design)
- Numeric conversion would break data integrity
- TypeScript type system prevents this at compile time

---

## Mock Data Strategy

### ObjectId Generation Utility

Create `/src/mocks/utils/objectIdGenerator.ts`:
```typescript
export function generateMockObjectId(seed?: string): string {
  const timestamp = Math.floor(Date.now() / 1000)
    .toString(16)
    .padStart(8, '0')

  if (seed) {
    // Reproducible ID from seed
    const hash = Array.from(seed).reduce((h, c) => {
      return ((h << 5) - h) + c.charCodeAt(0)
    }, 0)
    const random = Math.abs(hash).toString(16).padStart(16, '0').slice(0, 16)
    return (timestamp + random).slice(0, 24)
  }

  // Random ID
  const random = Math.random().toString(16).slice(2, 18).padStart(16, '0')
  return (timestamp + random).slice(0, 24)
}

export function isValidObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id)
}
```

### Mock Data Files
- `/src/mocks/data/subjects.ts` - Use consistent ObjectIds for reproducibility
- `/src/mocks/data/classes.ts` - Reference mock subject IDs
- MSW handlers updated to validate string IDs

---

## Component & Hook Design

### Hooks (Automatic Type Update)
Hooks automatically return typed data from updated types:

```typescript
export function useSubjects() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  // Automatically returns Subject[] with id: string
  return { subjects }
}
```

**No code changes needed** - type change is automatic through TypeScript inference.

### Components (Props Interface Update)

**Before:**
```typescript
interface SubjectListItemProps {
  subject: { id: number; name: string }
  onDelete: (id: number) => void
}
```

**After:**
```typescript
interface SubjectListItemProps {
  subject: Subject  // Full type with id: string
  onDelete: (id: string) => void
}
```

**Component logic remains unchanged** - props interface handles type update.

---

## MSW Handler Design

### String ID Validation

**Before:**
```typescript
http.get('/subject/:id', ({ params }) => {
  const numId = Number(params.id)
  if (isNaN(numId) || !Number.isInteger(numId)) {
    return HttpResponse.json({ error: 'Invalid ID' }, { status: 400 })
  }
})
```

**After:**
```typescript
http.get('/subject/:id', ({ params }) => {
  const id = params.id  // Keep as string

  if (typeof id !== 'string' || !id.trim()) {
    return HttpResponse.json(
      { error: 'ID must be non-empty string' },
      { status: 400 }
    )
  }

  const subject = mockSubjects.find(s => s.id === id)
  // ...
})
```

---

## Data Flow

```
React Component
  ↓ (receives Subject with id: string)
Custom Hook (useSubjects)
  ↓ (returns Subject[] with id: string)
API Service (subjectService)
  ↓ (getById(id: string))
API Client (Axios)
  ↓ (GET /subject/65a1b2c3d4e5f...k1)
MSW Handler (test) / Real Backend (prod)
  ↓ (validates string ID)
Returns: { id: "65a1b2c3d4e5f...k1", ... }
```

---

## Testing Strategy

### Type Definition Tests
Verify TypeScript accepts string IDs:
```typescript
describe('Subject Type', () => {
  it('should have string id', () => {
    const subject: Subject = {
      id: '65a1b2c3d4e5f6g7h8i9j0k1',
      name: 'Math',
      // ...
    }
    expect(typeof subject.id).toBe('string')
  })
})
```

### Service Tests
Verify services accept and return string IDs:
```typescript
it('should get subject by string id', async () => {
  const id = '65a1b2c3d4e5f6g7h8i9j0k1'
  const subject = await subjectService.getById(id)
  expect(subject.id).toBe(id)
  expect(typeof subject.id).toBe('string')
})
```

### Component Tests
Verify components handle string ID props:
```typescript
it('should call onDelete with string id', () => {
  const onDelete = jest.fn()
  const subject: Subject = {
    id: '65a1b2c3d4e5f6g7h8i9j0k1',
    // ...
  }
  render(<SubjectListItem subject={subject} onDelete={onDelete} />)
  fireEvent.click(screen.getByRole('button'))
  expect(onDelete).toHaveBeenCalledWith('65a1b2c3d4e5f6g7h8i9j0k1')
})
```

---

## Migration Safety Mechanisms

### TypeScript Compiler Guards
- Update type definition
- Compiler reports all usages that need fixing
- Follow compiler errors systematically
- Compilation succeeds = migration complete

### Test Suite Safety
- All 313 tests use string ID mock data
- Tests fail if service returns wrong type
- Tests fail if component doesn't handle strings
- Full data flow validation

### Linting & Code Quality
- ESLint catches ID conversion patterns
- Checks for Number(), parseInt() on IDs
- Ensures clean implementation

---

## Performance Impact

**None** - String IDs have identical performance to numeric IDs:
- Memory: Negligible difference
- Comparison: String === is same speed as Number ===
- Serialization: Both serialize efficiently to JSON
- API transmission: HTTP transfer identical

---

## Backward Compatibility

**Breaking Changes:** None

- Component API semantics unchanged (only ID parameter type)
- Hook return shapes identical (only ID field type)
- REST endpoint contracts identical (only ID value type)
- All existing code patterns still work

---

## Rollback Strategy

**If rollback needed:**
```bash
git revert <commit-hash>
npm install
npm test
```

**Risk Level:** VERY LOW
**Rollback Time:** ~5 minutes

---

## Success Criteria

### Functional
- ✅ All CRUD operations work with string IDs
- ✅ Foreign key relationships preserved
- ✅ Filtering by ID works correctly
- ✅ No runtime type errors

### Technical
- ✅ TypeScript: 0 errors
- ✅ ESLint: 0 errors
- ✅ Tests: 313/313 passing
- ✅ No ID conversion patterns

### Operational
- ✅ Dev server starts without errors
- ✅ Manual smoke testing passes
- ✅ Code review approved
- ✅ Merged to main

---

**Design Status:** ✅ READY FOR IMPLEMENTATION

For detailed implementation patterns and examples, see the original technical design document in `.pdd/api-id-migration-frontend/design.md`.
