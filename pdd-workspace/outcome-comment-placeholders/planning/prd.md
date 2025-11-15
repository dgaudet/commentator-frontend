# Product Requirements Document (PRD)
# Dynamic Placeholders for Outcome Comments

**Version**: 1.0
**Date**: 2025-01-14
**Status**: Planning Complete
**Complexity**: L1-MICRO (10 story points, 1-2 weeks)

---

## 1. Executive Summary

### Problem Statement
Teachers currently create outcome comments with generic text that applies to all students. When populating final comments, teachers must manually edit the text to personalize it with student-specific information (name, grade). This manual process is time-consuming and error-prone.

### Solution Overview
Enable teachers to use placeholder tokens in outcome comments that automatically replace with student-specific data when the "Populate with Above Comments" button is clicked. This allows teachers to write reusable, personalized comment templates.

### Business Value
- **Time Savings**: Reduces manual editing of populated comments by ~30 seconds per student
- **Consistency**: Ensures student names and grades are accurate in final comments
- **Personalization**: Enables more personalized feedback without additional effort
- **Scalability**: Teachers can create richer comment templates once, use many times

---

## 2. Feature Complexity Assessment (AWO)

**Complexity Level**: **L1-MICRO**

**Assessment Criteria**:
- **Story Count**: 6 user stories
- **Estimated Points**: 10 story points
- **Duration**: 1-2 weeks
- **Team Size**: Single frontend developer
- **External Integrations**: None
- **Data Migrations**: None (backward compatible)
- **Performance Critical**: No

**Architecture Review**: **SKIPPED** (L1-MICRO features do not require architecture review)

**Rationale**:
- Straightforward enhancement to existing OutcomeComment system
- No new entities or database changes
- Frontend-only string replacement logic
- Clear acceptance criteria with well-defined scope

---

## 3. User Stories

### MVP Scope - MUST HAVE (10 points)

#### **US-PLACEHOLDER-001**: Define Supported Placeholders
**Priority**: HIGH (MVP) | **Story Points**: 1

**User Story**:
```
As a teacher,
I want to know which placeholders are available,
So that I can use them correctly in my outcome comments.
```

**Acceptance Criteria**:
1. ✅ System supports three placeholders:
   - `<first name>` → Student's first name
   - `<last name>` → Student's last name
   - `<grade>` → Student's numeric grade
2. ✅ Placeholders are case-insensitive (e.g., `<First Name>`, `<FIRST NAME>` all work)
3. ✅ Placeholders can appear multiple times in a single comment
4. ✅ Placeholders can appear anywhere in the comment text
5. ✅ Unknown placeholders (e.g., `<subject>`) are left as-is (not replaced)

**Technical Notes**:
- Use regex pattern matching: `/<([^>]+)>/g`
- Normalize placeholder text to lowercase before matching
- Define enum or constant for supported placeholders

**Dependencies**: None

---

#### **US-PLACEHOLDER-002**: Add UI Documentation for Placeholders
**Priority**: HIGH (MVP) | **Story Points**: 2

**User Story**:
```
As a teacher,
I want to see instructions on how to use placeholders,
So that I understand how to create personalized comment templates.
```

**Acceptance Criteria**:
1. ✅ Add info section above OutcomeComment text input in Add/Edit forms
2. ✅ Info section displays:
   - "Use placeholders to personalize comments when populating final comments:"
   - Bulleted list: `<first name>`, `<last name>`, `<grade>`
   - Example: "Great work, `<first name>`! You earned a `<grade>`."
3. ✅ Info section styled consistently with existing form help text
4. ✅ Info section appears in both:
   - OutcomeComments Add form
   - OutcomeComments Edit form
5. ✅ Info section is visually distinct but not intrusive (subtle background color)

**UI Mockup**:
```
┌─────────────────────────────────────────────────────┐
│ ℹ️ Use placeholders to personalize comments:        │
│   • <first name> - Student's first name            │
│   • <last name> - Student's last name              │
│   • <grade> - Student's grade                      │
│   Example: "Great work, <first name>! Grade: <grade>" │
└─────────────────────────────────────────────────────┘

Comment Text:
┌─────────────────────────────────────────────────────┐
│ [Textarea for comment input...]                    │
└─────────────────────────────────────────────────────┘
```

