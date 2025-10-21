import { useState } from 'react'
import './App.css'
import { ClassList } from './components/classes/ClassList'
import { ClassForm } from './components/classes/ClassForm'
import type { Class } from './types/Class'

/**
 * Main application component
 * Entry point for the Commentator frontend
 *
 * Integrates class management features:
 * - View list of classes (US-CLASS-001)
 * - Add new class (US-CLASS-002)
 */
function App() {
  const [showForm, setShowForm] = useState(false)
  const [editingClass, setEditingClass] = useState<Class | undefined>(undefined)

  const handleAddClass = () => {
    setEditingClass(undefined)
    setShowForm(true)
  }

  const handleEditClass = (classItem: Class) => {
    setEditingClass(classItem)
    setShowForm(true)
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingClass(undefined)
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingClass(undefined)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Commentator</h1>
        <p>Student Report Card Comment Management</p>
      </header>
      <main className="app-main">
        {showForm
          ? (
              <ClassForm
                existingClass={editingClass}
                onSuccess={handleFormSuccess}
                onCancel={handleFormCancel}
              />
            )
          : (
              <ClassList
                onAddClass={handleAddClass}
                onEdit={handleEditClass}
              />
            )}
      </main>
    </div>
  )
}

export default App
