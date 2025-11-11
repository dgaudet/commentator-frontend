/**
 * SubjectList Component Design Token Tests
 * TDD Phase: RED - Writing failing tests first
 *
 * Testing SubjectList uses design tokens instead of hardcoded values
 */
import { render, screen } from '../../../test-utils'
import { SubjectList } from '../SubjectList'
import { colors, spacing, typography, borders, shadows } from '../../../theme/tokens'
import type { Subject } from '../../../types/Subject'
import { useSubjects } from '../../../hooks/useSubjects'
import { useOutcomeComments } from '../../../hooks/useOutcomeComments'
import { usePersonalizedComments } from '../../../hooks/usePersonalizedComments'
import { useClasses } from '../../../hooks/useClasses'
import { useFinalComments } from '../../../hooks/useFinalComments'

// Mock hooks
jest.mock('../../../hooks/useSubjects')
jest.mock('../../../hooks/useOutcomeComments')
jest.mock('../../../hooks/usePersonalizedComments')
jest.mock('../../../hooks/useClasses')
jest.mock('../../../hooks/useFinalComments')

const mockUseSubjects = useSubjects as jest.MockedFunction<typeof useSubjects>
const mockUseOutcomeComments = useOutcomeComments as jest.MockedFunction<typeof useOutcomeComments>
const mockUsePersonalizedComments = usePersonalizedComments as jest.MockedFunction<typeof usePersonalizedComments>
const mockUseClasses = useClasses as jest.MockedFunction<typeof useClasses>
const mockUseFinalComments = useFinalComments as jest.MockedFunction<typeof useFinalComments>

const mockSubjects: Subject[] = [
  {
    id: 1,
    name: 'Mathematics',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 2,
    name: 'English',
    createdAt: '2024-01-16T11:00:00Z',
    updatedAt: '2024-01-16T11:00:00Z',
  },
]

