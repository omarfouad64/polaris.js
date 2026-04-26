## Login
**Description:** Secure entry point for all users (Student, Instructor, Admin, Employer) to access their accounts.

**Related Requirements:** 
- Requirement 1

**Dependencies:**
- None

**Page Tabs / Sub-views:**
- None

**Page Components (Reusable):**
- LoginForm
- Header
- Footer

**Page Elements (Specific):**
- Email input
- Password input
- Submit button
- Forgot Password link

---

## Student & Instructor Registration
**Description:** Registration page for academic users using GUC emails.

**Related Requirements:** 
- Requirement 2

**Dependencies:**
- None

**Page Tabs / Sub-views:**
- None

**Page Components (Reusable):**
- RegistrationForm
- Header
- Footer

**Page Elements (Specific):**
- First Name input
- Last Name input
- Email input
- Password input
- Role Selection (Student/Instructor)
- Submit button

---

## Employer Registration
**Description:** Registration page for employers with external emails and document upload for verification.

**Related Requirements:** 
- Requirement 3
- Requirement 13

**Dependencies:**
- None

**Page Tabs / Sub-views:**
- None

**Page Components (Reusable):**
- EmployerRegistrationForm
- FileUpload
- Header
- Footer

**Page Elements (Specific):**
- Company Name input
- Company Email input
- Password input
- Document Upload (Tax Certificate PDF)
- Submit button

---

## Forgot Password
**Description:** Page to recover account access using an OTP sent to the user's email.

**Related Requirements:** 
- Requirement 4

**Dependencies:**
- Requirement 1

**Page Tabs / Sub-views:**
- None

**Page Components (Reusable):**
- OTPRequestForm
- OTPVerifyForm
- PasswordResetForm

**Page Elements (Specific):**
- Email input
- OTP input field
- New Password input
- Confirm Password input
- Submit button

---

## My Portfolio
**Description:** Student's personal view to manage their basic information, skills, and portfolio visibility.

**Related Requirements:** 
- Requirement 5
- Requirement 12
- Requirement 90

**Dependencies:**
- Requirement 1

**Page Tabs / Sub-views:**
- Profile Info
- Projects
- Completed Internships

**Page Components (Reusable):**
- ProfileHeader
- ProfilePictureUpload
- PortfolioInfoForm
- ProjectList
- InternshipList

**Page Elements (Specific):**
- Major input
- Skills tags input
- LinkedIn link input
- Bio textarea
- Completed Internships list

---

## My Projects
**Description:** Management view for a student to view and control visibility of their created projects.

**Related Requirements:** 
- Requirement 21
- Requirement 22

**Dependencies:**
- Requirement 1
- Requirement 19

**Page Tabs / Sub-views:**
- None

**Page Components (Reusable):**
- ProjectCard
- SearchBar
- VisibilityToggle

**Page Elements (Specific):**
- Create Project button
- Project List container

---

## Project Editor
**Description:** Interface to create or edit project details, including multimedia and thesis drafts.

**Related Requirements:** 
- Requirement 19
- Requirement 20
- Requirement 23
- Requirement 24

**Dependencies:**
- Requirement 5
- Requirement 19

**Page Tabs / Sub-views:**
- General Details
- Thesis (Bachelor Project Only)

**Page Components (Reusable):**
- ProjectDetailsForm
- VideoUploader
- FileUploader
- VisibilitySettings

**Page Elements (Specific):**
- Title input
- Course selection dropdown
- GitHub link input
- Programming Languages multi-select
- Demo Video upload
- Thesis Draft list with "Final Draft" selector

---

## Project Collaboration
**Description:** Manage project team members and send/receive invitations for collaboration.

**Related Requirements:** 
- Requirement 25
- Requirement 26
- Requirement 27
- Requirement 28
- Requirement 29
- Requirement 30
- Requirement 31

**Dependencies:**
- Requirement 19

**Page Tabs / Sub-views:**
- Collaborators
- Pending Invitations

**Page Components (Reusable):**
- CollaboratorList
- InvitationForm
- SearchUserModal

**Page Elements (Specific):**
- Invitation status badges
- Remove member buttons
- Send/Cancel Invitation buttons

---

## Project Tasks
**Description:** Task management board for project deliverables with instructor feedback integration.

**Related Requirements:** 
- Requirement 32
- Requirement 33
- Requirement 34
- Requirement 37
- Requirement 40
- Requirement 41

**Dependencies:**
- Requirement 19

**Page Tabs / Sub-views:**
- None

**Page Components (Reusable):**
- TaskBoard
- TaskCard
- TaskCommentSection
- AddTaskModal

**Page Elements (Specific):**
- Task reordering handles
- Status dropdown (Pending/Postponed/Completed)
- Deadline picker
- Instructor feedback display

---

## Student Dashboard
**Description:** Analytical overview of student performance and project metrics.

**Related Requirements:** 
- Requirement 72

**Dependencies:**
- Requirement 21

**Page Tabs / Sub-views:**
- None

**Page Components (Reusable):**
- StatsCard
- ProjectLanguagesChart
- TopCollaboratorsChart

