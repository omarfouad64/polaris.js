import { createBrowserRouter, Navigate } from 'react-router-dom'
import { useGlobalContext } from './globalContext'
import PortalLayout from './pages/portal/PortalLayout.tsx'
import AuthLayout from './pages/auth/AuthLayout.tsx'
import LoginPage from './pages/auth/LoginPage.tsx'
import SignupPage from './pages/auth/SignupPage.tsx'
import ForgotPassword from './pages/auth/ForgotPassword/ForgotPassword.tsx'
import ProtectedRoute from './components/ProtectedRoute.tsx'

// Portal Sub-Sections
import DashboardLayout from './pages/portal/dashboard/DashboardLayout.tsx'
import DashboardPage from './pages/portal/dashboard/DashboardPage.tsx'
import ExplorerPage from './pages/portal/explorer/ExplorerPage.tsx'
import AdminLayout from './pages/portal/admin/AdminLayout.tsx'
import AdminPage from './pages/portal/admin/AdminPage.tsx'
import UserDirectoryPage from './pages/portal/admin/users/UserDirectoryPage.tsx'
import CourseDirectoryPage from './pages/portal/admin/courses/CourseDirectoryPage.tsx'
import EmployerVerificationPage from './pages/portal/admin/verification/EmployerVerificationPage.tsx'
import ContentModerationPage from './pages/portal/admin/moderation/ContentModerationPage.tsx'
import ErrorPage from './pages/error/ErrorPage.tsx'

// Employer Sub-Sections
import EmployerLayout from './pages/portal/employer/EmployerLayout.tsx'
import EmployerDashboardPage from './pages/portal/employer/dashboard/EmployerDashboardPage.tsx'
import CompanyProfilePage from './pages/portal/employer/profile/CompanyProfilePage.tsx'
import InternshipManagementPage from './pages/portal/employer/internships/InternshipManagementPage.tsx'
import ApplicantReviewPage from './pages/portal/employer/applicants/ApplicantReviewPage.tsx'

// Student Sub-Sections
import InternshipExplorerPage from './pages/portal/student/internships/InternshipExplorerPage.tsx'
import MyProjectsPage from './pages/portal/student/projects/MyProjectsPage.tsx'

// Shared Pages
import FavoritesPage from './pages/portal/shared/favorites/FavoritesPage.tsx'
import CommunicationsPage from './pages/portal/shared/communications/CommunicationsPage.tsx'

// Role Switcher Component
function RoleSwitcher() {
  const { user } = useGlobalContext()
  let rolePath = 'student'

  if (user?.role === 'Course Instructor') rolePath = 'instructor'
  else if (user?.role === 'Administrator') rolePath = 'administrator'
  else if (user?.role === 'Employer') rolePath = 'employer'

  return <Navigate to={`/portal/${rolePath}`} replace />
}

export const router = createBrowserRouter([
  {
    path: '/auth',
    element: <AuthLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Navigate to="/auth/login" replace /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> }
    ]
  },
  {
    path: '/auth/forgot-password',
    element: <ForgotPassword />,
    errorElement: <ErrorPage />
  },
  {
    path: '/',
    errorElement: <ErrorPage />,
    element: (
      <ProtectedRoute>
        <RoleSwitcher />
      </ProtectedRoute>
    )
  },
  {
    path: '/portal',
    element: (
      <ProtectedRoute>
        <PortalLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'student',
        element: <DashboardLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'projects', element: <MyProjectsPage /> },
          { path: 'explorer', element: <ExplorerPage /> },
          { path: 'internships', element: <InternshipExplorerPage /> },
          { path: 'portfolio', element: <div className="text-on-surface">Student Portfolio</div> },
          { path: 'favorites', element: <FavoritesPage /> },
          { path: 'communications', element: <CommunicationsPage /> }
        ]
      },
      {
        path: 'employer',
        element: <EmployerLayout />,
        children: [
          { index: true, element: <EmployerDashboardPage /> },
          { path: 'profile', element: <CompanyProfilePage /> },
          { path: 'internships', element: <InternshipManagementPage /> },
          { path: 'internships/:id/applicants', element: <ApplicantReviewPage /> },
          { path: 'favorites', element: <FavoritesPage /> },
          { path: 'communications', element: <CommunicationsPage /> }
        ]
      },
      {
        path: 'instructor',
        element: <div className="space-y-6">
          <h1 className="text-3xl font-jakarta font-bold text-on-surface">Instructor Dashboard</h1>
          <div className="grid grid-cols-3 gap-6">
            <div className="h-48 bg-primary-container/20 rounded-xl border border-primary/10 flex items-center justify-center text-primary">Grades</div>
            <div className="h-48 bg-secondary-container/20 rounded-xl border border-secondary/10 flex items-center justify-center text-secondary">Projects</div>
            <div className="h-48 bg-surface-container rounded-xl border border-surface-container flex items-center justify-center text-on-surface-variant">Class Chat</div>
          </div>
        </div>
      },
      {
        path: 'administrator',
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminPage /> },
          { path: 'verification', element: <EmployerVerificationPage /> },
          { path: 'users', element: <UserDirectoryPage /> },
          { path: 'courses', element: <CourseDirectoryPage /> },
          { path: 'moderation', element: <ContentModerationPage /> }
        ]
      }
    ]
  }
])
