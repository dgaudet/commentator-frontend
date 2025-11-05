import { useState } from 'react'
import './App.css'
import { SubjectList } from './components/subjects/SubjectList'
import { SubjectForm } from './components/subjects/SubjectForm'
import { FinalCommentsModal } from './components/finalComments/FinalCommentsModal'
import { useFinalComments } from './hooks/useFinalComments'
import { saveSelectedSubjectId } from './utils/subjectStorageUtils'
import type { Subject } from './types/Subject'
import type {
  Class,
  CreateFinalCommentRequest,
  UpdateFinalCommentRequest,
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
  const [finalCommentsModal, setFinalCommentsModal] = useState<{
    isOpen: boolean
    classItem?: Class
  }>({ isOpen: false })

  // Hook for managing final comments state and API operations
  const {
    finalComments,
    loading: finalCommentsLoading,
    error: finalCommentsError,
    loadFinalComments,
    createComment: createFinalComment,
    updateComment: updateFinalComment,
    deleteComment: deleteFinalComment,
    clearError: clearFinalCommentsError,
  } = useFinalComments()

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

  // Handler for viewing final comments (separate modal, called from ClassManagementModal)
  const handleViewFinalComments = async (classItem: Class) => {
    setFinalCommentsModal({
      isOpen: true,
      classItem,
    })
    // Load final comments for this class
    await loadFinalComments(classItem.id)
  }

  const handleFinalCommentsClose = () => {
    setFinalCommentsModal({ isOpen: false })
    // Clear any error state when closing modal
    clearFinalCommentsError()
  }

  // Real API handler for creating final comments
  const handleCreateFinalComment = async (request: CreateFinalCommentRequest) => {
    await createFinalComment(request)
  }

  // Real API handler for updating final comments
  const handleUpdateFinalComment = async (id: number, request: UpdateFinalCommentRequest) => {
    await updateFinalComment(id, request)
  }

  // Real API handler for deleting final comments
  const handleDeleteFinalComment = async (id: number) => {
    await deleteFinalComment(id)
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
                onEditSuccess={handleFormSuccess}
                onEditCancel={handleFormCancel}
                onViewFinalComments={handleViewFinalComments}
              />
            )}
      </main>

      {/* Final Comments Modal (separate from subject tabs) */}
      <FinalCommentsModal
        isOpen={finalCommentsModal.isOpen}
        entityData={finalCommentsModal.classItem || { id: 0, name: '', year: 2024, subjectId: 0, createdAt: '', updatedAt: '' }}
        finalComments={finalComments}
        onCreateComment={handleCreateFinalComment}
        onUpdateComment={handleUpdateFinalComment}
        onDeleteComment={handleDeleteFinalComment}
        loading={finalCommentsLoading}
        error={finalCommentsError}
        onClose={handleFinalCommentsClose}
      />
    </div>
  )
}

export default App
