# Luxe Nails — Backend Setup

The Luxe Nails frontend (`nailsalon` branch) works **fully standalone** right now
using static mock data (`USE_MOCK_DATA = true` in `frontend/src/config/app.ts`).
No backend is required for Eric's review.

When ready to go live with real bookings, **one backend deployment serves both**
the Chop Shop barbershop and Luxe Nails. No second backend needed.

## How it works

**Site identifier:** Every API request from the Luxe Nails frontend automatically
includes `?site=luxenails` (added by the axios interceptor in
`frontend/src/config/axios.ts`, using `SITE_ID` from `frontend/src/config/app.ts`).
The barbershop frontend sends `?site=chopshop` (or no site param, which defaults
to chopshop).

**Data isolation:** Mongoose schemas include a `site` field:

```js
site: { type: String, default: "chopshop", index: true }
```

Add to: SalonProfile, Service, Appointment, GalleryItem, Review.

**Route filtering:** Backend routes filter by the `site` query param:

```js
// GET /api/technicians?site=luxenails
const site = req.query.site || "chopshop";
const technicians = await SalonProfile.find({ site });
```

When creating records, set `site` from `req.query.site || req.body.site || "chopshop"`.

## Deployment steps

1. Deploy the backend from the `nailsalon` branch (it contains the renamed
   Salon/Technician models). One deployment only.
2. Set `MONGODB_URI` to your MongoDB connection string. Both sites share the
   same database — the `site` field keeps data separate.
3. Set `FRONTEND_URL` to `https://luxenails-site.vercel.app` (or keep the
   barbershop URL; CORS should allow both).
4. In `frontend/src/config/app.ts`, set `USE_MOCK_DATA = false` and set
   `VITE_API_URL` to the backend URL. Redeploy the frontend.

## Switching back to mock data

Set `USE_MOCK_DATA = true` in `frontend/src/config/app.ts`. The public pages
(Home, About, Gallery, Artist profiles) use static data from
`frontend/src/data/` and never call the API.
