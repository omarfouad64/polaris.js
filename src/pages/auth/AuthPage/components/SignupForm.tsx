import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../../../../globalContext'
import useUsers from '../../../../hooks/useUsers'
import type { UserRole } from '../../../../types'
import Input from '../../../../components/Input'
import Button from '../../../../components/Button'

interface SignupFormProps {
  role: UserRole
  setRole: (role: UserRole) => void
}

export default function SignupForm({ role, setRole }: SignupFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [taxCertificate, setTaxCertificate] = useState<File | null>(null)
  const [error, setError] = useState('')
  
  const { login } = useGlobalContext()
  const { registerUser } = useUsers()
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    if (role !== 'Employer' && !email.endsWith('@guc.edu.eg')) {
      setError('Please use your GUC email (@guc.edu.eg)')
      return
    }

    if (role === 'Employer' && !taxCertificate) {
      setError('Please upload your Tax Certificate PDF')
      return
    }

    registerUser(email, role, password)
    login(email, role)
    navigate('/')
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <label className="font-jakarta text-label-md text-on-surface-variant px-1 font-bold">I am joining as a:</label>
        <div className="flex p-1 bg-surface-container rounded-xl border border-surface-variant">
          {(['Student', 'Employer', 'Course Instructor'] as UserRole[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`flex-1 py-3 text-center rounded-lg font-jakarta text-sm font-bold transition-all ${
                role === r 
                  ? 'bg-primary text-on-primary shadow-lg' 
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'
              }`}
            >
              {r === 'Course Instructor' ? 'Instructor' : r}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-5">
        {role === 'Employer' && (
          <Input 
            label="Company Name" 
            placeholder="Acme Corp" 
            value={companyName} 
            onChange={(e) => setCompanyName(e.target.value)}
            icon={<span className="material-symbols-outlined">apartment</span>}
            required 
          />
        )}

        {role !== 'Employer' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="First Name" 
              placeholder="Jane" 
              value={firstName} 
              onChange={(e) => setFirstName(e.target.value)}
              required 
            />
            <Input 
              label="Last Name" 
              placeholder="Doe" 
              value={lastName} 
              onChange={(e) => setLastName(e.target.value)}
              required 
            />
          </div>
        )}

        <Input 
          label={role === 'Employer' ? 'Company Email' : 'University Email'} 
          type="email" 
          placeholder={role === 'Employer' ? 'hr@company.com' : 'jane.doe@guc.edu.eg'} 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<span className="material-symbols-outlined">mail</span>}
          required 
        />
        
        <div className="space-y-2">
          <Input 
            label="Password" 
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<span className="material-symbols-outlined">lock</span>}
            required 
          />
          <p className="font-lexend text-xs text-outline ml-1 font-medium">Must be at least 8 characters.</p>
        </div>

        {role === 'Employer' && (
          <div className="flex flex-col gap-3">
            <label className="font-jakarta text-label-md text-on-surface-variant ml-1 font-bold">Verification Document (Tax Certificate)</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-outline-variant rounded-xl p-8 text-center bg-surface-container-low hover:bg-surface-container transition-all cursor-pointer flex flex-col items-center justify-center gap-4 group"
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".pdf"
                onChange={(e) => setTaxCertificate(e.target.files?.[0] || null)}
              />
              <span className="material-symbols-outlined text-primary text-5xl group-hover:scale-110 transition-transform">
                {taxCertificate ? 'check_circle' : 'upload_file'}
              </span>
              <div>
                <p className="font-lexend text-sm text-on-surface-variant font-medium">
                  {taxCertificate ? taxCertificate.name : 'Drag and drop PDF here, or'}
                </p>
                {!taxCertificate && <span className="font-jakarta text-sm font-bold text-primary inline-block mt-2 underline">Browse files</span>}
              </div>
            </div>
            <p className="font-lexend text-[10px] text-outline ml-1 uppercase tracking-widest font-bold">PDF only, max 5MB</p>
          </div>
        )}
      </div>

      {error && <p className="text-sm font-bold text-error bg-error/5 p-4 rounded-xl border border-error/20">{error}</p>}

      <Button type="submit" size="lg" className="w-full mt-4 py-4">
        Register Account
        <span className="material-symbols-outlined text-[18px] ml-2">arrow_forward</span>
      </Button>
    </form>
  )
}
