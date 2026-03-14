# PRD - 007 Random Recipe Discovery

# A) Problem Statement

While browsing recipes through lists and filters is useful, users may sometimes want to discover a drink without a specific goal in mind.

A “Surprise Me” capability introduces an element of exploration by selecting a random recipe from the Coffee Codex library.

This feature encourages discovery and experimentation, allowing users to explore drinks they may not otherwise encounter.

The frontend must provide an intuitive entry point for this feature and navigate the user directly to a randomly selected recipe.

---

# B) Goals

- Provide a “Surprise Me” button in the UI
- Trigger retrieval of a random recipe
- Redirect users to the recipe detail page
- Maintain consistent navigation experience

---

# C) Non-Goals

- recommendation algorithms
- personalized suggestions
- trending recipes
- popularity-based ranking

This feature is purely random.

---

# D) Target Users / Personas

## Home Barista

Context  
User browsing Coffee Codex casually and looking for inspiration.

Needs

- quick discovery of a new drink
- minimal effort exploration

Pain Points

- decision fatigue when browsing many recipes

Success Criteria  
User clicks “Surprise Me” and is immediately taken to a random recipe.

---

# E) Assumptions

- Backend provides endpoint returning random recipe ID
- Frontend navigates to recipe detail route
- Random recipe exists in database

---

# F) User Journey

1. User opens homepage
2. User sees “Surprise Me” button
3. User clicks button
4. Frontend requests random recipe from backend
5. Backend returns recipe ID
6. Frontend navigates to recipe page

---

# G) Functional Requirements

## Surprise Me Button

Button must be visible in the UI.

Possible placements:

- hero section
- above recipe grid
- header action

Button label:

```

Surprise Me

```

---

## API Integration

Frontend must call:

```

GET /recipes/random

```

Example response:

```

{
"id": "recipe-id"
}

```

---

## Navigation

After receiving response:

Frontend must navigate to:

```

/r/:id

```

Example:

```

/r/dirty-matcha

```

---

## Loading State

While fetching random recipe:

- show loading indicator
- disable button temporarily

---

# H) Non-Functional Requirements

Performance

- request should complete < 1 second

Responsiveness

- button accessible on mobile and desktop

Maintainability

- reusable UI component

---

# I) User Stories

## Story: Discover Random Recipe

As a user  
I want to discover a random recipe  
So that I can try something new.

Acceptance Criteria

Given user clicks button  
When API returns recipe ID  
Then user navigates to recipe page.

---

# J) Out of Scope

- recommendations
- popularity ranking
- AI suggestions

---

# K) Milestones

MVP

- button implemented
- API integration implemented
- navigation working

---

# L) Success Metrics

Usage

- number of surprise-me clicks

Engagement

- percentage of users opening recipe after click

---

# M) Risks & Mitigations

Risk  
Random selection could repeatedly return same recipe.

Mitigation  
Acceptable for MVP.

---

# N) Open Questions

- Should random selection exclude recently viewed recipes? No.
