import { FastifyInstance } from "fastify";
import { authenticate, requirePermission } from "../middlewares/auth";

//Auth
import { registerController } from "../controllers/auth/register.controller";
import { loginController } from "../controllers/auth/login.controller";
import { logoutController } from "../controllers/auth/logout.controller";

//Job
import { getJobByIdController } from "../controllers/jobs/getJobById.controller";
import { getJobsController } from "../controllers/jobs/getJobs.controller";
import { createJobController } from "../controllers/jobs/createJob.controller";
import { updateJobController } from "../controllers/jobs/updateJob.controller";
import { deleteJobController } from "../controllers/jobs/deleteJob.controller";
import { applyJobController } from "../controllers/jobs/applyJob.controller";

//Applications
import { getApplicationsController } from "../controllers/jobs/getApplications.controller";
import { updateApplicationStatusController } from "../controllers/jobs/updateApplicationStatus.controller";

//Admin
import { adminStatsController } from "../controllers/jobs/adminStats.controller";
import { approveCompanyController } from "../controllers/jobs/approveCompany.controller";

export async function appRoutes(app: FastifyInstance) {
  // Auth
  app.post(
    "/auth/register",
    {
      config: { rateLimit: { max: 5, timeWindow: "1m" } },
      schema: {
        summary: "Register a new user",
        tags: ["Auth"],
        body: {
          type: "object",
          required: ["role", "email", "password"],
          properties: {
            role: { type: "string", enum: ["CANDIDATE", "COMPANY", "ADMIN"] },
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 8 },
            companyName: { type: "string", minLength: 3, maxLength: 100 },
            companyWebsite: {
              type: "string",
              format: "uri",
              examples: ["https://cv-stack.vercel.app"],
            },
            companyDescription: {
              type: "string",
              minLength: 3,
              maxLength: 500,
            },
          },
        },
        response: {
          201: {
            type: "object",
            properties: {
              success: { type: "boolean" },
            },
          },
        },
      },
    },
    registerController,
  );

  app.post(
    "/auth/login",
    {
      config: { rateLimit: { max: 5, timeWindow: "1m" } },
      schema: {
        summary: "Login a user",
        tags: ["Auth"],
        body: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 8 },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              user: {
                type: "object",
                properties: {
                  accessToken: { type: "string" },
                  refreshToken: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
    loginController,
  );

  app.post(
    "/auth/logout",
    {
      preHandler: [authenticate],
      schema: {
        summary: "Logout a user",
        tags: ["Auth"],
        security: [{ bearerAuth: [] }],
        body: {
          type: "object",
          required: ["refreshToken"],
          properties: {
            refreshToken: { type: "string" },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
        },
      },
    },
    logoutController,
  );

  // Jobs
  app.get(
    "/jobs",
    {
      schema: {
        summary: "Get all jobs",
        tags: ["Jobs"],
      },
    },
    getJobsController,
  );

  app.get(
    "/jobs/:id",
    {
      schema: {
        summary: "Get job by ID",
        tags: ["Jobs"],
        params: {
          type: "object",
          properties: { id: { type: "string" } },
        },
      },
    },
    getJobByIdController,
  );

  app.post(
    "/jobs",
    {
      preHandler: [authenticate, requirePermission("jobs:create")],
      schema: {
        summary: "Create a job",
        tags: ["Jobs"],
        security: [{ bearerAuth: [] }],
        body: {
          type: "object",
          required: [
            "title",
            "description",
            "location",
            "salary",
            "category",
            "experienceLevel",
          ],
          properties: {
            title: { type: "string", minLength: 3, maxLength: 100 },
            description: { type: "string", minLength: 3, maxLength: 100 },
            location: { type: "string", minLength: 3, maxLength: 100 },
            salary: { type: "number", minimum: 0 },
            category: { type: "string", minLength: 3, maxLength: 100 },
            experienceLevel: { type: "string", minLength: 3, maxLength: 100 },
          },
        },
      },
    },
    createJobController,
  );

  app.put(
    "/jobs/:id",
    {
      preHandler: [authenticate, requirePermission("jobs:update")],
      schema: {
        summary: "Update a job",
        tags: ["Jobs"],
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          properties: { id: { type: "string" } },
        },
        body: {
          type: "object",
          properties: {
            title: { type: "string", minLength: 3, maxLength: 100 },
            description: { type: "string", minLength: 3, maxLength: 100 },
            location: { type: "string", minLength: 3, maxLength: 100 },
            salary: { type: "number", minimum: 0 },
            category: { type: "string", minLength: 3, maxLength: 100 },
            experienceLevel: { type: "string", minLength: 3, maxLength: 100 },
            status: { type: "string", enum: ["OPEN", "CLOSED"] },
          },
        },
      },
    },
    updateJobController,
  );

  app.delete(
    "/jobs/:id",
    {
      preHandler: [authenticate, requirePermission("jobs:delete")],
      schema: {
        summary: "Delete a job",
        tags: ["Jobs"],
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          properties: { id: { type: "string" } },
        },
      },
    },
    deleteJobController,
  );

  app.post(
    "/jobs/:id/apply",
    {
      preHandler: [authenticate, requirePermission("jobs:apply")],
      schema: {
        summary: "Apply for a job",
        tags: ["Jobs"],
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          properties: { id: { type: "string" } },
        },
        body: {
          type: "object",
          required: ["cvUrl"],
          properties: {
            cvUrl: { type: "string", format: "uri" },
          },
        },
      },
    },
    applyJobController,
  );

  // Applications
  app.get(
    "/applications",
    {
      preHandler: [authenticate, requirePermission("applications:read")],
      schema: {
        summary: "Get all applications",
        tags: ["Applications"],
        security: [{ bearerAuth: [] }],
      },
    },
    getApplicationsController,
  );

  app.put(
    "/applications/:id",
    {
      preHandler: [authenticate, requirePermission("applications:update")],
      schema: {
        summary: "Update application status",
        tags: ["Applications"],
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          properties: { id: { type: "string" } },
        },
        body: {
          type: "object",
          required: ["status"],
          properties: {
            status: {
              type: "string",
              enum: ["PENDING", "ACCEPTED", "REJECTED"],
            },
          },
        },
      },
    },
    updateApplicationStatusController,
  );

  // Admin
  app.get(
    "/admin/stats",
    {
      preHandler: [authenticate, requirePermission("admin:all")],
      schema: {
        summary: "Get admin stats",
        tags: ["Admin"],
        security: [{ bearerAuth: [] }],
      },
    },
    adminStatsController,
  );

  app.put(
    "/admin/companies/:id/approve",
    {
      preHandler: [authenticate, requirePermission("admin:all")],
      schema: {
        summary: "Approve a company",
        tags: ["Admin"],
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          properties: { id: { type: "string" } },
        },
      },
    },
    approveCompanyController,
  );
}
