import { FastifyRequest, FastifyReply } from "fastify";
import { registerSchema } from "../../utils/schema";
import { registerService } from "../../services/auth/register.service";

export async function registerController(
  req: FastifyRequest,
  rep: FastifyReply,
) {
  const parsed = registerSchema.safeParse(req.body);

  if (!parsed.success) {
    return rep.status(400).send({
      success: false,
      message: "Invalid request",
    });
  }

  const data = parsed.data;

  const user = await registerService(data);

  return rep.status(201).send({ success: true, data: user });
}
