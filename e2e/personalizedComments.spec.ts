/**
 * Personalized Comments E2E Tests
 * Tests complete CRUD workflows for personalized comments functionality
 *
 * This is simpler than Outcome Comments - no score range fields to test.
 * Tests verify the complete user workflow from clicking "Personalized Comments"
 * button through all CRUD operations in the modal.
 *
 * Prerequisites:
 * - Backend running at http://localhost:3000
 * - Frontend running at http://localhost:5173 (auto-started by Playwright)
 */
import { test, expect, Page } from '@playwright/test'

test.describe('Personalized Comments E2E', () => {
  let page: Page

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage

    // Navigate to the app
    await page.goto('/')

    // Wait for initial load
    await page.waitForLoadState('networkidle')

    // Wait for subjects to load - deterministic wait for subject selector or empty state
    await page.waitForSelector('select#subject-selector, [data-testid="empty-state"]', { timeout: 10000 })
  })

  test.describe('Modal Access and Display', () => {
    test('should open personalized comments modal when clicking button', async () => {
      // Find a subject item with personalized comments button
      const subjectItems = page.locator('[data-testid^="subject-item-"]')
      const subjectCount = await subjectItems.count()

      if (subjectCount === 0) {
        // Create a test subject first if none exist
        await createTestSubject(page)
        // Wait for the new subject item to appear
        await page.waitForSelector('[data-testid^="subject-item-"]', { timeout: 5000 })
      }

      // Click the first subject's "Personalized Comments" button
      const firstSubject = page.locator('[data-testid^="subject-item-"]').first()
      const personalizedCommentsButton = firstSubject.locator('button:has-text("Personalized Comments")')

      // Verify button exists
      await expect(personalizedCommentsButton).toBeVisible()

      // Click the button
      await personalizedCommentsButton.click()

      // Verify modal opens
      const modal = page.locator('[role="dialog"]').first()
      await expect(modal).toBeVisible()

      // Verify modal title
      await expect(modal.locator('h2')).toContainText('Personalized Comments')

      // Verify modal has create form
      await expect(modal.locator('textarea[placeholder*="personalized comment"]')).toBeVisible()

      // Should have character counter
      await expect(modal.locator('text=/\\d+ \\/ 500 characters/')).toBeVisible()
    })

    test('should display existing personalized comments in modal', async () => {
      // Open modal
      await openPersonalizedCommentsModal(page)

      const modal = page.locator('[role="dialog"]').first()

      // Check if there are existing comments or empty state
      const commentsList = modal.locator('.comment-item')
      const emptyMessage = modal.locator('text="No personalized comments yet"')

      const hasComments = await commentsList.count() > 0
      const hasEmptyState = await emptyMessage.isVisible()

      // Should show either comments or empty state
      expect(hasComments || hasEmptyState).toBeTruthy()
    })

    test('should close modal when clicking close button', async () => {
      // Open modal
      await openPersonalizedCommentsModal(page)

      const modal = page.locator('[role="dialog"]').first()
      await expect(modal).toBeVisible()

      // Click close button (X)
      const closeButton = modal.locator('button[aria-label="Close modal"]')
      await closeButton.click()

      // Verify modal closes
      await expect(modal).not.toBeVisible()
    })
  })

  test.describe('Create Personalized Comment', () => {
    test('should create new personalized comment successfully', async () => {
      // Open modal
      await openPersonalizedCommentsModal(page)

      const modal = page.locator('[role="dialog"]').first()

      // Fill out create form
      const textarea = modal.locator('textarea[placeholder*="personalized comment"]')
      const createButton = modal.locator('button:has-text("Add Comment")')

      // Enter test data (must be at least 10 chars)
      const testComment = `E2E Test Personalized Comment - ${Date.now()}`
      await textarea.fill(testComment)

      // Verify character counter updates
      await expect(modal.locator('text=/\\d+ \\/ 500 characters/')).toBeVisible()

      // Submit form
      await createButton.click()

      // Wait for creation to complete - wait for the new comment to appear
      const newComment = modal.locator(`text="${testComment}"`).first()
      await expect(newComment).toBeVisible({ timeout: 5000 })

      // Verify form is cleared
      await expect(textarea).toHaveValue('')
      await expect(modal.locator('text=/0 \\/ 500 characters/')).toBeVisible()
    })

    test('should disable Add button when comment is too short', async () => {
      // Open modal
      await openPersonalizedCommentsModal(page)

      const modal = page.locator('[role="dialog"]').first()
      const textarea = modal.locator('textarea[placeholder*="personalized comment"]')
      const createButton = modal.locator('button:has-text("Add Comment")')

      // Button should be disabled initially (empty)
      await expect(createButton).toBeDisabled()

      // Enter short text (less than 10 chars)
      await textarea.fill('Short')

      // Button should still be disabled
      await expect(createButton).toBeDisabled()

      // Enter valid text (at least 10 chars)
      await textarea.fill('This is long enough')

      // Button should be enabled
      await expect(createButton).not.toBeDisabled()
    })

    test('should show character counter with validation hints', async () => {
      // Open modal
      await openPersonalizedCommentsModal(page)

      const modal = page.locator('[role="dialog"]').first()
      const textarea = modal.locator('textarea[placeholder*="personalized comment"]')

      // Type short text
      await textarea.fill('Short')

      // Should show hint about minimum
      await expect(modal.locator('text="(minimum 10)"')).toBeVisible()

      // Type valid length text
      await textarea.fill('This is valid length text')

      // Hint should disappear
      await expect(modal.locator('text="(minimum 10)"')).not.toBeVisible()
    })
  })

  test.describe('Update Personalized Comment', () => {
    test('should edit existing personalized comment successfully', async () => {
      // First create a comment to edit
      await openPersonalizedCommentsModal(page)
      const testComment = `Edit Test Comment - ${Date.now()}`
      await createPersonalizedComment(page, testComment)

      const modal = page.locator('[role="dialog"]').first()

      // Find the comment and click edit
      const commentItem = modal.locator(`text="${testComment}"`).locator('..').first()
      const editButton = commentItem.locator('button:has-text("Edit")')

      await expect(editButton).toBeVisible()
      await editButton.click()

      // Should see edit form
      const editTextarea = commentItem.locator('textarea')
      const saveButton = commentItem.locator('button:has-text("Save")')
      const cancelButton = commentItem.locator('button:has-text("Cancel")')

      await expect(editTextarea).toBeVisible()
      await expect(saveButton).toBeVisible()
      await expect(cancelButton).toBeVisible()

      // Modify the comment
      const updatedComment = `UPDATED - ${testComment}`
      await editTextarea.clear()
      await editTextarea.fill(updatedComment)

      // Save changes
      await saveButton.click()

      // Wait for update to complete - wait for updated text to appear
      const updatedCommentElement = modal.locator(`text="${updatedComment}"`).first()
      await expect(updatedCommentElement).toBeVisible({ timeout: 5000 })

      // Verify edit form is hidden
      await expect(editTextarea).not.toBeVisible()
    })

    test('should cancel edit without saving changes', async () => {
      // Create a comment to edit
      await openPersonalizedCommentsModal(page)
      const testComment = `Cancel Edit Test - ${Date.now()}`
      await createPersonalizedComment(page, testComment)

      const modal = page.locator('[role="dialog"]').first()

      // Start editing
      const commentItem = modal.locator(`text="${testComment}"`).locator('..').first()
      const editButton = commentItem.locator('button:has-text("Edit")')
      await editButton.click()

      // Modify content
      const editTextarea = commentItem.locator('textarea')
      await editTextarea.clear()
      await editTextarea.fill('This should not be saved - minimum length text')

      // Cancel
      const cancelButton = commentItem.locator('button:has-text("Cancel")')
      await cancelButton.click()

      // Verify original content remains
      await expect(modal.locator(`text="${testComment}"`)).toBeVisible()
      await expect(modal.locator('text="This should not be saved"')).not.toBeVisible()

      // Verify edit form is hidden
      await expect(editTextarea).not.toBeVisible()
    })

    test('should validate minimum length during edit', async () => {
      // Create a comment to edit
      await openPersonalizedCommentsModal(page)
      const testComment = `Validation Test - ${Date.now()}`
      await createPersonalizedComment(page, testComment)

      const modal = page.locator('[role="dialog"]').first()

      // Start editing
      const commentItem = modal.locator(`text="${testComment}"`).locator('..').first()
      const editButton = commentItem.locator('button:has-text("Edit")')
      await editButton.click()

      // Try to save with too short text
      const editTextarea = commentItem.locator('textarea')
      const saveButton = commentItem.locator('button:has-text("Save")')

      await editTextarea.clear()
      await editTextarea.fill('Short')

      // Save button should be disabled
      await expect(saveButton).toBeDisabled()
    })
  })

  test.describe('Delete Personalized Comment', () => {
    test('should delete personalized comment with confirmation', async () => {
      // Create a comment to delete
      await openPersonalizedCommentsModal(page)
      const testComment = `Delete Test Comment - ${Date.now()}`
      await createPersonalizedComment(page, testComment)

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

      // Wait for deletion to complete - wait for comment to disappear
      await expect(modal.locator(`text="${testComment}"`)).not.toBeVisible({ timeout: 5000 })

      // Verify confirmation dialog closes
      await expect(confirmDialog).not.toBeVisible()
    })

    test('should cancel delete operation', async () => {
      // Create a comment to test cancel delete
      await openPersonalizedCommentsModal(page)
      const testComment = `Cancel Delete Test - ${Date.now()}`
      await createPersonalizedComment(page, testComment)

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
    test('should handle loading states', async () => {
      await openPersonalizedCommentsModal(page)

      const modal = page.locator('[role="dialog"]').first()

      // Check for loading spinner capability
      const loadingSpinner = modal.locator('[data-testid="loading-spinner"]')
      // Loading spinner should exist in DOM even if not visible
      const spinnerExists = await loadingSpinner.count() > 0
      expect(spinnerExists).toBeTruthy()
    })

    test('should maintain modal state during operations', async () => {
      await openPersonalizedCommentsModal(page)

      const modal = page.locator('[role="dialog"]').first()

      // Create a comment
      await createPersonalizedComment(page, `State Test - ${Date.now()}`)

      // Modal should remain open after operation
      await expect(modal).toBeVisible()

      // Form should be reset
      const textarea = modal.locator('textarea[placeholder*="personalized comment"]')
      await expect(textarea).toHaveValue('')
    })
  })

  test.describe('Accessibility and UX', () => {
    test('should have proper ARIA attributes', async () => {
      await openPersonalizedCommentsModal(page)

      const modal = page.locator('[role="dialog"]').first()

      // Check ARIA attributes
      await expect(modal).toHaveAttribute('role', 'dialog')
      await expect(modal).toHaveAttribute('aria-modal', 'true')

      // Should have aria-labelledby
      const labelledBy = await modal.getAttribute('aria-labelledby')
      expect(labelledBy).toBeTruthy()
    })

    test('should enforce maxLength attribute on textarea', async () => {
      await openPersonalizedCommentsModal(page)

      const modal = page.locator('[role="dialog"]').first()
      const textarea = modal.locator('textarea[placeholder*="personalized comment"]')

      // Check maxLength attribute
      const maxLength = await textarea.getAttribute('maxLength')
      expect(maxLength).toBe('500')
    })
  })
})

