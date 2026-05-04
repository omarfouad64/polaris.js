import { useState } from 'react'
import { type LinkRequest } from '../scripts/useLinkRequests'
import ConfirmationDialog from '../../../../../components/ConfirmationDialog'

interface LinkRequestHandlerProps {
  requests: LinkRequest[]
  onAccept: (id: string) => void
  onReject: (id: string) => void
}

export default function LinkRequestHandler({ requests, onAccept, onReject }: LinkRequestHandlerProps) {
  const [pendingAction, setPendingAction] = useState<{
    request: LinkRequest
    action: 'accept' | 'reject'
  } | null>(null)

  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 text-center">
        <span className="material-symbols-outlined text-4xl text-outline mb-4">check_circle</span>
        <h3 className="font-jakarta text-lg font-bold text-on-surface">No Pending Requests</h3>
        <p className="font-lexend text-sm text-on-surface-variant">All course link/unlink requests have been handled.</p>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4">
        {requests.map(request => (
          <div 
            key={request.id} 
            className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl gap-4 shadow-sm"
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${request.type === 'link' ? 'bg-primary/10 text-primary' : 'bg-error/10 text-error'}`}>
                <span className="material-symbols-outlined text-2xl">
                  {request.type === 'link' ? 'link' : 'link_off'}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-bold uppercase tracking-wider ${request.type === 'link' ? 'text-primary' : 'text-error'}`}>
                    {request.type} Request
                  </span>
                  <span className="text-xs font-lexend text-outline">{request.date}</span>
                </div>
                <p className="font-jakarta text-on-surface font-semibold text-lg">
                  {request.instructorName}
                </p>
                <p className="font-lexend text-sm text-on-surface-variant">
                  {request.courseName} ({request.courseCode})
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPendingAction({ request, action: 'reject' })}
                className="px-4 py-2 font-jakarta font-semibold text-sm text-error bg-error/10 hover:bg-error/20 rounded-lg transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
                Reject
              </button>
              <button
                onClick={() => setPendingAction({ request, action: 'accept' })}
                className="px-4 py-2 font-jakarta font-semibold text-sm text-on-primary bg-primary hover:bg-surface-tint rounded-lg shadow-sm transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">check</span>
                Accept
              </button>
            </div>
          </div>
        ))}
      </div>
      <ConfirmationDialog
        isOpen={!!pendingAction}
        title={pendingAction?.action === 'accept' ? 'Approve Link Request?' : 'Reject Link Request?'}
        message={pendingAction
          ? `${pendingAction.request.instructorName} requested to ${pendingAction.request.type} ${pendingAction.request.courseName} (${pendingAction.request.courseCode}).`
          : ''
        }
        confirmLabel={pendingAction?.action === 'accept' ? 'Approve Request' : 'Reject Request'}
        cancelLabel="Cancel"
        tone={pendingAction?.action === 'reject' ? 'danger' : 'primary'}
        onConfirm={() => {
          if (!pendingAction) return
          if (pendingAction.action === 'accept') {
            onAccept(pendingAction.request.id)
          } else {
            onReject(pendingAction.request.id)
          }
          setPendingAction(null)
        }}
        onCancel={() => setPendingAction(null)}
      />
    </>
  )
}
