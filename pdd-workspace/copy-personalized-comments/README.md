# Copy Personalized Comments to Another Subject

**Feature**: Copy Personalized Comments Feature
**Complexity**: L1 (Micro)
**Status**: Planning Complete - Ready for Implementation
**Created**: 2026-01-09

---

## Overview

This feature enables teachers to efficiently copy personalized comments from one subject to another via a modal interface. Instead of manually recreating comments across multiple subjects, teachers can now reuse their feedback with a single action.

### Key Use Case

A teacher has created detailed personalized comments for 25 students in their "Advanced Mathematics" class. They're now teaching "Statistics" and want to use the same comments structure for their Statistics students. This feature lets them copy all comments in one click, with the option to either overwrite or append to any existing comments.

---

## Feature Components

### 1. **Copy Button** (US-CP-001)
- Location: Personalized Comments page
- Label: "Copy Comments to Another Subject"
- Styling: Secondary action button following design system
- Accessibility: Fully keyboard and screen reader accessible

### 2. **Copy Comments Modal** (US-CP-002, US-CP-003)
- **Source Subject**: Read-only display of the subject being copied FROM
- **Target Subject Dropdown**: Select destination subject
  - **Ownership Filter**: Only shows subjects the user OWNS
  - Excludes current subject
  - Shows empty state: "You don't own any other subjects to copy to" if no options
  - Auto-populated on load
- **Copy Mode**: Two radio button options
  - "Overwrite existing comments" - Replace all target comments
  - "Append to existing comments" - Add to target (default)
- **Comment Count**: Shows number of comments to be copied
- **Clear Explanations**: Each option has helpful text explaining behavior

### 3. **API Integration** (US-CP-004)
- Endpoint: `POST /personalized-comment/copy`
- Handles request, loading state, success/error feedback
- **Success Message Format**:
  - "Successfully copied X comments to [Subject Name] (overwrote existing comments)" or
  - "Successfully copied X comments to [Subject Name] (appended to existing comments)"
- Automatic modal close after 2-3 seconds on success
- Detailed error messages for user guidance
- Backend handles all copy logic and duplicate management

### 4. **Validation & Edge Cases** (US-CP-005)
- Empty source validation
- Target selection required
- Permission checks
- Duplicate handling
- Error recovery

---

## API Contract

### Endpoint
**POST** `/personalized-comment/copy`

### Request
```json
{
  "sourceSubjectId": "65a1b2c3d4e5f6g7h8i9j0k1",
  "targetSubjectId": "65a1b2c3d4e5f6g7h8i9j0k2",
  "mode": "overwrite" | "append"
}
```

### Success Response (200)
```json
{
  "success": true,
  "message": "Successfully copied 12 comments",
  "copiedCount": 12,
  "targetSubjectId": "65a1b2c3d4e5f6g7h8i9j0k2",
  "targetSubjectName": "Statistics 101"
}
```

### Error Response (400/500)
```json
{
  "success": false,
  "error": "Description of what went wrong"
}
```

---

## User Stories & Acceptance Criteria

All user stories with detailed acceptance criteria are in: **`planning/user-stories.md`**

### Story Summary
| Story | Title | Points |
|-------|-------|--------|
| US-CP-001 | Copy Button Component | 2 |
| US-CP-002 | Modal & Subject Selection | 3 |
| US-CP-003 | Copy Mode Selection | 2 |
| US-CP-004 | API Integration & Feedback | 3 |
| US-CP-005 | Validation & Edge Cases | 2 |
| **Total** | | **12 points** |

---

## Product Requirements

Full PRD available in: **`planning/minimal-prd.md`**

### Key Requirements
- ✅ Clear source/target context in modal
- ✅ **Target dropdown filters to owned subjects only**
- ✅ Overwrite/append mode selection with explanations
- ✅ **Success feedback with specific format**: "Successfully copied X comments to [Subject] ([overwrote/appended] existing comments)"
- ✅ Duplicates are acceptable (backend handles copy logic)
- ✅ Comprehensive error handling and recovery
- ✅ Full keyboard and accessibility support
- ✅ Responsive design (desktop/tablet, mobile acceptable)

### Success Metrics
- **Adoption**: 40%+ of teachers use within 4 weeks
- **Time Saved**: 50% reduction in comment creation for reusers
- **Error Rate**: < 2% failed copy operations
- **Satisfaction**: 4+/5 stars on feature feedback

---

## Technical Details

### Components to Create
- **CopyCommentsModal.tsx** - Main modal component
- **PersonalizedCommentsPage.tsx** - Add button and modal integration

### New Services
- Extend `personalizedCommentService.ts` with copy method

### Existing Services Used
- `usePersonalizedComments` hook (subject data)
- `Subject` types

### Testing
- Unit tests: Components, hooks, services
- Integration tests: Modal + API flow
- E2E tests: Full user workflow
- Accessibility: WCAG 2.1 AA compliance
- Cross-browser: Chrome, Firefox, Safari, Edge

---

## Development Timeline

| Phase | Duration | Dates |
|-------|----------|-------|
| Planning | 1 day | 2026-01-09 |
| Implementation | 3-4 days | 2026-01-10 to 2026-01-14 |
| Testing | 1 day | 2026-01-15 |
| **Total** | **~1-2 weeks** | |

---

## Implementation Notes

### Architecture Decisions
1. **Modal Component**: Self-contained, reusable component
2. **API Service**: Extend existing personalized comment service
3. **Error Handling**: User-friendly messages with retry capability
4. **Accessibility**: Built-in from start (not an afterthought)
5. **Loading State**: Clear visual feedback during copy operation

### Design System
- Use existing design tokens for colors, spacing, typography
- Follow existing modal patterns and button styles
- Use Material Symbols for any icons
- Support dark/light themes automatically

### Performance
- Modal subjects dropdown loads < 1 second
- Copy operation completes in 2-3 seconds typically
- No UI blocking during copy

### Accessibility
- Full keyboard navigation (Tab, Enter, Space, Arrows)
- Screen reader announcements for all interactive elements
- Clear focus indicators
- WCAG 2.1 AA compliance required

---

## Success Criteria for Completion

✅ All user stories completed with passing acceptance criteria
✅ 1484+ tests passing (full regression suite)
✅ Linting passes without errors
✅ Accessibility audit passes (WCAG 2.1 AA)
✅ Cross-browser testing completed
✅ QA validation and sign-off received
✅ Product Owner acceptance review passed

---

## Next Steps

1. **Frontend Engineer**: Review PRD and user stories, then implement following TDD
2. **QA Engineer**: Create test plan and validate acceptance criteria
3. **Product Owner**: Review and accept completed work

---

## Resources

- **API Documentation**: http://localhost:3000/api-docs
- **Design System**: Check existing PersonalizedCommentsPage for styling patterns
- **Project CLAUDE.md**: Development guidelines and standards

---

Prepared by: Principal Product Owner
Date: 2026-01-09
Status: ✅ **Ready for Implementation**
