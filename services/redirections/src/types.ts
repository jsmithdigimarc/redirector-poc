import type { Express } from "express";
import type { RedirectionsHandler } from "./handlers/redirections-handler";

export type App = {
  router: Express;
  redirectionsHandler: RedirectionsHandler;
};

export type Action = {}