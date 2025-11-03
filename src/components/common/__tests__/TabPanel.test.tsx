/**
 * TabPanel Component Tests
 * TDD Phase: RED - Writing failing tests first
 * Reference: US-TABPANEL-001
 *
 * Testing tab panel show/hide behavior with proper ARIA attributes
 */
import { render, screen } from '../../../test-utils'
import { TabPanel } from '../TabPanel'

describe('TabPanel Component (US-TABPANEL-001)', () => {
  describe('AC1: Show/Hide Content Based on Active Tab', () => {
    it('should render children when panel ID matches active tab ID', () => {
      render(
        <TabPanel id="edit" activeTabId="edit" tabId="edit">
          <div>Edit Content</div>
        </TabPanel>,
      )

      expect(screen.getByText('Edit Content')).toBeInTheDocument()
    })

    it('should not render children when panel ID does not match active tab ID', () => {
      render(
        <TabPanel id="outcome" activeTabId="edit" tabId="outcome">
          <div>Outcome Content</div>
        </TabPanel>,
      )

      expect(screen.queryByText('Outcome Content')).not.toBeInTheDocument()
    })

    it('should unmount component when hidden (return null, not just hide)', () => {
      const { rerender } = render(
        <TabPanel id="edit" activeTabId="edit" tabId="edit">
          <div data-testid="edit-content">Edit Content</div>
        </TabPanel>,
      )

      // Initially visible
      expect(screen.getByTestId('edit-content')).toBeInTheDocument()

      // Change active tab - component should unmount
      rerender(
        <TabPanel id="edit" activeTabId="outcome" tabId="edit">
          <div data-testid="edit-content">Edit Content</div>
        </TabPanel>,
      )

      // Component should not exist in DOM (not just hidden)
      expect(screen.queryByTestId('edit-content')).not.toBeInTheDocument()
    })

    it('should switch between multiple panels correctly', () => {
      const { rerender } = render(
        <>
          <TabPanel id="edit" activeTabId="edit" tabId="edit">
            <div>Edit Content</div>
          </TabPanel>
          <TabPanel id="outcome" activeTabId="edit" tabId="outcome">
            <div>Outcome Content</div>
          </TabPanel>
        </>,
      )

      // Only edit panel should be visible
      expect(screen.getByText('Edit Content')).toBeInTheDocument()
      expect(screen.queryByText('Outcome Content')).not.toBeInTheDocument()

      // Switch to outcome panel
      rerender(
        <>
          <TabPanel id="edit" activeTabId="outcome" tabId="edit">
            <div>Edit Content</div>
          </TabPanel>
          <TabPanel id="outcome" activeTabId="outcome" tabId="outcome">
            <div>Outcome Content</div>
          </TabPanel>
        </>,
      )

      // Only outcome panel should be visible
      expect(screen.queryByText('Edit Content')).not.toBeInTheDocument()
      expect(screen.getByText('Outcome Content')).toBeInTheDocument()
    })
  })

  describe('AC2: ARIA Attributes for Accessibility', () => {
    it('should have role="tabpanel" when visible', () => {
      render(
        <TabPanel id="edit" activeTabId="edit" tabId="edit">
          <div>Edit Content</div>
        </TabPanel>,
      )

      const tabpanel = screen.getByRole('tabpanel')
      expect(tabpanel).toBeInTheDocument()
    })

    it('should have correct id attribute matching pattern', () => {
      render(
        <TabPanel id="edit" activeTabId="edit" tabId="edit">
          <div>Edit Content</div>
        </TabPanel>,
      )

      const tabpanel = screen.getByRole('tabpanel')
      expect(tabpanel).toHaveAttribute('id', 'tabpanel-edit')
    })

    it('should have aria-labelledby pointing to associated tab', () => {
      render(
        <TabPanel id="edit" activeTabId="edit" tabId="edit">
          <div>Edit Content</div>
        </TabPanel>,
      )

      const tabpanel = screen.getByRole('tabpanel')
      expect(tabpanel).toHaveAttribute('aria-labelledby', 'tab-edit')
    })

    it('should not render ARIA attributes when panel is hidden', () => {
      render(
        <TabPanel id="outcome" activeTabId="edit" tabId="outcome">
          <div>Outcome Content</div>
        </TabPanel>,
      )

      // Should not find any tabpanel role when hidden
      expect(screen.queryByRole('tabpanel')).not.toBeInTheDocument()
    })
  })

  describe('AC3: Styling and Layout', () => {
    it('should apply default spacing class (mt-4)', () => {
      render(
        <TabPanel id="edit" activeTabId="edit" tabId="edit">
          <div>Edit Content</div>
        </TabPanel>,
      )

      const tabpanel = screen.getByRole('tabpanel')
      expect(tabpanel).toHaveClass('mt-4')
    })

    it('should allow custom className to be added', () => {
      render(
        <TabPanel id="edit" activeTabId="edit" tabId="edit" className="custom-class">
          <div>Edit Content</div>
        </TabPanel>,
      )

      const tabpanel = screen.getByRole('tabpanel')
      expect(tabpanel).toHaveClass('mt-4')
      expect(tabpanel).toHaveClass('custom-class')
    })
  })

  describe('AC4: Props Update Behavior', () => {
    it('should re-render with new children when props update', () => {
      const { rerender } = render(
        <TabPanel id="edit" activeTabId="edit" tabId="edit">
          <div>Original Content</div>
        </TabPanel>,
      )

      expect(screen.getByText('Original Content')).toBeInTheDocument()

      rerender(
        <TabPanel id="edit" activeTabId="edit" tabId="edit">
          <div>Updated Content</div>
        </TabPanel>,
      )

      expect(screen.queryByText('Original Content')).not.toBeInTheDocument()
      expect(screen.getByText('Updated Content')).toBeInTheDocument()
    })

    it('should maintain accessibility attributes when props update', () => {
      const { rerender } = render(
        <TabPanel id="edit" activeTabId="edit" tabId="edit">
          <div>Content 1</div>
        </TabPanel>,
      )

      let tabpanel = screen.getByRole('tabpanel')
      expect(tabpanel).toHaveAttribute('id', 'tabpanel-edit')
      expect(tabpanel).toHaveAttribute('aria-labelledby', 'tab-edit')

      rerender(
        <TabPanel id="edit" activeTabId="edit" tabId="edit">
          <div>Content 2</div>
        </TabPanel>,
      )

      tabpanel = screen.getByRole('tabpanel')
      expect(tabpanel).toHaveAttribute('id', 'tabpanel-edit')
      expect(tabpanel).toHaveAttribute('aria-labelledby', 'tab-edit')
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty children gracefully', () => {
      render(
        <TabPanel id="edit" activeTabId="edit" tabId="edit">
          {null}
        </TabPanel>,
      )

      // Should still render the tabpanel wrapper
      const tabpanel = screen.getByRole('tabpanel')
      expect(tabpanel).toBeInTheDocument()
    })

    it('should handle complex nested children', () => {
      render(
        <TabPanel id="edit" activeTabId="edit" tabId="edit">
          <div>
            <h2>Title</h2>
            <p>Paragraph</p>
            <button>Action</button>
          </div>
        </TabPanel>,
      )

      expect(screen.getByText('Title')).toBeInTheDocument()
      expect(screen.getByText('Paragraph')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
    })
  })
})
