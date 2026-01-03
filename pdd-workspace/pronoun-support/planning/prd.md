# Pronoun Support for Student Comments - Product Requirements Document

**Feature**: Add pronoun placeholder support to Outcome Comments, Personalized Comments, and enable pronoun selection in Final Comments

**Priority**: HIGH

**Status**: Ready for Implementation

**Complexity**: L1 (MICRO)

**Estimated Effort**: 1-2 weeks (single developer, ~16 hours)

---

## Executive Summary

Implement comprehensive pronoun support across the comment system to enable teachers to personalize feedback using student pronouns. Teachers will be able to:

1. Use pronoun placeholders (`{{pronoun}}` and `{{possessivePronoun}}`) when creating Outcome Comments and Personalized Comments
2. Select a pronoun for each student when creating Final Comments
3. See pronouns rendered correctly in all comment contexts

**Business Value**:
- ✅ Improves inclusivity and cultural sensitivity in student feedback
- ✅ Enables personalized comments that respect student identities
- ✅ Simple, intuitive user interface for pronoun management
- ✅ Leverages existing pronoun infrastructure (already in backend API)

---

## Problem Statement

Currently, the comment system does not support pronouns:
1. Teachers cannot reference pronouns in Outcome Comments or Personalized Comments
2. Final Comments have a `pronounId` field in the API but no UI to select pronouns
3. Comments lack personalization when used with student pronouns
4. System doesn't respect student gender identity or preferences

**Impact**:
- Comments feel less personal and inclusive
- Teachers must manually type pronouns rather than using placeholders
- Pronoun selection feature exists in backend but is inaccessible to users

---

## Solution Overview

### Architecture

```
Comment Creation Flow:
├─ Outcome Comments
│  └─ Support {{pronoun}} and {{possessivePronoun}} placeholders in text
├─ Personalized Comments
│  └─ Support {{pronoun}} and {{possessivePronoun}} placeholders in text
└─ Final Comments
   ├─ Existing pronounId field (nullable)
   ├─ New UI: Dropdown to select pronoun
   └─ Dropdown format: "pronoun - possessivePronoun" (e.g., "they - their")

Pronoun Data Source:
GET /api/pronouns → List of user's pronouns
└─ Populated from: { id, pronoun, possessivePronoun }
```

### Feature Scope

| Component | Change | Notes |
|-----------|--------|-------|
| **Outcome Comments** | Add documentation for {{pronoun}} and {{possessivePronoun}} placeholders | No schema changes (just documentation) |
| **Personalized Comments** | Add documentation for {{pronoun}} and {{possessivePronoun}} placeholders | No schema changes (just documentation) |
| **Final Comments** | Add pronoun dropdown selector in form | Uses existing `pronounId` field |
| **Backend API** | No changes required | /api/pronouns endpoints already exist |

---

## Goals & Success Metrics

### Goals
1. ✅ Document pronoun placeholder support in Outcome Comments
2. ✅ Document pronoun placeholder support in Personalized Comments
3. ✅ Implement pronoun dropdown selector in Final Comments form
4. ✅ Dropdown displays pronouns in "pronoun - possessivePronoun" format
5. ✅ Save and retrieve pronoun selection with Final Comments
6. ✅ Enable placeholder usage in comment text

### Success Metrics
- [ ] All 4 user stories completed with acceptance criteria met
- [ ] Pronoun dropdown appears when creating/editing Final Comments
- [ ] Dropdown correctly displays all user's pronouns
- [ ] Selected pronoun persists when saving Final Comments
- [ ] Placeholder documentation added to comment creation forms
- [ ] Zero TypeScript errors in implementation
- [ ] All tests passing (including new tests for pronoun selection)
- [ ] No console errors when using pronoun features

---

## Acceptance Criteria

### Functional Requirements

**1. Outcome Comments - Placeholder Support Documentation**
- GIVEN a user creating an Outcome Comment
- WHEN they view the comment input form
- THEN they can see help text documenting available placeholders: `{{pronoun}}` and `{{possessivePronoun}}`
- AND they can use these placeholders in their comment text
- AND placeholders are stored as-is in the database

