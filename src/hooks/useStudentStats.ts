import { useMemo } from 'react'
import useStudentProjects from '../pages/portal/student/projects/scripts/useStudentProjects'

export interface LanguageStat {
  language: string
  count: number
  percentage: number
}

export interface ProjectCollaboratorStat {
  id: string
  name: string
  role: string
  taskCount: number
}

export interface ProjectWithCollaborators {
  projectId: string
  projectTitle: string
  topCollaborators: ProjectCollaboratorStat[]
}

// Dummy collaborator data per project (encapsulated in hook as per data architecture rules)
const DUMMY_COLLABORATORS: Record<string, ProjectCollaboratorStat[]> = {
  'proj-001': [
    { id: 'c-001', name: 'Ahmed Hassan', role: 'Lead Developer', taskCount: 4 },
    { id: 'c-002', name: 'Mariam Khalil', role: 'Frontend Dev', taskCount: 2 },
    { id: 'c-003', name: 'Sara Ali', role: 'Backend Dev', taskCount: 3 },
  ],
  'proj-002': [
    { id: 'c-004', name: 'Omar Ibrahim', role: 'ML Engineer', taskCount: 5 },
    { id: 'c-005', name: 'Fatima Mousa', role: 'Data Analyst', taskCount: 3 },
  ],
  'proj-003': [
    { id: 'c-006', name: 'Khaled Nasser', role: 'Mobile Dev', taskCount: 6 },
  ],
}

export const LANG_PALETTE = [
  '#1f108e', '#006a61', '#722f00', '#3730a3', '#006f66',
  '#4f1e00', '#464553', '#0b1c30', '#777584', '#9e6b00',
]

/**
 * useStudentStats — computes portfolio-level statistics for the logged-in student.
 * Covers Requirement 72: total projects, programming language percentages,
 * and top collaborators per project.
 *
 * @returns Aggregated stats: totalProjects, publicProjects, activeProjects,
 *          languageStats, projectsWithCollaborators.
 */
export default function useStudentStats() {
  const { projects } = useStudentProjects()

  const totalProjects = projects.length
  const publicProjects = projects.filter(p => p.isPublic).length
  const activeProjects = projects.filter(p => p.status === 'active').length
  const totalTasks = projects.reduce((acc, p) => acc + p.tasks.length, 0)

  const languageStats = useMemo((): LanguageStat[] => {
    const langMap: Record<string, number> = {}
    projects.forEach(p => {
      p.languages.forEach(lang => {
        langMap[lang] = (langMap[lang] || 0) + 1
      })
    })
    const total = Object.values(langMap).reduce((sum, n) => sum + n, 0)
    return Object.entries(langMap)
      .sort(([, a], [, b]) => b - a)
      .map(([language, count]) => ({
        language,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      }))
  }, [projects])

  const projectsWithCollaborators = useMemo((): ProjectWithCollaborators[] =>
    projects.map(p => ({
      projectId: p.id,
      projectTitle: p.title,
      topCollaborators: (DUMMY_COLLABORATORS[p.id] ?? [])
        .sort((a, b) => b.taskCount - a.taskCount)
        .slice(0, 3),
    }))
  , [projects])

  return {
    totalProjects,
    publicProjects,
    activeProjects,
    totalTasks,
    languageStats,
    projectsWithCollaborators,
  }
}
