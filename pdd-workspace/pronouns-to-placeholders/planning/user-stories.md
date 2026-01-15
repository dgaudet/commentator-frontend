# User Stories: Replace Pronouns with Placeholders

## Story Mapping

```
EPIC: Replace Pronouns with Placeholders Utility
├── US-1: Reusable Utility Function (TECH STORY)
├── US-2: Bulk Upload Modal Integration
├── US-3: Add/Edit Personalized Comments Integration
├── US-4: Final Comments Integration
├── US-5: Error Handling & Edge Cases
└── US-6: Accessibility & Integration Testing
```

---

## US-1: Reusable Pronoun-to-Placeholder Utility (TECH STORY)

**ID**: TASK-1.1
**Priority**: P0 (Blocking others)
**Risk Tier**: Low
**Effort**: 2-3 days

### Story
```gherkin
GIVEN a comment text and a user's pronouns from the API
WHEN the replacePronounsWithPlaceholders utility is called
THEN all pronouns are replaced with standardized placeholders
  AND the function returns both the modified text and replacement count
  AND the operation is case-insensitive
```

### Acceptance Criteria

#### AC-1.1: Function Exports & Visibility
```
GIVEN the src/utils/pronouns.ts file exists
WHEN I import replacePronounsWithPlaceholders from src/utils/pronouns
THEN the function is properly exported and available to components
```

#### AC-1.2: Basic Pronoun Replacement
```
GIVEN text "He is excellent" and pronouns [{ pronoun: "he", possessivePronoun: "his" }]
WHEN replacePronounsWithPlaceholders is called
THEN the result is "<pronoun> is excellent"
```

#### AC-1.3: Possessive Pronoun Replacement
```
GIVEN text "His work is outstanding" and pronouns [{ pronoun: "he", possessivePronoun: "his" }]
WHEN replacePronounsWithPlaceholders is called
THEN the result is "<possessive pronoun> work is outstanding"
```

#### AC-1.4: Multiple Pronoun Occurrences
```
GIVEN text "She is excellent. She brings energy. Her work is great."
  AND pronouns [{ pronoun: "she", possessivePronoun: "her" }]
WHEN replacePronounsWithPlaceholders is called
THEN ALL occurrences are replaced (both "she"s and "her")
  AND result is "<pronoun> is excellent. <pronoun> brings energy. <possessive pronoun> work is great."
```

#### AC-1.5: Case-Insensitive Matching
```
GIVEN variations: "He", "he", "HE", "hE"
WHEN each is tested against pronoun "he"
THEN all variations are matched and replaced
```

#### AC-1.6: Multiple User Pronouns
```
GIVEN text "They are excellent. Their work is outstanding. They bring energy."
  AND multiple pronouns [{ pronoun: "they", possessivePronoun: "their" }, { pronoun: "sie", possessivePronoun: "zir" }]
WHEN replacePronounsWithPlaceholders is called
THEN only pronouns that exist in the provided array are replaced
  AND word boundary matching prevents partial matches (e.g., "the" is not replaced in "they")
```

#### AC-1.7: Return Value Structure
```
GIVEN successful replacement operation
WHEN replacePronounsWithPlaceholders returns
THEN the return object contains:
  - replacedText: string
  - replacementCount: { pronoun: number, possessivePronoun: number }
```

#### AC-1.8: Empty or Missing Pronouns Handling
```
GIVEN empty pronouns array
WHEN replacePronounsWithPlaceholders is called
THEN the original text is returned unchanged
  AND replacementCount shows 0 replacements
```

#### AC-1.9: Empty Text Handling
```
GIVEN empty string as text input
WHEN replacePronounsWithPlaceholders is called
THEN empty string is returned
  AND replacementCount shows 0 replacements
```

#### AC-1.10: Text Formatting Preservation
```
GIVEN text with line breaks, multiple spaces, special characters
WHEN replacePronounsWithPlaceholders processes it
THEN all formatting is preserved exactly
  AND only pronouns are replaced
```

