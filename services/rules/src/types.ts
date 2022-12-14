import type { Express } from "express";
import { RulesHandler } from "./handlers";

export type Config = {
  port: number;
  graphqlServiceUrl: string;
};

export type App = {
  router: Express;
  rulesHandler: RulesHandler;
};

// This type will become a discriminated union using `type` as the discriminator
// once more rule types are needed / created.
export type Rule = {
  id: number;
  match: string;
  name: string;
  weight: number;
  type: "redirector";
  meta: {
    redirectUrl: string;
  };
};
