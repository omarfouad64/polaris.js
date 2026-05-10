
import { useOutletContext } from 'react-router-dom'
import type { UserRole } from '../../types'
import SignupForm from './AuthPage/components/SignupForm'

interface ContextType {
  role: UserRole
  setRole: (role: UserRole) => void
}

export default function SignupPage() {
  const { role, setRole } = useOutletContext<ContextType>()
  return <SignupForm role={role} setRole={setRole} />
}
