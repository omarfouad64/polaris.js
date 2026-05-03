export type UserRole = 'Student' | 'Employer' | 'Course Instructor' | 'Administrator'

export interface StudentPortfolio {
  studentId: string
  name: string
  email: string
  major: string
  skills: string[]
  linkedinUrl: string
  bio: string
  profilePicture: string | null
  createdAt: string
  updatedAt: string
}

export interface CompanyProfile {
  companyName: string
  biography: string
  address: string
  contactEmail: string
  phone: string
  logoUrl: string
  approvalStatus: 'Pending' | 'Approved' | 'Rejected'
  location: { lat: number; lng: number } | null
  locationAddress?: string | null
  documents: DocumentFile[]
}

export interface DocumentFile {
  id: string
  name: string
  type: string
  size: number
  uploadedAt: string
}

export interface Internship {
  id: string
  title: string
  description: string
  skills: string[]
  duration: string
  applicationDeadline: string
  programmingLanguages: string[]
  status: 'Hiring' | 'Position Filled'
  archived: boolean
  postedAt: string
  companyName: string
  companyLogo: string
  applicantCount: number
}

export interface InternshipApplication {
  id: string
  internshipId: string
  internshipTitle: string
  companyName: string
  studentName: string
  studentEmail: string
  coverLetter: string
  appliedAt: string
  status: 'Pending' | 'Nominated' | 'Accepted' | 'Rejected'
  contributionScore: number
}

export interface FavoriteItem {
  id: string
  type: 'project' | 'portfolio'
  title: string
  subtitle: string
  tags: string[]
  rating?: number
  savedAt: string
}

export interface Message {
  id: string
  senderId: string
  senderName: string
  receiverId: string
  receiverName: string
  content: string
  timestamp: string
  read: boolean
}

export interface Conversation {
  id: string
  participantId: string
  participantName: string
  participantAvatar: string
  lastMessage: string
  lastTimestamp: string
  unreadCount: number
}

export interface Notification {
  id: string
  type: 'message' | 'internship_status' | 'project_invitation' | 'feedback' | 'flag' | 'admin'
  title: string
  body: string
  timestamp: string
  read: boolean
  link?: string
}

export interface EmployerStats {
  internshipsOffered: number
  studentsPlaced: number
  placementsOverTime: { month: string; placements: number; internships: number }[]
}

export interface CompletedInternship {
  id: string
  title: string
  companyName: string
  duration: string
  completedAt: string
}

export interface StudentPortfolio {
  studentId: string;
  name: string;
  email: string;
  major: string;
  skills: string[];
  linkedinUrl: string;
  bio: string;
  profilePicture: string | null;
  createdAt: string;
  updatedAt: string;
}
