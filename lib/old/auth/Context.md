# Authentication Module Overview

## `lib/auth/admin.ts`

| Function | Description |
|----------|-------------|
| `assignUserRole()` | Updates a user's role in the `users` table. |
| `promoteToAssociate()` | Promotes a user to the Associate role. |
| `promoteToPM()` | Promotes a user to the PM role. |
| `promoteToMentor()` | Promotes a user to the Mentor role. |
| `assignUserToCohort()` | Adds or updates a user's membership in a cohort. |
| `removeUserFromCohort()` | Marks a user as having left a cohort. |
| `deactivateUser()` | Soft deletes a user by setting `deleted_at`. |

---

## `lib/auth/guards.ts`

| Function | Description |
|----------|-------------|
| `requireAuth()` | Ensures the user is authenticated. |
| `requireUserRecord()` | Ensures the authenticated user exists in the public `users` table. |
| `requireRole()` | Restricts access to users with allowed roles. |
| `requirePM()` | Allows access only to PM users. |
| `requireAssociate()` | Allows access to Associates and PMs. |
| `requireAdmin()` | Allows access to all admin-level users. |
| `requireMentor()` | Allows access only to Mentors. |
| `requireCohortMember()` | Ensures the user belongs to a specified cohort. |
| `requireCohortMentor()` | Ensures the user is a mentor in a specified cohort. |
| `requirePodMember()` | Ensures the user belongs to a specified pod. |

---

## `middleware.ts`

| Function | Description |
|----------|-------------|
| `middleware()` | Protects routes by verifying authentication and handling redirects. |

---

## `lib/auth/redirects.ts`

| Function | Description |
|----------|-------------|
| `getDashboardRoute()` | Returns the correct dashboard route based on the user's role. |

---

## `lib/auth/roles.ts`

| Item | Description |
|------|-------------|
| `UserRole` | Enum defining all supported user roles. |

---

## `lib/auth/route-permissions.ts`

| Function | Description |
|----------|-------------|
| `canAccessAdmin()` | Checks whether a user has permission to access admin routes. |