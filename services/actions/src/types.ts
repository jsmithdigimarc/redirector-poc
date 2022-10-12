import type { Express } from "express";
import type { ActionsHandler } from "./handlers";

export type Config = {
  port: number
  graphqlServiceUrl: string;
};

export type App = {
  router: Express;
  actionsHandler: ActionsHandler;
};


export type Action = {
  id: string;
  thngId: string;
  productId: string;
  type: string;
};
