import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../../../../globalContext'
import useStudentProjects from '../../student/projects/scripts/useStudentProjects'
import { useInstructorFeedback } from '../../../../hooks/useInstructorFeedback'
import { useProjectInvitations } from '../../../../hooks/useProjectInvitations'
import useNotifications from '../../../../hooks/useNotifications'
import Button from '../../../../components/Button'

/**
 * ProjectOversightPage — main dashboard for instructors to review and evaluate projects.
 * Lists projects where the instructor is assigned as a reviewer/collaborator.
 */
export default function ProjectOversightPage() {
  const { user } = useGlobalContext()
  const navigate = useNavigate()
  const { projects } = useStudentProjects()
  const { addNotification } = useNotifications()
  
  // For demo purposes, we'll filter projects where the instructor is a collaborator
  // In a real app, this would be a backend query for "assigned projects"
  const assignedProjects = useMemo(() => {
    // Mocking assignment: if instructor teaches course-001 or course-002 (Dr. Fatima)
    // or if they are explicitly in the collaborator list.
    return projects.filter(p => 
      p.course === 'course-001' || p.course === 'course-002' || p.id === 'proj-001'
    )
  }, [projects])

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  
  const selectedProject = useMemo(() => 
    assignedProjects.find(p => p.id === selectedProjectId),
    [assignedProjects, selectedProjectId]
  )

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
                  instructorId={user?.username || 'instructor-001'}
                  instructorName={user?.username || 'Dr. Fatima Al-Mansouri'}
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

/**
 * ProjectEvaluationSection — Handles rating and feedback for a specific project.
 */
function ProjectEvaluationSection({ projectId, projectTitle, instructorId, instructorName }: { 
  projectId: string, 
  projectTitle: string,
  instructorId: string, 
  instructorName: string 
}) {
  const { 
    projectFeedback, 
    projectRatings, 
    addProjectFeedback, 
    editProjectFeedback, 
    removeProjectFeedback,
    rateProject 
  } = useInstructorFeedback(projectId)
  
  const { addNotification } = useNotifications()
  
  const [feedbackText, setFeedbackText] = useState('')
  const [feedbackType, setFeedbackType] = useState<'general' | 'thesis_draft'>('general')
  const [ratingValue, setRatingValue] = useState(0)
  const [ratingHover, setRatingHover] = useState(0)
  const [ratingComment, setRatingComment] = useState('')
  const [editingFeedbackId, setEditingFeedbackId] = useState<string | null>(null)
  const [editingText, setEditingText] = useState('')

  const handleAddFeedback = () => {
    if (!feedbackText.trim()) return
    addProjectFeedback(instructorId, instructorName, feedbackText, feedbackType)
    addNotification({
      type: 'feedback',
      title: 'New Project Feedback',
      body: `${instructorName} left feedback on your project "${projectTitle}"`
    })
    setFeedbackText('')
  }

  const handleRate = () => {
    if (ratingValue === 0) return
    rateProject(instructorId, instructorName, ratingValue, ratingComment)
    addNotification({
      type: 'feedback',
      title: 'Project Rated',
      body: `${instructorName} rated your project "${projectTitle}" ${ratingValue}/5`
    })
    setRatingValue(0)
    setRatingComment('')
  }

  return (
    <div className="space-y-12">
      {/* Rating Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center font-bold">
            <span className="material-symbols-outlined">star</span>
          </span>
          <h3 className="text-xl font-jakarta font-bold text-on-surface">Project Rating</h3>
        </div>

        <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/30 space-y-6">
          <div className="flex flex-col items-center gap-4">
            <p className="text-sm font-lexend text-on-surface-variant">Rate the overall quality and implementation of this project</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onMouseEnter={() => setRatingHover(star)}
                  onMouseLeave={() => setRatingHover(0)}
                  onClick={() => setRatingValue(star)}
                  className="text-4xl transition-all duration-200 hover:scale-110"
                >
                  <span className={`material-symbols-outlined text-[48px] ${
                    (ratingHover || ratingValue) >= star ? 'text-secondary fill-1' : 'text-outline-variant'
                  }`}>
                    star
                  </span>
                </button>
              ))}
            </div>
            {ratingValue > 0 && (
              <p className="text-sm font-jakarta font-bold text-secondary">
                {ratingValue === 5 ? 'Excellent!' : ratingValue === 4 ? 'Very Good' : ratingValue === 3 ? 'Good' : ratingValue === 2 ? 'Fair' : 'Needs Improvement'}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <textarea
              value={ratingComment}
              onChange={(e) => setRatingComment(e.target.value)}
              placeholder="Add a comment to your rating (optional)..."
              className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4 text-sm font-lexend focus:outline-none focus:ring-2 focus:ring-secondary/20"
              rows={2}
            />
            <Button 
              variant="primary" 
              className="w-full !bg-secondary hover:!bg-secondary/90 !text-on-secondary"
              disabled={ratingValue === 0}
              onClick={handleRate}
            >
              Submit Rating
            </Button>
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
            <span className="material-symbols-outlined">rate_review</span>
          </span>
          <h3 className="text-xl font-jakarta font-bold text-on-surface">Project Feedback</h3>
        </div>

        <div className="space-y-6">
          {/* Add Feedback */}
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
              className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4 text-sm font-lexend focus:outline-none focus:ring-2 focus:ring-primary/20"
              rows={4}
            />
            <div className="flex justify-end">
              <Button onClick={handleAddFeedback} disabled={!feedbackText.trim()}>
                Post Feedback
              </Button>
            </div>
          </div>

          {/* Feedback List */}
          <div className="space-y-4">
            {projectFeedback.length > 0 ? (
              projectFeedback.map(fb => (
                <div key={fb.id} className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/20 shadow-sm relative group">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-jakarta font-bold px-2 py-0.5 rounded-full uppercase tracking-widest ${
                        fb.feedbackType === 'thesis_draft' ? 'bg-tertiary/10 text-tertiary' : 'bg-primary/10 text-primary'
                      }`}>
                        {fb.feedbackType === 'thesis_draft' ? 'Thesis Draft' : 'General'}
                      </span>
                      <span className="text-xs font-lexend text-on-surface-variant">
                        {new Date(fb.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {fb.instructorId === instructorId && (
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => { setEditingFeedbackId(fb.id); setEditingText(fb.comment); }}
                          className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button 
                          onClick={() => { if(window.confirm('Delete this feedback?')) removeProjectFeedback(fb.id) }}
                          className="p-1.5 rounded-lg hover:bg-error/10 text-error"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {editingFeedbackId === fb.id ? (
                    <div className="space-y-3">
                      <textarea
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl p-3 text-sm font-lexend focus:outline-none"
                        rows={3}
                      />
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => setEditingFeedbackId(null)}>Cancel</Button>
                        <Button size="sm" onClick={() => { editProjectFeedback(fb.id, editingText); setEditingFeedbackId(null); }}>Save</Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm font-lexend text-on-surface leading-relaxed">{fb.comment}</p>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-10 opacity-50">
                <p className="text-sm font-lexend text-on-surface-variant italic">No feedback comments added yet.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
