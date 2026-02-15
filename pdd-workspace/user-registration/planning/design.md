# User Registration - Technical Design

**Feature**: User Registration (Sign-Up)
**Status**: Design Phase
**Last Updated**: 2026-02-06

## Architecture Overview

```
User Registration Flow:

┌─────────────────────────────────────────────────────────────┐
│                     SignupPage Route                         │
│                    (/signup path)                            │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   SignupForm Component                       │
│  - Manages form state (firstName, lastName, email, etc.)    │
│  - Handles validation (client-side rules)                   │
│  - Shows error/success messages                             │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
                  ┌─────────────────────┐
                  │   Validation Layer   │
                  │  (Form-level rules)  │
                  └─────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              User Registration Service                       │
│     (API call to /api/users/create)                         │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend API Endpoint                      │
│              /api/users/create (POST)                        │
│   - Receives: email, password, user_metadata                │
│   - Creates Auth0 user                                       │
│   - Returns: user_id, email, created_at                      │
└─────────────────────────────────────────────────────────────┘
                            │
         ┌──────────────────┼──────────────────┐
         │                  │                  │
    ✅ Success         ⚠️ Error          🔄 Retry
   (HTTP 201)      (400/403/500)
         │                  │                  │
         ▼                  ▼                  ▼
   Redirect to       Show Error         Keep Form
   Login Page        Message             Visible
```

## Component Structure

### SignupPage Component
**File**: `src/pages/SignupPage.tsx`
**Responsibility**: Router-level page component

```typescript
export const SignupPage: React.FC = () => {
  return (
    <div className="signup-page">
      <div className="signup-container">
        {/* Left: Teacher Image with Gradient Background */}
        <div className="signup-hero">
          {/* Decorative teacher image */}
        </div>

        {/* Right: Signup Form */}
        <SignupForm />
      </div>
    </div>
  )
}
```

### SignupForm Component
**File**: `src/components/auth/SignupForm.tsx`
**Responsibility**: Form logic, validation, API integration

```typescript
interface FormState {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
}

interface FormErrors {
  firstName?: string
  lastName?: string
  email?: string
  password?: string
  confirmPassword?: string
  submit?: string
}

export const SignupForm: React.FC = () => {
  // Form state management
  const [formData, setFormData] = useState<FormState>({...})
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  // Validation functions
  const validateField = (name: string, value: string): string | undefined => {...}
  const validateForm = (): boolean => {...}

  // API integration
  const handleSubmit = async (e: React.FormEvent) => {...}
  const createAccount = async (formData: FormState): Promise<void> => {...}

  // Render form fields with validation
  return (...)
}
```

## Form Validation

### Client-Side Validation Rules

**First Name & Last Name**:
- Required: Not empty
- Max length: 100 characters
- Pattern: Alphanumeric + spaces allowed

**Email**:
- Required: Not empty
- Format: Valid email pattern (basic RFC check)
- Max length: 255 characters

**Password**:
- Required: Not empty
- Minimum: 8 characters
- Must include: At least one uppercase letter (A-Z)
- Must include: At least one lowercase letter (a-z)
- Must include: At least one number (0-9)
- Max length: 128 characters

**Confirm Password**:
- Required: Not empty
- Match: Must exactly match Password field

### Validation Timing
- On blur: Validate individual field
- On change: Clear error for that field (if user is correcting)
- On submit: Validate entire form before API call

## API Integration

### Endpoint: POST `/api/users/create`

