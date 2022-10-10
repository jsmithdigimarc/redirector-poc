import type { Express } from "express";
import type { RedirectionsHandler } from "./handlers";

export type Config = {
  port: number;
  graphileBaseUrl: string;
  graphileApiToken: string;
  actionsServiceUrl: string;
  rulesEngineServiceUrl: string;
};

export type App = {
  router: Express;
  redirectionsHandler: RedirectionsHandler;
};

export type Action = {};

export type Redirection = {
  accountId: string;
  productId: string;
  thngId: string;
  shortId: string;
  defaultRedirectUrl: string;
  shortDomain: string;
};

export type Rule = {
  match: string;
  name: string;
  weight: number;
  redirectUrl: string;
  delegates?: Rule[];
};

export type Thng = {
  id: string;
  identifiers: { [key: string]: string };
  location: string;
  name: string;
  productId: string;
  scope: string[];
  tags: string[];
  updatedAt: Date;
  activatedAt: Date;
  createdAt: Date;
  customFields: { [key: string]: string };
  description: string;
  properties: { [key: string]: string };
};

export type Product = {
  id: string;
  identifiers: { [key: string]: string };
  primaryIdentifier: string;
  name: string;
  scope: string[];
  tags: string[];
  updatedAt: Date;
  createdAt: Date;
  customFields: { [key: string]: string };
  description: string;
  properties: { [key: string]: string };
};

export type EvrythngObject = Thng | Product;
