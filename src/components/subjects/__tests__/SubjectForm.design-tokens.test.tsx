/**
 * SubjectForm Component Design Token Tests
 * TDD Phase: RED - Writing failing tests first
 * Reference: US-UI-001
 *
 * Testing SubjectForm component uses design tokens consistently
 */
import { render, screen } from '../../../test-utils'
import { SubjectForm } from '../SubjectForm'
import { useSubjects } from '../../../hooks/useSubjects'
import { colors, spacing, typography, borders, shadows } from '../../../theme/tokens'
import type { Subject } from '../../../types/Subject'

// Mock the useSubjects hook
jest.mock('../../../hooks/useSubjects')

const mockUseSubjects = useSubjects as jest.MockedFunction<typeof useSubjects>

const mockExistingSubject: Subject = {
  id: '65a1b2c3d4e5f6g7h8i9j0k1',
  name: 'Mathematics 101',
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-15T10:30:00Z',
}

describe('US-UI-001: SubjectForm Component Design Tokens', () => {
  const mockOnSuccess = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseSubjects.mockReturnValue({
      subjects: [],
      isLoading: false,
      error: null,
      fetchSubjects: jest.fn(),
      createSubject: jest.fn(),
      updateSubject: jest.fn(),
      deleteSubject: jest.fn(),
      clearError: jest.fn(),
    })
  })

  describe('AC1: Container styling with design tokens (create mode)', () => {
    it('should use design token background color in create mode', () => {
      const { container } = render(<SubjectForm onSuccess={mockOnSuccess} />)
      const formContainer = container.querySelector('div')

      expect(formContainer).toHaveStyle({
        backgroundColor: colors.background.primary,
      })
    })

    it('should use design token border radius in create mode', () => {
      const { container } = render(<SubjectForm onSuccess={mockOnSuccess} />)
      const formContainer = container.querySelector('div')

      expect(formContainer).toHaveStyle({
        borderRadius: borders.radius.md,
      })
    })

    it('should use design token box shadow in create mode', () => {
      const { container } = render(<SubjectForm onSuccess={mockOnSuccess} />)
      const formContainer = container.querySelector('div')

      expect(formContainer).toHaveStyle({
        boxShadow: shadows.md,
      })
    })

    it('should use design token padding in create mode', () => {
      const { container } = render(<SubjectForm onSuccess={mockOnSuccess} />)
      const formContainer = container.querySelector('div')

      expect(formContainer).toHaveStyle({
        padding: spacing['2xl'],
      })
    })
  })

  describe('AC1: Heading styling with design tokens', () => {
    it('should use design token font size for heading', () => {
      render(<SubjectForm onSuccess={mockOnSuccess} />)
      const heading = screen.getByText('Add New Subject')

      expect(heading).toHaveStyle({
        fontSize: typography.fontSize.xl,
      })
    })

    it('should use design token font weight for heading', () => {
      render(<SubjectForm onSuccess={mockOnSuccess} />)
      const heading = screen.getByText('Add New Subject')

      expect(heading).toHaveStyle({
        fontWeight: typography.fontWeight.bold,
      })
    })

    it('should use design token text color for heading', () => {
      render(<SubjectForm onSuccess={mockOnSuccess} />)
      const heading = screen.getByText('Add New Subject')

      expect(heading).toHaveStyle({
        color: colors.text.primary,
      })
    })

    it('should use design token margin bottom for heading', () => {
      render(<SubjectForm onSuccess={mockOnSuccess} />)
      const heading = screen.getByText('Add New Subject')

      expect(heading).toHaveStyle({
        marginBottom: spacing['2xl'],
      })
    })
  })

  describe('AC1: Error message container spacing with design tokens', () => {
    it('should use design token margin bottom for submit error container', async () => {
      mockUseSubjects.mockReturnValue({
        subjects: [],
        isLoading: false,
        error: null,
        fetchSubjects: jest.fn(),
        createSubject: jest.fn().mockRejectedValue(new Error('Network error')),
        updateSubject: jest.fn(),
        deleteSubject: jest.fn(),
        clearError: jest.fn(),
      })

      render(<SubjectForm onSuccess={mockOnSuccess} />)

      // Submit form to trigger error
      const nameInput = screen.getByLabelText(/subject name/i)
      const submitButton = screen.getByRole('button', { name: /create subject/i })

      // Fill in valid data
      nameInput.focus()
      nameInput.blur()

      // Change to valid name
      nameInput.focus()
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value',
      )?.set
      if (nativeInputValueSetter) {
        nativeInputValueSetter.call(nameInput, 'Test Subject')
      }
      const event = new Event('input', { bubbles: true })
      nameInput.dispatchEvent(event)

      submitButton.click()

      await screen.findByText(/failed to create subject/i)

      // ErrorMessage renders: <div><ErrorMessage/></div> where outer div has marginBottom
      // ErrorMessage has role="alert", so we get alert's parent
      const alerts = screen.getAllByRole('alert')
      const submitErrorAlert = alerts.find(alert => alert.textContent?.includes('Failed to create'))
      const errorContainer = submitErrorAlert?.parentElement

      expect(errorContainer).toHaveStyle({
        marginBottom: spacing.lg,
      })
    })

    it('should use design token margin bottom for duplicate error container', async () => {
      mockUseSubjects.mockReturnValue({
        subjects: [mockExistingSubject],
        isLoading: false,
        error: null,
        fetchSubjects: jest.fn(),
        createSubject: jest.fn(),
        updateSubject: jest.fn(),
        deleteSubject: jest.fn(),
        clearError: jest.fn(),
      })

      render(<SubjectForm onSuccess={mockOnSuccess} />)

      const nameInput = screen.getByLabelText(/subject name/i)
      const submitButton = screen.getByRole('button', { name: /create subject/i })

      // Enter duplicate name
      nameInput.focus()
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value',
      )?.set
      if (nativeInputValueSetter) {
        nativeInputValueSetter.call(nameInput, 'Mathematics 101')
      }
      const event = new Event('input', { bubbles: true })
      nameInput.dispatchEvent(event)

      submitButton.click()

      await screen.findByText(/a subject with this name already exists/i)

      // ErrorMessage renders: <div><ErrorMessage/></div> where outer div has marginBottom
      // ErrorMessage has role="alert", so we get alert's parent
      const alerts = screen.getAllByRole('alert')
      const duplicateErrorAlert = alerts.find(alert => alert.textContent?.includes('already exists'))
      const errorContainer = duplicateErrorAlert?.parentElement

      expect(errorContainer).toHaveStyle({
        marginBottom: spacing.lg,
      })
    })
  })

  describe('AC1: Button container spacing with design tokens', () => {
    it('should use design token margin top for button container in create mode', () => {
      render(<SubjectForm onSuccess={mockOnSuccess} />)

      const createButton = screen.getByRole('button', { name: /create subject/i })
      const buttonContainer = createButton.parentElement

      expect(buttonContainer).toHaveStyle({
        marginTop: spacing.xl,
      })
    })

    it('should use design token gap for button group in create mode with cancel button', () => {
      render(<SubjectForm onSuccess={mockOnSuccess} onCancel={jest.fn()} />)

      const createButton = screen.getByRole('button', { name: /create subject/i })
      const buttonContainer = createButton.parentElement

      expect(buttonContainer).toHaveStyle({
        display: 'flex',
        gap: spacing.lg,
      })
    })

    it('should use design token margin top for button container in edit mode', () => {
      render(
        <SubjectForm
          existingSubject={mockExistingSubject}
          onSuccess={mockOnSuccess}
        />,
      )

      const updateButton = screen.getByRole('button', { name: /update subject/i })
      // In edit mode: <div marginTop><div width="100%"><Button/></div></div>
      // So button.parentElement.parentElement gets the outer div with marginTop
      const buttonContainer = updateButton.parentElement?.parentElement

      expect(buttonContainer).toHaveStyle({
        marginTop: spacing.xl,
      })
    })
  })

  describe('AC2: Maintain existing API', () => {
    it('should preserve onSuccess callback', async () => {
      const mockCreate = jest.fn().mockResolvedValue({
        id: '65a1b2c3d4e5f6g7h8i9j0k2',
        name: 'Test Subject',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
      })

      mockUseSubjects.mockReturnValue({
        subjects: [],
        isLoading: false,
        error: null,
        fetchSubjects: jest.fn(),
        createSubject: mockCreate,
        updateSubject: jest.fn(),
        deleteSubject: jest.fn(),
        clearError: jest.fn(),
      })

      render(<SubjectForm onSuccess={mockOnSuccess} />)

      const nameInput = screen.getByLabelText(/subject name/i)
      const submitButton = screen.getByRole('button', { name: /create subject/i })

      nameInput.focus()
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value',
      )?.set
      if (nativeInputValueSetter) {
        nativeInputValueSetter.call(nameInput, 'Test Subject')
      }
      const event = new Event('input', { bubbles: true })
      nameInput.dispatchEvent(event)

      submitButton.click()

      await screen.findByRole('button', { name: /create subject/i })

      expect(mockOnSuccess).toHaveBeenCalled()
    })

    it('should preserve onCancel callback', () => {
      const mockOnCancel = jest.fn()

      render(<SubjectForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />)

      const cancelButton = screen.getByRole('button', { name: /cancel/i })
      cancelButton.click()

      expect(mockOnCancel).toHaveBeenCalled()
    })

    it('should preserve existingSubject prop behavior', () => {
      render(
        <SubjectForm
          existingSubject={mockExistingSubject}
          onSuccess={mockOnSuccess}
        />,
      )

      // Edit mode should not show a form title
      expect(screen.queryByRole('heading')).not.toBeInTheDocument()
      expect(screen.getByLabelText(/subject name/i)).toHaveValue('Mathematics 101')
    })
  })

  describe('AC3: Visual consistency - colors unchanged', () => {
    it('should render create mode container with same visual appearance', () => {
      const { container } = render(<SubjectForm onSuccess={mockOnSuccess} />)
      const formContainer = container.querySelector('div')

      // Colors should be identical to original hardcoded values
      expect(formContainer).toHaveStyle({
        backgroundColor: '#FFFFFF',
        borderRadius: '8px',
      })
    })

    it('should render heading with same visual appearance', () => {
      render(<SubjectForm onSuccess={mockOnSuccess} />)
      const heading = screen.getByText('Add New Subject')

      expect(heading).toHaveStyle({
        fontSize: '1.5rem',
        color: '#111827',
      })
    })
  })

  describe('Token value verification', () => {
    it('should verify spacing.2xl equals 2rem', () => {
      expect(spacing['2xl']).toBe('2rem')
    })

    it('should verify spacing.xl equals 1.5rem', () => {
      expect(spacing.xl).toBe('1.5rem')
    })

    it('should verify spacing.lg equals 1rem', () => {
      expect(spacing.lg).toBe('1rem')
    })

    it('should verify typography.fontSize.xl equals 1.5rem', () => {
      expect(typography.fontSize.xl).toBe('1.5rem')
    })

    it('should verify colors.background.primary equals #FFFFFF', () => {
      expect(colors.background.primary).toBe('#FFFFFF')
    })

    it('should verify colors.text.primary equals #111827', () => {
      expect(colors.text.primary).toBe('#111827')
    })

    it('should verify borders.radius.md equals 8px', () => {
      expect(borders.radius.md).toBe('8px')
    })
  })
})
