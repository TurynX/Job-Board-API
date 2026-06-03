<div align="center">

```
   ██╗ ██████╗ ██████╗     ██████╗  ██████╗  █████╗ ██████╗ ██████╗
   ██║██╔═══██╗██╔══██╗    ██╔══██╗██╔═══██╗██╔══██╗██╔══██╗██╔══██╗
   ██║██║   ██║██████╔╝    ██████╔╝██║   ██║███████║██████╔╝██║  ██║
██ ██║██║   ██║██╔══██╗    ██╔══██╗██║   ██║██╔══██║██╔══██╗██║  ██║
╚█████╔╝╚██████╔╝██████╔╝    ██████╔╝╚██████╔╝██║  ██║██║  ██║██████╔╝
 ╚════╝  ╚═════╝ ╚═════╝     ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝
```

### A production-ready REST API for a job board platform

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Fastify](https://img.shields.io/badge/Fastify-4.x-000000?style=flat-square&logo=fastify&logoColor=white)](https://fastify.dev/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Vitest](https://img.shields.io/badge/Vitest-tested-6E9F18?style=flat-square&logo=vitest&logoColor=white)](https://vitest.dev/)

</div>

---

## 📌 Overview

**Job Board API** is a full-featured backend for a job marketplace. Companies
can post jobs, candidates can apply, and admins can manage the platform — all
secured with JWT authentication and role-based permissions.

---

## ✨ Features

| Feature                  | Description                                                         |
| ------------------------ | ------------------------------------------------------------------- |
| 🔐 **Authentication**    | Register, Login, Logout with JWT access + refresh tokens            |
| 👥 **Role-based Access** | `CANDIDATE`, `COMPANY`, and `ADMIN` roles with granular permissions |
| 💼 **Job Management**    | Full CRUD for job listings                                          |
| 📋 **Applications**      | Apply for jobs, track and update application status                 |
| 🛡️ **Security**          | Helmet, CORS, Rate Limiting                                         |
| 📄 **Documentation**     | Interactive Swagger UI                                              |
| ✅ **Tests**             | Integration tests with Vitest                                       |

---

## 🛠️ Tech Stack

```
Runtime     → Node.js + TypeScript
Framework   → Fastify
ORM         → Prisma
Database    → PostgreSQL
Auth        → JWT (access + refresh tokens)
Validation  → Zod
Testing     → Vitest
Docs        → Swagger / OpenAPI
Security    → Helmet · CORS · Rate Limit
```

---

## 📁 Project Structure

```
src/
├── controllers/
│   ├── auth/               # register · login · logout · refresh
│   └── jobs/               # jobs · applications · admin
├── services/
│   ├── auth/               # auth business logic
│   └── jobs/               # jobs business logic
├── middlewares/            # authenticate · requirePermission
├── plugins/                # security · auth0
├── routes/                 # route definitions
├── types/                  # TypeScript types
├── utils/                  # helpers
├── lib/                    # prisma client
└── env.ts                  # environment validation
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js `18+`
- PostgreSQL
- npm

### Installation

```bash
# Clone
git clone https://github.com/TurynX/Job-Board-API.git
cd Job-Board-API

# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Push database schema
npx prisma db push

# Start dev server
npm run dev
```

Server runs at `https://localhost:3333` Swagger docs at
`https://localhost:3333/docs`

---

## ⚙️ Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/jobboard"

# JWT
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret

# Auth0
AUTH0_DOMAIN=your-domain.us.auth0.com
AUTH0_AUDIENCE=https://your-api/
AUTH0_CLIENT_ID=your_client_id
AUTH0_CLIENT_SECRET=your_client_secret
AUTH0_M2M_CLIENT_ID=your_m2m_client_id
AUTH0_M2M_CLIENT_SECRET=your_m2m_client_secret
AUTH0_MANAGEMENT_AUDIENCE=https://your-domain.us.auth0.com/api/v2/

# App
COOKIE_SECRET=your_cookie_secret
FRONTEND_URL=https://localhost:3333
```

---

## 📚 API Reference

### Auth

```
POST   /api/auth/register     Register a new user
POST   /api/auth/login        Login
POST   /api/auth/logout       Logout              🔒
POST   /api/auth/refresh      Refresh access token
```

### Jobs

```
GET    /api/jobs              List all jobs
GET    /api/jobs/:id          Get job by ID
POST   /api/jobs              Create a job        🔒 COMPANY
PUT    /api/jobs/:id          Update a job        🔒 COMPANY
DELETE /api/jobs/:id          Delete a job        🔒 COMPANY
POST   /api/jobs/:id/apply    Apply for a job     🔒 CANDIDATE
```

### Applications

```
GET    /api/applications      List applications   🔒 COMPANY
PUT    /api/applications/:id  Update status       🔒 COMPANY
```

### Admin

```
GET    /api/admin/stats                     Platform stats      🔒 ADMIN
PUT    /api/admin/companies/:id/approve     Approve company     🔒 ADMIN
```

---

## 👥 Roles & Permissions

```
                        CANDIDATE   COMPANY   ADMIN
jobs:read                  ✅         ✅        ✅
jobs:apply                 ✅         ❌        ✅
jobs:create                ❌         ✅        ✅
jobs:update                ❌         ✅        ✅
jobs:delete                ❌         ✅        ✅
applications:read          ❌         ✅        ✅
applications:update        ❌         ✅        ✅
admin:all                  ❌         ❌        ✅
```

---

## 📝 Request Examples

<details>
<summary><b>Register as Candidate</b></summary>

```json
POST /api/auth/register
{
  "role": "CANDIDATE",
  "email": "john@example.com",
  "password": "StrongPass123!"
}
```

</details>

<details>
<summary><b>Register as Company</b></summary>

```json
POST /api/auth/register
{
  "role": "COMPANY",
  "email": "hr@techcorp.com",
  "password": "StrongPass123!",
  "companyName": "Tech Corp",
  "companyWebsite": "https://techcorp.com",
  "companyDescription": "We build great software"
}
```

</details>

<details>
<summary><b>Create a Job</b></summary>

```json
POST /api/jobs
Authorization: Bearer <token>

{
  "title": "Senior Backend Developer",
  "description": "Looking for a backend expert with Node.js experience",
  "location": "Remote",
  "salary": 5000,
  "category": "Engineering",
  "experienceLevel": "Senior"
}
```

</details>

<details>
<summary><b>Apply for a Job</b></summary>

```json
POST /api/jobs/:id/apply
Authorization: Bearer <token>

{
  "cvUrl": "https://example.com/my-cv.pdf"
}
```

</details>

---

## 🧪 Tests

```bash
npm run test              # run all tests
npm run test:register     # auth register tests
npm run test:login        # auth login tests
npm run test:create       # create product tests
npm run test:delete       # delete product tests
```

---

## 🔒 Security

- **Helmet** — HTTP security headers
- **CORS** — cross-origin resource sharing
- **Rate Limiting** — 5 req/min on auth routes
- **JWT** — stateless authentication with refresh token rotation
- **Bcrypt** — password hashing
- **Zod** — request validation

---

## 📄 License

MIT — free to use for learning or as a base project.

---

<div align="center">

Made with ❤️ by **Victor**

</div>
