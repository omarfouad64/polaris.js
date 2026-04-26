# Project Polaris - Unified Requirements Index

This document serves as an AI-friendly index for all project requirements, including dependencies and implementation notes.

## Requirement 1 [4 pts]
- **Role:** Student/Administrator/ Employer/ Course Instructor
- **Goal:** Login using my email and password/ Log out
- **Assigned To:** Omar
- **Dependencies:** 2, 3
- **Implementation Notes:** Student, course instructor and Administrator must log in with their GUC emails. Only the employer will use an external email

---

## Requirement 2 [2 pts]
- **Role:** Student/ Course Instructor
- **Goal:** Register (sign up) using my first name, last name, email and password
- **Assigned To:** Omar
- **Dependencies:** None
- **Implementation Notes:** Admin will NOT REGISTER

---

## Requirement 3 [2 pts]
- **Role:** Employer
- **Goal:** Register (sign up) using my company name, company email and password
- **Assigned To:** Omar
- **Dependencies:** None
- **Implementation Notes:** N/A

---

## Requirement 4 [4 pts]
- **Role:** Student/ Employer/ Course Instructor / Administrator
- **Goal:** Update (change) my forgotten password using an OTP
- **Assigned To:** Omar
- **Dependencies:** 1
- **Implementation Notes:** N/A

---

## Requirement 5 [2 pts]
- **Role:** Student
- **Goal:** Add/ view/ update/ remove my basic information on my portfolio such as my major, my skills, Linkedin link 
- **Assigned To:** Omar Fo2sh
- **Dependencies:** 1
- **Implementation Notes:** LinkedIn link here acts as the CV

---

## Requirement 6 [2 pts]
- **Role:** Course Instructor
- **Goal:** Add/ view/ update/ remove information on my profile including a short biography, research interests and education background
- **Assigned To:** Omar Fo2sh
- **Dependencies:** 1
- **Implementation Notes:** N/A

---

## Requirement 7 [2 pts]
- **Role:** Course Instructor
- **Goal:** Link/unlink myself to the course(s) I am teaching
- **Assigned To:** Omar Fo2sh
- **Dependencies:** 6, 56
- **Implementation Notes:** All course instructors are automatically linked to the "Bachelor Project"

---

## Requirement 8 [4 pts]
- **Role:** Student/Administrator/ Employer/ Course Instructor
- **Goal:** Search for course instructors by name or course
- **Assigned To:** Omar Fo2sh
- **Dependencies:** 1
- **Implementation Notes:** N/A

---

## Requirement 9 [4 pts]
- **Role:** Student/Administrator/ Employer/ Course Instructor
- **Goal:** Select and view the course instructor profile along with all the details including linked courses
- **Assigned To:** Omar Fo2sh
- **Dependencies:** 8
- **Implementation Notes:** N/A

---

## Requirement 10 [2 pts]
- **Role:** Employer
- **Goal:** Add/ view/ update/ remove information about my company such as short company biography, address and contact information
- **Assigned To:** Basel
- **Dependencies:** 1
- **Implementation Notes:** N/A

---

## Requirement 11 [2 pts]
- **Role:** Employer
- **Goal:** Choose my company's location on Google Maps and set it as part of my profile
- **Assigned To:** Basel
- **Dependencies:** 10
- **Implementation Notes:** N/A

---

## Requirement 12 [2 pts]
- **Role:** Student/ Employer/ Course Instructor
- **Goal:** Upload a profile picture
- **Assigned To:** Adham
- **Dependencies:** 1
- **Implementation Notes:** This should be the company logo for the employer

---

## Requirement 13 [2 pts]
- **Role:** Employer
- **Goal:** Upload pdf documents such as tax certificate
- **Assigned To:** Basel
- **Dependencies:** 10
- **Implementation Notes:** This is to verify that the employer belongs to a real company. This is done during resgiteration and MUST be done for the administrator to accept/reject the company

---

## Requirement 14 [2 pts]
- **Role:** Administrator
- **Goal:** View a list of employers applying to use the platform
- **Assigned To:** Omar
- **Dependencies:** 1
- **Implementation Notes:** N/A

