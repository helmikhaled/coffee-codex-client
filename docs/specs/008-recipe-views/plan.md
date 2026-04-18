# Plan — 008 Recipe Views

This spec adds frontend recipe view tracking and exposes brew counts more clearly in the UI without changing the product into a social experience.

The implementation should build on the existing recipe detail stack:

- `RecipeDetailApiService` already owns recipe detail HTTP requests
- `RecipeDetailStore` already coordinates recipe detail loading state
- `RecipePage` already reacts to route id changes and renders the detail surface
- `RecipeCard` already displays brew count, but formatting is currently hard-coded to `en-US`

The feature should preserve the current lightweight architecture by isolating tracking logic inside the recipe detail feature and keeping UI formatting reusable.

---

# Phase 1 — Add View Tracking API Integration

Extend the recipe detail API layer to support the backend view endpoint:

`POST /recipes/{id}/view`

Deliverables

- `RecipeDetailApiService` exposes a dedicated method for recording a recipe view
- request URL encoding matches the existing detail request behavior
- the API contract remains isolated to the recipe feature rather than being triggered directly from the component template

Outcome

The frontend has a single, testable integration point for recipe view tracking.

Notes

- Keep this method alongside `getRecipeById` because both actions belong to the recipe detail lifecycle
- The response can be treated as side-effect only unless the backend later returns an updated count payload

---

# Phase 2 — Orchestrate View Tracking In The Recipe Detail Flow

Record a view only after recipe detail data has loaded successfully.

Deliverables

- recipe detail flow triggers view tracking after a successful detail fetch
- tracking runs as a non-blocking side effect and must not delay page rendering
- duplicate requests are prevented within the same page load / component lifetime
- route changes to a different recipe reset tracking so the newly opened recipe records its own view
- refreshing the browser still produces a new view event because it creates a new page load

Outcome

Recipe detail pages reliably send exactly one view event per page load while keeping the UI responsive.

Notes

- The store is the best place for this behavior because the PRD explicitly calls for isolated view logic in the recipe service layer and the store already owns detail loading orchestration
- Tracking failures should be swallowed at the UX level: no blocking error state, no retry prompt, no regression to detail rendering
- Guarding should be based on normalized recipe id, not raw route input, so repeated effects do not double-post

---

# Phase 3 — Surface Brew Count In The Detail Experience

Display brew count prominently on the recipe detail page, including the hero area called out in the PRD open question.

Deliverables

- recipe detail UI renders brew count in the hero/header area
- supporting metadata layout remains consistent with the calm, editorial design direction
- brew count text uses localized number formatting

Outcome

Users can immediately see recipe popularity context when opening a recipe.

Notes

- The hero/header is the primary placement because the PRD answers the open question with "Yes"
- The count should feel informational, not gamified; it should read like recipe metadata rather than a badge or social counter

---

# Phase 4 — Standardize Brew Count Formatting Across Cards And Detail

Unify the presentation of brew counts so list and detail views format counts consistently.

Deliverables

- recipe cards continue to render `n brews`
- recipe detail page renders the same count language
- localized number formatting is extracted into a shared utility/helper instead of duplicating another `Intl.NumberFormat('en-US')` call

Outcome

Brew count presentation is consistent across the application and aligned with the PRD requirement for localized formatting.

Notes

- Current code hard-codes `en-US` in `RecipeCard`, `RecipeBrewSpecs`, and `RecipeIngredients`
- This feature only requires count formatting for cards and detail, but the implementation should avoid introducing a third one-off formatter
- Prefer a small shared formatter with runtime locale awareness over embedding locale strings inside components

---

# Phase 5 — Expand Automated Coverage

Add focused tests around the new behavior at the service, store, and feature rendering layers.

Deliverables

- API service tests cover the new POST request and URL encoding
- store tests cover successful tracking, duplicate-prevention, route-id changes, and silent handling of tracking failures
- page/component tests cover visible brew count rendering on the detail page
- existing card tests or new component assertions cover localized brew count output on recipe cards

Outcome

The feature is protected against duplicate requests, broken endpoint wiring, and UI regressions.

---

# Implementation Considerations

## Local Count Behavior

The PRD requires the POST request to happen after detail data loads and says updated counts will appear in future requests. The implementation can still improve perceived consistency by incrementing the in-memory detail count after a successful tracking call, but this should remain scoped to the active detail view and must not fabricate success when the POST fails.

## Failure Handling

If the tracking request fails:

- keep the recipe page rendered
- do not show a blocking error
- do not interfere with the existing detail retry path

This preserves the current reliability model where recipe content is the primary concern and analytics-style side effects are secondary.

## Route And Lifecycle Semantics

The current `RecipePage` reacts to its `id` input via an effect. The tracking plan should explicitly account for:

- first load of `/r/:id`
- navigation from one recipe detail page to another within the SPA
- repeated change detection / effect re-runs for the same id
- hard refresh creating a fresh page load that should count again

---

# Completion Criteria

This spec is complete when:

- recipe detail fetches still work as they do today
- opening a recipe detail page sends one non-blocking view request
- the same page load does not send duplicate view requests
- brew count is visible on recipe cards and in the recipe detail hero area
- brew counts use localized formatting consistently
- automated tests cover the new endpoint, orchestration rules, and visible UI output
