# Tasks - 003 Recipe Detail (Frontend)

Tasks must be executed sequentially.

---

# Task 1 - Define Recipe Detail Contracts

Status: Pending

Create the frontend TypeScript contracts required for recipe detail rendering.

Requirements

- add `RecipeDetailDto` under `src/app/contracts`
- add `AuthorDto`, `BrewSpecsDto`, `IngredientDto`, `StepDto`, and `ImageDto` contract types
- reuse existing `RecipeCategory` and `DifficultyLevel` types where applicable
- represent nullable coffee fields (`coffeeDoseInGrams`, `coffeeYieldInGrams`) explicitly

Deliverables

- recipe detail DTO contracts created and aligned to `docs/architecture.md`

---

# Task 2 - Implement Recipe Detail API Service

Status: Pending

Implement feature-scoped HTTP integration for `GET /recipes/{id}`.

Requirements

- create `src/app/features/recipe/recipe-detail-api.service.ts`
- inject `HttpClient` and construct endpoint from `environment.apiBaseUrl`
- expose a typed method that fetches one recipe detail by route identifier
- URL-encode the recipe identifier before request composition

Deliverables

- typed detail API service available to feature state layer

---

# Task 3 - Add API Service Tests

Status: Pending

Verify endpoint and request behavior for the detail API service.

Requirements

- create `src/app/features/recipe/recipe-detail-api.service.spec.ts`
- assert request method is `GET`
- assert URL format matches `/recipes/{id}`
- assert route identifier encoding behavior for special characters

Deliverables

- automated tests covering detail API request construction

---

# Task 4 - Implement Recipe Detail Store

Status: Pending

Add signal-based state management for recipe detail loading.

Requirements

- create `src/app/features/recipe/recipe-detail.store.ts`
- track `recipe`, `isLoading`, `error`, `hasLoaded`, and `notFound` state
- implement `load(id)` and `retry()` methods
- avoid duplicate concurrent loads
- normalize optional/null display fields for stable rendering

Deliverables

- recipe detail store with explicit state transitions

---

# Task 5 - Add Store Tests

Status: Pending

Validate recipe detail store behavior under success and failure scenarios.

Requirements

- create `src/app/features/recipe/recipe-detail.store.spec.ts`
- verify successful load updates all state signals correctly
- verify generic API failure sets error state without crashing page
- verify not-found behavior when backend returns 404
- verify retry calls re-trigger request flow

Deliverables

- automated tests covering detail store state transitions

---

# Task 6 - Create Recipe Hero Media Component

Status: Pending

Build the media section for recipe images and carousel interaction.

Requirements

- create standalone component under `src/app/features/recipe`
- render primary hero image and additional gallery images
- support mobile-friendly carousel controls
- lazy-load images and provide fallback when an image fails

Deliverables

- reusable hero media component for recipe detail page

---

# Task 7 - Create Brew Specs Component

Status: Pending

Build the brew specifications section for the detail page.

Requirements

- create standalone component under `src/app/features/recipe`
- render dose, yield, milk, cup size, difficulty, and time values
- hide coffee dose/yield fields when values are null
- present specs as badges/cards per PRD direction

Deliverables

- reusable brew specs component with conditional field rendering

---

# Task 8 - Create Ingredients Component

Status: Pending

Build the ingredient list section for recipe detail.

Requirements

- create standalone component under `src/app/features/recipe`
- render each ingredient name, quantity value, and unit
- preserve backend-provided ingredient order
- provide clean empty fallback text if list is missing

Deliverables

- reusable ingredients section component

---

# Task 9 - Create Preparation Steps Component

Status: Pending

Build the step-by-step instructions section.

Requirements

- create standalone component under `src/app/features/recipe`
- render ordered step numbers with instruction text
- preserve backend-provided step order
- use semantic ordered-list markup

Deliverables

- reusable preparation steps component

---

# Task 10 - Create Recipe Metadata Component

Status: Pending

Build supporting metadata presentation for category, tags, and author details.

Requirements

- create standalone component under `src/app/features/recipe`
- render author name and avatar image
- render recipe category and tag chips
- include accessible fallback when optional metadata is absent

Deliverables

- reusable metadata component aligned to editorial UI style

---

# Task 11 - Replace Placeholder With Recipe Page Container

Status: Pending

Create the route container page and remove placeholder usage.

Requirements

- create `src/app/features/recipe/recipe-page.ts`
- wire store loading from route `id` input using component input binding
- compose hero, specs, ingredients, steps, and metadata components
- update `src/app/app.routes.ts` to use `RecipePage` for `/r/:id`

Deliverables

- `/r/:id` route renders data-driven recipe page container

---

# Task 12 - Implement Page-Level Loading, Error, And Not-Found States

Status: Pending

Add non-happy-path UX for the route page container.

Requirements

- show initial loading skeleton/state while recipe is fetching
- show retry-capable error state for generic failures
- show dedicated not-found state for missing recipes
- keep layout stable across state transitions

Deliverables

- robust route page states for loading and failure paths

---

# Task 13 - Add Shareable URL Section

Status: Pending

Expose explicit share URL behavior on the recipe page.

Requirements

- render canonical recipe URL section on page
- provide copy-to-clipboard interaction when supported
- provide safe fallback behavior when clipboard API is unavailable
- keep share feature non-blocking and lightweight

Deliverables

- share URL affordance implemented on recipe page

---

# Task 14 - Add Recipe Page Component Tests

Status: Pending

Cover the end-user rendering behavior for the recipe detail page.

Requirements

- create `src/app/features/recipe/recipe-page.spec.ts`
- assert route-param-triggered load on initial render
- assert rendering of image, specs, ingredients, steps, and metadata sections
- assert coffee fields are hidden when null
- assert error and retry interactions behave correctly

Deliverables

- automated tests for recipe page behavior and UI state handling

---

# Task 15 - Run Feature Verification

Status: Pending

Validate the completed feature with local checks and manual review.

Verification

- `npm run build` passes
- `npm run test -- --watch=false` passes
- navigating from listing card to `/r/:id` loads detail content
- mobile layout is single-column and desktop layout is split
- light and dark themes both render recipe detail correctly
- image lazy loading and fallback behavior work as expected

Deliverables

- feature verified and ready for review

---

# Completion

Recipe detail page is ready for follow-on discovery features that depend on a complete `/r/:id` experience.
