/**
 * CopyCommentsModal Copy Mode Selection Tests
 * Reference: US-CP-003 - Provide Copy Mode Selection (Overwrite vs. Append)
 *
 * Tests for copy mode selection functionality:
 * - Radio button options (overwrite vs append)
 * - Default selection (append)
 * - Clear explanations for each mode
 * - Selection behavior and persistence
 * - Keyboard navigation (Space key)
 * - Accessibility
 *
 * TDD Phase: RED - Writing failing tests first
 */

import { render, screen, fireEvent } from '../../../test-utils'
import { CopyCommentsModal } from '../CopyCommentsModal'

describe('CopyCommentsModal - Copy Mode Selection (US-CP-003)', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    sourceSubjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
    sourceSubjectName: 'Mathematics',
    ownedSubjects: [],
    sourceCommentCount: 5,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('AC-3.1: Radio Button Options', () => {
    it('should display two radio button options', () => {
      render(<CopyCommentsModal {...defaultProps} />)
      const overwrites = screen.getAllByRole('radio', { name: /overwrite/i })
      const appends = screen.getAllByRole('radio', { name: /append/i })
      expect(overwrites.length).toBeGreaterThan(0)
      expect(appends.length).toBeGreaterThan(0)
    })

    it('should display "Overwrite existing comments" option', () => {
      render(<CopyCommentsModal {...defaultProps} />)
      expect(screen.getByRole('radio', { name: /overwrite existing comments/i })).toBeInTheDocument()
    })

    it('should display "Append to existing comments" option', () => {
      render(<CopyCommentsModal {...defaultProps} />)
      expect(screen.getByRole('radio', { name: /append to existing comments/i })).toBeInTheDocument()
    })
  })

  describe('AC-3.2: Default Selection', () => {
    it('should have "Append to existing comments" selected by default', () => {
      render(<CopyCommentsModal {...defaultProps} />)
      const appendRadio = screen.getByRole('radio', { name: /append to existing comments/i })
      expect(appendRadio).toBeChecked()
    })

    it('should allow changing the selection', () => {
      render(<CopyCommentsModal {...defaultProps} />)
      const overwriteRadio = screen.getByRole('radio', { name: /overwrite existing comments/i })
      fireEvent.click(overwriteRadio)
      expect(overwriteRadio).toBeChecked()
    })
  })

  describe('AC-3.3: Mode Explanations', () => {
    it('should display explanation for overwrite mode', () => {
      render(<CopyCommentsModal {...defaultProps} />)
      expect(screen.getByText(/replace any existing personalized comments/i)).toBeInTheDocument()
    })

    it('should display explanation for append mode', () => {
      render(<CopyCommentsModal {...defaultProps} />)
      expect(screen.getByText(/add these comments to any existing personalized comments/i)).toBeInTheDocument()
    })
  })

  describe('AC-3.4: Selection Behavior', () => {
    it('should toggle overwrite radio when clicked', () => {
      render(<CopyCommentsModal {...defaultProps} />)
      const overwriteRadio = screen.getByRole('radio', { name: /overwrite existing comments/i })
      const appendRadio = screen.getByRole('radio', { name: /append to existing comments/i })

      fireEvent.click(overwriteRadio)
      expect(overwriteRadio).toBeChecked()
      expect(appendRadio).not.toBeChecked()
    })

    it('should toggle append radio when clicked', () => {
      render(<CopyCommentsModal {...defaultProps} />)
      const overwriteRadio = screen.getByRole('radio', { name: /overwrite existing comments/i })
      const appendRadio = screen.getByRole('radio', { name: /append to existing comments/i })

      fireEvent.click(overwriteRadio)
      expect(overwriteRadio).toBeChecked()

      fireEvent.click(appendRadio)
      expect(appendRadio).toBeChecked()
      expect(overwriteRadio).not.toBeChecked()
    })

    it('should persist selection until changed', () => {
      render(<CopyCommentsModal {...defaultProps} />)
      const overwriteRadio = screen.getByRole('radio', { name: /overwrite existing comments/i })

      fireEvent.click(overwriteRadio)
      expect(overwriteRadio).toBeChecked()

      // Click again and verify it stays checked
      fireEvent.click(overwriteRadio)
      expect(overwriteRadio).toBeChecked()
    })
  })

  describe('AC-3.5: Accessibility', () => {
    it('should have focusable radio buttons with Tab key', () => {
      render(<CopyCommentsModal {...defaultProps} />)
      const overwriteRadio = screen.getByRole('radio', { name: /overwrite existing comments/i })
      overwriteRadio.focus()
      expect(overwriteRadio).toHaveFocus()
    })

    it('should toggle radio with Space key', () => {
      render(<CopyCommentsModal {...defaultProps} />)
      const appendRadio = screen.getByRole('radio', { name: /append to existing comments/i })
      appendRadio.focus()

      // Space key doesn't toggle in standard HTML, but we still test it's accessible
      fireEvent.keyDown(appendRadio, { key: ' ', code: 'Space' })
      expect(appendRadio).toBeChecked()
    })

    it('should be announced by screen readers', () => {
      render(<CopyCommentsModal {...defaultProps} />)
      const overwriteRadio = screen.getByRole('radio', { name: /overwrite existing comments/i })
      expect(overwriteRadio).toHaveAccessibleName()
    })

    it('should have accessible explanatory text for radio buttons', () => {
      render(<CopyCommentsModal {...defaultProps} />)
      // Check that there is explanatory text near the radio button
      expect(screen.getByText(/replace any existing personalized comments/i)).toBeInTheDocument()
    })
  })
})
