# Product Requirements Document: Personalized Comments Management

**Feature**: Personalized Comments Management
**Complexity**: L1-MICRO
**Estimated Effort**: 1-2 weeks
**Status**: Planning
**Created**: 2025-10-27

---

## 1. Executive Summary

### Problem Statement
Teachers need the ability to create and manage personalized, student-specific comments for each subject. Unlike outcome comments (which are score-based), personalized comments are freeform text that can be tailored to individual student needs and applied to final reports.

### Solution Overview
Implement a complete CRUD interface for Personalized Comments that mirrors the existing Outcome Comments functionality. Teachers will access this feature through a "Personalized Comments" button on each subject in the subject list, opening a modal dialog for managing personalized comments.

### Success Criteria
- Teachers can view all personalized comments for a subject
- Teachers can create new personalized comments with validation
- Teachers can edit existing personalized comments
- Teachers can delete personalized comments with confirmation
- UI/UX matches the established Outcome Comments pattern
- Full test coverage (unit + E2E tests ≥90%)

---

## 2. Business Context

### Strategic Alignment
This feature completes the comment management system by providing teachers with:
1. **Outcome Comments**: Score-based comments (70-80 range: "Good progress")
2. **Personalized Comments**: Student-specific comments ("Shows great improvement in problem-solving")
3. **Final Comments**: Combined comments for final reports (future feature)

### User Personas
**Primary**: Teachers creating personalized student comments
**Secondary**: School administrators reviewing comment quality

### Business Value
- **Efficiency**: Reusable personalized comments save time when creating final reports
- **Consistency**: Standardized comments ensure quality and compliance
- **Flexibility**: Freeform text allows customization per student needs
- **Completeness**: Fills gap between score-based and final comments

---

## 3. Requirements

### Functional Requirements

#### FR-1: View Personalized Comments
- Display list of all personalized comments for a subject
- Sort by creation date (newest first)
- Show comment text preview
- Display created/updated timestamps
- Handle empty state ("No personalized comments yet")

#### FR-2: Create Personalized Comment
- Multi-line text input for comment text
- Character counter (10-500 characters)
- Real-time validation feedback
- Duplicate detection (case-insensitive)
- Optimistic UI updates with rollback on error

#### FR-3: Edit Personalized Comment
- Inline or modal editing interface
- Pre-populate form with existing comment text
- Same validation as create
- Prevent duplicate comments
- Timestamp update on save

#### FR-4: Delete Personalized Comment
- Delete button with confirmation dialog
- Warning if comment is referenced (future consideration)
- Optimistic UI with rollback on error
- Permanent deletion (no soft delete)

#### FR-5: UI Integration
- "Personalized Comments" button on each SubjectListItem
- Modal dialog matching OutcomeComments UX
- Consistent styling and behavior
- Responsive design (mobile-friendly)

### Non-Functional Requirements

#### NFR-1: Performance
- Page load time < 2 seconds for comment list view
- API response time < 200ms for list retrieval
- Smooth animations and transitions

#### NFR-2: Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader announcements
- Focus management for modal

#### NFR-3: Quality
- Test coverage ≥90%
- Error rate < 2% of API requests
- Bundle size impact < 20 KB gzipped

#### NFR-4: Usability
- Match OutcomeComments UI patterns
- Clear error messages
- Intuitive form validation
- Loading states for async operations

---

## 4. Technical Specifications

### Backend API (Already Implemented)

**Entity Structure**:
```typescript
interface PersonalizedComment {
  id: number                  // Auto-generated integer ID
  comment: string             // Comment text (required, 10-500 chars)
  subjectId: number          // Foreign key to Subject entity
  createdAt: string          // ISO 8601 timestamp (auto-generated)
  updatedAt: string          // ISO 8601 timestamp (auto-updated)
}
```

**API Endpoints**:
- `GET /personalized-comment?subjectId=:id` - Fetch all comments for a subject
- `POST /personalized-comment` - Create new comment (payload: {comment, subjectId})
- `PUT /personalized-comment/:id` - Update comment (payload: {comment})
- `DELETE /personalized-comment/:id` - Delete comment by ID

### Frontend Architecture (To Be Implemented)

