# Feature Memory: Class Management

**Created**: 2025-10-20
**Status**: Design Complete - Ready for Implementation
**Sprint**: Sprint 1 (MVP)
**Last Updated**: 2025-10-20

---

## Feature Overview

### Purpose
Enable teachers to manage their class listings with the ability to view and create classes for organizing student report card comments by academic year.

### User Stories Implemented (MVP)
- **US-CLASS-001** (HIGH): View List of Classes - Display all classes sorted by year (desc) and name (asc)
- **US-CLASS-002** (HIGH): Add New Class - Create new class with validation

### User Stories (Post-MVP)
- **US-CLASS-003** (MEDIUM): Edit Existing Class
- **US-CLASS-004** (LOW): View Class Details
- **US-CLASS-005** (LOW): Delete Class

### Traceability
- **Requirements**: REQ-1, REQ-2 (see `.spec/class-management/requirements.md`)
- **Design**: DES-1 through DES-23 (see `.spec/class-management/design.md`)
- **Tasks**: TASK-1.1 through TASK-6.4 (see `.spec/class-management/tasks.md`)

---

## Architecture Decisions

### 1. State Management Strategy
**Decision**: Hook-based state management (no Redux/Zustand)
**Rationale**:
- Simpler architecture for MVP
- Faster development velocity
- No additional dependencies
- Easy to refactor to centralized state later if needed
- Feature is relatively isolated with limited global state needs

**Implementation**: Custom `useClasses` hook provides centralized CRUD operations
**Trade-offs**: May need refactoring if application grows significantly

---

### 2. API Integration Pattern
**Decision**: Direct API response consumption (no wrapper objects)
**Rationale**:
- Backend API already exists at `http://localhost:3000`
- API returns direct responses, not wrapped in `{data: ...}` structure
- Simplifies service layer code
- Matches actual backend implementation

**Key API Details**:
- **Base URL**: `http://localhost:3000`
- **Endpoint**: `/class` (singular, not `/classes`)
- **ID Type**: `number` (integer), not `string` UUID
- **Field Names**: `createdAt`/`updatedAt` (camelCase), not `created_at`/`updated_at`
- **Authentication**: Not required for MVP
- **Documentation**: Available at `http://localhost:3000/api-docs/ui` (Swagger UI)

**Important Note**: This differs from initial design assumptions. See `.spec/class-management/API_INTEGRATION.md` for migration details.

---

### 3. Validation Strategy
**Decision**: Dual validation (client-side + server-side)
**Rationale**:
- Client-side: Immediate user feedback, better UX
- Server-side: Security boundary, data integrity
- Never trust client input

**Implementation**:
- Client: `src/services/validation/classValidation.ts`
- Server: Backend API enforces constraints
- Frontend displays both inline field errors and API errors

**Validation Rules**:
- Class name: Required, 1-100 characters
- Academic year: Required, integer between 2000-2099
- Duplicate detection: Name + Year combination must be unique per teacher

---

### 4. Type System
**Decision**: TypeScript strict mode with explicit interfaces
**Field Type Corrections**:
- `id`: `number` (not `string` UUID)
- `createdAt`: `string` (ISO 8601 timestamp, camelCase)
- `updatedAt`: `string` (ISO 8601 timestamp, camelCase)

**Type Definitions Location**: `src/types/Class.ts`

---

### 5. Testing Strategy
**Decision**: TDD-first with test pyramid approach
**Layers**:
1. **Unit Tests** (Jest + RTL): Services, hooks, components (90%+ coverage target)
2. **Integration Tests** (MSW): API integration with mock service worker
3. **E2E Tests** (Playwright): Critical user workflows (Post-MVP)

**TDD Workflow**: Red-Green-Refactor cycle mandatory for all features

---

### 6. Component Architecture
**Decision**: Container/Presentational pattern with hooks
**Component Hierarchy**:
```
ClassList (Container)
├── ClassListItem (Presentational)
├── EmptyState (Presentational)
├── LoadingSpinner (Shared)
└── ErrorMessage (Shared)

ClassForm (Smart Component)
├── Input (Shared)
└── Button (Shared)
```

**State Flow**: `useClasses` hook → ClassList/ClassForm → API Service → Backend

---

## File Structure

### Created Specification Files
```
.spec/class-management/
├── requirements.md       # User stories, acceptance criteria (EARS format)
├── design.md            # Technical architecture, API specs, diagrams
├── API_INTEGRATION.md   # Backend integration notes and corrections
├── tasks.md             # Implementation tasks with TDD approach
└── README.md            # Feature overview
```

