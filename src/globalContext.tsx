import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

import { type UserRole } from './types'

interface User {
  username: string
  role: UserRole
  fullName?: string
  email?: string
  profilePicture?: string | null
}

interface GlobalContextType {
  user: User | null
  login: (username: string, role: UserRole) => void
  logout: () => void
  updateUser: (updates: Partial<User>) => void
  isLoggedIn: boolean
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined)

export function GlobalProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('polaris_user')
    return savedUser ? JSON.parse(savedUser) : null
  })

  useEffect(() => {
    if (user) {
      localStorage.setItem('polaris_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('polaris_user')
    }
  }, [user])

  const login = (username: string, role: UserRole) => {
    // Initial login might not have full details, but we can set defaults
    setUser({ 
      username, 
      role, 
      fullName: username, 
      email: `${username.toLowerCase().replace(' ', '.')}@${role === 'Student' ? 'student.guc.edu.eg' : 'guc.edu.eg'}` 
    })
  }

  const logout = () => {
    setUser(null)
  }

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null)
  }

  const value = {
    user,
    login,
    logout,
    updateUser,
    isLoggedIn: !!user
  }

  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  )
}

export function useGlobalContext() {
  const context = useContext(GlobalContext)
  if (context === undefined) {
    throw new Error('useGlobalContext must be used within a GlobalProvider')
  }
  return context
}
