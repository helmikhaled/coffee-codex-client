# Plan - 007 Random Recipe Discovery

This spec adds a "Surprise Me" discovery action on the homepage that fetches a random recipe and navigates users directly to its detail page.

Implementation should be phased so endpoint contract, UI behavior, navigation flow, and failure handling can be validated independently.

---

# Current State

Recipe listing, filters, and search are already implemented on `/`.

Relevant existing files:

- `src/app/features/home/home-page.ts` renders the landing hero and currently mentions random discovery as future work
- `src/app/features/home/recipe-list-api.service.ts` already owns `GET /recipes` query serialization for listing/filter/search
- `src/app/app.routes.ts` maps recipe detail route to `/r/:id`
- `src/app/features/recipe/recipe-page.ts` + `recipe-detail-api.service.ts` already load recipe details by route `id`
- `src/app/features/home/home-page.spec.ts` and `recipe-list-api.service.spec.ts` cover homepage/API request behavior patterns

This feature should extend the existing homepage and API service flow, not introduce a separate discovery route.

---

# Phase 1 - Random Recipe Contract Definition

Define the frontend contract for the random recipe response.

Deliverables

- add a dedicated DTO in `src/app/contracts` for `GET /recipes/random` response (minimum `id: string`)
- response normalization rule for invalid payloads (missing/blank id treated as failure)
- explicit decision on route identifier source (`id` from random endpoint, aligned with existing `/r/:id` usage)

Implementation Notes

- architecture and PRD specify `GET /recipes/random` and navigation to `/r/:id`
- keep contract narrow for MVP; recommendation/trending metadata is out of scope
- avoid coupling random endpoint shape to listing DTOs

Outcome

Random discovery uses a clear, typed API contract.

---

# Phase 2 - API Service Integration

Add typed random endpoint access in the existing home feature API layer.

Deliverables

- extend `RecipeListApiService` with method for `GET /recipes/random`
- endpoint path built from existing `recipesEndpoint` base to keep URL construction consistent
- API tests in `recipe-list-api.service.spec.ts` covering random endpoint request and response shape handling

Implementation Notes

- keep all HTTP concerns in API service; page component should only call typed methods
- preserve current list/filter/search methods unchanged
- if backend returns additional fields, ignore non-required fields for MVP

Outcome

Homepage can request a random recipe through the existing typed API layer.

---

# Phase 3 - Homepage Surprise Me UX

Add the user-facing "Surprise Me" control to the homepage.

Deliverables

- add a primary discovery button labeled `Surprise Me` in `home-page.ts` hero area (or hero-adjacent action row)
- add button loading behavior while request is in flight
- disable the button while loading to prevent repeated clicks
- show a loading label or indicator consistent with existing editorial UI style
- keep accessible semantics (`type="button"`, clear label, keyboard operable)

Implementation Notes

- keep visual design aligned with `docs/design.md` (minimal, calm, low-noise controls)
- ensure placement is visible on both mobile and desktop layouts
- avoid introducing visual competition with existing listing/filter controls

Outcome

Users have a clear, discoverable entry point for random recipe exploration.

---

# Phase 4 - Navigation and Error Handling Flow

Wire the button interaction to random fetch and route transition.

Deliverables

- on click, request `GET /recipes/random`
- on success, navigate to `/r/:id` using Angular Router
- on failure (request error or invalid response), stay on homepage and show actionable inline feedback
- retry behavior by allowing user to click again after failure state clears

Implementation Notes

- guard against duplicate concurrent random requests
- do not swallow failures silently; surface concise user-facing error messaging
- keep error handling scoped to random action so listing/filter/search state remains unaffected

Outcome

Random discovery behaves predictably across success and failure paths without regressing homepage browsing behavior.

---

# Phase 5 - Component State Boundaries

Keep random-discovery state local and isolated from listing state.

Deliverables

- add local state in `HomePage` (or small dedicated helper) for `isRandomLoading`
- add local state in `HomePage` (or small dedicated helper) for `randomError`
- add a dedicated action method to execute random fetch + navigation

Implementation Notes

- `RecipeListStore` should remain focused on listing/filter/search pagination state
- isolating random action state avoids coupling unrelated concerns and reduces regression risk

Outcome

State ownership stays clean: listing concerns in store, random CTA concerns in page-level interaction state.

---

# Phase 6 - Automated Test Coverage

Add focused tests for new random discovery behavior.

Deliverables

- update `recipe-list-api.service.spec.ts` to verify `GET /recipes/random` request construction
- update `recipe-list-api.service.spec.ts` to verify typed response handling for random payload
- update `home-page.spec.ts` to verify `Surprise Me` button rendering
- update `home-page.spec.ts` to verify click-triggered random fetch and router navigation to `/r/:id`
- update `home-page.spec.ts` to verify loading-disabled button behavior (no duplicate requests)
- update `home-page.spec.ts` to verify inline error feedback and retry on random endpoint failure

Verification Checklist

- clicking `Surprise Me` issues exactly one random request per interaction
- successful random response navigates to `/r/<id>`
- failed random response keeps user on `/` and shows recovery-friendly message
- listing/filter/search behavior remains unchanged when random action is unused
- random action remains usable on mobile and desktop layouts

Outcome

Feature behavior is covered end to end at API and homepage integration levels.

---

# Dependencies and Sequencing

Recommended implementation order:

1. random response DTO contract
2. API service method + API tests
3. homepage CTA UI and loading state
4. navigation wiring and error handling
5. homepage tests for success/failure/concurrency behavior

This order minimizes rework by stabilizing data flow before final UI interaction wiring.

---

# Assumptions to Confirm During Implementation

- backend returns a non-empty `id` in `GET /recipes/random` response
- returned `id` is valid for existing `GET /recipes/{id}` detail endpoint
- random endpoint latency and reliability are acceptable for direct-click navigation flow
- no additional analytics instrumentation is required in this spec

If any assumption fails, implementation should pause and backend contract behavior should be clarified before final UI wiring.

---

# Completion Criteria

Homepage users can click `Surprise Me`, the frontend requests `GET /recipes/random`, successful responses navigate to `/r/:id`, failure states are visible and recoverable, and the behavior is covered by automated API and homepage tests without regressions to listing/filter/search flows.
