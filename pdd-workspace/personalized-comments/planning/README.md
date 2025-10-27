# Personalized Comments Management - Epic Documentation

**Feature**: Personalized Comments CRUD Management
**Complexity**: L1-MICRO (1-2 weeks)
**Status**: ✅ Planning Complete - Ready for Implementation
**Created**: 2025-10-27

---

## 📋 Quick Summary

This epic adds a complete CRUD interface for managing **Personalized Comments** - student-specific, freeform text comments that teachers can create and apply to final report cards. The feature mirrors the existing **Outcome Comments** implementation to ensure consistency and ease of development.

### Key Features
- ✅ View all personalized comments for a subject
- ✅ Create new personalized comments (10-500 characters)
- ✅ Edit existing personalized comments
- ✅ Delete personalized comments (with confirmation)
- ✅ Duplicate detection (case-insensitive)
- ✅ Optimistic UI updates with rollback on error
- ✅ Mobile-responsive design

---

## 📊 Complexity Assessment

**Level**: **L1-MICRO**

**Rationale**:
- 5-6 user stories (view, create, edit, delete, UI integration)
- 1-2 weeks effort (11 story points)
- Follows established OutcomeComments patterns
- Backend API already exists and documented
- No external integrations required
- **Architecture review: SKIPPED** (simple CRUD following proven patterns)

**Story Points Breakdown**:
- **MVP** (HIGH priority): 5 story points
- **Post-MVP** (MEDIUM priority): 5 story points
- **Enhancement** (LOW priority): 1 story point
- **Total**: 11 story points

---

## 📁 Documentation Structure

This epic includes the following planning documents:

### 1. **minimal-prd.md** - Product Requirements Document
Complete product specification including:
- Executive summary and business context
- Functional and non-functional requirements
- Technical specifications (backend API + frontend architecture)
- 5 detailed user stories with EARS-format acceptance criteria
- Validation rules and business logic
- Success metrics and KPIs
- Risk assessment and mitigation strategies
- Implementation phases and dependencies

### 2. **user-stories.md** - Detailed User Stories
Comprehensive breakdown of all 5 user stories:
- **US-PERS-001**: View Personalized Comments List (2 points, HIGH)
- **US-PERS-002**: Create New Personalized Comment (3 points, HIGH)
- **US-PERS-003**: Edit Existing Personalized Comment (3 points, MEDIUM)
- **US-PERS-004**: Delete Personalized Comment (2 points, MEDIUM)
- **US-PERS-005**: Navigate Back to Subject List (1 point, LOW)

Each story includes:
- EARS-format acceptance criteria
- Technical implementation notes
- Test coverage requirements
- Definition of Done

### 3. **implementation-guide.md** - Technical Implementation Guide
Step-by-step development plan organized into 5 phases:
- **Phase 1**: Foundation (types, API service, MSW handlers)
- **Phase 2**: State Management (usePersonalizedComments hook)
- **Phase 3**: UI Components (modal, list, form, item)
- **Phase 4**: Integration (App.tsx, SubjectListItem)
- **Phase 5**: E2E Testing & Polish

Includes:
- File structure and naming conventions
- Code snippets and examples
- TDD cycle for each task
- Checklist for Definition of Done

### 4. **metadata.json** - Feature Metadata
Machine-readable metadata for tooling:
- Complexity level and reasoning
- Phase tracking (planning, architecture, implementation)
- Required artifacts

---

## 🎯 User Stories Summary

### MVP Scope (Sprint 1) - 5 Story Points

#### US-PERS-001: View Personalized Comments List
**Priority**: HIGH | **Points**: 2
- Display list of personalized comments for a subject
- Empty state handling
- Loading and error states
- Sort by creation date (newest first)

#### US-PERS-002: Create New Personalized Comment
**Priority**: HIGH | **Points**: 3
- Multi-line text input with character counter (10-500 chars)
- Real-time validation feedback
- Duplicate detection (case-insensitive)
- Optimistic UI updates with rollback

---

### Post-MVP Scope (Sprint 2) - 5 Story Points

#### US-PERS-003: Edit Existing Personalized Comment
**Priority**: MEDIUM | **Points**: 3
- Pre-populate form with existing comment text
- Same validation as create
- Optimistic updates with rollback

#### US-PERS-004: Delete Personalized Comment
**Priority**: MEDIUM | **Points**: 2
- Delete button with confirmation dialog
- Optimistic updates with rollback

---

### Enhancement (Future) - 1 Story Point

#### US-PERS-005: Navigate Back to Subject List
**Priority**: LOW | **Points**: 1
- Close modal and return to subject list
- Unsaved changes warning

---

## 🏗️ Technical Architecture

### Backend API (Already Implemented)

**Entity Structure**:
```typescript
interface PersonalizedComment {
  id: number                  // Auto-generated
  comment: string             // 10-500 characters
  subjectId: number          // Foreign key
  createdAt: string          // ISO 8601
  updatedAt: string          // ISO 8601
}
```

**Endpoints**:
- `GET /personalized-comment?subjectId={id}` - List comments
- `POST /personalized-comment` - Create comment
- `PUT /personalized-comment/{id}` - Update comment
- `DELETE /personalized-comment/{id}` - Delete comment

**Backend API Docs**: http://localhost:3000/api-docs

---

### Frontend Architecture (To Be Implemented)

