import { useState, useEffect } from 'react'
import { type Course } from '../scripts/useCourses'

interface CourseModalProps {
  isOpen: boolean
  initialData?: Course
  onClose: () => void
  onSubmit: (data: { code: string; name: string }) => void
}

export default function CourseModal({ isOpen, initialData, onClose, onSubmit }: CourseModalProps) {
  const [code, setCode] = useState('')
  const [name, setName] = useState('')

  useEffect(() => {
    if (isOpen) {
      setCode(initialData?.code || '')
      setName(initialData?.name || '')
    }
  }, [isOpen, initialData])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim() || !name.trim()) return
    onSubmit({ code, name })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div 
        className="bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/30 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="p-6 border-b border-outline-variant/30 flex items-center justify-between">
          <h2 id="modal-title" className="font-jakarta text-xl font-bold text-on-surface">
            {initialData ? 'Edit Course' : 'Create Course'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-outline hover:text-on-surface hover:bg-surface-container rounded-full transition-colors"
            aria-label="Close dialog"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <label htmlFor="courseCode" className="font-jakarta text-sm font-semibold text-on-surface">Course Code</label>
            <input
              id="courseCode"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength={10}
              className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2 font-lexend text-sm text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
              placeholder="e.g. CS311"
              required
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="courseName" className="font-jakarta text-sm font-semibold text-on-surface">Course Name</label>
            <input
              id="courseName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2 font-lexend text-sm text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
              placeholder="e.g. Software Engineering"
              required
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-jakarta text-sm font-semibold text-outline hover:text-on-surface transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-on-primary font-jakarta text-sm font-semibold rounded-lg hover:bg-surface-tint hover:-translate-y-0.5 transition-all shadow-[0_2px_10px_rgba(31,16,142,0.2)]"
            >
              {initialData ? 'Save Changes' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
