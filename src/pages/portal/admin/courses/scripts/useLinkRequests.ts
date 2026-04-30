import { useState } from 'react'

export interface LinkRequest {
  id: string
  instructorName: string
  instructorEmail: string
  courseName: string
  courseCode: string
  type: 'link' | 'unlink'
  status: 'pending' | 'accepted' | 'rejected'
  date: string
}

const dummyRequests: LinkRequest[] = [
  {
    id: 'req1',
    instructorName: 'Dr. John Doe',
    instructorEmail: 'john.doe@guc.edu.eg',
    courseName: 'Software Engineering',
    courseCode: 'CS311',
    type: 'link',
    status: 'pending',
    date: '2026-04-28'
  },
  {
    id: 'req2',
    instructorName: 'Dr. Jane Smith',
    instructorEmail: 'jane.smith@guc.edu.eg',
    courseName: 'Web Programming',
    courseCode: 'CS341',
    type: 'unlink',
    status: 'pending',
    date: '2026-04-29'
  }
]

export function useLinkRequests() {
  const [requests, setRequests] = useState<LinkRequest[]>(dummyRequests)
  const pendingRequests = requests.filter(r => r.status === 'pending')

  const acceptRequest = (id: string) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: 'accepted' } : r))
    // Simulate notification requirement 58 is handled here implicitly or by another hook reading this state
    alert(`Link request ${id} accepted. Instructor notified.`)
  }

  const rejectRequest = (id: string) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: 'rejected' } : r))
    alert(`Link request ${id} rejected. Instructor notified.`)
  }

  return {
    requests,
    pendingRequests,
    acceptRequest,
    rejectRequest
  }
}
