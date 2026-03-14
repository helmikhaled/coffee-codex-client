# PRD - 003 Recipe Detail Page

# A) Problem Statement

Users who discover a recipe on the Coffee Codex landing page must be able to open a dedicated recipe page that provides clear, structured instructions for making the drink.

Unlike typical blog recipes, Coffee Codex recipes must be concise, visually appealing, and easy to follow. The page should present drink images, brewing specifications, ingredients, and preparation steps in a format that prioritizes clarity and aesthetics.

This feature implements the **Recipe Detail Page UI** that consumes backend data and renders the complete recipe.

---

# B) Goals

- Display full recipe details
- Render recipe images
- Display brew specifications
- Show ingredients list
- Show step-by-step instructions
- Provide shareable URL for recipe
- Ensure mobile-first layout

---

# C) Non-Goals

- Recipe editing
- Comments
- User submissions
- Filtering/search
- Analytics dashboards

---

# D) Target Users / Personas

## Home Barista

Context  
User browsing Coffee Codex looking for instructions to recreate a drink.

Needs

- clear ingredient quantities
- structured preparation steps
- visual reference for final drink

Pain Points

- cluttered recipe blogs
- unclear brewing parameters

Success Criteria  
User can follow the recipe without confusion.

---

# E) Assumptions

- Recipe ID is passed through URL
- Backend endpoint `/recipes/{id}` exists
- Images are stored in blob storage
- DTO contracts match `architecture.md`

---

# F) User Journey

1. User clicks recipe card on landing page
2. Browser navigates to `/r/:id`
3. Frontend calls backend `/recipes/{id}`
4. Recipe data loads
5. UI renders images, ingredients, brew specs, steps
6. User scrolls through instructions
7. User may share recipe URL

---

# G) Functional Requirements

## Route

Recipe page route:

```

/r/:id

```

Route must extract recipe ID and fetch recipe data.

---

## API Integration

Frontend calls:

```

GET /recipes/{id}

```

Response:

```

RecipeDetailDto

```

---

## Page Layout

The page must contain the following sections:

1. Image carousel
2. Recipe title
3. Brew specifications
4. Ingredients
5. Preparation steps
6. Author information

---

## Brew Specifications

Display:

- coffee dose
- coffee yield
- milk amount
- cup size
- difficulty
- preparation time

If coffee dose/yield are null (e.g., matcha drinks), hide those fields.

---

## Ingredients Section

Ingredients must display:

- name
- quantity
- unit

Example:

```

Milk — 150 ml
Matcha powder — 2 g

```

---

## Steps Section

Preparation steps must display:

- step number
- instruction text

Example:

```

1. Whisk matcha with hot water
2. Fill glass with ice and milk
3. Pour espresso on top

```

---

## Share Capability

Recipe pages must have shareable URLs.

Example:

```

[https://coffeecodex.com/r/dirty-matcha](https://coffeecodex.com/r/dirty-matcha)

```

Share buttons may be added later.

---

# H) Non-Functional Requirements

Performance

- page load < 2 seconds
- images lazy loaded

Responsiveness

Mobile  
single column

Desktop  
split layout

Maintainability

- Angular standalone components
- modular feature structure

---

# I) User Stories

## Story: View Recipe

As a home barista  
I want to see the full recipe  
So that I can make the drink.

Acceptance Criteria

Given recipe exists  
When user opens recipe page  
Then all sections render correctly.

---

## Story: Follow Instructions

As a user  
I want clear preparation steps  
So that I can recreate the drink.

Acceptance Criteria

Steps appear in order with clear instructions.

---

# J) Out of Scope

- comments
- rating system
- recipe editing
- recommendations

---

# K) Milestones

MVP Deliverable

- recipe page UI
- API integration
- ingredients and steps rendering

---

# L) Success Metrics

Usage

- recipe page views
- time spent on recipe page

Quality

- page load time
- UI error rate

---

# M) Risks & Mitigations

Risk  
Images may slow page rendering.

Mitigation  
Lazy loading and optimized images.

---

# N) Open Questions

- Should the hero image appear full width? Yes.
- Should brew specs appear as badges? Yes.
