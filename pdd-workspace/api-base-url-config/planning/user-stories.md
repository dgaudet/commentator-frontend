# User Stories - API Base URL Configuration

**Feature**: Make API Client Base URL Configurable via apiConfig
**Total Stories**: 4
**Total Effort**: ~30 minutes
**Complexity**: L0 (ATOMIC)

---

## Story Breakdown

### TASK-1.1: Create ApiConfig Interface (P0 - CRITICAL)
**Priority**: P0 (Must Do)
**Effort**: L0 (< 5 min)
**Type**: Feature / Configuration

#### User Story
```
AS a developer
I WANT to have an ApiConfig interface that defines API configuration structure
SO THAT I can ensure type-safe configuration management across the application
```

#### Acceptance Criteria
```gherkin
GIVEN I need to define API configuration
WHEN I create the ApiConfig interface
THEN it should have a 'baseUrl' property of type string
AND it should be properly exported from apiConfig.ts
AND it should follow the same pattern as AuthConfig
```

#### Tasks
- [ ] Create `src/config/apiConfig.ts`
- [ ] Define `ApiConfig` interface with `baseUrl: string` property
- [ ] Add JSDoc comments
- [ ] Follow `authConfig.ts` pattern exactly

#### Testing
- [ ] Interface can be imported in tests
- [ ] Properties are accessible with correct types

---

### TASK-1.2: Create getDefaultApiConfig() Factory (P0 - CRITICAL)
**Priority**: P0 (Must Do)
**Effort**: L0 (< 5 min)
**Type**: Feature / Configuration

#### User Story
```
AS a developer
I WANT getDefaultApiConfig() to read VITE_API_BASE_URL from environment
SO THAT the application automatically uses the correct API endpoint for each environment
```

#### Acceptance Criteria
```gherkin
GIVEN getDefaultApiConfig() is called in production
WHEN VITE_API_BASE_URL is set in environment
THEN it returns an ApiConfig with the configured baseUrl
AND when VITE_API_BASE_URL is not set, it defaults to 'http://localhost:3000'
AND it throws no errors when importing
```

#### Tasks
- [ ] Create `getDefaultApiConfig()` function
- [ ] Read `VITE_API_BASE_URL` from environment using `import.meta.env`
- [ ] Implement fallback to `http://localhost:3000`
- [ ] Add comprehensive JSDoc documentation
- [ ] Follow `getDefaultAuthConfig()` pattern

#### Testing
- [ ] Function returns correct URL when env var is set
- [ ] Function uses fallback when env var is not set
- [ ] Function works in both browser and test environments

#### Examples
```typescript
// Development (.env)
VITE_API_BASE_URL=http://localhost:3001
getDefaultApiConfig() // Returns { baseUrl: 'http://localhost:3001' }

// Production (.env.production)
VITE_API_BASE_URL=https://api.example.com
getDefaultApiConfig() // Returns { baseUrl: 'https://api.example.com' }

// Not set (fallback)
getDefaultApiConfig() // Returns { baseUrl: 'http://localhost:3000' }
```

---

### TASK-1.3: Create createTestApiConfig() Helper (P1 - MEDIUM)
**Priority**: P1 (High Value)
**Effort**: L0 (< 5 min)
**Type**: Feature / Testing

#### User Story
```
AS a test author
I WANT a createTestApiConfig() function that provides sensible test defaults
SO THAT I can easily inject custom API configurations in unit and integration tests
```

#### Acceptance Criteria
```gherkin
GIVEN createTestApiConfig() is called
WHEN used in a test
THEN it returns a test-appropriate configuration with baseUrl='http://localhost:3000'
AND it accepts an optional 'overrides' parameter
AND overrides can customize the baseUrl
AND it does not require environment variables to be set
```

#### Tasks
- [ ] Create `createTestApiConfig()` function
- [ ] Set sensible test defaults (baseUrl: 'http://localhost:3000')
- [ ] Support partial overrides parameter (Partial<ApiConfig>)
- [ ] Add JSDoc with usage examples
- [ ] Follow `createTestAuthConfig()` pattern

#### Testing
- [ ] Function returns default test config
- [ ] Overrides work correctly
- [ ] Can be used in test files without environment setup

#### Examples
```typescript
// Test file
import { createTestApiConfig } from '../config/apiConfig'

// Default test config
const config = createTestApiConfig()
// Returns: { baseUrl: 'http://localhost:3000' }

// With custom override
const config = createTestApiConfig({ baseUrl: 'http://test-api:5000' })
// Returns: { baseUrl: 'http://test-api:5000' }
```

---

### TASK-1.4: Update apiClient to Use apiConfig (P0 - CRITICAL)
**Priority**: P0 (Must Do)
**Effort**: L0 (< 5 min)
**Type**: Integration

