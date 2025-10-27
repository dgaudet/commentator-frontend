# Class Management - Implementation Guide

**Feature**: Class Management within Subjects
**Complexity**: L1-MICRO (15 story points)
**Approach**: Test-Driven Development (TDD)
**Timeline**: Sprint 1 (MVP - 8 pts), Sprint 2 (Post-MVP - 7 pts)

---

## Quick Start

This feature adds class management to subjects via a dropdown-based modal interface. Classes represent course sections within a subject (e.g., "Advanced Math - 2024").

**Key Pattern**: Follow the Personalized Comments implementation closely - very similar structure but with dropdown instead of list view.

---

## Implementation Phases

### Phase 1: Foundation & Types (Day 1)
**Story**: Setup | **Effort**: 1-2 hours

1. **Create Type Definitions** (`src/types/Class.ts`):
```typescript
export interface Class {
  id: number
  subjectId: number
  name: string
  year: number
  createdAt: string
  updatedAt: string
}

export interface CreateClassRequest {
  subjectId: number
  name: string
  year: number
}

export interface UpdateClassRequest {
  name: string
  year: number
}
```

2. **Update Type Index** (`src/types/index.ts`):
```typescript
export type { Class, CreateClassRequest, UpdateClassRequest } from './Class'
```

3. **Write Type Tests** (`src/types/__tests__/Class.test.ts`):
- Test type structure
- Test required fields
- Test optional fields

**Validation**: Run `npm test` - new tests should pass

---

### Phase 2: Service Layer (Day 1-2)
**Stories**: US-CLASS-001, US-CLASS-002 (partial) | **Effort**: 2-3 hours

1. **Create API Service** (`src/services/api/classService.ts`):
```typescript
import { apiClient } from './apiClient'
import type { Class, CreateClassRequest, UpdateClassRequest } from '../../types'

export const classService = {
  async getBySubjectId(subjectId: number): Promise<Class[]> {
    const response = await apiClient.get<Class[]>(`/class?subjectId=${subjectId}`)
    return response.data
  },

  async create(request: CreateClassRequest): Promise<Class> {
    const response = await apiClient.post<Class>('/class', request)
    return response.data
  },

  async update(id: number, request: UpdateClassRequest): Promise<Class> {
    const response = await apiClient.put<Class>(`/class/${id}`, request)
    return response.data
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/class/${id}`)
  },
}
```

2. **Write Service Tests** (`src/services/api/__tests__/classService.test.ts`):
- Test successful API calls
- Test error handling
- Test request/response transformation
- **Expected**: ~12-15 tests

3. **Create Mock Data** (`src/mocks/data/classes.ts`):
```typescript
export const mockClasses: Class[] = [
  { id: 1, subjectId: 1, name: 'Advanced Section', year: 2024, ... },
  { id: 2, subjectId: 1, name: 'Honors Section', year: 2024, ... },
  { id: 3, subjectId: 2, name: 'Period 1', year: 2025, ... },
]
```

4. **Add MSW Handlers** (`src/mocks/handlers.ts`):
- GET /class?subjectId={id}
- POST /class (with validation: name 1-100 chars, year 2000-2099, duplicate detection)
- PUT /class/{id}
- DELETE /class/{id}

**Validation**: Run `npm test` - service tests should pass

---

### Phase 3: Custom Hook (Day 2)
**Story**: US-CLASS-002, US-CLASS-003 (partial) | **Effort**: 2-3 hours

1. **Create Custom Hook** (`src/hooks/useClasses.ts`):
```typescript
import { useState, useCallback } from 'react'
import { classService } from '../services/api/classService'
import type { Class, CreateClassRequest, UpdateClassRequest } from '../types'

interface UseClassesReturn {
  classes: Class[]
  loading: boolean
  error: string | null
  loadClasses: (subjectId: number) => Promise<void>
  createClass: (request: CreateClassRequest) => Promise<void>
  updateClass: (id: number, request: UpdateClassRequest) => Promise<void>
  deleteClass: (id: number) => Promise<void>
  clearError: () => void
}

