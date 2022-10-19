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

export type EvrythngType = "PRODUCT" | "THNG";

/**
 * Action represents a discriminated union of potential Actions we can create.
 * The type property is used as the discriminator. Currently, the only action
 * supported is scan.
 */
export type Action =
  | {
  id?: string;
  evrythngType: EvrythngType
  evrythngId: string;
  type: "scan";
}

export type Redirect = {
  id: string;
  shortCode: string;
  shortDomain: string;
  defaultRedirectUrl: string;
  evrythngId: string;
  evrythngType: EvrythngType
};

export type Rule = {
  id: number;
  match: string;
  name: string;
  // Weight is a number, but postgraphile is returning it as a string
  weight: string;
  type: "REDIRECTOR";
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

