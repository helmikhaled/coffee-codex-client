# Plan - 002 Recipe Listing

This spec replaces the current homepage placeholder with the first real product feature: a curated, paginated recipe library.

Implementation should be performed in phases so data contracts, UI composition, and interaction behavior can be verified independently.

---

# Current State

The application shell from Spec 001 is already in place.

Relevant existing files:

- `src/app/features/home/home-page.component.ts` currently renders placeholder copy
- `src/app/app.routes.ts` already maps `/` to `HomePageComponent`
- `src/app/layout/app-shell/app-shell.component.html` provides the page container used by the landing page

This feature should build on that foundation rather than introduce a parallel entry route.

---

# Phase 1 - Listing Domain And API Contract

Define the frontend contract for recipe listing and pagination.

Deliverables

- `RecipeSummaryDto` type added under `src/app/contracts`
- paginated response contract added under `src/app/contracts`
- typed query shape for `page` and `pageSize`
- explicit mapping of UI fields needed by the card and grid

Implementation Notes

- Align DTO fields with `docs/architecture.md`
- Treat backend ordering as authoritative; the frontend must not re-sort results
- Include `authorName` in the contract because the PRD requires author metadata on the grid
- Model pagination metadata needed to determine whether `Load More` should remain visible

Outcome

The listing feature has stable TypeScript contracts for backend integration.

---

# Phase 2 - Data Access Layer

Implement the feature-scoped HTTP integration for fetching paginated recipes.

Deliverables

- recipe listing data service or resource under `src/app/features/home`
- request method for `GET /recipes?page=&pageSize=`
- centralized handling for loading, success, and failure states
- provider wiring in the existing standalone architecture if needed

Implementation Notes

- Use Angular's current signal-friendly data flow rather than pushing imperative subscription logic into the page component
- Keep the data access API narrow: initial page fetch and next-page fetch are sufficient for this spec
- Preserve append order exactly as returned by the backend
- Normalize any missing optional fields defensively so the UI can render predictably

Outcome

Homepage components can request recipe pages through a typed, reusable integration layer.

---

# Phase 3 - Landing Page Composition

Replace the placeholder homepage with the actual listing page structure described in the vision and design documents.

Deliverables

- updated `HomePageComponent` structure
- hero section above the listing grid
- section framing for curated recipes
- responsive spacing aligned with the existing app shell

Implementation Notes

- Keep the hero lightweight; this spec is centered on listing, not a full editorial landing page build
- Reflect the design direction from `docs/design.md`: minimal, calm, image-forward, generous whitespace
- Ensure the page remains usable before data resolves by reserving space for loading content

Outcome

The root route `/` becomes the real recipe listing experience rather than a placeholder.

---

# Phase 4 - Recipe Card And Grid Components

Build reusable presentational components for the recipe collection.

Deliverables

- standalone `RecipeCardComponent`
- standalone `RecipeGridComponent` or equivalent presentational wrapper
- responsive card layout for mobile, tablet, and desktop breakpoints
- lazy-loaded thumbnail images
- clickable card navigation to `/r/:id`

Implementation Notes

- Card fields should include thumbnail, title, difficulty, brew count, and author to satisfy the PRD
- Favor presentational inputs over embedded data-fetching logic
- Keep markup accessible: semantic headings, descriptive image alt text, clear interactive hit area, visible focus states
- Match curated editorial styling instead of generic dashboard cards

Outcome

Recipe summaries render consistently and can be reused by later discovery-related specs.

---

# Phase 5 - Pagination And Interaction Flow

Implement initial fetch and incremental loading behavior.

Deliverables

- initial load with `page = 1` and `pageSize = 12`
- `Load More` action wired to fetch the next page
- append behavior that preserves existing recipes on screen
- hidden or disabled `Load More` state when no further pages exist

Implementation Notes

- Prevent duplicate page requests while a fetch is already in progress
- Keep the interaction simple and explicit; infinite scroll is out of scope
- Handle partial failure safely so previously loaded items remain visible
- Preserve scroll position naturally by appending below the current grid

Outcome

Users can continue browsing the curated list without losing context.

---

# Phase 6 - Loading, Empty, And Error States

Add the non-happy-path UX required for a production-ready listing page.

Deliverables

- initial loading state for first page
- incremental loading indicator for `Load More`
- empty state when no recipes are returned
- retry-capable error state for failed fetches

Implementation Notes

- Differentiate first-load failure from next-page failure; they affect the page differently
- Keep state messaging compact and visually aligned with the calm editorial design language
- Do not allow a failed next-page request to clear already rendered recipes

Outcome

The listing page remains understandable and stable across slow networks and API failures.

---

# Phase 7 - Testing And Verification

Add coverage for core listing behavior and verify the feature end to end at the application level.

Deliverables

- unit tests for listing data access behavior
- component tests for homepage rendering states
- component tests for `Load More` append behavior
- component tests for recipe card navigation intent

Verification Checklist

- homepage requests `/recipes?page=1&pageSize=12`
- recipe cards render backend order unchanged
- `Load More` appends page 2 results after page 1 results
- button cannot spam concurrent requests
- card click navigates to `/r/:id`
- layout works across mobile, tablet, and desktop widths

Outcome

The feature has enough automated and manual verification to support follow-on specs such as filtering and search.

---

# Dependencies And Sequencing

Recommended implementation order:

1. contracts
2. data access
3. presentational components
4. homepage composition
5. pagination behavior
6. loading and error states
7. tests and verification

This order minimizes rework because the UI is built after the API shape and pagination behavior are clear.

---

# Assumptions To Confirm During Implementation

- `GET /recipes` returns a paginated payload, not a bare array
- the response includes enough metadata to determine whether another page exists
- `thumbnailUrl` is always usable for card imagery, or a fallback asset strategy will be needed
- `/r/:id` should continue using recipe `id`, even though listing DTOs also include `slug`

If any of these assumptions fail, the implementation should pause and the API contract should be clarified before UI work continues.

---

# Completion Criteria

The homepage displays curated recipe cards from the backend, supports `Load More` pagination, preserves backend ordering, and routes users into the existing recipe detail path without regressions to the app shell.
