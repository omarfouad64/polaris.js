import { Outlet, useLocation } from 'react-router-dom'

export default function EmployerLayout(): React.JSX.Element {
  const location = useLocation()
  const isDashboard = location.pathname === '/portal/employer'

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Outlet />
      </div>
    </div>
  )
}
