/**
 * PersonalizedCommentsModal Whitespace Rendering Tests
 * Verifies that extra spaces are visually rendered in the DOM, not just stored
 */

import { render } from '../../../test-utils'
import { PersonalizedCommentsModal } from '../PersonalizedCommentsModal'
import type { PersonalizedComment } from '../../../types'

describe('PersonalizedCommentsModal - Whitespace Visual Rendering', () => {
  const mockSubject = {
    id: '65a1b2c3d4e5f6g7h8i9j0k1',
    name: 'Mathematics',
    createdAt: '',
    updatedAt: '',
  }

  const defaultProps = {
    isOpen: true,
    entityData: mockSubject,
    personalizedComments: [],
    onCreateComment: jest.fn(),
    onUpdateComment: jest.fn(),
    onDeleteComment: jest.fn(),
    loading: false,
    error: null,
  }

  describe('whitespace rendering in DOM', () => {
    it('should render multiple spaces visually (not collapsed to single space)', () => {
      const commentWithSpaces: PersonalizedComment = {
        id: '1',
        subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
        comment: 'Great   work',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
      }

      const { container } = render(
        <PersonalizedCommentsModal
          {...defaultProps}
          personalizedComments={[commentWithSpaces]}
        />,
      )

      // Find the div that displays the comment
      const commentDivs = Array.from(
        container.querySelectorAll('div'),
      ).filter((div) => div.textContent === 'Great   work' && div.children.length === 0)

      expect(commentDivs.length).toBeGreaterThan(0)

      const commentDiv = commentDivs[0] as HTMLElement

      // Check the computed style to ensure whitespace is preserved in rendering
      const computedStyle = window.getComputedStyle(commentDiv)
      console.log('whiteSpace style:', computedStyle.whiteSpace)

      // The issue: by default HTML collapses whitespace.
      // We need white-space: pre-wrap to preserve it visually
      expect(computedStyle.whiteSpace).toBe('pre-wrap')
    })
  })
})
