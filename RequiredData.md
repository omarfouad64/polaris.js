# Polaris.js Data Architecture

This document maps the required data structures for the Polaris.js platform. It defines each TypeScript interface and outlines its lifecycle, including the consumers (UI components/hooks), stakeholders (user roles), and relationships to other entities.

## 1. Student & Portfolio Data

### `StudentPortfolio`
```typescript
export interface StudentPortfolio {
  studentId: string
  name: string
  email: string
  major: string
  year: string
  projectCount: number
  skills: string[]
  linkedinUrl: string
  bio: string
  profilePicture: string | null
  createdAt: string
  updatedAt: string
}
```
- **Consumer**: `useStudentPortfolio`, `usePortfolioSearch`, `useStudentStats`, Student Profile Pages, Portfolio Explorer.
- **Stakeholders**: Student (Owner - views/edits), Employer (views), Course Instructor (views).
- **Relationships**: Core entity for a student. Linked to `FavoriteItem` when saved by others, and `InternshipApplication` when applying for internships.

## 2. Employer & Internship Data

### `CompanyProfile`
```typescript
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
```
- **Consumer**: Employer Dashboard, Admin Moderation Pages.
- **Stakeholders**: Employer (views/edits), Administrator (approves/rejects).
- **Relationships**: Contains `DocumentFile`. Serves as the origin profile for `Internship` postings.

### `DocumentFile`
```typescript
export interface DocumentFile {
  id: string
  name: string
  type: string
  size: number
  uploadedAt: string
}
```
- **Consumer**: Employer Dashboard (Document Upload), `CompanyProfile`.
- **Stakeholders**: Employer (creates), Administrator (views).
- **Relationships**: Nested within `CompanyProfile` representing verification or legal documents.

### `EmployerStats`
```typescript
export interface EmployerStats {
  internshipsOffered: number
  studentsPlaced: number
  placementsOverTime: { month: string; placements: number; internships: number }[]
}
```
- **Consumer**: Employer Dashboard Analytics.
- **Stakeholders**: Employer (views).
- **Relationships**: Aggregated statistics derived from `Internship` and `InternshipApplication` data.

### `Internship`
```typescript
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
```
- **Consumer**: `useInternshipSearch`, Internship Explorer, Employer Dashboard.
- **Stakeholders**: Employer (creates/manages), Student (views/applies).
- **Relationships**: Linked to `InternshipApplication`. `companyName` ties it back to the Employer.

### `InternshipApplication`
```typescript
export interface InternshipApplication {
  id: string
  internshipId: string
  internshipTitle: string
  companyName: string
  studentId: string
  studentName: string
  studentEmail: string
  coverLetter: string
  appliedAt: string
  status: 'Pending' | 'Nominated' | 'Accepted' | 'Rejected'
  contributionScore: number
}
```
- **Consumer**: Employer Application Manager, Student Application History.
- **Stakeholders**: Student (creates), Employer (views/updates status).
- **Relationships**: Links a `StudentPortfolio` (via `studentId`) to an `Internship` (via `internshipId`).

### `CompletedInternship`
```typescript
export interface CompletedInternship {
  id: string
  title: string
  companyName: string
  duration: string
  completedAt: string
}
```
- **Consumer**: Student Portfolio (Internship History).
- **Stakeholders**: Student (views).
- **Relationships**: Read-only historical record, derived from an accepted `InternshipApplication` that has run its course.

## 3. Instructor & Course Data

### `InstructorProfile`
```typescript
export interface InstructorProfile {
  instructorId: string
  name: string
  email: string
  biography: string
  researchInterests: string[]
  educationBackground: string
  linkedCourses: string[] // Array of course IDs
  profilePicture: string | null
  createdAt: string
  updatedAt: string
}
```
- **Consumer**: `useInstructorProfile`, `useInstructorSearch`, Instructor Directory, Instructor Profile Page.
- **Stakeholders**: Course Instructor (views/edits), Student (views), Administrator (views).
- **Relationships**: Links to `Course` via `linkedCourses` array. Provides project evaluation via `ProjectFeedback` and `ProjectRating`.

