import type { Product, Redirection, Rule, Thng } from "../types";

type RedirectMeta = {
  rules: Rule[];
  thng: Thng | null;
  product: Product | null;
};

export interface EvrythngClient {
  getRedirection(shortUrl: string): Promise<Redirection | null>;

  getRedirectMeta(
    accountId: string,
    evrythngId: string
  ): Promise<RedirectMeta | null>;
}

export function EvrythngClient(base: string, token: string): EvrythngClient {
  async function getRedirection(shortUrl: string): Promise<Redirection | null> {
    const query = `query getRedirection {
          redirection(shortId: "${shortUrl}") {
            productId
            thngId
            defaultRedirectUrl
            shortDomain
            shortId
          }
        }`;

    const response = await fetch(base, {
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ operationName: "getRedirection", query }),
      method: "POST",
      mode: "cors",
    });

    if (response.status != 200) {
      const errors = await response.json();
      console.log(errors);
      throw new Error("failed to get redirect meta");
    }

    const result = await response.json();
    return <Redirection | null>result.data.redirection;
  }

  async function getRedirectMeta(
    accountId: string,
    evrythngId: string
  ): Promise<RedirectMeta | null> {
    const query = `query getRedirectMeta {
          thng(id: "${evrythngId}") {
            id
            name
            location
            customFields
            description
            customFields
            tags
            properties
          }
          product(id: "${evrythngId}") {
            id
            name
            brand
            customFields
            tags
            description
            properties
          }
        }`;

    const response = await fetch(base, {
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ operationName: "getRedirectMeta", query }),
      method: "POST",
      mode: "cors",
    });

    if (response.status != 200) {
      const errors = await response.json();
      console.log(errors);
      throw new Error("failed to get redirect meta");
    }

    const result = await response.json();

    // Rules aren't returned from GraphQL currently. I am hardcoding them for the purposes of the POC.
    result.data.rules = [
      {
        name: "",
        match: "",
        weight: 0.1,
        redirectUrl: `https://www.google.com?q=Wow%20so%20neat`,
      },
    ];

    return <RedirectMeta>result.data;
  }

  return {
    getRedirection,
    getRedirectMeta,
  };
}
