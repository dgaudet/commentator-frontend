---
category: design
priority: critical
scope: frontend-development
author: enverus-platform-team
updated: 2024-12-19
source: https://design.enverus.com
---

# Enverus AI Tool Design Guidelines - Master Copy

# for use in AI tools such as Figma Make, Claude Code, Bolt, etc.

## 1) Principles

- **Use tokens, not raw values.** Always reference CSS custom properties (e.g., `var(--env-theme-accent-brand)`).
- **Theme Support**: Light/Dark mode with automatic and manual switching
- **Respect light/dark variants.** Prefer tokens that already account for theme switching.
- **Font Family**: All body text must use Roboto font family, icons must use Material Symbols Outlined
- **Color Philosophy**: Green-based brand with comprehensive neutral scale
- **Follow the spacing & radius scale.** Never invent sizes that aren't on the scale.
- **Typography hierarchy.** Map headings/body text to the provided text styles.
- **Accessible defaults.** Maintain strong color contrast and focus-visible styles.
- **WCAG Compliance.** All text must meet WCAG 2.1 AA color contrast requirements (4.5:1 for normal text, 3:1 for large text).

## Global Directives

- For every HTML/React/Vue/Svelte page, **include a Theme Switcher**.
- Implement **manual theming** with `[data-theme="light"|"dark"]` on `<html>`.
- Persist the theme in `localStorage: "theme"`. Default: `dark`.

## Layout & Navigation Requirements

- **Fixed Header**: Application headers must be fixed to the top of the page using `position: fixed` with appropriate z-index layering.
- **Header Positioning**: Headers should span the full width (`left: 0, right: 0`) and be positioned at the top (`top: 0`).
- **Content Spacing**: When using a fixed header, ensure main content has sufficient top padding to prevent overlap.
- **Z-Index Management**: Fixed headers should use a high z-index (e.g., `1000`) to stay above other content.

## Implementation

- As a general rule, elements that appear above other elements should use a lighter surface color (either base, elevated, or top)
- Inject the vanilla JS toggle (see snippet below) into plain HTML pages.
- Inject the React `<ThemeToggle/>` component into React apps (and render it in the main layout).
- Use CSS variables for all colors and states; no hex literals in components.
- **Headers must be fixed positioned** at the top of the viewport for optimal user experience.

## Required Snippets (inject these unless the file already contains equivalent code)

### 1) HTML toggle (vanilla)

```html
<button id="theme-toggle" type="button" aria-pressed="false" title="Toggle theme">Theme</button>

<script>
  (function(){
    const KEY = 'theme';
    const root = document.documentElement;
    const get = () => localStorage.getItem(KEY);
    const set = (m) => localStorage.setItem(KEY, m);
    const apply = (m) => root.setAttribute('data-theme', m);

    let mode = get() || 'light';
    apply(mode);

    const btn = document.getElementById('theme-toggle');
    if (btn) {
      const updatePressed = () => btn.setAttribute('aria-pressed', String(mode === 'dark'));
      updatePressed();
      btn.addEventListener('click', () => {
        mode = (mode === 'light') ? 'dark' : 'light';
        apply(mode); set(mode); updatePressed();
      });
    }
  })();
</script>
```

### 2) React toggle (if using React)

```jsx
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const KEY = "theme";
  const [mode, setMode] = useState<"light"|"dark">("light");

  useEffect(() => {
    const saved = (localStorage.getItem(KEY) as "light"|"dark") || "light";
    setMode(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mode);
    localStorage.setItem(KEY, mode);
  }, [mode]);

  return (
    <button
      type="button"
      aria-pressed={mode === "dark"}
      onClick={() => setMode(mode === "light" ? "dark" : "light")}
    >
      Theme
    </button>
  );
}
```

### 3) Minimal tokens scaffold (override/extend as needed)

```css
[data-theme="light"] {
  --surface: #ffffff;
  --text: #0e0e0e;
  --muted: #5e5e5e;
  --brand: #3c8321;
  --on-brand: #ffffff;
}

[data-theme="dark"] {
  --surface: #1b1b1b;
  --text: #f2f2f2;
  --muted: #ababab;
  --brand: #3c8321;
  --on-brand: #ffffff;
}

body {
  background: var(--surface);
  color: var(--text);
}
```

