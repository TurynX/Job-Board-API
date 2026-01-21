Job Board API

A backend service for a Job Board platform built with Fastify and TypeScript.
Designed to handle real-world recruitment workflows with secure authentication, role-based access control, and administrative moderation.

Overview

This project implements the backend of a job board system where companies can publish job opportunities, candidates can apply to them, and administrators ensure platform integrity.

The main focus is backend architecture, security, and business logic rather than frontend concerns.

Key Features

JWT-based authentication

Role-based access control (RBAC)

Company approval workflow managed by administrators

Job posting and management for approved companies

Candidate application lifecycle with status tracking

Admin moderation and system statistics

Clean and scalable backend architecture

Roles
Candidate

Browse job listings

Apply for open positions

Company

Create and manage job postings

Requires admin approval

Admin

Approve company accounts

Moderate job postings

Monitor system statistics

Application Workflow

User registers as Candidate or Company

Company accounts require admin approval

Approved companies create job postings

Candidates apply to open positions

Companies review and manage applications

Admin oversees platform activity

Tech Stack

Node.js

Fastify

TypeScript

PostgreSQL

Prisma ORM

JWT Authentication

Getting Started
Requirements

Node.js v18+

PostgreSQL

Installation
git clone https://github.com/your-username/job-board-api.git
cd job-board-api
npm install

Environment Variables

Create a .env file in the project root:

DATABASE_URL=postgresql://user:password@localhost:5432/jobboard
JWT_SECRET=your_secret_key

Database Setup
npx prisma migrate dev

Run the Application
npm run dev

Project Goals

Apply real-world backend business rules

Practice clean architecture and code organization

Implement secure authentication and authorization

Serve as a portfolio-ready backend project
