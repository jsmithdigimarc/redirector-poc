import express from "express";
import * as BodyParser from "body-parser";
import type { App, Config } from "./types";
import { RedirectHandler } from "./handlers";
import { RedirectService } from "./services";
import { routes } from "./routes";
import { ActionsClient } from "./clients/actions-client";
import { RulesClient } from "./clients/rules-client";
import { ClientFactory } from "./graphql";

export function App(config: Config): App {
  const router = express();

  router.use(BodyParser.json());

  const redirectService = RedirectService({
    graphqlClientFactory: ClientFactory(config.graphqlServiceUrl),
    rulesClient: RulesClient(config.rulesServiceUrl),
    actionsClient: ActionsClient(config.actionsServiceUrl),
  });

  const redirectHandler = RedirectHandler(redirectService);

  const app = {
    router,
    redirectHandler,
  };

  routes(app);

  return app;
}
