/**
 * SelectedCommentsList Whitespace Rendering Tests
 * Verifies that extra spaces are visually rendered in the DOM
 */

import { render } from '../../../test-utils'
import { SelectedCommentsList } from '../SelectedCommentsList'
import type { PersonalizedComment } from '../../../types'

describe('SelectedCommentsList - Whitespace Visual Rendering', () => {
  const mockComments: PersonalizedComment[] = [
    {
      id: '1',
      subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
      comment: 'Great   effort   shown',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
    },
  ]

  const defaultProps = {
    selectedComments: mockComments,
    onReorder: jest.fn(),
    onRemove: jest.fn(),
  }

  describe('whitespace rendering in list items', () => {
    it('should render multiple spaces visually (not collapsed to single space)', () => {
      const { container } = render(
        <SelectedCommentsList {...defaultProps} />,
      )

      // Find the span that displays the comment
      const commentSpans = Array.from(
        container.querySelectorAll('span'),
      ).filter((span) => span.textContent === 'Great   effort   shown')

      expect(commentSpans.length).toBeGreaterThan(0)

      const commentSpan = commentSpans[0] as HTMLElement
      const computedStyle = window.getComputedStyle(commentSpan)

      // Verify white-space property is set to preserve spaces
      expect(computedStyle.whiteSpace).toBe('pre-wrap')
    })
  })
})
