import { useState, useMemo, useCallback } from 'react'
import useDatabase from './useDatabase'
import { applyForInternship as applyForInternshipAction } from '../store/databaseSlice'
import type { Internship } from '../types'

/**
 * useInternshipSearch — reads internships and applications from Redux store.
 */
export default function useInternshipSearch(currentStudentId = 'student_1', currentStudentName = 'Alice Smith', currentStudentEmail = 'alice.smith@student.guc.edu.eg') {
  const { internships, applications, completedInternships, dispatch } = useDatabase()

  const [searchQuery, setSearchQuery] = useState('')
  const [companyFilter, setCompanyFilter] = useState('')
  const [durationFilter, setDurationFilter] = useState<string[]>([])
  const [postedDateFrom, setPostedDateFrom] = useState('')
  const [postedDateTo, setPostedDateTo] = useState('')
  const [sortOrder, setSortOrder] = useState<'posted_desc' | 'posted_asc'>('posted_desc')

  const filteredInternships = useMemo(() => {
    let results = internships.filter((i: Internship) => !i.archived)
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      results = results.filter(i =>
        i.title.toLowerCase().includes(q) || i.companyName.toLowerCase().includes(q)
      )
    }
    if (companyFilter) {
      const cf = companyFilter.toLowerCase()
      results = results.filter(i => i.companyName.toLowerCase().includes(cf))
    }
    if (durationFilter.length > 0) {
      results = results.filter((i: Internship) => durationFilter.includes(i.duration))
    }
    if (postedDateFrom) {
      const from = new Date(postedDateFrom).getTime()
      results = results.filter((i: Internship) => new Date(i.postedAt).getTime() >= from)
    }
    if (postedDateTo) {
      const to = new Date(postedDateTo).getTime()
      results = results.filter((i: Internship) => new Date(i.postedAt).getTime() <= to)
    }
    results.sort((a: Internship, b: Internship) => {
      const aT = new Date(a.postedAt).getTime()
      const bT = new Date(b.postedAt).getTime()
      return sortOrder === 'posted_desc' ? bT - aT : aT - bT
    })
    return results
  }, [searchQuery, companyFilter, durationFilter, postedDateFrom, postedDateTo, sortOrder, internships])

  const applyForInternship = useCallback((internshipId: string, coverLetter: string) => {
    const internship = internships.find(i => i.id === internshipId)
    if (!internship) return
    
    dispatch(applyForInternshipAction({
      internshipId,
      internshipTitle: internship.title,
      companyName: internship.companyName,
      studentId: currentStudentId,
      studentName: currentStudentName,
      studentEmail: currentStudentEmail,
      coverLetter
    }))
  }, [dispatch, internships, currentStudentId, currentStudentName, currentStudentEmail])

  const hasApplied = useCallback((internshipId: string) => {
    return applications.some(a => a.internshipId === internshipId && a.studentId === currentStudentId)
  }, [applications, currentStudentId])

  const toggleDurationFilter = (duration: string) => {
    setDurationFilter(prev =>
      prev.includes(duration) ? prev.filter(d => d !== duration) : [...prev, duration]
    )
  }

  return {
    internships: filteredInternships,
    applications: applications.filter(a => a.studentId === currentStudentId),
    completedInternships,
    searchQuery,
    setSearchQuery,
    companyFilter,
    setCompanyFilter,
    durationFilter,
    toggleDurationFilter,
    postedDateFrom,
    setPostedDateFrom,
    postedDateTo,
    setPostedDateTo,
    sortOrder,
    setSortOrder,
    applyForInternship,
    hasApplied,
  }
}
