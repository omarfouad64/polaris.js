import { createBrowserRouter, Navigate, useLocation } from 'react-router-dom'
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
import ErrorPage from './pages/error/ErrorPage.tsx'

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
          { path: 'projects', element: <div className="text-white">Student Projects</div> },
          { path: 'explorer', element: <ExplorerPage /> },
          { path: 'portfolio', element: <div className="text-white">Student Portfolio</div> },
          { path: 'communications', element: <div className="text-white">Student Chat</div> }
        ]
      },
      {
        path: 'employer',
        element: <div className="space-y-6">
          <h1 className="text-3xl font-jakarta font-bold text-white">Employer Portal</h1>
          <div className="grid grid-cols-2 gap-6">
            <div className="h-64 bg-surface-container rounded-3xl border border-surface-variant flex items-center justify-center text-on-surface-variant">Talent Pool View</div>
            <div className="h-64 bg-surface-container rounded-3xl border border-surface-variant flex items-center justify-center text-on-surface-variant">Job Postings</div>
          </div>
        </div>
      },
      {
        path: 'instructor',
        element: <div className="space-y-6">
          <h1 className="text-3xl font-jakarta font-bold text-white">Instructor Dashboard</h1>
          <div className="grid grid-cols-3 gap-6">
            <div className="h-48 bg-primary-container/20 rounded-2xl border border-primary/10 flex items-center justify-center text-primary">Grades</div>
            <div className="h-48 bg-secondary-container/20 rounded-2xl border border-secondary/10 flex items-center justify-center text-secondary">Projects</div>
            <div className="h-48 bg-surface-container rounded-2xl border border-surface-container flex items-center justify-center text-on-surface-variant">Class Chat</div>
          </div>
        </div>
      },
      {
        path: 'administrator',
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminPage /> },
          { path: 'verification', element: <div className="text-white">Verification Section</div> },
          { path: 'users', element: <div className="text-white">User Management Section</div> },
          { path: 'courses', element: <div className="text-white">Course Directory Section</div> },
          { path: 'moderation', element: <div className="text-white">Content Moderation Section</div> }
        ]
      }
    ]
  }
])
