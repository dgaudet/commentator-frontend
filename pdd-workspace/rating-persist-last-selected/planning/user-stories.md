# User Stories: Rating Selector Persistence
## Feature: Preserve Last Selected Rating in PersonalizedCommentsModal

### Overview
As a teacher creating or editing student comments with ratings, I want the rating selector to remember my last selection so that I don't have to re-select the same rating when adding multiple comments with similar sentiments.

**Business Value**: Improves user experience and workflow efficiency when bulk-adding or editing multiple personalized comments with similar ratings.

---

## Story 1: Persist Rating When Adding Multiple Comments
**ID**: US-RATING-PERSIST-001

**WHEN** a teacher selects a rating in the "Add Personalized Comment" form and successfully submits a comment
**THE SYSTEM SHALL** retain the selected rating in the form instead of resetting to the default neutral (3) rating

**Acceptance Criteria:**

- [ ] **AC-1.1: Remember Selection After Submit**
  - GIVEN a teacher has selected rating 5 (😊 Very Positive) in the add form
  - AND they click the "Add" button
  - WHEN the comment is successfully created
  - THEN the rating selector remains at 5 (not reset to 3)
  - AND the form is ready for the next comment with rating 5 pre-selected

- [ ] **AC-1.2: Multi-Comment Workflow**
  - GIVEN a teacher adds a comment with rating 4 (🙂 Positive)
  - AND they add another comment without changing the rating
  - WHEN the second comment is created
  - THEN the second comment also has rating 4
  - AND the selector remains at 4 for the next comment

- [ ] **AC-1.3: User Can Still Change Rating**
  - GIVEN the rating selector is showing the previously selected rating
  - WHEN the teacher clicks on a different emoji rating
  - THEN the rating selector immediately updates to the new selection
  - AND the next submitted comment uses the new rating

- [ ] **AC-1.4: Manual Reset to Default (Discoverable)**
  - GIVEN a rating is persisted in the add form
  - WHEN the teacher explicitly clicks on the neutral emoji (3) or uses a reset mechanism
  - THEN the rating is updated to the user's selection
  - NOTE: No forced reset button required; clicking a rating updates it normally

---

## Story 2: Persist Rating When Editing Comments
**ID**: US-RATING-PERSIST-002

**WHEN** a teacher edits a student comment and changes or confirms its rating, and returns to add mode
**THE SYSTEM SHALL** retain the last-interacted rating instead of defaulting back to neutral (3)

**Acceptance Criteria:**

- [ ] **AC-2.1: Remember Rating After Returning from Edit**
  - GIVEN a teacher is in edit mode for a comment with rating 2 (😟 Negative)
  - AND they click "Save" or "Cancel"
  - WHEN they return to the add form
  - THEN the rating selector shows 2 (the rating from the comment being edited)
  - AND the add form is ready to create a new comment with that rating

- [ ] **AC-2.2: Edit Different Comments in Sequence**
  - GIVEN a teacher edits a comment with rating 4
  - AND cancels without saving
  - WHEN they edit another comment with rating 2
  - THEN the rating selector switches to 2
  - AND returning to add mode keeps rating 2

- [ ] **AC-2.3: Explicit Rating Change in Edit Mode**
  - GIVEN a teacher is editing a comment
  - AND they select a different rating than the original
  - AND they click "Save"
  - WHEN the edit completes
  - AND they return to add mode
  - THEN the persisted rating is the newly-saved rating (not the original)

---

## Story 3: Session-Scoped Persistence
**ID**: US-RATING-PERSIST-003

**WHEN** a teacher closes and reopens the PersonalizedCommentsModal
**THE SYSTEM SHALL** reset the rating selector to the default neutral (3) to prevent cross-session confusion

**Acceptance Criteria:**

- [ ] **AC-3.1: Reset on Modal Close**
  - GIVEN a teacher has persisted rating 4 in the add form
  - AND they close the PersonalizedCommentsModal
  - WHEN they reopen the modal for the same subject
  - THEN the rating selector is reset to 3 (neutral)
  - AND the previously selected rating 4 is not carried forward

- [ ] **AC-3.2: Reset on Subject Change**
  - GIVEN a teacher has selected rating 5 while working with Subject A
  - WHEN they switch to a different subject
  - AND the PersonalizedCommentsModal updates
  - THEN the rating selector resets to 3
  - COMMENT: This may be implicit if modal closes/reopens, but should be validated

- [ ] **AC-3.3: New Rating Session After Success**
  - GIVEN a teacher has just successfully created a comment with rating 4
  - AND they close the entire PersonalizedCommentsModal
  - WHEN they reopen it on the same subject
  - THEN the rating is reset to 3 (even though the previous session had rating 4)

---

## Story 4: Rating Persistence - Edit Form Behavior
**ID**: US-RATING-PERSIST-004

**WHEN** a teacher enters edit mode for a comment
**THE SYSTEM SHALL** load the comment's existing rating and use it as the starting point for persistence

**Acceptance Criteria:**

- [ ] **AC-4.1: Load Existing Rating in Edit Mode**
  - GIVEN a comment has rating 2 (😟 Negative)
  - WHEN the teacher clicks edit on that comment
  - THEN the rating selector displays rating 2
  - AND the rating is available for persistence logic

- [ ] **AC-4.2: Persistence After Canceling Edit**
  - GIVEN a teacher opens a comment with rating 3 for editing
  - WHEN they click "Cancel" without saving changes
  - THEN the rating selector returns to 3 (the edited comment's rating)
  - AND subsequent comments default to rating 3

- [ ] **AC-4.3: Null/Undefined Rating Defaults to 3**
  - GIVEN a comment exists without a stored rating (null/undefined)
  - WHEN the teacher opens it in edit mode
  - THEN the rating selector defaults to 3 (neutral)
  - AND persistence uses rating 3 as the base

---

## Definition of Done

- [ ] Code changes committed to feature branch: `feature/rating-persist-last-selected`
- [ ] All acceptance criteria verified with tests or manual QA
- [ ] Existing rating-selector tests still pass
- [ ] No regressions in add/edit/delete comment workflows
- [ ] Code adheres to project TDD standards (tests written first or alongside implementation)
- [ ] PR includes reference to these user stories and acceptance criteria
- [ ] Product Owner acceptance: All acceptance criteria met

---

## Notes & Clarifications

### Scope of "Last Selected"
- **In-modal session**: The rating persists while the modal is open
- **Cross-modal**: When reopening the modal, resets to 3 (prevents accidental mis-ratings on different subjects)
- **Edit to Add**: When returning from edit mode, the edited comment's rating becomes the persistent rating for add mode

### Design Considerations
- No new UI elements required; behavior change only
- Leverages existing EmojiRatingSelector component
- Minimal state management changes in PersonalizedCommentsModal

### Related Features
- **US-RATING-001**: Original rating selector specification
- **US-RATING-003**: Add Rating Selector to Forms
- **US-RATING-004**: Display Rating in Comments List + Sort by Rating

### User Research Insight
*From toDos.md notes*: "The rating should stay on the last one picked instead of the middle" - indicates user feedback that middle (3/neutral) default is not intuitive for workflow efficiency.
