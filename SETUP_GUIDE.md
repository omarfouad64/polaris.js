# Project Polaris — Setup & Development Guide

**For: Omar Fo2sh**  
**Assigned Requirements:** 5, 6, 7, 8, 9, 25, 26, 27, 28, 29, 30, 31, 37, 38, 39, 41, 60, 61  
**Total Story Points:** 50 points  
**Team Members:** Omar (Lead), Basel, Yousef, Adham

---

## 📋 YOUR CORRECTLY ASSIGNED REQUIREMENTS

| Req # | Points | Role | Goal | Status |
|-------|--------|------|------|--------|
| **5** | 2 | Student | Add/view/update/remove portfolio info (major, skills, LinkedIn link) | ⏳ Next |
| **6** | 2 | Instructor | Add/view/update/remove profile info (bio, research interests, education) | ⏳ Next |
| **7** | 2 | Instructor | Link/unlink to courses | ⏳ Next |
| **8** | 4 | Multi-role | Search for course instructors by name or course | ⏳ Next |
| **9** | 4 | Multi-role | Select & view course instructor profile with linked courses | ⏳ Next |
| **25** | 2 | Student | Search collaborators/instructors by email or name | ⏳ Next |
| **26** | 2 | Student | Send/cancel project invitations | ⏳ Next |
| **27** | 2 | Student | View added collaborators with invitation status | ⏳ Next |
| **28** | 4 | Student/Instructor | Receive notifications for project invitations | ⏳ Next |
| **29** | 4 | Student/Instructor | View list of invitations to different projects | ⏳ Next |
| **30** | 4 | Student/Instructor | Accept/Reject project invitations | ⏳ Next |
| **31** | 2 | Student | Remove a collaborator from a project | ⏳ Next |
| **37** | 3 | Instructor | Add/edit/remove comment on each task | ⏳ Next |
| **38** | 3 | Instructor | Add/edit/remove comment on project in general | ⏳ Next |
| **39** | 2 | Instructor | Rate entire project (out of 5) | ⏳ Next |
| **41** | 2 | Student | Receive notification for feedback/comments by instructors | ⏳ Next |
| **60** | 2 | Student | Receive notification when project flagged with reason | ⏳ Next |
| **61** | 2 | Student | Send appeal to unflag project with explanation | ⏳ Next |

**TOTAL: 50 story points**

---

## 💻 PREREQUISITES & SETUP

### What You Need Downloaded

1. **Node.js** (v18+ recommended)
   - Download from: https://nodejs.org/
   - Verify: `node --version` and `npm --version`

2. **Git** (for version control)
   - Download from: https://git-scm.com/
   - Verify: `git --version`

3. **Visual Studio Code** (or any code editor)
   - Download from: https://code.visualstudio.com/
   - Download the entire Polaris.js repository

### VS Code Extensions to Install

1. **ES7+ React/Redux/React-Native snippets** by dsznajder.es7-react-js-snippets
2. **TypeScript Vue Plugin (Volar)** by Vue
3. **Tailwind CSS IntelliSense** by bradlc.vscode-tailwindcss
4. **ESLint** by Microsoft
5. **Prettier - Code formatter** by Prettier
6. **Thunder Client** or **REST Client** (for API testing, optional)

### Installation Steps

```bash
# Clone the repository (if not already done)
git clone https://github.com/Software-Engineering-Spring-2026/Polaris.js.git
cd Polaris.js

# Install dependencies
npm install

# Start the development server
npm run dev

# The app will be available at: http://localhost:5173/
```

### Verify Installation

```bash
# Check TypeScript compilation
npm run build

# Check linting
npm run lint
```

---

## 🏗️ TECH STACK BREAKDOWN

### Frontend Framework
- **React 19.2.5** — UI library with hooks
- **React DOM 19.2.5** — DOM rendering
- **React Router DOM 7.14.2** — Client-side routing with nested layouts

### Styling & UI
- **Tailwind CSS 4.2.4** — Utility-first CSS framework
- **@tailwindcss/vite 4.2.4** — Vite integration for Tailwind
- **Design System:** Stellar Academic (defined in `src/index.css` via `@theme`)

