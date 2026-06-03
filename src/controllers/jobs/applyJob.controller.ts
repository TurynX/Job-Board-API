import { FastifyReply, FastifyRequest } from "fastify";
import { applyJobService } from "../../services/jobs/applyJob.service";
import { applyJobSchema } from "../../utils/schema";

export async function applyJobController(
  req: FastifyRequest,
  rep: FastifyReply,
) {
  const { id } = req.params as { id: string };
  const auth0Id = req.user.sub;

  const result = applyJobSchema.safeParse(req.body);

  if (!result.success) {
    return rep.status(400).send({
      success: false,
      message: "Invalid request",
      error: result.error.format(),
    });
  }

  const jobData = result.data;

  if (!auth0Id) {
    return rep.status(401).send({
      success: false,
      message: "Unauthorized",
    });
  }

  const job = await applyJobService(id, auth0Id, jobData);
  return rep.status(201).send({
    success: true,
    message: "Job applied successfully",
    job,
  });
}
