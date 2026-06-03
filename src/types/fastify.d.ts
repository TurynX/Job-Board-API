import "fastify";

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (req: FastifyRequest, rep: FastifyReply) => Promise<void>;

    requireRole: (
      ...roles: Array<"CANDIDATE" | "COMPANY" | "ADMIN">
    ) => (req: FastifyRequest, rep: FastifyReply) => Promise<void>;

    requirePermission: (
      ...permissions: string[]
    ) => (req: FastifyRequest, rep: FastifyReply) => Promise<void>;
  }

  interface FastifyRequest {
    userId?: string;
    auth0Id?: string;
    userRole?: "CANDIDATE" | "COMPANY" | "ADMIN";
    permissions?: string[];
  }
}