### Planned Implementation Structure
```
src/
├── components/
│   ├── classes/
│   │   ├── ClassList/
│   │   │   ├── ClassList.tsx              # Container (DES-1)
│   │   │   ├── ClassList.test.tsx
│   │   │   ├── ClassListItem.tsx          # Item component (DES-2)
│   │   │   ├── ClassListItem.test.tsx
│   │   │   ├── EmptyState.tsx             # Empty state (DES-4)
│   │   │   └── EmptyState.test.tsx
│   │   └── ClassForm/
│   │       ├── ClassForm.tsx              # Add/Edit form (DES-3)
│   │       └── ClassForm.test.tsx
│   └── common/
│       ├── Button.tsx                     # Reusable button
│       ├── Input.tsx                      # Form input
│       ├── LoadingSpinner.tsx            # Loading indicator
│       └── ErrorMessage.tsx              # Error display
├── hooks/
│   ├── useClasses.ts                     # CRUD hook (DES-9)
│   └── useClasses.test.ts
├── services/
│   ├── api/
│   │   ├── apiClient.ts                  # HTTP client (DES-11)
│   │   ├── apiClient.test.ts
│   │   ├── classService.ts               # Class API service (DES-7)
│   │   └── classService.test.ts
│   └── validation/
│       ├── classValidation.ts            # Validation rules (DES-11)
│       └── classValidation.test.ts
├── types/
│   ├── Class.ts                          # TypeScript interfaces (DES-5)
│   └── ApiResponse.ts                    # API response types (DES-6)
├── utils/
│   ├── dateFormatter.ts                  # Date formatting utilities
│   └── dateFormatter.test.ts
└── mocks/
    ├── handlers.ts                       # MSW mock handlers
    ├── server.ts                         # MSW server setup
    └── data/
        └── classes.ts                    # Mock data for testing
```

---

## Key Technical Decisions

### Date Formatting
**Library**: `date-fns` (v3.x)
**Format**: "MMM d, yyyy" (e.g., "Jan 15, 2024")
**Rationale**: Lightweight, tree-shakeable, better TypeScript support than Moment.js

### HTTP Client
**Library**: `axios` (v1.6.x)
**Rationale**:
- Proven, well-tested
- Interceptor support for error handling
- Better request/response transformation than fetch
- Automatic JSON parsing

### Sorting Logic
**Business Rule**: Classes sorted by year (descending), then name (ascending)
**Implementation**: Sorting applied in `useClasses` hook after fetch/create/update
**Rationale**: Ensures consistent ordering across all operations

---

## Backend Integration Notes

### Critical API Differences from Initial Design

| Aspect | Initial Design | Actual Backend | Impact |
|--------|---------------|----------------|--------|
| **Base URL** | `/api/v1` | `/` (root) | Medium - Service layer configuration |
| **Endpoint** | `/classes` | `/class` | Medium - All API calls updated |
| **ID Type** | `string` (UUID) | `number` (integer) | High - TypeScript interfaces |
| **Field Names** | `created_at`, `updated_at` | `createdAt`, `updatedAt` | High - All components |
| **Response Format** | Wrapped `{data: ...}` | Direct response | Medium - Service parsing |
| **Authentication** | Bearer token | Not required (MVP) | Low - Simplified client |

**Resolution**: Design and tasks updated to reflect actual backend implementation.
**Reference**: See `.spec/class-management/API_INTEGRATION.md` for detailed migration notes.

### Backend Requirements
- **URL**: `http://localhost:3000`
- **CORS**: Must allow `http://localhost:5173` (Vite dev server)
- **Database**: SQLite with Classes table (id, name, year, createdAt, updatedAt)
- **Endpoints**: All 5 CRUD operations implemented (GET, POST, PUT, DELETE /class)

---

## Dependencies

### External NPM Packages
```json
{
  "dependencies": {
    "react": "^18.x",
    "react-dom": "^18.x",
    "axios": "^1.6.x",
    "date-fns": "^3.x"
  },
  "devDependencies": {
    "@testing-library/react": "^14.x",
    "@testing-library/jest-dom": "^6.x",
    "@testing-library/user-event": "^14.x",
    "msw": "^2.x",
    "@playwright/test": "^1.x"
  }
}
```

### Backend API Dependencies
- ✅ Backend API fully implemented
- ✅ Swagger documentation available
- ✅ SQLite database with Class table
- ⚠️ CORS configuration needed for localhost:5173

