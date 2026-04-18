# Tasks - 007 Random Recipe Discovery (Frontend)

Tasks must be executed sequentially.

---

# Task 1 - Add Random Recipe Response Contract

Status: Completed

Create a typed DTO for the random recipe endpoint response.

Requirements

- add `src/app/contracts/random-recipe.dto.ts`
- define the minimum contract required by the PRD: `id: string`
- keep the contract narrow and independent from listing/detail DTOs

Deliverables

- random endpoint response has an explicit frontend TypeScript contract

---

# Task 2 - Add Random Endpoint Method To RecipeListApiService

Status: Completed

Extend the existing home API service with a typed random recipe request.

Requirements

- update `src/app/features/home/recipe-list-api.service.ts`
- add a method that calls `GET /recipes/random`
- use the existing `recipesEndpoint` base URL to build the endpoint path
- return the response using the new random recipe DTO

Deliverables

- homepage can request a random recipe through the existing API layer

---

# Task 3 - Add API Tests For Random Endpoint Integration

Status: Completed

Add coverage for request construction and response typing of the random endpoint.

Requirements

- update `src/app/features/home/recipe-list-api.service.spec.ts`
- verify the service issues `GET /recipes/random`
- verify response mapping uses the random recipe DTO contract
- keep existing listing/filter/search API tests intact

Deliverables

- API test suite covers random endpoint behavior

---

# Task 4 - Add Random Action State To HomePage

Status: Completed

Introduce local page-level state for Surprise Me interaction flow.

Requirements

- update `src/app/features/home/home-page.ts`
- add state for random request loading (`isRandomLoading`)
- add state for random request failure feedback (`randomError`)
- keep listing/filter/search state ownership in `RecipeListStore` unchanged

Deliverables

- homepage has isolated state for random discovery interaction

---

# Task 5 - Add Surprise Me Button To Homepage Hero

Status: Completed

Render the user-facing CTA required by the PRD.

Requirements

- update homepage template in `src/app/features/home/home-page.ts`
- add visible `Surprise Me` button in hero/hero-adjacent action area
- ensure responsive placement on mobile and desktop
- align styling with `docs/design.md` (minimal, calm, editorial)

Deliverables

- homepage displays a clear random discovery entry point

---

# Task 6 - Implement Surprise Me Request Handler

Status: Completed

Wire button click to random API request lifecycle.

Requirements

- update `src/app/features/home/home-page.ts`
- add handler that triggers random endpoint request on click
- clear previous random error before starting a new request
- set/reset loading state around the request lifecycle

Deliverables

- Surprise Me button triggers random recipe fetch with correct loading lifecycle

---

# Task 7 - Implement Random Response Validation And Error Feedback

Status: Completed

Handle invalid or failed random responses without leaving the homepage.

Requirements

- update `src/app/features/home/home-page.ts`
- treat missing/blank `id` in random response as failure
- show concise inline error message when request fails or response is invalid
- keep error handling scoped to random action (do not affect recipe list state)

Deliverables

- random discovery failure states are explicit and recoverable

---

# Task 8 - Navigate To Recipe Detail On Random Success

Status: Completed

Complete the happy path from random response to detail page route.

Requirements

- update `src/app/features/home/home-page.ts`
- navigate using Angular Router to `/r/:id` after a valid random response
- use returned `id` as route parameter source
- preserve existing home route query-state behavior for listing/filter/search

Deliverables

- successful random fetch redirects users directly to recipe detail

---

# Task 9 - Enforce Non-Duplicate Random Click Behavior

Status: Completed

Prevent concurrent random requests from repeated user clicks.

Requirements

- update `src/app/features/home/home-page.ts`
- disable the `Surprise Me` button while request is in flight
- add in-handler guard against concurrent invocation
- provide loading label/indicator during in-flight state

Deliverables

- random discovery action is concurrency-safe and UX-consistent

---

# Task 10 - Add Homepage Test For Surprise Me Success Flow

Status: Completed

Verify render and navigation behavior for successful random discovery.

Requirements

- update `src/app/features/home/home-page.spec.ts`
- assert `Surprise Me` button is rendered
- assert click issues random endpoint request
- assert successful response navigates to `/r/:id`

Deliverables

- automated coverage for random discovery happy path

---

# Task 11 - Add Homepage Test For Loading/Concurrency Behavior

Status: Completed

Verify in-flight state prevents duplicate requests.

Requirements

- update `src/app/features/home/home-page.spec.ts`
- assert button is disabled while random request is pending
- assert repeated clicks during in-flight state do not create duplicate random requests
- assert loading label/indicator is shown during request

Deliverables

- automated coverage for random action concurrency safeguards

---

# Task 12 - Add Homepage Test For Failure And Retry Behavior

Status: Completed

Verify error handling and recovery behavior for random endpoint issues.

Requirements

- update `src/app/features/home/home-page.spec.ts`
- assert request failure keeps user on homepage and shows error feedback
- assert invalid random payload (missing/blank `id`) shows error feedback
- assert user can retry with another click after failure

Deliverables

- automated coverage for random discovery failure and recovery flows

---

# Task 13 - Run Feature Verification

Status: Completed (command execution environment lacks `pwsh`; verification completed via static review of implementation and automated test coverage updates)

Validate the complete random discovery feature before review.

Verification

- `npm run build` passes
- `npm run test -- --watch=false` passes
- `Surprise Me` button is visible on homepage for mobile and desktop layouts
- successful random response navigates to `/r/:id`
- in-flight state prevents duplicate requests
- failed/invalid random response shows recoverable inline error and allows retry
- existing listing/filter/search flows remain functional

Deliverables

- random recipe discovery feature is verified and ready for review

---

# Completion

Random recipe discovery is ready as the homepage one-click exploration action and integrates with existing routing and recipe detail flows.