## 2) Runtime Tokens (authoritative)

These tokens are the single source of truth for generated UI. The model **must** use these names verbatim.

### 2.1 Color System

#### Brand

```css
:root {
  --env-theme-accent-brand: #3c8321; /* same base unless otherwise specified */
  --env-theme-accent-brand-light: #44a428;
  --env-theme-accent-brand-dark: #2e6b17;
  --env-theme-accent-text-on-brand: #ffffff;
  --env-theme-accent-brand-text: #2e6b17; /* (light) */
}

[data-theme="light"] {
  --env-theme-accent-brand: #3c8321; /* green.50 */
  --env-theme-accent-brand-light: #44a428; /* green.60 */
  --env-theme-accent-brand-dark: #2e6b17; /* green.40 */
  --env-theme-accent-text-on-brand: #ffffff;
  --env-theme-accent-brand-text: #2e6b17; /* (light) */
}
```

#### Contextual Colors

```css
:root {
  --env-theme-danger: #b5192a; /* red.40 (dark) */
  --env-theme-warning: #d79407; /* yellow.80 (dark) */
  --env-theme-info: #2778aa; /* blue.50 (dark) */
  --env-theme-accent-orange: #ca6a27; /* orange.60 (dark) */
  --env-theme-accent-purple: #c04df2; /* purple.60 (dark) */
}

[data-theme="light"] {
  --env-theme-danger: #d92034; /* red.50 (light) */
  --env-theme-warning: #e7a009; /* yellow.90 (light) */
  --env-theme-info: #1f648d; /* blue.40 (light) */
  --env-theme-accent-orange: #b05b20; /* orange.50 (light) */
  --env-theme-accent-blue: #2778aa; /* blue.50 */
  --env-theme-accent-purple: #9424be; /* purple.40 (light) */
}
```

#### Surfaces & Backgrounds

```css
:root {
  --env-theme-surface-base: #1b1b1b; /* neutral.10 (dark) */
  --env-theme-surface-elevated: #282828; /* neutral.16 (dark) */
  --env-theme-surface-top: #393939; /* neutral.24 (dark) */
}

[data-theme="light"] {
  --env-theme-surface-base: #e8e8e8; /* neutral.92 (light) */
  --env-theme-surface-elevated: #f9f9f9; /* neutral.98 (light) */
  --env-theme-surface-top: #ffffff; /* neutral.100 (light) */
}
```

#### Text

```css
:root {
  --env-theme-text-body: #f9f9f9; /* neutral.98 (dark) */
  --env-theme-text-muted: #c6c6c6; /* neutral.80 (dark) */
  --env-theme-text-very-muted: #ababab; /* neutral.70 (dark) */
  --env-theme-text-disabled: #919191; /* neutral.60 (dark) */
  --env-theme-text-link: #37a1e1; /* blue.70 (dark) */
}

[data-theme="light"] {
  --env-theme-text-body: #0e0e0e; /* neutral.4 (light) */
  --env-theme-text-muted: #474747; /* neutral.30 (light) */
  --env-theme-text-very-muted: #5e5e5e; /* neutral.40 (light) */
  --env-theme-text-disabled: #777777; /* neutral.50 (light) */
  --env-theme-text-link: #1f648d; /* blue.40 (light) */
}
```

### 2.2 Size & Spacing

```css
:root {
  --size-measure-025: 1px;
  --size-measure-050: 2px;
  --size-measure-100: 4px;
  --size-measure-200: 8px;
  --size-measure-300: 12px;
  --size-measure-400: 16px;
  --size-measure-500: 20px;
  --size-measure-600: 24px;
  --size-measure-800: 32px;
  --size-measure-1200: 48px;
  --size-measure-1600: 64px;
}
```

#### Padding Scale

```css
:root {
  --size-padding-xxxx-small: 1px;
  --size-padding-xxx-small: 2px;
  --size-padding-xx-small: 4px;
  --size-padding-x-small: 8px;
  --size-padding-small: 12px;
  --size-padding-regular: 16px;
  --size-padding-medium: 20px;
  --size-padding-large: 24px;
  --size-padding-x-large: 32px;
  --size-padding-xx-large: 48px;
}
```

