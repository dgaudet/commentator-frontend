import { useState } from 'react'
import './App.css'
import { ClassList } from './components/classes/ClassList'
import { ClassForm } from './components/classes/ClassForm'
import { ConfirmDialog } from './components/common/ConfirmDialog'
import { OutcomeCommentsModal } from './components/outcomeComments/OutcomeCommentsModal'
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
 *
 * Note: ClassList manages its own classes state via useClasses hook.
 * App.tsx only coordinates UI state (forms, dialogs) and passes callbacks.
 */
function App() {
  const [showForm, setShowForm] = useState(false)
  const [editingClass, setEditingClass] = useState<Class | undefined>(undefined)
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean
    onConfirm?:() => Promise<void>
    className?: string
      }>({ isOpen: false })
  const [outcomeCommentsModal, setOutcomeCommentsModal] = useState<{
    isOpen: boolean
    classItem?: Class
  }>({ isOpen: false })

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

  // This callback will be called by ClassList when user clicks delete
  // ClassList passes us the class info and a delete function to call on confirm
  const handleDeleteRequest = (className: string, onConfirm: () => Promise<void>) => {
    setDeleteConfirm({
      isOpen: true,
      className,
      onConfirm,
    })
  }

  // This callback will be called by ClassList when user clicks view outcome comments
  const handleViewOutcomeComments = (classItem: Class) => {
    setOutcomeCommentsModal({
      isOpen: true,
      classItem,
    })
  }

  const handleOutcomeCommentsClose = () => {
    setOutcomeCommentsModal({ isOpen: false })
  }

  const handleDeleteConfirm = async () => {
    if (deleteConfirm.onConfirm) {
      try {
        await deleteConfirm.onConfirm()
        setDeleteConfirm({ isOpen: false })
      } catch (error) {
        // Error is handled by useClasses hook in ClassList
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
                onViewOutcomeComments={handleViewOutcomeComments}
              />
            )}
      </main>

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete Class"
        message={`Are you sure you want to delete "${deleteConfirm.className || 'this class'}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        variant="danger"
      />

      <OutcomeCommentsModal
        isOpen={outcomeCommentsModal.isOpen}
        classData={outcomeCommentsModal.classItem || { id: 0, name: '', year: 2024, createdAt: '', updatedAt: '' }}
        outcomeComments={[]}
        onCreateComment={async () => {}}
        onUpdateComment={async () => {}}
        onDeleteComment={async () => {}}
        loading={false}
        error={null}
        onClose={handleOutcomeCommentsClose}
      />
    </div>
  )
}

export default App
