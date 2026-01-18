# Header Consolidation - Technical Note
**Feature**: header-consolidation
**Complexity**: L0 (Atomic)
**Created**: 2026-01-18
**Estimated Effort**: < 1 day

---

## Problem Statement

The application currently has **two separate header sections**:

1. **Header.tsx Component** (top sticky header)
   - Location: `src/components/Header.tsx`
   - Contains: User email, user name, logout button
   - Color: Purple gradient (`#667eea` → `#764ba2`)
   - Shows user authentication info

2. **Hardcoded Header Section** (in App.tsx, below sticky header)
   - Location: `src/App.tsx` lines 87-95
   - Contains: "Commentator" title, "Student Report Card Comment Management" subtitle
   - Color: Blue gradient from theme tokens (primary.main → primary.dark)
   - Contains: ThemeToggle component

This results in a confusing UX with **two visually distinct headers** and inconsistent color schemes.

---

## Solution Overview

Consolidate into a **single unified Header component** that:

1. **Maintains Header.tsx as the primary header component**
2. **Adds to Header.tsx**:
   - "Commentator" title (currently in App.tsx)
   - "Student Report Card Comment Management" subtitle (currently in App.tsx)
   - ThemeToggle component (currently in App.tsx)
3. **Updates styling**:
   - Change Header color from purple gradient to blue gradient
   - Use theme tokens: `primary.main` (#0066FF) and `primary.dark` (#0052CC)
4. **Removes from App.tsx**:
   - Delete the hardcoded header section (lines 87-95)
   - Keep only `<Header />` component

---

## Current State

### Header.tsx Component
```
📁 src/components/Header.tsx (62 lines)
- Sticky positioned at top
- User email + logout button
- Purple gradient background
```

### App.tsx Header Section
```
📁 src/App.tsx (lines 87-95)
- Title "Commentator" (h1)
- Subtitle "Student Report Card Comment Management" (p)
- ThemeToggle component
- Blue gradient background
```

### ThemeToggle Component
```
📁 src/components/common/ThemeToggle.tsx
- Toggle between light/dark themes
- Currently positioned in App.tsx header
```

---

## Implementation Tasks

### Task 1: Update Header.tsx Component
- **What**: Consolidate all header content into single component
- **Changes**:
  - Reorganize JSX to include title, subtitle, theme toggle, and user info
  - Create logical sections within the header (left: title/subtitle, right: theme toggle + user info)
  - Keep brand section with new subtitle
  - Maintain responsive design

### Task 2: Update Header.module.css Styling
- **What**: Change header color from purple to blue
- **Changes**:
  - Update `.header` background gradient:
    - FROM: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
    - TO: Use theme tokens or blue hex values: `linear-gradient(135deg, #0066FF 0%, #0052CC 100%)`
  - Add CSS class for subtitle styling
  - Adjust layout to accommodate theme toggle

### Task 3: Import ThemeToggle in Header.tsx
- **What**: Add ThemeToggle component import
- **Location**: Add import at top of Header.tsx
- **Placement**: Include in header's right section alongside user info

### Task 4: Update App.tsx
- **What**: Remove hardcoded header section
- **Changes**:
  - Delete lines 87-95 (hardcoded header)
  - Delete lines 46-74 (header styling that's no longer needed)
  - Remove ThemeToggle import if only used in header
  - Keep `<Header />` component render (line 86)

### Task 5: Update Tests
- **Files to update**:
  - `src/components/__tests__/Header.test.tsx` - Add tests for title, subtitle, theme toggle
  - Create/update visual regression tests if applicable

---

## Color Reference

**Current (Purple)**:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

**Target (Blue - Using Theme Tokens)**:
```css
/* Option 1: Using Hex values directly */
background: linear-gradient(135deg, #0066FF 0%, #0052CC 100%);

/* Option 2: Using theme tokens (requires JavaScript/inline styles) */
background: `linear-gradient(135deg, ${themeColors.primary.main} 0%, ${themeColors.primary.dark} 100%)`;
```

**Theme Token Values**:
- `primary.main`: #0066FF
- `primary.dark`: #0052CC

---

## Files Affected

| File | Change | Type |
|------|--------|------|
| `src/components/Header.tsx` | Add title, subtitle, ThemeToggle | Modify |
| `src/components/Header.module.css` | Update color, add subtitle styles | Modify |
| `src/App.tsx` | Remove hardcoded header section | Delete |
| `src/components/__tests__/Header.test.tsx` | Add new test cases | Modify |

---

## Testing Strategy

1. **Visual**:
   - Verify header displays title, subtitle, theme toggle, and user info
   - Verify blue gradient matches App.tsx header color
   - Test responsive behavior on mobile

2. **Functional**:
   - Logout button works
   - Theme toggle switches between light/dark modes
   - User email and name display correctly

3. **Responsive**:
   - Mobile layout (< 768px) still looks good with all elements

---

## Acceptance Criteria

- [ ] Single unified header component displays all expected content
- [ ] Header background is blue gradient (primary.main → primary.dark)
- [ ] "Commentator" title visible
- [ ] "Student Report Card Comment Management" subtitle visible
- [ ] ThemeToggle functional in header
- [ ] User email and logout button functional
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] All tests pass
- [ ] No hardcoded header section remains in App.tsx

---

## Notes

- The sticky positioning from Header.tsx should be maintained
- Mobile responsive design (< 768px) already exists and should be adapted to new layout
- No changes needed to authentication logic or API calls
- Color change is purely UI/CSS

---

**Status**: Ready for Frontend Engineer implementation
**Next Step**: Frontend Engineer to implement following TDD approach