export const useClasses = (): UseClassesReturn => {
  // State management
  // CRUD operations with optimistic updates
  // Error handling
  return { ... }
}
```

2. **Write Hook Tests** (`src/hooks/__tests__/useClasses.test.ts`):
- Initial state
- Load classes (success/error)
- Create class (success/error)
- Update class (success/error)
- Delete class (success/error)
- Clear error
- **Expected**: ~10-12 tests

**Validation**: Run `npm test` - hook tests should pass

---

### Phase 4: UI Components (Day 3-5)
**Stories**: US-CLASS-001, US-CLASS-002, US-CLASS-003 | **Effort**: 6-8 hours

1. **Create Modal Component** (`src/components/classes/ClassManagementModal.tsx`):

**Key Sections**:
```typescript
// Props interface
interface ClassManagementModalProps<T extends { id: number; name: string }> {
  isOpen: boolean
  onClose: () => void
  entityData: T  // Subject data
  classes: Class[]
  onCreateClass: (request: CreateClassRequest) => Promise<void>
  onUpdateClass: (id: number, request: UpdateClassRequest) => Promise<void>
  onDeleteClass: (id: number) => Promise<void>
  loading: boolean
  error: string | null
}

// State
const [selectedClassId, setSelectedClassId] = useState<number | null>(null)
const [isAdding, setIsAdding] = useState(false)
const [isEditing, setIsEditing] = useState(false)
const [formData, setFormData] = useState({ name: '', year: new Date().getFullYear() })
const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)
const [validationError, setValidationError] = useState('')

// Validation function
const validateClass = (name: string, year: number): string | null => {
  if (!name.trim()) return 'Class name is required'
  if (name.length > 100) return 'Class name cannot exceed 100 characters'
  if (year < 2000 || year > 2099) return 'Year must be between 2000 and 2099'

  // Duplicate check (case-insensitive)
  const duplicate = classes.find(c =>
    c.name.toLowerCase() === name.toLowerCase() &&
    c.year === year &&
    c.id !== selectedClassId
  )
  if (duplicate) return 'A class with this name and year already exists'

  return null
}

// Render structure
return (
  <div role="dialog" aria-labelledby="modal-title" aria-modal="true">
    {/* Modal Header */}
    <h2 id="modal-title">Manage Classes - {entityData.name}</h2>

    {/* Dropdown Selector */}
    <select value={selectedClassId || ''} onChange={handleSelectClass}>
      <option value="">Select a class...</option>
      {sortedClasses.map(c => (
        <option key={c.id} value={c.id}>{c.name} - {c.year}</option>
      ))}
    </select>

    {/* Add/Edit Form */}
    {(isAdding || isEditing) && (
      <div className="class-form">
        <input type="text" value={formData.name} placeholder="Class name" />
        <input type="number" value={formData.year} min="2000" max="2099" />
        <button onClick={handleSave}>Save</button>
        <button onClick={handleCancel}>Cancel</button>
      </div>
    )}

    {/* Selected Class Details */}
    {selectedClass && !isEditing && (
      <div className="class-details">
        <p>Name: {selectedClass.name}</p>
        <p>Year: {selectedClass.year}</p>
        <p>Created: {formatDate(selectedClass.createdAt)}</p>
        <button onClick={handleEditStart}>Edit</button>
        <button onClick={handleDeleteStart}>Delete</button>
      </div>
    )}

    {/* Empty State */}
    {classes.length === 0 && (
      <div className="empty-state">
        <p>No classes yet - add your first class</p>
      </div>
    )}

    {/* Add Button */}
    <button onClick={() => setIsAdding(true)}>Add Class</button>

    {/* Delete Confirmation */}
    <ConfirmDialog
      isOpen={deleteConfirmId !== null}
      title="Delete Class"
      message="Are you sure you want to delete this class?"
      onConfirm={handleDeleteConfirm}
      onCancel={handleDeleteCancel}
    />
  </div>
)
```

2. **Write Component Tests** (`src/components/classes/__tests__/ClassManagementModal.test.tsx`):
- Rendering (modal, dropdown, empty state)
- Dropdown selection
- Create class (form, validation, success)
- Edit class (enter edit mode, save, cancel)
- Delete class (confirmation, success, cancel)
- Validation errors
- Accessibility (ARIA attributes, keyboard nav)
- **Expected**: ~20-25 tests

**Validation**: Run `npm test` - component tests should pass

---

### Phase 5: Integration with App (Day 5-6)
**Story**: US-CLASS-001 (completion) | **Effort**: 2-3 hours

1. **Update SubjectListItem** (`src/components/subjects/SubjectListItem.tsx`):
```typescript
interface SubjectListItemProps {
  // ... existing props
  onViewClasses?: (id: number) => void  // NEW
}

