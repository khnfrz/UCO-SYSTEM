# Auth Protection Implementation Plan

## Objective
Protect sensitive routes (`/dashboard`, `/submissions`, `/settings` in admin; `/history`, `/submission` in user) from unauthorized access by implementing server-side middleware in Astro.

## Proposed Solution
- Create `src/middleware.ts` in both `admin-dashboard` and `user-dashboard`.
- Middleware will check for the existence of a 'session' cookie.
- Redirect unauthenticated users to `/login`.

## Implementation Steps
1.  **Admin Dashboard:** Create `admin-dashboard/src/middleware.ts` to protect admin routes.
2.  **User Dashboard:** Create `user-dashboard/src/middleware.ts` to protect user routes.
3.  **Verification:** Attempt direct navigation to `/dashboard` without being logged in.
