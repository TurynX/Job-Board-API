import { FastifyReply, FastifyRequest } from "fastify";
import { approveCompanyService } from "../../services/jobs/approveCompany.service";

export async function approveCompanyController(
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

  const company = await approveCompanyService(id, auth0Id);
  return rep.status(200).send({
    success: true,
    message: "Company approved successfully",
    company,
  });
}
