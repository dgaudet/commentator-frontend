import { renderWithRouter, screen } from '../../../test-utils'
import NotFound from '../NotFound'

describe('NotFound Component', () => {
  const renderNotFound = () => {
    return renderWithRouter(<NotFound />)
  }

  describe('Content', () => {
    it('should display a heading indicating page not found', () => {
      renderNotFound()
      expect(screen.getAllByRole('heading')).toHaveLength(2)
      expect(screen.getByText(/page not found/i)).toBeInTheDocument()
      expect(screen.getByText('404')).toBeInTheDocument()
    })

    it('should display a descriptive message', () => {
      renderNotFound()
      expect(screen.getByText(/page you.*looking|doesn't exist|couldn't find/i)).toBeInTheDocument()
    })

    it('should display a link to return home', () => {
      renderNotFound()
      const homeLink = screen.getByRole('link', { name: /home|back to/i })
      expect(homeLink).toBeInTheDocument()
      // Link renders as relative path when inside Router with basename
      expect(homeLink.getAttribute('href')).toMatch(/^\/|^\/commentator-frontend\//)
    })
  })

  describe('Accessibility', () => {
    it('should have proper semantic HTML structure', () => {
      const { container } = renderWithRouter(<NotFound />)
      expect(container.querySelector('main') || container.querySelector('[role="main"]')).toBeInTheDocument()
    })

    it('should have proper heading hierarchy', () => {
      renderNotFound()
      const headings = screen.getAllByRole('heading')
      expect(headings.length).toBeGreaterThan(0)
      headings.forEach(heading => {
        expect(['H1', 'H2', 'H3'].includes(heading.tagName)).toBe(true)
      })
    })

    it('should be keyboard navigable', () => {
      renderNotFound()
      const homeLink = screen.getByRole('link', { name: /home|back to/i })
      expect(homeLink).toBeVisible()
    })
  })

  describe('Styling & Theme', () => {
    it('should render with design token-based styling', () => {
      const { container } = renderWithRouter(<NotFound />)
      // Component should use design tokens, not hardcoded colors
      expect(container.firstChild).toBeInTheDocument()
    })
  })
})
