# Tasks - 009 Authentication (Frontend)

Tasks must be executed sequentially.

---

# Task 1 - Define Authentication Runtime Contract

Status: Pending

Create the frontend configuration shape required for authentication.

Requirements

- define an `auth` configuration block for the environment files
- include Auth0 domain, client ID, audience, redirect URI, and logout return URI fields
- define the protected API matching information needed for authenticated backend requests
- keep the contract aligned with the existing `apiBaseUrl` environment pattern

Deliverables

- authentication runtime contract defined for the Angular app

---

# Task 2 - Populate Environment Configuration

Status: Pending

Add authentication configuration values to the existing environment files.

Requirements

- update `src/environments/environment.ts`
- update `src/environments/environment.production.ts`
- keep configuration centralized and free of component-level hard-coding
- ensure redirect URLs are compatible with the SPA deployment model

Deliverables

- development and production environment files include auth settings

---

# Task 3 - Register Auth Providers In Application Bootstrap

Status: Pending

Wire the Auth0 SDK into the root Angular configuration.

Requirements

- update `src/app/app.config.ts`
- register the Auth0 provider using environment configuration
- add protected HTTP interceptor support for authenticated backend requests
- preserve the existing router and `HttpClient` provider setup

Deliverables

- root application config initializes authentication support

---

# Task 4 - Create Centralized Auth Facade

Status: Pending

Add a reusable auth layer under the core application area.

Requirements

- create auth-focused code under `src/app/core`
- expose signal-friendly auth state for initializing, authenticated, and unauthenticated states
- centralize login and logout actions behind an application-facing API
- avoid spreading direct SDK calls across presentation components

Deliverables

- centralized auth facade or service created

---

# Task 5 - Implement Return-Target Capture And Redirect Restoration

Status: Pending

Ensure login returns the admin to the originally requested protected route.

Requirements

- capture the target route before redirecting to login
- restore the original route after successful authentication
- fall back to `/` when no return target exists
- keep the behavior compatible with protected deep links such as `/admin/recipes`

Deliverables

- post-login navigation restoration implemented

---

# Task 6 - Create Protected Admin Route Skeleton

Status: Pending

Add the minimum admin route structure required for this feature.

Requirements

- add `/admin` and `/admin/recipes` to `src/app/app.routes.ts`
- create lightweight placeholder admin pages or an admin shell under a new admin feature area
- redirect `/admin` to `/admin/recipes` unless a dedicated dashboard page is introduced
- keep public routes `/` and `/r/:id` unchanged

Deliverables

- protected admin route skeleton created

---

# Task 7 - Apply Route Protection To Admin Pages

Status: Pending

Protect the admin route tree so unauthenticated users cannot access it.

Requirements

- apply auth guard behavior to `/admin` and child admin routes
- redirect unauthenticated users into the login flow
- preserve the originally requested URL for restoration after authentication
- avoid introducing a dead-end unauthorized page for this MVP flow

Deliverables

- admin routes require authentication

---

# Task 8 - Replace Header Placeholder With Auth-Aware Controls

Status: Pending

Update the existing header so authentication state is visible in the UI.

Requirements

- keep the current search and theme toggle interactions intact
- show `Sign In` only when unauthenticated
- show admin navigation and logout only when authenticated
- preserve mobile and desktop usability in `src/app/layout/app-header`

Deliverables

- header reflects authentication state and exposes auth actions

---

# Task 9 - Implement Logout Recovery Flow

Status: Pending

Complete the logout behavior so the app returns cleanly to a public state.

Requirements

- trigger provider logout from the centralized auth layer
- return the user to a public route after logout
- clear protected-route access after session end
- prevent stale admin UI from remaining visible after logout

Deliverables

- logout flow implemented end to end

---

# Task 10 - Configure Protected Backend Token Attachment

Status: Pending

Prepare the frontend for authenticated admin API calls.

Requirements

- attach access tokens only to protected backend endpoints
- keep public recipe reads anonymous
- align protected endpoint matching with future recipe-management and image-upload routes
- surface authentication failures to calling code instead of swallowing them

Deliverables

- protected backend request configuration in place

---

# Task 11 - Add Automated Tests For Auth UI And Routing

Status: Pending

Create tests for the main authentication user journey.

Requirements

- test unauthenticated header rendering
- test authenticated header rendering
- test protected admin route behavior
- test return-target restoration after login

Deliverables

- automated coverage added for auth UI and route protection

---

# Task 12 - Add Automated Tests For Logout And Protected Requests

Status: Pending

Cover the remaining infrastructure behavior required by the spec.

Requirements

- test logout navigation behavior
- test loss of protected access after logout
- test that protected requests receive tokens
- test that public recipe requests do not receive auth tokens

Deliverables

- automated coverage added for logout and protected API rules

---

# Task 13 - Verify Feature End To End

Status: Pending

Run project checks and verify the implemented authentication flow against the PRD.

Verification

- unauthenticated users see `Sign In`
- authenticated users see admin navigation and logout
- `/admin` and `/admin/recipes` require authentication
- successful login returns to the original protected route
- logout returns the user to a public route
- public browsing routes continue to work without authentication
- protected backend requests are tokenized while public reads remain anonymous

Deliverables

- authentication feature verified locally

---

# Completion

Authentication is ready for follow-on specs:

- 010 admin recipe management
- 011 image upload
