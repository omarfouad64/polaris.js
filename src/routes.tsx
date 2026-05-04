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
import SearchHubPage from './pages/portal/explorer/SearchHubPage.tsx'
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

// Instructor Sub-Sections
import InstructorLayout from './pages/portal/instructor/InstructorLayout.tsx'
import InstructorProfilePage from './pages/portal/instructor/profile/InstructorProfilePage.tsx'
import MyCourses from './pages/portal/instructor/courses/MyCourses.tsx'
import InstructorDirectory from './pages/portal/explorer/InstructorDirectory.tsx'

// Student Sub-Sections
import InternshipExplorerPage from './pages/portal/student/internships/InternshipExplorerPage.tsx'
import MyProjectsPage from './pages/portal/student/projects/MyProjectsPage.tsx'
import ProjectEditorPage from './pages/portal/student/projects/ProjectEditorPage.tsx'
import StudentPortfolioPage from './pages/portal/student/portfolio/StudentPortfolioPage.tsx'
import ProjectCollaboration from './pages/portal/student/projects/ProjectCollaboration.tsx'
import ProjectInvitationsPage from './pages/portal/student/invitations/ProjectInvitationsPage.tsx'
import NotificationCenter from './pages/portal/shared/notifications/NotificationCenter.tsx'

// Shared Pages
import FavoritesPage from './pages/portal/shared/favorites/FavoritesPage.tsx'
import CommunicationsPage from './pages/portal/shared/communications/CommunicationsPage.tsx'
import ProjectDetailsPage from './pages/portal/shared/projects/ProjectDetailsPage.tsx'

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
          { path: 'projects/:id', element: <ProjectEditorPage /> },
          { path: 'projects/new', element: <ProjectEditorPage /> },
          { path: 'search', element: <SearchHubPage /> },
          { path: 'internships', element: <InternshipExplorerPage /> },
          { path: 'portfolio', element: <StudentPortfolioPage /> },
          { path: 'favorites', element: <FavoritesPage /> },
          { path: 'communications', element: <CommunicationsPage /> },
          { path: 'projects/:id/collaboration', element: <ProjectCollaboration /> },
          { path: 'invitations', element: <ProjectInvitationsPage /> },
                    { path: 'notifications', element: <NotificationCenter /> },
          { path: 'projects/:id/view', element: <ProjectDetailsPage /> }
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
          { path: 'search', element: <SearchHubPage /> },
          { path: 'favorites', element: <FavoritesPage /> },
          { path: 'communications', element: <CommunicationsPage /> },
                    { path: 'notifications', element: <NotificationCenter /> },
          { path: 'projects/:id/view', element: <ProjectDetailsPage /> }
        ]
      },
      {
        path: 'instructor',
        element: <InstructorLayout />,
        children: [
          { index: true, element: <InstructorProfilePage /> },
          { path: 'profile', element: <InstructorProfilePage /> },
          { path: 'courses', element: <MyCourses /> },
          { path: 'search', element: <SearchHubPage /> },
          { path: 'communications', element: <CommunicationsPage /> },
          { path: 'notifications', element: <NotificationCenter /> },
          { path: 'projects/:id/view', element: <ProjectDetailsPage /> },
          { path: 'invitations', element: <ProjectInvitationsPage /> }
      ]
      },
      {
        path: 'administrator',
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminPage /> },
          { path: 'verification', element: <EmployerVerificationPage /> },
          { path: 'users', element: <UserDirectoryPage /> },
          { path: 'courses', element: <CourseDirectoryPage /> },
          { path: 'moderation', element: <ContentModerationPage /> },
          { path: 'search', element: <SearchHubPage /> },
                    { path: 'notifications', element: <NotificationCenter /> },
          { path: 'projects/:id/view', element: <ProjectDetailsPage /> }
        ]
      },
    ]
  }
])
