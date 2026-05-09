import { useState } from 'react'
import useInternships from './scripts/useInternships'
import useEmployerStats from '../dashboard/scripts/useEmployerStats'
import Button from '../../../../components/Button'
import Input from '../../../../components/Input'
import type { Internship } from '../../../../types'

/**
 * InternshipManagementPage — employer view for managing internships with Active/Archived tabs.
 *
 * Covers Req 74 (CRUD), 77 (hiring status), 78 (archive), 85 (view list), 86 (select internship).
 */
export default function InternshipManagementPage(): React.JSX.Element {
  const { activeInternships, archivedInternships, addInternship, updateInternship, deleteInternship, toggleStatus, toggleArchive } = useInternships()
  const { studentsPlaced } = useEmployerStats()
  const [viewTab, setViewTab] = useState<'active' | 'archived'>('active')
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<{
    title: string
    description: string
    skills: string
    duration: string
    applicationDeadline: string
    programmingLanguages: string
    status: Internship['status']
  }>({
    title: '', description: '', skills: '', duration: '3 months',
    applicationDeadline: '', programmingLanguages: '', status: 'Hiring'
  })

  const handleSubmit = (): void => {
    if (!form.title.trim()) return
    if (editId) {
      updateInternship(editId, {
        title: form.title,
        description: form.description,
        skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
        duration: form.duration,
        applicationDeadline: form.applicationDeadline,
        programmingLanguages: form.programmingLanguages.split(',').map(s => s.trim()).filter(Boolean),
        status: form.status
      })
    } else {
      addInternship({
        title: form.title,
        description: form.description,
        skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
        duration: form.duration,
        applicationDeadline: form.applicationDeadline,
        programmingLanguages: form.programmingLanguages.split(',').map(s => s.trim()).filter(Boolean),
        status: form.status
      })
    }
    resetForm()
  }

  const startEdit = (internship: Internship): void => {
    setEditId(internship.id)
    setForm({
      title: internship.title,
      description: internship.description,
      skills: internship.skills.join(', '),
      duration: internship.duration,
      applicationDeadline: internship.applicationDeadline,
      programmingLanguages: internship.programmingLanguages.join(', '),
      status: internship.status
    })
    setShowForm(true)
  }

  const resetForm = (): void => {
    setForm({ title: '', description: '', skills: '', duration: '3 months', applicationDeadline: '', programmingLanguages: '', status: 'Hiring' })
    setShowForm(false)
    setEditId(null)
  }

  const currentList = viewTab === 'active' ? activeInternships : archivedInternships

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-jakarta font-bold text-on-surface">Internship Management</h2>
          <p className="font-lexend text-on-surface-variant text-sm">Manage your active listings and past opportunities.</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(true) }}>
          <span className="material-symbols-outlined text-[20px]">add</span>
          Create Internship
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Listings', value: activeInternships.length, icon: 'work', color: 'primary' },
          { label: 'Total Applicants', value: activeInternships.reduce((s, i) => s + i.applicantCount, 0), icon: 'group', color: 'secondary' },
          { label: 'Total Participants', value: studentsPlaced, icon: 'people', color: 'secondary' },
          { label: 'Archived', value: archivedInternships.length, icon: 'archive', color: 'outline' }
        ].map(stat => (
          <div key={stat.label} className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/40 relative overflow-hidden" style={{ boxShadow: '0 2px 8px rgba(55,48,163,0.06)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-jakarta font-semibold tracking-widest uppercase text-on-surface-variant">{stat.label}</span>
              <span className={`material-symbols-outlined text-${stat.color} bg-${stat.color}/10 p-1.5 rounded-lg text-[20px]`}>{stat.icon}</span>
            </div>
            <div className="text-3xl font-jakarta font-bold text-on-surface">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Create/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-on-background/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Internship form">
          <div className="bg-surface-container-lowest rounded-xl p-8 w-full max-w-lg space-y-4" style={{ boxShadow: '0 8px 32px rgba(55,48,163,0.14)' }}>
            <h3 className="text-xl font-jakarta font-bold text-on-surface">{editId ? 'Edit Internship' : 'Create Internship'}</h3>
            <Input label="Internship Title" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Software Engineering Intern" />
            <div className="flex flex-col gap-2">
              <label className="font-jakarta text-sm font-semibold text-on-surface-variant px-1">Description</label>
              <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 font-lexend text-on-surface placeholder:text-outline focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-colors resize-none h-24" placeholder="Responsibilities and details..." />
            </div>
            <Input label="Skills (comma-separated)" value={form.skills} onChange={e => setForm(p => ({ ...p, skills: e.target.value }))} placeholder="React, TypeScript, Node.js" />
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-jakarta text-sm font-semibold text-on-surface-variant px-1">Duration</label>
                <select value={form.duration} onChange={e => setForm(p => ({ ...p, duration: e.target.value }))} className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-3 font-lexend text-on-surface focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-colors">
                  <option value="1 month">1 month</option>
                  <option value="2 months">2 months</option>
                  <option value="3 months">3 months</option>
                  <option value="6 months">6 months</option>
                </select>
              </div>
              <Input label="Deadline" type="date" value={form.applicationDeadline} onChange={e => setForm(p => ({ ...p, applicationDeadline: e.target.value }))} />
            </div>
            <Input label="Programming Languages (comma-separated)" value={form.programmingLanguages} onChange={e => setForm(p => ({ ...p, programmingLanguages: e.target.value }))} placeholder="TypeScript, Python" />
            <div className="flex gap-3 pt-2">
              <Button onClick={handleSubmit}>{editId ? 'Save Changes' : 'Create Internship'}</Button>
              <Button variant="ghost" onClick={resetForm}>Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {/* Tab toggle */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 overflow-hidden" style={{ boxShadow: '0 2px 8px rgba(55,48,163,0.06)' }}>
        <div className="border-b border-outline-variant/30 p-4 bg-surface-container-low/50 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex bg-surface-container rounded-lg p-1">
            <button onClick={() => setViewTab('active')} className={`px-5 py-2 rounded-lg text-sm font-jakarta font-semibold transition-all ${viewTab === 'active' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}>
              Active ({activeInternships.length})
            </button>
            <button onClick={() => setViewTab('archived')} className={`px-5 py-2 rounded-lg text-sm font-jakarta font-semibold transition-all ${viewTab === 'archived' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}>
              Archived ({archivedInternships.length})
            </button>
          </div>
        </div>

        {/* Internship Cards */}
        <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {currentList.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <span className="material-symbols-outlined text-[48px] text-outline/40">work_off</span>
              <p className="font-lexend text-on-surface-variant mt-2">No {viewTab} internships.</p>
            </div>
          ) : currentList.map(internship => (
            <div key={internship.id} className="group border border-outline-variant/40 rounded-xl p-5 bg-surface-container-lowest hover:bg-surface-container-low/50 transition-all duration-300 hover:shadow-[0_4px_16px_rgba(55,48,163,0.10)]">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-jakarta font-semibold text-on-surface group-hover:text-primary transition-colors">{internship.title}</h3>
                  <p className="text-sm font-lexend text-on-surface-variant mt-0.5">{internship.duration} • Deadline: {internship.applicationDeadline}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-jakarta font-semibold tracking-wider uppercase ${
                  internship.status === 'Hiring' ? 'bg-secondary/10 text-secondary' : 'bg-outline-variant/30 text-on-surface-variant'
                }`}>
                  {internship.status}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {internship.skills.slice(0, 4).map(s => (
                  <span key={s} className="px-2.5 py-0.5 bg-surface-container-high text-on-surface-variant rounded-full text-xs font-lexend">{s}</span>
                ))}
                {internship.skills.length > 4 && (
                  <span className="px-2.5 py-0.5 bg-surface-container text-on-surface-variant rounded-full text-xs font-lexend">+{internship.skills.length - 4} more</span>
                )}
              </div>
              <div className="flex items-center justify-between border-t border-outline-variant/30 pt-3">
                <div className="flex items-center gap-4">
                  <div><span className="text-xl font-jakarta font-bold text-on-surface">{internship.applicantCount}</span><span className="text-xs font-lexend text-on-surface-variant ml-1">Applicants</span></div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => toggleStatus(internship.id)} className="px-3 py-1.5 border border-outline-variant text-on-surface-variant rounded-lg text-sm font-jakarta font-semibold hover:bg-surface-container transition-colors focus-visible:ring-2 focus-visible:ring-secondary" aria-label={`Toggle status of ${internship.title}`}>
                    {internship.status === 'Hiring' ? 'Mark Filled' : 'Reopen'}
                  </button>
                  <button onClick={() => toggleArchive(internship.id)} className="px-3 py-1.5 border border-outline-variant text-on-surface-variant rounded-lg text-sm font-jakarta font-semibold hover:bg-surface-container transition-colors focus-visible:ring-2 focus-visible:ring-secondary" aria-label={`Archive ${internship.title}`}>
                    {internship.archived ? 'Unarchive' : 'Archive'}
                  </button>
                  <button onClick={() => startEdit(internship)} className="px-3 py-1.5 border border-outline-variant text-on-surface-variant rounded-lg text-sm font-jakarta font-semibold hover:bg-surface-container transition-colors focus-visible:ring-2 focus-visible:ring-secondary" aria-label={`Edit ${internship.title}`}>Edit</button>
                  <button onClick={() => deleteInternship(internship.id)} className="px-3 py-1.5 border border-error/20 text-error rounded-lg text-sm font-jakarta font-semibold hover:bg-error/5 transition-colors focus-visible:ring-2 focus-visible:ring-secondary" aria-label={`Delete ${internship.title}`}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
