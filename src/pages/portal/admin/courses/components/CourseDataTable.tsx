import { useState } from 'react'
import { type Course } from '../scripts/useCourses'
import ConfirmationDialog from '../../../../../components/ConfirmationDialog'

interface CourseDataTableProps {
  courses: Course[]
  onEdit: (course: Course) => void
  onDelete: (courseId: string) => void
}

export default function CourseDataTable({ courses, onEdit, onDelete }: CourseDataTableProps) {
  const [pendingDelete, setPendingDelete] = useState<Course | null>(null)

  return (
    <>
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-[0_4px_20px_rgba(55,48,163,0.05)] overflow-hidden">
        <div className="flex flex-col">
          {courses.map((course) => (
            <div 
              key={course.id} 
              className="flex justify-between items-center p-4 border-b border-outline-variant/50 last:border-0 hover:bg-surface-container-low/50 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <span className="bg-primary/10 text-primary rounded-full text-xs font-jakarta font-semibold px-3 py-1">
                  {course.code}
                </span>
                <div>
                  <p className="font-jakarta text-sm font-semibold text-on-surface">{course.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="bg-surface-container text-on-surface-variant rounded-full text-xs px-2 py-0.5">
                      {course.instructorsCount} Linked {course.instructorsCount === 1 ? 'Instructor' : 'Instructors'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => onEdit(course)}
                  className="p-2 text-outline hover:text-primary transition-colors rounded-full hover:bg-primary/10" 
                  title="Edit Course"
                  aria-label={`Edit ${course.code}`}
                >
                  <span className="material-symbols-outlined text-[20px]">edit</span>
                </button>
                <button 
                  onClick={() => setPendingDelete(course)}
                  className="p-2 text-outline hover:text-error transition-colors rounded-full hover:bg-error/10" 
                  title="Delete Course"
                  aria-label={`Delete ${course.code}`}
                >
                  <span className="material-symbols-outlined text-[20px]">delete</span>
                </button>
              </div>
            </div>
          ))}
          {courses.length === 0 && (
            <div className="p-8 text-center text-on-surface-variant font-lexend text-sm">
              No courses added yet.
            </div>
          )}
        </div>
      </div>
      <ConfirmationDialog
        isOpen={!!pendingDelete}
        title="Delete Course?"
        message={
          pendingDelete
            ? `This will permanently delete ${pendingDelete.code} - ${pendingDelete.name}.`
            : 'This will permanently delete the selected course.'
        }
        confirmLabel="Delete Course"
        cancelLabel="Cancel"
        tone="danger"
        onConfirm={() => {
          if (pendingDelete) onDelete(pendingDelete.id)
          setPendingDelete(null)
        }}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  )
}
