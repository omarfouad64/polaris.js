import { useLocation, Link } from 'react-router-dom'
import { useGlobalContext } from '../../../globalContext'
import useNotifications from '../../../hooks/useNotifications'
import { useProjectNotifications } from '../../../hooks/useProjectNotifications'
import { useStudentPortfolio } from '../../../hooks/useStudentPortfolio'
import { useInstructorProfile } from '../../../hooks/useInstructorProfile'
import useCompanyProfile from '../employer/profile/scripts/useCompanyProfile'

export default function Header() {
  const location = useLocation()
  const { user } = useGlobalContext()
  const { unreadCount: generalUnread } = useNotifications()
  const { unreadCount: invitationUnread } = useProjectNotifications()
  const { portfolio } = useStudentPortfolio()
  const { profile: instructorProfile } = useInstructorProfile()
  const { profile: companyProfile } = useCompanyProfile()

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

  const avatarUrl =
    user?.role === 'Student'
      ? portfolio.profilePicture
      : user?.role === 'Course Instructor'
        ? instructorProfile.profilePicture
        : user?.role === 'Employer'
          ? companyProfile.logoUrl
          : null

  const avatarInitial =
    user?.role === 'Student'
      ? portfolio.name.charAt(0)
      : user?.role === 'Course Instructor'
        ? instructorProfile.name.charAt(0)
        : user?.role === 'Employer'
          ? companyProfile.companyName.charAt(0)
          : user?.username?.charAt(0) ?? 'A'

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
            <span className="material-symbols-outlined">notifications</span>
          </Link>
          {unreadCount > 0 && (
            <span className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 bg-error text-on-error text-[10px] font-jakarta font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="h-8 w-px bg-surface-container mx-2"></div>
        <div className="w-10 h-10 rounded-full bg-surface-container-high border-2 border-surface-container overflow-hidden flex items-center justify-center">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <span className="text-sm font-jakarta font-bold text-on-surface">
              {avatarInitial.toUpperCase()}
            </span>
          )}
        </div>
      </div>
    </header>
  )
}