#### User Story
```
AS an application
I WANT apiClient to use getDefaultApiConfig() for getting the base URL
SO THAT API requests automatically use the correct endpoint from configuration
```

#### Acceptance Criteria
```gherkin
GIVEN apiClient initializes
WHEN it creates the axios instance
THEN it should use getDefaultApiConfig().baseUrl instead of env.baseUrl
AND all existing API calls should continue to work
AND behavior should be identical to current implementation
```

#### Tasks
- [ ] Import `getDefaultApiConfig` in `apiClient.ts`
- [ ] Update `getBaseUrl()` function to use `getDefaultApiConfig().baseUrl`
- [ ] Remove dependency on `env.baseUrl` (or update env.ts to export apiConfig)
- [ ] Verify all API methods work correctly
- [ ] No functional changes - just refactoring configuration access

#### Testing
- [ ] `npm run test` passes
- [ ] API calls still work with correct baseUrl
- [ ] Both .env and .env.production work correctly
- [ ] No breaking changes

#### Code Example
```typescript
// BEFORE
import { env } from '../config/env'

function getBaseUrl(): string {
  if (env.baseUrl) {
    return env.baseUrl
  }
  return 'http://localhost:3000'
}

// AFTER
import { getDefaultApiConfig } from '../config/apiConfig'

function getBaseUrl(): string {
  return getDefaultApiConfig().baseUrl
}
```

---

## Story Ordering & Dependencies

### Recommended Implementation Order
1. **TASK-1.1** (Create interface) - No dependencies
2. **TASK-1.2** (Create getDefaultApiConfig) - Depends on TASK-1.1
3. **TASK-1.3** (Create createTestApiConfig) - Depends on TASK-1.1
4. **TASK-1.4** (Update apiClient) - Depends on TASK-1.2

### Parallel Work
- TASK-1.2 and TASK-1.3 can be worked on in parallel (both depend on TASK-1.1)
- TASK-1.4 should be done after TASK-1.2 is complete

---

## Priority Legend

| Priority | Effort | Impact | Must Do? |
|----------|--------|--------|----------|
| **P0** | < 5 min | Critical | YES - Blocks nothing but required for feature |
| **P1** | < 5 min | High | YES - Enables testing |

---

## Verification Checklist

- [ ] All 4 stories implemented
- [ ] All stories pass acceptance criteria
- [ ] TypeScript compilation: `npm run build` passes
- [ ] Tests pass: `npm run test` passes
- [ ] Linting passes: `npm run lint` passes
- [ ] No breaking changes to existing code
- [ ] Environment variables work correctly (.env, .env.production)
- [ ] API client functionality unchanged

---

## Definition of Done

A story is complete when:
1. ✅ Code is written and passes all acceptance criteria
2. ✅ Unit/integration tests pass
3. ✅ TypeScript compilation is successful
4. ✅ Linting passes
5. ✅ Code follows project patterns and conventions
6. ✅ Documentation/comments are clear and complete
7. ✅ No breaking changes introduced
8. ✅ Peer reviewed (if applicable)

---

## Time Budget

| Task | Estimated | Actual |
|------|-----------|--------|
| TASK-1.1 | 5 min | - |
| TASK-1.2 | 5 min | - |
| TASK-1.3 | 5 min | - |
| TASK-1.4 | 10 min | - |
| Buffer (10%) | 3 min | - |
| **Total** | **~30 min** | - |

---

## Reference Links

### Pattern Reference
- **authConfig.ts**: `src/config/authConfig.ts` - Follow this pattern exactly
- **env.ts**: `src/config/env.ts` - Current environment variable access
- **apiClient.ts**: `src/services/apiClient.ts` - File to update with new config

### Environment Variables
- **Development**: `.env` - Contains `VITE_API_BASE_URL=http://localhost:3001`
- **Production**: `.env.production` - Contains production API URL
- **Variable Name**: `VITE_API_BASE_URL` - Vite will replace this at build time

---

## Questions & Notes

**Q: Why follow authConfig.ts pattern?**
A: Consistency across configuration management. Having one pattern for all environment configuration makes code predictable and easier to maintain.

**Q: Will this break existing code?**
A: No. The refactoring maintains the same behavior. All API calls continue to work identically.

**Q: Do we need tests for apiConfig?**
A: Optional. The pattern is so simple that tests may be overkill, but can add 2-3 tests if desired.

**Q: Can we refactor env.ts further?**
A: Yes, after this is complete, env.ts could be simplified to just export apiConfig and other configs.

---

## Change History

| Date | Author | Change |
|------|--------|--------|
| 2025-12-28 | Product Owner | Created 4 user stories for API config feature |
