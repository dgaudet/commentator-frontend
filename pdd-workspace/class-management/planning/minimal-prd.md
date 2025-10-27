# Product Requirements Document: Class Management Feature

**Feature Name**: Class Management within Subjects
**Complexity Level**: L1-MICRO (1-2 weeks, 15 story points)
**PRD Version**: 1.0
**Date**: January 27, 2025
**Owner**: Product Owner
**Status**: Ready for Development

---

## Executive Summary

Enable teachers to manage classes (course sections) within their subjects through an intuitive dropdown-based interface. Teachers can add, edit, view, and delete classes, with each class having a name and academic year. This feature extends the existing Subject Management UI with a "Manage Classes" button that opens a modal containing a dropdown selector for one-at-a-time class management.

**Business Value**: Organizes student data by class/section within subjects, enabling more granular comment management and grade tracking.

---

## 1. Problem Statement

### Current State
- Teachers can create subjects (e.g., "Mathematics 101")
- No ability to subdivide subjects into classes/sections
- Final comments and grades cannot be organized by class year or section
- Teachers managing multiple sections must use workarounds

### Desired State
- Teachers can create multiple classes within each subject (e.g., "Advanced Math - 2024", "Honors Math - 2025")
- Classes are organized by year and name in an easy-to-use dropdown
- Each class can have its own final comments and student grades
- Clean separation between different class sections

### Success Metrics
- **Adoption**: 80% of subjects have at least one class created within 2 weeks
- **Usability**: Average time to create a class < 30 seconds
- **Performance**: Modal opens in < 2 seconds, dropdown responds in < 200ms
- **Quality**: < 2% error rate on class creation/update operations
- **Accessibility**: 0 WCAG 2.1 AA violations

---

## 2. User Personas & Use Cases

### Primary Persona: Middle/High School Teacher
**Background**: Teaches 3-5 subjects, each with 2-3 class sections per year
**Goals**:
- Organize students by class section
- Track multiple years of the same subject
- Quickly switch between classes when entering final comments

**Use Cases**:
1. Create new class at start of school year
2. Edit class name if section changes
3. View all classes for a subject to select the right one
4. Delete old classes after archiving data

### Secondary Persona: Elementary Teacher
**Background**: Teaches 1-2 subjects to a single class
**Goals**:
- Track year-over-year data
- Minimal complexity

**Use Cases**:
1. Create one class per subject per year
2. View previous years' classes for reference

---

## 3. Feature Scope

### Class Entity Definition

```typescript
interface Class {
  id: number              // Auto-generated unique identifier
  subjectId: number       // Foreign key to Subject entity
  name: string            // Class name (e.g., "Advanced Section", "Period 1")
  year: number            // Academic year (e.g., 2024, 2025)
  createdAt: string       // ISO 8601 timestamp (auto-generated)
  updatedAt: string       // ISO 8601 timestamp (auto-updated)
}
```

### Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| name | Required, 1-100 chars, trim whitespace | "Class name is required and must be 1-100 characters" |
| year | Required, integer, 2000-2099 | "Year must be a 4-digit number between 2000 and 2099" |
| name + year | Unique per subject (case-insensitive) | "A class with this name and year already exists for this subject" |
| subjectId | Must reference valid existing subject | "Invalid subject ID" |

### Business Rules
1. **Unique Constraint**: The combination of (subjectId, name, year) must be unique
2. **Deletion Warning**: Warn if class has associated final comments before deletion
3. **Year Default**: Form should default to current year
4. **Sorting**: Dropdown displays classes sorted by year (newest first), then name (A-Z)
5. **Immutable Timestamps**: `createdAt` cannot be modified after creation
6. **Auto-Update**: `updatedAt` reflects last modification time

---

## 4. User Stories (MVP Scope)

### Sprint 1: MVP - Core Functionality (8 Story Points)

#### US-CLASS-001: Navigate to Class Management (2 pts, HIGH)
**User Story**: As a teacher, I want to access class management from a subject, so that I can organize my classes within each subject.

**Acceptance Criteria**:
```
WHEN I view a subject in the Subject List
THE SYSTEM SHALL display a "Manage Classes" button on the SubjectListItem component

WHEN I click the "Manage Classes" button
THE SYSTEM SHALL open a Class Management modal
  AND THE SYSTEM SHALL load all classes for that subject
  AND THE SYSTEM SHALL display the subject name in the modal title

WHEN the modal is loading classes
THE SYSTEM SHALL display a loading spinner
  AND THE SYSTEM SHALL disable interaction until loading completes

WHEN loading classes fails
THE SYSTEM SHALL display an error message
  AND THE SYSTEM SHALL provide a retry option
```

