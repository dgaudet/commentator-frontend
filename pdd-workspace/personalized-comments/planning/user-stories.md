# User Stories: Personalized Comments Management

**Epic**: Personalized Comments Management
**Feature**: Add CRUD interface for personalized student-specific comments
**Complexity**: L1-MICRO (1-2 weeks)
**Total Story Points**: 11

---

## Story Summary

| ID | Story | Priority | Points | Status |
|---|---|---|---|---|
| US-PERS-001 | View Personalized Comments List | HIGH (MVP) | 2 | TODO |
| US-PERS-002 | Create New Personalized Comment | HIGH (MVP) | 3 | TODO |
| US-PERS-003 | Edit Existing Personalized Comment | MEDIUM (Post-MVP) | 3 | TODO |
| US-PERS-004 | Delete Personalized Comment | MEDIUM (Post-MVP) | 2 | TODO |
| US-PERS-005 | Navigate Back to Subject List | LOW (Enhancement) | 1 | TODO |

**MVP Scope** (HIGH priority): 5 story points (US-PERS-001, US-PERS-002)
**Post-MVP** (MEDIUM priority): 5 story points (US-PERS-003, US-PERS-004)
**Enhancement** (LOW priority): 1 story point (US-PERS-005)

---

## US-PERS-001: View Personalized Comments List

**Priority**: HIGH (MVP)
**Story Points**: 2
**Risk Level**: Low
**Dependencies**: None

### User Story

**As a** teacher
**I want to** view all personalized comments for a subject
**So that** I can review existing comments before creating new ones or using them in reports

### Acceptance Criteria (EARS Format)

```gherkin
GIVEN I am viewing the subject list
WHEN I click "Personalized Comments" on a subject
THEN THE SYSTEM SHALL open a modal displaying all personalized comments for that subject

GIVEN personalized comments are loaded
WHEN the comments are displayed
THEN THE SYSTEM SHALL sort them by creation date (newest first)

GIVEN there are no personalized comments for the subject
WHEN the modal opens
THEN THE SYSTEM SHALL display an empty state message: "No personalized comments yet. Add your first comment below."

GIVEN the modal is displayed
WHEN I view the modal header
THEN THE SYSTEM SHALL show the subject name in the modal header

GIVEN a comment is displayed in the list
WHEN I view the comment
THEN THE SYSTEM SHALL show:
  - Comment text
  - Created date
  - Updated date (if different from created)
  - Edit button
  - Delete button

GIVEN the comments are being loaded from the API
WHEN the request is in progress
THEN THE SYSTEM SHALL show a loading spinner

GIVEN the API request fails
WHEN an error occurs
THEN THE SYSTEM SHALL show an error message with retry option
```

### Technical Implementation Notes

**Components to Create**:
- `PersonalizedCommentsModal.tsx` - Main modal container
- `PersonalizedCommentList.tsx` - List view component
- `PersonalizedCommentItem.tsx` - Individual comment display

**API Integration**:
- GET `/personalized-comment?subjectId={id}` - Fetch comments for subject

**State Management**:
- Loading state (boolean)
- Error state (string | null)
- Comments array (PersonalizedComment[])

**UI/UX Requirements**:
- Modal width: Match OutcomeCommentsModal (600px)
- Empty state illustration (optional)
- Consistent button styling

### Test Coverage

**Unit Tests**:
- Component renders correctly with mock data
- Empty state displays when no comments
- Loading spinner shows during API call
- Error message displays on API failure

**Integration Tests**:
- Modal opens when button clicked
- Comments load from API
- Comments sort by date correctly

**E2E Tests**:
- End-to-end modal open and view comments flow

---

## US-PERS-002: Create New Personalized Comment

**Priority**: HIGH (MVP)
**Story Points**: 3
**Risk Level**: Low
**Dependencies**: US-PERS-001

### User Story

**As a** teacher
**I want to** create new personalized comments
**So that** I can build a library of reusable student-specific feedback

### Acceptance Criteria (EARS Format)

