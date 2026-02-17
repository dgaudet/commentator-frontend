# Auth0 Lock Widget - Styling Mockup & Example

**Status**: Reference Example for Frontend Engineer
**Purpose**: Visual reference for styling the Lock Widget with design tokens

---

## Desktop Layout (1200px+)

```
┌─────────────────────────────────────────────────────────────────────┐
│  Header / Navigation                                                 │
├──────────────────────────────┬──────────────────────────────────────┤
│                              │                                      │
│   HERO SECTION               │     LOCK WIDGET (500px)              │
│   (Left Column)              │     (Right Column)                   │
│                              │                                      │
│   ✨ Streamline              │  ┌────────────────────────────────┐  │
│      Assessment              │  │  📧 Email                      │  │
│                              │  │  ┌──────────────────────────┐  │  │
│   ⭐ Better Feedback         │  │  │ you@example.com          │  │  │
│                              │  │  └──────────────────────────┘  │  │
│   [Teacher Image]            │  │                                │  │
│   (TeacherWithKid1.png)       │  │  🔑 Password                   │  │
│                              │  │  ┌──────────────────────────┐  │  │
│   Gradient Background:       │  │  │ ••••••••••••             │  │  │
│   #667eea → #764ba2          │  │  └──────────────────────────┘  │  │
│                              │  │                                │  │
│                              │  │  [LOG IN] button               │  │
│                              │  │  (Primary Color: #667eea)      │  │
│                              │  │                                │  │
│                              │  │  Don't have an account?        │  │
│                              │  │  [CREATE ACCOUNT HERE] link    │  │
│                              │  │  → redirects to /signup       │  │
│                              │  │                                │  │
│                              │  │  [Forgot password?]            │  │
│                              │  └────────────────────────────────┘  │
│                              │                                      │
└──────────────────────────────┴──────────────────────────────────────┘
```

---

## Tablet Layout (768px - 1199px)

```
┌─────────────────────────────────────┐
│  Header / Navigation                 │
├─────────────────────────────────────┤
│                                     │
│     LOCK WIDGET (centered, 90%)     │
│     ┌───────────────────────────┐   │
│     │  📧 Email                 │   │
│     │  ┌─────────────────────┐  │   │
│     │  │ you@example.com     │  │   │
│     │  └─────────────────────┘  │   │
│     │                           │   │
│     │  🔑 Password              │   │
│     │  ┌─────────────────────┐  │   │
│     │  │ ••••••••••••        │  │   │
│     │  └─────────────────────┘  │   │
│     │                           │   │
│     │  [LOG IN]                 │   │
│     │                           │   │
│     │  Create Account? [HERE]   │   │
│     │  [Forgot password?]       │   │
│     └───────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

---

## Mobile Layout (< 768px)

```
┌──────────────────────┐
│  Header / Navigation  │
├──────────────────────┤
│                      │
│  LOCK WIDGET         │
│  (Full Width - 20px) │
│  ┌────────────────┐  │
│  │ 📧 Email       │  │
│  │ ┌────────────┐ │  │
│  │ │ you@ex...  │ │  │
│  │ └────────────┘ │  │
│  │                │  │
│  │ 🔑 Password    │  │
│  │ ┌────────────┐ │  │
│  │ │ •••••••    │ │  │
│  │ └────────────┘ │  │
│  │                │  │
│  │ [LOG IN]       │  │
│  │                │  │
│  │ Create Account?│  │
│  │    [HERE]      │  │
│  │ [Forgot pwd?]  │  │
│  └────────────────┘  │
│                      │
└──────────────────────┘
```

---

## Color & Design Token Reference

### Light Theme
```
Primary Gradient:     #667eea (main) → #764ba2 (dark)
Text Primary:         #1f2937
Text Secondary:       #6b7280
Background Primary:   #ffffff
Background Secondary: #f9fafb
Border:              #e5e7eb

Focus Outline:       #667eea (2px solid)
Input Height:        44px (touch target)
Font Size:           16px (prevents iOS zoom)
Border Radius:       8px
```

### Dark Theme
```
Primary Gradient:     #667eea (adaptive) → #764ba2
Text Primary:         #f9fafb
Text Secondary:       #d1d5db
Background Primary:   #1f2937
Background Secondary: #111827
Border:              #374151

Focus Outline:       #667eea (2px solid)
Input Height:        44px (touch target)
Font Size:           16px
Border Radius:       8px
```

---

## Lock Widget CSS Styling Example

```css
/* src/pages/LoginPage.module.css */

.loginContainer {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #f0f4ff 0%, #f9fafb 100%);
}

.heroSection {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
}

.heroTitle {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 20px;
}

.heroImage {
  width: 250px;
  height: 250px;
  margin: 20px 0;
  border-radius: 8px;
  object-fit: cover;
}

.infoBox {
  background: rgba(255, 255, 255, 0.2);
  padding: 16px;
  border-radius: 8px;
  margin: 10px 0;
  font-size: 16px;
}

