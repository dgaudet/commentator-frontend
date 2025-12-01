import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import { SubjectList } from './components/subjects/SubjectList'
import { SubjectForm } from './components/subjects/SubjectForm'
import { saveSelectedSubjectId } from './utils/subjectStorageUtils'
import type { Subject } from './types/Subject'
import { ThemeProvider } from './contexts/ThemeContext'
import { ThemeToggle } from './components/common/ThemeToggle'
import { ThemeStyles } from './components/common/ThemeStyles'
import { useThemeColors } from './hooks/useThemeColors'
import { spacing } from './theme/tokens'
import { ProtectedRoute } from './components/ProtectedRoute'
import { LoginPage } from './pages/LoginPage'
import { CallbackPage } from './pages/CallbackPage'
import { Header } from './components/Header'

/**
 * Inner application layout component
 * Separated to use useThemeColors hook inside ThemeProvider
 * US-TOKEN-009: Migrated from App.css to inline styles with theme tokens
 */
function AppContent({
  showForm,
  editingSubject,
  onAddSubject,
  onEditSubject,
  onFormSuccess,
  onFormCancel,
}: {
  showForm: boolean
  editingSubject: Subject | undefined
  onAddSubject: () => void
  onEditSubject: (subject: Subject) => void
  onFormSuccess: (subject: Subject) => void
  onFormCancel: () => void
}) {
  const themeColors = useThemeColors()

  const appStyle: React.CSSProperties = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  }

  const headerStyle: React.CSSProperties = {
    padding: spacing.xl,
    background: `linear-gradient(135deg, ${themeColors.primary.main} 0%, ${themeColors.primary.dark} 100%)`,
    color: 'white',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  }

  const headerContentStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.xl,
  }

  const headerTextStyle: React.CSSProperties = {
    flex: 1,
  }

  const h1Style: React.CSSProperties = {
    margin: 0,
    fontSize: '2.5rem',
    fontWeight: 700,
  }

  const pStyle: React.CSSProperties = {
    margin: `${spacing.md} 0 0`,
    fontSize: '1.1rem',
    opacity: 0.9,
  }

  const mainStyle: React.CSSProperties = {
    flex: 1,
    padding: spacing.xl,
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
  }

  return (
    <div style={appStyle}>
      <Header />
      <header style={headerStyle} data-app-header>
        <div style={headerContentStyle}>
          <div style={headerTextStyle}>
            <h1 style={h1Style}>Commentator</h1>
            <p style={pStyle}>Student Report Card Comment Management</p>
          </div>
          <ThemeToggle />
        </div>
      </header>
      <main style={mainStyle} data-app-main>
        {showForm
          ? (
              <SubjectForm
                existingSubject={editingSubject}
                onSuccess={onFormSuccess}
                onCancel={onFormCancel}
              />
            )
          : (
              <SubjectList
                onAddSubject={onAddSubject}
                onEdit={onEditSubject}
                onEditSuccess={onFormSuccess}
                onEditCancel={onFormCancel}
              />
            )}
      </main>
    </div>
  )
}

/**
 * Main application component
 * Entry point for the Commentator frontend
 *
 * Integrates subject management features:
 * - View list of subjects (US-REFACTOR-005)
 * - Add new subject (US-REFACTOR-007)
 * - Edit existing subject (US-REFACTOR-007)
 * - Delete subject
 *
 * Note: SubjectList manages its own subjects state via useSubjects hook.
 * App.tsx only coordinates UI state (forms, dialogs) and passes callbacks.
 */
function App() {
  const [showForm, setShowForm] = useState(false)
  const [editingSubject, setEditingSubject] = useState<Subject | undefined>(undefined)

  const handleAddSubject = () => {
    setEditingSubject(undefined)
    setShowForm(true)
  }

  const handleEditSubject = (subjectItem: Subject) => {
    setEditingSubject(subjectItem)
    setShowForm(true)
  }

  // US-SUBJECT-CREATE-002: Handle form success with auto-select for newly created subjects
  const handleFormSuccess = (subject: Subject) => {
    // Check if this is a new subject (create mode) - indicated by editingSubject being undefined
    const isNewSubject = !editingSubject

    // Auto-select newly created subject
    if (isNewSubject) {
      // Save to localStorage so SubjectList can pick it up
      // SubjectList will fetch subjects and then auto-select based on localStorage
      saveSelectedSubjectId(subject.id)
    }

    setShowForm(false)
    setEditingSubject(undefined)
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingSubject(undefined)
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/callback" element={<CallbackPage />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <ThemeProvider>
                <ThemeStyles />
                <AppContent
                  showForm={showForm}
                  editingSubject={editingSubject}
                  onAddSubject={handleAddSubject}
                  onEditSubject={handleEditSubject}
                  onFormSuccess={handleFormSuccess}
                  onFormCancel={handleFormCancel}
                />
              </ThemeProvider>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
