import express from "express";
import * as BodyParser from "body-parser";
import { createClient } from "@urql/core";
import type { App, Config } from "./types";
import { RedirectHandler } from "./handlers";
import { RedirectService } from "./services";
import { routes } from "./routes";
import { ActionsClient } from "./clients/actions-client";
import { RulesClient } from "./clients/rules-client";

export function App(config: Config): App {
  const router = express();
  router.use(BodyParser.json());

  const urqlClient = createClient({
    url: config.graphqlServiceUrl,
  });
  const actionsClient = ActionsClient(config.actionsServiceUrl);
  const rulesClient = RulesClient(config.rulesServiceUrl);

  const redirectService = RedirectService(
    urqlClient,
    rulesClient,
    actionsClient
  );
  const redirectHandler = RedirectHandler(redirectService);

  const app = {
    router,
    redirectHandler,
  };

  routes(app);

  return app;
}
