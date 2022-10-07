import type { Express } from "express";
import type { ActionsHandler } from "./handlers/actions-handler";

export type App = {
  router: Express;
  actionsHandler: ActionsHandler;
};

export type Action = {}