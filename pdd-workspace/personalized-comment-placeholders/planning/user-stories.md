# User Stories - Personalized Comments Placeholder Support

**Feature**: personalized-comment-placeholders
**Complexity**: L1-MICRO
**Story Points**: 10
**Duration**: 1-2 weeks

---

## Epic: Placeholder Support in PersonalizedComments

**Epic Goal**: Enable teachers to use dynamic placeholders in personalized comments, matching the functionality available in OutcomeComments

---

## Story Breakdown

### US-PLACEHOLDER-PC-001: Display Placeholder Tips in Add Form
**Priority**: HIGH | **Points**: 2 | **Risk**: LOW

**As a** teacher
**I want** to see available placeholders and usage examples when creating a personalized comment
**So that** I know what dynamic content I can use

**Acceptance Criteria**:
1. Display placeholder tips box above comment textarea in "Add New Comment" section
2. Show heading: "💡 Tip: Use Dynamic Placeholders"
3. Display three placeholders as inline code: `<first name>`, `<last name>`, `<grade>`
4. Show example transformation: `"<first name> earned <grade> points" → "Alice earned 95 points"`
5. Match OutcomeComments tips box styling exactly (colors, spacing, typography)
6. Use semantic HTML with ARIA attributes for accessibility

---

### US-PLACEHOLDER-PC-002: Display Placeholder Tips in Edit Form
**Priority**: HIGH | **Points**: 1 | **Risk**: LOW

**As a** teacher
**I want** to see placeholder tips when editing an existing personalized comment
**So that** I can add or modify placeholders in existing comments

**Acceptance Criteria**:
1. Display same placeholder tips box in edit mode as add form
2. Use identical styling and content to add form tips box
3. Position above comment textarea (consistent with add form)
4. Maintain placeholder tips visibility when switching between add/edit modes

---

### US-PLACEHOLDER-PC-003: Validate Placeholders on Input
**Priority**: HIGH | **Points**: 2 | **Risk**: LOW

**As a** teacher
**I want** to receive real-time validation warnings for malformed placeholders
**So that** I catch typos before saving the comment

**Acceptance Criteria**:
1. Validate placeholders on every keystroke using `validatePlaceholders()` utility
2. Display warning for unclosed placeholders (e.g., `<first name`): "⚠️ Placeholder not closed. Example: <first name>"
3. Display warning for empty placeholders (e.g., `<>`): "⚠️ Empty placeholder detected. Use: <first name>, <last name>, <grade>"
4. Display all warnings in stacked list when multiple errors exist
5. Show warnings in yellow box below textarea with ARIA `role="alert"` and `aria-live="polite"`
6. Automatically hide warning box when all errors corrected
7. Do NOT prevent form submission (warnings only, not errors)

**Validation Messages**:
- Unclosed: `"⚠️ Placeholder not closed. Example: <first name>"`
- Empty: `"⚠️ Empty placeholder detected. Use: <first name>, <last name>, <grade>"`

---

### US-PLACEHOLDER-PC-004: Move Rating Selector Below Comment Textarea
**Priority**: MEDIUM | **Points**: 2 | **Risk**: LOW

**As a** teacher
**I want** the rating selector positioned below the comment textarea
**So that** the comment input is more prominent and the workflow feels more natural

**Acceptance Criteria**:
1. Display comment textarea first, followed by rating selector (add form)
2. Display comment textarea first, followed by rating selector (edit form)
3. Maintain all existing rating selector functionality (emoji selection, tooltip, ARIA)
4. Show label "Rating" above emoji buttons
5. Maintain proper spacing between textarea and rating selector (`spacing.md`)
6. Include both comment text and rating value on form submission (no behavior change)

**Layout Order**:
1. Placeholder tips box
2. Comment textarea + character counter + validation warnings
3. Rating selector
4. Score range inputs

---

### US-PLACEHOLDER-PC-006: Replace Placeholders When Populating Final Comments
**Priority**: HIGH | **Points**: 2 | **Risk**: LOW

**As a** teacher
**I want** placeholders in personalized comments to be automatically replaced with student data when I click "Populate with Above Comments"
**So that** the final comment contains personalized, student-specific text

