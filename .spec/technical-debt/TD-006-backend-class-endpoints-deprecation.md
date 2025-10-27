# TD-006: Backend API Class Endpoints May Need Deprecation

**Priority**: LOW
**Effort**: Backend 2-3 story points
**Status**: Not Started
**Related**: Backend API Architecture, Class to Subject Migration
**Dependencies**: Requires TD-003 (Frontend Class deprecation) complete first

---

## Problem Statement

The backend API currently exposes `/class` endpoints for CRUD operations. After the frontend migrates fully to Subject and deprecates Class infrastructure, the backend `/class` endpoints become unused by the frontend application.

**Current Backend Endpoints (Assumed)**:
- `GET /class` - Fetch all classes
- `POST /class` - Create new class
- `GET /class/:id` - Fetch single class
- `PUT /class/:id` - Update class
- `DELETE /class/:id` - Delete class

**Frontend Status**:
- ✅ Frontend uses Subject components (App.tsx migrated)
- ⏳ Class components marked as deprecated (TD-003)
- ⏳ Class infrastructure removed from frontend (TD-003)

**Backend Status**:
- ⏳ `/subject` endpoints exist but not yet deployed (TD-005)
- ❓ `/class` endpoints still active
- ❓ No deprecation timeline established

**Impact**:
- **Maintenance Burden**: Backend team maintains unused endpoints
- **API Bloat**: Unnecessary endpoints increase API surface area
- **Documentation Confusion**: API docs show deprecated endpoints
- **Security Risk**: Unused endpoints may have unpatched vulnerabilities
- **Cost**: Database queries and backend resources for unused features

**Why LOW Priority**:
This is backend-only technical debt that doesn't impact frontend functionality or users. The backend team should handle this after confirming frontend no longer needs `/class` endpoints. No immediate risk or benefit to frontend.

---

## User Stories (EARS Format)

### US-TD-006-001: Backend Deprecates Class Endpoints (Backend - 2 pts)

**As a** backend developer
**I want** to deprecate `/class` API endpoints
**So that** we reduce maintenance burden and API complexity

**Acceptance Criteria**:

WHEN `/class` endpoints are no longer used by frontend
THE SYSTEM SHALL add deprecation warnings to API responses

WHEN API documentation is generated
THE SYSTEM SHALL mark `/class` endpoints as deprecated

WHEN `/class` endpoints are called
THE SYSTEM SHALL log deprecation warnings for monitoring

WHEN 30 days pass with no `/class` endpoint usage
THE SYSTEM SHALL be ready for endpoint removal

### US-TD-006-002: Backend Removes Class Endpoints (Backend - 1 pt)

**As a** backend developer
**I want** to remove deprecated `/class` endpoints after grace period
**So that** we simplify the API and reduce codebase size

**Acceptance Criteria**:

WHEN 30-day grace period expires with no usage
THE SYSTEM SHALL remove all `/class` endpoint handlers

WHEN `/class` endpoints are called after removal
THE SYSTEM SHALL return 410 Gone status with migration message

WHEN Class database table is no longer needed
THE SYSTEM SHALL archive Class-related database migrations

WHEN backend tests are executed
THE SYSTEM SHALL no longer test `/class` endpoints

---

## Technical Design

### Phase 1: Confirm Frontend Migration Complete

**Prerequisites** (Must verify before backend deprecation):
1. ✅ Frontend App.tsx uses Subject components
2. ⏳ Frontend Class infrastructure removed (TD-003)
3. ⏳ Frontend OutcomeComment uses subjectId (TD-002)
4. ⏳ Frontend production deployment stable for 2+ weeks
5. ⏳ Zero requests to `/class` endpoints in last 30 days

**Validation Steps**:
```bash
# Backend monitoring query (pseudo-code)
SELECT
  endpoint,
  COUNT(*) as request_count,
  MAX(timestamp) as last_request
FROM api_logs
WHERE endpoint LIKE '/class%'
  AND timestamp > NOW() - INTERVAL '30 days'
GROUP BY endpoint;
```

