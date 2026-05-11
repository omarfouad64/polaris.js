import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { linkCourse, unlinkCourse, updateDatabase } from '../../../../../store/databaseSlice'
import type { RootState } from '../../../../../store'

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

export function useLinkRequests() {
  const dispatch = useDispatch()
  const courseLinks = useSelector((state: RootState) => state.database.courseLinks)
  const courses = useSelector((state: RootState) => state.database.courses)
  const instructors = useSelector((state: RootState) => state.database.instructors)
  const storedLinkRequests = useSelector((state: RootState) => state.database.linkRequests)

  const requests: LinkRequest[] = useMemo(() => {
    const linkRequests = courseLinks.map((link: any) => {
      const course = courses.find((c: any) => c.id === link.courseId)
      const instructor = instructors.find((i: any) => i.instructorId === link.instructorId)
      return {
        id: `${link.instructorId}-${link.courseId}`,
        instructorName: instructor?.name || 'Unknown',
        instructorEmail: link.instructorId,
        courseName: course?.name || 'Unknown',
        courseCode: course?.code || 'Unknown',
        type: link.status === 'pending' ? 'link' : 'unlink',
        status: link.status === 'pending' ? 'pending' : link.status === 'linked' ? 'accepted' : 'rejected',
        date: link.linkedAt?.split('T')[0] || ''
      }
    })
    const storedRequests: LinkRequest[] = (storedLinkRequests || []).map((req: any) => ({
      id: req.id,
      instructorName: req.instructorName,
      instructorEmail: req.instructorId,
      courseName: req.courseName,
      courseCode: courses.find((c: any) => c.id === req.courseId)?.code || 'Unknown',
      type: req.type,
      status: req.status,
      date: req.createdAt?.split('T')[0] || ''
    }))
    return [...linkRequests, ...storedRequests]
  }, [courseLinks, courses, instructors, storedLinkRequests])

  const pendingRequests = useMemo(() => requests.filter(r => r.status === 'pending'), [requests])

  const acceptRequest = (requestId: string) => {
    if (requestId.startsWith('link_req_')) {
      const stored = (storedLinkRequests || []).find((r: any) => r.id === requestId)
      if (stored) {
        dispatch(linkCourse({ instructorId: stored.instructorId, courseId: stored.courseId }))
        const updatedLinkRequests = (storedLinkRequests || []).map((r: any) =>
          r.id === requestId ? { ...r, status: 'accepted' as const } : r
        )
        dispatch(updateDatabase({ linkRequests: updatedLinkRequests }))
      }
    } else {
      const [instructorId, ...courseIdParts] = requestId.split('-')
      dispatch(linkCourse({ instructorId, courseId: courseIdParts.join('-') }))
    }
  }

  const rejectRequest = (requestId: string) => {
    if (requestId.startsWith('link_req_')) {
      const stored = (storedLinkRequests || []).find((r: any) => r.id === requestId)
      if (stored) {
        const updatedLinkRequests = (storedLinkRequests || []).map((r: any) =>
          r.id === requestId ? { ...r, status: 'rejected' as const } : r
        )
        dispatch(updateDatabase({ linkRequests: updatedLinkRequests }))
      }
    } else {
      const [instructorId, ...courseIdParts] = requestId.split('-')
      dispatch(unlinkCourse({ instructorId, courseId: courseIdParts.join('-') }))
    }
  }

  return {
    requests,
    pendingRequests,
    acceptRequest,
    rejectRequest
  }
}
