import { useState } from 'react'
import { useUsers } from './scripts/useUsers'
import UserDataTable from './components/UserDataTable'
import CreateAdminModal from './components/CreateAdminModal'

export default function UserDirectoryPage() {
  const { users, toggleUserStatus, addAdmin } = useUsers()
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const activeCount = users.filter(u => u.status === 'Active').length
  const deactivatedCount = users.filter(u => u.status === 'Deactivated').length

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || 
                          u.email.toLowerCase().includes(search.toLowerCase())
    const matchesRole = roleFilter === 'All' || u.role === roleFilter
    return matchesSearch && matchesRole
  })

  return (
    <div className="flex flex-col h-full space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-jakarta text-3xl font-bold text-on-background mb-2">User Directory</h1>
          <p className="font-lexend text-on-surface-variant">Manage university members, roles, and access privileges.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="font-jakarta font-semibold text-sm bg-primary text-on-primary px-6 py-3 rounded-lg shadow-[0_2px_10px_rgba(31,16,142,0.2)] hover:bg-surface-tint hover:-translate-y-0.5 transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[20px]">person_add</span>
          Add New Admin
        </button>
      </div>

      {/* Summary Bento Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_4px_20px_rgba(55,48,163,0.05)] border border-outline-variant/30 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary-container/20 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined">groups</span>
          </div>
          <div>
            <p className="font-jakarta text-xs font-semibold tracking-wider text-on-surface-variant mb-1 uppercase">Total Users</p>
            <p className="font-jakarta text-3xl font-bold text-on-surface">{users.length.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_4px_20px_rgba(55,48,163,0.05)] border border-outline-variant/30 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-secondary-container/40 flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined">verified_user</span>
          </div>
          <div>
            <p className="font-jakarta text-xs font-semibold tracking-wider text-on-surface-variant mb-1 uppercase">Active Accounts</p>
            <p className="font-jakarta text-3xl font-bold text-on-surface">{activeCount.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_4px_20px_rgba(55,48,163,0.05)] border border-outline-variant/30 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center text-error">
            <span className="material-symbols-outlined">gpp_bad</span>
          </div>
          <div>
            <p className="font-jakarta text-xs font-semibold tracking-wider text-on-surface-variant mb-1 uppercase">Deactivated</p>
            <p className="font-jakarta text-3xl font-bold text-on-surface">{deactivatedCount.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Directory Toolbar */}
      <div className="flex flex-col gap-0">
        <div className="bg-surface-container-lowest p-4 rounded-t-xl border border-outline-variant/30 border-b-0 flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
          <div className="relative w-full md:w-96">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input 
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-surface-container border border-outline-variant rounded-lg pl-10 pr-4 py-2 font-lexend text-sm text-on-surface focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all" 
              placeholder="Search by name or email..." 
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface font-jakarta text-sm font-semibold hover:bg-surface-container transition-colors outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
            >
              <option value="All">Role: All</option>
              <option value="Admin">Admin</option>
              <option value="Faculty">Faculty</option>
              <option value="Student">Student</option>
              <option value="Staff">Staff</option>
            </select>
          </div>
        </div>

        {/* Directory Table */}
        <UserDataTable users={filteredUsers} onToggleStatus={toggleUserStatus} />
      </div>

      <CreateAdminModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={(data) => {
          addAdmin(data)
          setIsModalOpen(false)
        }} 
      />
    </div>
  )
}
