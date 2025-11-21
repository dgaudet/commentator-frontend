# To Do Items

## ⚠️ CRITICAL: Unit Test Memory Issues (In Progress)

### Investigation Complete ✅
- [x] Diagnosed memory issue root causes
- [x] Created comprehensive 10-story backlog
- [x] Implemented Jest configuration (Story 7)
- [ ] **NEXT: Implement Phase 2 (Stories 2, 5, 9)** - 3-4 days work
  - Story 2: Optimize test setup/teardown
  - Story 5: Implement lightweight mocking
  - Story 9: Fix React cleanup patterns
- [ ] **THEN: Implement Phase 3 (Stories 3, 4)** - 3-5 days work
  - Story 4: Consolidate FinalCommentsModal tests (13 files → 3-4)
  - Story 3: Reduce wrapper complexity

**Status**: Story 7 complete, tests still crash (expected). Phase 2 must be prioritized.
**Documentation**: See `pdd-workspace/unit-test-memory-fixes/planning/`

---

## 🎯 High Priority Features

### Final Comments Enhancements
- [ ] **Print view for all comments in a class**
    - Button to view all comments for class that you can print
    - Business value: Enables batch printing/review

### Data Management
- [ ] **Sort final comments by student name**
    - Current: Unsorted or sorted by creation date
    - Business value: Easier to find specific students

- [ ] **When adding a new class, select it by default**
    - Business value: Better UX, fewer clicks

---

## 📋 Medium Priority

### UI Improvements
- [ ] **Remove "Edit Subject" label from subject component**
    - The Edit Subject button should probably be `Update Subject` instead of `Save Changes`
    - Minor cleanup for cleaner UI

- [ ] **Update class selection label to "Select a Class to work with"**
    - More descriptive label text

- [ ] **Show comment count (e.g., "1 out of 100")**
    - Helps users track progress through student comments
    - Decision needed: How should comments be ordered?

- [ ] **Remove unnecessary tab titles**
    - "We don't need a title in each tab since the tab name is sufficient"

### Bulk Operations
- [ ] **Bulk add students with their grades**
    - Business value: Faster data entry for large classes
    - Complexity: Needs CSV import or multi-row form design

---

## 🎨 Design & Branding

### Visual Design
- [ ] **Design favicon for browser tab**
    - Theme: Something that looks like a notepad
    - Format: .ico or .svg

- [ ] **Design top banner for the app**
    - Theme: Students, inspiring message
    - Ideas: "Inspiring the next generation" or "Guiding the leaders of tomorrow"

- [ ] **Dark theme and light theme toggle**
    - Toggle button in top right
    - Note: Design token system is already in place, making this easier to implement
    - Would need to extend tokens to support theme switching

---

## 🔧 Technical Debt

### Code Quality
- [ ] **Remove console.error methods from services**
    - Replace with proper error handling/logging
    - Files: `src/services/api/*Service.ts`

- [ ] **Fix deprecated `act` function in tests**
    - "The act function seems to be deprecated but it's used in tests and code"
    - Investigate React Testing Library updates
    - May need to refactor test patterns

### Outcome Comments
- [ ] **Add templating for last name in outcome comments**
    - Details needed on what templating is required

---

## 📚 Documentation & Resources

### Available Documentation
- ✅ **Design System Documentation**: `docs/design-system.md`
    - Design token usage guide
    - Component API reference (Input, Label, Button)
    - Step-by-step migration guide
    - Best practices and conventions
    - Real-world examples from FinalCommentsModal

### Completed Features
- ✅ Design token system (colors, spacing, typography, borders, shadows)
- ✅ Standardized Input component (with validation, errors, required indicator)
- ✅ Standardized Label component
- ✅ Enhanced Button component (primary, secondary, danger variants)
- ✅ FinalCommentsModal migrated to design tokens (32 inline styles eliminated)
- ✅ ClassManagementModal migrated to design tokens (23 modalStyles replaced)

---
Looks like the add personalized comments button should show a message when clicked with no comment
the error labels aren't standardized, the add subject is different from the rest I believe

When adding a new class, it should be selected by default after creation.

The final comments error text doesn't use the standardized error label component.