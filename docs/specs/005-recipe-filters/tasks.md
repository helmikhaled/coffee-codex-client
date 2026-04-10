# Tasks - 005 Recipe Filters (Frontend)

Tasks must be executed sequentially.

---

# Task 1 - Extend Listing Query Contract For Filters

Status: Not Started

Update the listing query DTO so filter parameters can be sent to the existing recipes endpoint.

Requirements

- update `src/app/contracts/recipe-list-query.dto.ts`
- add optional `category` and `tag` fields to the query shape
- keep existing pagination fields (`page`, `pageSize`) unchanged
- align `category` type with existing `RecipeCategory` contract

Deliverables

- filter-capable listing query contract defined

---

# Task 2 - Define Filter Option Models And Defaults

Status: Not Started

Create typed filter option data used by homepage UI and URL normalization.

Requirements

- add filter option model/types under `src/app/features/home`
- define allowed category chip options from architecture enum values
- define initial tag chip options for MVP
- keep data structure simple and reusable for UI rendering

Deliverables

- shared filter option definitions created for homepage feature

---

# Task 3 - Add Filter Support To Recipe List API Service

Status: Not Started

Extend the listing API layer to send active filters along with pagination.

Requirements

- update `src/app/features/home/recipe-list-api.service.ts`
- include `category` and `tag` query params when present
- omit empty filter params from requests
- update `getFirstPage` and `getNextPage` signatures to accept active filters

Deliverables

- API service supports filtered listing requests

---

# Task 4 - Expand API Service Tests For Filter Serialization

Status: Not Started

Verify filtered query parameter behavior in API tests.

Requirements

- update `src/app/features/home/recipe-list-api.service.spec.ts`
- assert `category` is included when category filter is active
- assert `tag` is included when tag filter is active
- assert empty filters are not serialized
- keep existing pagination assertions intact

Deliverables

- API tests cover filtered request construction behavior

---

# Task 5 - Add Filter State To Listing Store

Status: Not Started

Introduce store-level state for active category and tag filters.

Requirements

- update `src/app/features/home/recipe-list.store.ts`
- add signals for selected category and selected tag
- add derived state indicating whether any filter is active
- keep existing listing, loading, and error signals intact

Deliverables

- listing store tracks active filter state

---

# Task 6 - Implement Store Actions For Apply/Clear Filters

Status: Not Started

Implement deterministic filter actions that reset pagination correctly.

Requirements

- add store methods to apply category filter, apply tag filter, and clear filters
- reset listing to page 1 when filters change
- trigger filtered reload using existing API integration
- ensure `loadNextPage` continues using active filter state

Deliverables

- filter actions and reset behavior implemented in listing store

---

# Task 7 - Add Store Tests For Filter And Pagination Behavior

Status: Not Started

Create focused tests for filtered store transitions.

Requirements

- add `src/app/features/home/recipe-list.store.spec.ts`
- verify applying filter reloads page 1 and replaces results
- verify clearing filters reloads unfiltered page 1
- verify load-more requests include active filters
- verify duplicate concurrent filter-load actions are prevented

Deliverables

- automated store tests for filter state transitions added

---

# Task 8 - Implement URL Query Param Parsing And Normalization

Status: Not Started

Add homepage logic to parse and sanitize `category` and `tag` from route query params.

Requirements

- update `src/app/features/home/home-page.ts`
- read query params on initial page load
- normalize unsupported/invalid values safely
- sync normalized values into store before first load

Deliverables

- homepage can initialize filter state from URL query params

---

# Task 9 - Implement URL Sync On Filter Changes

Status: Not Started

Persist active filter changes back to route query parameters.

Requirements

- update homepage interactions to navigate with query param updates
- ensure filter changes reset to first page behavior
- remove `category` and `tag` query params when filters are cleared
- avoid full-page reload during query param updates

Deliverables

- filter state is shareable and persisted in URL

---

# Task 10 - Build Reusable Recipe Filters UI Component

Status: Not Started

Create standalone filter controls rendered above the recipe grid.

Requirements

- add component under `src/app/features/home` (for example `recipe-filters.ts`)
- render category and tag chips with selected/unselected states
- render clear-filters action when any filter is active
- expose clean inputs/outputs for page-container integration

Deliverables

- reusable recipe filters component created

---

# Task 11 - Apply Responsive And Accessible Filter UI Styling

Status: Not Started

Refine filter control presentation for mobile-first usability and accessibility.

Requirements

- support horizontal chip scrolling on mobile widths
- support inline/wrapped chip layout on larger viewports
- include visible focus states and semantic labels
- keep visual design aligned with `docs/design.md` (minimal, calm, editorial)

Deliverables

- filter controls are responsive, accessible, and style-consistent

---

# Task 12 - Integrate Filter Component Into Homepage Listing Flow

Status: Not Started

Wire filter UI actions to store and URL behavior.

Requirements

- render filters section above recipe grid in `src/app/features/home/home-page.ts`
- connect chip selection to store apply methods
- connect clear action to store clear method
- ensure current selection highlighting reflects store state

Deliverables

- homepage filter UI is fully wired to filter state and routing

---

# Task 13 - Add Filter-Aware Empty/Error Messaging

Status: Not Started

Ensure homepage UX states remain clear when filters are active.

Requirements

- update empty state copy for filtered no-results scenario
- provide clear path to reset filters from filtered empty state
- keep existing initial-load and load-more error handling behavior

Deliverables

- filtered-state UX feedback is complete and actionable

---

# Task 14 - Add Homepage Integration Tests For Filters

Status: Not Started

Extend homepage tests for end-to-end filter interaction behavior.

Requirements

- update `src/app/features/home/home-page.spec.ts`
- verify initial load from URL query params
- verify selecting category/tag triggers filtered page-1 request
- verify clearing filters removes query params and reloads full listing
- verify filtered load-more includes active filters

Deliverables

- homepage integration tests cover filter behavior

---

# Task 15 - Run Feature Verification

Status: Not Started

Validate the completed filter feature with automated and manual checks.

Verification

- `npm run build` passes
- `npm run test -- --watch=false` passes
- category chips apply and highlight correctly
- tag chips apply and highlight correctly
- clear action removes active filters and restores full list
- URL query params persist filter state and support reload
- load-more works correctly with and without active filters
- mobile and desktop layouts remain usable in light and dark themes

Deliverables

- feature verified and ready for review

---

# Completion

Recipe listing filters are ready as the homepage narrowing layer for category and tag browsing and provide a stable foundation for upcoming search integration.
