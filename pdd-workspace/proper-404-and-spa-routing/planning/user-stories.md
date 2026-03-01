# User Stories: GitHub Pages SPA Routing & 404 Page

## Story 1: Configure Vite Base Path for GitHub Pages
**Risk Tier**: Low
**Story Points**: 1-2

### User Story
WHEN the application is built for GitHub Pages deployment at `/commentator-frontend/`
THE SYSTEM SHALL correctly configure Vite's base path to enable proper asset loading

### Acceptance Criteria
- [ ] `vite.config.ts` has `base: "/commentator-frontend/"` configured
- [ ] Bundled assets (`js`, `css`, `images`) load correctly with the base path prepended
- [ ] Build output works in both local development and GitHub Pages deployment
- [ ] No console errors related to asset loading in GitHub Pages environment

### Test Plan
- [ ] Build app with `npm run build`
- [ ] Verify `.dist/index.html` references assets with correct base path
- [ ] Deploy to GitHub Pages and verify no 404s for assets in browser console

### TDD Approach
- No tests required (build configuration verification manual)

---

## Story 2: Configure React Router with Basename
**Risk Tier**: Low
**Story Points**: 1-2

### User Story
WHEN React Router is initialized in the application
THE SYSTEM SHALL use the correct basename matching GitHub Pages subdirectory so all routes work correctly

### Acceptance Criteria
- [ ] `<BrowserRouter>` or root Router component has `basename="/commentator-frontend/"` configured
- [ ] React Router internal navigation (Link, useNavigate) works with the basename
- [ ] All route paths are relative (e.g., `/signup`, not `/commentator-frontend/signup`)
- [ ] Router configuration works in both development (`/`) and production (`/commentator-frontend/`)

### Test Plan
- [ ] Test navigation between `/`, `/signup`, `/callback` routes
- [ ] Verify Link components generate correct href attributes
- [ ] Deploy and test client-side navigation on GitHub Pages

### TDD Approach
- No unit tests required (router configuration is integration-tested via E2E)

---

## Story 3: Create 404.html GitHub Pages Redirect
**Risk Tier**: Low
**Story Points**: 2-3

### User Story
WHEN a user accesses an undefined route (404) on GitHub Pages
THE SYSTEM SHALL redirect to index.html so React Router can handle the route

### Acceptance Criteria
- [ ] `/public/404.html` exists and contains proper GitHub Pages SPA redirect logic
- [ ] Redirect script preserves the requested URL path for React Router to handle
- [ ] Redirect works for all undefined routes (e.g., `/signup`, `/invalid`, `/undefined`)
- [ ] Does not interfere with legitimate 404 scenarios
- [ ] GitHub Pages serves 404.html on undefined routes (verified in browser Network tab)

### Implementation Notes
Standard GitHub Pages SPA redirect using:
```html
<script>
  var path = window.location.pathname;
  sessionStorage.redirect = path;
  window.location.href = '/commentator-frontend/';
</script>
```

And in `index.html`:
```html
<script>
  if (sessionStorage.redirect) {
    var redirect = sessionStorage.redirect;
    delete sessionStorage.redirect;
    window.history.replaceState(null, null, redirect);
  }
</script>
```

### Test Plan
- [ ] Visit GitHub Pages at `/commentator-frontend/signup` (non-existent route)
- [ ] Verify page loads and shows signup component
- [ ] Check Network tab shows 404.html response followed by index.html load
- [ ] Verify URL remains `/commentator-frontend/signup` after redirect

---

## Story 4: Create NotFound Page Component
**Risk Tier**: Trivial
**Story Points**: 1-2

### User Story
WHEN a user navigates to an undefined route in the application
THE SYSTEM SHALL display a branded 404 page component indicating the page was not found

### Acceptance Criteria
- [ ] `src/components/NotFound.tsx` or similar component exists
- [ ] Component displays user-friendly message (e.g., "Page not found")
- [ ] Component includes link to return to home page (/)
- [ ] Component uses design tokens for consistent styling with app theme
- [ ] Component is accessible (WCAG 2.1 AA)
- [ ] Matches application's visual design and branding
- [ ] Route is configured in React Router to show this component for undefined routes

### Component Details
- **File**: `src/components/common/NotFound.tsx` or `src/pages/NotFound.tsx`
- **Features**:
  - Descriptive heading ("Page Not Found")
  - Optional: Show the requested URL that wasn't found
  - Call-to-action button to return to home
  - Optional: Link to signup or login
  - Dark mode support via design tokens

### Test Plan
- [ ] Navigate to `/invalid-route` and see NotFound component
- [ ] Verify home link works
- [ ] Test in light and dark modes
- [ ] Run accessibility audit

---

## Story 5: Test All Routes in GitHub Pages Deployment
**Risk Tier**: Low
**Story Points**: 2-3

### User Story
WHEN the application is deployed to GitHub Pages
THE SYSTEM SHALL support all defined routes (main, signup, callback, login) accessible via direct URL

### Acceptance Criteria
- [ ] `/` loads main page/dashboard
- [ ] `/signup` loads signup page
- [ ] `/callback` loads callback handler (or appropriate component)
- [ ] `/login` loads login page
- [ ] Undefined routes show NotFound page
- [ ] Refresh on any route maintains correct view (no GitHub Pages 404)
- [ ] OAuth callback flow works end-to-end
- [ ] All routes work on both desktop and mobile

### Test Scenarios
| Route | Test | Expected Result |
|-------|------|-----------------|
| `/commentator-frontend/` | Direct URL | Main page loads |
| `/commentator-frontend/signup` | Direct URL | Signup page loads |
| `/commentator-frontend/callback` | Direct URL | Callback component loads |
| `/commentator-frontend/login` | Direct URL | Login page loads |
| `/commentator-frontend/invalid` | Direct URL | NotFound page loads |
| `/commentator-frontend/signup` | Refresh page | Signup page remains (no GitHub 404) |
| `/commentator-frontend/callback?code=xxx` | OAuth redirect | Callback executes correctly |

### Test Plan
- [ ] Deploy to GitHub Pages
- [ ] Test each route via direct URL in browser
- [ ] Refresh page on each route, verify no GitHub Pages 404
- [ ] Test OAuth callback flow end-to-end
- [ ] Test on mobile device
- [ ] Check browser console for errors

### TDD Approach
- Integration tests verify routing works (if using E2E tests like Cypress)
- Manual testing on GitHub Pages deployment

---

## Definition of Done (Feature Level)

✅ All user stories accepted
✅ All acceptance criteria met
✅ Routes tested on GitHub Pages deployment
✅ No console errors on deployed application
✅ OAuth callback tested end-to-end
✅ Code follows project code quality standards
✅ PR merged to main branch

