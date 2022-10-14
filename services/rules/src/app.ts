import express from "express";
import * as BodyParser from "body-parser";
import type { App, Config } from "./types";
import { RulesService, EvaluationService } from "./services";
import { routes } from "./routes";
import { RulesHandler } from "./handlers";

export function App(config: Config): App {
  const router = express();
  router.use(BodyParser.json());

  const rulesService = RulesService();
  const evaluationService = EvaluationService();

  const rulesHandler = RulesHandler(rulesService, evaluationService);

  const app = {
    router,
    rulesHandler,
  };

  routes(app);

  return app;
}
