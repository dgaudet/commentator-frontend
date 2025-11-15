# Product Requirements Document (PRD)
# Personalized Comments Rating System

**Feature Name**: Personalized Comments Rating System
**Complexity Level**: L2-SMALL
**Estimated Duration**: 2-3 weeks
**Story Points**: 21
**PRD Version**: 1.0
**Date**: 2025-01-15
**Product Owner**: Principal Product Owner

---

## Executive Summary

Enhance the Personalized Comments system with a 5-level emoji-based rating system to help teachers categorize and prioritize comments by sentiment/quality. Comments will be sorted by rating in dropdowns and lists. Additionally, enable teachers to select multiple personalized comments in the Final Comments modal and reorder them via drag-and-drop before populating the final comment field.

**Business Value**: Improves teacher efficiency by surfacing the most positive/useful comments first, and provides flexibility to combine multiple personalized comments in custom order for richer, more personalized student feedback.

---

## Problem Statement

### Current Pain Points
1. **No Comment Quality Indicator**: Teachers cannot easily identify which personalized comments are most positive or effective
2. **Linear Comment Order**: Comments are displayed in creation order or alphabetically, not by quality/sentiment
3. **Single Comment Selection**: Teachers can only select one personalized comment at a time in Final Comments modal
4. **No Custom Ordering**: When using multiple comments, teachers cannot control the order in which they appear

### User Impact
- Teachers waste time scrolling through unordered comments to find the most appropriate feedback
- Limited flexibility in combining multiple personalized comments
- Missed opportunity to reuse high-quality comments more effectively

---

## Goals and Objectives

### Primary Goals
1. Enable teachers to rate personalized comments on a 5-level emoji scale (😢 to 😊)
2. Sort personalized comments by rating (highest to lowest) in all interfaces
3. Allow selection of multiple personalized comments in Final Comments modal
4. Enable drag-and-drop reordering of selected comments before populating final comment

### Success Metrics
- **Adoption Rate**: 80%+ of teachers use rating system within 2 weeks of launch
- **Comment Reuse**: 30% increase in high-rated comment reuse (4-5 stars)
- **Multi-Select Usage**: 40%+ of final comments use 2+ personalized comments
- **User Satisfaction**: 90%+ positive feedback on rating system UX

### Non-Goals (Out of Scope)
- Rating system for outcome comments (separate feature)
- Analytics/reporting on comment ratings (future phase)
- Sharing/exporting highly-rated comments (future phase)
- AI-suggested ratings based on sentiment analysis (future phase)

---

## User Stories

### Epic 1: Rating System Foundation
**Epic Goal**: Add rating functionality to PersonalizedComment entity and UI

#### US-RATING-001: Add Rating Field to PersonalizedComment Entity
**Priority**: HIGH (MVP - Must Have)
**Story Points**: 2
**Complexity**: Simple data model change

**User Story**:
As a **teacher**, I want **each personalized comment to have a rating field** so that **I can categorize comments by sentiment/quality**.

**Acceptance Criteria** (EARS Format):
1. **WHEN** the PersonalizedComment type is updated, **THE SYSTEM SHALL** include a `rating` field (number, 1-5, nullable, default: 3)
2. **WHEN** existing personalized comments are loaded, **THE SYSTEM SHALL** display a default rating of 3 (😐 Neutral) for comments without a rating
3. **WHEN** a new personalized comment is created, **THE SYSTEM SHALL** default the rating to 3 (😐 Neutral)
4. **WHEN** the backend API returns personalized comments, **THE SYSTEM SHALL** include the rating value in the response

**Technical Notes**:
- Type definition: `src/types/PersonalizedComment.ts`
- Add field: `rating?: number | null`
- Backend API already updated per user confirmation

**Risk**: LOW - Straightforward type addition

---

#### US-RATING-002: Display Rating in PersonalizedCommentsModal List View
**Priority**: HIGH (MVP - Must Have)
**Story Points**: 2
**Complexity**: UI enhancement

**User Story**:
As a **teacher**, I want to **see emoji ratings next to each comment in the list view** so that **I can quickly identify comment quality**.

**Acceptance Criteria** (EARS Format):
1. **WHEN** viewing the PersonalizedCommentsModal, **THE SYSTEM SHALL** display the rating emoji next to each comment text
2. **WHEN** a comment has rating 1, **THE SYSTEM SHALL** display 😢 (Very Negative)
3. **WHEN** a comment has rating 2, **THE SYSTEM SHALL** display 😟 (Negative)
4. **WHEN** a comment has rating 3, **THE SYSTEM SHALL** display 😐 (Neutral)
5. **WHEN** a comment has rating 4, **THE SYSTEM SHALL** display 🙂 (Positive)
6. **WHEN** a comment has rating 5, **THE SYSTEM SHALL** display 😊 (Very Positive)
7. **WHEN** hovering over the rating emoji, **THE SYSTEM SHALL** show a tooltip with the numeric rating (e.g., "Rating: 4/5")

