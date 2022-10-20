import type { Client as UrqlClient } from "@urql/core";
import type { EvrythngType, Redirect, RedirectMeta } from "../../../types";
import { CREATE_REDIRECT } from "./mutations";
import { GET_PRODUCT_AND_RULES, GET_THNG_AND_RULES } from "./queries";

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
        const query = {
          PRODUCT: GET_PRODUCT_AND_RULES,
          THNG: GET_THNG_AND_RULES,
        }[evrythngType];

        const result = await urqlClient
          .query(query, {
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
              product: result.data?.productById,
              rules: result.data?.allRules.nodes,
            };
          case "THNG":
            return {
              evrythngType,
              thng: {
                ...result.data?.thngById,
                product: result.data?.thngById.productByProductId,
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