describe('SubjectList Component Design Tokens', () => {
  beforeEach(() => {
    mockUseSubjects.mockReturnValue({
      subjects: mockSubjects,
      isLoading: false,
      error: null,
      clearError: jest.fn(),
      deleteSubject: jest.fn(),
      fetchSubjects: jest.fn(),
    })

    mockUseOutcomeComments.mockReturnValue({
      outcomeComments: [],
      loading: false,
      error: null,
      loadOutcomeComments: jest.fn(),
      createComment: jest.fn(),
      updateComment: jest.fn(),
      deleteComment: jest.fn(),
    })

    mockUsePersonalizedComments.mockReturnValue({
      personalizedComments: [],
      loading: false,
      error: null,
      loadPersonalizedComments: jest.fn(),
      createComment: jest.fn(),
      updateComment: jest.fn(),
      deleteComment: jest.fn(),
    })

    mockUseClasses.mockReturnValue({
      classes: [],
      loading: false,
      error: null,
      loadClasses: jest.fn(),
      createClass: jest.fn(),
      updateClass: jest.fn(),
      deleteClass: jest.fn(),
    })

    mockUseFinalComments.mockReturnValue({
      finalComments: [],
      loading: false,
      error: null,
      loadFinalComments: jest.fn(),
      createComment: jest.fn(),
      updateComment: jest.fn(),
      deleteComment: jest.fn(),
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('AC1: Container styling with design tokens', () => {
    it('should use design token padding for main container', () => {
      const { container } = render(<SubjectList />)

      // Main container is the first div child of the component root
      const mainContainer = container.firstChild as HTMLElement

      expect(mainContainer).toHaveStyle({
        padding: spacing['2xl'],
      })
    })
  })

  describe('AC1: Header styling with design tokens', () => {
    it('should use design tokens for header container layout', () => {
      render(<SubjectList onAddSubject={jest.fn()} />)

      const heading = screen.getByText('Your Subjects')
      const headerContainer = heading.parentElement

      expect(headerContainer).toHaveStyle({
        display: 'flex',
        alignItems: 'center',
        gap: spacing.xl,
        marginBottom: spacing['2xl'],
      })
    })

    it('should use design tokens for heading text styles', () => {
      render(<SubjectList />)

      const heading = screen.getByText('Your Subjects')

      expect(heading).toHaveStyle({
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.bold,
        color: colors.text.primary,
        margin: '0',
      })
    })
  })

  describe('AC1: Dropdown container styling with design tokens', () => {
    it('should use design tokens for dropdown container spacing', () => {
      render(<SubjectList />)

      const label = screen.getByText('Select a Subject')
      const dropdownContainer = label.parentElement

      expect(dropdownContainer).toHaveStyle({
        marginBottom: spacing['2xl'],
        maxWidth: '500px',
      })
    })
  })

  describe('AC1: Label styling with design tokens', () => {
    it('should use design tokens for label styles', () => {
      render(<SubjectList />)

      const label = screen.getByText('Select a Subject')

      expect(label).toHaveStyle({
        display: 'block',
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.medium,
        color: colors.text.secondary,
        marginBottom: spacing.md,
      })
    })
  })

  describe('AC1: Select element styling with design tokens', () => {
    it('should use design tokens for select element styles', () => {
      render(<SubjectList />)

      const select = screen.getByRole('combobox', { name: /select a subject/i })

      expect(select).toHaveStyle({
        display: 'block',
        width: '100%',
        padding: spacing.md,
        fontSize: typography.fontSize.base,
        border: `${borders.width.thick} solid ${colors.border.default}`,
        borderRadius: borders.radius.md,
        backgroundColor: colors.background.secondary,
        boxShadow: shadows.sm,
        cursor: 'pointer',
      })
    })
  })

  describe('AC2: Maintain existing API', () => {
    it('should preserve onAddSubject callback functionality', () => {
      const mockOnAddSubject = jest.fn()
      render(<SubjectList onAddSubject={mockOnAddSubject} />)

      expect(screen.getByText('Add Subject')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /add subject/i })).toBeInTheDocument()
    })

    it('should preserve dropdown functionality', () => {
      render(<SubjectList />)

      const select = screen.getByRole('combobox')
      expect(select).toBeInTheDocument()
      expect(screen.getByText('Select a subject...')).toBeInTheDocument()
      expect(screen.getByText('Mathematics')).toBeInTheDocument()
      expect(screen.getByText('English')).toBeInTheDocument()
    })

    it('should preserve loading state rendering', () => {
      mockUseSubjects.mockReturnValue({
        subjects: [],
        isLoading: true,
        error: null,
        clearError: jest.fn(),
        deleteSubject: jest.fn(),
        fetchSubjects: jest.fn(),
      })

      render(<SubjectList />)

      expect(screen.getByRole('status')).toBeInTheDocument()
    })
  })

  describe('AC3: Visual consistency - colors and spacing unchanged', () => {
    it('should render container with same visual appearance', () => {
      const { container } = render(<SubjectList />)
      const mainContainer = container.firstChild as HTMLElement

      expect(mainContainer).toHaveStyle({
        padding: '2rem',
      })
    })

    it('should render heading with same visual appearance', () => {
      render(<SubjectList />)

      const heading = screen.getByText('Your Subjects')

      expect(heading).toHaveStyle({
        fontSize: '1.5rem',
        color: '#111827',
      })
    })

    it('should render label with same visual appearance', () => {
      render(<SubjectList />)

      const label = screen.getByText('Select a Subject')

      expect(label).toHaveStyle({
        fontSize: '1.25rem',
        color: '#374151',
        marginBottom: '0.75rem',
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

    it('should verify spacing.md equals 0.75rem', () => {
      expect(spacing.md).toBe('0.75rem')
    })

    it('should verify typography.fontSize.xl equals 1.5rem', () => {
      expect(typography.fontSize.xl).toBe('1.5rem')
    })

    it('should verify typography.fontSize.lg equals 1.25rem', () => {
      expect(typography.fontSize.lg).toBe('1.25rem')
    })

    it('should verify typography.fontSize.base equals 1rem', () => {
      expect(typography.fontSize.base).toBe('1rem')
    })

    it('should verify typography.fontWeight.bold equals 700', () => {
      expect(typography.fontWeight.bold).toBe(700)
    })

    it('should verify typography.fontWeight.medium equals 500', () => {
      expect(typography.fontWeight.medium).toBe(500)
    })

    it('should verify colors.text.primary equals #111827', () => {
      expect(colors.text.primary).toBe('#111827')
    })

    it('should verify colors.text.secondary equals #374151', () => {
      expect(colors.text.secondary).toBe('#374151')
    })

    it('should verify colors.background.secondary equals #F9FAFB', () => {
      expect(colors.background.secondary).toBe('#F9FAFB')
    })

    it('should verify borders.radius.md equals 8px', () => {
      expect(borders.radius.md).toBe('8px')
    })

    it('should verify borders.width.thick equals 2px', () => {
      expect(borders.width.thick).toBe('2px')
    })

    it('should verify shadows.sm matches expected value', () => {
      expect(shadows.sm).toBe('0 1px 2px rgba(0, 0, 0, 0.05)')
    })
  })
})