---

## Requirement 15 [2 pts]
- **Role:** Administrator
- **Goal:** View the details of each employer's company along with the uploaded documents
- **Assigned To:** Omar
- **Dependencies:** 14
- **Implementation Notes:** N/A

---

## Requirement 16 [2 pts]
- **Role:** Administrator
- **Goal:** View any uploaded documents
- **Assigned To:** Omar
- **Dependencies:** 13, 15
- **Implementation Notes:** N/A

---

## Requirement 17 [2 pts]
- **Role:** Administrator
- **Goal:** Download any uploaded documents
- **Assigned To:** Omar
- **Dependencies:** 16
- **Implementation Notes:** N/A

---

## Requirement 18 [2 pts]
- **Role:** Administrator
- **Goal:** Accept/ reject companies applying to use the platform
- **Assigned To:** Omar
- **Dependencies:** 15
- **Implementation Notes:** N/A

---

## Requirement 19 [4 pts]
- **Role:** Student
- **Goal:** Create/ view/ update/ delete a  project with project title, course, GitHub link, project report, programming languages used, and a short demo video of the project 
- **Assigned To:** Yousef
- **Dependencies:** 5
- **Implementation Notes:** Student should choose the course from a list of courses (this includes Bachelor Project). Project report is not uploaded. Creation date of the project should be saved automatically by the system.

---

## Requirement 20 [2 pts]
- **Role:** Student
- **Goal:** Set my project's visibility on my portfolio
- **Assigned To:** Adham
- **Dependencies:** 19
- **Implementation Notes:** Project visibility can be private or public (as in others can see the project on your portfolio or not). 

---

## Requirement 21 [2 pts]
- **Role:** Student
- **Goal:** View a list of all my projects
- **Assigned To:** Yousef
- **Dependencies:** 19
- **Implementation Notes:** N/A

---

## Requirement 22 [2 pts]
- **Role:** Student
- **Goal:** Select the projects I want to be visible on my portfolio
- **Assigned To:** Yousef
- **Dependencies:** 21
- **Implementation Notes:** N/A

---

## Requirement 23 [2 pts]
- **Role:** Student
- **Goal:** Upload a thesis draft
- **Assigned To:** Yousef
- **Dependencies:** 19
- **Implementation Notes:** There can be multiple thesis drafts. This is only required if the course is set to "Bachelor Project".

---

## Requirement 24 [2 pts]
- **Role:** Student
- **Goal:** Select one of my thesis drafts as the Final Draft
- **Assigned To:** Yousef
- **Dependencies:** 23
- **Implementation Notes:** Once a final draft is selected, all other drafts should automatically become private (not visible to anyone else at all - not even the course instructor(s)). Only the final draft will be public and visible to all.

---

## Requirement 25 [2 pts]
- **Role:** Student
- **Goal:** Search through a list of collaborators and/or course instructor(s) by email or first name or last name
- **Assigned To:** Omar Fo2sh
- **Dependencies:** 19
- **Implementation Notes:** N/A

---

## Requirement 26 [2 pts]
- **Role:** Student
- **Goal:** Send/ cancel (unsend) an invitation to the chosen collaborators and/or course instructor(s) to join the project
- **Assigned To:** Omar Fo2sh
- **Dependencies:** 25
- **Implementation Notes:** Only the course instructor(s) of that porject can be sent invitations

---

## Requirement 27 [2 pts]
- **Role:** Student
- **Goal:** View a list of my added collaborators and/or course instructor(s) with the status of their invitation (accepts/rejected/no reply)
- **Assigned To:** Omar Fo2sh
- **Dependencies:** 26
- **Implementation Notes:** N/A

---

## Requirement 28 [4 pts]
- **Role:** Student/ Course Instrcutor
- **Goal:** Receive a notification when project invitations are sent to me
- **Assigned To:** Omar Fo2sh
- **Dependencies:** 26
- **Implementation Notes:** N/A

---

## Requirement 29 [4 pts]
- **Role:** Student/ Course Instrcutor
- **Goal:** View a list of  invitations to different projects
- **Assigned To:** Omar Fo2sh
- **Dependencies:** 28
- **Implementation Notes:** N/A

