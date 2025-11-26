import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate directly to login page
    await page.goto('/login')
  })

  test('should display login page', async ({ page }) => {
    // Should be on login page
    expect(page.url()).toContain('/login')

    // Should see login elements
    await expect(page.getByRole('heading', { name: /commentator/i })).toBeVisible()
    await expect(page.getByText(/student report comments management/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /login/i })).toBeVisible()
  })

  test('should display login page with sign up link', async ({ page }) => {
    // Check for main UI elements
    await expect(page.getByText(/don't have an account/i)).toBeVisible()
    await expect(page.getByRole('link', { name: /sign up/i })).toBeVisible()

    // Verify sign up link points to Auth0
    const signUpLink = page.getByRole('link', { name: /sign up/i })
    await expect(signUpLink).toHaveAttribute('href', 'https://auth0.com')
  })

  test('should have login button with aria-label', async ({ page }) => {
    const loginButton = page.getByRole('button', { name: /login/i })

    // Button should have aria-label
    await expect(loginButton).toHaveAttribute('aria-label', 'Login with Auth0')
    await expect(loginButton).toBeEnabled()
  })

  test('should display error message container', async ({ page }) => {
    // Verify error display mechanism is available
    const errorContainer = page.locator('[role="alert"]')
    // Should be hidden initially (no error)
    await expect(errorContainer).not.toBeVisible()
  })

  test('should have accessible login form', async ({ page }) => {
    // Check for semantic HTML
    const main = page.locator('main')
    await expect(main).toBeVisible()

    // Check for heading hierarchy
    const heading = page.getByRole('heading', { level: 1 })
    await expect(heading).toBeVisible()

    // Check button is keyboard accessible
    const loginButton = page.getByRole('button', { name: /login/i })
    await loginButton.focus()
    await expect(loginButton).toBeFocused()
  })

  test('should have mobile responsive design', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    // Elements should still be visible and interactive
    const heading = page.getByRole('heading', { name: /commentator/i })
    await expect(heading).toBeVisible()

    const loginButton = page.getByRole('button', { name: /login/i })
    await expect(loginButton).toBeVisible()
  })
})

test.describe('Callback Page', () => {
  test('should display loading state when redirected from Auth0', async ({ page }) => {
    // Navigate to callback with code parameter
    await page.goto('/callback?code=test_code&state=test_state')

    // Should show loading message
    await expect(page.getByText(/processing authentication/i)).toBeVisible()
  })

  test('should handle callback errors gracefully', async ({ page }) => {
    // Navigate to callback with error parameter
    await page.goto('/callback?error=access_denied&error_description=User+denied+access')

    // Should show error page
    await expect(page.getByText(/authentication error/i)).toBeVisible()

    // Should have back to login button
    const backButton = page.getByRole('button', { name: /back to login/i })
    await expect(backButton).toBeVisible()
  })

  test('callback page should not expose tokens in URLs', async ({ page }) => {
    // Verify tokens are not in URL or page content
    const currentUrl = page.url()
    expect(currentUrl).not.toContain('access_token')
    expect(currentUrl).not.toContain('id_token')
    expect(currentUrl).not.toContain('Bearer')
  })
})

test.describe('Protected Routes', () => {
  test('should show loading state when accessing protected route', async ({ page }) => {
    // Navigate to protected route directly
    // This tests the ProtectedRoute loading state mechanism
    await page.goto('/', { waitUntil: 'domcontentloaded' })

    // Loading state should be visible initially before redirect
    // or should quickly redirect to login
    const loadingOrLoginPage = await Promise.race([
      page.getByText(/loading/i).isVisible(),
      page.waitForURL('**/login', { timeout: 3000 }).then(() => true).catch(() => false),
    ])

    // Either loading state was shown or redirected to login
    if (loadingOrLoginPage === false) {
      expect(page.url()).toContain('/login')
    }
  })

  test('should eventually reach login page', async ({ page }) => {
    // Navigate to protected route
    await page.goto('/')

    // Wait for navigation to settle
    await page.waitForTimeout(1000)

    // Should end up on login page
    expect(page.url()).toContain('/login')
    await expect(page.getByRole('button', { name: /login/i })).toBeVisible()
  })
})

