# Tasks - 002 Recipe Listing (Frontend)

Tasks must be executed sequentially.

---

# Task 1 - Define Listing Contracts

Status: Completed

Create the frontend TypeScript contracts required by the recipe listing feature.

Requirements

- add `RecipeSummaryDto` under `src/app/contracts`
- add paginated response contract under `src/app/contracts`
- add typed query contract for `page` and `pageSize`
- align fields with `docs/architecture.md`

Deliverables

- listing DTO contract created
- pagination contract created
- query parameter contract created

---

# Task 2 - Enable HTTP Access In Application Configuration

Status: Completed

Prepare the Angular application to call the backend recipes API.

Requirements

- register Angular HTTP providers in `src/app/app.config.ts`
- keep existing router configuration intact
- avoid introducing global state not needed by this spec

Deliverables

- application config supports HTTP requests

---

# Task 3 - Create Recipe Listing Data Access

Status: Completed

Implement the feature-scoped API integration for `GET /recipes`.

Requirements

- create a listing service or resource under `src/app/features/home`
- request `/recipes?page=1&pageSize=12` for initial load
- support requesting subsequent pages
- keep backend ordering unchanged

Deliverables

- typed recipe listing data access layer created
- first-page and next-page fetch methods available

---

# Task 4 - Implement Listing State Management

Status: Completed

Add signal-based state handling for the homepage listing flow.

Requirements

- track recipes already loaded
- track current page and page size
- track initial loading and load-more loading states separately
- track error and empty states without clearing successful results

Deliverables

- listing state model created
- append behavior defined for successful next-page fetches

---

# Task 5 - Build Recipe Card Component

Status: Completed

Create a reusable presentational card for recipe summaries.

Requirements

- standalone component under `src/app/features/home` or `src/app/shared`
- display thumbnail, title, difficulty, brew count, and author
- use lazy-loaded images
- provide accessible clickable structure and focus states

Deliverables

- `RecipeCardComponent` created

---

# Task 6 - Build Recipe Grid Component

Status: Completed

Create the presentational grid wrapper that renders recipe cards responsively.

Requirements

- standalone component or dedicated template section
- mobile-first grid layout
- support 1 column on mobile, 2-3 on tablet, and 4-5 on desktop
- accept ordered recipe summaries as input without re-sorting

Deliverables

- recipe grid UI created

---

# Task 7 - Replace Homepage Placeholder With Listing Layout

Status: Completed

Update `HomePageComponent` to render the landing page structure for this feature.

Requirements

- replace current placeholder copy
- add lightweight hero content above the grid
- keep layout aligned with `docs/design.md`
- preserve compatibility with the existing app shell container

Deliverables

- homepage renders hero plus recipe listing section

---

# Task 8 - Wire Card Navigation To Recipe Detail Route

Status: Completed

Connect recipe cards to the existing detail route.

Requirements

- clicking a card navigates to `/r/:id`
- preserve current route contract from `src/app/app.routes.ts`
- keep navigation logic out of low-level styling concerns where practical

Deliverables

- recipe card navigation works from homepage to detail placeholder route

---

# Task 9 - Implement Load More Pagination

Status: Completed

Add incremental loading behavior to the homepage.

Requirements

- initial fetch uses `page = 1` and `pageSize = 12`
- `Load More` fetches the next page only once per click cycle
- append new recipes below existing ones
- hide or disable the action when no more pages are available

Deliverables

- working `Load More` interaction
- sequential page loading behavior implemented

---

# Task 10 - Add Loading, Empty, And Error States

Status: Completed

Implement non-happy-path UX for the listing page.

Requirements

- show first-load loading state
- show separate loading indicator for `Load More`
- show empty state when API returns no recipes
- show retry-capable error state for failed requests

Deliverables

- homepage handles loading, empty, and error conditions cleanly

---

# Task 11 - Polish Responsive And Themed Presentation

Status: Completed

Refine the listing UI so it matches the product direction across breakpoints and themes.

Requirements

- verify layout in light and dark themes
- ensure imagery and spacing match the calm editorial direction
- keep thumbnail loading efficient
- avoid dense dashboard-style presentation

Deliverables

- responsive and theme-aware listing UI polished

---

# Task 12 - Add Automated Tests

Status: Completed

Create tests covering the primary recipe listing behaviors.

Requirements

- test listing data access behavior
- test homepage first-load rendering
- test `Load More` append behavior
- test navigation intent from recipe cards

Deliverables

- automated tests added for recipe listing feature

---

# Task 13 - Verify Feature End To End

Status: Completed

Run project checks and manually verify the implemented experience.

Verification

- homepage requests `/recipes?page=1&pageSize=12`
- cards render in backend order
- `Load More` appends page 2 after page 1
- duplicate concurrent page requests are prevented
- card click navigates to `/r/:id`
- layout works on mobile, tablet, and desktop widths

Deliverables

- feature verified locally

---

# Completion

Recipe listing is ready for follow-on specs:

- 005 filtering
- 006 search
- 007 random discovery