---

## Requirement 30 [4 pts]
- **Role:** Student/ Course Instrcutor
- **Goal:** Accept/ Reject project invitations
- **Assigned To:** Omar Fo2sh
- **Dependencies:** 29
- **Implementation Notes:** N/A

---

## Requirement 31 [2 pts]
- **Role:** Student
- **Goal:** Remove a collaborator from a project
- **Assigned To:** Omar Fo2sh
- **Dependencies:** 27
- **Implementation Notes:** Only the project creator can do this

---

## Requirement 32 [4 pts]
- **Role:** Student
- **Goal:** Create/view/edit/delete a task which needs to be completed for this project along with a short task description (1 line), collaborator assigned to this task and the status of the task (pending, post-poned, completed) and task deadline
- **Assigned To:** Yousef
- **Dependencies:** 19
- **Implementation Notes:** Only the project creator can create/edit these tasks with all their information. Colloaborators can only change the status of their corresponding task. If the project is a bachelor project, there will be no collaborators, only the project creator.

---

## Requirement 33 [2 pts]
- **Role:** Student
- **Goal:** View a task list of all the tasks for a project along with all the task details entered by the project creator
- **Assigned To:** Yousef
- **Dependencies:** 32
- **Implementation Notes:** N/A

---

## Requirement 34 [2 pts]
- **Role:** Student
- **Goal:** Reorder the tasks in the task list according to importance
- **Assigned To:** Yousef
- **Dependencies:** 33
- **Implementation Notes:** Only the project creator can reorder these tasks.

---

## Requirement 35 [4 pts]
- **Role:** Student/Administrator/ Employer/ Course Instructor
- **Goal:** View a list of all my notifications
- **Assigned To:** Adham
- **Dependencies:** 1
- **Implementation Notes:** N/A

---

## Requirement 36 [4 pts]
- **Role:** Student/Administrator/ Employer/ Course Instructor
- **Goal:** Mark my notifications as read/unread
- **Assigned To:** Adham
- **Dependencies:** 35
- **Implementation Notes:** N/A

---

## Requirement 37 [3 pts]
- **Role:** Course Instructor
- **Goal:** Add/edit/remove a comment or feedback on each task
- **Assigned To:** Omar Fo2sh
- **Dependencies:** 33
- **Implementation Notes:** N/A

---

## Requirement 38 [3 pts]
- **Role:** Course Instructor
- **Goal:** Add/edit/remove a comment or feedback on the project in general
- **Assigned To:** Omar Fo2sh
- **Dependencies:** 21
- **Implementation Notes:** This includes the individual thesis drafts. 

---

## Requirement 39 [2 pts]
- **Role:** Course Instructor
- **Goal:** Rate the entire project
- **Assigned To:** Omar Fo2sh
- **Dependencies:** 38
- **Implementation Notes:** Rating is out of 5. This is visible to everyone.

---

## Requirement 40 [2 pts]
- **Role:** Student
- **Goal:** View the comments left by course instructor(s) on the tasks and/or project in general
- **Assigned To:** Yousef
- **Dependencies:** 37, 38
- **Implementation Notes:** These comments are only visible to the project creator, collaborators and any other instructors assigned to the project.

---

## Requirement 41 [2 pts]
- **Role:** Student
- **Goal:** Receive a notification each time any feedback or comments are made on my project or tasks by the course instructor(s)
- **Assigned To:** Omar Fo2sh
- **Dependencies:** 37, 38
- **Implementation Notes:** N/A

---

## Requirement 42 [4 pts]
- **Role:** Student/ Employer/ Course Instructor / Administrator
- **Goal:** Search for a specific project by project title
- **Assigned To:** Adham
- **Dependencies:** 1
- **Implementation Notes:** N/A

---

## Requirement 43 [4 pts]
- **Role:** Student/ Employer/ Course Instructor / Administrator
- **Goal:** Filter project titles by course or course instructor and/or by project creation date
- **Assigned To:** Adham
- **Dependencies:** 42
- **Implementation Notes:** Course can be a course name or a bachelor project

