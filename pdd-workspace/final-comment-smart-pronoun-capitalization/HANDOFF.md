# Handoff: Smart Pronoun Capitalization Feature

**Handoff Date**: 2026-01-23
**From**: Principal Product Owner
**To**: Principal Frontend Engineer
**Feature**: final-comment-smart-pronoun-capitalization
**Complexity**: L1 (Micro)
**Status**: Ready for Implementation

## Feature Summary

When teachers use "Populate with above comments" in the Final Comments modal, pronoun placeholders are replaced with selected pronoun values. This feature ensures pronouns are automatically capitalized when they:
1. Appear at the very start of the comment text
2. Appear at the start of a sentence (after `.`, `!`, or `?`)

## Requirements

**Minimal PRD Location**: `pdd-workspace/final-comment-smart-pronoun-capitalization/planning/minimal-prd.md`

### User Stories:

**US-1: Capitalize Pronouns at Sentence Start or Text Beginning**
- Capitalize `<pronoun>` and `<possessive pronoun>` placeholders when they appear at text start or after sentence-ending punctuation
- Examples:
  - "she is excellent" → "She is excellent"
  - "his work is great" → "His work is great"
  - "She is bright. she shows leadership" → "She is bright. She shows leadership"

**US-2: Handle Edge Cases**
- Correctly handle ellipsis, multiple spaces, and newlines after punctuation
- Examples: "She did well... she will continue" → "She did well... She will continue"

**US-3: Preserve Existing Capitalization**
- Only capitalize lowercase pronouns
- Don't override manual capitalization if already present in template

## Acceptance Criteria

✅ Pronouns capitalized at text start
✅ Pronouns capitalized after `.`, `!`, `?`
✅ Possessive pronouns handled correctly
✅ Edge cases (ellipsis, spaces, newlines) handled
✅ Existing capitalization preserved
✅ Works in both create and edit modes
✅ Test coverage >90%
✅ Zero regressions in existing tests

## Success Metrics

| Metric | Target |
|--------|--------|
| Test Coverage | >90% |
| Regressions | 0 |
| Edge Cases Covered | 100% |

## Technical Context

**Component**: FinalCommentsModal
**Implementation Type**: Text processing during "Populate with above comments"
**Scope**: Frontend-only, no API changes
**Effort**: ~1-2 weeks

## What's Included

- ✅ Minimal PRD with complete requirements
- ✅ 3 well-defined user stories with acceptance criteria
- ✅ Concrete examples for all scenarios
- ✅ Edge case documentation
- ✅ Success metrics defined

## Development Approach

Follow Test-Driven Development (Red-Green-Refactor):

1. **RED**: Write failing tests for all acceptance criteria
2. **GREEN**: Implement capitalization logic to pass tests
3. **REFACTOR**: Optimize and clean up code

## Next Steps

1. Frontend Engineer reviews minimal-prd.md and clarifies any questions
2. Frontend Engineer creates failing test suite covering all scenarios
3. Frontend Engineer implements placeholder replacement with smart capitalization
4. Frontend Engineer ensures >90% test coverage and zero regressions
5. Product Owner accepts when all criteria met

## Questions/Clarifications

If you need clarification on any requirements, the minimal-prd.md has comprehensive examples and edge case documentation.

---

*Feature ready for implementation*
*All requirements documented and validated*
