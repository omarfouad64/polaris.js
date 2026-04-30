import { useState } from 'react'

export interface FlaggedProject {
  id: string
  title: string
  studentName: string
  studentEmail: string
  course: string
  flaggedBy: string
  reason: string
  dateFlagged: string
  status: 'active' | 'deactivated'
}

export interface Appeal {
  id: string
  projectId: string
  projectTitle: string
  studentName: string
  message: string
  dateSubmitted: string
  status: 'pending' | 'accepted' | 'rejected'
}

const dummyFlaggedProjects: FlaggedProject[] = [
  {
    id: 'proj1',
    title: 'E-Commerce Website',
    studentName: 'Alice Johnson',
    studentEmail: 'alice.j@student.guc.edu.eg',
    course: 'Web Programming',
    flaggedBy: 'Dr. Jane Smith',
    reason: 'High similarity index with public GitHub repository (Potential Plagiarism).',
    dateFlagged: '2026-04-20',
    status: 'active'
  },
  {
    id: 'proj2',
    title: 'Smart Home IoT',
    studentName: 'Bob Smith',
    studentEmail: 'bob.s@student.guc.edu.eg',
    course: 'Bachelor Project',
    flaggedBy: 'Dr. John Doe',
    reason: 'Contains inappropriate/unprofessional content in the demo video.',
    dateFlagged: '2026-04-25',
    status: 'deactivated'
  }
]

const dummyAppeals: Appeal[] = [
  {
    id: 'app1',
    projectId: 'proj1',
    projectTitle: 'E-Commerce Website',
    studentName: 'Alice Johnson',
    message: 'The repository linked is actually my own from a previous self-study project. I adapted it for this course, but I am the original author. Please see the commit history on GitHub.',
    dateSubmitted: '2026-04-21',
    status: 'pending'
  }
]

export function useModeration() {
  const [flaggedProjects, setFlaggedProjects] = useState<FlaggedProject[]>(dummyFlaggedProjects)
  const [appeals, setAppeals] = useState<Appeal[]>(dummyAppeals)

  const toggleProjectStatus = (id: string, activate: boolean) => {
    setFlaggedProjects(flaggedProjects.map(p => 
      p.id === id ? { ...p, status: activate ? 'active' : 'deactivated' } : p
    ))
  }

  const acceptAppeal = (appealId: string, projectId: string) => {
    setAppeals(appeals.map(a => a.id === appealId ? { ...a, status: 'accepted' } : a))
    setFlaggedProjects(flaggedProjects.map(p => 
      p.id === projectId ? { ...p, status: 'active' } : p
    ))
    alert('Appeal accepted. Project has been activated.')
  }

  const rejectAppeal = (appealId: string) => {
    setAppeals(appeals.map(a => a.id === appealId ? { ...a, status: 'rejected' } : a))
    alert('Appeal rejected.')
  }

  return {
    flaggedProjects,
    appeals,
    toggleProjectStatus,
    acceptAppeal,
    rejectAppeal
  }
}