---

## Requirement 44 [4 pts]
- **Role:** Student/ Employer/ Course Instructor / Administrator
- **Goal:** View a list of project titles based on my search and/or filteration results
- **Assigned To:** Adham
- **Dependencies:** 42
- **Implementation Notes:** N/A

---

## Requirement 45 [4 pts]
- **Role:** Student/ Employer/ Course Instructor / Administrator
- **Goal:** Sort project titles by creation date or rating
- **Assigned To:** Adham
- **Dependencies:** 42
- **Implementation Notes:** N/A

---

## Requirement 46 [4 pts]
- **Role:** Student/ Employer/ Course Instructor / Administrator
- **Goal:** Select and view the project along with its details
- **Assigned To:** Adham
- **Dependencies:** 44
- **Implementation Notes:** N/A

---

## Requirement 47 [4 pts]
- **Role:** Student/ Employer/ Course Instructor / Administrator
- **Goal:** Search for a specific portfolio by student name or email
- **Assigned To:** Yousef
- **Dependencies:** 1
- **Implementation Notes:** N/A

---

## Requirement 48 [4 pts]
- **Role:** Student/ Employer/ Course Instructor / Administrator
- **Goal:** Filter portfolios by major or skills
- **Assigned To:** Yousef
- **Dependencies:** 47
- **Implementation Notes:** N/A

---

## Requirement 49 [4 pts]
- **Role:** Student/ Employer/ Course Instructor / Administrator
- **Goal:** View a list of portfolios based on my search and/or filteration results
- **Assigned To:** Yousef
- **Dependencies:** 47
- **Implementation Notes:** N/A

---

## Requirement 50 [4 pts]
- **Role:** Student/ Employer/ Course Instructor / Administrator
- **Goal:** Sort portfolios based on number of projects on each portfolio
- **Assigned To:** Yousef
- **Dependencies:** 47
- **Implementation Notes:** N/A

---

## Requirement 51 [4 pts]
- **Role:** Student/ Employer/ Course Instructor / Administrator
- **Goal:** Select and view the portfolio along with its details
- **Assigned To:** Yousef
- **Dependencies:** 49
- **Implementation Notes:** N/A

---

## Requirement 52 [2 pts]
- **Role:** Administrator
- **Goal:** View a list of all users with their full name, email and role
- **Assigned To:** Omar
- **Dependencies:** 1
- **Implementation Notes:** The list should include students, admins, employers and course instructors. You can choose to divide the list by roles.

---

## Requirement 53 [2 pts]
- **Role:** Administrator
- **Goal:** Create other accounts for other admins using a username and password
- **Assigned To:** Omar
- **Dependencies:** 52
- **Implementation Notes:** There has to be 1 admin created at the beginning of using the application and that admin can create more admins

---

## Requirement 54 [2 pts]
- **Role:** Administrator
- **Goal:** Activate/ deactivate any account
- **Assigned To:** Omar
- **Dependencies:** 52
- **Implementation Notes:** N/A

---

## Requirement 55 [4 pts]
- **Role:** Administrator
- **Goal:** Create/view/edit/delete a course with its course name and course code
- **Assigned To:** Omar
- **Dependencies:** 1
- **Implementation Notes:** N/A

---

## Requirement 56 [2 pts]
- **Role:** Administrator/ Course Instructor
- **Goal:** View a list of all courses included the course name and course code
- **Assigned To:** Omar
- **Dependencies:** 55
- **Implementation Notes:** N/A

---

## Requirement 57 [2 pts]
- **Role:** Administrator
- **Goal:** Accept/ Reject link/ unlink requests from course instructors
- **Assigned To:** Omar
- **Dependencies:** 7
- **Implementation Notes:** N/A

---

## Requirement 58 [2 pts]
- **Role:** Administrator
- **Goal:** Receive a notification of any linking/unlinking requests
- **Assigned To:** Omar
- **Dependencies:** 7
- **Implementation Notes:** N/A

---

