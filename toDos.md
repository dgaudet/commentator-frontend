# To Do Items
# Personalized Comments
## show a count of which comment you are on ex: 1 out of 100
## how should we order them?
# The act function seems to be deprecated but it's used in tests and code
## When you create a subject, it should be selected automatically even if it's not the only subject created
If you have an subject selected, and you open the outcome comments, then switch the subject, the outcome comments modal should update to show the comments for the newly selected subject
* Or perhaps just have it close the outcome comments when you switch
# Final comments
## When you enter a grade for a student, it should load the matching outcome comment
## There should be a drop-down for personal comment, which when you pick it, should post into a text box below you can edit
### then when you choose it, we could have another box below that puts the 2 sections together with a copy button
## perhaps then I need a button to view all comments for class that you can print
## lower priority
### we should have a way to bulk add students with their grade
### The lable for selecting a class should be `Select a Class to work with`
remove the console.error methods from services

Can you create stories to modify the SubjectListItem component to use tabs for each of the buttons for edit/outcome comments/personalized comments/manage classes.

# Subject Delete Button Relocation
**Status**: ✅ Stories Created - Ready for Development
**Priority**: HIGH (MVP)
**Effort**: L1-MICRO (3-5 days, 10 story points)
**Location**: `pdd-workspace/subject-delete-relocation/planning/user-stories.md`

Move subject delete button to appear beside Subject Name when a subject is selected.

## Stories:
- US-SUBJ-DELETE-001: Show Delete Button on Selection (3 pts, HIGH)
- US-SUBJ-DELETE-002: Delete Subject with Confirmation (5 pts, HIGH)
- US-SUBJ-DELETE-003: Handle Edge Cases (2 pts, MEDIUM)