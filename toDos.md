# To Do Items

## 🎯 High Priority Features

### Final Comments Enhancements
- [ ] **Print view for all comments in a class**
    - Button to view all comments for class that you can print
    - Business value: Enables batch printing/review

---

## 📋 Medium Priority

### UI Improvements
- [ ] **Show comment count (e.g., "1 out of 100")**
    - Helps users track progress through student comments
    - Decision needed: How should comments be ordered?

### Bulk Operations
- [ ] **Bulk add students with their grades**
    - Business value: Faster data entry for large classes
    - Complexity: Needs CSV import or multi-row form design

---

## 🎨 Design & Branding

### Visual Design
- [ ] **Design favicon for browser tab**
    - Theme: Something that looks like a notepad
    - Format: .ico or .svg

- [ ] **Design top banner for the app**
    - Theme: Students, inspiring message
    - Ideas: "Inspiring the next generation" or "Guiding the leaders of tomorrow"

---

## 🔧 Technical Debt

### Code Quality
- [ ] **Remove console.error methods from services**
    - Replace with proper error handling/logging
    - Files: `src/services/api/*Service.ts`

- [ ] **Fix deprecated `act` function in tests**
    - "The act function seems to be deprecated but it's used in tests and code"
    - Investigate React Testing Library updates
    - May need to refactor test patterns

---

## 📚 Documentation & Resources

### Available Documentation
- ✅ **Design System Documentation**: `docs/design-system.md`
    - Design token usage guide
    - Component API reference (Input, Label, Button)
    - Step-by-step migration guide
    - Best practices and conventions
    - Real-world examples from FinalCommentsModal

### Completed Features
- ✅ Design token system (colors, spacing, typography, borders, shadows)
- ✅ Standardized Input component (with validation, errors, required indicator)
- ✅ Standardized Label component
- ✅ Enhanced Button component (primary, secondary, danger variants)
- ✅ FinalCommentsModal migrated to design tokens (32 inline styles eliminated)
- ✅ ClassManagementModal migrated to design tokens (23 modalStyles replaced)

---
Looks like the add personalized comments button should show a message when clicked with no comment
the error labels aren't standardized, the add subject is different from the rest I believe

When adding a new class, it should be selected by default after creation.

The final comments error text doesn't use the standardized error label component.

Login
* The header, should be modified to be the one we already have
* The "pages" should be refactored to be components
* Need to style the login form
* THe header with they dark/light styles should be used for the login as well

There are a lot of render issues when adding/updating an item
* Outcome Comments, you get a flash
* Also when switching between tabs
* Personalized Comments, you get a flash

## 🚀 Production Deployment (COMPLETE - LIVE ON GITHUB PAGES)

### Phase 1: Infrastructure Setup ✅
- ✅ **API Configuration Feature** - Centralized environment-aware API base URL configuration
  - Created `src/config/apiConfig.ts` following authConfig.ts pattern
  - Updated `src/services/apiClient.ts` to use configuration factory
  - PDD: `pdd-workspace/api-base-url-config/`

- ✅ **Deployment Infrastructure** - Complete CI/CD pipeline setup
  - Created `.github/workflows/deploy.yml` - GitHub Actions workflow for automated deployment
  - Created `DEPLOYMENT.md` - Comprehensive deployment guide
  - Configured `vite.config.ts` for environment-aware base path
  - PDD: `pdd-workspace/deployment-production/`

### Phase 2: SPA Routing & Static Assets ✅
- ✅ **GitHub Pages Asset Loading** - Fixed conditional base path for production/dev
  - `vite.config.ts`: Base path conditional on mode (production: `/commentator-frontend/`, dev: `/`)
  - All assets now load correctly with proper paths

- ✅ **SPA Routing** - Fixed 404s for non-root routes
  - Created `public/404.html` with redirect to index.html for SPA routing
  - Updated `index.html` with sessionStorage redirect handling
  - Fixed Auth0 callback URL 404 errors

### Phase 3: Authentication & Security ✅
- ✅ **Auth0 Configuration** - Production environment settings
  - Updated `.env.production` with correct redirect URI: `https://dgaudet.github.io/commentator-frontend/callback`
  - Registered callback URL in Auth0 Application settings
  - Added GitHub Pages domain to Auth0 Allowed Web Origins
  - Added CORS Origins for API communication

- ✅ **Environment Variables** - Secure production configuration
  - Created `docs/environment-variables.md` with complete guide
  - Updated `.github/workflows/deploy.yml` to inject environment variables
  - Backend API environment set to production for CORS whitelist

- ✅ **CORS Configuration** - Backend API properly configured
  - Backend API set to production environment
  - GitHub Pages domain whitelisted in production CORS settings
  - Successful API communication from frontend to backend

### Current Status
- **Deployment Location**: https://dgaudet.github.io/commentator-frontend/
- **Build Status**: ✅ TypeScript 0 errors, 1359 tests passing
- **Functionality**: ✅ Login, callback, API communication all working
- **Hosting**: ✅ GitHub Pages with GitHub Actions CI/CD
- **Environment Variables**: ✅ Injected via GitHub Actions with fallback defaults

### Optional: Custom Domain Setup (TASK-1.3, 1.4, 1.5)
When ready, configure a custom domain using Cloudflare:
- Create free Cloudflare account
- Add domain to Cloudflare
- Update Google Domains nameservers to Cloudflare (wait 24-48 hours)
- Configure Cloudflare DNS CNAME record pointing to dgaudet.github.io
- Set SSL/TLS to **Full (strict)** mode (NOT Flexible - security vulnerability)

**See `DEPLOYMENT.md` for detailed custom domain setup instructions.**

---

Older Notes:
* I never finished the custom domain with cloudflare
* Killing the locally running app
** lsof -i :5173, then kill the process

default github pages url - https://dgaudet.github.io/commentator-frontend/

possible Auth0 login/user create flow by using Auth0 configuration, instead of in app - https://developer.auth0.com/resources/labs/forms/user-onboarding-made-easy#create-a-flow-to-update-user-metadata
test out changing my password in auth0

Create a proper 404 page that gives information about not finding any result
It would be nice to have the header and proper colors on the login page as well

make sure pronouns are only loaded once, and the loading indicator displays