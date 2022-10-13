import express from "express";
import * as BodyParser from "body-parser";
import type { App, Config } from "./types";
import { RedirectionsHandler } from "./handlers";
import { RedirectionsService } from "./services";
import { routes } from "./routes";
import { EvrythngClient } from "./clients/evrythng-client";
import { ActionsClient } from "./clients/actions-client";
import { RulesClient } from "./clients/rules-client";

export function App(config: Config): App {
  const router = express();
  router.use(BodyParser.json());

  const evrythngClient = EvrythngClient(config.graphqlServiceUrl);
  const actionsClient = ActionsClient(config.actionsServiceUrl);
  const rulesClient = RulesClient(config.rulesServiceUrl);

  const redirectionsService = RedirectionsService(
    evrythngClient,
    actionsClient,
    rulesClient
  );
  const redirectionsHandler = RedirectionsHandler(redirectionsService);

  const app = {
    router,
    redirectionsHandler,
  };

  routes(app);

  return app;
}
