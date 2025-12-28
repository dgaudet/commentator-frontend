# Production Deployment Guide

This document describes how the Commentator frontend is deployed to production using GitHub Pages, Cloudflare, and GitHub Actions.

---

## 🚀 Quick Start

### How to Deploy
1. **Commit your changes** locally
2. **Push to main branch**: `git push origin main`
3. **GitHub Actions automatically**:
   - Runs tests (`npm run test`)
   - Builds project (`npm run build`)
   - Deploys `dist/` to GitHub Pages
4. **Site is live in 2-5 minutes**

### View Deployment Status
- Go to: https://github.com/dgaudet/commentator-frontend/actions
- See all workflow runs and their status
- Click on a run to see detailed logs

---

## 🏗️ Infrastructure Overview

### Components
| Component | Service | Purpose |
|-----------|---------|---------|
| **Hosting** | GitHub Pages | Serves static files from `dist/` folder |
| **CI/CD** | GitHub Actions | Automates build, test, and deploy |
| **CDN** | Cloudflare | Global content delivery + HTTPS |
| **Domain** | Google Domains | Custom domain (managed in Cloudflare) |

### Data Flow
```
Code Push to GitHub
    ↓
GitHub Actions Workflow Triggered
    ├─ Checkout Code
    ├─ Install Dependencies (npm ci)
    ├─ Run Tests (npm run test)
    ├─ Build Project (npm run build)
    └─ Upload dist/ Artifact
         ↓
GitHub Pages Deployment
    ↓
Cloudflare CDN (Cached)
    ↓
Custom Domain (HTTPS)
    ↓
Live Website
```

---

## 📋 Workflow Details

### GitHub Actions Workflow (`.github/workflows/deploy.yml`)

**Trigger**: Every push to `main` branch (or manual trigger)

**Steps**:
1. **Checkout** - Downloads code from repository
2. **Setup Node.js** - Installs Node.js v24
3. **Install Dependencies** - Runs `npm ci`
4. **Run Tests** - Executes `npm run test`
5. **Build** - Runs `npm run build` (creates `dist/` folder)
6. **Upload Artifact** - Uploads `dist/` to GitHub Pages
7. **Deploy** - GitHub Pages makes site live

**Time**: ~3-5 minutes total

### Failure Scenarios
- ❌ Tests fail → Workflow stops, site NOT deployed
- ❌ Build fails → Workflow stops, site NOT deployed
- ✅ All pass → Site deployed successfully

---

## 🔧 Configuration

### Environment Variables
Located in: `.env` and `.env.production`

```bash
# Development (.env)
VITE_API_BASE_URL=http://localhost:3001
VITE_AUTH0_DOMAIN=...
VITE_AUTH0_CLIENT_ID=...

# Production (.env.production)
VITE_API_BASE_URL=https://api.example.com
VITE_AUTH0_DOMAIN=...
VITE_AUTH0_CLIENT_ID=...
```

**Important**: When you build for production, Vite automatically uses `.env.production`

### Cloudflare DNS Configuration

**CNAME Record**:
```
Name: @ (root domain)
Content: dgaudet.github.io
Proxy: Proxied (orange cloud)
TTL: Auto
```

This points your custom domain to GitHub Pages.

**SSL/TLS Settings**:
- Encryption Mode: **Full (strict)** ⚠️ CRITICAL - Protects end-to-end encryption
- Always use HTTPS: ✅ Enabled
- Minimum TLS version: 1.2

---

## 🐛 Troubleshooting

### Issue: Workflow Fails - Tests Not Passing
**Symptoms**: Red X on GitHub Actions workflow

**Solution**:
1. Check the test failure: `npm run test` locally
2. Fix the failing test
3. Push to main → Workflow will retry automatically

**Logs**: Go to Actions tab → Click failed run → See error messages

### Issue: Workflow Succeeds But Site Not Updated
**Symptoms**: Site looks old, doesn't reflect latest code

**Possible causes**:
1. **Cloudflare Cache**: Clear cache in Cloudflare dashboard
   - Go to Caching → Purge Cache → Purge Everything
2. **Browser Cache**: Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
3. **DNS not propagated**: Wait 24-48 hours if DNS was recently changed

**Verification**:
```bash
# Check if GitHub Pages has the latest version
curl -I https://dgaudet.github.io/commentator-frontend/
# Should see recent Last-Modified header
```

