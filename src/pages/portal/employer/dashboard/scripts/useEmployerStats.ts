import { useState } from 'react'
import type { EmployerStats } from '../../../../../types'

const dummyStats: EmployerStats = {
  internshipsOffered: 12,
  studentsPlaced: 34,
  placementsOverTime: [
    { month: 'May 25', placements: 2, internships: 1 },
    { month: 'Jun 25', placements: 3, internships: 2 },
    { month: 'Jul 25', placements: 5, internships: 2 },
    { month: 'Aug 25', placements: 4, internships: 1 },
    { month: 'Sep 25', placements: 2, internships: 1 },
    { month: 'Oct 25', placements: 3, internships: 2 },
    { month: 'Nov 25', placements: 1, internships: 1 },
    { month: 'Dec 25', placements: 2, internships: 0 },
    { month: 'Jan 26', placements: 4, internships: 3 },
    { month: 'Feb 26', placements: 3, internships: 2 },
    { month: 'Mar 26', placements: 2, internships: 1 },
    { month: 'Apr 26', placements: 3, internships: 2 }
  ]
}

/**
 * useEmployerStats — provides employer dashboard statistics for internships and placements.
 *
 * @returns stats object with totals and monthly placement data.
 */
export default function useEmployerStats(): EmployerStats {
  const [stats] = useState<EmployerStats>(dummyStats)
  return stats
}
