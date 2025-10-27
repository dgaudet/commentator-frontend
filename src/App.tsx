import { useState } from 'react'
import './App.css'
import { SubjectList } from './components/subjects/SubjectList'
import { SubjectForm } from './components/subjects/SubjectForm'
import { ConfirmDialog } from './components/common/ConfirmDialog'
import { OutcomeCommentsModal } from './components/outcomeComments/OutcomeCommentsModal'
import { PersonalizedCommentsModal } from './components/personalizedComments/PersonalizedCommentsModal'
import { useOutcomeComments } from './hooks/useOutcomeComments'
import { usePersonalizedComments } from './hooks/usePersonalizedComments'
import type { Subject } from './types/Subject'
import type {
  CreateOutcomeCommentRequest,
  UpdateOutcomeCommentRequest,
  CreatePersonalizedCommentRequest,
  UpdatePersonalizedCommentRequest,
} from './types'

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

  const [personalizedCommentsModal, setPersonalizedCommentsModal] = useState<{
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

  // Hook for managing personalized comments state and API operations
  const {
    personalizedComments,
    loading: personalizedCommentsLoading,
    error: personalizedCommentsError,
    loadPersonalizedComments,
    createComment: createPersonalizedComment,
    updateComment: updatePersonalizedComment,
    deleteComment: deletePersonalizedComment,
    clearError: clearPersonalizedCommentsError,
  } = usePersonalizedComments()

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

  // This callback will be called by SubjectList when user clicks view personalized comments
  const handleViewPersonalizedComments = async (subjectItem: Subject) => {
    setPersonalizedCommentsModal({
      isOpen: true,
      subjectItem,
    })
    // Load personalized comments for this subject
    await loadPersonalizedComments(subjectItem.id)
  }

  const handlePersonalizedCommentsClose = () => {
    setPersonalizedCommentsModal({ isOpen: false })
    // Clear any error state when closing modal
    clearPersonalizedCommentsError()
  }

  // Real API handler for creating personalized comments
  const handleCreatePersonalizedComment = async (request: CreatePersonalizedCommentRequest) => {
    await createPersonalizedComment(request)
  }

  // Real API handler for updating personalized comments
  const handleUpdatePersonalizedComment = async (id: number, request: UpdatePersonalizedCommentRequest) => {
    await updatePersonalizedComment(id, request)
  }

  // Real API handler for deleting personalized comments
  const handleDeletePersonalizedComment = async (id: number) => {
    await deletePersonalizedComment(id)
  }

  const handleDeleteConfirm = async () => {
    if (deleteConfirm.onConfirm) {
      try {
        await deleteConfirm.onConfirm()
        setDeleteConfirm({ isOpen: false })
      } catch (error) {
        // Error is handled by useSubjects hook in SubjectList
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
                onViewPersonalizedComments={handleViewPersonalizedComments}
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
        entityData={outcomeCommentsModal.subjectItem || { id: 0, name: '', createdAt: '', updatedAt: '' }}
        outcomeComments={outcomeComments}
        onCreateComment={handleCreateOutcomeComment}
        onUpdateComment={handleUpdateOutcomeComment}
        onDeleteComment={handleDeleteOutcomeComment}
        loading={outcomeCommentsLoading}
        error={outcomeCommentsError}
        onClose={handleOutcomeCommentsClose}
      />

      <PersonalizedCommentsModal
        isOpen={personalizedCommentsModal.isOpen}
        entityData={personalizedCommentsModal.subjectItem || { id: 0, name: '', createdAt: '', updatedAt: '' }}
        personalizedComments={personalizedComments}
        onCreateComment={handleCreatePersonalizedComment}
        onUpdateComment={handleUpdatePersonalizedComment}
        onDeleteComment={handleDeletePersonalizedComment}
        loading={personalizedCommentsLoading}
        error={personalizedCommentsError}
        onClose={handlePersonalizedCommentsClose}
      />
    </div>
  )
}

export default App
