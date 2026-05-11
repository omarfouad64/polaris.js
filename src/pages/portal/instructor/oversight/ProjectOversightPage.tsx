import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useGlobalContext } from '../../../../globalContext'
import useStudentProjects, { type ProjectTask } from '../../student/projects/scripts/useStudentProjects'
import { useInstructorFeedback } from '../../../../hooks/useInstructorFeedback'
import useNotifications from '../../../../hooks/useNotifications'
import Button from '../../../../components/Button'
import FeedbackDialog from '../../../../components/FeedbackDialog'
import ConfirmDialog from '../../../../components/ConfirmDialog'
import ProjectTaskSection from '../../shared/projects/components/ProjectTaskSection'
import type { RootState } from '../../../../store'

/** Inline style for a filled Material Symbol star. */
const FILLED_STAR_STYLE: React.CSSProperties = { fontVariationSettings: "'FILL' 1" }

/**
 * ProjectOversightPage — main dashboard for instructors to review and evaluate projects.
 * Lists projects where the instructor is assigned as a reviewer/collaborator.
 */
export default function ProjectOversightPage() {
  const { user } = useGlobalContext()
  const navigate = useNavigate()
  const { projects } = useStudentProjects()
  const allCollaborators = useSelector((state: RootState) => state.database.projectCollaborators)

  const assignedProjects = useMemo(() => {
    return projects.filter(p =>
      p.course === 'course-001' || p.course === 'course-002' || p.id === 'proj-001'
    )
  }, [projects])

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)

  const selectedProject = useMemo(() =>
    assignedProjects.find(p => p.id === selectedProjectId),
    [assignedProjects, selectedProjectId]
  )

  const selectedProjectCollaborators = useMemo(() => {
    if (!selectedProject) return []
    return allCollaborators
      .filter(c => (c as any).projectId === selectedProject.id && c.invitationStatus === 'accepted')
      .map(c => (c as any).email)
  }, [selectedProject, allCollaborators])

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-jakarta font-bold text-on-surface mb-2">
          Project Oversight
        </h1>
        <p className="text-body-md text-on-surface-variant">
          Review and evaluate projects assigned to you for oversight and grading.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Project List */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-lg font-jakarta font-bold text-on-surface px-2">
            Assigned Projects ({assignedProjects.length})
          </h3>
          <div className="space-y-3">
            {assignedProjects.map(project => (
              <button
                key={project.id}
                onClick={() => setSelectedProjectId(project.id)}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 ${
                  selectedProjectId === project.id
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'border-surface-container-high bg-surface-container-lowest hover:border-primary/30'
                }`}
              >
                <p className="font-jakarta font-bold text-on-surface truncate">{project.title}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-[10px] font-bold uppercase">
                    {project.course}
                  </span>
                  <span className="text-[10px] text-on-surface-variant">
                    Updated {new Date(project.updatedDate).toLocaleDateString()}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Evaluation Area */}
        <div className="lg:col-span-2">
          {selectedProject ? (
            <div className="bg-surface-container-lowest rounded-3xl border border-surface-container-high shadow-sm overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
              {/* Project Header */}
              <div className="p-8 border-b border-surface-container-high bg-surface-container-low/20">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h2 className="text-2xl font-jakarta font-bold text-on-surface mb-2">{selectedProject.title}</h2>
                    <div className="flex flex-wrap gap-3">
                      {selectedProject.languages.map(lang => (
                        <span key={lang} className="text-xs font-jakarta font-semibold bg-surface-container-high px-2 py-1 rounded-lg text-on-surface-variant">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => navigate(`/portal/instructor/projects/${selectedProject.id}/view`)}>
                    View Full Details
                  </Button>
                </div>
              </div>

              {/* Evaluation Components */}
              <div className="p-8 space-y-10">
                <ProjectEvaluationSection
                  projectId={selectedProject.id}
                  projectTitle={selectedProject.title}
                  tasks={selectedProject.tasks || []}
                  thesisDrafts={selectedProject.thesisDrafts || []}
                  instructorId={user?.username ?? 'instructor@guc.edu.eg'}
                  instructorName={user?.username ?? 'Dr. Fatima Al-Mansouri'}
                  projectOwnerId={selectedProject.ownerId}
                  projectCollaborators={selectedProjectCollaborators}
                />
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-surface-container-lowest rounded-3xl border-2 border-dashed border-outline-variant/30 text-on-surface-variant">
              <span className="material-symbols-outlined text-[64px] mb-4 opacity-20">inventory_2</span>
              <p className="font-lexend font-medium">Select a project from the list to begin evaluation.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Star component — renders a single star icon, filled or outline.
// ─────────────────────────────────────────────────────────────────────────────
function Star({ filled, size = 48 }: { filled: boolean; size?: number }) {
  return (
    <span
      className="material-symbols-outlined text-secondary transition-colors duration-150"
      style={{
        fontSize: size,
        color: filled ? undefined : 'var(--color-outline-variant)',
        fontVariationSettings: filled ? "'FILL' 1" : "'FILL' 0",
      }}
    >
      star
    </span>
  )
}

const ratingLabel = (v: number) =>
  v === 5 ? 'Excellent!' : v === 4 ? 'Very Good' : v === 3 ? 'Good' : v === 2 ? 'Fair' : 'Needs Improvement'

/**
  * ProjectEvaluationSection — Handles rating and feedback for a specific project.
  * One rating + one feedback per instructor per project.
  */
 function ProjectEvaluationSection({ projectId, projectTitle, tasks, thesisDrafts, instructorId, instructorName, projectOwnerId, projectCollaborators }: {
  projectId: string
  projectTitle: string
  tasks: ProjectTask[]
  thesisDrafts: any[]
  instructorId: string
  instructorName: string
  projectOwnerId: string
  projectCollaborators: string[]
}) {
  const {
    projectFeedback,
    addProjectFeedback,
    editProjectFeedback,
    removeProjectFeedback,
    rateProject,
    getInstructorRating,
    removeProjectRating,
  } = useInstructorFeedback(projectId)

  const { addNotification } = useNotifications()

  const notificationRecipients = useMemo(() => {
    const recipients = new Set<string>([projectOwnerId])
    projectCollaborators.forEach(c => { if (c !== instructorId) recipients.add(c) })
    return Array.from(recipients)
  }, [projectOwnerId, projectCollaborators, instructorId])

  function sendProjectNotification(title: string, body: string, recipientId: string) {
    addNotification({
      type: 'feedback',
      title,
      body,
      recipientId,
    })
  }

  // ── Rating state ──────────────────────────────────────────────────────────
  const myRating = getInstructorRating(instructorId)
  const [ratingValue, setRatingValue] = useState(0)
  const [ratingHover, setRatingHover] = useState(0)
  const [ratingComment, setRatingComment] = useState('')
  const [isEditingRating, setIsEditingRating] = useState(false)
  const [confirmDeleteRating, setConfirmDeleteRating] = useState(false)

  // ── Project feedback state ─────────────────────────────────────────────────
  const myFeedback = projectFeedback.find(fb => fb.instructorId === instructorId)
  const [feedbackText, setFeedbackText] = useState('')
  const [feedbackType, setFeedbackType] = useState<'general' | 'thesis_draft'>('general')
  const [isEditingFeedback, setIsEditingFeedback] = useState(false)
  const [editingText, setEditingText] = useState('')
  const [confirmDeleteFeedback, setConfirmDeleteFeedback] = useState(false)

  // ── Success dialog ────────────────────────────────────────────────────────
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  // ── Rating handlers ───────────────────────────────────────────────────────
  const handleSubmitRating = () => {
    if (ratingValue === 0) return
    rateProject(instructorId, instructorName, ratingValue, ratingComment)
    const notificationBody = `${instructorName} rated your project "${projectTitle}" ${ratingValue}/5`
    notificationRecipients.forEach(r => sendProjectNotification('Project Rated', notificationBody, r))
    setSuccessMessage(`Project rated ${ratingValue}/5 stars successfully.`)
    setShowSuccessDialog(true)
    setRatingValue(0)
    setRatingComment('')
    setIsEditingRating(false)
  }

  const handleStartEditRating = () => {
    if (myRating) {
      setRatingValue(myRating.rating)
      setRatingComment(myRating.comment ?? '')
    }
    setIsEditingRating(true)
  }

  const handleCancelEditRating = () => {
    setRatingValue(0)
    setRatingComment('')
    setIsEditingRating(false)
  }

  // ── Project feedback handlers ─────────────────────────────────────────────
  const handleAddFeedback = () => {
    if (!feedbackText.trim()) return
    addProjectFeedback(instructorId, instructorName, feedbackText.trim(), feedbackType)
    const notificationBody = `${instructorName} left feedback on your project "${projectTitle}"`
    notificationRecipients.forEach(r => sendProjectNotification('New Project Feedback', notificationBody, r))
    setFeedbackText('')
    setSuccessMessage('Project feedback has been posted successfully.')
    setShowSuccessDialog(true)
  }

  const handleSaveEditFeedback = () => {
    if (myFeedback && editingText.trim()) {
      editProjectFeedback(myFeedback.id, editingText.trim())
      setIsEditingFeedback(false)
      setSuccessMessage('Feedback updated successfully.')
      setShowSuccessDialog(true)
    }
  }

  // The star value to display (hover takes priority, then selected)
  const displayStar = ratingHover || ratingValue

  return (
    <div className="space-y-12">

      {/* ── Rating Section ──────────────────────────────────────────────────── */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
            <span className="material-symbols-outlined" style={FILLED_STAR_STYLE}>star</span>
          </span>
          <h3 className="text-xl font-jakarta font-bold text-on-surface">Project Rating</h3>
        </div>

        <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/30">
          {myRating && !isEditingRating ? (
            /* ── Existing rating: show stars + Edit / Delete ── */
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <p className="text-xs font-lexend text-on-surface-variant uppercase tracking-wider">Your current rating</p>
                <div className="flex gap-1 items-center">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star key={star} filled={star <= myRating.rating} size={36} />
                  ))}
                  <span className="ml-2 text-sm font-jakarta font-bold text-secondary">{myRating.rating}/5</span>
                </div>
                <p className="text-sm font-jakarta font-semibold text-secondary">{ratingLabel(myRating.rating)}</p>
                {myRating.comment && (
                  <p className="text-sm font-lexend text-on-surface-variant italic">"{myRating.comment}"</p>
                )}
              </div>
              <div className="flex flex-col gap-2 flex-shrink-0">
                <Button variant="outline" size="sm" onClick={handleStartEditRating} className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">edit</span>
                  Edit
                </Button>
                <button
                  onClick={() => setConfirmDeleteRating(true)}
                  className="inline-flex items-center justify-center gap-1.5 h-8 px-3 text-sm rounded-lg font-jakarta font-semibold text-error hover:bg-error/10 transition-all duration-200"
                >
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                  Delete
                </button>
              </div>
            </div>
          ) : (
            /* ── Add / Edit rating form ── */
            <div className="space-y-5">
              <p className="text-sm font-lexend text-on-surface-variant text-center">
                {isEditingRating ? 'Update your rating for this project' : 'Rate the overall quality and implementation of this project'}
              </p>

              {/* Star picker */}
              <div className="flex flex-col items-center gap-3">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setRatingHover(star)}
                      onMouseLeave={() => setRatingHover(0)}
                      onClick={() => setRatingValue(star)}
                      className="transition-transform duration-150 hover:scale-110 active:scale-95 focus:outline-none"
                      aria-label={`Rate ${star} out of 5`}
                    >
                      <Star filled={displayStar >= star} size={44} />
                    </button>
                  ))}
                </div>
                {ratingValue > 0 && (
                  <p className="text-sm font-jakarta font-bold text-secondary animate-in fade-in duration-150">
                    {ratingLabel(ratingValue)}
                  </p>
                )}
              </div>

              {/* Optional comment */}
              <textarea
                value={ratingComment}
                onChange={(e) => setRatingComment(e.target.value)}
                placeholder="Add a comment to your rating (optional)..."
                className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4 text-sm font-lexend focus:outline-none focus:ring-2 focus:ring-secondary/20 resize-none"
                rows={2}
              />

              {/* Actions */}
              <div className="flex gap-3">
                {isEditingRating && (
                  <Button variant="outline" className="flex-1" onClick={handleCancelEditRating}>
                    Cancel
                  </Button>
                )}
                <Button
                  variant="primary"
                  className={`!bg-secondary hover:!bg-secondary/90 !text-on-secondary ${isEditingRating ? 'flex-1' : 'w-full'}`}
                  disabled={ratingValue === 0}
                  onClick={handleSubmitRating}
                >
                  {isEditingRating ? 'Update Rating' : 'Submit Rating'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Thesis Drafts Section (Req 24) ─────────────────────────────────── */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined">history_edu</span>
          </span>
          <h3 className="text-xl font-jakarta font-bold text-on-surface">Thesis Drafts</h3>
        </div>

        {(() => {
          const finalDraft = thesisDrafts.find(d => d.isFinal)
          // Instructors see only final if it exists, otherwise see all
          const visibleDrafts = finalDraft ? [finalDraft] : thesisDrafts

          if (visibleDrafts.length === 0) {
            return (
              <div className="bg-surface-container-low rounded-2xl p-8 text-center border border-dashed border-outline-variant/30">
                <p className="text-sm font-lexend text-on-surface-variant">No drafts uploaded yet.</p>
              </div>
            )
          }

          return (
            <div className="bg-surface-container-low rounded-2xl border border-outline-variant/30 divide-y divide-outline-variant/20 overflow-hidden">
              {visibleDrafts.map(draft => (
                <div key={draft.id} className="p-4 flex items-center justify-between hover:bg-surface-container transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      draft.isFinal ? 'bg-success text-on-success' : 'bg-surface-container-highest text-on-surface-variant'
                    }`}>
                      <span className="material-symbols-outlined text-[20px]">
                        {draft.isFinal ? 'verified' : 'draft'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-jakarta font-bold text-on-surface">{draft.name}</p>
                      <p className="text-[10px] font-lexend text-on-surface-variant">Added {new Date(draft.uploadDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {draft.isFinal && (
                      <span className="px-2 py-0.5 bg-success/10 text-success text-[9px] font-bold rounded-full border border-success/20">
                        FINAL
                      </span>
                    )}
                    <button 
                      className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors"
                      onClick={() => {
                        addNotification({
                          type: 'admin',
                          title: 'Download Started',
                          body: `Downloading ${draft.name}...`
                        })
                        const link = document.createElement('a')
                        link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent('Mock content for ' + draft.name)
                        link.download = draft.name + '.txt'
                        link.click()
                      }}
                    >
                      <span className="material-symbols-outlined text-[20px]">download</span>
                    </button>
                  </div>
                </div>
              ))}
              {finalDraft && thesisDrafts.length > 1 && (
                <div className="p-3 bg-surface-container-lowest/50 text-center">
                  <p className="text-[10px] font-lexend text-on-surface-variant italic opacity-60 flex items-center justify-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">lock</span>
                    Non-final drafts are now private and hidden from oversight.
                  </p>
                </div>
              )}
            </div>
          )
        })()}
      </section>

      {/* ── Task Feedback Section ────────────────────────────────────────────── */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-tertiary/10 text-tertiary flex items-center justify-center">
            <span className="material-symbols-outlined">assignment</span>
          </span>
          <h3 className="text-xl font-jakarta font-bold text-on-surface">Task-Specific Feedback</h3>
        </div>
        <ProjectTaskSection
          projectId={projectId}
          tasks={tasks}
          currentUserId={instructorId}
          readOnly={false}
        />
      </section>

      {/* ── Project Feedback Section ─────────────────────────────────────────── */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined">rate_review</span>
          </span>
          <h3 className="text-xl font-jakarta font-bold text-on-surface">Project Feedback</h3>
        </div>

        {myFeedback ? (
          /* ── Already posted: show feedback with Edit / Delete only ── */
          <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/30">
            {isEditingFeedback ? (
              <div className="space-y-4">
                <p className="text-sm font-jakarta font-semibold text-on-surface">Edit your feedback</p>
                <textarea
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4 text-sm font-lexend focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  rows={5}
                  autoFocus
                />
                <div className="flex justify-end gap-3">
                  <Button variant="outline" size="sm" onClick={() => setIsEditingFeedback(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSaveEditFeedback} disabled={!editingText.trim()}>
                    Save Changes
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-jakarta font-bold px-2 py-0.5 rounded-full uppercase tracking-widest ${
                      myFeedback.feedbackType === 'thesis_draft' ? 'bg-tertiary/10 text-tertiary' : 'bg-primary/10 text-primary'
                    }`}>
                      {myFeedback.feedbackType === 'thesis_draft' ? 'Thesis Draft' : 'General'}
                    </span>
                    <span className="text-xs font-lexend text-on-surface-variant">
                      {new Date(myFeedback.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => { setEditingText(myFeedback.comment); setIsEditingFeedback(true) }}
                      className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors"
                      aria-label="Edit feedback"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button
                      onClick={() => setConfirmDeleteFeedback(true)}
                      className="p-1.5 rounded-lg hover:bg-error/10 text-on-surface-variant hover:text-error transition-colors"
                      aria-label="Delete feedback"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
                <p className="text-sm font-lexend text-on-surface leading-relaxed">{myFeedback.comment}</p>
              </div>
            )}
          </div>
        ) : (
          /* ── No feedback yet: show the post form ── */
          <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/30 space-y-4">
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={feedbackType === 'general'}
                  onChange={() => setFeedbackType('general')}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-sm font-jakarta font-semibold text-on-surface">General</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={feedbackType === 'thesis_draft'}
                  onChange={() => setFeedbackType('thesis_draft')}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-sm font-jakarta font-semibold text-on-surface">Thesis Draft</span>
              </label>
            </div>
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder={`Write your ${feedbackType === 'general' ? 'general' : 'thesis draft'} feedback...`}
              className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4 text-sm font-lexend focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              rows={4}
            />
            <div className="flex justify-end">
              <Button onClick={handleAddFeedback} disabled={!feedbackText.trim()}>
                Post Feedback
              </Button>
            </div>
          </div>
        )}
      </section>

      {/* ── Dialogs ─────────────────────────────────────────────────────────── */}
      <FeedbackDialog
        isOpen={showSuccessDialog}
        title="Success"
        message={successMessage}
        actionLabel="OK"
        onClose={() => setShowSuccessDialog(false)}
      />

      <ConfirmDialog
        isOpen={confirmDeleteRating}
        title="Delete Rating"
        message="Are you sure you want to delete your rating for this project? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Keep Rating"
        variant="danger"
        onConfirm={() => {
          if (myRating) removeProjectRating(myRating.id)
          setConfirmDeleteRating(false)
        }}
        onCancel={() => setConfirmDeleteRating(false)}
      />

      <ConfirmDialog
        isOpen={confirmDeleteFeedback}
        title="Delete Project Feedback"
        message="Are you sure you want to delete your feedback for this project? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Keep Feedback"
        variant="danger"
        onConfirm={() => {
          if (myFeedback) removeProjectFeedback(myFeedback.id)
          setConfirmDeleteFeedback(false)
        }}
        onCancel={() => setConfirmDeleteFeedback(false)}
      />
    </div>
  )
}
