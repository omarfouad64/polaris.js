# Omar Fo2sh — Assignment & Prerequisite Guide

**Team Member:** Omar Fo2sh  
**Total Story Points:** 48 pts  
**Number of Requirements:** 18  
**Status:** Ready to implement

---

## ✅ Assigned Requirements

| Req # | Points | Goal | Group |
|-------|--------|------|-------|
| **5** | 2 | Add/view/update/remove student portfolio info (major, skills, LinkedIn) | Portfolio |
| **6** | 2 | Add/view/update/remove instructor profile info (bio, research, education) | Instructor Profile |
| **7** | 2 | Link/unlink instructor to courses | Instructor Profile |
| **8** | 4 | Search for course instructors by name or course | Instructor Discovery |
| **9** | 4 | Select & view course instructor profile with linked courses | Instructor Discovery |
| **25** | 2 | Search collaborators/instructors by email or name (for project invites) | Project Collaboration |
| **26** | 2 | Send/cancel project invitations to collaborators/instructors | Project Collaboration |
| **27** | 2 | View added collaborators with invitation status | Project Collaboration |
| **28** | 4 | Receive notifications when project invitations are sent | Project Notifications |
| **29** | 4 | View a list of invitations to different projects | Project Invitations |
| **30** | 4 | Accept/Reject project invitations | Project Invitations |
| **31** | 2 | Remove a collaborator from a project | Project Collaboration |
| **37** | 3 | Add/edit/remove comment or feedback on each task (Instructor) | Instructor Feedback |
| **38** | 3 | Add/edit/remove comment or feedback on project in general (Instructor) | Instructor Feedback |
| **39** | 2 | Rate the entire project (Instructor) | Instructor Feedback |
| **41** | 2 | Receive notification when feedback/comments are made on project | Instructor Feedback Notifications |
| **60** | 2 | Receive notification that project has been flagged with reason | Project Moderation |
| **61** | 2 | Send an appeal to unflag the project | Project Moderation |

**Total: 48 story points across 18 requirements**

---

## 🖥️ PREREQUISITES: What You Need on Your Laptop

### 1. **Node.js & npm**
- **Download:** https://nodejs.org/ (LTS version recommended)
- **Verify:** 
  ```bash
  node --version  # Should be v18+ or v20+
  npm --version   # Should be v9+
  ```

### 2. **Git**
- **Download:** https://git-scm.com/
- **Verify:**
  ```bash
  git --version
  ```

### 3. **Visual Studio Code**
- **Download:** https://code.visualstudio.com/
- **Verify:** Open VS Code, check Extensions tab

### 4. **Clone the Repository**
```bash
git clone https://github.com/Software-Engineering-Spring-2026/Polaris.js.git
cd Polaris.js
npm install
```

---

## 🛠️ VS CODE EXTENSIONS REQUIRED

**Install these extensions in VS Code:**

1. **ES7+ React/Redux/React-Native snippets** (ID: `dsznajder.es7-react-js-snippets`)
2. **TypeScript Vue Plugin** (ID: `Vue.vscode-typescript-vue-plugin`)
3. **Tailwind CSS IntelliSense** (ID: `bradlc.vscode-tailwindcss`)
4. **ESLint** (ID: `dbaeumer.vscode-eslint`)
5. **Thunder Client** (optional, for API testing) (ID: `rangav.vscode-thunder-client`)

**To install:** In VS Code, go to Extensions (Ctrl+Shift+X) and search for each extension.

---

## 📦 PROJECT TECH STACK

### **Core Framework & Language**
- **React 19.2.5** — Component library
- **React Router 7.14.2** — Client-side routing
- **TypeScript 6.0.2** — Strict type checking (NO `any` types allowed)

### **Styling & Design**
- **Tailwind CSS 4.2.4** — Utility-first CSS framework
- **Design System:** Stellar Academic (custom color tokens in `src/index.css`)
- **Material Symbols** — Icon library (via Google Fonts)
- **Plus Jakarta Sans & Lexend fonts** — Typography

