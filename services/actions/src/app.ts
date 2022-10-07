import express from "express";
import * as BodyParser from "body-parser";
import type { App } from "./types";
import { ActionsHandler } from "./handlers";
import { ActionsService } from "./services";
import { routes } from "./routes";

export function App(): App {
  const router = express();
  router.use(BodyParser.json());

  const actionsService = ActionsService();
  const actionsHandler = ActionsHandler(actionsService);

  const app = {
    router,
    actionsHandler,
  };

  routes(app);

  return app;
}
