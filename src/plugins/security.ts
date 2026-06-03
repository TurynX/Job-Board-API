import { FastifyInstance } from "fastify";
import rateLimit from "@fastify/rate-limit";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import { env } from "../env";

export async function securityPlugin(app: FastifyInstance) {
  await app.register(rateLimit, {
    global: false,
    max: 100,
    timeWindow: 60 * 60 * 1000,
  });

  await app.register(cors, {
    origin: env.FRONTEND_URL,
    credentials: true,
  });

  await app.register(helmet);
}
