# PRD - 004 Recipe Image Carousel

# A) Problem Statement

Coffee Codex recipes rely heavily on visual presentation. A single image is not sufficient to convey the appearance and preparation of a drink.

Recipes should support multiple images, such as:

- final drink presentation
- alternate styling
- preparation shots

The frontend must render these images in a clean, modern image carousel that allows users to browse through them easily, particularly on mobile devices.

This feature implements the **recipe image carousel component** used on the recipe detail page.

---

# B) Goals

- Display multiple recipe images
- Provide swipeable carousel UI
- Support mobile gestures
- Maintain responsive layout
- Lazy load images for performance

---

# C) Non-Goals

- image editing
- image uploading
- image moderation
- admin image management

These will be handled in later specs.

---

# D) Target Users / Personas

## Home Barista

Context  
User viewing recipe page and looking for visual reference of the drink.

Needs

- see drink appearance clearly
- view alternate images
- browse images easily on mobile

Pain Points

- unclear drink presentation
- low quality recipe visuals

Success Criteria  
User can swipe through images naturally and clearly see the drink.

---

# E) Assumptions

- RecipeDetailDto includes an ordered list of images
- Images are accessible via URL
- Images may vary in aspect ratio
- Images may load from blob storage

---

# F) User Journey

1. User opens recipe page
2. Recipe images load
3. First image appears as hero image
4. User swipes or clicks navigation
5. Next image appears
6. User can browse through images

---

# G) Functional Requirements

## Image Carousel Component

Reusable component responsible for displaying recipe images.

Component must support:

- multiple images
- swipe navigation
- click navigation
- image pagination indicators

---

## Image Ordering

Images must appear according to the order defined by backend:

```

position ASC

```

---

## Navigation

Users must be able to navigate images using:

Desktop

- arrow buttons

Mobile

- swipe gestures

---

## Image Indicators

Carousel must display position indicators.

Example:

```

● ○ ○

```

---

## Image Loading

Images must load lazily to reduce page load time.

Only the first image should load immediately.

---

## Fallback Behavior

If recipe contains only one image:

- carousel navigation is hidden
- image displayed as static hero image

---

# H) Non-Functional Requirements

Performance

- images lazy loaded
- avoid layout shifts

Responsiveness

Mobile  
full width image

Desktop  
constrained container width

Maintainability

- reusable Angular component
- standalone component architecture

---

# I) User Stories

## Story: View Recipe Images

As a user  
I want to browse recipe images  
So that I can see how the drink should look.

Acceptance Criteria

Given recipe has multiple images  
When recipe page loads  
Then images appear in carousel.

---

## Story: Navigate Images

As a user  
I want to navigate between images  
So that I can explore drink visuals.

Acceptance Criteria

User can swipe on mobile or click arrows on desktop.

---

# J) Out of Scope

- image upload
- image editing
- image compression

---

# K) Milestones

MVP Deliverable

- carousel component implemented
- integrated with recipe detail page
- navigation working

---

# L) Success Metrics

Usage

- user interaction with carousel

Quality

- image load performance
- UI responsiveness

---

# M) Risks & Mitigations

Risk  
Large images may slow page rendering.

Mitigation  
Use optimized image sizes and lazy loading.

---

# N) Open Questions

- Should carousel support zoom functionality? No.
- Should captions appear under images? No.