**File Structure**:
```
src/
├── types/
│   └── PersonalizedComment.ts          # Type definitions
├── services/api/
│   └── personalizedCommentService.ts   # API client
├── hooks/
│   └── usePersonalizedComments.ts      # State management hook
├── components/personalizedComments/
│   ├── PersonalizedCommentsModal.tsx   # Main modal
│   ├── PersonalizedCommentList.tsx     # List view
│   ├── PersonalizedCommentForm.tsx     # Create/edit form
│   └── PersonalizedCommentItem.tsx     # Individual item
├── mocks/
│   ├── handlers.ts                     # MSW handlers (add)
│   └── data/personalizedComments.ts    # Mock data
└── __tests__/
    └── personalizedComments/           # Test files
```

**Integration Points**:
- `App.tsx`: Add PersonalizedCommentsModal state and handlers
- `SubjectListItem.tsx`: Add "Personalized Comments" button

---

## ✅ Success Metrics

### Quantitative Metrics
- **Feature Adoption**: ≥70% of teachers use feature within first month
- **Comment Creation Rate**: Average 10+ comments per subject
- **Error Rate**: < 2% of API requests fail
- **Performance**: 95th percentile page load < 2 seconds
- **Test Coverage**: ≥90% for new code

### Qualitative Metrics
- **User Satisfaction**: 80%+ positive feedback in user testing
- **Usability**: First comment created within 30 seconds (no training)
- **Consistency**: UI/UX matches OutcomeComments patterns

### Key Performance Indicators (KPIs)
- Time to First Comment: < 30 seconds
- Comments Per Session: 3-5 comments average
- Duplicate Detection Success: 100% of duplicates blocked
- Modal Load Time: < 500ms

---

## 🚨 Risk Assessment

### Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| API integration issues | Low | High | Backend API exists; use MSW for testing |
| State management bugs | Low | Medium | Reuse proven useOutcomeComments pattern |
| Duplicate detection edge cases | Medium | Low | Server-side validation is source of truth |

### Business Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Low feature adoption | Low | Medium | Mirror familiar OutcomeComments UX |
| Performance degradation | Low | Medium | Pagination if > 50 comments |

---

## 📅 Implementation Timeline

### Phase 1: Foundation (Days 1-2)
- Create type definitions
- Implement API service
- Add MSW mock handlers
- Write service tests

### Phase 2: State Management (Days 3-4)
- Create usePersonalizedComments hook
- Implement optimistic updates
- Write hook tests

### Phase 3: UI Components (Days 5-7)
- Create modal and list components
- Implement form with validation
- Add edit/delete functionality
- Write component tests

### Phase 4: Integration (Days 8-9)
- Integrate with App.tsx
- Add button to SubjectListItem
- Write integration tests

### Phase 5: E2E Testing & Polish (Day 10)
- Create E2E test suite
- Fix bugs
- Accessibility audit
- Performance optimization

**Total Duration**: 10 business days (2 weeks)

---

## 🎓 Key Differences from OutcomeComments

| Aspect | OutcomeComment | PersonalizedComment |
|---|---|---|
| **Complexity** | Score-based (range validation) | Freeform text only |
| **Fields** | comment, upperRange, lowerRange, subjectId | comment, subjectId |
| **Validation** | Range 0-100, lower ≤ upper | Length 10-500 chars |
| **Use Case** | Score-based feedback | Student-specific feedback |
| **Form Inputs** | 3 inputs (comment + 2 ranges) | 1 input (comment only) |

**Implementation Strategy**: Copy OutcomeComments → Remove range fields → Adapt validation

---

## 🚀 Next Steps

### For Product Owner (You)
1. ✅ Review this epic documentation
2. ✅ Approve PRD and user stories
3. ✅ Prioritize for sprint planning
4. ✅ Hand off to development team

### For Development Team
1. Read all documentation in this folder
2. Follow TDD approach (Red-Green-Refactor)
3. Start with Phase 1 (Foundation)
4. Reference implementation-guide.md for detailed steps

### Handoff Command

When ready to start implementation:

```bash
pdd handoff "frontend developer" "Implement Personalized Comments CRUD feature following TDD approach. All documentation is in pdd-workspace/personalized-comments/planning/"
```

---

## 📚 Related Documentation

- **Backend API Docs**: http://localhost:3000/api-docs
- **Existing OutcomeComments**: Reference implementation in `src/components/outcomeComments/`
- **Project CLAUDE.md**: Development methodology and TDD guidelines
- **TypeScript Style Guide**: Follow existing patterns in `src/types/`

---

## ✅ Definition of Done

- [ ] All 5 user stories implemented
- [ ] Unit tests written (≥90% coverage)
- [ ] Integration tests written
- [ ] E2E tests written (Playwright)
- [ ] All tests passing
- [ ] Code review completed
- [ ] Accessibility audit passed (WCAG 2.1 AA)
- [ ] Performance metrics validated
- [ ] Product Owner acceptance
- [ ] No console errors or warnings
- [ ] Responsive design verified (mobile + desktop)

---

## 📞 Contact & Support

- **Product Owner**: Dean Gaudet
- **Backend API**: http://localhost:3000
- **Project Repository**: commentator-frontend

---

**Status**: ✅ **Planning Phase Complete - Ready for Implementation**

**Last Updated**: 2025-10-27
