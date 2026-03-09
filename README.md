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

## Production Deployment (FTP)

The project uses GitHub Actions workflow at `.github/workflows/deploy.yml`.

- On `pull_request` to `main`: `lint -> test -> generate` runs as a quality gate.
- On `push` to `main`: the same quality gate runs, then the generated static artifact is deployed via FTPS.
- Deployment source is `.output/public` artifact, not a fresh second build.

Required repository secrets:

- `FTP_SERVER`
- `FTP_USERNAME`
- `FTP_PASSWORD`
- `FTP_PATH`

## Hosting Notes

- `public/.htaccess` is deployed with static files and contains Apache security headers + cache rules.
- Ensure Apache modules are enabled if available: `mod_headers`, `mod_expires`, `mod_deflate`.

## Notes

- Profile data is centralized in `app/constants/profile.ts`.
- Relative time formatting is implemented in `app/utils/timeAgo.ts` and covered by unit tests.
- Production build output is generated under `.output/`.
