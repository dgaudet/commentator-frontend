import { useState } from 'react'
import './App.css'
import { SubjectList } from './components/subjects/SubjectList'
import { SubjectForm } from './components/subjects/SubjectForm'
import { ConfirmDialog } from './components/common/ConfirmDialog'
import { OutcomeCommentsModal } from './components/outcomeComments/OutcomeCommentsModal'
import { useOutcomeComments } from './hooks/useOutcomeComments'
import type { Subject } from './types/Subject'
import type { CreateOutcomeCommentRequest, UpdateOutcomeCommentRequest } from './types'

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
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean
    onConfirm?:() => Promise<void>
    subjectName?: string
      }>({ isOpen: false })
  const [outcomeCommentsModal, setOutcomeCommentsModal] = useState<{
    isOpen: boolean
    subjectItem?: Subject
  }>({ isOpen: false })

  // Hook for managing outcome comments state and API operations
  const {
    outcomeComments,
    loading: outcomeCommentsLoading,
    error: outcomeCommentsError,
    loadOutcomeComments,
    createComment,
    updateComment,
    deleteComment,
    clearError: clearOutcomeCommentsError,
  } = useOutcomeComments()

  const handleAddSubject = () => {
    setEditingSubject(undefined)
    setShowForm(true)
  }

  const handleEditSubject = (subjectItem: Subject) => {
    setEditingSubject(subjectItem)
    setShowForm(true)
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingSubject(undefined)
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingSubject(undefined)
  }

  // This callback will be called by SubjectList when user clicks delete
  // SubjectList passes us the subject info and a delete function to call on confirm
  const handleDeleteRequest = (subjectName: string, onConfirm: () => Promise<void>) => {
    setDeleteConfirm({
      isOpen: true,
      subjectName,
      onConfirm,
    })
  }

  // This callback will be called by SubjectList when user clicks view outcome comments
  const handleViewOutcomeComments = async (subjectItem: Subject) => {
    setOutcomeCommentsModal({
      isOpen: true,
      subjectItem,
    })
    // Load outcome comments for this subject
    await loadOutcomeComments(subjectItem.id)
  }

  const handleOutcomeCommentsClose = () => {
    setOutcomeCommentsModal({ isOpen: false })
    // Clear any error state when closing modal
    clearOutcomeCommentsError()
  }

  // Real API handler for creating outcome comments
  const handleCreateOutcomeComment = async (request: CreateOutcomeCommentRequest) => {
    await createComment(request)
  }

  // Real API handler for updating outcome comments
  const handleUpdateOutcomeComment = async (id: number, request: UpdateOutcomeCommentRequest) => {
    await updateComment(id, request)
  }

  // Real API handler for deleting outcome comments
  const handleDeleteOutcomeComment = async (id: number) => {
    await deleteComment(id)
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
                onDelete={handleDeleteRequest}
                onViewOutcomeComments={handleViewOutcomeComments}
              />
            )}
      </main>

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete Subject"
        message={`Are you sure you want to delete "${deleteConfirm.subjectName || 'this subject'}"? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        variant="danger"
      />

      <OutcomeCommentsModal
        isOpen={outcomeCommentsModal.isOpen}
        classData={outcomeCommentsModal.subjectItem
          ? { ...outcomeCommentsModal.subjectItem, year: new Date().getFullYear() }
          : { id: 0, name: '', year: 2024, createdAt: '', updatedAt: '' }}
        outcomeComments={outcomeComments}
        onCreateComment={handleCreateOutcomeComment}
        onUpdateComment={handleUpdateOutcomeComment}
        onDeleteComment={handleDeleteOutcomeComment}
        loading={outcomeCommentsLoading}
        error={outcomeCommentsError}
        onClose={handleOutcomeCommentsClose}
      />
    </div>
  )
}

export default App
