import { FastifyRequest, FastifyReply } from "fastify";
import {
  adminStatsService,
  applyJobService,
  approveCompanyService,
  createJobService,
  deleteJobService,
  getApplicationsService,
  getJobByIdService,
  getJobsService,
  updateApplicationService,
  updateJobService,
} from "../services/jobs.service";
import {
  applyJobSchema,
  jobSchema,
  updateApplicationSchema,
  updateJobSchema,
} from "../utils/schema";
import {
  AlreadyAppliedError,
  ApplicationNotFoundError,
  CandidateOnlyError,
  CompanyNotApprovedError,
  CompanyNotFoundError,
  CompanyOnlyError,
  JobNotFoundError,
  NotAdminError,
  NotOwnerError,
} from "../utils/error";

export async function getJobsController(
  req: FastifyRequest,
  rep: FastifyReply,
) {
  const jobs = await getJobsService();

  return rep.status(200).send({
    success: true,
    message: "Jobs fetched successfully",
    jobs,
  });
}
export async function getJobByIdController(
  req: FastifyRequest<{ Params: { id: string } }>,
  rep: FastifyReply,
) {
  try {
    const { id } = req.params;

    const job = await getJobByIdService(id);

    return rep.status(200).send({
      success: true,
      job,
    });
  } catch (error) {
    if (error instanceof JobNotFoundError) {
      return rep.status(404).send({
        success: false,
        message: "Job not found",
      });
    }

    return rep.status(500).send({
      success: false,
      message: "Failed to fetch job",
    });
  }
}

export async function createJobController(
  req: FastifyRequest,
  rep: FastifyReply,
) {
  try {
    const userId = req.user!.userId;

    const result = jobSchema.safeParse(req.body);

    if (!result.success) {
      return rep.status(400).send({
        success: false,
        message: "Invalid request",
        error: result.error.issues[0].message,
      });
    }

    const jobData = result.data;
    const job = await createJobService(userId, jobData);

    return rep.status(201).send({
      success: true,
      message: "Job created successfully",
      job,
    });
  } catch (error) {
    if (error instanceof CompanyNotFoundError) {
      return rep.status(404).send({
        success: false,
        message: "Company not found",
      });
    }
    if (error instanceof CompanyNotApprovedError) {
      return rep.status(404).send({
        success: false,
        message: "Company not approved",
      });
    }

    return rep.status(500).send({
      success: false,
      message: "Failed to create job",
    });
  }
}

export async function updateJobController(
  req: FastifyRequest,
  rep: FastifyReply,
) {
  try {
    const { id } = req.params as { id: string };
    const userId = req.user!.userId;

    if (!userId) {
      return rep.status(401).send({
        success: false,
        message: "Unauthorized",
      });
    }

    const result = updateJobSchema.safeParse(req.body);

    if (!result.success) {
      return rep.status(400).send({
        success: false,
        message: "Invalid request",
        error: result.error.issues[0].message,
      });
    }

    const jobData = result.data;

    const job = await updateJobService(id, userId, jobData);
    return rep.status(200).send({
      success: true,
      message: "Job updated successfully",
      job,
    });
  } catch (error) {
    if (error instanceof JobNotFoundError) {
      return rep.status(404).send({
        success: false,
        message: "Job not found",
      });
    }

    if (error instanceof CompanyNotFoundError) {
      return rep.status(404).send({
        success: false,
        message: "Company not found",
      });
    }

    if (error instanceof NotOwnerError) {
      return rep.status(404).send({
        success: false,
        message: "Not owner",
      });
    }
    return rep.status(500).send({
      success: false,
      message: "Failed to update job",
    });
  }
}

export async function deleteJobController(
  req: FastifyRequest,
  rep: FastifyReply,
) {
  try {
    const { id } = req.params as { id: string };

    const userId = req.user!.userId;

    if (!userId) {
      return rep.status(401).send({
        success: false,
        message: "Unauthorized",
      });
    }

    const job = await deleteJobService(id, userId);

    return rep.status(200).send({
      success: true,
      message: "Job deleted successfully",
      job,
    });
  } catch (error) {
    if (error instanceof JobNotFoundError) {
      return rep.status(404).send({
        success: false,
        message: "Job not found",
      });
    }

    if (error instanceof NotOwnerError) {
      return rep.status(404).send({
        success: false,
        message: "Not owner",
      });
    }

    if (error instanceof NotOwnerError) {
      return rep.status(404).send({
        success: false,
        message: "Not owner",
      });
    }
    return rep.status(500).send({
      success: false,
      message: "Failed to delete job",
    });
  }
}

