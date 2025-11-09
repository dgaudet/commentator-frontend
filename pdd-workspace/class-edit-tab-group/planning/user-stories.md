# User Stories: Class Edit Tab Group

**Feature**: Add nested tab group for class editing and final comments management

**Context**: The ClassManagementModal currently displays an edit form and "Final Comments" button when a class is selected. This feature reorganizes this functionality into a tabbed interface (similar to SubjectListItem) with two tabs: "Edit Class" and "Final Comments". This provides clearer navigation and better separation of concerns between editing class details and managing final comments.

**Design Pattern Reference**: SubjectListItem tabs implementation
- Reuse existing Tabs and TabPanel components
- Follow established tab styling and interaction patterns
- Maintain accessibility standards (keyboard navigation, ARIA labels)

**Business Value**:
- **Improved UX**: Clearer separation between editing class metadata vs. viewing final comments
- **Consistency**: Matches the tabbed pattern already established in SubjectListItem
- **Scalability**: Makes it easier to add future class-related tabs (e.g., "Student Roster", "Grade Analysis")
- **Reduced Clutter**: Removes the standalone "Final Comments" button in favor of organized tabs

---

## US-CLASS-TABS-001: Display Tab Group When Class Selected
**Priority**: HIGH (Foundation for other stories)
**Story Points**: 2
**Risk Level**: Low

### User Story
AS A teacher managing classes
WHEN I select a class from the dropdown in the "Manage Classes" tab
THE SYSTEM SHALL display a tab group with "Edit Class" and "Final Comments" tabs
SO THAT I can easily switch between editing class details and viewing final comments

### Acceptance Criteria

**AC1: Tab Group Appears on Class Selection**
- GIVEN I am on the "Manage Classes" tab
- WHEN I select a class from the dropdown (selectedClassId is set)
- THEN a tab group should appear below the dropdown
- AND the tab group should contain two tabs: "Edit Class" and "Final Comments"
- AND the "Edit Class" tab should be selected by default

**AC2: Tab Group Hidden When No Class Selected**
- GIVEN I am on the "Manage Classes" tab
- WHEN no class is selected (selectedClassId is null or empty string)
- THEN no tab group should be displayed
- AND the "Add New Class" form should be shown instead

**AC3: Tab Group Persists Across Tab Switches**
- GIVEN I have selected a class and the tab group is displayed
- WHEN I switch between "Edit Class" and "Final Comments" tabs
- THEN the selected class should remain selected in the dropdown
- AND the tab group should remain visible

**AC4: Tab Group Updates When Different Class Selected**
- GIVEN I have a class selected with the tab group displayed
- WHEN I select a different class from the dropdown
- THEN the tab group should update to show the new class's data
- AND the "Edit Class" tab should be selected (reset to default)

### Technical Notes
- Follow SubjectListItem pattern: use `useState` for active tab tracking
- Reuse existing `Tabs` and `TabPanel` components
- Tab visibility controlled by `selectedClassId !== null`
- Default to "Edit Class" tab (`activeTab = 'edit-class'`)
- Consider: Should create new class flow remain separate (outside tabs)?

### Dependencies
- Existing Tabs component (`src/components/common/Tabs.tsx`)
- Existing TabPanel component (`src/components/common/TabPanel.tsx`)
- ClassManagementModal `selectedClassId` state

---

## US-CLASS-TABS-002: Edit Class Tab Functionality
**Priority**: HIGH
**Story Points**: 2
**Risk Level**: Low

### User Story
AS A teacher editing a class
WHEN I am on the "Edit Class" tab after selecting a class
THE SYSTEM SHALL display the class edit form with name, year, and action buttons
SO THAT I can update class details or delete the class

### Acceptance Criteria

**AC1: Edit Form Displayed in Tab Panel**
- GIVEN I have selected a class from the dropdown
- WHEN the "Edit Class" tab is active
- THEN the tab panel should display the class edit form
- AND the form should show the selected class's name and year
- AND the form should include Update Class, Delete Class buttons

**AC2: Edit Form Prepopulated with Selected Class Data**
- GIVEN I select a class "Math 2024" with id=5
- WHEN the "Edit Class" tab is displayed
- THEN the class name input should show "Math"
- AND the year input should show "2024"
- AND the inputs should be editable

