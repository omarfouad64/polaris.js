import { Navigate, useLocation } from 'react-router-dom'
import { useGlobalContext } from '../globalContext'
import type { ReactNode } from 'react'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useGlobalContext()
  const location = useLocation()

  if (!isLoggedIn) {
    return <Navigate to="/auth" state={{ from: location }} replace />
  }

  return <>{children}</>
}
