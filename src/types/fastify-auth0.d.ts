import "fastify";

declare module "fastify" {
  interface FastifyRequest {
    auth0Id: string;
    permissions: string[];
  }

  interface FastifyInstance {
    authenticate(): Promise<void>;
    requirePermission(permission: string): () => Promise<void>;
  }
}
