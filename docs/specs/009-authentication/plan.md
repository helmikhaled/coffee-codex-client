# Plan - 009 Authentication

This spec adds the authentication foundation required for protected admin workflows without disturbing the public recipe browsing experience.

Implementation should be performed in phases so runtime configuration, route protection, UI changes, and backend token handling can be introduced safely and verified in isolation.

---

# Current State

The current frontend already includes part of the technical foundation for this work, but the authentication flow is not implemented yet.

Relevant existing files:

- `package.json` already includes `@auth0/auth0-angular`
- `src/app/app.config.ts` currently provides browser error handling, `HttpClient`, and router configuration only
- `src/environments/environment.ts` and `src/environments/environment.production.ts` only expose `apiBaseUrl`
- `src/app/layout/app-header/app-header.html` renders a static `Sign In` button that is not wired to any auth logic
- `src/app/app.routes.ts` only defines the public routes `/` and `/r/:id`

This feature should build on the existing standalone Angular architecture and current app shell rather than introducing a parallel authentication entry point.

---

# Phase 1 - Authentication Runtime Configuration

Define the runtime configuration contract required for the frontend authentication integration.

Deliverables

- environment shape extended with an `auth` configuration block
- configuration values defined for Auth0 domain, client ID, and audience
- redirect and logout return URLs defined per environment
- protected API matching rules identified for authenticated backend calls

Implementation Notes

- Keep authentication configuration centralized in the existing environment files so components and feature code do not hard-code tenant details
- Treat the public recipe APIs as anonymous by default; protected token attachment should be limited to admin-oriented backend requests
- Prefer secure SDK-managed storage defaults over introducing custom token persistence
- Ensure redirect settings are compatible with the SPA rewrite already defined in `src/staticwebapp.config.json`

Outcome

The application has a stable runtime contract for authentication and future protected API access.

---

# Phase 2 - SDK And Application Provider Wiring

Register the authentication SDK and related providers in the Angular application bootstrap configuration.

Deliverables

- Auth0 provider added to `src/app/app.config.ts`
- authorization parameters wired from environment configuration
- HTTP interceptor support added for protected backend calls
- application startup remains non-blocking while authentication initializes

Implementation Notes

- Keep provider wiring in the root config so auth setup remains discoverable and easy to change
- Limit interceptor scope to protected endpoints instead of attaching tokens to every API request
- Preserve the existing router and HTTP setup already used by public recipe features
- Avoid adding app-wide imperative initialization logic when SDK providers can handle the flow declaratively

Outcome

The Angular application can initialize authentication state and request access tokens for protected calls.

---

# Phase 3 - Centralized Authentication State And Actions

Create a thin authentication layer that exposes login, logout, and authenticated-state information to the rest of the app.

Deliverables

- auth-focused service or facade under `src/app/core`
- signal-friendly authenticated state exposed for UI and routing use
- centralized login action that captures the user’s intended return URL
- centralized logout action with safe post-logout navigation

Implementation Notes

- Keep direct SDK usage out of presentation components where practical; header and future admin features should consume a narrow application-facing API
- Expose only the state required by the MVP: initializing, authenticated, unauthenticated, and basic admin-navigation intent
- Preserve the PRD requirement that login returns the user to the originally requested page
- Do not expand into profile management, role management, or public account features

Outcome

Authentication behavior is centralized and reusable instead of being duplicated across components and routes.

---

# Phase 4 - Protected Admin Route Structure

Introduce the minimum admin route surface required to enforce authentication now and support later admin specs.

Deliverables

- `/admin` route added to `src/app/app.routes.ts`
- `/admin/recipes` route added as the first protected admin destination
- lightweight placeholder admin shell or placeholder pages added under an admin feature area
- route guard behavior applied to the admin route tree

Implementation Notes

- Keep the admin UI minimal in this spec; the goal is protected route infrastructure, not full recipe management
- Redirect `/admin` to `/admin/recipes` unless a dedicated dashboard is created as part of the route structure
- Leave the public homepage and recipe detail routes fully accessible
- Use guard behavior that redirects unauthenticated users into the login flow rather than rendering a dead-end page

Outcome

The application has a real protected route tree that future admin features can build on.

