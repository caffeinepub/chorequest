# Specification

## Summary
**Goal:** Ensure the app creator can become the first Parent/Admin so they can create tasks, while preventing auto-promotion once an admin already exists.

**Planned changes:**
- Backend: Update profile registration so the first-ever registered profile is forced to Parent/Admin (persisted role), regardless of what role the frontend submits, but only when no admin exists yet.
- Backend: Add a bootstrap method that promotes an already-created profile to Parent/Admin only if no admin exists; otherwise fail with a clear error and reject unauthenticated callers.
- Frontend: Update the Parent Dashboard access-denied view to show a “Become Parent Admin” action only when the backend reports no admin exists; on success, refresh admin status and unlock the dashboard without a page reload.
- Frontend: Add React Query query/mutation hooks for “admin exists” and “claim admin”; handle safe defaults when actor is unavailable, show a user-friendly error toast on failure, and invalidate relevant cached queries (e.g., isAdmin, currentUserProfile) after success.

**User-visible outcome:** If no Parent/Admin exists yet, the first user (or an existing user via a recovery button) can become Parent/Admin and then access the Parent Dashboard to create tasks; once an admin exists, other users cannot self-promote.
