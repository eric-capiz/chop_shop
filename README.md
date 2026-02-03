# Chop Shop — Multi-Barber Booking (2.0)

Multi-barber barbershop booking app. MERN stack: MongoDB, Express, React, Node. Frontend and backend are wired; all data comes from the API (no dummy data). Repo: [chop_shop](https://github.com/eric-capiz/chop_shop). Original single-barber app: [barbershop-booking](https://github.com/eric-capiz/barbershop-booking).

**Live:** [App](https://chop-shop-ec.vercel.app) · [API](https://chop-shop-guwk.onrender.com)

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

### Email notifications

- **Sender:** Super admin’s email (from `BarberProfile` with `role: "superadmin"`). All emails are sent from that address via Gmail SMTP (Nodemailer).
- **When:** On book (user + barber); on barber confirm (user); on barber reject (user, with note); on user cancel (user + barber); on user reschedule (user + barber); on barber reschedule confirm/reject (user). One dynamic template: subject, appointment details, notes only when rejected, general note by recipient, Chop Shop signature.
- **Setup:** In `backend/.env` set `EMAIL_APP_PASSWORD` to the Gmail app password for the super admin’s Gmail account (2-Step Verification must be on; create the app password at [Google App Passwords](https://myaccount.google.com/apppasswords)).

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
- `EMAIL_APP_PASSWORD` — Gmail app password for the super admin’s Gmail (required for appointment email notifications)
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

Create `frontend/.env` (optional) with `VITE_API_URL=http://localhost:5000` for local dev, or `VITE_API_URL=https://chop-shop-guwk.onrender.com` to use the deployed API.

```bash
npm run dev
```

- App: **http://localhost:5173**
- API: **http://localhost:5000**

**Deployed:** App — [https://chop-shop-ec.vercel.app](https://chop-shop-ec.vercel.app) · API — [https://chop-shop-guwk.onrender.com](https://chop-shop-guwk.onrender.com)

### Test accounts (after seed)

- **Superadmin:** `admin0` / `admin0`
- **Barbers:** `admin1` / `admin1` … `admin4` / `admin4`
- **Users:** Register from the app (or create via API); no seeded user.

---

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite, React Router, Zustand, TanStack Query, Axios, SCSS (gold/black theme), date-fns.
- **Backend:** Node, Express, Mongoose, JWT (jsonwebtoken), bcryptjs, Nodemailer (Gmail SMTP for appointment emails), Cloudinary (optional), express-rate-limit, helmet.

---

## TODO

- [ ] **Forgot password** — Reset flow for users and/or barbers.

---

## License

MIT — see [LICENSE](LICENSE).
