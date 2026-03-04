# titan-nuxt

Production-ready Nuxt 4 starter template. Everything you need is pre-configured — no setup from scratch.

---

## Stack

| Layer      | Technology                                |
| ---------- | ----------------------------------------- |
| Framework  | Nuxt 4 (Vue 3 Composition API)            |
| UI Library | PrimeVue 4 + Aura Theme                   |
| Styling    | Tailwind CSS 4                            |
| State      | Pinia                                     |
| Router     | Vue Router (via Nuxt)                     |
| i18n       | @nuxtjs/i18n 10 (JSON)                    |
| Utilities  | VueUse                                    |
| Icons      | @nuxt/icon + Primeicons                   |
| Fonts      | @nuxt/fonts                               |
| Testing    | Vitest + @nuxt/test-utils                 |
| Linting    | ESLint (antfu config)                     |

---

## Features

- **Auto Import** — Vue, Nuxt, Pinia, VueUse, and i18n composables are available without writing `import`
- **PrimeVue Auto Import** — All PrimeVue components are automatically registered via `@primevue/nuxt-module`
- **Layout System** — `default` (with header) and `empty` (full screen) layouts ready to use
- **Theming** — Custom primary palette + Aura preset, dark mode support via `.dark` class
- **i18n** — JSON-based multi-language setup, `en` and `tr` locales included
- **Nuxt DevTools** — Enabled out of the box for a better dev experience
- **Type Safe** — TypeScript with full type checking

---

## Getting Started

```sh
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Production build
pnpm build

# Generate static site
pnpm generate

# Preview production build
pnpm preview

# Run unit tests
pnpm test

# Lint
pnpm lint

# Lint + auto-fix
pnpm lint:fix
```

---

## Directory Structure

```
app/
├── assets/css/       # Global styles
├── components/       # Shared components (auto-imported)
├── composables/      # Composables (auto-imported)
├── core/
│   └── config/       # PrimeVue, i18n configurations
├── layouts/          # default.vue, empty.vue
├── pages/            # Page components (file-based routing)
├── stores/           # Pinia stores (auto-imported)
└── utils/            # Utility functions (auto-imported)
i18n/
├── en.json           # English locale
└── tr.json           # Turkish locale
```

---

## IDE

**VS Code** + **[Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar)** extension is recommended.

**Nuxt DevTools** is enabled by default and accessible in the browser during development.

---

## Author

Built by **[atlaxt](https://github.com/atlaxt)**
