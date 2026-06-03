import { FastifyReply, FastifyRequest } from "fastify";
import { getJobsService } from "../../services/jobs/getJobs.service";

export async function getJobsController(
  _req: FastifyRequest,
  rep: FastifyReply,
) {
  const jobs = await getJobsService();

  return rep.status(200).send({
    success: true,
    message: "Jobs fetched successfully",
    jobs,
  });
}
