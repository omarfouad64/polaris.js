# Design Audit Log — Project Polaris

This file records every action taken during the Workstream 2 design audit. Each entry follows the format:
`[TYPE] <design file or page> — Reason — Source`

---

## Audit Entries

---

- [TYPE: flagged] `Design/resource_library/code.html`
  Reason: A design exists for "resource_library" but no corresponding page is defined in `pages.md` or `requirements.md`. This design may be a leftover from a scrapped feature.
  Source: `pages.md` (no matching page), `requirements.md` (no matching requirement)
  <!-- TODO: not yet implemented — Confirm with team whether "Resource Library" is a planned feature. If so, add it to requirements.md and pages.md. If not, archive this design file. -->

---

- [TYPE: gap-filled] `Design/my_projects/DESIGN.md`
  Reason: "My Projects" page defined in `pages.md` (Req 21, 22) has no corresponding design file.
  Source: `requirements.md` §Req21, §Req22; `pages.md` §My Projects

- [TYPE: gap-filled] `Design/project_tasks/DESIGN.md`
  Reason: "Project Tasks" page defined in `pages.md` (Req 32–34, 37, 40, 41) has no corresponding design file.
  Source: `requirements.md` §Req32–Req34, §Req37, §Req40, §Req41; `pages.md` §Project Tasks

- [TYPE: gap-filled] `Design/student_dashboard/DESIGN.md`
  Reason: "Student Dashboard" page defined in `pages.md` (Req 72) has no corresponding design file.
  Source: `requirements.md` §Req72; `pages.md` §Student Dashboard

- [TYPE: gap-filled] `Design/company_profile/DESIGN.md`
  Reason: "Company Profile" page defined in `pages.md` (Req 10, 11, 12) has no corresponding design file.
  Source: `requirements.md` §Req10, §Req11, §Req12; `pages.md` §Company Profile

- [TYPE: gap-filled] `Design/applicant_review/DESIGN.md`
  Reason: "Applicant Review" page defined in `pages.md` (Req 75, 76, 86–88) has no corresponding design file.
  Source: `requirements.md` §Req75, §Req76, §Req86–Req88; `pages.md` §Applicant Review

- [TYPE: gap-filled] `Design/employer_dashboard/DESIGN.md`
  Reason: "Employer Dashboard" page defined in `pages.md` (Req 71) has no corresponding design file.
  Source: `requirements.md` §Req71; `pages.md` §Employer Dashboard

- [TYPE: gap-filled] `Design/my_courses/DESIGN.md`
  Reason: "My Courses" page defined in `pages.md` (Req 7, 56) has no corresponding design file.
  Source: `requirements.md` §Req7, §Req56; `pages.md` §My Courses

- [TYPE: gap-filled] `Design/admin_control_panel/DESIGN.md`
  Reason: "Admin Control Panel" page defined in `pages.md` (Req 73) has no corresponding design file.
  Source: `requirements.md` §Req73; `pages.md` §Admin Control Panel

- [TYPE: gap-filled] `Design/employer_verification/DESIGN.md`
  Reason: "Employer Verification" page defined in `pages.md` (Req 14–18) has no corresponding design file. Note: a design for `employer_registration` exists but covers the employer sign-up flow, not the admin verification workflow.
  Source: `requirements.md` §Req14–Req18; `pages.md` §Employer Verification

- [TYPE: gap-filled] `Design/course_directory/DESIGN.md`
  Reason: "Course Directory" page defined in `pages.md` (Req 55–58) has no corresponding design file.
  Source: `requirements.md` §Req55–Req58; `pages.md` §Course Directory

- [TYPE: gap-filled] `Design/content_moderation/DESIGN.md`
  Reason: "Content Moderation" page defined in `pages.md` (Req 59–64) has no corresponding design file.
  Source: `requirements.md` §Req59–Req64; `pages.md` §Content Moderation

- [TYPE: gap-filled] `Design/project_detail/DESIGN.md`
  Reason: "Project Detail View" page defined in `pages.md` (Req 38, 39, 46, 59, 65) has no corresponding design file.
  Source: `requirements.md` §Req38, §Req39, §Req46, §Req59, §Req65; `pages.md` §Project Detail View

- [TYPE: gap-filled] `Design/portfolio_detail/DESIGN.md`
  Reason: "Portfolio Detail View" page defined in `pages.md` (Req 51, 65, 90) has no corresponding design file.
  Source: `requirements.md` §Req51, §Req65, §Req90; `pages.md` §Portfolio Detail View