**2. Personalized Comments - Placeholder Support Documentation**
- GIVEN a user creating a Personalized Comment
- WHEN they view the comment input form
- THEN they can see help text documenting available placeholders: `{{pronoun}}` and `{{possessivePronoun}}`
- AND they can use these placeholders in their comment text
- AND placeholders are stored as-is in the database

**3. Final Comments - Pronoun Dropdown Selector**
- GIVEN a user creating or editing a Final Comment
- WHEN the form loads
- THEN a "Pronoun" dropdown selector is visible
- AND the dropdown initially shows "Select a pronoun..." or similar placeholder text
- AND clicking the dropdown displays all available pronouns

**4. Final Comments - Dropdown Display Format**
- GIVEN a pronoun with values { pronoun: "they", possessivePronoun: "their" }
- WHEN displayed in the dropdown
- THEN it shows as: `"they - their"` format
- AND other pronouns display similarly: e.g., "he - his", "she - her", "sie - sier"

**5. Final Comments - Pronoun Persistence**
- GIVEN a user selects a pronoun from the dropdown
- WHEN they save the Final Comment
- THEN the `pronounId` is saved to the API
- AND when they retrieve the Final Comment later, the selected pronoun is pre-selected in the dropdown

**6. Final Comments - Optional Pronoun**
- GIVEN a user creating a Final Comment
- WHEN they don't select a pronoun (leave dropdown empty)
- THEN the Final Comment saves successfully with `pronounId: null`
- AND existing Final Comments without pronouns still work

### Non-Functional Requirements
1. **Performance**: Pronoun dropdown loads within 200ms
2. **Accessibility**: Dropdown is keyboard accessible and screen reader compatible
3. **Consistency**: Styling matches existing form components and design tokens
4. **Compatibility**: Works with existing Final Comments (no breaking changes)
5. **Testing**: All new functionality covered by unit tests

---

## Detailed Feature Specifications

### Outcome Comments Changes
**Location**: Create/Edit Outcome Comment form

**Addition**: Help text above comment textarea
```
"Available placeholders: {{pronoun}} (e.g., he, she, they)
and {{possessivePronoun}} (e.g., his, her, their)"
```

**Example Usage in Comment**:
```
"Strong work on the assignment. {{pronoun}} demonstrated excellent problem-solving skills."
```

**Storage**: Placeholders stored as-is, not evaluated/replaced in database

---

### Personalized Comments Changes
**Location**: Create/Edit Personalized Comment form

**Addition**: Help text above comment textarea (same as Outcome Comments)
```
"Available placeholders: {{pronoun}} (e.g., he, she, they)
and {{possessivePronoun}} (e.g., his, her, their)"
```

**Example Usage in Comment**:
```
"{{pronoun}} has shown tremendous improvement in {{possessivePronoun}} understanding of the material."
```

**Storage**: Placeholders stored as-is in database

---

### Final Comments Pronoun Dropdown

**Location**: Final Comments form, positioned near student name

**UI Component**:
```
<label htmlFor="pronoun-select">Pronoun</label>
<select id="pronoun-select" value={selectedPronounId || ''}>
  <option value="">Select a pronoun...</option>
  <option value="id1">they - their</option>
  <option value="id2">he - his</option>
  <option value="id3">she - her</option>
  {/* ... more pronouns from API ... */}
</select>
```

**Data Binding**:
- Load pronouns from: `GET /api/pronouns`
- Map to display format: `${pronoun} - ${possessivePronoun}`
- Save selection to: `Final Comment.pronounId` field
- Support `null` value for "no pronoun selected"

**Form Integration**:
- Optional field (not required)
- Display format: "pronoun - possessivePronoun"
- Include in form validation: ensure selected value exists if provided
- Load pronouns on component mount
- Handle empty state gracefully

---

## API Reference

### GET /api/pronouns (Already Exists)
**Purpose**: Fetch all pronouns for the authenticated user

**Request**:
```bash
GET /api/pronouns
Authorization: Bearer {token}
```

**Response**:
```json
[
  {
    "id": "65a1b2c3d4e5f6g7h8i9j0k2",
    "pronoun": "they",
    "possessivePronoun": "their",
    "userId": "user_12345",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  },
  {
    "id": "65a1b2c3d4e5f6g7h8i9j0k3",
    "pronoun": "he",
    "possessivePronoun": "his",
    "userId": "user_12345",
    "createdAt": "2024-01-15T10:31:00Z",
    "updatedAt": "2024-01-15T10:31:00Z"
  }
]
```

