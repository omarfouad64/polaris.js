import { Outlet } from 'react-router-dom'

export default function EmployerLayout(): React.JSX.Element {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-jakarta text-4xl font-extrabold text-on-surface">Employer Portal</h1>
        <p className="font-lexend text-on-surface-variant">Manage your company, internships, and talent pipeline.</p>
      </div>

      <div>
        <Outlet />
      </div>
    </div>
  )
}
