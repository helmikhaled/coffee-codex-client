# PRD - 012 Recipe Tags

# A) Problem Statement

Coffee Codex recipes may belong to broader categories such as “Modern” or “Classic”, but many drinks also share common characteristics that cut across categories.

Examples include:

- matcha
- citrus
- oat milk
- dessert
- iced

Tags provide a flexible way to label recipes with additional attributes that help users discover related drinks.

This feature introduces **tag support in the frontend**, allowing tags to appear in recipe pages and enabling filtering by tags.

---

# B) Goals

- display tags on recipe detail page
- allow filtering recipes by tag
- allow admin to assign tags to recipes
- maintain simple and visually minimal UI

---

# C) Non-Goals

- user-generated tags
- tag popularity ranking
- tag moderation systems

---

# D) Target Users / Personas

## Home Barista

Context  
User browsing Coffee Codex recipes.

Needs

- understand recipe characteristics
- explore related drinks

Pain Points

- difficulty discovering similar drinks

Success Criteria

User can click tags to explore related recipes.

---

# E) Assumptions

- backend provides tag metadata
- tags stored in database
- tag filtering supported by recipe listing API

---

# F) User Journey

1. User opens recipe detail page
2. Tags appear below recipe title
3. User clicks tag
4. Frontend loads filtered recipe list

---

# G) Functional Requirements

## Display Tags

Recipe detail page must display tags.

Example:

```

matcha
citrus
oat milk

```

Tags must appear as clickable UI elements.

---

## Tag Interaction

Clicking tag triggers filtering.

Frontend calls:

```

GET /recipes?tag=matcha

```

Recipe grid updates accordingly.

---

## Admin Tag Assignment

Admin recipe form must allow selecting tags.

Options may appear as:

- dropdown
- selectable chips

---

## Tag Visibility

Tags must appear in:

- recipe detail page
- admin recipe editor

Tags do not appear on recipe cards for MVP.

---

# H) Non-Functional Requirements

Performance

- tag filtering must load quickly

Usability

- tags clearly visible
- clickable interaction intuitive

Maintainability

- tag components reusable

---

# I) User Stories

## Story: View Recipe Tags

As a user  
I want to see tags on recipes  
So that I understand drink characteristics.

Acceptance Criteria

Tags displayed clearly on recipe page.

---

## Story: Filter by Tag

As a user  
I want to click a tag  
So that I can discover similar drinks.

Acceptance Criteria

Recipe list updates with matching recipes.

---

## Story: Assign Tags to Recipes

As an admin  
I want to assign tags to recipes  
So that drinks are categorized effectively.

Acceptance Criteria

Selected tags saved with recipe.

---

# J) Out of Scope

- tag analytics
- tag editing UI
- user-generated tags

---

# K) Milestones

MVP

- tag display
- tag filtering
- admin tag assignment

---

# L) Success Metrics

Discovery

- percentage of users interacting with tags

Quality

- tag filtering performance

---

# M) Risks & Mitigations

Risk  
Too many tags may clutter UI.

Mitigation  
Use limited curated tag set.

---

# N) Open Questions

- Should tags appear on recipe cards in future? Yes.
