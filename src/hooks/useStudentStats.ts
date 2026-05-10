import { useMemo } from 'react'
import useDatabase from './useDatabase'

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

export const LANG_PALETTE = [
  '#1f108e', '#006a61', '#722f00', '#3730a3', '#006f66',
  '#4f1e00', '#464553', '#0b1c30', '#777584', '#9e6b00',
]

export interface ProjectWithCollaborators {
  projectId: string
  projectTitle: string
  topCollaborators: ProjectCollaboratorStat[]
}

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

/**
 * useStudentStats — reads projects from Redux store and computes statistics.
 */
export default function useStudentStats() {
  const { projects } = useDatabase()

  // Map Redux projects to the shape expected by useStudentStats consumers
  const projectsWithStats = useMemo(() => {
    return projects.map(p => ({
      id: p.id,
      title: p.title,
      courseId: p.courseId,
      // Additional fields expected by stats consumers are synthesized
      isPublic: true,
      status: 'active' as const,
      tasks: [],
      languages: [] as string[],
    }))
  }, [projects])

  const totalProjects = projectsWithStats.length
  const publicProjects = projectsWithStats.filter(p => (p as any).isPublic).length
  const activeProjects = projectsWithStats.filter(p => (p as any).status === 'active').length
  const totalTasks = projectsWithStats.reduce((acc, p) => acc + ((p as any).tasks?.length || 0), 0)

  const languageStats = useMemo((): LanguageStat[] => {
    const langMap: Record<string, number> = {}
    projectsWithStats.forEach(p => {
      const langs = (p as any).languages || []
      langs.forEach((lang: string) => { langMap[lang] = (langMap[lang] || 0) + 1 })
    })
    const total = Object.values(langMap).reduce((sum, n) => sum + n, 0)
    return Object.entries(langMap)
      .sort(([, a], [, b]) => b - a)
      .map(([language, count]) => ({ language, count, percentage: total > 0 ? Math.round((count / total) * 100) : 0 }))
  }, [projectsWithStats])

  const projectsWithCollaborators = useMemo((): ProjectWithCollaborators[] =>
    projectsWithStats.map(p => ({
      projectId: p.id,
      projectTitle: p.title,
      topCollaborators: (DUMMY_COLLABORATORS[p.id] ?? []).sort((a, b) => b.taskCount - a.taskCount).slice(0, 3),
    })),
    [projectsWithStats]
  )

  return {
    totalProjects,
    publicProjects,
    activeProjects,
    totalTasks,
    languageStats,
    projectsWithCollaborators,
  }
}
