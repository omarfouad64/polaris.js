import { type FlaggedProject } from '../scripts/useModeration'

interface FlaggedProjectListProps {
  projects: FlaggedProject[]
  onDeactivate: (id: string) => void
  onActivate: (id: string) => void
}

export default function FlaggedProjectList({ projects, onDeactivate, onActivate }: FlaggedProjectListProps) {
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 text-center">
        <span className="material-symbols-outlined text-4xl text-outline mb-4">gpp_good</span>
        <h3 className="font-jakarta text-lg font-bold text-on-surface">No Flagged Projects</h3>
        <p className="font-lexend text-sm text-on-surface-variant">All projects are currently complying with guidelines.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4">
      {projects.map(project => (
        <div 
          key={project.id} 
          className="flex flex-col md:flex-row md:items-start justify-between p-6 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl gap-6 shadow-sm"
        >
          <div className="flex items-start gap-4 flex-1">
            <div className="w-12 h-12 rounded-full bg-error/10 text-error flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">flag</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs font-bold uppercase tracking-wider ${project.status === 'active' ? 'text-primary' : 'text-error'}`}>
                  {project.status === 'active' ? 'Active' : 'Deactivated'}
                </span>
                <span className="text-xs font-lexend text-outline">&bull; Flagged on {project.dateFlagged}</span>
              </div>
              <h4 className="font-jakarta text-on-surface font-bold text-lg mb-1">
                {project.title}
              </h4>
              <p className="font-lexend text-sm text-on-surface-variant mb-4">
                by {project.studentName} ({project.course})
              </p>
              
              <div className="bg-error/5 border border-error/20 rounded-xl p-4">
                <p className="text-xs font-bold text-error mb-1">Flagged by: {project.flaggedBy}</p>
                <p className="text-sm font-lexend text-on-surface">{project.reason}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 shrink-0 mt-2 md:mt-0">
            {project.status === 'active' ? (
              <button
                onClick={() => onDeactivate(project.id)}
                className="px-4 py-2 font-jakarta font-semibold text-sm text-error bg-error/10 hover:bg-error/20 rounded-lg transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">block</span>
                Deactivate
              </button>
            ) : (
              <button
                onClick={() => onActivate(project.id)}
                className="px-4 py-2 font-jakarta font-semibold text-sm text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                Activate
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
