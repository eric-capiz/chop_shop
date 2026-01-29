# Chop Shop - Multi-Barber Management System (2.0)

## Overview

A full-stack web application for managing a multi-barber shop's appointments, services, and customer interactions. This is the 2.0 version featuring support for multiple barbers, each with their own profile, gallery, services, and availability.

> **Note:** This is the multi-barber version. The original single-barber version (1.0) is maintained separately at [barbershop-booking](https://github.com/eric-capiz/barbershop-booking).

## What's New in 2.0

### Multi-Barber Support
- **Barber Listing Page**: Main About page displays all barbers as cards (name, short bio, main specialty)
- **Individual Barber Profiles**: Each barber has their own profile page (`/barber/:id`) featuring:
  - Full bio and experience
  - Specialties and skills
  - Personal work gallery
  - Individual pricing/services
  - "Book with [Name]" call-to-action
- **Per-Barber Data**: Availability, services, and gallery are unique to each barber

### Updated Booking Flow
1. Select a barber (or arrive from barber profile with barber pre-selected)
2. Choose date/time from that barber's availability
3. Select service from that barber's service list
4. Enter contact information
5. Confirm booking

### Admin Enhancements
- **Add New Barber**: Create new barber accounts (username + password)
- New barbers log in and complete their own profile, services, availability, and gallery
- Each barber manages their own dashboard

## Key Features

### User Features

- **Authentication**: Secure user registration and login system
- **Browse Barbers**: View all available barbers and their specialties
- **Appointment Management**:
  - Book appointments with a specific barber
  - View upcoming and past appointments
  - Reschedule or cancel existing appointments
  - Receive status updates on appointments
- **Reviews & Feedback**:
  - Submit reviews for completed services
  - View other customers' reviews
  - Edit or remove own reviews

### Barber Features

- **Profile Management**:
  - Edit personal bio and experience
  - Showcase specialties
- **Appointment Control**:
  - View and manage personal appointments
  - Accept or reject appointment requests
  - Handle reschedule requests
  - Mark appointments as completed
- **Schedule Management**:
  - Set daily availability
  - Block off dates/times
  - Manage working hours
- **Service Management**:
  - Add/edit available services
  - Set pricing and duration
  - Enable/disable services
- **Gallery Management**:
  - Upload work samples
  - Manage portfolio images
  - Showcase haircut styles

### Additional Features

- Real-time availability updates
- Responsive design for mobile and desktop
- Intuitive booking interface
- User-friendly dashboard interfaces

## Technology Stack

### Frontend

- React 18 with TypeScript
- Vite for build tooling
- State Management:
  - Zustand for global state
  - TanStack Query (React Query) for server state
- Routing: React Router DOM
- UI Components:
  - FullCalendar for scheduling
  - React Select for enhanced dropdowns
  - React Icons
- Styling: SASS/SCSS
- HTTP Client: Axios
- Date Management:
  - Date-fns
  - Day.js

### Backend

- Node.js with Express
- MongoDB with Mongoose ODM
- Authentication:
  - JWT (jsonwebtoken)
  - bcryptjs for password hashing
- Image Upload:
  - Cloudinary
  - Multer
- Validation: Express Validator
- Development Tools:
  - Morgan for logging
  - CORS for cross-origin requests
  - dotenv for environment variables

## Development Roadmap

### Phase 1: Frontend UI (Current)
- [ ] Barber listing page with dummy data
- [ ] Individual barber profile page with dummy data
- [ ] Updated routing structure

### Phase 2: Backend API
- [ ] List all barbers endpoint
- [ ] Get barber by ID endpoint
- [ ] Per-barber availability, services, and gallery endpoints
- [ ] Admin: Add new barber endpoint

### Phase 3: Integration
- [ ] Connect frontend to new backend endpoints
- [ ] Per-barber booking flow
- [ ] Barber-specific dashboards

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB
- Git

### Installation

1. Clone the repository:

```bash
git clone https://github.com/eric-capiz/chop_shop.git
cd chop_shop
```

2. Install dependencies for both frontend and backend:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables:

   - Create a `.env` file in the backend directory
   - Create a `.env` file in the frontend directory
   - Add necessary environment variables (see `.env.example` files for reference)

4. Start the development servers:

```bash
# Start backend server (from backend directory)
npm run dev

# Start frontend server (from frontend directory)
npm run dev
```

The application should now be running at:

- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
