import { useState } from 'react'
import { type EmployerApplication } from '../scripts/useEmployerApplications'
import ConfirmationDialog from '../../../../../components/ConfirmationDialog'

interface EmployerApplicationListProps {
  applications: EmployerApplication[]
  onViewDetails: (app: EmployerApplication) => void
  onAccept: (id: string) => void
  onReject: (id: string) => void
}

export default function EmployerApplicationList({ applications, onViewDetails, onAccept, onReject }: EmployerApplicationListProps) {
  const [pendingAction, setPendingAction] = useState<{
    application: EmployerApplication
    action: 'accept' | 'reject'
  } | null>(null)

  if (applications.length === 0) {
    return (
      <div className="p-12 text-center text-on-surface-variant font-lexend text-sm bg-surface-container-lowest rounded-xl border border-outline-variant/30">
        No applications found.
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        {applications.map((app) => (
          <div 
            key={app.id} 
            className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-6 shadow-[0_4px_20px_rgba(55,48,163,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-[0_8px_30px_rgba(55,48,163,0.06)] transition-all"
          >
            <div className="flex items-center gap-4">
              {app.logoUrl ? (
                <img src={app.logoUrl} alt={`${app.companyName} logo`} className="w-12 h-12 rounded-xl object-cover border border-outline-variant/20" />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-primary-container/20 flex items-center justify-center font-jakarta font-bold text-primary text-lg border border-outline-variant/20">
                  {app.companyName.substring(0, 1).toUpperCase()}
                </div>
              )}
              
              <div>
                <h3 className="font-jakarta text-lg font-bold text-on-surface">{app.companyName}</h3>
                <p className="font-lexend text-sm text-on-surface-variant">{app.email}</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
              <div className="text-left md:text-right">
                <p className="font-jakarta text-xs font-semibold text-outline uppercase tracking-wider">Applied On</p>
                <p className="font-lexend text-sm text-on-surface-variant">{app.appliedDate}</p>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onViewDetails(app)}
                  className="px-4 py-2 text-sm font-jakarta font-semibold text-primary bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors"
                >
                  View Details
                </button>

                {app.status === 'Pending' && (
                  <>
                    <button
                      onClick={() => setPendingAction({ application: app, action: 'accept' })}
                      className="p-2 text-secondary hover:bg-secondary/10 rounded-lg transition-colors"
                      aria-label={`Accept ${app.companyName}`}
                      title="Accept Company"
                    >
                      <span className="material-symbols-outlined">check_circle</span>
                    </button>
                    <button
                      onClick={() => setPendingAction({ application: app, action: 'reject' })}
                      className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors"
                      aria-label={`Reject ${app.companyName}`}
                      title="Reject Company"
                    >
                      <span className="material-symbols-outlined">cancel</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <ConfirmationDialog
        isOpen={!!pendingAction}
        title={pendingAction?.action === 'accept' ? 'Approve Employer?' : 'Reject Employer?'}
        message={pendingAction
          ? `This will ${pendingAction.action === 'accept' ? 'approve' : 'reject'} ${pendingAction.application.companyName}'s registration request.`
          : ''
        }
        confirmLabel={pendingAction?.action === 'accept' ? 'Approve Company' : 'Reject Company'}
        cancelLabel="Cancel"
        tone={pendingAction?.action === 'reject' ? 'danger' : 'primary'}
        onConfirm={() => {
          if (!pendingAction) return
          if (pendingAction.action === 'accept') {
            onAccept(pendingAction.application.id)
          } else {
            onReject(pendingAction.application.id)
          }
          setPendingAction(null)
        }}
        onCancel={() => setPendingAction(null)}
      />
    </>
  )
}
