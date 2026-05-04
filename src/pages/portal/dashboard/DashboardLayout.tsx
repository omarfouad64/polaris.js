import { Outlet } from 'react-router-dom'

export default function DashboardLayout() {
  return (
    <div className="flex flex-col gap-8">
      {/* Content Area for Sub-Tabs */}
      <Outlet />
    </div>
  )
}
