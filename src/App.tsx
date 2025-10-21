import { useState } from 'react'
import './App.css'
import { ClassList } from './components/classes/ClassList'
import { ClassForm } from './components/classes/ClassForm'
import { ConfirmDialog } from './components/common/ConfirmDialog'
import { useClasses } from './hooks/useClasses'
import type { Class } from './types/Class'

/**
 * Main application component
 * Entry point for the Commentator frontend
 *
 * Integrates class management features:
 * - View list of classes (US-CLASS-001)
 * - Add new class (US-CLASS-002)
 * - Edit existing class (US-CLASS-003)
 * - Delete class (US-CLASS-005)
 */
function App() {
  const [showForm, setShowForm] = useState(false)
  const [editingClass, setEditingClass] = useState<Class | undefined>(undefined)
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean
    classId?: number
    className?: string
  }>({ isOpen: false })

  const { classes, deleteClass } = useClasses()

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

  const handleDeleteRequest = (classId: number) => {
    // Find the class to get its name for the confirmation dialog
    const classItem = classes.find(c => c.id === classId)
    setDeleteConfirm({
      isOpen: true,
      classId,
      className: classItem ? classItem.name : `Class ${classId}`,
    })
  }

  const handleDeleteConfirm = async () => {
    if (deleteConfirm.classId) {
      try {
        await deleteClass(deleteConfirm.classId)
        setDeleteConfirm({ isOpen: false })
      } catch (error) {
        // Error is handled by useClasses hook
        setDeleteConfirm({ isOpen: false })
      }
    }
  }

  const handleDeleteCancel = () => {
    setDeleteConfirm({ isOpen: false })
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
                onDelete={handleDeleteRequest}
              />
            )}
      </main>

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete Class"
        message={`Are you sure you want to delete "${deleteConfirm.className}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  )
}

export default App