**File Structure** (mirrors OutcomeComments):
```
src/
├── types/
│   └── PersonalizedComment.ts          # Type definitions
├── services/api/
│   └── personalizedCommentService.ts   # API client
├── hooks/
│   └── usePersonalizedComments.ts      # React hook for state management
├── components/personalizedComments/
│   ├── PersonalizedCommentsModal.tsx   # Main modal component
│   ├── PersonalizedCommentList.tsx     # Comment list view
│   ├── PersonalizedCommentForm.tsx     # Create/edit form
│   └── PersonalizedCommentItem.tsx     # Individual comment display
└── __tests__/
    └── personalizedComments/           # Test files
```

**Key Components**:
1. **PersonalizedCommentsModal**: Top-level modal (reusable like OutcomeCommentsModal)
2. **usePersonalizedComments hook**: State management, API calls, optimistic updates
3. **personalizedCommentService**: HTTP client using Axios
4. **Type definitions**: TypeScript interfaces matching backend API

---

## 5. User Stories

### Epic: Personalized Comments Management

**Epic Description**: As a teacher, I want to create and manage personalized student-specific comments for each subject, so that I can efficiently build final report cards with customized feedback.

---

### US-PERS-001: View Personalized Comments List (HIGH - MVP)

**As a** teacher
**I want to** view all personalized comments for a subject
**So that** I can review existing comments before creating new ones or using them in reports

**Acceptance Criteria (EARS Format)**:
```
WHEN the teacher clicks "Personalized Comments" on a subject
THE SYSTEM SHALL open a modal displaying all personalized comments for that subject

WHEN personalized comments are loaded
THE SYSTEM SHALL sort them by creation date (newest first)

WHEN there are no personalized comments
THE SYSTEM SHALL display an empty state message: "No personalized comments yet. Add your first comment below."

WHEN the modal is displayed
THE SYSTEM SHALL show the subject name in the modal header

WHEN a comment is displayed
THE SYSTEM SHALL show:
- Comment text
- Created date
- Updated date (if different from created)
- Edit button
- Delete button
```

**Story Points**: 2
**Priority**: HIGH (MVP)
**Dependencies**: None

---

### US-PERS-002: Create New Personalized Comment (HIGH - MVP)

**As a** teacher
**I want to** create new personalized comments
**So that** I can build a library of reusable student-specific feedback

**Acceptance Criteria (EARS Format)**:
```
WHEN the teacher enters comment text
THE SYSTEM SHALL show a character counter (current / 500 max)

WHEN the comment text is less than 10 characters
THE SYSTEM SHALL disable the Save button and show validation message

WHEN the comment text exceeds 500 characters
THE SYSTEM SHALL prevent further input and show validation message

WHEN the teacher enters a duplicate comment (case-insensitive)
THE SYSTEM SHALL show an error: "This comment already exists for this subject"

WHEN the teacher clicks Save with valid input
THE SYSTEM SHALL:
- Display the new comment immediately (optimistic update)
- Send POST request to /personalized-comment
- Show success notification
- Clear the form

WHEN the API request fails
THE SYSTEM SHALL:
- Remove the optimistic comment from the list
- Show error message
- Preserve the form input
```

**Story Points**: 3
**Priority**: HIGH (MVP)
**Dependencies**: US-PERS-001

---

### US-PERS-003: Edit Existing Personalized Comment (MEDIUM - Post-MVP)

**As a** teacher
**I want to** edit existing personalized comments
**So that** I can fix typos or update comment text as my teaching approach evolves

**Acceptance Criteria (EARS Format)**:
```
WHEN the teacher clicks Edit on a comment
THE SYSTEM SHALL:
- Pre-populate the form with existing comment text
- Show "Update Comment" button instead of "Add Comment"
- Show "Cancel" button

WHEN the teacher modifies the comment text
THE SYSTEM SHALL apply the same validation as create (10-500 chars, no duplicates)

WHEN the teacher clicks Update with valid input
THE SYSTEM SHALL:
- Update the comment display immediately (optimistic update)
- Send PUT request to /personalized-comment/:id
- Update the updatedAt timestamp
- Show success notification

WHEN the teacher clicks Cancel
THE SYSTEM SHALL:
- Discard changes
- Clear edit mode
- Restore original comment display

WHEN the API request fails
THE SYSTEM SHALL:
- Revert to original comment text
- Show error message
```