### **Build & Development**
- **Vite 8.0.10** — Fast build tool
- **ESLint 10.2.1** — Code linting
- **TypeScript ESLint** — Type-aware linting

### **Additional Libraries**
- **Leaflet 1.9.4** — Map library (for location features)
- **React Leaflet 5.0.0** — React wrapper for Leaflet

---

## 🚀 HOW TO RUN THE PROJECT

### **Development Server**
```bash
npm run dev
# Open http://localhost:5173 in your browser
```

### **Build for Production**
```bash
npm run build
npm run preview
```

### **Lint Code**
```bash
npm run lint
```

### **Type Check**
```bash
tsc --noEmit
```

---

## 📁 PROJECT STRUCTURE (Your Focus Areas)

```
src/
├── components/                          # Global reusable components
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   ├── ProtectedRoute.tsx
│   └── ...
│
├── hooks/                               # Global data hooks
│   ├── useUsers.ts
│   ├── useNotifications.ts
│   ├── useMessages.ts
│   └── ...
│
├── pages/
│   ├── auth/                            # Authentication
│   │   ├── AuthLayout.tsx
│   │   ├── LoginPage.tsx
│   │   └── SignupPage.tsx
│   │
│   └── portal/                          # Authenticated portal
│       ├── components/                  # Layout parts (Sidebar, Header)
│       ├── dashboard/                   # Student home
│       ├── explorer/                    # Search/discovery
│       │
│       ├── student/
│       │   ├── portfolio/               # ✅ YOUR: Req 5
│       │   ├── projects/
│       │   └── internships/
│       │
│       ├── instructor/
│       │   ├── profile/                 # ✅ YOUR: Req 6, 7
│       │   └── courses/
│       │
│       ├── admin/
│       ├── employer/
│       ├── shared/                      # Favorites, Communications
│       └── PortalLayout.tsx
│
├── globalContext.tsx                    # Session management
├── routes.tsx                           # Router config
├── main.tsx                             # App entry
└── index.css                            # Design tokens & global styles

.agent/
├── requirements.md                      # ✅ YOUR REFERENCE
├── PLAN.md                              # Active feature plan
├── pages.md                             # Page architecture
├── workflow.md                          # Implementation steps
└── project_data/
    ├── architecture.md
    ├── components.md
    ├── hooks.md
    └── decisions.md
```

---

## 🔑 KEY DESIGN SYSTEM TOKENS

All colors are defined in `src/index.css` under `@theme`. **Never hardcode colors.**

```css
/* Primary (Deep Purple) */
--color-primary: #1f108e;
--color-primary-container: #3730a3;
--color-on-primary: #ffffff;

/* Secondary (Teal) */
--color-secondary: #006a61;
--color-secondary-container: #86f2e4;

/* Tertiary (Burnt Orange) */
--color-tertiary: #4f1e00;

/* Surface & Background */
--color-surface: #f8f9ff;
--color-background: #f8f9ff;
--color-on-surface: #0b1c30;

/* Typography */
--font-lexend: "Lexend", sans-serif;          /* Body text */
--font-jakarta: "Plus Jakarta Sans", serif;   /* Headings */
```

**Example Usage:**
```tsx
// ✅ CORRECT
<button className="bg-primary text-on-primary px-4 py-2 rounded-lg">
  Link Course
</button>

// ❌ WRONG - Never hardcode
<button style={{ backgroundColor: '#1f108e' }}>Link Course</button>
```

---

## 📋 DEPENDENCY GRAPH FOR YOUR REQUIREMENTS

