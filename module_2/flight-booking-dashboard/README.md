# Flight Booking Dashboard

A React + TypeScript + Vite dashboard for searching flights and booking
seats. Frontend-only: data comes from a Promise-based mock service that can
later be swapped for a real API without changing the UI components.

## Features

- Flight list rendered as responsive cards (flight number, airline, route,
  departure/arrival times, price, seats remaining, status).
- Case-insensitive search across flight number, airline, origin and
  destination.
- Filters by status (`Scheduled` / `Boarding` / `Delayed` / `Cancelled`) and
  price range, applied together with search.
- Result count and a `Clear filters` action.
- Booking modal with per-field validation (flight required, passenger name
  length, email format, seats as integer within remaining availability and a
  10-seat per-booking cap), `aria-invalid` / `aria-describedby` error wiring,
  a live estimated total and a submit guard.
- Successful bookings decrement seat availability (immutable update) and
  appear in a session bookings table.
- Book buttons are disabled for sold-out or cancelled flights.
- Distinct loading, error (with retry), empty-dataset and
  no-matching-results states.
- Keyboard accessible: focus-visible styles, focus trap inside the modal,
  Escape/backdrop to close, focus returned to the trigger button.

## Tech stack

- React 19 + TypeScript (strict)
- Vite
- Plain CSS (custom properties, Grid, Flexbox, mobile-first media queries)
- oxlint (lint) + Prettier (format)

## Getting started

```bash
npm install
npm run dev
```

## Scripts

| Script                 | Purpose                      |
| ---------------------- | ---------------------------- |
| `npm run dev`          | Start the Vite dev server    |
| `npm run build`        | Typecheck + production build |
| `npm run preview`      | Preview the production build |
| `npm run typecheck`    | `tsc -b`                     |
| `npm run lint`         | oxlint                       |
| `npm run format`       | Prettier write               |
| `npm run format:check` | Prettier check               |

## Mock API

`src/features/flights/services/flightService.ts` keeps an in-memory store
seeded from `data/mockFlights.ts`. `getFlights()` and `createBooking()`
return Promises with a configurable delay. Bookings decrement the stored
seat counts; all data resets on page reload — persistence (e.g.
`localStorage`) is intentionally out of scope.

Copy `.env.example` to `.env.local` to configure the mock:

```dotenv
VITE_MOCK_API_DELAY_MS=600
VITE_MOCK_API_SHOULD_FAIL=false
```

- `VITE_MOCK_API_DELAY_MS` — simulated network latency in milliseconds.
- `VITE_MOCK_API_SHOULD_FAIL` — set to `true` to force every request to
  reject, which lets you verify the error UI and the Retry flow.

`VITE_*` variables are bundled into client code — never store secrets in them.

## Project structure

```text
src/
├── app/App.tsx                 # composition root
├── components/
│   ├── layout/AppHeader.tsx
│   └── ui/                     # shared presentational components
├── features/flights/
│   ├── components/             # dashboard, list, card, search, filters,
│   │                           # booking form, bookings table
│   ├── data/mockFlights.ts
│   ├── hooks/useFlights.ts     # API state + load/book orchestration
│   ├── services/flightService.ts
│   ├── types/flight.ts
│   └── utils/                  # filterFlights, validateBookingForm,
│                               # format, errors
├── styles/                     # tokens.css + globals.css
├── types/api.ts                # ApiState<T> discriminated union
└── main.tsx
```