### Tests Required (TDD Red-Green-Refactor)
- [ ] Test basic pronoun replacement
- [ ] Test possessive pronoun replacement
- [ ] Test case-insensitive matching
- [ ] Test multiple occurrences
- [ ] Test multiple pronoun sets
- [ ] Test empty pronouns array
- [ ] Test empty text
- [ ] Test text with special characters
- [ ] Test word boundary matching (don't replace partial matches)
- [ ] Test return value structure

---

## US-2: Replace Pronouns Button in Bulk Upload Modal

**ID**: TASK-1.2
**Priority**: P1
**Risk Tier**: Low
**Effort**: 2-3 days
**Depends on**: US-1

### Story
```gherkin
GIVEN a teacher is in the bulk personalized comments upload modal
WHEN they have text pasted with actual pronouns
THEN they can click "Replace Pronouns with Placeholders" button
  AND the button fetches their pronouns
  AND pronouns in the text are replaced with placeholders
  AND they see confirmation of how many replacements were made
```

### Acceptance Criteria

#### AC-2.1: Button Presence & Placement
```
GIVEN the BulkPersonalizedCommentsModal is open
WHEN I look at the textarea area
THEN a button labeled "Replace Pronouns with Placeholders" is visible
  AND it is positioned logically (near textarea, below or beside)
  AND it uses consistent styling with other buttons in the modal
```

#### AC-2.2: Button Disabled State
```
GIVEN pronouns are still loading or no pronouns exist for user
WHEN I look at the Replace Pronouns button
THEN the button is disabled with a disabled cursor
  AND a tooltip explains why it's disabled
```

#### AC-2.3: Loading State
```
GIVEN I click the Replace Pronouns button
WHEN the API call to fetch pronouns is in progress
THEN the button shows a loading spinner or "Loading..." text
  AND the button is disabled during the fetch
  AND the textarea is not modified
```

#### AC-2.4: Successful Replacement
```
GIVEN the textarea contains "He is excellent. His work is great."
  AND my pronouns include he/his
WHEN I click Replace Pronouns button
THEN the pronouns are replaced with placeholders
  AND textarea shows "<pronoun> is excellent. <possessive pronoun> work is great."
  AND I see a success message: "Replaced 2 pronouns (1 subject, 1 possessive)"
```

#### AC-2.5: No Pronouns Found
```
GIVEN the textarea contains "The student is excellent"
  AND no pronouns match in the text
WHEN I click Replace Pronouns button
THEN I see a message "No pronouns found in text"
  AND the text remains unchanged
```

#### AC-2.6: Error Handling
```
GIVEN the API call to fetch pronouns fails
WHEN the error occurs
THEN the button shows an error message: "Failed to load pronouns"
  AND the textarea is not modified
  AND the user can dismiss the error and try again
```

#### AC-2.7: Empty Textarea Handling
```
GIVEN the textarea is empty
WHEN I click Replace Pronouns button
THEN a message shows "Please enter text first"
  AND no API call is made
```

#### AC-2.8: Multiple Clicks
```
GIVEN text has been partially replaced already (mixed placeholders and pronouns)
WHEN I click Replace Pronouns button again
THEN it processes again correctly
  AND only remaining pronouns are replaced
  AND existing placeholders are not double-replaced
```

#### AC-2.9: Text Preservation
```
GIVEN any text in the textarea
WHEN Replace Pronouns operation completes
THEN all non-pronoun text remains exactly as before
  AND formatting, line breaks, spacing are preserved
```

#### AC-2.10: Accessibility
```
GIVEN the Replace Pronouns button exists
WHEN accessed via keyboard (Tab navigation)
THEN the button is focusable and activatable with Enter/Space
  AND the button has proper ARIA labels
  AND success messages are announced to screen readers
```

### Tests Required
- [ ] Button renders in modal
- [ ] Button is disabled when no pronouns
- [ ] Loading state displays correctly
- [ ] usePronounsQuery is called on click
- [ ] replacePronounsWithPlaceholders is called with correct data
- [ ] Textarea is updated with new text
- [ ] Success message displays with correct count
- [ ] Error message displays on API failure
- [ ] Empty text handling
- [ ] Multiple clicks work correctly

---

## US-3: Replace Pronouns Button in Personalized Comments Add/Edit

**ID**: TASK-1.3
**Priority**: P1
**Risk Tier**: Low
**Effort**: 1-2 days
**Depends on**: US-1

### Story
```gherkin
GIVEN a teacher is adding or editing a personalized comment
WHEN the modal is open with a comment textarea
THEN they can click "Replace Pronouns with Placeholders"
  AND pronouns are replaced in the textarea
  AND they see confirmation of replacements
```

### Acceptance Criteria

#### AC-3.1: Button in Add Modal
```
GIVEN the PersonalizedCommentModal is open in "add" mode
WHEN I look at the modal
THEN the "Replace Pronouns with Placeholders" button is visible
  AND it's positioned consistently with other action buttons
```

#### AC-3.2: Button in Edit Modal
```
GIVEN the PersonalizedCommentModal is open in "edit" mode
WHEN I look at the modal
THEN the "Replace Pronouns with Placeholders" button is visible
```

#### AC-3.3: Consistent Behavior
```
GIVEN the button works the same way in both add and edit modes
WHEN I click it
THEN the behavior is identical to US-2 (loading, success, error states)
```

#### AC-3.4: Modal Layout
```
GIVEN the button is added to the modal
WHEN the modal renders
THEN there is no layout shift or visual disruption
  AND existing buttons maintain their positions
  AND responsive design is preserved
```

### Tests Required
- [ ] Button renders in add modal
- [ ] Button renders in edit modal
- [ ] Successful replacement in add mode
- [ ] Successful replacement in edit mode
- [ ] Error handling consistent with US-2
- [ ] No regression on existing add/edit functionality

---

## US-4: Replace Pronouns Button in Final Comments

**ID**: TASK-1.4
**Priority**: P2
**Risk Tier**: Low
**Effort**: 1-2 days
**Depends on**: US-1

### Story
```gherkin
GIVEN a teacher is entering a final comment for a student
WHEN the FinalCommentsModal is open
THEN they can click "Replace Pronouns with Placeholders"
  AND pronouns in the comment are replaced with placeholders
```

### Acceptance Criteria

#### AC-4.1: Button Presence
```
GIVEN FinalCommentsModal is open
WHEN I look at the textarea
THEN "Replace Pronouns with Placeholders" button is visible
  AND uses same style as other buttons
```

#### AC-4.2: Functionality
```
GIVEN final comment contains pronouns
WHEN I click the button
THEN pronouns are replaced with placeholders
  AND success message displays count
  AND all error handling from US-2 applies
```

### Tests Required
- [ ] Button renders in final comments modal
- [ ] Successful replacement
- [ ] Error handling
- [ ] No regression on final comments functionality

---

## US-5: Error Handling & Edge Cases

**ID**: TASK-1.5
**Priority**: P1
**Risk Tier**: Low
**Effort**: 1-2 days
**Depends on**: US-1

### Story
```gherkin
GIVEN the Replace Pronouns feature is used in various scenarios
WHEN errors occur or edge cases arise
THEN the app handles them gracefully without data loss
```

### Acceptance Criteria

#### AC-5.1: API Failure Handling
```
GIVEN the pronoun endpoint returns an error
WHEN I click Replace Pronouns
THEN a user-friendly error message is shown
  AND original text is completely preserved
  AND I can retry without issues
```

#### AC-5.2: No Pronouns Configured
```
GIVEN the user has no pronouns configured
WHEN I click Replace Pronouns
THEN the button is disabled
  AND a tooltip explains "No pronouns configured"
```

#### AC-5.3: Special Characters in Pronouns
```
GIVEN a pronoun contains special characters (e.g., "zi'e")
WHEN replacePronounsWithPlaceholders processes text
THEN the pronoun is correctly matched and replaced
```

#### AC-5.4: Debouncing Multiple Clicks
```
GIVEN I rapidly click Replace Pronouns multiple times
WHEN multiple clicks occur within 500ms
THEN only one API call is made
  AND UI is updated once
```

#### AC-5.5: Word Boundary Matching
```
GIVEN text "the student excels"
  AND pronoun "he" in pronouns list
WHEN replacePronounsWithPlaceholders processes it
THEN "the" is NOT replaced (no partial word matching)
  AND only complete word "he" is matched
```

### Tests Required
- [ ] API error handling
- [ ] No pronouns scenario
- [ ] Special characters in pronouns
- [ ] Debouncing verification
- [ ] Word boundary matching

---

## US-6: Accessibility & Integration Testing

**ID**: TASK-1.6
**Priority**: P1
**Risk Tier**: Low
**Effort**: 2-3 days
**Depends on**: US-2, US-3, US-4

### Story
```gherkin
GIVEN the Replace Pronouns feature is implemented
WHEN I use it as a teacher with accessibility needs
THEN the feature is fully accessible and well-integrated
```

### Acceptance Criteria

#### AC-6.1: Keyboard Navigation
```
GIVEN the Replace Pronouns button is on the page
WHEN I navigate with Tab key
THEN the button receives focus
  AND I can activate it with Enter/Space
  AND focus management is correct after operation
```

#### AC-6.2: Screen Reader Announcements
```
GIVEN a screen reader is active
WHEN I click Replace Pronouns and operation completes
THEN success/error messages are automatically announced
  AND button state changes are communicated
```

#### AC-6.3: Visual Feedback
```
GIVEN any operation state (loading, success, error)
WHEN the state changes
THEN there is clear visual feedback
  AND text and color alone don't convey information
  AND icons or text provide redundancy
```

#### AC-6.4: ARIA Labels
```
GIVEN the Replace Pronouns button
WHEN I inspect it with accessibility tools
THEN it has proper aria-label or aria-labelledby
  AND disabled state has aria-disabled="true"
```

#### AC-6.5: No Page Layout Shifts
```
GIVEN the button is added to existing components
WHEN the page renders
THEN there are no Cumulative Layout Shift (CLS) issues
  AND the layout is stable when button appears/disappears
```

#### AC-6.6: Design Token Compliance
```
GIVEN the button and messages use the design system
WHEN rendered on the page
THEN all styling uses design tokens
  AND colors meet contrast requirements (WCAG AA)
  AND fonts and spacing are consistent
```

#### AC-6.7: Integration with Existing Features
```
GIVEN all components are in use
WHEN Replace Pronouns feature is used alongside other features
THEN no regressions in existing functionality
  AND state management doesn't conflict
  AND form validation still works correctly
```

### Tests Required
- [ ] Keyboard navigation and focus management
- [ ] Screen reader announcements
- [ ] Visual contrast and accessibility
- [ ] ARIA attributes
- [ ] Integration tests with existing features
- [ ] No regressions in other components

---

## Implementation Order

1. **US-1** (TASK-1.1): Create reusable utility function and tests
2. **US-5** (TASK-1.5): Add error handling and edge case handling to utility
3. **US-2** (TASK-1.2): Add button to bulk upload modal
4. **US-3** (TASK-1.3): Add button to personalized comments add/edit
5. **US-4** (TASK-1.4): Add button to final comments
6. **US-6** (TASK-1.6): Comprehensive accessibility and integration testing

---

## Definition of Done

Each user story is considered complete when:
- [ ] All acceptance criteria are met
- [ ] All tests pass (TDD red-green-refactor cycle)
- [ ] No TypeScript errors or warnings
- [ ] Linting passes (`npm run lint`)
- [ ] Code review approved
- [ ] Documentation updated if needed
- [ ] No accessibility violations (WCAG 2.1 AA)
- [ ] Tested in multiple browsers

---

## Risk Assessment by Story

| Story | Risk | Mitigation |
|-------|------|-----------|
| US-1 | None | Straightforward utility, well-defined requirements |
| US-2 | Low - API integration | Existing usePronounsQuery hook reduces risk |
| US-3 | Low - Component modification | Isolated changes to one component |
| US-4 | Low - Component modification | Isolated changes to one component |
| US-5 | Very Low - Edge cases | Comprehensive test coverage |
| US-6 | Very Low - Accessibility | WCAG 2.1 AA requirements are clear |