### Typing & Validation
- **TypeScript 6.0.2 (strict mode)** — Static type checking
- Zero `any` types allowed

### Build & Development Tools
- **Vite 8.0.10** — Lightning-fast build tool
- **@vitejs/plugin-react 6.0.1** — React fast refresh for HMR
- **Node 24.12.2** — Node.js types

### Linting & Code Quality
- **ESLint 10.2.1** — Static code analysis
- **typescript-eslint 8.58.2** — TypeScript-aware linting
- **eslint-plugin-react-hooks** — React hooks best practices
- **eslint-plugin-react-refresh** — React fast refresh validation

### Mapping (for employer location features)
- **Leaflet 1.9.4** — Open-source mapping library
- **react-leaflet 5.0.0** — React wrapper for Leaflet
- **Nominatim API** — Reverse geocoding (built into OpenStreetMap)

---

## 📁 PROJECT STRUCTURE

```
Polaris.js/
├── src/
│   ├── components/              # Global reusable components (Button, Input, Card, etc.)
│   ├── hooks/                   # Global hooks (useUsers, useFavorites, useMessages, etc.)
│   ├���─ pages/
│   │   ├── auth/               # Authentication (Login, Signup, Forgot Password)
│   │   ├── portal/             # Main portal shell
│   │   │   ├── student/        # Student-specific pages (Portfolio, Projects)
│   │   │   ├── instructor/     # Instructor pages (YOU: Profile, Courses, Feedback)
│   │   │   ├── employer/       # Employer pages
│   │   │   ├── admin/          # Admin pages
│   │   │   └── shared/         # Shared pages (Favorites, Communications)
│   │   └── error/              # Error pages
│   ├── globalContext.tsx        # Global auth state
│   ├── routes.tsx              # Route definitions
│   ├── main.tsx                # Entry point
│   └── index.css               # Global styles + design tokens
├── .agent/                      # Agent documentation & planning
│   ├── requirements.md         # All 91 requirements
│   ├── agent.md                # Agent orchestrator
│   ├── workflow.md             # Implementation workflow
│   ├── pages.md                # UI page specifications
│   ├── PLAN.md                 # Current feature plan
│   ├── project_data/           # Architecture, hooks, components catalog
│   └── Design/                 # Design system & HTML mockups
├── index.html                  # HTML entry point
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite configuration
└── README.md                   # Project overview
```

---

## 🎨 DESIGN SYSTEM (Stellar Academic)

All colors, typography, and spacing are defined in `src/index.css` under `@theme`. **Never hardcode colors or spacing values.**

### Primary Colors
- **Primary:** `#1f108e` (deep purple) — Use for main actions, primary buttons
- **Secondary:** `#006a61` (teal) — Use for secondary actions, links
- **Tertiary:** `#4f1e00` (burnt orange) — Use for accents, highlights
- **Error:** `#ba1a1a` (red) — Use for errors, destructive actions

### Text Colors
- **on-surface:** `#0b1c30` (dark blue) — Main text
- **on-surface-variant:** `#464553` (gray) — Secondary text
- **on-surface-variant:** `#777584` — Subtle text (outline)

### Background & Surface Colors
- **background:** `#f8f9ff` (light blue)
- **surface:** `#f8f9ff` (light blue)
- **surface-container:** `#e5eeff` (mid blue)
- **surface-container-lowest:** `#ffffff` (white)

### Typography
- **Headings (h1-h6):** Plus Jakarta Sans (font-jakarta) — Bold, letter-spaced
- **Body text:** Lexend (font-lexend) — Regular, antialiased

### Using Tailwind Classes

```tsx
// ✅ CORRECT: Use design token classes
<button className="bg-primary text-on-primary px-4 py-2 rounded-lg font-jakarta font-bold">
  Login
</button>

// ❌ WRONG: Hardcoded colors
<button style={{ backgroundColor: '#1f108e', color: '#fff' }}>
  Login
</button>
```

Tailwind maps the `@theme` values automatically. See `src/index.css` for all available tokens.

