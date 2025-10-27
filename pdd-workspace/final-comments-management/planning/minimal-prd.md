# Final Comments Management - Minimal PRD

**Feature**: Final Comments Management
**Complexity**: L1-MICRO (5-6 stories, 1-2 weeks)
**Priority**: HIGH - Core teacher functionality
**Created**: 2025-01-27

---

## 📋 Feature Overview

Enable teachers to manage student final comments for each class. Teachers need to record:
- Student first name (required) and last name (optional)
- Numerical grade (0-100 scale)
- Optional qualitative feedback comment (max 1000 characters)

**User Access**: Click "Final Comments" button on the Edit Class component to open the management modal.

---

## 🎯 Business Value

- **Core Functionality**: Teachers must record final grades and comments for report cards
- **Efficiency**: Centralized student grade management per class
- **Flexibility**: Support both numerical grades and qualitative feedback
- **Data Quality**: Validation ensures accurate grade entry (0-100 range)

---

## 👤 Target User

**Primary**: Teachers managing student grades and final report card comments
**Use Case**: End-of-semester grading and report card preparation
**Frequency**: Multiple times per semester (grade entry, updates, corrections)

---

## 📊 FinalComment Data Model

Based on API documentation at `http://localhost:3000/api-docs`:

```typescript
interface FinalComment {
  id: number;              // Auto-generated, read-only
  classId: number;         // Required - Associated class
  firstName: string;       // Required - Student first name (min 1 char)
  lastName?: string;       // Optional - Student last name (min 1 char if provided)
  grade: number;           // Required - Grade 0-100
  comment?: string;        // Optional - Qualitative feedback (max 1000 chars)
  createdAt: string;       // Auto-generated timestamp
  updatedAt: string;       // Auto-updated timestamp
}
```

**API Endpoints**:
- `POST /final-comment` - Create final comment
- `GET /final-comment?classId={id}` - List all final comments for a class
- `GET /final-comment/{id}` - Get single final comment
- `PUT /final-comment/{id}` - Update final comment
- `DELETE /final-comment/{id}` - Delete final comment

---

## 📝 User Stories

### US-FINAL-001: Access Final Comments Management
**Priority**: HIGH (MVP)
**Story Points**: 2

**As a** teacher
**I want to** click a "Final Comments" button on the Edit Class component
**So that** I can manage student grades and final comments for that class

**Acceptance Criteria**:
1. ✅ Edit Class component displays a "Final Comments" button
2. ✅ Button is visible and clearly labeled
3. ✅ Clicking button opens Final Comments modal
4. ✅ Modal displays the selected class name in the title
5. ✅ Button follows existing UI patterns (matches "Outcome Comments" button style)

**Technical Notes**:
- Follow pattern established by OutcomeComments button integration
- Button placement: Alongside existing class action buttons
- Pass classId context to modal

---

### US-FINAL-002: View List of Final Comments
**Priority**: HIGH (MVP)
**Story Points**: 3

**As a** teacher
**I want to** see a list of all student final comments for the selected class
**So that** I can review existing grades and comments

**Acceptance Criteria**:
1. ✅ Modal displays list of final comments for the selected class
2. ✅ Each final comment shows:
   - Student name (firstName + lastName if available)
   - Grade (0-100)
   - Comment text (if provided)
   - Created/Updated timestamps
3. ✅ Empty state message displayed when no final comments exist: "No final comments yet for this class. Add your first student grade!"
4. ✅ List updates automatically after create/update/delete operations
5. ✅ Loading spinner displayed while fetching data
6. ✅ Error message displayed if fetch fails
7. ✅ Final comments sorted by student firstName alphabetically (A-Z)

**Technical Notes**:
- API: `GET /final-comment?classId={classId}`
- Follow OutcomeCommentsModal list pattern
- Handle loading and error states

---

### US-FINAL-003: Add New Final Comment
**Priority**: HIGH (MVP)
**Story Points**: 5

**As a** teacher
**I want to** add a new student final comment with grade
**So that** I can record student grades and feedback for report cards

**Acceptance Criteria**:
1. ✅ Form displayed at top/bottom of modal with fields:
   - First Name (text input, required)
   - Last Name (text input, optional)
   - Grade (number input, required, 0-100)
   - Comment (textarea, optional, max 1000 chars)
2. ✅ "Add Final Comment" button submits the form
3. ✅ Form validation:
   - First Name: Required, minimum 1 character
   - Last Name: Optional, minimum 1 character if provided
   - Grade: Required, must be 0-100 (inclusive)
   - Comment: Optional, maximum 1000 characters
