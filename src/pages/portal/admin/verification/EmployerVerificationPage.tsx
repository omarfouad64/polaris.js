import { useState } from 'react'
import { useEmployerApplications, type EmployerApplication } from './scripts/useEmployerApplications'
import EmployerApplicationList from './components/EmployerApplicationList'
import EmployerDetailModal from './components/EmployerDetailModal'

export default function EmployerVerificationPage() {
  const { applications, acceptApplication, rejectApplication, downloadDocument } = useEmployerApplications()
  
  const [activeTab, setActiveTab] = useState<'Pending' | 'Approved' | 'Rejected'>('Pending')
  const [selectedApp, setSelectedApp] = useState<EmployerApplication | undefined>(undefined)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const displayedApplications = applications.filter(app => app.status === activeTab)
  const pendingCount = applications.filter(app => app.status === 'Pending').length
  const approvedCount = applications.filter(app => app.status === 'Approved').length
  const rejectedCount = applications.filter(app => app.status === 'Rejected').length

  const handleViewDetails = (app: EmployerApplication) => {
    setSelectedApp(app)
    setIsModalOpen(true)
  }

  const tabs = [
    { id: 'Pending', label: `Pending (${pendingCount})` },
    { id: 'Approved', label: `Approved (${approvedCount})` },
    { id: 'Rejected', label: `Rejected (${rejectedCount})` },
  ] as const

  return (
    <div className="flex flex-col h-full space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="font-jakarta text-3xl font-bold text-on-background mb-2">Employer Verification</h1>
        <p className="font-lexend text-on-surface-variant">Review and verify new company registrations to the platform.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-outline-variant/30">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 font-jakarta text-sm font-bold border-b-2 transition-colors ${
              activeTab === tab.id 
                ? 'border-primary text-primary' 
                : 'border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="animate-in fade-in duration-300">
        <EmployerApplicationList 
          applications={displayedApplications}
          onViewDetails={handleViewDetails}
          onAccept={acceptApplication}
          onReject={rejectApplication}
        />
      </div>

      {/* Detail Modal */}
      <EmployerDetailModal
        isOpen={isModalOpen}
        application={selectedApp}
        onClose={() => setIsModalOpen(false)}
        onAccept={acceptApplication}
        onReject={rejectApplication}
        onDownload={downloadDocument}
      />
    </div>
  )
}
