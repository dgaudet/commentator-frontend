# Project Memory Index

**Last Updated**: 2025-12-26 (Build & Deploy Phase Complete)
**Project**: Commentator Frontend - React Application for Student Report Card Comments

---

## Project Overview

This is a React frontend application for managing student report card comments. It integrates with a REST API to perform CRUD operations on Classes, OutcomeComments, PersonalizedComments, and FinalComments.

**Current State**: ✅ **PRODUCTION BUILD READY** - Class Management MVP complete (169 tests), all build infrastructure fixed (68 errors → 0), test suite passing (1,359/1,359), production bundle optimized and ready for deployment.

---

## Technology Stack

- **Runtime**: Node.js v24
- **Framework**: React 18.x
- **Build Tool**: Vite
- **Language**: TypeScript (strict mode)
- **Testing**: Jest + React Testing Library
- **HTTP Client**: Axios
- **State Management**: React Hooks (no Redux/Zustand for MVP)
- **Package Manager**: npm

---

## Architecture Overview

```
src/
├── components/     # React components (presentational + container)
├── hooks/          # Custom React hooks for business logic
├── services/       # API clients and business services
├── types/          # TypeScript type definitions
├── utils/          # Utility functions (date formatting, etc.)
└── mocks/          # MSW mock handlers for testing
```

---

## Feature Index

### 1. Class Management ✅ COMPLETE
**Status**: ✅ Production Ready (All 6 Phases Complete)
**Sprint**: Sprint 1 (MVP) - COMPLETE
**Last Updated**: 2025-10-20

**Memory File**: `.github/instructions/memory/features/class-management/memory.md`

**Overview**:
Teachers can manage their class listings to organize students and report card comments by academic year.

**User Stories Implemented**:
- ✅ **US-CLASS-001** (HIGH): View List of Classes - Display all classes sorted by year/name
- ✅ **US-CLASS-002** (HIGH): Add New Class - Create new class with validation

**User Stories (Future)**:
- ⏳ **US-CLASS-003** (MEDIUM): Edit Existing Class - Update class details (Post-MVP)
- ⏳ **US-CLASS-004** (LOW): View Class Details - Show detailed class information (Post-MVP)
- ⏳ **US-CLASS-005** (LOW): Delete Class - Remove classes (Post-MVP)

**Implementation Summary**:
- ✅ Phase 1: Project Setup Complete
- ✅ Phase 2: Services Layer (47 tests)
- ✅ Phase 3: Hooks Layer (16 tests)
- ✅ Phase 4: Components (102 tests)
- ✅ Phase 5: Integration & E2E Testing (14 E2E scenarios)
- ✅ Phase 6: Polish & Deployment (Accessibility + Performance)

**Quality Metrics**:
- **Tests**: 169 unit tests passing + 14 E2E tests
- **Accessibility**: WCAG 2.1 AA compliant (0 violations)
- **Performance**: 99.98 KB bundle (50% under target)
- **Coverage**: 90%+ across all layers
- **Linting**: All passing

**Key Files**:
- Requirements: `.spec/class-management/requirements.md`
- Design: `.spec/class-management/design.md`
- API Integration: `.spec/class-management/API_INTEGRATION.md`
- Tasks: `.spec/class-management/tasks.md` (All 20+ tasks complete)
- Accessibility Audit: `.spec/class-management/accessibility-audit.md`
- Performance Report: `.spec/class-management/performance-optimization-report.md`
- Phase 5 Completion: `.spec/class-management/phase-5-completion.md`

**Key Decisions**:
- Hook-based state management (no Redux) - ✅ Implemented
- Direct API response consumption (not wrapped) - ✅ Implemented
- Dual validation (client + server) - ✅ Implemented
- TDD-first implementation approach - ✅ Followed throughout
- React.memo() for performance - ✅ Applied to ClassListItem
- useCallback() for stable refs - ✅ Applied to all handlers

**Backend Integration**:
- API URL: `http://localhost:3000` - ✅ Validated
- Endpoint: `/class` (singular) - ✅ Integrated
- Documentation: `http://localhost:3000/api-docs/ui` - ✅ Verified
- Authentication: Not required for MVP - ✅ Confirmed