4. ✅ Validation errors displayed inline below each field
5. ✅ Cannot submit with validation errors
6. ✅ Success: New final comment appears in list immediately
7. ✅ Form clears after successful submission
8. ✅ Error message displayed if submission fails (e.g., "Failed to add final comment. Please try again.")
9. ✅ Loading state during submission (disable form, show spinner)

**Technical Notes**:
- API: `POST /final-comment`
- Payload: `{ classId, firstName, lastName?, grade, comment? }`
- Optimistic UI update optional but recommended
- Character counter for comment field (e.g., "850/1000 characters")

**Validation Rules**:
- `firstName`: Required, trim whitespace, min 1 char after trim
- `lastName`: Optional, trim whitespace, min 1 char if provided after trim
- `grade`: Required, integer or decimal 0-100 inclusive
- `comment`: Optional, max 1000 chars (enforce on client and respect backend limit)

---

### US-FINAL-004: Edit Existing Final Comment
**Priority**: MEDIUM (Post-MVP)
**Story Points**: 5

**As a** teacher
**I want to** edit an existing student final comment
**So that** I can correct grades or update feedback

**Acceptance Criteria**:
1. ✅ Each final comment has an "Edit" button
2. ✅ Clicking "Edit" switches item to edit mode (inline editing)
3. ✅ Edit form displays current values:
   - First Name (populated with current firstName)
   - Last Name (populated with current lastName)
   - Grade (populated with current grade)
   - Comment (populated with current comment)
4. ✅ "Save" button submits changes
5. ✅ "Cancel" button discards changes and returns to view mode
6. ✅ Same validation rules as Add (US-FINAL-003)
7. ✅ Success: Updated values appear in list immediately
8. ✅ Edit mode closes after successful save
9. ✅ Error message displayed if update fails
10. ✅ Loading state during save (disable form, show spinner)
11. ✅ Cannot edit multiple final comments simultaneously

**Technical Notes**:
- API: `PUT /final-comment/{id}`
- Payload: `{ classId, firstName, lastName?, grade, comment? }`
- Inline editing pattern (similar to OutcomeComments if implemented)

---

### US-FINAL-005: Delete Final Comment
**Priority**: MEDIUM (Post-MVP)
**Story Points**: 3

**As a** teacher
**I want to** delete a student final comment
**So that** I can remove incorrect or duplicate entries

**Acceptance Criteria**:
1. ✅ Each final comment has a "Delete" button
2. ✅ Clicking "Delete" shows confirmation dialog:
   - Message: "Are you sure you want to delete this final comment for [firstName lastName]? This action cannot be undone."
   - "Delete" button (destructive style)
   - "Cancel" button
3. ✅ Confirmation required before deletion
4. ✅ "Cancel" closes dialog without deleting
5. ✅ "Delete" removes final comment from list immediately
6. ✅ Success message: "Final comment deleted successfully"
7. ✅ Error message if deletion fails: "Failed to delete final comment. Please try again."
8. ✅ Loading state during deletion

**Technical Notes**:
- API: `DELETE /final-comment/{id}`
- Optimistic UI update recommended
- Confirmation dialog pattern (follow existing modal patterns)

---

### US-FINAL-006: Close Modal
**Priority**: LOW (Polish)
**Story Points**: 1

**As a** teacher
**I want to** close the Final Comments modal
**So that** I can return to the Edit Class view

**Acceptance Criteria**:
1. ✅ Modal has close button (× in header)
2. ✅ Clicking close button closes modal
3. ✅ Click outside modal closes it (if desired UX pattern)
4. ✅ ESC key closes modal
5. ✅ Unsaved changes warning if edit form is open (optional enhancement)

**Technical Notes**:
- Follow existing modal close patterns
- Accessibility: Focus management on close

---

## ✅ Acceptance Criteria Summary

**MVP Scope (Sprint 1)**:
- US-FINAL-001: Access Final Comments Management (2 points)
- US-FINAL-002: View List of Final Comments (3 points)
- US-FINAL-003: Add New Final Comment (5 points)
- **Total MVP**: 10 story points (~1 week)

**Post-MVP (Sprint 2)**:
- US-FINAL-004: Edit Existing Final Comment (5 points)
- US-FINAL-005: Delete Final Comment (3 points)
- US-FINAL-006: Close Modal (1 point)
- **Total Post-MVP**: 9 story points (~1 week)

**Overall**: 19 story points, 1-2 weeks

---

## 🎨 UI/UX Requirements