**Technical Notes**:
- Add info box component above textarea in OutcomeCommentsModal
- Use existing theme colors for info background (e.g., light blue)
- Match styling to other info messages in the app

**Dependencies**: None

---

#### **US-PLACEHOLDER-003**: Validate Placeholders in OutcomeComment Forms
**Priority**: HIGH (MVP) | **Story Points**: 2

**User Story**:
```
As a teacher,
I want the system to validate my placeholder usage,
So that I know if I've made a typo or formatting error.
```

**Acceptance Criteria**:
1. ✅ Detect malformed placeholders with validation warnings:
   - Unclosed placeholder: `<first name` → Warning: "Placeholder not closed"
   - Empty placeholder: `<>` → Warning: "Empty placeholder detected"
   - Missing angle bracket: `first name>` → No warning (treated as normal text)
2. ✅ Warning displayed below comment textarea (similar to character counter)
3. ✅ Warning message format: "⚠️ Warning: [issue description]. Example: `<first name>`"
4. ✅ Validation is non-blocking (teachers can still save with warnings)
5. ✅ Validation runs:
   - On blur (when user leaves the textarea)
   - On submit (before save)
6. ✅ Multiple issues displayed as separate warnings

**Validation Rules**:
- **Unclosed Placeholder**: Regex check for `<[^>]*$` (angle bracket without closing)
- **Empty Placeholder**: Exact match for `<>`
- **Unknown Placeholder**: No validation (left as-is per requirements)

**Technical Notes**:
- Add validation function: `validatePlaceholders(commentText: string): string[]`
- Return array of warning messages
- Display warnings in yellow/orange (not red - not errors)

**Dependencies**: US-PLACEHOLDER-001

---

#### **US-PLACEHOLDER-004**: Replace Placeholders in Populate Button Logic
**Priority**: HIGH (MVP) | **Story Points**: 3

**User Story**:
```
As a teacher,
I want placeholders to be replaced with student data when I populate final comments,
So that I get personalized comments automatically.
```

**Acceptance Criteria**:
1. ✅ When "Populate with Above Comments" button is clicked:
   - Replace all `<first name>` with student's `firstName`
   - Replace all `<last name>` with student's `lastName`
   - Replace all `<grade>` with student's `grade` (numeric value)
2. ✅ Replacement is case-insensitive for placeholder name
3. ✅ Replacement preserves surrounding text and formatting
4. ✅ Multiple placeholders in the same comment are all replaced
5. ✅ If student data is missing:
   - `<first name>` with no `firstName` → Leave as `<first name>`
   - `<last name>` with no `lastName` → Leave as `<last name>`
   - `<grade>` with no `grade` → Leave as `<grade>`
6. ✅ Outcome comment text AND personalized comment text both processed
7. ✅ Final comment textarea receives fully replaced text

**Example Transformations**:

| Outcome Comment Template | Student Data | Final Comment Result |
|-------------------------|--------------|---------------------|
| "Great work, `<first name>`!" | firstName: "Alice" | "Great work, Alice!" |
| "`<last name>` showed improvement." | lastName: "Smith" | "Smith showed improvement." |
| "Grade: `<grade>`/100" | grade: 95 | "Grade: 95/100" |
| "`<first name>` `<last name>` earned `<grade>`" | All present | "Alice Smith earned 95" |

**Technical Notes**:
- Create utility function: `replacePlaceholders(text: string, studentData: StudentData): string`
- StudentData interface: `{ firstName?: string, lastName?: string, grade?: number }`
- Use regex with case-insensitive flag: `/<first name>/gi`
- Process both outcome comment AND personalized comment before concatenation

**Dependencies**: US-PLACEHOLDER-001

---

#### **US-PLACEHOLDER-005**: Handle Edge Cases in Placeholder Replacement
**Priority**: MEDIUM (MVP) | **Story Points**: 1

**User Story**:
```
As a teacher,
I want placeholders to work correctly even with edge cases,
So that I have confidence in the feature.
```

