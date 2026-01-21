Job Board API

Backend API for a Job Board platform where companies can post job openings, candidates can apply, and administrators moderate and monitor the system.

🚀 Features
Authentication & Authorization

JWT-based authentication

Role-based access control (RBAC)

Roles: CANDIDATE, COMPANY, ADMIN

Company Management

Company profile creation

Admin approval required before posting jobs

Company profile update

Job Management

Create, update, and delete job postings (approved companies only)

Public job listing and job details

Job status control (OPEN, CLOSED)

Job Applications

Candidates can apply to jobs

CV upload support

Prevent duplicate applications

Application status workflow:

APPLIED → REVIEWING → INTERVIEW → OFFER → REJECTED

Admin Panel (API)

Approve or reject companies

Remove job postings

System statistics dashboard (admin stats)

🧱 Tech Stack

Node.js

Fastify

TypeScript

PostgreSQL

Prisma ORM

JWT Authentication

🔐 Roles & Permissions
Action	Role
View jobs	Public
Apply to job	CANDIDATE
Create job	Approved COMPANY
Manage applications	Job owner COMPANY
Approve companies	ADMIN
Remove jobs	ADMIN
View system stats	ADMIN
📌 API Routes Overview
Auth
POST /auth/register
POST /auth/login

Jobs
GET    /jobs
GET    /jobs/:id
POST   /jobs            (COMPANY)
PUT    /jobs/:id        (COMPANY)
DELETE /jobs/:id        (COMPANY)

Applications
POST /jobs/:jobId/apply     (CANDIDATE)
GET  /applications         (CANDIDATE)
PUT  /applications/:id     (COMPANY)

Admin
GET    /admin/stats
PUT    /admin/companies/:id/approve
DELETE /admin/jobs/:id

📊 Admin Stats Example Response
{
  "users": 120,
  "jobs": {
    "total": 45,
    "open": 30
  },
  "applications": 310
}

⚙️ Setup & Installation
git clone https://github.com/your-username/job-board-api.git
cd job-board-api
npm install

Environment Variables

Create a .env file:

DATABASE_URL=postgresql://user:password@localhost:5432/jobboard
JWT_SECRET=your_secret_key

Run Migrations
npx prisma migrate dev

Start the Server
npm run dev
