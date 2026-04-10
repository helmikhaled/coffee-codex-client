# Tasks - 004 Recipe Image Carousel (Frontend)

Tasks must be executed sequentially.

---

# Task 1 - Finalize Carousel Component Contract

Status: Completed

Define the final public contract for the existing recipe media component.

Requirements

- confirm `ImageDto[]` remains the sole image input model
- document empty, single-image, and multi-image behavior in task comments or component doc block
- keep component reusable and presentation-focused

Deliverables

- contract expectations finalized in `src/app/features/recipe/recipe-hero-media.ts`

---

# Task 2 - Normalize And Guard Image Input State

Status: Completed

Stabilize image collection handling before interaction logic changes.

Requirements

- ensure component reads image arrays defensively when null/empty
- preserve backend order exactly as provided
- prevent out-of-range access when collection size changes

Deliverables

- normalized image-state behavior implemented in `src/app/features/recipe/recipe-hero-media.ts`

---

# Task 3 - Implement Deterministic Active Index Management

Status: Completed

Add deterministic active-image index behavior.

Requirements

- keep active index clamped to valid range
- support explicit `selectImage(index)` navigation
- ensure route transitions between recipes reset or clamp index predictably

Deliverables

- stable active index logic in `src/app/features/recipe/recipe-hero-media.ts`

---

# Task 4 - Implement Previous And Next Wrap-Around Navigation

Status: Completed

Implement core next/previous behavior for multi-image sets.

Requirements

- previous action wraps from first image to last image
- next action wraps from last image to first image
- navigation is disabled or no-op when fewer than two images exist

Deliverables

- wrap-around navigation methods completed in `src/app/features/recipe/recipe-hero-media.ts`

---

# Task 5 - Add Per-Image Error Tracking And Fallback Rendering

Status: Completed

Handle missing and failed image URLs gracefully.

Requirements

- track failed URLs per image
- render fallback surface when URL is empty or load fails
- keep fallback copy aligned with recipe title context

Deliverables

- robust image fallback behavior in `src/app/features/recipe/recipe-hero-media.ts`

---

# Task 6 - Implement Swipe Gesture Navigation For Mobile

Status: Completed

Add swipe navigation required by the PRD.

Requirements

- detect horizontal swipe intent with threshold logic
- avoid hijacking vertical scroll interactions
- map swipe left/right to next/previous navigation

Deliverables

- swipe gesture handling implemented in `src/app/features/recipe/recipe-hero-media.ts`

---

# Task 7 - Replace Thumbnail Navigation With Dot Pagination Indicators

Status: Completed

Implement indicator UI required by the carousel spec.

Requirements

- render one dot per image in backend order
- visually differentiate active and inactive states
- allow direct navigation by selecting a dot
- hide indicator row when only one image exists

Deliverables

- dot pagination indicator UI implemented in `src/app/features/recipe/recipe-hero-media.ts`

---

# Task 8 - Apply Loading Strategy For First And Subsequent Images

Status: Completed

Enforce performance-oriented image loading behavior.

Requirements

- first visible image loads immediately
- non-primary images are lazy loaded
- keep async decoding enabled where supported

Deliverables

- loading strategy updated in `src/app/features/recipe/recipe-hero-media.ts`

---

# Task 9 - Refine Responsive Media Frame And Layout Stability

Status: Completed

Align carousel rendering with design and non-functional requirements.

Requirements

- preserve stable aspect-ratio container to reduce layout shift
- support mobile full-width presentation and desktop constrained layout
- keep visual style consistent with existing recipe page design language

Deliverables

- responsive and stable carousel frame finalized in `src/app/features/recipe/recipe-hero-media.ts`

---

# Task 10 - Harden Accessibility For Carousel Controls

Status: Completed

Ensure carousel controls are accessible and keyboard-usable.

Requirements

- provide clear ARIA labels for previous/next and indicator controls
- maintain visible focus styles for keyboard users
- keep meaningful alt text fallback for hero and indicator images

Deliverables

- accessibility hardening completed in `src/app/features/recipe/recipe-hero-media.ts`

---

# Task 11 - Integrate Finalized Carousel In Recipe Page

Status: Completed

Ensure recipe page uses the finalized carousel behavior without regressions.

Requirements

- verify `RecipePage` continues to pass ordered image data and title
- keep existing loading/error/not-found page states unchanged
- preserve split desktop and single-column mobile detail layout

Deliverables

- integration updates completed in `src/app/features/recipe/recipe-page.ts` (if required)

---

# Task 12 - Add Dedicated Carousel Component Tests

Status: Completed

Add focused automated coverage for carousel behavior.

Requirements

- create `src/app/features/recipe/recipe-hero-media.spec.ts`
- test ordered rendering and initial active image
- test previous/next wrap-around behavior
- test swipe navigation behavior
- test indicator state and direct selection
- test single-image mode hides navigation and indicators
- test fallback behavior on image error

Deliverables

- dedicated carousel component tests added

---

# Task 13 - Update Recipe Page Integration Tests

Status: Completed

Update page-level tests where carousel integration behavior must be asserted.

Requirements

- extend `src/app/features/recipe/recipe-page.spec.ts` with targeted carousel integration assertions
- keep existing coverage for detail page sections and error/retry behavior intact

Deliverables

- recipe page integration tests updated for carousel changes

---

# Task 14 - Run Verification And Regression Checks

Status: Completed

Validate feature behavior with automated and manual checks.

Verification

- `npm run build` passes
- `npm run test -- --watch=false` passes
- desktop arrows navigate images correctly
- mobile swipe navigates images correctly
- indicator dots reflect active position and support direct navigation
- first image loads immediately, non-primary images lazy load
- single-image recipes render static hero image without navigation UI
- behavior remains correct in light and dark themes across mobile/tablet/desktop widths

Deliverables

- feature verified and ready for review

---

# Completion

Recipe image carousel is ready to be delivered as the finalized media experience for `/r/:id` and to support future recipe media enhancements.
