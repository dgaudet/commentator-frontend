/**
 * Outcome Comments E2E Tests
 * Tests complete CRUD workflows for outcome comments functionality
 *
 * CRITICAL: Testing user-reported issues:
 * - "I can't delete an outcome comment"
 * - "I can't update an outcome comment either"
 *
 * These tests verify the complete user workflow from clicking "Outcome Comments"
 * button through all CRUD operations in the modal.
 *
 * Prerequisites:
 * - Backend running at http://localhost:3000
 * - Frontend running at http://localhost:5173 (auto-started by Playwright)
 */
import { test, expect, Page } from '@playwright/test'

test.describe('Outcome Comments E2E', () => {
  let page: Page

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage

    // Navigate to the app
    await page.goto('/')

    // Wait for initial load
    await page.waitForLoadState('networkidle')

    // Wait for classes to load (deterministic wait - check for class items or empty state)
    const classItems = page.locator('[data-testid^="class-item-"]')
    const emptyState = page.locator('text=No classes yet')
    await Promise.race([
      classItems.first().waitFor({ state: 'visible', timeout: 3000 }).catch(() => null),
      emptyState.waitFor({ state: 'visible', timeout: 3000 }).catch(() => null),
    ])
  })

  test.describe('Modal Access and Display', () => {
    test('should open outcome comments modal when clicking button', async () => {
      // Find a class item with outcome comments button
      const classItems = page.locator('[data-testid^="class-item-"]')
      const classCount = await classItems.count()

      if (classCount === 0) {
        // Create a test class first if none exist
        await createTestClass(page)

        // Wait for class to be created (deterministic wait)
        await expect(page.locator('[data-testid^="class-item-"]').first()).toBeVisible({ timeout: 3000 })
      }

      // Click the first class's "Outcome Comments" button
      const firstClass = page.locator('[data-testid^="class-item-"]').first()
      const outcomeCommentsButton = firstClass.locator('button:has-text("Outcome Comments")')

      // Verify button exists
      await expect(outcomeCommentsButton).toBeVisible()

      // Click the button
      await outcomeCommentsButton.click()

      // Verify modal opens
      const modal = page.locator('[role="dialog"]').first()
      await expect(modal).toBeVisible()

      // Verify modal title
      await expect(modal.locator('h2')).toContainText('Outcome Comments')

      // Verify modal has create form
      await expect(modal.locator('textarea[placeholder*="comment"]')).toBeVisible()
      await expect(modal.locator('input[type="number"]')).toHaveCount(2) // Should have lower and upper number inputs
    })

    test('should display existing outcome comments in modal', async () => {
      // Open modal
      await openOutcomeCommentsModal(page)

      const modal = page.locator('[role="dialog"]').first()

      // Check if there are existing comments or empty state
      const commentsList = modal.locator('[data-testid^="outcome-comment-"]')
      const emptyMessage = modal.locator('text="No outcome comments yet"')

      const hasComments = await commentsList.count() > 0
      const hasEmptyState = await emptyMessage.isVisible()

      // Should show either comments or empty state
      expect(hasComments || hasEmptyState).toBeTruthy()
    })

    test('should close modal when clicking close button', async () => {
      // Open modal
      await openOutcomeCommentsModal(page)

      const modal = page.locator('[role="dialog"]').first()
      await expect(modal).toBeVisible()

      // Click close button (X)
      const closeButton = modal.locator('button[aria-label="Close modal"]')
      await closeButton.click()

      // Verify modal closes
      await expect(modal).not.toBeVisible()
    })
  })

  test.describe('Create Outcome Comment - CRITICAL TEST', () => {
    test('should create new outcome comment successfully', async () => {
      // Open modal
      await openOutcomeCommentsModal(page)

      const modal = page.locator('[role="dialog"]').first()

      // Fill out create form
      const textarea = modal.locator('textarea[placeholder*="comment"]')
      const lowerRangeInput = modal.locator('#lower-range')
      const upperRangeInput = modal.locator('#upper-range')
      const createButton = modal.locator('button:has-text("Add Comment")')

      // Enter test data
      const testComment = `E2E Test Comment - ${Date.now()}`
      await textarea.fill(testComment)
      await lowerRangeInput.fill('8')
      await upperRangeInput.fill('8')

      // Submit form
      await createButton.click()

      // Verify comment appears in list (deterministic wait)
      const newComment = modal.locator(`text="${testComment}"`).first()
      await expect(newComment).toBeVisible({ timeout: 3000 })

      // Verify score is displayed on the new comment
      const newCommentScore = newComment.locator('.score-range')
      await expect(newCommentScore).toHaveText('Score Range: 8 - 8')

      // Verify form is cleared
      await expect(textarea).toHaveValue('')
      await expect(lowerRangeInput).toHaveValue('5') // Default value
      await expect(upperRangeInput).toHaveValue('5') // Default value
    })

    test('should validate required fields before creating', async () => {
      // Open modal
      await openOutcomeCommentsModal(page)

      const modal = page.locator('[role="dialog"]').first()
      const createButton = modal.locator('button:has-text("Add Comment")')

      // Try to submit empty form
      await createButton.click()

      // Should see validation error or button disabled
      const textarea = modal.locator('textarea[placeholder*="comment"]')
      const isRequired = await textarea.getAttribute('required')
      expect(isRequired).not.toBeNull() // required attribute exists, even if empty string
    })
  })

  test.describe('Update Outcome Comment - CRITICAL FAILING FUNCTIONALITY', () => {
    test('should edit existing outcome comment successfully', async () => {
      // First create a comment to edit
      await openOutcomeCommentsModal(page)
      const testComment = `Edit Test Comment - ${Date.now()}`
      await createComment(page, testComment, '6')

      const modal = page.locator('[role="dialog"]').first()

      // Find the comment and click edit
      const commentItem = modal.locator(`text="${testComment}"`).locator('..').first()
      const editButton = commentItem.locator('button:has-text("Edit")')

      await expect(editButton).toBeVisible()
      await editButton.click()

      // Should see edit form
      const editTextarea = commentItem.locator('textarea')
      const editLowerRangeInput = commentItem.locator('#edit-lower-range')
      const editUpperRangeInput = commentItem.locator('#edit-upper-range')
      const saveButton = commentItem.locator('button:has-text("Save")')
      const cancelButton = commentItem.locator('button:has-text("Cancel")')

      await expect(editTextarea).toBeVisible()
      await expect(editLowerRangeInput).toBeVisible()
      await expect(editUpperRangeInput).toBeVisible()
      await expect(saveButton).toBeVisible()
      await expect(cancelButton).toBeVisible()

      // Modify the comment
      const updatedComment = `UPDATED - ${testComment}`
      await editTextarea.clear()
      await editTextarea.fill(updatedComment)
      await editLowerRangeInput.fill('9')
      await editUpperRangeInput.fill('9')

      // Save changes
      await saveButton.click()

      // Verify updated content appears (deterministic wait)
      const updatedCommentElement = modal.locator(`text="${updatedComment}"`).first()
      await expect(updatedCommentElement).toBeVisible({ timeout: 3000 })

      // Verify updated score is displayed on the specific comment
      const updatedCommentScore = updatedCommentElement.locator('..').locator('.score-range')
      await expect(updatedCommentScore).toHaveText('Score Range: 9 - 9')

      // Verify edit form is hidden
      await expect(editTextarea).not.toBeVisible()
    })

    test('should cancel edit without saving changes', async () => {
      // Create a comment to edit
      await openOutcomeCommentsModal(page)
      const testComment = `Cancel Edit Test - ${Date.now()}`
      await createComment(page, testComment, '7')

      const modal = page.locator('[role="dialog"]').first()

      // Start editing
      const commentItem = modal.locator(`text="${testComment}"`).locator('..').first()
      const editButton = commentItem.locator('button:has-text("Edit")')
      await editButton.click()

      // Modify content
      const editTextarea = commentItem.locator('textarea')
      await editTextarea.clear()
      await editTextarea.fill('This should not be saved')

      // Cancel
      const cancelButton = commentItem.locator('button:has-text("Cancel")')
      await cancelButton.click()

      // Verify original content remains
      await expect(modal.locator(`text="${testComment}"`)).toBeVisible()
      await expect(modal.locator('text="This should not be saved"')).not.toBeVisible()

      // Verify edit form is hidden
      await expect(editTextarea).not.toBeVisible()
    })
  })

  test.describe('Delete Outcome Comment - CRITICAL FAILING FUNCTIONALITY', () => {
    test('should delete outcome comment with confirmation', async () => {
      // Create a comment to delete
      await openOutcomeCommentsModal(page)
      const testComment = `Delete Test Comment - ${Date.now()}`
      await createComment(page, testComment, '4')

      const modal = page.locator('[role="dialog"]').first()

      // Find and click delete button
      const commentItem = modal.locator(`text="${testComment}"`).locator('..').first()
      const deleteButton = commentItem.locator('button:has-text("Delete")')

      await expect(deleteButton).toBeVisible()
      await deleteButton.click()

      // Should see confirmation dialog
      const confirmDialog = page.locator('[role="dialog"]').nth(1) // Second dialog
      await expect(confirmDialog).toBeVisible()
      await expect(confirmDialog.locator('text="Are you sure"')).toBeVisible()

      // Confirm deletion
      const confirmButton = confirmDialog.locator('button:has-text("Delete")')
      await confirmButton.click()

      // Verify comment is removed (deterministic wait)
      await expect(modal.locator(`text="${testComment}"`)).not.toBeVisible({ timeout: 3000 })

      // Verify confirmation dialog closes
      await expect(confirmDialog).not.toBeVisible()
    })

    test('should cancel delete operation', async () => {
      // Create a comment to test cancel delete
      await openOutcomeCommentsModal(page)
      const testComment = `Cancel Delete Test - ${Date.now()}`
      await createComment(page, testComment, '3')

      const modal = page.locator('[role="dialog"]').first()

      // Start delete process
      const commentItem = modal.locator(`text="${testComment}"`).locator('..').first()
      const deleteButton = commentItem.locator('button:has-text("Delete")')
      await deleteButton.click()

      // Cancel in confirmation dialog
      const confirmDialog = page.locator('[role="dialog"]').nth(1)
      const cancelButton = confirmDialog.locator('button:has-text("Cancel")')
      await cancelButton.click()

      // Verify comment still exists
      await expect(modal.locator(`text="${testComment}"`)).toBeVisible()

      // Verify confirmation dialog closes
      await expect(confirmDialog).not.toBeVisible()
    })
  })

  test.describe('Error Handling and Edge Cases', () => {
    test('should handle API errors gracefully', async () => {
      // This test would require mocking API failures
      // For now, verify error states don't crash the app
      await openOutcomeCommentsModal(page)

      const modal = page.locator('[role="dialog"]').first()

      // Check for error message display capability
      const errorContainer = modal.locator('[data-testid="error-message"]')
      // Error container should exist in DOM even if not visible
      const errorExists = await errorContainer.count() > 0
      expect(errorExists).toBeTruthy()
    })

    test('should handle loading states', async () => {
      await openOutcomeCommentsModal(page)

      const modal = page.locator('[role="dialog"]').first()

      // Check for loading spinner capability
      const loadingSpinner = modal.locator('[data-testid="loading-spinner"]')
      // Loading spinner should exist in DOM even if not visible
      const spinnerExists = await loadingSpinner.count() > 0
      expect(spinnerExists).toBeTruthy()
    })

    test('should maintain modal state during operations', async () => {
      await openOutcomeCommentsModal(page)

      const modal = page.locator('[role="dialog"]').first()

      // Create a comment
      await createComment(page, `State Test - ${Date.now()}`, '5')

      // Modal should remain open after operation
      await expect(modal).toBeVisible()

      // Form should be reset
      const textarea = modal.locator('textarea[placeholder*="comment"]')
      await expect(textarea).toHaveValue('')
    })
  })

  test.describe('Accessibility and UX', () => {
    test('should support keyboard navigation', async () => {
      await openOutcomeCommentsModal(page)

      const modal = page.locator('[role="dialog"]').first()

      // Focus should be trapped in modal
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')

      // Should be able to navigate through form elements
      const textarea = modal.locator('textarea[placeholder*="comment"]')
      await expect(textarea).toBeFocused()
    })

    test('should have proper ARIA attributes', async () => {
      await openOutcomeCommentsModal(page)

      const modal = page.locator('[role="dialog"]').first()

      // Check ARIA attributes
      await expect(modal).toHaveAttribute('role', 'dialog')
      await expect(modal).toHaveAttribute('aria-modal', 'true')

      // Should have aria-labelledby
      const labelledBy = await modal.getAttribute('aria-labelledby')
      expect(labelledBy).toBeTruthy()
    })
  })
})

