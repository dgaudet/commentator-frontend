# User Stories - Pronoun Support for Student Comments

**Feature**: Pronoun Support for Student Comments

**Status**: Ready for Implementation

**Total Stories**: 4

**Estimated Total Effort**: ~16 hours (1-2 weeks)

---

## TASK-1.1: Document Pronoun Placeholders in Outcome Comments

**Story**: As a teacher, I want to see available pronoun placeholders when creating Outcome Comments, so I can use pronouns in score-based feedback.

**Description**:
Add help text documentation to the Outcome Comments form showing available placeholders: `{{pronoun}}` and `{{possessivePronoun}}`. This allows teachers to write more inclusive feedback.

**Type**: Feature Enhancement

**Effort**: 2 hours

**Priority**: P0 (Must Have)

### Acceptance Criteria

**AC-1.1.1: Help Text Displayed**
- GIVEN a user on the "Create Outcome Comment" or "Edit Outcome Comment" form
- WHEN the form loads
- THEN help text is visible above the comment textarea stating:
  - "Available placeholders: {{pronoun}} (e.g., he, she, they) and {{possessivePronoun}} (e.g., his, her, their)"

**AC-1.1.2: Placeholder Support**
- GIVEN a user enters comment text with placeholders
- WHEN they submit the form
- THEN the comment is saved with placeholder text intact (e.g., "{{pronoun}} completed the work well")
- AND no errors occur during save

**AC-1.1.3: Styling Consistency**
- GIVEN the help text is displayed
- WHEN viewed in the form
- THEN it matches existing form styling (uses design tokens, consistent typography)

