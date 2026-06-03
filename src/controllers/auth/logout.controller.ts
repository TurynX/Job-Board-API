import { FastifyRequest, FastifyReply } from "fastify";
import { logoutService } from "../../services/auth/logout.service";

export async function logoutController(req: FastifyRequest, rep: FastifyReply) {
  const user = req.user.sub;
  const body = req.body as {
    refreshToken: string;
  };

  if (!user || !body.refreshToken) {
    return rep.status(401).send({ message: "Unauthorized" });
  }

  await logoutService(body.refreshToken);

  return rep.status(200).send({
    success: true,
    message: "Logged out successfully",
  });
}