```gherkin
GIVEN I am viewing personalized comments
WHEN I type in the comment text input
THEN THE SYSTEM SHALL show a character counter (current / 500 max)

GIVEN I am entering comment text
WHEN the comment text is less than 10 characters
THEN THE SYSTEM SHALL:
  - Disable the Save button
  - Show validation message: "Comment must be at least 10 characters"

GIVEN I am entering comment text
WHEN the comment text exceeds 500 characters
THEN THE SYSTEM SHALL:
  - Prevent further input
  - Show validation message: "Comment cannot exceed 500 characters"

GIVEN I have entered valid comment text
WHEN the comment text already exists for this subject (case-insensitive)
THEN THE SYSTEM SHALL show an error: "This comment already exists for this subject"

GIVEN I have entered valid, unique comment text
WHEN I click Save
THEN THE SYSTEM SHALL:
  - Display the new comment immediately (optimistic update)
  - Send POST request to /personalized-comment
  - Show success notification: "Comment added successfully"
  - Clear the form
  - Scroll to show the new comment

GIVEN I have clicked Save
WHEN the API request fails
THEN THE SYSTEM SHALL:
  - Remove the optimistic comment from the list
  - Show error message: "Failed to add comment. Please try again."
  - Preserve the form input so user can retry
  - Provide retry button
```

### Technical Implementation Notes

**Components to Create**:
- `PersonalizedCommentForm.tsx` - Create/edit form component

**API Integration**:
- POST `/personalized-comment` - Create new comment
- Payload: `{ comment: string, subjectId: number }`

**Validation Logic**:
- Client-side: Length (10-500), duplicate detection
- Server-side: Backend validates and returns 400 if duplicate

**Optimistic Updates**:
- Add temp comment with `id: -1` immediately
- Replace with real comment when API responds
- Remove temp comment if API fails

**State Management**:
- Form state (comment text, errors, submitting)
- Optimistic comment tracking

### Test Coverage

**Unit Tests**:
- Form validation (length, duplicates)
- Character counter updates correctly
- Save button disabled when invalid
- Form clears after successful save

**Integration Tests**:
- Optimistic update adds comment immediately
- API success replaces temp comment
- API failure removes temp comment and shows error
- Duplicate detection prevents save

**E2E Tests**:
- Create comment end-to-end flow
- Validation error scenarios
- Duplicate comment prevention

---

## US-PERS-003: Edit Existing Personalized Comment

**Priority**: MEDIUM (Post-MVP)
**Story Points**: 3
**Risk Level**: Low
**Dependencies**: US-PERS-001, US-PERS-002

### User Story

**As a** teacher
**I want to** edit existing personalized comments
**So that** I can fix typos or update comment text as my teaching approach evolves

### Acceptance Criteria (EARS Format)

```gherkin
GIVEN I am viewing personalized comments
WHEN I click Edit on a comment
THEN THE SYSTEM SHALL:
  - Pre-populate the form with existing comment text
  - Show "Update Comment" button instead of "Add Comment"
  - Show "Cancel" button
  - Focus the text input field

GIVEN I am editing a comment
WHEN I modify the comment text
THEN THE SYSTEM SHALL apply the same validation as create:
  - Length: 10-500 characters
  - No duplicates (case-insensitive)
  - Real-time character counter

GIVEN I have modified a comment with valid changes
WHEN I click Update
THEN THE SYSTEM SHALL:
  - Update the comment display immediately (optimistic update)
  - Send PUT request to /personalized-comment/:id
  - Update the updatedAt timestamp
  - Show success notification: "Comment updated successfully"
  - Exit edit mode

GIVEN I am editing a comment
WHEN I click Cancel
THEN THE SYSTEM SHALL:
  - Discard changes
  - Clear edit mode
  - Restore original comment display
  - Clear the form

GIVEN I have clicked Update
WHEN the API request fails
THEN THE SYSTEM SHALL:
  - Revert to original comment text
  - Show error message: "Failed to update comment. Please try again."
  - Keep form in edit mode with unsaved changes
  - Provide retry button
```

### Technical Implementation Notes

**Components to Modify**:
- `PersonalizedCommentForm.tsx` - Add edit mode support
- `PersonalizedCommentItem.tsx` - Add edit button handler

**API Integration**:
- PUT `/personalized-comment/:id` - Update comment
- Payload: `{ comment: string }`

**Edit Mode State**:
- Track `editingCommentId: number | null`
- Pre-fill form when entering edit mode
- Clear edit mode on save/cancel

**Optimistic Updates**:
- Update comment in list immediately
- Revert to original on API failure

### Test Coverage

**Unit Tests**:
- Edit mode activates correctly
- Form pre-populates with existing text
- Cancel discards changes
- Update button replaces Add button

**Integration Tests**:
- Edit flow completes successfully
- Cancel exits edit mode
- API failure reverts changes

