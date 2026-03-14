# PRD - 002 Recipe Listing

# A) Problem Statement

Users visiting Coffee Codex need a fast and visually appealing way to discover coffee recipes. The landing page serves as the primary entry point into the application and must display a curated list of recipes.

Unlike social feeds, Coffee Codex recipes are ordered intentionally by the curator (admin). The UI must therefore display recipes in the curated order defined by the backend.

This feature implements the **recipe listing UI**, fetching data from the backend and displaying recipes in a responsive grid optimized for mobile-first browsing.

---

# B) Goals

- Display recipe cards on the landing page
- Fetch recipes from backend `/recipes` endpoint
- Maintain curated ordering defined by backend
- Support pagination with “Load More”
- Provide responsive grid layout
- Allow navigation to recipe detail pages

---

# C) Non-Goals

- Recipe filtering (Spec 005)
- Recipe search (Spec 006)
- Random recipe discovery (Spec 007)
- Recipe view tracking (Spec 008)
- Admin editing

---

# D) Target Users / Personas

## Home Barista

Context  
Coffee enthusiast browsing drinks to recreate at home.

Needs

- visually discover drinks
- quickly open recipe instructions

Pain Points

- recipe blogs are cluttered
- instructions often hidden

Success Criteria  
User can browse recipes quickly and open one in seconds.

---

# E) Assumptions

- Backend endpoint `/recipes` exists
- API returns paginated results
- Images are accessible via URLs
- DTO contracts match `architecture.md`

---

# F) User Journey

1. User opens `/`
2. Landing page loads
3. Frontend calls `/recipes?page=1&pageSize=12`
4. Recipe cards appear in grid
5. User scrolls
6. User clicks “Load More”
7. Additional recipes load
8. User clicks recipe card
9. User navigates to `/r/:id`

---

# G) Functional Requirements

## Recipe Grid

The landing page must display recipe cards.

Each card includes:

- thumbnail image
- recipe title
- difficulty
- brew count
- author

Cards must be clickable.

Clicking navigates to:

```

/r/:id

```

---

## Pagination

Initial load:

```

page = 1
pageSize = 12

```

Load more button fetches:

```

page = page + 1

```

Results are appended to grid.

---

## Recipe Card Component

Reusable UI component.

Fields displayed:

- thumbnail
- title
- difficulty
- brew count

---

## API Integration

Frontend must call:

```

GET /recipes

```

Query parameters:

```

page
pageSize

```

Response type:

```

PagedResponse<RecipeSummaryDto>

```

---

# H) Non-Functional Requirements

Performance

- initial render < 1.5s
- lazy load images

Responsiveness

Mobile  
1 column

Tablet  
2–3 columns

Desktop  
4–5 columns

Maintainability

- Angular standalone components
- smart/dumb architecture

---

# I) User Stories

## Story: Browse Recipes

As a coffee enthusiast  
I want to see recipes on the homepage  
So that I can discover drinks.

Acceptance Criteria

Given homepage loads  
When API returns recipes  
Then cards appear in grid.

---

## Story: Load More Recipes

As a user  
I want to load additional recipes  
So that I can explore more drinks.

Acceptance Criteria

Given user clicks load more  
When API returns next page  
Then recipes append to grid.

---

# J) Out of Scope

- filtering UI
- search UI
- admin editing
- analytics

---

# K) Milestones

MVP Deliverable

- landing page grid
- API integration
- pagination

---

# L) Success Metrics

Adoption

- homepage visits

Usage

- recipe clicks

Quality

- page load time
- error rate

---

# M) Risks & Mitigations

Risk  
Large images slowing load time

Mitigation  
Lazy loading + optimized images

---

# N) Open Questions

- Should hero recipes appear above grid? Yes.
- Should difficulty badge appear on card? Yes.
