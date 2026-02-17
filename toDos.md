# To Do Items

## 🎯 High Priority Features

Something is broken with the logout on the github pages app
* you are sent to https://dev-xz2pg3bky1ezk33h.us.auth0.com/v2/logout?client_id=1JFCOTaGY4nTaEQXqQAtrG7Ocma5Y1fQ&returnTo=https%3A%2F%2Fdgaudet.github.io%2Flogin&auth0Client=eyJuYW1lIjoiYXV0aDAtc3BhLWpzIiwidmVyc2lvbiI6IjIuOS4xIn0%3D
  ** you get a 400 and are basically on this same url
* Locally sent to https://dev-xz2pg3bky1ezk33h.us.auth0.com/v2/logout?client_id=1JFCOTaGY4nTaEQXqQAtrG7Ocma5Y1fQ&returnTo=http%3A%2F%2Flocalhost%3A5173%2Flogin&auth0Client=eyJuYW1lIjoiYXV0aDAtc3BhLWpzIiwidmVyc2lvbiI6IjIuOS4xIn0%3D
* I feel like the github pages not working with SPA's is likely the problem
  ** That call gets a 302 (found) and then the login page is loaded

## 📋 Medium Priority

### UI Improvements
- [ ] **Show comment count (e.g., "1 out of 100")**
    - Helps users track progress through student comments
    - Decision needed: How should comments be ordered?

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

the error labels aren't standardized, the add subject is different from the rest I believe

Login
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

Older Notes:
* I never finished the custom domain with cloudflare
* Killing the locally running app
** lsof -i :5173, then kill the process

default github pages url - https://dgaudet.github.io/commentator-frontend/

Create a proper 404 page that gives information about not finding any result
It would be nice to have the header and proper colors on the login page as well

make sure pronouns are only loaded once, and the loading indicator displays
move the button up and the result message beside the button instead of below

the subjectList should push the pronouns to the personalizedComment component as well so it doesn't need to be loaded again
* then we can move extra loading logic fom the useReplacePronounsButton.ts
Editing multiple comments after replacing pronouns has some odd behavior

React Query / TanStack Query (Industry Standard) - Best overall:
- Handles request deduplication automatically
- Prevents double requests in Strict Mode
- Handles caching, loading states, errors
- Most React teams use this now
To remove duplicated loading requests in components

Modify the PeronalizedComments, and final comments to take in the pronouns like the Outcome comments 

When there is a name that has already been added the style is wrong, the background is white

When saving a student with the same name as before, it doesn't tell you it's failing due to duplicate name
* Also the flow when there is a failure, isn't good, you lose the student you were working with, perhaps it should be at the bottom of the form

when clicking populate with comments, maybe it should also check grammer
perhaps we could have the user upload comments from last year and use that to determine what are the outcome comments and the personalized ones

The errors on the final comment modal for add/edit, should probably be modals like the other comment modals, that would make the errors a bit cleaner and easier, you won't have to worry about the error message still showing on edit or add

Online Background Removal Tools (Easiest)
- https://www.remove.bg/ - AI-powered background removal, great for people

Need to test out the create user on github, do the images work?

Use the metada to dispaly the user's first/last name instead of the email 2 times.

if we use this Auth0 lock Widget, then I assume I need to test more cases
test forgot password

The styling of the login is pretty different from the rest of the app, is it possible to change that
The build has a warning now as well

authConfig = {
domain: 'dev-xz2pg3bky1ezk33h.us.auth0.com',
clientId: '1JFCOTaGY4nTaEQXqQAtrG7Ocma5Y1fQ',
redirectUri: 'http://localhost:5173/callback',
audience: 'https://dev-xz2pg3bky1ezk33h.us.auth0.com/api/v2/',
}


I think I was looking into a few things, and continuing the app gateway stuff
today, lots of meetings
A tonne of exports
Tell brendan about Sammi's env-one pr being merged