## Requirement 59 [2 pts]
- **Role:** Administrator/ Course Instructor
- **Goal:** Flag any inappropriate projects that violate the university rules such as plagiarism
- **Assigned To:** Omar
- **Dependencies:** 46
- **Implementation Notes:** Flagging will automatically cause the project to be deactivated if no appeal was sent by the student. A reason for the flagging should be included.

---

## Requirement 60 [2 pts]
- **Role:** Student
- **Goal:** Receive a notification that my project has been flagged along with the reason for flagging
- **Assigned To:** Omar Fo2sh
- **Dependencies:** 59
- **Implementation Notes:** N/A

---

## Requirement 61 [2 pts]
- **Role:** Student
- **Goal:** Send an appeal to unflag the project, explaining their point of view
- **Assigned To:** Omar Fo2sh
- **Dependencies:** 60
- **Implementation Notes:** The explaination should be a short message

---

## Requirement 62 [2 pts]
- **Role:** Administrator
- **Goal:** View a list of flagged projects
- **Assigned To:** Omar
- **Dependencies:** 59
- **Implementation Notes:** N/A

---

## Requirement 63 [2 pts]
- **Role:** Administrator
- **Goal:** View a list of appeals sent by students
- **Assigned To:** Omar
- **Dependencies:** 61
- **Implementation Notes:** N/A

---

## Requirement 64 [2 pts]
- **Role:** Administrator
- **Goal:** Activate/ deactivate any project
- **Assigned To:** Omar
- **Dependencies:** 63
- **Implementation Notes:** N/A

---

## Requirement 65 [2 pts]
- **Role:** Student/ Employer
- **Goal:** Save/remove projects and portfolios to my favorites list
- **Assigned To:** Basel
- **Dependencies:** 46, 51
- **Implementation Notes:** N/A

---

## Requirement 66 [2 pts]
- **Role:** Student/ Employer
- **Goal:** View all of my favorite projects and portfolios on my favorites list
- **Assigned To:** Basel
- **Dependencies:** 65
- **Implementation Notes:** These can be considered separate lists: one for projects and one for portfolios

---

## Requirement 67 [3 pts]
- **Role:** Student/ Employer/ Course Instructor
- **Goal:** View a list of recommended projects
- **Assigned To:** Basel
- **Dependencies:** 66
- **Implementation Notes:** N/A

---

## Requirement 68 [3 pts]
- **Role:** Student/ Employer/ Course Instructor
- **Goal:** View a list of all my messages with students, employers and course instructors
- **Assigned To:** Basel
- **Dependencies:** 70
- **Implementation Notes:** N/A

---

## Requirement 69 [3 pts]
- **Role:** Student/ Employer/ Course Instructor
- **Goal:** Send and receive private messages
- **Assigned To:** Basel
- **Dependencies:** 46, 51, 87
- **Implementation Notes:** N/A

---

## Requirement 70 [3 pts]
- **Role:** Student/ Employer/ Course Instructor
- **Goal:** Receive a notification whenever I receive a private message
- **Assigned To:** Basel
- **Dependencies:** 69
- **Implementation Notes:** N/A

---

## Requirement 71 [4 pts]
- **Role:** Employer/ Administrator
- **Goal:** View statistics about the number of students that did their internships with my company and the number of internships I have offered over time
- **Assigned To:** Basel
- **Dependencies:** 85
- **Implementation Notes:** N/A

---

## Requirement 72 [2 pts]
- **Role:** Student
- **Goal:** View statistics about the total number of projects I have as well as the programming languages used in my projects overall (as a percentage) and the top collaborators per project (on my projects)
- **Assigned To:** Yousef
- **Dependencies:** 21
- **Implementation Notes:** N/A

---

## Requirement 73 [2 pts]
- **Role:** Administrator
- **Goal:** View statistics about the platform usage including total number of users (employers, students and course instructors),  total number of projects, and total number of courses 
- **Assigned To:** Omar
- **Dependencies:** 52, 56
- **Implementation Notes:** N/A

---

## Requirement 74 [2 pts]
- **Role:** Employer
- **Goal:** View/ add/ edit/ delete an internship with details such as internship title, internship details (responsibilities), skills, duration, application deadline and programming languages to be used
- **Assigned To:** Basel
- **Dependencies:** 10
- **Implementation Notes:** N/A