**Acceptance Criteria**:
1. Collect student data from form (firstName, lastName, grade) when populating
2. Call `replacePlaceholders(comment, studentData)` for each selected personalized comment
3. Replace `<first name>` with student's firstName
4. Replace `<last name>` with student's lastName
5. Replace `<grade>` with student's grade
6. Replace placeholders in each comment individually before concatenation
7. Leave placeholder text unchanged when student data is missing
8. Replace placeholders in both OutcomeComments and PersonalizedComments
9. Truncate to 1000 characters after replacement if needed

**Workflow Example**:
- Student data: firstName="Alice", grade=95
- Personalized comment: `"<first name> earned <grade> points this semester"`
- Result after populate: `"Alice earned 95 points this semester"`

**Technical Notes**:
- Code structure already exists in FinalCommentsModal.tsx (lines 426-432)
- Uses existing `replacePlaceholders()` utility
- Needs verification and integration testing

---

### US-PLACEHOLDER-PC-005: Test Placeholder Functionality End-to-End
**Priority**: HIGH | **Points**: 1 | **Risk**: LOW

**As a** developer
**I want** comprehensive test coverage for placeholder functionality
**So that** the feature is reliable and maintainable

**Acceptance Criteria**:
1. Unit tests verify placeholder tips render correctly (add + edit)
2. Unit tests verify validation warnings appear for malformed placeholders
3. Unit tests verify validation warnings disappear when corrected
4. Unit tests verify rating selector appears below textarea
5. Integration tests verify full workflow: create comment → apply to final comment → verify replacement
6. Accessibility tests verify ARIA attributes, keyboard navigation, screen reader support
7. Achieve ≥90% code coverage for new components and logic

**Test Coverage**:
- Unit tests for rendering, validation, and layout
- Integration tests for end-to-end placeholder workflow
- Accessibility tests for WCAG 2.1 AA compliance

---

## Implementation Checklist

### Phase 1: Core Placeholder Support (Week 1)
- [ ] US-PLACEHOLDER-PC-001: Placeholder tips in add form
- [ ] US-PLACEHOLDER-PC-002: Placeholder tips in edit form
- [ ] US-PLACEHOLDER-PC-003: Validation on input
- [ ] US-PLACEHOLDER-PC-006: Replace placeholders in final comments
- [ ] US-PLACEHOLDER-PC-005: Test coverage

### Phase 2: UI Refinement (Week 1-2)
- [ ] US-PLACEHOLDER-PC-004: Reposition rating selector
- [ ] Visual QA and polish
- [ ] Accessibility audit

---

## Success Metrics

- **Adoption Rate**: 50%+ of personalized comments use placeholders within 1 month
- **Time Savings**: 30% reduction in time spent creating personalized comments
- **Error Reduction**: 80% decrease in typos in student names/grades
- **User Satisfaction**: 85%+ positive feedback on placeholder usability

---

## Technical Notes

### Reusable Utilities (Existing)
- `validatePlaceholders(text: string): string[]` - Returns array of warning messages
- `replacePlaceholders(text: string, studentData: StudentData): string` - Replaces placeholders with actual data

### Supported Placeholders
- `<first name>` → Student's firstName
- `<last name>` → Student's lastName
- `<grade>` → Student's numeric grade

### Validation Patterns
- Unclosed placeholder: `/<[a-zA-Z ][^>]*$/`
- Empty placeholder: `/<>/`

### Design Tokens
- Tips box background: `colors.primary[50]`
- Tips box border: `colors.primary[200]`
- Warning box background: `colors.semantic.warningLight`
- Warning box border: `colors.semantic.warning`

---

## Dependencies

### Internal
- `src/utils/placeholders.ts` (existing)
- `src/components/common/EmojiRatingSelector.tsx` (existing)
- Design token system (colors, spacing, typography, borders)

### External
- None

---

## Risks & Mitigation

| Risk | Mitigation |
|------|------------|
| UI layout disruption | Follow OutcomeComments pattern exactly |
| Validation performance | `validatePlaceholders()` is lightweight (regex) |
| Placeholder confusion | Clear tips with examples |
| Rating repositioning breaks tests | Update test selectors, verify DOM order |

---

**Status**: PLANNING COMPLETE - Ready for Development
**Next Steps**: Hand off to Frontend Engineer for implementation