**UI Mockup**:
```
┌─────────────────────────────────────────┐
│ Existing Personalized Comments          │
├─────────────────────────────────────────┤
│ 😊 Great progress this semester         │
│    Score: 85-100                        │
│    [Edit] [Delete]                      │
├─────────────────────────────────────────┤
│ 🙂 Good effort and improvement          │
│    Score: 70-84                         │
│    [Edit] [Delete]                      │
├─────────────────────────────────────────┤
│ 😐 Satisfactory work                    │
│    Score: 60-69                         │
│    [Edit] [Delete]                      │
└─────────────────────────────────────────┘
```

**Risk**: LOW - Visual enhancement only

---

#### US-RATING-003: Add/Edit Rating with Emoji Selector
**Priority**: HIGH (MVP - Must Have)
**Story Points**: 3
**Complexity**: Interactive component with state management

**User Story**:
As a **teacher**, I want to **add or edit a rating using an emoji selector** so that **I can categorize comments by sentiment**.

**Acceptance Criteria** (EARS Format):
1. **WHEN** creating a new personalized comment, **THE SYSTEM SHALL** display an emoji rating selector above the comment textarea
2. **WHEN** editing an existing comment, **THE SYSTEM SHALL** pre-select the current rating in the emoji selector
3. **WHEN** clicking on an emoji, **THE SYSTEM SHALL** update the rating value (1-5)
4. **WHEN** hovering over each emoji, **THE SYSTEM SHALL** display a tooltip explaining the rating level
   - 😢 "Very Negative (1/5)"
   - 😟 "Negative (2/5)"
   - 😐 "Neutral (3/5)"
   - 🙂 "Positive (4/5)"
   - 😊 "Very Positive (5/5)"
5. **WHEN** the selected rating is clicked again, **THE SYSTEM SHALL** keep it selected (no toggle-off behavior)
6. **WHEN** saving the comment, **THE SYSTEM SHALL** persist the rating value to the backend
7. **WHEN** the save succeeds, **THE SYSTEM SHALL** update the list view with the new rating

**UI Component Specification**:
```tsx
<div className="rating-selector">
  <label>Rating</label>
  <div className="emoji-buttons">
    <button aria-label="Very Negative (1/5)" className={rating === 1 ? 'selected' : ''}>😢</button>
    <button aria-label="Negative (2/5)" className={rating === 2 ? 'selected' : ''}>😟</button>
    <button aria-label="Neutral (3/5)" className={rating === 3 ? 'selected' : ''}>😐</button>
    <button aria-label="Positive (4/5)" className={rating === 4 ? 'selected' : ''}>🙂</button>
    <button aria-label="Very Positive (5/5)" className={rating === 5 ? 'selected' : ''}>😊</button>
  </div>
</div>
```

**Design Tokens**:
- Selected emoji: `border: 2px solid ${colors.primary[500]}`, `background: ${colors.primary[50]}`
- Hover state: `background: ${colors.neutral[100]}`
- Emoji size: `fontSize: typography.fontSize['2xl']`

**Risk**: MEDIUM - New interactive component, ensure keyboard accessibility

---

#### US-RATING-004: Sort Personalized Comments by Rating
**Priority**: HIGH (MVP - Must Have)
**Story Points**: 2
**Complexity**: Sorting logic implementation

**User Story**:
As a **teacher**, I want **personalized comments sorted by rating (highest to lowest)** so that **I see the most positive comments first**.

**Acceptance Criteria** (EARS Format):
1. **WHEN** loading personalized comments in PersonalizedCommentsModal, **THE SYSTEM SHALL** sort comments by rating descending (5 → 1)
2. **WHEN** multiple comments have the same rating, **THE SYSTEM SHALL** sort them alphabetically by comment text
3. **WHEN** a comment rating is updated, **THE SYSTEM SHALL** re-sort the list automatically
4. **WHEN** a new comment is added, **THE SYSTEM SHALL** insert it in the correct position based on rating

**Sorting Priority**:
1. Rating (descending: 5, 4, 3, 2, 1)
2. Comment text (ascending: A-Z)

**Technical Implementation**:
```typescript
const sortedComments = [...personalizedComments].sort((a, b) => {
  // Sort by rating descending
  if (b.rating !== a.rating) {
    return b.rating - a.rating
  }
  // Then by comment text ascending
  return a.comment.localeCompare(b.comment)
})
```

**Risk**: LOW - Standard sorting logic

---

### Epic 2: Rating Integration in TypeaheadSearch
**Epic Goal**: Display ratings in dropdown and maintain sorting

#### US-RATING-005: Display Ratings in TypeaheadSearch Dropdown
**Priority**: HIGH (MVP - Must Have)
**Story Points**: 2
**Complexity**: TypeaheadSearch component enhancement

