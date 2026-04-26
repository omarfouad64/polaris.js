import { useState } from 'react'
import type { UserRole } from '../types'

interface MockUser {
  username: string
  password: string // Mocking password for login simulation
  role: UserRole
}

// In-memory "database"
const initialUsers: MockUser[] = [
  { username: 'admin@guc.edu.eg', password: 'password', role: 'Administrator' },
  { username: 'student@guc.edu.eg', password: 'password', role: 'Student' },
  { username: 'employer@company.com', password: 'password', role: 'Employer' },
  { username: 'instructor@guc.edu.eg', password: 'password', role: 'Course Instructor' }
]

let mockDb = [...initialUsers]

export default function useUsers() {
  const [users, setUsers] = useState<MockUser[]>(mockDb)

  const registerUser = (username: string, role: UserRole, password = 'password') => {
    const newUser = { username, role, password }
    mockDb = [...mockDb, newUser]
    setUsers(mockDb)
    console.log('User registered:', newUser)
    return true
  }

  const findUser = (username: string) => {
    return mockDb.find(u => u.username === username)
  }

  return {
    users,
    registerUser,
    findUser
  }
}
