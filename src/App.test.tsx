/**
 * App Component Tests
 * Validates testing infrastructure and basic rendering
 */
import { render, screen } from './test-utils'
import App from './App'

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />)
    expect(screen.getByText(/commentator/i)).toBeInTheDocument()
  })

  it('displays the application title', () => {
    render(<App />)
    expect(screen.getByText('Commentator')).toBeInTheDocument()
  })

  it('shows initialization message', () => {
    render(<App />)
    expect(screen.getByText(/application initialized/i)).toBeInTheDocument()
  })
})
