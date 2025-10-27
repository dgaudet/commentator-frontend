# Class Management - User Stories

**Feature**: Class Management within Subjects
**Complexity**: L1-MICRO (15 story points, 1-2 weeks)
**Status**: Ready for Development

---

## Story Summary

| ID | Title | Priority | Points | Sprint |
|----|-------|----------|--------|--------|
| US-CLASS-001 | Navigate to Class Management | HIGH | 2 | MVP (1) |
| US-CLASS-002 | View Classes in Dropdown | HIGH | 3 | MVP (1) |
| US-CLASS-003 | Add New Class | HIGH | 3 | MVP (1) |
| US-CLASS-004 | Edit Existing Class | MEDIUM | 2 | Post-MVP (2) |
| US-CLASS-005 | Delete Class | MEDIUM | 3 | Post-MVP (2) |
| US-CLASS-006 | View Class Details | LOW | 1 | Post-MVP (2) |
| US-CLASS-007 | Close Modal | MEDIUM | 1 | Post-MVP (2) |

**MVP Total**: 8 points | **Post-MVP Total**: 7 points

---

## Class Entity

```typescript
interface Class {
  id: number              // Auto-generated
  subjectId: number       // FK to Subject
  name: string            // 1-100 chars, required
  year: number            // 2000-2099, required
  createdAt: string       // ISO 8601
  updatedAt: string       // ISO 8601
}
```

**Unique Constraint**: (subjectId + name + year) must be unique (case-insensitive)

---

## MVP Stories (Sprint 1 - 8 Points)

### US-CLASS-001: Navigate to Class Management
**Priority**: HIGH | **Points**: 2 | **Dependencies**: None

**As a** teacher
**I want to** access class management from a subject
**So that** I can organize my classes within each subject

**Acceptance Criteria**:
```
✓ "Manage Classes" button visible on SubjectListItem (teal color)
✓ Button positioned next to "Outcome Comments" and "Personalized Comments"
✓ Clicking button opens Class Management modal
✓ Modal displays subject name in title
✓ Modal loads classes for selected subject
✓ Loading spinner shown while fetching data
✓ Error message displayed if loading fails with retry option
```

**Technical Notes**:
- Add button to `SubjectListItem.tsx` component
- Create `ClassManagementModal.tsx` component
- Follow existing modal patterns (OutcomeComments/PersonalizedComments)

---

### US-CLASS-002: View Classes in Dropdown
**Priority**: HIGH (MVP) | **Points**: 3 | **Dependencies**: US-CLASS-001

**As a** teacher
**I want to** view all my classes for a subject in a dropdown selector
**So that** I can select and manage one class at a time

**Acceptance Criteria**:
```
✓ Dropdown displays all classes in format "{name} - {year}"
✓ Classes sorted by year DESC, then name ASC
✓ Empty state: "No classes yet - add your first class"
✓ Selecting a class displays details below dropdown
✓ Edit and Delete buttons appear for selected class
✓ Dropdown scrollable if > 10 classes
✓ Keyboard navigation supported (arrows, type-to-search)
```

**Technical Notes**:
- Use native `<select>` element for accessibility
- Store selected class ID in component state
- Display format example: "Advanced Math - 2024"

---

### US-CLASS-003: Add New Class
**Priority**: HIGH (MVP) | **Points**: 3 | **Dependencies**: US-CLASS-002

**As a** teacher
**I want to** create a new class within a subject
**So that** I can organize students by class/section

**Acceptance Criteria**:
```
✓ "Add Class" button displays creation form
✓ Form fields: name (text), year (number, default current year)
✓ Name validation: required, 1-100 chars, trim whitespace
✓ Year validation: 4-digit number, 2000-2099
✓ Duplicate detection: "A class with this name and year already exists"
✓ Successful creation adds to dropdown and auto-selects
✓ Form clears after successful creation
✓ Error message preserves form data for retry
```

**Validation Rules**:
- `name`: Required, 1-100 chars, trim whitespace
- `year`: Required, integer 2000-2099, default to current year
- Unique: (name + year) per subject, case-insensitive

**Technical Notes**:
- POST /class API endpoint
- Client-side and server-side duplicate detection
- Optimistic UI updates for instant feedback

---

## Post-MVP Stories (Sprint 2 - 7 Points)

### US-CLASS-004: Edit Existing Class
**Priority**: MEDIUM | **Points**: 2 | **Dependencies**: US-CLASS-003

**As a** teacher
**I want to** edit a class name or year
**So that** I can correct mistakes or update class information

