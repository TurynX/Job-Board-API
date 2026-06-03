import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),

  COOKIE_SECRET: z.string().min(32),
  FRONTEND_URL: z.string().url(),

  AUTH0_DOMAIN: z.string(),
  AUTH0_CLIENT_ID: z.string(),
  AUTH0_CLIENT_SECRET: z.string(),
  AUTH0_AUDIENCE: z.string(),
  AUTH0_M2M_CLIENT_ID: z.string(),
  AUTH0_M2M_CLIENT_SECRET: z.string(),
  AUTH0_MANAGEMENT_AUDIENCE: z.string(),
});

export const env = envSchema.parse(process.env);
