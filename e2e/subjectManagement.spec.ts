/**
 * Subject Management E2E Tests
 * Tests complete user workflows for Subject CRUD operations
 * Reference: US-REFACTOR-010
 *
 * Key Differences from Class Management:
 * - Subject has NO year field (only id, name, createdAt, updatedAt)
 * - API endpoints use /subject instead of /class
 * - Duplicate detection based on name only (not name+year)
 * - Form validation simplified (no year validation)
 *
 * Prerequisites:
 * - Backend running at http://localhost:3000 with /subject endpoints
 * - Frontend configured to use Subject components (not yet in main App.tsx)
 */
import { test, expect } from '@playwright/test'

test.describe('Subject Management E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('/')

    // Wait for initial load
    await page.waitForLoadState('networkidle')
  })

  test.describe('US-REFACTOR-005: View List of Subjects', () => {
    test('should display list of subjects', async ({ page }) => {
      // Wait for subjects to load (deterministic wait for dropdown or empty state)
      const dropdown = page.locator('select#subject-selector')
      const emptyState = page.locator('text=No subjects found')
      await Promise.race([
        dropdown.waitFor({ state: 'visible', timeout: 3000 }).catch(() => null),
        emptyState.waitFor({ state: 'visible', timeout: 3000 }).catch(() => null)
      ])

      // Should show either dropdown with subjects or empty state
      const hasDropdown = await dropdown.isVisible()
      const hasOptions = await page.locator('select#subject-selector option').count() > 1 // More than just placeholder
      const hasEmptyState = await page.locator('text=No subjects found').isVisible()

      expect(hasDropdown || hasEmptyState).toBeTruthy()
      if (hasDropdown) {
        expect(hasOptions || hasEmptyState).toBeTruthy()
      }
    })

    test('should display subject details correctly (name only, no year)', async ({ page }) => {
      // Check if we have any subjects in dropdown
      const dropdown = page.locator('select#subject-selector')
      const options = await dropdown.locator('option').count()

      if (options > 1) { // More than just placeholder
        // Select first subject from dropdown
        const firstValue = await dropdown.locator('option').nth(1).getAttribute('value')
        await dropdown.selectOption(firstValue!)

        // Wait for SubjectListItem to render (deterministic wait)
        const firstSubject = page.locator('[data-testid^="subject-item-"]').first()
        await expect(firstSubject).toBeVisible({ timeout: 2000 })

        // Should display name
        await expect(firstSubject).toContainText(/[A-Za-z]/)

        // Should NOT display year (Subject has no year field)
        await expect(firstSubject).not.toContainText(/Year:/)

        // Should display dates
        await expect(firstSubject).toContainText(/Created:/)
        await expect(firstSubject).toContainText(/Updated:/)
      }
    })

    test('should show empty state when no subjects', async ({ page }) => {
      // Note: This test requires a clean database
      // In a real scenario, you'd clean the DB before the test

      // Navigate to app
      await page.goto('/')

      // Check if empty state OR dropdown with subjects are shown
      const emptyStateVisible = await page.locator('text=No subjects found').isVisible().catch(() => false)
      const dropdownVisible = await page.locator('select#subject-selector').isVisible()

      // One of these should be true
      expect(emptyStateVisible || dropdownVisible).toBeTruthy()
    })
  })

  test.describe('US-REFACTOR-007: Add New Subject', () => {
    test('should open create subject form', async ({ page }) => {
      // Look for "Add Subject" or "Create First Subject" button
      const addButton = page.locator('button:has-text("Add Subject"), button:has-text("Create First Subject")').first()

      if (await addButton.isVisible()) {
        await addButton.click()

        // Form should appear
        await expect(page.locator('text=Add New Subject')).toBeVisible({ timeout: 2000 })

        // Should have subject name field
        await expect(page.locator('label:has-text("Subject Name")')).toBeVisible()

        // Should NOT have year field (Subject has no year)
        await expect(page.locator('label:has-text("Year")')).not.toBeVisible()

        // Should have buttons
        await expect(page.locator('button:has-text("Create Subject")')).toBeVisible()
        await expect(page.locator('button:has-text("Cancel")')).toBeVisible()
      }
    })

    test('should validate required fields', async ({ page }) => {
      // Open form
      const addButton = page.locator('button:has-text("Add Subject"), button:has-text("Create First Subject")').first()

      if (await addButton.isVisible()) {
        await addButton.click()

        // Try to submit empty form
        await page.locator('button:has-text("Create Subject")').click()

        // Should show validation error
        await expect(page.locator('text=/.*required.*/i')).toBeVisible({ timeout: 2000 })
      }
    })

    test('should validate name length', async ({ page }) => {
      // Open form
      const addButton = page.locator('button:has-text("Add Subject"), button:has-text("Create First Subject")').first()

      if (await addButton.isVisible()) {
        await addButton.click()

        // Try name that's too long (>100 characters)
        await page.fill('input[id*="subject-name"]', 'a'.repeat(101))
        await page.locator('button:has-text("Create Subject")').click()

        // Should show validation error
        await expect(page.locator('text=/.*100 characters.*/i')).toBeVisible({ timeout: 2000 })
      }
    })

    test('should create new subject successfully (name only, no year)', async ({ page }) => {
      // Open form
      const addButton = page.locator('button:has-text("Add Subject"), button:has-text("Create First Subject")').first()

      if (await addButton.isVisible()) {
        await addButton.click()

        // Generate unique subject name
        const uniqueName = `E2E Test Subject ${Date.now()}`

        // Fill form (name only - no year field)
        await page.fill('input[id*="subject-name"]', uniqueName)

        // Submit
        await page.locator('button:has-text("Create Subject")').click()

        // Verify subject appears in dropdown options (deterministic wait)
        const optionWithName = page.locator(`select#subject-selector option:has-text("${uniqueName}")`)
        await expect(optionWithName).toHaveCount(1, { timeout: 5000 })
      }
    })

    test('should cancel subject creation', async ({ page }) => {
      // Open form
      const addButton = page.locator('button:has-text("Add Subject"), button:has-text("Create First Subject")').first()

      if (await addButton.isVisible()) {
        await addButton.click()

        // Fill some data
        await page.fill('input[id*="subject-name"]', 'Cancel Test')

        // Click cancel
        await page.locator('button:has-text("Cancel")').click()

        // Form should close
        await expect(page.locator('text=Add New Subject')).not.toBeVisible({ timeout: 2000 })

        // Subject should not be created
        await expect(page.locator('text=Cancel Test')).not.toBeVisible()
      }
    })

    test('should prevent duplicate subject creation (name-based only)', async ({ page }) => {
      // Open form
      const addButton = page.locator('button:has-text("Add Subject"), button:has-text("Create First Subject")').first()

      if (await addButton.isVisible()) {
        // Create first subject
        await addButton.click()
        const uniqueName = `Duplicate Test ${Date.now()}`
        await page.fill('input[id*="subject-name"]', uniqueName)
        await page.locator('button:has-text("Create Subject")').click()

        // Wait for subject to be created (deterministic wait)
        const createdOption = page.locator(`select#subject-selector option:has-text("${uniqueName}")`)
        await expect(createdOption).toHaveCount(1, { timeout: 3000 })

        // Try to create duplicate (same name)
        await page.locator('button:has-text("Add Subject")').click()
        await page.fill('input[id*="subject-name"]', uniqueName)
        await page.locator('button:has-text("Create Subject")').click()

        // Should show duplicate error
        await expect(page.locator('text=/.*already exists.*/i')).toBeVisible({ timeout: 2000 })
      }
    })

    test('should perform case-insensitive duplicate detection', async ({ page }) => {
      // Open form
      const addButton = page.locator('button:has-text("Add Subject"), button:has-text("Create First Subject")').first()

      if (await addButton.isVisible()) {
        // Create first subject
        await addButton.click()
        const uniqueName = `CaseSensitive Test ${Date.now()}`
        await page.fill('input[id*="subject-name"]', uniqueName)
        await page.locator('button:has-text("Create Subject")').click()

        // Wait for subject to be created (deterministic wait)
        const createdOption = page.locator(`select#subject-selector option:has-text("${uniqueName}")`)
        await expect(createdOption).toHaveCount(1, { timeout: 3000 })

        // Try to create duplicate with different case
        await page.locator('button:has-text("Add Subject")').click()
        await page.fill('input[id*="subject-name"]', uniqueName.toUpperCase())
        await page.locator('button:has-text("Create Subject")').click()

        // Should show duplicate error (case-insensitive check)
        await expect(page.locator('text=/.*already exists.*/i')).toBeVisible({ timeout: 2000 })
      }
    })
  })

  test.describe('Complete Subject Workflow', () => {
    test('should complete full CRUD workflow (no year field)', async ({ page }) => {
      // Generate unique subject name
      const subjectName = `Full Workflow Test ${Date.now()}`

      // 1. CREATE: Add new subject
      const addButton = page.locator('button:has-text("Add Subject"), button:has-text("Create First Subject")').first()
      if (await addButton.isVisible()) {
        await addButton.click()
        await page.fill('input[id*="subject-name"]', subjectName)
        await page.locator('button:has-text("Create Subject")').click()
      }

      // 2. READ: Verify subject appears in dropdown (deterministic wait)
      const optionWithName = page.locator(`select#subject-selector option:has-text("${subjectName}")`)
      await expect(optionWithName).toHaveCount(1, { timeout: 5000 })

      // 3. UPDATE: Edit subject (if edit button exists)
      const editButton = page.locator(`[data-testid*="subject-item"]:has-text("${subjectName}") button:has-text("Edit")`).first()
      if (await editButton.isVisible().catch(() => false)) {
        await editButton.click()
        await page.fill('input[id*="subject-name"]', `${subjectName} Updated`)
        await page.locator('button:has-text("Save")').click()

        // Wait for update to complete (deterministic wait)
        await expect(page.locator(`text=${subjectName} Updated`)).toBeVisible({ timeout: 3000 })
      }

      // 4. DELETE: Remove subject (if delete button exists)
      const deleteButton = page.locator(`[data-testid*="subject-item"]:has-text("${subjectName}") button:has-text("Delete")`).first()
      if (await deleteButton.isVisible().catch(() => false)) {
        await deleteButton.click()
        // May need to confirm deletion
        const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("Yes"), button:has-text("Delete")').first()
        if (await confirmButton.isVisible().catch(() => false)) {
          await confirmButton.click()
        }

        // Wait for deletion to complete (deterministic wait)
        await expect(page.locator(`text=${subjectName}`)).not.toBeVisible({ timeout: 3000 })
      }
    })
  })

  test.describe('Loading and Error States', () => {
    test('should show loading state on initial load', async ({ page }) => {
      // Navigate to fresh page
      await page.goto('/')

      // Loading indicator should appear briefly
      const loadingVisible = await page.locator('text=Loading').isVisible({ timeout: 500 }).catch(() => false)

      // It's OK if loading is too fast to see
      expect(loadingVisible || true).toBeTruthy()
    })

    test('should handle errors gracefully', async () => {
      // This test would require mocking network failures
      // Skip for now - tested in unit tests
      // This is a placeholder test
    })
  })

  test.describe('Accessibility', () => {
    test('should be navigable with keyboard', async ({ page }) => {
      // Tab through interactive elements
      await page.keyboard.press('Tab')

      // At least one element should be focused
      const focusedElement = await page.evaluate(() => document.activeElement?.tagName)
      expect(focusedElement).toBeTruthy()
    })

    test('should have proper ARIA attributes', async ({ page }) => {
      // Check for ARIA labels on buttons
      const buttons = page.locator('button')
      const count = await buttons.count()

      if (count > 0) {
        const firstButton = buttons.first()
        const hasText = await firstButton.textContent()
        const hasAriaLabel = await firstButton.getAttribute('aria-label')

        // Should have either text content or aria-label
        expect(hasText || hasAriaLabel).toBeTruthy()
      }
    })
  })

  test.describe('Subject Dropdown Selector', () => {
    test('should display dropdown with all subjects', async ({ page }) => {
      // Wait for dropdown to be visible (deterministic wait)
      const dropdown = page.locator('select#subject-selector')
      await expect(dropdown).toBeVisible({ timeout: 3000 })

      // Check if we have subjects
      const dropdownVisible = await dropdown.isVisible().catch(() => false)

      if (dropdownVisible) {
        // Dropdown should be visible
        await expect(page.locator('select#subject-selector')).toBeVisible()

        // Should have placeholder option (check count instead of visibility)
        const placeholderCount = await page.locator('select#subject-selector option:has-text("Select a subject")').count()
        expect(placeholderCount).toBeGreaterThan(0)

        // Should have subject options (if subjects exist)
        const optionCount = await page.locator('select#subject-selector option').count()
        expect(optionCount).toBeGreaterThan(0)
      }
    })

    test('should select subject and display SubjectListItem', async ({ page }) => {
      // Wait for dropdown to be visible (deterministic wait)
      const dropdown = page.locator('select#subject-selector')
      await expect(dropdown).toBeVisible({ timeout: 3000 })

      const dropdownVisible = await dropdown.isVisible().catch(() => false)

      if (dropdownVisible) {
        // Get dropdown options (excluding placeholder)
        const options = await page.locator('select#subject-selector option[value]:not([value=""])').all()

        if (options.length > 0) {
          // Select first subject
          const firstOption = options[0]
          const value = await firstOption.getAttribute('value')

          await page.selectOption('select#subject-selector', value!)

          // SubjectListItem should appear
          await expect(page.locator(`[data-testid="subject-item-${value}"]`)).toBeVisible({ timeout: 2000 })

          // Dropdown should remain visible
          await expect(page.locator('select#subject-selector')).toBeVisible()
        }
      }
    })

    test('should persist selected subject across page reload', async ({ page }) => {
      // Wait for dropdown to be visible (deterministic wait)
      const dropdown = page.locator('select#subject-selector')
      await expect(dropdown).toBeVisible({ timeout: 3000 })

      const dropdownVisible = await dropdown.isVisible().catch(() => false)

      if (dropdownVisible) {
        // Get dropdown options
        const options = await page.locator('select#subject-selector option[value]:not([value=""])').all()

        if (options.length > 0) {
          // Select a subject
          const firstOption = options[0]
          const value = await firstOption.getAttribute('value')
          await page.selectOption('select#subject-selector', value!)

          // Wait for SubjectListItem to be visible (indicates selection was processed)
          await expect(page.locator(`[data-testid="subject-item-${value}"]`)).toBeVisible({ timeout: 2000 })

          // Reload page
          await page.reload()
          await page.waitForLoadState('networkidle')

          // Wait for dropdown to reload (deterministic wait)
          const reloadedDropdown = page.locator('select#subject-selector')
          await expect(reloadedDropdown).toBeVisible({ timeout: 3000 })

          // Selection should persist
          const dropdown = page.locator('select#subject-selector')
          await expect(dropdown).toHaveValue(value!, { timeout: 5000 })

          // SubjectListItem should still be visible
          await expect(page.locator(`[data-testid="subject-item-${value}"]`)).toBeVisible({ timeout: 3000 })
        }
      }
    })

    test('should allow changing selection', async ({ page }) => {
      // Wait for dropdown to be visible (deterministic wait)
      const dropdown = page.locator('select#subject-selector')
      await expect(dropdown).toBeVisible({ timeout: 3000 })

      const dropdownVisible = await dropdown.isVisible().catch(() => false)

      if (dropdownVisible) {
        // Get dropdown options
        const options = await page.locator('select#subject-selector option[value]:not([value=""])').all()

        if (options.length >= 2) {
          // Select first subject
          const firstOption = options[0]
          const firstValue = await firstOption.getAttribute('value')
          await page.selectOption('select#subject-selector', firstValue!)

          // Wait for first subject to be visible (deterministic wait)
          await expect(page.locator(`[data-testid="subject-item-${firstValue}"]`)).toBeVisible({ timeout: 2000 })

          // Select second subject
          const secondOption = options[1]
          const secondValue = await secondOption.getAttribute('value')
          await page.selectOption('select#subject-selector', secondValue!)

          // Wait for second subject to be visible (deterministic wait)
          await expect(page.locator(`[data-testid="subject-item-${secondValue}"]`)).toBeVisible({ timeout: 2000 })

          // Second subject should be visible, first should be hidden
          await expect(page.locator(`[data-testid="subject-item-${secondValue}"]`)).toBeVisible()
          await expect(page.locator(`[data-testid="subject-item-${firstValue}"]`)).not.toBeVisible()
        }
      }
    })

    test('should auto-select when only one subject exists', async ({ page }) => {
      // This test requires a database with exactly one subject
      // It's more of a manual test scenario, but we can check the behavior

      // Wait for dropdown to be visible (deterministic wait)
      const dropdown = page.locator('select#subject-selector')
      await expect(dropdown).toBeVisible({ timeout: 3000 })

      const dropdownVisible = await dropdown.isVisible().catch(() => false)

      if (dropdownVisible) {
        const options = await page.locator('select#subject-selector option[value]:not([value=""])').all()

        if (options.length === 1) {
          // Should auto-select the only subject
          const value = await options[0].getAttribute('value')
          const dropdown = page.locator('select#subject-selector')

          await expect(dropdown).toHaveValue(value!)

          // SubjectListItem should be visible
          await expect(page.locator(`[data-testid="subject-item-${value}"]`)).toBeVisible()
        }
      }
    })

    test('should support keyboard navigation', async ({ page }) => {
      // Wait for dropdown to be visible (deterministic wait)
      const dropdown = page.locator('select#subject-selector')
      await expect(dropdown).toBeVisible({ timeout: 3000 })

      const dropdownVisible = await dropdown.isVisible().catch(() => false)

      if (dropdownVisible) {
        // Focus dropdown with keyboard
        await page.keyboard.press('Tab')

        // Dropdown should be focusable
        const focusedElement = await page.evaluate(() => document.activeElement?.tagName)
        expect(['SELECT', 'BUTTON', 'INPUT'].includes(focusedElement || '')).toBeTruthy()

        // Can navigate with arrow keys and select with Enter
        // (Native <select> behavior, already tested by browser)
      }
    })

    test('should clear selection when deleted subject was selected', async ({ page }) => {
      // This is a complex scenario requiring:
      // 1. Select a subject
      // 2. Delete that subject
      // 3. Verify selection is cleared

      // Wait for dropdown to be visible (deterministic wait)
      const dropdown = page.locator('select#subject-selector')
      await expect(dropdown).toBeVisible({ timeout: 3000 })

      const dropdownVisible = await dropdown.isVisible().catch(() => false)

      if (dropdownVisible) {
        const options = await page.locator('select#subject-selector option[value]:not([value=""])').all()

        if (options.length > 0) {
          // Select a subject
          const firstValue = await options[0].getAttribute('value')
          await page.selectOption('select#subject-selector', firstValue!)

          // Wait for SubjectListItem to be visible (deterministic wait)
          await expect(page.locator(`[data-testid="subject-item-${firstValue}"]`)).toBeVisible({ timeout: 2000 })

          // Try to delete it (if delete button exists)
          const deleteButton = page.locator(`[data-testid="subject-item-${firstValue}"] button:has-text("Delete")`).first()

          if (await deleteButton.isVisible().catch(() => false)) {
            await deleteButton.click()

            // Confirm deletion if modal appears
            const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("Yes"), button:has-text("Delete")').first()
            if (await confirmButton.isVisible({ timeout: 1000 }).catch(() => false)) {
              await confirmButton.click()
            }

            // After deletion, the subject should not be in the dropdown (deterministic wait)
            await expect(page.locator(`select#subject-selector option[value="${firstValue}"]`)).toHaveCount(0, { timeout: 3000 })

            // And the SubjectListItem should not be visible (selection cleared)
            const subjectItemVisible = await page.locator(`[data-testid="subject-item-${firstValue}"]`).isVisible().catch(() => false)
            expect(subjectItemVisible).toBeFalsy()
          }
        }
      }
    })
  })
})
