# Coffee Codex

Coffee Codex is a curated digital catalog of modern coffee drinks.

The goal of the project is not just the application itself, but to demonstrate a structured approach to **human-led, AI-driven development**.

This repository contains the **Angular frontend** of the system.

---

## Project Purpose

Coffee Codex is built as a practical experiment exploring a simple principle:

> Humans decide intent.  
> AI accelerates execution.

Instead of prompting AI directly to generate code, development follows a structured pipeline:

```

Vision → Architecture → Feature Specs → Plan → Implementation

```

The first commit of this repository intentionally contains **no code**.

It defines:

- product vision
- technical architecture
- feature specifications
- UI mockups

Only after these are defined will implementation begin.

---

## Technology Stack

Frontend is built with:

- Angular 21
- Standalone Components
- Angular Signals
- Angular Material
- Tailwind CSS

---

## Repository Structure

```

docs/
vision.md
architecture.md
design.md
mockups/
specs/

```

Each feature is defined as a **specification** before implementation.

Example:

```

002-recipe-listing
003-recipe-detail
004-image-carousel

```

These specs define scope and behavior before code is written.

---

## Development Philosophy

This project demonstrates **intent-driven development**.

Instead of:

```

idea → prompt → code

```

the workflow becomes:

```

idea
↓
product vision
↓
technical architecture
↓
feature PRDs
↓
AI-assisted implementation

```

The goal is to keep **humans in the driver seat**, with AI accelerating execution.

---

## Related Repository

Backend API: [coffee-codex-service](https://github.com/helmikhaled/coffee-codex-service)

---

## Follow the Journey

The development process and thinking behind this project are documented in a series of posts exploring:

- turning ideas into structured systems
- human-led AI development
- spec-driven workflows

The repositories will evolve feature by feature.
