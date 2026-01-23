# Tech Note: Hide Header on Scroll

**Feature**: Hide header as user scrolls to maximize visible content area
**Complexity**: L0 (Atomic)
**Status**: Planning
**Created**: 2026-01-22

## Problem Statement

The application header currently remains fixed/visible at the top of the page during scrolling, consuming valuable vertical screen space. Teachers reviewing comments and managing student data need to see more content without the header taking up space. By hiding the header as users scroll down, we can increase the visible content area significantly.

**Current Behavior**:
- Header remains visible during all scrolling
- Takes up approximately 60-80px of vertical space
- Reduces available content area for viewing comments and student data

**Desired Behavior**:
- Header hides as user scrolls down
- Header reappears as user scrolls up
- Simple scroll-based visibility toggle (no animations needed)

## Business Objective

Improve teacher productivity by increasing visible content area when reviewing and managing comments. Teachers can see more student data, comments, and form content without having to scroll up to access the header, then back down to continue working.

## User Story

**US-1: Hide Header on Scroll**

**As a** teacher reviewing comments and student data
**I want** the header to hide when I scroll down
**So that** I can see more content and work more efficiently without the header taking up screen space

**Acceptance Criteria:**
- ✅ Header hides when user scrolls down the page
- ✅ Header reappears when user scrolls up the page
- ✅ No animations or transitions needed (instant visibility toggle)
- ✅ Works in all modal and page views
- ✅ No impact on header functionality when visible
- ✅ Scrolling behavior is smooth without jumps or layout shifts
- ✅ Works consistently across different page/component contexts

## Technical Implementation Notes

- **File**: Header component (location varies by application structure)
- **Approach**: Scroll event listener tracking scroll direction
- **Implementation**:
  - Listen to scroll events on the main content container or window
  - Track previous scroll position to determine scroll direction
  - Toggle header visibility based on scroll direction (down = hide, up = show)
  - No state persistence needed - local component state only
  - No animations or CSS transitions required

- **Impact**: Frontend-only change, no API or backend modifications needed
- **Scope**: Single component change (header visibility toggle)
- **Dependencies**: None (no external libraries required)
- **No Breaking Changes**: Existing functionality preserved, only visibility changes

## Definition of Done

- [x] Feature implemented
- [x] Basic scroll detection working
- [x] Unit tests added
- [x] No regressions in existing tests
- [x] Linting passes
- [x] Code review passed
- [x] PR merged to main

## Dependencies

- None (no external libraries or API changes required)

## Success Metrics

| Metric | Target |
|--------|--------|
| Test Coverage | >80% |
| Regressions | 0 |
| Implementation Time | < 1 day |
| User Stories | 1/1 ✅ |

## Refinement: Threshold-Based Header Reappearance

**Status**: Ready for Implementation
**Complexity**: L0 (Atomic refinement)
**Date Requested**: 2026-01-23

### Refinement Request

Currently, the header reappears whenever the user scrolls up from any position. This can cause distracting "pop-in" behavior when the user scrolls up slightly while reading content far down the page. This refinement improves the UX by requiring the user to scroll near the top of the page before the header reappears.

### Refined Acceptance Criteria

- ✅ Header hides when user scrolls down (existing behavior maintained)
- ✅ Header reappears ONLY when user scrolls up AND is within 100px from the top of the page
- ✅ Header is ALWAYS visible when user is at the top of the page (scrollTop ≤ 100px)
- ✅ Header does not reappear when user scrolls up if still far from the top (scrollTop > 100px)
- ✅ No animations or transitions needed (instant visibility toggle)
- ✅ Works in all modal and page views
- ✅ No impact on existing functionality
- ✅ Scrolling behavior remains smooth without jumps or layout shifts

### Technical Specification

**Threshold Parameter**: 100px from top of page
**Logic**:
```
If scrollTop <= 100px:
  Header is always visible
Else if scrolling up AND scrollTop <= 100px:
  Header becomes visible
Else:
  Header remains hidden (or follows original down-scroll behavior)
```

**Implementation Location**: `useScrollVisibility` hook in `src/hooks/useScrollVisibility.ts`
**Changes**: Update scroll direction detection logic to consider proximity to top

### Testing Requirements

- ✅ Existing tests pass with new threshold logic
- ✅ New test: Header visible when scrollTop = 0
- ✅ New test: Header hidden when scrolling down past 100px
- ✅ New test: Header not visible when scrolling up but scrollTop > 100px
- ✅ New test: Header appears when scrolling up and crosses 100px threshold
- ✅ Regression: No impact on existing scroll behavior tests

## Next Steps

1. Frontend Engineer implements scroll threshold logic
2. Frontend Engineer updates tests for new threshold behavior
3. QA Engineer validates functionality across different views
4. Product Owner accepts completed work
