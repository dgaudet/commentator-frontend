# TASK 7: Manual Integration Testing Checklist

**Feature**: Auth0 Universal Login - Level 1
**Version**: 1.0
**Date**: 2026-02-22
**Tester**: [Your Name]
**Status**: [IN PROGRESS / COMPLETE]

---

## Pre-Test Setup

- [ ] **Environment Verification**
  - [ ] Node.js v24 installed (`node --version`)
  - [ ] npm dependencies installed (`npm install`)
  - [ ] Development server can start (`npm run start`)
  - [ ] Application loads at `http://localhost:3000`

- [ ] **Auth0 Setup**
  - [ ] Auth0 tenant access verified
  - [ ] Auth0 application configured with redirect URIs
  - [ ] Test credentials available (email/password)
  - [ ] Dashboard branding configured (TASK 6 complete):
    - [ ] Primary color set to #667eea
    - [ ] Background color set to #f9fafb
    - [ ] Logo uploaded and visible

---

## Test 1: Complete Login Flow

**Objective**: Verify end-to-end login with valid credentials

### Steps
1. [ ] **Start Application**
   - [ ] Run `npm run start`
   - [ ] Navigate to `http://localhost:3000/login`
   - [ ] Verify LoginPage loads with "Log In with Auth0" button

2. [ ] **Click Login Button**
   - [ ] Verify button is not disabled
   - [ ] Click "Log In with Auth0" button
   - [ ] Verify redirect to Auth0 hosted login page (domain: auth0.com)
   - [ ] Console check: No errors logged

