import useStudentStats, { LANG_PALETTE } from '../../../hooks/useStudentStats'

/**
 * DashboardPage — Student analytics overview.
 * Covers Requirement 72: total number of projects, programming language
 * percentages, and top collaborators per project.
 */
export default function DashboardPage(): React.JSX.Element {
  const {
    totalProjects,
    publicProjects,
    activeProjects,
    totalTasks,
    languageStats,
    projectsWithCollaborators,
  } = useStudentStats()

  const statCards = [
    {
      label: 'Total Projects',
      value: totalProjects,
      icon: 'rocket_launch',
      containerCls: 'bg-primary/8 border-primary/20',
      iconCls: 'bg-primary/15 text-primary',
      valueCls: 'text-primary',
    },
    {
      label: 'Public Projects',
      value: publicProjects,
      icon: 'public',
      containerCls: 'bg-secondary/8 border-secondary/20',
      iconCls: 'bg-secondary/15 text-secondary',
      valueCls: 'text-secondary',
    },
    {
      label: 'Active Projects',
      value: activeProjects,
      icon: 'check_circle',
      containerCls: 'bg-surface-container-high border-outline-variant/30',
      iconCls: 'bg-surface-container-highest text-on-surface-variant',
      valueCls: 'text-on-surface',
    },
    {
      label: 'Total Tasks',
      value: totalTasks,
      icon: 'task_alt',
      containerCls: 'bg-surface-container-high border-outline-variant/30',
      iconCls: 'bg-surface-container-highest text-on-surface-variant',
      valueCls: 'text-on-surface',
    },
  ]

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-jakarta font-extrabold text-on-surface tracking-tight">
          My Dashboard
        </h1>
        <p className="text-sm font-lexend text-on-surface-variant mt-1">
          Your portfolio analytics at a glance.
        </p>
      </div>

      {/* ── Stat Cards ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map(card => (
          <div
            key={card.label}
            className={`relative bg-surface-container-lowest rounded-2xl p-5 border ${card.containerCls} shadow-sm flex flex-col gap-4 hover:shadow-md transition-shadow duration-200`}
          >
            <div className={`w-10 h-10 rounded-xl ${card.iconCls} flex items-center justify-center`}>
              <span
                className="material-symbols-outlined text-[22px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {card.icon}
              </span>
            </div>
            <div>
              <p className={`text-3xl font-jakarta font-extrabold ${card.valueCls}`}>
                {card.value}
              </p>
              <p className="text-xs font-lexend text-on-surface-variant mt-0.5 leading-snug">
                {card.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Language Breakdown ──────────────────────────────────── */}
      <div className="bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/30 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <span
              className="material-symbols-outlined text-primary text-[22px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              terminal
            </span>
          </div>
          <div>
            <h2 className="text-xl font-jakarta font-bold text-on-surface">Languages Used</h2>
            <p className="text-xs font-lexend text-on-surface-variant">
              Distribution across all your projects
            </p>
          </div>
        </div>

        {languageStats.length === 0 ? (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-[48px] text-outline/30">terminal</span>
            <p className="text-sm font-lexend text-on-surface-variant mt-2">
              Add projects with programming languages to see your breakdown.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {languageStats.map((stat, idx) => {
                const color = LANG_PALETTE[idx % LANG_PALETTE.length]
                return (
                  <div key={stat.language} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-sm font-jakarta font-semibold text-on-surface">
                          {stat.language}
                        </span>
                      </div>
                      <span className="text-sm font-lexend text-on-surface-variant font-medium tabular-nums">
                        {stat.percentage}%
                      </span>
                    </div>
                    <div className="h-2.5 bg-surface-container rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${stat.percentage}%`, backgroundColor: color }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Legend pills */}
            <div className="mt-8 pt-6 border-t border-outline-variant/20 flex flex-wrap gap-2">
              {languageStats.map((stat, idx) => {
                const color = LANG_PALETTE[idx % LANG_PALETTE.length]
                return (
                  <div
                    key={stat.language}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container border border-outline-variant/20"
                  >
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-xs font-lexend text-on-surface-variant">
                      {stat.language}
                    </span>
                    <span className="text-xs font-jakarta font-bold" style={{ color }}>
                      {stat.percentage}%
                    </span>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>

      {/* ── Top Collaborators Per Project ───────────────────────── */}
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <span
              className="material-symbols-outlined text-secondary text-[22px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              group
            </span>
          </div>
          <div>
            <h2 className="text-xl font-jakarta font-bold text-on-surface">Top Collaborators</h2>
            <p className="text-xs font-lexend text-on-surface-variant">
              Per project · sorted by task contribution
            </p>
          </div>
        </div>

        {projectsWithCollaborators.length === 0 ? (
          <div className="text-center py-12 bg-surface-container-lowest rounded-3xl border border-outline-variant/30">
            <span className="material-symbols-outlined text-[48px] text-outline/30">group_off</span>
            <p className="text-sm font-lexend text-on-surface-variant mt-2">
              Create projects to see collaborator stats here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projectsWithCollaborators.map(proj => (
              <div
                key={proj.projectId}
                className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                {/* Card header */}
                <div className="px-5 py-4 bg-primary/5 border-b border-primary/10">
                  <h3 className="text-sm font-jakarta font-bold text-on-surface truncate">
                    {proj.projectTitle}
                  </h3>
                </div>

                {proj.topCollaborators.length === 0 ? (
                  <div className="p-6 text-center">
                    <span className="material-symbols-outlined text-[32px] text-outline/30">
                      person_off
                    </span>
                    <p className="text-xs font-lexend text-on-surface-variant mt-1">
                      No collaborators yet
                    </p>
                  </div>
                ) : (
                  <div className="p-4 space-y-3">
                    {proj.topCollaborators.map((collab, idx) => (
                      <div key={collab.id} className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center font-jakarta font-bold text-xs flex-shrink-0 ${
                            idx === 0
                              ? 'bg-primary text-on-primary'
                              : idx === 1
                              ? 'bg-secondary text-on-secondary'
                              : 'bg-surface-container text-on-surface-variant'
                          }`}
                        >
                          {collab.name
                            .split(' ')
                            .map(n => n[0])
                            .join('')
                            .slice(0, 2)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-jakarta font-semibold text-on-surface truncate">
                            {collab.name}
                          </p>
                          <p className="text-xs font-lexend text-on-surface-variant">{collab.role}</p>
                        </div>
                        <div className="flex items-center gap-1 text-xs font-lexend text-on-surface-variant flex-shrink-0">
                          <span className="material-symbols-outlined text-[14px]">task_alt</span>
                          {collab.taskCount}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