### Final Comment with pronounId (Existing)
**Field**: `pronounId` (string, nullable)

**Usage**:
```json
{
  "id": "65a1b2c3d4e5f6g7h8i9j0k1",
  "classId": "...",
  "firstName": "Sarah",
  "lastName": "Johnson",
  "grade": 87,
  "comment": "Great work this semester",
  "pronounId": "65a1b2c3d4e5f6g7h8i9j0k2",
  "userId": "user_12345",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

---

## User Flows

### Flow 1: Create Outcome Comment with Pronoun Placeholder
```
1. User opens "Create Outcome Comment" form
2. Sees help text: "Available placeholders: {{pronoun}} and {{possessivePronoun}}"
3. Enters comment: "{{pronoun}} completed the assignment well"
4. Saves comment
5. Comment stored with placeholder text (not evaluated)
```

### Flow 2: Create Final Comment with Pronoun Selection
```
1. User opens "Create Final Comment" form
2. Enters student name, grade, comment text
3. Sees "Pronoun" dropdown
4. Clicks dropdown, sees list: "they - their", "he - his", "she - her"
5. Selects "they - their"
6. Clicks Save
7. Final Comment saved with pronounId set to selected pronoun's ID
8. When editing, pronoun dropdown shows previously selected value
```

### Flow 3: View Final Comment with Pronoun Info
```
1. User views Final Comment list/detail
2. Can see the selected pronoun is associated with the student
3. If comment has {{pronoun}} placeholders, they can be replaced in display (future feature)
```

---

## Technical Considerations

### Frontend Implementation
- Use existing API hooks to fetch pronouns
- Add loading and error states for pronoun dropdown
- Cache pronoun list during session (don't refetch on every form open)
- Validate selected pronounId exists in API response
- Handle case where no pronouns exist yet (show "No pronouns available")

### No Backend Changes
- All API endpoints already exist
- `pronounId` field already in Final Comment schema
- Pronoun endpoints already functional: GET /api/pronouns

### Placeholder Handling
- Store placeholders as literal text: `{{pronoun}}`
- No evaluation/replacement in this feature (could be future feature)
- Just document and allow teachers to use them

---

## Risks & Mitigations

| Risk | Probability | Mitigation |
|------|-------------|-----------|
| API unavailable when loading pronouns | Low | Add error state and allow form submission without pronoun |
| User has no pronouns defined | Medium | Show helpful message: "Create pronouns first" with link to pronoun settings |
| Existing Final Comments break | Low | pronounId is nullable, backwards compatible |
| Placeholder misuse (typos) | Medium | Provide clear documentation and examples in help text |

---

## Design System Compliance

- **Input Components**: Use existing Input/Select components from design system
- **Typography**: Use existing label and help text styles
- **Colors**: Use form validation tokens for error states
- **Spacing**: Match existing form component spacing and padding
- **Icons**: Optional dropdown arrow (use Material Symbols if needed)

---

## Success Criteria Checklist

- [ ] TASK-1: Outcome Comments placeholder documentation
- [ ] TASK-2: Personalized Comments placeholder documentation
- [ ] TASK-3: Final Comments pronoun dropdown implementation
- [ ] TASK-4: Pronoun dropdown display and persistence
- [ ] All acceptance criteria met
- [ ] Zero TypeScript errors
- [ ] All tests passing (1359+ tests)
- [ ] No console errors in development/production
- [ ] Code review approved
- [ ] Deployment to production successful

---

## Related Documentation

- **API Documentation**: http://localhost:3000/api-docs (Pronouns section)
- **Final Comments Schema**: FinalComment.pronounId field
- **Pronoun Endpoints**: GET/POST/PUT/DELETE /api/pronouns
- **Design System**: docs/design-system.md

---

## Approval Sign-Off

**Status**: Ready for Implementation

**Complexity**: L1 (MICRO)

**Ready for Frontend Engineer**: YES

**Product Owner**: Approved for implementation

---

## Change History

| Date | Author | Change |
|------|--------|--------|
| 2024-12-28 | Product Owner | Initial PRD creation based on API specification |
