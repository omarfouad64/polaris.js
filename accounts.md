# Polaris.js Account Credentials

Use the following credentials to log into the different portals. All accounts are now managed via the centralized Redux store.

## 1. Primary Test Accounts

| Role | Username | Password | Notes |
| :--- | :--- | :--- | :--- |
| **Student** | `alice.smith@student.guc.edu.eg` | `student123` | Main student account (Alice). |
| **Student** | `charlie@student.guc.edu.eg` | `password` | Senior AI student. |
| **Student** | `david.m@student.guc.edu.eg` | `password` | Junior Software student. |
| **Course Instructor** | `bob@guc.edu.eg` | `instructor123` | Web Architecture expert. |
| **Course Instructor** | `sarah@guc.edu.eg` | `password` | Machine Learning expert. |
| **Employer** | `hr@techcorp.com` | `employer123` | TechCorp HR. |
| **Employer** | `hr@globalsys.com` | `password` | Global Systems HR. |
| **Administrator** | `admin@polaris.edu.eg` | `admin123` | Master administrator. |

## 2. Legacy / Support Accounts
Quick access accounts for development and debugging.

| Role | Username | Password |
| :--- | :--- | :--- |
| **Student** | `student@guc.edu.eg` | `password` |
| **Course Instructor** | `instructor@guc.edu.eg` | `password` |
| **Employer** | `employer@company.com` | `password` |
| **Administrator** | `admin@guc.edu.eg` | `password` |

---
**Technical Note:** User data is defined in `src/store/initialData.ts` and managed via the `useUsers` hook connected to the Redux store.