### Issue: Site Shows 404
**Symptoms**: "File not found" when accessing custom domain

**Causes**:
1. GitHub Pages not enabled (see Setup section below)
2. DNS not pointing to GitHub Pages
3. Repository is private (GitHub Pages requires public repo for free tier)

**Check DNS**:
```bash
nslookup yourdomain.com
# Should show Cloudflare nameservers (iris.ns.cloudflare.com, jay.ns.cloudflare.com)

# Check CNAME record
nslookup www.yourdomain.com
# Should point to dgaudet.github.io
```

### Issue: HTTPS Not Working (Security Warning)
**Symptoms**: Browser shows "Not Secure" warning

**Solution**:
1. Make sure Cloudflare "Proxy" is enabled (orange cloud, not gray)
2. Wait for SSL certificate to be issued (~5 minutes)
3. In Cloudflare: SSL/TLS → Overview → Set to **"Full (strict)"** mode
   - ⚠️ Never use "Flexible" - it breaks encryption between Cloudflare and GitHub
   - "Full (strict)" provides end-to-end security

---

## ⚙️ Initial Setup (One Time Only)

### 1. Enable GitHub Pages
1. Go to: https://github.com/dgaudet/commentator-frontend/settings
2. Click **Pages** in left sidebar
3. Under "Build and deployment":
   - Source: Select **"GitHub Actions"**
4. Click Save
5. Verify: You'll see "Your site is published at https://dgaudet.github.io/commentator-frontend"

### 2. Set Up Cloudflare Account
1. Go to: https://www.cloudflare.com
2. Sign up for free account
3. Add your domain:
   - Enter domain name
   - Select free plan
   - Add domain to Cloudflare