**E2E Tests**:
- Edit comment end-to-end flow
- Cancel edit flow

---

## US-PERS-004: Delete Personalized Comment

**Priority**: MEDIUM (Post-MVP)
**Story Points**: 2
**Risk Level**: Low
**Dependencies**: US-PERS-001

### User Story

**As a** teacher
**I want to** delete personalized comments
**So that** I can remove outdated or inappropriate comments from my library

### Acceptance Criteria (EARS Format)

```gherkin
GIVEN I am viewing personalized comments
WHEN I click Delete on a comment
THEN THE SYSTEM SHALL show a confirmation dialog:
  - Title: "Delete Personalized Comment"
  - Message: "Are you sure you want to delete this comment? This action cannot be undone."
  - Buttons: "Delete" (danger variant), "Cancel"

GIVEN the delete confirmation dialog is open
WHEN I click Delete to confirm
THEN THE SYSTEM SHALL:
  - Remove the comment from the list immediately (optimistic update)
  - Send DELETE request to /personalized-comment/:id
  - Show success notification: "Comment deleted successfully"
  - Close the confirmation dialog

GIVEN I have confirmed deletion
WHEN the API request fails
THEN THE SYSTEM SHALL:
  - Restore the deleted comment to the list
  - Show error message: "Failed to delete comment. Please try again."
  - Provide retry button

GIVEN the delete confirmation dialog is open
WHEN I click Cancel
THEN THE SYSTEM SHALL close the dialog without changes

GIVEN I am viewing personalized comments
WHEN I press Escape while confirmation dialog is open
THEN THE SYSTEM SHALL close the dialog without deleting
```

### Technical Implementation Notes

**Components to Use**:
- `ConfirmDialog.tsx` - Existing reusable dialog component

**API Integration**:
- DELETE `/personalized-comment/:id` - Delete comment

**Optimistic Updates**:
- Remove comment from list immediately
- Restore if API fails

**State Management**:
- Track `deletingCommentId: number | null`
- Confirmation dialog state (open/closed)

### Test Coverage

**Unit Tests**:
- Delete button triggers confirmation dialog
- Confirmation dialog shows correct message
- Cancel closes dialog without changes

**Integration Tests**:
- Delete flow removes comment
- API failure restores comment
- Optimistic update and rollback

**E2E Tests**:
- Delete comment end-to-end flow
- Cancel delete flow

---

## US-PERS-005: Navigate Back to Subject List

**Priority**: LOW (Enhancement)
**Story Points**: 1
**Risk Level**: Trivial
**Dependencies**: US-PERS-001

### User Story

**As a** teacher
**I want to** close the Personalized Comments modal and return to the subject list
**So that** I can manage comments for other subjects

### Acceptance Criteria (EARS Format)

```gherkin
GIVEN the Personalized Comments modal is open
WHEN I click the X button or Close button
THEN THE SYSTEM SHALL:
  - Close the modal
  - Return focus to the subject list
  - Clear any error state

GIVEN the Personalized Comments modal is open
WHEN I click outside the modal (on the overlay)
THEN THE SYSTEM SHALL close the modal (if no unsaved changes)

GIVEN I have unsaved changes in the form
WHEN I attempt to close the modal
THEN THE SYSTEM SHALL:
  - Show warning dialog: "You have unsaved changes. Discard?"
  - Options: "Discard" (danger) or "Cancel"

GIVEN the unsaved changes warning is shown
WHEN I click Discard
THEN THE SYSTEM SHALL:
  - Close the modal
  - Discard unsaved changes
  - Return to subject list

GIVEN the unsaved changes warning is shown
WHEN I click Cancel
THEN THE SYSTEM SHALL:
  - Keep the modal open
  - Preserve unsaved changes in the form

GIVEN the modal is open
WHEN I press Escape
THEN THE SYSTEM SHALL close the modal (with unsaved changes check)
```

### Technical Implementation Notes

**Components to Modify**:
- `PersonalizedCommentsModal.tsx` - Add close handlers
- Check for `hasUnsavedChanges` flag before closing

**State Management**:
- Track form dirty state
- Modal close callbacks

**Keyboard Navigation**:
- Escape key closes modal
- Focus trap within modal

### Test Coverage

**Unit Tests**:
- Close button closes modal
- Unsaved changes warning shows when applicable

