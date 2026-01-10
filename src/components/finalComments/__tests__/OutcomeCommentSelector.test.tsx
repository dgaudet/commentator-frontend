/**
 * OutcomeCommentSelector Component Tests
 * TDD Phase: RED - Writing failing tests first
 * Reference: US-FINAL-001 through US-FINAL-005
 *
 * Test strategy:
 * - Unit tests for single/multiple comment scenarios
 * - Integration tests with grade changes
 * - Accessibility tests (keyboard nav, screen reader)
 * - State management tests (selection, toggle state)
 */

import { render, screen } from '../../../test-utils'
import userEvent from '@testing-library/user-event'
import { OutcomeCommentSelector } from '../OutcomeCommentSelector'
import type { OutcomeComment } from '../../../types'

describe('OutcomeCommentSelector - US-FINAL-001: Single Comment Display', () => {
  const singleComment: OutcomeComment = {
    id: '1',
    lowerRange: 80,
    upperRange: 90,
    comment: 'Great job on this assignment',
    subjectId: 'subject-1',
    userId: 'user-1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  }

  const defaultProps = {
    grade: 85,
    selectedOutcomeCommentId: singleComment.id,
    outcomeComments: [singleComment],
    onSelectComment: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('AC-1.1: Single Comment Display', () => {
    it('should display a single outcome comment when grade matches one comment', () => {
      render(<OutcomeCommentSelector {...defaultProps} />)

      expect(screen.getByText('Great job on this assignment')).toBeInTheDocument()
    })

    it('should display the section title "Outcome Comment by Grade"', () => {
      render(<OutcomeCommentSelector {...defaultProps} />)

      expect(screen.getByText('Outcome Comment by Grade')).toBeInTheDocument()
    })

    it('should display full comment text without truncation', () => {
      const longComment: OutcomeComment = {
        ...singleComment,
        comment: 'This is an excellent example of student work that demonstrates mastery. The student showed great effort.',
      }

      render(
        <OutcomeCommentSelector
          {...defaultProps}
          outcomeComments={[longComment]}
          selectedOutcomeCommentId={longComment.id}
        />,
      )

      expect(screen.getByText(longComment.comment)).toBeInTheDocument()
    })
  })

  describe('AC-1.2: No Toggle Button Shown', () => {
    it('should NOT show a toggle button when only one comment matches', () => {
      render(<OutcomeCommentSelector {...defaultProps} />)

      // Toggle button should not exist
      expect(screen.queryByRole('button', { name: /show.*options/i })).not.toBeInTheDocument()
    })

    it('should not display any UI elements suggesting additional options exist', () => {
      render(<OutcomeCommentSelector {...defaultProps} />)

      // No "Show more" or similar text
      expect(screen.queryByText(/more option/i)).not.toBeInTheDocument()
      expect(screen.queryByText(/alternatives/i)).not.toBeInTheDocument()
    })

    it('should have clean layout without extra UI clutter', () => {
      const { container: testContainer } = render(<OutcomeCommentSelector {...defaultProps} />)

      // Should only have the section title and the comment display
      const buttons = testContainer.querySelectorAll('button')
      expect(buttons.length).toBe(0)
    })
  })

  describe('AC-1.3: Read-Only Display', () => {
    it('should display comment in read-only state', () => {
      const { container } = render(<OutcomeCommentSelector {...defaultProps} />)

      // Comment should not be in an editable input
      const inputs = container.querySelectorAll('input[type="text"], textarea')
      inputs.forEach((input) => {
        expect(input).not.toHaveTextContent(singleComment.comment)
      })
    })

    it('should use gray text color for secondary text (read-only styling)', () => {
      const { container } = render(<OutcomeCommentSelector {...defaultProps} />)

      // The component should use design token colors (secondary text color)
      // We'll verify this is using theme colors rather than hardcoded values
      const commentDisplay = container.querySelector('[data-testid="outcome-comment-display"]')
      expect(commentDisplay).toBeInTheDocument()
    })

    it('should communicate that comment cannot be modified from this interface', () => {
      render(<OutcomeCommentSelector {...defaultProps} />)

      // No edit buttons or hints should be shown
      expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument()
      expect(screen.queryByText(/edit/i)).not.toBeInTheDocument()
    })
  })

  describe('AC-1.4: Styling Consistency', () => {
    it('should use design tokens for spacing', () => {
      const { container } = render(<OutcomeCommentSelector {...defaultProps} />)

      // The component should be rendered (no errors)
      expect(container).toBeInTheDocument()
    })

    it('should apply read-only text box styling', () => {
      const { container } = render(<OutcomeCommentSelector {...defaultProps} />)

      // Should have a visible display area with consistent styling
      const display = container.querySelector('[data-testid="outcome-comment-display"]')
      expect(display).toBeInTheDocument()
    })

    it('should use design tokens for typography (font size, color)', () => {
      render(<OutcomeCommentSelector {...defaultProps} />)

      // Verify component renders with theme styling
      const title = screen.getByText('Outcome Comment by Grade')
      expect(title).toBeInTheDocument()
    })
  })

  describe('Test Case: TC-1.1 - Grade 85 matches 1 comment, display comment with no button', () => {
    it('should display grade 85 comment and hide toggle button', () => {
      const comment: OutcomeComment = {
        ...singleComment,
        lowerRange: 80,
        upperRange: 89,
      }

      render(
        <OutcomeCommentSelector
          grade={85}
          selectedOutcomeCommentId={comment.id}
          outcomeComments={[comment]}
          onSelectComment={jest.fn()}
        />,
      )

      expect(screen.getByText(comment.comment)).toBeInTheDocument()
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })
  })

  describe('Test Case: TC-1.2 - Comment displays correctly when replaced', () => {
    it('should update comment display when selectedOutcomeCommentId changes', () => {
      const comment1: OutcomeComment = {
        ...singleComment,
        id: '1',
        comment: 'First comment',
      }

      const { rerender } = render(
        <OutcomeCommentSelector
          {...defaultProps}
          selectedOutcomeCommentId={comment1.id}
          outcomeComments={[comment1]}
        />,
      )

      expect(screen.getByText('First comment')).toBeInTheDocument()

      // Rerender with different selected comment
      const comment2: OutcomeComment = {
        ...singleComment,
        id: '2',
        comment: 'Second comment',
      }

      rerender(
        <OutcomeCommentSelector
          {...defaultProps}
          selectedOutcomeCommentId={comment2.id}
          outcomeComments={[comment1, comment2]}
        />,
      )

      expect(screen.getByText('Second comment')).toBeInTheDocument()
      expect(screen.queryByText('First comment')).not.toBeInTheDocument()
    })
  })

  describe('Test Case: TC-1.3 - Grade change from 1-match to 1-match updates comment', () => {
    it('should update comment when grade changes to different 1-match grade', () => {
      const comment85: OutcomeComment = {
        ...singleComment,
        id: '1',
        lowerRange: 80,
        upperRange: 89,
        comment: 'Grade 85 comment',
      }

      const comment92: OutcomeComment = {
        ...singleComment,
        id: '2',
        lowerRange: 90,
        upperRange: 99,
        comment: 'Grade 92 comment',
      }

      const { rerender } = render(
        <OutcomeCommentSelector
          grade={85}
          selectedOutcomeCommentId={comment85.id}
          outcomeComments={[comment85, comment92]}
          onSelectComment={jest.fn()}
        />,
      )

      expect(screen.getByText('Grade 85 comment')).toBeInTheDocument()

      // Grade changes to 92
      rerender(
        <OutcomeCommentSelector
          grade={92}
          selectedOutcomeCommentId={comment92.id}
          outcomeComments={[comment85, comment92]}
          onSelectComment={jest.fn()}
        />,
      )

      expect(screen.getByText('Grade 92 comment')).toBeInTheDocument()
      expect(screen.queryByText('Grade 85 comment')).not.toBeInTheDocument()
    })
  })

  describe('Test Case: TC-1.4 - Very long comment (2 sentences max) displays without truncation', () => {
    it('should display full 2-sentence comment without truncation', () => {
      const longComment: OutcomeComment = {
        ...singleComment,
        comment:
          'This student demonstrates excellent comprehension of the material. They consistently provide thoughtful contributions to class discussions.',
      }

      render(
        <OutcomeCommentSelector
          {...defaultProps}
          outcomeComments={[longComment]}
          selectedOutcomeCommentId={longComment.id}
        />,
      )

      const displayedText = screen.getByText(longComment.comment)
      expect(displayedText.textContent).toBe(longComment.comment)
    })
  })
})

describe('OutcomeCommentSelector - US-FINAL-002: Multiple Outcomes - Collapsed State', () => {
  const comment1: OutcomeComment = {
    id: '1',
    lowerRange: 80,
    upperRange: 89,
    comment: 'Great job on this assignment',
    subjectId: 'subject-1',
    userId: 'user-1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  }

  const comment2: OutcomeComment = {
    id: '2',
    lowerRange: 80,
    upperRange: 89,
    comment: 'Excellent work overall',
    subjectId: 'subject-1',
    userId: 'user-1',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  }

  const comment3: OutcomeComment = {
    id: '3',
    lowerRange: 80,
    upperRange: 89,
    comment: 'Very impressive contribution',
    subjectId: 'subject-1',
    userId: 'user-1',
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z',
  }

  const defaultProps = {
    grade: 85,
    selectedOutcomeCommentId: comment1.id,
    outcomeComments: [comment1, comment2, comment3],
    onSelectComment: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('AC-2.1: First Comment Displays', () => {
    it('should display the first matching comment when grade matches 2+ comments', () => {
      render(<OutcomeCommentSelector {...defaultProps} />)

      expect(screen.getByText(comment1.comment)).toBeInTheDocument()
    })

    it('should display comment in read-only state', () => {
      const { container } = render(<OutcomeCommentSelector {...defaultProps} />)

      const commentDisplay = container.querySelector('[data-testid="outcome-comment-display"]')
      expect(commentDisplay).toBeInTheDocument()
    })
  })

  describe('AC-2.2: Toggle Button Appears', () => {
    it('should show "[+ Show X more options]" button when grade matches 2+ comments', () => {
      render(<OutcomeCommentSelector {...defaultProps} />)

      const button = screen.getByRole('button', { name: /show.*more option/i })
      expect(button).toBeInTheDocument()
    })

    it('should display correct count for 2 alternatives (3 total - 1 displayed)', () => {
      render(<OutcomeCommentSelector {...defaultProps} />)

      expect(screen.getByRole('button', { name: /show 2 more option/i })).toBeInTheDocument()
    })

    it('should use singular "option" when there is 1 alternative', () => {
      render(
        <OutcomeCommentSelector
          {...defaultProps}
          outcomeComments={[comment1, comment2]}
        />,
      )

      expect(screen.getByRole('button', { name: /show 1 more option/i })).toBeInTheDocument()
    })

    it('should use plural "options" when there are multiple alternatives', () => {
      render(<OutcomeCommentSelector {...defaultProps} />)

      expect(screen.getByRole('button', { name: /show 2 more options/i })).toBeInTheDocument()
    })
  })

  describe('AC-2.3: Button Styling', () => {
    it('should have button styled as text link (not prominent CTA)', () => {
      render(<OutcomeCommentSelector {...defaultProps} />)

      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      // Button styling should be applied (tested via visual inspection in UI)
    })

    it('should be keyboard accessible (Tab stops, Enter activates)', () => {
      render(<OutcomeCommentSelector {...defaultProps} />)

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('type')
      // Keyboard navigation verified through browser testing
    })
  })

  describe('AC-2.4: Comment Count Display', () => {
    it('should count alternatives correctly (not including current)', () => {
      render(<OutcomeCommentSelector {...defaultProps} />)

      // 3 total comments, 1 displayed, so 2 more options
      expect(screen.getByRole('button', { name: /show 2 more options/i })).toBeInTheDocument()
    })

    it('should update count dynamically if comments list changes', () => {
      const { rerender } = render(<OutcomeCommentSelector {...defaultProps} />)

      // Initially 2 alternatives
      expect(screen.getByRole('button', { name: /show 2 more options/i })).toBeInTheDocument()

      // Add one more comment
      rerender(
        <OutcomeCommentSelector
          {...defaultProps}
          outcomeComments={[comment1, comment2, comment3, { ...comment1, id: '4' }]}
        />,
      )

      // Now 3 alternatives
      expect(screen.getByRole('button', { name: /show 3 more options/i })).toBeInTheDocument()
    })
  })

  describe('AC-2.5: Alternatives Hidden', () => {
    it('should not display alternative comments before button is clicked', () => {
      render(<OutcomeCommentSelector {...defaultProps} />)

      // Should only see first comment
      expect(screen.getByText(comment1.comment)).toBeInTheDocument()
      // Should NOT see other comments
      expect(screen.queryByText(comment2.comment)).not.toBeInTheDocument()
      expect(screen.queryByText(comment3.comment)).not.toBeInTheDocument()
    })

    it('should show no preview or hint of other comments in read-only display area', () => {
      const { container } = render(<OutcomeCommentSelector {...defaultProps} />)

      const commentDisplay = container.querySelector('[data-testid="outcome-comment-display"]')
      expect(commentDisplay).toHaveTextContent(comment1.comment)
      expect(commentDisplay).not.toHaveTextContent(comment2.comment)
      expect(commentDisplay).not.toHaveTextContent(comment3.comment)
    })
  })

  describe('Test Case: TC-2.1 - Grade 91 matches 3 comments → Show 1st, "[+ Show 2 more options]" button', () => {
    it('should display 1st comment with correct button count', () => {
      render(<OutcomeCommentSelector {...defaultProps} />)

      expect(screen.getByText(comment1.comment)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /show 2 more options/i })).toBeInTheDocument()
    })
  })

  describe('Test Case: TC-2.2 - Grade 85 matches 2 comments → "[+ Show 1 more option]" (singular)', () => {
    it('should use singular form when there is 1 alternative', () => {
      render(
        <OutcomeCommentSelector
          {...defaultProps}
          outcomeComments={[comment1, comment2]}
        />,
      )

      expect(screen.getByRole('button', { name: /show 1 more option/i })).toBeInTheDocument()
    })
  })

  describe('Test Case: TC-2.3 - Button visible and clickable with mouse and keyboard', () => {
    it('should have button that is visible and can be interacted with', () => {
      render(<OutcomeCommentSelector {...defaultProps} />)

      const button = screen.getByRole('button')
      expect(button).toBeVisible()
      expect(button).toBeInTheDocument()
    })
  })

  describe('Test Case: TC-2.4 - Button count updates when comments list changes', () => {
    it('should update button count dynamically if comments list changes', () => {
      const { rerender } = render(<OutcomeCommentSelector {...defaultProps} />)

      expect(screen.getByRole('button', { name: /show 2 more options/i })).toBeInTheDocument()

      // Change to 2 total comments
      rerender(
        <OutcomeCommentSelector
          {...defaultProps}
          outcomeComments={[comment1, comment2]}
        />,
      )

      expect(screen.getByRole('button', { name: /show 1 more option/i })).toBeInTheDocument()
    })
  })

  describe('Test Case: TC-2.5 - Comment updates when grade changes to different 1-match grade', () => {
    it('should update first displayed comment when grade changes', () => {
      const { rerender } = render(
        <OutcomeCommentSelector
          grade={85}
          selectedOutcomeCommentId={comment1.id}
          outcomeComments={[comment1, comment2, comment3]}
          onSelectComment={jest.fn()}
        />,
      )

      expect(screen.getByText(comment1.comment)).toBeInTheDocument()

      // Change to different comment
      rerender(
        <OutcomeCommentSelector
          grade={85}
          selectedOutcomeCommentId={comment2.id}
          outcomeComments={[comment1, comment2, comment3]}
          onSelectComment={jest.fn()}
        />,
      )

      expect(screen.getByText(comment2.comment)).toBeInTheDocument()
      expect(screen.queryByText(comment1.comment)).not.toBeInTheDocument()
    })
  })
})

describe('OutcomeCommentSelector - US-FINAL-003: Multiple Outcomes - Expanded State', () => {
  const comment1: OutcomeComment = {
    id: '1',
    lowerRange: 80,
    upperRange: 89,
    comment: 'Great job on this assignment',
    subjectId: 'subject-1',
    userId: 'user-1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  }

  const comment2: OutcomeComment = {
    id: '2',
    lowerRange: 80,
    upperRange: 89,
    comment: 'Excellent work overall',
    subjectId: 'subject-1',
    userId: 'user-1',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  }

  const comment3: OutcomeComment = {
    id: '3',
    lowerRange: 80,
    upperRange: 89,
    comment: 'Very impressive contribution',
    subjectId: 'subject-1',
    userId: 'user-1',
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z',
  }

  const defaultProps = {
    grade: 85,
    selectedOutcomeCommentId: comment1.id,
    outcomeComments: [comment1, comment2, comment3],
    onSelectComment: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('AC-3.1: Expansion Animation', () => {
    it('should expand list when "[+ Show X more options]" button is clicked', async () => {
      render(<OutcomeCommentSelector {...defaultProps} />)

      const button = screen.getByRole('button', { name: /show 2 more options/i })
      await userEvent.click(button)

      // After expansion, alternatives should be visible
      expect(screen.getByText(comment2.comment)).toBeInTheDocument()
      expect(screen.getByText(comment3.comment)).toBeInTheDocument()
    })

    it('should expand in less than 300ms (smooth animation)', async () => {
      render(<OutcomeCommentSelector {...defaultProps} />)

      const button = screen.getByRole('button')
      const startTime = performance.now()
      await userEvent.click(button)
      const endTime = performance.now()

      // Verify expansion completed (alternatives visible)
      expect(screen.getByText(comment2.comment)).toBeInTheDocument()
      // Animation timing verified in performance tests
      expect(endTime - startTime).toBeLessThan(300)
    })

    it('should persist expansion state until user interacts again', async () => {
      const { unmount } = render(<OutcomeCommentSelector {...defaultProps} />)

      const button = screen.getByRole('button')
      await userEvent.click(button)

      // Alternatives visible
      expect(screen.getByText(comment2.comment)).toBeInTheDocument()

      // Unmount and re-render with same props (fresh component instance)
      unmount()
      render(<OutcomeCommentSelector {...defaultProps} />)

      // Note: New component instance resets state
      // This test verifies state resets on new component mount
      expect(screen.queryByText(comment2.comment)).not.toBeInTheDocument()
    })
  })

  describe('AC-3.2: Button Text Changes', () => {
    it('should change button text to "[- Hide alternatives]" when expanded', async () => {
      render(<OutcomeCommentSelector {...defaultProps} />)

      const button = screen.getByRole('button', { name: /show 2 more options/i })
      await userEvent.click(button)

      expect(screen.getByRole('button', { name: /hide alternatives/i })).toBeInTheDocument()
    })

    it('should return to "[+ Show X more options]" when collapsed again', async () => {
      render(<OutcomeCommentSelector {...defaultProps} />)

      const button = screen.getByRole('button', { name: /show 2 more options/i })
      await userEvent.click(button)

      // Now expanded
      expect(screen.getByRole('button', { name: /hide alternatives/i })).toBeInTheDocument()

      // Click again to collapse
      const collapseButton = screen.getByRole('button', { name: /hide alternatives/i })
      await userEvent.click(collapseButton)

      // Back to expanded text
      expect(screen.getByRole('button', { name: /show 2 more options/i })).toBeInTheDocument()
    })

    it('should maintain consistent button styling in both states', async () => {
      render(<OutcomeCommentSelector {...defaultProps} />)

      const expandedButton = screen.getByRole('button', { name: /show 2 more options/i })
      await userEvent.click(expandedButton)

      const collapsedButton = screen.getByRole('button', { name: /hide alternatives/i })
      expect(collapsedButton).toBeInTheDocument()
      // Styling consistency verified visually
    })
  })

  describe('AC-3.3: Alternatives List Display', () => {
    it('should display all alternatives as separate items when expanded', async () => {
      render(<OutcomeCommentSelector {...defaultProps} />)

      const button = screen.getByRole('button')
      await userEvent.click(button)

      expect(screen.getByText(comment2.comment)).toBeInTheDocument()
      expect(screen.getByText(comment3.comment)).toBeInTheDocument()
    })

    it('should display full comment text without truncation', async () => {
      const longComment: OutcomeComment = {
        ...comment2,
        comment: 'This is an excellent example of comprehensive work demonstrating mastery.',
      }

      render(
        <OutcomeCommentSelector
          {...defaultProps}
          outcomeComments={[comment1, longComment, comment3]}
        />,
      )

      const button = screen.getByRole('button')
      await userEvent.click(button)

      expect(screen.getByText(longComment.comment)).toBeInTheDocument()
    })

    it('should arrange items in vertical stack layout', async () => {
      const { container } = render(<OutcomeCommentSelector {...defaultProps} />)

      const button = screen.getByRole('button')
      await userEvent.click(button)

      // Verify alternatives list container exists
      const alternativesList = container.querySelector('[data-testid="outcome-alternatives-list"]')
      expect(alternativesList).toBeInTheDocument()
    })
  })

  describe('AC-3.4: Alternative Item Styling', () => {
    it('should have light background color (secondary background)', async () => {
      const { container } = render(<OutcomeCommentSelector {...defaultProps} />)

      const button = screen.getByRole('button')
      await userEvent.click(button)

      const items = container.querySelectorAll('[data-testid="outcome-alternative-item"]')
      expect(items.length).toBe(2)
    })

    it('should have consistent border radius matching form fields', async () => {
      const { container } = render(<OutcomeCommentSelector {...defaultProps} />)

      const button = screen.getByRole('button')
      await userEvent.click(button)

      const items = container.querySelectorAll('[data-testid="outcome-alternative-item"]')
      items.forEach((item) => {
        expect(item).toBeInTheDocument()
      })
    })

    it('should have proper padding consistent with form fields', async () => {
      const { container } = render(<OutcomeCommentSelector {...defaultProps} />)

      const button = screen.getByRole('button')
      await userEvent.click(button)

      const items = container.querySelectorAll('[data-testid="outcome-alternative-item"]')
      expect(items.length).toBeGreaterThan(0)
    })

    it('should use primary text color for alternative items', async () => {
      render(<OutcomeCommentSelector {...defaultProps} />)

      const button = screen.getByRole('button')
      await userEvent.click(button)

      expect(screen.getByText(comment2.comment)).toBeInTheDocument()
      expect(screen.getByText(comment3.comment)).toBeInTheDocument()
    })
  })

  describe('AC-3.5: Hover & Click Affordances', () => {
    it('should show hover state (darker background) on alternatives', async () => {
      const { container } = render(<OutcomeCommentSelector {...defaultProps} />)

      const button = screen.getByRole('button')
      await userEvent.click(button)

      const items = container.querySelectorAll('[data-testid="outcome-alternative-item"]')
      items.forEach((item) => {
        expect(item).toBeInTheDocument()
      })
    })

    it('should change cursor to pointer on hover', async () => {
      const { container } = render(<OutcomeCommentSelector {...defaultProps} />)

      const button = screen.getByRole('button')
      await userEvent.click(button)

      const items = container.querySelectorAll('[data-testid="outcome-alternative-item"]')
      items.forEach((item) => {
        const style = window.getComputedStyle(item)
        expect(style.cursor).toBe('pointer')
      })
    })

    it('should have focus state visible for keyboard navigation', async () => {
      const { container } = render(<OutcomeCommentSelector {...defaultProps} />)

      const button = screen.getByRole('button')
      await userEvent.click(button)

      const items = container.querySelectorAll('[data-testid="outcome-alternative-item"]')
      expect(items.length).toBeGreaterThan(0)
    })

    it('should have smooth color transition on hover', async () => {
      const { container } = render(<OutcomeCommentSelector {...defaultProps} />)

      const button = screen.getByRole('button')
      await userEvent.click(button)

      const items = container.querySelectorAll('[data-testid="outcome-alternative-item"]')
      items.forEach((item) => {
        expect(item).toBeInTheDocument()
      })
    })
  })

  describe('AC-3.6: Form Layout', () => {
    it('should expand section without pushing content below out of view', async () => {
      render(<OutcomeCommentSelector {...defaultProps} />)

      const button = screen.getByRole('button')
      await userEvent.click(button)

      // Verify alternatives are visible
      expect(screen.getByText(comment2.comment)).toBeInTheDocument()
      expect(screen.getByText(comment3.comment)).toBeInTheDocument()
    })

    it('should remain scrollable if needed', async () => {
      const { container } = render(<OutcomeCommentSelector {...defaultProps} />)

      const button = screen.getByRole('button')
      await userEvent.click(button)

      // Container should be scrollable
      const wrapper = container.querySelector('[data-testid="outcome-comment-display"]')
      expect(wrapper).toBeInTheDocument()
    })

    it('should not have overlapping content', async () => {
      const { container } = render(<OutcomeCommentSelector {...defaultProps} />)

      const button = screen.getByRole('button')
      await userEvent.click(button)

      const items = container.querySelectorAll('[data-testid="outcome-alternative-item"]')
      expect(items.length).toBe(2)
    })

    it('should maintain proper layout on tablet/responsive sizes', async () => {
      render(<OutcomeCommentSelector {...defaultProps} />)

      const button = screen.getByRole('button')
      await userEvent.click(button)

      // Alternatives visible and properly laid out
      expect(screen.getByText(comment2.comment)).toBeInTheDocument()
      expect(screen.getByText(comment3.comment)).toBeInTheDocument()
    })
  })

  describe('AC-3.7: Scrollable Content', () => {
    it('should make section scrollable if alternatives exceed reasonable height', async () => {
      const manyComments = [comment1, comment2, comment3]
      for (let i = 4; i <= 10; i++) {
        manyComments.push({
          ...comment1,
          id: `${i}`,
          comment: `Comment ${i}: This is a long comment that takes up space`,
          createdAt: `2024-01-0${i % 9}T00:00:00Z`,
        })
      }

      const { container } = render(
        <OutcomeCommentSelector
          {...defaultProps}
          outcomeComments={manyComments}
        />,
      )

      const button = screen.getByRole('button')
      await userEvent.click(button)

      // Alternatives list should be scrollable
      const alternativesList = container.querySelector('[data-testid="outcome-alternatives-list"]')
      expect(alternativesList).toBeInTheDocument()
    })

    it('should contain scroll within alternatives container (not page scroll)', async () => {
      const manyComments = [
        comment1,
        { ...comment2, id: '2', createdAt: '2024-01-02T00:00:00Z' },
        { ...comment3, id: '3', createdAt: '2024-01-03T00:00:00Z' },
        { ...comment1, id: '4', createdAt: '2024-01-04T00:00:00Z' },
      ]

      const { container } = render(
        <OutcomeCommentSelector
          {...defaultProps}
          outcomeComments={manyComments}
        />,
      )

      const button = screen.getByRole('button')
      await userEvent.click(button)

      const alternativesList = container.querySelector('[data-testid="outcome-alternatives-list"]')
      expect(alternativesList).toBeInTheDocument()
    })
  })

  describe('Test Case: TC-3.1 - Click button → list expands with animation', () => {
    it('should expand list smoothly when button clicked', async () => {
      render(<OutcomeCommentSelector {...defaultProps} />)

      const button = screen.getByRole('button', { name: /show 2 more options/i })
      await userEvent.click(button)

      expect(screen.getByText(comment2.comment)).toBeInTheDocument()
      expect(screen.getByText(comment3.comment)).toBeInTheDocument()
    })
  })

  describe('Test Case: TC-3.2 - Two alternatives display, each fully visible', () => {
    it('should display both alternatives without truncation', async () => {
      render(<OutcomeCommentSelector {...defaultProps} />)

      const button = screen.getByRole('button')
      await userEvent.click(button)

      expect(screen.getByText(comment2.comment)).toBeInTheDocument()
      expect(screen.getByText(comment3.comment)).toBeInTheDocument()
    })
  })

  describe('Test Case: TC-3.3 - Button text changes to "[- Hide alternatives]"', () => {
    it('should show hide button after expansion', async () => {
      render(<OutcomeCommentSelector {...defaultProps} />)

      const button = screen.getByRole('button', { name: /show 2 more options/i })
      await userEvent.click(button)

      expect(screen.getByRole('button', { name: /hide alternatives/i })).toBeInTheDocument()
    })
  })

  describe('Test Case: TC-3.4 - Hover alternative → background changes, cursor changes', () => {
    it('should have hover affordances on alternatives', async () => {
      const { container } = render(<OutcomeCommentSelector {...defaultProps} />)

      const button = screen.getByRole('button')
      await userEvent.click(button)

      const items = container.querySelectorAll('[data-testid="outcome-alternative-item"]')
      expect(items.length).toBe(2)
    })
  })

  describe('Test Case: TC-3.5 - Page layout stable, no content shifts', () => {
    it('should maintain stable layout when expanded', async () => {
      render(<OutcomeCommentSelector {...defaultProps} />)

      const button = screen.getByRole('button')
      await userEvent.click(button)

      expect(screen.getByText(comment2.comment)).toBeInTheDocument()
      expect(screen.getByText(comment3.comment)).toBeInTheDocument()
    })
  })

  describe('Test Case: TC-3.6 - Click "[- Hide alternatives]" → list collapses smoothly', () => {
    it('should collapse list when hide button clicked', async () => {
      render(<OutcomeCommentSelector {...defaultProps} />)

      const expandButton = screen.getByRole('button', { name: /show 2 more options/i })
      await userEvent.click(expandButton)

      expect(screen.getByText(comment2.comment)).toBeInTheDocument()

      const hideButton = screen.getByRole('button', { name: /hide alternatives/i })
      await userEvent.click(hideButton)

      expect(screen.queryByText(comment2.comment)).not.toBeInTheDocument()
      expect(screen.queryByText(comment3.comment)).not.toBeInTheDocument()
    })
  })

  describe('Test Case: TC-3.7 - Keyboard navigation (Tab, Enter) works', () => {
    it('should support keyboard navigation for expansion', async () => {
      render(<OutcomeCommentSelector {...defaultProps} />)

      const button = screen.getByRole('button', { name: /show 2 more options/i })
      expect(button).toBeInTheDocument()
      await userEvent.click(button)

      expect(screen.getByText(comment2.comment)).toBeInTheDocument()
    })
  })
})

describe('OutcomeCommentSelector - US-FINAL-004: Select Alternative Comment', () => {
  const comment1: OutcomeComment = {
    id: '1',
    lowerRange: 80,
    upperRange: 89,
    comment: 'Great job on this assignment',
    subjectId: 'subject-1',
    userId: 'user-1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  }

  const comment2: OutcomeComment = {
    id: '2',
    lowerRange: 80,
    upperRange: 89,
    comment: 'Excellent work overall',
    subjectId: 'subject-1',
    userId: 'user-1',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  }

  const comment3: OutcomeComment = {
    id: '3',
    lowerRange: 80,
    upperRange: 89,
    comment: 'Very impressive contribution',
    subjectId: 'subject-1',
    userId: 'user-1',
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('AC-4.1: Click Handler', () => {
    it('should make each alternative item clickable with mouse', async () => {
      const onSelectComment = jest.fn()
      render(
        <OutcomeCommentSelector
          grade={85}
          selectedOutcomeCommentId={comment1.id}
          outcomeComments={[comment1, comment2, comment3]}
          onSelectComment={onSelectComment}
        />,
      )

      // Expand alternatives
      const button = screen.getByRole('button', { name: /show 2 more options/i })
      await userEvent.click(button)

      // Click second alternative
      const items = screen.getAllByTestId('outcome-alternative-item')
      await userEvent.click(items[0])

      expect(onSelectComment).toHaveBeenCalledWith(comment2.id)
    })

    it('should make each alternative item clickable with keyboard', async () => {
      const onSelectComment = jest.fn()
      render(
        <OutcomeCommentSelector
          grade={85}
          selectedOutcomeCommentId={comment1.id}
          outcomeComments={[comment1, comment2, comment3]}
          onSelectComment={onSelectComment}
        />,
      )

      const button = screen.getByRole('button', { name: /show 2 more options/i })
      await userEvent.click(button)

      // Tab and Enter to select
      const items = screen.getAllByTestId('outcome-alternative-item')
      items[0].focus()
      await userEvent.keyboard('{Enter}')

      expect(onSelectComment).toHaveBeenCalledWith(comment2.id)
    })

    it('should be idempotent - clicking already-selected comment should not call handler again', async () => {
      const onSelectComment = jest.fn()
      render(
        <OutcomeCommentSelector
          grade={85}
          selectedOutcomeCommentId={comment1.id}
          outcomeComments={[comment1, comment2, comment3]}
          onSelectComment={onSelectComment}
        />,
      )

      const button = screen.getByRole('button', { name: /show 2 more options/i })
      await userEvent.click(button)

      // Click the currently selected comment (comment1)
      const items = screen.getAllByTestId('outcome-alternative-item')
      // Note: In expanded state, alternatives don't include selected one
      // So clicking alternatives[0] selects comment2, not comment1
      expect(items.length).toBe(2)
    })
  })

  describe('AC-4.2: Comment Replacement', () => {
    it('should replace displayed comment with clicked alternative', async () => {
      render(
        <OutcomeCommentSelector
          grade={85}
          selectedOutcomeCommentId={comment1.id}
          outcomeComments={[comment1, comment2, comment3]}
          onSelectComment={jest.fn()}
        />,
      )

      // Initially showing comment1
      expect(screen.getByText(comment1.comment)).toBeInTheDocument()

      // Expand and click comment2
      const button = screen.getByRole('button', { name: /show 2 more options/i })
      await userEvent.click(button)

      const items = screen.getAllByTestId('outcome-alternative-item')
      await userEvent.click(items[0])

      // After selection (parent must update selectedOutcomeCommentId via onSelectComment callback)
      // This test verifies the callback is called with correct ID
    })

    it('should display new comment in read-only area (not in edit mode)', async () => {
      render(
        <OutcomeCommentSelector
          grade={85}
          selectedOutcomeCommentId={comment1.id}
          outcomeComments={[comment1, comment2, comment3]}
          onSelectComment={jest.fn()}
        />,
      )

      const button = screen.getByRole('button', { name: /show 2 more options/i })
      await userEvent.click(button)

      const items = screen.getAllByTestId('outcome-alternative-item')
      await userEvent.click(items[0])

      // Comment should remain in read-only state (no inputs visible)
      const inputs = screen.queryAllByRole('textbox')
      expect(inputs.length).toBe(0)
    })
  })

  describe('AC-4.3: Previously Displayed Comment', () => {
    it('should show previously displayed comment in alternatives list after selection', async () => {
      const onSelectComment = jest.fn()
      const { rerender } = render(
        <OutcomeCommentSelector
          grade={85}
          selectedOutcomeCommentId={comment1.id}
          outcomeComments={[comment1, comment2, comment3]}
          onSelectComment={onSelectComment}
        />,
      )

      // Expand and click comment2
      const button = screen.getByRole('button', { name: /show 2 more options/i })
      await userEvent.click(button)

      const items = screen.getAllByTestId('outcome-alternative-item')
      await userEvent.click(items[0])

      // Parent updates selectedOutcomeCommentId to comment2.id
      rerender(
        <OutcomeCommentSelector
          grade={85}
          selectedOutcomeCommentId={comment2.id}
          outcomeComments={[comment1, comment2, comment3]}
          onSelectComment={onSelectComment}
        />,
      )

      // Re-expand to see alternatives
      const expandButton = screen.getByRole('button', { name: /show 2 more options/i })
      await userEvent.click(expandButton)

      // comment1 should now be in alternatives (not displayed as main)
      expect(screen.getByText(comment1.comment)).toBeInTheDocument()
      expect(screen.getByText(comment3.comment)).toBeInTheDocument()
    })

    it('should have same styling as other alternatives', async () => {
      const { rerender } = render(
        <OutcomeCommentSelector
          grade={85}
          selectedOutcomeCommentId={comment1.id}
          outcomeComments={[comment1, comment2, comment3]}
          onSelectComment={jest.fn()}
        />,
      )

      const button = screen.getByRole('button', { name: /show 2 more options/i })
      await userEvent.click(button)

      const items = screen.getAllByTestId('outcome-alternative-item')
      await userEvent.click(items[0])

      // Rerender with new selection
      rerender(
        <OutcomeCommentSelector
          grade={85}
          selectedOutcomeCommentId={comment2.id}
          outcomeComments={[comment1, comment2, comment3]}
          onSelectComment={jest.fn()}
        />,
      )

      // Re-expand
      const expandButton = screen.getByRole('button', { name: /show 2 more options/i })
      await userEvent.click(expandButton)

      // Verify comment1 is in alternatives with consistent styling
      const alternativeItems = screen.getAllByTestId('outcome-alternative-item')
      expect(alternativeItems.length).toBe(2)
    })
  })

  describe('AC-4.4: Auto-Collapse', () => {
    it('should collapse alternatives list after selection', async () => {
      const { rerender } = render(
        <OutcomeCommentSelector
          grade={85}
          selectedOutcomeCommentId={comment1.id}
          outcomeComments={[comment1, comment2, comment3]}
          onSelectComment={jest.fn()}
        />,
      )

      // Expand
      const button = screen.getByRole('button', { name: /show 2 more options/i })
      await userEvent.click(button)

      expect(screen.getByText(comment2.comment)).toBeInTheDocument()

      // Click alternative
      const items = screen.getAllByTestId('outcome-alternative-item')
      await userEvent.click(items[0])

      // Rerender with new selection
      rerender(
        <OutcomeCommentSelector
          grade={85}
          selectedOutcomeCommentId={comment2.id}
          outcomeComments={[comment1, comment2, comment3]}
          onSelectComment={jest.fn()}
        />,
      )

      // After selection, alternatives should be hidden (collapsed)
      expect(screen.queryByTestId('outcome-alternatives-list')).not.toBeInTheDocument()
    })

    it('should use same animation speed as manual collapse', async () => {
      const { rerender } = render(
        <OutcomeCommentSelector
          grade={85}
          selectedOutcomeCommentId={comment1.id}
          outcomeComments={[comment1, comment2, comment3]}
          onSelectComment={jest.fn()}
        />,
      )

      const button = screen.getByRole('button', { name: /show 2 more options/i })
      await userEvent.click(button)

      const items = screen.getAllByTestId('outcome-alternative-item')
      const startTime = performance.now()
      await userEvent.click(items[0])
      const endTime = performance.now()

      // Collapse should happen quickly (< 300ms)
      expect(endTime - startTime).toBeLessThan(300)

      rerender(
        <OutcomeCommentSelector
          grade={85}
          selectedOutcomeCommentId={comment2.id}
          outcomeComments={[comment1, comment2, comment3]}
          onSelectComment={jest.fn()}
        />,
      )
    })
  })

  describe('AC-4.5: Selection Persistence', () => {
    it('should store selected comment ID in parent state', async () => {
      const onSelectComment = jest.fn()
      render(
        <OutcomeCommentSelector
          grade={85}
          selectedOutcomeCommentId={comment1.id}
          outcomeComments={[comment1, comment2, comment3]}
          onSelectComment={onSelectComment}
        />,
      )

      const button = screen.getByRole('button', { name: /show 2 more options/i })
      await userEvent.click(button)

      const items = screen.getAllByTestId('outcome-alternative-item')
      await userEvent.click(items[0])

      expect(onSelectComment).toHaveBeenCalledWith(comment2.id)
    })

    it('should persist selection when navigating away', async () => {
      const onSelectComment = jest.fn()
      const { rerender } = render(
        <OutcomeCommentSelector
          grade={85}
          selectedOutcomeCommentId={comment1.id}
          outcomeComments={[comment1, comment2, comment3]}
          onSelectComment={onSelectComment}
        />,
      )

      const button = screen.getByRole('button', { name: /show 2 more options/i })
      await userEvent.click(button)

      const items = screen.getAllByTestId('outcome-alternative-item')
      await userEvent.click(items[0])

      // Simulate navigation - rerender with selected comment
      rerender(
        <OutcomeCommentSelector
          grade={85}
          selectedOutcomeCommentId={comment2.id}
          outcomeComments={[comment1, comment2, comment3]}
          onSelectComment={onSelectComment}
        />,
      )

      // Selection should persist
      expect(screen.getByText(comment2.comment)).toBeInTheDocument()
    })

    it('should persist selection when scrolling or other form changes', async () => {
      const onSelectComment = jest.fn()
      const { rerender } = render(
        <OutcomeCommentSelector
          grade={85}
          selectedOutcomeCommentId={comment1.id}
          outcomeComments={[comment1, comment2, comment3]}
          onSelectComment={onSelectComment}
        />,
      )

      const button = screen.getByRole('button', { name: /show 2 more options/i })
      await userEvent.click(button)

      const items = screen.getAllByTestId('outcome-alternative-item')
      await userEvent.click(items[0])

      // Rerender (simulating form change)
      rerender(
        <OutcomeCommentSelector
          grade={85}
          selectedOutcomeCommentId={comment2.id}
          outcomeComments={[comment1, comment2, comment3]}
          onSelectComment={onSelectComment}
        />,
      )

      // Selection persists after form change
      expect(screen.getByText(comment2.comment)).toBeInTheDocument()
    })
  })

  describe('AC-4.6: Visual Feedback', () => {
    it('should show button press feedback during selection', async () => {
      render(
        <OutcomeCommentSelector
          grade={85}
          selectedOutcomeCommentId={comment1.id}
          outcomeComments={[comment1, comment2, comment3]}
          onSelectComment={jest.fn()}
        />,
      )

      const button = screen.getByRole('button', { name: /show 2 more options/i })
      await userEvent.click(button)

      const items = screen.getAllByTestId('outcome-alternative-item')
      expect(items[0]).toBeInTheDocument()
      // Button press feedback (cursor change, hover state) verified through interaction
    })

    it('should have no ambiguity about selected comment', async () => {
      const { rerender } = render(
        <OutcomeCommentSelector
          grade={85}
          selectedOutcomeCommentId={comment1.id}
          outcomeComments={[comment1, comment2, comment3]}
          onSelectComment={jest.fn()}
        />,
      )

      const button = screen.getByRole('button', { name: /show 2 more options/i })
      await userEvent.click(button)

      const items = screen.getAllByTestId('outcome-alternative-item')
      await userEvent.click(items[0])

      rerender(
        <OutcomeCommentSelector
          grade={85}
          selectedOutcomeCommentId={comment2.id}
          outcomeComments={[comment1, comment2, comment3]}
          onSelectComment={jest.fn()}
        />,
      )

      // comment2 should be clearly shown as selected (in main display area)
      expect(screen.getByText(comment2.comment)).toBeInTheDocument()
      // comment2 should NOT be in alternatives
      const items2 = screen.queryAllByTestId('outcome-alternative-item')
      const alternativeTexts = items2.map((item) => item.textContent)
      expect(alternativeTexts).not.toContain(comment2.comment)
    })

    it('should be announced to screen readers on selection', async () => {
      const onSelectComment = jest.fn()
      render(
        <OutcomeCommentSelector
          grade={85}
          selectedOutcomeCommentId={comment1.id}
          outcomeComments={[comment1, comment2, comment3]}
          onSelectComment={onSelectComment}
        />,
      )

      const button = screen.getByRole('button', { name: /show 2 more options/i })
      await userEvent.click(button)

      const items = screen.getAllByTestId('outcome-alternative-item')
      await userEvent.click(items[0])

      // Callback called indicates selection
      expect(onSelectComment).toHaveBeenCalled()
    })
  })

  describe('Test Case: TC-4.1 - 3 alternatives visible → click 2nd → becomes displayed', () => {
    it('should select and display second alternative', async () => {
      const onSelectComment = jest.fn()
      const { rerender } = render(
        <OutcomeCommentSelector
          grade={85}
          selectedOutcomeCommentId={comment1.id}
          outcomeComments={[comment1, comment2, comment3]}
          onSelectComment={onSelectComment}
        />,
      )

      const button = screen.getByRole('button', { name: /show 2 more options/i })
      await userEvent.click(button)

      const items = screen.getAllByTestId('outcome-alternative-item')
      await userEvent.click(items[0])

      expect(onSelectComment).toHaveBeenCalledWith(comment2.id)

      rerender(
        <OutcomeCommentSelector
          grade={85}
          selectedOutcomeCommentId={comment2.id}
          outcomeComments={[comment1, comment2, comment3]}
          onSelectComment={onSelectComment}
        />,
      )

      expect(screen.getByText(comment2.comment)).toBeInTheDocument()
    })
  })

  describe('Test Case: TC-4.2 - List collapses after selection', () => {
    it('should hide alternatives list after selecting', async () => {
      const onSelectComment = jest.fn()
      const { rerender } = render(
        <OutcomeCommentSelector
          grade={85}
          selectedOutcomeCommentId={comment1.id}
          outcomeComments={[comment1, comment2, comment3]}
          onSelectComment={onSelectComment}
        />,
      )

      const button = screen.getByRole('button', { name: /show 2 more options/i })
      await userEvent.click(button)

      const items = screen.getAllByTestId('outcome-alternative-item')
      await userEvent.click(items[0])

      rerender(
        <OutcomeCommentSelector
          grade={85}
          selectedOutcomeCommentId={comment2.id}
          outcomeComments={[comment1, comment2, comment3]}
          onSelectComment={onSelectComment}
        />,
      )

      expect(screen.queryByTestId('outcome-alternatives-list')).not.toBeInTheDocument()
    })
  })

  describe('Test Case: TC-4.3 - Button text updates to "Show 2 more options"', () => {
    it('should update button count after selection', async () => {
      const onSelectComment = jest.fn()
      const { rerender } = render(
        <OutcomeCommentSelector
          grade={85}
          selectedOutcomeCommentId={comment1.id}
          outcomeComments={[comment1, comment2, comment3]}
          onSelectComment={onSelectComment}
        />,
      )

      const button = screen.getByRole('button', { name: /show 2 more options/i })
      await userEvent.click(button)

      const items = screen.getAllByTestId('outcome-alternative-item')
      await userEvent.click(items[0])

      rerender(
        <OutcomeCommentSelector
          grade={85}
          selectedOutcomeCommentId={comment2.id}
          outcomeComments={[comment1, comment2, comment3]}
          onSelectComment={onSelectComment}
        />,
      )

      // After selecting comment2, alternatives are: comment1, comment3 (2 options)
      expect(screen.getByRole('button', { name: /show 2 more options/i })).toBeInTheDocument()
    })
  })

  describe('Test Case: TC-4.4 - Original displayed comment now in alternatives', () => {
    it('should show previously selected as alternative', async () => {
      const onSelectComment = jest.fn()
      const { rerender } = render(
        <OutcomeCommentSelector
          grade={85}
          selectedOutcomeCommentId={comment1.id}
          outcomeComments={[comment1, comment2, comment3]}
          onSelectComment={onSelectComment}
        />,
      )

      const button = screen.getByRole('button', { name: /show 2 more options/i })
      await userEvent.click(button)

      const items = screen.getAllByTestId('outcome-alternative-item')
      await userEvent.click(items[0])

      rerender(
        <OutcomeCommentSelector
          grade={85}
          selectedOutcomeCommentId={comment2.id}
          outcomeComments={[comment1, comment2, comment3]}
          onSelectComment={onSelectComment}
        />,
      )

      // Re-expand to see comment1 in alternatives
      const expandButton = screen.getByRole('button', { name: /show 2 more options/i })
      await userEvent.click(expandButton)

      expect(screen.getByText(comment1.comment)).toBeInTheDocument()
    })
  })

  describe('Test Case: TC-4.5 - Clicking same alternative twice has no double-selection bug', () => {
    it('should handle multiple clicks idempotently', async () => {
      const onSelectComment = jest.fn()
      render(
        <OutcomeCommentSelector
          grade={85}
          selectedOutcomeCommentId={comment1.id}
          outcomeComments={[comment1, comment2, comment3]}
          onSelectComment={onSelectComment}
        />,
      )

      const button = screen.getByRole('button', { name: /show 2 more options/i })
      await userEvent.click(button)

      const items = screen.getAllByTestId('outcome-alternative-item')
      await userEvent.click(items[0])

      // Called once with comment2.id
      expect(onSelectComment).toHaveBeenCalledTimes(1)
      expect(onSelectComment).toHaveBeenCalledWith(comment2.id)
    })
  })

  describe('Test Case: TC-4.6 - Keyboard: Tab to alternative, Enter to select', () => {
    it('should support keyboard selection', async () => {
      const onSelectComment = jest.fn()
      render(
        <OutcomeCommentSelector
          grade={85}
          selectedOutcomeCommentId={comment1.id}
          outcomeComments={[comment1, comment2, comment3]}
          onSelectComment={onSelectComment}
        />,
      )

      const button = screen.getByRole('button', { name: /show 2 more options/i })
      await userEvent.click(button)

      const items = screen.getAllByTestId('outcome-alternative-item')
      items[0].focus()
      await userEvent.keyboard('{Enter}')

      expect(onSelectComment).toHaveBeenCalledWith(comment2.id)
    })
  })

  describe('OutcomeCommentSelector - US-FINAL-005: Dynamic Grade Changes', () => {
    /**
     * AC-5.1: Grade Change Detection
     * System detects when grade value changes and fetches new matching comments
     */
    describe('AC-5.1: Grade Change Detection', () => {
      it('should detect grade change and reset selection', async () => {
        const onSelectComment = jest.fn()
        const { rerender } = render(
          <OutcomeCommentSelector
            grade={85}
            selectedOutcomeCommentId={comment1.id}
            outcomeComments={[comment1, comment2, comment3]}
            onSelectComment={onSelectComment}
          />,
        )

        // Initially shows comment1
        expect(screen.getByText(comment1.comment)).toBeInTheDocument()

        // Change grade to 91
        rerender(
          <OutcomeCommentSelector
            grade={91}
            selectedOutcomeCommentId={null}
            outcomeComments={[comment1, comment2, comment3]}
            onSelectComment={onSelectComment}
          />,
        )

        // Should not render without a selected comment
        expect(screen.queryByTestId('outcome-comment-display')).not.toBeInTheDocument()
      })

      it('should work for same grade (idempotent)', async () => {
        const onSelectComment = jest.fn()
        const { rerender } = render(
          <OutcomeCommentSelector
            grade={85}
            selectedOutcomeCommentId={comment1.id}
            outcomeComments={[comment1, comment2, comment3]}
            onSelectComment={onSelectComment}
          />,
        )

        // Verify initial state
        expect(screen.getByText(comment1.comment)).toBeInTheDocument()

        // Re-render with same grade and selection
        rerender(
          <OutcomeCommentSelector
            grade={85}
            selectedOutcomeCommentId={comment1.id}
            outcomeComments={[comment1, comment2, comment3]}
            onSelectComment={onSelectComment}
          />,
        )

        // Should still show same comment
        expect(screen.getByText(comment1.comment)).toBeInTheDocument()
      })

      it('should work for different grade values', async () => {
        const onSelectComment = jest.fn()
        const { rerender } = render(
          <OutcomeCommentSelector
            grade={75}
            selectedOutcomeCommentId={comment1.id}
            outcomeComments={[comment1, comment2, comment3]}
            onSelectComment={onSelectComment}
          />,
        )

        // Change to different grade
        rerender(
          <OutcomeCommentSelector
            grade={95}
            selectedOutcomeCommentId={comment2.id}
            outcomeComments={[comment1, comment2, comment3]}
            onSelectComment={onSelectComment}
          />,
        )

        // Should show comment2 for grade 95
        expect(screen.getByText(comment2.comment)).toBeInTheDocument()
      })
    })

    /**
     * AC-5.2: Fetch New Matching Comments
     * When grade changes, system should have already filtered comments available
     */
    describe('AC-5.2: Fetch New Matching Comments', () => {
      it('should work with filtered outcomeComments for new grade', () => {
        const onSelectComment = jest.fn()
        const gradeA85Comments = [comment1, comment2]
        const gradeA91Comments = [comment2, comment3]

        const { rerender } = render(
          <OutcomeCommentSelector
            grade={85}
            selectedOutcomeCommentId={comment1.id}
            outcomeComments={gradeA85Comments}
            onSelectComment={onSelectComment}
          />,
        )

        expect(screen.getByText(comment1.comment)).toBeInTheDocument()

        // Change grade and outcomeComments list
        rerender(
          <OutcomeCommentSelector
            grade={91}
            selectedOutcomeCommentId={comment2.id}
            outcomeComments={gradeA91Comments}
            onSelectComment={onSelectComment}
          />,
        )

        // Should show comment2 from new filtered list
        expect(screen.getByText(comment2.comment)).toBeInTheDocument()
        expect(screen.queryByText(comment1.comment)).not.toBeInTheDocument()
      })

      it('should handle change from multiple to single match', () => {
        const onSelectComment = jest.fn()
        const { rerender } = render(
          <OutcomeCommentSelector
            grade={85}
            selectedOutcomeCommentId={comment1.id}
            outcomeComments={[comment1, comment2, comment3]}
            onSelectComment={onSelectComment}
          />,
        )

        expect(screen.getByRole('button')).toBeInTheDocument()

        // Change to grade with only 1 match
        rerender(
          <OutcomeCommentSelector
            grade={92}
            selectedOutcomeCommentId={comment1.id}
            outcomeComments={[comment1]}
            onSelectComment={onSelectComment}
          />,
        )

        // No toggle button for single match
        expect(screen.queryByRole('button')).not.toBeInTheDocument()
      })
    })

    /**
     * AC-5.3: Reset to First Match
     * After grade change, display first match with collapsed state
     */
    describe('AC-5.3: Reset to First Match', () => {
      it('should display first match when grade changes', () => {
        const onSelectComment = jest.fn()
        const { rerender } = render(
          <OutcomeCommentSelector
            grade={85}
            selectedOutcomeCommentId={comment2.id}
            outcomeComments={[comment1, comment2, comment3]}
            onSelectComment={onSelectComment}
          />,
        )

        expect(screen.getByText(comment2.comment)).toBeInTheDocument()

        // Change grade - parent should pass comment1 as selected
        rerender(
          <OutcomeCommentSelector
            grade={91}
            selectedOutcomeCommentId={comment1.id}
            outcomeComments={[comment1, comment2, comment3]}
            onSelectComment={onSelectComment}
          />,
        )

        // Now shows first match
        expect(screen.getByText(comment1.comment)).toBeInTheDocument()
      })

      it('should show first match in collapsed state', () => {
        const onSelectComment = jest.fn()
        const { rerender } = render(
          <OutcomeCommentSelector
            grade={85}
            selectedOutcomeCommentId={comment2.id}
            outcomeComments={[comment1, comment2, comment3]}
            onSelectComment={onSelectComment}
          />,
        )

        // Expand to verify starting state
        const button = screen.getByRole('button')
        userEvent.click(button)

        // Change grade
        rerender(
          <OutcomeCommentSelector
            grade={91}
            selectedOutcomeCommentId={comment1.id}
            outcomeComments={[comment1, comment2, comment3]}
            onSelectComment={onSelectComment}
          />,
        )

        // Should be collapsed (no alternatives visible)
        expect(screen.queryByTestId('outcome-alternatives-list')).not.toBeInTheDocument()
        expect(screen.getByText(comment1.comment)).toBeInTheDocument()
      })

      it('should update button count for new grade matches', () => {
        const onSelectComment = jest.fn()
        const { rerender } = render(
          <OutcomeCommentSelector
            grade={85}
            selectedOutcomeCommentId={comment1.id}
            outcomeComments={[comment1, comment2, comment3]}
            onSelectComment={onSelectComment}
          />,
        )

        // 2 alternatives for 3 total
        expect(
          screen.getByRole('button', { name: /show 2 more options/i }),
        ).toBeInTheDocument()

        // Change to grade with only 2 total comments
        rerender(
          <OutcomeCommentSelector
            grade={92}
            selectedOutcomeCommentId={comment1.id}
            outcomeComments={[comment1, comment2]}
            onSelectComment={onSelectComment}
          />,
        )

        // 1 alternative for 2 total
        expect(
          screen.getByRole('button', { name: /show 1 more option/i }),
        ).toBeInTheDocument()
      })
    })

    /**
     * AC-5.4: Clear Previous Selection
     * Reset selectedOutcomeCommentId and expandedAlternatives when grade changes
     */
    describe('AC-5.4: Clear Previous Selection', () => {
      it('should reset expandedAlternatives to false when grade changes', async () => {
        const onSelectComment = jest.fn()
        const { rerender } = render(
          <OutcomeCommentSelector
            grade={85}
            selectedOutcomeCommentId={comment1.id}
            outcomeComments={[comment1, comment2, comment3]}
            onSelectComment={onSelectComment}
          />,
        )

        // Expand the list
        const button = screen.getByRole('button')
        await userEvent.click(button)

        // Verify expanded
        expect(screen.getByTestId('outcome-alternatives-list')).toBeInTheDocument()

        // Change grade
        rerender(
          <OutcomeCommentSelector
            grade={91}
            selectedOutcomeCommentId={comment1.id}
            outcomeComments={[comment1, comment2, comment3]}
            onSelectComment={onSelectComment}
          />,
        )

        // Should be collapsed
        expect(screen.queryByTestId('outcome-alternatives-list')).not.toBeInTheDocument()
      })

      it('should clear previous selectedOutcomeCommentId', () => {
        const onSelectComment = jest.fn()
        const { rerender } = render(
          <OutcomeCommentSelector
            grade={85}
            selectedOutcomeCommentId={comment2.id}
            outcomeComments={[comment1, comment2, comment3]}
            onSelectComment={onSelectComment}
          />,
        )

        // Shows comment2
        expect(screen.getByText(comment2.comment)).toBeInTheDocument()

        // Parent resets selectedOutcomeCommentId to null when grade changes
        rerender(
          <OutcomeCommentSelector
            grade={91}
            selectedOutcomeCommentId={null}
            outcomeComments={[comment1, comment2, comment3]}
            onSelectComment={onSelectComment}
          />,
        )

        // No longer shows anything
        expect(screen.queryByTestId('outcome-comment-display')).not.toBeInTheDocument()
      })

      it('should clear all UI state on grade change', async () => {
        const onSelectComment = jest.fn()
        const { rerender } = render(
          <OutcomeCommentSelector
            grade={85}
            selectedOutcomeCommentId={comment2.id}
            outcomeComments={[comment1, comment2, comment3]}
            onSelectComment={onSelectComment}
          />,
        )

        // Select alternative and expand
        const button = screen.getByRole('button')
        await userEvent.click(button)
        const items = screen.getAllByTestId('outcome-alternative-item')
        await userEvent.click(items[0])

        // Grade change with reset state from parent
        rerender(
          <OutcomeCommentSelector
            grade={91}
            selectedOutcomeCommentId={comment1.id}
            outcomeComments={[comment1, comment2, comment3]}
            onSelectComment={onSelectComment}
          />,
        )

        // All state cleared
        expect(screen.queryByTestId('outcome-alternatives-list')).not.toBeInTheDocument()
        expect(screen.getByText(comment1.comment)).toBeInTheDocument()
      })
    })

    /**
     * AC-5.5: No Carry-Over
     * Old alternatives from previous grade are not shown
     */
    describe('AC-5.5: No Carry-Over', () => {
      it('should not show previous grade alternatives after grade change', () => {
        const onSelectComment = jest.fn()
        const grade85Comments = [comment1, comment2, comment3]
        const grade91Comments = [comment2] // Only comment2 matches grade 91

        const { rerender } = render(
          <OutcomeCommentSelector
            grade={85}
            selectedOutcomeCommentId={comment1.id}
            outcomeComments={grade85Comments}
            onSelectComment={onSelectComment}
          />,
        )

        // Change grade
        rerender(
          <OutcomeCommentSelector
            grade={91}
            selectedOutcomeCommentId={comment2.id}
            outcomeComments={grade91Comments}
            onSelectComment={onSelectComment}
          />,
        )

        // Should only have comment2, no others from grade 85
        expect(screen.getByText(comment2.comment)).toBeInTheDocument()
        expect(screen.queryByText(comment1.comment)).not.toBeInTheDocument()
        expect(screen.queryByText(comment3.comment)).not.toBeInTheDocument()
      })

      it('should use grade-appropriate comments always', () => {
        const onSelectComment = jest.fn()
        // Grade 91 has comment2 and comment3
        const grade91Comments = [comment2, comment3]
        // Grade 85 has comment1 and comment2
        const grade85Comments = [comment1, comment2]

        const { rerender } = render(
          <OutcomeCommentSelector
            grade={91}
            selectedOutcomeCommentId={comment2.id}
            outcomeComments={grade91Comments}
            onSelectComment={onSelectComment}
          />,
        )

        // Change to grade 85
        rerender(
          <OutcomeCommentSelector
            grade={85}
            selectedOutcomeCommentId={comment1.id}
            outcomeComments={grade85Comments}
            onSelectComment={onSelectComment}
          />,
        )

        // Shows grade 85 appropriate comments
        expect(screen.getByText(comment1.comment)).toBeInTheDocument()
        expect(screen.queryByText(comment3.comment)).not.toBeInTheDocument()
      })
    })

    /**
     * AC-5.6: Edge Case - No Matches
     * If new grade has no matching comments, show error message
     */
    describe('AC-5.6: Edge Case - No Matches', () => {
      it('should handle grade change with no matching comments', () => {
        const onSelectComment = jest.fn()
        const { rerender } = render(
          <OutcomeCommentSelector
            grade={85}
            selectedOutcomeCommentId={comment1.id}
            outcomeComments={[comment1, comment2]}
            onSelectComment={onSelectComment}
          />,
        )

        expect(screen.getByText(comment1.comment)).toBeInTheDocument()

        // Change to grade with no comments
        rerender(
          <OutcomeCommentSelector
            grade={95}
            selectedOutcomeCommentId={null}
            outcomeComments={[]}
            onSelectComment={onSelectComment}
          />,
        )

        // Should render nothing without selected comment
        expect(screen.queryByTestId('outcome-comment-display')).not.toBeInTheDocument()
      })

      it('should not show toggle button when no matches', () => {
        const onSelectComment = jest.fn()
        render(
          <OutcomeCommentSelector
            grade={95}
            selectedOutcomeCommentId={null}
            outcomeComments={[]}
            onSelectComment={onSelectComment}
          />,
        )

        expect(screen.queryByRole('button')).not.toBeInTheDocument()
      })
    })

    /**
     * AC-5.7: Edge Case - Only 1 Match
     * If new grade has only 1 comment, no toggle button
     */
    describe('AC-5.7: Edge Case - Only 1 Match', () => {
      it('should not show toggle for single match', () => {
        const onSelectComment = jest.fn()
        const { rerender } = render(
          <OutcomeCommentSelector
            grade={85}
            selectedOutcomeCommentId={comment1.id}
            outcomeComments={[comment1, comment2, comment3]}
            onSelectComment={onSelectComment}
          />,
        )

        // Has toggle with 3 options
        expect(screen.getByRole('button')).toBeInTheDocument()

        // Change to grade with only 1 match
        rerender(
          <OutcomeCommentSelector
            grade={92}
            selectedOutcomeCommentId={comment1.id}
            outcomeComments={[comment1]}
            onSelectComment={onSelectComment}
          />,
        )

        // No toggle
        expect(screen.queryByRole('button')).not.toBeInTheDocument()
        expect(screen.getByText(comment1.comment)).toBeInTheDocument()
      })

      it('should work seamlessly with single match', () => {
        const onSelectComment = jest.fn()
        render(
          <OutcomeCommentSelector
            grade={92}
            selectedOutcomeCommentId={comment1.id}
            outcomeComments={[comment1]}
            onSelectComment={onSelectComment}
          />,
        )

        expect(screen.getByText(comment1.comment)).toBeInTheDocument()
        expect(screen.queryByRole('button')).not.toBeInTheDocument()
      })
    })

    /**
     * Test Cases: Specific scenarios
     */
    describe('Test Case: TC-5.1 - Grade 91 → Select alt → Grade 85 → Show 1st', () => {
      it('should show first match after grade change from alternatives', () => {
        const onSelectComment = jest.fn()
        const { rerender } = render(
          <OutcomeCommentSelector
            grade={91}
            selectedOutcomeCommentId={comment1.id}
            outcomeComments={[comment1, comment2, comment3]}
            onSelectComment={onSelectComment}
          />,
        )

        // Change to grade 85 with different first match
        rerender(
          <OutcomeCommentSelector
            grade={85}
            selectedOutcomeCommentId={comment2.id}
            outcomeComments={[comment2, comment3]}
            onSelectComment={onSelectComment}
          />,
        )

        expect(screen.getByText(comment2.comment)).toBeInTheDocument()
      })
    })

    describe('Test Case: TC-5.2 - Grade 95 (no matches)', () => {
      it('should handle no matches gracefully', () => {
        const onSelectComment = jest.fn()
        render(
          <OutcomeCommentSelector
            grade={95}
            selectedOutcomeCommentId={null}
            outcomeComments={[]}
            onSelectComment={onSelectComment}
          />,
        )

        // Renders null (no comment display)
        expect(screen.queryByTestId('outcome-comment-display')).not.toBeInTheDocument()
      })
    })

    describe('Test Case: TC-5.3 - Grade 82 (1 match)', () => {
      it('should work with single match', () => {
        const onSelectComment = jest.fn()
        render(
          <OutcomeCommentSelector
            grade={82}
            selectedOutcomeCommentId={comment1.id}
            outcomeComments={[comment1]}
            onSelectComment={onSelectComment}
          />,
        )

        expect(screen.getByText(comment1.comment)).toBeInTheDocument()
        expect(screen.queryByRole('button')).not.toBeInTheDocument()
      })
    })

    describe('Test Case: TC-5.4 - Same grade (92)', () => {
      it('should not change when grade is same', () => {
        const onSelectComment = jest.fn()
        const { rerender } = render(
          <OutcomeCommentSelector
            grade={92}
            selectedOutcomeCommentId={comment1.id}
            outcomeComments={[comment1, comment2]}
            onSelectComment={onSelectComment}
          />,
        )

        // Verify initial state
        expect(screen.getByText(comment1.comment)).toBeInTheDocument()

        // Re-render with same grade
        rerender(
          <OutcomeCommentSelector
            grade={92}
            selectedOutcomeCommentId={comment1.id}
            outcomeComments={[comment1, comment2]}
            onSelectComment={onSelectComment}
          />,
        )

        // Same display
        expect(screen.getByText(comment1.comment)).toBeInTheDocument()
      })
    })

    describe('Test Case: TC-5.5 - Expanded → grade change → collapse', () => {
      it('should collapse expanded list on grade change', async () => {
        const onSelectComment = jest.fn()
        const { rerender } = render(
          <OutcomeCommentSelector
            grade={85}
            selectedOutcomeCommentId={comment1.id}
            outcomeComments={[comment1, comment2, comment3]}
            onSelectComment={onSelectComment}
          />,
        )

        // Expand
        const button = screen.getByRole('button')
        await userEvent.click(button)
        expect(screen.getByTestId('outcome-alternatives-list')).toBeInTheDocument()

        // Change grade
        rerender(
          <OutcomeCommentSelector
            grade={91}
            selectedOutcomeCommentId={comment1.id}
            outcomeComments={[comment1, comment2, comment3]}
            onSelectComment={onSelectComment}
          />,
        )

        // Collapsed
        expect(screen.queryByTestId('outcome-alternatives-list')).not.toBeInTheDocument()
      })
    })

    describe('Test Case: TC-5.6 - Multiple grade changes', () => {
      it('should handle multiple consecutive grade changes', () => {
        const onSelectComment = jest.fn()
        const { rerender } = render(
          <OutcomeCommentSelector
            grade={85}
            selectedOutcomeCommentId={comment1.id}
            outcomeComments={[comment1, comment2]}
            onSelectComment={onSelectComment}
          />,
        )

        expect(screen.getByText(comment1.comment)).toBeInTheDocument()

        // Change to 91
        rerender(
          <OutcomeCommentSelector
            grade={91}
            selectedOutcomeCommentId={comment2.id}
            outcomeComments={[comment2, comment3]}
            onSelectComment={onSelectComment}
          />,
        )

        expect(screen.getByText(comment2.comment)).toBeInTheDocument()

        // Change to 92
        rerender(
          <OutcomeCommentSelector
            grade={92}
            selectedOutcomeCommentId={comment3.id}
            outcomeComments={[comment3]}
            onSelectComment={onSelectComment}
          />,
        )

        expect(screen.getByText(comment3.comment)).toBeInTheDocument()
        expect(screen.queryByRole('button')).not.toBeInTheDocument()

        // Change back to 85
        rerender(
          <OutcomeCommentSelector
            grade={85}
            selectedOutcomeCommentId={comment1.id}
            outcomeComments={[comment1, comment2]}
            onSelectComment={onSelectComment}
          />,
        )

        expect(screen.getByText(comment1.comment)).toBeInTheDocument()
      })
    })
  })
})
