import { FastifyRequest, FastifyReply } from "fastify";
import { authSchema } from "../../utils/schema";
import { loginService } from "../../services/auth/login.service";

export async function loginController(req: FastifyRequest, rep: FastifyReply) {
  const parsed = authSchema.safeParse(req.body);

  if (!parsed.success) {
    return rep.status(400).send({
      success: false,
      message: "Invalid request",
    });
  }

  const { email, password } = parsed.data;

  const user = await loginService(email, password);
  console.log(user);

  return rep.status(200).send({
    success: true,
    user,
  });
}
