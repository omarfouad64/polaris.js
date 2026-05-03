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
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}

export default function ProjectCard({
  id,
  title,
  course,
  languages,
  rating,
  isPublic,
  createdDate,
  onEdit,
  onDelete,
  onView,
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
  const courseName = courseData ? `${courseData.name} (${courseData.code})` : course;

  return (
    <div
      className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/40 hover:shadow-raised transition-shadow duration-200 cursor-pointer group"
      onClick={() => onView(id)}
    >
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-xl font-jakarta font-semibold text-on-background group-hover:text-primary transition-colors duration-150 line-clamp-2">
            {title}
          </h3>
          {isPublic !== undefined && (
            <span
              className={`text-xs font-jakarta font-semibold px-2 py-1 rounded-full whitespace-nowrap ${
                isPublic
                  ? 'bg-secondary/10 text-secondary'
                  : 'bg-error/10 text-error'
              }`}
            >
              {isPublic ? 'Public' : 'Private'}
            </span>
          )}
        </div>
        <p className="text-sm font-lexend text-on-surface-variant">{courseName}</p>
      </div>

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
      <div className="flex items-center justify-between pt-4 border-t border-outline-variant/40">
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
      <div
        className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => onEdit(id)}
          className="flex-1 text-sm font-jakarta font-semibold px-3 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-colors duration-150"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(id)}
          className="flex-1 text-sm font-jakarta font-semibold px-3 py-2 rounded-lg border border-error text-error hover:bg-error/10 transition-colors duration-150"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
