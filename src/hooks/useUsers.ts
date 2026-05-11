import { type UserRole } from '../types'
import useDatabase from './useDatabase'
import { registerUser as registerUserAction } from '../store/databaseSlice'

/**
 * useUsers — manages user data for login simulation via Redux.
 */
export default function useUsers() {
  const { users, companies, dispatch } = useDatabase()

  const registerUser = (username: string, role: UserRole, _password = 'password', firstName?: string, lastName?: string) => {
    dispatch(registerUserAction({ username, role, password: _password, firstName, lastName }))
    return true
  }

  const findUser = (username: string) => users.find(u => u.username === username)

  const findCompany = (email: string) => {
    const company = companies.find((c: any) => c.contactEmail === email)
    return company || null
  }

  return { users, registerUser, findUser, findCompany }
}
