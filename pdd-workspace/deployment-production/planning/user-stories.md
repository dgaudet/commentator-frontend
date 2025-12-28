# User Stories - Production Deployment

**Feature**: Deploy Static Website to Production
**Total Stories**: 6
**Total Effort**: 2-3 hours
**Complexity**: L1 (MICRO)

---

## Story Breakdown

### TASK-1.1: Enable GitHub Pages (P0 - CRITICAL)
**Priority**: P0 (Must Do)
**Effort**: L0 (15 min)
**Type**: Infrastructure Setup

#### User Story
```
AS a DevOps Engineer
I WANT to enable GitHub Pages for the repository
SO THAT the built website can be hosted for free
```

#### Acceptance Criteria
```gherkin
GIVEN the repository is on GitHub
WHEN GitHub Pages is enabled in repository settings
THEN GitHub Pages is active on main branch
AND Pages builds from dist/ folder
AND default GitHub Pages URL is accessible
```

#### Tasks
- [ ] Navigate to repository Settings
- [ ] Enable Pages from Settings → Pages
- [ ] Set source to "GitHub Actions"
- [ ] Verify GitHub Pages URL is generated
- [ ] Test default GitHub Pages URL (username.github.io/commentator-frontend)

#### Verification
- [ ] Default GitHub Pages URL accessible
- [ ] Shows "Your site is published" message
- [ ] dist/ folder is correctly recognized

---

### TASK-1.2: Create GitHub Actions Workflow (P0 - CRITICAL)
**Priority**: P0 (Must Do)
**Effort**: L0 (30 min)
**Type**: CI/CD Setup

#### User Story
```
AS a developer
I WANT automated testing and deployment on git push
SO THAT production updates are fast and reliable
```

#### Acceptance Criteria
```gherkin
GIVEN a workflow file exists in .github/workflows/
WHEN code is pushed to main branch
THEN the workflow automatically:
  - Checks out code
  - Installs dependencies
  - Runs npm run test
  - Runs npm run build
  - Deploys to GitHub Pages
AND workflow completes within 5 minutes
AND all steps show as successful
```

#### Tasks
- [ ] Create `.github/workflows/deploy.yml`
- [ ] Configure Node.js setup (version 24)
- [ ] Add test step (npm run test)
- [ ] Add build step (npm run build)
- [ ] Add GitHub Pages deployment step
- [ ] Test workflow by pushing sample commit

#### Workflow Steps
```yaml
1. Checkout code (actions/checkout@v4)
2. Setup Node.js 24 (actions/setup-node@v4)
3. Install dependencies (npm ci)
4. Run tests (npm run test)
5. Build project (npm run build)
6. Upload artifact (actions/upload-pages-artifact)
7. Deploy to Pages (actions/deploy-pages@v3)
```

#### Verification
- [ ] Workflow file created and syntactically valid
- [ ] All steps execute successfully
- [ ] Deployed site matches local build
- [ ] Workflow runs on every push to main

#### Testing
- [ ] Manual test push to main
- [ ] Verify all steps execute
- [ ] Verify site updates on GitHub Pages URL

---

### TASK-1.3: Create Cloudflare Account (P0 - CRITICAL)
**Priority**: P0 (Must Do)
**Effort**: L0 (15 min)
**Type**: Infrastructure Setup

#### User Story
```
AS a site operator
I WANT to set up Cloudflare for CDN and DNS
SO THAT the site is fast globally and HTTPS works
```

#### Acceptance Criteria
```gherkin
GIVEN Cloudflare account doesn't exist
WHEN Cloudflare account is created
THEN account is active and ready
AND domain can be added to Cloudflare
AND Cloudflare nameservers are provided
```

#### Tasks
- [ ] Go to cloudflare.com
- [ ] Sign up for free account
- [ ] Verify email
- [ ] Add domain to Cloudflare
- [ ] Record Cloudflare nameservers provided
- [ ] Note the nameserver addresses for Google Domains

#### Verification
- [ ] Cloudflare account active
- [ ] Domain added to Cloudflare
- [ ] Nameservers obtained and documented

---

### TASK-1.4: Configure Google Domains Nameservers (P0 - CRITICAL)
**Priority**: P0 (Must Do)
**Effort**: L0 (15 min)
**Type**: DNS Configuration

#### User Story
```
AS a domain owner
I WANT to point my domain to Cloudflare
SO THAT DNS is managed by Cloudflare for my site
```

#### Acceptance Criteria
```gherkin
GIVEN domain is registered at Google Domains
WHEN nameservers are changed to Cloudflare's
THEN domain nameservers point to Cloudflare
AND Cloudflare can manage DNS records
AND changes are reflected within 24 hours
```

#### Tasks
- [ ] Log in to Google Domains account
- [ ] Find domain settings
- [ ] Locate "Custom nameservers" option
- [ ] Replace nameservers with Cloudflare ones:
  - iris.ns.cloudflare.com
  - jay.ns.cloudflare.com
- [ ] Save changes
- [ ] Wait for propagation (24-48 hours)

#### Verification
- [ ] Google Domains shows Cloudflare nameservers
- [ ] Cloudflare shows domain as active
- [ ] DNS propagation checker shows Cloudflare

---

### TASK-1.5: Configure Cloudflare DNS Records (P0 - CRITICAL)
**Priority**: P0 (Must Do)
**Effort**: L0 (20 min)
**Type**: DNS Configuration