**User Story**:
As a **teacher**, I want to **see rating emojis in the personalized comment dropdown** so that **I can quickly identify high-quality comments**.

**Acceptance Criteria** (EARS Format):
1. **WHEN** typing in the personalized comment search field, **THE SYSTEM SHALL** display rating emojis before each comment in the dropdown
2. **WHEN** the dropdown items are rendered, **THE SYSTEM SHALL** sort them by rating (highest to lowest)
3. **WHEN** multiple comments match the search query, **THE SYSTEM SHALL** maintain rating-based sorting
4. **WHEN** selecting a comment from the dropdown, **THE SYSTEM SHALL** populate the search field with the comment text (without emoji)

**UI Mockup**:
```
┌────────────────────────────────────────┐
│ Personalized Comment (Optional)        │
├────────────────────────────────────────┤
│ Search: "progress"                     │
├────────────────────────────────────────┤
│ 😊 Great progress this semester        │
│ 🙂 Good progress and effort            │
│ 😐 Shows progress in some areas        │
└────────────────────────────────────────┘
```

**Technical Notes**:
- Modify `TypeaheadSearch` component to accept emoji prefix
- Pass `getItemPrefix` prop: `(item) => getRatingEmoji(item.rating)`
- Ensure dropdown items are pre-sorted by rating before filtering

**Risk**: LOW - TypeaheadSearch already supports custom rendering

---

### Epic 3: Multi-Select and Reordering in FinalCommentsModal
**Epic Goal**: Enable multiple personalized comment selection with drag-and-drop ordering

#### US-RATING-006: Multi-Select Personalized Comments
**Priority**: HIGH (MVP - Must Have)
**Story Points**: 5
**Complexity**: Complex UI redesign with state management

**User Story**:
As a **teacher**, I want to **select multiple personalized comments** so that **I can combine them in the final comment**.

**Acceptance Criteria** (EARS Format):
1. **WHEN** viewing the FinalCommentsModal add/edit form, **THE SYSTEM SHALL** replace the TypeaheadSearch component with a multi-select list
2. **WHEN** rendering the multi-select list, **THE SYSTEM SHALL** display all personalized comments sorted by rating (highest first)
3. **WHEN** clicking on an unselected comment, **THE SYSTEM SHALL** add it to the "Selected Comments" section
4. **WHEN** clicking on a selected comment in the list, **THE SYSTEM SHALL** remove it from the "Selected Comments" section
5. **WHEN** a comment is selected, **THE SYSTEM SHALL** display a checkmark or visual indicator
6. **WHEN** no comments are selected, **THE SYSTEM SHALL** disable the "Populate with Above Comments" button
7. **WHEN** one or more comments are selected, **THE SYSTEM SHALL** enable the "Populate with Above Comments" button

**UI Mockup (Add Form)**:
```
┌─────────────────────────────────────────────┐
│ Personalized Comments (Optional)            │
├─────────────────────────────────────────────┤
│ Available Comments (click to select):       │
│ ┌─────────────────────────────────────────┐ │
│ │ ☐ 😊 Great progress this semester       │ │
│ │ ☐ 🙂 Good effort and improvement        │ │
│ │ ☑ 😐 Satisfactory work                  │ │ ← Selected
│ └─────────────────────────────────────────┘ │
├─────────────────────────────────────────────┤
│ Selected Comments (1):                      │
│ ┌─────────────────────────────────────────┐ │
│ │ 1. 😐 Satisfactory work                 │ │
│ │    [↑] [↓] [✕]                          │ │
│ └─────────────────────────────────────────┘ │
├─────────────────────────────────────────────┤
│ [Populate with Above Comments] ← Enabled    │
└─────────────────────────────────────────────┘
```

**Design Specification**:
- **Available Comments List**:
  - Max height: 200px with scroll
  - Checkbox-style interaction
  - Hover state: `background: ${colors.neutral[100]}`
  - Selected state: checkmark + `background: ${colors.primary[50]}`
- **Selected Comments Section**:
  - Display in order (top to bottom = first to last in final comment)
  - Show numeric order: "1.", "2.", "3."
  - Reorder controls: Up/Down arrows or drag handle
  - Remove button: ✕ icon

**State Management**:
```typescript
const [selectedComments, setSelectedComments] = useState<PersonalizedComment[]>([])

const handleToggleComment = (comment: PersonalizedComment) => {
  if (selectedComments.find(c => c.id === comment.id)) {
    setSelectedComments(selectedComments.filter(c => c.id !== comment.id))
  } else {
    setSelectedComments([...selectedComments, comment])
  }
}
```

**Risk**: MEDIUM - Requires significant UI redesign and state management

---

