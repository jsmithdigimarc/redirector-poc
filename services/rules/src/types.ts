import type { Express } from "express";
import { RulesHandler } from "./handlers";
import type { EvaluationService, RulesService } from "./services";

export type Config = {
  port: number;
};

export type App = {
  router: Express;
  rulesHandler: RulesHandler;
};

// This type will become a discriminated union using `type` as the discriminator
// once more rule types are needed / created.
export type Rule =
  | {
      type: "";
      match: string;
      weight: number;
      meta: {};
    }
  | {
      type: "redirector";
      match: string;
      weight: number;
      meta: {
        redirectUrl: string;
      };
    };
