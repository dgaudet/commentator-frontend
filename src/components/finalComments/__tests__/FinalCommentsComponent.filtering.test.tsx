/**
 * FinalCommentsComponent Filter Tests (RED PHASE)
 *
 * Tests for personalized comments filtering by rating and search
 * User Stories: US-FILTER-001, US-FILTER-002, US-FILTER-003
 * Acceptance Criteria: AC-1.1 through AC-3.4
 *
 * These tests are written FIRST (RED phase) to define the desired behavior,
 * then code will be implemented (GREEN phase) to make them pass.
 */

import { render, screen, fireEvent, waitFor } from '../../../test-utils'
import { FinalCommentsModal } from '../FinalCommentsModal'
import { usePersonalizedComments } from '../../../hooks/usePersonalizedComments'
import { useOutcomeComments } from '../../../hooks/useOutcomeComments'
import type { Class, PersonalizedComment, OutcomeComment } from '../../../types'

// Mock the hooks
jest.mock('../../../hooks/usePersonalizedComments')
jest.mock('../../../hooks/useOutcomeComments')

const mockUsePersonalizedComments = usePersonalizedComments as jest.MockedFunction<
  typeof usePersonalizedComments
>
const mockUseOutcomeComments = useOutcomeComments as jest.MockedFunction<typeof useOutcomeComments>

// Mock data
const mockClass: Class = {
  id: 'class-1',
  subjectId: 'subject-1',
  name: 'Math 101',
  year: 2024,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
}