#### US-RATING-007: Drag-and-Drop Reordering of Selected Comments
**Priority**: MEDIUM (Post-MVP - Should Have)
**Story Points**: 5
**Complexity**: Complex interaction requiring drag-and-drop library

**User Story**:
As a **teacher**, I want to **reorder selected personalized comments via drag-and-drop** so that **they appear in my preferred sequence in the final comment**.

**Acceptance Criteria** (EARS Format):
1. **WHEN** viewing the "Selected Comments" section, **THE SYSTEM SHALL** enable drag-and-drop reordering
2. **WHEN** dragging a selected comment, **THE SYSTEM SHALL** show a visual drag indicator
3. **WHEN** dropping a comment in a new position, **THE SYSTEM SHALL** update the order immediately
4. **WHEN** the order is changed, **THE SYSTEM SHALL** update the numeric indicators (1, 2, 3...)
5. **WHEN** clicking "Populate with Above Comments", **THE SYSTEM SHALL** concatenate selected comments in the displayed order
6. **WHEN** keyboard navigation is used (Alt+Up/Down), **THE SYSTEM SHALL** reorder the focused comment
7. **WHEN** screen reader is active, **THE SYSTEM SHALL** announce position changes (e.g., "Moved from position 2 to position 1")

**Technical Implementation**:
- Library recommendation: `@dnd-kit/core` or `react-beautiful-dnd`
- Alternative: Manual implementation with up/down arrow buttons (simpler, more accessible)

**Drag-and-Drop Behavior**:
```typescript
const handleDragEnd = (event: DragEndEvent) => {
  const { active, over } = event
  if (over && active.id !== over.id) {
    setSelectedComments((items) => {
      const oldIndex = items.findIndex(item => item.id === active.id)
      const newIndex = items.findIndex(item => item.id === over.id)
      return arrayMove(items, oldIndex, newIndex)
    })
  }
}
```

**Accessibility**:
- Keyboard support: Tab to focus, Space to grab, Arrow keys to move, Space to drop
- Screen reader announcements: "Grabbed item 1 of 3", "Moved to position 2"
- ARIA attributes: `aria-grabbed`, `aria-dropeffect`, `role="listbox"`

**Risk**: HIGH - Drag-and-drop interactions are complex and require careful accessibility implementation

**Fallback Option** (if drag-and-drop proves too complex):
- Use up/down arrow buttons for reordering
- Simpler implementation, better accessibility
- Same functional outcome

---

#### US-RATING-008: Populate Final Comment with Ordered Multi-Select
**Priority**: HIGH (MVP - Must Have)
**Story Points**: 3
**Complexity**: Integration logic update

**User Story**:
As a **teacher**, I want **selected personalized comments to populate the final comment in the order I arranged them** so that **the final comment reads naturally**.

**Acceptance Criteria** (EARS Format):
1. **WHEN** clicking "Populate with Above Comments" with multiple selected comments, **THE SYSTEM SHALL** concatenate comments in displayed order
2. **WHEN** combining comments, **THE SYSTEM SHALL** apply placeholder replacement to each comment individually (using student data)
3. **WHEN** concatenating comments, **THE SYSTEM SHALL** separate them with a single space (matching existing behavior)
4. **WHEN** the concatenated text exceeds 1000 characters, **THE SYSTEM SHALL** truncate to 1000 characters
5. **WHEN** populating the textarea, **THE SYSTEM SHALL** preserve the outcome comment at the beginning (if present)
6. **WHEN** the textarea already has content, **THE SYSTEM SHALL** show the overwrite confirmation dialog

**Concatenation Order**:
1. Outcome comment (based on grade) - if present
2. Selected personalized comments (in displayed order)
3. Separated by single space: `"[outcome] [personal1] [personal2] [personal3]"`

**Implementation Update** (modify existing `handlePopulateConfirm`):
```typescript
// Current: Single selectedPersonalComment
// New: Array of selectedPersonalComments in order

const parts: string[] = []

// Add outcome comment
if (form.matchedOutcomeComment) {
  const trimmed = form.matchedOutcomeComment.trim()
  if (trimmed) {
    parts.push(replacePlaceholders(trimmed, studentData))
  }
}

// Add selected personalized comments IN ORDER
selectedComments.forEach((comment) => {
  const trimmed = comment.comment.trim()
  if (trimmed) {
    parts.push(replacePlaceholders(trimmed, studentData))
  }
})

let populatedText = parts.join(' ')
if (populatedText.length > 1000) {
  populatedText = populatedText.substring(0, 1000)
}

form.setComment(populatedText)
```

**Risk**: LOW - Straightforward extension of existing logic

---

### Epic 4: Data Migration and Accessibility
**Epic Goal**: Ensure smooth transition and inclusive UX

#### US-RATING-009: Default Rating for Existing Comments
**Priority**: HIGH (MVP - Data Migration)
**Story Points**: 1
**Complexity**: Simple default value handling