**Acceptance Criteria**:
1. ✅ Empty student fields handled gracefully:
   - `firstName = ""` → `<first name>` left as-is
   - `lastName = ""` → `<last name>` left as-is
   - `grade = 0` → Replaced with "0" (0 is valid)
2. ✅ Special characters in student names preserved:
   - Names with apostrophes: "O'Brien" → Correct
   - Names with hyphens: "Mary-Jane" → Correct
   - Accented characters: "José" → Correct
3. ✅ Whitespace handling:
   - Leading/trailing spaces in placeholders: `< first name >` → NOT recognized (exact match required)
   - Extra spaces: `<first  name>` → NOT recognized
4. ✅ Nested angle brackets:
   - `<<first name>>` → Inner placeholder replaced, outer brackets remain
5. ✅ Placeholder-like text not replaced:
   - HTML tags: `<div>` → Left as-is (not a placeholder)
   - Comparison operators: `<90` → Left as-is

**Technical Notes**:
- Exact whitespace matching required (no trim)
- Only recognize: `<first name>`, `<last name>`, `<grade>` (exact, case-insensitive)
- Use word boundary checks to avoid false matches

**Dependencies**: US-PLACEHOLDER-004

---

#### **US-PLACEHOLDER-006**: Unit Tests for Placeholder Logic
**Priority**: HIGH (MVP) | **Story Points**: 1

**User Story**:
```
As a developer,
I want comprehensive unit tests for placeholder replacement,
So that we catch bugs early and ensure reliability.
```

**Acceptance Criteria**:
1. ✅ Test suite covers:
   - Basic replacement (single placeholder)
   - Multiple placeholders
   - Case-insensitive matching
   - Missing student data
   - Empty strings
   - Special characters in names
   - Edge cases (nested brackets, non-placeholders)
2. ✅ Test validation function:
   - Unclosed placeholders
   - Empty placeholders
   - Valid comments (no warnings)
3. ✅ Test integration with populate button:
   - Mock student data
   - Verify final comment text
4. ✅ 100% code coverage for placeholder utility functions

**Test Cases (Minimum)**:
```typescript
describe('replacePlaceholders', () => {
  it('replaces <first name> with student firstName')
  it('replaces <last name> with student lastName')
  it('replaces <grade> with student grade')
  it('handles multiple placeholders')
  it('is case-insensitive')
  it('leaves unknown placeholders as-is')
  it('handles missing student data')
  it('handles special characters in names')
  it('does not replace HTML tags')
})

describe('validatePlaceholders', () => {
  it('detects unclosed placeholders')
  it('detects empty placeholders')
  it('returns empty array for valid comments')
})
```

**Technical Notes**:
- Use Jest for unit tests
- Create test file: `src/utils/__tests__/placeholders.test.ts`
- TDD approach: Write tests before implementation

**Dependencies**: US-PLACEHOLDER-001, US-PLACEHOLDER-003, US-PLACEHOLDER-004

---

### SHOULD HAVE (Future Enhancement - Not in MVP)

#### **US-PLACEHOLDER-007**: Placeholder Autocomplete UI
**Priority**: LOW (Future) | **Story Points**: 3

**User Story**:
```
As a teacher,
I want a quick way to insert placeholders,
So that I don't have to type angle brackets manually.
```

**Acceptance Criteria**:
1. ✅ Add "Insert Placeholder" dropdown button above comment textarea
2. ✅ Dropdown shows three options: "First Name", "Last Name", "Grade"
3. ✅ Clicking option inserts placeholder at cursor position
4. ✅ If text is selected, placeholder replaces selection
5. ✅ Cursor moves to end of inserted placeholder

**Status**: **Deferred to future sprint** (not in MVP scope)

---

## 4. Technical Requirements

### Placeholder Parsing

**Supported Placeholders**:
```typescript
const PLACEHOLDERS = {
  FIRST_NAME: '<first name>',
  LAST_NAME: '<last name>',
  GRADE: '<grade>',
} as const;

type PlaceholderKey = keyof typeof PLACEHOLDERS;
```