- [TYPE: gap-filled] `Design/instructor_directory/DESIGN.md`
  Reason: "Instructor Directory" page defined in `pages.md` (Req 8, 9) has no corresponding design file.
  Source: `requirements.md` §Req8, §Req9; `pages.md` §Instructor Directory

- [TYPE: gap-filled] `Design/internship_explorer/DESIGN.md`
  Reason: "Internship Explorer" page defined in `pages.md` (Req 79–84) has no corresponding design file. Note: a design for `internship_management` exists but covers the employer-side management view, not the student-facing search/apply flow.
  Source: `requirements.md` §Req79–Req84; `pages.md` §Internship Explorer

- [TYPE: gap-filled] `Design/communications_center/DESIGN.md`
  Reason: "Communications Center" page defined in `pages.md` (Req 35, 36, 68–70, 91) has no corresponding design file.
  Source: `requirements.md` §Req35, §Req36, §Req68–Req70, §Req91; `pages.md` §Communications Center

- [TYPE: gap-filled] `Design/my_favorites/DESIGN.md`
  Reason: "My Favorites" page defined in `pages.md` (Req 65, 66) has no corresponding design file.
  Source: `requirements.md` §Req65, §Req66; `pages.md` §My Favorites

---

## Consistency Audit Findings

The following inconsistencies were identified between the existing `code.html` design files and the implemented design system in `src/index.css`:

### Spacing Token Naming Mismatch
- **Found in:** All existing `code.html` files (e.g., `login/code.html` line 73–82).
- **Design specifies:** Spacing tokens named `xs`, `sm`, `md`, `lg`, `xl`, `gutter`, `margin` (raw names).
- **Implemented in `src/index.css`:** Tokens are prefixed as `polaris-base`, `polaris-sm`, `polaris-md`, `polaris-lg`, `polaris-xl`, `polaris-gutter` to avoid clashing with Tailwind v4 defaults.
- **Verdict:** The implemented codebase's naming is correct. The design HTML files use the raw CDN Tailwind v3 config which applies the names directly; this is a design-file-only context and does not affect production code. No change required to design files; the discrepancy is expected.
- [TYPE: flagged] All `code.html` files use Tailwind CDN v3 config with spacing names `sm`, `md`, `lg` etc. Production code uses `polaris-sm`, `polaris-md` etc. This is intentional and acceptable.
  Source: `src/index.css` @theme block.

### `border-radius` DEFAULT value discrepancy
- **Found in:** All `code.html` files (e.g., `login/code.html` line 67–72).
- **Design specifies:** `DEFAULT: 0.25rem`.
- **`stellar_academic/DESIGN.md` specifies:** `sm: 0.25rem`, `DEFAULT: 0.5rem`.
- **Implemented in `src/index.css`:** `--radius-lg: 0.5rem`, `--radius-xl: 0.75rem` (no DEFAULT override).
- **Verdict:** The `DEFAULT: 0.25rem` in the `code.html` files appears to be an error — it conflicts with the `DESIGN.md` spec where DEFAULT is 0.5rem. The `code.html` files use `rounded-lg` for most components anyway, so visual output is not materially affected.
- [TYPE: corrected] Design HTML files use `DEFAULT: 0.25rem` but `DESIGN.md` specifies `DEFAULT: 0.5rem`. The design spec is the source of truth. The HTML files are read-only reference mocks; no file change made, but `styling.md` documents the correct 0.5rem default.
  Source: `Design/stellar_academic/DESIGN.md` line 97.

### `font-h2` vs `font-jakarta` class naming
- **Found in:** `login/code.html`, `student_instructor_registration/code.html`, and others.
- **Design files use:** Role-based font classes like `font-h1`, `font-h2`, `font-body-md` mapped via Tailwind CDN config.
- **Implemented codebase uses:** `font-jakarta` and `font-lexend` (the actual font-family tokens from `src/index.css`).
- **Verdict:** The design files' class names are design-context-only (they work via the CDN Tailwind config). Production code must use `font-jakarta` / `font-lexend`. No change needed to design files; this difference is expected and documented in `styling.md`.
- [TYPE: flagged] All design `code.html` files use semantic font class names (`font-h2`, `font-body-md`) that only work with the embedded CDN Tailwind config. Production code should always use `font-jakarta` / `font-lexend`.
  Source: `src/index.css` @theme block; `Design/stellar_academic/DESIGN.md` typography section.