**Page Elements (Specific):**
- Total Projects counter
- Programming language percentage visuals
- Top Collaborators per project list

---

## Company Profile
**Description:** Employer's view to manage company biography, contact info, and location.

**Related Requirements:** 
- Requirement 10
- Requirement 11
- Requirement 12

**Dependencies:**
- Requirement 1

**Page Tabs / Sub-views:**
- Details
- Location

**Page Components (Reusable):**
- CompanyInfoForm
- GoogleMapsSelector
- ProfilePictureUpload

**Page Elements (Specific):**
- Company Biography textarea
- Address input
- Contact information fields
- Interactive Map container

---

## Internship Management
**Description:** View and manage internships offered by the company, including hiring status and archiving.

**Related Requirements:** 
- Requirement 74
- Requirement 85
- Requirement 77
- Requirement 78

**Dependencies:**
- Requirement 10

**Page Tabs / Sub-views:**
- Active Internships
- Archived

**Page Components (Reusable):**
- InternshipList
- InternshipDetailsForm
- ArchiveToggle

**Page Elements (Specific):**
- Create Internship button
- Hiring/Position Filled status toggles
- Application Deadline picker

---

## Applicant Review
**Description:** Review and manage student applications for a specific internship.

**Related Requirements:** 
- Requirement 86
- Requirement 87
- Requirement 88
- Requirement 75
- Requirement 76

**Dependencies:**
- Requirement 85

**Page Tabs / Sub-views:**
- Candidates
- Suggested Matches

**Page Components (Reusable):**
- ApplicantList
- ApplicantCard
- StatusSelector

**Page Elements (Specific):**
- Sort by Top Contributors toggle
- Nominate/Accept/Reject status buttons
- Cover Letter preview

---

## Employer Dashboard
**Description:** Statistics regarding company internship offerings and student placements.

**Related Requirements:** 
- Requirement 71

**Dependencies:**
- Requirement 85

**Page Tabs / Sub-views:**
- None

**Page Components (Reusable):**
- StatsCard
- PlacementOverTimeChart

**Page Elements (Specific):**
- Internships offered counter
- Students placed counter

---

## Instructor Profile
**Description:** Instructor's view to manage biography, research interests, and background.

**Related Requirements:** 
- Requirement 6
- Requirement 12

**Dependencies:**
- Requirement 1

**Page Tabs / Sub-views:**
- About
- Teaching

**Page Components (Reusable):**
- InstructorInfoForm
- ProfilePictureUpload

**Page Elements (Specific):**
- Biography textarea
- Research Interests input
- Education background field

---

## My Courses
**Description:** Manage course associations and link/unlink requests for instructors.

**Related Requirements:** 
- Requirement 7
- Requirement 56

**Dependencies:**
- Requirement 6
- Requirement 56

**Page Tabs / Sub-views:**
- Linked Courses
- Available Courses

**Page Components (Reusable):**
- CourseList
- RequestLinkButton

**Page Elements (Specific):**
- Link/Unlink request buttons
- Bachelor Project auto-link indicator

---

## Admin Control Panel
**Description:** Platform-wide dashboard for administrators to monitor usage statistics.

**Related Requirements:** 
- Requirement 73

**Dependencies:**
- Requirement 52
- Requirement 56

**Page Tabs / Sub-views:**
- Stats
- Verification
- User Management
- Courses
- Moderation

**Page Components (Reusable):**
- PlatformStatsCard
- UserGrowthChart

**Page Elements (Specific):**
- Total Users (by role) counter
- Total Projects counter
- Total Courses counter

---

## Employer Verification
**Description:** Admin workflow to approve or reject new company registrations.

**Related Requirements:** 
- Requirement 14
- Requirement 15
- Requirement 16
- Requirement 17
- Requirement 18

**Dependencies:**
- Requirement 1

**Page Tabs / Sub-views:**
- Pending
- Approved
- Rejected

**Page Components (Reusable):**
- EmployerApplicationList
- DocumentViewer
- VerificationActions

**Page Elements (Specific):**
- Tax certificate PDF preview
- Download document button
- Accept/Reject company buttons

---

## User Directory
**Description:** Global user management for administrators, including account activation and admin creation.

**Related Requirements:** 
- Requirement 52
- Requirement 53
- Requirement 54

**Dependencies:**
- Requirement 1

**Page Tabs / Sub-views:**
- Students
- Instructors
- Employers
- Admins

**Page Components (Reusable):**
- UserDataTable
- CreateAdminModal
- AccountStatusToggle

**Page Elements (Specific):**
- Role-based list filters
- Search by Email/Name input
- Activate/Deactivate account toggle

---

## Course Directory
**Description:** Admin management of university courses and instructor link requests.

**Related Requirements:** 
- Requirement 55
- Requirement 56
- Requirement 57
- Requirement 58

**Dependencies:**
- Requirement 1

**Page Tabs / Sub-views:**
- Course List
- Link Requests

**Page Components (Reusable):**
- CourseDataTable
- AddCourseModal
- RequestHandler