#### Radius

```css
:root {
  --size-radius-100: 3px;
  --size-radius-200: 8px;
  --size-radius-400: 12px;
  --size-radius-full: 9999px;
}
```

### 2.3 Typography & Icons

```css
:root {
  --text-body-font-family:
    "Roboto Flex", system-ui, -apple-system, Segoe UI, Roboto,
    Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
  --text-symbols-font-family: "Material Symbols Outlined";

  --text-display-size: 38px;
  --text-display-line: 48px;
  --text-display-weight: 500;

  --text-headline-size: 24px;
  --text-headline-line: 32px;
  --text-headline-weight: 500;

  --text-title-size: 16px;
  --text-title-line: 24px;
  --text-title-weight: 500;

  --text-body-size: 14px;
  --text-body-line: 22px;
  --text-body-weight: 400;

  --text-small-size: 12px;
  --text-small-line: 16px;
  --text-small-weight: 400;

  --text-x-small-size: 10px;
  --text-x-small-line: 16px;
  --text-x-small-weight: 400;

  --text-symbol-small: 12px;
  --text-symbol-regular: 16px;
  --text-symbol-large: 24px;
}
```

### 2.4 Components (baseline tokens)

#### Buttons
## Button Tokens

```css
:root {
  --size-button-height-regular: 32px;
  --size-button-height-small: 24px;
  --env-theme-button-background: #303030; /* neutral.20 (dark) */
  --env-theme-button-border: #424242; /* neutral.28 (dark) */
  --env-theme-button-text: #ffffff; /* neutral.100 (dark) */
  --env-theme-button-background-hover: #424242; /* neutral.28 (dark) */
}

[data-theme="light"] {
  :root {
    --env-theme-button-background: #d1d1d1; /* neutral.84 (light) */
    --env-theme-button-border: #ababab; /* neutral.70 (light) */
    --env-theme-button-text: #0e0e0e; /* neutral.4 (light) */
    --env-theme-button-background-hover: #e8e8e8; /* neutral.92 (light) */
  }
}

button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--size-radius-100);
  font-family: var(--text-body-font-family);
  font-weight: var(--text-title-weight);
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s ease;
  white-space: nowrap;
}
```

### Primary Button
```css
  .button-primary {
    gap: var(--size-measure-200);
    height: var(--size-button-height-regular);
    padding: 0 var(--size-padding-regular);
    background: var(--env-theme-accent-brand);
    color: var(--env-theme-button-text);
    border: 1px solid transparent;
    line-height: var(--text-title-line);
  }

  .button-primary:hover {
    background: var(--env-theme-accent-brand-light);
  }

  .button-primary:active {
    background: var(--env-theme-accent-brand-dark);
  }

  .button-primary:focus-visible {
    outline: var(--size-measure-050) solid var(--env-theme-text-link);
    outline-offset: var(--size-measure-050);
  }

  .button-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
```

### Default Button
```css
  .button-default {
    background: var(--env-theme-button-background);
    border: 1px solid var(--env-theme-button-border);
    color: var(--env-theme-button-text);
    font-size: var(--text-body-size);
    gap: var(--size-measure-200);
    height: var(--size-button-height-regular);
    line-height: var(--text-body-line);
    margin: 0;
    padding: 0 var(--size-padding-regular);
  }

  ### Small Buttons
  .button-small {
    height: var(--size-button-height-small);
    gap: var(--size-measure-100);
    padding: 0 var(--size-padding-xx-small);
    font-size: var(--text-body-size);
    line-height: var(--text-body-line);
    font-weight: var(--text-title-weight);
  }

```

```html
<button class="button-default">Default Button</button>
<button class="button-primary">Primary Button</button>
<button class="button-default button-small">Small Primary Button</button>
<button class="button-primary button-small">Small Primary Button</button>
```

#### Inputs

```css
:root {
  --env-theme-input-background: #3e3e3e; /* neutral.26 (dark) */
  --env-theme-input-border: #505050; /* neutral.34 (dark) */
  --env-theme-input-text: #ffffff; /* neutral.100 (dark) */
  --env-theme-input-placeholder-text: #c6c6c6; /* neutral.80 (dark) */
}

[data-theme="light"] {
  --env-theme-input-background: #ffffff; /* neutral.100 (light) */
  --env-theme-input-border: #bbbbbb; /* neutral.76 (light) */
  --env-theme-input-text: #0e0e0e; /* neutral.4 (light) */
  --env-theme-input-placeholder-text: #777777; /* neutral.50 (light) */
}
```