**Story Points**: 3
**Priority**: MEDIUM (Post-MVP)
**Dependencies**: US-PERS-001, US-PERS-002

---

### US-PERS-004: Delete Personalized Comment (MEDIUM - Post-MVP)

**As a** teacher
**I want to** delete personalized comments
**So that** I can remove outdated or inappropriate comments from my library

**Acceptance Criteria (EARS Format)**:
```
WHEN the teacher clicks Delete on a comment
THE SYSTEM SHALL show a confirmation dialog:
- Title: "Delete Personalized Comment"
- Message: "Are you sure you want to delete this comment? This action cannot be undone."
- Buttons: "Delete" (danger), "Cancel"

WHEN the teacher confirms deletion
THE SYSTEM SHALL:
- Remove the comment from the list immediately (optimistic update)
- Send DELETE request to /personalized-comment/:id
- Show success notification

WHEN the API request fails
THE SYSTEM SHALL:
- Restore the deleted comment to the list
- Show error message: "Failed to delete comment. Please try again."

WHEN the teacher cancels deletion
THE SYSTEM SHALL close the dialog without changes
```

**Story Points**: 2
**Priority**: MEDIUM (Post-MVP)
**Dependencies**: US-PERS-001

---

### US-PERS-005: Navigate Back to Subject List (LOW - Enhancement)

**As a** teacher
**I want to** close the Personalized Comments modal and return to the subject list
**So that** I can manage comments for other subjects

**Acceptance Criteria (EARS Format)**:
```
WHEN the teacher clicks the X button or Close button
THE SYSTEM SHALL:
- Close the Personalized Comments modal
- Return focus to the subject list
- Clear any error state

WHEN the teacher clicks outside the modal
THE SYSTEM SHALL close the modal (if no unsaved changes)

WHEN there are unsaved changes in the form
THE SYSTEM SHALL:
- Show warning dialog: "You have unsaved changes. Discard?"
- Options: "Discard" or "Cancel"
```

**Story Points**: 1
**Priority**: LOW (Enhancement)
**Dependencies**: US-PERS-001

---

## 6. Validation Rules

### Comment Text Validation
- **Required**: Cannot be empty or whitespace-only
- **Length**: 10-500 characters (after trimming whitespace)
- **Duplicate Detection**: Case-insensitive comparison within same subject
- **Sanitization**: Trim leading/trailing whitespace, preserve internal formatting

### Subject ID Validation
- **Required**: Must reference valid existing subject
- **Type**: Integer (matches backend API)

### Business Rules
- Duplicate comments (same text) not allowed within same subject
- Comments can be associated with multiple subjects (separate instances)
- `createdAt` is immutable after creation
- `updatedAt` must reflect last modification time
- Deleting a subject should orphan comments (backend responsibility)

---

## 7. Success Metrics

### Quantitative Metrics
- **Feature Adoption**: ≥70% of teachers use personalized comments within first month
- **Comment Creation Rate**: Average 10+ personalized comments per subject
- **Error Rate**: < 2% of API requests fail
- **Performance**: 95th percentile page load time < 2 seconds
- **Test Coverage**: ≥90% code coverage for new code

### Qualitative Metrics
- **User Satisfaction**: Positive feedback from 80%+ of teachers in user testing
- **Usability**: Teachers can create first comment within 30 seconds (no training)
- **Consistency**: UI/UX matches OutcomeComments (confirmed via heuristic evaluation)

### Key Performance Indicators (KPIs)
- **Time to First Comment**: < 30 seconds from feature discovery
- **Comments Per Session**: Average 3-5 comments created per session
- **Duplicate Detection Success**: 100% of duplicate attempts blocked
- **Modal Load Time**: < 500ms to display modal after button click

---

## 8. Risk Assessment

### Technical Risks

**RISK-1: API Integration Issues**
- **Likelihood**: Low
- **Impact**: High
- **Mitigation**: Backend API already exists and documented; follow OutcomeComments pattern
- **Contingency**: MSW mock handlers for testing

