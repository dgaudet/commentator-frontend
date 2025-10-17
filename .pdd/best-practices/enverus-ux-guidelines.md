---
category: design
priority: critical
scope: frontend-development
author: enverus-platform-team
updated: 2024-12-19
source: https://design.enverus.com
---

# Enverus UI/UX Guidelines

**Purpose**: Ensure all Enverus applications provide consistent, accessible, and user-friendly experiences aligned with company design standards.

**Enforcement**: MANDATORY for all Frontend Developer persona implementations.

---

## Core Design Principles

### 1. User-Centered Approach
**Principle**: Prioritize user needs, behaviors, and goals in every design decision.

- **DO**: Think about what makes things easier and more intuitive for users
- **DON'T**: Optimize for technical convenience over user experience
- **DO**: Design for varying levels of technical experience
- **DON'T**: Assume all users are tech-savvy

**Implementation**:
- Conduct user research and testing before major UI changes
- Base decisions on user data, not assumptions
- Test with real users from diverse backgrounds
- Iterate based on user feedback

---

### 2. Simplicity & Clarity

**Principle**: Simple, clear interfaces are easier to understand and use.

- **DO**: Keep interfaces simple and avoid overcomplexity
- **DON'T**: Overwhelm users with too many choices or options
- **DO**: Make buttons, labels, and instructions clear and predictable
- **DON'T**: Use technical jargon or ambiguous terminology
- **DO**: Focus on essential features for the task at hand
- **DON'T**: Clutter interfaces with rarely-used functionality

**Implementation**:
```jsx
// ✅ GOOD: Clear, simple interface
<Button variant="primary" onClick={handleSave}>
  Save Changes
</Button>

// ❌ BAD: Unclear, technical interface
<Btn type="1" fn={handleSave}>
  Persist
</Btn>
```

---

### 3. Accessibility First

**Principle**: Design for everyone, including users with disabilities.

- **DO**: Ensure WCAG 2.1 AA compliance for all interfaces
- **DON'T**: Rely solely on color to convey information
- **DO**: Use readable fonts with proper color contrast
- **DON'T**: Ignore keyboard navigation and screen reader support
- **DO**: Follow Enverus design system accessibility standards
- **DON'T**: Treat accessibility as an afterthought

**Implementation**:
```jsx
// ✅ GOOD: Accessible status indicator
<div role="status" aria-live="polite">
  <Icon name="check" aria-hidden="true" />
  <span>Success</span>
</div>

// ❌ BAD: Color-only indicator
<div style={{color: 'green'}}>✓</div>
```

