import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import useStudentProjects from '../../student/projects/scripts/useStudentProjects'
import useCourses from '../../../../hooks/useCourses'
import { useGlobalContext } from '../../../../globalContext'
import useNotifications from '../../../../hooks/useNotifications'
import useFavorites from '../../../../hooks/useFavorites'
import useMessages from '../../../../hooks/useMessages'
import { useInstructorFeedback } from '../../../../hooks/useInstructorFeedback'
import Button from '../../../../components/Button'
import FeedbackDialog from '../../../../components/FeedbackDialog'
import ProjectTaskManager from '../../student/projects/components/ProjectTaskManager'
import ProjectTaskSection from './components/ProjectTaskSection'

/**
 * FlagModal — handles the reasoning for flagging a project.
 */
function FlagModal({ isOpen, onClose, onConfirm }: { isOpen: boolean, onClose: () => void, onConfirm: (reason: string) => void }) {
  const [reason, setReason] = useState('')
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest rounded-3xl p-8 w-full max-w-md border border-outline-variant/30 shadow-modal animate-in zoom-in-95 duration-200">
        <h3 className="text-2xl font-jakarta font-bold text-on-surface mb-2">Flag Project</h3>
        <p className="font-lexend text-on-surface-variant text-sm mb-6">Please provide a clear reason for flagging this project. This will be visible to the student.</p>

        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g., Potential plagiarism, inappropriate content..."
          className="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl p-4 font-lexend text-sm text-on-surface min-h-[120px] focus:border-error focus:ring-4 focus:ring-error/10 outline-none transition-all"
        />

        <div className="flex gap-3 mt-8">
          <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button
            variant="primary"
            className="flex-1 !bg-error hover:!bg-error-container !text-on-error"
            disabled={!reason.trim()}
            onClick={() => onConfirm(reason)}
          >
            Confirm Flag
          </Button>
        </div>
      </div>
    </div>
  )
}
function AppealModal({ isOpen, onClose, onConfirm }: { isOpen: boolean, onClose: () => void, onConfirm: (msg: string) => void }) {
  const [msg, setMsg] = useState('')
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest rounded-3xl p-8 w-full max-w-md border border-outline-variant/30 shadow-modal animate-in zoom-in-95 duration-200">
        <h3 className="text-2xl font-jakarta font-bold text-on-surface mb-2">Appeal Flagging</h3>
        <p className="font-lexend text-on-surface-variant text-sm mb-6">Explain why this project should be unflagged. An administrator will review your appeal.</p>

        <textarea
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Provide your explanation here..."
          className="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl p-4 font-lexend text-sm text-on-surface min-h-[120px] focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
        />

        <div className="flex gap-3 mt-8">
          <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button
            variant="primary"
            className="flex-1"
            disabled={!msg.trim()}
            onClick={() => onConfirm(msg)}
          >
            Submit Appeal
          </Button>
        </div>
      </div>
    </div>
  )
}

/**
 * ProjectDetailsPage — displays full project details, report, and media.
 * Covers Req 46 (Select and view project with details).
 */