**Follow Existing Patterns**:
- Reuse OutcomeCommentsModal component structure
- Consistent button styles with OutcomeComments
- Same modal layout and spacing
- Existing form input components
- Consistent validation error styling

**Responsive Design**:
- Mobile-friendly form inputs
- Responsive modal (desktop and mobile)
- Touch-friendly button sizes

**Accessibility**:
- WCAG 2.1 AA compliance
- Proper ARIA labels
- Keyboard navigation support
- Screen reader friendly

---

## 🧪 Validation Rules

| Field | Required | Min | Max | Type | Notes |
|-------|----------|-----|-----|------|-------|
| firstName | Yes | 1 char | - | string | Trim whitespace |
| lastName | No | 1 char | - | string | Trim whitespace, min only if provided |
| grade | Yes | 0 | 100 | number | Inclusive range, integer or decimal |
| comment | No | - | 1000 chars | string | Character counter recommended |

**Client-Side Validation**:
- Real-time validation on blur
- Display errors inline below fields
- Clear, actionable error messages

**Error Messages**:
- First Name: "First name is required"
- Last Name: "Last name must be at least 1 character" (if provided)
- Grade: "Grade is required" / "Grade must be between 0 and 100"
- Comment: "Comment cannot exceed 1000 characters"

---

## 📈 Success Metrics

**Adoption**:
- % of classes with at least one final comment
- Average final comments per class
- Time to add first final comment after feature launch

**Usage**:
- Daily active teachers using Final Comments
- Average time spent in Final Comments modal
- Create/Edit/Delete operation counts

**Quality**:
- Form validation error rate
- API error rate (< 2%)
- User-reported bugs/issues

**Performance**:
- Modal open time (< 500ms)
- List load time (< 1s for 100 final comments)
- Form submission time (< 500ms)

---

## 🚧 Technical Constraints

**Backend**:
- API already implemented and documented
- No backend changes required
- Follow existing API contracts

**Frontend**:
- React 18.3.1 + TypeScript
- Vite build tool
- Test-Driven Development (TDD) mandatory
- Jest + React Testing Library + Playwright

**Testing**:
- 90%+ code coverage required
- E2E tests for complete workflows
- Component tests for all UI elements
- API integration tests

**Performance**:
- Modal opens in < 500ms
- API calls complete in < 1s
- Optimistic UI updates for better perceived performance

---

## 🔄 Dependencies & Risks

**Dependencies**:
- Backend API operational (`/final-comment` endpoints)
- Edit Class component exists and is accessible
- Existing modal component patterns established

**Risks**:
- **LOW**: API already exists and documented
- **LOW**: Following established patterns reduces risk
- **MEDIUM**: Form validation complexity (grade range, optional fields)

**Mitigation**:
- Comprehensive form validation testing
- Reuse existing validation utilities
- E2E tests covering all user flows

---

## 📅 Implementation Phases

**Phase 1 - MVP (Week 1)**:
1. US-FINAL-001: Add "Final Comments" button to Edit Class
2. US-FINAL-002: Display list of final comments
3. US-FINAL-003: Create new final comment with validation

**Phase 2 - Complete (Week 2)**:
4. US-FINAL-004: Edit existing final comment
5. US-FINAL-005: Delete final comment with confirmation
6. US-FINAL-006: Modal close and cleanup

---

## 🔗 Related Features

- **OutcomeComments**: Similar modal pattern, reference implementation
- **Edit Class**: Integration point for "Final Comments" button
- **Class Management**: Context for which class's final comments to manage

---

## ✅ Definition of Done

- [ ] All user stories implemented with acceptance criteria met
- [ ] 90%+ test coverage (unit + integration + E2E)
- [ ] All E2E tests passing
- [ ] Code reviewed and approved
- [ ] Accessibility audit passed (WCAG 2.1 AA)
- [ ] Performance targets met (< 500ms modal load)
- [ ] Documentation updated (component docs, API integration)
- [ ] Product Owner acceptance review completed
- [ ] No critical or high-severity bugs

---

## 📞 Stakeholders

**Product Owner**: Validates business requirements and acceptance criteria
**Frontend Developer**: Implements UI components following TDD
**QA Engineer**: Performs comprehensive testing and validation
**Teachers (End Users)**: Primary users, provide feedback during UAT

---

**Next Steps**:
1. Product Owner reviews and approves this PRD ✅
2. Hand off to System Architect for technical design (SKIPPED for L1)
3. Hand off to Frontend Developer for implementation
4. Begin Sprint 1 with MVP stories (US-FINAL-001 through US-FINAL-003)
