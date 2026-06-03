import fp from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";
import jwksRsa from "jwks-rsa";
import type { VerifyOptions } from "jsonwebtoken";
import { FastifyRequest } from "fastify";

export default fp(async (app) => {
  const client = jwksRsa({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
  });

  app.register(fastifyJwt, {
    decode: { complete: true },
    secret: async (request: FastifyRequest, token: any) => {
      const { header } = token;
      const key = await client.getSigningKey(header.kid);
      return key.getPublicKey();
    },
    verify: {
      audience: process.env.AUTH0_AUDIENCE,
      issuer: `https://${process.env.AUTH0_DOMAIN}/`,
    } as VerifyOptions,
  });
});
