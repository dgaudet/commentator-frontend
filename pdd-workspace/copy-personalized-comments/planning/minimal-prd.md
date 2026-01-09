# Minimal PRD: Copy Personalized Comments to Another Subject

**Feature**: Copy Personalized Comments to Another Subject
**Complexity**: L1 (Micro)
**Status**: Planning
**Created**: 2026-01-09

---

## Executive Summary

Enable teachers to efficiently copy personalized comments from one subject to another, reducing duplicate effort and ensuring consistent feedback across multiple classes. The feature provides a clear UI for selecting target subjects and choosing between overwriting or appending comments.

---

## Problem Statement

**User Challenge**: Teachers often use the same personalized comments across multiple subjects/classes. Currently, they must manually recreate these comments for each subject, leading to:
- Duplicate effort and time waste
- Potential inconsistency in feedback across classes
- Frustration with repetitive data entry

**Opportunity**: Provide a one-click method to copy personalized comments between subjects, with clear control over whether to overwrite or append existing comments.

---

## Business Objectives

1. **Reduce Teacher Effort**: Enable comment reuse with minimal clicks
2. **Improve Consistency**: Ensure consistent feedback language across subjects
3. **Increase Retention**: Make the tool more efficient and attractive to teachers
4. **User Satisfaction**: Positive UX impact by providing a common workflow

---

## Scope & Key Features

### In Scope
- ✅ "Copy Comments to Another Subject" button on Personalized Comments page
- ✅ Modal to select target subject
- ✅ Radio button for overwrite/append mode selection
- ✅ API integration with `/personalized-comment/copy` endpoint
- ✅ Success/error feedback messages
- ✅ Proper error handling and user guidance

### Out of Scope
- ❌ Bulk copy across multiple subjects at once
- ❌ Scheduling or delayed copying
- ❌ Comment filtering/selective copying (copy all or none)
- ❌ Copy audit trail or history

---

## User Requirements

### Functional Requirements

**FR-1: Copy Button Placement**
- Location: Personalized Comments page (visible alongside comment list)
- Label: "Copy Comments to Another Subject"
- Behavior: Opens modal when clicked

**FR-2: Subject Selection Modal**
- Display: Modal with:
  - Source subject (read-only, clearly labeled as "from this subject")
  - Dropdown to select target subject (labeled "Copy to")
  - Radio buttons for copy mode:
    - "Overwrite existing comments" (replace all target comments)
    - "Append to existing comments" (add to target)
  - Summary of comments being copied (count)
  - Cancel and Copy buttons

**FR-3: Subject List in Dropdown**
- Show: Only subjects the user OWNS (excluding current subject)
- Filter:
  - Auto-exclude the source subject from dropdown
  - Only include subjects where user is the owner
- Format: Subject name (clear identification)
- Sort: Alphabetically or by recency

**FR-4: Copy Mode Explanation**
- Overwrite: "This will replace any existing personalized comments in the target subject"
- Append: "This will add these comments to any existing personalized comments in the target subject"

**FR-5: Confirmation & Feedback**
- Before copy: Show count of comments being copied
- After copy: Success message with:
  - ✅ "Successfully copied X comments to [Target Subject Name]"
  - ✅ Clear indication: "(overwrote existing comments)" or "(appended to existing comments)"
  - Example: "Successfully copied 12 comments to Statistics 101 (appended to existing comments)"
- Error handling: Clear error messages if copy fails
- Message displays for 2-3 seconds or user can close with button

### Non-Functional Requirements

**NFR-1: Performance**
- Modal should load subject list quickly (< 1 second)
- Copy operation should complete within 2-3 seconds for typical comment volume

**NFR-2: Accessibility**
- Modal accessible via keyboard
- Screen reader support for all labels and radio buttons
- Clear focus indicators

**NFR-3: Responsive Design**
- Modal works on desktop and tablet
- Mobile: Functional but may be cramped (acceptable for L1)

---

## API Contract

### Endpoint
**POST** `/personalized-comment/copy`

### Request Payload
```json
{
  "sourceSubjectId": "string (MongoDB ObjectId)",
  "targetSubjectId": "string (MongoDB ObjectId)",
  "mode": "overwrite" | "append"
}
```

### Response
```json
{
  "success": true,
  "message": "Successfully copied 12 comments",
  "copiedCount": 12,
  "targetSubjectId": "string",
  "targetSubjectName": "string"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Feature Adoption** | 40%+ of active teachers use within 4 weeks | Analytics event tracking |
| **Time Saved** | Reduce comment creation time by 50% for reusers | User feedback survey |
| **Error Rate** | < 2% failed copy operations | Error logging |
| **User Satisfaction** | 4+/5 stars on feature feedback | In-app survey |

---

## User Stories

See: `user-stories.md`

---

## Acceptance Criteria

All user stories must:
1. ✅ Pass acceptance criteria defined in user stories
2. ✅ Include proper error handling
3. ✅ Display clear user feedback
4. ✅ Follow existing UI patterns and design system
5. ✅ Include comprehensive unit and integration tests
6. ✅ Maintain accessibility (WCAG 2.1 AA)

---

## Constraints & Assumptions

### Constraints
- API endpoint already exists and is ready to use
- Must work within existing React component architecture
- Cannot modify backend API beyond what's already available

### Assumptions
- Users own multiple subjects (or may own only one - handled with empty state)
- Teachers will understand overwrite vs. append modes
- Subject list will be reasonably sized (< 100 subjects owned by user)
- User can copy comments to any subject they own
- Duplicates in append mode are acceptable per product decision
- Backend API fully handles copy logic, deduplication strategy, and conflict resolution

---

## Timeline

- **Planning**: 2026-01-09 (1 day)
- **Implementation**: 2026-01-10 to 2026-01-14 (3-4 days)
- **Testing**: 2026-01-15 (1 day)
- **Total**: 1-2 weeks

---

## Next Steps

1. ✅ Product Owner: Create PRD and user stories (THIS DOCUMENT)
2. ⏳ Frontend Engineer: Implement feature following TDD
3. ⏳ QA Engineer: Comprehensive testing and validation
4. ⏳ Product Owner: Accept/review completion

---

**PRD Status**: READY FOR IMPLEMENTATION

Prepared by: Principal Product Owner
Date: 2026-01-09
