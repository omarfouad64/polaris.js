import { Outlet } from 'react-router-dom'

/**
 * InstructorLayout – main layout shell for instructor portal.
 */
export default function InstructorLayout() {
  return (
    <div className="min-h-screen bg-background">
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Outlet />
      </div>
    </div>
  )
}