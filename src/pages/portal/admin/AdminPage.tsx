import { usePlatformStats } from './scripts/usePlatformStats'

export default function AdminPage() {
  const stats = usePlatformStats()

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-8 bg-primary-container/20 rounded-3xl border border-primary/10 flex flex-col gap-4">
          <span className="material-symbols-outlined text-primary text-3xl">groups</span>
          <div>
            <p className="text-sm font-lexend text-on-surface-variant">Total Users</p>
            <p className="text-3xl font-jakarta font-extrabold text-primary">{stats.totalUsers.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="p-8 bg-secondary-container/20 rounded-3xl border border-secondary/10 flex flex-col gap-4">
          <span className="material-symbols-outlined text-secondary text-3xl">folder_managed</span>
          <div>
            <p className="text-sm font-lexend text-on-surface-variant">Total Projects</p>
            <p className="text-3xl font-jakarta font-extrabold text-secondary">{stats.totalProjects.toLocaleString()}</p>
          </div>
        </div>

        <div className="p-8 bg-tertiary-container/20 rounded-3xl border border-tertiary/10 flex flex-col gap-4">
          <span className="material-symbols-outlined text-tertiary text-3xl">school</span>
          <div>
            <p className="text-sm font-lexend text-on-surface-variant">Total Courses</p>
            <p className="text-3xl font-jakarta font-extrabold text-tertiary">{stats.totalCourses.toLocaleString()}</p>
          </div>
        </div>

        <div className="p-8 bg-surface-container-highest rounded-3xl border border-surface-container flex flex-col gap-4">
          <span className="material-symbols-outlined text-on-surface-variant text-3xl">verified</span>
          <div>
            <p className="text-sm font-lexend text-on-surface-variant">Active Employers</p>
            <p className="text-3xl font-jakarta font-extrabold text-on-surface">{stats.activeEmployers}</p>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-3xl border border-surface-container p-8">
        <h3 className="font-jakarta text-xl font-bold text-on-surface mb-6">Recent Activity</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-surface-container-low border border-surface-container">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-[20px]">person_add</span>
                </div>
                <div>
                  <p className="text-sm font-jakarta font-bold text-on-surface">New User Registered</p>
                  <p className="text-xs text-on-surface-variant">A student just joined the platform</p>
                </div>
              </div>
              <span className="text-xs font-lexend text-outline">2 mins ago</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
