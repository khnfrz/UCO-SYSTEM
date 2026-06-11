# Implementation Plan: User-Dashboard Module

This document outlines the architectural blueprint, file structure, and data schema for the new `user-dashboard` module, to be implemented within the existing UCO system codebase (Astro/React/Tailwind).

---

## 1. Architectural Strategy

The `user-dashboard` will be developed as a new sibling directory to `admin-dashboard` to maintain clean separation while sharing architectural patterns.

*   **Application Pattern:** Multi-page or Single-page application (SPA) style routing within Astro.
*   **State Management:** React `useState` and `useEffect` for multi-step form management.
*   **Styling:** Maintain consistency with `admin-dashboard` by leveraging the existing Tailwind configuration and global styles.

---

## 2. Proposed File Structure

```text
uco system/
├── admin-dashboard/
└── user-dashboard/
    ├── astro.config.mjs
    ├── package.json
    ├── tailwind.config.mjs
    ├── tsconfig.json
    ├── src/
    │   ├── components/
    │   │   ├── FormStep1.jsx
    │   │   ├── FormStep2.jsx
    │   │   ├── FormStep3.jsx
    │   │   ├── FormStep4.jsx
    │   │   └── UserHeader.jsx
    │   ├── layouts/
    │   │   └── UserLayout.astro
    │   ├── pages/
    │   │   └── index.astro
    │   └── styles/
    │       └── global.css
    └── public/
        └── images/
```

---

## 3. Implementation Steps

### Phase 1: Environment Setup
1.  Create `user-dashboard` directory.
2.  Initialize `package.json`, `astro.config.mjs`, `tailwind.config.mjs`, `tsconfig.json`.

### Phase 2: Core Components & Layouts
3.  Create `UserLayout.astro` and `UserHeader.jsx`.

### Phase 3: Form Logic Implementation
4.  Implement multi-step form state in `index.astro`.
5.  Build `FormStep1` to `FormStep4` components as React components.

### Phase 4: Validation & Submission
6.  Add schema validation to ensure required fields.
7.  Mock final form submission handler in Step 4.

---

## 4. Data Model Blueprint (Submission Object)

```javascript
{
  email: string,
  acceptedGuidelines: boolean,
  requestType: 'Website' | 'SocialMedia' | 'Print' | 'PhotoVideo' | 'LocalMedia' | 'FilePhotos' | 'FBLive',
  requestDetails: {
    requestingOffice: string,
    requestedBy: string,
    alternateContact: string,
    socialAccount: string | null,
    serviceType: string,
    otherService: string | null
  },
  eventInfo: {
    details: string,
    files: File[]
  },
  timestamp: string
}
```