**Next Steps**: Ready for production deployment or US-CLASS-003 (Edit Class) implementation

---

### 2. Build & Deployment Infrastructure ✅ COMPLETE
**Status**: ✅ Production Ready (Build & Deploy Phase Complete)
**Sprint**: Infrastructure Stabilization
**Last Updated**: 2025-12-28 (Feature Status Updated)

**Memory File**: `.github/instructions/memory/features/build-deploy-app/memory.md`

**Overview**:
Critical build infrastructure fixes to ensure clean compilation and successful deployment. Fixed 68 TypeScript errors, corrected 5 test failures, and created comprehensive validation documentation.

**Issues Resolved**:
- ✅ 68 TypeScript build errors → 0 errors
- ✅ 5 failing tests → 1,359 tests passing
- ✅ ID type consistency across component hierarchy
- ✅ TypeScript configuration (Node types, path aliases)
- ✅ CSS module type declarations
- ✅ Build artifact exclusions (.gitignore)
- ✅ Test assertions aligned with implementation

**Files Modified**: 10 total
- Configuration: 4 files (vite.config.ts, tsconfig.json, vite-env.d.ts, .gitignore)
- Components: 5 files (ID type updates)
- Tests: 1 file (assertion corrections)

**Build Statistics**:
- Bundle Sizes: JS 440KB (gzipped: 139.36KB), CSS 8KB (gzipped: 1.41KB)
- Compilation: TypeScript strict mode, zero errors
- Test Coverage: 1,359 tests passing, full validation
- Build Time: ~889ms

**Validation Artifacts Created**:
- 8-step comprehensive validation guide (340+ lines)
- Manual testing checklist (89 test cases)
- Validation summary document
- Quick-start command reference
- Automated build verification script

**Next Steps**: Manual validation (user execution), staging deployment, production deployment

---

### 3. Bulk Personalized Comments ✅ COMPLETE
**Status**: ✅ Production Ready (8/8 User Stories Complete)
**Sprint**: Personalized Comments Enhancement
**Last Updated**: 2026-01-13

**Memory File**: `.github/instructions/memory/features/bulk-personalized-comments/memory.md`

**Overview**:
Teachers can paste multiple personalized comments at once with optional ratings (1-5), parse them automatically, and save through the existing API with detailed feedback on success/failure.

**User Stories Implemented (8/8)**:
- ✅ **Story 1**: Display bulk upload button - 10 tests
- ✅ **Story 2**: Modal with instructions & examples - 16 tests
- ✅ **Story 3**: Parse comments with rating detection - 24 tests
- ✅ **Story 4**: Sequential save with failure tracking - 14 tests
- ✅ **Story 5**: Progress & results display - 12 tests
- ✅ **Story 6**: Results summary (covered by Story 5)
- ✅ **Story 7**: Edge cases & error handling - 8 tests
- ✅ **Story 8**: Update comments list after import - 6 tests

**Implementation Summary**:
- ✅ BulkUploadModal component with state machine (input → progress → results)
- ✅ parseComments utility (24 test cases)
- ✅ bulkSaveComments utility with sequential API calls (14 test cases)
- ✅ Accessibility compliant (ARIA labels, dialog role, keyboard navigation)
- ✅ Error tracking with line numbers and original text
- ✅ Integration with existing onCreateComment API (no new backend needed)

**Quality Metrics**:
- **Tests**: 90 total (all passing)
  - Unit tests: 38
  - Component tests: 44
  - Integration tests: 8
- **Build**: Passing with 0 TypeScript/ESLint errors
- **TypeScript**: Strict mode, 100% compliance
- **Accessibility**: WCAG 2.1 AA compliant

**Key Features**:
- Paste multiple comments at once (one per line)
- Optional ratings (1-5) via comma-separated format at end of line
- Default rating 3 if omitted
- Handles internal commas in comment text
- Real-time progress feedback during save
- Detailed failure reporting with line numbers
- Graceful error handling with user-friendly messages
- Modal state machine for clear UX flow

**Deferred Features** (Future Releases):
- Character count indicator
- "Retry Failed" button
- Auto-refresh with visual highlight
- Batch API endpoint (requires backend coordination)

