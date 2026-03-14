# PRD - 008 Recipe View Tracking

# A) Problem Statement

Coffee Codex displays a “brew count” for each recipe to give users a sense of how popular or frequently viewed a drink is.

This count provides subtle engagement feedback and adds credibility to recipes without introducing social media mechanics such as likes or comments.

The frontend must trigger a view event whenever a recipe page is opened so the backend can update the brew count.

---

# B) Goals

- Increment brew count when a recipe page is viewed
- Display brew count on recipe cards
- Display brew count on recipe detail page
- Avoid duplicate view increments during a single session

---

# C) Non-Goals

- tracking user identity
- analytics dashboards
- detailed usage metrics
- social engagement features

---

# D) Target Users / Personas

## Home Barista

Context  
User browsing Coffee Codex and viewing recipe pages.

Needs

- confidence that a drink is popular
- subtle engagement indicators

Pain Points

- recipes with no context on popularity

Success Criteria

User sees brew counts that update naturally as recipes are viewed.

---

# E) Assumptions

- Backend provides endpoint to increment recipe views
- Brew count is stored in recipe table
- Brew count displayed as numeric value

---

# F) User Journey

1. User opens recipe detail page
2. Frontend loads recipe data
3. Frontend sends view tracking request
4. Backend increments brew count
5. Brew count updates in future requests

---

# G) Functional Requirements

## Trigger View Event

When recipe page loads:

Frontend must call:

`POST /recipes/{id}/view`

`id="p5s6nx"`

---

## Timing

View event should trigger:

- after recipe detail data loads
- only once per page load

---

## Display Brew Count

Recipe cards must display:

`12,420 brews`

`id="r9ovks"`

Frontend should format number using localized formatting.

---

## Duplicate View Prevention

To prevent excessive increments:

Frontend should ensure:

- view request sent once per page load
- navigation refresh triggers new view

Optional future improvement: session-based throttling.

---

# H) Non-Functional Requirements

Performance

- view tracking must not block page rendering

Reliability

- failure to record view should not affect UI

Maintainability

- view logic isolated in recipe service

---

# I) User Stories

## Story: Record Recipe View

As a user
I want the system to record when I view a recipe
So that brew counts remain accurate.

Acceptance Criteria

Given recipe page opened
When page loads
Then view endpoint triggered.

---

## Story: Display Brew Count

As a user
I want to see brew counts on recipes
So that I know which drinks are popular.

Acceptance Criteria

Brew count displayed on recipe card and detail page.

---

# J) Out of Scope

- analytics dashboards
- per-user tracking
- popularity ranking

---

# K) Milestones

MVP

- view endpoint integration
- brew count displayed in UI

---

# L) Success Metrics

Engagement

- number of recorded recipe views

Quality

- view event success rate

---

# M) Risks & Mitigations

Risk
Page refresh could artificially inflate views.

Mitigation
Acceptable for MVP.

---

# N) Open Questions

- Should brew count appear in hero section? Yes.