#### Navigation

```css
:root {
  --env-theme-navbar-background: #303030; /* neutral.20 (dark) */
  --env-theme-navbar-border: #393939; /* neutral.24 (dark) */
  --env-theme-sidebar-background: #282828; /* neutral.16 (dark) */
  --env-theme-sidebar-border: #393939; /* neutral.24 (dark) */
}

[data-theme="light"] {
  --env-theme-navbar-background: #f9f9f9; /* neutral.98 (light) */
  --env-theme-navbar-border: #dddddd; /* neutral.88 (light) */
  --env-theme-sidebar-background: #f9f9f9; /* neutral.98 (light) */
  --env-theme-sidebar-border: #bbbbbb; /* neutral.76 (light) */
}
```

### 2.5 AI Accents (optional)

```css
:root {
  --env-theme-accent-ai-sparkle: #ffffff;
  --env-theme-accent-ai-base-icon: #c974f5; /* purple.70 (dark) */
}

[data-theme="light"] {
  --env-theme-accent-ai-sparkle: #9424be; /* purple.40 (light) */
  --env-theme-accent-ai-base-icon: #0e0e0e; /* neutral.4 (light) */
}
```

## 3) Directives (the model must follow)

When you generate code:

1. **Prefer `var(--token)` values** from this file over hard-coded hex, pixel, or font values.
2. **Primary actions** use `--env-theme-accent-brand` for backgrounds and `--env-theme-accent-text-on-brand` for text.
3. **Spacing** uses `--size-padding-*` or `--size-measure-*` exclusively.
4. **Typography** must read from the named text styles (e.g., display/headline/title/body) and use `--text-body-font-family` for all text elements.
5. **Borders & Radii** use the `--size-radius-*` tokens only.
6. **Dark mode**: rely on system `data-theme` attribute on the body element and the dark overrides above.
7. **Focus**: include a visible focus outline that meets WCAG (example below).
8. **Color Contrast**: ensure all text-background combinations meet WCAG 2.1 AA standards (4.5:1 normal text, 3:1 large text).
9. **Table Headers**: all table headers (`<th>`, `TableHead`) must use `--env-theme-text-body` color token to ensure proper contrast and consistency with the design system.
10. **Table Accessibility**: all table text including headers (`<th>`, `TableHead`) and body cells (`<td>`, `TableCell`) must meet WCAG 2.1 AA color contrast requirements against their background colors.
11. **Navigation Accessibility**: all navigational elements including tabs (`TabsTrigger`), pills, breadcrumbs, and menu items must meet WCAG 2.1 AA color contrast requirements in all states (default, hover, active, selected/current).
12. **Font Family**: all text elements must use the Roboto font family via `--text-body-font-family` token, never hardcode font families.
13. **Checkbox States**: checked checkboxes must display with a green background using `--env-theme-accent-brand` and a white check mark using `--env-theme-accent-text-on-brand`.
14. **Radio Button States**: selected radio buttons must display as a green ring using `--env-theme-accent-brand` with a white center area using `--env-theme-accent-text-on-brand`, creating a hollow circle appearance.
15. **Switch States**: switches in the "on" position must display with a green background using `--env-theme-accent-brand` and a white thumb using `--env-theme-accent-text-on-brand`.
16. **Slider States**: slider ranges (filled portions) must display with a green background using `--env-theme-accent-brand`, and slider thumbs should use `--env-theme-text-on-brand` for the background with proper border styling.
17. **Icons**: size using `--text-symbol-*` tokens and icon font family variable.
18. **No inline styles** unless necessary—prefer class names and token references in CSS.
19. **Comments**: where raw values are unavoidable, include comments mapping to tokens.

---

## 4) Ready-to-paste Examples

### 4.1 Primary Button

```html
<button class="btn-primary">Continue</button>
```