4. **Note the nameservers provided** (you'll need these in step 3)

### 3. Update Google Domains Nameservers
1. Go to: https://domains.google.com
2. Select your domain
3. Click **DNS** in left sidebar
4. Scroll to "Custom nameservers"
5. Replace default nameservers with Cloudflare's:
   - `iris.ns.cloudflare.com`
   - `jay.ns.cloudflare.com`
6. Click Save
7. **Wait 24-48 hours for propagation** (Cloudflare shows progress)

### 4. Configure Cloudflare DNS
1. Go to Cloudflare dashboard → Your Domain
2. Click **DNS** tab
3. Add CNAME record:
   - **Type**: CNAME
   - **Name**: @ (or your domain)
   - **Content**: `dgaudet.github.io`
   - **Proxy**: Proxied (orange cloud)
   - **TTL**: Auto
4. Click Save

### 5. Enable HTTPS
1. In Cloudflare: **SSL/TLS** tab
2. Overview: Set encryption mode to **"Full (strict)"**
   - ⚠️ **IMPORTANT**: Do NOT use "Flexible" mode
   - "Flexible" connects to GitHub Pages over unencrypted HTTP, allowing attackers to inject malicious code
   - "Full (strict)" ensures end-to-end encryption and protects asset integrity
3. Under "Always use HTTPS": Toggle ON
4. Done! Certificate is auto-managed by Cloudflare

### 6. Test Deployment
1. Make a small change locally
2. Push to main: `git push origin main`
3. Check Actions tab: Should see workflow running
4. Wait for it to complete (green checkmark = success)
5. Visit your domain: Should see updated site

---

## 📊 Monitoring Deployments

### GitHub Actions Dashboard
- **URL**: https://github.com/dgaudet/commentator-frontend/actions
- Shows all deployments and their status
- Click on a run to see detailed logs

### View Logs
1. Go to Actions tab
2. Click on the workflow run you want to check
3. Click on "build" or "deploy" job
4. See step-by-step output and any errors

### Common Log Messages
- ✅ "✓ built in Xms" - Build successful
- ✅ "Test Suites: X passed" - Tests passed
- ❌ "FAIL" - Test or build failure (check log for details)

---

## 🔄 Deployment Workflow Examples

### Normal Deployment (Happy Path)
```
1. Make changes to code
2. Run: git add .
3. Run: git commit -m "feat: add new feature"
4. Run: git push origin main
5. GitHub Actions automatically:
   - Pulls code
   - Installs dependencies
   - Runs tests
   - Builds project
   - Deploys to GitHub Pages
6. Site is live (check Actions tab for status)
```

### Fix a Failing Test
```
1. See test failure in Actions tab
2. Run: npm run test (locally to see failure)
3. Fix the test in your code
4. Run: git add . && git commit -m "fix: fix failing test"
5. Run: git push origin main
6. GitHub Actions automatically retries
7. If all tests pass, site deploys
```

### Emergency Rollback
```
1. Previous commit was good
2. Latest commit broke something
3. Option A: Revert the bad commit
   - git revert HEAD
   - git push origin main
4. Option B: Fix it and push again
   - Make the fix
   - git add . && git commit -m "fix: fix issue"
   - git push origin main
5. GitHub Actions automatically redeploys
```

---

## 📈 Performance Monitoring

### Check Site Load Time
```bash
# From terminal
curl -w "@curl-format.txt" -o /dev/null -s https://yourdomain.com

# Or use online tools:
# - https://pagespeed.web.dev/
# - https://www.webpagetest.org/
```

### Cloudflare Analytics
1. Go to Cloudflare dashboard
2. Click **Analytics & Logs**
3. View:
   - Page views
   - Requests blocked
   - Cache hit ratio
   - Top pages

### GitHub Pages Status
- https://www.githubstatus.com/ - Official GitHub status page

---

## 🔐 Security Considerations

### HTTPS & End-to-End Encryption (CRITICAL)
- **Encryption Mode**: Always use **"Full (strict)"** in Cloudflare
  - Protects the connection from Cloudflare edge to GitHub Pages origin
  - "Flexible" mode is **INSECURE** - allows man-in-the-middle attacks that can inject malicious code
  - "Full (strict)" ensures TLS verification end-to-end
- **Why it matters**:
  - An attacker between Cloudflare and GitHub could inject malicious JavaScript
  - This would affect all users visiting your site
  - "Full (strict)" prevents this by requiring encryption and certificate verification
- **Certificate Management**:
  - Cloudflare provides free SSL certificate for your domain
  - GitHub Pages has its own HTTPS certificate
  - Both are verified in "Full (strict)" mode
  - Certificates auto-renew (no action needed)

### Secrets Management
- **Never commit secrets** to repository
- Use `.env.local` for local development (add to `.gitignore`)
- Production secrets are in `.env.production`
- GitHub doesn't expose environment variables in logs

### Access Control
- Only push to `main` if you have push access
- Consider branch protection rules (require PR reviews)
- Use GitHub's token for CI/CD (automatically handled)

---

## 📚 Useful Links

### Services
- **GitHub Pages**: https://pages.github.com/
- **Cloudflare**: https://www.cloudflare.com/
- **Google Domains**: https://domains.google.com/
- **GitHub Actions**: https://github.com/features/actions

### Repository Links
- **Repository**: https://github.com/dgaudet/commentator-frontend
- **Actions**: https://github.com/dgaudet/commentator-frontend/actions
- **Settings**: https://github.com/dgaudet/commentator-frontend/settings

### Documentation
- GitHub Pages Docs: https://docs.github.com/en/pages
- Cloudflare DNS: https://developers.cloudflare.com/dns/
- GitHub Actions: https://docs.github.com/en/actions
- Vite Production Build: https://vitejs.dev/guide/build.html

---

## ❓ FAQ

**Q: How long does deployment take?**
A: Usually 2-5 minutes from push to live site

**Q: What if I push by mistake?**
A: You can revert the commit and push again. Deployment is automatic.

**Q: Can I deploy without running tests?**
A: No, tests always run first. If tests fail, deployment is blocked.

**Q: How do I preview changes before deploying?**
A: Run `npm run build` and `npm run start` locally to test first

**Q: What if build fails?**
A: Check GitHub Actions logs to see the error. Fix locally and push again.

**Q: Is there a cost?**
A: No, this setup is completely free (GitHub Pages, GitHub Actions, Cloudflare free tier)

---

## 📞 Support

### Resources
- **GitHub Docs**: https://docs.github.com/
- **Cloudflare Community**: https://community.cloudflare.com/
- **Stack Overflow**: Tag questions with `github-pages` and `cloudflare`

### Check Status
- GitHub: https://www.githubstatus.com/
- Cloudflare: https://www.cloudflarestatus.com/

---

**Last Updated**: 2025-12-28
**Maintained By**: DevOps Team
**Version**: 1.0
