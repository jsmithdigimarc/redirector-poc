import type { Express } from "express";
import type { RedirectHandler } from "./handlers";

export type Config = {
  port: number;
  actionsServiceUrl: string;
  rulesServiceUrl: string;
  graphqlServiceUrl: string;
};

export type App = {
  router: Express;
  redirectHandler: RedirectHandler;
};

export type Action =
  | {
      id?: string;
      productId: string;
      type: "scan";
    }
  | {
      id?: string;
      thngId: string;
      type: "scan";
    };

export type Redirect = {
  id: string;
  shortCode: string;
  shortDomain: string;
  defaultRedirectUrl: string;
  evrythngId: string;
  evrythngType: "product" | "thng";
};

export type Rule = {
  id: number;
  match: string;
  name: string;
  weight: number;
  type: "redirector";
  meta: string;
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

export type RedirectMeta = {
  thng: Thng | null;
  product: Product | null;
  action: Action | null;
};

export type EvrythngObject = Thng | Product;
