# Plan - 003 Recipe Detail Page

This spec replaces the current recipe placeholder route with the first full recipe detail experience.

Implementation should be phased so contract definition, data loading, and UI rendering can be validated independently.

---

# Current State

The app shell and listing flow are already implemented.

Relevant existing files:

- `src/app/app.routes.ts` maps `/r/:id` to a placeholder page
- `src/app/features/recipe/recipe-page-placeholder.ts` currently renders static placeholder content
- `src/app/app.config.ts` enables `withComponentInputBinding()` for route params
- `src/app/features/home/recipe-card.ts` already links cards to `/r/:id`

This feature should build on that foundation and replace the placeholder behavior rather than introducing a new route.

---

# Phase 1 - Detail Domain Contracts

Define the frontend DTOs for recipe detail data under `src/app/contracts`.

Deliverables

- `RecipeDetailDto` contract aligned to `docs/architecture.md`
- `AuthorDto`, `BrewSpecsDto`, `IngredientDto`, `StepDto`, and `ImageDto` types
- shared enum usage for `RecipeCategory` and `DifficultyLevel` consistency
- explicit nullability for coffee-specific brew fields

Implementation Notes

- Keep list ordering from backend authoritative for `images`, `ingredients`, and `steps`
- Model nullable brew fields (`coffeeDoseInGrams`, `coffeeYieldInGrams`) so the UI can hide them when absent
- Keep contracts minimal and presentation-focused; business rules stay in the backend

Outcome

The feature has a stable, typed contract for `GET /recipes/{id}` integration.

---

# Phase 2 - Recipe Detail API Layer

Implement feature-scoped data access for the detail endpoint.

Deliverables

- `recipe-detail-api.service.ts` under `src/app/features/recipe`
- typed request method for `GET /recipes/{id}`
- endpoint construction using existing environment base URL pattern
- narrow public API for fetching a single recipe detail payload

Implementation Notes

- Keep the API service focused on transport concerns only
- URL-encode route identifiers to avoid path issues
- Preserve backend response shape; normalize in store/view-model layer

Outcome

The recipe feature can load detail data through a reusable typed service.

---

# Phase 3 - Feature State Store

Add a recipe detail store that manages loading and failure states.

Deliverables

- `recipe-detail.store.ts` with signals for:
- `recipe`
- `isLoading`
- `error`
- `hasLoaded`
- methods for `load(id)` and `retry()`
- normalization helpers for display-safe defaults

Implementation Notes

- Keep store provider scoped to the recipe page component
- Guard against duplicate concurrent loads for the same identifier
- Distinguish "not found" from generic load failure if backend status allows it

Outcome

The page has predictable state transitions and clean separation between data fetching and rendering.

---

# Phase 4 - Route Page Replacement

Replace the placeholder route component with the real recipe detail page container.

Deliverables

- new route component file under `src/app/features/recipe` (for example `recipe-page.ts`)
- route update in `src/app/app.routes.ts` to point `/r/:id` to the new page
- route param wiring using component input binding (`id` input)
- initial load trigger from route identifier

Implementation Notes

- Keep the existing `/r/:id` path unchanged for shareable links and backward compatibility
- Treat `id` as the backend lookup key exactly as provided by routing
- Ensure page-level cleanup/reset behavior when navigating between recipes

Outcome

Navigating to `/r/:id` renders a real data-driven recipe detail page.

---

# Phase 5 - Detail Page Composition

Build the full recipe detail UI sections required by the PRD and design docs.

Deliverables

- hero media section with primary image and multi-image carousel behavior
- recipe header content (title, description, category, tags)
- brew specifications section
- ingredients list section
- preparation steps section
- author metadata section
- share URL affordance (copy link or explicit sharable URL display)

Implementation Notes

- Follow `docs/design.md` layout intent: mobile-first, calm editorial styling, image-forward hierarchy
- Use semantic HTML (`h1`, `section`, `ol`, `figure`) for clarity and accessibility
- On desktop, use split layout; on mobile, keep a single-column reading flow
- Hide coffee-dose and coffee-yield fields when values are null
- Keep visual density low with strong spacing and clear section separation

Outcome

The page presents complete recipe instructions in the intended Coffee Codex reading experience.

---

# Phase 6 - Loading, Error, Empty, And Media Fallback States

Make the detail page resilient outside the happy path.

Deliverables

- loading state for initial recipe fetch
- retry-capable error state for fetch failures
- not-found state if recipe does not exist
- image fallback behavior when URLs are missing or fail to load

Implementation Notes

- Keep layout stable during loading to reduce visual shift
- Preserve concise, human-readable error messaging
- Ensure failures in individual images do not break the rest of the page content

Outcome

Users can still understand and recover from failures without losing context.

---

# Phase 7 - Testing And Verification

Add automated coverage and perform manual verification for route-to-render flow.

Deliverables

- API service tests for endpoint construction and typed response handling
- store tests for success, failure, and retry flows
- page component tests for:
- route-param-triggered loading
- section rendering (images, specs, ingredients, steps, author)
- null brew field hiding behavior
- error and retry behavior
- manual responsive verification on mobile, tablet, and desktop breakpoints

Verification Checklist

- `/r/:id` triggers exactly one detail request on first render
- recipe title, ingredients, and steps render in backend-provided order
- nullable coffee fields are hidden when not present
- retry action re-attempts failed loads
- loading and error states are visually and functionally distinct
- page remains readable and usable in light and dark themes

Outcome

The recipe detail feature is verified for correctness, resilience, and responsive usability.

---

# Dependencies And Sequencing

Recommended implementation order:

1. contracts
2. API service
3. feature store
4. route page replacement
5. page composition
6. non-happy-path states
7. tests and verification

This order minimizes rework by establishing a stable data contract before composing UI sections.

---

# Assumptions To Confirm During Implementation

- `GET /recipes/{id}` returns the full `RecipeDetailDto` shape defined in `docs/architecture.md`
- route param `id` is the canonical public identifier used by backend lookup
- response collections (`images`, `ingredients`, `steps`) are pre-sorted by backend
- 404 behavior is explicit enough to support a dedicated not-found state
- image URLs are directly renderable by the frontend without additional signing

If any assumption fails, pause implementation and reconcile the contract before continuing UI work.

---

# Completion Criteria

The `/r/:id` route renders a complete, API-driven recipe detail page with images, brew specs, ingredients, steps, author information, shareable URL behavior, and tested loading/error handling across mobile and desktop layouts.
