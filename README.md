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

Backend is still 1.0 single-barber. MongoDB connection is **disabled**. Use a **new MongoDB database** for 2.0 (separate from the original app). Below is what to implement.

---

### 1. MongoDB & config

- [ ] **New MongoDB**
  - Create a new database (or cluster) for Chop Shop 2.0. Do not reuse the 1.0 production DB.
  - Add `MONGODB_URI` to `backend/.env` pointing at the new DB.
- [ ] **Re-enable connection**
  - In `server.js`, uncomment and re-enable the Mongoose `mongoose.connect(...)` block.
  - Remove or update the “MongoDB connection disabled” log.
- [ ] Confirm `.env` has all required vars (e.g. `JWT_SECRET`, `MONGODB_URI`, Cloudinary if used).

---

### 2. Schemas (models)

Existing: `User`, `BarberProfile`, `BarberAvailability`, `Service`, `GalleryItem`, `Appointment`, `Review`.

- [ ] **BarberProfile**
  - Ensure it represents **one barber per document** (e.g. unique `username`). Add `barberId` or use `_id` as the barber identifier for APIs.
  - Support multiple barbers: no global “single” profile; each barber has their own doc.
- [ ] **BarberAvailability** (`model/admin/BarberAvailability.js`)
  - Add (or confirm) `barberId` (ref to BarberProfile). All queries filter by `barberId`.
- [ ] **Service** (`model/admin/Service.js`)
  - Add (or confirm) `barberId`. Scoped per barber.
- [ ] **GalleryItem** (`model/admin/GalleryItem.js`)
  - Add (or confirm) `barberId`. Scoped per barber.
- [ ] **Review** (`model/review/Review.js`)
  - Add (or confirm) `barberId`. Reviews are per barber; optionally tie to `Appointment` / `User`.
- [ ] **Appointment** (`model/appointment/Appointment.js`)
  - Add (or confirm) `barberId`. Every booking is for a specific barber.
- [ ] **User**
  - Keep for customers. No structural change unless you add new fields (e.g. preferred barber).

Add indexes where useful (e.g. `barberId` on availability, services, gallery, reviews, appointments).

---

### 3. Routes

**New routes**

- [ ] **Barbers (public)**
  - `GET /api/barbers` — list all barbers (id, name, username, bio snippet, specialty, profile image). For Our Barbers + booking.
  - `GET /api/barbers/:id` — barber by id. For `/barber/:id` and booking flow.
- [ ] **Per-barber content (public)**
  - `GET /api/barbers/:id/services` (or `GET /api/services?barberId=...`) — services for that barber.
  - `GET /api/barbers/:id/gallery` (or `GET /api/gallery?barberId=...`) — gallery for that barber.
  - `GET /api/barbers/:id/reviews` (or `GET /api/reviews?barberId=...`) — reviews for that barber (support limit, pagination if needed).
- [ ] **Availability (public, for booking)**
  - `GET /api/availability?barberId=...` (or `GET /api/barbers/:id/availability`) — working days, slots, booked slots for that barber.

**Existing admin routes** (`routes/admin/*`) — update to be **per-barber**:

- [ ] **Profile** (`profile.js`) — CRUD for the **logged-in barber’s** profile only. Use `barberId` from JWT.
- [ ] **Services** (`services.js`) — CRUD scoped to logged-in barber. List/create/update/delete only that barber’s services.
- [ ] **Gallery** (`gallery.js`) — CRUD scoped to logged-in barber. Same idea.
- [ ] **Availability** (`availability.js`) — read/write availability for logged-in barber only.

**Appointment routes** (`routes/appointment/*`):

- [ ] **`POST /api/appointments`** (or booking route) — body includes `barberId`, `serviceId`, `date`, `time`, user contact info. Validate against that barber’s availability and services. Create `Appointment` with `barberId`.
- [ ] **`GET /api/appointments`** (user) — “my appointments”; include barber info. Filter by user from JWT.
- [ ] **`GET /api/appointments/barber`** (or admin) — only the **logged-in barber’s** appointments. Filter by `barberId` from JWT.
- [ ] Reschedule, cancel, confirm, reject — all scoped to the correct barber’s schedule and permissions.

**Auth** (`routes/auth/auth.js`):

- [ ] **User login** — keep existing flow. JWT payload can include `userId`, `role: 'user'`.
- [ ] **Barber login** — support multiple barbers (BarberProfile with username/password or linked User). JWT payload includes `barberId` (or equivalent), `role: 'barber'` (or `admin`). Frontend uses this to know who is logged in and to scope admin API calls.

