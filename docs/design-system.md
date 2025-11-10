# Design System Documentation

**Version**: 1.0
**Last Updated**: 2025-11-10
**Feature**: CSS Standardization (US-CSS-008)

## Table of Contents

1. [Overview](#overview)
2. [Design Tokens](#design-tokens)
3. [Components](#components)
4. [Migration Guide](#migration-guide)
5. [Best Practices](#best-practices)

---

## Overview

This design system provides a centralized approach to styling in the Commentator application. It consists of:

- **Design Tokens**: Reusable style constants for colors, spacing, typography, borders, and shadows
- **Standardized Components**: Reusable React components (Input, Label, Button) built with design tokens
- **Migration Patterns**: Guidelines for converting existing inline styles to the design system

### Benefits

- ✅ **Consistency**: Uniform visual appearance across the application
- ✅ **Maintainability**: Single source of truth for design values
- ✅ **Productivity**: Faster development with reusable components
- ✅ **Type Safety**: Full TypeScript support with autocomplete
- ✅ **Scalability**: Easy to update designs globally

---

## Design Tokens

### 1. Importing Design Tokens

```typescript
import { colors, spacing, typography, borders, shadows } from '../../theme/tokens'
```

### 2. Token Reference

#### Colors

```typescript
// Neutral colors (grays)
colors.neutral[50]   // #F9FAFB (lightest)
colors.neutral[100]  // #F3F4F6
colors.neutral[200]  // #E5E7EB
colors.neutral[300]  // #D1D5DB
colors.neutral[400]  // #9CA3AF
colors.neutral[500]  // #6B7280
colors.neutral[600]  // #4B5563
colors.neutral[700]  // #374151
colors.neutral[800]  // #1F2937
colors.neutral[900]  // #111827 (darkest)

// Primary brand colors
colors.primary.main   // #0066FF (buttons, links)
colors.primary.dark   // #0052CC (hover states)
colors.primary.light  // #3D8BFF (backgrounds)

// Semantic colors
colors.semantic.error      // #DC2626 (errors, danger)
colors.semantic.errorDark  // #B91C1C (error hover)
colors.semantic.errorLight // #FEE2E2 (error backgrounds)
colors.semantic.success    // #10B981 (success states)

// Background colors
colors.background.primary   // #FFFFFF (main background)
colors.background.secondary // #F9FAFB (subtle contrast)
colors.background.tertiary  // #F5F8FA (deeper contrast)

// Border colors
colors.border.default // #E5E7EB (standard borders)
colors.border.focus   // #0066FF (focus states)
colors.border.error   // #DC2626 (validation errors)

// Text colors
colors.text.primary   // #111827 (headings, primary text)
colors.text.secondary // #374151 (labels, secondary text)
colors.text.tertiary  // #6B7280 (hints, metadata)
colors.text.disabled  // #9CA3AF (disabled state)
colors.text.inverse   // #FFFFFF (text on dark backgrounds)
```

#### Spacing

```typescript
spacing.xs    // 0.25rem (4px)  - tight spacing
spacing.sm    // 0.5rem  (8px)  - small gaps
spacing.md    // 0.75rem (12px) - medium padding
spacing.lg    // 1rem    (16px) - standard margins
spacing.xl    // 1.5rem  (24px) - large padding
spacing['2xl'] // 2rem  (32px) - section spacing
```

#### Typography

```typescript
// Font sizes
typography.fontSize.xs   // 0.75rem  (12px) - timestamps
typography.fontSize.sm   // 0.875rem (14px) - labels, hints
typography.fontSize.base // 1rem     (16px) - body text
typography.fontSize.lg   // 1.25rem  (20px) - headings
typography.fontSize.xl   // 1.5rem   (24px) - large headings

// Font weights
typography.fontWeight.normal   // 400 - body text
typography.fontWeight.medium   // 500 - labels
typography.fontWeight.semibold // 600 - buttons, emphasis
typography.fontWeight.bold     // 700 - headings

// Line heights
typography.lineHeight.tight   // 1.25 - headings
typography.lineHeight.normal  // 1.5  - body text
typography.lineHeight.relaxed // 1.75 - long-form content
```

#### Borders

```typescript
borders.width.thin  // 1px - standard borders
borders.width.thick // 2px - emphasized borders

borders.radius.sm   // 4px  - subtle rounding
borders.radius.md   // 8px  - standard rounding
borders.radius.lg   // 12px - prominent rounding
borders.radius.full // 9999px - pill shape
```

#### Shadows

```typescript
shadows.sm // '0 1px 2px rgba(0, 0, 0, 0.05)'   - subtle depth
shadows.md // '0 1px 3px rgba(0, 0, 0, 0.1)'    - standard elevation
shadows.lg // '0 4px 6px rgba(0, 0, 0, 0.15)'   - prominent elevation
```

### 3. Usage Examples

#### Before: Hardcoded Values
```typescript
// ❌ DON'T: Hardcoded inline styles
<div style={{
  padding: '12px',
  fontSize: '16px',
  color: '#374151',
  border: '1px solid #E5E7EB',
  borderRadius: '8px',
  marginBottom: '16px',
}}>
  Content
</div>
```

#### After: Design Tokens
```typescript
// ✅ DO: Use design tokens
<div style={{
  padding: spacing.md,
  fontSize: typography.fontSize.base,
  color: colors.text.secondary,
  border: `${borders.width.thin} solid ${colors.border.default}`,
  borderRadius: borders.radius.md,
  marginBottom: spacing.lg,
}}>
  Content
</div>
```

### 4. Common Patterns

#### Standard Input Field Styling
```typescript
<input
  style={{
    width: '100%',
    padding: spacing.md,
    fontSize: typography.fontSize.base,
    border: `${borders.width.thin} solid ${colors.border.default}`,
    borderRadius: borders.radius.md,
    backgroundColor: colors.background.primary,
  }}
/>
```

#### Label Styling
```typescript
<label style={{
  display: 'block',
  fontSize: typography.fontSize.sm,
  fontWeight: typography.fontWeight.medium,
  color: colors.text.secondary,
  marginBottom: spacing.sm,
}}>
  Field Label
</label>
```

#### Section Heading
```typescript
<h3 style={{
  fontSize: typography.fontSize.lg,
  fontWeight: typography.fontWeight.semibold,
  color: colors.text.primary,
  marginBottom: spacing.lg,
}}>
  Section Title
</h3>
```

#### Error/Validation Message
```typescript
<div style={{
  padding: spacing.md,
  marginBottom: spacing.lg,
  backgroundColor: colors.semantic.errorLight,
  border: `${borders.width.thin} solid ${colors.semantic.error}`,
  borderRadius: borders.radius.md,
  color: colors.semantic.error,
  fontSize: typography.fontSize.sm,
}}>
  Validation error message
</div>
```

#### Empty State Container
```typescript
<div style={{
  textAlign: 'center',
  padding: spacing['2xl'],
  backgroundColor: colors.background.secondary,
  borderRadius: borders.radius.md,
  border: `${borders.width.thin} dashed ${colors.border.default}`,
}}>
  <p style={{
    fontSize: typography.fontSize.base,
    color: colors.text.tertiary,
  }}>
    No items yet
  </p>
</div>
```

---

## Components

### 1. Input Component

**Location**: `src/components/common/Input.tsx`

#### API Reference

```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string           // Optional label text
  id: string              // Required for accessibility
  error?: string | boolean // Error state (string = message, boolean = just styling)
  required?: boolean      // Shows asterisk indicator
}
```

#### Basic Usage

```typescript
import { Input } from '../common/Input'

<Input
  id="first-name"
  label="First Name"
  required
  value={firstName}
  onChange={(e) => setFirstName(e.target.value)}
  placeholder="Enter first name"
/>
```

#### With Validation Error

```typescript
<Input
  id="email"
  label="Email"
  required
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={!isValidEmail(email) && "Please enter a valid email"}
/>
```

#### Boolean Error (Just Styling)

```typescript
<Input
  id="grade"
  label="Grade"
  type="number"
  value={grade}
  onChange={(e) => setGrade(Number(e.target.value))}
  error={validationError && (grade < 0 || grade > 100)}
/>
```

#### Without Label

```typescript
<Input
  id="search"
  placeholder="Search..."
  value={query}
  onChange={(e) => setQuery(e.target.value)}
  aria-label="Search input"
/>
```

#### Side-by-Side Layout

```typescript
<div style={{ display: 'flex', gap: spacing.lg }}>
  <div style={{ flex: 1 }}>
    <Input
      id="first-name"
      label="First Name"
      required
      value={firstName}
      onChange={(e) => setFirstName(e.target.value)}
    />
  </div>
  <div style={{ flex: 1 }}>
    <Input
      id="last-name"
      label="Last Name"
      value={lastName}
      onChange={(e) => setLastName(e.target.value)}
    />
  </div>
</div>
```

#### Features

- ✅ Automatic label association (htmlFor)
- ✅ Required indicator (red asterisk)
- ✅ Error state styling (red border)
- ✅ Error message display
- ✅ Full TypeScript support
- ✅ All native input props supported
- ✅ Built with design tokens

### 2. Label Component

**Location**: `src/components/common/Label.tsx`

#### API Reference

```typescript
interface LabelProps {
  htmlFor: string    // ID of associated input
  required?: boolean // Shows asterisk indicator
  children: React.ReactNode
}
```

#### Usage

```typescript
import { Label } from '../common/Label'

<Label htmlFor="description" required>
  Description
</Label>
<textarea id="description" />
```

#### Features

- ✅ Standalone label component
- ✅ Required indicator support
- ✅ Consistent styling with design tokens
- ✅ Full accessibility support

**Note**: The Input component includes its own label, so this is only needed for custom inputs (textareas, selects, etc.)

### 3. Button Component

**Location**: `src/components/common/Button.tsx`

#### API Reference

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
  children: React.ReactNode
}
```

#### Variants

**Primary** (default): Main actions
```typescript
<Button onClick={handleSave} variant="primary">
  Save Changes
</Button>
```

**Secondary**: Alternative actions
```typescript
<Button onClick={handleCancel} variant="secondary">
  Cancel
</Button>
```

**Danger**: Destructive actions
```typescript
<Button onClick={handleDelete} variant="danger">
  Delete Item
</Button>
```

#### Button Group Layout

```typescript
<div style={{
  display: 'flex',
  gap: spacing.sm,
  flexWrap: 'wrap',
}}>
  <Button variant="primary" onClick={handleSave}>
    Save
  </Button>
  <Button variant="secondary" onClick={handleCancel}>
    Cancel
  </Button>
</div>
```

#### Features

- ✅ Three semantic variants
- ✅ Hover/active states
- ✅ Disabled state support
- ✅ Full TypeScript support
- ✅ All native button props supported
- ✅ Built with design tokens

---

## Migration Guide

### Step 1: Identify Target Component

Look for components with:
- Inline style objects (e.g., `style={{ padding: '12px' }}`)
- Hardcoded color values (e.g., `#374151`, `#DC2626`)
- Magic numbers for spacing/sizing
- Custom form inputs (candidates for Input component)

### Step 2: Import Design Tokens

```typescript
// Add to component imports
import { colors, spacing, typography, borders, shadows } from '../../theme/tokens'
```

### Step 3: Replace Inline Styles

#### Pattern 1: Simple Replacement

**Before:**
```typescript
<div style={{
  padding: '16px',
  marginBottom: '24px',
  backgroundColor: '#FFFFFF',
}}>
```

**After:**
```typescript
<div style={{
  padding: spacing.lg,
  marginBottom: spacing.xl,
  backgroundColor: colors.background.primary,
}}>
```

#### Pattern 2: Form Inputs → Input Component

**Before:**
```typescript
<div className="form-group">
  <label htmlFor="name" style={{ fontSize: '14px', color: '#374151' }}>
    Name <span style={{ color: '#DC2626' }}>*</span>
  </label>
  <input
    id="name"
    value={name}
    onChange={(e) => setName(e.target.value)}
    style={{
      padding: '12px',
      border: '1px solid #E5E7EB',
      borderRadius: '8px',
    }}
  />
</div>
```

**After:**
```typescript
<Input
  id="name"
  label="Name"
  required
  value={name}
  onChange={(e) => setName(e.target.value)}
/>
```

#### Pattern 3: Validation Errors

**Before:**
```typescript
{error && (
  <div style={{
    padding: '12px',
    backgroundColor: '#FEE2E2',
    border: '1px solid #DC2626',
    borderRadius: '8px',
    color: '#DC2626',
    fontSize: '14px',
  }}>
    {error}
  </div>
)}
```

**After:**
```typescript
{error && (
  <div style={{
    padding: spacing.md,
    backgroundColor: colors.semantic.errorLight,
    border: `${borders.width.thin} solid ${colors.semantic.error}`,
    borderRadius: borders.radius.md,
    color: colors.semantic.error,
    fontSize: typography.fontSize.sm,
  }}>
    {error}
  </div>
)}
```

### Step 4: Update Tests

If tests check specific style values, update them to match design tokens:

**Before:**
```typescript
expect(input).toHaveStyle({
  padding: '12px',
  fontSize: '16px',
  border: '1px solid #E5E7EB',
})
```

**After:**
```typescript
expect(input).toHaveStyle({
  padding: '0.75rem',  // spacing.md
  fontSize: '1rem',    // typography.fontSize.base
  border: '1px solid #E5E7EB',
})
```

### Step 5: Verify Tests Pass

```bash
npm test -- YourComponent
```

### Migration Checklist

- [ ] Import design tokens
- [ ] Replace hardcoded colors
- [ ] Replace spacing/sizing values
- [ ] Replace typography values
- [ ] Replace border/radius values
- [ ] Convert form inputs to Input component
- [ ] Update tests if needed
- [ ] Run full test suite
- [ ] Verify visual appearance unchanged
- [ ] Remove unused style imports/constants

### Real-World Example: FinalCommentsModal

**Before (inline styles):**
```typescript
<div className="form-group" style={{ flex: 1 }}>
  <label htmlFor="first-name" style={{
    display: 'block',
    marginBottom: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: 500,
    color: '#374151',
  }}>
    First Name <span style={{ color: '#DC2626' }}>*</span>
  </label>
  <input
    id="first-name"
    type="text"
    value={firstName}
    onChange={(e) => setFirstName(e.target.value)}
    style={{
      width: '100%',
      padding: '0.75rem',
      fontSize: '1rem',
      border: validationError && !firstName
        ? '1px solid #DC2626'
        : '1px solid #E5E7EB',
      borderRadius: '8px',
    }}
  />
</div>
```

**After (Input component + tokens):**
```typescript
<div style={{ flex: 1 }}>
  <Input
    id="first-name"
    label="First Name"
    required
    value={firstName}
    onChange={(e) => setFirstName(e.target.value)}
    placeholder="Enter student first name"
    error={validationError && !firstName}
  />
</div>
```

**Result:**
- 32 inline style objects → 0
- All form fields standardized
- 96 tests still passing
- Visual appearance preserved

---

## Best Practices

### When to Use Design Tokens

✅ **Always use tokens for:**
- Colors (text, backgrounds, borders)
- Spacing (padding, margins, gaps)
- Typography (font sizes, weights, line heights)
- Borders (widths, radius)
- Shadows

❌ **Exceptions (use custom values):**
- Layout-specific dimensions (e.g., `width: '300px'` for fixed-width sidebar)
- Z-index values
- Transform values
- Animation keyframes

### When to Use Components vs. Tokens

**Use Input Component when:**
- Building text/number/email inputs
- Need consistent label + input + error styling
- Want validation error states handled automatically

**Use design tokens directly when:**
- Building custom inputs (textarea, select, etc.)
- Creating unique layouts
- Styling non-form elements

### How to Propose New Tokens

If you need a design value that doesn't exist:

1. **Check if existing token is close enough**
   - Example: Need 20px spacing? Use `spacing.xl` (24px) instead

2. **Discuss with team if truly needed**
   - Is this a one-off case or reusable pattern?
   - Will other features use this value?

3. **Add to tokens.ts with clear naming**
   ```typescript
   // If adding a new color
   colors.semantic.warning = '#F59E0B'

   // If adding new spacing
   spacing['3xl'] = '3rem' // 48px
   ```

4. **Update this documentation**

5. **Create tests for new tokens**

### Component Composition Patterns

#### Modal Header
```typescript
<div style={{ marginBottom: spacing['2xl'] }}>
  <h2 style={{
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  }}>
    Modal Title
  </h2>
  <p style={{
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
  }}>
    Modal description
  </p>
</div>
```

#### Form Section
```typescript
<div style={{ marginBottom: spacing['2xl'] }}>
  <h3 style={{
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  }}>
    Section Title
  </h3>

  <Input id="field1" label="Field 1" required />
  <Input id="field2" label="Field 2" />

  <Button variant="primary">Submit</Button>
</div>
```

#### Card/Item Layout
```typescript
<div style={{
  padding: spacing.xl,
  border: `${borders.width.thin} solid ${colors.border.default}`,
  borderRadius: borders.radius.md,
  backgroundColor: colors.background.primary,
  boxShadow: shadows.sm,
}}>
  <h4 style={{
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  }}>
    Item Title
  </h4>
  <p style={{
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
  }}>
    Item metadata
  </p>
</div>
```

### Accessibility Considerations

- Always use `required` prop on Input for required fields (shows asterisk)
- Provide `aria-label` when no visible label exists
- Use semantic HTML (labels, fieldsets, etc.)
- Ensure sufficient color contrast (design tokens already meet WCAG 2.1 AA)
- Test keyboard navigation

### Testing Guidelines

- Test components work with design tokens (not hardcoded expectations)
- Use semantic queries (`getByRole`, `getByLabelText`) over style checks
- If testing styles, use token values (e.g., `'0.75rem'` not `'12px'`)
- Test error states and validation

### Performance Tips

- Design tokens have zero runtime overhead (compile-time constants)
- Input component adds minimal bundle size (<2 KB)
- No memoization needed for static token values
- Use `React.memo` for components if re-rendering frequently

---

## Reference Examples

### Complete Form Example

```typescript
import { Input } from '../common/Input'
import { Button } from '../common/Button'
import { colors, spacing, typography, borders } from '../../theme/tokens'

export const StudentForm: React.FC = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [grade, setGrade] = useState<number | ''>('')
  const [error, setError] = useState('')

  const handleSubmit = () => {
    if (!firstName.trim()) {
      setError('First name is required')
      return
    }
    // Submit logic...
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: spacing.xl }}>
      <h2 style={{
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.bold,
        color: colors.text.primary,
        marginBottom: spacing.lg,
      }}>
        Add Student
      </h2>

      {/* Side-by-side name fields */}
      <div style={{ display: 'flex', gap: spacing.lg }}>
        <div style={{ flex: 1 }}>
          <Input
            id="first-name"
            label="First Name"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Enter first name"
            error={error && !firstName.trim()}
          />
        </div>
        <div style={{ flex: 1 }}>
          <Input
            id="last-name"
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Enter last name"
          />
        </div>
      </div>

      {/* Grade input */}
      <Input
        id="grade"
        label="Grade"
        required
        type="number"
        value={grade}
        onChange={(e) => setGrade(Number(e.target.value))}
        min={0}
        max={100}
        error={error && (grade === '' || grade < 0 || grade > 100)}
      />

      {/* Error message */}
      {error && (
        <div
          role="alert"
          style={{
            padding: spacing.md,
            marginBottom: spacing.lg,
            backgroundColor: colors.semantic.errorLight,
            border: `${borders.width.thin} solid ${colors.semantic.error}`,
            borderRadius: borders.radius.md,
            color: colors.semantic.error,
            fontSize: typography.fontSize.sm,
          }}
        >
          {error}
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: spacing.sm }}>
        <Button variant="primary" onClick={handleSubmit}>
          Add Student
        </Button>
        <Button variant="secondary" onClick={() => setError('')}>
          Cancel
        </Button>
      </div>
    </div>
  )
}
```

---

## FAQ

**Q: Why not use CSS-in-JS libraries like styled-components?**
A: We prioritize simplicity and minimize dependencies. Design tokens + inline styles provide type safety and flexibility without additional runtime overhead.

**Q: Can I still use custom CSS classes?**
A: Yes, for layout-specific styles or complex animations. But prefer design tokens for colors, spacing, and typography.

**Q: What if I need a value between two tokens?**
A: Use the closest token. If it's a recurring need across multiple features, propose a new token.

**Q: How do I handle responsive styling?**
A: Use media queries in CSS or window size hooks. Design tokens work the same in responsive contexts.

**Q: Should I migrate old components immediately?**
A: No. Migrate incrementally during feature work or bug fixes. Priority modals are already migrated.

**Q: Can I use design tokens in CSS files?**
A: Currently, tokens are TypeScript constants. For CSS files, continue using existing patterns or propose migrating to CSS custom properties.

---

## Migration Status

### Completed Migrations
- ✅ FinalCommentsModal (US-CSS-006) - 32 inline styles eliminated
- ✅ ClassManagementModal (US-CSS-007) - 23 modalStyles references replaced

### Future Candidates
- OutcomeCommentsModal
- PersonalizedCommentsModal
- SubjectForm
- SubjectListItem
- Other components with inline styles (see audit report)

---

## Additional Resources

- **Design Tokens Source**: `src/theme/tokens.ts`
- **Component Source**: `src/components/common/`
- **Test Examples**: `src/components/finalComments/__tests__/FinalCommentsModal.add-form-styling.test.tsx`
- **Migration Examples**: See FinalCommentsModal and ClassManagementModal git history
- **Audit Report**: `pdd-workspace/css-standardization/planning/audit-report.md`

---

**Last Updated**: 2025-11-10
**Authors**: Frontend Engineering Team
**Feature**: CSS Standardization (L2-SMALL)