```
Req 1 (Login)
  ├─ Req 5 (Student Portfolio) ✅ YOUR START
  │   └─ Req 25 (Search Collaborators)
  │       └─ Req 26 (Send Invitations)
  │           ├─ Req 27 (View Collaborators)
  │           │   └─ Req 31 (Remove Collaborator)
  │           └─ Req 28 (Invite Notifications)
  │               ├─ Req 29 (View Invitations)
  │               └─ Req 30 (Accept/Reject)
  │
  ├─ Req 6 (Instructor Profile) ✅
  │   ├─ Req 7 (Link/Unlink Courses)
  │   └─ Req 37 (Task Feedback)
  │       ├─ Req 38 (Project Feedback)
  │       │   └─ Req 39 (Rate Project)
  │       └─ Req 41 (Feedback Notifications)
  │
  ├─ Req 8 (Search Instructors) ✅
  │   └─ Req 9 (View Instructor Profile)
  │
  └─ Req 60 (Flagged Notification)
      └─ Req 61 (Send Appeal)
```

---

## ✨ NEXT STEPS

1. **Install all prerequisites** on your laptop
2. **Clone the repository** and run `npm install`
3. **Run `npm run dev`** and verify the dev server starts
4. **Read the workflow guide** (`.agent/workflow.md`)
5. **Start with Requirement 5** (Student Portfolio) — it's your entry point

---

## 📚 KEY DOCUMENTATION FILES (READ THESE)

Before you start coding, read these in order:

1. **`.agent/agent.md`** — Project overview & architecture
2. **`.agent/pages.md`** — UI blueprint for all pages
3. **`.agent/workflow.md`** — Step-by-step implementation guide
4. **`.agent/project_data/architecture.md`** — Routing & directory structure
5. **`.agent/project_data/components.md`** — Existing reusable components
6. **`.agent/project_data/hooks.md`** — Existing custom hooks
7. **`.agent/Design/stellar_academic/DESIGN.md`** — Full design system spec

---

## 🎯 YOUR IMPLEMENTATION GROUPS

I've organized your 18 requirements into 6 logical groups. Implement them in this order:

### **Group 1: Student Portfolio (Req 5)** ← START HERE
- New Page: `src/pages/portal/student/portfolio/StudentPortfolioPage.tsx`
- New Hook: `useStudentPortfolio.ts`
- **Why first:** It's a dependency for project invitations, and simplest to start with

### **Group 2: Instructor Profile (Req 6, 7)**
- New Page: `src/pages/portal/instructor/profile/InstructorProfilePage.tsx`
- New Hook: `useInstructorProfile.ts`, `useCourseLinks.ts`

### **Group 3: Instructor Discovery (Req 8, 9)**
- New Page: `src/pages/portal/explorer/InstructorDirectory.tsx`
- New Hook: `useInstructorSearch.ts`

### **Group 4: Project Collaboration (Req 25, 26, 27, 31)**
- Components: `SearchCollaboratorModal.tsx`, `CollaboratorList.tsx`, `InvitationForm.tsx`
- New Hook: `useProjectInvitations.ts`

### **Group 5: Project Invitations & Notifications (Req 28, 29, 30)**
- Update: Global `useNotifications.ts` hook
- New Hook: `useProjectNotifications.ts`

### **Group 6: Instructor Feedback (Req 37, 38, 39, 41) + Moderation (Req 60, 61)**
- Components: `TaskFeedbackForm.tsx`, `ProjectRatingComponent.tsx`, `FlagAppealModal.tsx`

---

## ⚠️ IMPORTANT RULES

1. **No `any` types** — TypeScript strict mode is enforced
2. **No hardcoded colors/spacing** — Always use `@theme` tokens from `src/index.css`
3. **Accessibility first** — All components must be WCAG 2.1 AA compliant
4. **Hook encapsulation** — Dummy data must be inside hooks, never imported directly
5. **One commit per logical change** — Follow the commit format in workflow.md
6. **Self-review before submitting** — Check your code against the review checklist

---

You're ready to start! Begin with **Requirement 5 (Student Portfolio)** and follow the workflow strictly. Good luck! 🚀
