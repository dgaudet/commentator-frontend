# FinalComments Styling Reference

## Reference Components Analysis

### Input Component Pattern (SubjectForm uses this)

**Label Styling:**
```css
display: block
fontSize: 1.25rem
fontWeight: 500
color: #1E3A5F
marginBottom: 0.75rem
```

**Required Asterisk:**
```css
color: #DC2626
marginLeft: 0.25rem
```

**Input Field Styling:**
```css
display: block
width: 100%
padding: 12px 16px
fontSize: 16px
border: 2px solid #1E3A5F (normal) | 2px solid #DC2626 (error)
borderRadius: 8px
backgroundColor: #F5F8FA
boxShadow: 0 1px 2px rgba(0, 0, 0, 0.05)
outline: none
```

**Container:**
```css
marginBottom: 1.5rem
maxWidth: 500px
```

**Error Message:**
```css
marginTop: 0.5rem
fontSize: 0.875rem
color: #DC2626
```

### Button Component (Already in use)

**Primary Variant:**
```css
backgroundColor: #0066FF
color: #FFFFFF
borderColor: #0066FF
padding: 12px 24px
borderRadius: 8px
fontSize: 16px
fontWeight: 600
boxShadow: 0 1px 3px rgba(0, 0, 0, 0.1)
```

**Secondary Variant:**
```css
backgroundColor: #E5E7EB
color: #1F2937
borderColor: #E5E7EB
```

**Danger Variant:**
```css
backgroundColor: #DC2626
color: #FFFFFF
borderColor: #DC2626
```

## Implementation Strategy

### US-FINAL-STYLE-003: Add Form Styling

Apply Input component styling patterns to:
1. First Name field (required)
2. Last Name field (optional)
3. Grade field (required, number input)
4. Comment field (textarea with character counter)

### US-FINAL-STYLE-004: Edit Form Styling

Apply same patterns to edit form for consistency.

## Character Counter Styling

Based on PersonalizedCommentsModal pattern:
```css
fontSize: 0.875rem
color: #6B7280 (normal)
color: #F59E0B (warning, > 900 chars)
marginTop: 0.25rem
```
