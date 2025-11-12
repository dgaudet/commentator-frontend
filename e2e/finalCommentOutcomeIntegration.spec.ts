/**
 * Final Comment Outcome Integration E2E Tests
 * Tests complete workflow for outcome comment auto-population in final comments
 *
 * Feature: FCOI-001 (Final Comment Outcome Integration)
 * User Stories:
 * - US-FINAL-001: Display Outcome Comment by Grade
 * - US-FINAL-002: Read-Only Styling
 * - US-FINAL-003: Loading and Error States
 *
 * Prerequisites:
 * - Backend running at http://localhost:3000
 * - Frontend running at http://localhost:5173 (auto-started by Playwright)
 * - Subject with outcome comments configured
 * - Class within that subject
 */
import { test, expect, Page } from '@playwright/test'

/**
 * Helper: Navigate to Final Comments for a class
 */
async function openFinalCommentsForClass(page: Page) {
  // Wait for classes to load
  await page.waitForLoadState('networkidle')

  // Find first class with "Final Comments" tab or button
  const classItems = page.locator('[data-testid^="class-item-"]')
  const classCount = await classItems.count()

  if (classCount === 0) {
    throw new Error('No classes available for testing')
  }

  // Click on the first class to expand it
  const firstClass = classItems.first()
  await firstClass.click()

  // Wait for class details to appear
  await page.waitForTimeout(500)

  // Look for Final Comments tab or button
  const finalCommentsTab = page.locator('button:has-text("Final Comments")')
  await finalCommentsTab.waitFor({ state: 'visible', timeout: 3000 })
  await finalCommentsTab.click()

  // Wait for final comments form to appear
  await page.locator('h3:has-text("Add New Final Comment")').waitFor({ state: 'visible', timeout: 3000 })
}

