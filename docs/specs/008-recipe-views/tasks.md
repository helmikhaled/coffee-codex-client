# Tasks — 008 Recipe Views (Frontend)

Tasks must be executed sequentially.

---

# Task 1 — Add Recipe View API Method

Status: Pending

Extend the recipe detail API service with a dedicated method for recording a recipe view.

Files

- `src/app/features/recipe/recipe-detail-api.service.ts`
- `src/app/features/recipe/recipe-detail-api.service.spec.ts`

Requirements

- add a `POST /recipes/{id}/view` request method beside `getRecipeById`
- reuse the same id normalization and URL encoding expectations used for recipe detail fetches
- keep the method side-effect focused so callers do not depend on UI-specific response shaping

Deliverables

- recipe detail API service can record recipe views
- unit tests cover request method, endpoint path, and encoded ids

---

# Task 2 — Introduce Shared Brew Count Formatting

Status: Pending

Create a reusable formatter for localized brew count display so list and detail views share the same output behavior.

Files

- shared formatter location to be chosen during implementation
- `src/app/features/home/recipe-card.ts`
- recipe detail UI file(s) that will render brew count

Requirements

- avoid adding another hard-coded `Intl.NumberFormat('en-US')` call
- format numbers using runtime locale awareness
- produce the `n brews` label required by the PRD

Deliverables

- shared formatting utility/helper exists
- recipe count UI can consume one common formatter path

---

# Task 3 — Add View Tracking State To Recipe Detail Store

Status: Pending

Teach the recipe detail store to coordinate detail loading and one-time-per-page-load view tracking.

Files

- `src/app/features/recipe/recipe-detail.store.ts`
- `src/app/features/recipe/recipe-detail.store.spec.ts`

Requirements

- trigger tracking only after `getRecipeById` succeeds
- ensure duplicate tracking does not happen for repeated effects or state updates on the same recipe id
- reset tracking state when navigating to a different recipe id
- keep tracking failures non-blocking and invisible to the main error state
- preserve current detail retry behavior

Deliverables

- store owns the tracking lifecycle instead of the component template
- store tests cover success, duplicate prevention, id changes, and silent tracking failure

---

# Task 4 — Render Brew Count On The Recipe Detail Page

Status: Pending

Expose brew count in the recipe detail hero area in a way that matches the editorial UI direction.

Files

- `src/app/features/recipe/recipe-page.ts`
- any extracted or updated detail subcomponent(s), such as metadata-related UI
- related spec files for recipe detail rendering

Requirements

- brew count must be visible on the detail page
- hero/header placement should satisfy the PRD open question answer
- count text should use the shared localized formatter from Task 2
- presentation should remain informational rather than gamified

Deliverables

- detail page shows formatted brew count in the hero/header experience
- rendering tests assert visible brew count output

---

# Task 5 — Update Recipe Cards To Use Shared Formatting

Status: Pending

Switch recipe cards to the shared brew count formatter so list and detail stay consistent.

Files

- `src/app/features/home/recipe-card.ts`
- `src/app/features/home/recipe-card.spec.ts`

Requirements

- preserve the existing card layout and route behavior
- keep the visible copy as `n brews`
- remove card-specific locale hard-coding

Deliverables

- recipe cards use the shared formatter
- component tests assert formatted brew count text without regressing navigation behavior

---

# Task 6 — Add Page-Level View Tracking Integration Tests

Status: Pending

Cover the end-to-end recipe page behavior around loading and tracking.

Files

- `src/app/features/recipe/recipe-page.spec.ts`
- `src/app/app.spec.ts` if route-level coverage is needed

Requirements

- verify detail GET still happens as expected
- verify view POST happens after detail data loads
- verify only one POST is sent for a single page load
- verify tracking failure does not break page rendering
- verify navigating to a different recipe id results in a new tracking request

Deliverables

- feature-level tests protect request ordering and no-duplicate semantics

---

# Task 7 — Run Frontend Regression Checks

Status: Pending

Run the existing frontend test/build commands after implementation.

Files

- no source changes expected unless regressions are found

Requirements

- use existing project commands only
- confirm recipe listing, recipe detail, and routing surfaces still pass their current checks

Deliverables

- implementation is ready for the next spec without breaking the current frontend baseline

---

# Completion

Recipe view tracking is ready when the app records one view per recipe page load, keeps rendering non-blocking, and shows consistently formatted brew counts on both cards and recipe detail pages.