### `Course`
```typescript
export interface Course {
  id: string
  name: string
  code: string
  semester: string
  description: string
}
```
- **Consumer**: `useCourses`, Course Catalog, Project Creation Flow.
- **Stakeholders**: Administrator (creates/manages), Course Instructor (links to), Student (tags projects with).
- **Relationships**: Linked to `InstructorProfile` via `CourseLink` and referenced by student projects.

### `CourseLink`
```typescript
export interface CourseLink {
  instructorId: string
  courseId: string
  status: 'linked' | 'pending' | 'rejected'
  linkedAt: string
}
```
- **Consumer**: `useCourseLinks`, Instructor Dashboard, Admin Moderation.
- **Stakeholders**: Course Instructor (requests link), Administrator (approves/rejects).
- **Relationships**: Join table concept linking an `InstructorProfile` to a `Course`.

## 4. Project & Collaboration Data

### `ProjectCollaborator`
```typescript
export interface ProjectCollaborator {
  collaboratorId: string
  name: string
  email: string
  role: 'owner' | 'collaborator' | 'instructor'
  invitationStatus: 'pending' | 'accepted' | 'rejected'
  invitedAt: string
  respondedAt?: string
  profilePicture?: string | null
}
```
- **Consumer**: `useProjectInvitations`, Project Detail Page, Project Editor.
- **Stakeholders**: Student (Owner/Collaborator), Course Instructor.
- **Relationships**: Associates a user (`studentId` or `instructorId`) with a specific project context.

### `ProjectInvitation`
```typescript
export interface ProjectInvitation {
  id: string
  projectId: string
  projectTitle: string
  senderName: string
  senderId: string
  recipientEmail: string
  recipientName: string
  invitationStatus: 'pending' | 'accepted' | 'rejected'
  createdAt: string
  respondedAt?: string
}
```
- **Consumer**: `useProjectInvitationsList`, Notifications Dropdown.
- **Stakeholders**: Student (Sender/Recipient), Course Instructor (Recipient).
- **Relationships**: Facilitates the creation of a `ProjectCollaborator`. Transitions to `accepted` or `rejected`.

### `CollaborationSearchResult`
```typescript
export interface CollaborationSearchResult {
  userId: string
  name: string
  email: string
  role: 'Student' | 'Course Instructor'
  profilePicture?: string | null
  isAlreadyCollaborator: boolean
  teachingCourses?: string[] // For instructor validation
}
```
- **Consumer**: `useProjectInvitations`, User Search Modal during Project Setup.
- **Stakeholders**: Student (searcher).
- **Relationships**: Ephemeral search representation of users before they become a `ProjectCollaborator`.

## 5. Feedback & Moderation Data

### `TaskFeedback`
```typescript
export interface TaskFeedback {
  id: string
  taskId: string
  instructorId: string
  instructorName: string
  comment: string
  createdAt: string
  updatedAt: string
}
```
- **Consumer**: `useInstructorFeedback`, Project Task Management.
- **Stakeholders**: Course Instructor (creates), Student (views).
- **Relationships**: Links an Instructor to a specific Task within a Project.

### `ProjectFeedback`
```typescript
export interface ProjectFeedback {
  id: string
  projectId: string
  instructorId: string
  instructorName: string
  feedbackType: 'general' | 'thesis_draft'
  comment: string
  relatedThesisDraftId?: string
  createdAt: string
  updatedAt: string
}
```
- **Consumer**: `useInstructorFeedback`, Project Detail (Feedback Section).
- **Stakeholders**: Course Instructor (creates), Student (views).
- **Relationships**: Links an Instructor directly to a Project.

