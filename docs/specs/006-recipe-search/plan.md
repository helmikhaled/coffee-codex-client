# Plan - 006 Recipe Search

This spec adds keyword-based recipe search through the shared application header and integrates it into the existing homepage listing flow.

Implementation should be phased so query contracts, header UX, URL state, listing reload behavior, and tests can be validated independently.

---

# Current State

Recipe listing and filtering from Specs 002 and 005 are already active on `/`.

Relevant existing files:

- `src/app/layout/app-header/app-header.html` contains a visual search icon button only (no functional search input)
- `src/app/features/home/home-page.ts` reads `category` and `tag` from query params on init and manages filter-driven URL updates
- `src/app/features/home/recipe-list.store.ts` owns listing state, pagination, loading states, and category/tag filters
- `src/app/features/home/recipe-list-api.service.ts` requests `GET /recipes` with `page`, `pageSize`, optional `category`, and optional `tag`
- `src/app/contracts/recipe-list-query.dto.ts` currently supports pagination + category/tag only

This feature should extend that existing path rather than introducing a separate search-specific listing implementation.

---

# Phase 1 - Search Query Contract

Define the frontend query model for keyword search.

Deliverables

- `RecipeListQueryDto` extended with optional `search`
- shared normalization rule for search input (`trim`; empty string maps to omitted query param)
- existing filter/query helper types updated so pagination + filters + search compose in one shape

Implementation Notes

- Keep endpoint contract aligned to architecture and PRD: `GET /recipes?search=`
- Do not force case transformation on the client; send user input after normalization and let backend matching remain authoritative
- Omit `search` from query params when no meaningful term is present

Outcome

Type-safe contracts support combined pagination, filters, and keyword search.

---

# Phase 2 - API Integration For Search

Extend listing HTTP integration so search terms are sent consistently.

Deliverables

- `RecipeListApiService.getRecipes` serializes optional `search` query param
- `getFirstPage` and `getNextPage` signatures carry search alongside category/tag
- API-level tests cover inclusion, trimming, and omission behavior for `search`

Implementation Notes

- Preserve existing endpoint (`GET /recipes`) and pagination behavior
- Keep query serialization centralized in API service; page/store components should not build raw query strings
- Preserve current defensive behavior for empty filter values

Outcome

The frontend can fetch searched recipe pages through the same typed API layer used by listing and filters.

---

# Phase 3 - Header Search UI And Interaction Model

Implement the user-facing search control in the shared header.

Deliverables

- functional header search input replacing placeholder-only behavior
- desktop behavior: search field visible in header
- mobile behavior: collapsible search UI triggered from search icon
- submit triggers for Enter key and search action button/icon

Implementation Notes

- Keep visual language consistent with `docs/design.md` (minimal, calm, low-noise controls)
- Ensure accessible form semantics (`role`, labels, keyboard submit, focus visibility)
- Keep header logic focused on search input and URL intent; listing data state remains in the home feature

Outcome

Users can perform search from the global header on both desktop and mobile.

---

# Phase 4 - URL Query Parameter Strategy And Route Behavior

Define how search state is represented in URL and shared with existing filter params.

Deliverables

- query param contract on `/`: `search` (plus existing `category` and `tag`)
- deterministic update rules so search updates do not drop active filters and filter updates do not drop active search
- clear-search behavior that removes only `search` while preserving unrelated params
- cross-route behavior: search from non-home routes navigates to `/` with search query applied

Implementation Notes

- Use URL as source of truth for persistence, deep links, and refresh/back-forward behavior
- Normalize invalid/empty query-param values before syncing into state
- Avoid duplicated navigation churn by checking whether the normalized query already matches current state

Outcome

Search state is shareable and stable across reloads, deep links, and route transitions.

---

# Phase 5 - Store And Home Page Integration

Integrate search into listing state transitions while preserving filter and pagination behavior.

Deliverables

- `RecipeListStore` extended with search term state and actions (`applySearch`, `clearSearch`, unified sync from URL state)
- filter/search changes reset listing to page 1 and reload results
- load-more requests include active search + active filters
- `HomePage` query-param sync updated from one-time snapshot initialization to reactive query updates

Implementation Notes

- Preserve current stale-response protection (`requestVersion`) so rapid query changes cannot overwrite newer results
- Keep search logic isolated from presentational listing components (`RecipeGrid`, `RecipeCard`)
- Ensure existing category/tag behavior remains intact when search is absent

Outcome

Search, filters, and pagination operate together in one coherent listing state model.

---

# Phase 6 - Search Empty State And UX Feedback

Update homepage feedback states for search-specific outcomes.

Deliverables

- empty-state copy aligned to PRD (`No recipes found`) when searched results are empty
- recovery action to clear search and return to full listing
- messaging that differentiates empty search from generic empty-library state

Implementation Notes

- Keep copy concise and consistent with current editorial tone
- Ensure clear action updates URL and store together
- Maintain existing error-state behavior for initial-load and load-more failures

Outcome

Users get clear, actionable feedback when a query has no matches.

---

# Phase 7 - Testing And Verification

Add coverage across header, API, store, and page integration.

Deliverables

- API service tests for `search` query serialization
- store tests for search application, reload reset, and load-more query composition
- home-page integration tests for search-driven requests and empty-state behavior
- header component tests for submit interactions (Enter + button), mobile collapse behavior, and route navigation intent

Verification Checklist

- searching `matcha` issues `GET /recipes?page=1&pageSize=12&search=matcha`
- search requests preserve active `category` and `tag` params when present
- load-more under active search requests page N+1 with same search term
- empty search result renders `No recipes found` and clear action restores full listing
- search from `/r/:id` navigates to `/` and applies the query
- mobile and desktop header search interactions are keyboard-accessible and usable

Outcome

Search feature is verified end to end without regressions to listing/filter flows.

---

# Dependencies And Sequencing

Recommended implementation order:

1. search query contract
2. API search support
3. URL state rules
4. store integration
5. header UI wiring
6. homepage UX state updates
7. tests and verification

This sequence reduces rework by stabilizing data flow and URL semantics before final UI wiring.

---

# Assumptions To Confirm During Implementation

- backend supports `search` on `GET /recipes` with case-insensitive matching
- backend search behavior covers title, ingredients, and tags as defined by the PRD assumptions/open questions
- backend allows combining `search` with existing `category` and `tag` params
- searched responses keep the same pagination metadata contract used by current listing

If any assumption fails, implementation should pause and API behavior should be clarified before UI work continues.

---

# Completion Criteria

Users can submit a keyword search from the header, listing results reload via `GET /recipes?search=...`, pagination remains functional, search state persists in URL alongside filters, empty-result UX is clear, and automated tests cover the main search flows.
