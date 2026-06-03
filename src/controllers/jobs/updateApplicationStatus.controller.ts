import { FastifyReply, FastifyRequest } from "fastify";
import { updateApplicationStatusService } from "../../services/jobs/updateApplicationStatus.service";
import { updateApplicationSchema } from "../../utils/schema";

export async function updateApplicationStatusController(
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

  const result = updateApplicationSchema.safeParse(req.body);

  if (!result.success) {
    return rep.status(400).send({
      success: false,
      message: "Invalid request",
      error: result.error.format(),
    });
  }

  const status = result.data.status;

  const application = await updateApplicationStatusService(id, auth0Id, status);
  return rep.status(200).send({
    success: true,
    message: "Application updated successfully",
    application,
  });
}