// Helper Functions

/**
 * Opens the outcome comments modal for the first available class
 */
async function openOutcomeCommentsModal(page: Page) {
  // Ensure we have at least one class
  const classItems = page.locator('[data-testid^="class-item-"]')
  const classCount = await classItems.count()

  if (classCount === 0) {
    await createTestClass(page)

    // Wait for class to be created (deterministic wait)
    await expect(page.locator('[data-testid^="class-item-"]').first()).toBeVisible({ timeout: 3000 })
  }

  // Click outcome comments button
  const firstClass = page.locator('[data-testid^="class-item-"]').first()
  const outcomeCommentsButton = firstClass.locator('button:has-text("Outcome Comments")')
  await outcomeCommentsButton.click()

  // Wait for modal to open
  const modal = page.locator('[role="dialog"]').first()
  await expect(modal).toBeVisible()
}

/**
 * Creates a test class if none exist
 */
async function createTestClass(page: Page) {
  // Look for "Add Class" button or similar
  const addButton = page.locator('button:has-text("Add Class")')

  if (await addButton.isVisible()) {
    await addButton.click()

    // Fill form (assuming standard class form)
    const nameInput = page.locator('input[name="name"]')
    const yearInput = page.locator('input[name="year"]')
    const submitButton = page.locator('button[type="submit"]')

    await nameInput.fill(`E2E Test Class - ${Date.now()}`)
    await yearInput.fill('2024')
    await submitButton.click()

    // Wait for class to be created (deterministic wait)
    await expect(page.locator('[data-testid^="class-item-"]').first()).toBeVisible({ timeout: 3000 })
  }
}

/**
 * Creates a new outcome comment in the currently open modal
 */
async function createComment(page: Page, commentText: string, score: string) {
  const modal = page.locator('[role="dialog"]').first()

  const textarea = modal.locator('textarea[placeholder*="comment"]')
  const lowerRangeInput = modal.locator('#lower-range')
  const upperRangeInput = modal.locator('#upper-range')
  const createButton = modal.locator('button:has-text("Add Comment")')

  await textarea.fill(commentText)
  await lowerRangeInput.fill(score)
  await upperRangeInput.fill(score)
  await createButton.click()

  // Wait for comment to appear (deterministic wait)
  await expect(modal.locator(`text="${commentText}"`).first()).toBeVisible({ timeout: 3000 })
}
