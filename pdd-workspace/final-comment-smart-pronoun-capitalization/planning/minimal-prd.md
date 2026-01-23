# Minimal PRD: Smart Pronoun Capitalization in Final Comments

**Feature**: Smart Pronoun Capitalization
**Complexity**: L1 (Micro)
**Status**: Planning
**Created**: 2026-01-23

## Problem Statement

When teachers use "Populate with above comments" in the Final Comments modal, pronoun placeholders (`<pronoun>` and `<possessive pronoun>`) are replaced with the selected pronoun values. However, when a pronoun placeholder appears at the start of a sentence (after sentence-ending punctuation: `.`, `!`, `?`), the replacement is lowercase, resulting in grammatically incorrect text.

**Current Behavior:**
- Placeholder replaced: "She did well. she deserves recognition." ❌
- Incorrect grammar when pronoun starts sentence

**Desired Behavior:**
- Smart capitalization: "She did well. She deserves recognition." ✅
- Correct grammar throughout comment

## Business Objective

Improve comment quality and readability by ensuring proper English grammar. Teachers should not need to manually fix capitalization errors after populating comments with pronouns. This reduces manual editing burden and ensures consistently professional comment text.

## User Stories

### US-1: Capitalize Pronouns at Sentence Start

**As a** teacher populating final comments with pronouns
**I want** pronouns to be automatically capitalized when they start a sentence
**So that** my comments are grammatically correct without manual editing

**Acceptance Criteria:**
- When `<pronoun>` is replaced and appears after `.`, `!`, or `?`, capitalize first letter
- When `<possessive pronoun>` is replaced and appears after `.`, `!`, or `?`, capitalize first letter
- Examples:
  - "She is bright. she shows leadership" → "She is bright. She shows leadership"
  - "He participates well. his ideas are valuable" → "He participates well. His ideas are valuable"
  - "They do great work! they always help others" → "They do great work! They always help others"

### US-2: Handle Edge Case - Multiple Sentence Enders

**As a** teacher with complex comment text
**I want** the system to correctly identify sentence starts even with multiple punctuation marks
**So that** capitalization works correctly in all cases

**Acceptance Criteria:**
- Handle ellipsis: "She did well... she will continue improving" → "She did well... She will continue improving"
- Handle punctuation followed by spaces/newlines: Correctly identify sentence boundaries
- Examples:
  - Single space after punctuation: Works correctly
  - Multiple spaces after punctuation: Works correctly
  - Newlines after punctuation: Works correctly

### US-3: Preserve Existing Capitalization

**As a** teacher wanting control over comment text
**I want** the system to only capitalize when the pronoun is lowercase
**So that** I can manually override capitalization if needed

**Acceptance Criteria:**
- If pronoun is already capitalized (e.g., `<PRONOUN>` or capitalized placeholder), don't change it
- Only capitalize if the original pronoun value is lowercase
- This respects any manual edits in the template

## Implementation Context

**Scope**: FinalCommentsModal component
**Location**: Occurs during "Populate with above comments" operation
**Applies to**: Both create and edit modes
**Affects**: `<pronoun>` and `<possessive pronoun>` placeholder replacements

## Success Metrics

| Metric | Target |
|--------|--------|
| Test Coverage | >90% |
| Zero regressions | 100% |
| Edge cases handled | 100% |
| Comment quality improvement | Reduced manual capitalization edits |

## Next Steps

1. Frontend Engineer reviews and clarifies any requirements
2. Frontend Engineer implements capitalization logic in placeholder replacement
3. Comprehensive test coverage for sentence-boundary detection
4. QA validates across different comment templates and pronoun types
5. Product Owner accepts when all criteria met

## Refinement Notes

- Keep logic simple: only detect `.`, `!`, `?` as sentence enders
- No complex NLP or grammar analysis needed
- Lightweight string processing for performance
- Frontend-only solution, no API changes

---

*Minimal PRD - L1 Complexity*
