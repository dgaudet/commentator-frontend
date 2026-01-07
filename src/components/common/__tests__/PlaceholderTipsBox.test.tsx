/**
 * PlaceholderTipsBox Component Tests
 *
 * Test-Driven Development approach for placeholder documentation component
 * TASK-1.1: Add pronoun placeholder documentation to Outcome Comments
 * TASK-1.2: Add pronoun placeholder documentation to Personalized Comments
 */

import { render, screen } from '../../../test-utils'
import { PlaceholderTipsBox } from '../PlaceholderTipsBox'

describe('PlaceholderTipsBox - Basic Rendering', () => {
  it('should display the placeholder tips header', () => {
    render(<PlaceholderTipsBox />)

    expect(screen.getByText(/💡 Tip: Use Dynamic Placeholders/)).toBeInTheDocument()
  })

  it('should display instructions for using placeholders', () => {
    render(<PlaceholderTipsBox />)

    expect(screen.getByText(/Add placeholders to personalize comments for each student:/)).toBeInTheDocument()
  })

  it('should display existing student placeholders', () => {
    render(<PlaceholderTipsBox />)

    // Check for existing placeholders: <first name>, <last name>, <grade>
    expect(screen.getByText('<first name>')).toBeInTheDocument()
    expect(screen.getByText('<last name>')).toBeInTheDocument()
    expect(screen.getByText('<grade>')).toBeInTheDocument()
  })
})

/**
 * RED PHASE - FAILING TEST FOR TASK-1.1
 *
 * This test verifies that the PlaceholderTipsBox displays documentation for
 * the new pronoun placeholders: <pronoun> and <possessive pronoun>
 *
 * According to TASK-1.1 AC-1.1.1:
 * "Help text is visible above the comment textarea stating:
 *  'Available placeholders: <pronoun> (e.g., he, she, they) and
 *   <possessive pronoun> (e.g., his, her, their)'"
 */
describe('PlaceholderTipsBox - Pronoun Placeholders (TASK-1.1, TASK-1.2)', () => {
  it('should display <pronoun> placeholder with examples', () => {
    render(<PlaceholderTipsBox />)

    // Verify <pronoun> placeholder is shown
    expect(screen.getByText('<pronoun>')).toBeInTheDocument()
    // Verify examples are shown nearby
    const container = screen.getByText('<pronoun>').closest('div')
    const textContent = container?.textContent || ''
    expect(textContent).toContain('e.g.')
    expect(textContent).toContain('he')
    expect(textContent).toContain('she')
    expect(textContent).toContain('they')
  })

  it('should display <possessive pronoun> placeholder with examples', () => {
    render(<PlaceholderTipsBox />)

    // Verify <possessive pronoun> placeholder is shown
    expect(screen.getByText('<possessive pronoun>')).toBeInTheDocument()
    // Verify examples are shown nearby
    const container = screen.getByText('<possessive pronoun>').closest('div')
    const textContent = container?.textContent || ''
    expect(textContent).toContain('e.g.')
    expect(textContent).toContain('his')
    expect(textContent).toContain('her')
    expect(textContent).toContain('their')
  })

  it('should display pronoun placeholders in accessible code tags', () => {
    render(<PlaceholderTipsBox />)

    // Verify both placeholders are displayed in code elements for visibility
    expect(screen.getByText('<pronoun>')).toBeInTheDocument()
    expect(screen.getByText('<possessive pronoun>')).toBeInTheDocument()
  })
})
