import type { Express } from "express";
import type { RulesHandler } from "./handlers/rules-handler";

export type Config = {
  port: number;
};

export type App = {
  router: Express;
  rulesHandler: RulesHandler;
};

export type Rule = {
  match: string;
  weight: number;
};
