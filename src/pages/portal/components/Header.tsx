import { useLocation, Link } from 'react-router-dom'
import { useGlobalContext } from '../../../globalContext'
import useNotifications from '../../../hooks/useNotifications'
import { useProjectNotifications } from '../../../hooks/useProjectNotifications'
import { useStudentPortfolio } from '../../../hooks/useStudentPortfolio'
import { useInstructorProfile } from '../../../hooks/useInstructorProfile'
import useCompanyProfile from '../employer/profile/scripts/useCompanyProfile'
import type { UserRole } from '../../../types'

// ---------------------------------------------------------------------------
// Role-specific avatar sub-components
// These are rendered conditionally so their hooks only mount for the right role.
// This prevents useCompanyProfile's localStorage writes from running for students,
// and avoids any cross-role data contamination in the header.
// ---------------------------------------------------------------------------

function StudentAvatar({ studentId }: { studentId?: string }) {
  const { portfolio } = useStudentPortfolio(studentId)
  const initial = (portfolio.name || 'S').charAt(0).toUpperCase()
  return portfolio.profilePicture ? (
    <img src={portfolio.profilePicture} alt="Profile" className="w-full h-full object-cover" />
  ) : (
    <span className="text-sm font-jakarta font-bold text-on-surface">{initial}</span>
  )
}

function InstructorAvatar({ instructorId }: { instructorId?: string }) {
  const { profile } = useInstructorProfile()
  const initial = (profile.name || 'I').charAt(0).toUpperCase()
  return profile.profilePicture ? (
    <img src={profile.profilePicture} alt="Profile" className="w-full h-full object-cover" />
  ) : (
    <span className="text-sm font-jakarta font-bold text-on-surface">{initial}</span>
  )
}

function EmployerAvatar() {
  const { profile } = useCompanyProfile()
  const initial = profile.companyName.charAt(0).toUpperCase()
  return profile.logoUrl ? (
    <img src={profile.logoUrl} alt="Profile" className="w-full h-full object-cover" />
  ) : (
    <span className="text-sm font-jakarta font-bold text-on-surface">{initial}</span>
  )
}

function RoleAvatar({ role, username }: { role: UserRole | undefined; username: string | undefined }) {
  if (role === 'Student') return <StudentAvatar studentId={username} />
  if (role === 'Course Instructor') return <InstructorAvatar instructorId={username} />
  if (role === 'Employer') return <EmployerAvatar />
  // Administrator — just use username initial, no profile hook needed
  return (
    <span className="text-sm font-jakarta font-bold text-on-surface">
      {(username?.charAt(0) ?? 'A').toUpperCase()}
    </span>
  )
}

// ---------------------------------------------------------------------------

export default function Header() {
  const location = useLocation()
  const { user } = useGlobalContext()
  const { unreadCount: generalUnread, notificationsMuted } = useNotifications()
  const { unreadCount: invitationUnread } = useProjectNotifications()

  const unreadCount = generalUnread + invitationUnread

  // Determine role path for notifications link
  let rolePath = 'student'
  if (user?.role === 'Course Instructor') rolePath = 'instructor'
  else if (user?.role === 'Administrator') rolePath = 'administrator'
  else if (user?.role === 'Employer') rolePath = 'employer'

  // Extract page name from path (e.g., /portal/student/projects -> Projects)
  const pathParts = location.pathname.split('/').filter(Boolean)
  const lastPart = pathParts[pathParts.length - 1]
  const pageName = lastPart
    ? lastPart.charAt(0).toUpperCase() + lastPart.slice(1).replace(/-/g, ' ')
    : 'Dashboard'

  return (
    <header className="h-20 bg-surface-container-lowest border-b border-surface-container flex items-center justify-between px-10 shadow-sm">
      <h2 className="font-jakarta text-xl font-bold text-on-surface">
        {pageName}
      </h2>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Link
            to={`/portal/${rolePath}/notifications`}
            className="p-2 rounded-full hover:bg-surface-container text-on-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined">
              {notificationsMuted ? 'notifications_paused' : 'notifications'}
            </span>
          </Link>
          {notificationsMuted ? (
            <span className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 bg-surface-container-highest text-on-surface-variant text-[10px] font-jakarta font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center border border-surface-container shadow-sm">
              <span className="material-symbols-outlined text-[12px]">volume_off</span>
            </span>
          ) : (
            unreadCount > 0 && (
              <span className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 bg-error text-on-error text-[10px] font-jakarta font-bold rounded-full min-w-4.5 h-4.5 flex items-center justify-center px-1">
                {unreadCount}
              </span>
            )
          )}
        </div>
        <div className="h-8 w-px bg-surface-container mx-2"></div>
        <div className="w-10 h-10 rounded-full bg-surface-container-high border-2 border-surface-container overflow-hidden flex items-center justify-center">
          <RoleAvatar role={user?.role} username={user?.username} />
        </div>
      </div>
    </header>
  )
}