// Add button (teal/cyan color for differentiation)
{onViewClasses && (
  <button
    onClick={() => onViewClasses(subjectItem.id)}
    className="text-teal-600 hover:text-teal-700..."
    aria-label={`Manage classes for ${subjectItem.name}`}
  >
    Manage Classes
  </button>
)}
```

2. **Update SubjectList** (`src/components/subjects/SubjectList.tsx`):
```typescript
interface SubjectListProps {
  // ... existing props
  onViewClasses?: (subjectItem: Subject) => void  // NEW
}

const handleViewClasses = useCallback((subjectId: number) => {
  const subject = subjects.find(s => s.id === subjectId)
  if (subject && onViewClasses) {
    onViewClasses(subject)
  }
}, [subjects, onViewClasses])

// Pass to SubjectListItem
<SubjectListItem
  // ... existing props
  onViewClasses={onViewClasses ? handleViewClasses : undefined}
/>
```

3. **Update App.tsx** (`src/App.tsx`):
```typescript
// Import
import { ClassManagementModal } from './components/classes/ClassManagementModal'
import { useClasses } from './hooks/useClasses'

// State
const [classModal, setClassModal] = useState<{
  isOpen: boolean
  subjectItem?: Subject
}>({ isOpen: false })

// Hook
const {
  classes,
  loading: classesLoading,
  error: classesError,
  loadClasses,
  createClass,
  updateClass,
  deleteClass,
  clearError: clearClassesError,
} = useClasses()

// Handlers
const handleViewClasses = async (subjectItem: Subject) => {
  setClassModal({ isOpen: true, subjectItem })
  await loadClasses(subjectItem.id)
}

const handleClassModalClose = () => {
  setClassModal({ isOpen: false })
  clearClassesError()
}

// Render
<SubjectList
  // ... existing props
  onViewClasses={handleViewClasses}
/>

<ClassManagementModal
  isOpen={classModal.isOpen}
  entityData={classModal.subjectItem || { id: 0, name: '', ...}}
  classes={classes}
  onCreateClass={createClass}
  onUpdateClass={updateClass}
  onDeleteClass={deleteClass}
  loading={classesLoading}
  error={classesError}
  onClose={handleClassModalClose}
