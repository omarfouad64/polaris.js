import type {
  StudentPortfolio, CompanyProfile, DocumentFile, EmployerStats, Internship,
  InternshipApplication, CompletedInternship, InstructorProfile, Course, CourseLink,
  ProjectCollaborator, ProjectInvitation, TaskFeedback, ProjectFeedback,
  ProjectRating, FlaggedProject, ProjectAppeal, FavoriteItem, Message, Conversation, Notification
} from '../types';

export interface Project {
  id: string;
  title: string;
  description: string;
  courseId: string;
  ownerId: string;
}

export interface DatabaseState {
  courses: Course[];
  instructors: InstructorProfile[];
  courseLinks: CourseLink[];
  students: StudentPortfolio[];
  completedInternships: CompletedInternship[];
  projects: Project[];
  projectCollaborators: ProjectCollaborator[];
  projectInvitations: ProjectInvitation[];
  taskFeedback: TaskFeedback[];
  projectFeedback: ProjectFeedback[];
  projectRatings: ProjectRating[];
  flaggedProjects: FlaggedProject[];
  projectAppeals: ProjectAppeal[];
  companies: CompanyProfile[];
  employerStats: EmployerStats | null;
  internships: Internship[];
  applications: InternshipApplication[];
  favorites: FavoriteItem[];
  messages: Message[];
  conversations: Conversation[];
  notifications: Notification[];
}

