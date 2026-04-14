# MediBook — Backend API

Node.js + Express REST API for the MediBook healthcare platform. Handles authentication, doctor management, appointment scheduling, patient records, and automated jobs.

---

## Tech Stack

| Tool                  | Purpose                                          |
|-----------------------|--------------------------------------------------|
| Node.js >= 18         | Runtime (ES Modules — `import/export`)           |
| Express               | HTTP framework                                   |
| MongoDB + Mongoose    | Database and ODM                                 |
| JWT                   | Access + refresh token authentication            |
| Nodemailer            | OTP and transactional email via Gmail SMTP       |
| bcryptjs              | Password hashing                                 |
| node-cron             | Scheduled background jobs                        |
| Winston               | Structured logging (colorized dev, JSON prod)    |
| Helmet                | HTTP security headers                            |
| express-rate-limit    | API rate limiting                                |

---

## Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 9
- A MongoDB Atlas cluster (or local MongoDB instance)
- A Gmail account with a [16-char App Password](https://myaccount.google.com/apppasswords)

### Install dependencies

```bash
npm install
```

### Environment setup

```bash
cp .env.example .env
```

Open `.env` and fill in every value — see the [Environment Variables](#environment-variables) section below.

### Run the dev server

```bash
npm run dev
```

API is available at `http://localhost:5000/api/v1`.

---

## Available Scripts

| Command         | Description                              |
|-----------------|------------------------------------------|
| `npm run dev`   | Start with nodemon — restarts on change  |
| `npm start`     | Start without watch (production)         |

---

## Project Structure

```
backend/
├── server.js               # Entry point — connectDB() then app.listen()
│
└── src/
    ├── app.js              # Express app — loadMiddlewares → mountRoutes → 404 → errorHandler
    │
    ├── router/             # ── ROUTING LAYER ───────────────────────────────
    │   ├── auth.routes.js          POST /signup /verify-otp /login /logout
    │   ├── doctor.routes.js        GET / GET/:id POST / PUT/:id DELETE/:id
    │   ├── appointment.routes.js   GET / GET/:id POST / PUT/:id PATCH/:id/cancel
    │   ├── patient.routes.js       GET / GET/:id PUT/:id DELETE/:id
    │   └── index.js                mountRoutes(app) — mounts all under /api/v1
    │
    ├── api/                # ── CONTROLLER LAYER (thin — req/res only) ──────
    │   ├── auth/
    │   │   ├── auth.controller.js  signup, verifyOTP, login, logout
    │   │   └── index.js
    │   ├── doctor/
    │   ├── appointment/
    │   ├── patient/
    │   └── index.js                Barrel — exports all controllers
    │
    ├── services/           # ── BUSINESS LOGIC LAYER ────────────────────────
    │   ├── auth/index.js           signup (with OTP), verifyOTP, login, logout
    │   ├── doctor/index.js         paginated list, CRUD
    │   ├── appointment/index.js    filtered + paginated list, book, update, cancel
    │   ├── patient/index.js        paginated list, getById, update, delete
    │   └── index.js                Barrel
    │
    ├── models/             # ── MONGOOSE SCHEMAS ─────────────────────────────
    │   ├── user.model.js           name, email, password (hashed), role, isVerified, otp, refreshToken
    │   ├── doctor.model.js         user (ref), specialization, experience, fee, availableSlots, rating
    │   ├── appointment.model.js    patient (ref), doctor (ref), date, time, status, reason, fee
    │   ├── patient.model.js        user (ref), dob, gender, bloodGroup, medicalHistory, address
    │   └── index.js                Barrel
    │
    ├── middlewares/
    │   ├── auth.middleware.js      protect — verifies JWT, attaches req.user
    │   ├── role.middleware.js      authorize(...roles) — RBAC check
    │   ├── validate.middleware.js  validate(schema) — request body validation
    │   ├── error.middleware.js     normalizeError, notFound, errorHandler
    │   └── index.js                Barrel
    │
    ├── utils/
    │   ├── ApiError.js             Custom error + static factories (.badRequest, .unauthorized …)
    │   ├── ApiResponse.js          Standardised response shape { statusCode, success, message, data }
    │   ├── asyncHandler.js         Express HOF — eliminates try/catch in controllers
    │   ├── jwt.js                  generateAccessToken, generateRefreshToken, verify helpers
    │   ├── sendEmail.js            sendEmail({ to, subject, html }) via Nodemailer
    │   ├── logger.js               Winston — colorized dev / JSON + file prod
    │   └── index.js                Barrel
    │
    ├── constants/
    │   ├── roles.js                ROLES = { ADMIN, DOCTOR, PATIENT }, ROLE_LIST
    │   ├── httpStatus.js           HTTP_STATUS object (200–500)
    │   ├── messages.js             AUTH_MESSAGES, DOCTOR_MESSAGES, APPOINTMENT_MESSAGES …
    │   └── index.js                Barrel
    │
    ├── loaders/
    │   ├── express.js              loadMiddlewares — helmet, cors, rateLimit, morgan, bodyParser
    │   ├── mongoose.js             connectDB()
    │   └── index.js                Barrel
    │
    └── jobs/
        ├── appointment.job.js      startAppointmentJobs — cron: auto-complete past appointments at midnight
        └── index.js                Barrel
```

---

## API Reference

All routes are prefixed with `/api/v1`.

### Auth

| Method | Endpoint            | Access  | Description                          |
|--------|---------------------|---------|--------------------------------------|
| POST   | `/auth/signup`      | Public  | Register — sends OTP to email        |
| POST   | `/auth/verify-otp`  | Public  | Verify OTP, activate account         |
| POST   | `/auth/login`       | Public  | Login, returns access + refresh JWT  |
| POST   | `/auth/logout`      | Private | Invalidate refresh token             |

### Doctors

| Method | Endpoint          | Access         | Description              |
|--------|-------------------|----------------|--------------------------|
| GET    | `/doctors`        | Public         | Paginated doctor list    |
| GET    | `/doctors/:id`    | Public         | Single doctor by ID      |
| POST   | `/doctors`        | Admin          | Create doctor profile    |
| PUT    | `/doctors/:id`    | Admin / Doctor | Update doctor profile    |
| DELETE | `/doctors/:id`    | Admin          | Delete doctor            |

### Appointments

| Method | Endpoint                    | Access            | Description               |
|--------|-----------------------------|-------------------|---------------------------|
| GET    | `/appointments`             | Private           | Filtered, paginated list  |
| GET    | `/appointments/:id`         | Private           | Single appointment        |
| POST   | `/appointments`             | Patient           | Book appointment          |
| PUT    | `/appointments/:id`         | Private           | Update appointment        |
| PATCH  | `/appointments/:id/cancel`  | Private           | Cancel appointment        |

### Patients

| Method | Endpoint         | Access         | Description              |
|--------|------------------|----------------|--------------------------|
| GET    | `/patients`      | Admin / Doctor | Paginated patient list   |
| GET    | `/patients/:id`  | Private        | Single patient           |
| PUT    | `/patients/:id`  | Patient        | Update own profile       |
| DELETE | `/patients/:id`  | Admin          | Delete patient           |

---

## Data Flow

```
Request
  → router/          (route match + RBAC middleware)
  → middlewares/     (protect, authorize, validate)
  → api/             (controller — req/res only, wrapped in asyncHandler)
  → services/        (all business logic lives here)
  → models/          (Mongoose queries)
  ← ApiResponse      (standardised JSON response)

Errors thrown anywhere
  → asyncHandler     (catches and forwards to Express error pipeline)
  → normalizeError   (maps to correct HTTP status + message)
  → errorHandler     (logs + sends JSON error response)
```

---

## Environment Variables

| Variable                  | Required | Description                                          |
|---------------------------|----------|------------------------------------------------------|
| `PORT`                    | Yes      | Port to run the server (default: `5000`)             |
| `NODE_ENV`                | Yes      | `development` or `production`                        |
| `MONGO_URI`               | Yes      | MongoDB Atlas connection string                      |
| `JWT_SECRET`              | Yes      | Secret for signing access tokens (min 32 chars)      |
| `JWT_EXPIRES_IN`          | Yes      | Access token expiry — e.g. `7d`, `1h`               |
| `JWT_REFRESH_SECRET`      | Yes      | Secret for signing refresh tokens (different value)  |
| `JWT_REFRESH_EXPIRES_IN`  | Yes      | Refresh token expiry — e.g. `30d`                   |
| `SMTP_HOST`               | Yes      | SMTP host — `smtp.gmail.com`                         |
| `SMTP_PORT`               | Yes      | SMTP port — `587` (TLS)                              |
| `SMTP_USER`               | Yes      | Gmail address used to send emails                    |
| `SMTP_PASS`               | Yes      | Gmail App Password (16 chars, no spaces)             |
| `EMAIL_FROM`              | Yes      | "From" address in outgoing emails                    |
| `CLIENT_URL`              | Yes      | Frontend origin for CORS (`http://localhost:5173`)   |
| `OTP_EXPIRES_IN_MINUTES`  | No       | OTP validity window in minutes (default: `10`)       |

To generate strong secrets:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## Conventions

- **ES Modules only** — use `import/export`, never `require()`
- **3-layer architecture** — `router → controller → service → model`
- **No logic in controllers** — controllers only call a service and return `ApiResponse`
- **No try/catch in controllers** — wrap every controller in `asyncHandler()`
- **Throw errors as** `ApiError.badRequest()`, `.unauthorized()`, etc. — `normalizeError` handles everything
- **Barrel imports** — always import from the domain's `index.js`, never from deep file paths
- **New domain checklist** — model → service → controller + barrel → routes → mount in `router/index.js` → add messages to `constants/messages.js`

---

## Roles

| Role      | Constant         | Capabilities                                              |
|-----------|------------------|-----------------------------------------------------------|
| `admin`   | `ROLES.ADMIN`    | Full access — manage doctors, patients, appointments      |
| `doctor`  | `ROLES.DOCTOR`   | View patients and appointments, update own profile        |
| `patient` | `ROLES.PATIENT`  | Book and manage own appointments, update own profile      |
