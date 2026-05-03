# Setup Guide for Omar Fo2sh - Project Polaris Development

## Prerequisites Checklist

### 1. Software to Download

- [ ] **Node.js v18+** - https://nodejs.org/
  - Includes npm (Node Package Manager)
  - Verify: `node --version` and `npm --version` in terminal

- [ ] **Git** - https://git-scm.com/
  - Required for version control
  - Verify: `git --version` in terminal

- [ ] **Visual Studio Code** - https://code.visualstudio.com/
  - Your code editor

### 2. VSCode Extensions to Install

1. **ESLint** (dbaeumer.vscode-eslint)
   - Go to Extensions (Ctrl+Shift+X)
   - Search "ESLint"
   - Click Install

2. **Prettier** (esbenp.prettier-vscode)
   - Code formatter

3. **Tailwind CSS IntelliSense** (bradlc.vscode-tailwindcss)
   - Autocomplete for Tailwind classes

4. **Thunder Client** (rangav.vscode-thunder-client)
   - For API testing (optional)

5. **TypeScript Vue Plugin** (Vue.volar - optional)
   - Better TypeScript support

### 3. Clone the Repository

```bash
# Clone the repo
git clone https://github.com/Software-Engineering-Spring-2026/Polaris.js.git

# Enter project directory
cd Polaris.js

# Create and switch to your feature branch
git checkout -b feat/omar-fo2sh-implementation
```

### 4. Install Dependencies

```bash
# Install all npm packages
npm install

# Verify installation
npm list
```

### 5. Start Development Server

```bash
# Start dev server (runs on http://localhost:5173)
npm run dev

# Open browser and navigate to http://localhost:5173
```

### 6. Project Structure Overview

```
Polaris.js/
├── src/
│   ├── components/          # Reusable global components
│   ├── hooks/               # Global data hooks
│   ├── pages/
│   │   ├── auth/            # Login/Signup
│   │   └── portal/          # Main app
│   │       ├── student/     # Student pages
│   │       ├── instructor/  # YOUR AREA
│   │       ├── employer/    # Employer pages
│   │       ├── admin/       # Admin pages
│   │       └── shared/      # Shared pages
│   ├── globalContext.tsx    # Global auth state
│   ├── routes.tsx           # Route definitions
│   ├── main.tsx             # App entry
│   └── index.css            # Design tokens
├── .agent/                  # Documentation
│   ├── requirements.md      # All 91 requirements
│   ├── workflow.md          # Implementation workflow
│   ├── pages.md             # Page blueprint
│   ├── PLAN.md              # Feature plans
│   └── project_data/        # Architecture docs
├── package.json             # Dependencies
└── tsconfig.json            # TypeScript config
```

## Tech Stack

| Tech | Version | Purpose |
|------|---------|----------|
| **React** | 19.2.5 | UI framework |
| **React Router** | 7.14.2 | Client-side routing |
| **TypeScript** | 6.0.2 | Type-safe JavaScript |
| **Tailwind CSS** | 4.2.4 | Utility-first styling |
| **Vite** | 8.0.10 | Build tool & dev server |
| **React Leaflet** | 5.0.0 | Map component |

## Important Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Check TypeScript errors (before committing)
npm run tsc --noEmit

# Run linter
npm run lint

# Format code with Prettier
npx prettier --write .
```

## Your Assigned Requirements

You are assigned **18 requirements (52 story points)**:

**Student Portfolio:** Req 5
**Instructor Profile & Discovery:** Req 6, 7, 8, 9
**Project Collaboration:** Req 25, 26, 27, 28, 29, 30, 31
**Project Feedback & Ratings:** Req 37, 38, 39, 41
**Project Moderation:** Req 60, 61

## Next Steps

1. ✅ Clone repository
2. ✅ Install dependencies
3. ✅ Start dev server
4. ✅ Read `.agent/OMAR_FO2SH_IMPLEMENTATION_PLAN.md`
5. 📝 Start implementing components (see plan)
6. 🧪 Test locally
7. 📤 Commit and push changes

## Troubleshooting

### Port 5173 already in use?
```bash
# Use different port
npm run dev -- --port 5174
```

### TypeScript errors?
```bash
# Check for type issues
npm run tsc --noEmit
```

### Dependencies not installing?
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Design System

All styling uses Tailwind CSS with design tokens from `src/index.css`:

**Colors:**
- Primary: `bg-primary text-on-primary` (#1f108e)
- Secondary: `bg-secondary text-on-secondary` (#006a61)
- Error: `bg-error text-on-error` (#ba1a1a)

**Fonts:**
- Headings: `font-jakarta font-bold`
- Body: `font-lexend`

**Spacing:** Use Tailwind spacing (p-4, m-6, gap-2)

## Resources

- React Docs: https://react.dev
- React Router: https://reactrouter.com
- TypeScript: https://www.typescriptlang.org
- Tailwind CSS: https://tailwindcss.com
- Vite: https://vitejs.dev
