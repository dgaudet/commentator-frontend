# To Do Items

## 🎯 High Priority Features

### Final Comments Enhancements
- [ ] **Print view for all comments in a class**
    - Button to view all comments for class that you can print
    - Business value: Enables batch printing/review

### Data Management
- [ ] **Sort final comments by student name**
    - Current: Unsorted or sorted by creation date
    - Business value: Easier to find specific students

- [ ] **When adding a new class, select it by default**
    - Business value: Better UX, fewer clicks

---

## 📋 Medium Priority

### UI Improvements
- [ ] **Update class selection label to "Select a Class to work with"**
    - More descriptive label text

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
* Need to figure out how to get the JWT, and how to pass it to the backend
** looks like I should be able to import { useAuth } like in other places, and call the getAccessToken on it
** I should be able to ask claude to send the token on api rquests automatically
* Need to style the login form
* THe header with they dark/light styles should be used for the login as well

THere are a lot of render issues when adding/updating an item
* Outcome Comments, you get a flash
* Also when switching between tabs
* Personalized Comments, you get a flash

## 🚀 Production Deployment (IN PROGRESS)

### Completed
- ✅ **API Configuration Feature** - Centralized environment-aware API base URL configuration
  - Created `src/config/apiConfig.ts` following authConfig.ts pattern
  - Updated `src/services/apiClient.ts` to use configuration factory
  - All 4 user stories (TASK-1.1 through TASK-1.4) implemented
  - PDD: `pdd-workspace/api-base-url-config/`

- ✅ **Deployment Infrastructure** - Complete CI/CD pipeline setup
  - Created `.github/workflows/deploy.yml` - GitHub Actions workflow for automated deployment
  - Created `DEPLOYMENT.md` - Comprehensive 398-line deployment guide
  - Configured `vite.config.ts` for environment-aware base path:
    - Production (GitHub Pages): `/commentator-frontend/`
    - Development (npm start): `/`
  - All 6 user stories (TASK-1.1 through TASK-1.6) implemented
  - PDD: `pdd-workspace/deployment-production/`

### Next Steps (MANUAL)
1. **Commit and push vite.config.ts changes** (user must run manually - no git commands auto-executed)
   ```bash
   git add vite.config.ts
   git commit -m "fix: make vite base path conditional for dev/prod environments"
   git push origin main
   ```
   This triggers GitHub Actions to build and deploy with correct asset paths

2. **Enable GitHub Pages** (TASK-1.1)
   - Go to: https://github.com/dgaudet/commentator-frontend/settings
   - Click **Pages** in left sidebar
   - Select **GitHub Actions** as source
   - Save

3. **Cloudflare Setup** (TASK-1.3, 1.4, 1.5)
   - Create free Cloudflare account
   - Add domain to Cloudflare
   - Update Google Domains nameservers to Cloudflare (wait 24-48 hours)
   - Configure Cloudflare DNS CNAME record pointing to dgaudet.github.io
   - Set SSL/TLS to **Full (strict)** mode (NOT Flexible - security vulnerability)

### Current Build Status
- TypeScript: ✅ 0 errors
- Tests: ✅ 1359 passed
- Production build: ✅ Assets with correct `/commentator-frontend/` paths
- Development: ✅ Works with `/` base path

---

Older Notes:
* Are the secrets in the built deployment
* Should I use vercel to deploy the front end?
* Killing the locally running app
** lsof -i :5173, then kill the process

default github pages url - https://dgaudet.github.io/commentator-frontend/
aws url - http://commentator.prod.s3-website-us-west-2.amazonaws.com/