**AC-1.1.4: Form Validation**
- GIVEN a user submits a comment with placeholders
- WHEN validation runs
- THEN the form validates as normal (placeholders don't break validation)
- AND no validation errors are introduced

### Implementation Tasks

- [ ] **TASK-1.1.1**: Add help text JSDoc comment to OutcomeComment form component
- [ ] **TASK-1.1.2**: Add visible help text UI element above comment textarea using existing typography tokens
- [ ] **TASK-1.1.3**: Test that placeholders save correctly without evaluation
- [ ] **TASK-1.1.4**: Verify no breaking changes to existing comments

### Test Scenarios

1. **Test**: Create Outcome Comment with {{pronoun}} placeholder
   - **Expected**: Comment saves with placeholder text intact

2. **Test**: View saved Outcome Comment with {{pronoun}} placeholder
   - **Expected**: Placeholder text displays as-is (not evaluated)

3. **Test**: Edit Outcome Comment containing placeholders
   - **Expected**: Placeholder text remains unchanged during edit/save

---

## TASK-1.2: Document Pronoun Placeholders in Personalized Comments

**Story**: As a teacher, I want to see available pronoun placeholders when creating Personalized Comments, so I can write inclusive student-specific feedback.

**Description**:
Add help text documentation to the Personalized Comments form showing available placeholders: `{{pronoun}}` and `{{possessivePronoun}}`. Enables teachers to create personalized comments that respect student pronouns.

**Type**: Feature Enhancement

**Effort**: 2 hours

**Priority**: P0 (Must Have)

### Acceptance Criteria

**AC-1.2.1: Help Text Displayed**
- GIVEN a user on the "Create Personalized Comment" or "Edit Personalized Comment" form
- WHEN the form loads
- THEN help text is visible above the comment textarea stating:
  - "Available placeholders: {{pronoun}} (e.g., he, she, they) and {{possessivePronoun}} (e.g., his, her, their)"

**AC-1.2.2: Placeholder Support**
- GIVEN a user enters comment text with placeholders
- WHEN they submit the form
- THEN the comment is saved with placeholder text intact (e.g., "{{pronoun}} showed great improvement")
- AND no errors occur during save

**AC-1.2.3: Styling Consistency**
- GIVEN the help text is displayed
- WHEN viewed in the form
- THEN it matches existing form styling (uses design tokens, consistent typography)

**AC-1.2.4: Form Validation**
- GIVEN a user submits a comment with placeholders
- WHEN validation runs
- THEN the form validates as normal (placeholders don't break validation)
- AND no validation errors are introduced

### Implementation Tasks

- [ ] **TASK-1.2.1**: Add help text to PersonalizedComment form component
- [ ] **TASK-1.2.2**: Add visible help text UI element above comment textarea using design tokens
- [ ] **TASK-1.2.3**: Test that placeholders save correctly without evaluation
- [ ] **TASK-1.2.4**: Verify no breaking changes to existing comments

### Test Scenarios

1. **Test**: Create Personalized Comment with {{possessivePronoun}} placeholder
   - **Expected**: Comment saves with placeholder text intact

2. **Test**: View saved Personalized Comment with placeholders
   - **Expected**: Placeholder text displays as-is (not evaluated)

3. **Test**: Edit Personalized Comment with placeholders
   - **Expected**: Placeholder text remains unchanged

---

## TASK-1.3: Implement Pronoun Dropdown in Final Comments Form

**Story**: As a teacher, I want to select a pronoun for each student in the Final Comments form, so I can personalize comments using their preferred pronouns.

**Description**:
Add a pronoun dropdown selector to the Final Comments form. The dropdown fetches pronouns from the API and displays them in "pronoun - possessivePronoun" format. When a user selects a pronoun, the `pronounId` is saved with the Final Comment.

**Type**: Feature Implementation

**Effort**: 6 hours

**Priority**: P0 (Must Have)

### Acceptance Criteria

**AC-1.3.1: Dropdown Component Rendered**
- GIVEN a user opening the "Create Final Comment" or "Edit Final Comment" form
- WHEN the form loads
- THEN a "Pronoun" dropdown selector is visible
- AND it appears in a logical position (near student name field)

**AC-1.3.2: Dropdown Display Format**
- GIVEN the dropdown is populated with pronouns
- WHEN the dropdown is clicked
- THEN pronouns are displayed in format: "pronoun - possessivePronoun"
- EXAMPLE: "they - their", "he - his", "she - her", "sie - sier"

**AC-1.3.3: API Integration**
- GIVEN the form loads
- WHEN the component mounts
- THEN it calls GET /api/pronouns
- AND displays all returned pronouns in the dropdown

**AC-1.3.4: Placeholder Text**
- GIVEN the dropdown initially loads
- WHEN no pronoun has been selected
- THEN the dropdown shows "Select a pronoun..." or equivalent placeholder text
- AND the dropdown value is empty/null

**AC-1.3.5: Optional Selection**
- GIVEN a user doesn't select a pronoun
- WHEN they submit the Final Comment form
- THEN the comment saves successfully with `pronounId: null`
- AND no validation error occurs

**AC-1.3.6: Selection Persistence**
- GIVEN a user selects a pronoun from the dropdown
- WHEN they save the Final Comment
- THEN the `pronounId` is sent to the API and saved
- AND when the form is loaded again for editing, the previously selected pronoun is displayed

**AC-1.3.7: Error Handling**
- GIVEN the API fails to load pronouns
- WHEN the form loads
- THEN an error message is displayed: "Failed to load pronouns"
- AND the dropdown is disabled with helpful message

**AC-1.3.8: Empty State**
- GIVEN a user has created no pronouns yet
- WHEN the form loads and API returns empty list
- THEN the dropdown shows "No pronouns available. Create pronouns first."
- AND provides helpful context

### Implementation Tasks

- [ ] **TASK-1.3.1**: Create `usePronounsQuery()` hook to fetch pronouns from GET /api/pronouns
- [ ] **TASK-1.3.2**: Add pronoun loading state and error handling
- [ ] **TASK-1.3.3**: Create Pronoun dropdown component with "pronoun - possessivePronoun" display format
- [ ] **TASK-1.3.4**: Integrate dropdown into FinalCommentModal/Form component
- [ ] **TASK-1.3.5**: Bind dropdown value to Final Comment `pronounId` field
- [ ] **TASK-1.3.6**: Test loading, selecting, and persisting pronoun selection
- [ ] **TASK-1.3.7**: Test error states and empty pronoun list
- [ ] **TASK-1.3.8**: Verify styling matches design system

### Test Scenarios

1. **Test**: Load Final Comment form with pronouns available
   - **Expected**: Dropdown displays all pronouns in "pronoun - possessivePronoun" format

2. **Test**: Select a pronoun and save Final Comment
   - **Expected**: Pronoun is saved and persists when editing

3. **Test**: Edit Final Comment without selecting pronoun
   - **Expected**: Final Comment saves with `pronounId: null`

4. **Test**: Load Final Comment form when pronouns API fails
   - **Expected**: Error message displayed, dropdown disabled

5. **Test**: Load Final Comment form when user has no pronouns
   - **Expected**: Helpful message displayed in dropdown

---

## TASK-1.4: Add Pronoun Dropdown Display in Final Comments UI

**Story**: As a teacher, I want to see the selected pronoun clearly displayed when viewing Final Comments, so I understand what pronouns are associated with each student.

**Description**:
Ensure the pronoun selection is properly displayed and formatted in Final Comments views (list, detail, modal). Display selected pronoun in "pronoun - possessivePronoun" format.

**Type**: Feature Implementation

**Effort**: 3 hours

**Priority**: P1 (Should Have)

### Acceptance Criteria

**AC-1.4.1: Display in Final Comments List**
- GIVEN a user viewing the Final Comments list
- WHEN a Final Comment has a pronoun selected
- THEN the pronoun is displayed as "pronoun - possessivePronoun" (e.g., "they - their")
- AND it appears in a clearly labeled column/section

**AC-1.4.2: Display in Final Comments Detail**
- GIVEN a user viewing a specific Final Comment detail
- WHEN the comment has a pronoun selected
- THEN the pronoun is displayed with a label (e.g., "Pronoun: they - their")
- AND it appears in a logical location near other student info

**AC-1.4.3: Null Handling**
- GIVEN a Final Comment without a pronoun selected
- WHEN viewed in list or detail view
- THEN no pronoun is displayed (or shows "Not specified")
- AND no errors occur

**AC-1.4.4: Styling Consistency**
- GIVEN the pronoun is displayed
- WHEN viewed in any context (list, detail, modal)
- THEN styling matches the design system and existing UI
- AND is visually consistent across views

### Implementation Tasks

- [ ] **TASK-1.4.1**: Update FinalCommentsList component to display pronoun column
- [ ] **TASK-1.4.2**: Update FinalCommentDetail component to display pronoun info
- [ ] **TASK-1.4.3**: Test pronoun display in all Final Comments views
- [ ] **TASK-1.4.4**: Handle null pronounId gracefully in all views

### Test Scenarios

1. **Test**: View Final Comments list with pronouns
   - **Expected**: Pronouns displayed in "pronoun - possessivePronoun" format

2. **Test**: View Final Comment detail with pronoun
   - **Expected**: Pronoun displayed in detail view

3. **Test**: View Final Comments with and without pronouns mixed
   - **Expected**: Comments with pronouns show selection, comments without show "Not specified"

---

## Implementation Order

**Recommended Implementation Sequence**:

1. **TASK-1.1** (2 hrs): Outcome Comments placeholder documentation
2. **TASK-1.2** (2 hrs): Personalized Comments placeholder documentation
3. **TASK-1.3** (6 hrs): Pronoun dropdown in Final Comments (highest effort)
4. **TASK-1.4** (3 hrs): Pronoun display in Final Comments UI

**Total**: ~13 hours of implementation + testing

---

## Definition of Done (All Stories)

- [ ] Code follows project code style and patterns
- [ ] All acceptance criteria met and tested
- [ ] TypeScript: 0 errors
- [ ] All tests passing (1359+ tests)
- [ ] No console errors in development or production
- [ ] Code reviewed and approved
- [ ] Design tokens used (no hardcoded values)
- [ ] Accessibility: dropdown is keyboard accessible and screen reader compatible
- [ ] Performance: Pronoun API calls < 200ms
- [ ] Documentation: Comments/JSDoc explain pronoun usage
- [ ] Database: No migrations required (pronounId field already exists)

---

## Risk Assessment

| Risk | Mitigation |
|------|-----------|
| Pronoun API unavailable | Add error state, allow form submission without pronoun |
| No pronouns created yet | Show helpful message "Create pronouns first" |
| Pronouns already selected in existing comments | Handle null pronounId gracefully (backwards compatible) |
| Placeholder text confusion | Provide clear documentation and examples |

---

## Success Metrics

- [ ] 4 user stories fully implemented
- [ ] All 10+ acceptance criteria met
- [ ] Zero TypeScript errors
- [ ] All 1359+ tests passing
- [ ] No breaking changes to existing functionality
- [ ] Pronoun dropdown works on all screen sizes
- [ ] Teachers report improved ability to personalize comments

---

## Related Documentation

- **Product Requirements**: prd.md
- **API Reference**: http://localhost:3000/api-docs (Pronouns section)
- **Design System**: docs/design-system.md
- **Acceptance Criteria**: Defined in each story above

---

## Change History

| Date | Author | Change |
|------|--------|--------|
| 2024-12-28 | Product Owner | Created 4 user stories for pronoun support |