**User Story**:
As a **teacher**, I want **all my existing personalized comments to have a default rating of 3 (😐 Neutral)** so that **they appear in the sorted list without manual updates**.

**Acceptance Criteria** (EARS Format):
1. **WHEN** loading existing personalized comments without a rating field, **THE SYSTEM SHALL** default the rating to 3 (😐 Neutral)
2. **WHEN** displaying comments with null/undefined ratings, **THE SYSTEM SHALL** show the 😐 emoji
3. **WHEN** editing a comment with no rating, **THE SYSTEM SHALL** pre-select 3 (😐 Neutral) in the emoji selector
4. **WHEN** saving a comment without explicitly changing the rating, **THE SYSTEM SHALL** persist rating = 3

**Migration Strategy**:
- **Frontend-only**: Apply default rating = 3 when `rating` is null/undefined
- **No backend migration needed** per user confirmation (backend already updated)

**Technical Implementation**:
```typescript
// In PersonalizedComment type guard or utility function
const getNormalizedRating = (comment: PersonalizedComment): number => {
  return comment.rating ?? 3
}
```

**Risk**: LOW - Simple default value logic

---

#### US-RATING-010: Accessibility for Rating System
**Priority**: HIGH (MVP - Accessibility)
**Story Points**: 2
**Complexity**: ARIA and keyboard navigation enhancements

**User Story**:
As a **teacher using a screen reader**, I want **the rating system to be fully accessible** so that **I can rate and sort comments without a mouse**.

**Acceptance Criteria** (EARS Format):
1. **WHEN** navigating to the emoji rating selector, **THE SYSTEM SHALL** announce "Rating selector, 5 options, currently Neutral (3 of 5)"
2. **WHEN** focusing on each emoji button, **THE SYSTEM SHALL** announce the rating level (e.g., "Very Positive, 5 of 5")
3. **WHEN** selecting an emoji via keyboard (Space/Enter), **THE SYSTEM SHALL** announce "Rating updated to [level]"
4. **WHEN** viewing the personalized comments list, **THE SYSTEM SHALL** include rating in accessible name (e.g., "Great progress this semester, rating Very Positive (5 of 5)")
5. **WHEN** using the multi-select list, **THE SYSTEM SHALL** support keyboard navigation (Tab, Space to select, Enter to confirm)
6. **WHEN** reordering selected comments, **THE SYSTEM SHALL** provide keyboard shortcuts (Alt+Up/Down or Ctrl+Up/Down)
7. **WHEN** reordering, **THE SYSTEM SHALL** announce "Moved [comment text] from position [old] to position [new]"

**ARIA Attributes**:
- Emoji selector: `role="radiogroup"`, `aria-label="Rating selector"`
- Each emoji button: `role="radio"`, `aria-checked="true|false"`, `aria-label="[Level] ([n] of 5)"`
- Multi-select list: `role="listbox"`, `aria-multiselectable="true"`
- Selected comments list: `role="list"`, with `role="listitem"` and `aria-posinset`, `aria-setsize`

**Keyboard Navigation**:
- **Emoji selector**: Arrow keys to navigate, Space/Enter to select
- **Multi-select list**: Tab to focus, Space to toggle selection
- **Reordering**: Alt+Up/Down to move focused item (or provide explicit up/down buttons)

**Risk**: MEDIUM - Accessibility for drag-and-drop is complex; fallback to button-based reordering recommended

---

## User Experience (UX) Design

### Information Architecture

**PersonalizedCommentsModal Changes**:
```
[Header: Manage Personalized Comments]
├── Add New Comment Form
│   ├── Rating Selector (NEW: Emoji buttons 😢😟😐🙂😊)
│   ├── Comment Textarea
│   ├── Score Range Inputs
│   └── [Add Comment] Button
└── Existing Comments List (Sorted by Rating ↓)
    ├── 😊 Comment 1 (rating 5)
    ├── 😊 Comment 2 (rating 5)
    ├── 🙂 Comment 3 (rating 4)
    └── 😐 Comment 4 (rating 3)
```

**FinalCommentsModal Changes**:
```
[Header: Add/Edit Final Comment]
├── Student Info (First Name, Last Name, Grade)
├── Outcome Comment (auto-populated based on grade)
├── Personalized Comments (NEW DESIGN)
│   ├── Available Comments (multi-select list, sorted by rating)
│   │   ├── ☐ 😊 Comment 1
│   │   ├── ☑ 🙂 Comment 2 (selected)
│   │   └── ☐ 😐 Comment 3
│   └── Selected Comments (reorderable list)
│       ├── 1. 🙂 Comment 2 [↑][↓][✕]
│       └── (empty if none selected)
├── [Populate with Above Comments] Button
└── Final Comment Textarea
```

### Visual Design Specifications