**User routes** (`routes/user/*`):

- [ ] **Reviews** — create/update/delete review tied to user and **barber** (and optionally appointment). List reviews by `barberId` for public barber profile.

**Add barber (admin)**

- [ ] **`POST /api/admin/barbers`** (or similar) — create new barber (username, password, minimal profile placeholders). Protected (e.g. superadmin or “add barber” role). New barber then logs in and completes profile, services, availability, gallery via dashboard.

---

### 4. Auth & middleware

- [ ] **Middleware**
  - `auth.js` — distinguish user vs barber (e.g. via JWT `role`). Protect user routes (booking, profile) and barber routes (dashboard) accordingly.
  - `isAdmin.js` (or equivalent) — ensure requester is a barber; optionally restrict “add barber” to a superadmin role.
- [ ] **JWT**
  - Encode `userId` or `barberId`, plus `role`, so backend can scope all barber-specific queries to the logged-in barber.

---

### 5. Misc

- [ ] **Cloudinary**
  - Keep per-barber separation (e.g. folders like `chop-shop/barber-{id}/...` for gallery/profile images). `cloudinaryUtils.js` already uses `chop-shop/`; extend as needed for barber-specific paths.
- [ ] **Single-barber cleanup**
  - Remove any “global” or “the” barber logic (single profile, single availability doc, etc.). All relevant data is keyed by `barberId`.
- [ ] **CORS, env, security**
  - CORS, rate limiting, input validation, etc. tuned for multi-barber and your deployment.
- [ ] **API docs**
  - Update or add OpenAPI/Swagger (or similar) for new/changed endpoints.

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

## Context prompt for AI

Copy the block below and paste it when starting a new session (e.g. with Cursor or another AI) to quickly bring the assistant up to speed on the project.

```
**Precursor instruction:** Evaluate the whole frontend and make sure it is as DRY as possible. There should be no duplication unless it is needed. If anything needs to be cleaned up, do it.

---

**Chop Shop (2.0)** — Multi-barber barbershop booking app. Repo: [chop_shop](https://github.com/eric-capiz/chop_shop). MERN stack (MongoDB, Express, React, Node). The original single-barber app is [barbershop-booking](https://github.com/eric-capiz/barbershop-booking); 2.0 is a separate product.

**What the project is:**
- Multi-barber shop: multiple barbers, each with their own profile, gallery, services, availability, and appointments.
- Customers (users) browse barbers, view profiles, book appointments with a specific barber, and leave reviews.
- Barbers (admins) log in to a dashboard to manage their profile, services, gallery, availability, and appointments. Future: "Add barber" so a superadmin can create new barber accounts.

**What we’ve done (frontend — complete):**
- **Pages:** Home, Our Barbers (list) → `/barber/:id` (profile), Our Work (gallery + reviews per barber), Booking flow (barber → date/time → service → contact → confirm), User profile, Admin dashboard (profile, services, gallery, availability, appointments).
- **Auth:** Mock only. Barbers `admin1`–`admin5` (user/pass same), user `breezy`/`breezy`. No real API auth yet.
- **Data:** All from `frontend/src/data/dummyData.ts`. No backend calls for 2.0 flows. Axios points at `localhost:5000`; MongoDB is disabled.
- **Branding:** Chop Shop. Gold/black theme. Footer: address, phone, Chop Shop socials (FB, IG, TikTok, Twitter), "Developed by Eric Capiz."

**What’s next (backend — TODO):**
1. **MongoDB:** New 2.0 database (not 1.0). Re-enable Mongoose in `server.js`, set `MONGODB_URI` in `.env`.
2. **Schemas:** Add `barberId` to BarberAvailability, Service, GalleryItem, Review, Appointment. BarberProfile = one doc per barber. User unchanged for customers.
3. **Routes:** New `GET /api/barbers`, `GET /api/barbers/:id`; per-barber services, gallery, reviews, availability (public). Update admin routes (profile, services, gallery, availability) to be scoped to logged-in barber. Appointments: `POST` (book with `barberId`), `GET` for user vs barber. Auth: user vs barber login, JWT with `userId`/`barberId` and `role`. `POST /api/admin/barbers` to add new barbers (protected).
4. **Middleware:** Auth distinguishes user vs barber; barber routes use `barberId` from JWT.
5. **Misc:** Cloudinary folders per barber, remove single-barber assumptions, CORS/env/security.

See this README’s **Backend (TODO)** section for the full checklist. Frontend is ready to be wired to real APIs once backend is implemented.
```

```

---

## License

MIT — see [LICENSE](LICENSE).
```
