import express from "express";
import * as BodyParser from "body-parser";
import { createClient } from "./graphql";
import type { App, Config } from "./types";
import { RulesService, EvaluationService } from "./services";
import { routes } from "./routes";
import { RulesHandler } from "./handlers";
import { RulesEngine, MatchParser } from "./rules-engine";

export function App(config: Config): App {
  const router = express();
  router.use(BodyParser.json());

  const rulesService = RulesService({
    urqlClient: createClient(config.graphqlServiceUrl),
  });

  const evaluationService = EvaluationService({
    engine: RulesEngine(MatchParser()),
  });

  const app = {
    router,
    rulesHandler: RulesHandler({
      rulesService,
      evaluationService,
    }),
  };

  routes(app);

  return app;
}
