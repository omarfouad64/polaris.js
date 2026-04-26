import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

import { type UserRole } from './types'

interface User {
  username: string
  role: UserRole
}

interface GlobalContextType {
  user: User | null
  login: (username: string, role: UserRole) => void
  logout: () => void
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
    setUser({ username, role })
  }

  const logout = () => {
    setUser(null)
  }

  const value = {
    user,
    login,
    logout,
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
