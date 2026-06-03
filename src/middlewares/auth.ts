import type { FastifyRequest, FastifyReply } from "fastify";

export async function authenticate(req: FastifyRequest, reply: FastifyReply) {
  try {
    await req.jwtVerify();
  } catch (err) {
    reply.status(401).send({ error: "Unauthorized" });
  }
}
export function requirePermission(...permissions: string[]) {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    // 💡 Pull permissions from req.user since that's where your plugin puts them
    const userObject = (req as any).user || {};

    let userPermissions: string[] = userObject.permissions || [];

    // Fallback: Check if scopes exist as a fallback string
    if (userObject.scope) {
      userPermissions = [...userPermissions, ...userObject.scope.split(" ")];
    }

    // Check if the user has all the required permissions
    const hasAll = permissions.every((p) => userPermissions.includes(p));

    if (!hasAll) {
      throw Object.assign(new Error("Forbidden"), { statusCode: 403 });
    }
  };
}
