# To Do Items
# The act function seems to be deprecated but it's used in tests and code
# Final comments
## When you enter a grade for a student, it should load the matching outcome comment
## There should be a drop-down for personal comment, which when you pick it, should post into a text box below you can edit
### then when you choose it, we could have another box below that puts the 2 sections together with a copy button
## perhaps then I need a button to view all comments for class that you can print
## picking the personal comment should be a type ahead search box
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
## Should it also delete the final comments associated? should the backend do the deletion?
# Outcome Comments should be ordered by the Lower Range values
# sort final comments by student name
# Design a favicon for the browser tab, something that looks like a notepad
# Design a top banner for the app, something with students, maybe say something like inspiring the next generation, or guiding the leaders of tomorrow

Can you create some stories to style the outcome comments, personal comments and class components to match the overall style of the app? You can also remove the title from the component and the x close button as they are not necessary anymore