**Emoji Rating Scale**:
| Rating | Emoji | Label | Color Accent |
|--------|-------|-------|--------------|
| 1 | 😢 | Very Negative | `colors.semantic.error` |
| 2 | 😟 | Negative | `colors.semantic.warning` |
| 3 | 😐 | Neutral | `colors.neutral[500]` |
| 4 | 🙂 | Positive | `colors.semantic.success` |
| 5 | 😊 | Very Positive | `colors.primary[500]` |

**Emoji Selector Component**:
- Button size: `48px × 48px`
- Emoji font size: `typography.fontSize['2xl']` (24px)
- Spacing: `spacing.md` (12px) between buttons
- Selected state: `border: 2px solid ${colors.primary[500]}`, `background: ${colors.primary[50]}`
- Hover state: `background: ${colors.neutral[100]}`, `scale: 1.1`

**Multi-Select List**:
- Item height: `56px`
- Max height: `200px` with scroll
- Checkbox size: `20px × 20px`
- Selected background: `colors.primary[50]`
- Border: `borders.width.thin solid ${colors.border.default}`

**Selected Comments List**:
- Item background: `colors.background.secondary`
- Border: `borders.width.thin solid ${colors.primary[300]}`
- Drag handle: `⋮⋮` icon or explicit [↑][↓] buttons
- Remove button: `✕` icon, `colors.semantic.error`

---

## Technical Specifications

### Data Model Changes

**PersonalizedComment Type Update**:
```typescript
// src/types/PersonalizedComment.ts
export interface PersonalizedComment {
  id: number
  subjectId: number
  comment: string
  upperRange: number
  lowerRange: number
  rating?: number | null  // NEW FIELD: 1-5, default 3
  createdAt: string
  updatedAt: string
}
```

**Default Rating Helper**:
```typescript
// src/utils/personalizedComments.ts
export const getNormalizedRating = (comment: PersonalizedComment): number => {
  return comment.rating ?? 3
}

export const getRatingEmoji = (rating: number): string => {
  switch (rating) {
    case 1: return '😢'
    case 2: return '😟'
    case 3: return '😐'
    case 4: return '🙂'
    case 5: return '😊'
    default: return '😐' // Fallback
  }
}

export const getRatingLabel = (rating: number): string => {
  switch (rating) {
    case 1: return 'Very Negative'
    case 2: return 'Negative'
    case 3: return 'Neutral'
    case 4: return 'Positive'
    case 5: return 'Very Positive'
    default: return 'Neutral'
  }
}
```

### Component Architecture

**New Components**:
1. **EmojiRatingSelector** (`src/components/common/EmojiRatingSelector.tsx`)
   - Props: `value: number`, `onChange: (rating: number) => void`, `disabled?: boolean`
   - Renders 5 emoji buttons with selection state
   - Accessible with keyboard navigation

2. **PersonalizedCommentMultiSelect** (`src/components/finalComments/PersonalizedCommentMultiSelect.tsx`)
   - Props: `comments: PersonalizedComment[]`, `selectedIds: number[]`, `onSelectionChange: (ids: number[]) => void`
   - Renders available comments list (sorted by rating)
   - Checkbox-style interaction

3. **SelectedCommentsList** (`src/components/finalComments/SelectedCommentsList.tsx`)
   - Props: `comments: PersonalizedComment[]`, `onReorder: (newOrder: PersonalizedComment[]) => void`, `onRemove: (id: number) => void`
   - Renders reorderable list with up/down controls
   - Alternative: Drag-and-drop if feasible

**Modified Components**:
1. **PersonalizedCommentsModal** (`src/components/personalizedComments/PersonalizedCommentsModal.tsx`)
   - Add EmojiRatingSelector to add/edit forms
   - Update list view to display rating emoji
   - Implement sorting by rating

2. **FinalCommentsModal** (`src/components/finalComments/FinalCommentsModal.tsx`)
   - Replace TypeaheadSearch with PersonalizedCommentMultiSelect + SelectedCommentsList
   - Update `handlePopulateConfirm` to concatenate multiple comments in order
   - Maintain state for selected comments array

3. **TypeaheadSearch** (`src/components/common/TypeaheadSearch.tsx`)
   - Add optional `getItemPrefix` prop to prepend emoji/icon
   - Ensure dropdown items can be pre-sorted

### Sorting Logic

**Sorting Function** (reusable utility):
```typescript
// src/utils/sorting.ts
export const sortPersonalizedCommentsByRating = (
  comments: PersonalizedComment[]
): PersonalizedComment[] => {
  return [...comments].sort((a, b) => {
    const ratingA = getNormalizedRating(a)
    const ratingB = getNormalizedRating(b)

    // Sort by rating descending (5 → 1)
    if (ratingB !== ratingA) {
      return ratingB - ratingA
    }

    // Then by comment text ascending (A → Z)
    return a.comment.localeCompare(b.comment)
  })
}
```