export default function ProjectDetailsPage(): React.JSX.Element {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useGlobalContext()
  const { getProjectById, updateProject } = useStudentProjects()
  const { getCourseById } = useCourses()
  const { addNotification } = useNotifications()
  const { isFavorite, addFavorite, removeFavorite } = useFavorites()
  const { startConversation } = useMessages()

  const [project, setProject] = useState<any>(null)
  const [isFlagModalOpen, setIsFlagModalOpen] = useState(false)
  const [isAppealModalOpen, setIsAppealModalOpen] = useState(false)
  const [showAppealFeedback, setShowAppealFeedback] = useState(false)

  // Instructor feedback state
  const projectId = id || ''
  const {
    taskFeedback, projectFeedback, projectRatings, averageRating,
    addProjectFeedback, editProjectFeedback, removeProjectFeedback,
    rateProject
  } = useInstructorFeedback(projectId)
  const isInstructor = user?.role === 'Course Instructor'
  const [showFeedbackForm, setShowFeedbackForm] = useState(false)
  const [feedbackText, setFeedbackText] = useState('')
  const [feedbackType, setFeedbackType] = useState<'general' | 'thesis_draft'>('general')
  const [editingFeedbackId, setEditingFeedbackId] = useState<string | null>(null)
  const [editingFeedbackText, setEditingFeedbackText] = useState('')
  const [showRatingForm, setShowRatingForm] = useState(false)
  const [ratingValue, setRatingValue] = useState<number>(0)
  const [ratingHover, setRatingHover] = useState<number>(0)
  const [ratingComment, setRatingComment] = useState('')

  const handleToggleFavorite = () => {
    if (!project) return
    if (isFavorite(project.id)) {
      removeFavorite(project.id)
    } else {
      addFavorite({
        id: project.id,
        type: 'project',
        title: project.title,
        subtitle: `${getCourseById(project.course)?.name ?? 'Independent'} • John Doe`,
        tags: project.languages,
        rating: 4.8
      })
    }
  }

  const handleStartChat = (id: string, name: string, avatar: string) => {
    startConversation(id, name, avatar)
    const role = user?.role === 'Course Instructor' ? 'instructor' : user?.role === 'Administrator' ? 'administrator' : user?.role === 'Employer' ? 'employer' : 'student'
    navigate(`/portal/${role}/communications`)
  }

  useEffect(() => {
    if (id) {
      const found = getProjectById(id)
      if (found) setProject(found)
    }
  }, [id, getProjectById])

  const handleFlag = (reason: string) => {
    if (!id) return
    updateProject(id, { status: 'flagged', flagReason: reason })
    setProject((prev: any) => ({ ...prev, status: 'flagged', flagReason: reason }))
    addNotification({
      title: 'Project Flagged',
      body: `Your project "${project.title}" has been flagged: ${reason}`,
      type: 'flag'
    })
    setIsFlagModalOpen(false)
  }

  const handleAppeal = (message: string) => {
    // In a real app, this would send data to the useModeration hook/API
    addNotification({
      title: 'Appeal Submitted',
      body: `Your appeal for "${project.title}" has been sent to the administrators. Message: ${message}`,
      type: 'admin'
    })
    setIsAppealModalOpen(false)
    setShowAppealFeedback(true)
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="material-symbols-outlined text-6xl text-outline/30 mb-4">search_off</span>
        <h2 className="text-2xl font-jakarta font-bold text-on-surface">Project Not Found</h2>
        <p className="font-lexend text-on-surface-variant mt-2 mb-8">The project you are looking for does not exist or is private.</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    )
  }

  const course = getCourseById(project.course)

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-jakarta font-bold text-primary hover:underline"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Back to Search
          </button>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-jakarta font-bold text-on-surface tracking-tight">{project.title}</h1>
              {project.status === 'flagged' && (
                <span className="px-3 py-1 bg-error/10 text-error rounded-lg text-xs font-jakarta font-bold border border-error/20 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">flag</span>
                  Flagged
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-jakarta font-bold border border-primary/20">
                {course?.code ?? 'General'}
              </span>
              <span className="text-sm font-lexend text-on-surface-variant">
                {course?.name ?? 'Independent Project'}
              </span>
              <span className="w-1 h-1 rounded-full bg-outline/40" />
              <span className="text-sm font-lexend text-on-surface-variant">
                Published {new Date(project.createdDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          {(user?.role === 'Administrator' || user?.role === 'Course Instructor') && project.status !== 'flagged' && (
            <button
              onClick={() => setIsFlagModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-error/10 text-error rounded-xl font-jakarta font-bold text-sm hover:bg-error/20 transition-all border border-error/20"
            >
              <span className="material-symbols-outlined text-[20px]">flag</span>
              Flag Project
            </button>
          )}
          {user?.role === 'Student' && project.status === 'flagged' && (
            <button
              onClick={() => setIsAppealModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-error text-on-error rounded-xl font-jakarta font-bold text-sm hover:shadow-raised transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">campaign</span>
              Appeal Flagging
            </button>
          )}
          <AppealModal
            isOpen={isAppealModalOpen}
            onClose={() => setIsAppealModalOpen(false)}
            onConfirm={handleAppeal}
          />
          <FeedbackDialog
            isOpen={showAppealFeedback}
            title="Appeal Submitted"
            message="Your appeal has been submitted and will be reviewed by an administrator within 48 hours."
            actionLabel="OK"
            onClose={() => setShowAppealFeedback(false)}
          />
          <button
            onClick={() => {
              const rolePath = user?.role === 'Course Instructor' ? 'instructor' : 'student'
              navigate(`/portal/${rolePath}/projects/${id}/collaboration`)
            }}
            className="flex items-center gap-2 px-6 py-3 bg-surface-container-high text-on-surface hover:bg-surface-container rounded-xl font-jakarta font-bold text-sm transition-all border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-[20px]">group</span>
            View Team
          </button>
          <button
            onClick={handleToggleFavorite}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-jakarta font-bold text-sm transition-all border ${isFavorite(project.id)
              ? 'bg-primary/10 text-primary border-primary/20 shadow-sm'
              : 'bg-surface-container-high text-on-surface hover:bg-surface-container border-outline-variant/30'
              }`}
          >
            <span className={`material-symbols-outlined text-[20px] ${isFavorite(project.id) ? 'fill-1' : ''}`}>
              {isFavorite(project.id) ? 'favorite' : 'favorite'}
            </span>
            {isFavorite(project.id) ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>

      {project.status === 'flagged' && project.flagReason && (
        <div className="p-6 bg-error/5 rounded-3xl border border-error/20 flex items-start gap-4">
          <span className="material-symbols-outlined text-error mt-1">warning</span>
          <div>
            <h4 className="font-jakarta font-bold text-error text-sm uppercase tracking-wider">Reason for Flagging</h4>
            <p className="font-lexend text-on-surface-variant text-sm mt-1">{project.flagReason}</p>
          </div>
        </div>
      )}

      <FlagModal
        isOpen={isFlagModalOpen}
        onClose={() => setIsFlagModalOpen(false)}
        onConfirm={handleFlag}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Demo Media */}
          {project.demoVideoUrl && (
            <div className="aspect-video bg-surface-container-low rounded-3xl overflow-hidden border border-outline-variant/40 shadow-sm relative group">
              <iframe
                src={project.demoVideoUrl.replace('watch?v=', 'embed/')}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          {/* Project Report */}
          <div className="bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/30 shadow-sm">
            <h3 className="text-xl font-jakarta font-bold text-on-surface mb-6 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">description</span>
              Project Overview
            </h3>
            <div className="prose prose-sm max-w-none">
              <p className="font-lexend text-on-surface-variant leading-relaxed whitespace-pre-wrap">
                {project.projectReport}
              </p>
            </div>
          </div>

          {/* Project Tasks (Req 37) */}
          <div className="bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/30 shadow-sm">
            <ProjectTaskManager
              projectId={projectId}
              tasks={project.tasks || []}
              onTasksChange={(newTasks) => {
                updateProject(projectId, { tasks: newTasks })
                setProject((prev: any) => ({ ...prev, tasks: newTasks }))
              }}
              isOwner={user?.username === 'student-001'} // Simplified for demo
              isInstructor={isInstructor}
              currentUserId={user?.username || 'Unknown'}
              userName={user?.username || 'Unknown User'}
            />
          </div>
          {/* Project Tasks (Requirement 33) */}
          <ProjectTaskSection
            projectId={project.id}
            tasks={project.tasks}
            currentUserId={user?.username}
          />
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Stats Card */}
          <div className="bg-primary/5 rounded-3xl p-6 border border-primary/10">
            <h4 className="font-jakarta font-bold text-on-surface text-sm mb-4 uppercase tracking-wider">Project Assets</h4>
            <div className="space-y-4">
              <a
                href={project.githubLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 hover:border-primary/40 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-on-surface-variant">code</span>
                  <span className="text-sm font-jakarta font-bold text-on-surface">Source Code</span>
                </div>
                <span className="material-symbols-outlined text-primary text-[18px] group-hover:translate-x-1 transition-transform">open_in_new</span>
              </a>
              <div className="p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/30">
                <div className="flex items-center gap-3 mb-3">
                  <span className="material-symbols-outlined text-on-surface-variant">terminal</span>
                  <span className="text-sm font-jakarta font-bold text-on-surface">Languages</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.languages.map((lang: string) => (
                    <span key={lang} className="px-2.5 py-1 bg-surface-container rounded-lg text-[11px] font-lexend font-bold text-on-surface-variant border border-outline-variant/20">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Collaborators */}
          <div className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/30 shadow-sm">
            <h4 className="font-jakarta font-bold text-on-surface text-sm mb-4 uppercase tracking-wider">Collaborators</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold">JD</div>
                  <div>
                    <p className="text-sm font-jakarta font-bold text-on-surface">John Doe</p>
                    <p className="text-xs font-lexend text-on-surface-variant">Lead Developer</p>
                  </div>
                </div>
                <button
                  onClick={() => handleStartChat('u-student-001', 'John Doe', 'JD')}
                  className="p-2 rounded-xl hover:bg-primary/10 text-primary transition-colors"
                  title="Message John Doe"
                >
                  <span className="material-symbols-outlined text-[20px]">chat</span>
                </button>
              </div>
              <div className="pt-4 border-t border-outline-variant/20">
                <p className="text-xs font-lexend text-on-surface-variant italic leading-relaxed">
                  "This project represents the core functionality developed during the course."
                </p>
              </div>
            </div>
          </div>

          {/* Evaluation — real average rating */}
          <div className="p-6 bg-secondary/5 rounded-3xl border border-secondary/10">
            <div className="flex items-center gap-3 mb-2 text-secondary">
              <span className="material-symbols-outlined">grade</span>
              <h4 className="font-jakarta font-bold text-sm uppercase tracking-wider">Evaluation</h4>
            </div>
            {averageRating > 0 ? (
              <div className="flex items-center gap-2">
                <span className="text-2xl font-jakarta font-bold text-secondary">{averageRating}</span>
                <span className="text-lg">⭐</span>
                <span className="text-xs font-lexend text-on-surface-variant">({projectRatings.length} rating{projectRatings.length !== 1 ? 's' : ''})</span>
              </div>
            ) : (
              <p className="text-xs font-lexend text-on-surface-variant">No ratings yet.</p>
            )}
            {isInstructor && (
              <button
                onClick={() => setShowRatingForm(!showRatingForm)}
                className="mt-3 w-full px-4 py-2 bg-secondary text-on-secondary rounded-xl font-jakarta font-bold text-sm hover:shadow-raised transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">star</span>
                {showRatingForm ? 'Cancel' : 'Rate Project'}
              </button>
            )}
          </div>

          {/* Rating Form (Instructor Only) */}
          {isInstructor && showRatingForm && (
            <div className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/30 shadow-sm space-y-4">
              <h4 className="font-jakarta font-bold text-on-surface text-sm">Your Rating</h4>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => setRatingValue(star)}
                    onMouseEnter={() => setRatingHover(star)}
                    onMouseLeave={() => setRatingHover(0)}
                    className="text-3xl transition-transform hover:scale-110"
                  >
                    {(ratingHover || ratingValue) >= star ? '⭐' : '☆'}
                  </button>
                ))}
              </div>
              <textarea
                value={ratingComment}
                onChange={e => setRatingComment(e.target.value)}
                placeholder="Optional comment..."
                rows={2}
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl p-3 font-lexend text-sm text-on-surface focus:border-secondary focus:ring-2 focus:ring-secondary/10 outline-none"
              />
              <button
                onClick={() => {
                  if (ratingValue === 0) return
                  rateProject('instructor-001', 'Dr. Fatima Al-Mansouri', ratingValue, ratingComment)
                  addNotification({ type: 'feedback', title: 'Project Rated', body: `Dr. Fatima Al-Mansouri rated your project "${project?.title}" ${ratingValue}/5` })
                  setShowRatingForm(false)
                  setRatingValue(0)
                  setRatingComment('')
                }}
                disabled={ratingValue === 0}
                className={`w-full px-4 py-2 rounded-xl font-jakarta font-bold text-sm transition-all ${ratingValue > 0 ? 'bg-secondary text-on-secondary hover:shadow-raised' : 'bg-surface-container text-on-surface-variant cursor-not-allowed'}`}
              >
                Submit Rating
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Instructor Feedback Section (Req 37, 38, 40) ────────────────── */}
      <div className="bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/30 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-jakarta font-bold text-on-surface flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">rate_review</span>
              Instructor Feedback
            </h3>
            <p className="text-sm font-lexend text-on-surface-variant mt-1">Comments and evaluations from course instructors</p>
          </div>
          {isInstructor && (
            <button
              onClick={() => setShowFeedbackForm(!showFeedbackForm)}
              className="px-5 py-2.5 bg-primary text-on-primary rounded-xl font-jakarta font-bold text-sm hover:shadow-raised transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">add_comment</span>
              {showFeedbackForm ? 'Cancel' : 'Add Feedback'}
            </button>
          )}
        </div>

        {/* Inline Add Feedback Form */}
        {isInstructor && showFeedbackForm && (
          <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10 space-y-4">
            <div className="flex gap-4 mb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={feedbackType === 'general'}
                  onChange={() => setFeedbackType('general')}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-sm font-jakarta font-semibold text-on-surface">General Feedback</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={feedbackType === 'thesis_draft'}
                  onChange={() => setFeedbackType('thesis_draft')}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-sm font-jakarta font-semibold text-on-surface">Thesis Draft Feedback</span>
              </label>
            </div>
            <textarea
              value={feedbackText}
              onChange={e => setFeedbackText(e.target.value)}
              placeholder={feedbackType === 'general' ? "Write your general feedback..." : "Write your feedback on the thesis draft..."}
              rows={4}
              className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4 font-lexend text-sm text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
              autoFocus
            />
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => { setShowFeedbackForm(false); setFeedbackText(''); setFeedbackType('general'); }}>Cancel</Button>
              <Button
                variant="primary"
                disabled={!feedbackText.trim()}
                onClick={() => {
                  addProjectFeedback('instructor-001', 'Dr. Fatima Al-Mansouri', feedbackText.trim(), feedbackType)
                  addNotification({
                    type: 'feedback',
                    title: feedbackType === 'general' ? 'New Project Feedback' : 'New Thesis Feedback',
                    body: `Dr. Fatima Al-Mansouri left ${feedbackType === 'general' ? 'feedback' : 'thesis feedback'} on your project "${project?.title}"`
                  })
                  setFeedbackText('')
                  setFeedbackType('general')
                  setShowFeedbackForm(false)
                }}
              >
                Submit Feedback
              </Button>
            </div>
          </div>
        )}

        {/* Feedback List */}
        {projectFeedback.length > 0 ? (
          <div className="space-y-4">
            {projectFeedback.map(fb => (
              <div key={fb.id} className="bg-surface-container-low/50 rounded-2xl p-5 border border-outline-variant/20">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-jakarta font-bold text-sm">
                      {fb.instructorName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-jakarta font-bold text-on-surface">{fb.instructorName}</p>
                      <p className="text-xs font-lexend text-on-surface-variant">{new Date(fb.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-jakarta font-semibold px-2 py-1 rounded-full bg-primary-container text-on-primary-container">
                      {fb.feedbackType === 'thesis_draft' ? 'Thesis' : 'General'}
                    </span>
                    {isInstructor && fb.instructorId === 'instructor-001' && (
                      <>
                        <button
                          onClick={() => { setEditingFeedbackId(fb.id); setEditingFeedbackText(fb.comment) }}
                          className="p-1.5 rounded-lg hover:bg-surface-container-high text-on-surface-variant transition-colors"
                          title="Edit"
                        >
                          <span className="material-symbols-outlined text-[16px]">edit</span>
                        </button>
                        <button
                          onClick={() => { if (window.confirm('Delete this feedback?')) removeProjectFeedback(fb.id) }}
                          className="p-1.5 rounded-lg hover:bg-error/10 text-error transition-colors"
                          title="Delete"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
                {editingFeedbackId === fb.id ? (
                  <div className="space-y-3">
                    <textarea
                      value={editingFeedbackText}
                      onChange={e => setEditingFeedbackText(e.target.value)}
                      rows={3}
                      className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-3 font-lexend text-sm text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none"
                    />
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => setEditingFeedbackId(null)} className="px-3 py-1.5 text-xs font-jakarta font-semibold text-on-surface-variant hover:bg-surface-container rounded-lg">Cancel</button>
                      <button
                        onClick={() => { editProjectFeedback(fb.id, editingFeedbackText); setEditingFeedbackId(null) }}
                        className="px-3 py-1.5 text-xs font-jakarta font-semibold bg-primary text-on-primary rounded-lg hover:shadow-sm"
                      >Save</button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm font-lexend text-on-surface leading-relaxed">{fb.comment}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-surface-container rounded-2xl p-8 text-center">
            <span className="material-symbols-outlined text-[40px] text-outline/30 mb-2">chat_bubble_outline</span>
            <p className="text-sm font-lexend text-on-surface-variant">No feedback yet. {isInstructor ? 'Be the first to add feedback!' : 'Instructors will add feedback as they review your project.'}</p>
          </div>
        )}

        {/* Ratings List */}
        {projectRatings.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-outline-variant/20">
            <h4 className="font-jakarta font-bold text-on-surface text-sm">All Ratings</h4>
            {projectRatings.map(r => (
              <div key={r.id} className="flex items-center justify-between bg-surface-container-low/50 rounded-xl p-4 border border-outline-variant/20">
                <div>
                  <p className="text-sm font-jakarta font-bold text-on-surface">{r.instructorName}</p>
                  {r.comment && <p className="text-xs font-lexend text-on-surface-variant mt-1">{r.comment}</p>}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-jakarta font-bold text-secondary">{r.rating}</span>
                  <span className="text-lg">⭐</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