**Replacement Function Signature**:
```typescript
interface StudentData {
  firstName?: string;
  lastName?: string;
  grade?: number;
}

function replacePlaceholders(
  text: string,
  studentData: StudentData
): string;
```

**Validation Function Signature**:
```typescript
function validatePlaceholders(text: string): string[];
// Returns array of warning messages (empty if valid)
```

### Integration Points

**Affected Components**:
1. **OutcomeCommentsModal** (Add/Edit forms)
   - Add UI documentation section
   - Add validation warnings display
2. **FinalCommentsModal** (Populate button logic)
   - Call `replacePlaceholders()` before setting final comment text
   - Process both outcome comment AND personalized comment
3. **Utility Module**: `src/utils/placeholders.ts`
   - Implement replacement logic
   - Implement validation logic

### Backward Compatibility

**CRITICAL**: Existing outcome comments without placeholders MUST work unchanged.

**Validation**:
- Comments without `<` or `>` characters → No change
- Comments with HTML-like tags (e.g., `<div>`) → Preserved as-is
- Comments with mathematical operators (e.g., `score <90`) → Preserved as-is

---

## 5. User Experience & Design

### UI Placement

**OutcomeComments Add/Edit Forms**:
```
┌──────────────────────────────────────────────────────┐
│ Add Outcome Comment                                  │
├──────────────────────────────────────────────────────┤
│ Grade Range: [90] to [100]                          │
│                                                      │
│ ℹ️ Use placeholders to personalize comments:         │
│   • <first name>, <last name>, <grade>              │
│   Example: "Great work, <first name>! Grade: <grade>" │
│                                                      │
│ Comment:                                             │
│ ┌──────────────────────────────────────────────────┐│
│ │ <first name> demonstrated excellent understanding││
│ │ of the material. Grade: <grade>/100.             ││
│ └──────────────────────────────────────────────────┘│
│ ⚠️ Warning: Unclosed placeholder detected.          │
│ 85/500 characters                                    │
│                                                      │
│ [Cancel] [Save]                                      │
└──────────────────────────────────────────────────────┘
```

**FinalCommentsModal (Before Populate)**:
```
Outcome Comment by Grade: [95]
"<first name> demonstrated excellent understanding. Grade: <grade>/100."

Personalized Comment: [Selected: "Great participation this term."]

[Populate with Above Comments]  ← Clicking this replaces placeholders
```

**FinalCommentsModal (After Populate)**:
```
Comment:
┌──────────────────────────────────────────────────────┐
│ Alice demonstrated excellent understanding. Grade:   │
│ 95/100. Great participation this term.              │
└──────────────────────────────────────────────────────┘
```

### Visual Design

**Info Section Styling**:
- Background: Light blue (`#EFF6FF` or similar)
- Border: 1px solid light blue (`#BFDBFE`)
- Padding: 12px
- Border radius: 4px
- Icon: ℹ️ (info icon)
- Font size: 14px (slightly smaller than body)
- Margin: 12px bottom

**Warning Styling**:
- Color: Orange/amber (`#F59E0B`)
- Icon: ⚠️ (warning triangle)
- Font size: 14px
- Margin: 4px top

---

## 6. Validation Rules

### Placeholder Format Validation

| Issue | Detection | Warning Message |
|-------|-----------|-----------------|
| Unclosed placeholder | Regex: `<[^>]*$` | "⚠️ Placeholder not closed. Example: `<first name>`" |
| Empty placeholder | Exact match: `<>` | "⚠️ Empty placeholder detected. Use: `<first name>`, `<last name>`, `<grade>`" |

**Non-Blocking**: Warnings do not prevent saving (teachers can override).

### Replacement Validation

| Condition | Behavior |
|-----------|----------|
| Student data present | Replace placeholder with value |
| Student data missing/empty | Leave placeholder as-is |
| Grade = 0 | Replace with "0" (0 is valid) |
| Grade = null/undefined | Leave `<grade>` as-is |
| Unknown placeholder | Leave as-is (e.g., `<subject>`) |

---

## 7. Success Metrics

### Adoption Metrics
- **Target**: 50%+ of outcome comments use placeholders within 4 weeks
- **Measurement**: Count outcome comments containing `<first name>`, `<last name>`, or `<grade>`

