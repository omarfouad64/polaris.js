import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../../../../globalContext'
import useUsers from '../../../../hooks/useUsers'
import Input from '../../../../components/Input'
import Button from '../../../../components/Button'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useGlobalContext()
  const { findUser, findCompany } = useUsers()
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const user = findUser(email)
    if (user && user.password === password) {
      login(user.username, user.role)
      if (user.role === 'Employer') {
        const company = findCompany(email)
        if (company && company.approvalStatus === 'Pending') {
          navigate('/auth/employer-pending-verification')
        } else {
          navigate('/')
        }
      } else {
        navigate('/')
      }
    } else {
      setError('Invalid email or password')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <div className="space-y-5">
        <Input 
          label="Email" 
          type="email" 
          placeholder="example@email.com" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<span className="material-symbols-outlined">mail</span>}
          required 
        />
        <Input 
          label="Password" 
          type="password" 
          placeholder="••••••••" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<span className="material-symbols-outlined">lock</span>}
          required 
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input type="checkbox" id="remember" className="h-4 w-4 rounded border-outline-variant text-secondary focus:ring-secondary cursor-pointer" />
            <label htmlFor="remember" className="ml-2 block font-lexend text-sm text-on-surface-variant cursor-pointer font-medium">Remember me</label>
          </div>
          <button 
            type="button"
            onClick={() => navigate('/auth/forgot-password')}
            className="font-jakarta text-sm font-extrabold text-secondary hover:text-secondary-container transition-colors"
          >
            Forgot Password?
          </button>
        </div>
      </div>

      {error && <p className="text-sm font-bold text-error bg-error/5 p-4 rounded-xl border border-error/20">{error}</p>}

      <Button type="submit" size="lg" className="w-full mt-4 py-4">
        Sign In
      </Button>
    </form>
  )
}
