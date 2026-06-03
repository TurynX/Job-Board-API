import { FastifyReply, FastifyRequest } from "fastify";

import { getJobByIdService } from "../../services/jobs/getJobById.service";

export async function getJobByIdController(
  req: FastifyRequest<{ Params: { id: string } }>,
  rep: FastifyReply,
) {
  const { id } = req.params;

  const job = await getJobByIdService(id);

  return rep.status(200).send({
    success: true,
    job,
  });
}
