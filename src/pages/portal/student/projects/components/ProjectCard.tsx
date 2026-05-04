/**
 * ProjectCard — Displays a summary of a student project.
 *
 * @param id - Unique project identifier.
 * @param title - Project title.
 * @param course - Course name the project belongs to.
 * @param languages - Array of programming language names.
 * @param rating - Optional instructor rating out of 5.
 * @param isPublic - Whether the project is visible on the student's portfolio.
 * @param createdDate - Date the project was created.
 * @param onEdit - Callback when edit button is clicked.
 * @param onDelete - Callback when delete button is clicked.
 * @param onView - Callback when view button is clicked.
 * @param onToggleVisibility - Callback when visibility toggle is clicked.
 */


import useCourses from '../../../../../hooks/useCourses';

interface ProjectCardProps {
  id: string;
  title: string;
  course: string;
  languages: string[];
  rating?: number;
  isPublic?: boolean;
  createdDate: string;
  status?: 'active' | 'flagged';
  flagReason?: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
  onToggleVisibility?: (id: string) => void;
}

export default function ProjectCard({
  id,
  title,
  course,
  languages,
  rating,
  isPublic,
  createdDate,
  status = 'active',
  flagReason,
  onEdit,
  onDelete,
  onView,
  onToggleVisibility,
}: ProjectCardProps) {
  const { getCourseById } = useCourses();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const courseData = getCourseById(course);
  const isFlagged = status === 'flagged';

  return (
    <div
      className={`bg-surface-container-lowest rounded-xl p-6 border transition-all duration-300 cursor-pointer group relative ${
        isFlagged ? 'border-error/40 bg-error/5' : 'border-outline-variant/40 hover:shadow-raised hover:scale-[1.01]'
      }`}
      onClick={() => onView(id)}
    >
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-jakarta font-semibold text-on-background group-hover:text-primary transition-colors duration-150 line-clamp-2">
                {title}
              </h3>
              {isFlagged && (
                <span className="px-2 py-0.5 bg-error text-on-error rounded-full text-[10px] font-jakarta font-bold uppercase tracking-wider">
                  Flagged
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
            {isPublic !== undefined && !isFlagged && (
              <button
                onClick={() => onToggleVisibility?.(id)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 ${isPublic ? 'bg-secondary' : 'bg-outline-variant'
                  }`}
                aria-label={isPublic ? 'Make private' : 'Make public'}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${isPublic ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
              </button>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-jakarta font-bold">
            {courseData?.code || 'N/A'}
          </span>
          <p className="text-sm font-lexend text-on-surface-variant line-clamp-1">{courseData?.name || course}</p>
        </div>
      </div>

      {isFlagged && flagReason && (
        <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-lg">
          <p className="text-xs font-lexend text-error leading-relaxed">
            <span className="font-bold">Reason:</span> {flagReason}
          </p>
        </div>
      )}

      {/* Languages */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {languages.slice(0, 3).map((lang) => (
            <span
              key={lang}
              className="text-xs font-jakarta font-semibold bg-primary/10 text-primary px-2 py-1 rounded-full"
            >
              {lang}
            </span>
          ))}
          {languages.length > 3 && (
            <span className="text-xs font-jakarta font-semibold bg-surface-container text-on-surface-variant px-2 py-1 rounded-full">
              +{languages.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-outline-variant/40 mt-4">
        <p className="text-xs font-lexend text-on-surface-variant">
          Created {formatDate(createdDate)}
        </p>
        {rating && (
          <p className="text-xs font-lexend text-secondary font-semibold">
            ⭐ {rating}/5
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
        {isFlagged ? (
          <button
            onClick={() => {}} // TODO: Handle appeal (Req 61)
            className="flex-1 text-sm font-jakarta font-semibold px-4 py-2.5 rounded-lg bg-error text-on-error hover:opacity-90 transition-all duration-200 shadow-sm flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">campaign</span>
            Appeal Unflagging
          </button>
        ) : (
          <>
            <button
              onClick={() => onEdit(id)}
              className="flex-1 text-sm font-jakarta font-semibold px-4 py-2.5 rounded-lg bg-surface-container-high text-primary hover:bg-primary hover:text-on-primary transition-all duration-200 border border-primary/10 shadow-sm flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">edit</span>
              Edit
            </button>
            <button
              onClick={() => onDelete(id)}
              className="flex-1 text-sm font-jakarta font-semibold px-4 py-2.5 rounded-lg border border-error/30 text-error hover:bg-error hover:text-on-error transition-all duration-200 shadow-sm flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">delete</span>
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}
