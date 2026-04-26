import React from 'react'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-jakarta text-3xl font-extrabold text-on-surface">Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-32 bg-primary-container/20 rounded-2xl border border-primary/10"></div>
        <div className="h-32 bg-secondary-container/20 rounded-2xl border border-secondary/10"></div>
        <div className="h-32 bg-surface-container-highest rounded-2xl border border-surface-container"></div>
      </div>
    </div>
  )
}
