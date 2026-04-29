# Design: Company Profile

**Page:** Company Profile
**Related Requirements:** Req 10, 11, 12
**Design System:** [stellar_academic/DESIGN.md](../stellar_academic/DESIGN.md)

---

## Layout

Portal layout wraps this page. Two tabs: "Details" and "Location".

```
┌─────────────────────────────────────────────────────────┐
│ SIDEBAR │  [Company Logo]  [Company Name]  [Edit btn]   │
│         │  Tabs: [Details]  [Location]                  │
│         │─────────────────────────────────────────────  │
│         │  TAB: Details                                 │
│         │  ┌─────────────────────────────────────────┐  │
│         │  │ Biography textarea                       │  │
│         │  │ Address input                            │  │
│         │  │ Contact: Email, Phone                    │  │
│         │  │ [Save Changes btn]                       │  │
│         │  └─────────────────────────────────────────┘  │
│         │  TAB: Location                                │
│         │  ┌─────────────────────────────────────────┐  │
│         │  │  Google Maps embed / interactive picker  │  │
│         │  │  Selected Address: [text]                │  │
│         │  │  [Save Location btn]                     │  │
│         │  └─────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## States

### Details Tab — Viewing
- Read-only display of biography, address, contact info.
- "Edit" icon button in the header opens the form in edit mode.

### Details Tab — Editing
- Inputs become editable.
- "Save Changes" primary button / "Cancel" ghost button appear.
- Validation: biography max 500 chars, email must be valid format.

### Location Tab
- Map picker with a pin the employer can drag to set location (Req 11).
- Below the map: text showing the selected address.
- "Save Location" primary button.
- Empty state: "No location set yet. Click on the map to set your company's location."

---

## Components

### ProfileHeader
- Company logo (`rounded-full w-24 h-24` avatar, `ProfilePictureUpload` on hover).
- Company name: `text-3xl font-jakarta font-bold text-on-background`.
- Status badge: approval status (Pending / Approved / Rejected) from admin verification.
- "Edit Profile" icon button (pencil icon, ghost variant).

### CompanyInfoForm
- Biography: `<textarea>` with char counter, `rounded-xl bg-surface-container-low`.
- Address: text input with `location_on` icon.
- Contact Email: text input (pre-filled, not editable if it matches registration email).
- Phone: text input with `phone` icon.

### GoogleMapsSelector
- `<div>` placeholder with `bg-surface-container rounded-xl` and `min-h-[320px]`.
- <!-- ASSUMPTION: Google Maps API integration is described in Req 11 but no API key management is specified. The component renders a placeholder in the dummy-data context. -->
- Shows a static map image as a placeholder until real API is wired.

---

## Interaction States

| Element | Hover | Focus | Active |
|---|---|---|---|
| Edit button | `bg-surface-container` | Ring visible | n/a |
| Save button | `bg-primary-container` | Ring visible | `translate-y-0.5` |
| Map pin | `cursor-move` | n/a | n/a |