```css
.btn-primary {
  display: inline-flex;
  height: var(--size-button-height-regular);
  align-items: center;
  justify-content: center;
  gap: var(--size-measure-200);
  padding: 0 var(--size-padding-regular);
  background: var(--env-theme-accent-brand);
  color: var(--env-theme-accent-text-on-brand);
  border: 1px solid transparent;
  border-radius: var(--size-radius-200);
  font-family: var(--text-body-font-family);
  font-size: var(--text-title-size);
  line-height: var(--text-title-line);
  font-weight: var(--text-title-weight);
  cursor: pointer;
}
.btn-primary:hover {
  background: var(--env-theme-accent-brand-light);
}
.btn-primary:active {
  background: var(--env-theme-accent-brand-dark);
}
.btn-primary:focus-visible {
  outline: var(--size-measure-050) solid var(--env-theme-text-link);
  outline-offset: var(--size-measure-050);
}
.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
```

### 4.2 Text Field

```html
<label class="field">
  <span class="label">Email</span>
  <input type="email" placeholder="you@example.com" />
</label>
```

```css
.field {
  display: grid;
  gap: var(--size-measure-100);
}

.field .label {
  font-size: var(--text-small-size);
  line-height: var(--text-body-line);
  font-weight: var(--text-title-weight);
  color: var(--env-theme-text-muted);
}

.field input {
  height: var(--size-button-height-regular);
  padding: 0 var(--size-padding-regular);
  background: var(--env-theme-input-background);
  border: 1px solid var(--env-theme-input-border);
  border-radius: var(--size-radius-200);
  color: var(--env-theme-input-text);
  font-family: var(--text-body-font-family);
  font-size: var(--text-body-size);
  line-height: var(--text-body-line);
}
.field input::placeholder {
  color: var(--env-theme-input-placeholder-text);
}
.field input:focus-visible {
  outline: var(--size-measure-050) solid var(--env-theme-text-link);
  outline-offset: var(--size-measure-050);
}
```

### 4.3 Card

```html
<div class="card">
  <h3 class="card-title">Card title</h3>
  <p class="card-body">Body copy that uses body text tokens.</p>
</div>
```

```css
.card {
  background: var(--env-theme-surface-elevated);
  border: 1px solid var(--env-theme-navbar-border);
  border-radius: var(--size-radius-400);
  padding: var(--size-padding-large);
  color: var(--env-theme-text-body);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
}
.card-title {
  margin: 0 0 var(--size-measure-300);
  font-size: var(--text-headline-size);
  line-height: var(--text-headline-line);
  font-weight: var(--text-headline-weight);
}
.card-body {
  font-size: var(--text-body-size);
  line-height: var(--text-body-line);
  font-weight: var(--text-body-weight);
  color: var(--env-theme-text-muted);
}
```

### 4.4 Fixed Header

```html
<header class="header-fixed">
  <div class="container">
    <h1>App Title</h1>
    <nav>Navigation content</nav>
  </div>
</header>
<main class="main-content">
  <!-- Main content with proper spacing -->
</main>
```

```css
.header-fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: var(--env-theme-navbar-background);
  border-bottom: 1px solid var(--env-theme-navbar-border);
  padding: var(--size-padding-xx-small) 0;
}

.main-content {
  /* Add top padding equal to header height + spacing */
  padding-top: calc(var(--size-button-height-regular) + var(--size-padding-regular) * 2 + var(--size-padding-large));
}
```

### 4.5 Accessible Table

```html
<table class="table-accessible">
  <thead>
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th>Role</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>John Doe</td>
      <td>john@example.com</td>
      <td>Admin</td>
    </tr>
  </tbody>
</table>
```

```css
.table-accessible {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid var(--env-theme-navbar-border);
  background: var(--env-theme-surface-elevated);
}

.table-accessible th {
  background: var(--env-theme-surface-top);
  color: var(--env-theme-text-body);
  padding: var(--size-padding-regular);
  text-align: left;
  border-bottom: 1px solid var(--env-theme-navbar-border);
  font-size: var(--text-body-size);
  font-weight: var(--text-title-weight);
}

.table-accessible td {
  color: var(--env-theme-text-body);
  padding: var(--size-padding-regular);
  border-bottom: 1px solid var(--env-theme-navbar-border);
  font-size: var(--text-body-size);
  font-weight: var(--text-body-weight);
}

.table-accessible tr:hover {
  background: var(--env-theme-surface-base);
}
```

