# Chop Shop — Multi-Barber Booking (2.0)

Multi-barber barbershop app. Frontend UI is implemented with dummy data; backend remains 1.0 (single-barber) and is **not** wired up. This repo is [chop_shop](https://github.com/eric-capiz/chop_shop). The original single-barber app is [barbershop-booking](https://github.com/eric-capiz/barbershop-booking).

---

## Frontend (Done)

### Pages & Routes

| Route          | Description                                                                                                                                                                             |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`            | Home (Hero, rotating gallery). "Book Now" only when logged in as a **user** (not barber).                                                                                               |
| `/about`       | **Our Barbers** — List of barber cards (photo, name, specialty, bio preview). Each links to `/barber/:id`.                                                                              |
| `/barber/:id`  | Barber profile: bio, experience, specialties, "My Work" gallery, services & pricing, social links. "Book Me" + bottom CTA only when logged in as a **user**.                            |
| `/my-work`     | **Our Work** — Per-barber sections. Each: barber name (→ profile), top 3 haircut images, top 3 reviews.                                                                                 |
| `/book`        | Booking flow (protected, user only): 1) Choose barber → 2) Date & time → 3) Service → 4) Contact → 5) Confirm. Barber can be pre-selected via `?barber=barberId` (e.g. from "Book Me"). |
| `/profile`     | User profile (appointments, reviews) — protected, user only.                                                                                                                            |
| `/dashboard/*` | Admin dashboard — protected, barber only. Profile, Services, Gallery, Availability, Appointments.                                                                                       |

### Auth & Demo Users

- **Mock auth only** — no backend auth calls. Token/user live in `localStorage` and Zustand.
- **Barbers (admin):** `admin1` … `admin5` — username and password both `admin1` … `admin5`. Each has a distinct profile (name, bio, etc.) and sees their own dashboard data.
- **User:** `breezy` / `breezy` — can book, see "Book Me", access `/book` and `/profile`.

### Dummy Data

- **`src/data/dummyData.ts`**: 5 barbers, shared services, shared gallery items, per-barber availability (30 days), per-barber reviews (3 each). Helpers: `getBarberById`, `getTopGalleryForBarber`, `getReviewsForBarber`, `getServicesForBarber`, `getAvailabilityForBarber`, etc.
- All listing, profile, Our Work, booking, and admin UI use this module. No API calls for 2.0 flows.

### Tech Stack (Frontend)

- React 18, TypeScript, Vite
- React Router, Zustand, TanStack Query
- SCSS (gold/black theme), React Icons, FullCalendar, React Select, date-fns
- Axios base URL: `http://localhost:5000` (dev). Vite proxy `/api` → same. No deployed API or MongoDB in use.

### Notes

- **Book Me** / **Book Now** only show for logged-in **users** (e.g. `breezy`). Barbers do not see them.
- Confirm step shows barber, date/time, service, contact. Submit is mocked (toast + redirect); no backend booking.
- Admin dashboard (profile, services, gallery, availability, appointments) uses dummy data when logged in as `admin1`–`admin5`.

---

## Backend (TODO)

Backend is still the 1.0 single-barber setup. MongoDB connection is **disabled**. The following updates are needed for 2.0.

### 1. Database & config

- [ ] Re-enable MongoDB connection in `server.js` and use `MONGODB_URI` from `.env`.
- [ ] Confirm BarberProfile (or equivalent) supports **multiple** barbers (e.g. distinct `adminId` or barber identifier per doc).

### 2. Barbers

- [ ] **`GET /api/barbers`** (or similar) — list all barbers (id, name, slug/username, bio snippet, main specialty, profile image). Public.
- [ ] **`GET /api/barbers/:id`** — barber by id. Public. Used for `/barber/:id` and booking.

### 3. Per-barber content

- [ ] **Availability:**
  - `GET /api/availability?barberId=...` (or `/:barberId/availability`) — working days, slots, booked slots.
  - Ensure availability is stored and queried **per barber** (e.g. `barberId` / `adminId`).
- [ ] **Services:**
  - `GET /api/barbers/:id/services` (or scoped `GET /api/services?barberId=...`) — services for that barber.
  - Admin CRUD for services scoped to logged-in barber.
- [ ] **Gallery:**
  - `GET /api/barbers/:id/gallery` (or scoped gallery) — gallery items for that barber.
  - Admin CRUD for gallery scoped to logged-in barber.
- [ ] **Reviews:**
  - `GET /api/barbers/:id/reviews` (or scoped) — reviews for that barber (e.g. top N, pagination).
  - Create/update/delete review tied to appointment (and thus barber).

### 4. Auth

- [ ] Support **multiple barber accounts** (e.g. multiple BarberProfile docs). Login returns which barber is authenticated.
- [ ] Keep existing **user** auth (e.g. User model) for customers. No change to user login flow except possibly token payload.
- [ ] Ensure JWT (or session) encodes barber vs user and barber/id where needed.

### 5. Appointments & booking

- [ ] **`POST /api/appointments`** (or booking-specific route) — include `barberId` (and optionally `serviceId`, `date`, `time`, contact info). Validate against barber’s availability and services.
- [ ] **`GET /api/appointments/user`** — user’s appointments; include barber info.
- [ ] **`GET /api/appointments/barber`** (or `/admin` scoped to barber) — only that barber’s appointments.
- [ ] Reschedule, cancel, confirm, reject, etc. scoped to the correct barber’s schedule.

### 6. Admin “Add barber”

- [ ] **`POST /api/admin/barbers`** (or similar) — create new barber (username, password, placeholders for profile). Only for superadmin or existing “add barber” role.
- [ ] New barber logs in and fills profile, services, availability, gallery via existing dashboard UI (once wired to per-barber APIs).

### 7. Misc

- [ ] Remove or repoint any **single-barber** assumptions (e.g. global “the” barber, single availability doc).
- [ ] Ensure CORS, env vars, and security (rate limiting, validation, etc.) remain correct for multi-barber.
- [ ] Add or update **API docs** (e.g. OpenAPI/Swagger) for new/changed endpoints.

---

## Getting started

### Prerequisites

- Node.js v18+
- MongoDB (when backend is re-enabled)
- Git

### Install and run

```bash
git clone https://github.com/eric-capiz/chop_shop.git
cd chop_shop
```

**Backend (optional until backend TODO is done):**

```bash
cd backend
npm install
# Add .env with MONGODB_URI, etc.
npm run dev
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

- App: **http://localhost:5173**
- API (when running): **http://localhost:5000**

Use `breezy` / `breezy` to test booking flow, and `admin1` … `admin5` (same for user/pass) to test barber dashboard.

---

## License

MIT — see [LICENSE](LICENSE).