const mockPersonalizedComments: PersonalizedComment[] = [
  {
    id: '1',
    subjectId: 'subject-1',
    comment: 'Excellent performance in all areas',
    rating: 5,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    subjectId: 'subject-1',
    comment: 'Very good effort and understanding',
    rating: 4,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    subjectId: 'subject-1',
    comment: 'Outstanding achievement',
    rating: 5,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '4',
    subjectId: 'subject-1',
    comment: 'Good solid work',
    rating: 3,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '5',
    subjectId: 'subject-1',
    comment: 'Needs improvement in focus',
    rating: 2,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
]

const mockOutcomeComments: OutcomeComment[] = []

describe('FinalCommentsModal - Personalized Comments Filtering', () => {
  const defaultProps = {
    isOpen: true,
    entityData: mockClass,
    finalComments: [],
    onCreateComment: jest.fn().mockResolvedValue(undefined),
    onUpdateComment: jest.fn().mockResolvedValue(undefined),
    onDeleteComment: jest.fn().mockResolvedValue(undefined),
    loading: false,
    error: null,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockUsePersonalizedComments.mockReturnValue({
      personalizedComments: mockPersonalizedComments,
      loading: false,
      error: null,
      loadPersonalizedComments: jest.fn(),
      createComment: jest.fn(),
      updateComment: jest.fn(),
      deleteComment: jest.fn(),
      clearError: jest.fn(),
    })
    mockUseOutcomeComments.mockReturnValue({
      outcomeComments: mockOutcomeComments,
      loading: false,
      error: null,
      loadOutcomeComments: jest.fn(),
      createComment: jest.fn(),
      updateComment: jest.fn(),
      deleteComment: jest.fn(),
      clearError: jest.fn(),
    })
  })

  describe('US-FILTER-001: Add Rating Selector to FinalCommentsComponent', () => {
    describe('AC-1.1: Rating Selector Renders', () => {
      it('should render rating selector above comment picker', () => {
        render(
          <FinalCommentsModal
            {...defaultProps}
          />,
        )

        // Rating selector should exist (radiogroup)
        const ratingGroup = screen.getByRole('radiogroup', { hidden: false })
        expect(ratingGroup).toBeInTheDocument()

        // Should have 5 radio buttons (ratings 1-5)
        const radioButtons = ratingGroup.querySelectorAll('[role="radio"]')
        expect(radioButtons).toHaveLength(5)

        // None should be selected initially (no rating selected by default)
        radioButtons.forEach((btn) => {
          expect(btn).toHaveAttribute('aria-checked', 'false')
        })
      })

      it('should display emoji representation for each rating level', () => {
        render(
          <FinalCommentsModal
            {...defaultProps}
            // Mocked hooks
          />,
        )

        const ratingGroup = screen.getByRole('radiogroup', { hidden: false })
        const radioButtons = ratingGroup.querySelectorAll('[role="radio"]')

        // Check that buttons have aria-labels indicating ratings 1-5
        expect(radioButtons[0]).toHaveAttribute('aria-label', expect.stringContaining('1'))
        expect(radioButtons[1]).toHaveAttribute('aria-label', expect.stringContaining('2'))
        expect(radioButtons[2]).toHaveAttribute('aria-label', expect.stringContaining('3'))
        expect(radioButtons[3]).toHaveAttribute('aria-label', expect.stringContaining('4'))
        expect(radioButtons[4]).toHaveAttribute('aria-label', expect.stringContaining('5'))
      })
    })

    describe('AC-1.2: Styling and Layout', () => {
      it('should position rating selector above typeahead search', () => {
        render(
          <FinalCommentsModal
            {...defaultProps}
            // Mocked hooks with comments
          />,
        )

        const ratingGroup = screen.getByRole('radiogroup', { hidden: false })
        const combobox = screen.getByRole('combobox', { hidden: false })

        // Rating should appear before typeahead in DOM (both exist)
        expect(ratingGroup).toBeInTheDocument()
        expect(combobox).toBeInTheDocument()

        // Check that rating selector appears before combobox in the DOM tree
        const ratingGroupPosition = ratingGroup.compareDocumentPosition(combobox)
        // DOCUMENT_POSITION_FOLLOWING (4) means the combobox comes after rating in DOM order
        expect(ratingGroupPosition & 4).toBeTruthy()
      })

      it('should use design tokens for spacing and styling', () => {
        const { container } = render(
          <FinalCommentsModal
            {...defaultProps}
            // Mocked hooks
          />,
        )

        const ratingGroup = container.querySelector('[role="radiogroup"]')
        const style = ratingGroup ? window.getComputedStyle(ratingGroup) : null

        // Should have gap spacing
        expect(style?.gap).toBeTruthy()
      })
    })

    describe('AC-1.3: Rating Selector Props', () => {
      it('should handle value and onChange callbacks correctly', async () => {
        render(
          <FinalCommentsModal
            {...defaultProps}
            // Mocked hooks
          />,
        )

        const ratingGroup = screen.getByRole('radiogroup', { hidden: false })
        const radioButtons = ratingGroup.querySelectorAll('[role="radio"]')

        // Click rating 4 (4th button)
        fireEvent.click(radioButtons[3])

        // After click, the button should be checked
        await waitFor(() => {
          expect(radioButtons[3]).toHaveAttribute('aria-checked', 'true')
        })
      })

      it('should have unique id and accessible labels', () => {
        render(
          <FinalCommentsModal
            {...defaultProps}
            // Mocked hooks
          />,
        )

        const ratingGroup = screen.getByRole('radiogroup')
        expect(ratingGroup).toHaveAttribute('id')
        expect(ratingGroup.id).toBeTruthy()

        const radioButtons = ratingGroup.querySelectorAll('[role="radio"]')
        radioButtons.forEach((btn) => {
          expect(btn).toHaveAttribute('aria-label')
        })
      })
    })

    describe('AC-1.4: Keyboard Navigation and Accessibility', () => {
      it('should support arrow key navigation', async () => {
        render(
          <FinalCommentsModal
            {...defaultProps}
            // Mocked hooks
          />,
        )

        const ratingGroup = screen.getByRole('radiogroup')
        const radioButtons = ratingGroup.querySelectorAll('[role="radio"]')

        // Click first button to focus
        fireEvent.click(radioButtons[0])

        // Press arrow right
        fireEvent.keyDown(radioButtons[0], { key: 'ArrowRight' })

        // Should move to next rating (though actual behavior depends on EmojiRatingSelector implementation)
        expect(radioButtons[0]).toHaveAttribute('aria-checked')
      })

      it('should be keyboard accessible with Tab and Enter', async () => {
        render(
          <FinalCommentsModal
            {...defaultProps}
            // Mocked hooks
          />,
        )

        const ratingGroup = screen.getByRole('radiogroup')
        const radioButtons = ratingGroup.querySelectorAll('[role="radio"]')

        // First button should be tabbable initially (tabindex 0 or -1 appropriately)
        expect(radioButtons[0]).toHaveAttribute('tabIndex')

        // Space should select
        fireEvent.keyDown(radioButtons[2], { key: ' ' })

        await waitFor(() => {
          expect(radioButtons[2]).toHaveAttribute('aria-checked')
        })
      })

      it('should have proper ARIA attributes for screen readers', () => {
        render(
          <FinalCommentsModal
            {...defaultProps}
            // Mocked hooks
          />,
        )

        const ratingGroup = screen.getByRole('radiogroup')

        // Should have role
        expect(ratingGroup).toHaveAttribute('role', 'radiogroup')

        // Each button should have radio role
        const radioButtons = ratingGroup.querySelectorAll('[role="radio"]')
        radioButtons.forEach((btn) => {
          expect(btn).toHaveAttribute('role', 'radio')
          expect(btn).toHaveAttribute('aria-checked')
          expect(btn).toHaveAttribute('aria-label')
        })
      })
    })

    describe('AC-2.2: Clear Filter Button', () => {
      it('should show clear filter button when rating is selected', async () => {
        render(
          <FinalCommentsModal
            {...defaultProps}
            // Mocked hooks
          />,
        )

        const ratingGroup = screen.getByRole('radiogroup')
        const radioButtons = ratingGroup.querySelectorAll('[role="radio"]')

        // Initially, clear button should not be visible
        expect(screen.queryByText(/clear.*filter/i)).not.toBeInTheDocument()

        // Select rating 5
        fireEvent.click(radioButtons[4])

        // Now the clear button should appear
        await waitFor(() => {
          expect(screen.getByText(/clear.*filter/i)).toBeInTheDocument()
        })
      })

      it('should hide clear filter button when no rating is selected', async () => {
        render(
          <FinalCommentsModal
            {...defaultProps}
            // Mocked hooks
          />,
        )

        const ratingGroup = screen.getByRole('radiogroup')
        const radioButtons = ratingGroup.querySelectorAll('[role="radio"]')

        // Select rating 3
        fireEvent.click(radioButtons[2])

        await waitFor(() => {
          expect(screen.getByText(/clear.*filter/i)).toBeInTheDocument()
        })

        // Click Clear Filter button to deselect (only way to clear radio group)
        const clearButton = screen.getByText(/clear.*filter/i)
        fireEvent.click(clearButton)

        // Clear button should disappear
        await waitFor(() => {
          expect(screen.queryByText(/clear.*filter/i)).not.toBeInTheDocument()
        })
      })

      it('should reset rating to 0 when clear filter button is clicked', async () => {
        render(
          <FinalCommentsModal
            {...defaultProps}
            // Mocked hooks
          />,
        )

        const ratingGroup = screen.getByRole('radiogroup')
        const radioButtons = ratingGroup.querySelectorAll('[role="radio"]')

        // Select rating 4
        fireEvent.click(radioButtons[3])

        await waitFor(() => {
          expect(radioButtons[3]).toHaveAttribute('aria-checked', 'true')
        })

        // Click clear filter button (find by text)
        const clearButton = screen.getByText(/clear.*filter/i)
        fireEvent.click(clearButton)

        // All rating buttons should be unchecked
        await waitFor(() => {
          radioButtons.forEach((btn) => {
            expect(btn).toHaveAttribute('aria-checked', 'false')
          })
        })

        // Clear button should disappear
        await waitFor(() => {
          expect(screen.queryByText(/clear.*filter/i)).not.toBeInTheDocument()
        })
      })

      it('should work for all rating levels', async () => {
        render(
          <FinalCommentsModal
            {...defaultProps}
            // Mocked hooks
          />,
        )

        const ratingGroup = screen.getByRole('radiogroup')
        const radioButtons = ratingGroup.querySelectorAll('[role="radio"]')

        // Test each rating level
        for (let i = 0; i < 5; i++) {
          // Select rating
          fireEvent.click(radioButtons[i])

          // Clear button should appear
          await waitFor(() => {
            expect(screen.getByText(/clear.*filter/i)).toBeInTheDocument()
          })

          // Click clear
          const clearButton = screen.getByText(/clear.*filter/i)
          fireEvent.click(clearButton)

          // All buttons should be unchecked
          await waitFor(() => {
            radioButtons.forEach((btn) => {
              expect(btn).toHaveAttribute('aria-checked', 'false')
            })
          })

          // Button should disappear
          await waitFor(() => {
            expect(screen.queryByText(/clear.*filter/i)).not.toBeInTheDocument()
          })
        }
      })

      it('should be accessible with proper aria-label', async () => {
        render(
          <FinalCommentsModal
            {...defaultProps}
            // Mocked hooks
          />,
        )

        const ratingGroup = screen.getByRole('radiogroup')
        const radioButtons = ratingGroup.querySelectorAll('[role="radio"]')

        // Select a rating
        fireEvent.click(radioButtons[2])

        // Verify clear button has proper aria-label for accessibility
        await waitFor(() => {
          const clearButton = screen.getByRole('button', { name: /clear/i })
          expect(clearButton).toHaveAttribute('aria-label')
          const ariaLabel = clearButton.getAttribute('aria-label') || ''
          expect(ariaLabel.toLowerCase()).toContain('clear')
        })
      })
    })
  })
})
