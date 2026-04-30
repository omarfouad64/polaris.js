# PLAN: Employer Maps Picker & PDF Uploads

## 1. Feature Summary
Implement Req 11 and Req 13 for employers by replacing the map placeholder with a real Google Maps location picker and enabling real PDF selection for employer document uploads in both registration and company profile flows. This affects employer users in the portal profile page and employer registration within the auth signup flow.

## 2. Affected Pages & Routes
| Page | Route | Change Type |
|---|---|---|
| Company Profile | /portal/employer/profile | Modified |
| Employer Registration (Auth Signup) | /auth/signup | Modified |

## 3. New Components to Create
### `OsmMapPicker` — `src/pages/portal/employer/profile/components/OsmMapPicker.tsx`
```tsx
interface OsmMapPickerProps {
  value: { lat: number; lng: number } | null
  onChange: (value: { lat: number; lng: number } | null) => void
  onAddressChange: (address: string | null) => void
}
```
- **Reusability:** Page-local (`src/pages/portal/employer/profile/components/`).
- **Design reference:** [Design/company_profile/DESIGN.md](.agent/Design/company_profile/DESIGN.md) — Location tab map picker.

## 4. Existing Components to Modify
| Component | File | Change Description |
|---|---|---|
| CompanyProfilePage | src/pages/portal/employer/profile/CompanyProfilePage.tsx | Replace map placeholder with `OsmMapPicker`, add address display and save logic, add real PDF file input for documents. |
| useCompanyProfile | src/pages/portal/employer/profile/scripts/useCompanyProfile.ts | Update `uploadDocument` to accept `File`, store metadata (name/type/size/uploadedAt). |
| SignupForm | src/pages/auth/AuthPage/components/SignupForm.tsx | Ensure employer tax certificate uses file input (validation for PDF + size). |
| types | src/types.ts | Extend `DocumentFile` to include `size` and optional `source` metadata if needed. |

## 5. State Changes
| Context | New Keys Added | Type | Purpose |
|---|---|---|---|
| N/A | N/A | N/A | Use local component state for map selection and document uploads. |

Local state updates:
- CompanyProfilePage: selected address string + map lat/lng for display.
- OsmMapPicker: map instance and marker, internal loading/error state for tile load.

## 6. New Hooks to Create
N/A.

## 7. Routes to Register
N/A.

## 8. Edge Cases & Error States
- Map tiles fail to load: show error message and fallback prompt.
- No location selected: show empty state text.
- File selection cancelled: keep previous document state.
- Non-PDF file selected: show validation error and ignore.
- PDF exceeds size limit (5MB): show validation error and ignore.

## 9. Open Questions
N/A

## 10. Checklist (Acceptance Gate)
- [x] All affected requirements listed.
- [x] All affected pages/routes listed.
- [x] All new components have props interfaces.
- [x] All existing components' changes described.
- [x] All Context/state changes listed.
- [x] All new hooks listed with return types.
- [x] All new routes listed.
- [x] All edge cases listed.
- [x] Zero open questions remain.

## Workflow Checklist

- [x] 1. READ — All required documentation read.
- [x] 2. PLAN — PLAN.md complete; zero open questions.
- [x] 3. IMPLEMENT — All planned code written; TypeScript compiles.
- [ ] 4. SELF-REVIEW — All review checklist items self-assessed as PASS.
- [ ] 5. REVIEW — review_agent report: zero unresolved items.
- [ ] 6. TEST — All test cases PASS; zero regressions.
- [x] 7. DOCUMENT — project_data/ updated.
- [ ] 8. DONE