**Technical Notes**:
- Add button next to "Outcome Comments" and "Personalized Comments" buttons
- Use consistent styling (green/teal color scheme for differentiation)
- Follow existing modal pattern from OutcomeComments/PersonalizedComments

---

#### US-CLASS-002: View Classes in Dropdown (3 pts, HIGH - MVP)
**User Story**: As a teacher, I want to view all my classes for a subject in a dropdown selector, so that I can select and manage one class at a time.

**Acceptance Criteria**:
```
WHEN the Class Management modal opens
THE SYSTEM SHALL display a dropdown selector with all classes for the subject

WHEN classes exist for the subject
THE SYSTEM SHALL display each class in the format "{name} - {year}"
  AND THE SYSTEM SHALL sort classes by year (newest first), then by name alphabetically

WHEN no classes exist
THE SYSTEM SHALL display "No classes yet - add your first class" message
  AND THE SYSTEM SHALL show the "Add Class" button prominently

WHEN I select a class from the dropdown
THE SYSTEM SHALL display the selected class details below the dropdown
  AND THE SYSTEM SHALL show Edit and Delete buttons for the selected class

WHEN the dropdown has more than 10 classes
THE SYSTEM SHALL make the dropdown scrollable
  AND THE SYSTEM SHALL support keyboard navigation (arrow keys, type-to-search)
```

**Technical Notes**:
- Use native `<select>` element for best accessibility
- Display format: "Advanced Math - 2024"
- Empty state should guide user to create first class
- Store selected class ID in component state

---

#### US-CLASS-003: Add New Class (3 pts, HIGH - MVP)
**User Story**: As a teacher, I want to create a new class within a subject, so that I can organize students by class/section.

**Acceptance Criteria**:
```
WHEN I click the "Add Class" button in the Class Management modal
THE SYSTEM SHALL display a class creation form
  WITH fields: name (text input), year (number input)

WHEN I enter a class name
THE SYSTEM SHALL validate it is not empty
  AND THE SYSTEM SHALL trim whitespace
  AND THE SYSTEM SHALL limit length to 1-100 characters

WHEN I enter a year
THE SYSTEM SHALL validate it is a 4-digit number between 2000 and 2099
  AND THE SYSTEM SHALL default to current year

WHEN I attempt to create a class with duplicate name + year for this subject
THE SYSTEM SHALL display error "A class with this name and year already exists"
  AND THE SYSTEM SHALL not submit the form

WHEN I submit a valid class
THE SYSTEM SHALL create the class via POST /class API
  AND THE SYSTEM SHALL add it to the dropdown
  AND THE SYSTEM SHALL automatically select the new class
  AND THE SYSTEM SHALL clear the form

WHEN class creation fails
THE SYSTEM SHALL display the error message
  AND THE SYSTEM SHALL keep the form data intact for retry
```

**Validation Rules**:
- `name`: Required, 1-100 chars, trim whitespace
- `year`: Required, integer, 2000-2099, default to current year
- Unique: name + year combination per subject (case-insensitive)

**Technical Notes**:
- Use optimistic UI updates for instant feedback
- Duplicate detection should be client-side and server-side
- Year input should use type="number" with min/max attributes

---

### Sprint 2: Post-MVP Enhancements (7 Story Points)

#### US-CLASS-004: Edit Existing Class (2 pts, MEDIUM)
**User Story**: As a teacher, I want to edit a class name or year, so that I can correct mistakes or update class information.

**Acceptance Criteria**:
```
WHEN I select a class from the dropdown
  AND I click the "Edit" button
THE SYSTEM SHALL enter edit mode for that class
  AND THE SYSTEM SHALL populate the form with current class data

WHEN I modify the name or year
THE SYSTEM SHALL validate the changes using the same rules as creation
  AND THE SYSTEM SHALL check for duplicate name + year (excluding current class)

WHEN I save valid changes
THE SYSTEM SHALL update the class via PUT /class/{id} API
  AND THE SYSTEM SHALL refresh the dropdown with updated info
  AND THE SYSTEM SHALL exit edit mode
  AND THE SYSTEM SHALL keep the class selected

WHEN I click "Cancel" during edit
THE SYSTEM SHALL discard changes
  AND THE SYSTEM SHALL exit edit mode
  AND THE SYSTEM SHALL restore original values
```

**Technical Notes**: Inline edit pattern, similar to Personalized Comments edit flow

---

