import { FastifyReply, FastifyRequest } from "fastify";
import { deleteJobService } from "../../services/jobs/deleteJob.service";

export async function deleteJobController(
  req: FastifyRequest,
  rep: FastifyReply,
) {
  const { id } = req.params as { id: string };

  const auth0Id = req.user.sub;

  await deleteJobService(id, auth0Id);

  return rep.status(200).send({
    success: true,
    message: "Job deleted successfully",
  });
}