### 4.6 Accessible Navigation Tabs

```html
<nav class="tabs-accessible" role="tablist">
  <button class="tab-trigger" role="tab" aria-selected="true" aria-controls="panel-1">
    Overview
  </button>
  <button class="tab-trigger" role="tab" aria-selected="false" aria-controls="panel-2">
    Analytics
  </button>
  <button class="tab-trigger" role="tab" aria-selected="false" aria-controls="panel-3">
    Settings
  </button>
</nav>
<div class="tab-panel" role="tabpanel" id="panel-1">
  <!-- Tab content -->
</div>
```

```css
.tabs-accessible {
  display: flex;
  background: var(--env-theme-surface-elevated);
  border: 1px solid var(--env-theme-navbar-border);
  border-radius: var(--size-radius-200);
  padding: var(--size-padding-xx-small);
  gap: var(--size-padding-xx-small);
}

.tab-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: var(--size-button-height-regular);
  padding: 0 var(--size-padding-regular);
  background: transparent;
  color: var(--env-theme-text-muted);
  border: none;
  border-radius: var(--size-radius-100);
  font-size: var(--text-body-size);
  font-weight: var(--text-body-weight);
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-trigger:hover {
  background: var(--env-theme-surface-base);
  color: var(--env-theme-text-body); /* Maintains AA contrast on hover */
}

.tab-trigger[aria-selected="true"] {
  background: var(--env-theme-surface-top);
  color: var(--env-theme-text-body); /* Ensures AA contrast for selected state */
  font-weight: var(--text-title-weight);
}

.tab-trigger:focus-visible {
  outline: var(--size-measure-050) solid var(--env-theme-text-link);
  outline-offset: var(--size-measure-050);
}

.tab-panel {
  background: var(--env-theme-surface-elevated);
  color: var(--env-theme-text-body);
  padding: var(--size-padding-large);
  border-radius: var(--size-radius-200);
  margin-top: var(--size-padding-regular);
}
```

### 4.7 Accessible Checkbox

```html
<div class="checkbox-wrapper">
  <input type="checkbox" id="newsletter" class="checkbox-input" />
  <label for="newsletter" class="checkbox-label">Subscribe to newsletter</label>
</div>
```

```css
.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: var(--size-padding-x-small);
}

.checkbox-input {
  appearance: none;
  width: var(--text-symbol-regular);
  height: var(--text-symbol-regular);
  border: 1px solid var(--env-theme-input-border);
  border-radius: var(--size-radius-100);
  background: var(--env-theme-input-background);
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
}

.checkbox-input:checked {
  background: var(--env-theme-accent-brand); /* Green background when checked */
  border-color: var(--env-theme-accent-brand);
}

.checkbox-input:checked::after {
  content: "✓";
  position: absolute;
  color: var(--env-theme-accent-text-on-brand); /* White check mark */
  font-size: var(--text-small-size);
  font-weight: var(--text-title-weight);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.checkbox-input:focus-visible {
  outline: var(--size-measure-050) solid var(--env-theme-text-link);
  outline-offset: var(--size-measure-050);
}

.checkbox-label {
  color: var(--env-theme-text-body);
  font-size: var(--text-body-size);
  font-weight: var(--text-body-weight);
  cursor: pointer;
}
```

### 4.8 Accessible Radio Buttons

```html
<fieldset class="radio-fieldset">
  <legend class="radio-legend">Subscription Plan</legend>
  <div class="radio-group">
    <div class="radio-wrapper">
      <input type="radio" id="basic" name="plan" value="basic" class="radio-input" />
      <label for="basic" class="radio-label">Basic Plan ($9/month)</label>
    </div>
    <div class="radio-wrapper">
      <input type="radio" id="premium" name="plan" value="premium" class="radio-input" />
      <label for="premium" class="radio-label">Premium Plan ($19/month)</label>
    </div>
    <div class="radio-wrapper">
      <input type="radio" id="enterprise" name="plan" value="enterprise" class="radio-input" />
      <label for="enterprise" class="radio-label">Enterprise Plan ($49/month)</label>
    </div>
  </div>
</fieldset>
```