#### User Story
```
AS a site operator
I WANT to configure DNS to point to GitHub Pages
SO THAT custom domain resolves to the website
```

#### Acceptance Criteria
```gherkin
GIVEN Cloudflare is managing domain DNS
WHEN DNS records are created for GitHub Pages
THEN custom domain resolves to GitHub Pages
AND HTTPS is automatically provisioned
AND site is accessible via custom domain
```

#### Tasks
- [ ] Log in to Cloudflare dashboard
- [ ] Go to DNS records
- [ ] Add CNAME record:
  - Name: @ (or domain root)
  - Content: username.github.io
  - Proxy status: Proxied (orange cloud)
- [ ] Add CNAME for www subdomain (optional):
  - Name: www
  - Content: username.github.io
- [ ] Enable "Always Use HTTPS" in SSL/TLS settings
- [ ] Wait for DNS propagation

#### Verification
- [ ] nslookup shows Cloudflare nameservers
- [ ] CNAME record points to GitHub Pages
- [ ] Custom domain resolves in browser
- [ ] HTTPS works (green lock icon)

#### DNS Configuration Details
```
Type: CNAME
Name: @ (or example.com)
Content: {username}.github.io
TTL: Auto
Proxy: Proxied (Cloudflare)
```

---

### TASK-1.6: Document Deployment Process (P1 - HIGH VALUE)
**Priority**: P1 (High Value)
**Effort**: L0 (20 min)
**Type**: Documentation

#### User Story
```
AS a team member
I WANT clear documentation on the deployment process
SO THAT anyone can understand how to deploy and troubleshoot
```

#### Acceptance Criteria
```gherkin
GIVEN deployment is set up
WHEN deployment documentation exists
THEN documentation includes:
  - How to deploy (git push)
  - How to check deployment status
  - How to troubleshoot failures
  - DNS and Cloudflare settings
  - Emergency contacts and procedures
```

#### Tasks
- [ ] Create `DEPLOYMENT.md` in project root
- [ ] Document deployment workflow
- [ ] Include troubleshooting guide
- [ ] Document DNS configuration
- [ ] Include Cloudflare dashboard links
- [ ] List required credentials/accounts
- [ ] Create rollback procedures

#### Documentation Should Cover
- Deployment workflow (git push → automated deploy)
- How to check deployment status in GitHub Actions
- Common issues and fixes:
  - DNS not resolving
  - HTTPS not working
  - Site not updating
  - Test failures preventing deploy
- How to manually trigger redeploy
- How to verify site is live
- Contact information for issues
- Links to all relevant dashboards

#### Verification
- [ ] DEPLOYMENT.md file created
- [ ] All sections complete
- [ ] Instructions are clear and actionable
- [ ] Links to GitHub Actions, Cloudflare, Google Domains

---

## Story Ordering & Dependencies

### Recommended Implementation Order
1. **TASK-1.1** (Enable GitHub Pages) - No dependencies
2. **TASK-1.2** (Create GitHub Actions) - Depends on TASK-1.1
3. **TASK-1.3** (Create Cloudflare) - No dependencies
4. **TASK-1.4** (Configure Google Domains) - Depends on TASK-1.3
5. **TASK-1.5** (Configure Cloudflare DNS) - Depends on TASK-1.4
6. **TASK-1.6** (Documentation) - Depends on all above

### Parallel Work Possible
- **TASK-1.1 & TASK-1.2** can be done simultaneously
- **TASK-1.3 & TASK-1.4 & TASK-1.5** are sequential (must wait for DNS propagation)

---

## Priority Legend

| Priority | Scope | Impact | Must Do? |
|----------|-------|--------|----------|
| **P0** | 15-30 min each | Critical path | YES - Blocks nothing but required |
| **P1** | 20 min | High value | YES - Documentation essential |

---

## Verification Checklist

- [ ] All 6 stories implemented
- [ ] All stories pass acceptance criteria
- [ ] GitHub Pages enabled and working
- [ ] GitHub Actions workflow successful
- [ ] Cloudflare account created and domain added
- [ ] Google Domains nameservers updated
- [ ] Cloudflare DNS records configured
- [ ] Custom domain accessible via HTTPS
- [ ] Automatic deployments working
- [ ] Documentation completed
- [ ] Site accessible to public via custom domain

---

## Definition of Done

A story is complete when:
1. ✅ All acceptance criteria met
2. ✅ Configuration tested and verified
3. ✅ No blocking issues
4. ✅ Documented (if applicable)
5. ✅ Team has access to manage configuration
6. ✅ Runbooks/docs created for future maintenance

---

## Time Budget

| Task | Estimated | Actual |
|------|-----------|--------|
| TASK-1.1 | 15 min | - |
| TASK-1.2 | 30 min | - |
| TASK-1.3 | 15 min | - |
| TASK-1.4 | 15 min | - |
| TASK-1.5 | 20 min | - |
| TASK-1.6 | 20 min | - |
| **Total** | **2.5 hrs** | - |

---

## Reference Links

### Services
- GitHub Pages: https://pages.github.com/
- Cloudflare: https://www.cloudflare.com/
- Google Domains: https://domains.google/
- GitHub Actions: https://github.com/features/actions

### Documentation
- GitHub Pages setup: https://docs.github.com/en/pages
- Cloudflare DNS: https://developers.cloudflare.com/dns/
- GitHub Actions workflow: https://docs.github.com/en/actions
- Vite build: https://vitejs.dev/guide/build.html
