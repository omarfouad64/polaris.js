import { useMemo } from 'react'
import useDatabase from './useDatabase'
import { useGlobalContext } from '../globalContext'

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

/**
 * useStudentStats — reads projects and collaborators from Redux store and computes statistics.
 */
export default function useStudentStats() {
  const { projects, projectCollaborators } = useDatabase()
  const { user } = useGlobalContext()

  const projectsWithStats = useMemo(() => {
    // Filter projects where user is owner or accepted collaborator
    const userProjects = projects.filter(p => {
      if (p.ownerId === user?.username) return true
      const isCollab = projectCollaborators.some(
        c => c.projectId === p.id && 
             c.collaboratorId === user?.username && 
             c.invitationStatus === 'accepted'
      )
      return isCollab
    })

    return userProjects.map(p => ({
      id: p.id,
      title: p.title,
      courseId: p.courseId,
      isPublic: p.isPublic,
      status: p.status,
      tasks: p.tasks,
      languages: p.languages,
    }))
  }, [projects, projectCollaborators, user])

  const totalProjects = projectsWithStats.length
  const publicProjects = projectsWithStats.filter(p => p.isPublic).length
  const activeProjects = projectsWithStats.filter(p => p.status === 'active').length
  const totalTasks = projectsWithStats.reduce((acc, p) => acc + (p.tasks?.length || 0), 0)

  const languageStats = useMemo((): LanguageStat[] => {
    const langMap: Record<string, number> = {}
    projectsWithStats.forEach(p => {
      const langs = p.languages || []
      langs.forEach((lang: string) => { langMap[lang] = (langMap[lang] || 0) + 1 })
    })
    const total = Object.values(langMap).reduce((sum, n) => sum + n, 0)
    return Object.entries(langMap)
      .sort(([, a], [, b]) => b - a)
      .map(([language, count]) => ({ language, count, percentage: total > 0 ? Math.round((count / total) * 100) : 0 }))
  }, [projectsWithStats])

  const projectsWithCollaborators = useMemo((): ProjectWithCollaborators[] => {
    const collaboratorMap: Record<string, ProjectCollaboratorStat[]> = {}
    projectCollaborators.filter(c => c.invitationStatus === 'accepted').forEach(c => {
      if (!collaboratorMap[c.projectId]) {
        collaboratorMap[c.projectId] = []
      }
      const existing = collaboratorMap[c.projectId].find(x => x.id === c.id)
      if (!existing) {
        collaboratorMap[c.projectId].push({
          id: c.id,
          name: c.name,
          role: c.role,
          taskCount: 1
        })
      }
    })

    return projectsWithStats.map(p => ({
      projectId: p.id,
      projectTitle: p.title,
      topCollaborators: (collaboratorMap[p.id] ?? []).sort((a, b) => b.taskCount - a.taskCount).slice(0, 3),
    }))
  }, [projectsWithStats, projectCollaborators])

  return {
    totalProjects,
    publicProjects,
    activeProjects,
    totalTasks,
    languageStats,
    projectsWithCollaborators,
  }
}
