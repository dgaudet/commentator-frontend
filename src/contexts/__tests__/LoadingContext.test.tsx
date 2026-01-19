/**
 * LoadingContext Tests
 * Tests for global API loading state management
 */

import { render, screen, waitFor } from '@testing-library/react'
import { LoadingProvider, useLoading } from '../LoadingContext'

// Test component that uses the LoadingContext
function TestComponent() {
  const { isLoading, startLoading, stopLoading } = useLoading()

  return (
    <div>
      <div data-testid="loading-status">{isLoading ? 'loading' : 'ready'}</div>
      <button onClick={startLoading} data-testid="start-btn">
        Start Loading
      </button>
      <button onClick={stopLoading} data-testid="stop-btn">
        Stop Loading
      </button>
    </div>
  )
}

describe('LoadingContext', () => {
  describe('LoadingProvider', () => {
    it('should render children', () => {
      render(
        <LoadingProvider>
          <div>Test Content</div>
        </LoadingProvider>,
      )

      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })

    it('should provide loading context to children', () => {
      render(
        <LoadingProvider>
          <TestComponent />
        </LoadingProvider>,
      )

      expect(screen.getByTestId('loading-status')).toBeInTheDocument()
    })
  })

  describe('useLoading hook', () => {
    it('should initialize with isLoading = false', () => {
      render(
        <LoadingProvider>
          <TestComponent />
        </LoadingProvider>,
      )

      expect(screen.getByTestId('loading-status')).toHaveTextContent('ready')
    })

    it('should set isLoading to true when startLoading is called', async () => {
      render(
        <LoadingProvider>
          <TestComponent />
        </LoadingProvider>,
      )

      const startBtn = screen.getByTestId('start-btn')
      startBtn.click()

      await waitFor(() => {
        expect(screen.getByTestId('loading-status')).toHaveTextContent('loading')
      })
    })

    it('should set isLoading to false when stopLoading is called', async () => {
      render(
        <LoadingProvider>
          <TestComponent />
        </LoadingProvider>,
      )

      const startBtn = screen.getByTestId('start-btn')
      const stopBtn = screen.getByTestId('stop-btn')

      startBtn.click()

      await waitFor(() => {
        expect(screen.getByTestId('loading-status')).toHaveTextContent('loading')
      })

      stopBtn.click()

      await waitFor(() => {
        expect(screen.getByTestId('loading-status')).toHaveTextContent('ready')
      })
    })

    it('should handle multiple loading requests (loading counter)', async () => {
      function MultiLoadComponent() {
        const { isLoading, startLoading, stopLoading } = useLoading()

        return (
          <div>
            <div data-testid="loading-status">{isLoading ? 'loading' : 'ready'}</div>
            <button
              onClick={() => {
                startLoading()
                startLoading()
              }}
              data-testid="start-multiple"
            >
              Start Multiple
            </button>
            <button onClick={stopLoading} data-testid="stop-once">
              Stop Once
            </button>
          </div>
        )
      }

      render(
        <LoadingProvider>
          <MultiLoadComponent />
        </LoadingProvider>,
      )

      // Start two loading operations
      const startMultiple = screen.getByTestId('start-multiple')
      startMultiple.click()

      await waitFor(() => {
        expect(screen.getByTestId('loading-status')).toHaveTextContent('loading')
      })

      // Stop one - should still be loading (counter = 1)
      const stopOnce = screen.getByTestId('stop-once')
      stopOnce.click()

      await waitFor(() => {
        expect(screen.getByTestId('loading-status')).toHaveTextContent('loading')
      })

      // Stop again - now should be ready (counter = 0)
      stopOnce.click()

      await waitFor(() => {
        expect(screen.getByTestId('loading-status')).toHaveTextContent('ready')
      })
    })

    it('should not allow negative loading counter', async () => {
      function CounterComponent() {
        const { isLoading, stopLoading } = useLoading()

        return (
          <div>
            <div data-testid="loading-status">{isLoading ? 'loading' : 'ready'}</div>
            <button onClick={stopLoading} data-testid="stop-btn">
              Stop
            </button>
          </div>
        )
      }

      render(
        <LoadingProvider>
          <CounterComponent />
        </LoadingProvider>,
      )

      // Try to stop when not loading - should not go negative
      const stopBtn = screen.getByTestId('stop-btn')
      stopBtn.click()

      await waitFor(() => {
        expect(screen.getByTestId('loading-status')).toHaveTextContent('ready')
      })

      // Should still be ready, not in error state
      expect(screen.getByTestId('loading-status')).toHaveTextContent('ready')
    })

    it('should throw error when useLoading is called outside LoadingProvider', () => {
      // Suppress console.error for this test
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

      expect(() => {
        render(<TestComponent />)
      }).toThrow('useLoading must be used within a LoadingProvider')

      consoleErrorSpy.mockRestore()
    })
  })

  describe('API loading integration', () => {
    it('should track multiple concurrent API operations', async () => {
      function MultiApiComponent() {
        const { isLoading, startLoading, stopLoading } = useLoading()

        const simulateApiCall = async (duration: number) => {
          startLoading()
          await new Promise(resolve => setTimeout(resolve, duration))
          stopLoading()
        }

        return (
          <div>
            <div data-testid="loading-status">{isLoading ? 'loading' : 'ready'}</div>
            <button
              onClick={() => simulateApiCall(100)}
              data-testid="api-call-1"
            >
              API Call 1
            </button>
            <button
              onClick={() => simulateApiCall(200)}
              data-testid="api-call-2"
            >
              API Call 2
            </button>
          </div>
        )
      }

      render(
        <LoadingProvider>
          <MultiApiComponent />
        </LoadingProvider>,
      )

      // Trigger first API call
      screen.getByTestId('api-call-1').click()

      await waitFor(() => {
        expect(screen.getByTestId('loading-status')).toHaveTextContent('loading')
      })

      // Trigger second API call while first is loading
      screen.getByTestId('api-call-2').click()

      // Should still be loading (counter = 2)
      expect(screen.getByTestId('loading-status')).toHaveTextContent('loading')

      // Wait for both to complete
      await waitFor(() => {
        expect(screen.getByTestId('loading-status')).toHaveTextContent('ready')
      })
    })
  })
})