/>
```

4. **Update Tests**:
- Add tests for new SubjectListItem button
- Add tests for SubjectList class handler
- Add tests for App.tsx integration

**Validation**: Run `npm test` - all tests should pass (estimate: 350+ tests)

---

### Phase 6: E2E Tests (Day 6-7)
**All Stories** | **Effort**: 3-4 hours

1. **Create E2E Test File** (`e2e/classManagement.spec.ts`):

**Test Scenarios**:
```typescript
describe('Class Management E2E', () => {
  // Modal Access
  test('should open class modal from subject item', async () => {
    // Click "Manage Classes" button
    // Verify modal opens
    // Verify subject name in title
  })

  // View Classes
  test('should display classes in dropdown', async () => {
    // Open modal
    // Verify dropdown has classes
    // Verify sorting (year DESC, name ASC)
  })

  test('should show empty state when no classes', async () => {
    // Open modal for subject with no classes
    // Verify empty state message
  })

  // Create Class
  test('should create new class successfully', async () => {
    // Open modal
    // Click "Add Class"
    // Fill form (name, year)
    // Submit
    // Wait for class to appear in dropdown (deterministic wait)
    // Verify class added and auto-selected
  })

  test('should validate class creation', async () => {
    // Try empty name - verify error
    // Try invalid year - verify error
    // Try duplicate - verify error
  })

  // Edit Class
  test('should edit existing class', async () => {
    // Select class from dropdown
    // Click "Edit"
    // Modify form
    // Save
    // Wait for updated class in dropdown
  })

  test('should cancel edit without saving', async () => {
    // Start edit
    // Modify data
    // Cancel
    // Verify original data preserved
  })

  // Delete Class
  test('should delete class with confirmation', async () => {
    // Select class
    // Click "Delete"
    // Verify confirmation dialog
    // Confirm
    // Wait for class to disappear from dropdown
  })

  test('should cancel delete operation', async () => {
    // Start delete
    // Cancel in confirmation
    // Verify class still exists
  })

  // Error Handling
  test('should handle loading states', async () => {
    // Verify loading spinner appears
  })

  // Accessibility
  test('should have proper ARIA attributes', async () => {
    // Check role="dialog"
    // Check aria-labelledby
    // Check aria-modal="true"
  })

  test('should support keyboard navigation', async () => {
    // Tab through dropdown
    // Arrow keys for selection
    // Enter to select
  })
})
```

**CRITICAL**: Use deterministic waits, NOT `waitForTimeout`:
```typescript
// ❌ BAD
await page.waitForTimeout(2000)

// ✅ GOOD
await expect(dropdown.locator('option:has-text("New Class")')).toBeVisible({ timeout: 5000 })
```

**Validation**: Run `npx playwright test e2e/classManagement.spec.ts`

---

### Phase 7: Polish & Documentation (Day 7)
**All Stories** | **Effort**: 1-2 hours

1. **Linting**:
```bash
npm run lint  # Must pass with 0 errors
```

2. **Test Coverage**:
```bash
npm run test:coverage  # Target: ≥90%
```

3. **Performance Check**:
- Modal open time < 2s
- Dropdown response < 200ms

4. **Accessibility Audit**:
```bash
# Manual checks
- Keyboard navigation works
- Screen reader compatible
- Color contrast sufficient
```

5. **Update Documentation**:
- Update toDos.md (mark Class Management as complete)
- Add comments to complex logic
- Update README if needed

---

## File Structure Summary

```
src/
├── types/
│   ├── Class.ts                           # NEW
│   ├── __tests__/Class.test.ts           # NEW
│   └── index.ts                          # MODIFIED
├── services/api/
│   ├── classService.ts                   # NEW
│   └── __tests__/classService.test.ts   # NEW
├── hooks/
│   ├── useClasses.ts                     # NEW
│   └── __tests__/useClasses.test.ts     # NEW
├── components/
│   ├── classes/
│   │   ├── ClassManagementModal.tsx      # NEW
│   │   └── __tests__/
│   │       └── ClassManagementModal.test.tsx  # NEW
│   └── subjects/
│       ├── SubjectListItem.tsx           # MODIFIED
│       └── SubjectList.tsx               # MODIFIED
├── mocks/
│   ├── data/classes.ts                   # NEW
│   └── handlers.ts                       # MODIFIED
├── App.tsx                               # MODIFIED
└── e2e/
    └── classManagement.spec.ts           # NEW