---

# Phase 5 - Header Authentication UX

Replace the placeholder sign-in affordance with auth-aware header behavior that reflects the user’s current session.

Deliverables

- working `Sign In` action in the existing header
- authenticated header state that reveals admin navigation
- logout action visible when authenticated
- header behavior preserved across mobile and desktop layouts

Implementation Notes

- Keep the existing search and theme toggle interactions intact
- Avoid large layout shifts when auth state is initializing; the header should remain stable
- Make the admin entry point visible only after authentication succeeds
- Match the current calm, editorial styling rather than introducing dashboard-like controls

Outcome

Authentication state becomes visible and actionable in the main application UI.

---

# Phase 6 - Redirect Restoration And Logout Flow

Complete the session lifecycle so login and logout behave predictably for protected navigation.

Deliverables

- original target route restored after successful login
- safe fallback navigation to `/` when no target route exists
- logout returns the user to a public route
- protected screens are no longer accessible after logout

Implementation Notes

- Use explicit return-target handling rather than relying on accidental browser history behavior
- Preserve deep links such as `/admin/recipes` when authentication interrupts navigation
- Keep logout behavior simple and explicit; do not retain stale protected UI state after session end
- Align with the PRD open question that login should redirect back to the original page

Outcome

Users can enter and leave authenticated flows without losing context or remaining on inaccessible pages.

---

# Phase 7 - Protected Backend Request Readiness

Prepare the frontend to call backend endpoints that require an authenticated admin session.

Deliverables

- protected API rules configured for bearer-token attachment
- future admin recipe management requests can acquire access tokens automatically
- public recipe listing and detail requests remain anonymous unless backend contracts change
- auth failures remain visible to calling code instead of being silently swallowed

Implementation Notes

- Scope token attachment to protected admin operations such as recipe create, update, delete, and image upload paths
- Keep the protected-request configuration close to the auth setup so it can evolve with backend contracts
- Do not introduce broad retry or silent fallback behavior for failed authenticated requests
- This phase is about infrastructure readiness even if the first protected CRUD screens arrive in later specs

Outcome

The authentication feature is integrated with the backend contract, not limited to UI-only sign-in state.

---

# Phase 8 - Testing And Verification

Add coverage for the core authentication behaviors and verify the user journey end to end.

Deliverables

- tests for auth-aware header rendering
- tests for admin route protection and return-path restoration
- tests for logout behavior
- tests that protected API configuration attaches tokens only where intended

Verification Checklist

- unauthenticated users see `Sign In` and no admin navigation
- clicking `Sign In` starts the provider login flow
- visiting `/admin` or `/admin/recipes` while unauthenticated redirects through login
- successful login returns the user to the originally requested protected route
- authenticated users see admin navigation and logout
- logout returns the user to a public page and removes access to protected routes
- public routes `/` and `/r/:id` continue to work without authentication
- protected backend requests receive tokens while public recipe reads do not

Outcome

The feature is safe to use as the foundation for the admin recipe-management specs that follow.

---

# Dependencies And Sequencing

Recommended implementation order:

1. runtime configuration
2. root provider wiring
3. centralized auth facade
4. admin route skeleton
5. route protection and redirect restoration
6. header auth UX
7. logout flow
8. protected backend request readiness
9. tests and verification

This order keeps the core auth contract and routing behavior stable before UI polish and future admin API integration depend on them.

---

# Assumptions To Confirm During Implementation

- Auth0 tenant values for each environment are available before coding begins
- the backend accepts bearer tokens issued for the configured SPA audience
- `/admin` may safely redirect to `/admin/recipes` until a dedicated dashboard spec is implemented
- authenticated access alone is sufficient for MVP admin access; no role or claim-based authorization is required yet
- a dedicated unauthorized page is not required because the PRD expects unauthenticated users to be redirected

If any of these assumptions prove false, the implementation should pause and the auth contract should be clarified before UI and routing work continue.

---

# Completion Criteria

The frontend can authenticate an admin with Auth0, display auth state in the header, protect `/admin` and `/admin/recipes`, restore the originally requested route after login, support logout, and prepare authenticated backend requests for later admin CRUD features without regressing public browsing routes.
