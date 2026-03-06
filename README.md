# jeft0816.github.io

Minimal Nuxt 4 profile site with two routes:

- `/` welcome screen
- `/profile` profile page

## Stack

- Nuxt 4 + Vue 3 (`<script setup>`)
- PrimeVue module + PrimeIcons
- Font Awesome
- Vitest (unit tests)
- ESLint (`@antfu/eslint-config`)

## Scripts

```sh
pnpm install
pnpm dev
pnpm build
pnpm preview
pnpm lint
pnpm lint:fix
pnpm test
```

## Project Structure

```text
app/
  assets/css/            Global styles
  components/            UI components
  constants/             Typed app constants
  core/config/           PrimeVue configuration
  layouts/               Nuxt layouts
  pages/                 File-based routes
  utils/                 Shared utility functions
public/                  Static assets

test/unit/               Unit tests
```

## Notes

- Profile data is centralized in `app/constants/profile.ts`.
- Relative time formatting is implemented in `app/utils/timeAgo.ts` and covered by unit tests.
- Production build output is generated under `.output/`.