**Usage**:
- PersonalizedCommentsModal: Apply on load and after updates
- TypeaheadSearch: Apply before rendering dropdown
- PersonalizedCommentMultiSelect: Apply before rendering available comments list

### State Management

**FinalCommentsModal State** (new state variables):
```typescript
// Multi-select state for personalized comments
const [selectedPersonalizedComments, setSelectedPersonalizedComments] = useState<PersonalizedComment[]>([])

// Toggle selection
const handleTogglePersonalizedComment = (comment: PersonalizedComment) => {
  if (selectedPersonalizedComments.find(c => c.id === comment.id)) {
    setSelectedPersonalizedComments(selectedPersonalizedComments.filter(c => c.id !== comment.id))
  } else {
    setSelectedPersonalizedComments([...selectedPersonalizedComments, comment])
  }
}

// Reorder selected comments
const handleReorderPersonalizedComments = (newOrder: PersonalizedComment[]) => {
  setSelectedPersonalizedComments(newOrder)
}

// Remove from selected
const handleRemovePersonalizedComment = (id: number) => {
  setSelectedPersonalizedComments(selectedPersonalizedComments.filter(c => c.id !== id))
}
```

---

## Testing Strategy

### Unit Tests

**EmojiRatingSelector Component**:
- Renders 5 emoji buttons
- Pre-selects correct emoji based on `value` prop
- Calls `onChange` when emoji is clicked
- Shows tooltip on hover with rating label
- Keyboard navigation (Tab, Arrow keys, Space/Enter)
- Accessibility: ARIA attributes, screen reader announcements

**PersonalizedCommentMultiSelect Component**:
- Renders all comments sorted by rating
- Displays emoji next to each comment
- Toggles selection state on click
- Calls `onSelectionChange` with updated array
- Keyboard navigation (Tab, Space)

**SelectedCommentsList Component**:
- Renders comments in given order with numeric indicators
- Calls `onReorder` when up/down button clicked
- Calls `onRemove` when remove button clicked
- Drag-and-drop (if implemented): Reorders on drop event
- Keyboard navigation (Alt+Up/Down if drag-and-drop, or Tab + Space/Enter for buttons)

**Sorting Utility**:
- Sorts by rating descending (5 → 1)
- Sorts by comment text ascending for same rating
- Handles null/undefined ratings (defaults to 3)

**Rating Helpers**:
- `getNormalizedRating`: Returns 3 for null/undefined
- `getRatingEmoji`: Returns correct emoji for rating 1-5
- `getRatingLabel`: Returns correct label for rating 1-5

### Integration Tests

**PersonalizedCommentsModal**:
- Add comment with rating: Creates comment with selected rating
- Edit comment rating: Updates rating and re-sorts list
- List view: Displays comments sorted by rating
- Emoji display: Shows correct emoji for each rating

**FinalCommentsModal (Multi-Select)**:
- Select multiple comments: Adds to selected list
- Deselect comment: Removes from selected list
- Reorder selected comments: Updates order
- Populate button: Enabled when comments selected, disabled when none
- Populate with multiple: Concatenates in correct order with placeholders replaced

**TypeaheadSearch (with ratings)**:
- Dropdown displays emojis next to comments
- Dropdown items sorted by rating
- Selecting comment populates field with text (no emoji)

### End-to-End (E2E) Tests

**Scenario 1: Teacher Rates Personalized Comments**
1. Navigate to PersonalizedCommentsModal
2. Create new comment with rating 5 (😊)
3. Verify comment appears at top of list
4. Edit existing comment, change rating from 3 to 1
5. Verify comment moves to bottom of list

**Scenario 2: Teacher Uses Multi-Select in Final Comments**
1. Navigate to FinalCommentsModal
2. Enter student name and grade
3. Select 3 personalized comments from multi-select list
4. Reorder selected comments (move 3rd to 1st position)
5. Click "Populate with Above Comments"
6. Verify final comment textarea contains all 3 comments in reordered sequence
7. Verify placeholders replaced with student data

**Scenario 3: Accessibility - Keyboard Navigation**
1. Navigate to PersonalizedCommentsModal using Tab key
2. Focus on emoji rating selector
3. Use Arrow keys to navigate between emojis
4. Press Space to select rating
5. Verify screen reader announces "Rating updated to [level]"

---

## Risks and Mitigation

| Risk | Probability | Impact | Mitigation Strategy |
|------|-------------|--------|---------------------|
| **Drag-and-drop complexity** | HIGH | MEDIUM | Use simpler up/down button approach instead of drag-and-drop library |
| **Multi-select UX confusion** | MEDIUM | MEDIUM | Provide clear visual indicators, user testing before launch |
| **Performance with many comments** | LOW | LOW | Implement virtualized scrolling if comment count exceeds 100 |
| **Rating data migration issues** | LOW | HIGH | Apply default rating on frontend; backend already updated per user |
| **Accessibility gaps in custom interactions** | MEDIUM | HIGH | Thorough keyboard and screen reader testing; follow WCAG 2.1 AA guidelines |
| **State management bugs in reordering** | MEDIUM | MEDIUM | Comprehensive unit tests for reorder logic; state immutability patterns |