**Resources**: [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

### 4. Error Prevention & Recovery

**Principle**: Help users avoid mistakes and recover gracefully when errors occur.

- **DO**: Design features that prevent mistakes (validation, smart defaults)
- **DON'T**: Allow destructive actions without confirmation
- **DO**: Provide undo buttons and confirmation prompts
- **DON'T**: Show cryptic error messages without recovery suggestions
- **DO**: Use progressive disclosure to guide users
- **DON'T**: Overwhelm users with validation errors before they finish

**Implementation**:
```jsx
// ✅ GOOD: Confirmation for destructive action
const handleDelete = async () => {
  const confirmed = await showConfirmDialog({
    title: 'Delete Well Data?',
    message: 'This action cannot be undone.',
    confirmText: 'Delete',
    cancelText: 'Cancel'
  });
  
  if (confirmed) {
    await deleteWellData(id);
  }
};

// ❌ BAD: No confirmation
const handleDelete = () => deleteWellData(id);
```

---

### 5. Consistency Across Products

**Principle**: Maintain uniform patterns so users can transfer knowledge between apps.

- **DO**: Use Enverus Design System components and patterns
- **DON'T**: Create custom variations of standard components
- **DO**: Maintain consistent layouts, styles, and interactions
- **DON'T**: Invent new patterns for common actions (save, cancel, delete)
- **DO**: Follow established navigation and information architecture
- **DON'T**: Rearrange standard UI elements without strong rationale

**Implementation**:
- Always use Enverus Design System component library
- Follow naming conventions and interaction patterns
- Consult design system documentation before custom implementations
- Contribute new patterns back to the design system

---

### 6. Mobile & Responsive Design

**Principle**: Ensure equivalent experiences across all devices.

- **DO**: Design with mobile-first mindset
- **DON'T**: Forget mobile during development
- **DO**: Ensure touch targets are appropriately sized (44x44px minimum)
- **DON'T**: Rely on hover states for critical functionality
- **DO**: Test across all supported devices and breakpoints
- **DON'T**: Assume desktop-only usage

**Implementation**:
```css
/* ✅ GOOD: Mobile-first responsive design */
.data-grid {
  display: block; /* Mobile: stacked */
}

@media (min-width: 768px) {
  .data-grid {
    display: grid; /* Tablet+: grid layout */
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }
}

/* ❌ BAD: Desktop-first with mobile afterthought */
.data-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}

@media (max-width: 767px) {
  .data-grid {
    grid-template-columns: 1fr; /* Awkward mobile fix */
  }
}
```

---

### 7. Progressive Disclosure

**Principle**: Avoid clutter by revealing information and functionality progressively.

- **DO**: Hide lesser-used functionality behind progressive disclosure
- **DON'T**: Show all options at once
- **DO**: Present information in digestible, prioritized chunks
- **DON'T**: Overwhelm users with full feature sets upfront
- **DO**: Use expand/collapse, tabs, and steppers appropriately
- **DON'T**: Bury critical functionality too deeply

**Implementation**:
```jsx
// ✅ GOOD: Advanced filters hidden by default
<FilterPanel>
  <BasicFilters />
  <Accordion>
    <AccordionItem title="Advanced Filters">
      <AdvancedFilters />
    </AccordionItem>
  </Accordion>
</FilterPanel>

// ❌ BAD: All filters shown at once
<FilterPanel>
  <BasicFilters />
  <AdvancedFilters />
  <ExpertFilters />
  <DebugFilters />
</FilterPanel>
```

---

### 8. Data-Driven & Iterative Design

**Principle**: Base design decisions on user research and real-world data.

- **DO**: Back design decisions with user research and testing data
- **DON'T**: Rely solely on personal preferences or assumptions
- **DO**: Expect iterative refinement based on user feedback
- **DON'T**: Consider designs "done" after first implementation
- **DO**: Monitor analytics and adjust based on usage patterns
- **DON'T**: Ignore user feedback and pain points

**Implementation**:
- Implement analytics tracking for key user journeys
- Conduct A/B testing for significant UI changes
- Review user support tickets for UX pain points
- Iterate designs based on quantitative and qualitative data

---

## Enverus-Specific Patterns

### Energy Industry Context
- Use industry-standard terminology (wells, formations, production)
- Present data in formats familiar to energy professionals
- Support complex data visualization needs (maps, charts, timeseries)

### AI Features at Enverus
- Provide clear explanations of AI-generated insights
- Show confidence levels and data sources
- Allow users to verify and override AI suggestions
- Maintain transparency in AI decision-making

**Reference**: [AI Design Guidelines](https://design.enverus.com/34c0e3799/p/03be56-ai-at-enverus/t/5c4a350412)

---

## Quality Checklist

Before completing any frontend work, verify:

- [ ] **Simplicity**: Is the interface clear and uncluttered?
- [ ] **Clarity**: Are all labels, buttons, and instructions obvious?
- [ ] **Accessibility**: WCAG 2.1 AA compliance verified?
- [ ] **Error Prevention**: Confirmations for destructive actions?
- [ ] **Consistency**: Follows Enverus Design System patterns?
- [ ] **Mobile**: Works seamlessly on all devices?
- [ ] **Progressive Disclosure**: Lesser-used features appropriately hidden?
- [ ] **User Testing**: Validated with real users or stakeholders?

---

## Resources

- 📚 [Working with UX](https://design.enverus.com/34c0e3799/p/577220-working-with-ux)
- ✅ [Do's & Don'ts](https://design.enverus.com/34c0e3799/p/65170e-dos--donts)
- 📐 [Rules of UX Design](https://design.enverus.com/34c0e3799/p/1527de-rules-of-ux-design)
- 🤖 [AI Design Guidelines](https://design.enverus.com/34c0e3799/p/03be56-ai-at-enverus/t/5c4a350412)
- 🎨 [Enverus Design System](https://design.enverus.com)

---

## Enforcement

**Authority**: Frontend Developer persona has PRIMARY enforcement responsibility.

**Violations**: Any frontend work that doesn't follow these guidelines must be flagged and corrected before delivery.

**Review**: All frontend code reviews MUST verify Enverus UX compliance.

**Exceptions**: Require explicit approval from UX team with documented rationale.
