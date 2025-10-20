# API Integration Notes

**Date**: 2025-10-17
**Status**: Design Updated to Match Existing Backend

---

## Overview

The technical design has been updated to reflect that the backend API already exists and is fully functional at `http://localhost:3000`.

---

## Backend API Details

### API Documentation
- **Base URL**: `http://localhost:3000`
- **Swagger UI**: `http://localhost:3000/api-docs/ui`
- **OpenAPI Spec**: `http://localhost:3000/api-docs` (JSON format)
- **API Version**: 1.0.0
- **API Title**: Commentator API

### Key Differences from Initial Design

| Aspect | Initial Design | Actual API | Impact |
|--------|---------------|------------|--------|
| **Base URL** | `/api/v1` | `/` (root) | Medium - Update service layer |
| **Endpoint Path** | `/classes` | `/class` | Medium - Update all API calls |
| **ID Type** | `string` (UUID) | `number` (integer) | High - Update TypeScript interfaces |
| **Field Names** | `created_at`, `updated_at` | `createdAt`, `updatedAt` | High - Update interfaces and components |
| **Response Format** | Wrapped in `{data: ...}` | Direct response | Medium - Update service parsing |
| **Authentication** | Bearer token required | Not required (MVP) | Low - Remove auth interceptor |

---

## API Endpoints (Actual)

### Class Entity Schema

```typescript
{
  id: number;              // Auto-generated integer
  name: string;            // Class name
  year: number;            // Academic year
  createdAt: string;       // ISO 8601 timestamp
  updatedAt: string;       // ISO 8601 timestamp
}
```

### Endpoints

| Method | Path | Purpose | Request Body | Response |
|--------|------|---------|--------------|----------|
| GET | `/class` | List all classes | N/A | `Class[]` (array) |
| POST | `/class` | Create class | `{name, year}` | `Class` (object) |
| GET | `/class/:id` | Get class by ID | N/A | `Class` (object) |
| PUT | `/class/:id` | Update class | `{name, year}` | `Class` (object) |
| DELETE | `/class/:id` | Delete class | N/A | `{message, deletedClass}` |

---

## Updated TypeScript Interfaces

### Class Interface

```typescript
// src/types/Class.ts

export interface Class {
  id: number;                    // Changed from string (UUID)
  name: string;
  year: number;
  createdAt: string;             // Changed from created_at
  updatedAt: string;             // Changed from updated_at
}

export interface CreateClassRequest {
  name: string;
  year: number;
}

export interface UpdateClassRequest {
  name: string;
  year: number;
}
```

---

## Service Layer Changes

### API Client Base URL

```typescript
// Before
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

// After
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
```

### Response Parsing

```typescript
// Before (wrapped response)
async getAll(): Promise<Class[]> {
  const response = await apiClient.get<ApiResponse<Class[]>>('/classes');
  return response.data.data;  // Unwrap from {data: ...}
}

// After (direct response)
async getAll(): Promise<Class[]> {
  const response = await apiClient.get<Class[]>('/class');
  return response.data;  // Direct array
}
```

### Method Signatures

```typescript
// Before (UUID string)
async getById(id: string): Promise<Class>
async update(id: string, data: UpdateClassRequest): Promise<Class>
async delete(id: string): Promise<void>

// After (integer ID)
async getById(id: number): Promise<Class>
async update(id: number, data: UpdateClassRequest): Promise<Class>
async delete(id: number): Promise<{message: string, deletedClass: Class}>
```

---

## Error Response Format

### Actual API Error Format

```json
{
  "error": "Validation failed",
  "details": ["name is required", "year must be a number"]
}
```

**Note**: The `details` field can be either a string or an array of strings. Frontend must handle both formats.

---

## Authentication

**Status**: No authentication required for MVP

- Initial design included JWT Bearer token authentication
- Actual API does not require authentication
- Auth interceptors removed from API client
- Future enhancement: Add authentication when backend implements it

---

## CORS Configuration

### Development Setup

The backend must allow CORS requests from the frontend development server:

```javascript
// Backend CORS configuration needed
{
  origin: 'http://localhost:5173',  // Vite default port
  credentials: true
}
```

**Action Required**: Verify CORS is configured on backend for `localhost:5173`

---

## Testing Against Real API

### Verify Backend is Running

```bash
# Check API health
curl http://localhost:3000/health

# Get API version
curl http://localhost:3000/version

# List all classes
curl http://localhost:3000/class

# Create a test class
curl -X POST http://localhost:3000/class \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Class","year":2024}'
```

### Test Data in Backend

The backend should have sample data for development. If not, create test classes using:

