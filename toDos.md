# To Do Items
# The act function seems to be deprecated but it's used in tests and code
# Final comments
## When you enter a grade for a student, it should load the matching outcome comment
## There should be a drop-down for personal comment, which when you pick it, should post into a text box below you can edit
### then when you choose it, we could have another box below that puts the 2 sections together with a copy button
## perhaps then I need a button to view all comments for class that you can print
## lower priority
### we should have a way to bulk add students with their grade
### The label for selecting a class should be `Select a Class to work with`
### show a count of which comment you are on ex: 1 out of 100
#### how should we order them?
# remove the console.error methods from services
# we can now remove the `x` close button from modals since they are tabs
## we also don't need a title in each tab since the tab name is sufficient
# need to figure out how to do the final comments, should it be under Manage Classes? I think so, the code is still in App.tsx though
# When deleting a class that has comments, what should happen?
## Should it also dåelete the final comments associated? should the backend do the deletion?
# ConfirmDialog should be removed once the swap to ConfirmationModal is done
# Outcome Comments should be ordered by the Lower Range values
# sort final comments by student name