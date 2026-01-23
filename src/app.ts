import fastify from "fastify";
import { appRoutes } from "./routes/route";
import {fastifyStatic} from "@fastify/static"
import path from "path";

export function buildApp() {
    const app = fastify();

    app.register(fastifyStatic, {
        root: path.join(__dirname, "../public"),
    });

    app.register(appRoutes, { prefix: "/api" });

    return app;
}
  