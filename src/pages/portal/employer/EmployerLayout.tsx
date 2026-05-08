import { Outlet } from 'react-router-dom'

export default function EmployerLayout(): React.JSX.Element {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <Outlet />
      </div>
    </div>
  )
}