// Helper Functions

/**
 * Opens the personalized comments modal for the first available subject
 */
async function openPersonalizedCommentsModal(page: Page) {
  // Ensure we have at least one subject
  const subjectItems = page.locator('[data-testid^="subject-item-"]')
  const subjectCount = await subjectItems.count()

  if (subjectCount === 0) {
    await createTestSubject(page)
    // Wait for the new subject item to appear
    await page.waitForSelector('[data-testid^="subject-item-"]', { timeout: 5000 })
  }

  // Click personalized comments button
  const firstSubject = page.locator('[data-testid^="subject-item-"]').first()
  const personalizedCommentsButton = firstSubject.locator('button:has-text("Personalized Comments")')
  await personalizedCommentsButton.click()

  // Wait for modal to open
  const modal = page.locator('[role="dialog"]').first()
  await expect(modal).toBeVisible()
}

/**
 * Creates a test subject if none exist
 */
async function createTestSubject(page: Page) {
  // Look for "Add Subject" button
  const addButton = page.locator('button:has-text("Add Subject")')

  if (await addButton.isVisible()) {
    await addButton.click()

    // Fill form (assuming standard subject form)
    const nameInput = page.locator('input[name="name"]')
    const submitButton = page.locator('button[type="submit"]')

    await nameInput.fill(`E2E Test Subject - ${Date.now()}`)
    await submitButton.click()

    // Wait for the form to close (submit button should disappear)
    await expect(submitButton).not.toBeVisible({ timeout: 5000 })
  }
}

/**
 * Creates a new personalized comment in the currently open modal
 */
async function createPersonalizedComment(page: Page, commentText: string) {
  const modal = page.locator('[role="dialog"]').first()

  const textarea = modal.locator('textarea[placeholder*="personalized comment"]')
  const createButton = modal.locator('button:has-text("Add Comment")')

  await textarea.fill(commentText)
  await createButton.click()

  // Wait for creation to complete - wait for the new comment to appear in the list
  await expect(modal.locator(`text="${commentText}"`)).toBeVisible({ timeout: 5000 })
}
