# PRD — 001 Application Shell

# Problem Statement

Before implementing feature pages, the frontend requires a foundational application structure that provides routing, layout, and theming.

This application shell establishes the base Angular architecture and shared UI components used by all future features.

The shell includes global layout, routing configuration, and theme support.

---

# Goals

- Create Angular project structure
- Implement global layout
- Implement header navigation
- Configure routing
- Implement light/dark theme support
- Ensure mobile-first responsive layout

---

# Non-Goals

- recipe listing
- recipe detail page
- API integration
- authentication flow
- admin features

These will be implemented in later specs.

---

# Target Users

Internal developers building Coffee Codex.

---

# User Journey

1. User opens application
2. Application loads root layout
3. Header navigation is visible
4. Router loads current page

---

# Functional Requirements

## App Shell Layout

The application must provide a global layout structure.

Layout includes:

- header
- page container
- router outlet

---

## Header

Header must include:

- Coffee Codex logo
- search icon placeholder
- theme toggle
- sign-in button placeholder

---

## Routing

Routes required:

```

/
/r/:id

```

Future routes may include:

```

/admin
/admin/recipes

```

---

## Theme Support

The application must support:

- light mode
- dark mode

Theme selection must follow:

1. system preference
2. manual toggle

---

# Non Functional Requirements

Maintainability

- use Angular standalone components
- follow smart/dumb component separation

Responsiveness

- mobile-first layout
- Tailwind responsive utilities

---

# Milestones

MVP deliverable:

Application loads with working layout and routing.

---

# Risks

Risk: routing conflicts when admin routes added later.

Mitigation: reserve `/admin` route namespace.

---

# Open Questions

Should logo link always return to homepage? Yes.
