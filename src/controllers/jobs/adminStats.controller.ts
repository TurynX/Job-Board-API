import { FastifyReply, FastifyRequest } from "fastify";

import { adminStatsService } from "../../services/jobs/adminStats.service";

export async function adminStatsController(
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

  const result = await adminStatsService(auth0Id);

  return rep.status(200).send({
    success: true,
    message: "Stats fetched successfully",
    stats: result,
  });
}