---

## 🚀 DEVELOPMENT WORKFLOW

### 1. Create a Feature Branch

```bash
git checkout -b feat/student-portfolio-management
```

### 2. Follow the Workflow

Every feature follows this 8-step process:

1. **READ** — Read all relevant documentation
2. **PLAN** — Create PLAN.md with feature decomposition
3. **IMPLEMENT** — Write code following the plan
4. **SELF-REVIEW** — Check your work against checklist
5. **REVIEW** — Submit to review (if using review process)
6. **TEST** — Run all tests
7. **DOCUMENT** — Update project_data/ files
8. **DONE** — Feature complete

See `.agent/workflow.md` for detailed instructions.

### 3. Running the Dev Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173/` with hot module reloading (HMR).

### 4. Type Checking

```bash
# Check for TypeScript errors (do this frequently)
npm run build

# Or use tsc with --noEmit for faster checks
npx tsc --noEmit
```

### 5. Linting

```bash
npm run lint
```

Fix linting errors before committing.

### 6. Committing

Follow the commit message format:

```
feat(student-portfolio): add major, skills, and LinkedIn link management

Implement CRUD operations for student portfolio info including:
- Form for adding/editing major, skills, LinkedIn link
- Display of current portfolio information
- Validation of LinkedIn URL format

Closes #5
```

---

## 🔍 UNDERSTANDING THE CODEBASE

### Key Files to Read First

1. **`.agent/requirements.md`** — All 91 requirements with dependencies
2. **`.agent/agent.md`** — Agent orchestrator & project context
3. **`.agent/project_data/architecture.md`** — Directory structure & routing
4. **`.agent/project_data/components.md`** — Existing reusable components
5. **`.agent/project_data/hooks.md`** — Existing custom hooks
6. **`.agent/pages.md`** — UI specifications for all pages
7. **`src/globalContext.tsx`** — Global auth state (session management)
8. **`src/routes.tsx`** — Route definitions

### Data Management Pattern

**No backend API** — All data is dummy data in custom React hooks.

✅ **CORRECT PATTERN:**

```tsx
// src/pages/portal/student/portfolio/scripts/useStudentPortfolio.ts
export function useStudentPortfolio() {
  const [portfolio, setPortfolio] = useState({
    major: 'Computer Science',
    skills: ['React', 'TypeScript', 'Tailwind'],
    linkedinLink: 'https://linkedin.com/in/student'
  });

  const updatePortfolio = (updates) => {
    setPortfolio(prev => ({ ...prev, ...updates }));
  };

  return { portfolio, updatePortfolio };
}

// src/pages/portal/student/portfolio/StudentPortfolioPage.tsx
export default function StudentPortfolioPage() {
  const { portfolio, updatePortfolio } = useStudentPortfolio();
  // Use portfolio and updatePortfolio in JSX
}
```

❌ **WRONG PATTERN:**

```tsx
// Don't import raw data arrays directly
const portfolios = [
  { major: 'CS', skills: ['React'] }
];

export default function StudentPortfolioPage() {
  // This won't be reusable or updatable
}
```

### React Router Structure

The app uses **nested layouts** with React Router v7's `<Outlet />` pattern:

```
/portal
├── /student
│   └── (DashboardLayout)
│       ├── /portfolio → StudentPortfolioPage
│       ├── /projects → MyProjectsPage
│       └── /internships → InternshipExplorerPage
├── /instructor
│   └── (InstructorLayout) ← YOU: Build this
│       ├── /profile → InstructorProfilePage
│       └── /courses → MyCourses
├── /employer
│   └── (EmployerLayout)
│       ├── /profile → CompanyProfilePage
│       └── /internships → InternshipManagementPage
└── /administrator
    └── (AdminLayout)
        ├── /users → UserDirectoryPage
        └── /courses → CourseDirectoryPage
```

---

## ✅ YOUR FIRST STEPS

### Step 1: Clone & Install (5 minutes)

```bash
git clone https://github.com/Software-Engineering-Spring-2026/Polaris.js.git
cd Polaris.js
npm install
npm run dev
```