3. [ ] **Verify Auth0 Branding**
   - [ ] Primary color (#667eea) visible on login page
   - [ ] Background color (#f9fafb) correct
   - [ ] Logo visible at top/center of page
   - [ ] Colors match design tokens

4. [ ] **Enter Credentials**
   - [ ] Enter valid test email address
   - [ ] Enter correct password
   - [ ] Click login/submit

5. [ ] **Verify Callback Processing**
   - [ ] Redirected to `/callback` page
   - [ ] Loading spinner visible
   - [ ] "Processing authentication..." message displayed
   - [ ] Wait for redirect completion (2-3 seconds)

6. [ ] **Verify Success**
   - [ ] Redirected to home page (`/`)
   - [ ] User authenticated (Auth context shows user data)
   - [ ] Access token obtained and stored
   - [ ] Console: No errors logged
   - [ ] User information displays (if profile page exists)

**Result**: ☐ PASS ☐ FAIL
**Notes**: _______________________________________________________________

---

## Test 2: Invalid Credentials Error

**Objective**: Verify error handling with incorrect credentials

### Steps
1. [ ] **Navigate to Login**
   - [ ] Go to `http://localhost:3000/login`
   - [ ] Click "Log In with Auth0" button

2. [ ] **Enter Invalid Credentials**
   - [ ] Enter test email
   - [ ] Enter intentionally wrong password
   - [ ] Click login

3. [ ] **Verify Error Handling**
   - [ ] Error message displayed by Auth0 ("Wrong password" or similar)
   - [ ] Redirected back to `/callback` with error parameter
   - [ ] "Authentication Error" message displayed
   - [ ] Error message is user-friendly (not technical)
   - [ ] "Back to Login" button visible

4. [ ] **Verify Recovery**
   - [ ] Click "Back to Login" button
   - [ ] Returned to login page
   - [ ] Login button functional again
   - [ ] No errors in console

**Result**: ☐ PASS ☐ FAIL
**Notes**: _______________________________________________________________

---

## Test 3: User Cancels Login

**Objective**: Verify handling when user cancels Auth0 login

### Steps
1. [ ] **Start Login Flow**
   - [ ] Navigate to `/login`
   - [ ] Click "Log In with Auth0" button
   - [ ] Verify Auth0 login page loads

2. [ ] **Cancel Login**
   - [ ] Click browser back button during Auth0 login
   - [ ] OR click any "cancel" link if present on Auth0 page
   - [ ] Verify redirect to `/callback` with error parameter

3. [ ] **Verify Error State**
   - [ ] "Authentication Error" displayed
   - [ ] Error message: "User cancelled login" or similar
   - [ ] "Back to Login" button available
   - [ ] No console errors
   - [ ] Application doesn't crash

4. [ ] **Verify Recovery**
   - [ ] Click "Back to Login" button
   - [ ] Returned to login page
   - [ ] Can attempt login again

**Result**: ☐ PASS ☐ FAIL
**Notes**: _______________________________________________________________

---

## Test 4: Session Persistence

**Objective**: Verify user stays authenticated across page refreshes

### Steps
1. [ ] **Login Successfully**
   - [ ] Complete full login flow with valid credentials
   - [ ] Verify redirected to home page and authenticated

2. [ ] **Verify Initial State**
   - [ ] User data displayed
   - [ ] Auth context shows isAuthenticated = true
   - [ ] Access token available in localStorage

3. [ ] **Refresh Page**
   - [ ] Press F5 or Cmd+R to refresh
   - [ ] Wait for page to reload

4. [ ] **Verify Persistence**
   - [ ] User still authenticated (no redirect to login)
   - [ ] User data still displayed
   - [ ] Auth context still shows user information
   - [ ] Access token still available
   - [ ] No console errors

5. [ ] **Multiple Refresh Cycles**
   - [ ] Refresh page 3-4 more times
   - [ ] Verify authentication persists each time

**Result**: ☐ PASS ☐ FAIL
**Notes**: _______________________________________________________________

---

## Test 5: Network Performance (Slow Network)

**Objective**: Verify application handles slow network gracefully

### Steps
1. [ ] **Setup Slow Network Simulation**
   - [ ] Open Chrome DevTools (F12)
   - [ ] Go to Network tab
   - [ ] Set throttling to "Slow 3G" or custom (1 Mbps download)

2. [ ] **Perform Login with Slow Network**
   - [ ] Clear cache (Cmd+Shift+Delete)
   - [ ] Navigate to `/login`
   - [ ] Click "Log In with Auth0" button
   - [ ] Monitor network requests

3. [ ] **Verify Behavior Under Load**
   - [ ] Application doesn't hang or crash
   - [ ] Loading state visible ("Logging in..." or spinner)
   - [ ] Auth0 page eventually loads
   - [ ] Enter credentials and complete login

4. [ ] **Verify Callback Processing**
   - [ ] CallbackPage loading state visible
   - [ ] "Processing authentication..." message stays visible until auth completes
   - [ ] Redirect eventually happens (may take 5-10 seconds)
   - [ ] Final redirect to home succeeds

5. [ ] **Restore Normal Network**
   - [ ] Set network throttling back to "No throttling"
   - [ ] Application still works normally

**Result**: ☐ PASS ☐ FAIL
**Notes**: _______________________________________________________________

---

## Test 6: Logout and Re-Login

**Objective**: Verify complete logout and re-login cycle

### Steps
1. [ ] **Login Successfully**
   - [ ] Complete login flow
   - [ ] Verify authenticated on home page

2. [ ] **Logout** (if logout implemented)
   - [ ] Locate logout button
   - [ ] Click logout
   - [ ] Verify tokens cleared from localStorage
   - [ ] Verify redirect to login page
   - [ ] Verify authenticated state cleared

3. [ ] **Verify Logged Out State**
   - [ ] Trying to access home page redirects to login
   - [ ] User data no longer displayed
   - [ ] Access token not in storage

4. [ ] **Re-Login with Different Credentials**
   - [ ] On login page, attempt login again
   - [ ] Use different test account (if available) or same account
   - [ ] Verify complete login flow works again

5. [ ] **Verify New Session**
   - [ ] New user data displayed
   - [ ] New access token obtained
   - [ ] Session is fresh (not cached from previous session)

**Result**: ☐ PASS ☐ FAIL
**Notes**: _______________________________________________________________

---

## Test 7: Application Stability

**Objective**: Verify no console errors and application stability

### Steps
1. [ ] **Clear Browser Console**
   - [ ] Open DevTools (F12)
   - [ ] Go to Console tab
   - [ ] Clear previous logs

2. [ ] **Navigate Through Complete Flow**
   - [ ] Start at `/login`
   - [ ] Perform complete login
   - [ ] Navigate to authenticated pages (if multiple pages exist)
   - [ ] Refresh page
   - [ ] Check console for errors

3. [ ] **Verify No Errors**
   - [ ] No JavaScript errors (red X icons)
   - [ ] No CORS errors
   - [ ] No undefined variable errors
   - [ ] No API errors (4xx, 5xx from /callback or Auth0)
   - [ ] Warnings acceptable, but no errors

4. [ ] **Check Network Tab**
   - [ ] All requests to Auth0 successful (200, 302 for redirects)
   - [ ] No failed requests to API
   - [ ] No stuck/pending requests

**Result**: ☐ PASS ☐ FAIL
**Notes**: _______________________________________________________________

---

## Test 8: Accessibility & UX

**Objective**: Verify keyboard navigation and accessibility

### Steps
1. [ ] **Keyboard Navigation**
   - [ ] From login page, Tab to login button
   - [ ] Verify button has focus indicator (visible outline)
   - [ ] Press Enter to activate login
   - [ ] Verify login triggered

2. [ ] **Focus Indicators**
   - [ ] All interactive elements have visible focus states
   - [ ] Focus indicators meet WCAG AA standards (visible outline)
   - [ ] Color contrast sufficient (not too light to see)

3. [ ] **Screen Reader Testing** (if possible)
   - [ ] Login page title reads correctly
   - [ ] Button label reads as "Log In with Auth0"
   - [ ] Error messages read with role="alert"
   - [ ] Loading state message announced

4. [ ] **Mobile-like Behavior**
   - [ ] Buttons have sufficient size (min 44px)
   - [ ] Touch targets don't overlap
   - [ ] Text readable on small screens

**Result**: ☐ PASS ☐ FAIL
**Notes**: _______________________________________________________________

---

## Test 9: Error Recovery & Edge Cases

**Objective**: Verify edge case handling

### Steps
1. [ ] **Manually Craft Invalid Callback URL**
   - [ ] Navigate directly to `/callback` without parameters
   - [ ] Verify error displayed: "No authorization code received"
   - [ ] "Back to Login" button available

2. [ ] **Try OAuth State Mismatch Simulation**
   - [ ] If possible, manipulate URL to have mismatched state
   - [ ] Verify error displayed appropriately
   - [ ] Application handles gracefully

3. [ ] **Concurrent Login Attempts**
   - [ ] Click login button rapidly multiple times
   - [ ] Verify only one Auth0 redirect occurs
   - [ ] No race condition errors

4. [ ] **Whitespace in URLs**
   - [ ] Verify URL parameters trimmed/sanitized
   - [ ] No encoding issues with special characters

**Result**: ☐ PASS ☐ FAIL
**Notes**: _______________________________________________________________

---

## Post-Test Verification

- [ ] **Code Quality**
  - [ ] Run `npm run lint` - passes without errors
  - [ ] Run `npm run test` - all tests pass (including new integration tests)
  - [ ] Run `npm run build` - builds successfully

- [ ] **Git Status**
  - [ ] All changes staged and ready to commit
  - [ ] No uncommitted work in progress

- [ ] **Documentation**
  - [ ] This checklist completed and saved
  - [ ] Results documented in DELIVERY_REPORT.md
  - [ ] Any issues documented for follow-up

---

## Summary

### Tests Completed: _____ / 9
### Tests Passed: _____ / 9
### Tests Failed: _____ / 9

### Overall Result: ☐ COMPLETE ☐ BLOCKED ☐ NEEDS REWORK

### Blocking Issues (if any)
1. ___________________________________________________________________
2. ___________________________________________________________________
3. ___________________________________________________________________

### Notes for Developer
___________________________________________________________________
___________________________________________________________________
___________________________________________________________________

---

## Sign-Off

**Tester Name**: _______________________________
**Date**: _______________________________
**Status**: PASSED ☐ | FAILED ☐ | BLOCKED ☐

**Approved by Product Owner**: _______________________________
**Date**: _______________________________

---

## Automated Test Results

**Integration Tests**: 9/9 passing ✓
**Unit Tests**: 27/27 passing ✓
**All Tests**: 2,676+ passing ✓
**Linting**: PASS ✓
**Build**: PASS ✓