.lockContainer {
  width: 100%;
  max-width: 500px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

/* Lock Widget Input Styling */
.lockContainer :global(.auth0-lock input) {
  min-height: 44px;
  font-size: 16px;
  padding: 12px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-family: inherit;
}

.lockContainer :global(.auth0-lock input:focus) {
  outline: 2px solid #667eea;
  outline-offset: 2px;
  border-color: #667eea;
}

.lockContainer :global(.auth0-lock input::placeholder) {
  color: #9ca3af;
}

/* Lock Widget Button Styling */
.lockContainer :global(.auth0-lock button) {
  min-height: 44px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.lockContainer :global(.auth0-lock button:hover) {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(102, 126, 234, 0.4);
}

.lockContainer :global(.auth0-lock button:focus) {
  outline: 2px solid #667eea;
  outline-offset: 2px;
}

/* Lock Widget Text Links */
.lockContainer :global(.auth0-lock a) {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.lockContainer :global(.auth0-lock a:hover) {
  color: #764ba2;
  text-decoration: underline;
}

.lockContainer :global(.auth0-lock a:focus) {
  outline: 2px solid #667eea;
  outline-offset: 2px;
  border-radius: 4px;
}

/* Responsive Media Queries */

/* Tablet: 768px - 1199px */
@media (min-width: 768px) {
  .loginContainer {
    justify-content: center;
  }

  .lockContainer {
    width: 500px;
  }
}

/* Desktop: 1200px+ */
@media (min-width: 1200px) {
  .loginContainer {
    justify-content: space-between;
    padding: 60px 80px;
  }

  .heroSection {
    width: 45%;
    padding: 40px;
  }

  .lockContainer {
    width: 45%;
    max-width: 500px;
  }
}

/* Mobile: Extra small */
@media (max-width: 480px) {
  .lockContainer {
    padding: 16px;
  }

  .heroSection {
    display: none;
  }

  .loginContainer {
    padding: 10px;
  }
}

/* Dark Mode */
@media (prefers-color-scheme: dark) {
  .loginContainer {
    background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
  }

  .lockContainer {
    background: #374151;
    color: #f9fafb;
  }

  .lockContainer :global(.auth0-lock input) {
    background: #4b5563;
    color: #f9fafb;
    border-color: #6b7280;
  }

  .lockContainer :global(.auth0-lock input::placeholder) {
    color: #9ca3af;
  }

  .heroSection {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
}
```

---

## Implementation Component Example

```typescript
// src/pages/LoginPage.tsx
import { useEffect, useState } from 'react';
import Auth0Lock from 'auth0-lock';
import { useThemeColors } from '../hooks/useThemeColors';
import styles from './LoginPage.module.css';

export function LoginPage(): JSX.Element {
  const { primary, background, text } = useThemeColors();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
      const domain = process.env.REACT_APP_AUTH0_DOMAIN;

      if (!clientId || !domain) {
        setError('Authentication service not configured');
        return;
      }

      // Lock Widget configured for LOGIN ONLY (no signup tab)
      const lock = new Auth0Lock(clientId, domain, {
        auth: {
          redirectUrl: `${window.location.origin}/callback`,
          responseType: 'code',
          scope: 'openid profile email'
        },
        theme: {
          primaryColor: primary.main,  // Design token color
          logo: '/logo.png'
        },
        container: 'auth0-lock-container',
        allowedConnections: ['Username-Password-Authentication'],
        allowSignUp: false,  // ← NO SIGNUP IN LOCK (use /signup route)
        allowForgotPassword: true,
        languageDictionary: {
          title: 'Your App Name',
          loginWithTitle: 'Log in'
        }
      });

      lock.on('authorization_error', (error) => {
        setError(`Authentication failed: ${error.error_description}`);
      });

      lock.on('unrecoverable_error', (error) => {
        setError('Authentication service error. Please try again.');
      });

      lock.show();

      return () => lock.destroy();
    } catch (err) {
      setError('Failed to initialize authentication');
      console.error('LoginPage error:', err);
    }
  }, [primary]);

  if (error) {
    return (
      <div style={{ padding: '20px', color: '#dc2626' }}>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={styles.loginContainer}>
      {/* Hero Section - Left (Desktop only) */}
      <div className={styles.heroSection}>
        <h1 className={styles.heroTitle}>Streamline Assessment</h1>
        <img
          src="/TeacherWithKid1.png"
          alt="Teacher with student"
          className={styles.heroImage}
        />
        <div className={styles.infoBox}>✨ Streamline Assessment</div>
        <div className={styles.infoBox}>⭐ Better Feedback</div>
      </div>

      {/* Lock Widget - Right */}
      <div className={styles.lockContainer}>
        <div id="auth0-lock-container" />
      </div>

      {/* Sign Up Link - Add Below Lock or in Separate Component */}
      <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px' }}>
        Don't have an account?{' '}
        <a href="/signup" style={{ color: primary.main, fontWeight: 600 }}>
          Create one here
        </a>
      </div>
    </div>
  );
}
```

---

## Key Styling Points

✅ **Desktop (1200px+)**
- Hero section on left (45% width)
- Lock Widget on right (45% width)
- Gradient background from primary colors
- Centered layout with 60px side padding

✅ **Tablet (768px - 1199px)**
- Hero section hidden or stacked
- Lock Widget centered, 90% width
- Maintained touch targets (44px)

✅ **Mobile (< 768px)**
- Hero section hidden
- Lock Widget full width with 20px padding
- All touch targets 44px minimum
- 16px font size (prevents iOS auto-zoom)

✅ **Dark Mode**
- Automatically adapts via design tokens
- Text contrast maintained
- Gradient colors adjusted
- Uses system preference (prefers-color-scheme)

✅ **Focus & Accessibility**
- 2px solid outline on focus
- 2px outline-offset for clarity
- Color from design tokens (primary.main)
- Keyboard navigable
- ARIA labels (Lock handles)

---

## Next Steps for Frontend Engineer

1. Review this mockup
2. Review design tokens in `src/theme/tokens.ts`
3. Verify hero section design
4. Start TASK 1 (component setup)
5. Run tests as you implement

---

**Note**: This example shows the styling approach. The actual implementation will be in the component based on `tasks.md`.