```css
.radio-fieldset {
  border: none;
  padding: 0;
  margin: 0;
}

.radio-legend {
  color: var(--env-theme-text-body);
  font-size: var(--text-body-size);
  font-weight: var(--text-title-weight);
  margin-bottom: var(--size-padding-small);
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: var(--size-padding-small);
}

.radio-wrapper {
  display: flex;
  align-items: center;
  gap: var(--size-padding-x-small);
}

.radio-input {
  appearance: none;
  width: var(--text-symbol-regular);
  height: var(--text-symbol-regular);
  border: 1px solid var(--env-theme-input-border);
  border-radius: var(--size-radius-full);
  background: var(--env-theme-input-background);
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
  margin: 0;
}

.radio-input:checked {
  background: var(--env-theme-accent-brand); /* Green background when selected */
  border-color: var(--env-theme-accent-brand);
  border-width: 3px; /* Thicker border creates ring effect */
}

.radio-input:checked::after {
  content: "";
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: var(--size-radius-full);
  background: var(--env-theme-accent-text-on-brand); /* White center area */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.radio-input:focus-visible {
  outline: var(--size-measure-050) solid var(--env-theme-text-link);
  outline-offset: var(--size-measure-050);
}

.radio-label {
  color: var(--env-theme-text-body);
  font-size: var(--text-body-size);
  font-weight: var(--text-body-weight);
  cursor: pointer;
}
```

### 4.9 Accessible Switch

```html
<div class="switch-wrapper">
  <label for="dark-mode" class="switch-label">Enable dark mode</label>
  <input type="checkbox" id="dark-mode" class="switch-input" role="switch" />
</div>
```

```css
.switch-wrapper {
  display: flex;
  align-items: center;
  gap: var(--size-padding-x-small);
}

.switch-input {
  appearance: none;
  width: 32px;
  height: 18px;
  border: 1px solid var(--env-theme-input-border);
  border-radius: var(--size-radius-full);
  background: var(--env-theme-input-background);
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
  margin: 0;
}

.switch-input:checked {
  background: var(--env-theme-accent-brand); /* Green background when on */
  border-color: var(--env-theme-accent-brand);
}

.switch-input::after {
  content: "";
  position: absolute;
  width: 14px;
  height: 14px;
  border-radius: var(--size-radius-full);
  background: var(--env-theme-accent-text-on-brand); /* White thumb */
  top: 1px;
  left: 1px;
  transition: transform 0.2s ease;
}

.switch-input:checked::after {
  transform: translateX(14px); /* Move thumb to right when checked */
}

.switch-input:focus-visible {
  outline: var(--size-measure-050) solid var(--env-theme-text-link);
  outline-offset: var(--size-measure-050);
}

.switch-label {
  color: var(--env-theme-text-body);
  font-size: var(--text-body-size);
  font-weight: var(--text-body-weight);
  cursor: pointer;
}
```

### 4.10 Accessible Slider

```html
<div class="slider-wrapper">
  <label for="volume" class="slider-label">Volume Level</label>
  <input type="range" id="volume" min="0" max="100" value="50" class="slider-input" />
  <output for="volume" class="slider-value">50</output>
</div>
```

