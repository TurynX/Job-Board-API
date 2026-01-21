import fastify from "fastify";
import { appRoutes } from "./routes/route";
import {fastifyStatic} from "@fastify/static"
import path from "path";
const app = fastify();

app.register(fastifyStatic, {
    root: path.join(__dirname, "../public"),
});

app.register(appRoutes, { prefix: "/api" });

app.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error(err);
  }
  console.log(`Server is running on ${address}`);
});