**Key Files**:
- Component: `src/components/personalizedComments/BulkUploadModal.tsx`
- Utilities: `src/components/personalizedComments/parseComments.ts`, `bulkSaveComments.ts`
- Tests: 7 test suites with 90 total tests
- Documentation: `pdd-workspace/bulk-personalized-comments/planning/user-stories.md`

**Technical Decisions**:
- Rating detection via last comma+digit regex pattern
- Sequential saves for failure tracking and maximum success rate
- Modal state machine pattern for clean component logic
- Reuse existing API (no new backend endpoints)
- Line number tracking (1-indexed) for failed items

**Lessons Learned**:
- Bulk operations benefit from detailed failure reporting
- Sequential saves acceptable for typical use case (5-50 comments)
- State machines simplify multi-step modal workflows
- Clear error messages critical for user trust

**Next Steps**:
Ready for production deployment or enhancement with deferred features.

---

### 4. Outcome Comments Management
**Status**: 🔜 Not Started
**Priority**: Post-MVP

**Planned Features**:
- Manage comments related to learning outcomes
- Associate comments with classes
- CRUD operations

---

### 5. Personalized Comments Management (Core)
**Status**: 🔜 Partially Complete
**Priority**: MVP Enhancement
**Latest**: Bulk upload feature complete (Story 1-8)

**Planned Features**:
- ✅ View personalized comments
- ✅ Create personalized comments
- ✅ Copy comments to another subject
- ✅ **Bulk upload comments** (NEW - Story 1-8 complete)
- 🔜 Edit personalized comments (future)
- 🔜 Delete personalized comments (future)
- 🔜 Comment templates (future)

---

### 4. Final Comments Generation
**Status**: 🔜 Not Started
**Priority**: Post-MVP

**Planned Features**:
- Aggregate outcome and personalized comments
- Generate final report card comments
- Review and edit workflow

---

## Development Workflow

### Specification-First Methodology

This project follows a structured three-phase approach:

1. **Phase 1: Requirements** (`requirements.md`)
   - User stories in EARS notation format
   - Acceptance criteria
   - Edge cases and validation rules

2. **Phase 2: Design** (`design.md`)
   - Technical architecture and component design
   - Data models and API specifications
   - Security and performance considerations
   - Mermaid diagrams for complex interactions

3. **Phase 3: Implementation** (`tasks.md`)
   - Atomic, trackable tasks with risk tiers
   - TDD-first approach (Red-Green-Refactor)
   - Effort estimates and dependencies

### Risk Tiers

Tasks are classified by risk level:
- 🟢 **TRIVIAL**: Documentation, formatting (auto-approved, 0 retries)
- 🟡 **LOW**: Single-file changes, localized edits (auto-approved, 2 retries)
- 🟠 **MEDIUM**: Multi-file changes, additive APIs (requires approval, 1 retry)
- 🔴 **HIGH**: Cross-cutting refactors, deletions (requires approval, 0 retries)

### Test-Driven Development (TDD)

**MANDATORY** for all features: Red-Green-Refactor cycle
1. Write failing test (RED)
2. Confirm failure
3. Implement minimal code (GREEN)
4. Confirm success
5. Refactor and improve (REFACTOR)

**Coverage Targets**:
- Utilities: 100%
- Services: 90%+
- Hooks: 90%+
- Components: 85%+

---

## Backend API Integration

### API Details
- **Base URL**: `http://localhost:3000`
- **Documentation**: Swagger UI at `http://localhost:3000/api-docs/ui`
- **OpenAPI Spec**: `http://localhost:3000/api-docs` (JSON)
- **API Version**: 1.0.0
- **Authentication**: Not required for MVP

### Core Entities
1. **Classes** - Educational class groupings
2. **OutcomeComments** - Learning outcome-based comments
3. **PersonalizedComments** - Student-specific comments
4. **FinalComments** - Aggregated report card comments

### Important Notes
- Backend uses singular endpoint names (`/class`, not `/classes`)
- IDs are integers (`number`), not UUIDs (`string`)
- Field names use camelCase (`createdAt`), not snake_case (`created_at`)
- Responses are direct, not wrapped in `{data: ...}` objects
- CORS must be configured for `http://localhost:5173` (Vite dev server)