**Expected Result**: Zero requests to `/class` endpoints

### Phase 2: Add Deprecation Warnings

#### 1. Update API Response Headers

Add deprecation headers to all `/class` endpoints:

```typescript
// Backend Controller Example (Node.js/Express)
app.get('/class', (req, res) => {
  res.set({
    'Deprecation': 'true',
    'Sunset': new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString(), // 30 days
    'Link': '</subject>; rel="alternate"',
  })

  // Log deprecation warning
  logger.warn('DEPRECATED: /class endpoint called', {
    ip: req.ip,
    user: req.user?.id,
    timestamp: new Date(),
  })

  // Return normal response
  const classes = await classService.findAll(req.user.id)
  res.json(classes)
})
```

**Deprecation Headers Explained**:
- `Deprecation: true` - Standard HTTP deprecation header
- `Sunset: <date>` - Date when endpoint will be removed
- `Link: </subject>; rel="alternate"` - Suggests alternative endpoint

#### 2. Update API Documentation

**OpenAPI/Swagger Specification**:

```yaml
/class:
  get:
    deprecated: true
    summary: "Fetch all classes (DEPRECATED)"
    description: |
      **DEPRECATED**: This endpoint will be removed on 2024-03-01.
      Use `/subject` instead. Subject has the same functionality but without the `year` field.
    responses:
      200:
        description: List of classes
        headers:
          Deprecation:
            description: Indicates this endpoint is deprecated
            schema:
              type: string
              example: "true"
          Sunset:
            description: Date when endpoint will be removed
            schema:
              type: string
              example: "Wed, 01 Mar 2024 00:00:00 GMT"
```

#### 3. Monitor Deprecation Usage

**Set up monitoring alerts**:
```typescript
// Example: Monitor /class endpoint usage
if (req.path.startsWith('/class')) {
  metrics.increment('deprecated_class_endpoint_usage', {
    endpoint: req.path,
    user_id: req.user?.id,
  })

  // Alert if unexpected usage after deprecation
  if (Date.now() > deprecationDate.getTime()) {
    logger.error('Deprecated /class endpoint still being called', {
      endpoint: req.path,
      user: req.user?.email,
    })
  }
}
```

### Phase 3: Remove Class Endpoints (After 30 Days)

#### 1. Replace Endpoints with 410 Gone

```typescript
// Backend Controller Example
app.all('/class*', (req, res) => {
  res.status(410).json({
    error: 'Gone',
    message: 'The /class endpoints have been removed. Please use /subject endpoints instead.',
    migration_guide: 'https://docs.commentator.app/migration/class-to-subject',
    alternative_endpoint: req.path.replace('/class', '/subject'),
    removed_date: '2024-03-01',
  })
})
```

**HTTP 410 Gone**:
- Indicates resource permanently removed
- More specific than 404 Not Found
- Helps clients understand endpoint is intentionally gone

#### 2. Remove Class Business Logic

**Delete Files**:
- `src/controllers/class.controller.ts`
- `src/services/class.service.ts`
- `src/entities/class.entity.ts`
- `src/dto/class.dto.ts`
- `src/validators/class.validator.ts`

**Update Files**:
- Remove Class imports from `src/app.module.ts`
- Remove Class routes from API router
- Remove Class-related tests

#### 3. Archive Database Table

**Option A: Drop Table** (If data not needed)
```sql
-- Create backup first
CREATE TABLE class_backup AS SELECT * FROM class;

-- Drop table
DROP TABLE class;
```

**Option B: Rename Table** (Keep for historical reference)
```sql
-- Rename table to indicate archived status
ALTER TABLE class RENAME TO class_archived_20240301;

-- Remove foreign key constraints if needed
ALTER TABLE class_archived_20240301 DROP CONSTRAINT class_user_id_fkey;
```

**Option C: Keep Table** (If other systems depend on it)
- No database changes
- Document that table is no longer used by API

### Phase 4: Update Documentation

#### 1. Update API Documentation

**Remove from API docs**:
- `/class` endpoint documentation
- Class entity schemas
- Class request/response examples