#### US-CLASS-005: Delete Class (3 pts, MEDIUM)
**User Story**: As a teacher, I want to delete a class I no longer need, so that my class list stays organized and current.

**Acceptance Criteria**:
```
WHEN I select a class from the dropdown
  AND I click the "Delete" button
THE SYSTEM SHALL display a confirmation dialog
  WITH message "Are you sure you want to delete '{className} - {year}'? This action cannot be undone."

WHEN the class has associated final comments
THE SYSTEM SHALL display warning "This class has {count} final comments. Deleting the class will also delete all associated comments."
  AND THE SYSTEM SHALL require explicit confirmation

WHEN I confirm deletion
THE SYSTEM SHALL delete the class via DELETE /class/{id} API
  AND THE SYSTEM SHALL remove it from the dropdown
  AND THE SYSTEM SHALL clear the selection
  AND THE SYSTEM SHALL close the confirmation dialog

WHEN I cancel deletion
THE SYSTEM SHALL close the confirmation dialog
  AND THE SYSTEM SHALL keep the class selected

WHEN deletion fails
THE SYSTEM SHALL display the error message
  AND THE SYSTEM SHALL keep the class selected
```

**Business Rule**: Backend should return count of associated final comments to enable warning

---

#### US-CLASS-006: View Class Details (1 pt, LOW)
**User Story**: As a teacher, I want to view detailed information about a selected class, so that I can see when it was created and last modified.

**Acceptance Criteria**:
```
WHEN I select a class from the dropdown
THE SYSTEM SHALL display class details card below the dropdown
  WITH fields: Name, Year, Created Date, Last Updated Date

WHEN displaying dates
THE SYSTEM SHALL format them as "MMM DD, YYYY" (e.g., "Jan 15, 2024")

WHEN the class was never updated (createdAt === updatedAt)
THE SYSTEM SHALL only show "Created: {date}"

WHEN the class was updated (createdAt !== updatedAt)
THE SYSTEM SHALL show both "Created: {date}" and "Last Updated: {date}"
```

**Technical Notes**: Read-only metadata display, use existing `formatDate` utility

---

#### US-CLASS-007: Close Class Management Modal (1 pt, MEDIUM)
**User Story**: As a teacher, I want to return to the subject list, so that I can manage other aspects of my subjects.

**Acceptance Criteria**:
```
WHEN I click the X (close) button in the Class Management modal
THE SYSTEM SHALL close the modal
  AND THE SYSTEM SHALL return me to the Subject List

WHEN I have unsaved changes in the Add/Edit form
THE SYSTEM SHALL display warning "You have unsaved changes. Are you sure you want to close?"
  WITH options: "Discard Changes" and "Cancel"

WHEN I choose "Discard Changes"
THE SYSTEM SHALL close the modal without saving

WHEN I choose "Cancel"
THE SYSTEM SHALL keep the modal open
  AND THE SYSTEM SHALL preserve my unsaved changes

WHEN I click outside the modal backdrop
THE SYSTEM SHALL treat it the same as clicking the X button
```

**UX Note**: Prevent accidental data loss with unsaved changes warning

---

## 5. API Integration

### Endpoints (Already Implemented in Backend)

| Method | Endpoint | Purpose | Request Body | Response |
|--------|----------|---------|--------------|----------|
| GET | `/class?subjectId={id}` | Get all classes for a subject | None | `Class[]` |
| POST | `/class` | Create new class | `{ subjectId, name, year }` | `Class` |
| GET | `/class/{id}` | Get class by ID | None | `Class` |
| PUT | `/class/{id}` | Update class | `{ name, year }` | `Class` |
| DELETE | `/class/{id}` | Delete class | None | `{ message, deletedClass }` |

### Error Handling
- **400 Bad Request**: Validation errors (duplicate name+year, invalid year range)
- **404 Not Found**: Class or subject does not exist
- **500 Internal Server Error**: Database or server errors

---

## 6. UI/UX Design

### Component Structure
```
App.tsx
  └─ SubjectList
      └─ SubjectListItem
          ├─ "Edit" button
          ├─ "Delete" button
          ├─ "Outcome Comments" button (green)
          ├─ "Personalized Comments" button (purple)
          └─ "Manage Classes" button (teal) ← NEW
              └─ ClassManagementModal
                  ├─ Modal Header (Subject name + X button)
                  ├─ Class Dropdown Selector
                  ├─ Selected Class Details Card
                  ├─ Add/Edit Class Form
                  ├─ Action Buttons (Add, Edit, Delete)
                  └─ ConfirmDialog (for delete confirmation)
```

