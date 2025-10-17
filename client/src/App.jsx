import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [name, setName] = useState('')
  const [greeting, setGreeting] = useState('')
  const [serverMessage, setServerMessage] = useState('')
  const [healthStatus, setHealthStatus] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchServerMessage()
    fetchHealthStatus()
  }, [])

  const fetchServerMessage = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/hello')
      if (!response.ok) throw new Error('Server unavailable')
      const data = await response.json()
      setServerMessage(data.message)
      setError('')
    } catch (err) {
      setError('Unable to connect to server. Please ensure the server is running.')
    }
  }

  const fetchHealthStatus = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/health')
      if (!response.ok) throw new Error('Server unavailable')
      const data = await response.json()
      setHealthStatus(data)
    } catch (err) {
      setHealthStatus({ status: 'down' })
    }
  }

  const handleGreeting = async (e) => {
    e.preventDefault()
    if (!name.trim()) {
      setGreeting('Please enter a name!')
      return
    }

    try {
      const response = await fetch(`http://localhost:3001/api/greet/${encodeURIComponent(name)}`)
      if (!response.ok) throw new Error('Server unavailable')
      const data = await response.json()
      setGreeting(data.message)
      setError('')
    } catch (err) {
      setGreeting(`Hello, ${name}!`)
      setError('Server unavailable - showing local greeting')
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Hello World Application</h1>
        <p className="welcome-message">Welcome to our React + Node.js application!</p>
      </header>

      <main className="app-main">
        <section className="card">
          <h2>Server Communication</h2>
          {error && <p className="error">{error}</p>}
          {serverMessage && (
            <p className="server-message">
              <strong>Message from server:</strong> {serverMessage}
            </p>
          )}
        </section>

        <section className="card">
          <h2>Interactive Greeting</h2>
          <form onSubmit={handleGreeting} className="greeting-form">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="name-input"
            />
            <button type="submit" className="submit-button">
              Greet Me
            </button>
          </form>
          {greeting && (
            <p className="greeting-result">{greeting}</p>
          )}
        </section>

        <section className="card health-status">
          <h2>System Health</h2>
          {healthStatus && (
            <div className={`health-indicator ${healthStatus.status}`}>
              <span className="status-dot"></span>
              <span>Server Status: {healthStatus.status === 'up' ? 'Online' : 'Offline'}</span>
              {healthStatus.timestamp && (
                <small>Last checked: {new Date(healthStatus.timestamp).toLocaleTimeString()}</small>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default App