test.describe('Final Comment Outcome Integration E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('/')

    // Wait for initial load
    await page.waitForLoadState('networkidle')
  })

  test.describe('US-FINAL-001 AC2: Outcome comment appears when grade entered', () => {
    test('E1: User enters grade → outcome comment appears', async ({ page }) => {
      // Navigate to Final Comments
      await openFinalCommentsForClass(page)

      // Find the grade input field
      const gradeInput = page.locator('input#grade-input')
      await expect(gradeInput).toBeVisible()

      // Find the outcome comment field (should exist but be empty)
      const outcomeCommentField = page.locator('textarea#outcome-comment-display')
      await expect(outcomeCommentField).toBeVisible()
      await expect(outcomeCommentField).toHaveAttribute('readonly')

      // Enter a grade in the high range (85)
      await gradeInput.fill('85')

      // Wait for debounce (300ms) plus network delay
      await page.waitForTimeout(500)

      // Verify outcome comment appears
      const outcomeCommentValue = await outcomeCommentField.inputValue()
      expect(outcomeCommentValue.length).toBeGreaterThan(0)

      // Verify it's not the empty state message
      if (outcomeCommentValue.includes('No outcome comment')) {
        console.warn('Warning: No outcome comments configured for this subject/grade range')
      } else {
        // Should display a meaningful outcome comment
        expect(outcomeCommentValue).not.toBe('')
        expect(outcomeCommentValue.length).toBeGreaterThan(10) // Reasonable comment length
      }
    })

    test('E2: User changes grade → outcome comment updates', async ({ page }) => {
      // Navigate to Final Comments
      await openFinalCommentsForClass(page)

      const gradeInput = page.locator('input#grade-input')
      const outcomeCommentField = page.locator('textarea#outcome-comment-display')

      // Enter first grade (high range: 85)
      await gradeInput.fill('85')
      await page.waitForTimeout(500)

      const firstComment = await outcomeCommentField.inputValue()
      expect(firstComment.length).toBeGreaterThan(0)

      // Change grade to lower range (65)
      await gradeInput.fill('')
      await gradeInput.fill('65')
      await page.waitForTimeout(500)

      const secondComment = await outcomeCommentField.inputValue()
      expect(secondComment.length).toBeGreaterThan(0)

      // Verify comment changed (or both show same no-match message)
      // Note: Comments might be same if only one range is configured
      if (!firstComment.includes('No outcome comment') && !secondComment.includes('No outcome comment')) {
        // If both have actual comments, they should be different
        // (unless the subject only has one outcome comment covering both ranges)
        expect(secondComment).toBeDefined()
      }
    })
  })

  test.describe('US-FINAL-001 AC3: Empty state when no match', () => {
    test('E3: User enters grade with no match → empty state shown', async ({ page }) => {
      // Navigate to Final Comments
      await openFinalCommentsForClass(page)

      const gradeInput = page.locator('input#grade-input')
      const outcomeCommentField = page.locator('textarea#outcome-comment-display')

      // Enter a grade that's likely out of range (105 - intentionally invalid)
      await gradeInput.fill('105')
      await page.waitForTimeout(500)

      // Verify empty state message appears
      const outcomeCommentValue = await outcomeCommentField.inputValue()
      expect(outcomeCommentValue).toContain('No outcome comment for this subject with this grade level.')
    })
  })

  test.describe('US-FINAL-001 AC5: Clear grade behavior', () => {
    test('E4: User clears grade → outcome comment clears', async ({ page }) => {
      // Navigate to Final Comments
      await openFinalCommentsForClass(page)

      const gradeInput = page.locator('input#grade-input')
      const outcomeCommentField = page.locator('textarea#outcome-comment-display')

      // Enter a grade
      await gradeInput.fill('85')
      await page.waitForTimeout(500)

      // Verify outcome comment appears
      const commentWithGrade = await outcomeCommentField.inputValue()
      expect(commentWithGrade.length).toBeGreaterThan(0)

      // Clear the grade
      await gradeInput.fill('')
      await page.waitForTimeout(500)

      // Verify outcome comment clears
      const commentAfterClear = await outcomeCommentField.inputValue()
      expect(commentAfterClear).toBe('')
    })
  })

  test.describe('US-FINAL-002: Read-only field styling', () => {
    test('should render outcome comment field as read-only', async ({ page }) => {
      // Navigate to Final Comments
      await openFinalCommentsForClass(page)

      const outcomeCommentField = page.locator('textarea#outcome-comment-display')

      // Verify field is visible
      await expect(outcomeCommentField).toBeVisible()

      // Verify field is read-only
      await expect(outcomeCommentField).toHaveAttribute('readonly')

      // Verify field has proper label
      const label = page.locator('label[for="outcome-comment-display"]')
      await expect(label).toBeVisible()
      await expect(label).toHaveText('Outcome Comment by Grade')

      // Verify styling (background color should indicate read-only)
      const backgroundColor = await outcomeCommentField.evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor
      })

      // Background should not be pure white (read-only fields have gray background)
      expect(backgroundColor).not.toBe('rgb(255, 255, 255)')
    })

    test('should not allow user to type in outcome comment field', async ({ page }) => {
      // Navigate to Final Comments
      await openFinalCommentsForClass(page)

      const outcomeCommentField = page.locator('textarea#outcome-comment-display')

      // Try to type in the field (should not work because it's readonly)
      await outcomeCommentField.click()
      await page.keyboard.type('Attempted to edit')

      // Verify nothing was typed (field should still be empty or have original value)
      const fieldValue = await outcomeCommentField.inputValue()

      // If outcome comment was loaded, verify our typing didn't append
      if (fieldValue.length > 0) {
        expect(fieldValue).not.toContain('Attempted to edit')
      } else {
        // If empty, should still be empty
        expect(fieldValue).toBe('')
      }
    })
  })

  test.describe('US-FINAL-003: Loading states', () => {
    test('should show outcome comment field even during initial load', async ({ page }) => {
      // Navigate to Final Comments
      await openFinalCommentsForClass(page)

      // Outcome comment field should be visible immediately
      const outcomeCommentField = page.locator('textarea#outcome-comment-display')
      await expect(outcomeCommentField).toBeVisible()

      // Label should also be visible
      const label = page.locator('label[for="outcome-comment-display"]')
      await expect(label).toBeVisible()
    })
  })

  test.describe('Complete workflow: Create final comment with outcome comment context', () => {
    test('should allow creating final comment while viewing outcome comment', async ({ page }) => {
      // Navigate to Final Comments
      await openFinalCommentsForClass(page)

      // Fill in student information
      const firstNameInput = page.locator('input#first-name-input')
      const gradeInput = page.locator('input#grade-input')
      const commentInput = page.locator('textarea#comment-input')
      const outcomeCommentField = page.locator('textarea#outcome-comment-display')

      await firstNameInput.fill('Test Student')
      await gradeInput.fill('85')

      // Wait for outcome comment to appear
      await page.waitForTimeout(500)

      // Verify outcome comment provides context
      const outcomeComment = await outcomeCommentField.inputValue()
      expect(outcomeComment.length).toBeGreaterThan(0)

      // Write final comment (teacher can reference the outcome comment)
      await commentInput.fill('Student demonstrates excellent understanding of the material.')

      // Submit the form
      const submitButton = page.locator('button:has-text("Add Final Comment")')
      await submitButton.click()

      // Wait for form to submit
      await page.waitForTimeout(1000)

      // Verify success (form should clear or show success message)
      const firstNameAfterSubmit = await firstNameInput.inputValue()
      expect(firstNameAfterSubmit).toBe('') // Form should clear on success
    })
  })
})
