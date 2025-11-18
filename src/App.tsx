import { useState } from 'react'
import './App.css'
import { SubjectList } from './components/subjects/SubjectList'
import { SubjectForm } from './components/subjects/SubjectForm'
import { saveSelectedSubjectId } from './utils/subjectStorageUtils'
import type { Subject } from './types/Subject'
import { ThemeProvider } from './contexts/ThemeContext'
import { ThemeToggle } from './components/common/ThemeToggle'
import { ThemeStyles } from './components/common/ThemeStyles'

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
    <ThemeProvider>
      <ThemeStyles />
      <div className="app">
        <header className="app-header">
          <div className="header-content">
            <div className="header-text">
              <h1>Commentator</h1>
              <p>Student Report Card Comment Management</p>
            </div>
            <ThemeToggle />
          </div>
        </header>
        <main className="app-main">
          {showForm
            ? (
                <SubjectForm
                  existingSubject={editingSubject}
                  onSuccess={handleFormSuccess}
                  onCancel={handleFormCancel}
                />
              )
            : (
                <SubjectList
                  onAddSubject={handleAddSubject}
                  onEdit={handleEditSubject}
                  onEditSuccess={handleFormSuccess}
                  onEditCancel={handleFormCancel}
                />
              )}
        </main>
      </div>
    </ThemeProvider>
  )
}

export default App
