import { FastifyRequest, FastifyReply } from "fastify";
import { verifyToken, getTokenFromHeader, JwtPayload } from "../utils/jwt";


declare module "fastify" {
  interface FastifyRequest {
    user?: JwtPayload;
  }
}


export async function authenticate(
  req: FastifyRequest,
  rep: FastifyReply
): Promise<void> {
  try {
    const token = getTokenFromHeader(req.headers.authorization);

    if (!token) {
      return rep.status(401).send({
        success: false,
        message: "No token provided",
      });
    }

    const decoded = verifyToken(token);
    req.user = decoded;
  } catch (error) {
    return rep.status(401).send({
      success: false,
      message: error instanceof Error ? error.message : "Authentication failed",
    });
  }
}
