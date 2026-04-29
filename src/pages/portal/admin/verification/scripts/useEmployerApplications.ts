import { useState } from 'react'

export interface EmployerApplication {
  id: string
  companyName: string
  email: string
  appliedDate: string
  status: 'Pending' | 'Approved' | 'Rejected'
  bio: string
  address: string
  documentUrl: string
  logoUrl?: string
}

const dummyApplications: EmployerApplication[] = [
  {
    id: 'emp1',
    companyName: 'Siemens Healthineers',
    email: 'hr@siemens-healthineers.com',
    appliedDate: '2023-10-24',
    status: 'Pending',
    bio: 'Pioneering breakthroughs in healthcare. For everyone. Everywhere.',
    address: 'Henkestr. 127, 91052 Erlangen, Germany',
    documentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    logoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQTlMc_YBmlyB07w_tsEjldVkmKgf1xpRE79PGKYoNSI0-S_H2y3CD9qcUSlzO5avoG-rnWc0jKh4mzRYPZGBChQZDHL4h8FoYpeji2NhXjIHxfSKvWYs1p5-Ya_1qJmjN2nt1ONDIcHRsKtZkaHDb18AN93Ve6pueM2qWyUs7kcFQ5seeZULPPUZ3S43CB19qFYUzBHE3c4lxb-XJeicv_nnjpSA3jUiMkdpESBn8tmg9ZnliMgWtcMS1leOUacyBE7t9Fqf5dJ2Q'
  },
  {
    id: 'emp2',
    companyName: 'TechFlow Solutions',
    email: 'recruiting@techflow.io',
    appliedDate: '2023-10-25',
    status: 'Pending',
    bio: 'Agile software consulting and custom enterprise development.',
    address: '100 Tech Park Way, Suite 400, San Jose, CA',
    documentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  },
  {
    id: 'emp3',
    companyName: 'Global Corp',
    email: 'contact@globalcorp.com',
    appliedDate: '2023-10-20',
    status: 'Approved',
    bio: 'A multinational conglomerate.',
    address: '123 Global Ave, New York, NY',
    documentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  },
  {
    id: 'emp4',
    companyName: 'Shady Business LLC',
    email: 'admin@shady.biz',
    appliedDate: '2023-10-21',
    status: 'Rejected',
    bio: 'We definitely do real business.',
    address: 'Unknown',
    documentUrl: ''
  }
]

export function useEmployerApplications() {
  const [applications, setApplications] = useState<EmployerApplication[]>(dummyApplications)

  const acceptApplication = (id: string) => {
    setApplications(apps => apps.map(app => 
      app.id === id ? { ...app, status: 'Approved' } : app
    ))
  }

  const rejectApplication = (id: string) => {
    setApplications(apps => apps.map(app => 
      app.id === id ? { ...app, status: 'Rejected' } : app
    ))
  }

  const downloadDocument = (url: string, filename: string) => {
    // In a real application, this would trigger a download via API
    // For dummy implementation, we open the URL in a new tab if it exists
    if (!url) {
      alert('No document available to download.')
      return
    }
    
    // Create a temporary anchor to trigger download (simulated)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.target = '_blank'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return {
    applications,
    acceptApplication,
    rejectApplication,
    downloadDocument
  }
}
