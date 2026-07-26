# Holiday & Travel — Backend API

A REST API for a holiday and travel booking platform, built with **Node.js**, **Express**, and **MongoDB** (Mongoose). It handles tour packages, destinations, user accounts and authentication, customer inquiries, and online payments via Razorpay.

---

## Features

- **Authentication & Authorization** — JWT-based auth with `bcrypt` password hashing, HTTP-only cookies, OTP verification, password reset via email, and role-based access control (`admin` / `user`).
- **Packages** — full CRUD for tour packages, plus package statistics and monthly-plan aggregation endpoints.
- **Destinations** — look up destination details by slug.
- **Inquiries** — public endpoint for submitting travel inquiries.
- **Payments** — Razorpay order creation and order management.
- **Email** — transactional email via Nodemailer (with Zoho auth support).
- **Security** — Helmet, rate limiting, CORS allow-list, NoSQL-injection sanitization, XSS cleaning, and HTTP parameter pollution protection.
- **Clean architecture** — centralized error handling (`AppError` + global error middleware), an async wrapper (`catchAsync`), and a reusable query layer (`APIFeatures`) for filtering, sorting, field limiting, and pagination.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Framework | Express |
| Database | MongoDB with Mongoose |
| Auth | JSON Web Tokens (jsonwebtoken), bcryptjs |
| Payments | Razorpay |
| Email | Nodemailer (Zoho) |
| Security | Helmet, express-rate-limit, express-mongo-sanitize, xss-clean, hpp, CORS |
| Tooling | ESLint, Prettier, Nodemon |

---

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- A MongoDB instance (local or MongoDB Atlas)

### Installation
```bash
git clone https://github.com/amit00978/holidayTravelNodeBackend.git
cd holidayTravelNodeBackend
npm install
```

### Environment Variables
Create a `config.env` file in the project root. **Do not commit this file** — it is ignored via `.gitignore`.

```env
NODE_ENV=development
PORT=8000

# Database
DATABASE_URL=mongodb+srv://<user>:<DB_PASSWORD>@cluster.mongodb.net/holidaytravel
DATABASE_PASSWORD=your_db_password

# JWT
JWT_SECRET=your_long_random_secret
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90

# Email (Nodemailer / Zoho)
EMAIL_USERNAME=your_email
EMAIL_PASSWORD=your_email_password
EMAIL_HOST=smtp.zoho.in
EMAIL_PORT=465

# Razorpay
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
```
> Adjust the keys above to match the exact variable names used in your code.

### Run
```bash
# development (with nodemon)
npm run start:dev

# production
npm run start:prod

# plain start
npm start
```

The server runs on the port defined in `PORT` (e.g. `http://localhost:8000`).

To seed sample data:
```bash
node importData.js
```

---

## API Endpoints

Base URL: `/api/v1`

### Users & Auth — `/users`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/users/login` | Public | Log in and receive a JWT |
| POST | `/users/otp` | Public | Send an OTP |
| POST | `/users/verifyOtp` | Public | Verify an OTP |
| GET | `/users/me` | Auth | Get the current user's profile |
| POST | `/users/signup` | Admin | Create a new user |
| PUT | `/users/resetPassword/:token` | Admin | Reset password with token |
| PATCH | `/users/updateMe` | Admin | Update the current user |
| DELETE | `/users/deleteMe` | Admin | Deactivate the current user |
| GET / POST | `/users` | Admin | List all users / create user |
| GET / PATCH / DELETE | `/users/:id` | Admin | Manage a user by ID |

### Packages — `/packages`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/packages` | Public | List all packages (filter/sort/paginate) |
| GET | `/packages/:id` | Public | Get a single package |
| GET | `/packages/package-stats` | Public | Package statistics |
| GET | `/packages/monthly-plan/:year` | Public | Monthly plan for a year |
| POST | `/packages` | Admin | Create a package |
| PATCH / DELETE | `/packages/:id` | Admin | Update / delete a package |

### Destinations — `/destionation`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/destionation/:slug` | Public | Get a destination by slug |

### Inquiries — `/inquiry`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/inquiry` | Public | Submit a travel inquiry |

### Payments — `/razorpay-order` and `/order`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/razorpay-order` | Public | Create a Razorpay order |
| POST | `/order` | Public | Create an order record |

---

## Project Structure
```
src/
├── app.js                # Express app, middleware, route mounting
├── controllers/          # Route handlers (auth, package, order, razorpay, ...)
├── models/               # Mongoose schemas (user, package, booking, order, ...)
├── routes/               # Route definitions
└── utils/                # APIFeatures, AppError, catchAsync, email helpers
server.js                 # Entry point, DB connection, process handlers
```

---

## License
ISC