### Efficiency Metrics
- **Target**: 20% reduction in average time to create final comments
- **Measurement**: Time from opening FinalCommentsModal to clicking Save (with vs. without placeholders)

### Quality Metrics
- **Target**: <5% of final comments contain placeholder errors (e.g., unclosed `<first name`)
- **Measurement**: Scan final comment text for malformed placeholders

### User Satisfaction
- **Target**: 4.0/5.0+ rating on post-release survey question: "How useful are placeholders in outcome comments?"
- **Measurement**: In-app survey after 2 weeks of usage

---

## 8. Testing Strategy

### Unit Tests (US-PLACEHOLDER-006)
- ✅ `replacePlaceholders()` function (10+ test cases)
- ✅ `validatePlaceholders()` function (5+ test cases)
- ✅ Edge cases (special characters, empty data, etc.)

### Integration Tests
- ✅ OutcomeComments form displays info section
- ✅ Validation warnings appear correctly
- ✅ Populate button replaces placeholders in final comment textarea
- ✅ Both outcome comment AND personalized comment processed

### E2E Tests (Playwright)
- ✅ Teacher creates outcome comment with placeholders
- ✅ Teacher populates final comment for student
- ✅ Final comment contains student-specific data (no placeholders)
- ✅ Existing comments without placeholders still work

### Backward Compatibility Tests
- ✅ Load existing outcome comments without placeholders
- ✅ Verify no errors or unexpected behavior
- ✅ Verify existing comments display correctly

---

## 9. Risk Assessment

### Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Regex replacement breaks with edge cases | Medium | High | Comprehensive unit tests (US-PLACEHOLDER-006) |
| Validation false positives | Low | Medium | Clear validation rules, non-blocking warnings |
| Performance with long comments | Low | Low | Simple string replacement (O(n)), negligible impact |
| Conflicts with existing HTML/markdown | Low | Medium | Only match exact placeholder formats |

### User Experience Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Teachers confused by placeholder syntax | Medium | Medium | Clear UI documentation (US-PLACEHOLDER-002) |
| Teachers ignore validation warnings | Medium | Low | Non-blocking warnings allow override |
| Placeholders not discoverable | Low | Medium | Visible info section in all forms |

### Rollback Plan

If critical issues arise:
1. **Phase 1**: Disable placeholder replacement (comments saved with placeholders intact)
2. **Phase 2**: Hide UI documentation section (feature invisible to users)
3. **Phase 3**: Fix issues and re-enable

**No data migration required** - all changes are frontend-only.

---

## 10. Prioritization Rationale

### MVP Scope (10 points)
**User Stories**: US-PLACEHOLDER-001 through US-PLACEHOLDER-006

**Justification**:
- **High Business Value**: Direct time savings for teachers (personalization automation)
- **Low Technical Risk**: Frontend-only, no database changes
- **Quick Win**: 1-2 weeks to implement
- **User-Requested**: Feature explicitly requested by product owner
- **Foundation**: Establishes extensible placeholder system for future enhancements

### Future Enhancements (Deferred)
**User Story**: US-PLACEHOLDER-007 (Autocomplete UI)

**Justification**:
- **Medium Business Value**: Nice-to-have convenience feature
- **Higher Technical Complexity**: Requires cursor position tracking, dropdown component
- **Not Essential**: Teachers can type placeholders manually with documentation
- **3 story points**: Better spent on MVP delivery first

---

## 11. Dependencies & Constraints

### Dependencies
- **No external dependencies**: Uses existing React, TypeScript, Jest stack
- **Component Dependencies**: OutcomeCommentsModal, FinalCommentsModal (already exist)

### Constraints
- **Backward Compatibility**: MUST NOT break existing outcome comments
- **Performance**: Placeholder replacement must complete <100ms
- **Browser Support**: All modern browsers (no IE11 requirement)
- **Accessibility**: Info sections must be screen-reader accessible

---

## 12. Release Plan