**Add migration guide**:
```markdown
# Migration Guide: Class to Subject

## Overview
The `/class` endpoints were deprecated on 2024-01-15 and removed on 2024-03-01.

## Key Differences

| Class | Subject |
|-------|---------|
| `GET /class` | `GET /subject` |
| Returns `{ id, name, year, createdAt, updatedAt }` | Returns `{ id, name, createdAt, updatedAt }` (no year) |
| Duplicate check: name + year | Duplicate check: name only (case-insensitive) |

## Migration Steps

1. Update frontend to use `/subject` endpoints
2. Remove `year` field from forms and database
3. Update duplicate detection logic
4. Deploy frontend changes
5. Verify no `/class` endpoint usage
6. Backend removes `/class` endpoints

## Breaking Changes

- **year field removed**: Subject does not have a year field
- **Duplicate detection**: Changed from "name + year" to "name only"
- **API endpoint**: `/class` → `/subject`
```

#### 2. Update Backend README

```markdown
## API Endpoints

### Subject Management
- `GET /subject` - Fetch all subjects for authenticated user
- `POST /subject` - Create new subject
- `GET /subject/:id` - Fetch single subject
- `PUT /subject/:id` - Update subject
- `DELETE /subject/:id` - Delete subject

### ~~Class Management~~ (REMOVED)
The `/class` endpoints were removed on 2024-03-01. Use `/subject` instead.
See [Migration Guide](docs/migration-class-to-subject.md).
```

---

## Implementation Tasks (Backend Team)

### Task 1: Verify Frontend Migration Complete (Verification)
**Risk**: Trivial
**Effort**: 30 minutes

1. Confirm TD-003 (Frontend Class deprecation) is complete
2. Confirm TD-002 (OutcomeComment subjectId migration) is complete
3. Review frontend production deployment logs
4. Verify `/subject` endpoints are being used
5. Query backend logs for `/class` endpoint usage in last 30 days
6. Document findings

**Exit Criteria**: Zero `/class` endpoint requests in last 30 days

### Task 2: Add Deprecation Headers and Logging (GREEN)
**Risk**: Low
**Effort**: 1 hour

1. Add deprecation headers to all `/class` endpoints
2. Add deprecation logging
3. Set `Sunset` date to 30 days from now
4. Add `Link` header pointing to `/subject`
5. Test deprecation headers with curl/Postman
6. Deploy to production

### Task 3: Update API Documentation (REFACTOR)
**Risk**: Trivial
**Effort**: 1 hour

1. Mark `/class` endpoints as deprecated in OpenAPI spec
2. Add deprecation warnings to endpoint descriptions
3. Add Sunset date to documentation
4. Link to `/subject` alternative endpoints
5. Generate updated API documentation
6. Publish updated docs

### Task 4: Monitor Usage for 30 Days (Monitoring)
**Risk**: Trivial
**Effort**: 30 days (passive monitoring)

1. Set up monitoring dashboard for `/class` endpoint usage
2. Configure alerts if endpoints are called
3. Weekly review of logs
4. Document any unexpected usage
5. Contact clients if they're still using deprecated endpoints

**Exit Criteria**: 30 days with zero or near-zero usage

### Task 5: Replace Endpoints with 410 Gone (GREEN)
**Risk**: Low
**Effort**: 30 minutes

1. Replace all `/class` endpoints with 410 Gone handler
2. Return helpful error message with migration guide link
3. Test 410 responses
4. Deploy to production
5. Monitor error logs

### Task 6: Remove Class Business Logic (REFACTOR)
**Risk**: Medium
**Effort**: 2 hours

1. **IMPORTANT**: Create git tag: `git tag pre-class-removal`
2. Delete Class controller, service, entity, DTO files
3. Remove Class imports from app module
4. Remove Class routes
5. Remove Class tests
6. Run backend tests to verify no errors
7. Commit changes

**Rollback Plan**: `git reset --hard pre-class-removal`

### Task 7: Archive Database Table (Backend DBA)
**Risk**: High
**Effort**: 1 hour