**RISK-2: State Management Complexity**
- **Likelihood**: Low
- **Impact**: Medium
- **Mitigation**: Reuse useOutcomeComments hook pattern; proven approach
- **Contingency**: Simplify optimistic updates if race conditions occur

**RISK-3: Duplicate Detection Edge Cases**
- **Likelihood**: Medium
- **Impact**: Low
- **Mitigation**: Case-insensitive trimmed comparison; client + server validation
- **Contingency**: Server-side validation is source of truth

### Business Risks

**RISK-4: Low Feature Adoption**
- **Likelihood**: Low
- **Impact**: Medium
- **Mitigation**: Mirror OutcomeComments UX (already familiar to users)
- **Contingency**: User onboarding tutorial or tooltips

**RISK-5: Performance Degradation**
- **Likelihood**: Low
- **Impact**: Medium
- **Mitigation**: Pagination if > 50 comments; lazy loading
- **Contingency**: Virtual scrolling or search filter

---

## 9. Implementation Approach

### Phase 1: Foundation (Day 1-2)
1. Create type definitions (`PersonalizedComment.ts`)
2. Implement API service (`personalizedCommentService.ts`)
3. Add MSW mock handlers for testing
4. Write service layer tests

### Phase 2: State Management (Day 3-4)
5. Create `usePersonalizedComments` hook
6. Implement optimistic updates and error handling
7. Write hook tests

### Phase 3: UI Components (Day 5-7)
8. Create modal and list components
9. Implement form with validation
10. Add edit/delete functionality
11. Write component tests

### Phase 4: Integration (Day 8-9)
12. Integrate with `App.tsx` (add button to SubjectListItem)
13. Wire up modal state and callbacks
14. Write integration tests

### Phase 5: E2E Testing & Polish (Day 10)
15. Create E2E test suite (Playwright)
16. Fix any bugs discovered during testing
17. Accessibility audit and fixes
18. Performance optimization

---

## 10. Dependencies & Constraints

### Dependencies
- **Backend API**: `http://localhost:3000/personalized-comment` (✅ Already implemented)
- **React**: 18.3.1
- **TypeScript**: 5.2.2
- **Axios**: HTTP client (already configured)
- **date-fns**: Date formatting (already installed)
- **MSW**: Mock Service Worker for testing (already configured)

### Constraints
- Must match OutcomeComments UI/UX patterns exactly
- No edit functionality in MVP (moved to post-MVP)
- Mobile responsive design required
- Must work with existing Subject architecture
- Cannot delete comments if referenced (future validation)

### Out of Scope (Future Enhancements)
- **Comment Templates**: Pre-defined comment templates
- **Search/Filter**: Search within personalized comments
- **Bulk Operations**: Multi-select delete or edit
- **Comment Sharing**: Share comments across subjects
- **AI Suggestions**: AI-generated comment suggestions
- **Usage Analytics**: Track which comments are most used

---

## 11. Acceptance & Sign-off

### Definition of Done
- [ ] All user stories (US-PERS-001 to US-PERS-005) implemented
- [ ] Unit test coverage ≥90%
- [ ] E2E test suite passing
- [ ] Accessibility audit passed (WCAG 2.1 AA)
- [ ] Performance metrics met (< 2s page load)
- [ ] Code review approved
- [ ] Product Owner acceptance
- [ ] Documentation updated (if applicable)

### Stakeholders
- **Product Owner**: Dean Gaudet (approval authority)
- **Development Team**: Frontend developers
- **QA Engineer**: Test execution and validation
- **System Architect**: Technical design review (optional for L1)

---

## 12. Next Steps

### Immediate Actions
1. **Product Owner** → Review and approve this PRD
2. **Product Owner** → Prioritize user stories for sprint planning
3. **System Architect** → Optional: Review technical approach (L1 = architecture review SKIPPED)
4. **Frontend Developer** → Begin implementation following TDD approach

### Handoff to Development
Once approved, use the following command to hand off to the development team:

```bash
pdd handoff "frontend developer" "Implement Personalized Comments CRUD feature following TDD approach and mirroring OutcomeComments patterns"
```

---

**Document Version**: 1.0
**Last Updated**: 2025-10-27
**Status**: DRAFT - Awaiting Approval
