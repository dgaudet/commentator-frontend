/**
 * OutcomeCommentsModal Whitespace Rendering Tests
 * Verifies that extra spaces are visually rendered in the DOM
 */

import { render } from '../../../test-utils'
import { OutcomeCommentsModal } from '../OutcomeCommentsModal'
import type { OutcomeComment } from '../../../types'

describe('OutcomeCommentsModal - Whitespace Visual Rendering', () => {
  const mockSubject = {
    id: '65a1b2c3d4e5f6g7h8i9j0k1',
    name: 'Mathematics',
    createdAt: '',
    updatedAt: '',
  }

  const defaultProps = {
    isOpen: true,
    entityData: mockSubject,
    outcomeComments: [],
    onCreateComment: jest.fn(),
    onUpdateComment: jest.fn(),
    onDeleteComment: jest.fn(),
    loading: false,
    error: null,
    pronouns: [],
    pronounsLoading: false,
    pronounsError: null,
  }

  describe('whitespace rendering in DOM', () => {
    it('should render multiple spaces visually (not collapsed to single space)', () => {
      const commentWithSpaces: OutcomeComment = {
        id: '1',
        subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
        lowerRange: 75,
        upperRange: 100,
        comment: 'Excellent   understanding',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
      }

      const { container } = render(
        <OutcomeCommentsModal
          {...defaultProps}
          outcomeComments={[commentWithSpaces]}
        />,
      )

      // Find the div that displays the comment
      const commentDivs = Array.from(
        container.querySelectorAll('div'),
      ).filter((div) => div.textContent === 'Excellent   understanding' && div.children.length === 0)

      expect(commentDivs.length).toBeGreaterThan(0)

      const commentDiv = commentDivs[0] as HTMLElement
      const computedStyle = window.getComputedStyle(commentDiv)

      // Verify white-space property is set to preserve spaces
      expect(computedStyle.whiteSpace).toBe('pre-wrap')
    })
  })
})
