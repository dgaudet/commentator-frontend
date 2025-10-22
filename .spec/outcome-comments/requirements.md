# Outcome Comments Management - Requirements Specification

**Feature ID**: FEAT-OUTCOME-COMMENTS
**Complexity Level**: L1-MICRO
**Story Points**: 14
**Priority**: HIGH (MVP Feature)
**Created**: 2025-10-21
**Product Owner**: Approved
**Status**: Ready for Implementation

---

## Table of Contents

1. [Business Context](#1-business-context)
2. [OutcomeComment Entity Definition](#2-outcomecomment-entity-definition)
3. [User Stories](#3-user-stories)
4. [Validation Rules](#4-validation-rules)
5. [Success Metrics](#5-success-metrics)
6. [Prioritization Rationale](#6-prioritization-rationale)
7. [Non-Functional Requirements](#7-non-functional-requirements)

---

## 1. Business Context

### Problem Statement
Teachers need an efficient way to manage reusable outcome-based comments for report cards. These comments are associated with specific learning outcomes and can be reused across multiple students within a class, reducing repetitive typing and ensuring consistency in feedback.

### Opportunity Assessment
- Saves teachers significant time by creating reusable outcome-based comment templates
- Ensures consistency in learning outcome assessments across students
- Provides foundation for personalized comment generation (future feature)
- Integrates seamlessly with existing class management workflow

---

## 2. OutcomeComment Entity Definition

```typescript
interface OutcomeComment {
  id: number                  // Auto-generated integer ID
  classId: number            // Foreign key to Class entity
  commentText: string        // Comment text (10-500 chars, required)
  createdAt: string          // ISO 8601 timestamp (auto-generated)
  updatedAt: string          // ISO 8601 timestamp (auto-updated)
}
```

### Business Rules
1. **Unique per Class**: Each outcome comment belongs to exactly one class
2. **No Duplicates**: Duplicate comments (case-insensitive) not allowed within same class
3. **Immutable Timestamps**: `createdAt` cannot be modified after creation
4. **Auto-Timestamping**: `updatedAt` automatically reflects last modification time
5. **Soft Association**: Comments can exist independently (not tied to students yet)

---

## 3. User Stories

### US-OUTCOME-001: Navigate to Outcome Comments Management
**Priority**: HIGH (MVP)
**Estimate**: 2 story points
**Reference**: TASK-OC-2.1, TASK-OC-2.2

**As a** teacher
**I want to** access outcome comments management from the class list
**So that** I can quickly manage learning outcome comments for a specific class

#### Acceptance Criteria (EARS Format)

**AC-001.1: Button Visibility**
- **WHEN** a teacher views the class list
- **THE SYSTEM SHALL** display a "Manage Outcome Comments" button on each class item
- **AND** the button shall be visually distinct and clearly labeled
- **AND** the button shall be positioned consistently across all class items

**AC-001.2: Navigation Action**
- **WHEN** a teacher clicks the "Manage Outcome Comments" button for a class
- **THE SYSTEM SHALL** navigate to the Outcome Comments Management view
- **AND** preserve the selected class context (id, name, year)
- **AND** display the class name and year in the header

**AC-001.3: Accessibility**
- **WHEN** a teacher uses keyboard navigation (Tab key)
- **THE SYSTEM SHALL** allow focus on the "Manage Outcome Comments" button
- **AND** allow activation via Enter or Space key
- **AND** provide appropriate ARIA labels for screen readers
  - `aria-label="Manage outcome comments for {Class Name} {Year}"`

**AC-001.4: Loading State**
- **WHEN** navigation is in progress
- **THE SYSTEM SHALL** display a loading indicator
- **AND** prevent duplicate navigation actions
- **AND** maintain UI responsiveness

#### INVEST Analysis
- ✅ **Independent**: Can be implemented separately from create/delete functionality
- ✅ **Negotiable**: Button placement and styling can be discussed
- ✅ **Valuable**: Provides essential navigation to core feature
- ✅ **Estimable**: Clear scope, 2 story points
- ✅ **Small**: Fits within single sprint
- ✅ **Testable**: Clear success criteria with button presence and navigation

---

### US-OUTCOME-002: View Outcome Comments for a Class
**Priority**: HIGH (MVP)
**Estimate**: 3 story points
**Reference**: TASK-OC-4.2, TASK-OC-4.3

**As a** teacher
**I want to** view all outcome comments associated with a class
**So that** I can see what learning outcome comments are available for student assessments

#### Acceptance Criteria (EARS Format)

**AC-002.1: Display Outcome Comments List**
- **WHEN** a teacher navigates to the Outcome Comments Management view
- **THE SYSTEM SHALL** fetch all outcome comments for the selected class from the API (`GET /outcome-comment?classId=:id`)
- **AND** display them in a list format
- **AND** show comment text for each outcome comment (truncated if > 200 chars with "Show more")
- **AND** display creation timestamp in human-readable format (e.g., "Oct 21, 2025")
- **AND** display total count (e.g., "15 Comments")

**AC-002.2: Empty State**
- **WHEN** there are no outcome comments for the class
- **THE SYSTEM SHALL** display an empty state message
  - Primary text: "No outcome comments yet"
  - Secondary text: "Create your first outcome comment to get started"
- **AND** include a call-to-action button "Add Outcome Comment"
- **AND** provide helpful guidance on how outcome comments work

**AC-002.3: Loading State**
- **WHEN** outcome comments are being fetched
- **THE SYSTEM SHALL** display a loading spinner or skeleton UI
- **AND** disable interaction with the list
- **AND** provide screen reader announcement `aria-live="polite"` with "Loading comments..."
- **AND** show loading state for ≤ 2 seconds (performance target)

**AC-002.4: Error Handling**
- **WHEN** the API request fails (network error, 500, timeout)
- **THE SYSTEM SHALL** display a user-friendly error message
  - "Unable to load outcome comments. Please try again."
- **AND** provide a "Retry" button to re-fetch
- **AND** log the error to console for debugging
- **AND** maintain previous data if available (no blank screen)

**AC-002.5: List Sorting**
- **WHEN** outcome comments are displayed
- **THE SYSTEM SHALL** sort comments by creation date (newest first)
- **AND** display timestamps consistently (using date-fns format)
- **AND** maintain sort order after create/delete operations

#### INVEST Analysis
- ✅ **Independent**: Standalone read operation
- ✅ **Negotiable**: Display format and sorting can be adjusted
- ✅ **Valuable**: Core functionality for teachers to see existing comments
- ✅ **Estimable**: Standard list view, 3 story points
- ✅ **Small**: Single sprint deliverable
- ✅ **Testable**: Clear criteria for display, empty state, loading, and errors

---

### US-OUTCOME-003: Create New Outcome Comment
**Priority**: HIGH (MVP)
**Estimate**: 5 story points
**Reference**: TASK-OC-3.2, TASK-OC-3.3

**As a** teacher
**I want to** create a new outcome comment for a class
**So that** I can build a library of reusable learning outcome assessments

#### Acceptance Criteria (EARS Format)

**AC-003.1: Add Comment Form**
- **WHEN** a teacher clicks "Add Outcome Comment" button
- **THE SYSTEM SHALL** display a comment creation form
- **AND** include a multi-line text input field (textarea, 4-6 rows)
- **AND** include character counter showing current/maximum characters (e.g., "0/500")
- **AND** provide "Save" and "Cancel" buttons
- **AND** auto-focus the textarea on form open

**AC-003.2: Form Validation - Required Field**
- **WHEN** a teacher attempts to save without entering comment text
- **THE SYSTEM SHALL** display validation error "Comment text is required"
- **AND** prevent form submission
- **AND** focus the comment text field
- **AND** display error with `role="alert"` for screen readers

**AC-003.3: Form Validation - Character Limits**
- **WHEN** a teacher enters comment text
- **THE SYSTEM SHALL** enforce minimum length of 10 characters
  - Error: "Comment must be at least 10 characters"
- **AND** enforce maximum length of 500 characters
  - Error: "Comment cannot exceed 500 characters"
- **AND** display real-time character count (updates on input)
- **AND** show visual indicator:
  - Green: 10-450 chars (safe)
  - Yellow: 451-490 chars (approaching limit)
  - Red: 491-500 chars (at limit)
- **AND** trim whitespace before validation

**AC-003.4: Successful Creation**
- **WHEN** a teacher submits valid comment text
- **THE SYSTEM SHALL** send POST request to `/outcome-comment` endpoint
  - Payload: `{ classId: number, commentText: string }`
- **AND** display success message "Outcome comment created successfully" (3-second toast)
- **AND** add the new comment to the displayed list (optimistic update)
- **AND** clear the form for next entry
- **AND** maintain focus on textarea for rapid entry
- **AND** scroll to show the newly created comment

**AC-003.5: Duplicate Comment Handling**
- **WHEN** a teacher attempts to create a comment with identical text (case-insensitive)
- **THE SYSTEM SHALL** display warning "This comment already exists for this class"
- **AND** preserve the entered comment text (don't clear form)
- **AND** allow the teacher to either:
  - Edit the text to make it unique
  - Cancel form submission
- **AND** perform duplicate check client-side before API call

**AC-003.6: Error Handling**
- **WHEN** the API request fails during creation (400, 409, 500, network error)
- **THE SYSTEM SHALL** display user-friendly error message
  - 400: Display server validation errors
  - 409: "This comment already exists"
  - 500: "Server error. Please try again."
  - Network: "Connection error. Check your internet and retry."
- **AND** preserve the entered comment text (don't clear form)
- **AND** allow the teacher to retry submission
- **AND** rollback optimistic update if error occurs

**AC-003.7: Loading State During Save**
- **WHEN** the save request is in progress
- **THE SYSTEM SHALL** disable the Save button
  - Button text changes to "Saving..." with spinner icon
- **AND** prevent duplicate submissions (debounce)
- **AND** maintain form data during save
- **AND** show optimistic update immediately (comment appears in list)

#### INVEST Analysis
- ✅ **Independent**: Can be completed separately from delete functionality
- ✅ **Negotiable**: Validation rules and character limits can be adjusted
- ✅ **Valuable**: Core creation functionality
- ✅ **Estimable**: Standard form with validation, 5 story points
- ✅ **Small**: Fits within single sprint
- ✅ **Testable**: Clear validation rules and success criteria

---

### US-OUTCOME-004: Delete Outcome Comment
**Priority**: MEDIUM (MVP)
**Estimate**: 3 story points
**Reference**: TASK-OC-5.1, TASK-OC-5.2

**As a** teacher
**I want to** delete an outcome comment
**So that** I can remove comments that are no longer relevant or were created by mistake

#### Acceptance Criteria (EARS Format)

**AC-004.1: Delete Button Visibility**
- **WHEN** a teacher views the outcome comments list
- **THE SYSTEM SHALL** display a "Delete" button/icon for each comment
- **AND** position it consistently on each list item (right side)
- **AND** style it to indicate destructive action (red color #DC2626)
- **AND** include icon (trash can) with aria-label

**AC-004.2: Confirmation Dialog**
- **WHEN** a teacher clicks the Delete button
- **THE SYSTEM SHALL** display a confirmation modal/dialog
- **AND** show message:
  - Title: "Delete Outcome Comment"
  - Body: "Are you sure you want to delete this comment? This action cannot be undone."
  - Show comment preview (first 100 chars)
- **AND** provide "Delete" (red) and "Cancel" (gray) buttons
- **AND** trap keyboard focus within the dialog
- **AND** set `aria-modal="true"` and `role="dialog"`

**AC-004.3: Successful Deletion**
- **WHEN** a teacher confirms deletion
- **THE SYSTEM SHALL** send DELETE request to `/outcome-comment/:id` endpoint
- **AND** remove the comment from the displayed list immediately (optimistic update)
- **AND** display success message "Outcome comment deleted successfully" (3-second toast)
- **AND** close the confirmation dialog
- **AND** return focus to previous focusable element or next comment

**AC-004.4: Deletion with References Warning** (Future Consideration)
- **WHEN** the outcome comment is associated with student assessments (future feature)
- **THE SYSTEM SHALL** display enhanced warning message
  - "This comment is used in 5 student assessments. Deleting it may affect existing records."
- **AND** require explicit confirmation checkbox "I understand this affects existing data"
- **AND** provide "View Affected Students" link (if available)
- **NOTE**: MVP implementation skips this check (no student associations yet)

**AC-004.5: Error Handling**
- **WHEN** the API request fails during deletion (400, 404, 500, network error)
- **THE SYSTEM SHALL** display user-friendly error message
  - 404: "Comment not found. It may have been already deleted."
  - 500: "Server error. Please try again."
  - Network: "Connection error. Please check your internet."
- **AND** restore the comment to the list (rollback optimistic update)
- **AND** close confirmation dialog
- **AND** allow the teacher to retry deletion

**AC-004.6: Accessibility**
- **WHEN** using keyboard navigation
- **THE SYSTEM SHALL** allow Tab to Delete button
- **AND** support Enter/Space for activation
- **AND** support Escape to cancel confirmation dialog
- **AND** announce dialog state to screen readers
  - On open: "Delete confirmation dialog opened"
  - On delete: "Comment deleted successfully"
  - On error: "Deletion failed: [error message]"

#### INVEST Analysis
- ✅ **Independent**: Standalone delete operation
- ✅ **Negotiable**: Confirmation dialog design can be adjusted
- ✅ **Valuable**: Essential for comment lifecycle management
- ✅ **Estimable**: Standard delete with confirmation, 3 story points
- ✅ **Small**: Fits within single sprint
- ✅ **Testable**: Clear deletion flow and error handling criteria

---

### US-OUTCOME-005: Return to Class List
**Priority**: MEDIUM (SHOULD HAVE)
**Estimate**: 1 story point
**Reference**: TASK-OC-6.1

**As a** teacher
**I want to** navigate back to the class list from outcome comments management
**So that** I can manage comments for other classes or perform other class operations

#### Acceptance Criteria (EARS Format)

**AC-005.1: Back Navigation Button**
- **WHEN** a teacher is viewing the Outcome Comments Management view
- **THE SYSTEM SHALL** display a "Back to Classes" button in the header
- **AND** position it prominently (top-left corner, before class name)
- **AND** include back arrow icon (← or ‹) for visual clarity
- **AND** use consistent styling with existing navigation patterns

**AC-005.2: Navigation Action**
- **WHEN** a teacher clicks "Back to Classes"
- **THE SYSTEM SHALL** navigate to the class list view
- **AND** preserve the previous scroll position in the class list (if possible)
- **AND** maintain any filters or sorting that was applied
- **AND** clear outcome comments view state

**AC-005.3: Unsaved Changes Warning**
- **WHEN** a teacher has an unsaved comment in the form (text entered but not submitted)
- **AND** attempts to navigate back
- **THE SYSTEM SHALL** display confirmation dialog
  - Title: "Unsaved Changes"
  - Body: "You have an unsaved outcome comment. Are you sure you want to leave?"
  - Buttons: "Leave" (destructive) and "Stay" (primary)
- **AND** preserve form data if teacher chooses "Stay"
- **AND** discard form data if teacher chooses "Leave"

**AC-005.4: Keyboard Accessibility**
- **WHEN** using keyboard navigation
- **THE SYSTEM SHALL** support browser back button (works same as "Back to Classes")
- **AND** support Escape key as alternative back navigation (if no modal open)
- **AND** maintain logical tab order (Back button → Form → List)
- **AND** provide appropriate ARIA labels
  - `aria-label="Go back to class list"`

#### INVEST Analysis
- ✅ **Independent**: Simple navigation feature
- ✅ **Negotiable**: Back button styling and placement can be discussed
- ✅ **Valuable**: Essential for workflow continuity
- ✅ **Estimable**: Clear scope, 1 story point
- ✅ **Small**: Very small, quick implementation
- ✅ **Testable**: Clear navigation and unsaved changes criteria

---

## 4. Validation Rules

### OutcomeComment Field Validation

| Field | Rule | Error Message | Validation Timing |
|-------|------|---------------|-------------------|
| **commentText** | Required | "Comment text is required" | On submit |
| **commentText** | Min 10 characters | "Comment must be at least 10 characters" | On submit |
| **commentText** | Max 500 characters | "Comment cannot exceed 500 characters" | Real-time + On submit |
| **commentText** | Trim whitespace | Auto-applied (no error) | Before validation |
| **commentText** | No duplicates (case-insensitive) | "This comment already exists for this class" | On submit (client + server) |
| **classId** | Must be valid existing class | "Invalid class ID" | Server-side |

### Character Count Visual Indicators

| Range | Color | Meaning |
|-------|-------|---------|
| 0-9 chars | Gray | Below minimum |
| 10-450 chars | Green | Safe range |
| 451-490 chars | Yellow | Approaching limit |
| 491-500 chars | Red | At/near limit |

### Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| **Empty string** | Show "Comment text is required" error |
| **Only whitespace** | Treat as empty (trim and validate) |
| **Exactly 10 chars** | Valid (minimum boundary) |
| **Exactly 500 chars** | Valid (maximum boundary) |
| **501 chars** | Show "Cannot exceed 500 characters" error |
| **Unicode/emoji** | Count as single character each |
| **Line breaks** | Allowed, count as single character |
| **Duplicate (same case)** | Reject with duplicate error |
| **Duplicate (different case)** | Reject with duplicate error (case-insensitive) |
| **Leading/trailing spaces** | Auto-trim before validation |
| **Multiple spaces between words** | Preserve internal spaces |

---

## 5. Success Metrics

### Primary Metrics

| Metric | Target | Measurement Method | Status |
|--------|--------|-------------------|--------|
| **Adoption Rate** | 80% of teachers create ≥3 outcome comments per class | Analytics tracking | TBD |
| **Time to Create Comment** | < 30 seconds per comment | User timing API | TBD |
| **Error Rate** | < 2% of API requests fail | API error logging | TBD |
| **Page Load Time** | < 2 seconds for comment list view | Performance monitoring | TBD |
| **Accessibility Compliance** | 0 WCAG 2.1 AA violations | axe DevTools audit | TBD |

### Secondary Metrics

| Metric | Target | Measurement Method | Status |
|--------|--------|-------------------|--------|
| **Average Comments per Class** | 10-15 comments | Database analytics | TBD |
| **Comment Reuse Rate** | 60%+ comments used in personalized comments | Usage tracking (future) | N/A |
| **User Satisfaction** | 4.5/5 stars for feature usability | In-app survey | TBD |
| **Mobile Usage** | 30% of comments created on mobile | Device tracking | TBD |

### Health Metrics

- **Test Coverage**: Maintain ≥90% code coverage ✅
- **Bundle Size Impact**: < 20 KB gzipped for new feature code (actual: ~6 KB) ✅
- **API Response Time**: < 200ms for list retrieval (target)
- **Zero Data Loss**: 100% transaction integrity for create/delete

---

## 6. Prioritization Rationale

### Priority Breakdown

| Story | Priority | Rationale | Value Score | Risk Score |
|-------|----------|-----------|-------------|------------|
| **US-OUTCOME-001** | HIGH | Foundation for all other features, blocks everything | 9/10 | LOW |
| **US-OUTCOME-002** | HIGH | Core read functionality, needed for visibility | 9/10 | LOW |
| **US-OUTCOME-003** | HIGH | Core creation functionality, primary use case | 10/10 | MEDIUM |
| **US-OUTCOME-004** | MEDIUM | Important for lifecycle management but not blocking | 7/10 | LOW |
| **US-OUTCOME-005** | MEDIUM | Navigation UX improvement, not critical for MVP | 6/10 | LOW |

### MVP Scope (Sprint 1)

**MUST HAVE** (Total: 13 story points)
- US-OUTCOME-001: Navigate to Outcome Comments (2 pts)
- US-OUTCOME-002: View Outcome Comments (3 pts)
- US-OUTCOME-003: Create Outcome Comment (5 pts)
- US-OUTCOME-004: Delete Outcome Comment (3 pts)

**SHOULD HAVE** (Total: 1 story point)
- US-OUTCOME-005: Return to Class List (1 pt)

**TOTAL MVP**: 14 story points

### Implementation Sequence

**Week 1:**
1. US-OUTCOME-001: Navigation button (Day 1-2)
2. US-OUTCOME-002: View list (Day 2-3)
3. US-OUTCOME-003: Create functionality (Day 3-5)

**Week 2:**
4. US-OUTCOME-004: Delete functionality (Day 1-2)
5. US-OUTCOME-005: Back navigation (Day 2)
6. Integration testing & polish (Day 3-5)

---

## 7. Non-Functional Requirements

### Performance
- Initial page load: < 2 seconds
- Comment list rendering: < 500ms for 50 comments
- API response time: < 200ms
- Optimistic UI updates for create/delete

### Accessibility
- WCAG 2.1 Level AA compliance (target: 0 violations)
- Keyboard navigation support (Tab, Enter, Space, Escape)
- Screen reader compatibility (test with VoiceOver)
- Focus management in modals/dialogs
- Color contrast ratios ≥ 4.5:1
- ARIA labels and live regions for dynamic content

### Security
- Input sanitization for comment text (escape HTML entities)
- XSS prevention (no raw HTML rendering)
- CSRF protection via API (backend responsibility)
- Authorization checks (backend: teacher can only access their classes)

### Usability
- Clear error messages (actionable guidance)
- Loading states for all async operations
- Empty state with helpful guidance
- Consistent with existing class management UI
- Mobile-responsive design (works on tablets/phones)

### Browser Support
- Modern browsers (Chrome, Safari, Firefox, Edge)
- ES6+ support required
- No IE11 support

### Data Integrity
- Optimistic updates with rollback on error
- No data loss during network failures
- Duplicate detection (client and server)
- Proper error recovery

---

## Appendix A: API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/outcome-comment?classId=:id` | Fetch all comments for a class |
| POST | `/outcome-comment` | Create new comment |
| DELETE | `/outcome-comment/:id` | Delete comment by ID |

See [API_INTEGRATION.md](./API_INTEGRATION.md) for detailed specifications.

---

## Appendix B: Related Documents

- [Technical Design](./design.md) - Component architecture and implementation details
- [Implementation Tasks](./tasks.md) - TDD task breakdown with risk tiers
- [API Integration](./API_INTEGRATION.md) - Backend API specification

---

**Document Version**: 1.0
**Last Updated**: 2025-10-21
**Status**: Approved by Product Owner
**Next Review**: After MVP implementation complete

---

*This requirements document is production-ready and approved for development.*
