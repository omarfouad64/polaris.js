import { useState } from 'react'
import { type EmployerApplication } from '../scripts/useEmployerApplications'
import ConfirmationDialog from '../../../../../components/ConfirmationDialog'

interface EmployerDetailModalProps {
  isOpen: boolean
  application?: EmployerApplication
  onClose: () => void
  onAccept: (id: string) => void
  onReject: (id: string) => void
  onDownload: (url: string, filename: string) => void
}

export default function EmployerDetailModal({ isOpen, application, onClose, onAccept, onReject, onDownload }: EmployerDetailModalProps) {
  const [pendingAction, setPendingAction] = useState<'accept' | 'reject' | null>(null)
  if (!isOpen || !application) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 sm:p-4">
      <div 
        className="bg-surface-container-lowest sm:rounded-2xl shadow-2xl border border-outline-variant/30 w-full sm:w-[600px] h-full sm:h-[calc(100vh-2rem)] flex flex-col animate-in slide-in-from-right duration-300"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="p-6 border-b border-outline-variant/30 flex items-center justify-between bg-surface/50 sm:rounded-t-2xl">
          <h2 id="modal-title" className="font-jakarta text-xl font-bold text-on-surface">Company Details</h2>
          <button 
            onClick={onClose}
            className="p-2 text-outline hover:text-on-surface hover:bg-surface-container rounded-full transition-colors"
            aria-label="Close dialog"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <div className="flex items-start gap-5">
            {application.logoUrl ? (
              <img src={application.logoUrl} alt={`${application.companyName} logo`} className="w-20 h-20 rounded-2xl object-cover border border-outline-variant/30 shadow-sm" />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-primary-container/20 flex items-center justify-center font-jakarta font-bold text-primary text-3xl border border-outline-variant/30 shadow-sm">
                {application.companyName.substring(0, 1).toUpperCase()}
              </div>
            )}
            <div>
              <h3 className="font-jakarta text-2xl font-bold text-on-surface mb-1">{application.companyName}</h3>
              <p className="font-lexend text-sm text-on-surface-variant flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">mail</span>
                {application.email}
              </p>
              <p className="font-lexend text-sm text-on-surface-variant flex items-center gap-2 mt-1">
                <span className="material-symbols-outlined text-[16px]">location_on</span>
                {application.address}
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-jakarta text-sm font-semibold text-on-surface mb-2">Company Bio</h4>
            <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/20 font-lexend text-sm text-on-surface-variant leading-relaxed">
              {application.bio || 'No bio provided.'}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-jakarta text-sm font-semibold text-on-surface">Verification Documents</h4>
              <button
                onClick={() => onDownload(application.documentUrl, `${application.companyName}-TaxCertificate.pdf`)}
                disabled={!application.documentUrl}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-jakarta font-bold text-primary hover:bg-primary/5 rounded-lg transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                Download
              </button>
            </div>
            
            <div className="bg-surface-container rounded-xl border border-outline-variant/30 overflow-hidden h-80 flex flex-col relative">
              {application.documentUrl ? (
                <iframe 
                  src={application.documentUrl} 
                  className="w-full h-full border-none"
                  title="Tax Certificate Document Viewer"
                />
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-outline gap-2">
                  <span className="material-symbols-outlined text-4xl">description</span>
                  <p className="font-lexend text-sm">No document uploaded</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        {application.status === 'Pending' && (
          <div className="p-6 border-t border-outline-variant/30 bg-surface/50 sm:rounded-b-2xl flex items-center gap-4">
            <button
              onClick={() => setPendingAction('reject')}
              className="flex-1 py-3 border-2 border-error text-error font-jakarta font-bold text-sm rounded-xl hover:bg-error/5 transition-colors focus:ring-2 focus:ring-error outline-none"
            >
              Reject Company
            </button>
            <button
              onClick={() => setPendingAction('accept')}
              className="flex-1 py-3 bg-secondary text-on-secondary font-jakarta font-bold text-sm rounded-xl hover:bg-secondary/90 hover:-translate-y-0.5 shadow-[0_2px_10px_rgba(0,106,97,0.2)] transition-all focus:ring-2 focus:ring-secondary outline-none"
            >
              Accept Company
            </button>
          </div>
        )}
      </div>
      <ConfirmationDialog
        isOpen={pendingAction !== null}
        title={pendingAction === 'accept' ? 'Approve Employer?' : 'Reject Employer?'}
        message={`This will ${pendingAction === 'accept' ? 'approve' : 'reject'} ${application.companyName}'s registration request.`}
        confirmLabel={pendingAction === 'accept' ? 'Approve Company' : 'Reject Company'}
        cancelLabel="Cancel"
        tone={pendingAction === 'reject' ? 'danger' : 'primary'}
        onConfirm={() => {
          if (pendingAction === 'accept') {
            onAccept(application.id)
          } else if (pendingAction === 'reject') {
            onReject(application.id)
          }
          setPendingAction(null)
          onClose()
        }}
        onCancel={() => setPendingAction(null)}
      />
    </div>
  )
}
