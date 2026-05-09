import useEmployerStats from './scripts/useEmployerStats'

/**
 * EmployerDashboardPage — displays employer statistics including internships offered, students placed, and placement trends.
 *
 * Covers Req 71: View statistics about internships and student placements over time.
 */
export default function EmployerDashboardPage(): React.JSX.Element {
  const stats = useEmployerStats()
  const maxPlacement = Math.max(...stats.placementsOverTime.map(d => d.placements), 1)

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 mb-2">
        <h1 className="font-jakarta text-4xl font-extrabold text-on-surface">Employer Portal</h1>
        <p className="font-lexend text-on-surface-variant">Manage your company, internships, and talent pipeline.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/40 relative overflow-hidden transition-shadow duration-200 hover:shadow-[0_4px_16px_rgba(55,48,163,0.10)]"
          style={{ boxShadow: '0 2px 8px rgba(55,48,163,0.06)' }}
        >
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
          <div className="flex items-center justify-between mb-3 relative z-10">
            <span className="text-sm font-jakarta font-semibold tracking-widest uppercase text-on-surface-variant">Internships Offered</span>
            <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">work</span>
          </div>
          <div className="text-4xl font-jakarta font-bold text-on-surface relative z-10">{stats.internshipsOffered}</div>
          <div className="text-sm font-lexend text-secondary mt-1 flex items-center gap-1 relative z-10">
            <span className="material-symbols-outlined text-[16px]">trending_up</span>
            +3 this quarter
          </div>
        </div>

        <div
          className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/40 relative overflow-hidden transition-shadow duration-200 hover:shadow-[0_4px_16px_rgba(55,48,163,0.10)]"
          style={{ boxShadow: '0 2px 8px rgba(55,48,163,0.06)' }}
        >
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-secondary/10 rounded-full blur-2xl" />
          <div className="flex items-center justify-between mb-3 relative z-10">
            <span className="text-sm font-jakarta font-semibold tracking-widest uppercase text-on-surface-variant">Total Participants</span>
            <span className="material-symbols-outlined text-secondary bg-secondary/10 p-2 rounded-lg">people</span>
          </div>
          <div className="text-4xl font-jakarta font-bold text-on-surface relative z-10">{stats.studentsPlaced}</div>
          <div className="text-sm font-lexend text-on-surface-variant mt-1 relative z-10">All-time student participation</div>
        </div>
      </div>

      {/* Placement Chart */}
      <div
        className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/40"
        style={{ boxShadow: '0 2px 8px rgba(55,48,163,0.06)' }}
      >
        <h3 className="text-xl font-jakarta font-semibold text-on-surface mb-6">Placements Over Time</h3>
        <div className="flex items-end gap-3 h-48 px-2">
          {stats.placementsOverTime.map((d) => (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex flex-col items-center gap-0.5" style={{ height: '160px' }}>
                <div className="w-full flex items-end justify-center gap-0.5 h-full">
                  <div
                    className="w-3 bg-primary/80 rounded-t-sm transition-all duration-300 hover:bg-primary"
                    style={{ height: `${(d.internships / maxPlacement) * 100}%`, minHeight: d.internships > 0 ? '4px' : '0' }}
                    title={`${d.internships} internships`}
                  />
                  <div
                    className="w-3 bg-secondary/80 rounded-t-sm transition-all duration-300 hover:bg-secondary"
                    style={{ height: `${(d.placements / maxPlacement) * 100}%`, minHeight: d.placements > 0 ? '4px' : '0' }}
                    title={`${d.placements} placements`}
                  />
                </div>
              </div>
              <span className="text-[10px] font-lexend text-on-surface-variant text-center whitespace-nowrap">{d.month}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-primary/80" />
            <span className="text-xs font-lexend text-on-surface-variant">Internships</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-secondary/80" />
            <span className="text-xs font-lexend text-on-surface-variant">Placements</span>
          </div>
        </div>
      </div>
    </div>
  )
}