---

## Risk Assessment

### Resolved Risks
- ~~**RISK-1**: Backend API not ready~~ ✅ Backend exists and is documented
- ~~**RISK-3**: Authentication token management~~ ✅ Not required for MVP

### Active Risks
- **RISK-2** (LOW): Duplicate detection performance - Mitigated by backend validation
- **RISK-5** (MEDIUM): Date formatting inconsistencies - Mitigated by `date-fns` library
- **RISK-6** (MEDIUM): Accessibility compliance - Addressed in TASK-6.1
- **RISK-9** (LOW): API field name mismatches - Resolved in design update

---

## Testing Coverage Targets

| Layer | Target Coverage | Status |
|-------|----------------|--------|
| Utilities | 100% | Pending |
| Services | 90%+ | Pending |
| Hooks | 90%+ | Pending |
| Components | 85%+ | Pending |
| E2E | Critical paths | Pending |

---

## Performance Targets

- **Page Load**: < 3 seconds
- **Form Submit**: < 2 seconds
- **API Response**: < 500ms (p95)
- **Bundle Size**: < 200KB (gzipped)
- **Lighthouse Score**: > 90

---

## Accessibility Requirements

- **Standard**: WCAG 2.1 AA compliance
- **Keyboard Navigation**: All interactive elements accessible via keyboard
- **Screen Readers**: ARIA labels on all form inputs
- **Color Contrast**: Minimum 4.5:1 ratio
- **Focus Indicators**: Visible focus states on all interactive elements

---

## Implementation Timeline

### Sprint 1 (MVP)
**Duration**: ~4 days (1 developer)
**Scope**: US-CLASS-001 (View List) + US-CLASS-002 (Add Class)
**Tasks**: TASK-1.1 through TASK-5.1 (19 tasks, 29.25 hours estimated)

### Sprint 2 (Post-MVP)
**Scope**: US-CLASS-003 (Edit Class)
**Tasks**: TBD

### Future Sprints
**Scope**: US-CLASS-004 (View Details), US-CLASS-005 (Delete Class)

---

## External Resources

### API Documentation
- **Swagger UI**: http://localhost:3000/api-docs/ui
- **OpenAPI JSON**: http://localhost:3000/api-docs

### Development Tools
- **Node Version**: v24 (see `.nvmrc`)
- **Package Manager**: npm
- **Build Tool**: Vite
- **Test Framework**: Jest + React Testing Library
- **E2E Framework**: Playwright (Post-MVP)

### Design Resources
- Requirements Document: `.spec/class-management/requirements.md`
- Technical Design: `.spec/class-management/design.md`
- Task Breakdown: `.spec/class-management/tasks.md`
- API Integration Notes: `.spec/class-management/API_INTEGRATION.md`

---

## Change History

### 2025-10-20 - Initial Design & Planning
- **By**: System Architect
- **Changes**:
  - Created comprehensive requirements document (requirements.md)
  - Created technical design with architecture diagrams (design.md)
  - Created API integration notes with backend corrections (API_INTEGRATION.md)
  - Created TDD-first task breakdown (tasks.md)
  - Documented all key architectural decisions
  - Identified 19 implementation tasks across 6 phases
- **Status**: Design complete, ready for implementation
- **Next Step**: Begin TASK-1.1 (Initialize React + Vite Project)

---

## Notes for Future Developers

### Before Starting Implementation
1. ✅ Ensure backend API is running at `http://localhost:3000`
2. ✅ Verify CORS is configured for `http://localhost:5173`
3. ✅ Test backend endpoints using curl or Postman
4. ✅ Review Swagger documentation at `http://localhost:3000/api-docs/ui`
5. ✅ Read `API_INTEGRATION.md` for important backend details

### Development Workflow
1. **Always follow TDD**: Red-Green-Refactor for every feature
2. **Run lint before commits**: `npm run lint` must pass
3. **Test against real API**: Use real backend for integration tests
4. **Maintain test coverage**: Keep coverage above targets
5. **Update this memory file**: Document significant changes and decisions

### Common Gotchas
- ⚠️ Backend uses `/class` (singular), not `/classes`
- ⚠️ IDs are `number` type, not `string` UUID
- ⚠️ Field names are camelCase (`createdAt`), not snake_case (`created_at`)
- ⚠️ API responses are direct, not wrapped in `{data: ...}`
- ⚠️ No authentication required for MVP

---

**Document Version**: 1.0.0
**Last Updated By**: System Architect
**Date**: 2025-10-20
