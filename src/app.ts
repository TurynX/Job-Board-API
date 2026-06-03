import fastify, { FastifyError } from "fastify";
import { appRoutes } from "./routes/route";
import { fastifyStatic } from "@fastify/static";
import path from "path";
import { securityPlugin } from "./plugins/security";
import cookie from "@fastify/cookie";
import fs from "fs";
import auth0Plugin from "./plugins/auth0";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import axios from "axios";

export function buildApp() {
  const app = fastify({
    https: {
      key: fs.readFileSync(path.join(__dirname, "../certs/localhost-key.pem")),
      cert: fs.readFileSync(path.join(__dirname, "../certs/localhost.pem")),
    },
    logger: false,
  });

  app.register(swagger, {
    openapi: {
      info: {
        title: "Job Board API",
        description: "Job Board API",
        version: "1.0.0",
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
    },
  });

  app.register(swaggerUi, {
    routePrefix: "/docs",
  });

  app.register(cookie, {
    secret: process.env.COOKIE_SECRET!,
    hook: "onRequest",
  });

  app.register(securityPlugin);

  app.register(fastifyStatic, {
    root: path.join(__dirname, "../public"),
  });
  app.register(auth0Plugin);
  app.register(appRoutes, { prefix: "/api" });

  app.setErrorHandler((error: FastifyError, _, reply) => {
    // Zod validation error
    if (error instanceof ZodError) {
      return reply.status(400).send({
        success: false,
        message: error.issues,
      });
    }

    // Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return reply.status(409).send({
          success: false,
          message: "Already exists",
        });
      }
      if (error.code === "P2025") {
        return reply.status(404).send({
          success: false,
          message: "Not found",
        });
      }

      if (error.message.includes("Your company is not approved yet")) {
        return reply.status(403).send({
          success: false,
          message: "Your company is not approved yet",
        });
      }
    }

    // Auth0 / JWT errors

    if (error.message === "Unauthorized" || error.statusCode === 401) {
      return reply.status(401).send({
        success: false,
        message: "Unauthorized",
      });
    }

    if (
      error.message.includes("User already exists") ||
      error.message.includes("Already exists")
    ) {
      return reply.status(409).send({
        success: false,
        message: "User already exists",
      });
    }

    if (
      error.message.includes("invalid signature") ||
      error.message.includes("jwt expired") ||
      error.message.includes("invalid token")
    ) {
      return reply.status(401).send({
        success: false,
        message: "Invalid or expired token",
      });
    }

    //Axios error

    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 400;
      const message = error.response?.data?.message ?? "External service error";
      return reply.status(status).send({
        success: false,
        message,
      });
    }

    //Unknown error
    app.log.error(error);
    console.log(error);

    return reply.status(error.statusCode || 500).send({
      success: false,
      message: error.message,
    });
  });

  return app;
}