**AC3: Update Class Functionality Works in Tab**
- GIVEN I am on the "Edit Class" tab with a class selected
- WHEN I modify the class name/year and click "Update Class"
- THEN the class should be updated via `onUpdateClass` callback
- AND success feedback should be displayed
- AND the updated class should appear in the dropdown

**AC4: Delete Class Functionality Works in Tab**
- GIVEN I am on the "Edit Class" tab with a class selected
- WHEN I click "Delete Class" button
- THEN the delete confirmation modal should appear (US-DELETE-CONFIRM-003)
- AND upon confirmation, the class should be deleted via `onDeleteClass`
- AND the tab group should hide (since no class is selected)
- AND the dropdown should no longer show the deleted class

**AC5: Validation Errors Displayed in Tab Panel**
- GIVEN I am on the "Edit Class" tab
- WHEN I submit invalid data (empty name, invalid year)
- THEN validation errors should display within the tab panel
- AND the tab panel should remain visible (not hide on error)

### Technical Notes
- Move existing edit form JSX (lines ~290-388 in ClassManagementModal.tsx) into "Edit Class" TabPanel
- Keep existing form logic: `handleUpdateClass`, `handleDeleteStart`, `validateClass`
- Maintain existing button variants and styling
- Consider: Extract edit form to separate component for cleaner code?

### Dependencies
- Existing ClassManagementModal edit form logic
- Existing validation functions (`validateClass`)
- Existing Button component styling
- ConfirmationModal for delete operation

---

## US-CLASS-TABS-003: Final Comments Tab Integration
**Priority**: HIGH
**Story Points**: 3
**Risk Level**: Medium

### User Story
AS A teacher managing final comments
WHEN I click the "Final Comments" tab after selecting a class
THE SYSTEM SHALL display the final comments interface for that class
SO THAT I can view and manage final comments without leaving the class management interface

### Acceptance Criteria

**AC1: Final Comments Tab Triggers Data Load**
- GIVEN I have selected a class with id=5
- WHEN I click the "Final Comments" tab
- THEN the system should call `onViewFinalComments(classData)` callback
- AND the callback should pass the full selected class object
- AND final comments data should be loaded for class id=5

**AC2: Final Comments View Displayed in Tab Panel**
- GIVEN I am on the "Final Comments" tab for a selected class
- WHEN the tab panel is rendered
- THEN it should display the FinalCommentsModal component
- AND the component should show all final comments for the selected class
- AND the component should be styled consistently (no modal chrome)

**AC3: Final Comments CRUD Operations Work in Tab**
- GIVEN I am on the "Final Comments" tab
- WHEN I create, edit, or delete a final comment
- THEN the operations should work exactly as they do in the standalone modal
- AND changes should be reflected immediately in the tab panel
- AND no console errors should appear

**AC4: Loading and Error States Displayed**
- GIVEN I switch to the "Final Comments" tab
- WHEN final comments are loading
- THEN a loading spinner should appear in the tab panel
- WHEN there is an error loading final comments
- THEN an error message should appear in the tab panel
- AND the user should have the option to retry

**AC5: Empty State for No Final Comments**
- GIVEN I am on the "Final Comments" tab for a class with no final comments
- WHEN the data loads successfully
- THEN an empty state message should appear
- AND it should prompt the user to add their first final comment

### Technical Notes
- Integrate existing FinalCommentsModal component (currently used in App.tsx)
- Pass `finalComments`, `onCreateFinalComment`, `onUpdateFinalComment`, `onDeleteFinalComment` props
- Handle loading/error states similar to other tab panels
- Remove standalone "Final Comments" button from edit form (replaced by tab)
- **Challenge**: FinalCommentsModal may need refactoring if it expects modal context

### Dependencies
- FinalCommentsModal component
- Final comments API hooks/callbacks (`onViewFinalComments`, CRUD operations)
- Loading/error state management
- **IMPORTANT**: Verify FinalCommentsModal can be embedded in TabPanel (may need modal prop removal)

---

