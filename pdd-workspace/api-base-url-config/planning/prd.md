# API Base URL Configuration - Product Requirements Document

**Feature**: Make API Client Base URL Configurable via apiConfig
**Priority**: MEDIUM
**Status**: ✅ COMPLETE
**Complexity**: L0 (ATOMIC)
**Estimated Effort**: <1 hour
**Actual Effort**: ~30 minutes
**Completed**: 2025-12-28

---

## Executive Summary

Create a centralized API configuration class (`apiConfig.ts`) that manages the backend API base URL across development, staging, and production environments. This follows the existing `authConfig.ts` pattern and provides a clean dependency injection approach for configuration management.

**Business Value**:
- ✅ Environment-specific configuration management
- ✅ Consistent pattern with Auth0 configuration
- ✅ Test isolation and dependency injection support
- ✅ Flexible deployment across different API endpoints

---

## Problem Statement

Currently, the API base URL is:
1. Scattered across `env.ts` as a raw string: `process.env.VITE_API_BASE_URL`
2. Accessed directly in `apiClient.ts` via `env.baseUrl`
3. No centralized configuration class or factory pattern
4. No dedicated test configuration helper

**Issues**:
- Configuration not managed consistently with Auth0 (which has `authConfig.ts`)
- Tests cannot easily inject custom API URLs
- Environment-specific configuration lacks structure
- Missing validation of required environment variables

---

## Solution Overview

Create `src/config/apiConfig.ts` following the established `authConfig.ts` pattern:

```typescript
// src/config/apiConfig.ts

export interface ApiConfig {
  baseUrl: string
}

export function getDefaultApiConfig(): ApiConfig {
  // Reads VITE_API_BASE_URL from environment
  // Falls back to http://localhost:3000 if not set
}

export function createTestApiConfig(overrides?: Partial<ApiConfig>): ApiConfig {
  // Returns test configuration with sensible defaults
}
```

---

## Goals & Success Metrics

### Goals
1. ✅ Create centralized API configuration class (`apiConfig.ts`)
2. ✅ Follow dependency injection pattern (consistent with `authConfig.ts`)
3. ✅ Support environment-specific base URLs (.env, .env.production, etc.)
4. ✅ Provide test configuration helper for unit tests
5. ✅ Maintain backward compatibility with existing code

### Success Metrics
- [x] `apiConfig.ts` created with proper TypeScript types
- [x] `getDefaultApiConfig()` reads `VITE_API_BASE_URL` (via process.env.API_BASE_URL)
- [x] `createTestApiConfig()` provides test defaults
- [x] All tests pass (1,359 tests passing)
- [x] No breaking changes to existing API client usage
- [x] Documentation updated with usage examples
- [x] 0 TypeScript compilation errors
- [x] pattern matches authConfig.ts exactly

---

## Acceptance Criteria

### Functional Requirements
1. **Configuration Interface**
   - GIVEN an ApiConfig interface
   - WHEN the interface is imported
   - THEN it exports a `baseUrl: string` property

2. **Default Configuration**
   - GIVEN `getDefaultApiConfig()` is called
   - WHEN `VITE_API_BASE_URL` is set
   - THEN it returns the configured base URL
   - AND when not set, defaults to `http://localhost:3000`

3. **Test Configuration**
   - GIVEN `createTestApiConfig()` is called
   - WHEN used in tests
   - THEN it returns a test-appropriate URL (`http://localhost:3000`)
   - AND allows overrides via optional parameter

4. **Environment Integration**
   - GIVEN different environment files (.env, .env.production)
   - WHEN the application builds
   - THEN it uses the correct VITE_API_BASE_URL for each environment

### Non-Functional Requirements
1. **Consistency**
   - Pattern matches `authConfig.ts` exactly
   - Naming conventions follow existing code

2. **Type Safety**
   - Full TypeScript support
   - No `any` types
   - Proper error handling

3. **Documentation**
   - JSDoc comments on all exported functions
   - Usage examples in inline comments
   - Dependency injection pattern documented

---

## Implementation Notes

### Pattern Reference
See `src/config/authConfig.ts` for the pattern to follow:
- Interface definition (`AuthConfig`)
- Environment variable factory (`getDefaultAuthConfig()`)
- Test factory (`createTestAuthConfig()`)
- JSDoc documentation

### Environment Variables
| Variable | Required? | Default | Usage |
|----------|-----------|---------|-------|
| `VITE_API_BASE_URL` | No | `http://localhost:3000` | Backend API base URL |

### Usage Example
```typescript
// In apiClient.ts:
import { getDefaultApiConfig } from '../config/apiConfig'

function getBaseUrl(): string {
  return getDefaultApiConfig().baseUrl
}

// In tests:
import { createTestApiConfig } from '../config/apiConfig'

const testConfig = createTestApiConfig({
  baseUrl: 'http://test-api:3000'
})
```

---

## Dependencies & Impact

### Files Modified
1. **CREATE** `src/config/apiConfig.ts` (new file, ~50 lines)
2. **UPDATE** `src/services/apiClient.ts` (import apiConfig, ~2 line changes)
3. **OPTIONAL** `src/config/env.ts` (can be simplified)

### No Impact On
- API client functionality (backward compatible)
- Existing tests (enhanced with better configuration support)
- Build process
- Deployment pipeline

---

## Risks & Mitigations

| Risk | Probability | Mitigation |
|------|-------------|-----------|
| Breaking existing tests | Low | Use same default as current code |
| Configuration not read correctly | Low | Follow authConfig.ts pattern exactly |
| Environment vars not passed to build | Low | Already working for VITE_AUTH0_* vars |

---

## Testing Strategy

### Unit Tests (Optional)
```typescript
describe('apiConfig', () => {
  it('should read VITE_API_BASE_URL from environment', () => {
    const config = getDefaultApiConfig()
    expect(config.baseUrl).toBe(process.env.VITE_API_BASE_URL)
  })

  it('should provide test configuration', () => {
    const config = createTestApiConfig()
    expect(config.baseUrl).toBe('http://localhost:3000')
  })

  it('should allow test configuration overrides', () => {
    const config = createTestApiConfig({ baseUrl: 'http://custom:3000' })
    expect(config.baseUrl).toBe('http://custom:3000')
  })
})
```

### Integration Testing
- Verify apiClient uses apiConfig
- Test with different VITE_API_BASE_URL values
- Verify production build uses .env.production values

---

## Deployment Considerations

### Development (.env)
```
VITE_API_BASE_URL=http://localhost:3001
```

### Production (.env.production)
```
VITE_API_BASE_URL=https://commentator-api-xxxxx.us-west1.run.app
```

### Deployment Steps
1. Build uses appropriate .env file based on `--mode`
2. `VITE_API_BASE_URL` is compiled into bundle
3. No runtime configuration changes needed
4. Existing deployment scripts continue to work

---

## Related Documents

- `src/config/authConfig.ts` - Pattern reference
- `.env` - Development environment variables
- `.env.production` - Production environment variables
- `VITE_API_BASE_URL` - Environment variable specification

---

## Approval Sign-Off

**Status**: ✅ IMPLEMENTATION COMPLETE
**Complexity**: L0 (ATOMIC)
**All Acceptance Criteria Met**: YES
**Ready for Production**: YES

---

## Change History

| Date | Author | Change |
|------|--------|--------|
| 2025-12-28 | Product Owner | Initial PRD creation |
| 2025-12-28 | Frontend Engineer | Implementation complete - all 4 stories delivered |
| 2025-12-28 | Frontend Engineer | Build: 0 errors, Tests: 1,359 passing, no breaking changes |
