<div align="center">

# mNieśmiertelnik

**A digital medical dog‑tag — instant, scannable access to your critical health data in an emergency.**

[![License: BSD-2-Clause](https://img.shields.io/badge/License-BSD%202--Clause-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![i18n](https://img.shields.io/badge/i18n-PL%20%7C%20EN-success)](frontend/src/i18n)

<sub>Built at the <b>BEST Wrocław Hackathon</b> · 11–12 Oct 2025 · in cooperation with Wrocław University of Science and Technology.</sub>

</div>

---

## What it is

**mNieśmiertelnik** ("the immortal", a play on _nieśmiertelnik_ — a soldier's dog‑tag) lets anyone store
their essential medical information and carry it as a **QR code** (on a phone lock screen or a physical
NFC band). When that person can't speak for themselves, a first responder scans the code and instantly
sees a read‑only emergency card: blood type, chronic conditions, allergies, long‑term medications, and
**In‑Case‑of‑Emergency (ICE) contacts**.

The app is designed in the style of Polish e‑government services (ePUAP / Profil Zaufany) and ships with
a **Polish + English** interface.

## Features

- 🔐 **Account & session auth** — register / log in, JWT‑protected per‑user endpoints.
- 🩺 **Medical profile** — blood type, date of birth, chronic conditions, allergies, medications, ICE contacts.
- 📱 **QR emergency card** — generate a QR that opens a public, read‑only scan page; downloadable as PNG.
- 🚑 **Responder scan view** — clean mobile layout with one‑tap **112** and **Notify ICE** actions.
- 🌗 **Light / dark theme** with persisted preference.
- 🌍 **Internationalization (PL/EN)** via i18next with an in‑app language switcher.
- 🖥️ **Responsive** — desktop sidebar dashboard and a dedicated mobile view.

## Architecture

```
┌──────────────┐    auth (JWT)        ┌─────────────────┐
│   Frontend   │  ── /register ─────▶ │     Backend     │
│ React + Vite │  ── /login    ─────▶ │     FastAPI     │
│  (frontend/) │  ── /users/{id}  ──▶ │   (BackendPY/)  │
│              │  ── /generateToken ▶ │                 │
└──────┬───────┘                      │   SQLAlchemy    │
       │ renders QR                   │        │        │
       ▼  containing a token          │        ▼        │
┌──────────────┐                      │  SQLite/Postgres│
│  Paramedic   │  ── /decryptToken ─▶ │   (public read) │
│ scans the QR │   (no auth needed)   └─────────────────┘
└──────────────┘
```

The medical data is stored as a JSON blob keyed by a **hashed token**. The token acts as a _capability_:
owning it (via the QR code) is what grants read access through the public `/decryptToken` endpoint, so a
responder never needs an account. All **owner** operations (reading your record, updating, deleting,
rotating your ID) require a JWT and verify ownership.

## Tech stack

| Layer    | Technologies                                                                                                 |
| -------- | ------------------------------------------------------------------------------------------------------------ |
| Frontend | React 19, TypeScript (strict), Vite 7, Tailwind CSS v4, React Router 7, Framer Motion, i18next, qrcode.react |
| Backend  | FastAPI, SQLAlchemy 2, Pydantic v2 + pydantic‑settings, PyJWT, Passlib (Argon2), Uvicorn                     |
| Database | SQLite (dev) · PostgreSQL‑ready via `DATABASE_URL`                                                           |
| Tooling  | ESLint, Prettier (+ tailwindcss plugin), TypeScript project references                                       |

## Project structure

```
m-niesmiertelnik/
├── BackendPY/                 # FastAPI backend
│   ├── app/
│   │   ├── main.py            # API routes, auth dependencies, CORS
│   │   ├── config.py          # Env-based settings (pydantic-settings)
│   │   ├── security.py        # Argon2 hashing, JWT, token hashing
│   │   ├── models.py          # SQLAlchemy models (User, OldUserId, FormData)
│   │   ├── schemas.py         # Pydantic request/response models
│   │   ├── crud.py            # Database operations
│   │   ├── database.py        # Engine/session setup
│   │   └── notifications.py   # ICE notification stub (roadmap)
│   ├── requirements.txt       # Pinned dependencies
│   ├── .env.example           # Required env vars
│   └── Procfile               # uvicorn entrypoint (Render/Railway)
├── frontend/                  # React + Vite + Tailwind app
│   └── src/
│       ├── pages/             # Landing, Login, Register, Dashboard, MedicalInfoForm, Mobile, Settings …
│       ├── components/        # layout/, dashboard/, mobile/, forms/, auth/, switchers
│       ├── context/           # AuthContext, ProfileDataContext, ThemeProvider
│       ├── hooks/             # useDetectMobileOS, useSmoothScroll
│       ├── lib/               # api.ts (base URL + authFetch), date.ts
│       ├── i18n/              # i18next config + pl.json / en.json
│       └── types.ts           # Shared domain types
├── docs/                      # One‑pager + legacy mockups
└── LICENSE                    # BSD 2-Clause
```

## Getting started

### Prerequisites

- Node.js 20+ and npm
- Python 3.11+

### Backend

```bash
cd BackendPY
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # then fill in JWT_SECRET_KEY and ENCRYPTION_KEY
uvicorn app.main:app --reload
```

The API serves at `http://127.0.0.1:8000` with interactive docs at `/docs`.

> The server **refuses to start** unless `JWT_SECRET_KEY` and `ENCRYPTION_KEY` are set — there are no insecure defaults.

#### Seed example data (optional)

Populate the database with ready‑to‑use demo accounts so the app works locally end‑to‑end:

```bash
python -m app.seed
```

This creates three example users — all with password **`haslo1234`**:

| Login                      | Profile                                          |
| -------------------------- | ------------------------------------------------ |
| `jan.kowalski@example.com` | Type 1 diabetes, penicillin allergy, ICE contact |
| `anna.nowak@example.com`   | Asthma, pollen/cat allergies                     |
| `marek@example.com`        | Latex allergy                                    |

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local      # set VITE_API_URL to your backend (defaults to the hosted one)
npm run dev
```

The app serves at `http://localhost:5173`.

### Environment variables

| Where     | Variable             | Purpose                                                    |
| --------- | -------------------- | ---------------------------------------------------------- |
| BackendPY | `JWT_SECRET_KEY`     | Signs JWT session tokens (**required**)                    |
| BackendPY | `ENCRYPTION_KEY`     | Secret mixed into the QR token hash (**required**)         |
| BackendPY | `DATABASE_URL`       | SQLAlchemy URL (defaults to SQLite)                        |
| BackendPY | `ALLOWED_ORIGINS`    | Comma‑separated CORS allow‑list                            |
| BackendPY | `ADMIN_API_KEY`      | Guards `/admin/*` endpoints (empty = disabled)             |
| frontend  | `VITE_API_URL`       | Backend base URL                                           |
| frontend  | `VITE_SCAN_BASE_URL` | Optional QR scan origin (defaults to the app's own origin) |

## Security notes

This started as a 24‑hour hackathon project and was hardened afterwards. Current posture:

- ✅ Argon2 password hashing; passwords validated (min length) server‑side.
- ✅ JWT‑authenticated, ownership‑checked endpoints; `/admin/*` behind an API key.
- ✅ Secrets from environment with fail‑fast startup; CORS restricted via `ALLOWED_ORIGINS`.
- ✅ Generic 500 responses (no exception/stack leakage to clients).
- ⚠️ Not yet: rate limiting, audit logging, database migrations (tables are auto‑created), HTTPS enforcement (handle at the proxy). See the roadmap.

> This is a student/hackathon project and **not** a certified medical device. Do not rely on it for real emergency care without a proper compliance (GDPR/medical) review.

## Roadmap

- **🔔 ICE notifications** — when an emergency card is scanned, alert the patient's trusted contacts (SMS/email). See [`notifications.py`](BackendPY/app/notifications.py).
- **📲 PWA + offline emergency card** — installable app that caches the owner's card so it renders without signal at an accident scene.
- **🏷️ NFC band + public scan page** — flesh out the "Opaska NFC" placeholder with a polished responder page and Web NFC write support.
- Rate limiting, Alembic migrations, and a proper medical‑data CRUD API.

## Legacy

Early concept mockups live in [`docs/LEGACY`](docs/LEGACY). The hackathon one‑pager is at
[`docs/OnePager-Hackathon-2025.pdf`](docs/OnePager-Hackathon-2025.pdf).

## License & copyright

[BSD 2‑Clause](LICENSE) © 2025 — Krzysztof Wiłnicki · Franciszek Wojnowski · Oskar Witek · Jakub Żłobiński
