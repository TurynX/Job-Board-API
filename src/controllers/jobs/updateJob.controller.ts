import { FastifyRequest, FastifyReply } from "fastify";
import { updateJobService } from "../../services/jobs/updateJob.service";
import { updateJobSchema } from "../../utils/schema";

export async function updateJobController(
  req: FastifyRequest,
  rep: FastifyReply,
) {
  const { id } = req.params as { id: string };
  const auth0Id = req.user.sub;

  if (!auth0Id) {
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
      error: result.error.format(),
    });
  }

  const jobData = result.data;

  const job = await updateJobService(id, auth0Id, jobData);
  return rep.status(200).send({
    success: true,
    message: "Job updated successfully",
    job,
  });
}
