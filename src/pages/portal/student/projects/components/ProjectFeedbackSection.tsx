import { useState } from 'react'
import { useInstructorFeedback } from '../../../../../hooks/useInstructorFeedback'

interface ProjectFeedbackSectionProps {
  projectId: string
}

/**
 * ProjectFeedbackSection – displays all feedback on project.
 * Shows task feedback, project feedback, and ratings.
 * Allows instructors to add/edit feedback.
 */
export default function ProjectFeedbackSection({
  projectId
}: ProjectFeedbackSectionProps) {
  const [activeTab, setActiveTab] = useState<'feedback' | 'rating'>('feedback')

  const { taskFeedback, projectFeedback, projectRatings, averageRating } =
    useInstructorFeedback(projectId)

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h2 className="text-2xl font-jakarta font-bold text-on-surface mb-2">
          Instructor Feedback
        </h2>
        <p className="text-body-md text-on-surface-variant">
          Comments and ratings from course instructors
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-surface-container-high flex gap-2">
        <button
          onClick={() => setActiveTab('feedback')}
          className={`px-4 py-3 font-jakarta font-semibold text-sm transition-all border-b-2 ${
            activeTab === 'feedback'
              ? 'border-primary text-primary'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Feedback & Comments
        </button>
        <button
          onClick={() => setActiveTab('rating')}
          className={`px-4 py-3 font-jakarta font-semibold text-sm transition-all border-b-2 ${
            activeTab === 'rating'
              ? 'border-primary text-primary'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Ratings
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'feedback' && (
        <div className="space-y-6">
          {/* Project-level Feedback */}
          <div>
            <h3 className="text-lg font-jakarta font-bold text-on-surface mb-4">
              General Project Feedback
            </h3>

            {projectFeedback.length > 0 ? (
              <div className="space-y-4">
                {projectFeedback.map(feedback => (
                  <div
                    key={feedback.id}
                    className="bg-surface-container-lowest rounded-xl border border-surface-container-high p-6"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <p className="text-sm font-jakarta font-semibold text-on-surface-variant mb-1">
                          From: {feedback.instructorName}
                        </p>
                        <p className="text-xs text-on-surface-variant">
                          {new Date(feedback.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="text-xs font-jakarta font-semibold px-2 py-1 rounded-full bg-primary-container text-on-primary-container">
                        General
                      </span>
                    </div>
                    <p className="text-body-md text-on-surface">{feedback.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-surface-container rounded-xl p-8 text-center">
                <p className="text-body-md text-on-surface-variant">
                  No general feedback yet. Instructors will add feedback as they review your project.
                </p>
              </div>
            )}
          </div>

          {/* Task Feedback */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-jakarta font-bold text-on-surface">
                Task-Specific Feedback
              </h3>
            </div>

            {taskFeedback.length > 0 ? (
              <div className="space-y-4">
                {taskFeedback.map(feedback => (
                  <div
                    key={feedback.id}
                    className="bg-surface-container-lowest rounded-xl border border-surface-container-high p-6"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <p className="text-sm font-jakarta font-semibold text-on-surface-variant mb-1">
                          From: {feedback.instructorName}
                        </p>
                        <p className="text-xs text-on-surface-variant">
                          {new Date(feedback.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="text-xs font-jakarta font-semibold px-2 py-1 rounded-full bg-secondary-container text-on-secondary-container">
                        Task Feedback
                      </span>
                    </div>
                    <p className="text-body-md text-on-surface">{feedback.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-surface-container rounded-xl p-8 text-center">
                <p className="text-body-md text-on-surface-variant">
                  No task feedback yet.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Ratings Tab */}
      {activeTab === 'rating' && (
        <div className="space-y-6">
          {/* Overall Rating */}
          <div className="bg-surface-container-lowest rounded-xl border border-surface-container-high p-6">
            <p className="text-sm font-jakarta font-semibold text-on-surface-variant mb-2">
              Overall Project Rating
            </p>
            <div className="flex items-center gap-3">
              <span className="text-5xl font-jakarta font-bold text-primary">
                {averageRating}
              </span>
              <div>
                <p className="text-2xl">⭐</p>
                <p className="text-xs text-on-surface-variant">
                  ({projectRatings.length} rating{projectRatings.length !== 1 ? 's' : ''})
                </p>
              </div>
            </div>
          </div>

          {/* Individual Ratings */}
          {projectRatings.length > 0 && (
            <div>
              <h3 className="text-lg font-jakarta font-bold text-on-surface mb-4">
                Individual Ratings
              </h3>
              <div className="space-y-4">
                {projectRatings.map(rating => (
                  <div
                    key={rating.id}
                    className="bg-surface-container-lowest rounded-xl border border-surface-container-high p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-sm font-jakarta font-semibold text-on-surface mb-1">
                          {rating.instructorName}
                        </p>
                        <p className="text-xs text-on-surface-variant mb-3">
                          {new Date(rating.createdAt).toLocaleDateString()}
                        </p>
                        {rating.comment && (
                          <p className="text-body-sm text-on-surface">{rating.comment}</p>
                        )}
                      </div>
                      <div className="text-4xl shrink-0">⭐</div>
                      <span className="text-2xl font-jakarta font-bold text-primary shrink-0">
                        {rating.rating}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Info Box */}
      <div className="bg-primary-container/20 rounded-xl p-6 border border-primary/10">
        <h3 className="font-jakarta font-semibold text-on-surface mb-2">
          💡 About Instructor Feedback
        </h3>
        <ul className="text-body-sm text-on-surface-variant space-y-2">
          <li>• Instructors provide feedback on your project tasks and overall work</li>
          <li>• Ratings help you understand project quality from an instructor's perspective</li>
          <li>• You will receive notifications when new feedback is added</li>
          <li>• Only you and course instructors can see this feedback</li>
        </ul>
      </div>
    </div>
  )
}