import { type UserRole } from '../types'
import useDatabase from './useDatabase'
import { registerUser as registerUserAction } from '../store/databaseSlice'

/**
 * useUsers — manages user data for login simulation via Redux.
 */
export default function useUsers() {
  const { users, dispatch } = useDatabase()

  const registerUser = (username: string, role: UserRole, _password = 'password') => {
    dispatch(registerUserAction({ username, role, password: _password }))
    return true
  }

  const findUser = (username: string) => users.find(u => u.username === username)

  return { users, registerUser, findUser }
}