```

**Files Created**: 9 | **Files Modified**: 5

---

## Technical Decisions

### Why Dropdown Instead of List?
- **User Requirement**: "Select/edit one at a time"
- **UX Benefit**: Less visual clutter, familiar pattern
- **Accessibility**: Native `<select>` has built-in keyboard nav

### Why No Separate List/Form/Item Components?
- **Simpler Pattern**: All CRUD in one modal (like PersonalizedComments)
- **Less Complexity**: Fewer files to maintain
- **Faster Development**: Single component easier to reason about

### Why Auto-Select After Creation?
- **Better UX**: User can immediately edit or view details
- **Consistency**: Matches dropdown selection behavior

---

## Testing Strategy

### Unit Tests (Target: ≥90% coverage)
- Types: 3 tests
- Service: 13 tests
- Hook: 11 tests
- Component: 23 tests
- Integration: 5 tests
**Total**: ~55 unit tests

### E2E Tests (Comprehensive workflows)
- Modal access: 1 test
- View classes: 2 tests
- Create class: 2 tests
- Edit class: 2 tests
- Delete class: 2 tests
- Error handling: 1 test
- Accessibility: 2 tests
**Total**: ~12 E2E tests

---

## Common Pitfalls to Avoid

❌ **Don't**: Use `waitForTimeout` in E2E tests
✅ **Do**: Use `waitForSelector` or `expect().toBeVisible({ timeout })`

❌ **Don't**: Forget to trim whitespace in name validation
✅ **Do**: Always trim before comparison: `name.trim()`

❌ **Don't**: Allow duplicate (name + year) per subject
✅ **Do**: Check duplicates case-insensitively before submit

❌ **Don't**: Forget to clear form after successful creation
✅ **Do**: Reset form state after API success

❌ **Don't**: Hard-code current year
✅ **Do**: Use `new Date().getFullYear()` for default

❌ **Don't**: Skip confirmation dialog for delete
✅ **Do**: Always confirm destructive actions

---

## Performance Checklist

- [ ] Modal opens in < 2 seconds
- [ ] Dropdown selection responds in < 200ms
- [ ] API calls complete in < 500ms
- [ ] Bundle size impact < 15 KB gzipped
- [ ] No unnecessary re-renders (use React DevTools)
- [ ] Optimistic updates for instant feedback

---

## Accessibility Checklist

- [ ] Modal has `role="dialog"`
- [ ] Modal has `aria-labelledby` pointing to title
- [ ] Modal has `aria-modal="true"`
- [ ] Dropdown has associated `<label>` element
- [ ] All buttons have descriptive `aria-label` if icon-only
- [ ] Error messages have `role="alert"`
- [ ] Focus trapped within modal when open
- [ ] Keyboard navigation works (Tab, Shift+Tab, Enter, Esc)
- [ ] Color contrast ratio ≥ 4.5:1 for text
- [ ] Screen reader announces state changes

---

## Handoff Checklist

Before handing off to Frontend Developer:

- [x] PRD created and approved
- [x] User stories written with EARS format acceptance criteria
- [x] Complexity assessed (L1-MICRO)
- [x] API endpoints documented
- [x] Validation rules defined
- [x] Success metrics identified
- [x] Implementation guide provided
- [ ] Tech Lead review (if needed)
- [ ] Backend API confirmed working

**Ready for Development**: ✅ Yes

---

## Next Steps

1. **Hand Off to Frontend Developer**:
```bash
pdd handoff "Frontend Developer" "Implement Class Management feature following the PRD, user stories, and implementation guide. Use TDD approach and follow existing patterns from PersonalizedComments."
```

2. **Provide Context**:
- PRD: `pdd-workspace/class-management/planning/minimal-prd.md`
- User Stories: `pdd-workspace/class-management/planning/user-stories.md`
- Implementation Guide: `pdd-workspace/class-management/planning/implementation-guide.md`
- Metadata: `pdd-workspace/class-management/planning/metadata.json`

3. **Success Criteria**:
- All 7 user stories implemented
- All tests passing (unit + E2E)
- 90%+ code coverage
- 0 linting errors
- 0 accessibility violations

---

**End of Implementation Guide**

*Generated by Product Owner - PDD Framework*
*Last Updated: January 27, 2025*
