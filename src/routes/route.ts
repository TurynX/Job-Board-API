import { FastifyInstance } from "fastify";
import { loginController, registerController } from "../controllers/auth.controller";
import { adminStatsController, applyJobController, approveCompanyController, createJobController, deleteJobController, getApplicationsController, getJobByIdController, getJobsController, updateApplicationController, updateJobController } from "../controllers/jobs.controller";
import { authenticate } from "../middleware/auth.middleware";

export async function appRoutes(app: FastifyInstance) {
  app.post("/auth/register", registerController);
  app.post("/auth/login", loginController);

  app.get("/jobs", getJobsController);
  app.get("/jobs/:id",getJobByIdController);
  app.post("/jobs",{preHandler: authenticate}, createJobController);
  app.put("/jobs/:id",{preHandler: authenticate}, updateJobController);
  app.delete("/jobs/:id",{preHandler: authenticate}, deleteJobController);
  
  app.post("/jobs/:id/apply",{preHandler: authenticate}, applyJobController);
  app.get("/applications", {preHandler: authenticate}, getApplicationsController);
  app.put("/applications/:id", {preHandler: authenticate}, updateApplicationController);

  app.get("/admin/stats", {preHandler: authenticate}, adminStatsController);
  app.put("/admin/companies/:id/approve", {preHandler: authenticate}, approveCompanyController);
  app.delete("/admin/jobs/:id", {preHandler: authenticate}, deleteJobController);
}
