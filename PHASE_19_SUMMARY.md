# Phase 19: Admin Authentication Shell

## Goal
Implement a simple, secure, internal-only admin authentication system for TimeCapsule and establish a unified admin UI layout.

## What Was Done

1. **Simple Env-Based Authentication**:
   - Added `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and `ADMIN_SECRET` environment variables.
   - Designed to be extremely secure by storing credentials in standard environment context rather than the database (avoids complex user/roles tables).

2. **Middleware Protection (`src/middleware.ts`)**:
   - Protected all `/admin/:path*` routes automatically.
   - Redirects unauthorized users to `/admin/login`.
   - Added `X-Robots-Tag: noindex, nofollow` to all admin responses to keep internal pages hidden from search engines.

3. **Login and Logout API Routes (`src/app/api/auth/*`)**:
   - `POST /api/auth/login`: Validates credentials, signs a JWT using the edge-compatible `jose` library, and sets an `HttpOnly` cookie.
   - `POST /api/auth/logout`: Clears the authentication cookie.

4. **Admin UI Layout & Login Page (`src/app/admin/*`)**:
   - Created a clean, dark-themed login page at `/admin/login`.
   - Created an application shell with a responsive sidebar containing links to Dashboard, Imports, Review Queue, Years, Entities, and AI Studio.
   - Updated `package.json` to include `jose` and re-built dependencies cleanly.

## Testing & Verification
- `npm run lint`: Passed.
- `npm run build`: Successfully built Next.js edge middleware and server components.
- `docker compose build`: Docker image builds successfully and installs new `jose` dependency correctly.

## Next Steps
- Integrate actual content into the Admin Dashboard widgets.
- Proceed to build out data review/management interfaces in the newly protected UI layout.
