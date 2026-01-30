# Chop Shop — Multi-Barber Booking (2.0)

Multi-barber barbershop booking app. MERN stack: MongoDB, Express, React, Node. Frontend and backend are wired; all data comes from the API (no dummy data). Repo: [chop_shop](https://github.com/eric-capiz/chop_shop). Original single-barber app: [barbershop-booking](https://github.com/eric-capiz/barbershop-booking).

---

## What’s Implemented

### Roles

- **User** — Browse barbers, book appointments, view profile (appointments, reviews). Register or log in.
- **Admin (barber)** — Dashboard: profile, services, gallery, availability, appointments. Confirm/reject bookings; reject requires a note (shown to user under Notes).
- **Superadmin** — Same as admin plus **Manage Barbers**: list barbers, add barber, transfer super admin role (then logged out), delete barber (cascade: profile, services, gallery, availability, appointments, reviews, Cloudinary).

### Frontend Routes

| Route          | Description                                                                                                   |
| -------------- | ------------------------------------------------------------------------------------------------------------- |
| `/`            | Home. "Book Now" when logged in as user.                                                                      |
| `/about`       | Our Barbers — list from API, links to `/barber/:id`.                                                          |
| `/barber/:id`  | Barber profile (bio, gallery, services, socials). "Book Me" when user.                                        |
| `/our-work`    | Our Work — per-barber gallery + top reviews from API.                                                         |
| `/book`        | Booking (user only): barber → date/time → service → contact → confirm. Pre-select via `?barber=id`.           |
| `/profile`     | User profile: appointments (with barber name, rejection note under Notes), reviews.                           |
| `/dashboard/*` | Admin dashboard: Profile, Services, Gallery, Availability, Appointments; superadmin also sees Manage Barbers. |

### Backend (Summary)

- **Auth:** `POST /api/auth/login`, `POST /api/auth/register`. Login returns `token`, `isAdmin`, `isSuperAdmin`, `role`. Barbers from `BarberProfile`, users from `User`.
- **Public barbers:** `GET /api/barbers`, `GET /api/barbers/:id`, `GET /api/barbers/:id/services`, `.../gallery`, `.../reviews`.
- **Availability (booking):** `GET /api/availability?adminId=...`, `GET /api/availability/booked-slots?adminId=...`.
- **Appointments:** `POST /api/appointments/book` (user), `GET /api/appointments/user`, `GET /api/appointments/barber` (barber), `PUT /api/appointments/:id/status` (confirm/reject; reject requires `rejectionDetails.note`).
- **Admin (per barber):** profile, services, gallery, availability — all scoped to logged-in barber.
- **Superadmin:** `GET/POST /api/admin/barbers`, `PUT /api/admin/barbers/:id/super-admin`, `DELETE /api/admin/barbers/:id`.

### Seed

- **One command:** `npm run seed` (from `backend`).
- **Behavior:** Drops the database, then creates:
  - **1 superadmin:** `admin0` / `admin0`, email `admin@gmail.com`.
  - **4 barbers:** `admin1`–`admin4` / same password, emails `admin1@gmail.com` etc., names "Admin1 Barber" … "Admin4 Barber", each with distinct specialties, bios, socials, 2 weeks availability, services, and 2 reviews each (reviewer users created as needed).

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- Git

### Setup and run

**1. Clone and install**

```bash
git clone https://github.com/eric-capiz/chop_shop.git
cd chop_shop
```

**2. Backend**

From project root (or `backend` if you prefer):

```bash
cd backend
npm install
```

Create `backend/.env` with:

- `MONGODB_URI` — your MongoDB connection string
- `JWT_SECRET` — secret for JWT
- Cloudinary vars if you use image uploads (profile/gallery)

Then:

```bash
npm run seed
npm run dev
```

**3. Frontend**

```bash
cd frontend
npm install
```

Create `frontend/.env` (optional) with `VITE_API_URL=http://localhost:5000` if the API is not on that URL.

```bash
npm run dev
```

- App: **http://localhost:5173**
- API: **http://localhost:5000**

### Test accounts (after seed)

- **Superadmin:** `admin0` / `admin0`
- **Barbers:** `admin1` / `admin1` … `admin4` / `admin4`
- **Users:** Register from the app (or create via API); no seeded user.

---

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite, React Router, Zustand, TanStack Query, Axios, SCSS (gold/black theme), date-fns.
- **Backend:** Node, Express, Mongoose, JWT (jsonwebtoken), bcryptjs, Cloudinary (optional), express-rate-limit, helmet.

---

## TODO

- [ ] **Test booking edge cases** — Exercise cancelling and rescheduling; confirm freed slots are returned to availability and show as bookable again.
- [ ] **Deploy backend and frontend** — Deploy API and app (e.g. Fly.io, Render, Vercel + backend host); set env vars and CORS.
- [ ] **Code review / DRY** — Review codebase for cleanup, duplication, and opportunities to simplify (shared types, helpers, consistent patterns).
- [ ] **Mobile responsive** — Check layouts and flows on small screens; fix breakpoints and touch targets so everything looks and works well on mobile.

---

## Future Features

- **Booking notifications**
  - When a user books: barber gets email/text to confirm.
  - When barber confirms: user gets confirmation email/text (barber name, date/time).
- **Forgot password** — reset flow for users and/or barbers.

---

## License

MIT — see [LICENSE](LICENSE).
