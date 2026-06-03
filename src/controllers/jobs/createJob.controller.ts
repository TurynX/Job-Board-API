import { FastifyReply, FastifyRequest } from "fastify";
import { createJobService } from "../../services/jobs/createJob.service";
import { jobSchema } from "../../utils/schema";

export async function createJobController(
  req: FastifyRequest,
  rep: FastifyReply,
) {
  const auth0Id = req.user.sub;

  const result = jobSchema.safeParse(req.body);

  if (!result.success) {
    return rep.status(400).send({
      success: false,
      message: result.error.format(),
    });
  }

  const jobData = result.data;
  const job = await createJobService(auth0Id, jobData);

  return rep.status(201).send({
    success: true,
    message: "Job created successfully",
    job,
  });
}
