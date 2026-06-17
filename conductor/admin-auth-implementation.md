# Admin Authentication System Implementation Plan

## Objective
Establish a secure administrative authentication system using a dedicated database (`admin-accountsdb`).

## Scope & Impact
- Create/Initialize `admin_accounts` table.
- Implement secure password storage (using `bcrypt` or similar).
- Implement backend API for secure authentication.
- Update frontend `LoginForm.jsx` to interact with the new secure API.

## Proposed Solution
- **Database:** Use the existing MySQL setup. Create an `admin_accounts` table.
- **Backend:** Update or create an authentication API (`/api/auth/login`) that performs password verification against the hashed passwords in the DB.
- **Frontend:** Update `LoginForm.jsx` to send POST requests with credentials to the new auth endpoint.

## Implementation Steps
1.  **DB Setup:**
    *   Create `admin_accounts` table (`id`, `email`, `password_hash`, `role`, `created_at`).
2.  **Dependencies:**
    *   Install `bcryptjs` (for password hashing/verification).
3.  **Backend:**
    *   Create/Update `/api/login` to:
        *   Query the `admin_accounts` table by email.
        *   Use `bcrypt.compare()` to verify the provided password against the stored `password_hash`.
        *   Set up a session/token upon successful authentication.
4.  **Frontend:**
    *   Update `LoginForm.jsx` to call the new `/api/login` endpoint.
    *   Handle success/error states (displaying appropriate messages).

## Verification
- Verify successful login with valid credentials.
- Verify failed login with invalid credentials.
- Ensure security best practices:
    - No plain-text passwords in DB.
    - No sensitive data exposed in API responses or frontend logs.

## Security Considerations
- Passwords must be hashed using a strong, industry-standard algorithm (e.g., `bcrypt`).
- Authentication logic must handle potential timing attacks by ensuring consistent response times if possible.
- Sensitive credentials (DB passwords, secret keys for sessions/tokens) MUST NOT be committed to the repo.