### Sprint 1: Core Implementation (Week 1)
- ✅ US-PLACEHOLDER-001: Define placeholders
- ✅ US-PLACEHOLDER-002: Add UI documentation
- ✅ US-PLACEHOLDER-003: Validation logic
- ✅ US-PLACEHOLDER-004: Replacement logic

### Sprint 2: Edge Cases & Testing (Week 2)
- ✅ US-PLACEHOLDER-005: Edge cases
- ✅ US-PLACEHOLDER-006: Unit tests
- ✅ Integration testing
- ✅ E2E testing

### Release Criteria
- ✅ All 6 MVP user stories completed
- ✅ 100% test coverage for placeholder utility functions
- ✅ E2E tests passing
- ✅ Code review approved
- ✅ Product Owner acceptance

---

## 13. Open Questions & Decisions

### Resolved Decisions
✅ **Q1**: Should placeholders work in PersonalizedComments too?
**A1**: No, only OutcomeComments for MVP.

✅ **Q2**: Should we show a preview of replaced text?
**A2**: No, not needed for MVP.

✅ **Q3**: Should validation block saving?
**A3**: No, warnings are non-blocking.

✅ **Q4**: Are placeholders case-sensitive?
**A4**: No, case-insensitive matching.

### Future Considerations
- **Extensibility**: Add more placeholders (e.g., `<class name>`, `<subject>`, `<date>`)
- **Autocomplete UI**: Dropdown to insert placeholders (US-PLACEHOLDER-007)
- **Templates**: Pre-built outcome comment templates with placeholders
- **Personalized Comments**: Extend placeholder support to personalized comments

---

## 14. Appendices

### Appendix A: Example Use Cases

**Use Case 1: Standard Grade-Based Comment**
```
Template: "<first name> demonstrated strong understanding of the material. Grade: <grade>/100."
Student: { firstName: "Alice", lastName: "Smith", grade: 95 }
Result: "Alice demonstrated strong understanding of the material. Grade: 95/100."
```

**Use Case 2: Formal Comment with Last Name**
```
Template: "<last name> has shown consistent improvement throughout the term."
Student: { firstName: "Bob", lastName: "Johnson", grade: 88 }
Result: "Johnson has shown consistent improvement throughout the term."
```

**Use Case 3: Multiple Placeholders**
```
Template: "Congratulations, <first name> <last name>! You achieved a <grade> on this assessment."
Student: { firstName: "Charlie", lastName: "Brown", grade: 92 }
Result: "Congratulations, Charlie Brown! You achieved a 92 on this assessment."
```

### Appendix B: Technical Implementation Sketch

```typescript
// src/utils/placeholders.ts

const PLACEHOLDERS = {
  FIRST_NAME: '<first name>',
  LAST_NAME: '<last name>',
  GRADE: '<grade>',
} as const;

interface StudentData {
  firstName?: string;
  lastName?: string;
  grade?: number;
}

export function replacePlaceholders(
  text: string,
  studentData: StudentData
): string {
  let result = text;

  // Replace <first name> (case-insensitive)
  if (studentData.firstName && studentData.firstName.trim()) {
    result = result.replace(/<first name>/gi, studentData.firstName);
  }

  // Replace <last name> (case-insensitive)
  if (studentData.lastName && studentData.lastName.trim()) {
    result = result.replace(/<last name>/gi, studentData.lastName);
  }

  // Replace <grade> (case-insensitive)
  if (studentData.grade !== undefined && studentData.grade !== null) {
    result = result.replace(/<grade>/gi, studentData.grade.toString());
  }

  return result;
}

export function validatePlaceholders(text: string): string[] {
  const warnings: string[] = [];

  // Check for unclosed placeholders
  if (/<[^>]*$/.test(text)) {
    warnings.push('⚠️ Placeholder not closed. Example: <first name>');
  }

  // Check for empty placeholders
  if (text.includes('<>')) {
    warnings.push('⚠️ Empty placeholder detected. Use: <first name>, <last name>, <grade>');
  }

  return warnings;
}
```

---

**END OF PRD**

*Version 1.0 - Approved for Implementation*
*Feature: outcome-comment-placeholders*
*Complexity: L1-MICRO (10 story points, 1-2 weeks)*