### Step 2: Read Documentation (30 minutes)

- [ ] Read `.agent/agent.md` — Project context & architecture
- [ ] Read `.agent/requirements.md` — Your assigned requirements (5, 6, 7, 8, 9, 25-31, 37-39, 41, 60-61)
- [ ] Read `.agent/project_data/architecture.md` — How pages are organized
- [ ] Read `.agent/project_data/hooks.md` — Existing hooks (don't duplicate)
- [ ] Read `.agent/workflow.md` — Implementation process

### Step 3: Create PLAN.md (45 minutes)

Create `.agent/PLAN_OMAR_FO2SH.md` with:

1. Feature Summary
2. Affected Pages & Routes
3. New Components to Create
4. Existing Components to Modify
5. State Changes
6. New Hooks to Create
7. Routes to Register
8. Edge Cases & Error States
9. Open Questions
10. Acceptance Checklist

See `.agent/PLAN.md` for the template.

### Step 4: Start Implementation (Based on PLAN)

Follow the workflow from `.agent/workflow.md`:

1. **READ** ✅ (doing now)
2. **PLAN** — Create your PLAN.md
3. **IMPLEMENT** — Build components & hooks
4. **SELF-REVIEW** — Check against review checklist
5. **TEST** — Run tests
6. **DOCUMENT** — Update `.agent/project_data/` files
7. **DONE** — Feature complete

---

## 🆘 HELPFUL COMMANDS

```bash
# Start dev server with hot reload
npm run dev

# Build for production (also type-checks)
npm run build

# Type-check without building
npx tsc --noEmit

# Lint code
npm run lint

# Preview production build
npm run preview

# Check package versions
npm list react react-dom react-router-dom tailwindcss typescript
```

---

## 📖 DOCUMENTATION STRUCTURE

All agent documentation is in `.agent/`:

- **`agent.md`** — Start here; project context & orchestration
- **`workflow.md`** — 8-step implementation process
- **`planning_agent.md`** — How to write PLAN.md
- **`review_agent.md`** — Self-review checklist
- **`styling.md`** — Design token usage & responsive design
- **`testing.md`** — Test cases & how to run them
- **`pages.md`** — UI specifications for all pages
- **`requirements.md`** — All 91 requirements with dependencies
- **`project_data/`** — Architecture, hooks, components catalogs
- **`Design/`** — Design system tokens & HTML mockups

---

## ❓ COMMON QUESTIONS

**Q: What if TypeScript compilation fails?**
A: Run `npm run build` to see detailed errors. Check that all imports are correct and all types are defined (no `any`).

**Q: Can I use inline styles instead of Tailwind classes?**
A: No. All styling must use design tokens from `src/index.css` via Tailwind classes.

**Q: How do I add a new hook?**
A: Create it in the page's `scripts/` folder (e.g., `src/pages/portal/student/portfolio/scripts/useStudentPortfolio.ts`). Update `.agent/project_data/hooks.md` when done.

**Q: What's the difference between global and local components?**
A: Global components go in `src/components/` (reused across pages). Local components go in the page's `components/` folder.

**Q: How do I handle notifications?**
A: Use the global `useNotifications()` hook from `.agent/project_data/hooks.md`. It manages dummy notification data.

---

## 🎯 YOUR GOAL

Implement **18 requirements (50 story points)** covering:

1. **Student Portfolio Management** (Req 5) — Store major, skills, LinkedIn link
2. **Instructor Profile & Courses** (Req 6, 7) — Bio, research, education, course linking
3. **Instructor Search & Discovery** (Req 8, 9) — Search by name/course, view profiles
4. **Project Collaboration** (Req 25-31) — Invite collaborators, manage status, remove members
5. **Invitations & Notifications** (Req 28-30) — Receive, view, accept/reject invitations
6. **Instructor Feedback** (Req 37-39, 41) — Comments on tasks/projects, ratings, notifications
7. **Project Flagging Appeals** (Req 60, 61) — Receive flagged notifications, send appeals

---

**You're ready! Start with Step 2 above, then create your PLAN.md. Good luck! 🚀**
