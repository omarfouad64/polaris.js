import { useMemo, useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '../store'
import type { StudentPortfolio } from '../types'

/**
 * usePortfolioSearch — reads student portfolios from Redux store.
 */
export default function usePortfolioSearch() {
  const portfolios = useSelector((state: RootState) => state.database.students)
  const [filters, setFilters] = useState({
    query: '',
    major: 'all',
    skill: 'all',
    sortBy: 'updated_desc' as 'updated_desc' | 'projects_desc' | 'projects_asc',
  })

  const result = useMemo(() => {
    let r = [...portfolios] as StudentPortfolio[]
    if (filters.query.trim()) {
      const q = filters.query.toLowerCase()
      r = r.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.major.toLowerCase().includes(q) ||
        p.skills.some(skill => skill.toLowerCase().includes(q))
      )
    }
    if (filters.major !== 'all') {
      r = r.filter(p => p.major === filters.major)
    }
    if (filters.skill !== 'all') {
      r = r.filter(p => p.skills.includes(filters.skill))
    }
    r.sort((a, b) => {
      if (filters.sortBy === 'projects_desc') return b.projectCount - a.projectCount
      if (filters.sortBy === 'projects_asc') return a.projectCount - b.projectCount
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    })
    return r
  }, [portfolios, filters])

  const recommendedPortfolios = useMemo(
    () => [...portfolios]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 3),
    [portfolios]
  )

  const availableMajors = useMemo(
    () => Array.from(new Set(portfolios.map(p => p.major))),
    [portfolios]
  )

  const availableSkills = useMemo(() => {
    const all = portfolios.flatMap(p => p.skills)
    return Array.from(new Set(all))
  }, [portfolios])

  const updateFilters = useCallback((updates: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...updates }))
  }, [])

  return {
    portfolios: result,
    recommendedPortfolios,
    availableMajors,
    availableSkills,
    filters,
    updateFilters,
  }
}
