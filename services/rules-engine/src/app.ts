import express from "express";
import * as BodyParser from "body-parser";
import type { App } from "./types";
import { RulesHandler } from "./handlers";
import { RulesService } from "./services";
import { routes } from "./routes";

export function App(): App {
  const router = express();
  router.use(BodyParser.json());

  const rulesService = RulesService();
  const rulesHandler = RulesHandler(rulesService);

  const app = {
    router,
    rulesHandler,
  };

  routes(app);

  return app;
}
