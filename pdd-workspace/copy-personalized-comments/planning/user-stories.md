# User Stories: Copy Personalized Comments to Another Subject

**Feature**: US-COPY-PERSONALIZED-001
**Status**: Planning
**Created**: 2026-01-09

---

## User Story 1: Add Copy Button to Personalized Comments Page

**US-CP-001**: As a teacher, I want to see a "Copy Comments to Another Subject" button on the Personalized Comments page so that I can initiate the copy workflow.

### Story Type
Feature (UI Component)

### Story Points
2

### Description
Add a button to the Personalized Comments page that opens a modal to copy comments to another subject. The button should be clearly visible and positioned alongside other actions on the page.

### Acceptance Criteria

#### AC-1.1: Button Visibility
**GIVEN** a teacher is viewing the Personalized Comments page for a subject
**WHEN** the page loads
**THEN** a button labeled "Copy Comments to Another Subject" is displayed
**AND** the button is positioned clearly on the page (e.g., near the subject name or with other actions)

#### AC-1.2: Button Styling
**GIVEN** the Copy Comments button is displayed
**WHEN** the page renders
**THEN** the button follows the existing design system styles
**AND** the button uses appropriate color/styling to indicate it's a secondary action

#### AC-1.3: Button Accessibility
**GIVEN** the Copy Comments button is displayed
**WHEN** a user navigates with keyboard
**THEN** the button receives focus appropriately
**AND** the button is announced by screen readers
**AND** clicking with Enter key works as expected

#### AC-1.4: Modal Opening
**GIVEN** a teacher clicks the "Copy Comments to Another Subject" button
**WHEN** the click is processed
**THEN** a modal dialog opens
**AND** the modal is not blocked by other page elements
**AND** the page behind the modal is slightly dimmed/disabled

### Definition of Done
- ✅ Button implemented in PersonalizedCommentsPage component
- ✅ Button has appropriate styling from design system tokens
- ✅ Modal opens on button click
- ✅ Unit tests cover button rendering and click handler
- ✅ Accessibility audit passes (WCAG 2.1 AA)

---

## User Story 2: Display Subject Selection Modal with Source Context

**US-CP-002**: As a teacher, I want the modal to clearly show which subject I'm copying FROM and present a dropdown to select the target subject so that I understand the copy direction.

### Story Type
Feature (UI Component)

### Story Points
3

### Description
Create a modal that displays:
- Source subject (the subject whose comments are being copied)
- Dropdown to select target subject
- Summary information about what will be copied

### Acceptance Criteria

#### AC-2.1: Source Subject Display
**GIVEN** the Copy Comments modal is open
**WHEN** the modal is displayed
**THEN** the source subject is clearly labeled and displayed
**AND** it's marked as "copying FROM this subject"
**AND** the display is read-only (cannot be changed)

#### AC-2.2: Target Subject Dropdown (Owned Subjects Only)
**GIVEN** the Copy Comments modal is open
**WHEN** the modal renders
**THEN** a dropdown field labeled "Copy to" is displayed
**AND** the dropdown contains only subjects the user OWNS
**AND** the current/source subject is excluded from the dropdown
**AND** the dropdown label clarifies "Copy to (subjects you own)"

#### AC-2.3: Subject List Population (Ownership Filtered)
**GIVEN** the user opens the target subject dropdown
**WHEN** they click to expand the dropdown
**THEN** the list loads and displays only subjects the user OWNS
**AND** the source/current subject is excluded from the list
**AND** subjects are sorted alphabetically or by recency
**AND** each subject is clearly identified by name
**AND** if the user owns no other subjects, an empty state message is shown: "You don't own any other subjects to copy to"

#### AC-2.4: Comment Count Display
**GIVEN** the modal is open
**WHEN** a target subject is selected
**THEN** the count of personalized comments to be copied is displayed
**AND** the count updates if the target subject changes

#### AC-2.5: Modal Layout & Accessibility
**GIVEN** the Copy Comments modal is open
**WHEN** a user navigates with keyboard
**THEN** tab order is logical (source → dropdown → radio buttons → buttons)
**AND** all labels are associated with form fields
**AND** dropdown is navigable with arrow keys

### Definition of Done
- ✅ Modal component created (CopyCommentsModal.tsx)
- ✅ Source subject displayed clearly and read-only
- ✅ Target subject dropdown loads subjects from API
- ✅ Comment count displayed and updates dynamically
- ✅ Modal layout is clear and accessible
- ✅ Unit tests cover all UI states and interactions
- ✅ Accessibility audit passes

