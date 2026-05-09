import { useState } from 'react'
import { useParams } from 'react-router-dom'
import useApplicants from './scripts/useApplicants'
import type { InternshipApplication } from '../../../../types'

/**
 * ApplicantReviewPage — employer view for reviewing and managing applicants for a specific internship.
 *
 * Covers Req 75 (sort by top contributors), 76 (suggested matches), 86 (select internship),
 * 87 (view applicant list), 88 (set applicant status).
 */
export default function ApplicantReviewPage(): React.JSX.Element {
  const { id } = useParams()
  const internshipId = id ?? 'int-1'
  const { applicants, suggestedApplicants, updateStatus, sortByContributors, toggleSortByContributors } = useApplicants(internshipId)
  const [activeTab, setActiveTab] = useState<'candidates' | 'suggested'>('candidates')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const statusStyles: Record<InternshipApplication['status'], string> = {
    Pending: 'bg-surface-container text-on-surface-variant',
    Nominated: 'bg-primary/10 text-primary',
    Accepted: 'bg-secondary/10 text-secondary',
    Rejected: 'bg-error/10 text-error'
  }

  const currentList = activeTab === 'candidates' ? applicants : suggestedApplicants

  const renderApplicantCard = (app: InternshipApplication): React.JSX.Element => (
    <div key={app.id} className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 p-5 transition-all hover:shadow-[0_4px_16px_rgba(55,48,163,0.10)]" style={{ boxShadow: '0 2px 8px rgba(55,48,163,0.06)' }}>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-jakarta font-bold flex-shrink-0">
          {app.studentName.split(' ').map(n => n[0]).join('')}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div>
              <h4 className="font-jakarta font-semibold text-on-surface">{app.studentName}</h4>
              <p className="text-sm font-lexend text-on-surface-variant">{app.studentEmail}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-jakarta font-semibold text-on-surface-variant bg-surface-container-high px-2 py-1 rounded-full">
                Score: {app.contributionScore}
              </span>
              <button
                onClick={() => window.location.assign(`/portal/employer/portfolio/${app.studentId}`)}
                className="px-3 py-1 text-sm font-jakarta text-primary hover:underline focus-visible:ring-2 focus-visible:ring-secondary rounded-lg"
                aria-label={`View portfolio of ${app.studentName}`}
              >
                View Portfolio
              </button>
            </div>
          </div>

          {/* Status Selector */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span className={`px-3 py-1 rounded-full text-xs font-jakarta font-semibold ${statusStyles[app.status]}`}>
              {app.status}
            </span>
            <div className="flex gap-1 ml-auto">
              <button
                onClick={() => updateStatus(app.id, 'Nominated')}
                className="p-1.5 rounded-lg hover:bg-primary/10 text-on-surface-variant hover:text-primary transition-all hover:scale-105 focus-visible:ring-2 focus-visible:ring-secondary"
                aria-label={`Nominate ${app.studentName}`}
              >
                <span className="material-symbols-outlined text-[20px]">star</span>
              </button>
              <button
                onClick={() => updateStatus(app.id, 'Accepted')}
                className="p-1.5 rounded-lg hover:bg-secondary/10 text-on-surface-variant hover:text-secondary transition-all hover:scale-105 focus-visible:ring-2 focus-visible:ring-secondary"
                aria-label={`Accept ${app.studentName}`}
              >
                <span className="material-symbols-outlined text-[20px]">check_circle</span>
              </button>
              <button
                onClick={() => updateStatus(app.id, 'Rejected')}
                className="p-1.5 rounded-lg hover:bg-error/10 text-on-surface-variant hover:text-error transition-all hover:scale-105 focus-visible:ring-2 focus-visible:ring-secondary"
                aria-label={`Reject ${app.studentName}`}
              >
                <span className="material-symbols-outlined text-[20px]">cancel</span>
              </button>
            </div>
          </div>

          {/* Cover Letter */}
          <button
            onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}
            className="text-sm font-jakarta text-primary mt-3 flex items-center gap-1 hover:underline focus-visible:ring-2 focus-visible:ring-secondary rounded-lg"
          >
            <span className="material-symbols-outlined text-[16px]">{expandedId === app.id ? 'expand_less' : 'expand_more'}</span>
            {expandedId === app.id ? 'Hide' : 'View'} Cover Letter
          </button>
          {expandedId === app.id && (
            <div className="mt-2 p-4 bg-surface-container-low rounded-xl">
              <p className="font-lexend text-sm text-on-surface leading-relaxed">{app.coverLetter}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-jakarta font-bold text-on-surface">Software Engineering Intern — Applicants</h2>
        <p className="text-sm font-lexend text-on-surface-variant mt-1">Review and manage applications for this position.</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex bg-surface-container rounded-lg p-1">
          <button onClick={() => setActiveTab('candidates')} className={`px-5 py-2 rounded-lg text-sm font-jakarta font-semibold transition-all ${activeTab === 'candidates' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}>
            Candidates ({applicants.length})
          </button>
          <button onClick={() => setActiveTab('suggested')} className={`px-5 py-2 rounded-lg text-sm font-jakarta font-semibold transition-all ${activeTab === 'suggested' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}>
            Suggested Matches ({suggestedApplicants.length})
          </button>
        </div>
        {activeTab === 'candidates' && (
          <button
            onClick={toggleSortByContributors}
            className={`px-4 py-2 rounded-full text-sm font-jakarta font-semibold transition-all ${
              sortByContributors ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
            }`}
            aria-label="Sort by top contributors"
          >
            <span className="material-symbols-outlined text-[16px] align-middle mr-1">sort</span>
            Top Contributors
          </button>
        )}
      </div>

      {/* List */}
      <div className="space-y-3">
        {currentList.length === 0 ? (
          <div className="text-center py-12 bg-surface-container-lowest rounded-xl border border-outline-variant/40" style={{ boxShadow: '0 2px 8px rgba(55,48,163,0.06)' }}>
            <span className="material-symbols-outlined text-[48px] text-outline/40">person_search</span>
            <p className="font-lexend text-on-surface-variant mt-2">
              {activeTab === 'candidates' ? 'No applications yet.' : 'No suggestions available yet. Save student portfolios to your favorites to receive suggestions.'}
            </p>
          </div>
        ) : currentList.map(renderApplicantCard)}
      </div>
    </div>
  )
}
