import React from 'react'
import { useLocation } from 'react-router-dom'

export default function Header() {
  const location = useLocation()
  
  // Extract page name from path (e.g., /portal/student/projects -> Projects)
  const pathParts = location.pathname.split('/').filter(Boolean)
  const lastPart = pathParts[pathParts.length - 1]
  const pageName = lastPart 
    ? lastPart.charAt(0).toUpperCase() + lastPart.slice(1).replace(/-/g, ' ')
    : 'Dashboard'

  return (
    <header className="h-20 bg-surface-container-lowest border-b border-surface-container flex items-center justify-between px-10 shadow-sm">
      <h2 className="font-jakarta text-xl font-bold text-on-surface">
        {pageName}
      </h2>
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full hover:bg-surface-container text-on-surface-variant transition-colors">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <div className="h-8 w-px bg-surface-container mx-2"></div>
        <div className="w-10 h-10 rounded-full bg-surface-container-high border-2 border-surface-container"></div>
      </div>
    </header>
  )
}