---

## Dependencies

### External Dependencies
- **None** - Feature uses existing libraries (React, TypeScript, design tokens)

### Optional Dependencies (if drag-and-drop implemented)
- `@dnd-kit/core` (recommended) or `react-beautiful-dnd`

### Internal Dependencies
- Design token system (colors, spacing, typography)
- Existing components: Button, Input, TypeaheadSearch
- Existing services: personalizedCommentService
- Existing hooks: usePersonalizedComments

---

## Rollout Plan

### Phase 1: Foundation (Week 1)
- **US-RATING-001**: Add rating field to type definition
- **US-RATING-002**: Display ratings in list view
- **US-RATING-003**: Add/edit rating with emoji selector
- **US-RATING-004**: Sort by rating in PersonalizedCommentsModal
- **US-RATING-009**: Default rating for existing comments

**Deliverable**: Teachers can rate comments and see them sorted by rating

---

### Phase 2: Integration (Week 2)
- **US-RATING-005**: Display ratings in TypeaheadSearch dropdown
- **US-RATING-006**: Multi-select personalized comments in FinalCommentsModal
- **US-RATING-008**: Populate with multiple comments in order

**Deliverable**: Teachers can select multiple comments and populate final comment

---

### Phase 3: Reordering & Polish (Week 2-3)
- **US-RATING-007**: Drag-and-drop (or button-based) reordering
- **US-RATING-010**: Accessibility enhancements and testing
- Bug fixes and UX refinements

**Deliverable**: Teachers can reorder selected comments; fully accessible feature

---

## Success Criteria

### Functional Success
- ✅ Teachers can rate personalized comments (1-5 emoji scale)
- ✅ Comments are sorted by rating in all interfaces
- ✅ Teachers can select multiple personalized comments in Final Comments modal
- ✅ Selected comments can be reordered before populating final comment
- ✅ Placeholder replacement works with multiple comments
- ✅ Existing comments default to rating 3 (😐 Neutral)

### Quality Success
- ✅ All acceptance criteria met for each user story
- ✅ 90%+ test coverage for new components and logic
- ✅ Zero accessibility violations (WCAG 2.1 AA)
- ✅ Linting passes with no warnings

### Business Success
- ✅ 80%+ adoption of rating system within 2 weeks
- ✅ 30% increase in reuse of high-rated comments (4-5 stars)
- ✅ 40%+ of final comments use 2+ personalized comments
- ✅ 90%+ positive user feedback on UX

---

## Open Questions

1. **Should we add a "Clear All" button in the selected comments section?**
   - Recommendation: Yes, for bulk deselection

2. **Should we limit the number of selected personalized comments?**
   - Recommendation: Yes, cap at 5 to avoid overly long final comments

3. **Should we persist the last used rating when creating new comments?**
   - Recommendation: No, always default to 3 (😐 Neutral) for consistency

4. **Should we add a filter by rating in PersonalizedCommentsModal?**
   - Recommendation: Future enhancement (not MVP)

5. **Should we show a preview of the concatenated comment before populating?**
   - Recommendation: Future enhancement (not MVP)

---

## Appendix

### User Story Summary

| ID | Title | Priority | Points | Risk |
|----|-------|----------|--------|------|
| US-RATING-001 | Add rating field to type | HIGH | 2 | LOW |
| US-RATING-002 | Display rating in list | HIGH | 2 | LOW |
| US-RATING-003 | Add/edit rating selector | HIGH | 3 | MEDIUM |
| US-RATING-004 | Sort by rating | HIGH | 2 | LOW |
| US-RATING-005 | Ratings in dropdown | HIGH | 2 | LOW |
| US-RATING-006 | Multi-select comments | HIGH | 5 | MEDIUM |
| US-RATING-007 | Drag-and-drop reorder | MEDIUM | 5 | HIGH |
| US-RATING-008 | Populate with multi-select | HIGH | 3 | LOW |
| US-RATING-009 | Default rating migration | HIGH | 1 | LOW |
| US-RATING-010 | Accessibility | HIGH | 2 | MEDIUM |
| **TOTAL** | | | **27** | |

---

## Approval & Sign-Off

**Product Owner**: _____________________ Date: _____
**Tech Lead**: _____________________ Date: _____
**UX Designer**: _____________________ Date: _____

---

**Document Status**: DRAFT - Ready for Review
**Next Steps**: Review PRD → Frontend Engineer Implementation → QA Testing → Release