**Integration Tests**:
- Close flow with no unsaved changes
- Close flow with unsaved changes (warning + discard)

**E2E Tests**:
- Close modal flows
- Keyboard navigation (Escape key)

---

## Implementation Priority

### Sprint 1 - MVP (5 Story Points)
**Goal**: Teachers can view and create personalized comments

1. **US-PERS-001**: View Personalized Comments List (2 points)
   - Foundation: Types, API service, MSW handlers
   - Components: Modal, list, item display

2. **US-PERS-002**: Create New Personalized Comment (3 points)
   - Form component with validation
   - Optimistic updates
   - Error handling

### Sprint 2 - Post-MVP (6 Story Points)
**Goal**: Full CRUD functionality with edit and delete

3. **US-PERS-003**: Edit Existing Personalized Comment (3 points)
   - Edit mode in form
   - Update API integration
   - Optimistic updates

4. **US-PERS-004**: Delete Personalized Comment (2 points)
   - Confirmation dialog
   - Delete API integration
   - Optimistic updates

5. **US-PERS-005**: Navigate Back to Subject List (1 point)
   - Unsaved changes detection
   - Close handlers
   - Keyboard navigation

---

## Technical Architecture Summary

### File Structure
```
src/
├── types/
│   └── PersonalizedComment.ts
├── services/api/
│   └── personalizedCommentService.ts
├── hooks/
│   └── usePersonalizedComments.ts
├── components/
│   ├── subjects/
│   │   └── SubjectListItem.tsx (ADD BUTTON)
│   └── personalizedComments/
│       ├── PersonalizedCommentsModal.tsx
│       ├── PersonalizedCommentList.tsx
│       ├── PersonalizedCommentForm.tsx
│       └── PersonalizedCommentItem.tsx
├── mocks/
│   ├── handlers.ts (ADD HANDLERS)
│   └── data/
│       └── personalizedComments.ts
└── __tests__/
    └── personalizedComments/
```

### Integration Points

**App.tsx Changes**:
```typescript
// Add state for PersonalizedComments modal
const [personalizedCommentsModal, setPersonalizedCommentsModal] = useState<{
  isOpen: boolean
  subjectItem?: Subject
}>({ isOpen: false })

// Add hook for managing personalized comments
const {
  personalizedComments,
  loading: personalizedCommentsLoading,
  error: personalizedCommentsError,
  loadPersonalizedComments,
  createComment: createPersonalizedComment,
  updateComment: updatePersonalizedComment,
  deleteComment: deletePersonalizedComment,
  clearError: clearPersonalizedCommentsError,
} = usePersonalizedComments()

// Add callback for opening modal
const handleViewPersonalizedComments = async (subjectItem: Subject) => {
  setPersonalizedCommentsModal({ isOpen: true, subjectItem })
  await loadPersonalizedComments(subjectItem.id)
}

// Render modal
<PersonalizedCommentsModal
  isOpen={personalizedCommentsModal.isOpen}
  entityData={personalizedCommentsModal.subjectItem || { id: 0, name: '', createdAt: '', updatedAt: '' }}
  personalizedComments={personalizedComments}
  onCreateComment={createPersonalizedComment}
  onUpdateComment={updatePersonalizedComment}
  onDeleteComment={deletePersonalizedComment}
  loading={personalizedCommentsLoading}
  error={personalizedCommentsError}
  onClose={handlePersonalizedCommentsClose}
/>
```

**SubjectListItem Changes**:
```typescript
// Add prop for onViewPersonalizedComments callback
interface SubjectListItemProps {
  // ... existing props
  onViewPersonalizedComments?: (subject: Subject) => void
}

// Add button next to "Outcome Comments"
<button onClick={() => onViewPersonalizedComments?.(subject)}>
  Personalized Comments
</button>
```

---

## Definition of Done (All Stories)

- [ ] Code implemented following TDD approach
- [ ] Unit tests written and passing (≥90% coverage)
- [ ] Integration tests written and passing
- [ ] E2E tests written and passing
- [ ] Code review completed and approved
- [ ] Accessibility audit passed (WCAG 2.1 AA)
- [ ] Performance metrics validated
- [ ] Product Owner acceptance
- [ ] Documentation updated (if applicable)
- [ ] No console errors or warnings
- [ ] Responsive design verified (mobile + desktop)

---

**Document Version**: 1.0
**Last Updated**: 2025-10-27
**Status**: READY FOR ESTIMATION