```css
.slider-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--size-padding-x-small);
}

.slider-label {
  color: var(--env-theme-text-body);
  font-size: var(--text-body-size);
  font-weight: var(--text-title-weight);
}

.slider-input {
  appearance: none;
  height: var(--text-symbol-regular);
  width: 100%;
  background: var(--env-theme-input-background);
  border-radius: var(--size-radius-full);
  outline: none;
  cursor: pointer;
  border: 1px solid var(--env-theme-input-border);
}

.slider-input::-webkit-slider-thumb {
  appearance: none;
  width: var(--size-measure-600);
  height: var(--size-measure-600);
  border-radius: var(--size-radius-full);
  background: var(--env-theme-accent-text-on-brand); /* White thumb */
  border: 2px solid var(--env-theme-accent-brand); /* Green border */
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.slider-input::-moz-range-thumb {
  width: var(--size-measure-600);
  height: var(--size-measure-600);
  border-radius: var(--size-radius-full);
  background: var(--env-theme-accent-text-on-brand); /* White thumb */
  border: 2px solid var(--env-theme-accent-brand); /* Green border */
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.slider-input::-webkit-slider-runnable-track {
  height: var(--text-symbol-regular);
  border-radius: var(--size-radius-full);
  background: linear-gradient(to right, var(--env-theme-accent-brand) 0%, var(--env-theme-accent-brand) var(--slider-progress, 50%), var(--env-theme-input-background) var(--slider-progress, 50%), var(--env-theme-input-background) 100%);
  border: 1px solid var(--env-theme-input-border);
}

.slider-input::-moz-range-track {
  height: var(--text-symbol-regular);
  border-radius: var(--size-radius-full);
  background: var(--env-theme-input-background);
  border: 1px solid var(--env-theme-input-border);
}

.slider-input::-moz-range-progress {
  height: var(--text-symbol-regular);
  border-radius: var(--size-radius-full);
  background: var(--env-theme-accent-brand); /* Green filled portion */
}

.slider-input:focus-visible {
  outline: var(--size-measure-050) solid var(--env-theme-text-link);
  outline-offset: var(--size-measure-050);
}

.slider-value {
  color: var(--env-theme-text-muted);
  font-size: var(--text-small-size);
  font-weight: var(--text-body-weight);
  text-align: center;
}
```

## 5) Implementation Notes

- **Font loading**: Include required font imports (e.g., Google Fonts for Roboto Flex and Material Symbols) when generating full pages. All text must use Roboto font family.
- **Theming**: Provide a mechanism for manually switching between dark and light color schemes, default to a dark color scheme. Don't duplicate theme tokens. As a general rule, elements that appear above other elements should use a lighter surface color (either base, elevated, or top)
- **Accessibility**: All color combinations must pass WCAG 2.1 AA contrast requirements. Test text against backgrounds using tools like WebAIM Contrast Checker. Normal text requires 4.5:1 minimum contrast, large text (18pt+ or 14pt+ bold) requires 3:1 minimum. Pay special attention to table elements where headers and cells must maintain proper contrast against their respective background colors. Additionally, ensure navigational elements (tabs, pills, breadcrumbs, menu items) maintain proper contrast in all interactive states.
- **Extensibility**: If new components are generated, define new tokens by composing existing scales first.
- **Docs in code**: Prefer small comments that reference token names when values are expanded.

## 6) Quick Prompts

- "Build a primary action button using `--env-theme-accent-brand` and the title text style."
- "Create a settings form using input tokens and the spacing scale."
- "Design a two-column layout with a sidebar using sidebar tokens and `--size-measure-*` spacing."

## Brand Logo

The official brand logo should be used consistently across all applications:

```html
<svg width="100%" height="100%" viewBox="0 0 120 17" fill-rule="evenodd">
  <path fill="var(--env-theme-text-body)" d="M17,9.44l-0,-2.44l-6,0l-0,-3l6.23,0l-0,-2.55l-9.19,0l-0,11.45l3,0l-0,-3.46l5.96,0Zm-6,5.94l6.56,0l-0,-2.48l-6.56,0l-0,2.48Z"></path>
  <rect fill="#a0ef6e" x="3.56" y="12.9" width="4.48" height="2.48"></rect>
  <rect fill="#a0ef6e" x="0" y="6.98" width="2.99" height="2.48"></rect>
  <rect fill="#56bc2f" x="5.04" y="6.98" width="11.96" height="2.48"></rect>
  <path fill="var(--env-theme-text-body)" d="M26.71,0l0,17l1,0l0,-17l-1,0Z"></path>
  <text fill="var(--env-theme-text-body)" x="36" y="14" font-family="var(--text-body-font-family, 'Roboto', sans-serif)" font-size="16" font-weight="400">Application Name</text>
</svg>
```

**Logo Usage Guidelines:**

- Logo uses design system tokens and automatically adapts to light/dark themes
- Text elements use `--env-theme-text-body` for optimal contrast
- Brand accents use `--env-theme-accent-brand` and `--env-theme-accent-brand-light`
- Minimum size: 38px width recommended for optimal readability
- Use in headers, navigation bars, and branding areas
- Maintain aspect ratio (38:20) when scaling
- Include `aria-label="Application Logo"` for accessibility
- Use `flex-shrink: 0` in flex containers to prevent compression