### Visual Design
- **Button Styling**: Teal/cyan color to differentiate from other buttons
- **Modal Layout**: Follow existing modal patterns (OutcomeComments, PersonalizedComments)
- **Dropdown**: Full-width, clearly labeled, with placeholder "Select a class..."
- **Form Fields**: Stacked vertically, clear labels, inline validation messages
- **Responsive**: Works on mobile devices (min-width: 320px)

### Accessibility (WCAG 2.1 AA)
- Modal has `role="dialog"`, `aria-labelledby`, `aria-modal="true"`
- Dropdown has proper `<label>` association
- All interactive elements keyboard accessible
- Focus trapped within modal
- Close button has `aria-label="Close modal"`
- Error messages have `role="alert"`
- Form validation provides clear, actionable messages

---

## 7. Technical Implementation Notes

### File Structure (Following Existing Patterns)
```
src/
├── types/
│   └── Class.ts                          # Class, CreateClassRequest, UpdateClassRequest
├── services/api/
│   └── classService.ts                   # CRUD API functions
├── hooks/
│   └── useClasses.ts                     # State management hook
├── components/classes/
│   ├── ClassManagementModal.tsx          # Main modal component
│   └── __tests__/
│       └── ClassManagementModal.test.tsx # Unit tests
├── mocks/
│   ├── data/classes.ts                   # Mock class data
│   └── handlers.ts                       # MSW handlers (add Class endpoints)
└── e2e/
    └── classManagement.spec.ts           # E2E tests
```

### Technology Stack
- **Frontend**: React 18.3.1, TypeScript 5.2.2 (strict mode)
- **HTTP Client**: Axios (existing `apiClient.ts`)
- **Date Formatting**: date-fns (already installed)
- **Testing**: Jest + React Testing Library (unit), Playwright (E2E)
- **API Mocking**: MSW (Mock Service Worker)

### Development Approach
1. **TDD (Test-Driven Development)**: Write tests before implementation
2. **Follow Existing Patterns**: Mirror OutcomeComments/PersonalizedComments architecture
3. **Atomic Commits**: Each story should be a separate commit
4. **Code Review**: Follow project's code review guidelines

---

## 8. Testing Strategy

### Unit Tests (Jest + React Testing Library)
- **Types**: Validate Class type definitions
- **Service Layer**: Test all API interactions, error handling, edge cases
- **Hook**: Test `useClasses` state management, CRUD operations
- **Component**: Test rendering, user interactions, validation, accessibility

**Target Coverage**: ≥90% code coverage

### E2E Tests (Playwright)
- Modal access from SubjectListItem
- View classes in dropdown
- Create new class (success and validation)
- Edit existing class
- Delete class with confirmation
- Error handling (network failures, validation errors)
- Keyboard navigation and accessibility

**Test Scenarios**: 12-15 comprehensive workflows

### Manual Testing Checklist
- [ ] Dropdown scrollable with 10+ classes
- [ ] Year defaults to current year
- [ ] Duplicate detection works correctly
- [ ] Confirmation dialog appears on delete
- [ ] Unsaved changes warning works
- [ ] Mobile responsive (320px - 1920px)
- [ ] Screen reader compatibility
- [ ] Keyboard-only navigation

---

## 9. Performance Requirements

| Metric | Target | Measurement |
|--------|--------|-------------|
| Modal Open Time | < 2 seconds | Time from button click to modal fully rendered |
| Dropdown Response | < 200ms | Time from selection to details display |
| API Response Time | < 500ms | Average response time for all /class endpoints |
| Bundle Size Impact | < 15 KB gzipped | New feature code only (excluding shared deps) |
| Test Execution | < 5 seconds | Unit test suite run time |

---

## 10. Security & Data Privacy

### Data Validation
- **Client-Side**: Immediate feedback, prevent invalid submissions
- **Server-Side**: Final validation, prevent malicious input
- **SQL Injection**: Use parameterized queries (backend responsibility)
- **XSS Prevention**: Sanitize all user inputs (React handles by default)

### Authorization
- Teachers can only manage classes for their own subjects
- Backend enforces user ownership checks (assume implemented)

### Data Retention
- Soft delete classes with final comments (keep audit trail)
- Hard delete classes without final comments

---

## 11. Rollout Plan

### Phase 1: MVP (Week 1)
- Implement US-CLASS-001, US-CLASS-002, US-CLASS-003
- Internal testing and bug fixes
- Deploy to staging environment

### Phase 2: Enhancement (Week 2)
- Implement US-CLASS-004, US-CLASS-005, US-CLASS-006, US-CLASS-007
- Full regression testing
- Deploy to production

