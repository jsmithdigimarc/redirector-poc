import express from "express";
import * as BodyParser from "body-parser";
import type { App } from "./types";
import { RedirectionsHandler } from "./handlers";
import { RedirectionsService } from "./services";
import { routes } from "./routes";

export function App(): App {
  const router = express();
  router.use(BodyParser.json());

  const redirectionsService = RedirectionsService();
  const redirectionsHandler = RedirectionsHandler(redirectionsService);

  const app = {
    router,
    redirectionsHandler,
  };

  routes(app);

  return app;
}