export async function applyJobController(
  req: FastifyRequest,
  rep: FastifyReply,
) {
  try {
    const { id } = req.params as { id: string };
    const userId = req.user!.userId;
    console.log("BODY RECEBIDO:", req.body);

    const result = applyJobSchema.safeParse(req.body);

    if (!result.success) {
      return rep.status(400).send({
        success: false,
        message: "Invalid request",
        error: result.error.issues[0].message,
      });
    }

    const jobData = result.data;

    if (!userId) {
      return rep.status(401).send({
        success: false,
        message: "Unauthorized",
      });
    }

    const job = await applyJobService(id, userId, jobData);
    return rep.status(201).send({
      success: true,
      message: "Job applied successfully",
      job,
    });
  } catch (error) {
    if (error instanceof JobNotFoundError) {
      return rep.status(404).send({
        success: false,
        message: "Job not found",
      });
    }

    if (error instanceof CandidateOnlyError) {
      return rep.status(403).send({
        success: false,
        message: "Candidate only",
      });
    }
    if (error instanceof AlreadyAppliedError) {
      return rep.status(409).send({
        success: false,
        message: "Already applied",
      });
    }

    return rep.status(500).send({
      success: false,
      message: "Failed to apply job",
    });
  }
}

export async function getApplicationsController(
  req: FastifyRequest,
  rep: FastifyReply,
) {
  const userId = req.user!.userId;

  if (!userId) {
    return rep.status(401).send({
      success: false,
      message: "Unauthorized",
    });
  }

  const applications = await getApplicationsService(userId);

  return rep.status(200).send({
    success: true,
    message: "Applications fetched successfully",
    applications,
  });
}

export async function updateApplicationController(
  req: FastifyRequest,
  rep: FastifyReply,
) {
  try {
    const { id } = req.params as { id: string };
    const userId = req.user!.userId;

    if (!userId) {
      return rep.status(401).send({
        success: false,
        message: "Unauthorized",
      });
    }

    const result = updateApplicationSchema.safeParse(req.body);

    if (!result.success) {
      return rep.status(400).send({
        success: false,
        message: "Invalid request",
        error: result.error.issues[0].message,
      });
    }

    const status = result.data.status;

    const application = await updateApplicationService(id, userId, status);
    return rep.status(200).send({
      success: true,
      message: "Application updated successfully",
      application,
    });
  } catch (error) {
    if (error instanceof ApplicationNotFoundError) {
      return rep.status(404).send({
        success: false,
        message: "Application not found",
      });
    }

    if (error instanceof NotOwnerError) {
      return rep.status(404).send({
        success: false,
        message: "Not owner",
      });
    }

    if (error instanceof CompanyOnlyError) {
      return rep.status(404).send({
        success: false,
        message: "Company only",
      });
    }

    return rep.status(500).send({
      success: false,
      message: "Failed to update application",
    });
  }
}

export async function adminStatsController(
  req: FastifyRequest,
  rep: FastifyReply,
) {
  const userId = req.user!.userId;

  if (!userId) {
    return rep.status(401).send({
      success: false,
      message: "Unauthorized",
    });
  }

  const stats = await adminStatsService(userId);

  if (stats instanceof NotAdminError) {
    return rep.status(403).send({
      success: false,
      message: "Not admin",
    });
  }
  return rep.status(200).send({
    success: true,
    message: "Stats fetched successfully",
    stats,
  });
}

export async function approveCompanyController(
  req: FastifyRequest,
  rep: FastifyReply,
) {
  const { id } = req.params as { id: string };
  const userId = req.user!.userId;

  if (!userId) {
    return rep.status(401).send({
      success: false,
      message: "Unauthorized",
    });
  }

  const company = await approveCompanyService(id, userId);
  return rep.status(200).send({
    success: true,
    message: "Company approved successfully",
    company,
  });
}