**Acceptance Criteria**:
```
✓ "Edit" button enters edit mode for selected class
✓ Form populated with current class data
✓ Same validation rules as creation apply
✓ Duplicate check excludes current class
✓ Successful save updates dropdown and exits edit mode
✓ "Cancel" discards changes and exits edit mode
✓ Selected class remains selected after save
```

**Technical Notes**:
- PUT /class/{id} API endpoint
- Inline edit pattern similar to Personalized Comments

---

### US-CLASS-005: Delete Class
**Priority**: MEDIUM | **Points**: 3 | **Dependencies**: US-CLASS-004

**As a** teacher
**I want to** delete a class I no longer need
**So that** my class list stays organized and current

**Acceptance Criteria**:
```
✓ "Delete" button shows confirmation dialog
✓ Message: "Are you sure you want to delete '{name} - {year}'?"
✓ Warning if class has final comments: "This class has {count} final comments..."
✓ Confirm: deletes class, removes from dropdown, clears selection
✓ Cancel: closes dialog, keeps class selected
✓ Error message displayed if deletion fails
```

**Business Rule**: Backend returns count of associated final comments

**Technical Notes**:
- DELETE /class/{id} API endpoint
- Use ConfirmDialog component with danger variant

---

### US-CLASS-006: View Class Details
**Priority**: LOW | **Points**: 1 | **Dependencies**: US-CLASS-002

**As a** teacher
**I want to** view detailed information about a selected class
**So that** I can see when it was created and last modified

**Acceptance Criteria**:
```
✓ Details card shows: Name, Year, Created Date, Last Updated Date
✓ Dates formatted as "MMM DD, YYYY"
✓ If never updated (createdAt === updatedAt): show "Created: {date}" only
✓ If updated: show both "Created:" and "Last Updated:" dates
```

**Technical Notes**:
- Read-only metadata display
- Use existing `formatDate` utility from `src/utils/dateFormatter.ts`

---

### US-CLASS-007: Close Modal
**Priority**: MEDIUM | **Points**: 1 | **Dependencies**: All previous stories

**As a** teacher
**I want to** return to the subject list
**So that** I can manage other aspects of my subjects

**Acceptance Criteria**:
```
✓ X button closes modal and returns to Subject List
✓ Warning if unsaved changes: "You have unsaved changes. Are you sure?"
✓ "Discard Changes" closes modal without saving
✓ "Cancel" keeps modal open and preserves changes
✓ Clicking outside modal backdrop same as X button
```

**UX Note**: Prevent accidental data loss

---

## API Endpoints (Backend Already Implemented)

| Method | Endpoint | Purpose | Request | Response |
|--------|----------|---------|---------|----------|
| GET | `/class?subjectId={id}` | Get classes for subject | None | `Class[]` |
| POST | `/class` | Create class | `{ subjectId, name, year }` | `Class` |
| PUT | `/class/{id}` | Update class | `{ name, year }` | `Class` |
| DELETE | `/class/{id}` | Delete class | None | `{ message, deletedClass }` |

---

## Definition of Done

Each story is complete when:

✅ **Tests Written First** (TDD approach)
- [ ] Unit tests for types, service, hook, component
- [ ] E2E tests for user workflows

✅ **Implementation Complete**
- [ ] Code follows TypeScript strict mode
- [ ] No linting errors (ESLint + Stylelint)
- [ ] All files end with newline

✅ **Tests Passing**
- [ ] Unit tests: 90%+ coverage
- [ ] E2E tests: All scenarios passing
- [ ] No flaky tests (deterministic waits)

✅ **Accessibility**
- [ ] WCAG 2.1 AA compliant
- [ ] Keyboard navigation works
- [ ] Screen reader compatible

✅ **Performance**
- [ ] Modal opens < 2 seconds
- [ ] Dropdown responds < 200ms
- [ ] Bundle size impact < 15 KB gzipped

✅ **Documentation**
- [ ] Code comments for complex logic
- [ ] Component props documented
- [ ] README updated if needed

✅ **Review & Approval**
- [ ] Code review completed
- [ ] QA testing passed
- [ ] Product Owner acceptance

---

## Success Metrics

**Adoption** (2 weeks post-launch):
- Target: 80% of subjects have ≥1 class created
- Measure: `classes.subjectId / subjects * 100`

**Usability**:
- Target: < 30 seconds to create a class
- Measure: Time from "Add Class" to successful creation

**Quality**:
- Target: < 2% error rate
- Measure: `failed_requests / total_requests * 100`

**Performance**:
- Target: < 2s modal load (95th percentile)
- Measure: Client-side performance monitoring

**Accessibility**:
- Target: 0 WCAG violations
- Measure: axe/pa11y automated audit

---

**End of User Stories**

*Generated by Product Owner - PDD Framework*
*Last Updated: January 27, 2025*