### `ProjectRating`
```typescript
export interface ProjectRating {
  id: string
  projectId: string
  instructorId: string
  instructorName: string
  rating: number // 1-5
  comment?: string
  createdAt: string
}
```
- **Consumer**: `useInstructorFeedback`, Project Detail, `useProjectSearch`, Portfolio Explorer.
- **Stakeholders**: Course Instructor (creates), Student (views).
- **Relationships**: An evaluative metric linked to a Project, influencing its visibility/prestige.

### `FlaggedProject`
```typescript
export interface FlaggedProject {
  id: string
  projectId: string
  projectTitle: string
  projectOwnerId: string
  projectOwnerName: string
  flaggedBy: string
  flaggedByName: string
  reason: string
  description?: string
  flaggedAt: string
  status: 'flagged' | 'appealed' | 'resolved'
}
```
- **Consumer**: `useProjectModeration`, Admin Moderation Dashboard.
- **Stakeholders**: Administrator (views/resolves), Any User (creates flag).
- **Relationships**: Marks a Project for review. Can lead to a `ProjectAppeal`.

### `ProjectAppeal`
```typescript
export interface ProjectAppeal {
  id: string
  flaggedProjectId: string
  projectId: string
  studentId: string
  studentName: string
  appealMessage: string
  attachedEvidence?: string[]
  submittedAt: string
  status: 'pending' | 'approved' | 'rejected'
  adminResponse?: string
  respondedAt?: string
}
```
- **Consumer**: `useProjectModeration`, Admin Moderation Dashboard, Student Project Settings.
- **Stakeholders**: Student (creates), Administrator (views/resolves).
- **Relationships**: Tied directly to a `FlaggedProject` allowing the owner to contest the flag.

## 6. Communication & Social Features

### `FavoriteItem`
```typescript
export interface FavoriteItem {
  id: string
  type: 'project' | 'portfolio'
  title: string
  subtitle: string
  tags: string[]
  rating?: number
  savedAt: string
}
```
- **Consumer**: `useFavorites`, Saved Items Dashboard.
- **Stakeholders**: All Roles (creates/views).
- **Relationships**: A polymorphic link allowing a user to bookmark a Project or a Student Portfolio.

### `Message`
```typescript
export interface Message {
  id: string
  senderId: string
  senderName: string
  senderRole?: UserRole
  receiverId: string
  receiverName: string
  receiverRole?: UserRole
  content: string
  timestamp: string
  read: boolean
}
```
- **Consumer**: `useMessages`, Direct Messaging Interface.
- **Stakeholders**: All Roles (Sender/Receiver).
- **Relationships**: Forms the content of a `Conversation` between two users.

### `Conversation`
```typescript
export interface Conversation {
  id: string
  participantId: string
  participantName: string
  participantAvatar: string
  participantRole?: UserRole
  lastMessage: string
  lastTimestamp: string
  unreadCount: number
}
```
- **Consumer**: `useMessages`, Messaging Inbox.
- **Stakeholders**: All Roles (views).
- **Relationships**: A summarized view of a thread of `Message` entities with a specific participant.

### `Notification`
```typescript
export interface Notification {
  id: string
  type: 'message' | 'internship_status' | 'project_invitation' | 'feedback' | 'flag' | 'admin' | 'appeal_response'
  title: string
  body: string
  timestamp: string
  read: boolean
  link?: string
}
```
- **Consumer**: `useNotifications`, Global Navigation Header.
- **Stakeholders**: All Roles (views).
- **Relationships**: Base notification entity. Can be extended (e.g., `FeedbackNotification`).

### `FeedbackNotification`
```typescript
export interface FeedbackNotification extends Notification {
  type: 'feedback' | 'flag' | 'appeal_response'
  projectId: string
  projectTitle: string
  feedbackType?: 'task' | 'project' | 'rating'
  instructorName?: string
  flagReason?: string
}
```
- **Consumer**: `useProjectNotifications`, Global Navigation Header.
- **Stakeholders**: Student (views).
- **Relationships**: Extends `Notification` with specific context for project-related feedback and moderation events.
