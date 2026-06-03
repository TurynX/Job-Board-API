import { FastifyRequest, FastifyReply } from "fastify";
import { getApplicationsService } from "../../services/jobs/getApplications.service";

export async function getApplicationsController(
  req: FastifyRequest,
  rep: FastifyReply,
) {
  const auth0Id = req.user.sub;

  if (!auth0Id) {
    return rep.status(401).send({
      success: false,
      message: "Unauthorized",
    });
  }

  const applications = await getApplicationsService(auth0Id);

  return rep.status(200).send({
    success: true,
    message: "Applications fetched successfully",
    applications,
  });
}
