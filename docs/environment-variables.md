# Environment Variables Guide

This document explains how environment variables are managed across development, testing, and production environments.

## Environment Variable Loading

The application uses Vite's environment variable system with custom configuration:

```
vite.config.ts:
├─ Loads .env and .env.[mode] files
├─ Strips VITE_ prefix to create process.env.* variables
└─ Passes variables to the application via the `define` option
```

## Development Environment

When running `npm run start`:
- Vite loads `.env` and `.env.development` files
- Uses http://localhost:3000 as the default API base URL
- Auth0 callback is http://localhost:5173/callback

**File**: `.env`
```bash
VITE_API_BASE_URL=http://localhost:3000
VITE_AUTH0_DOMAIN=<the domain>
VITE_AUTH0_CLIENT_ID=<the client id>
VITE_AUTH0_REDIRECT_URI=http://localhost:5173/callback
VITE_AUTH0_AUDIENCE=https://<audience>/api/v2/
```

## Testing Environment

When running `npm run test`:
- Test environment uses process.env variables set in `src/setupTests.ts`
- Default values provided for required variables
- Tests can override via mock environment variables

**File**: `src/setupTests.ts`
```typescript
if (!process.env.API_BASE_URL) {
  process.env.API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:3000'
}
```

## Production Environment (GitHub Pages)

When running `npm run build`:
- Vite loads `.env` and `.env.production` files
- Variables are embedded in the built JavaScript files at build time
- GitHub Actions can override variables via environment variables or secrets

**File**: `.env.production`
```bash
# Environment variables can be set via GitHub Actions secrets
VITE_API_BASE_URL=${VITE_API_BASE_URL}
VITE_AUTH0_DOMAIN=${VITE_AUTH0_DOMAIN}
VITE_AUTH0_CLIENT_ID=${VITE_AUTH0_CLIENT_ID}
VITE_AUTH0_REDIRECT_URI=https://dgaudet.github.io/commentator-frontend/callback
VITE_AUTH0_AUDIENCE=${VITE_AUTH0_AUDIENCE}
```

### Setting Environment Variables for Production Builds

**Option 1: GitHub Secrets (Recommended for sensitive values)**

1. Go to: https://github.com/dgaudet/commentator-frontend/settings/secrets/actions
2. Click "New repository secret"
3. Add these secrets:
   - `VITE_API_BASE_URL` - Your production API endpoint
   - `VITE_AUTH0_DOMAIN` - Your Auth0 tenant domain
   - `VITE_AUTH0_CLIENT_ID` - Your Auth0 application client ID
   - `VITE_AUTH0_AUDIENCE` - Your Auth0 API audience

The workflow (`.github/workflows/deploy.yml`) will use these secrets if they exist, otherwise falls back to default values.

**Option 2: Direct values in `.env.production`**

For non-sensitive configuration, you can directly edit `.env.production`:

```bash
VITE_API_BASE_URL=https://your-api-endpoint.com
VITE_AUTH0_DOMAIN=your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_AUDIENCE=https://your-api-audience
```

## Auth0 Configuration (Critical for Production)

### 1. Register the Callback URL

The production deployment uses this callback URL:
```
https://dgaudet.github.io/commentator-frontend/callback
```

You must register this URL in your Auth0 Application settings:

1. Go to: https://manage.auth0.com/dashboard
2. Navigate to Applications → Your Application
3. Go to "Settings" tab
4. Find "Allowed Callback URLs"
5. Add: `https://dgaudet.github.io/commentator-frontend/callback`
6. Click "Save Changes"

### 2. Update for Custom Domains (When Ready)

If you later configure a custom domain (e.g., `commentator.example.com`), update:
- `.env.production` line: `VITE_AUTH0_REDIRECT_URI=https://commentator.example.com/callback`
- Auth0 Application settings with the new callback URL

## How Environment Variables Work in the Application

### During Build
1. Vite reads `.env.production`
2. Gets values from environment variables (or GitHub Secrets)
3. Embeds values in the JavaScript bundle
4. Values become `process.env.API_BASE_URL`, `process.env.AUTH0_DOMAIN`, etc.

### At Runtime
The values are already embedded in the JavaScript, so they're available immediately when the app loads.

```typescript
// In src/config/apiConfig.ts
export function getDefaultApiConfig(): ApiConfig {
  const baseUrl = process.env.API_BASE_URL  // Value set during build
  return {
    baseUrl: baseUrl || 'http://localhost:3000',
  }
}
```

## Troubleshooting

### Variables not available in production
- Check that environment variables are set in GitHub Secrets
- Verify workflow step has `env:` section with correct variable names
- Build log will show what values were used

### Auth0 login redirects to 404
- Verify callback URL is registered in Auth0 Application settings
- Confirm `.env.production` has correct `VITE_AUTH0_REDIRECT_URI`
- Wait for GitHub Pages deployment to complete (3-5 minutes)

### API requests go to wrong server
- Check `VITE_API_BASE_URL` in GitHub Secrets or `.env.production`
- Verify production API server is running and accessible
- Build log will show what API URL was configured

## Summary

| Scenario | Where Variables Come From | Commit to Git? |
|----------|---------------------------|----------------|
| Local dev (`npm start`) | `.env` file | ✅ Yes (non-sensitive values) |
| Local tests (`npm test`) | `setupTests.ts` defaults | N/A (in code) |
| Production build (GitHub Pages) | GitHub Secrets + `.env.production` | ✅ Yes for `.env.production` (use placeholders) |

## References

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-modes.html)
- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Auth0 Callback URLs](https://auth0.com/docs/get-started/applications/application-settings)