```bash
curl -X POST http://localhost:3000/class \
  -H "Content-Type: application/json" \
  -d '{"name":"Mathematics 101","year":2024}'

curl -X POST http://localhost:3000/class \
  -H "Content-Type: application/json" \
  -d '{"name":"English 201","year":2024}'
```

---

## Integration Checklist

### Updated Components

- [x] `design.md` - API specifications updated
- [x] TypeScript interfaces (`Class`, `CreateClassRequest`, `UpdateClassRequest`)
- [x] API client base URL
- [x] Service layer methods (`classService`)
- [x] Error handling logic
- [x] Mock data for tests
- [x] Risk assessment (RISK-1, RISK-3 resolved)

### Still TODO (Implementation Phase)

- [ ] Create actual TypeScript type files
- [ ] Implement `apiClient.ts` with updated base URL
- [ ] Implement `classService.ts` with correct endpoints
- [ ] Update `useClasses` hook to use correct ID type (number)
- [ ] Update components to use `createdAt/updatedAt` (not `created_at/updated_at`)
- [ ] Test against real backend API
- [ ] Handle error response format variations

---

## Breaking Changes from Original Design

### High Impact (Requires Code Changes)

1. **ID Type Change**: `string` → `number`
   - Affects: Component props, service methods, state management
   - Files: All files referencing `class.id`

2. **Field Name Changes**: Snake case → Camel case
   - `created_at` → `createdAt`
   - `updated_at` → `updatedAt`
   - Affects: TypeScript interfaces, date formatting components
   - Files: `Class.ts`, any component displaying timestamps

3. **Response Format**: Wrapped → Direct
   - Affects: All service methods
   - Files: `classService.ts`

### Medium Impact (Configuration Changes)

4. **Base URL Change**: `/api/v1` → `/`
   - Affects: API client configuration
   - Files: `apiClient.ts`

5. **Endpoint Path Change**: `/classes` → `/class`
   - Affects: All API calls
   - Files: `classService.ts`

### Low Impact (Simplifications)

6. **Authentication Removed**: No auth for MVP
   - Affects: API client interceptors
   - Files: `apiClient.ts` (simplified)

---

## Migration Plan

### Phase 1: Type Definitions (TASK-1.2)
1. Create `src/types/Class.ts` with `number` ID and camelCase fields
2. Create `src/types/ApiResponse.ts` for error handling
3. Run TypeScript compiler to verify

### Phase 2: Service Layer (TASK-2.1, TASK-2.3)
1. Implement `apiClient.ts` with `http://localhost:3000` base URL
2. Remove auth interceptors
3. Implement `classService.ts` with direct response parsing
4. Test against real API using curl/Postman

### Phase 3: Component Updates (TASK-4.x)
1. Update all components to use `number` IDs
2. Update date formatters to use `createdAt/updatedAt`
3. Test rendering with real API data

### Phase 4: Integration Testing (TASK-5.1)
1. Test full CRUD workflow against real backend
2. Verify error handling
3. Test edge cases (validation errors, 404s, etc.)

---

## Environment Configuration

### .env File

```bash
# Development
VITE_API_BASE_URL=http://localhost:3000

# Production (when deployed)
VITE_API_BASE_URL=https://api.production-domain.com
```

---

## Swagger UI Reference

For detailed API documentation, developers should reference:
- **URL**: http://localhost:3000/api-docs/ui
- **Sections**:
  - Classes → All 5 CRUD endpoints
  - System → Health check and version endpoints

**Screenshot/Export**: Consider exporting Swagger spec for offline reference during development.

---

## Questions for Backend Team

1. ✅ **Confirmed**: Backend API is running and accessible
2. ✅ **Confirmed**: API returns camelCase field names (`createdAt`, `updatedAt`)
3. ✅ **Confirmed**: IDs are integers, not UUIDs
4. ⚠️ **TODO**: Is CORS configured for `http://localhost:5173`?
5. ⚠️ **TODO**: Are there validation rules for class name (min/max length)?
6. ⚠️ **TODO**: Is duplicate detection (name + year) enforced at database level?
7. ⚠️ **TODO**: Can classes be deleted if they have associated comments?

---

## Next Steps

1. **Verify CORS**: Test API from frontend dev server (port 5173)
2. **Begin Implementation**: Start with TASK-1.1 (Project Structure)
3. **Real API Testing**: Use real backend instead of MSW for integration tests
4. **Coordinate with Backend**: Confirm validation rules and constraints

---

**Updated**: 2025-10-17
**Version**: 1.1.0 (Post-API Discovery)
