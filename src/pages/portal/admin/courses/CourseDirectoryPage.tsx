import { useState } from 'react'
import { useCourses, type Course } from './scripts/useCourses'
import { useLinkRequests } from './scripts/useLinkRequests'
import CourseDataTable from './components/CourseDataTable'
import CourseModal from './components/CourseModal'
import LinkRequestHandler from './components/LinkRequestHandler'

export default function CourseDirectoryPage() {
  const { courses, addCourse, editCourse, deleteCourse } = useCourses()
  const { pendingRequests, acceptRequest, rejectRequest } = useLinkRequests()
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | undefined>(undefined)
  const [activeTab, setActiveTab] = useState<'courses' | 'requests'>('courses')

  const filteredCourses = courses.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.code.toLowerCase().includes(search.toLowerCase())
  )

  const handleOpenModal = (course?: Course) => {
    setEditingCourse(course)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setEditingCourse(undefined)
    setIsModalOpen(false)
  }

  const handleSubmit = (data: { code: string; name: string }) => {
    if (editingCourse) {
      editCourse(editingCourse.id, data)
    } else {
      addCourse(data)
    }
    handleCloseModal()
  }

  return (
    <div className="flex flex-col h-full space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-jakarta text-3xl font-bold text-on-background mb-2">Course Directory</h1>
          <p className="font-lexend text-on-surface-variant">Manage university courses and instructor links.</p>
        </div>
        {activeTab === 'courses' && (
          <button 
            onClick={() => handleOpenModal()}
            className="font-jakarta font-semibold text-sm bg-primary text-on-primary px-6 py-3 rounded-lg shadow-[0_2px_10px_rgba(31,16,142,0.2)] hover:bg-surface-tint hover:-translate-y-0.5 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            Add Course
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-surface-container">
        <button
          onClick={() => setActiveTab('courses')}
          className={`px-6 py-3 font-jakarta font-bold text-sm transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'courses' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Course List
          <span className="bg-error/10 text-error text-[10px] px-2 py-0.5 rounded-full font-bold">
            {courses.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-6 py-3 font-jakarta font-bold text-sm transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'requests' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Link Requests
          {pendingRequests.length > 0 && (
            <span className="bg-error text-on-error text-[10px] px-2 py-0.5 rounded-full">
              {pendingRequests.length}
            </span>
          )}
        </button>
      </div>

      {activeTab === 'courses' ? (
        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4">
          <div className="relative w-full md:w-96">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input 
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-[0_4px_20px_rgba(55,48,163,0.05)] pl-10 pr-4 py-3 font-lexend text-sm text-on-surface focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all" 
              placeholder="Search courses..." 
            />
          </div>

          {/* Directory Table */}
          <CourseDataTable 
            courses={filteredCourses} 
            onEdit={handleOpenModal}
            onDelete={deleteCourse}
          />
        </div>
      ) : (
        <LinkRequestHandler 
          requests={pendingRequests} 
          onAccept={(id, kind) => acceptRequest(id, kind)} 
          onReject={(id, kind) => rejectRequest(id, kind)} 
        />
      )}

      <CourseModal 
        isOpen={isModalOpen}
        initialData={editingCourse}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