### Rollback Plan
- Feature flag: `ENABLE_CLASS_MANAGEMENT` (default: true)
- If critical issues found, disable feature flag
- No data loss risk (classes stored independently)

---

## 12. Success Metrics & KPIs

### Adoption Metrics (2 weeks post-launch)
- **Target**: 80% of active subjects have ≥1 class
- **Measure**: `COUNT(DISTINCT classes.subjectId) / COUNT(subjects) * 100`

### Usability Metrics
- **Target**: Average class creation time < 30 seconds
- **Measure**: Time from "Add Class" click to successful creation

### Quality Metrics
- **Target**: < 2% error rate on class operations
- **Measure**: `failed_requests / total_requests * 100`

### Performance Metrics
- **Target**: Modal load time < 2 seconds (95th percentile)
- **Measure**: Client-side performance monitoring

### Accessibility Metrics
- **Target**: 0 WCAG 2.1 AA violations
- **Measure**: Automated accessibility audit tools (axe, pa11y)

---

## 13. Risks & Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Dropdown becomes unusable with 50+ classes | Medium | High | Add search/filter if > 20 classes |
| Year input confusion (2-digit vs 4-digit) | Low | Medium | Clear placeholder "YYYY", validation message |
| Duplicate detection false positives | Low | Medium | Case-insensitive, trim whitespace, clear error messages |
| Modal performance with large datasets | Low | High | Pagination or virtual scrolling if needed |
| Accidental deletion of classes with data | Medium | High | Confirmation dialog with warning about final comments |

---

## 14. Dependencies & Constraints

### Technical Dependencies
- ✅ Backend `/class` API endpoints (already implemented)
- ✅ React 18.3.1 + TypeScript 5.2.2
- ✅ Existing modal patterns (OutcomeComments, PersonalizedComments)
- ✅ Axios HTTP client configured
- ✅ MSW for API mocking

### External Dependencies
- None (self-contained feature)

### Constraints
- Must maintain consistent UX with existing comment modals
- Must follow TDD approach (tests first)
- Must achieve 90%+ test coverage
- Must pass accessibility audit

---

## 15. Future Enhancements (Out of Scope)

### Phase 3: Advanced Features (Future)
- **Class Archiving**: Archive old classes instead of deleting
- **Bulk Operations**: Create multiple classes at once
- **Class Templates**: Save common class configurations
- **Search/Filter**: Search classes by name or year
- **Sorting Options**: User-configurable sort order
- **Class Import/Export**: CSV import for batch class creation
- **Class Statistics**: View count of final comments per class

### Integration Features
- Link classes to external student information systems
- Sync class rosters from school database
- Export class reports to PDF

---

## 16. Approval & Sign-off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Product Owner | [Name] | 2025-01-27 | ✅ Approved |
| System Architect | [Name] | [Pending] | [N/A - L1 level] |
| Tech Lead | [Name] | [Pending] | [Pending Review] |
| QA Lead | [Name] | [Pending] | [Pending Review] |

---

## Appendix A: Story Point Breakdown

| Story ID | Title | Points | Justification |
|----------|-------|--------|---------------|
| US-CLASS-001 | Navigate to Class Management | 2 | Simple button + modal trigger, following existing pattern |
| US-CLASS-002 | View Classes in Dropdown | 3 | Dropdown logic, sorting, empty state, selection handling |
| US-CLASS-003 | Add New Class | 3 | Form with validation, API integration, optimistic updates |
| US-CLASS-004 | Edit Existing Class | 2 | Reuse creation logic, add edit mode toggle |
| US-CLASS-005 | Delete Class | 3 | Confirmation dialog, warning logic, API integration |
| US-CLASS-006 | View Class Details | 1 | Simple read-only display of metadata |
| US-CLASS-007 | Close Modal | 1 | Unsaved changes detection and warning |
| **Total** | | **15** | MVP: 8 points, Post-MVP: 7 points |

---

## Appendix B: Related Documentation

- [Subject Management Implementation](../../src/components/subjects/)
- [Outcome Comments Feature](../../src/components/outcomeComments/)
- [Personalized Comments Feature](../../src/components/personalizedComments/)
- [API Documentation](http://localhost:3000/api-docs)
- [CLAUDE.md - Development Guidelines](../../CLAUDE.md)
- [TDD Best Practices](../../.github/best-practices/tdd-best-practices.md)

---

**End of PRD**

*Generated by Product Owner Persona - PDD Framework*
*Last Updated: January 27, 2025*
