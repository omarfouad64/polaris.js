import { useState, useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import type { UserRole } from '../../types'
import Branding from './AuthPage/components/Branding'

export default function AuthLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const isLogin = location.pathname === '/auth/login' || location.pathname === '/auth'
  const [role, setRole] = useState<UserRole>('Student')

  useEffect(() => {
    console.log('%c Polaris Auth Layout Loaded ', 'background: #1f108e; color: white; font-weight: bold; padding: 4px;')
  }, [])

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background antialiased overflow-x-hidden">
      {/* Left Side: Branding & Imagery */}
      <Branding role={role} />

      {/* Right Side: Form Container */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-surface">
        <div className="w-full max-w-xl bg-surface-container-lowest rounded-3xl shadow-[0_20px_50px_rgba(31,16,142,0.1)] p-10 lg:p-16 flex flex-col gap-10 border border-surface-container">
          {/* Form Header */}
          <div className="text-center md:text-left space-y-3">
            <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
              <div className="bg-primary-container p-2 rounded-lg">
                <span className="material-symbols-outlined text-on-primary text-[28px] fill-1">explore</span>
              </div>
              <span className="font-jakarta text-2xl font-bold text-primary">Project Polaris</span>
            </div>
            <h1 className="font-jakarta text-3xl font-extrabold text-on-surface">
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h1>
            <p className="font-lexend text-base text-on-surface-variant">
              {isLogin ? 'Please enter your details to sign in to your portal.' : 'Start organizing your projects and collaborating today.'}
            </p>
          </div>

          {/* Child Routes Content */}
          <Outlet context={{ role, setRole }} />

          {/* Tab Switcher / Footer */}
          <div className="text-center pt-4">
            <span className="font-lexend text-sm text-on-surface-variant">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
            </span>
            <button 
              type="button"
              onClick={() => {
                navigate(isLogin ? '/auth/signup' : '/auth/login')
              }}
              className="font-jakarta text-sm font-extrabold text-primary hover:text-secondary ml-2 transition-colors underline underline-offset-4"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