**Request Payload**:
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123",
  "user_metadata": {
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

**Success Response** (HTTP 201):
```json
{
  "user_id": "auth0|abc123...",
  "email": "john.doe@example.com",
  "created_at": "2026-02-06T10:30:00Z"
}
```

**Error Responses**:

| Status | Scenario | Message |
|--------|----------|---------|
| 400 | Invalid request data | Backend validation error message |
| 400 | Email already exists | "This email is already registered. Please log in or use a different email." |
| 403 | Origin not authorized | "Account creation is not available. Please contact support." |
| 500 | Server error | "An error occurred while creating your account. Please try again." |

## Error Handling

### Error Display
- Use existing error modal/alert pattern from app
- Red background with error icon
- Clear, actionable error messages
- Show specific error from backend when available
- Generic fallback for unexpected errors

### Error State Management
```typescript
// After failed submission:
- Show error message
- Keep user on signup form
- Enable submit button for retry
- Clear only password fields (for security)
- Keep other fields filled (for convenience)
```

## State Flow

```
┌─────────────┐
│  Idle State │
└──────┬──────┘
       │ (user fills form)
       ▼
┌──────────────┐
│ Validating   │ (real-time validation as user types)
└──────┬───────┘
       │ (user submits)
       ▼
┌──────────────┐
│  Submitting  │ (loading state, button disabled)
└──────┬───────┘
       │
       ├─── ✅ Success ──▶ Redirect to Login
       │
       └─── ❌ Error ───▶ Show Error Message
                          (return to Validating)
```

## Navigation Routes

### New Routes
- **`/signup`**: Signup page with form
  - Accessible to unauthenticated users only
  - Redirect to dashboard if already logged in

### Modified Routes
- **`/login`**: Add link to `/signup`
  - Text: "Don't have an account? Create one" or similar
  - Styled as secondary action or link

## Design System Integration

### Design Tokens Usage
- **Colors**: Use existing theme colors (blues for buttons, grays for text)
- **Typography**: Use existing font family and sizes
- **Spacing**: Use existing spacing scale (padding, margins, gaps)
- **Borders**: Use existing border radius and thickness
- **Shadows**: Use existing shadow definitions
- **Responsive**: Use existing breakpoint system

### Components to Use/Reuse
- **TextInput**: Existing input component (or create if doesn't exist)
- **Button**: Existing Button component (primary for submit, secondary for links)
- **ErrorAlert**: Error display component (similar to FinalCommentsModal)
- **Label**: Form label component
- **Form**: Semantic form wrapper

### Layout Pattern
- Left side: Teacher image with gradient background (200-300px width on desktop)
- Right side: Form in card/container (400-500px width)
- Mobile: Stack vertically, hide/minimize image
- Tablet/Desktop: Side-by-side layout

## Testing Strategy

### Unit Tests
- Validation function tests (input → error message)
- State update tests
- Form submission logic

### Component Tests (TDD)
- Form renders with all fields
- Validation displays errors correctly
- Password matching validation works
- Form submission disabled until valid
- API call made with correct payload
- Success redirects to login
- Error shows message and allows retry
- Responsive layout works on mobile/tablet/desktop

### Integration Tests
- Navigation from login page to signup
- Navigation from signup back to login
- Full signup flow (fill form → submit → redirect)
- Error handling and retry flow

## Security Considerations

### Password Handling
- ✅ Passwords transmitted over HTTPS only (browser handles)
- ✅ Passwords NOT logged or stored in state unnecessarily
- ✅ Password fields cleared on success for security
- ✅ Password never displayed in DOM except in password input
- ⚠️ Client-side validation is UX only, not security
- ⚠️ Backend must validate again

### Data Privacy
- ✅ Only collect necessary fields (firstName, lastName, email, password)
- ✅ No tracking cookies or analytics on signup (check)
- ✅ Clear privacy notice if needed (legal decision)

### CSRF/Security
- ✅ Browser handles same-origin POST requests
- ✅ Backend validates origin (`/api/users/create` has 403 for unknown origins)

## Accessibility (WCAG 2.1 AA)

- Form labels associated with inputs via `htmlFor`
- Error messages linked to fields via `aria-describedby`
- Invalid fields marked with `aria-invalid="true"`
- Keyboard navigation: Tab order follows visual order
- Screen reader: Announces field labels, errors, button purpose
- Sufficient color contrast in all states
- Touch targets: Minimum 44px for mobile (buttons, inputs)

## Implementation Phases

### Phase 1: MVP (Core Feature)
1. Create SignupPage and SignupForm components
2. Implement form validation (client-side)
3. Implement API service function
4. Add success/error handling
5. Add link from login page

### Phase 2: Polish
6. Responsive design refinement
7. Accessibility audit and fixes
8. Visual design refinement
9. Error message UX improvements

## Dependencies

**Frontend**:
- React 18+ (hooks, routing)
- React Router (navigation)
- Design system tokens (existing)
- Existing Button, TextInput, Label components

**Backend**:
- `/api/users/create` endpoint (existing)
- Auth0 integration (existing)

**External**:
- None (backend handles Auth0)

## File Structure

```
src/
├── pages/
│   └── SignupPage.tsx            (Page wrapper with layout)
├── components/
│   └── auth/
│       ├── SignupForm.tsx        (Form logic & validation)
│       └── SignupForm.test.tsx   (Component tests)
├── services/
│   ├── api/
│   │   ├── userService.ts        (API calls)
│   │   └── userService.test.ts   (Service tests)
├── utils/
│   ├── userValidators.ts         (User-specific validation functions)
│   └── userValidators.test.ts    (User validation tests)
```

---

**Design Status**: Ready for Implementation
**Next Steps**: Create task breakdown and estimation
