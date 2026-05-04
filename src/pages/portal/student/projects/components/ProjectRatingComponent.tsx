import { useState } from 'react'
import { useInstructorFeedback } from '../../../../../hooks/useInstructorFeedback'

interface ProjectRatingComponentProps {
  projectId: string
  instructorId: string
  instructorName: string
  onRatingSubmitted: () => void
}

/**
 * ProjectRatingComponent – allows instructors to rate the entire project.
 * Displays star rating interface and optional comments.
 */
export default function ProjectRatingComponent({
  projectId,
  instructorId,
  instructorName,
  onRatingSubmitted
}: ProjectRatingComponentProps) {
  const [rating, setRating] = useState<number | null>(null)
  const [hoverRating, setHoverRating] = useState<number | null>(null)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const { rateProject, averageRating } = useInstructorFeedback(projectId)

  // Initialize with existing rating if available
  // const existingRating = getInstructorRating(instructorId)

  const handleSubmitRating = async () => {
    if (rating === null) return

    setIsSubmitting(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))

      rateProject(instructorId, instructorName, rating, comment)
      setSubmitted(true)

      setTimeout(() => {
        setSubmitted(false)
        setRating(null)
        setComment('')
        onRatingSubmitted()
      }, 1500)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-surface-container-high shadow-sm p-6">
      {/* Header */}
      <h3 className="text-lg font-jakarta font-bold text-on-surface mb-4">
        Rate This Project
      </h3>

      {!submitted ? (
        <div className="space-y-4">
          {/* Star Rating Display */}
          <div>
            <p className="text-sm font-jakarta font-semibold text-on-surface-variant mb-3">
              Your Rating
            </p>

            {/* Star Rating Interface */}
            <div className="flex gap-2 mb-4">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(null)}
                  className="text-4xl transition-transform hover:scale-110"
                >
                  {(hoverRating || rating || 0) >= star ? '⭐' : '☆'}
                </button>
              ))}
            </div>

            {/* Rating Text */}
            {(hoverRating || rating) && (
              <p className="text-body-md font-jakarta font-semibold text-on-surface mb-4">
                {(hoverRating || rating) === 1
                  ? 'Poor'
                  : (hoverRating || rating) === 2
                    ? 'Fair'
                    : (hoverRating || rating) === 3
                      ? 'Good'
                      : (hoverRating || rating) === 4
                        ? 'Very Good'
                        : 'Excellent'}
              </p>
            )}
          </div>

          {/* Comment Textarea */}
          <div>
            <label className="block text-sm font-jakarta font-semibold text-on-surface mb-2">
              Optional Comment
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add comments about the project quality, strengths, and areas for improvement..."
              rows={4}
              className="w-full px-4 py-3 border border-outline rounded-lg bg-surface text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
            />
          </div>

          {/* Average Rating Info */}
          {averageRating > 0 && (
            <div className="bg-surface-container rounded-lg p-4">
              <p className="text-sm text-on-surface-variant mb-1">
                <span className="font-jakarta font-semibold">Current Average Rating:</span>
              </p>
              <p className="text-2xl font-jakarta font-bold text-primary">
                {averageRating} ⭐
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmitRating}
            disabled={rating === null || isSubmitting}
            className={`w-full px-4 py-2 rounded-lg font-jakarta font-semibold transition-colors ${
              rating !== null && !isSubmitting
                ? 'bg-primary text-on-primary hover:bg-primary-container'
                : 'bg-surface-container text-on-surface-variant cursor-not-allowed'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Rating'}
          </button>
        </div>
      ) : (
        // Success State
        <div className="text-center py-8">
          <div className="text-5xl mb-4">✓</div>
          <p className="font-jakarta font-bold text-on-surface mb-2">
            Rating Submitted!
          </p>
          <p className="text-body-sm text-on-surface-variant">
            Thank you for rating this project.
          </p>
        </div>
      )}
    </div>
  )
}