---

## Git Workflow

### Branch Strategy
- **Feature branches**: `feature/intent-v<spec-version>`
- **Main branch**: `main`

### Commit Standards
- Reference requirement IDs (e.g., `REQ-3`, `DES-3`, `TASK-3.1`)
- Files must end with newline character
- `npm run lint` must pass before commits

### Pull Requests
- Reference `intent.md` and `tasks.md`
- Include validation artifacts
- CI must pass before merge

---

## Project Context Files

### Core Documentation
- **CLAUDE.md**: Development guidelines and standards
- **README.md**: Project setup and overview
- **toDos.md**: Feature backlog

### Specification Templates
- `.github/prompts/spec.prompt.md`: Specification planning protocol (Kiro)
- `.github/prompts/intent.prompt.md`: State machine protocol

### Memory Files
- **This file** (`.github/instructions/memory-index.md`): Living index of all features
- **Feature memories**: `.github/instructions/memory/features/<feature-name>/memory.md`

---

## Active Initiatives

### Sprint 1 ✅ COMPLETE
**Goal**: Implement Class Management MVP
**User Stories**: US-CLASS-001, US-CLASS-002
**Duration**: Completed 2025-10-20
**Status**: ✅ Production ready - All phases complete

**Completed Tasks**:
- ✅ Phase 1: Project setup and infrastructure (4 tasks)
- ✅ Phase 2: Service layer - API client, validation, class service (10 tasks)
- ✅ Phase 3: Custom hooks - `useClasses` CRUD hook (1 task)
- ✅ Phase 4: Components - 8 components with full tests (6 tasks)
- ✅ Phase 5: Integration & E2E testing with Playwright (2 tasks)
- ✅ Phase 6: Accessibility audit + Performance optimization (4 tasks)

**Deliverables**:
- 169 unit tests passing
- 14 E2E test scenarios
- WCAG 2.1 AA compliant
- 99.98 KB bundle size (50% under target)
- Full documentation created

### Sprint 2 ✅ COMPLETE
**Goal**: Bulk Personalized Comments Feature
**User Stories**: 8 stories (Story 1-8)
**Duration**: Completed 2026-01-13
**Status**: ✅ Production ready - All stories complete

**Completed Tasks**:
- ✅ Story 1: Display bulk upload button (10 tests)
- ✅ Story 2: Modal with instructions & examples (16 tests)
- ✅ Story 3: Parse comments with ratings (24 tests)
- ✅ Story 4: Sequential API saves with failure tracking (14 tests)
- ✅ Story 5: Progress & results display (12 tests)
- ✅ Story 6: Results summary display
- ✅ Story 7: Edge cases & error handling (8 tests)
- ✅ Story 8: List integration after import (6 tests)

**Deliverables**:
- 90 tests passing (100%)
- BulkUploadModal component + utilities
- 0 TypeScript/ESLint errors
- WCAG 2.1 AA compliant
- Feature memory documentation complete

### Upcoming Sprints
- **Sprint 3**: Class Management - Edit functionality (US-CLASS-003)
- **Sprint 4**: Outcome Comments Management (new feature)
- **Sprint 5**: Additional Personalized Comments features (edit, delete, templates)

---

## Key Architectural Decisions

### 1. State Management
**Decision**: React Hooks (no Redux/Zustand for MVP)
**Rationale**: Simpler, faster development; easy to refactor later

### 2. Testing Strategy
**Decision**: TDD-first with test pyramid
**Layers**: Unit tests (Jest) → Integration tests (MSW) → E2E tests (Playwright)

### 3. Component Pattern
**Decision**: Container/Presentational with hooks
**Rationale**: Clear separation of concerns, testability

### 4. API Integration
**Decision**: Direct response consumption via Axios
**Rationale**: Matches actual backend implementation, no wrapper needed

### 5. Validation
**Decision**: Dual validation (client + server)
**Rationale**: Better UX + security boundary

---

## External Resources

### Development
- **Backend Repository**: [Link to backend repo]
- **Swagger API Docs**: http://localhost:3000/api-docs/ui
- **Design System**: TBD (currently using Tailwind utility classes)

