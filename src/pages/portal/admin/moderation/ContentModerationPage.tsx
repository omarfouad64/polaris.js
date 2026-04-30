import { useState } from 'react'
import { useModeration } from './scripts/useModeration'
import FlaggedProjectList from './components/FlaggedProjectList'
import AppealReviewList from './components/AppealReviewList'

export default function ContentModerationPage() {
  const { flaggedProjects, appeals, toggleProjectStatus, acceptAppeal, rejectAppeal } = useModeration()
  const [activeTab, setActiveTab] = useState<'flagged' | 'appeals'>('flagged')

  const pendingAppealsCount = appeals.filter(a => a.status === 'pending').length

  return (
    <div className="flex flex-col h-full space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="font-jakarta text-3xl font-bold text-on-background">Content Moderation</h1>
        <p className="font-lexend text-on-surface-variant">Review flagged projects and process student appeals.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-surface-container">
        <button
          onClick={() => setActiveTab('flagged')}
          className={`px-6 py-3 font-jakarta font-bold text-sm transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'flagged' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Flagged Projects
          {flaggedProjects.length > 0 && (
            <span className="bg-error/10 text-error text-[10px] px-2 py-0.5 rounded-full font-bold">
              {flaggedProjects.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('appeals')}
          className={`px-6 py-3 font-jakarta font-bold text-sm transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'appeals' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Appeals
          {pendingAppealsCount > 0 && (
            <span className="bg-error text-on-error text-[10px] px-2 py-0.5 rounded-full">
              {pendingAppealsCount}
            </span>
          )}
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === 'flagged' ? (
          <FlaggedProjectList 
            projects={flaggedProjects}
            onActivate={(id) => toggleProjectStatus(id, true)}
            onDeactivate={(id) => toggleProjectStatus(id, false)}
          />
        ) : (
          <AppealReviewList 
            appeals={appeals}
            onAcceptAppeal={acceptAppeal}
            onRejectAppeal={rejectAppeal}
          />
        )}
      </div>
    </div>
  )
}