export const initialData: DatabaseState = {
  courses: [
    {
      id: "course_1",
      name: "Advanced Web Development",
      code: "CSW501",
      semester: "Spring 2026",
      description: "Capstone web development course."
    },
    {
      id: "course_2",
      name: "System Architecture",
      code: "CSW502",
      semester: "Fall 2025",
      description: "Enterprise software design and architecture."
    }
  ],
  instructors: [
    {
      instructorId: "instructor_1",
      name: "Dr. Bob Jones",
      email: "bob@guc.edu.eg",
      biography: "Web Architecture Expert.",
      researchInterests: ["React", "Distributed Systems"],
      educationBackground: "PhD CompSci",
      linkedCourses: ["course_1", "course_2"],
      profilePicture: null,
      createdAt: "2026-01-01T10:00:00Z",
      updatedAt: "2026-01-01T10:00:00Z"
    }
  ],
  courseLinks: [
    {
      instructorId: "instructor_1",
      courseId: "course_1",
      status: "linked",
      linkedAt: "2026-01-10T12:00:00Z"
    },
    {
      instructorId: "instructor_1",
      courseId: "course_2",
      status: "linked",
      linkedAt: "2025-08-15T09:00:00Z"
    }
  ],
  students: [
    {
      studentId: "student_1",
      name: "Alice Smith",
      email: "alice.smith@student.guc.edu.eg",
      major: "Computer Science",
      year: "Senior",
      projectCount: 2,
      skills: ["React", "TypeScript", "Tailwind", "System Design"],
      linkedinUrl: "https://linkedin.com/in/alicesmith",
      bio: "Frontend enthusiast looking for internships.",
      profilePicture: null,
      createdAt: "2026-02-01T08:00:00Z",
      updatedAt: "2026-02-01T08:00:00Z"
    }
  ],
  completedInternships: [
    {
      id: "completed_int_1",
      title: "QA Tester Intern",
      companyName: "TechCorp",
      duration: "3 months",
      completedAt: "2025-08-30T00:00:00Z"
    }
  ],
  projects: [
    {
      id: "project_1",
      title: "Polaris UI Engine",
      description: "A dynamic rendering engine.",
      courseId: "course_1",
      ownerId: "student_1"
    },
    {
      id: "project_2",
      title: "Distributed Task Queue",
      description: "A scalable job queue architecture.",
      courseId: "course_2",
      ownerId: "student_1"
    }
  ],
  projectCollaborators: [
    {
      collaboratorId: "student_1",
      name: "Alice Smith",
      email: "alice.smith@student.guc.edu.eg",
      role: "owner",
      invitationStatus: "accepted",
      invitedAt: "2026-02-15T09:00:00Z",
      profilePicture: null
    }
  ],
  projectInvitations: [
    {
      id: "invite_1",
      projectId: "project_1",
      projectTitle: "Polaris UI Engine",
      senderName: "Alice Smith",
      senderId: "student_1",
      recipientEmail: "charlie@student.guc.edu.eg",
      recipientName: "Charlie",
      invitationStatus: "pending",
      createdAt: "2026-02-16T10:00:00Z"
    }
  ],
  taskFeedback: [
    {
      id: "task_feedback_1",
      taskId: "task_101",
      instructorId: "instructor_1",
      instructorName: "Dr. Bob Jones",
      comment: "Your schema design looks good, but consider indexing the foreign keys.",
      createdAt: "2026-02-28T10:00:00Z",
      updatedAt: "2026-02-28T10:00:00Z"
    }
  ],
  projectFeedback: [
    {
      id: "feedback_1",
      projectId: "project_1",
      instructorId: "instructor_1",
      instructorName: "Dr. Bob Jones",
      feedbackType: "general",
      comment: "Excellent use of Tailwind and TypeScript. Needs better responsive design.",
      createdAt: "2026-03-01T14:00:00Z",
      updatedAt: "2026-03-01T14:00:00Z"
    }
  ],
  projectRatings: [
    {
      id: "rating_1",
      projectId: "project_1",
      instructorId: "instructor_1",
      instructorName: "Dr. Bob Jones",
      rating: 4,
      comment: "Solid A- work.",
      createdAt: "2026-03-01T14:05:00Z"
    }
  ],
  flaggedProjects: [
    {
      id: "flag_1",
      projectId: "project_2",
      projectTitle: "Distributed Task Queue",
      projectOwnerId: "student_1",
      projectOwnerName: "Alice Smith",
      flaggedBy: "admin_1",
      flaggedByName: "System Admin",
      reason: "Unapproved API usage",
      description: "Project uses external API without declaring it in documentation.",
      flaggedAt: "2026-03-05T09:00:00Z",
      status: "appealed"
    }
  ],
  projectAppeals: [
    {
      id: "appeal_1",
      flaggedProjectId: "flag_1",
      projectId: "project_2",
      studentId: "student_1",
      studentName: "Alice Smith",
      appealMessage: "The API used is an open-source mock backend permitted by the syllabus.",
      submittedAt: "2026-03-06T11:00:00Z",
      status: "pending"
    }
  ],
  companies: [
    {
      companyName: "TechCorp",
      biography: "Leading software company in Cairo.",
      address: "New Cairo, Egypt",
      contactEmail: "hr@techcorp.com",
      phone: "01000000000",
      logoUrl: "/dummy-logo.png",
      approvalStatus: "Approved",
      location: { lat: 30.0444, lng: 31.2357 },
      documents: []
    }
  ],
  employerStats: {
    internshipsOffered: 15,
    studentsPlaced: 10,
    placementsOverTime: [
      { month: "Jan", placements: 2, internships: 3 },
      { month: "Feb", placements: 5, internships: 5 },
      { month: "Mar", placements: 3, internships: 7 }
    ]
  },
  internships: [
    {
      id: "internship_1",
      title: "Frontend Developer Intern",
      description: "Build modern UIs using React.",
      skills: ["React", "TypeScript"],
      duration: "3 months",
      applicationDeadline: "2026-05-01T00:00:00Z",
      programmingLanguages: ["JavaScript", "TypeScript"],
      status: "Hiring",
      archived: false,
      postedAt: "2026-03-10T08:00:00Z",
      companyName: "TechCorp",
      companyLogo: "/dummy-logo.png",
      applicantCount: 5
    },
    {
      id: "internship_2",
      title: "UI/UX Designer Intern",
      description: "Create wireframes and prototypes for our web apps.",
      skills: ["Figma", "UI Design"],
      duration: "2 months",
      applicationDeadline: "2026-04-15T00:00:00Z",
      programmingLanguages: [],
      status: "Hiring",
      archived: false,
      postedAt: "2026-03-12T09:00:00Z",
      companyName: "TechCorp",
      companyLogo: "/dummy-logo.png",
      applicantCount: 2
    }
  ],
  applications: [
    {
      id: "application_1",
      internshipId: "internship_1",
      internshipTitle: "Frontend Developer Intern",
      companyName: "TechCorp",
      studentId: "student_1",
      studentName: "Alice Smith",
      studentEmail: "alice.smith@student.guc.edu.eg",
      coverLetter: "I would love to apply my React skills at TechCorp.",
      appliedAt: "2026-03-15T10:00:00Z",
      status: "Pending",
      contributionScore: 85
    }
  ],
  favorites: [
    {
      id: "fav_1",
      type: "project",
      title: "Frontend Developer Intern (TechCorp)",
      subtitle: "Hiring",
      tags: ["React", "TypeScript"],
      savedAt: "2026-03-14T09:00:00Z"
    },
    {
      id: "fav_2",
      type: "portfolio",
      title: "Dr. Bob Jones",
      subtitle: "Web Architecture Expert",
      tags: ["Instructor", "React"],
      savedAt: "2026-03-16T11:00:00Z"
    }
  ],
  messages: [
    {
      id: "msg_1",
      senderId: "student_1",
      senderName: "Alice Smith",
      senderRole: "Student",
      receiverId: "employer_1",
      receiverName: "TechCorp HR",
      receiverRole: "Employer",
      content: "Hello, I just submitted my application for the Frontend Intern position. Let me know if you need any additional documents.",
      timestamp: "2026-03-15T10:05:00Z",
      read: true
    },
    {
      id: "msg_2",
      senderId: "employer_1",
      senderName: "TechCorp HR",
      senderRole: "Employer",
      receiverId: "student_1",
      receiverName: "Alice Smith",
      receiverRole: "Student",
      content: "Hi Alice, we received your application. Your portfolio looks great! We will be in touch soon.",
      timestamp: "2026-03-15T14:30:00Z",
      read: false
    }
  ],
  conversations: [
    {
      id: "conv_1",
      participantId: "employer_1",
      participantName: "TechCorp HR",
      participantAvatar: "/dummy-logo.png",
      participantRole: "Employer",
      lastMessage: "Hi Alice, we received your application...",
      lastTimestamp: "2026-03-15T14:30:00Z",
      unreadCount: 1
    }
  ],
  notifications: [
    {
      id: "notif_s1",
      type: "feedback",
      title: "New Project Feedback",
      body: "Dr. Bob Jones left feedback on your project 'Polaris UI Engine'.",
      timestamp: "2026-03-01T14:00:00Z",
      read: false,
      link: "/projects/project_1",
      // @ts-ignore (Specific interface extending Notification)
      projectId: "project_1",
      projectTitle: "Polaris UI Engine",
      feedbackType: "project",
      instructorName: "Dr. Bob Jones"
    },
    {
      id: "notif_s2",
      type: "flag",
      title: "Project Flagged",
      body: "Your project 'Distributed Task Queue' has been flagged for review.",
      timestamp: "2026-03-05T09:00:00Z",
      read: true,
      link: "/projects/project_2/settings",
      // @ts-ignore
      projectId: "project_2",
      projectTitle: "Distributed Task Queue",
      flagReason: "Unapproved API usage"
    },
    {
      id: "notif_s3",
      type: "appeal_response",
      title: "Appeal Approved",
      body: "Your appeal for 'Distributed Task Queue' was approved. The flag has been removed.",
      timestamp: "2026-03-07T10:00:00Z",
      read: false,
      link: "/projects/project_2"
    },
    {
      id: "notif_s4",
      type: "internship_status",
      title: "Application Update",
      body: "TechCorp updated your Frontend Developer application status to Nominated.",
      timestamp: "2026-03-16T09:00:00Z",
      read: false,
      link: "/internships/application_1"
    },
    {
      id: "notif_s5",
      type: "project_invitation",
      title: "Invitation Accepted",
      body: "Charlie accepted your invitation to join 'Polaris UI Engine'.",
      timestamp: "2026-02-16T11:00:00Z",
      read: true,
      link: "/projects/project_1/collaborators"
    },
    {
      id: "notif_s6",
      type: "message",
      title: "New Message",
      body: "You have a new message from TechCorp HR.",
      timestamp: "2026-03-15T14:30:00Z",
      read: false,
      link: "/messages/conv_1"
    },
    {
      id: "notif_i1",
      type: "project_invitation",
      title: "Evaluation Requested",
      body: "Alice Smith invited you to evaluate 'Polaris UI Engine'.",
      timestamp: "2026-02-20T10:00:00Z",
      read: true,
      link: "/projects/project_1"
    },
    {
      id: "notif_i2",
      type: "admin",
      title: "Course Link Approved",
      body: "Your request to link to 'Advanced Web Development' was approved.",
      timestamp: "2026-01-11T09:00:00Z",
      read: true,
      link: "/instructor/courses"
    },
    {
      id: "notif_i3",
      type: "message",
      title: "New Message",
      body: "You have a new message from Alice Smith.",
      timestamp: "2026-02-21T11:00:00Z",
      read: false,
      link: "/messages/conv_2"
    },
    {
      id: "notif_e1",
      type: "admin",
      title: "Profile Approved",
      body: "Your company profile for TechCorp has been verified and approved.",
      timestamp: "2026-03-01T10:00:00Z",
      read: true,
      link: "/employer/profile"
    },
    {
      id: "notif_e2",
      type: "message",
      title: "New Applicant Message",
      body: "Alice Smith sent a message regarding the Frontend Developer role.",
      timestamp: "2026-03-15T10:05:00Z",
      read: false,
      link: "/messages/conv_1"
    },
    {
      id: "notif_a1",
      type: "flag",
      title: "New Project Flagged",
      body: "The project 'Distributed Task Queue' was flagged for unapproved API usage.",
      timestamp: "2026-03-05T09:00:00Z",
      read: false,
      link: "/admin/moderation/flag_1"
    },
    {
      id: "notif_a2",
      type: "admin",
      title: "Company Approval Pending",
      body: "TechCorp has submitted their company profile for review.",
      timestamp: "2026-02-28T14:00:00Z",
      read: true,
      link: "/admin/companies"
    },
    {
      id: "notif_a3",
      type: "admin",
      title: "Course Link Pending",
      body: "Dr. Bob Jones requested to link with 'System Architecture'.",
      timestamp: "2025-08-10T09:00:00Z",
      read: true,
      link: "/admin/courses"
    }
  ]
};