## US-CLASS-TABS-004: Tab Group Styling Consistency
**Priority**: MEDIUM
**Story Points**: 1
**Risk Level**: Trivial

### User Story
AS A teacher using the commentator app
WHEN I view the class management tab group
THE SYSTEM SHALL display tabs styled consistently with the subject-level tabs
SO THAT the interface feels cohesive and professional

### Acceptance Criteria

**AC1: Tab Bar Styling Matches Subject Tabs**
- GIVEN I am viewing the class management tab group
- WHEN I see the tab bar
- THEN it should use the same styling as SubjectListItem tabs
- AND active tab should have blue underline (#0066FF)
- AND inactive tabs should have gray text (#6B7280)
- AND hover states should match the established pattern

**AC2: Tab Panel Styling Consistent**
- GIVEN a tab panel is displayed (Edit Class or Final Comments)
- WHEN I view the panel content
- THEN it should have consistent padding (1.5rem)
- AND borders should use #E5E7EB color
- AND border-radius should be 8px
- AND box-shadow should match: 0 1px 3px rgba(0, 0, 0, 0.1)

**AC3: Typography Consistency**
- GIVEN I am viewing content in the tab panels
- WHEN I see text elements
- THEN headings should use font-size: 1.25rem, weight: 600, color: #111827
- AND body text should use font-size: 1rem, color: #111827
- AND labels should use font-size: 0.875rem, weight: 500, color: #374151

**AC4: Button Styling Matches Design System**
- GIVEN I see buttons in the tab panels
- WHEN viewing button elements
- THEN primary buttons should use #0066FF with white text
- AND danger buttons should use #DC2626 with border
- AND border-radius should be 8px
- AND hover states should transition smoothly

### Technical Notes
- Reuse `modalStyles` constants from `src/styles/modalStyles.ts`
- Apply same Tabs component styling used in SubjectListItem
- Verify no visual regressions by comparing to subject tabs side-by-side
- Consider: Use shared CSS module for tab groups if inline styles become unwieldy

### Dependencies
- Existing `modalStyles.ts`
- Tabs component CSS/styling
- Design system color constants

---

## US-CLASS-TABS-005: Tab State Management and Navigation
**Priority**: MEDIUM
**Story Points**: 2
**Risk Level**: Low

### User Story
AS A teacher switching between class management tasks
WHEN I navigate between tabs and interact with class data
THE SYSTEM SHALL maintain proper state and provide smooth navigation
SO THAT my workflow is efficient and intuitive

### Acceptance Criteria

**AC1: Active Tab State Persists**
- GIVEN I am on the "Final Comments" tab for class "Math 2024"
- WHEN I switch to a different subject tab (e.g., "Outcome Comments") and then back to "Manage Classes"
- THEN the class "Math 2024" should still be selected
- AND the "Final Comments" tab should still be active
- AND the final comments data should still be displayed

**AC2: Tab Reset on New Class Selection**
- GIVEN I am viewing the "Final Comments" tab for class "Math 2024"
- WHEN I select a different class "Science 2024" from the dropdown
- THEN the tab group should reset to the "Edit Class" tab
- AND the edit form should show "Science 2024" data
- AND the previous final comments should not be displayed

**AC3: Keyboard Navigation Support**
- GIVEN I am on the class management interface
- WHEN I use Tab key to navigate
- THEN I can navigate to the class dropdown, tab buttons, and form inputs
- WHEN I press Enter or Space on a tab button
- THEN that tab should become active
- AND accessibility should meet WCAG 2.1 AA standards

**AC4: Data Refresh on Tab Switch**
- GIVEN I am on the "Edit Class" tab
- WHEN I switch to the "Final Comments" tab
- THEN the system should load/refresh final comments data for the selected class
- AND loading indicator should appear during fetch
- WHEN I switch back to "Edit Class" tab
- THEN no API call should be made (data already in state)

**AC5: Unsaved Changes Warning (Future Enhancement)**
- GIVEN I am editing class name/year on "Edit Class" tab
- WHEN I attempt to switch to "Final Comments" tab without saving
- THEN no warning is required in MVP (defer to future story)
- **Note**: Current ClassManagementModal doesn't have unsaved changes warning; maintain existing behavior

### Technical Notes
- Use `useState` for `activeClassTab` state (default: 'edit-class')
- Reset `activeClassTab` to 'edit-class' when `selectedClassId` changes
- Follow SubjectListItem pattern: `handleTabChange` callback
- Store `selectedClassId` and `activeClassTab` separately
- Consider: Should tab state persist in URL query params for bookmarking?

### Dependencies
- React state management patterns
- Tabs component `onTabChange` callback
- Existing `selectedClassId` state

---

## Definition of Done

- [ ] All five user stories implemented and tested
- [ ] Tab group displays when class is selected
- [ ] Tab group hides when no class is selected
- [ ] "Edit Class" tab shows edit form with Update/Delete functionality
- [ ] "Final Comments" tab shows final comments interface
- [ ] Tab styling matches SubjectListItem tabs
- [ ] Tab switching works smoothly without data loss
- [ ] Keyboard navigation and accessibility verified
- [ ] All existing ClassManagementModal functionality preserved
- [ ] Test suite passes (all existing tests + new tab tests)
- [ ] No console errors or warnings
- [ ] Code reviewed for consistency with SubjectListItem pattern
- [ ] "Add New Class" flow remains functional (separate from tabs)

---

## Testing Strategy

### Unit Tests
1. **Tab Group Rendering Tests**
   - Tab group appears when class selected
   - Tab group hidden when no class selected
   - Correct tabs rendered ("Edit Class", "Final Comments")

2. **Tab Switching Tests**
   - Active tab state updates on tab click
   - Correct content displayed for each tab
   - Tab state resets when new class selected

3. **Edit Class Tab Tests**
   - Edit form renders with correct data
   - Update class functionality works
   - Delete class functionality triggers confirmation
   - Validation errors displayed correctly

4. **Final Comments Tab Tests**
   - Final comments data loads on tab selection
   - CRUD operations work correctly
   - Loading and error states displayed
   - Empty state shown when no comments

5. **State Management Tests**
   - Selected class persists across tab switches
   - Tab state resets on class change
   - Data refreshes appropriately

### Integration Tests
1. Test complete workflow: select class → edit → switch to final comments → create comment → switch back
2. Test class deletion removes tab group
3. Test creating new class (separate from tabs)
4. Test navigation between subject tabs and class tabs

### Accessibility Tests
1. Keyboard navigation (Tab, Enter, Space keys)
2. Screen reader compatibility (ARIA labels)
3. Focus management (focus indicators visible)
4. WCAG 2.1 AA compliance verification

### Manual Testing
1. Visual consistency check (compare to SubjectListItem tabs)
2. Responsive behavior on different screen sizes
3. Performance check (no lag when switching tabs)
4. Edge cases (rapid tab switching, network errors)

---

## Risks and Mitigation

### Risk 1: FinalCommentsModal Not Embeddable
**Likelihood**: Medium
**Impact**: High
**Mitigation**:
- Review FinalCommentsModal component structure early
- If it expects modal context, refactor to accept `embedded` prop
- Similar to OutcomeCommentsModal/PersonalizedCommentsModal pattern
- May need to remove modal chrome (titles, close buttons)

### Risk 2: Complex State Management
**Likelihood**: Low
**Impact**: Medium
**Mitigation**:
- Follow established SubjectListItem pattern closely
- Use clear variable names: `selectedClassId`, `activeClassTab`
- Write comprehensive state management tests first (TDD)

### Risk 3: Breaking Existing ClassManagementModal Tests
**Likelihood**: Medium
**Impact**: High
**Mitigation**:
- Review existing tests before starting
- Update tests incrementally as UI changes
- Ensure all existing functionality preserved (backwards compatibility)

### Risk 4: Nested Tab Complexity (Tabs Within Tabs)
**Likelihood**: Low
**Impact**: Low
**Mitigation**:
- SubjectListItem has one level of tabs (subject → edit/outcome/personalized/classes)
- ClassManagementModal tabs are within "Manage Classes" panel (nested)
- Ensure tab focus management works correctly at both levels
- Test keyboard navigation thoroughly

---

## Implementation Order

**Phase 1: Foundation** (US-CLASS-TABS-001)
1. Add tab group structure to ClassManagementModal
2. Implement conditional rendering (show tabs when class selected)
3. Add basic tab switching logic
4. Write tests for tab visibility and switching

**Phase 2: Edit Class Tab** (US-CLASS-TABS-002)
1. Move edit form JSX into "Edit Class" TabPanel
2. Verify update/delete functionality works
3. Update tests for edit form in tab context

**Phase 3: Final Comments Tab** (US-CLASS-TABS-003)
1. Review FinalCommentsModal embeddability
2. Integrate FinalCommentsModal into "Final Comments" TabPanel
3. Implement data loading on tab switch
4. Handle loading/error states
5. Write tests for final comments integration

**Phase 4: Styling** (US-CLASS-TABS-004)
1. Apply consistent styling to tab group
2. Verify visual consistency with SubjectListItem tabs
3. Test responsive behavior

**Phase 5: State Management** (US-CLASS-TABS-005)
1. Implement tab state persistence
2. Add tab reset on class change
3. Verify keyboard navigation
4. Write comprehensive state management tests

**Phase 6: Integration & Polish**
1. Full integration testing
2. Accessibility audit
3. Performance testing
4. Code review and cleanup

---

## Success Metrics

### User Experience Metrics
- **Task Completion Time**: Measure time to edit class and view final comments (expect 20% reduction due to fewer clicks)
- **User Satisfaction**: Survey teachers on new tab interface (target: 4.5/5 stars)
- **Navigation Errors**: Track misclicks/confusion (target: <5% error rate)

### Technical Metrics
- **Test Coverage**: Maintain ≥90% coverage for ClassManagementModal
- **Performance**: Tab switching < 100ms response time
- **Accessibility**: 0 WCAG 2.1 AA violations
- **Bundle Size**: <10 KB additional gzipped size for tab logic

### Business Metrics
- **Feature Adoption**: Track % of users who use Final Comments tab (vs. old button)
- **Final Comments Creation**: Measure if easier access increases final comment creation rate
- **Support Tickets**: Monitor for tab-related confusion or issues

---

## Future Enhancements

1. **Add Third Tab: "Student Roster"**
   - Show list of students in the class
   - Allow bulk import of students with grades

2. **Unsaved Changes Warning**
   - Warn when switching tabs with unsaved changes on Edit Class tab
   - Provide option to save or discard

3. **Tab State Persistence**
   - Store active tab in URL query params
   - Enable bookmarking specific class + tab

4. **Quick Actions in Tab Headers**
   - Add "Add Student" button to Final Comments tab header
   - Add "Quick Save" button to Edit Class tab header

5. **Keyboard Shortcuts**
   - Ctrl/Cmd + 1: Edit Class tab
   - Ctrl/Cmd + 2: Final Comments tab
   - Ctrl/Cmd + S: Save changes (on Edit Class tab)

---

## Related User Stories

- **US-REFACTOR-006**: Class management integration (foundation)
- **US-TAB-002**: Subject-level tabs implementation (pattern reference)
- **US-TABPANEL-002**: Tab panel display and switching (pattern reference)
- **US-TABPANEL-003**: Tab panel state management (pattern reference)
- **US-MODAL-STYLE-001 to 004**: Modal styling (consistency reference)
- **US-DELETE-CONFIRM-003**: Class delete confirmation (functionality reference)

---

## Notes for Developers

1. **Pattern Reference**: Study `SubjectListItem.tsx` lines 111-192 for tab implementation pattern
2. **Component Reuse**: Leverage existing `Tabs`, `TabPanel`, `Button` components
3. **State Management**: Keep `selectedClassId` and `activeClassTab` as separate state variables
4. **Accessibility**: Follow ARIA patterns from existing tab implementation
5. **Testing**: Write tests FIRST (TDD approach) - start with tab visibility tests
6. **FinalCommentsModal**: May need refactoring - check if it can be embedded like other modals
7. **Styling**: Use `modalStyles` from `src/styles/modalStyles.ts` for consistency
8. **Git Strategy**: Consider feature branch `feat/class-edit-tabs` with incremental commits per story

