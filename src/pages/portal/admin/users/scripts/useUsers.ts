import { useState } from 'react'

export interface User {
  id: string
  name: string
  email: string
  role: 'Student' | 'Faculty' | 'Admin' | 'Employer' | 'Staff'
  status: 'Active' | 'Deactivated'
  lastActive: string
  avatarUrl?: string
  initials?: string
}

const dummyUsers: User[] = [
  {
    id: 'u1',
    name: 'Sarah Jenkins',
    email: 's.jenkins@polaris.edu',
    role: 'Faculty',
    status: 'Active',
    lastActive: '2 hours ago',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCV7tLPleyVjwhGrfhP7uVDGJn_waQ5brbNwz20zRFHlf8yEoFTXWGQMo6ImgmNLBAtfkwXOFPZF2GYUpwj8pjFEI0T2535Ee90ICCW0lad5-claaUzVUUeDK45I0vtTHya3bsgtdk7vVXNDUhbpO3lyLkRO5Hh8JwmeaF_5WxvrRmYbo2z8hRF80gCmQ2XxfS5ZC_j8GylNoM2cFUKrjShn-T1WRmkSIhqeLpEa2kHpVmYAFwx__HALXGPdhBbgaql5dfeb5WAW-V5'
  },
  {
    id: 'u2',
    name: 'Marcus Rodriguez',
    email: 'm.rodriguez@polaris.edu',
    role: 'Student',
    status: 'Active',
    lastActive: 'Just now',
    initials: 'MR'
  },
  {
    id: 'u3',
    name: 'David Chen',
    email: 'd.chen@polaris.edu',
    role: 'Staff',
    status: 'Deactivated',
    lastActive: 'Oct 12, 2023',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDp9e8wsdIXi3_07a01Vhdnl2qrn0z8_ZKXyeQMZyoVEBANkXJX7Ucp-KrtRCMqerVE_H5Hqr71zvfJaFl82rG4etlGNgB9q7St2PfgKB_6F6UW7qWOcFXc2XEjLr6xQU7Z--dI40f20WSMm9cR49VCWzGM8xT3HaztnmNn0qbCwdZHh7r7x1JAUmyrQ2ksNNNrVqhWgfQH0UsxLIc9OV7uksEh79lo4QL6R8VAbYYCy4yd_xJCB93TTj6RDhAalYDtZ1PQGur_zd-H'
  },
  {
    id: 'u4',
    name: 'Elena Rostova',
    email: 'e.rostova@polaris.edu',
    role: 'Admin',
    status: 'Active',
    lastActive: '5 mins ago',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQTlMc_YBmlyB07w_tsEjldVkmKgf1xpRE79PGKYoNSI0-S_H2y3CD9qcUSlzO5avoG-rnWc0jKh4mzRYPZGBChQZDHL4h8FoYpeji2NhXjIHxfSKvWYs1p5-Ya_1qJmjN2nt1ONDIcHRsKtZkaHDb18AN93Ve6pueM2qWyUs7kcFQ5seeZULPPUZ3S43CB19qFYUzBHE3c4lxb-XJeicv_nnjpSA3jUiMkdpESBn8tmg9ZnliMgWtcMS1leOUacyBE7t9Fqf5dJ2Q'
  }
]

export function useUsers() {
  const [users, setUsers] = useState<User[]>(dummyUsers)

  const toggleUserStatus = (id: string) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        return { ...u, status: u.status === 'Active' ? 'Deactivated' : 'Active' }
      }
      return u
    }))
  }

  const addAdmin = (data: { name: string; email: string }) => {
    const newUser: User = {
      id: Math.random().toString(36).substring(7),
      name: data.name,
      email: data.email,
      role: 'Admin',
      status: 'Active',
      lastActive: 'Never',
      initials: data.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    }
    setUsers([newUser, ...users])
  }

  return {
    users,
    toggleUserStatus,
    addAdmin
  }
}
