import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../../components/Button'
import Input from '../../../components/Input'

type Step = 'email' | 'otp' | 'reset'

export default function ForgotPassword() {
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  
  const navigate = useNavigate()

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      setError('Please enter your email')
      return
    }
    const dummyOtp = Math.floor(100000 + Math.random() * 900000).toString()
    console.log(`OTP Sent to ${email}: ${dummyOtp}`)
    setStep('otp')
    setError('')
  }

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP')
      return
    }
    setStep('reset')
    setError('')
  }

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }
    console.log('Password reset successful for:', email)
    navigate('/auth')
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background p-4 overflow-hidden antialiased font-lexend">
      {/* Ambient Background Elements for Depth */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary-container/20 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-secondary-container/20 blur-[100px] pointer-events-none"></div>

      {/* Branding Logo - Positioned Top Left (Matching AuthPage) */}
      <div className="absolute top-16 left-16 z-20 flex items-center gap-4 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
        <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          <span className="material-symbols-outlined text-white text-[32px] fill-1">explore</span>
        </div>
        <span className="font-jakarta text-3xl font-extrabold text-white tracking-tight">Project Polaris</span>
      </div>

      <main className="w-full max-w-lg bg-surface/80 backdrop-blur-xl border border-outline-variant/40 rounded-2xl p-8 md:p-12 shadow-[0_8px_30px_rgb(55,48,163,0.08)] relative z-10 flex flex-col gap-10">
        {/* Header Section */}
        <div className="text-center flex flex-col items-center gap-4">
          <div className="w-14 h-14 bg-primary-container rounded-2xl flex items-center justify-center shadow-lg">
            <span className="material-symbols-outlined text-on-primary-container text-3xl">lock_reset</span>
          </div>
          <div className="space-y-2">
            <h1 className="font-jakarta text-3xl font-extrabold text-on-surface">Reset Password</h1>
            <p className="text-on-surface-variant max-w-xs mx-auto">
              Follow the steps below to securely regain access to your account.
            </p>
          </div>
        </div>

        {/* Multi-Step Progress Indicator */}
        <div className="relative flex items-center justify-between px-2 mb-12">
          {/* Background Track */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-outline-variant/30 z-0"></div>
          {/* Active Track */}
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-primary z-0 transition-all duration-500"
            style={{ width: step === 'email' ? '10%' : step === 'otp' ? '50%' : '100%' }}
          ></div>
          
          {/* Step 1: Email */}
          <div className="relative z-10 flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-md transition-all ${
              step === 'email' ? 'bg-primary text-on-primary ring-4 ring-primary-container/30' : 'bg-primary text-on-primary'
            }`}>
              {step === 'email' ? '1' : <span className="material-symbols-outlined text-sm">check</span>}
            </div>
            <span className={`text-xs font-bold absolute -bottom-7 whitespace-nowrap ${step === 'email' ? 'text-primary' : 'text-on-surface-variant'}`}>Email</span>
          </div>

          {/* Step 2: Verification */}
          <div className="relative z-10 flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all border-2 ${
              step === 'otp' ? 'bg-primary text-on-primary ring-4 ring-primary-container/30 border-primary' : 
              step === 'reset' ? 'bg-primary text-on-primary border-primary' :
              'bg-surface border-outline-variant text-on-surface-variant'
            }`}>
              {step === 'reset' ? <span className="material-symbols-outlined text-sm">check</span> : '2'}
            </div>
            <span className={`text-xs font-bold absolute -bottom-7 whitespace-nowrap ${step === 'otp' ? 'text-primary' : 'text-on-surface-variant'}`}>Verify Code</span>
          </div>

          {/* Step 3: New Password */}
          <div className="relative z-10 flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all border-2 ${
              step === 'reset' ? 'bg-primary text-on-primary ring-4 ring-primary-container/30 border-primary' : 
              'bg-surface border-outline-variant text-on-surface-variant'
            }`}>3</div>
            <span className={`text-xs font-bold absolute -bottom-7 whitespace-nowrap ${step === 'reset' ? 'text-primary' : 'text-on-surface-variant'}`}>New Password</span>
          </div>
        </div>

        {/* Step Form Area */}
        <div className="flex-grow flex flex-col justify-center">
          {step === 'email' && (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <Input 
                label="University Email Address" 
                type="email" 
                placeholder="e.g., student@university.edu" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<span className="material-symbols-outlined">mail</span>}
                required 
              />
              {error && <p className="text-sm font-bold text-error bg-error/5 p-3 rounded-lg border border-error/20">{error}</p>}
              <Button type="submit" size="lg" className="w-full gap-2 group">
                Send Verification Code
                <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </Button>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <Input 
                label="Verification Code" 
                placeholder="Enter 6-digit code" 
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                icon={<span className="material-symbols-outlined">pin</span>}
                required 
              />
              {error && <p className="text-sm font-bold text-error bg-error/5 p-3 rounded-lg border border-error/20">{error}</p>}
              <Button type="submit" size="lg" className="w-full">Verify Code</Button>
            </form>
          )}

          {step === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <Input 
                label="New Password" 
                type="password" 
                placeholder="••••••••" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                icon={<span className="material-symbols-outlined">lock</span>}
                required 
              />
              <Input 
                label="Confirm Password" 
                type="password" 
                placeholder="••••••••" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                icon={<span className="material-symbols-outlined">lock_reset</span>}
                required 
              />
              {error && <p className="text-sm font-bold text-error bg-error/5 p-3 rounded-lg border border-error/20">{error}</p>}
              <Button type="submit" size="lg" className="w-full">Update Password</Button>
            </form>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-4 pt-6 border-t border-outline-variant/30 text-center">
          <button 
            type="button"
            onClick={() => navigate('/auth')}
            className="inline-flex items-center gap-2 font-jakarta text-sm font-bold text-outline hover:text-primary transition-colors group"
          >
            <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
            Return to Sign In
          </button>
        </div>
      </main>
    </div>
  )
}
