# Coffee Codex — Frontend Vision

Repository: coffee-codex-client

Coffee Codex is a curated digital library of modern coffee drinks designed for home baristas.

The frontend focuses on delivering a fast, minimal, and visually rich browsing experience where users can discover coffee recipes and follow precise brewing instructions.

The product intentionally avoids social-media mechanics. It behaves more like a **digital coffee book or café menu**.

---

# Product Principles

Coffee Codex follows several core principles:

1. Curation over volume
2. Clarity over complexity
3. Aesthetic presentation over engagement metrics
4. Mobile-first design
5. Simple discovery instead of algorithmic feeds

Users should be able to quickly:

- browse coffee drinks
- open recipes
- follow step-by-step instructions
- discover new drinks

---

# Core User Experience

The MVP contains two main user-facing pages.

## Recipe Library (Landing Page)

Users can:

- browse recipes
- filter by category
- search recipes
- open recipe details
- discover random drinks

Key UI elements:

- hero section
- recipe grid
- category filters
- search
- “Surprise Me” discovery button

---

## Recipe Detail Page

The recipe page provides structured brewing information.

Users can:

- view drink images
- see brew specifications
- view ingredients
- follow preparation steps
- share recipe links

Key sections:

- image carousel
- brew specifications
- ingredient list
- preparation steps
- recipe metadata

---

# Target Users

Primary users are **home baristas and coffee enthusiasts**.

Typical user characteristics:

- owns an espresso machine or brewing equipment
- experiments with coffee drinks
- discovers drinks on Instagram, YouTube, or cafés
- wants clear instructions to recreate drinks

Coffee Codex serves as a **reference destination for making drinks**, not just viewing them.

---

# MVP Scope

The MVP focuses on **recipe discovery and viewing**.

Supported features:

- browse recipe library
- view recipe details
- filter recipes
- search recipes
- random drink discovery

Recipes are **admin-created only** in the MVP.

There is:

- no public recipe submission
- no comments
- no likes
- no social feed

Authentication exists only for **admin operations**.

---

# Frontend Technology Stack

The frontend is built using modern Angular architecture.

Core technologies:

- Angular 21
- Angular Material
- Tailwind CSS
- Standalone Angular components
- Signals-based state management
- Reactive Forms
- Auth0 authentication

The UI must remain responsive and mobile-friendly.

---

# Design Philosophy

The interface should feel:

- calm
- minimal
- editorial
- crafted

Design inspiration includes:

- Apple product pages
- Aesop product catalog
- modern specialty café menus

Guidelines:

- large drink photography
- generous whitespace
- simple typography
- minimal UI noise

---

# Responsive Design Strategy

Coffee Codex is **mobile-first**.

Most traffic will come from:

- Instagram
- WhatsApp
- Google search

Design targets:

Mobile

- primary experience
- swipeable images
- vertical layout

Tablet

- expanded browsing grid

Desktop

- split layout on recipe pages

---

# Theming

The UI supports:

- light mode
- dark mode

Theme selection follows:

1. system preference
2. manual user toggle

Light mode uses warm neutral backgrounds.

Dark mode uses deep espresso tones.

---

# Image Strategy

Images are essential to the Coffee Codex experience.

Each recipe may contain multiple images:

- hero drink image
- preparation image
- alternate styling

Images are stored in blob storage and delivered via backend URLs.

Frontend must support:

- responsive images
- lazy loading
- image carousel display

---

# Routing

Primary routes:

```

/
/r/:id

```

Future admin routes:

```

/admin
/admin/recipes
/admin/recipes/new

```

---

# API Consumption

The frontend is API-driven.

Key endpoints include:

```

GET /recipes
GET /recipes/{id}
GET /recipes/random
GET /recipes?search=
GET /recipes?category=
GET /recipes?tag=

```

The frontend focuses on presentation and navigation.

Business logic remains in the backend.

---

# Performance Goals

The application should remain fast even on mobile networks.

Targets:

- first contentful paint < 1.5s
- minimal bundle size
- lazy image loading
- efficient API usage

---

# Long-Term Direction

Future capabilities may include:

- contributor profiles
- recipe submissions
- curated drink collections
- seasonal drink spotlights
- advanced search

These are outside the MVP scope.

---