1. Create database backup
2. Test backup restoration in dev environment
3. Choose archival strategy (drop, rename, or keep)
4. Execute archival strategy in production
5. Verify application still works
6. Document database changes

**IMPORTANT**: Coordinate with DBA team

### Task 8: Update Documentation (REFACTOR)
**Risk**: Trivial
**Effort**: 1 hour

1. Create migration guide document
2. Update backend README
3. Update API changelog
4. Remove Class from OpenAPI spec
5. Publish updated documentation

---

## Testing Strategy (Backend Team)

### Pre-Deprecation Testing
- [ ] Verify zero `/class` endpoint usage in production logs
- [ ] Confirm frontend using `/subject` endpoints
- [ ] Verify `/subject` endpoints have same functionality as `/class`

### Post-Deprecation Testing
- [ ] Test deprecation headers are present
- [ ] Test deprecation logging works
- [ ] Verify 410 Gone responses after removal
- [ ] Test migration guide links work
- [ ] Verify backend tests pass after Class removal

### Rollback Testing
- [ ] Git tag `pre-class-removal` exists
- [ ] Can restore from tag if needed
- [ ] Database backup tested and working

---

## Communication Plan

### Stakeholder Notification

**Before Deprecation**:
1. Notify frontend team of deprecation timeline
2. Publish deprecation announcement in API changelog
3. Email any external API consumers (if applicable)
4. Update status page with deprecation notice

**During 30-Day Grace Period**:
1. Weekly monitoring reports
2. Alert any clients still using `/class` endpoints
3. Offer migration support

**After Removal**:
1. Announce removal in API changelog
2. Confirm zero impact to production
3. Update documentation
4. Close related tickets

---

## Risks and Mitigation

### Risk 1: Unexpected Client Still Using /class
**Scenario**: External service or forgotten integration still calls `/class`

**Mitigation**:
- 30-day grace period with monitoring
- Return helpful 410 error with migration guide
- Contact clients proactively during grace period
- Keep 410 handler indefinitely (lightweight)

### Risk 2: Database Data Loss
**Scenario**: Class data accidentally deleted

**Mitigation**:
- Create backup before any database changes
- Test backup restoration
- Use rename strategy instead of drop
- Coordinate with DBA team

### Risk 3: Frontend Regression
**Scenario**: Frontend still has hidden dependency on `/class`

**Mitigation**:
- Verify TD-003 complete before starting
- Review frontend codebase for `/class` references
- Test frontend thoroughly after deprecation
- Quick rollback plan if issues arise

---

## Dependencies

- **Requires**: TD-003 (Frontend Class infrastructure removed) complete
- **Requires**: TD-002 (OutcomeComment subjectId migration) complete
- **Requires**: TD-005 (Subject E2E tests passing) complete
- **Blocks**: None (backend-only cleanup)
- **Relates to**: TD-007 (MSW handlers duplication - frontend mirrors backend)

---

## Acceptance Criteria

This technical debt item is complete when:

1. Zero `/class` endpoint requests in production logs for 30 days
2. Deprecation headers added to all `/class` endpoints
3. API documentation updated with deprecation warnings
4. 30-day monitoring period completed
5. `/class` endpoints return 410 Gone
6. Class business logic removed from backend codebase
7. Class database table archived or removed (per strategy)
8. Migration guide published
9. Backend README updated
10. All backend tests pass (with Class tests removed)
11. No production errors after removal
12. Stakeholders notified of completion

---

## Notes for Frontend Team

**Frontend Action Required**: None

This is purely backend technical debt. Frontend team should:
1. Ensure TD-003 (Class infrastructure removal) is complete
2. Verify production app only uses `/subject` endpoints
3. Coordinate timeline with backend team
4. Be available for testing after backend changes

**Timeline**:
- Backend deprecation: After TD-003 complete
- Grace period: 30 days
- Backend removal: After grace period expires
- Total timeline: ~6-8 weeks after TD-003

**Frontend should not**:
- Make any code changes for this ticket
- Deploy any new frontend code for this ticket
- Test `/class` endpoints (they will be removed)