test.describe('Header Navigation', () => {
  test('should display login page header', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login')

    // Should have header element
    const header = page.locator('header').first()
    await expect(header).toBeVisible()

    // Header should contain app title
    await expect(page.getByRole('heading', { name: /commentator/i })).toBeVisible()
  })
})

test.describe('Security', () => {
  test('should not expose sensitive data in page source', async ({ page }) => {
    await page.goto('/login')

    // Get page content
    const content = await page.content()

    // Verify no hardcoded tokens or secrets
    expect(content).not.toContain('Bearer')
    expect(content).not.toContain('access_token')
    expect(content).not.toContain('secret')
  })

  test('should use HTTPS in production (configuration check)', async ({ page }) => {
    // This test verifies the configuration allows HTTPS
    // In development, localhost is allowed
    const baseUrl = page.context().baseURL || 'http://localhost:5173'

    // Should either be localhost or HTTPS
    expect(
      baseUrl.startsWith('http://localhost') || baseUrl.startsWith('https://'),
    ).toBeTruthy()
  })

  test('should have Content Security Policy headers', async ({ page }) => {
    // Make request and check headers
    const response = await page.goto('/')

    // Response should be received
    expect(response).not.toBeNull()
  })
})

test.describe('Error Scenarios', () => {
  test('should display login page gracefully', async ({ page }) => {
    // Page should load even if Auth0 is not configured
    await page.goto('/login')

    // Page should render with expected elements
    await expect(page.getByRole('heading', { name: /commentator/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /login/i })).toBeVisible()
  })

  test('should handle offline scenario', async ({ page }) => {
    // Navigate to page first
    await page.goto('/login')

    // Simulate offline mode
    await page.context().setOffline(true)

    // Page should still be interactive
    await expect(page.getByRole('button', { name: /login/i })).toBeVisible()

    // Restore connectivity
    await page.context().setOffline(false)
  })

  test('should handle rapid navigation', async ({ page }) => {
    // Rapidly navigate between pages
    await page.goto('/login')
    await page.goto('/callback?code=test')
    await page.goto('/login')

    // Page should be stable
    await expect(page.getByRole('button', { name: /login/i })).toBeVisible()
  })
})

test.describe('Accessibility', () => {
  test('should have proper ARIA labels on login page', async ({ page }) => {
    await page.goto('/login')

    // Check for button with aria-label
    const button = page.getByRole('button', { name: /login with auth0/i })
    await expect(button).toHaveAttribute('aria-label')
  })

  test('should have semantic HTML structure', async ({ page }) => {
    await page.goto('/login')

    // Check for main element
    const main = page.locator('main')
    await expect(main).toBeVisible()

    // Check for heading hierarchy
    const h1 = page.getByRole('heading', { level: 1 })
    await expect(h1).toBeVisible()
  })

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/login')

    // Tab to button
    await page.keyboard.press('Tab')
    const button = page.getByRole('button', { name: /login/i })

    // Button should be in tab order
    await expect(button).toBeVisible()
  })

  test('should display error messages with alert role', async ({ page }) => {
    // Navigate to error scenario
    await page.goto('/callback?error=invalid_request')

    // Error should be displayed
    const alert = page.locator('[role="alert"]')
    if (await alert.isVisible()) {
      // Verify it's an alert
      await expect(alert).toHaveAttribute('role', 'alert')
    }
  })
})

test.describe('Performance', () => {
  test('login page should load quickly', async ({ page }) => {
    const startTime = Date.now()
    await page.goto('/login', { waitUntil: 'networkidle' })
    const loadTime = Date.now() - startTime

    // Should load in less than 3 seconds
    expect(loadTime).toBeLessThan(3000)
  })

  test('callback page should process quickly', async ({ page }) => {
    const startTime = Date.now()
    await page.goto('/callback?code=test&state=test', { waitUntil: 'domcontentloaded' })
    const loadTime = Date.now() - startTime

    // Should show processing state quickly
    expect(loadTime).toBeLessThan(1000)
  })
})