**Page Elements (Specific):**
- Course Name and Code inputs
- Approve/Reject link request actions

---

## Content Moderation
**Description:** Review flagged projects and process student appeals.

**Related Requirements:** 
- Requirement 59
- Requirement 60
- Requirement 61
- Requirement 62
- Requirement 63
- Requirement 64

**Dependencies:**
- Requirement 46

**Page Tabs / Sub-views:**
- Flagged Projects
- Appeals

**Page Components (Reusable):**
- FlaggedProjectList
- AppealReviewForm
- ProjectStatusToggle

**Page Elements (Specific):**
- Reason for flagging display
- Appeal message text
- Final decision (Activate/Deactivate) buttons

---

## Project Explorer
**Description:** Public discovery interface for searching and filtering university projects.

**Related Requirements:** 
- Requirement 42
- Requirement 43
- Requirement 44
- Requirement 45
- Requirement 67

**Dependencies:**
- Requirement 1

**Page Tabs / Sub-views:**
- Search Results
- Recommended

**Page Components (Reusable):**
- ProjectFilterSidebar
- ProjectCardList
- SortDropdown

**Page Elements (Specific):**
- Search by Title input
- Course/Instructor/Date filters
- Sort by Creation Date/Rating dropdown

---

## Project Detail View
**Description:** Detailed view of a project, including media, tasks, and feedback.

**Related Requirements:** 
- Requirement 46
- Requirement 38
- Requirement 39
- Requirement 59
- Requirement 65

**Dependencies:**
- Requirement 44

**Page Tabs / Sub-views:**
- Overview
- Tasks (Team/Instructor Only)
- Feedback

**Page Components (Reusable):**
- ProjectHeader
- VideoPlayer
- FeedbackThread
- RatingComponent
- FlagButton
- FavoriteButton

**Page Elements (Specific):**
- Title and Course name
- GitHub Link button
- Programming Languages list
- Project Rating display

---

## Portfolio Explorer
**Description:** Public discovery interface for student portfolios.

**Related Requirements:** 
- Requirement 47
- Requirement 48
- Requirement 49
- Requirement 50

**Dependencies:**
- Requirement 1

**Page Tabs / Sub-views:**
- All Portfolios

**Page Components (Reusable):**
- PortfolioFilterSidebar
- PortfolioCardList
- SortDropdown

**Page Elements (Specific):**
- Search by Name/Email input
- Major/Skills filters
- Sort by Project Count dropdown

---

## Portfolio Detail View
**Description:** Public view of a student's portfolio and project history.

**Related Requirements:** 
- Requirement 51
- Requirement 65
- Requirement 90

**Dependencies:**
- Requirement 49

**Page Tabs / Sub-views:**
- About
- Projects
- Experience

**Page Components (Reusable):**
- PortfolioHeader
- ProjectGrid
- ExperienceTimeline
- MessageButton
- FavoriteButton

**Page Elements (Specific):**
- Name and Major heading
- Bio section
- Skills cloud
- Completed Internships timeline

---

## Instructor Directory
**Description:** Interface to find and view course instructor profiles.

**Related Requirements:** 
- Requirement 8
- Requirement 9

**Dependencies:**
- Requirement 1

**Page Tabs / Sub-views:**
- None

**Page Components (Reusable):**
- InstructorCardList
- SearchBar

**Page Elements (Specific):**
- Search by Name/Course input
- Instructor bio snippet
- Linked courses list

---

## Internship Explorer
**Description:** Student interface for discovering and applying to internships.

**Related Requirements:** 
- Requirement 79
- Requirement 80
- Requirement 81
- Requirement 82
- Requirement 83
- Requirement 84

**Dependencies:**
- Requirement 5

**Page Tabs / Sub-views:**
- All Internships
- My Applications

**Page Components (Reusable):**
- InternshipFilterSidebar
- InternshipCardList
- ApplicationFormModal

**Page Elements (Specific):**
- Search by Title/Company input
- Duration filter
- Sort by Posting Date
- Apply button (opens modal)

---

## Communications Center
**Description:** Unified view for account notifications and private messaging.

**Related Requirements:** 
- Requirement 35
- Requirement 36
- Requirement 68
- Requirement 69
- Requirement 70
- Requirement 91

**Dependencies:**
- Requirement 1

**Page Tabs / Sub-views:**
- Notifications
- Messages
- Settings

**Page Components (Reusable):**
- NotificationList
- ChatInterface
- NotificationSettingsForm

**Page Elements (Specific):**
- Mark as Read/Unread buttons
- Mute All Notifications toggle
- Chat thread selection sidebar

---

## My Favorites
**Description:** Personal collection of saved projects and portfolios.

**Related Requirements:** 
- Requirement 66

**Dependencies:**
- Requirement 65

**Page Tabs / Sub-views:**
- Projects
- Portfolios

**Page Components (Reusable):**
- ProjectCardGrid
- PortfolioCardGrid

**Page Elements (Specific):**
- Remove from Favorites buttons
- Empty state messages

---