---

## User Story 3: Provide Copy Mode Selection (Overwrite vs. Append)

**US-CP-003**: As a teacher, I want to choose whether copied comments should overwrite or append to existing comments so that I have control over the copy behavior.

### Story Type
Feature (Form Control)

### Story Points
2

### Description
Add radio buttons to the modal that allow the user to select between "Overwrite existing comments" and "Append to existing comments" modes with clear explanations of each option.

### Acceptance Criteria

#### AC-3.1: Radio Button Options
**GIVEN** the Copy Comments modal is open
**WHEN** the modal renders
**THEN** two radio button options are displayed:
- "Overwrite existing comments"
- "Append to existing comments"

#### AC-3.2: Default Selection
**GIVEN** the modal first opens
**WHEN** no mode has been selected yet
**THEN** "Append to existing comments" is selected by default
**AND** the user can change this selection

#### AC-3.3: Mode Explanations
**GIVEN** the radio buttons are displayed
**WHEN** the user views them
**THEN** each option has a clear explanation:
- Overwrite: "This will replace any existing personalized comments in the target subject"
- Append: "This will add these comments to any existing personalized comments in the target subject"

#### AC-3.4: Selection Behavior
**GIVEN** a radio button option is displayed
**WHEN** the user clicks it
**THEN** the option is selected (filled radio button)
**AND** the other option is deselected
**AND** the selection persists until changed

#### AC-3.5: Accessibility
**GIVEN** the radio buttons are displayed
**WHEN** a user navigates with keyboard
**THEN** radio buttons are focusable with Tab key
**AND** Space key toggles selection
**AND** screen readers announce the option and explanation

### Definition of Done
- ✅ Radio button group implemented in CopyCommentsModal
- ✅ Default selection set to "Append"
- ✅ Clear explanatory text for each option
- ✅ Radio button styling follows design system
- ✅ Keyboard navigation works correctly
- ✅ Unit tests cover all selection states
- ✅ Accessibility audit passes

---

## User Story 4: Implement Copy API Integration with Feedback

**US-CP-004**: As a teacher, I want the system to copy the comments when I click the Copy button and show me success or error feedback so that I know the operation completed.

### Story Type
Feature (API Integration)

### Story Points
3

### Description
Integrate with the `/personalized-comment/copy` API endpoint, handle the copy request, and display appropriate success/error feedback to the user.

### Acceptance Criteria

#### AC-4.1: Copy Button Submission
**GIVEN** the Copy Comments modal has all required fields filled
**WHEN** the user clicks the "Copy" button
**THEN** the copy request is sent to the `/personalized-comment/copy` API
**AND** the button shows a loading state (disabled, spinner)
**AND** the modal remains visible during the request

#### AC-4.2: API Request Format
**GIVEN** the Copy Comments modal is complete
**WHEN** the copy button is clicked
**THEN** the API receives the correct request payload:
```json
{
  "subjectFromId": "string (MongoDB ObjectId of source subject)",
  "subjectToId": "string (MongoDB ObjectId of target subject)",
  "overwrite": boolean (true for overwrite, false for append)
}
```
**AND** the request is sent to `POST /personalized-comment/copy`

#### AC-4.3: Success Feedback with Mode Indication
**GIVEN** the copy API request succeeds (HTTP 200)
**WHEN** the API returns an array of PersonalizedComment objects (the copied comments)
**THEN** a success message is displayed with:
- Count: Extract from response array length
- Message format: "Successfully copied X comments to [Target Subject Name]"
- Mode indication:
  - If overwrite=true was sent: "(overwrote existing comments)"
  - If overwrite=false was sent: "(appended to existing comments)"
- Full example: "Successfully copied 12 comments to Statistics 101 (appended to existing comments)"
**AND** the message is displayed prominently (toast, alert, or modal overlay)
**AND** the modal closes after 2-3 seconds automatically
**OR** the user can click a "Done" button to close immediately

#### AC-4.4: Error Handling
**GIVEN** the copy API request fails
**WHEN** the API returns an error
**THEN** an error message is displayed with:
- User-friendly error description
- "Try Again" button to retry
- "Cancel" button to close
**AND** the loading state is removed
**AND** the user can select different options and retry

