import type { Client as UrqlClient } from "@urql/core";
import type { EvrythngType, Redirect, RedirectMeta } from "../../../types";
import { CREATE_REDIRECT } from "./mutations";
import { GET_REDIRECT_META } from "./queries";

export interface Client {
  queries: {
    readRedirectMeta(
      evrythngType: EvrythngType,
      evrythngId: string
    ): Promise<RedirectMeta>;
  };
  mutations: {
    createRedirect(redirect: Redirect): Promise<Redirect>;
    updateRedirect(redirect: Redirect): Promise<void>;
    deleteRedirect(id: string): Promise<void>;
  };
}

export function Client(urqlClient: UrqlClient): Client {
  return {
    queries: {
      async readRedirectMeta(evrythngType, evrythngId) {
        const result = await urqlClient
          .query(GET_REDIRECT_META, {
            evrythngId,
          })
          .toPromise();

        if (result.error) {
          throw new Error(result.error.toString());
        }

        switch (evrythngType) {
          case "PRODUCT":
            return {
              evrythngType,
              product: {
                ...result.data?.productById,
                // customFields is stored as JSON in postgres and returned as
                // a JSON string from postgraphile
                customFields: JSON.parse(
                  result.data?.productById?.customFields
                ),
              },
              rules: result.data?.allRules.nodes,
            };
          case "THNG":
            return {
              evrythngType,
              thng: {
                ...result.data?.thngById,
                // customFields is stored as JSON in postgres and returned as
                // a JSON string from postgraphile
                customFields: JSON.parse(result.data?.thngById?.customFields),
              },
              rules: result.data?.allRules.nodes,
            };
        }
      },
    },
    mutations: {
      async createRedirect(redirect) {
        const result = await urqlClient
          .mutation(CREATE_REDIRECT, {
            input: {
              redirect,
            },
          })
          .toPromise();

        if (result.error) {
          throw new Error(result.error.toString());
        }

        return result.data?.createRedirect;
      },
      updateRedirect(redirect) {
        throw new Error("Not implemented!");
      },
      deleteRedirect(id) {
        throw new Error("Not implemented!");
      },
    },
  };
}
