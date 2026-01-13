# Bulk Upload Personalized Comments - Minimal PRD

## Product Overview

Enable teachers to efficiently import multiple personalized comments in bulk, reducing manual entry time when populating comment libraries for a subject. Teachers can paste a list of comments (up to 50) with optional quality ratings, and the system parses, validates, and saves them.

## Problem Statement

Teachers managing student report card comments often need to create personalized comment libraries for their subject areas. Currently, they must enter each comment individually through the form UI, which is time-consuming for initial setup or when importing pre-written comment templates from documents.

## Value Proposition

- **Time Savings**: Import 50 comments in < 1 minute instead of 10-15 minutes manual entry
- **Reduced Friction**: Teachers can copy-paste from Word docs or existing templates directly
- **Flexibility**: Optional quality ratings allow quick imports followed by refinement
- **Error Transparency**: Clear feedback on which lines succeeded/failed enables easy correction

## Solution Overview

Add a "Bulk Upload Comments" button to the Personalized Comments component that opens a modal. Teachers paste comments in the format:
```
comment text, rating
comment text with comma, inside, 4
comment with no rating
```

The system parses each line, validates against existing form rules, assigns default rating (3) if omitted, and displays import results with success/failure summary.

## Target Users

- **Primary**: Teachers setting up personalized comment libraries for a subject
- **Secondary**: School administrators managing comment templates
- **Use Case**: Initial population of comment libraries, template imports from documents

## Feature Scope

### In Scope
✅ Modal dialog with paste-and-parse interface
✅ Line-by-line parsing with comma-separated rating detection
✅ Character limit validation (matching existing form constraints)
✅ Default rating (3) for comments without explicit rating
✅ Failed line tracking with summary report
✅ Subject-scoped imports (current subject only)
✅ Integration with existing personalized comments form

### Out of Scope
❌ File upload (CSV, TXT) - paste-and-parse only
❌ Preview/edit before save
❌ Deduplication (add later if needed)
❌ Cross-subject bulk operations
❌ Scheduled/template imports

## Success Metrics

| Metric | Target | How Measured |
|--------|--------|--------------|
| **Adoption Rate** | 40%+ of teachers | Analytics: % using bulk upload vs manual entry |
| **Time Savings** | 80% reduction for bulk imports | User testing: time to populate 50 comments |
| **Error Rate** | <5% failed lines on valid input | System: track import success rates |
| **User Satisfaction** | 4.0+ / 5.0 | Survey: ease of use after first import |
| **Support Tickets** | <10 per quarter | Support system: bulk upload related issues |

## Key Requirements

### Functional
- Parse comments with optional comma-separated ratings (1-5)
- Handle commas within comment text (last comma+digit pattern = rating)
- Apply character limits per existing form validation
- Assign default rating (3) when omitted
- Track and display failed lines with reasons
- Save successful comments to subject in single operation

### Non-Functional
- **Performance**: Parse 50 comments in <500ms
- **Usability**: Modal clearly explains format with examples
- **Reliability**: All-or-nothing validation (fail fast, don't partially save)
- **Compatibility**: Support all modern browsers (same as main app)

## User Benefits

1. **Speed**: Import comment libraries in minutes instead of manually entering one-by-one
2. **Flexibility**: Use existing Word document templates without reformatting
3. **Clarity**: Immediate feedback on parse errors and what succeeded
4. **Control**: Optional ratings allow fast bulk imports + later refinement

## Business Impact

- **Reduces setup friction** for new teachers creating comment libraries
- **Increases engagement** by making bulk operations frictionless
- **Improves retention** through efficiency gains
- **Competitive advantage** vs manual comment entry in competing tools

## Release Criteria

✅ All user stories completed and tested
✅ Accessibility audit passed (WCAG 2.1 AA)
✅ Cross-browser testing passed
✅ Error messages clear and actionable
✅ Performance meets <500ms requirement
✅ User documentation includes examples and troubleshooting

## Timeline & Complexity

- **Complexity**: L1 (Micro)
- **Estimated Effort**: 1-2 weeks
- **Team Size**: 1-2 developers
- **Key Dependencies**: None (standalone feature)
- **Architecture**: SKIPPED (straightforward pattern)
