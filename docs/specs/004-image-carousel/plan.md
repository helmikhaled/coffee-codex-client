# Plan - 004 Recipe Image Carousel

This spec implements the recipe image carousel used on the recipe detail page.

Implementation should be phased so interaction logic, layout behavior, and performance can be validated independently.

---

# Current State

The recipe detail experience from Spec 003 already exists and includes a preliminary hero media section.

Relevant existing files:

- `src/app/features/recipe/recipe-hero-media.ts` currently renders recipe images with arrow controls and thumbnail selection
- `src/app/features/recipe/recipe-page.ts` composes hero media in the `/r/:id` page layout
- `src/app/features/recipe/recipe-page.spec.ts` includes page-level assertions but limited carousel-specific interaction coverage

This spec should evolve the existing hero media into the finalized carousel behavior described by the PRD, not add a parallel component.

---

# Phase 1 - Carousel Contract And Scope

Define the final reusable component contract and state responsibilities.

Deliverables

- finalized input contract for ordered `ImageDto[]`
- explicit handling rules for empty, single-image, and multi-image states
- internal state boundaries defined for active image index, gesture tracking, and media-error fallback
- documented integration expectations for recipe detail page usage

Implementation Notes

- Align image data assumptions with `ImageDto` in `docs/architecture.md`
- Treat backend image order as authoritative; frontend must not re-sort
- Keep the component standalone and presentational
- Avoid coupling carousel behavior directly to API/store logic

Outcome

The carousel has a clear and stable API surface suitable for reuse.

---

# Phase 2 - Image State And Ordering Behavior

Implement deterministic internal image-state behavior.

Deliverables

- active-image computation based on current index
- previous/next wrap-around behavior for multi-image sets
- index reset/clamp behavior when input image collection changes
- per-image error tracking to support graceful fallback rendering

Implementation Notes

- Preserve backend-provided sequence exactly (`position ASC` from PRD)
- Ensure transitions remain valid when navigating between recipes with different image counts
- Keep default alt/caption fallback behavior for missing image metadata

Outcome

The carousel state machine is stable across data updates and edge cases.

---

# Phase 3 - Navigation Interactions

Implement required desktop and mobile navigation mechanisms.

Deliverables

- desktop arrow-button navigation
- mobile swipe gesture navigation with horizontal threshold detection
- direct navigation via pagination controls
- hidden navigation controls for single-image recipes

Implementation Notes

- Prioritize horizontal intent on touch so vertical page scroll remains natural
- Prevent double navigation from overlapping pointer/touch handlers
- Maintain PRD requirements: arrows on desktop, swipe on mobile

Outcome

Users can navigate recipe images naturally across devices.

---

# Phase 4 - Pagination Indicators And Visual Treatment

Align carousel visual structure with design direction and functional requirements.

Deliverables

- dot-style pagination indicators showing current position
- active/inactive indicator states with clear contrast in light and dark themes
- responsive hero media frame for mobile full-width and desktop constrained layout
- stable image container sizing for mixed aspect ratios

Implementation Notes

- Follow `docs/design.md` tone: minimal, calm, editorial, image-forward
- Keep indicator UI compact and unobtrusive
- Ensure touch targets remain usable on small screens

Outcome

The carousel matches Coffee Codex visual language while remaining readable and responsive.

---

# Phase 5 - Loading Strategy And Fallback Behavior

Implement performance-oriented loading and resilient image fallbacks.

Deliverables

- first image loaded immediately for initial hero render
- subsequent/non-active images lazy loaded
- reserved layout space to avoid visual jumps
- fallback display for missing or failed image URLs

Implementation Notes

- Use async decoding where supported
- Keep fallback experience consistent with the recipe page aesthetic
- In single-image mode, render static hero image and hide carousel controls

Outcome

Image rendering is performant, stable, and robust under real network conditions.

---

# Phase 6 - Recipe Detail Integration

Integrate finalized carousel behavior in the existing recipe detail page.

Deliverables

- updated integration in `src/app/features/recipe/recipe-page.ts`
- compatibility with existing loading/error/not-found page states
- correct behavior during route transitions between recipe ids
- no route or API contract changes required for this spec

Implementation Notes

- Keep changes isolated to media section integration to reduce regression risk
- Preserve existing detail-page section composition (brew specs, ingredients, steps, metadata)

Outcome

`/r/:id` uses the finalized image carousel without impacting unrelated detail-page behaviors.

---

# Phase 7 - Accessibility Hardening

Ensure carousel interactions remain accessible and understandable.

Deliverables

- semantic region labeling for recipe media
- accessible labels for previous/next and pagination controls
- visible keyboard focus states for all interactive controls
- meaningful alt text fallback strategy

Implementation Notes

- Keep user-driven navigation only (no autoplay)
- Verify usability in both themes and on keyboard-only navigation paths

Outcome

The carousel is operable for keyboard and assistive-technology users.

---

# Phase 8 - Testing And Verification

Add focused tests and run end-to-end verification checks for carousel behavior.

Deliverables

- dedicated component tests for carousel behavior
- coverage for:
- ordered rendering and initial active image
- arrow and swipe navigation
- wrap-around index behavior
- indicator state and direct selection
- single-image static mode (controls hidden)
- image error fallback behavior
- integration-level updates to `recipe-page.spec.ts` where needed

Verification Checklist

- images render in backend-provided order
- first image is shown immediately on page load
- non-primary images are lazy loaded
- desktop arrows and mobile swipe both navigate correctly
- indicator dots reflect and control active image position
- single-image recipes hide carousel controls
- behavior is consistent across mobile/tablet/desktop breakpoints

Outcome

Carousel behavior is validated for correctness, responsiveness, and resilience.

---

# Dependencies And Sequencing

Recommended implementation order:

1. contract finalization
2. state/index behavior
3. interaction controls (arrow + swipe + indicators)
4. responsive visual refinement
5. loading and fallback behavior
6. recipe page integration
7. accessibility pass
8. tests and verification

This sequence reduces rework by stabilizing behavior before polishing and final test coverage.

---

# Assumptions To Confirm During Implementation

- `RecipeDetailDto.images` arrives pre-ordered by backend
- image URLs can be rendered directly without signed URL refresh logic
- zoom, caption overlay, and autoplay remain out of scope for this spec
- carousel analytics instrumentation is not required in this phase

If any assumption fails, pause implementation and reconcile the contract before continuing.

---

# Completion Criteria

The recipe detail page renders a reusable image carousel that supports swipe and arrow navigation, shows pagination indicators, preserves backend image order, lazy loads non-primary media, hides controls for single-image recipes, and is covered by automated verification.
