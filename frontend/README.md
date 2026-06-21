# mNieśmiertelnik — Frontend

React 19 + TypeScript (strict) + Vite 7 + Tailwind CSS v4 single‑page app. See the
[root README](../README.md) for the project overview and architecture.

## Scripts

| Command           | Description |
|-------------------|-------------|
| `npm run dev`     | Start the Vite dev server (`http://localhost:5173`). |
| `npm run build`   | Production build to `dist/`. |
| `npm run preview` | Preview the production build. |
| `npm run lint`    | Run ESLint. |
| `npx tsc -b`      | Type‑check the project (strict). |

## Setup

```bash
npm install
cp .env.example .env.local   # set VITE_API_URL to your backend
npm run dev
```

## Environment

| Variable             | Purpose |
|----------------------|---------|
| `VITE_API_URL`       | Base URL of the FastAPI backend. |
| `VITE_SCAN_BASE_URL` | Optional override for the origin the emergency QR points to (defaults to the app's own origin). |

## Structure

```
src/
├── pages/        # Route components (Landing, Login, Register, Dashboard, MedicalInfoForm, Mobile, Settings, …)
├── components/   # layout/, dashboard/, mobile/, forms/, auth/, ThemeSwitcher, LanguageSwitcher
├── context/      # AuthContext (JWT + localStorage), ProfileDataContext, ThemeProvider
├── hooks/        # useDetectMobileOS, useSmoothScroll
├── lib/          # api.ts (base URL, authFetch, scanUrl), date.ts
├── i18n/         # i18next setup + locales/pl.json, locales/en.json
├── styles/       # index.css (Tailwind v4 import + theme tokens)
└── types.ts      # Shared domain types
```

## Internationalization

UI strings live in [`src/i18n/locales`](src/i18n/locales) (`pl.json`, `en.json`). Components read them with
`useTranslation()`; the in‑app **LanguageSwitcher** toggles PL ⇄ EN and persists the choice. Polish is the
default/fallback language.
