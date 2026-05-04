import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Header from './components/Header'

export default function PortalLayout() {
  const location = useLocation()

  return (
    <div className="flex h-screen bg-background overflow-hidden font-lexend">
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <div className="flex-1 overflow-auto p-10 bg-surface/50">
          <div className="max-w-7xl mx-auto" key={location.key}>
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  )
}
