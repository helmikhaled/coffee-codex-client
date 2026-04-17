# Tasks - 006 Recipe Search (Frontend)

Tasks must be executed sequentially.

---

# Task 1 - Extend Listing Query Contract With Search

Status: Completed

Update the listing query DTO to support keyword search.

Requirements

- update `src/app/contracts/recipe-list-query.dto.ts`
- add optional `search` field
- keep existing pagination (`page`, `pageSize`) and filter fields (`category`, `tag`) unchanged
- keep type shape compatible with existing listing API and store usage

Deliverables

- search-capable listing query contract defined

---

# Task 2 - Serialize Search Query Param In Recipe List API Service

Status: Completed

Extend the listing API service so it sends `search` when provided.

Requirements

- update `src/app/features/home/recipe-list-api.service.ts`
- include `search` in query params when non-empty after trim
- omit `search` when empty or whitespace-only
- update `getFirstPage` and `getNextPage` signatures to accept search along with category/tag

Deliverables

- API service supports `GET /recipes?...&search=...`

---

# Task 3 - Add API Tests For Search Query Serialization

Status: Completed

Verify request serialization behavior for search in API tests.

Requirements

- update `src/app/features/home/recipe-list-api.service.spec.ts`
- assert `search` is serialized when provided
- assert whitespace-only search is omitted
- assert search can be serialized together with category/tag
- keep existing pagination assertions intact

Deliverables

- API test coverage includes search query behavior

---

# Task 4 - Add Search State Signals To RecipeListStore

Status: Completed

Introduce explicit search state in the listing store.

Requirements

- update `src/app/features/home/recipe-list.store.ts`
- add signal for active search term
- expose readonly accessors for active search term
- add derived state helpers needed by page UX (for example, whether search is active)

Deliverables

- store tracks active search term as first-class listing state

---

# Task 5 - Implement Store Actions For Apply/Clear Search

Status: Completed

Add deterministic store actions for search transitions.

Requirements

- update `src/app/features/home/recipe-list.store.ts`
- add methods to apply search and clear search
- normalize input by trimming and treating empty values as cleared state
- avoid unnecessary reloads when normalized search term has not changed

Deliverables

- store exposes stable search actions for page/header integration

---

# Task 6 - Compose Active Query State For Initial And Next-Page Loads

Status: Completed

Ensure all listing requests include active filters and active search consistently.

Requirements

- update `src/app/features/home/recipe-list.store.ts`
- include active `search`, `category`, and `tag` in first-page requests
- include active `search`, `category`, and `tag` in load-more requests
- preserve existing request-version guard against stale responses

Deliverables

- pagination remains correct under active search and filters

---

# Task 7 - Add Store Tests For Search And Pagination Behavior

Status: Completed

Verify store behavior for search-driven state transitions.

Requirements

- update `src/app/features/home/recipe-list.store.spec.ts`
- verify applying search reloads page 1 and replaces results
- verify clearing search reloads unfiltered page 1 (or filter-only state when filters remain)
- verify load-more requests include active search term
- verify duplicate no-op search actions do not issue duplicate reloads

Deliverables

- automated store coverage for search state transitions

---

# Task 8 - Parse And Normalize Search Query Param In HomePage

Status: Completed

Add route-query parsing for `search` on the homepage container.

Requirements

- update `src/app/features/home/home-page.ts`
- parse `search` from route query params
- normalize empty/whitespace values to null
- keep existing category/tag normalization behavior intact

Deliverables

- homepage can initialize normalized search state from URL

---

# Task 9 - Switch HomePage Query Sync To Reactive Route Param Handling

Status: Completed

Make homepage react to query-param changes after initial render.

Requirements

- update `src/app/features/home/home-page.ts`
- replace one-time snapshot-only initialization with reactive query-param handling
- sync query-param changes into store search/filter state deterministically
- prevent duplicate reloads when normalized query state is unchanged

Deliverables

- homepage responds correctly to header-driven query changes and browser navigation

---

# Task 10 - Update HomePage URL Writer To Preserve Combined Query State

Status: Completed

Ensure query-param updates preserve active search and active filters.

Requirements

- update homepage query update logic in `src/app/features/home/home-page.ts`
- when category/tag changes, preserve active search in URL
- when search changes, preserve active category/tag in URL
- when clearing search, remove only `search` while retaining active filters

Deliverables

- URL state remains consistent across combined search/filter interactions

---

# Task 11 - Implement Header Search Interaction Logic

Status: Completed

Add component logic for search input, submit, and clear behavior in the shared header.

Requirements

- update `src/app/layout/app-header/app-header.ts`
- add local state for search input value and mobile-expanded state
- add handlers for submit via Enter key and search action button
- add handler to clear search input and trigger cleared query state

Deliverables

- header contains functional interaction logic for search actions

---

# Task 12 - Build Desktop Header Search UI

Status: Completed

Render always-visible desktop search input in header.

Requirements

- update `src/app/layout/app-header/app-header.html`
- add accessible search form controls visible on desktop
- keep existing brand, theme toggle, and sign-in controls intact
- keep styling aligned with calm/editorial design language in `docs/design.md`

Deliverables

- desktop header displays usable search input and action controls

---

# Task 13 - Build Mobile Collapsible Header Search UI

Status: Completed

Implement collapsible search behavior for smaller screens.

Requirements

- update `src/app/layout/app-header/app-header.html`
- keep search icon trigger for mobile
- toggle expandable/collapsible search input region on mobile
- ensure focus and keyboard behavior remain accessible when expanded

Deliverables

- mobile header supports collapsible search interaction

---

# Task 14 - Wire Header Search To Router Query Params And Cross-Route Navigation

Status: Completed

Connect header search actions to route state.

Requirements

- update `src/app/layout/app-header/app-header.ts`
- on submit from non-home routes, navigate to `/` and apply `search` query param
- on submit from home route, update query params without full reload
- preserve active `category` and `tag` query params during search updates

Deliverables

- header search drives URL state and listing updates from any route

---

# Task 15 - Add Search-Specific Empty-State Messaging And Recovery

Status: Completed

Align homepage empty-state UX with PRD for no-match search results.

Requirements

- update empty-state logic/copy in `src/app/features/home/home-page.ts`
- show `No recipes found` when an active search returns zero items
- add explicit clear-search recovery action
- keep non-search empty and error states unchanged

Deliverables

- search no-results UX is clear and actionable

---

# Task 16 - Add Header And Homepage Integration Tests For Search

Status: Completed

Add automated coverage for end-to-end search interactions.

Requirements

- create `src/app/layout/app-header/app-header.spec.ts`
- update `src/app/features/home/home-page.spec.ts`
- verify Enter and button submit behavior
- verify search requests include expected query params
- verify search from `/r/:id` navigates to `/` with query
- verify no-results state and clear-search recovery flow

Deliverables

- integration-level tests cover critical search journeys

---

# Task 17 - Run Feature Verification

Status: Completed

Validate completed search behavior with automated and manual checks.

Verification

- `npm run build` passes
- `npm run test -- --watch=false` passes
- desktop search input is visible and functional
- mobile search is collapsible and functional
- search + category/tag combinations serialize correctly
- pagination works under active search
- `No recipes found` appears for empty search results
- clearing search restores full listing while preserving active filters

Deliverables

- recipe search feature verified and ready for review

---

# Completion

Recipe search is ready as the primary keyword discovery layer on top of the existing listing and filtering flow.
