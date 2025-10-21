/**
 * App Component Tests
 * Validates testing infrastructure and basic rendering
 */
import { render, screen, waitFor } from '../test-utils'
import App from '../App'

// Mock the classService to avoid real API calls
jest.mock('../services/api/classService', () => ({
  getAllClasses: jest.fn().mockResolvedValue([]),
  getClassById: jest.fn(),
  createClass: jest.fn(),
  updateClass: jest.fn(),
  deleteClass: jest.fn(),
}))

describe('App', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks()
  })

  it('renders without crashing', () => {
    render(<App />)
    expect(screen.getByText(/commentator/i)).toBeInTheDocument()
  })

  it('displays the application title', () => {
    render(<App />)
    expect(screen.getByText('Commentator')).toBeInTheDocument()
  })

  it('displays the subtitle', () => {
    render(<App />)
    expect(screen.getByText('Student Report Card Comment Management')).toBeInTheDocument()
  })

  it('renders the ClassList component', async () => {
    render(<App />)

    // ClassList should render with "My Classes" heading
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /my classes/i })).toBeInTheDocument()
    })
  })

  it('allows users to interact with class management features', async () => {
    render(<App />)

    // Should show "Add Class" button from ClassList
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /add class/i })).toBeInTheDocument()
    })
  })
})
