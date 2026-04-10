# Plan - 005 Recipe Filters

This spec adds recipe filtering on the homepage so users can narrow the listing by category and tag.

Implementation should be phased so query contracts, URL state, API behavior, and UI interactions can be validated independently.

---

# Current State

The recipe listing flow from Spec 002 is already implemented and active on `/`.

Relevant existing files:

- `src/app/features/home/home-page.ts` renders hero + listing grid and drives load/retry actions
- `src/app/features/home/recipe-list.store.ts` manages listing state, pagination, and load-more behavior
- `src/app/features/home/recipe-list-api.service.ts` currently requests `/recipes` with `page` and `pageSize` only
- `src/app/contracts/recipe-list-query.dto.ts` currently models pagination query fields only

This feature should extend the existing listing flow and state model rather than creating a second listing path.

---

# Phase 1 - Filter Query Contract And Option Model

Define the frontend query and option model for category and tag filtering.

Deliverables

- `RecipeListQueryDto` extended to include optional filter fields needed by `/recipes`
- typed filter-state model for homepage usage (selected category, selected tag)
- category options aligned to `RecipeCategory` from architecture
- initial tag option source defined for chip rendering

Implementation Notes

- Keep `RecipeSummaryDto` and response DTOs unchanged
- Preserve architecture contract: filtering is query-parameter driven against `GET /recipes`
- Model filters so future search spec (`search` query) can compose without redesign

Outcome

The listing feature has a stable TypeScript contract for filter-aware requests.

---

# Phase 2 - URL Query Parameter Strategy

Establish route-query behavior for filter persistence and refresh-safe state.

Deliverables

- query parameter mapping for `category` and `tag` on route `/`
- parsing/normalization rules for invalid or unknown query values
- URL update rules when user applies or clears filters
- page reset policy to `page=1` when filters change

Implementation Notes

- Follow PRD open question: filters persist in URL parameters
- Keep URL logic centralized in the page container/state layer, not in presentational filter chips
- Avoid breaking direct-link behavior for users opening pre-filtered URLs

Outcome

Homepage filters are shareable and survive reload/navigation via query params.

---

# Phase 3 - Filter-Aware API Integration

Extend listing API requests to include active filters.

Deliverables

- `RecipeListApiService` support for optional `category` and `tag` params
- `getFirstPage` and `getNextPage` signatures updated to carry active filters
- query serialization rules that omit empty filters
- API tests updated for filtered request construction

Implementation Notes

- Preserve existing endpoint (`GET /recipes`) and pagination behavior
- Avoid adding new backend endpoints or changing architecture-defined contracts
- Keep transport responsibilities inside API service; no UI logic in service layer

Outcome

Backend filtering can be invoked through the existing typed listing API layer.

---

# Phase 4 - Store-Level Filter State And Pagination Reset

Integrate filters into listing state transitions while preserving load-more behavior.

Deliverables

- filter signals in `RecipeListStore` for active category and active tag
- store methods to apply category, apply tag, clear filters, and sync from route params
- automatic pagination reset and list replacement on filter change
- load-more requests that respect currently active filters

Implementation Notes

- Keep store provider scoped to homepage as currently designed
- Prevent duplicate concurrent fetches during rapid filter interaction
- Maintain separation between initial-load errors and load-more errors under filtered state
- Ensure stale response handling does not overwrite newer filter selections

Outcome

Filtering and pagination work together predictably in a single coherent listing store.

---

# Phase 5 - Filter UI Component(s)

Build reusable filter controls above the recipe grid.

Deliverables

- standalone filter component (or equivalent section) under `src/app/features/home`
- category chips with selected-state styling
- tag chips with selected-state styling
- clear-filter action that restores full listing

Implementation Notes

- Follow `docs/design.md`: minimal editorial UI, calm spacing, low visual noise
- Mobile-first behavior: horizontally scrollable chip row on small screens
- Desktop behavior: inline filter controls without crowded layout
- Keep controls accessible with clear labels, focus states, and ARIA semantics

Outcome

Users can discover and apply filters quickly from the listing page UI.

---

# Phase 6 - Homepage Integration And UX States

Integrate filter controls with existing page composition and state feedback.

Deliverables

- filter controls rendered above recipe grid in `home-page.ts`
- chip interactions wired to store + URL sync
- selected filter highlighting and clear action wired end-to-end
- filtered empty-state messaging with explicit recovery path

Implementation Notes

- Preserve existing hero and listing visual hierarchy
- Keep non-filtered behavior unchanged when no filter is active
- Ensure "Load More" visibility/disabled logic remains correct under active filters

Outcome

Homepage provides a complete filtered-browsing experience without regressions to existing listing flow.

---

# Phase 7 - Testing And Verification

Add coverage for filter behavior across API, store, and page integration.

Deliverables

- API service tests for `category` and `tag` query serialization
- store tests for filter application, pagination reset, and clear-filter behavior
- homepage tests for:
- initial state from URL query params
- category/tag chip interactions
- filtered reload and filtered load-more behavior
- filtered empty state and clear action

Verification Checklist

- selecting category updates URL and triggers filtered page-1 request
- selecting tag updates URL and triggers filtered page-1 request
- clearing filters removes query params and reloads unfiltered page-1
- load-more requests include active filters
- existing listing, retry, and navigation behaviors continue to work
- layout is usable on mobile and desktop in light and dark themes

Outcome

Filter functionality is verified for correctness, resilience, and responsive usability.

---

# Dependencies And Sequencing

Recommended implementation order:

1. query contract and option model
2. API request support
3. store filter state and reset logic
4. URL query param sync
5. filter UI component(s)
6. homepage integration and UX states
7. tests and verification

This sequence minimizes rework by stabilizing filter data flow before final UI wiring.

---

# Assumptions To Confirm During Implementation

- backend accepts `category` and `tag` query params on `GET /recipes`
- tag filtering for MVP is single active tag selection from multiple chip options
- route query parameters for this spec are limited to `category` and `tag`
- backend filtered responses preserve the same pagination metadata contract used today

If any assumption fails, implementation should pause and the API contract should be clarified before UI work continues.

---

# Completion Criteria

Homepage users can apply and clear category/tag filters via chip-based controls, filter state persists in URL query parameters, listing results refresh from page 1 with active filters, pagination remains functional for filtered results, and behavior is covered by automated verification.