### Documentation
- **React Docs**: https://react.dev
- **Vite Docs**: https://vitejs.dev
- **Testing Library**: https://testing-library.com
- **Axios**: https://axios-http.com

---

## Quick Start

### Prerequisites
- Node.js v24 (see `.nvmrc`)
- npm latest
- Backend API running at `http://localhost:3000`

### Setup (Once Implemented)
```bash
# Clone repository
git clone <repo-url>
cd commentator-frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit VITE_API_BASE_URL if needed

# Start development server
npm run start

# Run tests
npm test

# Lint code
npm run lint
```

---

## Changelog

### 2026-01-13 - Bulk Personalized Comments Feature Complete
- ✅ Implemented all 8 user stories for bulk comment upload
- ✅ Created BulkUploadModal component with state machine pattern
- ✅ Built parseComments utility with 24 edge case tests
- ✅ Built bulkSaveComments utility for sequential API calls with failure tracking
- ✅ 90 total tests created and passing (38 unit, 44 component, 8 integration)
- ✅ Integrated with existing onCreateComment API (no new backend needed)
- ✅ TypeScript strict mode compliance (0 errors)
- ✅ Accessibility audit passed (WCAG 2.1 AA)
- ✅ Created comprehensive feature memory documentation
- **Status**: ✅ PRODUCTION READY - Feature branch `feat/multiple-outcome-comments` ready for PR

### 2025-12-26 - Build & Deployment Readiness Complete
- ✅ Fixed 68 TypeScript build errors → Reduced to 0 errors
- ✅ Corrected 5 failing test assertions → All 1,359 tests now passing
- ✅ Completed ID type migration across component hierarchy
- ✅ Configured TypeScript strict mode with Node.js types
- ✅ Added CSS module type declarations (vite-env.d.ts)
- ✅ Configured path aliases (@/) in both vite and tsconfig
- ✅ Updated .gitignore to exclude build artifacts
- ✅ Created comprehensive validation documentation (5 guides)
- ✅ Generated production-optimized bundle (440KB JS, 8KB CSS, gzipped: 139.36KB JS, 1.41KB CSS)
- **Status**: ✅ PRODUCTION BUILD READY - Feature branch `feat/build-deploy-app` ready for PR

### 2025-10-20 - Class Management Planning Complete
- Created comprehensive requirements document (US-CLASS-001 through US-CLASS-005)
- Designed technical architecture with 23 design elements
- Documented API integration with actual backend specifications
- Created TDD-first task breakdown (19 tasks across 6 phases)
- Established memory documentation structure
- **Status**: Ready for implementation

### 2025-10-20 - Class Management Implementation Complete (Phases 1-4)
- ✅ Implemented all infrastructure, services, hooks, and components
- ✅ 169 unit tests passing across all layers
- ✅ TDD approach followed throughout
- ✅ TypeScript strict mode with no errors
- **Status**: Core implementation complete

### 2025-10-20 - Phase 5 Integration & E2E Testing Complete
- ✅ Backend API contract validated (year field verified)
- ✅ Playwright installed and configured
- ✅ 14 E2E test scenarios created
- ✅ Integration testing infrastructure documented
- **Status**: Testing complete

### 2025-10-20 - Phase 6 Polish & Deployment Complete
- ✅ WCAG 2.1 AA accessibility audit completed (0 violations)
- ✅ Performance optimizations: React.memo(), useCallback(), bundle optimization
- ✅ Bundle size: 99.98 KB (50% under 200 KB target)
- ✅ Memory documentation updated for all phases
- ✅ All linting passing
- **Status**: ✅ **PRODUCTION READY**

---

## Notes

- This is a living document - update after each significant feature completion
- Each feature should have its own memory file in `.github/instructions/memory/features/`
- Link new features to this index as they are added
- Document key decisions and their rationale for future reference
- Keep external resource links up to date

---

**Document Version**: 2.2.0 (Bulk Personalized Comments Complete)
**Maintained By**: System Architect & Development Team
**Last Updated**: 2026-01-13 (Bulk Personalized Comments Feature Complete)