#### AC-4.5: Network Error Handling
**GIVEN** the user has no internet connection or network timeout occurs
**WHEN** the copy request fails
**THEN** the error message displays "Network error - please check your connection and try again"
**AND** a "Try Again" button is provided

#### AC-4.6: Modal State Management
**GIVEN** the copy operation is in progress
**WHEN** the page is still being used
**THEN** the modal prevents closing by clicking backdrop
**AND** the user must either wait for completion or click Cancel

### Definition of Done
- ✅ API endpoint integrated in personalized comment service
- ✅ Loading state implemented and displayed
- ✅ Success feedback shown with proper delay/button
- ✅ Error handling covers network and API errors
- ✅ Modal state properly managed during request
- ✅ Unit tests cover all success/error paths
- ✅ Integration tests verify API contract
- ✅ Error messages are user-friendly

---

## User Story 5: Handle Edge Cases and Validation

**US-CP-005**: As a system, I want to validate all inputs and handle edge cases gracefully so that the copy operation is robust and reliable.

### Story Type
Feature (Validation)

### Story Points
2

### Description
Implement validation for user inputs and handle edge cases like no comments to copy, permission issues, or duplicate content.

### Acceptance Criteria

#### AC-5.1: Empty Comments Validation
**GIVEN** the source subject has no personalized comments
**WHEN** the user opens the Copy Comments modal
**THEN** a message is displayed: "This subject has no personalized comments to copy"
**AND** the Copy button is disabled
**AND** the modal can still be closed

#### AC-5.2: Target Selection Required
**GIVEN** the Copy Comments modal is open
**WHEN** no target subject is selected
**THEN** the Copy button is disabled
**AND** a message indicates "Please select a target subject"

#### AC-5.3: Cannot Copy to Self
**GIVEN** the source subject is somehow in the dropdown
**WHEN** the user tries to select it
**THEN** it's disabled/hidden in the dropdown
**AND** the user cannot copy comments to the same subject

#### AC-5.4: Ownership Validation
**GIVEN** the user doesn't own a subject
**WHEN** the dropdown populates
**THEN** that subject is not included in the list
**AND** only subjects the user owns are shown
**AND** if user owns no other subjects, the dropdown shows: "You don't own any other subjects to copy to"

#### AC-5.5: Duplicate Handling (Backend Managed)
**GIVEN** the mode is "Append" and both subjects have overlapping comments
**WHEN** the copy completes
**THEN** duplicates are allowed (acceptable as per product decision)
**AND** the backend API handles the copy logic and duplicate management
**AND** the success message shows the count of copied comments (count reflects what backend returned)

#### AC-5.6: Successful Completion
**GIVEN** the copy operation completes successfully
**WHEN** the success feedback is shown
**THEN** the subject dropdown and comments remain in their state
**AND** if the user clicks Copy again, a new request is sent (no double-click protection issues)

### Definition of Done
- ✅ All validation checks implemented
- ✅ Disabled states applied appropriately
- ✅ Clear messages for disabled states
- ✅ Permission validation handled
- ✅ Unit tests cover all edge cases
- ✅ No unhandled promise rejections

---

## Story Dependencies & Sequencing

```
US-CP-001 (Copy Button)
    ↓
US-CP-002 (Modal & Subject Selection)
    ↓
US-CP-003 (Copy Mode Selection)
    ↓
US-CP-004 (API Integration)
    ↓
US-CP-005 (Validation & Edge Cases)
```

**Can be developed in parallel after US-CP-002 is complete**.

---

## Story Estimation Summary

| Story | Points | Duration | Notes |
|-------|--------|----------|-------|
| US-CP-001 | 2 | 0.5 days | Button & modal open |
| US-CP-002 | 3 | 1 day | Subject selection dropdown |
| US-CP-003 | 2 | 0.5 days | Radio buttons |
| US-CP-004 | 3 | 1 day | API integration & feedback |
| US-CP-005 | 2 | 0.5 days | Validation & edge cases |
| **Total** | **12** | **~3-4 days** | L1 Micro feature |

---

## Testing Strategy

- **Unit Tests**: Each component and hook tested in isolation
- **Integration Tests**: Modal + API integration tested together
- **E2E Tests**: Full user flow from button click to success feedback
- **Accessibility**: WCAG 2.1 AA compliance verified
- **Cross-browser**: Desktop browsers (Chrome, Firefox, Safari, Edge)

---

Prepared by: Principal Product Owner
Date: 2026-01-09
Status: Ready for Implementation