---

## Requirement 75 [2 pts]
- **Role:** Employer
- **Goal:** sort student applications by top contributors 
- **Assigned To:** Basel
- **Dependencies:** 87
- **Implementation Notes:** N/A

---

## Requirement 76 [2 pts]
- **Role:** Employer
- **Goal:** view a list of top suggested applications based on my portfolios favorite list
- **Assigned To:** Basel
- **Dependencies:** 66, 87
- **Implementation Notes:** N/A

---

## Requirement 77 [2 pts]
- **Role:** Employer
- **Goal:** Set an internship as currently hiring, or position filled
- **Assigned To:** Basel
- **Dependencies:** 86
- **Implementation Notes:** N/A

---

## Requirement 78 [2 pts]
- **Role:** Employer
- **Goal:** Archive/ unarchive internships
- **Assigned To:** Basel
- **Dependencies:** 86
- **Implementation Notes:** Internships can only be archived if their application deadline is passed

---

## Requirement 79 [2 pts]
- **Role:** Student
- **Goal:** Search for an internship using internship title and company name
- **Assigned To:** Basel
- **Dependencies:** 5
- **Implementation Notes:** N/A

---

## Requirement 80 [2 pts]
- **Role:** Student
- **Goal:** Filter internships by company name and duration
- **Assigned To:** Basel
- **Dependencies:** 79
- **Implementation Notes:** N/A

---

## Requirement 81 [2 pts]
- **Role:** Student
- **Goal:** View a list of internships based on the search/ filteration
- **Assigned To:** Basel
- **Dependencies:** 79
- **Implementation Notes:** N/A

---

## Requirement 82 [2 pts]
- **Role:** Student
- **Goal:** Sort internships based on date of posting the internship
- **Assigned To:** Basel
- **Dependencies:** 79
- **Implementation Notes:** N/A

---

## Requirement 83 [2 pts]
- **Role:** Student
- **Goal:** View and select an internship from the search/filteration results
- **Assigned To:** Basel
- **Dependencies:** 81
- **Implementation Notes:** N/A

---

## Requirement 84 [2 pts]
- **Role:** Student
- **Goal:** Apply for an internship and write a short cover letter on why I think I fit the role
- **Assigned To:** Basel
- **Dependencies:** 83
- **Implementation Notes:** N/A

---

## Requirement 85 [2 pts]
- **Role:** Employer
- **Goal:** View a list of my internships offered by my company
- **Assigned To:** Basel
- **Dependencies:** 74
- **Implementation Notes:** N/A

---

## Requirement 86 [2 pts]
- **Role:** Employer
- **Goal:** Select an internship from the list of internships
- **Assigned To:** Basel
- **Dependencies:** 85
- **Implementation Notes:** N/A

---

## Requirement 87 [2 pts]
- **Role:** Employer
- **Goal:** View a list of the students that have applied for that internship
- **Assigned To:** Basel
- **Dependencies:** 86
- **Implementation Notes:** N/A

---

## Requirement 88 [2 pts]
- **Role:** Employer
- **Goal:** Select a status of each applicant (nominated, accepted or rejected)
- **Assigned To:** Basel
- **Dependencies:** 87
- **Implementation Notes:** Nominated: being considered for the role. Accepted: Final acceptance for the role. Rejected: ma3lesh. 

---

## Requirement 89 [2 pts]
- **Role:** Student
- **Goal:** Receive a notification once I am accepted or reject for an internship I applied for
- **Assigned To:** Basel
- **Dependencies:** 88
- **Implementation Notes:** N/A

---

## Requirement 90 [2 pts]
- **Role:** Student
- **Goal:** View a list of all the internships I have completed as part of my portfolio
- **Assigned To:** Basel
- **Dependencies:** 89
- **Implementation Notes:** This is done automatically once a student completes an internship

---

## Requirement 91 [3 pts]
- **Role:** Student/ Employer/ Course Instructor
- **Goal:** Turn off all notifications
- **Assigned To:** Adham
- **Dependencies:** 35
- **Implementation Notes:** N/A

---

